import React, { type ReactNode } from 'react'

interface Props {
    children: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    title?: string
  }
  
const Modal = ({children, isOpen, onClose, title}: Props) => {
  if (!isOpen) return null;
  return (
    <div className="relative inset-0 bg-opacity-50 z-50">
      <div className="flex items-center justify-center fixed inset-0  bg-black/50 ">
      <div className="relative bg-blue-950 text-white px-10 py-8 rounded-xl w-3/5">
      <button
          onClick={onClose}
          className="absolute top-4 right-7 text-white cursor-pointer text-2xl"
        >
          ✕
        </button>
        {title && (<h2 className="text-2xl font-bold mb-4">{title}</h2>)}
        {children}
      </div>
       
        
      </div>
    </div>
  )
}

export default Modal