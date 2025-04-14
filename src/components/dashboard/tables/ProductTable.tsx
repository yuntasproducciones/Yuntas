const ProductTable = () => {
  return (
    <table className="w-full border-separate border-spacing-2">
      <thead>
        <tr className="bg-teal-600 text-white">
          <th className="px-4 py-2 rounded-xl">ID</th>
          <th className="px-4 py-2 rounded-xl">NOMBRE</th>
          <th className="px-4 py-2 rounded-xl">SECCION</th>
          <th className="px-4 py-2 rounded-xl">PRECIO</th>
          <th className="px-4 py-2 rounded-xl">ACCIÓN</th>
        </tr>
      </thead>
      <tbody>
        {productos.map((item, index) => (
          <tr
            key={item.id}
            className={`text-center ${
              index % 2 === 0 ? "bg-gray-100" : "bg-gray-300"
            }`}
          >
            <td className="px-4 font-bold rounded-xl">{item.id}</td>
            <td className="px-4 font-bold rounded-xl">{item.name}</td>
            <td className="px-4 font-bold rounded-xl">{item.seccion}</td>
            <td className="px-4 font-bold rounded-xl">{item.precioProducto}</td>
            <td className="px-4 rounded-xl">
              {/* Contenedor de acciones con íconos */}
              <div className="flex justify-center gap-2 rounded-xl p-1">
                <button
                  className="p-2 text-red-600 hover:text-red-800 transition hover:cursor-pointer"
                  title="Eliminar"
                  onClick={() => eliminarProducto(item.id)}
                >
                  <FaTrash size={18} />
                </button>
                <button
                  className="p-2 text-green-600 hover:text-green-800 transition hover:cursor-pointer"
                  title="Editar"
                  onClick={() => {
                    // Reseteamos el productoEnEdicion antes de asignarlo, esto asegura que el modal se pueda abrir de nuevo
                    setProductoEnEdicion(null);
                    setProductoEnEdicion(item); // Asignamos el producto para abrir el modal con los datos correctos
                  }}
                >
                  <FaEdit size={18} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
