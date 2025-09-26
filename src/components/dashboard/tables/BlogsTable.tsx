import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import AddBlogModal from "../AddBlogModel";
import { config, getApiUrl } from "../../../../config";
import TableContainer from "./TableContainer";
import BlogImageCarousel from './BlogImageCarousel';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, FreeMode } from "swiper/modules";
import { useDarkMode } from "../../../hooks/darkmode/useDarkMode";

interface Blog {
  id: number;
  producto_id: number;
  nombre_producto: string;
  etiqueta: {
    meta_titulo: string;
    meta_descripcion: string;
  };
  url_video: string;
  subtitulo: string;
  imagen_principal: string;
  imagenes?: { ruta_imagen: string; text_alt: string }[];
  parrafos?: { parrafo: string }[];
  created_at?: string;
  updated_at?: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const BlogsTable = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [paginationData, setPaginationData] = useState<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: itemsPerPage,
    total: 0,
  });
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { darkMode, toggleDarkMode } = useDarkMode();

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${getApiUrl(config.endpoints.blogs.list)}?page=${page}&per_page=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success && result.data && Array.isArray(result.data.data)) {
        setData(result.data.data);
        setPaginationData({
          current_page: result.data.current_page ?? page,
          last_page: result.data.last_page,
          per_page: result.data.per_page,
          total: result.data.total,
        });
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("❌ Error al cargar datos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= paginationData.last_page) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este blog?"
    );

    if (confirmDelete) {
      try {
        const response = await fetch(
          getApiUrl(config.endpoints.blogs.delete(id)),
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          fetchData(currentPage);
          alert("✅ Blog eliminado exitosamente");
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(
            `❌ Error al eliminar el blog: ${errorData.message || "Error desconocido"
            }`
          );
        }
      } catch {
        alert("❌ Error al conectar con el servidor");
      }
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = "https://apiyuntas.yuntaspublicidad.com";
    return `${baseUrl}${imagePath}`;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleAddNewBlog = () => {
    setEditBlog(null);
    setIsModalOpen(true);
  };
  return (
    <div className="overflow-x-auto p-2 sm:p-4">
      <TableContainer
        tableType="blogs"
        exportData={data}
        onAddNew={handleAddNewBlog}
      >
        <thead className="hidden md:table-header-group">
          <tr className="bg-blue-950 text-white">
            {["ID", "PRODUCTO", "SUBTÍTULO", "IMAGEN", "FECHA", "ACCIÓN"].map(
              (header) => (
                <th
                  key={header}
                  className={`px-4 py-2 text-white uppercase text-xs font-bold rounded-md ${darkMode ? 'bg-cyan-900' : 'bg-cyan-400'}`}
                >
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={6}
                className="text-center py-4 text-gray-500 block md:table-cell"
              >
                Cargando blogs...
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((item, idx) => {
              const totalSlides = 1 + (item.imagenes?.length || 0);
              return(
              <tr
                key={item.id}
                className={`md:table-row block md:mb-0 mb-6 rounded-xl shadow-md overflow-hidden border ${(idx % 2 === 0 && darkMode) ? "bg-white text-black" : "text-black bg-white"
                  }`}
              >
                <td
                  data-label="ID"
                  className={`block md:table-cell px-4 py-2 border-b font-bold before:content-['ID'] before:font-semibold before:block md:before:hidden ${darkMode ? 'bg-gray-300' : ''}`}
                >
                  {item.id}
                </td>

                <td
                  data-label="Producto"
                  className={`block md:table-cell px-4 py-2 border-b font-semibold before:content-['Producto'] before:font-semibold before:block md:before:hidden ${darkMode ? 'bg-gray-300' : ''}`}
                >
                  {truncateText(item.nombre_producto || "Sin nombre", 30)}
                </td>

                <td
                  data-label="Subtítulo"
                  className={`block md:table-cell px-4 py-2 border-b before:content-['Subtítulo'] before:font-semibold before:block md:before:hidden ${darkMode ? 'bg-gray-300' : ''}`}
                >
                  {truncateText(item.subtitulo, 40)}
                </td>

                <td
                  data-label="Imagen"
                  className={`block md:table-cell px-4 py-2 border-b border-gray-200 relative md:static before:content-['Imagen'] before:font-semibold before:block md:before:hidden ${darkMode ? 'bg-gray-300' : ''}`}
                >
                  {/* Swiper para movil */}
                  <div className="block md:hidden w-full">
                    <Swiper
                      modules={[Navigation, Pagination]}
                      spaceBetween={10}
                      slidesPerView={1}
                      pagination={{ clickable: true }}
                      navigation={true}
                      className="w-full max-w-[320px] rounded-lg shadow-md"
                    >
                      <SwiperSlide>
                        <img
                          src={getImageUrl(item.imagen_principal)}
                          alt={item.nombre_producto || "Blog"}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </SwiperSlide>
                      {item.imagenes?.map((img, i) => (
                        <SwiperSlide key={i}>
                          <img
                            src={getImageUrl(img.ruta_imagen)}
                            alt={img.text_alt || "Imagen extra"}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>

                  {/* Swiper para escritorio */}
                  <div className="hidden md:block w-full">
                    <BlogImageCarousel key={item.id} item={item} getImageUrl={getImageUrl} />
                  </div>

                </td>

                <td
                  data-label="Fecha"
                  className={`block md:table-cell px-4 py-2 border-b text-sm before:content-['Fecha'] before:font-semibold before:block md:before:hidden ${darkMode ? 'bg-gray-300' : ''}`}
                >
                  {item.created_at
                    ? new Date(item.created_at).toLocaleDateString("es-ES")
                    : "N/A"}
                </td>

                <td
                  data-label="Acción"
                  className={`block md:table-cell px-4 py-3 border-b before:content-['Acción'] before:font-semibold before:block md:before:hidden ${darkMode ? 'bg-gray-300' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-2 sm:mt-0">
                    <button
                      className="flex items-center justify-center gap-2 p-2 text-red-600 hover:text-red-800 transition bg-red-100 rounded-lg shadow-sm"
                      title="Eliminar"
                      onClick={() => handleDelete(item.id)}
                    >
                      <FaTrash size={18} />
                      <span className="md:hidden font-medium">Borrar</span>
                    </button>
                    <button
                      className="flex items-center justify-center gap-2 p-2 text-yellow-600 hover:text-yellow-800 transition bg-yellow-100 rounded-lg shadow-sm"
                      title="Editar"
                      onClick={() => {
                        setEditBlog(item);
                        setIsModalOpen(true);
                      }}
                    >
                      <FaEdit size={18} />
                      <span className="md:hidden font-medium">Editar</span>
                    </button>
                  </div>
                </td>
              </tr>
              );
})
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No hay blogs disponibles
              </td>
            </tr>
          )}
        </tbody>
      </TableContainer>
        
      {/* Controles de paginación */}
      {paginationData.last_page > 1 && (
        <div className="flex flex-wrap justify-center items-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
          >
            Anterior
          </button>

          {Array.from({ length: paginationData.last_page }, (_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 rounded-md ${currentPage === pageNum
                    ? "bg-blue-950 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === paginationData.last_page}
            className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Botón de añadir */}
      <button
        onClick={handleAddNewBlog}
        className="mt-4 mb-6 bg-blue-950 hover:bg-blue-800 text-white text-lg px-8 sm:px-10 py-2 rounded-full w-full sm:w-auto"
      >
        Añadir Blog
      </button>

      {/* Modal de añadir o editar */}
      <AddBlogModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        blogToEdit={editBlog}
        onSuccess={() => {
          setEditBlog(null);
          setIsModalOpen(false);
          fetchData(currentPage);
        }}
      />
    </div>
  );
};

export default BlogsTable;
