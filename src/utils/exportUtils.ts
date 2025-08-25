// exportUtils.ts - Funciones de utilidad para exportar datos de blogs

interface Blog {
  id: number;
  producto_id: number;
  nombre_producto: string;
  etiqueta?: {
    meta_titulo: string;
    meta_descripcion: string;
  };
  subtitulo: string;
  imagen_principal: string;
  imagenes?: { ruta_imagen: string; text_alt: string }[];
  parrafos?: { parrafo: string }[];
  created_at?: string;
  updated_at?: string;
}

// Función auxiliar para limpiar texto HTML
const cleanHtmlText = (text: string): string => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
};

// Función auxiliar para formatear fecha
const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
};
// Función alternativa que genera un verdadero archivo Excel usando técnica binaria
export const exportToExcelBinary = (data: any[]) => {
  try {
    if (!data || data.length === 0) {
      alert('❌ No hay datos para exportar');
      return;
    }

    // Crear estructura de datos para Excel
    const worksheetData = [
      // Headers
      ['ID', 'Producto ID', 'Nombre Producto', 'Subtítulo', 'Meta Título', 'Meta Descripción', 'Fecha Creación', 'Párrafos', 'Imágenes'],
      // Data rows
      ...data.map(blog => [
        blog.id || '',
        blog.producto_id || '',
        blog.nombre_producto || '',
        blog.subtitulo || '',
        blog.etiqueta?.meta_titulo || '',
        blog.etiqueta?.meta_descripcion || '',
        blog.created_at ? new Date(blog.created_at).toLocaleDateString('es-ES') : '',
        blog.parrafos?.length || 0,
        blog.imagenes?.length || 0
      ])
    ];

    // Crear XML para Excel
    let xlsxContent = `<?xml version="1.0"?>
      <ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
        <ss:Worksheet ss:Name="Blogs">
          <ss:Table>`;

    // Agregar filas
    worksheetData.forEach((row, rowIndex) => {
      xlsxContent += `<ss:Row>`;
      row.forEach((cell, cellIndex) => {
        const isHeader = rowIndex === 0;
        const cellValue = String(cell || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        if (isHeader) {
          xlsxContent += `<ss:Cell ss:StyleID="HeaderStyle"><ss:Data ss:Type="String">${cellValue}</ss:Data></ss:Cell>`;
        } else {
          // Detectar si es número
          const isNumber = !isNaN(Number(cell)) && cell !== '';
          const dataType = isNumber ? 'Number' : 'String';
          xlsxContent += `<ss:Cell><ss:Data ss:Type="${dataType}">${cellValue}</ss:Data></ss:Cell>`;
        }
      });
      xlsxContent += `</ss:Row>`;
    });

    xlsxContent += `
          </ss:Table>
        </ss:Worksheet>
        <ss:Styles>
          <ss:Style ss:ID="HeaderStyle">
            <ss:Font ss:Bold="1"/>
            <ss:Interior ss:Color="#0ea5e9" ss:Pattern="Solid"/>
          </ss:Style>
        </ss:Styles>
      </ss:Workbook>`;

    // Crear blob
    const blob = new Blob([xlsxContent], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });

    // Descargar archivo
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `blogs_export_${new Date().toISOString().split('T')[0]}.xml`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Excel XML exportado exitosamente');
    alert(`✅ Se exportaron ${data.length} registros a formato Excel XML\n\nEste archivo se puede abrir directamente en Excel sin problemas de formato.`);
  } catch (error) {
    console.error('❌ Error al exportar Excel XML:', error);
    alert('❌ Error al exportar a Excel');
  }
};

