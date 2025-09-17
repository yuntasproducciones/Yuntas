
//  Dimensiones físicas de productos (ej: panel LED, silla, etc.)

export default interface Dimensions {
  alto: string;
  largo: string;
  ancho: string;
}

// Dimensiones de imágenes responsivas (frontend)

export interface ResponsiveDimensions {
  desktop: { width: number; height: number };
  tablet: { width: number; height: number };
  mobile: { width: number; height: number };
}

// Banner principal (HeroSlider)
export const BANNER: ResponsiveDimensions = {
  desktop: { width: 1920, height: 1080 }, // full HD
  tablet: { width: 1280, height: 720 },
  mobile: { width: 768, height: 1024 }, // vertical
};

// Foto de portada (cabecera producto, h-[600px])
export const COVER_PHOTO: ResponsiveDimensions = {
  desktop: { width: 1920, height: 600 },
  tablet: { width: 1280, height: 500 },
  mobile: { width: 768, height: 400 },
};

// Especificaciones (aspect-ratio 1/1)
export const SPEC_IMAGE: ResponsiveDimensions = {
  desktop: { width: 800, height: 800 },
  tablet: { width: 600, height: 600 },
  mobile: { width: 400, height: 400 },
};

// Beneficios (aspect-ratio 3/4)
export const BENEFITS_IMAGE: ResponsiveDimensions = {
  desktop: { width: 900, height: 1200 },
  tablet: { width: 600, height: 800 },
  mobile: { width: 400, height: 600 },
};
