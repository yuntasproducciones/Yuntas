import { useState, useEffect } from "react";

interface Blog {
    id: number;
    titulo: string;
    descripcion: string;
    imagenPrincipal: string;
}

interface SearchBarProps {
    articles: Blog[];
}

const SearchBar: React.FC<SearchBarProps> = ({ articles }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredArticles, setFilteredArticles] = useState<Blog[]>(articles);

    useEffect(() => {
        const filtered = articles.filter((a) =>
            a.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredArticles(filtered);
    }, [searchTerm, articles]);

    return (
        <div className="w-full">
            {/* Barra de búsqueda */}
            <div className="bg-gray-300 rounded-2xl p-8 w-full flex items-center relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar..."
                    className="w-full bg-white placeholder-black px-6 py-3 rounded-full text-black text-xl focus:outline-none"
                />
            </div>

            {/* Resultados */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 mt-10">
                {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                        <a
                            key={article.id}
                            href={`/blogs/${article.id}`}
                            className="block w-full p-4"
                        >
                            <div className="bg-white rounded-2xl text-black h-96 w-full my-10 hover:scale-110 transition-all duration-300 shadow-2xl">
                                <img
                                    src={article.imagenPrincipal}
                                    alt={article.titulo}
                                    className="w-full object-cover rounded-t-2xl object-center h-1/2"
                                />
                                <div className="h-2/5 w-full px-4 py-1">
                                    <p className="font-bold text-xl">{article.titulo}</p>
                                    <p className="text-lg">{article.descripcion}</p>
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <p className="text-white mt-6 text-lg col-span-full text-center">
                        No se encontraron artículos.
                    </p>
                )}
            </div>
        </div>
    );
};

export default SearchBar;