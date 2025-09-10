import { useEffect, useState } from "react";
import type Producto from "../../models/Product.ts";
import ProductCard from "./ProductCard.jsx";

export default function FetchProductsList() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const page = currentIndex + 1;
        const apiUrl = `https://apiyuntas.yuntaspublicidad.com/api/v1/productos?page=${page}&per_page=${itemsPerPage}`;

        const response = await fetch(apiUrl, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const json = await response.json();
        console.log("Laravel response completo:", json);

        if (json && Array.isArray(json.data)) {
          // Si json.data contiene los productos transformados por ProductoResource
          setProducts(json.data);
          setTotalPages(json.last_page || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentIndex]);

  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  const goLeft = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const goRight = () => {
    if (currentIndex < totalPages - 1) setCurrentIndex(currentIndex + 1);
  };

  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < totalPages - 1;

  if (loading) {
    return (
      <p className="grid place-content-center min-h-screen text-white text-3xl animate-pulse font-extrabold">
        Cargando productos...
      </p>
    );
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

          {/* Paginación */}
          {totalPages > 1 && (
            <>
              <div className="flex justify-center items-center mt-16 space-x-8">
                <button
                  onClick={goLeft}
                  disabled={!canGoLeft}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    canGoLeft
                      ? "border-white/50 text-white hover:bg-white/10 hover:border-white cursor-pointer"
                      : "border-white/20 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <span className="text-2xl font-bold">&lt;</span>
                </button>

                <div className="px-8 py-4 rounded-full bg-white/10 text-white border-2 border-white/30 font-semibold text-lg tracking-wide uppercase">
                  ver más
                </div>

                <button
                  onClick={goRight}
                  disabled={!canGoRight}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    canGoRight
                      ? "border-white/50 text-white hover:bg-white/10 hover:border-white cursor-pointer"
                      : "border-white/20 text-white/30 cursor-not-allowed"
                  }`}
                >
                  <span className="text-2xl font-bold">&gt;</span>
                </button>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/50"
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
