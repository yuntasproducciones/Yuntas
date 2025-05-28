import type Specs from "./Specs";

export default interface Producto {
  id: string;
  nombre: string;
  titulo: string;
  subtitulo: string;
  lema: string,
  descripcion: string;
  imagenes: string[];
  stock: number;
  precio: number;
  seccion: string;

  link: string;
  // tagline: string;
  especificaciones: string; //Specs
  textos_alt: string[];
}
