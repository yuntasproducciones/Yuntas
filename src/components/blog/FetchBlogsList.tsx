import { useEffect, useState } from "react";
import BlogCard from "../../components/blog/BlogCard.tsx";

interface Blog {
  id: number;
  nombre_producto: string;
  subtitulo: string;
  imagen_principal: string;
  link: string;
  imagenes?: { ruta_imagen: string; texto_alt: string }[];
  parrafos?: { parrafo: string }[];
}

export default function FetchBlogsList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBlogs, setTotalBlogs] = useState(0); 

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 640) {
        setItemsPerPage(6); // Para 2x3 layout en tablets
      } else {
        setItemsPerPage(5); // Para desktop o móvil
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const page = currentIndex + 1;
        const timestamp = new Date().getTime();
      
        const apiUrl = `https://apiyuntas.yuntaspublicidad.com/api/blogs?page=${page}&perPage=${itemsPerPage}&_t=${timestamp}`;
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener blogs: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();
        console.log('Blog API Response:', jsonResponse); // Debug

        if (jsonResponse.success) {
          // ✅ Aquí está el arreglo real de blogs
          const blogData = jsonResponse.data?.data || [];
          const blogsArray = Array.isArray(blogData) ? blogData : [blogData];

          const validBlogs = blogsArray.filter(blog =>
            blog && (blog.id || blog.title || blog.nombre_producto)
          );

          setBlogs(validBlogs);

          // ✅ Aquí están los metadatos
          const lastPage = jsonResponse.data?.last_page || 1;
          const total = jsonResponse.data?.total || 0;

          setTotalPages(lastPage);
          setTotalBlogs(total);
        } else {
          setBlogs([]);
          setTotalPages(1);
          setTotalBlogs(0);
        }

        
      } catch (err) {
        console.error("❌ Error al obtener blogs:", err);

        // Fallback simplificado
        try {
          const fallbackResponse = await fetch("/api/productos");
          const fallbackData = await fallbackResponse.json();
          const fallbackBlogs = Array.isArray(fallbackData.data) ? fallbackData.data : [fallbackData.data];
          setBlogs(fallbackBlogs);
          setTotalPages(1);
        } catch (fallbackErr) {
          console.error("❌ Error en fallback:", fallbackErr);
          setBlogs([]);
          setTotalPages(1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentIndex, itemsPerPage]); 

  const hasMorePages = () => {
    return blogs.length === itemsPerPage || currentIndex < totalPages - 1;
  };

  const canGoLeft = currentIndex > 0;
  const canGoRight = hasMorePages() && (currentIndex < totalPages - 1);

  const goLeft = () => {
    if (canGoLeft) setCurrentIndex(currentIndex - 1);
  };

  const goRight = () => {
    if (canGoRight) setCurrentIndex(currentIndex + 1);
  };

  const currentBlogs = blogs;

  if (loading) {
    return (
      <div className="min-h-screen grid place-content-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
          <p className="text-white text-2xl font-bold mb-2">Cargando blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-white text-3xl md:text-4xl font-bold uppercase tracking-wide">
          DESCUBRE MÁS SOBRE NUESTROS PRODUCTOS
        </h2>
      </div>

      {/* Cards Container */}
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="overflow-hidden">
          <div className="transition-transform duration-500 ease-in-out" style={{ transform: `translateX(0%)` }}>
            {currentBlogs.length > 0 ? (
              <>
                {/* Layout 2x3 para sm y md */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 place-items-center lg:hidden">
                  {currentBlogs.map((blog) => (
                    <div key={blog.id} className="group cursor-pointer transform transition-all duration-300">
                      <div className="rounded-2xl p-1">
                        <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl overflow-hidden w-[45vw] max-w-[250px] mx-auto">
                          <BlogCard blog={blog} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Layout 3 arriba + 2 abajo para ≥1024px */}
                <div className="hidden lg:block space-y-8">
                  <div className="grid grid-cols-3 gap-8 justify-items-center">
                    {currentBlogs.slice(0, 3).map((blog) => (
                      <div key={blog.id} className="group cursor-pointer transform transition-all duration-300">
                        <div className="rounded-2xl p-1">
                          <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl overflow-hidden max-w-[250px]">
                            <BlogCard blog={blog} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {currentBlogs.length > 3 && (
                    <div className="flex justify-center mt-12">
                      <div className="grid grid-cols-2 gap-24 max-w-2xl">
                        {currentBlogs.slice(3, 5).map((blog) => (
                          <div key={blog.id} className="group cursor-pointer transform transition-all duration-300">
                            <div className="rounded-2xl p-1">
                              <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl overflow-hidden max-w-[250px]">
                                <BlogCard blog={blog} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/70 text-xl">No hay blogs disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Navegación - Mostrar siempre si hay más de una página o más items disponibles */}
        {(totalPages > 1 || hasMorePages()) && (
          <>
            <div className="flex justify-center items-center mt-16 space-x-8">
              <button
                aria-label="Página anterior"
                title="Página anterior"
                onClick={goLeft}
                disabled={!canGoLeft}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  canGoLeft
                    ? "border-white/50 text-white hover:bg-white/10 hover:border-white cursor-pointer"
                    : "border-white/20 text-white/30 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl font-bold">&lt;</span>
              </button>

              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full">
                <span className="uppercase tracking-wide font-semibold text-lg">ver más</span>
              </div>

              <button
               aria-label="Página siguiente"
                title="Página siguiente"
                onClick={goRight}
                disabled={!canGoRight}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  canGoRight
                    ? "border-white/50 text-white hover:bg-white/10 hover:border-white cursor-pointer"
                    : "border-white/20 text-white/30 cursor-not-allowed"
                }`}
              >
                <span className="text-2xl font-bold">&gt;</span>
              </button>
            </div>

            {/* Paginación - Solo mostrar si conocemos el número total de páginas */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    aria-label={`Ir a la página ${i + 1}`}
                    title={`Ir a la página ${i + 1}`}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${ i === currentIndex ? "bg-white" : "bg-white/30 hover:bg-white/50" }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}