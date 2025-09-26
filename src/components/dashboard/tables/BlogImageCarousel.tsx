// src/components/tu/carpeta/BlogImageCarousel.tsx

import React, { useState, useEffect } from 'react';

// Importa Swiper y sus componentes
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

// Importa los estilos de Swiper (¡muy importante!)
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Define las props que el componente recibirá
interface BlogImageCarouselProps {
  item: {
    id: number;
    imagen_principal: string;
    nombre_producto?: string;
    imagenes?: { ruta_imagen: string; text_alt?: string }[];
  };
  getImageUrl: (path: string) => string;
}

const BlogImageCarousel: React.FC<BlogImageCarouselProps> = ({ item, getImageUrl }) => {
  // Estado para guardar la instancia de Swiper y poder actualizarla
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
  
  const totalSlides = 1 + (item.imagenes?.length || 0);

  // Este useEffect es clave: se asegura de que Swiper se actualice si los datos cambian.
  useEffect(() => {
    if (swiperInstance) {
      swiperInstance.update();
    }
  }, [item, swiperInstance]);


  if (totalSlides <= 1) {
    return (
      <img
        src={getImageUrl(item.imagen_principal)}
        alt={item.nombre_producto || "Blog"}
        className="w-full max-w-[120px] h-20 object-cover rounded-lg shadow-md"
      />
    );
  }

  return (
    <Swiper
      // Guarda la instancia de Swiper en el estado cuando se inicializa
      onSwiper={setSwiperInstance}
      modules={[Pagination, Autoplay]}
      spaceBetween={10}
      slidesPerView={1}
      // Lógica robusta para loop y rewind
      loop={totalSlides >= 3}
      rewind={totalSlides === 2}
      speed={800}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{ clickable: true }}
      className="w-full max-w-[120px] h-20 rounded-lg shadow-md"
    >
      {/* Imagen principal */}
      <SwiperSlide key={`slide-principal-${item.id}`}>
        <img
          src={getImageUrl(item.imagen_principal)}
          alt={item.nombre_producto || "Blog"}
          className="w-full h-20 object-cover rounded-lg"
        />
      </SwiperSlide>

      {/* Otras imágenes */}
      {item.imagenes?.map((img, i) => (
      <SwiperSlide key={`slide-${item.id}-${i}`}>
        <img
          src={getImageUrl(img.ruta_imagen)}
          alt={img.text_alt || "Imagen extra"}
          className="w-full h-20 object-cover rounded-lg"
        />
      </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BlogImageCarousel;