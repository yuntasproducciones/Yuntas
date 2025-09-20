import { useState, useEffect } from "react";
import { blogService } from "../../services/blogService";
import useBlogSEO from "../../hooks/useBlogSEO";
import { buildImageUrl, getImageTitle } from "../../utils/imageHelpers";
import { insertJsonLd } from "../../utils/schema-markup-generator";

export default function BlogPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Usar el hook de SEO
  useBlogSEO(article);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const link = urlParams.get("link");

    console.log("🔗 Link obtenido desde URL:", link);

    if (!link) {
      setError("No se proporcionó un link de blog");
      setLoading(false);
      return;
    }

    const loadBlog = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogByLink(link);

        console.log("📝 Respuesta del servicio:", response);

        if (!response.success) {
          console.error("Error en la respuesta:", response.message);
          setError(response.message || "Error al cargar el blog");
          setLoading(false);
          return;
        }

        setArticle(response.data);
        insertJsonLd("blog", response);
        console.log("✅ Blog cargado correctamente:", response.data);
      } catch (err) {
        console.error("❌ Error cargando blog:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, []);

  if (loading) {
    return (
      <p className="grid min-h-screen place-content-center text-5xl font-extrabold animate-pulse bg-blue-200">
        Cargando...
      </p>
    );
  }

  if (error || !article) {
    return (
      <div className="grid min-h-screen place-content-center text-center bg-blue-200">
        <div>
          <p className="text-5xl font-extrabold mb-4">Blog no encontrado</p>
          <p className="text-xl">
            {error || "El artículo solicitado no existe o ha sido eliminado."}
          </p>
          <a
            href="/blogs"
            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Volver al blog
          </a>
        </div>
      </div>
    );
  }

  console.log("🌟 article:", article);

  // Convierte una URL de YouTube a formato embebido
  const getEmbeddedVideoUrl = (url) => {
    if (!url) return null;

    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/
    );

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    return url;
  };

  return (
    <>
      {/* Imagen principal con encabezado */}
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
        ) : article.imagenes?.length > 0 ? (
          <img
            src={buildImageUrl(article.imagenes[0].ruta_imagen)}
            alt={article.imagenes[0].texto_alt || "Imagen del blog"}
            title={getImageTitle(article.imagenes[0], "Imagen del blog")}
            className="w-full max-h-[100vh] object-cover"
          />
        ) : (
          <div className="w-full h-[50vh] flex items-center justify-center bg-gray-200 text-gray-500">
            Sin imagen disponible
          </div>
        )}
      </section>

      {/* Título principal */}
      <div className="w-full bg-white text-blue-950 text-center py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold">
          {article.nombre_producto}
        </h2>
      </div>

      {/* Contenido del blog */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-24 py-16 text-white bg-gradient-to-b from-blue-900 to-indigo-950 flex flex-col">
        <div className="Montserrat relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          {/* Header animado */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white animate-float">
              {article.subtitulo || "Descubre nuestro blog"}
            </h1>
          </div>

          {/* Secciones dinámicas */}
          <div className="space-y-12 mb-16">
            {article.parrafos?.map((p, index) => {
              const image = article.imagenes?.[index % article.imagenes.length];
              const isEven = index % 2 === 0;
              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } items-center gap-6 sm:gap-8 lg:gap-12 p-6 lg:p-8 rounded-3xl hover:scale-105 hover:shadow-2xl group cursor-pointer`}
                >
                  {image && (
                    <div className="flex-none w-full lg:w-80 h-48 lg:h-56 order-1 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-cyan-500/30">
                      <img
                        src={buildImageUrl(image.ruta_imagen)}
                        alt={image.texto_alt || "Imagen del blog"}
                        title={getImageTitle(image, "Imagen del blog")}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="flex-1 order-2">
                    <p
                      className="text-base sm:text-lg leading-relaxed text-white/90 text-justify"
                      dangerouslySetInnerHTML={{ __html: p.parrafo }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sección de Video */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-4 overflow-hidden">
        {/* ... sin cambios en video */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Mira nuestro video
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto animate-fade-in delay-200">
              Descubre más detalles sobre nuestros productos y servicios en este
              video explicativo
            </p>
          </div>

          <div className="relative group">
            <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500">
              <div className="aspect-video w-full relative">
                {!article.url_video && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white/80 text-xl font-medium mb-2">
                        Video próximamente
                      </p>
                    </div>
                  </div>
                )}
                {article.url_video && (
                  <iframe
                    src={getEmbeddedVideoUrl(article.url_video)}
                    title="Video"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
