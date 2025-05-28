import { useState, useEffect } from "react";
import { config, getApiUrl } from "../../../config";

export default function ProductPage(){
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    useEffect(() => {
        fetch(getApiUrl(config.endpoints.productos.detail(id)))
        .then(response => response.json())
        .then(data => {
            setProduct(data)
            setLoading(false)
        })
        .catch(() => {
            setProduct(null)
            setLoading(false)
        })
    }, [id])

    if (loading) { return <p>Cargando...</p> }
    if (!product) { return <p>Producto no encontrado...</p> }

    const {title, description, images, specs, tagline, subtitle, stockProcuto, seccion, precioProducto} = product.data;
    console.log(product)
    return (
        <>
        <section className="relative w-full">
            <img className="" src={`https://apiyuntas.yuntasproducciones.com/`+images[0]} alt={`Banner de `+title} />
        </section>
        <div className="pt-20">
            <h1>{title}</h1>
            <p>{description}</p>
            <img src={`https://apiyuntas.yuntasproducciones.com/`+images[0]} alt={images[1].texto_alt_SEO} />
        </div>
        </>
    )
}