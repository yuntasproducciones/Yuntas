import { useState, useEffect } from "react";
import barrasPixelLed from "../../assets/images/products/barras_pixel_led.webp";
import letreroNeonLed from "../../assets/images/products/letrero_neon_led.webp";
import pisosLed from "../../assets/images/products/pisos_led.webp";
import sillasMesasLed from "../../assets/images/products/sillas_mesas_led.webp";
// importacion manual hasta que la api pueda importar las imagenes con enlaces
const ProductCard = ({ producto }) => {
    const products = {
        1: letreroNeonLed,
        2: sillasMesasLed,
        3: pisosLed,
        4: barrasPixelLed
    }    
    console.log(products[producto.id])

  return (
    <>
        <a
          href={`/products/detail?id=${producto.id}`}
          className="relative flex flex-col items-center hover:scale-105 transition-all duration-200 cursor-pointer group my-2 sm:my-3 md:my-4"
        >
          <figure className="aspect-square w-full rounded-3xl">
              <img 
                src={products[producto.id].src}
                alt={producto.title}
                width="100" height="100"
                className="object-cover w-full h-full"
                loading="lazy"
            />
            <figcaption className="text-white pt-2 text-base sm:text-lg md:text-2xl font-bold text-center">
              {producto.title}
            </figcaption>
          </figure>
        </a>
    </>
  );
};

export default ProductCard;
