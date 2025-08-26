import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import AddBlogModal from "../AddBlogModel";
import { config, getApiUrl } from "../../../../config";
import TableContainer from "./TableContainer";

interface Blog {
  id: number;
  producto_id: number;
  nombre_producto: string;
  etiqueta: {
    meta_titulo: string;
    meta_descripcion: string;
  };
  subtitulo: string;
  imagen_principal: string;
  imagenes?: { ruta_imagen: string; text_alt: string }[];
  parrafos?: { parrafo: string }[];
  created_at?: string;
  updated_at?: string;
}

const BlogsTable = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(getApiUrl(config.endpoints.blogs.list), {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setData(result.data);
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
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);

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
          setData((prevData) => prevData.filter((item) => item.id !== id));
          alert("✅ Blog eliminado exitosamente");
        } else {
          const errorData = await response.json().catch(() => ({}));
          alert(
              `❌ Error al eliminar el blog: ${
                  errorData.message || "Error desconocido"
              }`
          );
        }
      } catch (error) {
        alert("❌ Error al conectar con el servidor");
      }
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const baseUrl = "https://apiyuntas.yuntaspublicidad.com";
    return `${baseUrl}${imagePath}`;
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (!text) return "";
    return text.length > maxLength
        ? text.substring(0, maxLength) + "..."
        : text;
  };

  // Función para abrir modal de nuevo blog
  const handleAddNewBlog = () => {
    setEditBlog(null);
    setIsModalOpen(true);
  };

  return (
      <>
        <div className="overflow-x-auto p-4">
          <TableContainer
              tableType="blogs"
              exportData={data}
              onAddNew={handleAddNewBlog}
          >
            <thead>
            <tr className="bg-blue-950 text-white">
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">
                ID
              </th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">
                PRODUCTO
              </th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">
                SUBTÍTULO
              </th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">
                IMAGEN
              </th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">
                FECHA
              </th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">
                ACCIÓN
              </th>
            </tr>
            </thead>
            <tbody>
            {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Cargando blogs...
                  </td>
                </tr>
            ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                    <tr
                        key={item.id}
                        className={`text-center ${
                            item.id % 2 === 0 ? "bg-gray-100 " : "bg-gray-300 "
                        }`}
                    >
                      <td
                          data-label="ID"
                          className="px-4 py-2 font-bold rounded-xl border border-gray-300"
                      >
                        {item.id}
                      </td>
                      <td
                          data-label="Producto"
                          className="px-4 py-2 font-bold rounded-xl border border-gray-300"
                      >
                        {truncateText(item.nombre_producto || "Sin nombre", 30)}
                      </td>
                      <td
                          data-label="Subtítulo"
                          className="px-4 py-2 rounded-xl border border-gray-300"
                      >
                        {truncateText(item.subtitulo, 40)}
                      </td>
                      <td
                          data-label="Imagen"
                          className="px-4 py-2 rounded-xl border border-gray-300"
                      >
                        <img
                            src={getImageUrl(item.imagen_principal)}
                            alt={item.nombre_producto || "Blog"}
                            className="w-16 h-16 rounded-md mx-auto object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder-image.jpg";
                            }}
                        />
                      </td>
                      {/* <td className="px-4 py-2 rounded-xl border border-gray-300 text-sm">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('es-ES') : 'N/A'}
                      </td> */}
                      <td
                          data-label="Fecha"
                          className="px-4 py-2 rounded-xl border border-gray-300 text-sm"
                      >
                        {item.created_at
                            ? new Date(item.created_at).toLocaleDateString("es-ES")
                            : "N/A"}
                      </td>
                      <td
                          data-label="Acción"
                          className="px-4 py-2 rounded-xl border border-gray-300"
                      >
                        <div className="flex justify-center gap-2 rounded-xl p-1">
                          <button
                              className="p-2 text-red-600 hover:text-red-800 transition"
                              title="Eliminar"
                              onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash size={18} />
                          </button>
                          <button
                              className="p-2 text-yellow-600 hover:text-yellow-800 transition"
                              title="Editar"
                              onClick={() => {
                                setEditBlog(item);
                                setIsModalOpen(true);
                              }}
                          >
                            <FaEdit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
            ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No hay blogs disponibles
                  </td>
                </tr>
            )}
            </tbody>
          </TableContainer>

          {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                >
                  Anterior
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 rounded-md ${
                                currentPage === pageNum
                                    ? "bg-blue-950 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                          {pageNum}
                        </button>
                    );
                  })}
                </div>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                >
                  Siguiente
                </button>
              </div>
          )}
          <button
              onClick={() => {
                setEditBlog(null);
                setIsModalOpen(true);
              }}
              className="mt-4 mb-6 bg-blue-950 hover:bg-blue-800 text-white text-lg px-10 py-2 rounded-full"
          >
            Añadir Blog
          </button>
          <AddBlogModal
              isOpen={isModalOpen}
              setIsOpen={setIsModalOpen}
              blogToEdit={editBlog}
              onSuccess={() => {
                setEditBlog(null);
                setIsModalOpen(false);
                fetchData();
              }}
          />
        </div>
      </>
  );
};

export default BlogsTable;