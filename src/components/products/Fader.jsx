import { useState, useEffect } from "react";

const images = ["esp_1.webp", "esp_2.webp", "esp_3.webp", "esp_4.webp"];

const Fader = ({ nombreProducto }) => {
    const productoRuta = nombreProducto.replace(/\s+/g, "");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-80 2xl:h-[30rem] max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl overflow-hidden rounded-4xl shadow-2xl mb-8 sm:mb-[0rem]">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={`/products/${productoRuta}/especificaciones/${img}`} // Ruta corregida
                    alt={img}
                    className={`absolute w-full h-full object-cover object-center transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
                />
            ))}
        </div>
    );
};

export default Fader;