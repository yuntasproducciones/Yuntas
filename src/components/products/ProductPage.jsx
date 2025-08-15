import { useState, useEffect } from "react";
import { config, getApiUrl } from "../../../config";
import { FaRegSquareCheck } from "react-icons/fa6";
import ProductSection from "./ProductSection.jsx";
import { motion } from "framer-motion";

export default function ProductPage(){
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const linkParam = urlParams.get('link');
        
        if (!linkParam) {
            console.error('No se encontró el parámetro link en la URL');
            setLoading(false);
            return;
        }

        console.log('Buscando producto con link:', linkParam);
        console.log('URL de API:', getApiUrl(config.endpoints.productos.link(linkParam)));

      fetch(getApiUrl(config.endpoints.productos.link(linkParam)))
        .then(async response => {
            console.log('Respuesta del servidor:', response.status);
            if (!response.ok) {
            // Intentar obtener texto para debug
            const text = await response.text();
            throw new Error(`Error HTTP ${response.status}: ${text.substring(0, 100)}`);
            }
            return response.json();
        })
            .then(data => {
                console.log('Datos recibidos:', data);
                
                if (!data.success) {
                    console.error('Error en la respuesta:', data.message);
                    setProduct(null);
                    setLoading(false);
                    return;
                }

                const productData = data.data;

                // Convertir especificaciones array a objeto con claves spec_
                let specsObject = {};
                if (productData.especificaciones && Array.isArray(productData.especificaciones)) {
                    productData.especificaciones.forEach((spec, index) => {
                        specsObject[`spec_${index + 1}`] = spec;
                    });
                }

                // Convertir beneficios array a objeto con claves beneficio_
                if (productData.beneficios && Array.isArray(productData.beneficios)) {
                    productData.beneficios.forEach((beneficio, index) => {
                        specsObject[`beneficio_${index + 1}`] = beneficio;
                    });
                }

                // Mapear los campos para que coincidan con lo que espera el componente
                const mappedProduct = {
                    success: data.success,
                    message: data.message,
                    data: {
                        ...productData,
                        title: productData.titulo || productData.nombre, // titulo o nombre -> title
                        subtitle: productData.nombre, // nombre -> subtitle
                        description: productData.descripcion, // descripcion -> description
                        image: productData.imagen_principal, // imagen_principal -> image
                        specs: specsObject, // estructura convertida
                        benefits: productData.beneficios || [], // mantener beneficios originales
                        images: productData.imagenes || [] // mantener imagenes
                    }
                };

                setProduct(mappedProduct);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error al obtener el producto:', error);
                setProduct(null);
                setLoading(false);
            });
    }, []);

    if (loading) { 
        return <p className="grid min-h-screen place-content-center text-5xl font-extrabold animate-pulse bg-blue-200">Cargando...</p> 
    }
    
    if (!product) { 
        return (
            <div className="grid min-h-screen place-content-center text-center bg-blue-200">
                <div>
                    <p className="text-5xl font-extrabold mb-4">Producto no encontrado</p>
                    <p className="text-xl">El producto solicitado no existe o ha sido eliminado.</p>
                    <a href="/products" className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Volver a productos
                    </a>
                </div>
            </div>
        );
    }

    // Determinar la URL base para las imágenes
    const isLocalDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const imageBaseUrl = isLocalDev ? 'http://127.0.0.1:8000' : 'https://apiyuntas.yuntaspublicidad.com';

    const { title, subtitle, description, images, specs: allSpecs, benefits, image } = product.data;

    // Función helper para construir URLs de imágenes (simplificada como BlogDetail)
