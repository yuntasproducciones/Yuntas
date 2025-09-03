import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddDataModal from "./modals/AddUpdateModal.tsx";
import DeleteClienteModal from "./modals/DeleteModal.tsx";
import useClientes from "../../../../hooks/Seguimiento/useClientes.ts";
import Paginator from "../../Paginator.tsx";
import TableContainer from "../TableContainer.tsx";

const DataTable = () => {
  // Estado para forzar la recarga de datos
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);

  // Hook para obtener la lista de clientes
  const { clientes, totalPages, loading, error } = useClientes(
    refetchTrigger,
    currentPage
  );

  // Estado del modal de agregar/editar cliente
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cliente seleccionado para edición
  const [selectedCliente, setSelectedCliente] = useState<any>(null);

  // Estado del modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // ID del cliente a eliminar
  const [clienteIdToDelete, setClienteIdToDelete] = useState<number | null>(null);

  /**
   * Manejo de errores en la solicitud y carga.
   */
  if (loading)
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  /**
   * Función para forzar la recarga de datos.
   */
  const handleRefetch = () => setRefetchTrigger((prev) => !prev);

  /**
   * Función para abrir el modal de edición de cliente.
   */
  const openModalForEdit = (cliente: any) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  /**
   * Función para abrir el modal de creación de cliente.
   */
  const openModalForCreate = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  /**
   * Función para abrir el modal de eliminación de cliente.
   */
  const openDeleteModal = (id: number) => {
    setClienteIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  /**
   * Función para manejar el éxito al guardar/editar un cliente.
   */
  const handleClienteFormSuccess = () => {
    handleRefetch();
    setIsModalOpen(false);
  };

  return (
    <div className="overflow-x-auto p-4">
      {/* Tabla contenedor con estilos */}
      <TableContainer tableType="seguimiento">
        {/* Cabecera visible solo en pantallas medianas en adelante */}
        <thead className="hidden md:table-header-group">
          <tr>
            {["ID", "Nombre", "Gmail", "Teléfono", "Producto", "Fecha", "Acción"].map((header) => (
              <th
                key={header}
                className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Si no hay clientes mostramos mensaje */}
          {clientes.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No hay clientes disponibles.
              </td>
            </tr>
          ) : (
            clientes.map((item, index) => {
              const rowBg = index % 2 === 0 ? "bg-[#d9d9d9]" : "bg-[#d9d9d94d]";

              return (
                <tr
                  key={item.id}
                  className={`text-center md:table-row block md:mb-0 mb-4 rounded-lg shadow-sm ${rowBg}`}
                >
                  {/* Cada celda lleva un data-label para móviles */}
                  <td data-label="ID" className="px-4 py-2 font-bold border border-gray-300 block md:table-cell">
                    {item.id}
                  </td>
                  <td data-label="Nombre" className="px-4 py-2 font-bold border border-gray-300 block md:table-cell">
                    {item.name}
                  </td>
                  <td data-label="Gmail" className="px-4 py-2 border border-gray-300 block md:table-cell">
                    {item.email}
                  </td>
                  <td data-label="Teléfono" className="px-4 py-2 font-bold border border-gray-300 block md:table-cell">
                    {item.celular}
                  </td>
                  <td data-label="Producto" className="px-4 py-2 font-bold border border-gray-300 block md:table-cell">
                    {item.nombre_producto || "N/A"}
                  </td>

                  <td data-label="Fecha" className="px-4 py-2 font-bold border border-gray-300 block md:table-cell">
                    {item.created_at}
                  </td>
                  <td
                    data-label="Acción"
                    className="px-4 py-2 border border-gray-300 block md:table-cell"
                  >
                    <div className="flex flex-col md:flex-row justify-center gap-2 rounded-xl p-1">
                      <button
                        className="p-2 text-red-600 hover:text-red-800 transition"
                        title="Eliminar"
                        onClick={() => openDeleteModal(item.id)}
                      >
                        <FaTrash size={18} />
                      </button>
                      <button
                        className="p-2 text-green-600 hover:text-green-800 transition"
                        title="Editar"
                        onClick={() => openModalForEdit(item)}
                      >
                        <FaEdit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </TableContainer>

      {/* Botón para agregar un cliente nuevo */}
      <button
        className="mt-4 ml-2 p-2 pl-4 bg-blue-900 text-white rounded-lg"
        onClick={openModalForCreate}
      >
        Agregar Cliente
      </button>

      {/* Modal para agregar o editar cliente */}
      <AddDataModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        cliente={selectedCliente}
        onRefetch={handleClienteFormSuccess}
      />

      {/* Modal de eliminación */}
      {clienteIdToDelete !== null && (
        <DeleteClienteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          clienteId={clienteIdToDelete}
          onRefetch={handleRefetch}
        />
      )}

      {/* Paginador */}
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default DataTable;
