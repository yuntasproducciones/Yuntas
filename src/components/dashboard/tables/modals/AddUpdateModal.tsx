/**
 * @file AddUpdateModal.tsx
 * @description Modal reutilizable para añadir o editar clientes con soporte responsive.
 */

import useClienteForm from "../../../../hooks/admin/seguimiento/useClienteForm";
import type Cliente from "../../../../models/clients";

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
  const { formData, handleChange, handleSubmit } = useClienteForm(cliente, () => {
    onRefetch();
    setIsOpen(false);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-teal-600 text-white px-6 py-6 rounded-2xl w-[95%] sm:w-4/5 md:w-3/5 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          {cliente ? "EDITAR CLIENTE" : "AÑADIR CLIENTE"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-12"
        >
          {/* Campo: Nombre */}
          <div>
            <label className="block">Nombres</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black"
            />
          </div>

          {/* Campo: Teléfono */}
          <div>
            <label className="block">Teléfono</label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black"
            />
          </div>

          {/* Campo: Gmail */}
          <div className="md:col-span-2">
            <label className="block">Gmail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white outline-none p-2 rounded-md text-black"
            />
          </div>
          
          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2 mt-6 md:col-span-2">
            <button
              type="submit"
              className="admin-act-btn bg-teal-400 px-6 py-2 rounded-full text-lg text-white hover:opacity-90 transition"
            >
              {cliente ? "Guardar cambios" : "Añadir cliente"}
            </button>

            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="cancel-btn bg-gray-400 px-6 py-2 rounded-full text-lg hover:bg-gray-500"
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
