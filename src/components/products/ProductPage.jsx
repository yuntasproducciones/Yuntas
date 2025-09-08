import { useState, useEffect } from "react";
import { config, getApiUrl } from "../../../config.js";
import { FaRegSquareCheck } from "react-icons/fa6";
import ProductSection from "./ProductSection.jsx";
import { motion } from "framer-motion";
import Emergente from "./Emergente.jsx"; 

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
            if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("text/html")) {
                throw new Error("Se recibió HTML en lugar de JSON. Posible error 500.");
            }
            throw new Error(`Error HTTP: ${response.status}`);
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

                // Inicializar objeto de especificaciones/beneficios
                let specsObject = {};   

                // Caso: especificaciones viene como objeto (tu backend actual)
                if (productData.especificaciones && typeof productData.especificaciones === "object" && !Array.isArray(productData.especificaciones)) {
                    specsObject = { ...productData.especificaciones };
                }

                // Caso: especificaciones viene como array (por si en el futuro cambias backend)
                else if (Array.isArray(productData.especificaciones)) {
                    productData.especificaciones.forEach((spec, index) => {
                        specsObject[`spec_${index + 1}`] = spec;
                    });
                }

                // Beneficios: si el backend devuelve un array extra de beneficios
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

    // Determinar la URL base para las imágenes - usando siempre producción como ProductCard
    const imageBaseUrl = 'https://apiyuntas.yuntaspublicidad.com';

    const { title, subtitle, description, images, specs: allSpecs, benefits, image } = product.data;

    // Función helper para construir URLs de imágenes - ARREGLADA
    const buildImageUrl = (imagenUrl) => {
        if (!imagenUrl) return '/placeholder-image.jpg';
        return imagenUrl.startsWith('http') ? imagenUrl : `${imageBaseUrl}${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
    };
    
    return (
        <div className="w-full">
            {/* Componente Emergente - se mostrará automáticamente */}
            <Emergente producto={product} />

                {/* Banner principal */}
                <img
                    id="product-img"
                    src={buildImageUrl(image)}
                    alt={'Banner de ' + title}
                    className="w-full h-[600px] mx-auto my-auto object-cover"
                />
                
                {/* Hero Banner */}
                <h2 className="font-extrabold text-center text-5xl py-16 px-4 text-blue-950">{title}</h2>

            {/* Sección de Especificaciones */}
            <div className="bg-indigo-950 py-12 lg:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                      {/* Imagen para Especificaciones */}
                        <div className="mx-auto w-2/3 md:w-full aspect-[1/1] overflow-hidden flex items-center justify-center border-2">
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
                                    // e.target.style.border = '2px solid red';
                                    e.target.alt = 'Error cargando imagen: ' + e.target.src;
                                }}
                                onLoad={(e) => {
                                    console.log('Imagen specs cargada correctamente:', e.target.src);
                                }}
                            />
                        </div>

                        {/* Especificaciones */}
                        <div className="order-1 lg:order-2 text-white">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center lg:text-left">
                                Especificaciones
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(allSpecs)
                                    .filter(([key]) => key.toLowerCase().startsWith('spec'))       
                                    .map(([key, value]) => (
                                        <div key={key} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <FaRegSquareCheck className="text-cyan-400 text-xl sm:text-2xl" />
                                            </div>
                                            <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sección de Información */}
            <div className="bg-white py-12 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-950 mb-8">
                        Información
                    </h2>
                    <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 leading-relaxed font-medium">
                        {description}
                    </p>
                </div>
            </div>
                
            {/* Sección de Beneficios */}
            <div className="bg-indigo-950 py-12 lg:py-20">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        {/* Beneficios */}
                        <div className="text-white">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center lg:text-left">
                                Beneficios:
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(allSpecs)
                                    .filter(([key]) => key.toLowerCase().startsWith('beneficio'))
                                    .map(([key, value]) => (
                                        <div key={key} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <FaRegSquareCheck className="text-cyan-400 text-xl sm:text-2xl" />
                                            </div>
                                            <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        
                        {/* Imagen de beneficios */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative max-w-sm w-full">
                                <div className="aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={
                                            images && images.length > 2 && images[2]?.url_imagen
                                                ? buildImageUrl(images[2].url_imagen)
                                                : buildImageUrl(image)
                                        }
                                        alt={'Beneficios de ' + title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {/* Efecto de glow */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-xl opacity-60 -z-10"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Call To Action */}
            <div className="bg-indigo-950 py-16 lg:py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true, amount: 0.3 }}
                    >
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-8">
                            ¿Encontraste lo que buscabas?
                        </h2>
                        <a 
                            href="/contact" 
                            className="inline-block bg-gradient-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white font-bold text-xl sm:text-2xl lg:text-3xl px-12 sm:px-16 lg:px-20 py-4 sm:py-5 lg:py-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 relative overflow-hidden group"
                        >
                            <span className="relative z-10">Cotizar</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                        </a>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}