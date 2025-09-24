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
  
  // --- MÉTODOS PÚBLICOS (Obtención de datos) ---
  getAllBlogs(): Promise<BlogListResponse> {
    return httpService.get<BlogPagination>(config.endpoints.blogs.list);
  }

  getBlogByLink(link: string): Promise<BlogDetailResponse> {
    return httpService.get<Blog>(`/api/blogs/link/${link}`);
  }

  // --- MÉTODOS PÚBLICOS (Modificación de datos) ---
  createBlog(blogData: BlogFormData): Promise<BlogDetailResponse> {
    const formData = this._buildCreateFormData(blogData);
    return httpService.authenticatedPostFormData<Blog>(config.endpoints.blogs.create, formData);
  }
  
  updateBlog(id: number | string, blogData: BlogFormData): Promise<BlogDetailResponse> {
    const formData = this._buildUpdateFormData(blogData);
    formData.append('_method', 'PATCH'); 
    return httpService.authenticatedPostFormData<Blog>(`/api/blogs/${id}`, formData);
  }

  deleteBlog(id: number | string): Promise<any> {
    return httpService.authenticatedDelete(`/api/blogs/${id}`);
  }

  // Construir FormData para envío de archivos
  /**
   * Construye el FormData para ACTUALIZAR un blog existente.
   * Solo adjunta archivos de imagen si son nuevos (tipo File).
   */
  private _buildCreateFormData(data: BlogFormData): FormData {
    const formData = new FormData();
    
    formData.append('producto_id', data.producto_id || '');
    formData.append('subtitulo', data.subtitulo || '');
    formData.append('meta_titulo', data.meta_titulo || '');
    formData.append('meta_descripcion', data.meta_descripcion || '');
    formData.append('link', data.link || '');
    formData.append('url_video', data.url_video || '');
    
    if (data.parrafos && data.parrafos.length > 0) {
      data.parrafos.forEach((p, i) => {
        formData.append(`parrafos[${i}]`, p.texto); // Asumiendo que cada párrafo es un objeto { texto: '...' }
      });
    }

    if (data.imagen_principal) {
      formData.append('imagen_principal', data.imagen_principal);
    }
    if (data.alt_imagen_principal) {
      formData.append('text_alt_principal', data.alt_imagen_principal);
    }

    if (data.imagenes_secundarias && data.imagenes_secundarias.length > 0) {
      data.imagenes_secundarias.forEach((img, i) => {
        if (img.archivo) {
          formData.append(`imagenes[${i}]`, img.archivo);
          formData.append(`alt_imagenes[${i}]`, img.alt || '');
        }
      });
    }

    return formData;
  }

  private _buildUpdateFormData(data: BlogFormData): FormData {
    const formData = new FormData();
    
    // Adjunta todos los campos de texto
    formData.append('producto_id', data.producto_id || '');
    formData.append('subtitulo', data.subtitulo || '');
    formData.append('meta_titulo', data.meta_titulo || '');
    formData.append('meta_descripcion', data.meta_descripcion || '');
    formData.append('link', data.link || '');
    formData.append('url_video', data.url_video || '');
    
    if (data.parrafos && data.parrafos.length > 0) {
      data.parrafos.forEach((p, i) => {
        formData.append(`parrafos[${i}]`, p.texto);
      });
    }
    
    if (data.alt_imagen_principal) {
      formData.append('text_alt_principal', data.alt_imagen_principal);
    }

    // LÓGICA CLAVE: Solo adjunta la imagen principal si es un archivo nuevo
    if (data.imagen_principal instanceof File) {
      formData.append('imagen_principal', data.imagen_principal);
    }

    // Lógica para imágenes secundarias: adjunta el archivo si es nuevo y el texto alt siempre
    if (data.imagenes_secundarias && data.imagenes_secundarias.length > 0) {
      data.imagenes_secundarias.forEach((img, i) => {
        if (img.archivo instanceof File) {
          formData.append(`imagenes[${i}]`, img.archivo);
        }
        // Siempre se envía el texto alt, ya sea nuevo o existente
        formData.append(`alt_imagenes[${i}]`, img.alt || '');
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
