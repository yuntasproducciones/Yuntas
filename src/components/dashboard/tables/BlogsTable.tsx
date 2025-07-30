import { useState, useEffect } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import AddBlogModal from "../AddBlogModel";
import { config, getApiUrl } from "../../../../config";
import TableContainer from "./TableContainer";

// Definir el tipo de los datos adaptado a la estructura real de la API
interface Blog {
  id: number;
  titulo: string;
  parrafo: string;
  descripcion: string;
  imagenPrincipal: string;
  tituloBlog?: string;
  subTituloBlog?: string;
  videoBlog?: string;
  tituloVideoBlog?: string;
  created_at?: string | null;
}

const BlogsTable = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(getApiUrl(config.endpoints.blogs.list));
        const result = await response.json();
        console.log("Datos recibidos:", result);

        // Adaptar estructura
        const adaptedData: Blog[] = (result.data || []).map((item: any) => ({
          id: item.id,
          titulo: item.nombre_producto,
          parrafo: item.parrafos?.map((p: any) => p.contenido).join(" ") || "",
          descripcion: item.subtitulo || "",
          imagenPrincipal: item.imagen_principal,
          created_at: item.created_at,
        }));

        setData(adaptedData);
      } catch (error) {
        console.error("❌ Error al cargar datos:", error);
      }
    };

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
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este elemento?");
    if (confirmDelete) {
      try {
        const response = await fetch(getApiUrl(config.endpoints.blogs.delete(id)), {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setData((prevData) => prevData.filter((item) => item.id !== id));
          alert("Blog eliminado exitosamente");
        } else {
          alert("Error al eliminar el Blog");
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        alert("Error al conectar con el servidor");
      }
    }
  };

  return (
    <>
      <div className="overflow-x-auto p-4">
        <TableContainer tableType="blogs">
          <thead>
            <tr className="bg-blue-950 text-white">
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">ID</th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">TÍTULO</th>
              {/* <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">PÁRRAFO</th> */}
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">DESCRIPCIÓN</th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">IMAGEN</th>
              <th className="px-4 py-2 bg-cyan-400 text-white uppercase text-xs font-bold rounded-md">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr
                  key={item.id}
                  className={`text-center ${item.id % 2 === 0 ? "bg-gray-100" : "bg-gray-300"}`}
                >
                  <td className="px-4 py-2 font-bold rounded-xl border border-gray-300">{item.id}</td>
                  <td className="px-4 py-2 font-bold rounded-xl border border-gray-300">{item.titulo}</td>
                  {/* <td className="px-4 py-2 rounded-xl border border-gray-300">{item.parrafo}</td> */}
                  <td className="px-4 py-2 rounded-xl border border-gray-300">{item.descripcion}</td>
                  <td className="px-4 py-2 rounded-xl border border-gray-300">
                    <img
                      src={item.imagenPrincipal}
                      alt={item.titulo}
                      className="w-16 h-16 rounded-md mx-auto object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 rounded-xl border border-gray-300">
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
                  Cargando datos...
                </td>
              </tr>
            )}
          </tbody>
        </TableContainer>

        {/* Paginación */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="mx-4 self-center">{`Página ${currentPage} de ${totalPages}`}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>

        <AddBlogModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          blogToEdit={editBlog}
          onSuccess={() => {
            setEditBlog(null);
            setIsModalOpen(false);
            window.location.reload();
          }}
        />
      </div>
    </>
  );
};

export default BlogsTable;
