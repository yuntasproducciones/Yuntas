import React, { useState, useEffect } from 'react';
import { useBlogs } from '../../hooks/useBlogs';
import { useBlogActions } from '../../hooks/useBlogActions';
import BlogModal from './BlogModal';
import type Blog from '../../models/Blog';

const BlogList: React.FC = () => {
  const { blogs, loading, error, refetch } = useBlogs();
  const { deleteBlog, loading: actionLoading } = useBlogActions();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToEdit, setBlogToEdit] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar blogs por término de búsqueda
  const filteredBlogs = blogs.filter(blog =>
    blog.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (blog: Blog) => {
    setBlogToEdit(blog);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este blog?')) {
      const success = await deleteBlog(id);
      if (success) {
        refetch(); // Recargar la lista
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBlogToEdit(null);
  };

  const handleBlogSuccess = (blog: Blog) => {
    refetch(); // Recargar la lista después de crear/actualizar
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error cargando blogs: {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Blogs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Crear Nuevo Blog
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Lista de blogs */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredBlogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'No se encontraron blogs que coincidan con tu búsqueda.' : 'No hay blogs disponibles.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={blog.imagenPrincipal}
                        alt={blog.titulo}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.titulo}</div>
                      <div className="text-sm text-gray-500">ID: {blog.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {blog.descripcion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(blog.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 px-3 py-1 rounded disabled:opacity-50"
                        >
                          {actionLoading ? 'Eliminando...' : 'Eliminar'}
                        </button>
                        <a
                          href={`/blogs/${blog.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded"
                        >
                          Ver
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para crear/editar blog */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        blogToEdit={blogToEdit}
        onSuccess={handleBlogSuccess}
      />
    </div>
  );
};

export default BlogList;