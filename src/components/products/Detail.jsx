import { useEffect, useState } from "react";
import Fader from "./Fader";
import Emergente from "./Emergente";
import { config, getApiUrl } from "../../../config.ts";

export default function Details({ id }) {
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setError("No se proporcionó un ID de producto");
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                const url = getApiUrl(config.endpoints.productos.detail(id));
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }

                const jsonResponse = await response.json();

                if (jsonResponse.data) {
                    const baseUrl = config.baseUrl || "";
                    const productoConImagenes = {
                        ...jsonResponse.data,
                        imagenes: Array.isArray(jsonResponse.data.imagenes)
                            ? jsonResponse.data.imagenes.map(img => ({
                                ...img,
                                url_imagen: `${baseUrl}${img.url_imagen}`
                            }))
                            : jsonResponse.data.imagenes
                                ? [{
                                    ...jsonResponse.data.imagenes,
                                    url_imagen: `${baseUrl}${jsonResponse.data.imagenes.url_imagen}`
                                }]
                                : []
                    };
                    setProducto(productoConImagenes);
                } else {
                    throw new Error("Producto no encontrado");
                }
            } catch (err) {
                console.error("Error fetching product:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Cargando producto...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>No se encontró el producto</p>
            </div>
        );
    }

    const localImages = {
        1: { banner: "/products/BarrasPixelLED/banner.webp", beneficios: "/products/BarrasPixelLED/beneficios.webp" },
        2: { banner: "/products/PisosLED/banner.webp", beneficios: "/products/PisosLED/beneficios.webp" },
        3: { banner: "/products/SillasyMesasLED/banner.webp", beneficios: "/products/SillasyMesasLED/beneficios.webp" }
    };

    const currentLocalImages = localImages[producto.id] || localImages[1];

    return (
        <>
            <div className="w-full h-dvh grid grid-rows-[90%_10%]">
                {producto.imagenes.length > 0 ? (
                    <img
                        src={producto.imagenes[0].url_imagen}
                        alt={producto.imagenes[0].texto_alt_SEO || producto.titulo}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <img
                        src={currentLocalImages.banner}
                        alt={producto.titulo || "Banner del producto"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                )}
                <h1 className="w-full bg-white text-blue-950 place-content-center font-extrabold text-center text-3xl lg:text-5xl 2xl:text-7xl 2xl:h-[100px]">
                    {producto.titulo || producto.nombre}
                </h1>
            </div>

            <section className="bg-gradient-to-b from-blue-900 to-indigo-950 text-white w-full">
                <div className="flex flex-col items-center sm:flex-row sm:justify-around w-full py-16 px-2 sm:px-8">
                    <Fader nombreProducto={producto.nombre.replace(/\s+/g, "")} />
                    <div className="flex flex-col justify-evenly ps-6 pe-2 sm:px-7 w-full h-full max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl">
                        <h2 className="text-sm sm:text-xl md:text-2xl lg:text-4xl 2xl:text-6xl font-extrabold text-center">
                            Especificaciones
                        </h2>
                        <ul className="list-disc text-xs sm:text-md md:text-base lg:text-xl xl:text-2xl 2xl:text-4xl">
                            <li className="my-6">
                                {producto.especificaciones || "No hay especificaciones disponibles"}
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-blue-950 bg-white w-full py-6 text-center px-2 lg:px-12 2xl:py-14">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-6xl font-extrabold">
                        Información
                    </h2>
                    <p className="whitespace-break-spaces font-semibold my-5 text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-4xl">
                        {producto.descripcion || "No hay descripción disponible"}
                    </p>
                </div>

                <div className="flex flex-col items-center sm:flex-row sm:justify-around w-full py-16 px-8">
                    <div className="flex flex-col justify-evenly ps-6 pe-2 sm:px-7 lg:px-10 2xl:px-16 w-full h-full max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl">
                        <h2 className="text-sm sm:text-xl md:text-2xl lg:text-4xl 2xl:text-6xl font-extrabold text-center">
                            Beneficios
                        </h2>
                        <ul className="list-disc text-xs sm:text-md md:text-base lg:text-xl xl:text-2xl 2xl:text-4xl">
                            <li className="my-6">
                                {producto.lema || "No hay información de beneficios disponible"}
                            </li>
                        </ul>
                    </div>
                    {producto.imagenes.length > 1 ? (
                        <img
                            src={producto.imagenes[1].url_imagen}
                            alt={producto.imagenes[1].texto_alt_SEO || `Imagen de ${producto.titulo}`}
                            loading="lazy"
                            className="rounded-4xl max-h-[20rem] w-full h-full max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl shadow-2xl object-cover object-center"
                        />
                    ) : (
                        <img
                            src={currentLocalImages.beneficios}
                            alt={`Imagen de ${producto.titulo}`}
                            loading="lazy"
                            className="rounded-4xl max-h-[20rem] w-full h-full max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl shadow-2xl object-cover object-center"
                        />
                    )}
                </div>
            </section>

            <Emergente producto={producto} />
        </>
    );
}
