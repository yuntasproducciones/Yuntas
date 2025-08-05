/**
 * Utilidades para el manejo de archivos en el sistema de blogs
 */

export class FileUtils {
  // Tamaño máximo permitido para imágenes (10MB)
  static readonly MAX_FILE_SIZE = 10 * 1024 * 1024;
  
  // Tipos MIME permitidos para imágenes
  static readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ];

  /**
   * Valida si un archivo es una imagen válida
   * @param file - El archivo a validar
   * @returns objeto con resultado de validación
   */
  static validateImage(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'No se ha seleccionado ningún archivo' };
    }

    // Validar tipo MIME
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `Tipo de archivo no permitido. Use: ${this.ALLOWED_MIME_TYPES.join(', ')}` 
      };
    }

    // Validar tamaño
    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        valid: false, 
        error: `El archivo es demasiado grande. Tamaño máximo: ${this.formatFileSize(this.MAX_FILE_SIZE)}` 
      };
    }

    return { valid: true };
  }

  /**
   * Convierte bytes a un formato legible
   * @param bytes - Número de bytes
   * @returns String formateado (ej: "2.5 MB")
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Crea una URL de preview para un archivo
   * @param file - El archivo
   * @returns URL de preview o null si no es posible
   */
  static createPreviewUrl(file: File): string | null {
    if (file && file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  /**
   * Revoca una URL de preview creada anteriormente
   * @param url - La URL a revocar
   */
  static revokePreviewUrl(url: string): void {
    if (url) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Redimensiona una imagen manteniendo la proporción
   * @param file - El archivo de imagen
   * @param maxWidth - Ancho máximo
   * @param maxHeight - Alto máximo
   * @param quality - Calidad de la imagen (0-1)
   * @returns Promise<File> - Archivo redimensionado
   */
  static async resizeImage(
    file: File, 
    maxWidth: number = 1920, 
    maxHeight: number = 1080, 
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo la proporción
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar la imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Error al redimensionar la imagen'));
          }
        }, file.type, quality);
      };

      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Genera un nombre único para un archivo
   * @param originalName - Nombre original del archivo
   * @returns Nombre único
   */
  static generateUniqueFileName(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const extension = originalName.split('.').pop();
    return `${timestamp}_${random}.${extension}`;
  }

  /**
   * Extrae metadatos de una imagen
   * @param file - El archivo de imagen
   * @returns Promise con metadatos
   */
  static async extractImageMetadata(file: File): Promise<{
    width: number;
    height: number;
    size: number;
    type: string;
    name: string;
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          type: file.type,
          name: file.name
        });
      };
      
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.src = URL.createObjectURL(file);
    });
  }
}

export default FileUtils;
