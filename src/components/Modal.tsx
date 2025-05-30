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
    <div className="flex items-center justify-center fixed inset-0  bg-black/40 ">
      <div className="relative bg-white px-4 py-8 rounded-xl max-w-5xl sm:min-w-2xl mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-7 cursor-pointer text-2xl"
        >
          ✕
        </button>
        {title && <h2 className="text-2xl font-bold mb-4 px-6">{title}</h2>}
        <div className="overflow-y-auto max-h-[700px] px-6"> {children}</div>
      </div>
    </div>
  );
};

export default Modal;
