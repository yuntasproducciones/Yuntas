export default interface Producto {
  id: string;
  nombre: string;
  titulo: string;
  link: string;
  seccion: string;
  precio: number;
  stock: number;
  subtitulo: string;
  lema: string;
  descripcion: string;
  especificaciones: string;
  imagenes: string[];
  textos_alt: string[];
}
