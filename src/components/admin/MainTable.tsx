import { FaTrash, FaCheck, FaPlus } from "react-icons/fa";

const DataTable = () => {
  const data = [
    { id: 1, nombre: "Kiara", gmail: "namelose@gmail.com", telefono: "941825478", seccion: "WAOS", fecha: "25/01/2025" },
    { id: 2, nombre: "Carlos", gmail: "carlos@email.com", telefono: "912345678", seccion: "MKT", fecha: "10/02/2025" },
    { id: 3, nombre: "Lucia", gmail: "lucia@email.com", telefono: "987654321", seccion: "IT", fecha: "03/03/2025" },
    { id: 4, nombre: "Miguel", gmail: "miguel@email.com", telefono: "945678321", seccion: "RRHH", fecha: "18/04/2025" },
  ];

  const headers = ["ID", "NOMBRE", "GMAIL", "TELÉFONO", "SECCIÓN", "FECHA", "ACCIÓN"];

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

      {/* Tabla para pantallas medianas y grandes */}
      <div className="hidden md:block overflow-x-auto p-2 sm:p-4">
        <table className="min-w-full text-sm text-center border-separate border-spacing-x-2 border-spacing-y-2">
          <thead>
            <tr>
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Datos reales */}
            {data.map((row, i) => {
              const bg = i % 2 === 0 ? "bg-[#d9d9d9]" : "bg-[#d9d9d94D]";
              return (
                <tr key={row.id}>
                  <td className={`px-4 py-2 rounded-md font-bold ${bg}`}>{row.id}</td>
                  <td className={`px-4 py-2 rounded-md font-bold ${bg}`}>{row.nombre}</td>
                  <td className={`px-4 py-2 rounded-md ${bg}`}>{row.gmail}</td>
                  <td className={`px-4 py-2 rounded-md font-bold ${bg}`}>{row.telefono}</td>
                  <td className={`px-4 py-2 rounded-md font-bold ${bg}`}>{row.seccion}</td>
                  <td className={`px-4 py-2 rounded-md font-bold ${bg}`}>{row.fecha}</td>
                  <td className={`px-4 py-2 rounded-md ${bg} flex justify-center gap-2`}>
                    <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
                    <button className="text-green-500 hover:text-green-700"><FaCheck /></button>
                  </td>
                </tr>
              );
            })}

            {/* Filas vacías para mantener el estilo de la organización */}
            {Array.from({ length: 6 }).map((_, i) => {
              const isEven = (i + data.length + 1) % 2 === 0;
              const bg = isEven ? "bg-[#d9d9d94D]" : "bg-[#d9d9d9]";
              return (
                <tr key={`empty-${i}`}>
                  <td className={`px-4 py-2 rounded-md font-bold ${bg}`}>{data.length + i + 1}</td>
                  <td className={`px-4 py-2 rounded-md ${bg}`} />
                  <td className={`px-4 py-2 rounded-md ${bg}`} />
                  <td className={`px-4 py-2 rounded-md ${bg}`} />
                  <td className={`px-4 py-2 rounded-md ${bg}`} />
                  <td className={`px-4 py-2 rounded-md ${bg}`} />
                  <td className={`px-4 py-2 rounded-md ${bg} flex justify-center gap-2`}>
                    <button className="text-red-500 cursor-not-allowed">🗑️</button>
                    <button className="text-green-300 cursor-not-allowed">✅</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista tipo card para pantallas chicas */}
      <div className="md:hidden flex flex-col gap-4">
        {data.map((row) => (
          <div key={row.id} className="bg-white shadow rounded-lg p-4 border border-gray-200">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="font-semibold text-gray-600">ID:</p>
              <p className="font-bold">{row.id}</p>

              <p className="font-semibold text-gray-600">Nombre:</p>
              <p>{row.nombre}</p>

              <p className="font-semibold text-gray-600">Gmail:</p>
              <p>{row.gmail}</p>

              <p className="font-semibold text-gray-600">Teléfono:</p>
              <p>{row.telefono}</p>

              <p className="font-semibold text-gray-600">Sección:</p>
              <p>{row.seccion}</p>

              <p className="font-semibold text-gray-600">Fecha:</p>
              <p>{row.fecha}</p>
            </div>
            {/* acciones */}
            <div className="flex justify-end gap-3 mt-4">
              <button className="text-red-500 hover:text-red-700"><FaTrash /></button>
              <button className="text-green-500 hover:text-green-700"><FaCheck /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Botón de añadir datos */}
      <button className="mt-4 bg-cyan-500 opacity-80 hover:opacity-100 text-white px-4 py-2 rounded-xl flex items-center gap-2">
        <FaPlus /> Añadir dato
      </button>
    </div>
  );
};

export default DataTable;
