export default interface Blog {
  id: number;
  titulo: string;
  link: string;
  producto_id: number;
  parrafo: string;
  descripcion: string;
  imagenPrincipal: string;
  tituloBlog?: string;
  subTituloBlog?: string;
  imagenesBlog: Array<{
    url: string;
    parrafo: string;
  }>;
  video_id?: string;
  videoBlog?: string;
  tituloVideoBlog?: string;
  created_at: string;
}

export interface BlogFormData {
  titulo: string;
  link: string;
  producto_id: string;
  parrafo: string;
  descripcion: string;
  imagen_principal: File | null;
  titulo_blog?: string;
  subtitulo_beneficio?: string;
  url_video?: string;
  titulo_video?: string;
  imagenes?: Array<{
  url_imagen: File | null;
  parrafo_imagen: string;

  }>;
}
export default interface BlogAPI {
  id: number;
  nombre_producto: string;
  subtitulo: string;
  imagen_principal: string;
  imagenes: Array<{
    ruta_imagen: string;
    texto_alt: string;
  }>;
  parrafos: Array<{
    parrafo: string;
  }>;
  created_at: string;
  updated_at?: string;
}

export interface BlogCreateRequest {
  titulo: string;
  link: string;
  producto_id: string;
  parrafo: string;
  descripcion: string;
  imagen_principal: File;
  titulo_blog?: string;
  subtitulo_beneficio?: string;
  url_video?: string;
  titulo_video?: string;
  'imagenes[0][url_imagen]'?: File;
  'imagenes[0][parrafo_imagen]'?: string;
  'imagenes[1][url_imagen]'?: File;
  'imagenes[1][parrafo_imagen]'?: string;
}


