import { useState } from "react";
import { buildImageUrl, getImageTitle } from "../../utils/imageHelpers";

interface Blog {
  id: number;
  nombre_producto: string;
  subtitulo: string;
  imagen_principal: string;
  text_alt_principal: string;
  link?: string;
  imagenes?: { ruta_imagen: string; texto_alt: string }[];
  parrafos?: { parrafo: string }[];
}

interface BlogCardProps {
  blog: Blog;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const imagenUrl = buildImageUrl(blog.imagen_principal);
  const titulo = blog.nombre_producto || "Blog sin título";

  return (
    <a
      href={`/blogs/${blog.link}`}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:scale-105 w-[250px] h-[320px] flex flex-col"
    >
      <div className="relative w-full h-[200px] overflow-hidden flex-shrink-0">
        {!imageError && imagenUrl ? (
          <img
            src={imagenUrl}
            alt={blog.text_alt_principal || titulo}
            title={getImageTitle(imagenUrl, titulo)}
            className="w-full h-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
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

      <div className="px-4 py-1 flex-1 flex flex-col justify-center items-center min-h-[60px] max-h-[90px] text-center">
        <h3 className="w-full flex justify-center items-center text-base font-semibold text-gray-800 mb-1 text-center uppercase leading-tight line-clamp-3 max-h-[48px]">
          {titulo}
        </h3>
        {blog.subtitulo && (
          <p className="w-full flex justify-center items-center text-gray-600 text-sm text-center leading-tight line-clamp-3 max-h-[36px]">
            {blog.subtitulo}
          </p>
        )}
      </div>
    </a>
  );
}


