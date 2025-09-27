import useBlogSEO from "../../hooks/useBlogSEO";
import { buildImageUrl, getImageTitle } from "../../utils/imageHelpers";
/**
 * @param {{ article: import('../../models/Blog').default }} props
 */
// 1. Aceptamos 'article' como una prop en la definición del componente
export default function BlogPage({ article }) {
  
  // Usamos el hook de SEO con la prop que recibimos
  useBlogSEO(article);

  // 3. Añadimos una validación por si la prop no llega
  if (!article) {
    return (
      <div className="grid min-h-screen place-content-center text-center bg-red-100">
        <p className="text-3xl font-bold text-red-700">
          Error: No se recibieron los datos del artículo.
        </p>
      </div>
    );
  }

  const getEmbeddedVideoUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    return url;
  };

  // 4. El resto del código que renderiza el HTML se queda igual
  return (
    <>
      <section className="relative">
        {article.imagen_principal ? (
          <img
            src={buildImageUrl(article.imagen_principal)}
            alt={article.nombre_producto || "Imagen principal del blog"}
            title={getImageTitle(
              article.imagen_principal,
              "Imagen principal del blog"
            )}
            className="w-full max-h-[100vh] object-cover"
          />
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center bg-gray-200 text-gray-500">
            Sin imagen disponible
          </div>
        )}
      </section>

      <div className="w-full bg-white text-blue-950 text-center py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
          {article.nombre_producto}
        </h2>
      </div>

      <section className="px-4 sm:px-8 md:px-12 lg:px-24 py-16 text-white bg-gradient-to-b from-blue-900 to-indigo-950 flex flex-col">
        <div className="Montserrat relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white animate-float">
              {article.subtitulo || "Descubre nuestro blog"}
            </h1>
          </div>

          <div className="space-y-12 mb-16">
            {article.parrafos?.map((p, index) => {
              const image = article.imagenes?.[index % article.imagenes.length];
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-12 p-8 rounded-3xl`}
                >
                  {image && (
                    <div className="flex-none w-full lg:w-80 h-56 rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <img
                        src={buildImageUrl(image.ruta_imagen)}
                        alt={image.texto_alt || "Imagen del blog"}
                        title={getImageTitle(image, "Imagen del blog")}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p
                      className="text-lg leading-relaxed text-white/90 text-justify"
                      dangerouslySetInnerHTML={{ __html: p.parrafo }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

       <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-4 overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Mira nuestro video
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Descubre más detalles sobre nuestros productos y servicios
            </p>
          </div>

          <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <div className="aspect-video w-full relative">
              {article.url_video ? (
                 <iframe
                    src={getEmbeddedVideoUrl(article.url_video)}
                    title="Video"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white/80 text-xl font-medium">Video próximamente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}