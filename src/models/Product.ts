// Interfaces para la estructura de la API v1
interface SpecsV1 {
  color?: string;
  material?: string;
  [key: string]: any; // Para permitir otras propiedades dinámicas
}

// Modelo principal que coincide con la API v1
export default interface Producto {
  // Campos principales de la API v1
  id: number;
  title: string;                     // "Mi Primer Producto"
  subtitle: string;                  // "Producto de ejemplo"
  tagline: string;                   // "Calidad garantizada"
  description: string;               // "Este es un producto..."
  specs: SpecsV1;                   // { color: "rojo", material: "aluminio" }
  relatedProducts: number[];         // [2, 3]
  images: string[];                  // ["url1.jpg", "url2.jpg"]
  image: string;                     // "principal.jpg"
  nombreProducto: string;            // "Producto de Prueba"
  stockProducto: number;             // 50
  precioProducto: string;            // "99.99" - viene como string de la API
  seccion: string;                   // "Pruebas" - corregido de "section"
  link: string;                      // Campo requerido para la navegación

  // Campos computados para el frontend (se mapean desde los datos de la API)
  // Estos se usan internamente pero no se envían a la API
  nombre?: string;        // Se mapea desde nombreProducto
  precio?: string;        // Se mapea desde precioProducto
  stock?: number;         // Se mapea desde stockProducto
  section?: string;       // Se mapea desde seccion (para compatibilidad)
  titulo?: string;       // Se mapea desde title
  titulo_hero?: string;   // Se mapea desde title
  descripcion?: string; // Se mapea desde description
  descripcion_informacion?: string; // Se mapea desde description
  
  // Para mantener compatibilidad con el formulario
  especificaciones?: Array<{id?: string, texto: string}>;
  beneficios?: Array<{id?: string, texto: string}>;
  imagenes_producto?: {
    lista_productos?: {url_imagen: string, texto_alt_SEO: string};
    hero?: {url_imagen: string, texto_alt_SEO: string};
    especificaciones?: {url_imagen: string, texto_alt_SEO: string};
    beneficios?: {url_imagen: string, texto_alt_SEO: string};
  };
  relacionados?: string[];
  etiqueta?: {
    meta_titulo: string;
    meta_descripcion: string;
  };
}


export interface Product {
  id: number;
  link: string;
  nombre: string;
  titulo: string;
  descripcion: string;
  precio?: number;
  seccion: string;
  imagen_principal: string;
  especificaciones: Record<string, string>;
  beneficios: Array<{id?: string, texto: string}>;
  imagenes: { id: string, url_imagen: string, texto_alt_SEO: string }[];
  etiqueta: {
    meta_titulo: string;
    meta_descripcion: string;
  }
}

export interface ProductoForm extends Omit<Product, 'id' | 'imagen_principal'> {
  imagen_principal_file?: File | null;
  imagenes_files?: File[] | null;
};
