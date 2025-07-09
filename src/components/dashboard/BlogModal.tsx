import React, { useState, useEffect } from 'react';
import { useBlogActions } from '../../hooks/useBlogActions';
import { FileUtils } from '../../utils/fileUtils';
import type Blog from '../../models/Blog';
import type { BlogFormData } from '../../models/Blog';
import { blogService } from '../../services/blogService';

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blogToEdit?: Blog | null;
  onSuccess?: (blog: Blog) => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ isOpen, onClose, blogToEdit, onSuccess }) => {
  const { createBlog, updateBlog, loading, error, clearError } = useBlogActions();
  
  const [formData, setFormData] = useState<BlogFormData>({
    titulo: '',
    link: '',
    producto_id: '',
    parrafo: '',
    descripcion: '',
    imagen_principal: null,
    titulo_blog: '',
    subtitulo_beneficio: '',
    url_video: '',
    titulo_video: '',
    imagenes: [
      { url_imagen: null, parrafo_imagen: '' },
      { url_imagen: null, parrafo_imagen: '' }
    ]
  });

  const [titleModified, setTitleModified] = useState(false);

  // Cargar datos del blog cuando se edita
  useEffect(() => {
    if (blogToEdit) {
      setFormData({
        titulo: blogToEdit.titulo,
        link: blogToEdit.link,
        producto_id: blogToEdit.producto_id.toString(),
        parrafo: blogToEdit.parrafo,
        descripcion: blogToEdit.descripcion,
        imagen_principal: null, // No se puede pre-cargar archivos
        titulo_blog: blogToEdit.tituloBlog || '',
        subtitulo_beneficio: blogToEdit.subTituloBlog || '',
        url_video: blogToEdit.videoBlog || '',
        titulo_video: blogToEdit.tituloVideoBlog || '',
        imagenes: [
          { url_imagen: null, parrafo_imagen: '' },
          { url_imagen: null, parrafo_imagen: '' }
        ]
      });
      setTitleModified(true);
    }
  }, [blogToEdit]);

  // Generar link automáticamente cuando cambia el título
  useEffect(() => {
    if (formData.titulo && !titleModified) {
      setFormData(prev => ({
        ...prev,
        link: blogService.generateLinkFromTitle(formData.titulo)
      }));
    }
  }, [formData.titulo, titleModified]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'titulo') {
      setTitleModified(false);
    }
    
    if (name === 'link') {
      setTitleModified(true);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const validation = FileUtils.validateImage(file);
      
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  const handleImageChange = (index: number, field: 'url_imagen' | 'parrafo_imagen', value: File | string) => {
    if (field === 'url_imagen' && value instanceof File) {
      const validation = FileUtils.validateImage(value);
      
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes?.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      ) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    // Validaciones básicas - todos los campos son requeridos según el backend
    if (!formData.titulo || !formData.link || !formData.parrafo || !formData.descripcion) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    if (!formData.titulo_blog || !formData.subtitulo_beneficio || !formData.url_video || !formData.titulo_video) {
      alert('Por favor, completa todos los campos de información adicional del blog.');
      return;
    }
    
    if (!blogToEdit && !formData.imagen_principal) {
      alert('Por favor, selecciona una imagen principal.');
      return;
    }

    // Validar que haya al menos una imagen adicional
    if (!formData.imagenes || formData.imagenes.length === 0 || !formData.imagenes[0].url_imagen) {
      alert('Por favor, selecciona al menos una imagen adicional.');
      return;
    }

    try {
      let result: Blog | null = null;
      
      if (blogToEdit) {
        result = await updateBlog(blogToEdit.id, formData);
      } else {
        result = await createBlog(formData);
      }
      
      if (result) {
        onSuccess?.(result);
        handleClose();
      }
    } catch (err) {
      console.error('Error al guardar el blog:', err);
    }
  };

  const handleClose = () => {
    setFormData({
      titulo: '',
      link: '',
      producto_id: '',
      parrafo: '',
      descripcion: '',
      imagen_principal: null,
      titulo_blog: '',
      subtitulo_beneficio: '',
      url_video: '',
      titulo_video: '',
      imagenes: [
        { url_imagen: null, parrafo_imagen: '' },
        { url_imagen: null, parrafo_imagen: '' }
      ]
    });
    setTitleModified(false);
    clearError();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {blogToEdit ? 'Editar Blog' : 'Crear Nuevo Blog'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link (URL amigable) *
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Producto (opcional)
              </label>
              <input
                type="number"
                name="producto_id"
                value={formData.producto_id}
                onChange={handleInputChange}
                placeholder="Deja vacío si no tienes productos aún"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Puedes asociar este blog a un producto específico (opcional)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Párrafo *
              </label>
              <textarea
                name="parrafo"
                value={formData.parrafo}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen Principal {!blogToEdit && '*'}
              </label>
              <input
                type="file"
                name="imagen_principal"
                onChange={handleFileChange}
                accept="image/*"
                required={!blogToEdit}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Campos opcionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Blog *
                </label>
                <input
                  type="text"
                  name="titulo_blog"
                  value={formData.titulo_blog}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtítulo *
                </label>
                <input
                  type="text"
                  name="subtitulo_beneficio"
                  value={formData.subtitulo_beneficio}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Video */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL del Video *
                </label>
                <input
                  type="url"
                  name="url_video"
                  value={formData.url_video}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Video *
                </label>
                <input
                  type="text"
                  name="titulo_video"
                  value={formData.titulo_video}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Imágenes adicionales */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Imágenes Adicionales * (Al menos 1 requerida)</h3>
              {formData.imagenes?.map((imagen, index) => (
                <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                  <h4 className="text-md font-medium text-gray-600 mb-2">Imagen {index + 1}</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Archivo de Imagen {index === 0 ? '*' : ''}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        required={index === 0}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageChange(index, 'url_imagen', file);
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Párrafo de la Imagen
                      </label>
                      <textarea
                        value={imagen.parrafo_imagen}
                        onChange={(e) => handleImageChange(index, 'parrafo_imagen', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : (blogToEdit ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogModal;
