import { useState } from 'react';

interface Blog {
  id: number;
  nombre_producto: string;
  subtitulo: string;
  imagen_principal: string;
  link?: string;
  imagenes?: { ruta_imagen: string; texto_alt: string }[];
  parrafos?: { parrafo: string }[];
}

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Construir la URL completa de la imagen
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-image.jpg';
    
    // Si ya es una URL completa, usarla tal como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si es una ruta relativa, construir la URL completa
    const baseUrl = 'https://apiyuntas.yuntaspublicidad.com';
    return `${baseUrl}${imagePath}`;
  };

  const handleCardClick = () => {
    // Cambiar a query parameters (como en productos)
    window.location.href = `/blogs/blog/?link=${blog.link}`;
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 cursor-pointer hover:scale-105 w-[260px] h-[320px] flex flex-col"
    >
      <div className="relative w-full h-[150px] overflow-hidden flex-shrink-0">
        {!imageError ? (
          <img
            src={getImageUrl(blog.imagen_principal)}
            alt={blog.nombre_producto}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <svg 
                className="mx-auto h-10 w-10 text-gray-400 mb-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-gray-500 text-xs">Imagen no disponible</p>
            </div>
          </div>
        )}
      </div>
      <div className="px-6 py-2 flex-1 flex flex-col justify-center items-center min-h-[70px] max-h-[110px] text-center">
        <h3 className="w-full text-base font-semibold text-gray-800 mb-1 text-center uppercase leading-tight line-clamp-2 max-h-[48px]">
          {blog.nombre_producto}
        </h3>
        {blog.subtitulo && (
          <p className="w-full text-gray-600 text-sm text-center leading-tight line-clamp-2 max-h-[36px]">
            {blog.subtitulo}
          </p>
        )}
      </div>
    </div>
  );
}