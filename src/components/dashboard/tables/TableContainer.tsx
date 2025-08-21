import { type ReactNode } from "react";
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
  onAddNew
}: TableContainerProps) {
  
  const handleExportCSV = () => {
    if (exportData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    exportToCSV(exportData);
  };

  const handleExportExcel = () => {
    if (exportData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    // Usar la función más simple y compatible
    exportToExcelSimple(exportData);
  };

  const handleExportPDF = () => {
    if (exportData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    exportToPDF(exportData);
  };

  const handlePrint = () => {
    if (exportData.length === 0) {
      alert('No hay datos para imprimir');
      return;
    }
    printTable(exportData);
  };

  const renderHeaderContent = () => {
    if (headerContent) return headerContent;

    switch (tableType) {
      case "seguimiento":
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity">
              MENSAJES
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity">
              MEDIO DE SEGUIMIENTO
            </button>
            <button className="bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity">
              MONITOREO
            </button>
          </div>
        );

      case "blogs":
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

      case "productos":
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