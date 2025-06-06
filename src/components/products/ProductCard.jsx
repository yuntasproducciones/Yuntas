const ProductCard = ({ producto }) => {
    
    return (
        <a
            href={`/products/producto/?link=${producto.link}`}
            className="relative flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer group my-2 sm:my-3 md:my-4"
        >
        <div className="h-[340px] w-full overflow-hidden rounded-3xl">
            <img
                className="w-full h-full object-cover"
                src={`https://apiyuntas.yuntaspublicidad.com` + producto.imagenes[0].url_imagen}
                alt={producto.imagenes[0].texto_alt_SEO || "Imagen de prueba"}
            />
        </div>
        <p className="text-black py-2 px-5 text-base sm:text-lg md:text-xl font-bold text-center absolute bottom-2 bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full">
            {producto.titulo}
        </p>
        </a>
    );
};

export default ProductCard;
