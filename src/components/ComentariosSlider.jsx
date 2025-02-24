import React, { useState, useEffect, useRef } from "react";

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
                        <div className="h-80 bg-white text-black rounded-2xl p-4 shadow-lg">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex justify-center items-center bg-black text-white rounded-full">
                              {comentario.nombre.charAt(0)}
                            </div>
                            <p className="text-lg font-semibold">
                              {comentario.nombre}
                            </p>
                          </div>
                          <p className="mt-2">{comentario.comentario}</p>
                          <p className="text-sm text-gray-500 italic mt-4">
                            Publicado: {comentario.publicado}
                          </p>
                          <hr className="border-gray-300 my-2" />
                          <p className="text-center text-yellow-500">
                            {"⭐".repeat(comentario.estrellas)}
                          </p>
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
      <button
        onClick={handlePrev}
        className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-black text-white p-2 md:m-4 rounded-full z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-black text-white p-2 md:m-4 rounded-full z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Slider;
