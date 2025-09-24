import { useState, useEffect, useRef } from "react";
import type Producto from "../../models/Product";

interface ProductSearchBarProps {
  products: Producto[];
  onFilteredProducts: (products: Producto[]) => void;
}

const ProductSearchBar: React.FC<ProductSearchBarProps> = ({
  products,
  onFilteredProducts,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Función para extraer nombres únicos de productos
  const getProductNames = (): string[] => {
    const names = new Set<string>();

    products.forEach((product) => {
      const name = product.title || product.titulo || product.nombre || "";
      if (name.trim()) {
        names.add(name.trim());
      }
    });

    return Array.from(names);
  };

  // Función para generar sugerencias de nombres
  const generateSuggestions = (term: string): string[] => {
    if (term.length === 0) return [];

    const allNames = getProductNames();
    const lowerTerm = term.toLowerCase();

    // Filtrar nombres que contengan el término de búsqueda
    const matchingSuggestions = allNames.filter((name) =>
      name.toLowerCase().includes(lowerTerm)
    );

    // Ordenar por relevancia
    return matchingSuggestions
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();

        // Coincidencias exactas
        if (aLower === lowerTerm) return -1;
        if (bLower === lowerTerm) return 1;

        // Que empiece con la palabra
        if (aLower.startsWith(lowerTerm) && !bLower.startsWith(lowerTerm))
          return -1;
        if (bLower.startsWith(lowerTerm) && !aLower.startsWith(lowerTerm))
          return 1;

        // Por posición
        return aLower.indexOf(lowerTerm) - bLower.indexOf(lowerTerm);
      })
      .slice(0, 6); // Máximo de sugerencias
  };

  // Función para filtrar productos
  const filterProducts = (term: string): Producto[] => {
    if (!term.trim()) {
      return products; // Mostrar todos si no se esta buscando nada
    }

    const lowerTerm = term.toLowerCase();

    return products.filter((product) => {
      const productName = (
        product.title ||
        product.titulo ||
        product.nombre ||
        ""
      ).toLowerCase();

      return productName.includes(lowerTerm);
    });
  };

  // Efecto para manejar cambios en la búsqueda
  useEffect(() => {
    // Filtrar productos
    const filtered = filterProducts(searchTerm);
    onFilteredProducts(filtered);

    // Generar sugerencias
    if (searchTerm.length > 0) {
      const newSuggestions = generateSuggestions(searchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, products]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0 && searchTerm.length > 0) {
      setShowSuggestions(true);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <div className="w-full mb-8" ref={searchRef}>
      {/* Barra de búsqueda */}
      <div className="relative w-full mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Buscar productos..."
            className="w-full bg-gradient-to-r from-gray-800 to-gray-900 border-2 border-gray-700 placeholder-gray-400 px-6 py-4 pr-16 rounded-2xl text-white text-xl focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 shadow-xl"
          />

          {/* Botón limpiar / Icono de búsqueda */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-200 hover:scale-110"
                title="Limpiar búsqueda"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
            <svg
              className="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="relative">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-700 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto backdrop-blur-sm">
            <div className="p-3">
              <div className="text-xs text-cyan-400 px-4 py-2 font-bold uppercase tracking-wider border-b border-gray-700 flex items-center space-x-2">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Sugerencias ({suggestions.length})</span>
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-700/50 rounded-xl text-white transition-all duration-200 flex items-center space-x-3 group hover:scale-[1.02] hover:border-l-2 hover:border-cyan-400"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium group-hover:text-cyan-100 transition-colors">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearchBar;
