// hooks/useBlogSEO.js
import { useEffect } from 'react';

const useBlogSEO = (blog) => {
  useEffect(() => {
    if (!blog || !blog.etiqueta) return;

    const metaTitle = blog.etiqueta.meta_titulo || blog.nombre_producto;
    const metaDescription = blog.etiqueta.meta_descripcion || blog.subtitulo;

    console.log('🔍 Aplicando SEO del blog:', {
      id: blog.id,
      metaTitle,
      metaDescription,
      hasEtiqueta: !!blog.etiqueta
    });

    // Setear título del documento
    document.title = metaTitle;

    // Meta descripción
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = metaDescription;

    // Open Graph
    const setOgMeta = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    setOgMeta('og:title', metaTitle);
    setOgMeta('og:description', metaDescription);
  }, [blog]);
};

export default useBlogSEO;
