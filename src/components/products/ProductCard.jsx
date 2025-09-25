import { buildImageUrl, getImageTitle } from "../../utils/imageHelpers";

const ProductCard = ({ producto }) => {
  console.log("🎴 ProductCard recibió producto:", producto);

  // 📸 Usar imagen principal (resuelta con helper)
  const imagenUrl = buildImageUrl(producto.imagen_principal);
  const imagenAlt = producto.text_alt_principal || "Imagen del producto";
  const titulo =
    producto.title || producto.titulo || producto.nombre || "Producto sin título";
  const link = producto.link;

  console.log("🖼️ Imagen URL calculada:", imagenUrl);
  console.log("📝 Título calculado:", titulo);
  console.log("🔗 Link del producto:", link);

  return (
    <a
      href={`/products/${link}`}
      className="relative flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer group mb-8"
      title={titulo}
    >
      {/* Contenedor principal con dimensiones fijas */}
      <div className="relative w-[280px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700">
        {/* Imagen del producto */}
        <div className="h-[200px] w-[280px] overflow-hidden">
          {imagenUrl ? (
            <img
              className="w-full h-full object-cover object-center"
              src={imagenUrl}
              alt={imagenAlt}
              title={getImageTitle(imagenUrl, titulo)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <p className="text-white text-xl font-bold">Sin imagen</p>
            </div>
          )}
        </div>
      </div>

      {/* Título en la parte inferior */}
      <div className="p-4 mt-2">
        <p className="text-white text-center text-sm font-semibold leading-tight">
          {titulo}
        </p>
      </div>
    </a>
  );
};

export default ProductCard;
