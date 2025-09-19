// Función para generar JSON-LD dinámicamente a partir del producto
export function generateJsonLd(product: any) {
  const images = [
    product.imagen_principal,
    ...(product.imagenes?.map((img: any) => img.url_imagen) || [])
  ];

  const additionalProperty: { "@type": string; name: string; value: string }[] = [];

  if (product.especificaciones && typeof product.especificaciones === "object") {
    Object.entries(product.especificaciones).forEach(([key, value]) => {
      if (key.toLowerCase().startsWith("spec")) {
        additionalProperty.push({ "@type": "PropertyValue", name: "Especificación", value: String(value) });
      } else if (key.toLowerCase().startsWith("beneficio")) {
        additionalProperty.push({ "@type": "PropertyValue", name: "Beneficio", value: String(value) });
      }
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    image: images,
    description: product.descripcion,
    sku: `PROD-${product.id}`,
    brand: {
      "@type": "Organization",
      name: "Yuntas Publicidad",
      logo: "https://yuntaspublicidad.com/images/yuntas_publicidad_logo_tablet.webp",
      url: "https://yuntaspublicidad.com",
    },
    url: `https://yuntaspublicidad.com/products/producto/?link=${encodeURIComponent(product.link)}`,
    category: product.seccion,
    additionalProperty,
    offers: {
      "@type": "Offer",
      url: `https://yuntaspublicidad.com/products/producto/?link=${encodeURIComponent(product.link)}`,
      priceCurrency: "PEN",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

// Función para insertar el JSON-LD en el <head>
export function insertProductJsonLd(mappedProduct: { success: boolean; message: string; data: any }) {
  try {
    const jsonLd = generateJsonLd(mappedProduct.data);

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(jsonLd, null, 2);
    document.head.appendChild(script);

    console.log('JSON-LD insertado:', script);
  } catch (error) {
    console.error("Error al generar JSON-LD del producto:", error);
  }
}
