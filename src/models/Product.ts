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
  titulo_hero?: string;   // Se mapea desde title
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
}


