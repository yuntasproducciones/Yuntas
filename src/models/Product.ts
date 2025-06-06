interface Imagenes{
  id: string,
  url_imagen: string,
  texto_alt_SEO: string
}

export default interface Producto {
  id: string;
  nombre: string;
  titulo: string;
  link: string;
  seccion: string;
  precio: string;
  stock: number;
  subtitulo: string;
  lema: string;
  descripcion: string;
  especificaciones: {
    color: string,
    material: string,
  },
  imagenes: Imagenes[],
  relacionados: string[]
}