// Generar un CSV real para Excel
export const exportToExcelSimple = (data: any[]) => {
  try {
    if (!data || data.length === 0) {
      alert('❌ No hay datos para exportar');
      return;
    }

    // Crear CSV con separador punto y coma
    const headers = ['ID', 'Producto ID', 'Nombre Producto', 'Subtítulo', 'Meta Título', 'Meta Descripción', 'Fecha Creación', 'Párrafos', 'Imágenes'];
    
    const csvRows = [
      headers.join(';'),
      ...data.map(blog => [
        blog.id || '',
        blog.producto_id || '',
        `"${(blog.nombre_producto || '').replace(/"/g, '""')}"`,
        `"${(blog.subtitulo || '').replace(/"/g, '""')}"`,
        `"${(blog.etiqueta?.meta_titulo || '').replace(/"/g, '""')}"`,
        `"${(blog.etiqueta?.meta_descripcion || '').replace(/"/g, '""')}"`,
        blog.created_at ? new Date(blog.created_at).toLocaleDateString('es-ES') : '',
        blog.parrafos?.length || 0,
        blog.imagenes?.length || 0
      ].join(';'))
    ];

    const csvContent = csvRows.join('\n');
    
    // BOM para UTF-8
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `blogs_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ CSV para Excel exportado exitosamente');
    alert(`✅ Se exportaron ${data.length} registros a CSV\n\nEste archivo se abrirá automáticamente en Excel con el formato correcto.`);
  } catch (error) {
    console.error('❌ Error al exportar CSV para Excel:', error);
    alert('❌ Error al exportar');
  }
};
// 1. EXPORTAR A CSV
export const exportToCSV = (data: Blog[]) => {
  try {
    if (!data || data.length === 0) {
      alert('❌ No hay datos para exportar');
      return;
    }

    const headers = [
      'ID',
      'Producto ID',
      'Nombre Producto',
      'Subtítulo',
      'Meta Título',
      'Meta Descripción',
      'Fecha Creación',
      'Fecha Actualización',
      'Número de Párrafos',
      'Número de Imágenes',
      'Primer Párrafo'
    ];

    const csvContent = [
      headers.join(','),
      ...data.map(blog => {
        const primerParrafo = blog.parrafos && blog.parrafos.length > 0 
          ? cleanHtmlText(blog.parrafos[0].parrafo).substring(0, 100) + '...'
          : '';

        return [
          blog.id,
          blog.producto_id || '',
          `"${(blog.nombre_producto || '').replace(/"/g, '""')}"`,
          `"${(blog.subtitulo || '').replace(/"/g, '""')}"`,
          `"${(blog.etiqueta?.meta_titulo || '').replace(/"/g, '""')}"`,
          `"${(blog.etiqueta?.meta_descripcion || '').replace(/"/g, '""')}"`,
          formatDate(blog.created_at),
          formatDate(blog.updated_at),
          blog.parrafos?.length || 0,
          blog.imagenes?.length || 0,
          `"${primerParrafo.replace(/"/g, '""')}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `blogs_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ CSV exportado exitosamente');
    alert(`✅ Se exportaron ${data.length} registros a CSV`);
  } catch (error) {
    console.error('❌ Error al exportar CSV:', error);
    alert('❌ Error al exportar a CSV');
  }
};

