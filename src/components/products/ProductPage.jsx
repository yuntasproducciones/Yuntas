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
        .then(response => {
            console.log('Respuesta del servidor:', response.status);
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

            // Manejar la estructura de la API v1
            const productData = data.data;
            let specsValue = productData.specs;
            let specsObject = {};

            // Procesar specs de la API v1
            if (typeof specsValue === 'object' && specsValue !== null) {
                // API v1 ya devuelve un objeto
                specsObject = specsValue;
            } else if (typeof specsValue === 'string' && specsValue.includes(':')) {
                // Fallback para formato string
                specsValue.split(',').forEach(pair => {
                    const [key, value] = pair.split(':').map(str => str.trim());
                    if (key && value) specsObject[key] = value;
                });
            } else {
                specsObject = { Descripción: specsValue ?? "Sin Descripción" };
            }

            // Parsear especificaciones adicionales si existen (legacy)
            let especificacionesObject = {};
            if (productData.especificaciones) {
                try {
                    especificacionesObject = typeof productData.especificaciones === 'string' 
                        ? JSON.parse(productData.especificaciones)
                        : productData.especificaciones;
                } catch (e) {
                    console.warn("No se pudo parsear 'especificaciones'", e);
                }
            }

            // Combinar specs y especificaciones
            let allSpecs = {
                ...specsObject,
                ...especificacionesObject
            };
            
            // Eliminar la descripción de specs ya que va en su propio campo
            delete allSpecs.descripcion;
            delete allSpecs.Descripción;
            
            // Procesar beneficios - API v1 puede tenerlos en specs o benefits
            const benefits = productData.benefits || 
                Object.entries(allSpecs)
                    .filter(([key]) => key.startsWith('beneficio_'))
                    .map(([key, value]) => ({ texto: String(value) })) || 
                [];

            setProduct({
                ...data,
                data: {
                    ...productData,
                    specs: allSpecs,
                    benefits: benefits,
                }
            });

            setLoading(false);
        })
        .catch((error) => {
            console.error('Error al obtener el producto:', error);
            setProduct(null);
            setLoading(false);
        });
}, []);

    
    

    if (loading) { return <p className="grid min-h-screen place-content-center text-5xl font-extrabold animate-pulse bg-blue-200">Cargando...</p> }
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

    const {title, subtitle, description, images, specs, tagline, seccion, stock, precioProducto, image} = product.data;
    
    // Usar imagen principal o la primera imagen disponible
    const mainImage = image || images?.[0]?.url_imagen;
    
    // Función helper para construir URLs de imágenes
    const buildImageUrl = (imagePath) => {
        if (!imagePath) return '/placeholder-image.jpg';
        
        // Si ya es una URL completa, usarla tal como está
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        
        // Si es una ruta relativa, construir la URL completa
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        const fullUrl = `${imageBaseUrl}${cleanPath}`;
        
        console.log('Construyendo URL de imagen:', {
            imagePath,
            cleanPath,
            imageBaseUrl,
            fullUrl
        });
        
        return fullUrl;
    };
    
    console.log('Datos del producto:', {
        title,
        images,
        mainImage,
        imageBaseUrl
    });
    
    // console.log(product.data)
    return (
        <>
            <div className="w-full">
                <img
                        id="product-img"
                        src={
                          images && images.length > 0 && images[0]?.url_imagen
                            ? buildImageUrl(images[0].url_imagen)
                            : buildImageUrl(mainImage)
                        }
                        alt={'Banner de '+title}
                        className="w-full h-[600px] mx-auto my-auto"
                />
                {/* Hero Banner */}
                <h2 className="font-extrabold text-center text-5xl py-16 px-4 text-blue-950">{title}</h2>

                {/* Main Content */}
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
                    <div className="mx-auto w-2/3 md:w-full aspect-[1/1] overflow-hidden flex items-center justify-center">
                    <img
                        id="product-viewer"
                        src={
                          images && images.length > 1 && images[1]?.url_imagen
                            ? buildImageUrl(images[1].url_imagen)
                            : '/placeholder-image.jpg'
                        }
                        alt={images && images.length > 1 && images[1]?.texto_alt_SEO ? images[1].texto_alt_SEO : 'Especificaciones de ' + title}
                        className="w-full rounded-2xl object-contain"
                    />
                    </div>

                    {/* Otras imágenes protegidas */}
                    {/* Ejemplo para images[2] */}
                    {/*
                    <img
                        src={
                          images && images.length > 2 && images[2]?.url_imagen
                            ? `${imageBaseUrl}${images[2].url_imagen.startsWith('/') ? '' : '/'}${images[2].url_imagen}`
                            : '/placeholder-image.jpg'
                        }
                        alt={images && images.length > 2 && images[2]?.texto_alt_SEO ? images[2].texto_alt_SEO : title}
                        className="w-full rounded-2xl object-contain"
                    />
                    */}
                    {/* Repite la lógica para cualquier otro acceso a images[N] */}
                    {/* <div
                    className="grid grid-cols-4 gap-2 w-full"
                    id="imagenes-list"
                    >
                    </div> */}
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
                    {Object.entries(specs)
                        .filter(([key]) => key.toLowerCase().startsWith('spec_') || key.toLowerCase().startsWith('spec'))
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
                
                {/* Benefict Content */}
                <ProductSection>
                {/* Left Column - Benefics */}
                <motion.div
                    className="content-center md:justify-self-end my-12"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <div className="grid gap-6 md:gap-8 rounded-lg mt-12 md:mt-0 text-white">
                    <h3 className="font-extrabold mb-2 text-3xl">Beneficios:</h3>
                    <ul className="space-y-2" id="specs-list">
                        {Object.entries(specs)
                            .filter(([key]) => key.toLowerCase().startsWith('beneficio_') || key.toLowerCase().startsWith('beneficio'))
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
                    <div className="overflow-hidden rounded-3xl">
                    <img
                        className="w-full h-[340px] object-cover"
                        src={
                          images && images.length > 2 && images[2]?.url_imagen
                            ? buildImageUrl(images[2].url_imagen)
                            : '/placeholder-image.jpg'
                        }
                        alt={images && images.length > 2 && images[2]?.texto_alt_SEO ? images[2].texto_alt_SEO : 'Beneficios de ' + title}
                        loading="lazy"
                    />
                    </div>

                    {/* Grid de miniaturas */}
                    {/* <div
                    className="grid grid-cols-4 gap-2 w-full"
                    id="imagenes-list"
                    >
                    </div> */}
                </motion.div>
                </ProductSection>

                {/* Call To Action Button */}
                <div className="flex flex-col justify-center items-center bg-indigo-950 py-12">
                    <p className="text-white text-3xl font-semibold">¿Encontraste lo que buscabas?</p>
                    <a href="/contact" className="my-6 text-white font-extrabold bg-gradient-to-l from-cyan-300 to-cyan-600 px-20 py-4 rounded-full text-lg sm:text-2xl hover:from-cyan-600 hover:to-cyan-300">Cotizar</a>
                </div>

                    {/* Similar Products */}
                    {/* <div className="mt-8 md:mt-12">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-teal-500">
                        ARTÍCULOS SIMILARES
                        </h2>
                        <div
                            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6"
                            id="related-products-container"
                        >
                        </div>
                    </div> */}
                    
                
            </div>
            
            
        </>
        
    )
    
}
