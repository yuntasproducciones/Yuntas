import React, { useState } from "react";
import Input from "../../../Input";
import type { User } from "../../../../models/User";

interface AddUserModalProps {
  onClose: () => void;
  onUserAdded: () => void;
  initialData?: User | null;
  isEditing?: boolean;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onUserAdded, initialData, isEditing }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [celular, setCelular] = useState(initialData?.celular || "");
  const [roles, setRoles] = useState(initialData?.roles?.join(", ") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!isEditing && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    try {
      const body: any = {
        name,
        email,
        celular,
        roles: roles.split(",").map(r => r.trim()).filter(Boolean),
      };
      if (isEditing) {
        body._method = "PUT";
        if (password) body.password = password;
      } else {
        body.password = password;
      }
      const response = await fetch(`https://apiyuntas.yuntaspublicidad.com/api/v1/users${isEditing && initialData ? `/${initialData.id}` : ""}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al guardar usuario");
      }
      onUserAdded();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1e293b]/60 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-2xl font-bold mb-6 text-blue-900 border-b-2 border-blue-700 pb-2 w-fit">
          {isEditing ? "Editar Usuario" : "Ingresar Usuario"}
        </h3>
        <form onSubmit={handleSubmit} className="grid max-sm:grid-cols-1 grid-cols-2 gap-5">
          <Input label="Nombre" name="name" value={name} onChange={e => setName(e.target.value)} required className="" />
          <Input label="Email" name="email" value={email} onChange={e => setEmail(e.target.value)} required type="email" className="" />
          <Input label="Celular" name="celular" value={celular} onChange={e => setCelular(e.target.value)} className="" />
          <Input label="Roles (separados por coma)" name="roles" value={roles} onChange={e => setRoles(e.target.value)} required className="" />
          <Input label="Contraseña" name="password" value={password} onChange={e => setPassword(e.target.value)} type="password" className="" required={!isEditing} />
          <Input label="Confirmar contraseña" name="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} type="password" className="" required={!isEditing} />
          {/* Mensaje de error */}
          {error && <div className="col-span-2 text-red-600 text-sm">{error}</div>}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? (isEditing ? "Guardando..." : "Agregando...") : isEditing ? "Guardar cambios" : "Agregar usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
