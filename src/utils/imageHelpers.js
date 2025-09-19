// src/utils/imageHelpers.js

// Base URL global de imágenes (producción)
const DEFAULT_IMAGE_BASE_URL = "https://apiyuntas.yuntaspublicidad.com";

/**
 * Construye una URL completa de imagen.
 * @param {string} path - Ruta de la imagen (relativa o absoluta).
 * @param {string} [baseUrl=DEFAULT_IMAGE_BASE_URL] - Base URL a usar si el path es relativo.
 * @returns {string|null} - URL lista para usar en <img>.
 */
export function buildImageUrl(path, baseUrl = DEFAULT_IMAGE_BASE_URL) {
  if (!path) return null;
  return path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Genera un título SEO para una imagen.
 * Reglas:
 * 1. Usa la propiedad `title` si existe.
 * 2. Si no, usa `texto_alt` o `texto_alt_SEO`.
 * 3. Si no, intenta obtener el nombre del archivo de la ruta.
 * 4. Como último recurso, usa el `fallback`.
 *
 * @param {Object|string} image - Objeto de imagen o string con la ruta.
 * @param {string} [fallback="Imagen"] - Texto de respaldo si no hay datos.
 * @returns {string} - Título para la imagen.
 */
export function getImageTitle(image, fallback = "Imagen") {
  if (!image) return fallback;

  // Si image es un objeto con datos
  if (typeof image === "object") {
    if (image.title) return image.title;
    if (image.texto_alt) return image.texto_alt;
    if (image.texto_alt_SEO) return image.texto_alt_SEO;
    if (image.ruta_imagen || image.url_imagen) {
      return extractFileName(image.ruta_imagen || image.url_imagen);
    }
  }

  // Si es string (ruta directa)
  if (typeof image === "string") {
    return extractFileName(image);
  }

  return fallback;
}

/**
 * Extrae el nombre del archivo sin extensión desde una ruta o URL.
 * Ej: "/uploads/productos/mueble_moderno.jpg" -> "mueble moderno"
 * @param {string} path
 * @returns {string}
 */
function extractFileName(path) {
  if (!path) return "Imagen";
  const parts = path.split("/");
  const fileName = parts[parts.length - 1] || "";
  const nameWithoutExt = fileName.split(".")[0];
  return nameWithoutExt.replace(/[_-]/g, " ").trim() || "Imagen";
}
