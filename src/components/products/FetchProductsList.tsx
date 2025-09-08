import { useEffect, useState } from "react";
import type Producto from "../../models/Product.ts";
import { config, getApiUrl } from "../../../config";
import ProductCard from "./ProductCard.jsx";

export default function FetchProductsList() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // empieza en 0
  const [itemsPerPage, setItemsPerPage] = useState(6); // Hacerlo dinámico como en blogs
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0); // Nuevo estado para el total
  const [loading, setLoading] = useState(true);

  // **NUEVO**: Función para detectar si hay más páginas
  const hasMorePages = () => {
    return products.length === itemsPerPage;
  };

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < totalPages - 1 || hasMorePages();

  const goLeft = () => {
    if (canGoLeft) setCurrentIndex(prev => prev - 1);
  };

  const goRight = () => {
    if (canGoRight) setCurrentIndex(prev => prev + 1);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const page = currentIndex + 1;
        const timestamp = new Date().getTime();
        const apiUrl = `https://apiyuntas.yuntaspublicidad.com/api/v1/productos?page=${page}&perPage=${itemsPerPage}&_t=${timestamp}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener productos: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();
        console.log('API Response:', jsonResponse); // Debug: ver la estructura completa

        if (jsonResponse.success) {
          const validProducts = Array.isArray(jsonResponse.data) ? jsonResponse.data : [];
          setProducts(validProducts);
          
          // **SECCIÓN MEJORADA**: Calcular paginación igual que en blogs
          let lastPage = 1;
          let total = 0;
          
          // Primero intentar obtener de meta
          if (jsonResponse.meta?.last_page) {
            lastPage = jsonResponse.meta.last_page;
            total = jsonResponse.meta.total || 0;
          } 
          // Luego intentar obtener directamente
          else if (jsonResponse.last_page) {
            lastPage = jsonResponse.last_page;
            total = jsonResponse.total || 0;
          } 
          // Si no hay información de paginación, intentar calcular
          else {
            // Si tenemos el total, calcularlo
            total = jsonResponse.total || jsonResponse.meta?.total || 0;
            
            if (total > 0) {
              lastPage = Math.ceil(total / itemsPerPage);
            } else {
              // **NUEVO**: Si no tenemos total, usar lógica de detección
              if (validProducts.length === itemsPerPage) {
                // Si tenemos exactamente itemsPerPage, probablemente hay más páginas
                lastPage = Math.max(currentIndex + 2, 2);
              } else if (validProducts.length < itemsPerPage && currentIndex === 0) {
                // Si en la primera página tenemos menos items, solo hay una página
                lastPage = 1;
              } else if (validProducts.length < itemsPerPage) {
                // Si tenemos menos items en una página posterior, es la última
                lastPage = currentIndex + 1;
              } else {
                // Caso por defecto
                lastPage = Math.max(currentIndex + 1, 1);
              }
              
              // Estimar el total basado en los resultados
              if (validProducts.length < itemsPerPage) {
                total = (currentIndex * itemsPerPage) + validProducts.length;
              } else {
                total = (currentIndex + 1) * itemsPerPage; // Estimación mínima
              }
            }
          }
          
          setTotalPages(lastPage);
          setTotalProducts(total);
          console.log('Products pagination info:', { 
            currentPage: currentIndex + 1, 
            lastPage, 
            total, 
            itemsPerPage, 
            productsInCurrentPage: validProducts.length 
          }); // Debug mejorado
          
        } else {
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentIndex, itemsPerPage]); // Agregué itemsPerPage como dependencia

  if (loading) {
    return (
      <p className="grid place-content-center min-h-screen text-white text-3xl animate-pulse font-extrabold">
        Cargando productos...
      </p>
    );
  }

  // Agrupar productos en filas de 3
  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  return (
    <div className="w-full">
      {products.length > 0 ? (
        <>
          <div className="space-y-8">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-4">
                  {row.map((producto, index) => (
                    <div key={rowIndex * 3 + index} className="flex justify-center">
                      <ProductCard producto={producto} />
                    </div>
                  ))}
                  {row.length < 3 &&
                    Array.from({ length: 3 - row.length }).map((_, emptyIndex) => (
                      <div
                        key={`empty-${rowIndex}-${emptyIndex}`}
                        className="invisible"
                      >
                        <div className="w-[280px] h-[200px]"></div>
                      </div>
                    ))}
                </div>
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </div>
            ))}
          </div>
          {/* Navegación y paginación - Mostrar siempre si hay más de una página o más items disponibles */}
          {(totalPages > 1 || hasMorePages()) && (
            <>
              {/* Navegación estilo "ver más" */}
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

              {/* Dots de paginación - Solo mostrar si conocemos el número total de páginas */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      aria-label={`Ir a la página ${i + 1}`}
                      title={`Ir a la página ${i + 1}`}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i === currentIndex
                          ? "bg-white"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <div className="text-white text-center py-12">
          <p>No hay productos disponibles</p>
        </div>
      )}
    </div>
  );
}