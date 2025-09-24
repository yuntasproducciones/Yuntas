import { useRef, useEffect, useState, useMemo } from "react";
import { config, getApiUrl } from "../../../config";
import { z } from "zod";
import yuleLove from "../../assets/images/emergente/yuleLove.jpg";


/* Textos promocionales */
const textosPromocionales = [
  { titulo: "Brilla con un", destacado: "10% dto", subtitulo: "en tu compra" },
  { titulo: "Posiciónate", destacado: "Envío Gratis", subtitulo: "" },
  { titulo: "Solicita", destacado: "Asesoría Gratuita", subtitulo: "" },
  { titulo: "Deslumbra con", destacado: "10% dto.", subtitulo: "en tu compra" },
  { titulo: "Obtén", destacado: "Descuento Especial", subtitulo: "" },
  { titulo: "Haz", destacado: "Brillar", subtitulo: "tu ambiente" },
  { titulo: "Cotiza tus", destacado: "Pantallas", subtitulo: "ahora" },
  { titulo: "Transforma", destacado: "Tu Espacio Hoy", subtitulo: "" },
  { titulo: "Dale estilo", destacado: "A tu evento ahora", subtitulo: "" },
  { titulo: "Ilumina con", destacado: "Ofertas Exclusivas", subtitulo: "" },
  { titulo: "Envío", destacado: "Gratis", subtitulo: "Destaca tu negocio" },
  { titulo: "Programa tu", destacado: "Asesoría Gratuita", subtitulo: "" }
];

/* Textos dinámicos para botones */
const textosBoton = [
  "Empieza a brillar",
  "Quiero mi descuento",
  "Solicitar asesoría",
  "Obtener beneficio",
  "Transformar mi espacio",
  "Activar promoción",
  "Lo quiero ahora",
  "Acceder a la oferta",
  "Sí, quiero destacar",
  "Aprovechar envío gratis"
];



/* Validación zod */
const schema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "El nombre solo puede contener letras y espacios"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Formato de correo inválido")
    .max(100, "El email no puede exceder 100 caracteres"),
  telefono: z
    .string()
    .regex(/^[0-9]{9}$/, "El celular debe tener exactamente 9 dígitos")
});

const SHOW_DELAY_MS = 16000; // 16s

