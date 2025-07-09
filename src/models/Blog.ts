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


