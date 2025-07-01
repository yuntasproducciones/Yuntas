const ProductCard = ({ producto }) => {
    // Determinar la imagen a mostrar (API v1 usa different structure)
    const imagenUrl = producto.image || producto.images?.[0] || (producto.imagenes?.[0]?.url_imagen);
    const imagenAlt = producto.title || producto.imagenes?.[0]?.texto_alt_SEO || "Imagen de prueba";
    
    // Determinar el título a mostrar
    const titulo = producto.title || producto.titulo;
    
    // Determinar el link
    const link = producto.link || (producto.title ? producto.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') : '');
    
    return (
        <a
            href={`/products/producto/?link=${link}`}
            className="relative flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer group my-2 sm:my-3 md:my-4"
        >
        <div className="h-[340px] w-full overflow-hidden rounded-3xl">
            <img
                className="w-full h-full object-cover"
                src={`https://apiyuntas.yuntaspublicidad.com${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`}
                alt={imagenAlt}
            />
        </div>
        <p className="text-black py-2 px-5 text-base sm:text-lg md:text-xl font-bold text-center absolute bottom-2 bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full">
            {titulo}
        </p>
        </a>
    );
};

export default ProductCard;
