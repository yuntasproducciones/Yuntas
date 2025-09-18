import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

const Modal = ({ children, isOpen, onClose, title }: Props) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-y-auto">
      <div className="relative bg-white dark:bg-gray-900 px-5 py-6 rounded-xl max-w-4xl w-full mx-4 my-10 shadow-lg">
        {/* Título */}
        {title && <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h2>}
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-xl"
          aria-label="Cerrar"
        >
          ✕
        </button>

        {/* Contenido con scroll interno si es muy largo */}
        <div className="overflow-y-auto max-h-[75vh] pr-2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
