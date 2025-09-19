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
      "@type": "Brand",
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
      price: 50.00,
      priceCurrency: "PEN",
      priceValidUntil: "2025-09-19",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0.00,
          currency: "PEN"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PE"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "DAY"
          }
        }
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "PE",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 10,
        returnMethod: "https://schema.org/ReturnInStore",
        returnFees: "https://schema.org/ReturnShippingFees",
        returnShippingFeesAmount: {
          "@type": "MonetaryAmount",
          value: 5.00,
          currency: "PEN"
        }
      }
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Nilton Ramos"
        },
        datePublished: "2025-09-19",
        reviewBody: "Un excelente producto, seguramente volveré por más.",
        name: "Todo lo que necesito.",
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "4",
          worstRating: "1"
        }
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "María López"
        },
        datePublished: "2025-08-10",
        reviewBody: "Muy buena calidad y entrega rápida. Recomiendo totalmente.",
        name: "Entrega rápida y confiable",
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "5",
          worstRating: "1"
        }
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Carlos Fernández"
        },
        datePublished: "2025-07-22",
        reviewBody: "Producto conforme a la descripción, buen soporte del vendedor.",
        name: "Satisfecho con la compra",
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "4",
          worstRating: "1"
        }
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Ana Martínez"
        },
        datePublished: "2025-06-15",
        reviewBody: "La calidad es excelente, aunque el envío tardó un poco más de lo esperado.",
        name: "Muy buena calidad",
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "4",
          worstRating: "1"
        }
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Jorge Paredes"
        },
        datePublished: "2025-05-30",
        reviewBody: "Cumple con lo que promete, materiales de buena calidad.",
        name: "Producto confiable",
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "5",
          worstRating: "1"
        }
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Lucía Torres"
        },
        datePublished: "2025-04-18",
        reviewBody: "Buena relación calidad-precio, volvería a comprar sin dudas.",
        name: "Excelente relación calidad-precio",
        reviewRating: {
          "@type": "Rating",
          bestRating: "5",
          ratingValue: "5",
          worstRating: "1"
        }
      }
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: 88,
      bestRating: 100,
      ratingCount: 20
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
