import { useState, useEffect } from "react";
import imagen1 from "../../assets/images/inicio/slider/slider_1.webp";
import imagen2 from "../../assets/images/inicio/slider/slider_2.webp";
import imagen3 from "../../assets/images/inicio/slider/slider_3.webp";

const images = [imagen1, imagen2, imagen3];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0); // Índice de la imagen actual
  const [fade, setFade] = useState(true); // Estado de la animación de fade

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full">
      <img
        src={images[currentIndex].src} 
        alt="Imagen del slider"
        className={`w-full h-full object-cover transition-opacity duration-1000 ${fade ? "opacity-100" : "opacity-0"}`}
      />

      {/* Texto sobre el slider */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl Montserrat font-bold text-cyan-500 sombra-title">
          ESPECIALISTAS
        </h1>
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl Montserrat font-black text-white sombra-title">
          EN DISEÑAR TU ESPACIO
        </h1>
      </div>

      {/* Indicador de índice */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;


