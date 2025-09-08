import { useEffect, useState } from "react";
import type Producto from "../../models/Product.ts";
import { config, getApiUrl } from "../../../config.ts";
import ProductCard from "./ProductCard.jsx";

export default function FetchProductsList() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🚀 Iniciando fetch de productos...');
        
        // Llamar directamente a la API de producción para evitar problemas de cache
        const timestamp = new Date().getTime();
        const apiUrl = `https://apiyuntas.yuntaspublicidad.com/api/v1/productos?_t=${timestamp}`;
        console.log('📡 URL del endpoint:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
            // Removemos headers de cache para evitar problemas CORS
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Respuesta no OK:', errorText);
          throw new Error(`Error al obtener productos de la API: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();

       if (jsonResponse.success && Array.isArray(jsonResponse.data)) {
        setProducts(jsonResponse.data);
      } else {
        console.error("Error en la respuesta:", jsonResponse.message);
        setProducts([]);
      }


      } catch (err) {
        console.error("Error al obtener productos:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <p className="grid place-content-center min-h-screen text-white text-3xl animate-pulse font-extrabold">
        Cargando productos...
      </p>
    );
  }
  // Calcular productos para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);
  
  // Calcular total de páginas
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  // Agrupar productos en filas de 4
  const rows = [];
 for (let i = 0; i < currentProducts.length; i += 3) {
  rows.push(currentProducts.slice(i, i + 3));
}

// Componente principal con grid modificado
return (
    <div className="w-full">
      {products.length > 0 ? (
        <>
          {/* Grid de productos agrupado por filas */}
          <div className="space-y-8">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="relative">
                {/* Fila de productos */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-4">

                  {row.map((producto, index) => (
                    <div key={startIndex + rowIndex * 4 + index} className="flex justify-center">
                      <ProductCard producto={producto} />
                    </div>
                  ))}
                  {/* Rellenar espacios vacíos si la fila no está completa */}
                {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, emptyIndex) => (
                <div key={`empty-${rowIndex}-${emptyIndex}`} className="invisible">
                  <div className="w-[280px] h-[200px]"></div>
                </div>
              ))}

                </div>
                
                {/* Línea decorativa por fila */}
                <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <>
              {/* Navegación estilo "ver más" */}
              <div className="flex justify-center items-center mt-16 space-x-8">
                {/* Botón Izquierda */}
                <button
                 aria-label="Página anterior"
                 title="Página anterior"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentPage > 1
                      ? "border-white/50 text-white hover:bg-white/10 hover:border-white cursor-pointer"
                      : "border-white/20 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <span className="text-2xl font-bold">&lt;</span>
                </button>

                {/* Botón VER MÁS */}
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full">
                  <span className="uppercase tracking-wide font-semibold text-lg">ver más</span>
                </div>

                {/* Botón Derecha */}
                <button
                  aria-label="Página siguiente"
                  title="Página siguiente"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentPage < totalPages
                      ? "border-white/50 text-white hover:bg-white/10 hover:border-white cursor-pointer"
                      : "border-white/20 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <span className="text-2xl font-bold">&gt;</span>
                </button>
              </div>

              {/* Paginación tipo dots */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  aria-label={`Ir a la página ${i + 1}`}
                  title={`Ir a la página ${i + 1}`}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full transition-all duration-300 ${
                    currentPage === i + 1 ? "bg-white" : "bg-white/30 hover:bg-white/50"
                  }`}
                />

                ))}
              </div>
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