// Base URL global de imágenes (producción)
const DEFAULT_IMAGE_BASE_URL = "https://apiyuntas.yuntaspublicidad.com";

/**
 * Construye una URL completa de imagen.
 * - Si ya es absoluta (http/https), se devuelve tal cual.
 * - Si es relativa, se une con la baseUrl.
 * - Si está vacía o null, devuelve null.
 */
export function buildImageUrl(path, baseUrl = DEFAULT_IMAGE_BASE_URL) {
  if (!path || typeof path !== "string") return null;
  return path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Genera un ALT SEO para una imagen.
 * Reglas:
 * 1. Usa `texto_alt` o `texto_alt_SEO` si existen.
 * 2. Si no, usa `title`.
 * 3. Si no, genera a partir del nombre del archivo.
 * 4. Como último recurso, usa el fallback.
 */
export function getImageAlt(image, fallback = "Imagen") {
  if (!image) return fallback;

  if (typeof image === "object") {
    if (image.texto_alt) return sanitizeText(image.texto_alt);
    if (image.texto_alt_SEO) return sanitizeText(image.texto_alt_SEO);
    if (image.title) return sanitizeText(image.title);
    if (image.ruta_imagen || image.url_imagen) {
      return capitalize(extractFileName(image.ruta_imagen || image.url_imagen));
    }
  }

  if (typeof image === "string") {
    return capitalize(extractFileName(image));
  }

  return fallback;
}

/**
 * Genera un TITLE SEO para una imagen.
 * Reglas:
 * 1. Usa `title` si existe.
 * 2. Si no, usa `texto_alt` o `texto_alt_SEO`.
 * 3. Si no, genera a partir del nombre del archivo.
 * 4. Como último recurso, usa el fallback.
 */
export function getImageTitle(image, fallback = "Imagen") {
  if (!image) return fallback;

  if (typeof image === "object") {
    if (image.title) return sanitizeText(image.title);
    if (image.texto_alt) return sanitizeText(image.texto_alt);
    if (image.texto_alt_SEO) return sanitizeText(image.texto_alt_SEO);
    if (image.ruta_imagen || image.url_imagen) {
      return capitalize(extractFileName(image.ruta_imagen || image.url_imagen));
    }
  }

  if (typeof image === "string") {
    return capitalize(extractFileName(image));
  }

  return fallback;
}

/**
 * Extrae el nombre del archivo sin extensión desde una ruta o URL.
 * Ej: "/uploads/productos/mueble_moderno.jpg" -> "mueble moderno"
 */
function extractFileName(path) {
  if (!path) return "Imagen";
  const parts = path.split("/");
  const fileName = parts[parts.length - 1] || "";
  const nameWithoutExt = fileName.split(".")[0];
  return nameWithoutExt.replace(/[_-]/g, " ").trim() || "Imagen";
}

/**
 * Capitaliza la primera letra de cada palabra.
 * Ej: "mueble moderno" -> "Mueble Moderno"
 */
function capitalize(text) {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Sanitiza texto para ALT/TITLE, eliminando etiquetas y normalizando espacios.
 */
function sanitizeText(text) {
  if (typeof text !== "string") return "Imagen";
  return text.replace(/<\/?[^>]+(>|$)/g, "").trim();
}
