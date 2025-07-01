/**
 * @description Utilidades para mapear datos entre la API v1 y el formato interno del frontend
 * Esto permite mantener la compatibilidad con el diseño del Figma mientras usamos la API v1
 */

import type Producto from '../models/Product';

/**
 * Mapea un producto de la API v1 al formato interno para el frontend
 */
export function mapProductFromAPIv1(apiProduct: Producto): Producto {
  return {
    // Mantener los datos originales de la API v1
    ...apiProduct,
    
    // Mapear campos para compatibilidad con el frontend
    nombre: apiProduct.nombreProducto || apiProduct.subtitle,
    precio: apiProduct.precioProducto ? `$${apiProduct.precioProducto}` : '',
    stock: apiProduct.stockProducto,
    seccion: apiProduct.section || apiProduct.tagline,
    link: apiProduct.title ? apiProduct.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') : '',
    titulo_hero: apiProduct.title,
    descripcion_informacion: apiProduct.description,
    
    // Mapear especificaciones desde specs
    especificaciones: Object.entries(apiProduct.specs || {})
      .filter(([key]) => key.startsWith('spec_'))
      .map(([key, value], index) => ({
        id: key,
        texto: String(value)
      })),
    
    // Mapear beneficios desde specs
    beneficios: Object.entries(apiProduct.specs || {})
      .filter(([key]) => key.startsWith('beneficio_'))
      .map(([key, value], index) => ({
        id: key,
        texto: String(value)
      })),
    
    // Mapear imágenes a la estructura esperada por el frontend
    imagenes_producto: {
      lista_productos: apiProduct.images?.[0] ? {
        url_imagen: apiProduct.images[0],
        texto_alt_SEO: `${apiProduct.title} - Lista`
      } : undefined,
      hero: apiProduct.image ? {
        url_imagen: apiProduct.image,
        texto_alt_SEO: `${apiProduct.title} - Hero`
      } : undefined,
      especificaciones: apiProduct.images?.[1] ? {
        url_imagen: apiProduct.images[1],
        texto_alt_SEO: `${apiProduct.title} - Especificaciones`
      } : undefined,
      beneficios: apiProduct.images?.[2] ? {
        url_imagen: apiProduct.images[2],
        texto_alt_SEO: `${apiProduct.title} - Beneficios`
      } : undefined,
    },
    
    // Mapear productos relacionados
    relacionados: apiProduct.relatedProducts?.map(id => String(id)) || [],
  };
}

/**
 * Mapea múltiples productos de la API v1
 */
export function mapProductsFromAPIv1(apiProducts: Producto[]): Producto[] {
  return apiProducts.map(mapProductFromAPIv1);
}

/**
 * Prepara los datos para enviar a la API v1 desde el formulario
 */
export function prepareProductForAPIv1(formData: FormData): Record<string, any> {
  const title = formData.get('titulo_hero') as string;
  const subtitle = formData.get('nombre') as string;
  const tagline = formData.get('seccion') as string;
  const description = formData.get('descripcion_informacion') as string;
  const nombreProducto = formData.get('nombre') as string;
  const stockProducto = parseInt(formData.get('stock') as string);
  const precioProducto = parseFloat((formData.get('precio') as string).replace('$', ''));
  const section = formData.get('seccion') as string;

  return {
    title,
    subtitle,
    tagline,
    description,
    nombreProducto,
    stockProducto,
    precioProducto,
    section
  };
}
