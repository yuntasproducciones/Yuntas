import { FaTrash, FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { User } from "../../../models/User";
import AddUserModal from "./modals/AddUserModal";
import TableContainer from "./TableContainer";

export default function UsersTable() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const obtenerUsuarios = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const respuesta = await fetch(
        "https://apiyuntas.yuntaspublicidad.com/api/v1/users",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await respuesta.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al cargar los usuarios",
        confirmButtonColor: "#14b8a6",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const eliminarUsuario = async (userId: number) => {
    const token = localStorage.getItem("token");
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el usuario permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;

    try {
      const response = await fetch(
        `https://apiyuntas.yuntaspublicidad.com/api/v1/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al eliminar usuario");
      }

      await obtenerUsuarios();
      Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
      <TableContainer tableType="usuarios">
        <div className="overflow-x-auto">
          <table className="w-full responsive-table">
            <thead>
              <tr>
                <th className="px-4 py-2 bg-cyan-400 dark:bg-cyan-600 text-white uppercase text-xs font-bold rounded-md">
                  ID
                </th>
                <th className="px-4 py-2 bg-cyan-400 dark:bg-cyan-600 text-white uppercase text-xs font-bold rounded-md">
                  Nombre
                </th>
                <th className="px-4 py-2 bg-cyan-400 dark:bg-cyan-600 text-white uppercase text-xs font-bold rounded-md">
                  Email
                </th>
                <th className="px-4 py-2 bg-cyan-400 dark:bg-cyan-600 text-white uppercase text-xs font-bold rounded-md">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-2">
                    <div className="flex justify-center items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                      <span className="text-teal-500 font-medium">
                        Cargando usuarios...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user, index) => {
                  const isEven = index % 2 === 0;
                  const lightBg = isEven ? "bg-gray-100" : "bg-gray-200";
                  const darkBg = isEven ? "dark:bg-gray-800" : "dark:bg-gray-700";
                  const textColor = "text-gray-900 dark:text-gray-100";
                  const cellClass = `px-4 py-2 rounded-md font-bold ${lightBg} ${darkBg} ${textColor}`;

                  return (
                    <tr key={user.id}>
                      <td data-label="ID" className={cellClass}>
                        {user.id}
                      </td>
                      <td data-label="Nombre" className={cellClass}>
                        {user.name}
                      </td>
                      <td data-label="Email" className={cellClass}>
                        {user.email}
                      </td>
                      <td
                        data-label="Acción"
                        className={`px-4 py-2 rounded-md ${lightBg} ${darkBg} ${textColor}`}
                      >
                        <div className="flex justify-center gap-4">
                          <button
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition cursor-pointer"
                            title="Editar"
                            onClick={() => setEditUser(user)}
                          >
                            <FaRegEdit size={18} />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition cursor-pointer"
                            title="Eliminar"
                            onClick={() => eliminarUsuario(user.id)}
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <span className="text-gray-500">
                      No hay usuarios registrados
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TableContainer>

      <div className="mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
          onClick={() => setShowAddModal(true)}
        >
          Agregar usuario
        </button>
      </div>

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onUserAdded={obtenerUsuarios}
        />
      )}
      {editUser && (
        <AddUserModal
          onClose={() => setEditUser(null)}
          onUserAdded={obtenerUsuarios}
          initialData={editUser}
          isEditing={true}
        />
      )}
    </div>
  );
}
