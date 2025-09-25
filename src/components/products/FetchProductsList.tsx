import { useEffect, useState } from "react";
import type Producto from "../../models/Product.ts";
import ProductCard from "./ProductCard.jsx";
import ProductSearchBar from "../../pages/products/ProductSearchBar.tsx";

export default function FetchProductsList() {
  const [allProducts, setAllProducts] = useState<Producto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const itemsPerPage = 6;

  // Fetch inicial de productos
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        let allFetchedProducts: Producto[] = [];
        let currentPageToFetch = 1;
        let hasMorePages = true;

        // Obtener todos los productos de todas las páginas
        while (hasMorePages) {
          const apiUrl = `https://apiyuntas.yuntaspublicidad.com/api/v1/productos?page=${currentPageToFetch}&per_page=50`;

          const response = await fetch(apiUrl, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          const json = await response.json();

          if (json && Array.isArray(json.data) && json.data.length > 0) {
            allFetchedProducts = [...allFetchedProducts, ...json.data];

            // Verificar si hay más páginas
            if (json.current_page < json.last_page) {
              currentPageToFetch++;
            } else {
              hasMorePages = false;
            }
          } else {
            hasMorePages = false;
          }
        }

        console.log(
          "Todos los productos obtenidos:",
          allFetchedProducts.length
        );

        setAllProducts(allFetchedProducts);
        setFilteredProducts(allFetchedProducts);

        // Calcular páginas para mostrar
        setTotalPages(Math.ceil(allFetchedProducts.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  // Manejar productos filtrados desde el buscador
  const handleFilteredProducts = (products: Producto[]) => {
    setFilteredProducts(products);
    setIsSearchActive(
      products.length !== allProducts.length ||
        (products.length === 0 && allProducts.length > 0)
    );
    setCurrentPage(1); // Resetear
  };

  // Obtener productos para la página actual
  const getCurrentPageProducts = (): Producto[] => {
    if (isSearchActive) {
      // Si estamos buscando, mostrar todos los resultados filtrados
      return filteredProducts;
    } else {
      // Si no estamos buscando, mostrar paginado
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredProducts.slice(startIndex, endIndex);
    }
  };

  const currentProducts = getCurrentPageProducts();

  // Filas de 3 productos
  const createProductRows = (products: Producto[]) => {
    const rows = [];
    for (let i = 0; i < products.length; i += 3) {
      rows.push(products.slice(i, i + 3));
    }
    return rows;
  };

  const rows = createProductRows(currentProducts);

  const goLeft = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goRight = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const canGoLeft = currentPage > 1;
  const canGoRight = currentPage < totalPages;

  // Actualizar total de páginas cuando cambian los productos filtrados
  useEffect(() => {
    if (!isSearchActive) {
      setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    }
  }, [filteredProducts, isSearchActive]);

  if (loading) {
    return (
      <div className="grid place-content-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mb-4"></div>
          <p className="text-white text-2xl font-bold animate-pulse">
            Cargando productos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {allProducts.length > 0 ? (
        <>
          {/* Buscador de productos */}
          <ProductSearchBar
            products={allProducts}
            onFilteredProducts={handleFilteredProducts}
          />
          {/* Grid de productos */}
          {currentProducts.length > 0 ? (
            <div className="space-y-8 mb-12">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-4">
                    {row.map((producto, index) => (
                      <div
                        key={`${rowIndex}-${index}-${
                          producto.id || producto.title || index
                        }`}
                        className="flex justify-center"
                      >
                        <ProductCard producto={producto} />
                      </div>
                    ))}
                    {/* Espacios vacíos para mantener el grid */}
                    {row.length < 3 &&
                      Array.from({ length: 3 - row.length }).map(
                        (_, emptyIndex) => (
                          <div
                            key={`empty-${rowIndex}-${emptyIndex}`}
                            className="invisible"
                          >
                            <div className="w-[280px] h-[200px]"></div>
                          </div>
                        )
                      )}
                  </div>
                  <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
                </div>
              ))}
            </div>
          ) : (
            /* Mensaje cuando no hay resultados de búsqueda */
            <div className="text-white text-center py-16">
              <div className="bg-gray-800/50 rounded-2xl p-12 max-w-lg mx-auto">
                <h3 className="text-2xl font-bold mb-3">
                  No se encontraron productos
                </h3>
                <p className="text-gray-300 text-lg">
                  Intenta con otros términos de búsqueda o{" "}
                  <button
                    onClick={() => {
                      setFilteredProducts(allProducts);
                      setIsSearchActive(false);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 underline font-semibold transition-colors"
                  >
                    ver todos los productos
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Paginación - Solo mostrar si no estamos buscando y hay múltiples páginas */}
          {totalPages > 1 && !isSearchActive && (
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
                  title={
                    canGoLeft ? "Página anterior" : "No hay página anterior"
                  }
                >
                  <span className="text-2xl font-bold">&lt;</span>
                </button>

                <div className="px-8 py-4 rounded-full bg-white/10 text-white border-2 border-white/30 font-semibold text-lg tracking-wide uppercase">
                  Página {currentPage} de {totalPages}
                </div>

                <button
                  onClick={goRight}
                  disabled={!canGoRight}
                  className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    canGoRight
                      ? "border-white/50 text-white hover:bg-white/10 hover:border-white cursor-pointer"
                      : "border-white/20 text-white/30 cursor-not-allowed"
                  }`}
                  title={
                    canGoRight ? "Página siguiente" : "No hay página siguiente"
                  }
                >
                  <span className="text-2xl font-bold">&gt;</span>
                </button>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i + 1 === currentPage
                        ? "bg-white"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    title={`Ir a página ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        /* Mensaje cuando no hay productos en absoluto */
        <div className="text-white text-center py-16">
          <div className="bg-gray-800/50 rounded-2xl p-12 max-w-lg mx-auto">
            <svg
              className="w-20 h-20 text-gray-400 mx-auto mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="text-2xl font-bold mb-3">
              No hay productos disponibles
            </h3>
            <p className="text-gray-300 text-lg">
              Intenta recargar la página o contacta al administrador
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
