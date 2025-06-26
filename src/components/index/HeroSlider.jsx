import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./HeroSlider.css"; // Importa estilos personalizados para los indicadores
import imagen1 from "../../assets/images/inicio/slider/slider-1.webp";
import imagen2 from "../../assets/images/inicio/slider/slider_2.webp";
import imagen3 from "../../assets/images/inicio/slider/slider_3.webp";

const images = [imagen1, imagen2, imagen3];

const HeroSlider = () => {
  return (
    <section className="relative w-full h-screen select-none overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="w-full h-full"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={img.src ? img.src : img}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover absolute inset-0"
              draggable="false"
              loading="eager"
              style={{ minHeight: "100vh" }}
            />
            {/* Texto sobre el slider */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-8 pointer-events-none z-20">
              <div
                className="bg-cyan-400/95 rounded-full px-8 py-2 mb-4 shadow-lg border-4 border-cyan-300 flex items-center justify-center"
                style={{
                  boxShadow: "0 4px 24px 0 rgba(0, 188, 212, 0.25)",
                  minWidth: "270px",
                  maxWidth: "90vw",
                }}
              >
                <span className="text-white font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl Montserrat tracking-wide" style={{ letterSpacing: "0.05em" }}>
                  ESPECIALISTAS
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl Montserrat font-black text-white sombra-title">
                EN DISEÑAR TU ESPACIO
              </h1>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;