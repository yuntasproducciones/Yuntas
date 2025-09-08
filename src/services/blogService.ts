import { httpService } from './httpService';
import { config } from '../../config';
import type Blog from '../models/Blog';
import type { BlogFormData, BlogCreateRequest } from '../models/Blog';

interface BlogPagination {
  data: Blog[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface BlogListResponse {
  success: boolean;
  data: BlogPagination; // ✅ aquí está el arreglo real
  message: string;
  status: number;
}

interface BlogDetailResponse {
  success: boolean;
  data: Blog;
  message: string;
  status: number;
}

class BlogService {
  
  // Obtener todos los blogs (público)
  async getAllBlogs(): Promise<BlogListResponse> {
    try {
      const response = await httpService.get<BlogPagination>(config.endpoints.blogs.list);
      return response;
    } catch (error) {
      console.error('[BlogService] Error obteniendo blogs:', error);
      throw error;
    }
  }

  // Obtener un blog por ID (público)
  async getBlogById(id: number | string): Promise<BlogDetailResponse> {
    try {
      const response = await httpService.get<Blog>(config.endpoints.blogs.detail(id));
      return response;
    } catch (error) {
      console.error('[BlogService] Error obteniendo blog:', error);
      throw error;
    }
  }

  // Obtener un blog por link (público)
  async getBlogByLink(link: string): Promise<BlogDetailResponse> {
    try {
      const response = await httpService.get<Blog>(`/api/blogs/link/${link}`);
      return response;
    } catch (error) {
      console.error('[BlogService] Error obteniendo blog por link:', error);
      throw error;
    }
  }

  // Crear un nuevo blog (autenticado)
  async createBlog(blogData: BlogFormData): Promise<BlogDetailResponse> {
    try {
      const formData = this.buildFormData(blogData);
      const response = await httpService.authenticatedPostFormData<Blog>(config.endpoints.blogs.create, formData);
      return response;
    } catch (error) {
      console.error('[BlogService] Error creando blog:', error);
      throw error;
    }
  }

  // Actualizar un blog (autenticado)
  async updateBlog(id: number | string, blogData: BlogFormData): Promise<BlogDetailResponse> {
    try {
      const formData = this.buildFormData(blogData);
      // Usar la ruta correcta del backend: /api/blog/{id} (no /api/blogs/{id})
      const response = await httpService.authenticatedPutFormData<Blog>(`/api/blog/${id}`, formData);
      return response;
    } catch (error) {
      console.error('[BlogService] Error actualizando blog:', error);
      throw error;
    }
  }

  // Eliminar un blog (autenticado)
  async deleteBlog(id: number | string): Promise<any> {
    try {
      const response = await httpService.authenticatedDelete(`/api/blogs/${id}`);
      return response;
    } catch (error) {
      console.error('[BlogService] Error eliminando blog:', error);
      throw error;
    }
  }

  // Construir FormData para envío de archivos
  private buildFormData(blogData: BlogFormData): FormData {
    const formData = new FormData();
    
    // Campos básicos (todos requeridos según StoreBlogRequest)
    formData.append('titulo', blogData.titulo);
    formData.append('link', blogData.link);
    if (blogData.producto_id && blogData.producto_id !== '') {
      formData.append('producto_id', blogData.producto_id);
    }
    formData.append('parrafo', blogData.parrafo);
    formData.append('descripcion', blogData.descripcion);
    
    // Imagen principal (requerida)
    if (blogData.imagen_principal) {
      formData.append('imagen_principal', blogData.imagen_principal);
    }
    
    // Campos requeridos según el backend
    formData.append('titulo_blog', blogData.titulo_blog || '');
    formData.append('subtitulo_beneficio', blogData.subtitulo_beneficio || '');
    formData.append('url_video', blogData.url_video || '');
    formData.append('titulo_video', blogData.titulo_video || '');
    
    // Imágenes adicionales - formato correcto según backend
    if (blogData.imagenes && blogData.imagenes.length > 0) {
      blogData.imagenes.forEach((imagen, index) => {
        if (imagen.url_imagen) {
          formData.append(`imagenes[${index}][imagen]`, imagen.url_imagen);
          formData.append(`imagenes[${index}][parrafo]`, imagen.parrafo_imagen || '');
        }
      });
    }
    
    return formData;
  }

  // Generar un link automáticamente a partir del título
  generateLinkFromTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim();
  }
}

export const blogService = new BlogService();
