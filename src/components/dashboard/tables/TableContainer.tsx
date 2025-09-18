import { type ReactNode, isValidElement } from "react";
import { exportToCSV, exportToExcelSimple, exportToPDF, printTable } from "../../../utils/exportUtils";

interface TableContainerProps {
  children: ReactNode;
  tableType?: "seguimiento" | "blogs" | "productos" | "usuarios" | "default";
  headerContent?: ReactNode;
  exportData?: any[]; // Datos para exportar
  onAddNew?: () => void; // Función para agregar nuevo elemento
}

export default function TableContainer({
  children,
  tableType = "default",
  headerContent,
  exportData = [],
  onAddNew,
}: TableContainerProps) {
  const handleExportCSV = () => {
    if (exportData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    exportToCSV(exportData);
  };

  const handleExportExcel = () => {
    if (exportData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    exportToExcelSimple(exportData);
  };

  const handleExportPDF = () => {
    if (exportData.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    exportToPDF(exportData);
  };

  const handlePrint = () => {
    if (exportData.length === 0) {
      alert("No hay datos para imprimir");
      return;
    }
    printTable(exportData);
  };

  const renderHeaderContent = () => {
    if (headerContent) return headerContent;

    switch (tableType) {
      case "blogs":
      case "productos":
      case "usuarios":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            {onAddNew && (
              <button
                onClick={onAddNew}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
              >
                PUBLICAR
              </button>
            )}
            <button
              onClick={handleExportCSV}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              EXPORTAR A CSV
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              EXPORTAR A EXCEL
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              EXPORTAR A PDF
            </button>
            <button
              onClick={handlePrint}
              className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors"
            >
              IMPRIMIR
            </button>
          </div>
        );

      default:
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors">
              ACCIÓN GENÉRICA
            </button>
          </div>
        );
    }
  };

  // Separar los nodos hijos entre elementos de tabla y extras
  const tableChildren: ReactNode[] = [];
  const outsideChildren: ReactNode[] = [];

  (Array.isArray(children) ? children : [children]).forEach((child) => {
    if (
      isValidElement(child) &&
      ["thead", "tbody", "tfoot", "tr"].includes((child.type as string) || "")
    ) {
      tableChildren.push(child);
    } else {
      outsideChildren.push(child);
    }
  });

  return (
    <div className="w-full">
      {renderHeaderContent()}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-center border-separate border-spacing-x-2 border-spacing-y-2">
          {tableChildren}
        </table>
      </div>

      {/* Renderizamos cualquier contenido extra fuera de la tabla */}
      {outsideChildren.length > 0 && (
        <div className="mt-2 space-y-2">{outsideChildren}</div>
      )}
    </div>
  );
}
