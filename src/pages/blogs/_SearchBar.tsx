import { useState, useEffect, useRef } from "react";

interface Blog {
  id: number;
  nombre_producto: string;
  subtitulo: string;
  imagen_principal: string;
  text_alt_principal: string;
  link: string;
  imagenes?: { ruta_imagen: string; texto_alt: string }[];
  parrafos?: { parrafo: string }[];
}

interface BlogSearchBarProps {
  blogs: Blog[];
  onFilteredBlogs: (blogs: Blog[]) => void;
}

const BlogSearchBar: React.FC<BlogSearchBarProps> = ({
  blogs,
  onFilteredBlogs,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Función para extraer nombres únicos de blogs
  const getBlogTitles = (): string[] => {
    const titles = new Set<string>();

    blogs.forEach((blog) => {
      const title = blog.nombre_producto || "";

      if (title.trim()) {
        titles.add(title.trim());
      }
    });

    return Array.from(titles);
  };

  // Función para generar sugerencias basadas en el término de búsqueda
  const generateSuggestions = (term: string): string[] => {
    if (term.length === 0) return [];

    const allTitles = getBlogTitles();
    const lowerTerm = term.toLowerCase();

    // Filtrar títulos que contengan el término de búsqueda
    const matchingSuggestions = allTitles.filter((title) =>
      title.toLowerCase().includes(lowerTerm)
    );

    // Ordenar por relevancia (exacto primero, luego por posición del match)
    return matchingSuggestions
      .sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();

        // Coincidencias exactas primero
        if (aLower === lowerTerm) return -1;
        if (bLower === lowerTerm) return 1;

        // Que empiece con el término
        if (aLower.startsWith(lowerTerm) && !bLower.startsWith(lowerTerm))
          return -1;
        if (bLower.startsWith(lowerTerm) && !aLower.startsWith(lowerTerm))
          return 1;

        // Por posición del match
        return aLower.indexOf(lowerTerm) - bLower.indexOf(lowerTerm);
      })
      .slice(0, 6);
  };

  // Función para filtrar blogs
  const filterBlogs = (term: string): Blog[] => {
    if (!term.trim()) {
      return blogs;
    }

    const lowerTerm = term.toLowerCase();

    return blogs.filter((blog) => {
      const blogTitle = (blog.nombre_producto || "").toLowerCase();

      return blogTitle.includes(lowerTerm);
    });
  };

  // Efecto para manejar cambios en el término de búsqueda
  useEffect(() => {
    // Filtrar blogs
    const filtered = filterBlogs(searchTerm);
    onFilteredBlogs(filtered);

    // Generar sugerencias
    if (searchTerm.length > 0) {
      const newSuggestions = generateSuggestions(searchTerm);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, blogs]);

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
      <div className="bg-gray-300 rounded-2xl p-8 w-full flex items-center relative">
        <div className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder="Buscar blogs..."
            className="w-full bg-white placeholder-black px-6 py-3 rounded-full text-black text-xl focus:outline-none"
          />

          {/* Botón limpiar / Icono de búsqueda */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                title="Limpiar búsqueda"
              ></button>
            )}
            <svg
              className="w-6 h-6 text-gray-500"
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
          <div className="absolute top-2 left-8 right-8 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-60 overflow-y-auto">
            <div className="p-2">
              <div className="text-xs text-gray-500 px-3 py-2 font-semibold uppercase tracking-wide border-b border-gray-100">
                Sugerencias de blogs ({suggestions.length})
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-3 hover:bg-gray-100 rounded-lg text-black transition-colors duration-150 flex items-center space-x-3"
                >
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  <span className="text-sm font-medium">{suggestion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogSearchBar;
