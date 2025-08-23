import { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import useBlogSEO from "../../hooks/useBlogSEO";
export default function BlogPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 // Usar el hook de SEO
  useBlogSEO(article);
  useEffect(() => {
    // Obtener el parámetro 'link' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const link = urlParams.get('link');
    
    console.log('🔗 Link obtenido desde URL:', link);

    if (!link) {
      setError('No se proporcionó un link de blog');
      setLoading(false);
      return;
    }

    // Cargar el blog
    const loadBlog = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogByLink(link);
        
        console.log('📝 Respuesta del servicio:', response);
        
        if (!response.success) {
          console.error('Error en la respuesta:', response.message);
          setError(response.message || 'Error al cargar el blog');
          setLoading(false);
          return;
        }

        setArticle(response.data);
        console.log('✅ Blog cargado correctamente:', response.data);
      } catch (err) {
        console.error('❌ Error cargando blog:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, []);

  if (loading) {
    return <p className="grid min-h-screen place-content-center text-5xl font-extrabold animate-pulse bg-blue-200">Cargando...</p>
  }

  if (error || !article) {
    return (
      <div className="grid min-h-screen place-content-center text-center bg-blue-200">
        <div>
          <p className="text-5xl font-extrabold mb-4">Blog no encontrado</p>
          <p className="text-xl">{error || 'El artículo solicitado no existe o ha sido eliminado.'}</p>
          <a href="/blogs" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Volver al blog
          </a>
            </div>
          </div>
    );
  }
// Función para armar la URL correcta de la imagen
   const buildImageUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http") ? path : imageBaseUrl + path;
  };
  console.log("🌟 article:", article);
  return (
    <>
      {/* Imagen principal con encabezado */}
      <section className="relative">
        {article.imagen_principal ? (
          <img
            src={buildImageUrl(article.imagen_principal)}
            alt={article.nombre_producto || "Imagen principal del blog"}
            className="w-full max-h-[100vh] object-cover"
          />
        ) : article.imagenes?.length > 0 ? (
          <img
            src={buildImageUrl(article.imagenes[0].ruta_imagen)}
            alt={article.imagenes[0].texto_alt || "Imagen del blog"}
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
                className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-6 sm:gap-8 lg:gap-12 p-6 lg:p-8 rounded-3xl hover:scale-105 hover:shadow-2xl group cursor-pointer`}
              >
                {image && (
                  <div className="flex-none w-full lg:w-80 h-48 lg:h-56 order-1 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500 group-hover:shadow-cyan-500/30">
                    <img
                      src={buildImageUrl(image.ruta_imagen)}
                      alt={image.texto_alt || "Imagen del blog"}
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
        {/* Efectos de fondo animados */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Título de la sección */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Mira nuestro video
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto animate-fade-in delay-200">
              Descubre más detalles sobre nuestros productos y servicios en este video explicativo
            </p>
          </div>

          {/* Container del video con efectos premium */}
          <div className="relative group">
            {/* Marco decorativo exterior */}
            <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-700 animate-pulse"></div>
            
            {/* Video container principal */}
            <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:border-white/20 transition-all duration-500">
              <div className="aspect-video w-full relative">
                {/* Placeholder elegante mientras no hay video */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 to-slate-900/90 flex items-center justify-center">
                  <div className="text-center">
                    {/* Play button con animaciones premium */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-ping opacity-20"></div>
                      <div className="relative w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl hover:scale-110 hover:shadow-cyan-500/50 transition-all duration-300 cursor-pointer group-hover:shadow-2xl">
                        <svg 
                          className="w-10 h-10 text-white ml-1 drop-shadow-lg" 
                          fill="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                    <p className="text-white/80 text-xl font-medium mb-2">Video próximamente</p>
                    <p className="text-white/50 text-sm">Haz clic para reproducir cuando esté disponible</p>
                  </div>
                </div>

                {/* Aquí irá el iframe del video cuando se implemente */}
              </div>

              {/* Overlay de efectos en las esquinas */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-400/60 rounded-tl-lg transition-all duration-300 group-hover:border-cyan-400/90"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-400/60 rounded-tr-lg transition-all duration-300 group-hover:border-cyan-400/90"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-400/60 rounded-bl-lg transition-all duration-300 group-hover:border-cyan-400/90"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-400/60 rounded-br-lg transition-all duration-300 group-hover:border-cyan-400/90"></div>
            </div>

            {/* Partículas decorativas */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400/40 rounded-full animate-bounce delay-100"></div>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400/40 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400/40 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-400/40 rounded-full animate-bounce delay-700"></div>
          </div>
        </div>

        {/* Línea divisoria decorativa */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      </section>
    </>
  );
}