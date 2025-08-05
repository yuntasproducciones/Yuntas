import { type ReactNode } from "react";

interface TableContainerProps {
  children: ReactNode;
  tableType?: "seguimiento" | "blogs" | "productos" | "usuarios"  | "default"; // tipo de tabla
  headerContent?: ReactNode; // opcional: si lo pasas, sobrescribe el dinámico
}

export default function TableContainer({ children, tableType = "default", headerContent }: TableContainerProps) {
  const renderHeaderContent = () => {
    if (headerContent) return headerContent; // prioridad si se pasa directamente

    switch (tableType) {
      case "seguimiento":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
              <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
          MENSAJES
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            MEDIO DE SEGUIMIENTO
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            MONITOREO
          </button>
        
          </div>
        );

      case "blogs":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
                  <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
          PUBLICAR
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            EXPORTAR A CSV
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            EXPORTAR A EXCEL
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            EXPORTAR A PDF
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            IMPRIMIR
          </button> 
          </div>
        );

       case "productos":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
           <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
          PUBLICAR
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            EXPORTAR A CSV
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            EXPORTAR A EXCEL
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            EXPORTAR A PDF
          </button>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            IMPRIMIR
          </button> 
          </div>
        );
        
        case "usuarios":
          return (
            <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
            PUBLICAR
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
              EXPORTAR A CSV
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
              EXPORTAR A EXCEL
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
              EXPORTAR A PDF
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80">
              IMPRIMIR
            </button> 
            </div>
          );

      default:
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-xl">ACCIÓN GENÉRICA</button>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderHeaderContent()}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center border-separate border-spacing-x-2 border-spacing-y-2">
          {children}
        </table>
      </div>
    </div>
  );
}
