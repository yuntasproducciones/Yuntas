import{j as s}from"./jsx-runtime.D_zvdyIk.js";import{r as g}from"./index.ai7qpRr1.js";const x=e=>e?e.replace(/<[^>]*>/g,"").replace(/&nbsp;/g," ").trim():"",p=e=>{if(!e)return"N/A";try{return new Date(e).toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit",year:"numeric"})}catch{return"Fecha inválida"}},f=e=>{try{if(!e||e.length===0){alert("❌ No hay datos para exportar");return}const t=[["ID","Producto ID","Nombre Producto","Subtítulo","Meta Título","Meta Descripción","Fecha Creación","Párrafos","Imágenes"].join(";"),...e.map(n=>[n.id||"",n.producto_id||"",`"${(n.nombre_producto||"").replace(/"/g,'""')}"`,`"${(n.subtitulo||"").replace(/"/g,'""')}"`,`"${(n.etiqueta?.meta_titulo||"").replace(/"/g,'""')}"`,`"${(n.etiqueta?.meta_descripcion||"").replace(/"/g,'""')}"`,n.created_at?new Date(n.created_at).toLocaleDateString("es-ES"):"",n.parrafos?.length||0,n.imagenes?.length||0].join(";"))].join(`
`),a="\uFEFF",l=new Blob([a+t],{type:"text/csv;charset=utf-8;"}),o=document.createElement("a"),c=URL.createObjectURL(l);o.href=c,o.download=`blogs_export_${new Date().toISOString().split("T")[0]}.csv`,o.style.display="none",document.body.appendChild(o),o.click(),document.body.removeChild(o),URL.revokeObjectURL(c),console.log("✅ CSV para Excel exportado exitosamente"),alert(`✅ Se exportaron ${e.length} registros a CSV

Este archivo se abrirá automáticamente en Excel con el formato correcto.`)}catch(r){console.error("❌ Error al exportar CSV para Excel:",r),alert("❌ Error al exportar")}},b=e=>{try{if(!e||e.length===0){alert("❌ No hay datos para exportar");return}const i=[["ID","Producto ID","Nombre Producto","Subtítulo","Meta Título","Meta Descripción","Fecha Creación","Fecha Actualización","Número de Párrafos","Número de Imágenes","Primer Párrafo"].join(","),...e.map(o=>{const c=o.parrafos&&o.parrafos.length>0?x(o.parrafos[0].parrafo).substring(0,100)+"...":"";return[o.id,o.producto_id||"",`"${(o.nombre_producto||"").replace(/"/g,'""')}"`,`"${(o.subtitulo||"").replace(/"/g,'""')}"`,`"${(o.etiqueta?.meta_titulo||"").replace(/"/g,'""')}"`,`"${(o.etiqueta?.meta_descripcion||"").replace(/"/g,'""')}"`,p(o.created_at),p(o.updated_at),o.parrafos?.length||0,o.imagenes?.length||0,`"${c.replace(/"/g,'""')}"`].join(",")})].join(`
`),t=new Blob(["\uFEFF"+i],{type:"text/csv;charset=utf-8;"}),a=document.createElement("a"),l=URL.createObjectURL(t);a.setAttribute("href",l),a.setAttribute("download",`blogs_export_${new Date().toISOString().split("T")[0]}.csv`),a.style.display="none",document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(l),console.log("✅ CSV exportado exitosamente"),alert(`✅ Se exportaron ${e.length} registros a CSV`)}catch(r){console.error("❌ Error al exportar CSV:",r),alert("❌ Error al exportar a CSV")}},y=e=>{try{if(!e||e.length===0){alert("❌ No hay datos para exportar");return}const r=window.open("","_blank");if(!r){alert("❌ Por favor permite ventanas emergentes para generar el PDF");return}const i=`
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
                <div class="stat-number">${e.length}</div>
                <div class="stat-label">Total Blogs</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${e.reduce((t,a)=>t+(a.parrafos?.length||0),0)}</div>
                <div class="stat-label">Total Párrafos</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">${e.reduce((t,a)=>t+(a.imagenes?.length||0),0)}</div>
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
              ${e.map(t=>`
                <tr>
                  <td class="id-cell">${t.id}</td>
                  <td class="truncate">${t.nombre_producto||"Sin nombre"}</td>
                  <td class="truncate">${t.subtitulo||""}</td>
                  <td class="truncate">${t.etiqueta?.meta_titulo||""}</td>
                  <td class="date-cell">${p(t.created_at)}</td>
                  <td class="number-cell">${t.parrafos?.length||0}</td>
                  <td class="number-cell">${t.imagenes?.length||0}</td>
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
    `;r.document.write(i),r.document.close(),r.onload=()=>{setTimeout(()=>{r.focus(),r.print()},500)},console.log("✅ PDF generado exitosamente")}catch(r){console.error("❌ Error al generar PDF:",r),alert("❌ Error al generar PDF")}},v=e=>{try{if(!e||e.length===0){alert("❌ No hay datos para imprimir");return}const r=window.open("","_blank");if(!r){alert("❌ Por favor permite ventanas emergentes para imprimir");return}const i=`
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
            <p><strong>Total de registros:</strong> ${e.length}</p>
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
              ${e.map(t=>`
                <tr>
                  <td class="id-cell">${t.id}</td>
                  <td class="truncate">${t.nombre_producto||"Sin nombre"}</td>
                  <td class="truncate">${t.subtitulo||""}</td>
                  <td class="date-cell">${p(t.created_at)}</td>
                  <td class="number-cell">${t.parrafos?.length||0}</td>
                  <td class="number-cell">${t.imagenes?.length||0}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div style="margin-top: 20px; text-align: center; font-size: 8px; color: #666;">
            <p>Sistema de Gestión de Blogs - ${new Date().toLocaleDateString("es-ES")}</p>
          </div>
        </body>
      </html>
    `;r.document.write(i),r.document.close(),r.onload=()=>{setTimeout(()=>{r.focus(),r.print(),r.close()},250)},console.log("✅ Tabla enviada a imprimir")}catch(r){console.error("❌ Error al imprimir:",r),alert("❌ Error al imprimir")}};function $({children:e,tableType:r="default",headerContent:i,exportData:t=[],onAddNew:a}){const l=()=>{if(t.length===0){alert("No hay datos para exportar");return}b(t)},o=()=>{if(t.length===0){alert("No hay datos para exportar");return}f(t)},c=()=>{if(t.length===0){alert("No hay datos para exportar");return}y(t)},n=()=>{if(t.length===0){alert("No hay datos para imprimir");return}v(t)},u=()=>{if(i)return i;switch(r){case"blogs":case"productos":case"usuarios":return s.jsxs("div",{className:"flex flex-wrap gap-2 mb-4",children:[a&&s.jsx("button",{onClick:a,className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"PUBLICAR"}),s.jsx("button",{onClick:l,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A CSV"}),s.jsx("button",{onClick:o,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A EXCEL"}),s.jsx("button",{onClick:c,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"EXPORTAR A PDF"}),s.jsx("button",{onClick:n,className:"bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl font-semibold transition-colors",children:"IMPRIMIR"})]});default:return s.jsx("div",{className:"flex flex-wrap gap-2 mb-4",children:s.jsx("button",{className:"bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors",children:"ACCIÓN GENÉRICA"})})}},m=[],h=[];return(Array.isArray(e)?e:[e]).forEach(d=>{g.isValidElement(d)&&["thead","tbody","tfoot","tr"].includes(d.type||"")?m.push(d):h.push(d)}),s.jsxs("div",{className:"w-full",children:[u(),s.jsx("div",{className:"overflow-x-auto",children:s.jsx("table",{className:"min-w-full text-sm text-center border-separate border-spacing-x-2 border-spacing-y-2",children:m})}),h.length>0&&s.jsx("div",{className:"mt-2 space-y-2",children:h})]})}export{$ as T};
