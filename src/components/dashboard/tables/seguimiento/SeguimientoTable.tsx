import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
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

  // Estado para controlar qué vista mostrar (seguimiento simplificado o completo)
  const [showSeguimiento, setShowSeguimiento] = useState(false);

  // Hook para obtener la lista de clientes
  const { clientes, totalPages, loading, error } = useClientes(
    refetchTrigger,
    currentPage
  );

  // Estado para manejar las respuestas de WhatsApp y Gmail
  // Inicialmente vacío, se cargará desde clientes con useEffect
  const [respuestaEstado, setRespuestaEstado] = useState<{
    [id: number]: { whatsapp: boolean; gmail: boolean };
  }>({});

  // Estados existentes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clienteIdToDelete, setClienteIdToDelete] = useState<number | null>(
    null
  );

  // NUEVOS ESTADOS PARA MENSAJES Y MONITOREO
  const [isMensajesModalOpen, setIsMensajesModalOpen] = useState(false);
  const [isMonitoreoModalOpen, setIsMonitoreoModalOpen] = useState(false);

  // Al cargar clientes (o cambiar página / refetch), inicializamos el estado de respuesta
  useEffect(() => {
    if (clientes && clientes.length > 0) {
      const nuevosEstados: {
        [id: number]: { whatsapp: boolean; gmail: boolean };
      } = {};

      clientes.forEach((cliente) => {
        // Marcamos como enviados tanto whatsapp como gmail para todos
        nuevosEstados[cliente.id] = {
          whatsapp: true,
          gmail: true,
        };
      });

      setRespuestaEstado(nuevosEstados);
    } else {
      setRespuestaEstado({});
    }
  }, [clientes]);

  // Manejo de errores en la solicitud y carga
  if (loading)
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  // Función para forzar la recarga de datos
  const handleRefetch = () => setRefetchTrigger((prev) => !prev);

  // Función para abrir el modal de edición de cliente
  const openModalForEdit = (cliente: any) => {
    setSelectedCliente(cliente);
    setIsModalOpen(true);
  };

  // Función para abrir el modal de creación de cliente
  const openModalForCreate = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  // Función para cambiar el estado de respuesta (enviado/no enviado)
  const toggleRespuesta = (
    id: number,
    tipo: "whatsapp" | "gmail",
    nuevoEstado: boolean
  ) => {
    setRespuestaEstado((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [tipo]: nuevoEstado,
      },
    }));
  };

  // Función para abrir el modal de eliminación de cliente
  const openDeleteModal = (id: number) => {
    setClienteIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Función para manejar el éxito al guardar/editar un cliente
  const handleClienteFormSuccess = () => {
    handleRefetch();
    setIsModalOpen(false);
  };

  // Función para alternar entre vista completa y seguimiento
  const toggleSeguimiento = () => {
    setShowSeguimiento(!showSeguimiento);
  };

  // NUEVAS FUNCIONES PARA MENSAJES Y MONITOREO
  const handleMensajesClick = () => {
    setIsMensajesModalOpen(true);
  };

  const handleMonitoreoClick = () => {
    setIsMonitoreoModalOpen(true);
  };

  // Renderizar tabla de seguimiento simplificada con nuevo diseño
  const renderSeguimientoTable = () => (
    <TableContainer
      tableType="seguimiento"
      headerContent={
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity"
            onClick={handleMensajesClick}
          >
            MENSAJES
          </button>
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity"
            onClick={toggleSeguimiento}
          >
            SEGUIMIENTO
          </button>
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity"
            onClick={handleMonitoreoClick}
          >
            MONITOREO
          </button>
        </div>
      }
    >
      <thead>
        <tr>
          <th className="px-2 py-2 bg-cyan-400 text-white text-xs font-bold rounded-md w-12">
            ID
          </th>
          <th className="px-4 py-2 bg-cyan-400 text-white text-xs font-bold rounded-md">
            NOMBRE
          </th>
          <th className="px-4 py-2 bg-cyan-400 text-white text-xs font-bold rounded-md">
            WHATSAPP
          </th>
          <th className="px-4 py-2 bg-cyan-400 text-white text-xs font-bold rounded-md">
            RESPUESTA
          </th>
          <th className="px-4 py-2 bg-cyan-400 text-white text-xs font-bold rounded-md">
            GMAIL
          </th>
          <th className="px-4 py-2 bg-cyan-400 text-white text-xs font-bold rounded-md">
            RESPUESTA
          </th>
          <th className="px-4 py-2 bg-cyan-400 text-white text-xs font-bold rounded-md">
            ACCIÓN
          </th>
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
            const rowBg = index % 2 === 0 ? "bg-gray-100" : "bg-white";

            // Por seguridad, si no hay estado, marcamos enviado por defecto
            const estado = respuestaEstado[item.id] || {
              whatsapp: true,
              gmail: true,
            };

            return (
              <tr key={item.id} className={`${rowBg} hover:bg-gray-50`}>
                <td className="px-2 py-3 text-center font-bold text-sm border-r">
                  {item.id}
                </td>
                <td className="px-4 py-3 text-center font-medium text-sm border-r">
                  {item.name || (
                    <div className="bg-gray-300 h-4 rounded animate-pulse font-bold"></div>
                  )}
                </td>

                {/* WHATSAPP */}
                <td className="px-4 py-3 text-center border-r">
                  <span className="text-black px-2 py-1 rounded text-xs font-bold">
                    {estado.whatsapp ? "ENVIADO" : "NO ENVIADO"}
                  </span>
                </td>

                {/* RESPUESTA WHATSAPP */}
                <td className="px-4 py-3 text-center border-r">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      className={`w-10 h-10 flex justify-center items-center rounded-full transition-colors ${
                        !estado.whatsapp
                          ? "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                          : "bg-gray-200 cursor-not-allowed opacity-50"
                      }`}
                      onClick={() =>
                        toggleRespuesta(item.id, "whatsapp", false)
                      }
                      title="Marcar como no enviado"
                      aria-label="Marcar como no enviado"
                      disabled={estado.whatsapp === false}
                    >
                      <FaTimes size={20} />
                    </button>
                    <button
                      className={`w-10 h-10 flex justify-center items-center rounded-full transition-colors ${
                        estado.whatsapp
                          ? "bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
                          : "bg-gray-200 cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => toggleRespuesta(item.id, "whatsapp", true)}
                      title="Marcar como enviado"
                      aria-label="Marcar como enviado"
                      disabled={estado.whatsapp === true}
                    >
                      <FaCheck size={20} />
                    </button>
                  </div>
                </td>

                {/* GMAIL */}
                <td className="px-4 py-3 text-center border-r">
                  <span className="text-black px-2 py-1 rounded text-xs font-bold">
                    {estado.gmail ? "ENVIADO" : "NO ENVIADO"}
                  </span>
                </td>

                {/* RESPUESTA GMAIL */}
                <td className="px-4 py-3 text-center border-r">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      className={`w-10 h-10 flex justify-center items-center rounded-full transition-colors ${
                        !estado.gmail
                          ? "bg-red-100 text-red-500 hover:bg-red-500 hover:text-white"
                          : "bg-gray-200 cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => toggleRespuesta(item.id, "gmail", false)}
                      title="Marcar como no enviado"
                      aria-label="Marcar como no enviado"
                      disabled={estado.gmail === false}
                    >
                      <FaTimes size={20} />
                    </button>
                    <button
                      className={`w-10 h-10 flex justify-center items-center rounded-full transition-colors ${
                        estado.gmail
                          ? "bg-green-100 text-green-500 hover:bg-green-500 hover:text-white"
                          : "bg-gray-200 cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => toggleRespuesta(item.id, "gmail", true)}
                      title="Marcar como enviado"
                      aria-label="Marcar como enviado"
                      disabled={estado.gmail === true}
                    >
                      <FaCheck size={20} />
                    </button>
                  </div>
                </td>

                {/* ACCIÓN - Botones de editar y eliminar */}
                <td className="px-4 py-3 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <button
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                      title="Eliminar"
                      onClick={() => openDeleteModal(item.id)}
                      aria-label="Eliminar"
                    >
                      <FaTrash size={20} />
                    </button>
                    <button
                      className="w-10 h-10 flex justify-center items-center rounded-full bg-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                      title="Editar"
                      onClick={() => openModalForEdit(item)}
                      aria-label="Editar"
                    >
                      <FaEdit size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </TableContainer>
  );

  // Renderizado de la tabla completa se mantiene igual (puedes modificarlo si quieres)
  const renderCompleteTable = () => (
    <TableContainer
      tableType="seguimiento"
      headerContent={
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity"
            // onClick={handleMensajesClick}
          >
            MENSAJES
          </button>
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity"
            onClick={toggleSeguimiento}
          >
            MEDIO DE SEGUIMIENTO
          </button>
          <button
            className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity"
            //onClick={handleMonitoreoClick}
          >
            MONITOREO
          </button>
        </div>
      }
    >
      <thead className="hidden md:table-header-group">
        <tr>
          {[
            "ID",
            "Nombre",
            "Gmail",
            "Teléfono",
            "Producto",
            "Fecha",
            "Acción",
          ].map((header) => (
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
                <td
                  data-label="ID"
                  className="px-4 py-2 font-bold border border-gray-300 block md:table-cell"
                >
                  {item.id}
                </td>
                <td
                  data-label="Nombre"
                  className="px-4 py-2 font-bold border border-gray-300 block md:table-cell"
                >
                  {item.name}
                </td>
                <td
                  data-label="Gmail"
                  className="px-4 py-2 border border-gray-300 block md:table-cell"
                >
                  {item.email}
                </td>
                <td
                  data-label="Teléfono"
                  className="px-4 py-2 font-bold border border-gray-300 block md:table-cell"
                >
                  {item.celular}
                </td>
                <td
                  data-label="Producto"
                  className="px-4 py-2 font-bold border border-gray-300 block md:table-cell"
                >
                  {item.nombre_producto || "N/A"}
                </td>
                <td
                  data-label="Fecha"
                  className="px-4 py-2 font-bold border border-gray-300 block md:table-cell"
                >
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
  );

  return (
    <div className="overflow-x-auto p-4">
      {/* Renderizar tabla según el estado */}
      {showSeguimiento ? renderSeguimientoTable() : renderCompleteTable()}

      {/* Botón para agregar un cliente nuevo - solo visible en vista completa */}
      {!showSeguimiento && (
        <button
          className="mt-4 ml-2 p-2 pl-4 bg-blue-900 text-white rounded-lg"
          onClick={openModalForCreate}
        >
          Agregar Cliente
        </button>
      )}

      {/* ← MODALES EXISTENTES */}
      <AddDataModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        cliente={selectedCliente}
        onRefetch={handleClienteFormSuccess}
      />

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
