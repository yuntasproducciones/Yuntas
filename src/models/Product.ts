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
  especificaciones: {
    color: string;
    material: string;
  };
  imagenes: File[];
  textos_alt: string[];
  _method: string;
}
