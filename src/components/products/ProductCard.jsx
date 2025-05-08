import { useState } from "react";

const ProductCard = ({ producto }) => {
    const hasImages = producto.imagenes && producto.imagenes.length > 0;
    const mainImage = hasImages ? producto.imagenes[0] : {
        url: "/placeholder.jpg",
        alt: "Imagen no disponible"
    };

    return (
        <a href={`/products/detail/${producto.id}`}
           className="relative flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer group my-2 sm:my-3 md:my-4">
            <figure className="aspect-square w-full rounded-3xl overflow-hidden">
                <img
                    src={mainImage.url}
                    alt={mainImage.alt}
                    width="250"
                    height="250"
                    className="object-cover w-full h-full"
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder.jpg";
                        e.currentTarget.alt = "Imagen no disponible";
                    }}
                />
            </figure>
            <figcaption className="text-white text-base sm:text-lg md:text-2xl font-bold text-center">
                {producto.title}
            </figcaption>
        </a>
    );
};

export default ProductCard;
