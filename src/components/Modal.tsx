import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  form: string;
  btnText: string;
}

const Modal = ({ children, isOpen, onClose, title, form, btnText }: Props) => {
  if (!isOpen) return null;
  return (
    <div className="flex items-center justify-center fixed inset-0  bg-black/40 ">
      <div className="relative bg-white px-3 py-4 rounded-xl max-w-5xl sm:min-w-2xl mx-auto">
        {title && <h2 className="text-2xl font-bold mb-4 pl-3">{title}</h2>}
        <button
          onClick={onClose}
          className="absolute top-4 right-7 cursor-pointer text-2xl bg-white rounded-full"
        >
          ✕
        </button>
        <div className="overflow-y-auto max-h-[700px] px-3">
          
          {children}
        </div>
        <div className="flex">
          <div className="ml-auto space-x-2 mt-4 col-span-2">
            <button
              type="submit"
              form={form}
              className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
            >
              {btnText}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
