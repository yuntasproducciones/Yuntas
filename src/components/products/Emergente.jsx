import { useRef, useEffect, useState } from 'react';
import { z } from "zod";  
import imagenEmergente1 from "../../assets/images/emergente/yuleLove.jpg";
import imagenEmergente2 from "../../assets/images/emergente/em2.jpg";
import imagenEmergente3 from "../../assets/images/emergente/em3.webp";
import imagenEmergente4 from "../../assets/images/emergente/em4.jpg";
import imagenEmergente5 from "../../assets/images/emergente/em5.webp";
import imagenEmergente6 from "../../assets/images/emergente/em6.webp";
import imagenEmergente7 from "../../assets/images/emergente/em7.webp";
import imagenEmergente8 from "../../assets/images/emergente/em8.webp";
import imagenEmergente9 from "../../assets/images/emergente/em9.webp";
import imagenEmergente10 from "../../assets/images/emergente/em10.webp";
import imagenEmergente11 from "../../assets/images/emergente/em11.webp";
import imagenEmergente12 from "../../assets/images/emergente/em12.webp";

const emergenteData = {
"letreros-acrilicos": {titulo: "Obtén", destacado: "Asesoría", subtitulo: "gratuita", imagen: imagenEmergente1, button: "Aprovecha ahora",
},
"paneles-led-electronicos": {titulo: "Disfruta Nuestros", destacado: "Beneficios", subtitulo: "", imagen: imagenEmergente2, button: "Cotiza ahora",
},
"letreros-neon-led": {titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente4, button: "Cotiza ahora",
},
"pisos-led": {titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente4, button: "Cotiza ahora",
},
"pantallas-led": {titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente4, button: "Cotiza ahora",
},
"techos-led": {titulo: "Envío", destacado: "Gratis", subtitulo: "en todo lima", imagen: imagenEmergente12, button: "Aprovecha ahora",
},
"mesas-y-sillas-led": {titulo: "Obtén", destacado: "Asesoría gratuita", subtitulo: "", imagen: imagenEmergente2, button: "Aprovecha ahora",
},
"barras-pixel-led": {titulo: "Recibe", destacado: "Envio Gratis", subtitulo: "", imagen: imagenEmergente4, button: "Deja tus datos",
},
"letras-pintadas-en-mdf": {titulo: "Accede", destacado: "Ofertas Exclusivas", subtitulo: "", imagen: imagenEmergente7, button: "Registrate",
},  
"menu-board": {titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente6, button: "Cotiza ahora",
},
"neon-led": {titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente4, button: "Cotiza ahora",
},
"letreros-luminosos": {titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente4, button: "Cotiza ahora",
},  
"Hologramas-3D": {titulo: "Disfruta", destacado: "Nuestros Beneficios", subtitulo: "", imagen: imagenEmergente9, button: "Aprovecha ahora",
},
"ventiladores holograficos": {titulo: "Gana", destacado: "10% dto.", subtitulo: "en tu compra", imagen: imagenEmergente4, button: "Cotiza ahora",
},

default: {titulo: "Bienvenido", destacado: "a Yuntas", subtitulo: "Elige tu producto ideal", imagen: imagenEmergente1, button: "Contáctanos",
}
};
const schema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    correo: z.string().email("Correo inválido"),
    telefono: z
        .string()
        .min(7, "El número de teléfono es demasiado corto")
        .max(15, "El número de teléfono es demasiado largo")
        .regex(
            /^\+?\d+$/,
            "El teléfono debe contener solo números (y opcionalmente +)"
        ),
});
const Emergente = ({ producto }) => {
const dialogRef = useRef(null);
const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    correo: "",
  });
  const [errors, setErrors] = useState({});

const link = producto?.data?.link || "default";
const data = emergenteData[link] || emergenteData["default"];

useEffect(() => {
  if (dialogRef.current) {
    dialogRef.current.showModal();
  }
}, []);

const onClose = () => {
  dialogRef.current?.close();
};
 const handleSubmit = (e) => {
    e.preventDefault();

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        nombre: fieldErrors.nombre?._errors[0],
        telefono: fieldErrors.telefono?._errors[0],
        correo: fieldErrors.correo?._errors[0],
      });
      return;
    }

    setErrors({});
    console.log("Formulario válido:", formData);

    // Aquí podrías enviar el formulario o cerrar el modal, etc.
  };

const renderTitle = () => (
  <h2 className="text-xl sm:text-4xl font-semibold italic">
    {data.titulo}
    {data.destacado && (
      <>
        <br />
        <span className="text-2xl sm:text-5xl font-bold">{data.destacado}</span>
      </>
    )}
    {data.subtitulo && (
      <>
        <br />
        {data.subtitulo}
      </>
    )}
  </h2>
);

return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl fixed top-[50%] left-[50%] ml-[-300px] sm:ml-[-384px] mt-[-250px] sm:mt-[-225px]"
    >
      <div className="flex flex-col-reverse sm:flex-row rounded-2xl shadow-lg max-w-[600px] sm:max-w-3xl overflow-hidden sm:mx-[0px]">

        {/* Imagen */}
        <div className="sm:w-1/2">
          <img
            src={data.imagen?.src || data.imagen}
            alt={data.destacado || data.titulo}
            className="h-[250px] sm:h-full w-full object-cover"
          />
        </div>

        {/* Texto y formulario */}
        <div className="sm:w-1/2 bg-[#293296] p-8 text-white relative">
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
          >
            ✕
          </button>

          {renderTitle()}

          <form className="mt-4" onSubmit={handleSubmit}>
            <label className="block text-lg font-bold">Nombre</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 rounded-full bg-white text-black mb-1"
            />
            {errors.nombre && <p className="text-red-400 text-sm mb-2">{errors.nombre}</p>}

            <label className="block text-lg font-bold">Teléfono</label>
            <input
              type="text"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-2 rounded-full bg-white text-black mb-1"
            />
            {errors.telefono && <p className="text-red-400 text-sm mb-2">{errors.telefono}</p>}

            <label className="block text-lg font-bold">Correo</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              className="w-full px-4 py-2 rounded-full bg-white text-black mb-1"
            />
            {errors.correo && <p className="text-red-400 text-sm mb-4">{errors.correo}</p>}

            <button
              type="submit"
              className="w-full bg-[#172649] text-white text-2xl border py-3 rounded-lg font-bold hover:bg-[#1a2954] transition-colors mt-8"
            >
              {data.button}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );

};

export default Emergente;
