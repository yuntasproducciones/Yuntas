import { httpService } from './httpService';
import { config } from '../../config';
import type Blog from '../models/Blog';
import type { BlogFormData } from '../models/Blog';

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
  
 // --- MÉTODOS DE OBTENCIÓN (Sin cambios) ---

  getAllBlogs(): Promise<BlogListResponse> {
    return httpService.get<BlogPagination>(config.endpoints.blogs.list);
  }

  getBlogByLink(link: string): Promise<BlogDetailResponse> {
    return httpService.get<Blog>(`/api/blogs/link/${link}`);
  }

  // --- MÉTODOS DE MODIFICACIÓN ---

  createBlog(blogData: BlogFormData): Promise<BlogDetailResponse> {
    const formData = this.buildFormData(blogData, 'create');
    return httpService.authenticatedPostFormData<Blog>(config.endpoints.blogs.create, formData);
  }
  
  updateBlog(id: number | string, blogData: BlogFormData): Promise<BlogDetailResponse> {

    const formData = this.buildFormData(blogData, 'update');
    formData.append('_method', 'PATCH'); 
    return httpService.authenticatedPostFormData<Blog>(`/api/blogs/${id}`, formData);
  }

  deleteBlog(id: number | string): Promise<any> {
    return httpService.authenticatedDelete(`/api/blogs/${id}`);
  }

  // --- FUNCIÓN PRIVADA Y ADAPTADA PARA CONSTRUIR FORMDATA ---

  /**
   * Construye el FormData para crear o actualizar un blog.
   * Traduce los campos de BlogFormData a lo que la API espera.
   */
  private buildFormData(data: BlogFormData, mode: 'create' | 'update'): FormData {
    const formData = new FormData();
    
    // --- TRADUCCIÓN DE CAMPOS ---
    formData.append('producto_id', data.producto_id || '');
    formData.append('link', data.link || '');
    
    // 1. Traducimos 'titulo' del form a 'subtitulo' para la API
    formData.append('subtitulo', data.titulo || ''); 

    // 2. Traducimos 'parrafo' (string) a un array 'parrafos' para la API
    if (data.parrafo) {
      formData.append('parrafos[0]', data.parrafo);
    }
    
    // 3. Traducimos campos opcionales si existen
    if (data.url_video) {
      formData.append('url_video', data.url_video);
    }
        // Solo se envía la imagen si es un archivo (File),
    // lo cual es correcto para 'create' y para 'update' si se cambia la imagen.
    if (data.imagen_principal instanceof File) {
      formData.append('imagen_principal', data.imagen_principal);
    }

    if (data.imagenes?.length) {
      data.imagenes.forEach((img, i) => {
        // 4. Verificamos que 'url_imagen' sea un archivo nuevo
        if (img.url_imagen instanceof File) {
          formData.append(`imagenes[${i}]`, img.url_imagen);
          // Traducimos 'parrafo_imagen' a 'alt_imagenes'
          formData.append(`alt_imagenes[${i}]`, img.parrafo_imagen || '');
        }
      });
    }

    return formData;
  }

  // Generar un link automáticamente a partir del título
  generateLinkFromTitle(title: string): string {
    return title
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
      .trim();
  }
}

export const blogService = new BlogService();
