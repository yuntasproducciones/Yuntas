import{j as r}from"./jsx-runtime.D_zvdyIk.js";import"./index.ai7qpRr1.js";const h=t=>t?t.replace(/<[^>]*>/g,"").replace(/&nbsp;/g," ").trim():"",d=t=>{if(!t)return"N/A";try{return new Date(t).toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return"Fecha inválida"}},m=t=>{try{if(!t||t.length===0){alert("❌ No hay datos para exportar");return}const e=[["ID","Producto ID","Nombre Producto","Subtítulo","Meta Título","Meta Descripción","Fecha Creación","Párrafos","Imágenes"].join(";"),...t.map(s=>[s.id||"",s.producto_id||"",`"${(s.nombre_producto||"").replace(/"/g,'""')}"`,`"${(s.subtitulo||"").replace(/"/g,'""')}"`,`"${(s.etiqueta?.meta_titulo||"").replace(/"/g,'""')}"`,`"${(s.etiqueta?.meta_descripcion||"").replace(/"/g,'""')}"`,s.created_at?new Date(s.created_at).toLocaleDateString("es-ES"):"",s.parrafos?.length||0,s.imagenes?.length||0].join(";"))].join(`
`),n="\uFEFF",l=new Blob([n+e],{type:"text/csv;charset=utf-8;"}),a=document.createElement("a"),c=URL.createObjectURL(l);a.href=c,a.download=`blogs_export_${new Date().toISOString().split("T")[0]}.csv`,a.style.display="none",document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(c),console.log("✅ CSV para Excel exportado exitosamente"),alert(`✅ Se exportaron ${t.length} registros a CSV

Este archivo se abrirá automáticamente en Excel con el formato correcto.`)}catch(o){console.error("❌ Error al exportar CSV para Excel:",o),alert("❌ Error al exportar")}},x=t=>{try{if(!t||t.length===0){alert("❌ No hay datos para exportar");return}const i=[["ID","Producto ID","Nombre Producto","Subtítulo","Meta Título","Meta Descripción","Fecha Creación","Fecha Actualización","Número de Párrafos","Número de Imágenes","Primer Párrafo"].join(","),...t.map(a=>{const c=a.parrafos&&a.parrafos.length>0?h(a.parrafos[0].parrafo).substring(0,100)+"...":"";return[a.id,a.producto_id||"",`"${(a.nombre_producto||"").replace(/"/g,'""')}"`,`"${(a.subtitulo||"").replace(/"/g,'""')}"`,`"${(a.etiqueta?.meta_titulo||"").replace(/"/g,'""')}"`,`"${(a.etiqueta?.meta_descripcion||"").replace(/"/g,'""')}"`,d(a.created_at),d(a.updated_at),a.parrafos?.length||0,a.imagenes?.length||0,`"${c.replace(/"/g,'""')}"`].join(",")})].join(`
`),e=new Blob(["\uFEFF"+i],{type:"text/csv;charset=utf-8;"}),n=document.createElement("a"),l=URL.createObjectURL(e);n.setAttribute("href",l),n.setAttribute("download",`blogs_export_${new Date().toISOString().split("T")[0]}.csv`),n.style.display="none",document.body.appendChild(n),n.click(),document.body.removeChild(n),URL.revokeObjectURL(l),console.log("✅ CSV exportado exitosamente"),alert(`✅ Se exportaron ${t.length} registros a CSV`)}catch(o){console.error("❌ Error al exportar CSV:",o),alert("❌ Error al exportar a CSV")}},u=t=>{try{if(!t||t.length===0){alert("❌ No hay datos para exportar");return}const o=window.open("","_blank");if(!o){alert("❌ Por favor permite ventanas emergentes para generar el PDF");return}const i=`
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
            <p><strong>Fecha de generación:</strong> ${new Date().toLocaleDateString("es-ES",{year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit"})}</p>
            
            <div class="stats">
              <div class="stat-item">
                <div class="stat-number">${t.length}</div>
                <div class="stat-label">Total Blogs</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${t.reduce((e,n)=>e+(n.parrafos?.length||0),0)}</div>
                <div class="stat-label">Total Párrafos</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${t.reduce((e,n)=>e+(n.imagenes?.length||0),0)}</div>
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
              ${t.map(e=>`
                <tr>
                  <td class="id-cell">${e.id}</td>
                  <td class="truncate">${e.nombre_producto||"Sin nombre"}</td>
                  <td class="truncate">${e.subtitulo||""}</td>
                  <td class="truncate">${e.etiqueta?.meta_titulo||""}</td>
                  <td class="date-cell">${d(e.created_at)}</td>
                  <td class="number-cell">${e.parrafos?.length||0}</td>
                  <td class="number-cell">${e.imagenes?.length||0}</td>
                </tr>
              `).join("")}
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
    `;o.document.write(i),o.document.close(),o.onload=()=>{setTimeout(()=>{o.focus(),o.print()},500)},console.log("✅ PDF generado exitosamente")}catch(o){console.error("❌ Error al generar PDF:",o),alert("❌ Error al generar PDF")}},g=t=>{try{if(!t||t.length===0){alert("❌ No hay datos para imprimir");return}const o=window.open("","_blank");if(!o){alert("❌ Por favor permite ventanas emergentes para imprimir");return}const i=`
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
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString("es-ES")}</p>
            <p><strong>Total de registros:</strong> ${t.length}</p>
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
              ${t.map(e=>`
                <tr>
                  <td class="id-cell">${e.id}</td>
                  <td class="truncate">${e.nombre_producto||"Sin nombre"}</td>
                  <td class="truncate">${e.subtitulo||""}</td>
                  <td class="date-cell">${d(e.created_at)}</td>
                  <td class="number-cell">${e.parrafos?.length||0}</td>
                  <td class="number-cell">${e.imagenes?.length||0}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: center; font-size: 8px; color: #666;">
            <p>Sistema de Gestión de Blogs - ${new Date().toLocaleDateString("es-ES")}</p>
          </div>
        </body>
      </html>
    `;o.document.write(i),o.document.close(),o.onload=()=>{setTimeout(()=>{o.focus(),o.print(),o.close()},250)},console.log("✅ Tabla enviada a imprimir")}catch(o){console.error("❌ Error al imprimir:",o),alert("❌ Error al imprimir")}};function y({children:t,tableType:o="default",headerContent:i,exportData:e=[],onAddNew:n}){const l=()=>{if(e.length===0){alert("No hay datos para exportar");return}x(e)},a=()=>{if(e.length===0){alert("No hay datos para exportar");return}m(e)},c=()=>{if(e.length===0){alert("No hay datos para exportar");return}u(e)},s=()=>{if(e.length===0){alert("No hay datos para imprimir");return}g(e)},p=()=>{if(i)return i;switch(o){case"seguimiento":return r.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[r.jsx("button",{className:"bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity",children:"MENSAJES"}),r.jsx("button",{className:"bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity",children:"MEDIO DE SEGUIMIENTO"}),r.jsx("button",{className:"bg-sky-600 text-white px-4 py-2 rounded-xl font-semibold opacity-80 hover:opacity-100 transition-opacity",children:"MONITOREO"})]});case"blogs":return r.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[n&&r.jsx("button",{onClick:n,className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"PUBLICAR"}),r.jsx("button",{onClick:l,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A CSV"}),r.jsx("button",{onClick:a,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A EXCEL"}),r.jsx("button",{onClick:c,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A PDF"}),r.jsx("button",{onClick:s,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"IMPRIMIR"})]});case"productos":return r.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[n&&r.jsx("button",{onClick:n,className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"PUBLICAR"}),r.jsx("button",{onClick:l,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A CSV"}),r.jsx("button",{onClick:a,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A EXCEL"}),r.jsx("button",{onClick:c,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A PDF"}),r.jsx("button",{onClick:s,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"IMPRIMIR"})]});case"usuarios":return r.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[n&&r.jsx("button",{onClick:n,className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"PUBLICAR"}),r.jsx("button",{onClick:l,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A CSV"}),r.jsx("button",{onClick:a,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A EXCEL"}),r.jsx("button",{onClick:c,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A PDF"}),r.jsx("button",{onClick:s,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"IMPRIMIR"})]});default:return r.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:r.jsx("button",{className:"bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors",children:"ACCIÓN GENÉRICA"})})}};return r.jsxs("div",{className:"w-full",children:[p(),r.jsx("div",{className:"overflow-x-auto",children:r.jsx("table",{className:"min-w-full text-sm text-center border-separate border-spacing-x-2 border-spacing-y-2",children:t})})]})}export{y as T};
