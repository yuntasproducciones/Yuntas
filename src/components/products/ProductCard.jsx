const ProductCard = ({ producto }) => {
    console.log('🎴 ProductCard recibió producto:', producto);
    
    // Determinar la imagen a mostrar (API v1 usa different structure)
    const imagenUrl = producto.image || producto.images?.[0] || (producto.imagenes?.[0]?.url_imagen);
    const imagenAlt = producto.title || producto.imagenes?.[0]?.texto_alt_SEO || "Imagen de prueba";
    
    console.log('🖼️ Imagen URL calculada:', imagenUrl);
    
    // Determinar el título a mostrar
    const titulo = producto.title || producto.titulo;
    
    console.log('📝 Título calculado:', titulo);
    
    // Usar el link del producto directamente (viene de la base de datos)
    const link = producto.link;
    
    console.log('🔗 Link del producto:', link);
    
    // Determinar la URL base para las imágenes (local vs desplegada)
    // const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    // const imageBaseUrl = isLocalDev ? 'http://127.0.0.1:8000' : 'https://apiyuntas.yuntaspublicidad.com';
    // Forzar siempre la URL de producción para las imágenes
    const imageBaseUrl = 'https://apiyuntas.yuntaspublicidad.com';
    
    return (
        <a
            href={`/products/producto/?link=${link}`}
            className="relative flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer group my-2 sm:my-3 md:my-4"
        >
        <div className="h-[340px] w-[250px] overflow-hidden rounded-3xl mx-auto">
            {imagenUrl ? (
                <img
                    className="w-full h-full object-cover object-center"
                    src={`${imageBaseUrl}${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`}
                    alt={imagenAlt}
                    style={{ width: '250px', height: '340px' }}
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <p className="text-white text-xl font-bold">Sin imagen</p>
                </div>
            )}
        </div>
        <p className="text-black py-2 px-5 text-base sm:text-lg md:text-xl font-bold text-center absolute bottom-2 bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full">
            {titulo || "Producto sin título"}
        </p>
        </a>
    );
};

export default ProductCard;
