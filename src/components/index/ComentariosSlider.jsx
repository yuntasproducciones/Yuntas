/**
 * Componente Slider de comentarios
 * Este componente muestra una lista de comentarios en un slider horizontal.
 * Se muestran 3 comentarios por slide en escritorio y 1 en móvil.
 * Se puede navegar entre los slides con flechas de navegación.
 */
import { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Slider = ({ comentarios }) => {
  const sliderRef = useRef(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (sliderRef.current) {
        // Medimos el ancho del primer slide.
        const firstSlide = sliderRef.current.querySelector(".slide-group");
        if (firstSlide) {
          setSlideWidth(firstSlide.offsetWidth);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1 carta por slide en móvil, 3 en escritorio.
  const itemsPerPage = isMobile ? 1 : 3;
  const totalGroups = Math.ceil(comentarios.length / itemsPerPage);

  // En móvil, no aplicamos gap para que el slide ocupe el 100% exacto.
  const gap = isMobile ? 0 : 24;

  // Funciones para cambiar de slide. El calculo consiste en sumar o restar 1 al índice actual.
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalGroups - 1 : prev - 1));
  };

  // Funciones para cambiar de slide. El calculo consiste en sumar o restar 1 al índice actual.
  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= totalGroups - 1 ? 0 : prev + 1));
  };

  // Se calcula el offset en píxeles según el ancho medido y el gap.
  const offset = slideWidth ? currentIndex * (slideWidth + gap) : 0;

  return (
    <div className="relative w-full">
      {/* Ajustamos el padding del contenedor según el modo */}
      <div className={isMobile ? "px-2" : "px-8 md:px-12"}>
        <div className="overflow-hidden">
          <div
            ref={sliderRef}
            id="slider"
            // Aplicamos una transición para suavizar el cambio de slide
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${offset}px)` }}
          >
            {Array.from({ length: totalGroups }).map((_, groupIndex) => (
              <div
                key={groupIndex}
                // En móvil, eliminamos el margen y padding extra
                className={`slide-group flex-shrink-0 w-full ${
                  isMobile ? "mr-0 px-0" : "mr-6 last:mr-0 px-4 box-border"
                }`}
              >
                <div
                  // En móvil, el ancho es 100% para ocupar el espacio disponible
                  className={isMobile ? "w-full" : "flex justify-between gap-6"}
                >
                  {comentarios
                    // Programacion funcional: Si el índice del grupo es 0, mostramos el último grupo.
                    .slice(
                      groupIndex * itemsPerPage,
                      (groupIndex + 1) * itemsPerPage
                    )
                    // Mapeamos los comentarios del grupo actual
                    .map((comentario) => (
                      <div
                        key={comentario.id}
                        className={isMobile ? "w-[95%] mx-auto" : "w-1/3"}
                      >
                        <div className="h-80 bg-white text-black rounded-2xl p-8 shadow-lg flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex justify-center items-center bg-black text-white rounded-full">
                              {comentario.nombre.charAt(0)}
                            </div>
                            <p className="text-lg font-semibold">
                              {comentario.nombre}
                            </p>
                          </div>
                          <p className="mt-2 text-lg">{comentario.comentario}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 italic mt-4">
                              Publicado: {comentario.publicado}
                            </p>
                            <hr className="border-gray-300 my-2" />
                            <p className="text-center text-yellow-500">
                              {"⭐".repeat(comentario.estrellas)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flechas de navegacion entre cartas */}
      <div className="w-full flex justify-between absolute top-2/5">
        <button
          onClick={handlePrev}
          className="p-2 md:m-4 cursor-pointer -ml-5 bg-black rounded-full text-white"
        >
          <FaArrowLeft className="md:size-6"/>
        </button>
        <button
          onClick={handleNext}
          className="p-2 md:m-4 cursor-pointer -mr-5 bg-black rounded-full text-white"
        >
          <FaArrowRight className="md:size-6"/>
        </button>
      </div>
    </div>
  );
};

export default Slider;
