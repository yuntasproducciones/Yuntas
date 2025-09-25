import { buildImageUrl, getImageTitle } from "../../utils/imageHelpers";
import { motion } from "framer-motion";
import Emergente from "./Emergente";
import { FaRegSquareCheck } from "react-icons/fa6";
import type { Product } from "../../models/Product";

interface ProductoPageProps {
    data: Product;
}

const ProductoPage = ({ data }: ProductoPageProps) => {
    if (!data) return <p className="grid min-h-screen place-content-center text-5xl font-extrabold animate-pulse bg-blue-200">Cargando...</p>

    return (
        <div className="w-full">
            {/* el componente emergente genera el siguiente error por consola: Minified React error #418 */}
            <Emergente producto={data} />

            {/* Banner principal */}
            <img
                id="product-img"
                src={
                    data.imagenes && data.imagenes.length > 0 && data.imagenes[0]?.url_imagen
                        ? buildImageUrl(data.imagenes[0].url_imagen) ?? undefined
                        : buildImageUrl(data.imagen_principal) ?? undefined
                }
                alt={
                    data.imagenes && data.imagenes.length > 0 && data.imagenes[0]?.texto_alt_SEO
                        ? data.imagenes[0].texto_alt_SEO
                        : 'Banner de ' + data.titulo
                }
                title={getImageTitle(data.imagenes[0] || data.imagen_principal, 'Banner de ' + data.titulo)}
                className="w-full h-[600px] mx-auto my-auto object-cover"
            />

            <div className="bg-white">
                <h2 className="font-extrabold text-center text-5xl py-16 px-4 text-blue-950">{data.titulo}</h2>
            </div>

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
                        <div className="mx-auto w-2/3 md:w-full aspect-[1/1] overflow-hidden flex items-center justify-center">
                            <img
                                id="product-viewer"
                                src={
                                    data.imagenes && data.imagenes.length > 1 && data.imagenes[1]?.url_imagen
                                        ? buildImageUrl(data.imagenes[1].url_imagen) ?? undefined
                                        : buildImageUrl(data.imagen_principal) ?? undefined
                                }
                                alt={
                                    data.imagenes && data.imagenes.length > 1 && data.imagenes[1]?.texto_alt_SEO
                                        ? data.imagenes[1].texto_alt_SEO
                                        : "Especificaciones de " + data.titulo
                                }
                                title={getImageTitle(data.imagenes[1] || data.imagen_principal, "Especificaciones de " + data.titulo)}
                                className="w-full rounded-2xl object-contain"
                            />
                        </div>

                        <div className="order-1 lg:order-2 text-white">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center lg:text-left">
                                Especificaciones
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(data.especificaciones)
                                    .filter(([key]) => key.startsWith("spec"))
                                    .map(([key, value]) => (
                                        <div key={key} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <FaRegSquareCheck className="text-cyan-400 text-xl sm:text-2xl" />
                                            </div>
                                            <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed">
                                                {String(value)}
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
                        {data.descripcion}
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
                        <div className="text-white">
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-center lg:text-left">
                                Beneficios:
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(data.especificaciones)
                                    .filter(([key]) => key.toLowerCase().startsWith('beneficio'))
                                    .map(([key, value]) => (
                                        <div key={key} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">
                                                <FaRegSquareCheck className="text-cyan-400 text-xl sm:text-2xl" />
                                            </div>
                                            <p className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed">
                                                {String(value)}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="flex justify-center lg:justify-end">
                            <div className="relative max-w-sm w-full">
                                <div className="aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                    <img
                                        src={
                                            data.imagenes && data.imagenes.length > 2 && data.imagenes[2]?.url_imagen
                                                ? buildImageUrl(data.imagenes[2].url_imagen) ?? ""
                                                : buildImageUrl(data.imagen_principal) ?? ""
                                        }
                                        alt={"Beneficios de " + data.titulo}
                                        title={getImageTitle(data.imagenes[2] || data.imagen_principal, "Beneficios de " + data.titulo)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
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

export default ProductoPage