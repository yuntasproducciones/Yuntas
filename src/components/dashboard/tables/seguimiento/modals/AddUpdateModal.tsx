/**
 * @file AddUpdateModal.tsx
 * @description Modal responsive para añadir o editar clientes.
 */

import useClienteForm from "../../../../../hooks/Seguimiento/useClientesForm";
import type Cliente from "../../../../../models/clients";

interface AddDataModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cliente: Cliente | null;
  onRefetch: () => void;
}

const AddUpdateDataModal = ({
  isOpen,
  setIsOpen,
  cliente,
  onRefetch,
}: AddDataModalProps) => {
  const { formData, handleChange, handleSubmit } = useClienteForm(
    cliente,
    () => {
      onRefetch();
      setIsOpen(false);
    }
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-4">
      <div
        style={{ backgroundColor: "#528FC2" }}
        className="text-white px-6 py-6 sm:px-10 sm:py-8 rounded-2xl w-full max-w-lg sm:max-w-2xl"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
          {cliente ? "EDITAR CLIENTE" : "AÑADIR CLIENTE"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm mb-1">Nombres</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Teléfono</label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black text-sm sm:text-base"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Gmail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Producto ID</label>
            <input
              type="text"
              name="producto_id"
              value={formData.producto_id ?? ""}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Fecha</label>
            <input
              type="text"
              name="fecha"
              value={formData.created_at}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mt-6 sm:col-span-2">
            <button
              type="submit"
              style={{ backgroundColor: "#98D8DF" }}
              className="flex-1 sm:flex-none px-6 py-2 rounded-full text-base text-white hover:opacity-90 transition"
            >
              {cliente ? "Guardar cambios" : "Añadir cliente"}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="flex-1 sm:flex-none px-6 py-2 bg-gray-400 rounded-full text-base hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUpdateDataModal;