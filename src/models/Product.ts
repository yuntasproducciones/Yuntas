import type Dimensions from "./Dimensions";
import type Specs from "./Specs";

export default interface Producto {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  specs: Specs;
  dimensions: Dimensions;
  relatedProducts: string[];
  images: string[];
  image: string;
  nombreProducto: string;
  seccion: string;
}
