import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import AddDataModal from "./modals/AddUpdateModal.tsx";
import DeleteClienteModal from "./modals/DeleteModal.tsx";
import useClientes from "../../../../hooks/Seguimiento/useClientes.ts";
import Paginator from "../../Paginator.tsx";
import TableContainer from "../TableContainer.tsx";

const DataTable = () => {
  const [refetchTrigger, setRefetchTrigger] = useState(false); // Estado para forzar la recarga de datos
  const [currentPage, setCurrentPage] = useState(1); // Estado para manejar la página actual
  const { clientes, totalPages, loading, error } = useClientes(
    refetchTrigger,
    currentPage
  ); // Hook para obtener la lista de clientes
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar la apertura y cierre del modal
  const [selectedCliente, setSelectedCliente] = useState<any>(null); // Estado para manejar el cliente seleccionado
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para manejar la apertura y cierre del modal de eliminación
  const [clienteIdToDelete, setClienteIdToDelete] = useState<number | null>(
    null
  ); // Estado para manejar el ID del cliente a eliminar

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
   * Función para abrir el modal de creacion de cliente.
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
   * Función para manejar el cierre del modal de eliminación.
   */
  const handleClienteFormSuccess = () => {
    handleRefetch(); // Recarga la lista de clientes
    setIsModalOpen(false); // Cierra el modal después de añadir o editar un cliente
  };

  return (
    <div className="overflow-x-auto p-4">

    <TableContainer tableType="seguimiento">
      <thead>
        <tr>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >ID</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
          >Nombre</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Gmail</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Teléfono</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Sección</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Fecha</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Acción</th>
        </tr>
      </thead>
   <tbody>
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
        <tr key={item.id} className={`text-center ${rowBg}`}>
          <td className="px-4 py-2 font-bold rounded-xl border border-gray-300">
            {item.id}
          </td>
          <td className="px-4 py-2 font-bold rounded-xl border border-gray-300">
            {item.name}
          </td>
          <td className="px-4 py-2 rounded-xl border border-gray-300">
            {item.email}
          </td>
          <td className="px-4 py-2 font-bold rounded-xl border border-gray-300">
            {item.celular}
          </td>
          <td className="px-4 py-2 font-bold rounded-xl border border-gray-300">
            {item.seccion || "N/A"}
          </td>
          <td className="px-4 py-2 font-bold rounded-xl border border-gray-300">
            {item.created_at}
          </td>
          <td className="px-4 py-2 rounded-xl border border-gray-300">
            <div className="flex justify-center gap-2 rounded-xl p-1">
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
                <GrUpdate size={18} />
              </button>
            </div>
          </td>
        </tr>
      );
    })
  )}
</tbody>

    </TableContainer>
    {
      /**
       * Botón para agregar un nuevo cliente.
       */
      }
      <button
        className="mt-4 ml-2 p-2 pl-4 bg-blue-900 text-white rounded-lg"
        onClick={openModalForCreate}
      >
        Agregar Cliente
      </button>

      {
      /**
       * Modal para agregar o editar un cliente.
       */
      }
      <AddDataModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        cliente={selectedCliente}
        onRefetch={handleClienteFormSuccess}
      />

      {
      /**
       * Modal para eliminar un cliente.
       */
      }
      {clienteIdToDelete !== null && (
        <DeleteClienteModal
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          clienteId={clienteIdToDelete}
          onRefetch={handleRefetch}
        />
      )}

      {
      /**
       * Componente de paginación para navegar entre las páginas de clientes.
       * Se muestra solo si hay más de una página.
       */
      }
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
  </div>
  );
};

export default DataTable;
