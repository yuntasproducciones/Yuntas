import { FaTrash, FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import type { User } from "../../../models/User";
import AddUserModal from "./modals/AddUserModal";

export default function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const obtenerUsuarios = async () => {
    const token = localStorage.getItem("token");
    const respuesta = await fetch("https://apiyuntas.yuntaspublicidad.com/api/v1/users", {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await respuesta.json();
    setUsers(data.data || []);
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
      cancelButtonText: "Cancelar"
    });
    if (!confirm.isConfirmed) return;
    try {
      const response = await fetch(`https://apiyuntas.yuntaspublicidad.com/api/v1/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
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
    <div>
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-xl mb-4 font-semibold hover:bg-blue-700 transition"
        onClick={() => setShowAddModal(true)}
      >
        Agregar usuario
      </button>
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
      <table className="w-full border-separate border-spacing-2">
        <thead>
          <tr className="bg-blue-950 text-white">
            <th className="px-4 py-2 rounded-xl">ID</th>
            <th className="px-4 py-2 rounded-xl">Nombre</th>
            <th className="px-4 py-2 rounded-xl">Email</th>
            <th className="px-4 py-2 rounded-xl">Acción</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`text-center ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-300"}`}
            >
              <td className="p-2 font-bold rounded-xl">{user.id}</td>
              <td className="p-2 font-bold rounded-xl">{user.name}</td>
              <td className="p-2 font-bold rounded-xl">{user.email}</td>
              <td className="p-2 rounded-xl">
                <div className="flex justify-center gap-5 rounded-xl">
                  <button
                    className="text-green-600 hover:text-green-800 transition cursor-pointer"
                    title="Editar"
                    onClick={() => setEditUser(user)}
                  >
                    <FaRegEdit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 transition cursor-pointer"
                    title="Eliminar"
                    onClick={() => eliminarUsuario(user.id)}
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
