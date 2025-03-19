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
      <table className="w-full border-separate border-spacing-2">
        <thead>
          <tr className="bg-cyan-500 opacity-80 text-white">
            <th className="px-4 py-2 rounded-xl">ID</th>
            <th className="px-4 py-2 rounded-xl">NOMBRE</th>
            <th className="px-4 py-2 rounded-xl">GMAIL</th>
            <th className="px-4 py-2 rounded-xl">TELÉFONO</th>
            <th className="px-4 py-2 rounded-xl">SECCIÓN</th>
            <th className="px-4 py-2 rounded-xl">FECHA</th>
            <th className="px-4 py-2 rounded-xl">ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id} className={`text-center ${index % 2 === 0 ? "bg-gray-100" : "bg-gray-300"}`}>
              <td className="px-4 font-bold rounded-xl">{item.id}</td>
              <td className="px-4 font-bold rounded-xl">{item.nombre}</td>
              <td className="px-4 rounded-xl">{item.gmail}</td>
              <td className="px-4 font-bold rounded-xl">{item.telefono}</td>
              <td className="px-4 font-bold rounded-xl">{item.seccion}</td>
              <td className="px-4 font-bold rounded-xl">{item.fecha}</td>
              <td className="px-4 rounded-xl">
                {/* Contenedor de acciones con íconos */}
                <div className="flex justify-center gap-2 rounded-xl p-1">
                  <button className="p-2 text-red-600 hover:text-red-800 transition" title="Eliminar">
                    <FaTrash size={18} />
                  </button>
                  <button className="p-2 text-green-600 hover:text-green-800 transition" title="Confirmar">
                    <FaCheck size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botón de añadir datos con icono */}
      <button className="mt-4 bg-cyan-500 opacity-50 text-white px-4 py-2 rounded-xl flex items-center gap-2">
        <FaPlus /> Añadir dato
      </button>
    </div>
  );
};

export default DataTable;




