import { FaTrash, FaCheck, FaPlus } from "react-icons/fa";

const DataTable = () => {
  const data = [
    { id: 1, nombre: "Kiara", gmail: "namelose@gmail.com", telefono: "941825478", seccion: "WAOS", fecha: "25/01/2025" },
    { id: 2, nombre: "Carlos", gmail: "carlos@email.com", telefono: "912345678", seccion: "MKT", fecha: "10/02/2025" },
    { id: 3, nombre: "Lucia", gmail: "lucia@email.com", telefono: "987654321", seccion: "IT", fecha: "03/03/2025" },
    { id: 4, nombre: "Miguel", gmail: "miguel@email.com", telefono: "945678321", seccion: "RRHH", fecha: "18/04/2025" },
  ];

  return (
    <div className="p-4 w-full">
      {/* Botones de acciones generales */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button className="bg-sky-600 font-semibold opacity-80 text-white px-4 py-2 rounded-xl">PUBLICAR</button>
        <button className="bg-sky-600 font-semibold opacity-80 text-white px-4 py-2 rounded-xl">EXPORTAR A CVS</button>
        <button className="bg-sky-600 font-semibold opacity-80 text-white px-4 py-2 rounded-xl">EXPORTAR A EXCEL</button>
        <button className="bg-sky-600 font-semibold opacity-80 text-white px-4 py-2 rounded-xl">EXPORTAR A PDF</button>
        <button className="bg-sky-600 font-semibold opacity-80 text-white px-4 py-2 rounded-xl">IMPRIMIR</button>
      </div>
      {/* Tabla */}
       <div className="overflow-x-auto p-4">
    <table
      className="min-w-full text-sm text-center border-separate border-spacing-x-2 border-spacing-y-2"
    >
      <thead>
        <tr>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >ID</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Nombre</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Gmail</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Teléfono</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Sección</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Fecha</th>
          <th
            className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
            >Acción</th>
        </tr>
      </thead>
      <tbody>
        {/* <!-- Fila con datos impar (1) --> */}
        <tr>
          <td className="px-4 py-2 rounded-md font-bold bg-[#d9d9d9]">1</td>
          <td className="px-4 py-2 rounded-md font-bold bg-[#d9d9d9]">Kiara</td>
          <td className="px-4 py-2 rounded-md font-bold bg-[#d9d9d9]"
            >namelose@gmail.com</td>
          <td className="px-4 py-2 rounded-md font-bold bg-[#d9d9d9]">941825478</td>
          <td className="px-4 py-2 rounded-md font-bold bg-[#d9d9d9]">WAOS</td>
          <td className="px-4 py-2 rounded-md font-bold bg-[#d9d9d9]">25/01/2025</td>
          <td
            className="px-4 py-2 rounded-md font-bold bg-[#d9d9d9] flex justify-center gap-2"
          >
            <button className="text-red-500 hover:text-red-700">🗑️</button>
            <button className="text-green-500 hover:text-green-700">✅</button>
          </td>
        </tr>

        {/* <!-- Filas vacías con estilo alternado --> */}
        {
          Array.from({ length: 9 }).map((_, i) => {
            const isEven = (i + 2) % 2 === 0;
            const bg = isEven ? "bg-[#d9d9d94D]" : "bg-[#d9d9d9]";
            return (
              <tr>
                <td className={`px-4 py-2 rounded-md font-bold ${bg}`}>{i + 2}</td>
                <td className={`px-4 py-2 rounded-md ${bg}`} />
                <td className={`px-4 py-2 rounded-md ${bg}`} />
                <td className={`px-4 py-2 rounded-md ${bg}`} />
                <td className={`px-4 py-2 rounded-md ${bg}`} />
                <td className={`px-4 py-2 rounded-md ${bg}`} />
                <td
                  className={`px-4 py-2 rounded-md ${bg} flex justify-center gap-2`}
                >
                  {/* <button class="text-red-600 dark:text-red-400 cursor-not-allowed">
                    🗑️
                  </button> */}
                  <button className="text-red-500 cursor-not-allowed">🗑️</button>

                  <button className="text-green-300 cursor-not-allowed">✅</button>
                </td>
              </tr>
            );
          })
        }
      </tbody>
    </table>
  </div>

      {/* Botón de añadir datos con icono */}
      <button className="mt-4 bg-cyan-500 opacity-50 text-white px-4 py-2 rounded-xl flex items-center gap-2">
        <FaPlus /> Añadir dato
      </button>
    </div>
  );
};

export default DataTable;