// ALTERNATIVA: Exportar usando SheetJS
export const exportToExcelAdvanced = (data: Blog[]) => {
  try {
    // Verificar si SheetJS está disponible
    // @ts-ignore
    if (typeof XLSX === 'undefined') {
      console.log('SheetJS no está disponible, usando método alternativo...');
      return exportToExcel(data);
    }

    if (!data || data.length === 0) {
      alert('❌ No hay datos para exportar');
      return;
    }

    const worksheetData = data.map(blog => ({
      'ID': blog.id,
      'Producto ID': blog.producto_id || '',
      'Nombre Producto': blog.nombre_producto || '',
      'Subtítulo': blog.subtitulo || '',
      'Meta Título': blog.etiqueta?.meta_titulo || '',
      'Meta Descripción': blog.etiqueta?.meta_descripcion || '',
      'Fecha Creación': formatDate(blog.created_at),
      'Fecha Actualización': formatDate(blog.updated_at),
      'Párrafos': blog.parrafos?.length || 0,
      'Imágenes': blog.imagenes?.length || 0
    }));

    // @ts-ignore
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    // @ts-ignore  
    const wb = XLSX.utils.book_new();
    // @ts-ignore
    XLSX.utils.book_append_sheet(wb, ws, 'Blogs');
    
    // @ts-ignore
    XLSX.writeFile(wb, `blogs_export_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    console.log('✅ Excel avanzado exportado exitosamente');
    alert(`✅ Se exportaron ${data.length} registros a Excel`);
  } catch (error) {
    console.error('❌ Error al exportar Excel avanzado:', error);
    // Fallback al método básico
    exportToExcel(data);
  }
};

// 2. EXPORTAR A EXCEL (Formato CSV)
export const exportToExcel = (data: Blog[]) => {
  try {
    if (!data || data.length === 0) {
      alert('❌ No hay datos para exportar');
      return;
    }

    const headers = [
      'ID',
      'Producto ID', 
      'Nombre Producto',
      'Subtítulo',
      'Meta Título',
      'Meta Descripción',
      'Fecha Creación',
      'Fecha Actualización',
      'Número de Párrafos',
      'Número de Imágenes',
      'Primer Párrafo'
    ];

    // Preparar datos con formato Excel-friendly
    const excelData = data.map(blog => {
      const primerParrafo = blog.parrafos && blog.parrafos.length > 0 
        ? cleanHtmlText(blog.parrafos[0].parrafo).substring(0, 150) + (blog.parrafos[0].parrafo.length > 150 ? '...' : '')
        : '';

      return [
        blog.id,
        blog.producto_id || '',
        (blog.nombre_producto || '').replace(/"/g, '""'),
        (blog.subtitulo || '').replace(/"/g, '""'),
        (blog.etiqueta?.meta_titulo || '').replace(/"/g, '""'),
        (blog.etiqueta?.meta_descripcion || '').replace(/"/g, '""'),
        formatDate(blog.created_at),
        formatDate(blog.updated_at),
        blog.parrafos?.length || 0,
        blog.imagenes?.length || 0,
        primerParrafo.replace(/"/g, '""')
      ];
    });

    // Crear contenido CSV con separador de tabulación para mejor compatibilidad con Excel
    const csvContent = [
      headers.join('\t'),
      ...excelData.map(row => 
        row.map(cell => {
          // Si el campo contiene comas, puntos y comas, saltos de línea o comillas, encerrarlo en comillas
          const cellStr = String(cell || '');
          if (cellStr.includes('\t') || cellStr.includes('\n') || cellStr.includes('"')) {
            return `"${cellStr}"`;
          }
          return cellStr;
        }).join('\t')
      )
    ].join('\n');

    // Crear blob con BOM para mejor compatibilidad con Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
      type: 'text/tab-separated-values;charset=utf-8;'
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `blogs_export_${new Date().toISOString().split('T')[0]}.tsv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    console.log('✅ Excel exportado exitosamente');
    alert(`✅ Se exportaron ${data.length} registros a formato compatible con Excel\n\nPara abrir en Excel:\n1. Abre Excel\n2. Ve a Datos > Obtener datos externos > Desde texto\n3. Selecciona el archivo descargado\n4. Elige "Delimitado" y "Tabulación" como separador`);
  } catch (error) {
    console.error('❌ Error al exportar Excel:', error);
    alert('❌ Error al exportar a Excel');
  }
};

// 3. EXPORTAR A PDF
export const exportToPDF = (data: Blog[]) => {
  try {
    if (!data || data.length === 0) {
      alert('❌ No hay datos para exportar');
      return;
    }

    // Crear ventana nueva para generar PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('❌ Por favor permite ventanas emergentes para generar el PDF');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte de Blogs</title>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 11px;
              line-height: 1.3;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #0ea5e9;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #0ea5e9;
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0;
              color: #666;
              font-size: 12px;
            }
            .stats {
              display: flex;
              justify-content: center;
              gap: 30px;
              margin: 15px 0;
              padding: 10px;
              background-color: #f8f9fa;
              border-radius: 8px;
            }
            .stat-item {
              text-align: center;
            }
            .stat-number {
              font-size: 18px;
              font-weight: bold;
              color: #0ea5e9;
            }
            .stat-label {
              font-size: 10px;
              color: #666;
              text-transform: uppercase;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 10px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 6px 4px;
              text-align: left;
              vertical-align: top;
            }
            th {
              background-color: #0ea5e9;
              color: white;
              font-weight: bold;
              text-align: center;
              font-size: 9px;
              text-transform: uppercase;
            }
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tr:hover {
              background-color: #f5f5f5;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 20px;
              font-size: 10px;
            }
            .truncate {
              max-width: 150px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .id-cell {
              text-align: center;
              font-weight: bold;
              color: #0ea5e9;
            }
            .date-cell {
              text-align: center;
              font-size: 9px;
            }
            .number-cell {
              text-align: center;
              font-weight: bold;
            }
            @media print {
              body { 
                margin: 0; 
                padding: 15px;
              }
              .header { 
                margin-bottom: 20px; 
              }
              table {
                page-break-inside: auto;
              }
              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Reporte de Blogs</h1>
            <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            
            <div class="stats">
              <div class="stat-item">
                <div class="stat-number">${data.length}</div>
                <div class="stat-label">Total Blogs</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${data.reduce((sum, blog) => sum + (blog.parrafos?.length || 0), 0)}</div>
                <div class="stat-label">Total Párrafos</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${data.reduce((sum, blog) => sum + (blog.imagenes?.length || 0), 0)}</div>
                <div class="stat-label">Total Imágenes</div>
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 5%;">ID</th>
                <th style="width: 20%;">Producto</th>
                <th style="width: 25%;">Subtítulo</th>
                <th style="width: 20%;">Meta Título</th>
                <th style="width: 12%;">Fecha</th>
                <th style="width: 8%;">Párrafos</th>
                <th style="width: 10%;">Imágenes</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(blog => `
                <tr>
                  <td class="id-cell">${blog.id}</td>
                  <td class="truncate">${blog.nombre_producto || 'Sin nombre'}</td>
                  <td class="truncate">${blog.subtitulo || ''}</td>
                  <td class="truncate">${blog.etiqueta?.meta_titulo || ''}</td>
                  <td class="date-cell">${formatDate(blog.created_at)}</td>
                  <td class="number-cell">${blog.parrafos?.length || 0}</td>
                  <td class="number-cell">${blog.imagenes?.length || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p><strong>Sistema de Gestión de Blogs</strong></p>
            <p>© ${new Date().getFullYear()} - Todos los derechos reservados</p>
            <p style="font-size: 9px; color: #999;">
              Documento generado automáticamente • ${new Date().toISOString()}
            </p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Esperar a que cargue y luego imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // No cerrar automáticamente para que el usuario pueda guardar como PDF
      }, 500);
    };

    console.log('✅ PDF generado exitosamente');
  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    alert('❌ Error al generar PDF');
  }
};

// 4. FUNCIÓN PARA IMPRIMIR
export const printTable = (data: Blog[]) => {
  try {
    if (!data || data.length === 0) {
      alert('❌ No hay datos para imprimir');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('❌ Por favor permite ventanas emergentes para imprimir');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Imprimir Lista de Blogs</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 15px;
              font-size: 11px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .header h2 {
              margin: 0;
              color: #333;
            }
            .header p {
              margin: 5px 0;
              color: #666;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 9px;
              margin-top: 15px;
            }
            th, td { 
              border: 1px solid #333; 
              padding: 4px 3px; 
              text-align: left;
              vertical-align: top;
            }
            th { 
              background-color: #f0f0f0; 
              font-weight: bold;
              text-align: center;
              font-size: 8px;
            }
            .id-cell { text-align: center; font-weight: bold; }
            .number-cell { text-align: center; }
            .date-cell { text-align: center; font-size: 8px; }
            .truncate {
              max-width: 120px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            @page {
              margin: 1cm;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>📋 Lista de Blogs</h2>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            <p><strong>Total de registros:</strong> ${data.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th style="width: 8%;">ID</th>
                <th style="width: 25%;">Producto</th>
                <th style="width: 35%;">Subtítulo</th>
                <th style="width: 15%;">Fecha</th>
                <th style="width: 8%;">Párrafos</th>
                <th style="width: 9%;">Imágenes</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(blog => `
                <tr>
                  <td class="id-cell">${blog.id}</td>
                  <td class="truncate">${blog.nombre_producto || 'Sin nombre'}</td>
                  <td class="truncate">${blog.subtitulo || ''}</td>
                  <td class="date-cell">${formatDate(blog.created_at)}</td>
                  <td class="number-cell">${blog.parrafos?.length || 0}</td>
                  <td class="number-cell">${blog.imagenes?.length || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: center; font-size: 8px; color: #666;">
            <p>Sistema de Gestión de Blogs - ${new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 250);
    };

    console.log('✅ Tabla enviada a imprimir');
  } catch (error) {
    console.error('❌ Error al imprimir:', error);
    alert('❌ Error al imprimir');
  }
};