const Emergente = ({ producto }) => {
  const modalRef = useRef(null);
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Producto
  const productoId = producto?.data?.id;
  const productoTitulo = producto?.data?.title || producto?.data?.nombre;

  // Construcción de URL de imagen
  const imageBaseUrl = "https://apiyuntas.yuntaspublicidad.com";
  const buildImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http")
      ? url
      : `${imageBaseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  // Imagen
  const getPopupImage = () => {
    const images = producto?.data?.images || [];
    if (images.length > 3) {
      const url =
        images[3]?.url_imagen ||
        images[3]?.ruta_imagen ||
        images[3]?.imagen;
      if (url) return buildImageUrl(url);
    }
    return buildImageUrl(producto?.data?.image) || yuleLove;
  };
  const imagenPopup = getPopupImage();

  // Texto promocional aleatorio
  const textoData = useMemo(() => {
    const idx = Math.floor(Math.random() * textosPromocionales.length);
    return textosPromocionales[idx];
  }, []);

  //From Popup Boton texto aleatorio
  const textoBoton = useMemo(() => {
  const idx = Math.floor(Math.random() * textosBoton.length);
  return textosBoton[idx];
}, []);

  // Form state
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    producto_id: productoId || ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Mostrar modal tras delay
  useEffect(() => {
    const timer = setTimeout(() => setShow(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // Mantener producto_id actualizado
  useEffect(() => {
    setFormData((prev) => ({ ...prev, producto_id: productoId || "" }));
  }, [productoId]);

  // Cerrar modal
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShow(false);
      setIsClosing(false);
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        producto_id: productoId || ""
      });
      setErrors({});
      setSuccessMessage("");
    }, 300);
  };

  // Cerrar con clic fuera y con Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closeModal();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [show]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = new FormData();
      payload.append("name", result.data.nombre);
      payload.append("email", result.data.email);
      payload.append("celular", result.data.telefono);
      payload.append("producto_id", formData.producto_id);

      const response = await fetch(
        getApiUrl(config.endpoints.clientes.create),
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
          },
          body: payload
        }
      );

      let responseData = {};
      try {
        const text = await response.text();
        if (text) responseData = JSON.parse(text);
      } catch (err) {
        console.error("[Emergente] Error parsing response:", err);
      }

      if (!response.ok) {
        if (response.status === 422 && responseData.errors) {
          const validationErrors = {};
          if (responseData.errors.name) {
            validationErrors.nombre = Array.isArray(responseData.errors.name)
              ? responseData.errors.name[0]
              : responseData.errors.name;
          }
          if (responseData.errors.email) {
            validationErrors.email = Array.isArray(responseData.errors.email)
              ? responseData.errors.email[0]
              : responseData.errors.email;
          }
          if (responseData.errors.celular) {
            validationErrors.telefono = Array.isArray(
              responseData.errors.celular
            )
              ? responseData.errors.celular[0]
              : responseData.errors.celular;
          }
          setErrors(validationErrors);
          return;
        }
        throw new Error(
          responseData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      setSuccessMessage("Información enviada con éxito");
      setFormData({
        nombre: "",
        telefono: "",
        email: "",
        producto_id: productoId || ""
      });

      setTimeout(() => {
        closeModal();
        setSuccessMessage("");
      }, 2000);
    } catch (err) {
      console.error("[Emergente] Error:", err);
      if (
        err.name === "TypeError" &&
        (err.message.includes("fetch") || err.message.includes("CORS"))
      ) {
        setErrors({
          general:
            "Error de conexión con el servidor. Por favor intenta nuevamente."
        });
      } else if (
        err.message &&
        err.message.includes("configuración del servidor")
      ) {
        setErrors({
          general: "Error de configuración del servidor. Contacta al administrador."
        });
      } else {
        setErrors({
          general: err.message || "Error desconocido al enviar la información."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (

    
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4">
      <div
        ref={modalRef}
        className={`flex flex-col sm:flex-row rounded-3xl shadow-xl w-[90vw] sm:w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white relative ${
          isClosing ? "animate-slideOut" : "animate-slideIn"
        }`}
        style={{ border: "3px solid #e5e7eb" }}
      >
        
        {/* Imagen -------     resolucion 800 × 600 px (horizontal)  las img del popup*/}    
          <div className="w-full sm:w-1/2 relative">
            <div className="w-full h-[250px] sm:h-full relative sm:p-4">
              {/* Clip con esquinas redondeadas y diagonal */}
              <div className="w-full h-full clip-vase overflow-hidden rounded-2xl relative">
                <img
                  src={imagenPopup}
                  alt={`Popup de ${productoTitulo || "producto"}`}
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    try {
                      e.target.src = yuleLove;
                    } catch {}
                  }}
                />
                <div className="absolute inset-0 bg-black/10 sm:bg-transparent"></div>
              </div>
            </div>

            <button
              onClick={closeModal}
              aria-label="Cerrar modal"
              className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer text-sm z-10 shadow-sm sm:hidden"
            >
              ✕
            </button>
          </div>



        {/* Formulario */}
        <div className="w-full sm:w-1/2 p-6 relative flex flex-col justify-center">
          <button
            onClick={closeModal}
            aria-label="Cerrar modal"
            className="hidden sm:flex absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 items-center justify-center transition-colors cursor-pointer text-sm z-10"
          >
            ✕
          </button>

          <div className="mb-6 sm:mb-8">
            <h2
  className="text-2xl sm:text-3xl md:text-4xl font-bold font-extrabold leading-tight font-montserrat text-center"
  style={{ color: "#0E3F88" }}
>

              {textoData.titulo} <br />
              <span className="text-2xl sm:text-4xl font-bold">
                {textoData.destacado}
              </span>
              {textoData.subtitulo && (
                <>
                  <br />
                  <span className="text-base sm:text-lg">
                    {textoData.subtitulo}
                  </span>
                </>
              )}
            </h2>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className={`w-[95%] px-4 py-3 rounded-xl bg-gray-100 border-0 focus:ring-2 ${
                errors.nombre
                  ? "ring-2 ring-red-400"
                  : "focus:ring-blue-500/20"
              }`}
              placeholder="Nombre"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm">{errors.nombre}</p>
            )}

            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              className={`w-[95%] px-4 py-3 rounded-xl bg-gray-100 border-0 focus:ring-2 ${
                errors.telefono
                  ? "ring-2 ring-red-400"
                  : "focus:ring-blue-500/20"
              }`}
              placeholder="Teléfono"
              maxLength={9}
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm">{errors.telefono}</p>
            )}

            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-[95%] px-4 py-3 rounded-xl bg-gray-100 border-0 focus:ring-2 ${
                errors.email
                  ? "ring-2 ring-red-400"
                  : "focus:ring-blue-500/20"
              }`}
              placeholder="Correo"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600">
                {errors.general}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-green-600">
                {successMessage}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full max-w-[220px] bg-[#0E3F88] hover:bg-[#0b3674] text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 mt-4 sm:mt-6"
              >
                {isSubmitting ? "Enviando..." : textoBoton}

              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Emergente;
