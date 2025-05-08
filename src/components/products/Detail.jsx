import { useEffect, useState } from "react";
import Fader from "./Fader";
import Emergente from "./Emergente";
const API_URL = import.meta.env.VITE_API_URL;

import imagen1 from "../../../public/products/BarrasPixelLED/beneficios.webp";
import imagen2 from "../../../public/products/PisosLED/beneficios.webp";
import imagen3 from "../../../public/products/SillasyMesasLED/beneficios.webp";
import imagen4 from "../../../public/products/BarrasPixelLED/beneficios.webp";
import imagen5 from "../../../public/products/PisosLED/beneficios.webp";
import imagen6 from "../../../public/products/SillasyMesasLED/beneficios.webp";


export default function Details() {
  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
    const [id, setId] = useState(1)

  let nameForImages = {
    1: { images: "BarrasPixelLED", banner: imagen4, beneficios: imagen1},
    2: { images: "PisosLED", banner: imagen5, beneficios: imagen2},
    3: { images: "SillasyMesasLED", banner: imagen6, beneficios: imagen3}
  }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const identifier = params.get("id");
    setId(identifier)
    if (identifier < 0 || identifier > 3) setId(1);
    if (!identifier) {
      setError("No se proporcionó un ID válido");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/${identifier}`);
        if (!response.ok) throw new Error("Error al obtener el producto de la API");

        const jsonResponse = await response.json();
        if (jsonResponse.success) {
          setProducto(jsonResponse.data);
        } else {
          throw new Error("Producto no encontrado");
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (producto) document.title = producto.title;
  }, [producto])

  if (error) return <p className="text-red-500">{error}</p>;
  if (!producto) return <p>Cargando producto...</p>;
  return (<>
    <div className="w-full h-dvh grid grid-rows-[90%_10%]">
      <img 
        src={nameForImages[id].banner.src}
        alt={producto.title || "Producto"}
        className="w-full h-full object-cover"
        loading="lazy"
        />
      <h1 className="w-full bg-white text-blue-950 place-content-center font-extrabold text-center text-3xl lg:text-5xl 2xl:text-7xl 2xl:h-[100px]">
        {producto.title}
      </h1>
    </div>

    <section className="bg-linear-to-b from-blue-900 to-indigo-950 text-white w-full">
    <div
    className="flex flex-col items-center sm:flex-row sm:justify-around w-full py-16 px-2 sm:px-8"
    >

    {/* pasar el id por el momento con el objeto, hasta que se  */}
    <Fader nombreProducto={nameForImages[id].images} />
    <div
        className="flex flex-col justify-evenly ps-6 pe-2 sm:px-7 w-full h-full max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl"
    >
        <h2
        className="text-sm sm:text-xl md:text-2xl lg:text-4xl 2xl:text-6xl font-extrabold text-center"
        >
        Especificaciones
        </h2>
        <ul
            className="list-disc text-xs sm:text-md md:text-base lg:text-xl xl:text-2xl 2xl:text-4xl"
        >
            <li className="my-6">
                {producto.specs.especificacion}
            </li>
        </ul>
    </div>
    </div>
    <div
    className="text-blue-950 bg-white w-full py-6 text-center px-2 lg:px-12 2xl:py-14"
    >
    <h2 className="text-2xl md:text-3xl lg:text-4xl 2xl:text-6xl font-extrabold">
        Información
    </h2>
    <p
        className="whitespace-break-spaces font-semibold my-5 text-sm md:text-base lg:text-xl xl:text-2xl 2xl:text-4xl"
    >
        {producto.description}
    </p>
    </div>
    <div
    className="flex flex-col items-center sm:flex-row sm:justify-around w-full py-16 px-8"
    >
    <div
        className="flex flex-col justify-evenly ps-6 pe-2 sm:px-7 lg:px-10 2xl:px-16 w-full h-full max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl"
    >
        <h2
        className="text-sm sm:text-xl md:text-2xl lg:text-4xl 2xl:text-6xl font-extrabold text-center"
        >
        Beneficios
        </h2>
        <ul
        className="list-disc text-xs sm:text-md md:text-base lg:text-xl xl:text-2xl 2xl:text-4xl"
        >
        <li className="my-6">
            { producto.specs.beneficio }
        </li>
        </ul>
    </div>
    <img 
        src={nameForImages[id].beneficios.src}
        alt={`Imagen de ${producto.title} `} 
        loading="lazy"
        className="rounded-4xl max-h-[20rem] w-full h-full max-w-md sm:max-w-2xs lg:max-w-md xl:max-w-xl 2xl:max-w-2xl shadow-2xl object-cover object-center"    
    />
    </div>
    </section>
    {/* ventana emergente */}
    <Emergente className="fixed" producto={producto}/>
    </>);
}
