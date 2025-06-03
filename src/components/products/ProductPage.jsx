import { useState, useEffect } from "react";
import { config, getApiUrl } from "../../../config";
import { FaRegSquareCheck } from "react-icons/fa6";
import ProductSection from "./ProductSection.jsx";
import { motion } from "framer-motion";


export default function ProductPage(){
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    useEffect(() => {
        fetch(getApiUrl(config.endpoints.productos.detail(id)))
            .then(response => response.json())
            .then(data => {
                let specsValue = data.data.specs;
                let specsObject = {};
    
                if (typeof specsValue === 'string' && specsValue.includes(':')) {
                    specsValue.split(',').forEach(pair => {
                        const [key, value] = pair.split(':').map(str => str.trim());
                        if (key && value) specsObject[key] = value;
                    });
                } else {
                    specsObject = { Descripción: specsValue };
                }
                setProduct({
                    ...data,
                    data: {
                        ...data.data,
                        specs: specsObject
                    }
                });
    
                setLoading(false);
            })
            .catch(() => {
                setProduct(null);
                setLoading(false);
            });
    }, [id]);
    

    if (loading) { return <p className="grid min-h-screen place-content-center text-5xl font-extrabold animate-pulse bg-blue-200">Cargando...</p> }
    if (!product) { return <p>Producto no encontrado...</p> }

    const {title, subtitle, description, images, specs, tagline, seccion, stockProducto, precioProducto} = product.data;
    console.log(product)
    return (
        <>
            <div className="w-full">
                <img
                        id="product-img"
                        src={`https://apiyuntas.yuntaspublicidad.com/`+images[0]}
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
                    {/* Imagen principal */}
                    <div className="mx-auto w-2/3 md:w-full aspect-[1/1] overflow-hidden flex items-center justify-center">
                    <img
                        id="product-viewer"
                        src={`https://apiyuntas.yuntaspublicidad.com/` + images[0]}
                        alt={"Primera imagen de " + title}
                        className="w-full rounded-2xl object-contain"
                    />
                    </div>

                    {/* Grid de miniaturas */}
                    {/* <div
                    className="grid grid-cols-4 gap-2 w-full"
                    id="images-list"
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
                    <h3 className="font-extrabold mb-2 text-3xl">Especificaciones</h3>
                    <ul className="space-y-2" id="specs-list">
                        {Object.entries(specs).map(([key, value]) => (
                        <li className="text-2xl flex items-center" key={key}>
                            <FaRegSquareCheck className="mr-3" />
                            <strong>{key.charAt(0).toUpperCase() + key.slice(1)}</strong>: {value}
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
                        {Object.entries(specs).map(([key, value]) => (
                        <li className="text-2xl flex items-center" key={key}>
                            <FaRegSquareCheck className="mr-3" /> 
                            {key.charAt(0).toUpperCase() + key.slice(1)} : {value}
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
                    {/* Imagen principal */}
                    <div className="overflow-hidden rounded-3xl">
                    <img
                        className="w-full h-[340px] object-cover"
                        src={`https://apiyuntas.yuntaspublicidad.com/` + images[1]}
                        alt={"Segunda imagen de " + title}
                        loading="lazy"
                    />
                    </div>

                    {/* Grid de miniaturas */}
                    {/* <div
                    className="grid grid-cols-4 gap-2 w-full"
                    id="images-list"
                    >
                    </div> */}
                </motion.div>
                </ProductSection>

                {/* Call To Action Button */}
                <div className="flex flex-col justify-center items-center bg-indigo-950 py-12">
                    <p className="text-white text-3xl font-semibold">¿Encontraste lo que buscabas?</p>
                    <button className="my-6 text-white font-extrabold bg-gradient-to-l from-cyan-300 to-cyan-600 px-20 py-4 rounded-full text-lg sm:text-2xl hover:from-cyan-600 hover:to-cyan-300">Cotizar</button>
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