const buildImageUrl = (imagePath) => {
  if (!imagePath) return '/placeholder-image.jpg';

  const path = imagePath?.startsWith('/')
    ? imagePath
    : `/${imagePath}`;

  return `${imageBaseUrl}${path}`;
};

    
    console.log('=== DEBUGGING COMPLETO ===');
  console.log('Datos del producto procesados:', {
  title,
  images,
  image,
  allSpecs,
  imageUrls: {
    banner: buildImageUrl(image),
    specs: images?.[1]?.url_imagen ? buildImageUrl(images[1].url_imagen) : 'No disponible',
    benefits: images?.[2]?.url_imagen ? buildImageUrl(images[2].url_imagen) : 'No disponible'
  }
});

    
    console.log('=== DEBUGGING IMÁGENES ===');
    console.log('imageBaseUrl:', imageBaseUrl);
    console.log('imagen_principal:', image);
    
    if (images && images.length > 0) {
        images.forEach((img, index) => {
            console.log(`Imagen ${index}:`, {
                raw: img,
                url_imagen: img.url_imagen,
                fullUrl: buildImageUrl(img.url_imagen),
                existe_url_imagen: !!img.url_imagen
            });
        });
    } else {
        console.log('No hay imágenes en el array');
    }
    
    console.log('URLs construidas:', {
        banner: buildImageUrl(image),
        specs: images?.[1]?.url_imagen ? buildImageUrl(images[1].url_imagen) : 'No disponible - ' + (images?.[1] ? 'imagen existe pero sin url_imagen' : 'no hay imagen en índice 1'),
        benefits: images?.[2]?.url_imagen ? buildImageUrl(images[2].url_imagen) : 'No disponible - ' + (images?.[2] ? 'imagen existe pero sin url_imagen' : 'no hay imagen en índice 2')
    });
    
    return (
        <>
            <div className="w-full">
                {/* Banner principal */}
                <img
                    id="product-img"
                    src={buildImageUrl(image)}
                    alt={'Banner de ' + title}
                    className="w-full h-[600px] mx-auto my-auto object-cover"
                />
                
                {/* Hero Banner */}
                <h2 className="font-extrabold text-center text-5xl py-16 px-4 text-blue-950">{title}</h2>

                {/* Main Content - Especificaciones */}
                <ProductSection>
                    {/* Left Column - Gallery */}
                    <motion.div
                        className="space-y-4 w-full max-w-[440px] md:justify-self-end"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {/* Imagen para Especificaciones */}
                        <div className="mx-auto w-2/3 md:w-full aspect-[1/1] overflow-hidden flex items-center justify-center border-2 border-red-500">
                            <img
                                id="product-viewer"
                                src={
                                  images && images.length > 1 && images[1]?.url_imagen
                                    ? buildImageUrl(images[1].url_imagen)
                                    : buildImageUrl(image)
                                }
                                alt={images && images.length > 1 && images[1]?.texto_alt_SEO ? images[1].texto_alt_SEO : 'Especificaciones de ' + title}
                                className="w-full rounded-2xl object-contain"
                                onError={(e) => {
                                    console.error('Error cargando imagen specs:', e.target.src);
                                    e.target.style.border = '2px solid red';
                                    e.target.alt = 'Error cargando imagen: ' + e.target.src;
                                }}
                                onLoad={(e) => {
                                    console.log('Imagen specs cargada correctamente:', e.target.src);
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Right Column - Product Info */}
                    <motion.div
                        className="content-center md:justify-self-start"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="grid gap-6 md:gap-8 rounded-lg mb-12 md:mb-0 text-white">
                            <h3 className="font-extrabold mb-2 text-3xl">Especificaciones:</h3>
                            <ul className="space-y-2" id="specs-list">
                                {Object.entries(allSpecs)
                                    .filter(([key]) => key.toLowerCase().startsWith('spec'))       
                                    .map(([key, value]) => (
                                        <li className="text-2xl flex items-center" key={key}>
                                            <FaRegSquareCheck className="mr-3" /> 
                                            {value}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </motion.div>
                </ProductSection>

                <div className="text-center py-16 px-4 text-blue-950">
                    <p className="font-extrabold text-3xl mb-4">Información</p>
                    <p className="font-semibold text-xl">{description}</p>
                </div>
                
                {/* Benefit Content */}
                <ProductSection>
                    {/* Left Column - Benefits */}
                    <motion.div
                        className="content-center md:justify-self-end my-12"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        <div className="grid gap-6 md:gap-8 rounded-lg mt-12 md:mt-0 text-white">
                            <h3 className="font-extrabold mb-2 text-3xl">Beneficios:</h3>
                            <ul className="space-y-2" id="benefits-list">
                                {Object.entries(allSpecs)
                                    .filter(([key]) => key.toLowerCase().startsWith('beneficio'))
                                    .map(([key, value]) => (
                                        <li className="text-2xl flex items-center" key={key}>
                                            <FaRegSquareCheck className="mr-3" /> 
                                            {value}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </motion.div>
                    
                    {/* Right Column - Images */}
                    <motion.div
                        className="space-y-4 max-w-[250px] sm:max-w-[300px] py-12 md:justify-self-start"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {/* Imagen para Beneficios */}
                        <div className="overflow-hidden rounded-3xl border-2 border-blue-500">
                            <img
                                id="product-benefits-img"
                                src={
                                    images && images.length > 2 && images[2]?.url_imagen
                                        ? buildImageUrl(images[2].url_imagen)
                                        : buildImageUrl(image)
                                }
                                alt={'Beneficios de ' + title}
                                className="w-full h-[600px] mx-auto my-auto object-cover"
                                onError={(e) => {
                                    console.error('Error cargando imagen benefits:', e.target.src);
                                    e.target.style.border = '2px solid red';
                                    e.target.alt = 'Error cargando imagen: ' + e.target.src;
                                }}
                                onLoad={(e) => {
                                    console.log('Imagen benefits cargada correctamente:', e.target.src);
                                }}
                            />
                        </div>
                    </motion.div>
                </ProductSection>

                {/* Call To Action Button */}
                <div className="flex flex-col justify-center items-center bg-indigo-950 py-12">
                    <p className="text-white text-3xl font-semibold">¿Encontraste lo que buscabas?</p>
                    <a href="/contact" className="my-6 text-white font-extrabold bg-gradient-to-l from-cyan-300 to-cyan-600 px-20 py-4 rounded-full text-lg sm:text-2xl hover:from-cyan-600 hover:to-cyan-300">Cotizar</a>
                </div>  
            </div>
        </>
    )
}