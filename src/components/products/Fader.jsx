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
        <div className="relative h-96 w-80 overflow-hidden rounded-4xl shadow-2xl">
            {images.map((img, i) => (
                <img
                    key={i}
                    src={`/products/${productoRuta}/especificaciones/${img}`} // Ruta corregida
                    alt={img}
                    className={`absolute top-0 left-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0"}`}
                />
            ))}
        </div>
    );
};

export default Fader;