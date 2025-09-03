import { useRef, useEffect, useState, useMemo } from 'react';
import { config, getApiUrl } from "../../../config";
import { z } from "zod";  

//textos promocionales
const textosPromocionales = [
  { titulo: "Brilla con un", destacado: "10% dto", subtitulo: "en tu compra", button: "Contáctanos" },
  { titulo: "Posiciónate", destacado: "Envío Gratis", subtitulo: "", button: "Deja tus datos" },
  { titulo: "Solicita", destacado: "Asesoría Gratuita", subtitulo: "", button: "Regístrate" },
  { titulo: "Deslumbra con", destacado: "10% dto.", subtitulo: "en tu compra", button: "Cotiza ahora" },
  { titulo: "Obtén", destacado: "Descuento Especial", subtitulo: "", button: "Cotiza ahora" },
  { titulo: "Haz", destacado: "Brillar", subtitulo: "tu ambiente", button: "Regístrate ya" },
  { titulo: "Cotiza tus", destacado: "Pantallas", subtitulo: "ahora", button: "Aprovecha ahora" },
  { titulo: "Transforma", destacado: "Tu Espacio Hoy", subtitulo: "", button: "Aprovecha ahora" },
  { titulo: "Dale estilo", destacado: "A tu evento ahora", subtitulo: "", button: "Cotiza ahora" },
  { titulo: "Ilumina con", destacado: "Ofertas Exclusivas", subtitulo: "", button: "Regístrate ya" },
  { titulo: "Envío", destacado: "Gratis", subtitulo: "Destaca tu negocio", button: "Cotiza ahora" },
  { titulo: "Programa tu", destacado: "Asesoría Gratuita", subtitulo: "", button: "Aprovecha ahora" }
];

const schema = z.object({
    nombre: z
        .string()
        .min(1, "El nombre es obligatorio")
        .max(100, "El nombre no puede exceder 100 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/, "El nombre solo puede contener letras y espacios"),
    email: z
        .string()
        .min(1, "El email es obligatorio")
        .email("El formato del correo electrónico es inválido")
        .max(100, "El email no puede exceder 100 caracteres"),
    telefono: z
        .string()
        .regex(/^[0-9]{9}$/, "El celular debe tener exactamente 9 dígitos")
        .regex(/^[0-9]{9}$/, "El celular solo puede contener números"),
});

const Emergente = ({ producto }) => {
  const dialogRef = useRef(null);
  
  // Función para construir URLs de imágenes
  const imageBaseUrl = 'http://localhost:8000';
  const buildImageUrl = (imagenUrl) => {
    if (!imagenUrl) return null;
    return imagenUrl.startsWith('http') ? imagenUrl : `${imageBaseUrl}${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`;
  };

  // Obtener datos del producto directamente
  const productoId = producto?.data?.id;
  const productoTitulo = producto?.data?.title || producto?.data?.nombre;
  
  // Obtener la imagen de popup del producto (índice 3)
  const getPopupImage = () => {
    const images = producto?.data?.images || [];
    
    // Prioridad 1: Imagen de popups (índice 3)
    if (images.length > 3 && images[3]?.url_imagen) {
      console.log('Usando imagen de popup del producto (índice 3):', images[3].url_imagen);
      return buildImageUrl(images[3].url_imagen);
    }
    
    // Prioridad 2: Imagen principal del producto
    if (producto?.data?.image) {
      console.log('Usando imagen principal del producto como fallback:', producto.data.image);
      return buildImageUrl(producto.data.image);
    }
    
    // Prioridad 3: Placeholder o imagen por defecto
    console.log('Sin imagen disponible, usando placeholder');
    return '/placeholder-image.jpg';
  };

  // Seleccionar texto promocional aleatorio o basado en algún criterio
  const getTextoPromocional = () => {
    // Opción 1: Aleatorio
    const indiceAleatorio = Math.floor(Math.random() * textosPromocionales.length);
    return textosPromocionales[indiceAleatorio];
    
    // Opción 2: Basado en el ID del producto (más consistente)
    // const indice = (productoId || 0) % textosPromocionales.length;
    // return textosPromocionales[indice];
  };

  const imagenPopup = getPopupImage();
 const textoData = useMemo(() => getTextoPromocional(), []);


  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    producto_id: productoId || ""
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, []);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      producto_id: productoId || ""
    }));
  }, [productoId]);

  const onClose = () => {
    dialogRef.current?.close();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setSuccessMessage("");

    const result = schema.safeParse(formData);
    if (!result.success) {
        const fieldErrors = {};
        result.error.errors.forEach(err => {
            const fieldName = err.path[0];
            fieldErrors[fieldName] = err.message;
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

        console.log("Enviando datos:", {
          name: result.data.nombre,
          email: result.data.email,
          celular: result.data.telefono,
          producto_id: formData.producto_id
        });

        const response = await fetch(getApiUrl(config.endpoints.clientes.create), {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: payload,
        });

        if (response.type === 'opaque' || response.url !== getApiUrl(config.endpoints.clientes.create)) {
            throw new Error("Error de configuración del servidor. Por favor contacta al administrador.");
        }

        let responseData;
        try {
            const responseText = await response.text();
            if (!responseText) {
                throw new Error("Respuesta vacía del servidor");
            }
            responseData = JSON.parse(responseText);
        } catch (parseError) {
            console.error("[Emergente] Error parsing response:", parseError);
            console.error("[Emergente] Response status:", response.status);
            console.error("[Emergente] Response headers:", response.headers);
            throw new Error("Error al procesar la respuesta del servidor");
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
                    validationErrors.telefono = Array.isArray(responseData.errors.celular) 
                        ? responseData.errors.celular[0] 
                        : responseData.errors.celular;
                }

                setErrors(validationErrors);
                return;
            }

            throw new Error(responseData.message || `Error ${response.status}: ${response.statusText}`);
        }

        setSuccessMessage("Información enviada con éxito");
        setFormData({ 
          nombre: "", 
          email: "", 
          telefono: "",
          producto_id: productoId || ""
        });

        setTimeout(() => {
            onClose();
            setSuccessMessage("");
        }, 2000);

    } catch (err) {
        console.error("[Emergente] Error:", err);
        
        if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('CORS'))) {
            setErrors({ general: "Error de conexión con el servidor. Por favor intenta nuevamente." });
        } else if (err.message.includes('configuración del servidor')) {
            setErrors({ general: "Error de configuración del servidor. Contacta al administrador." });
        } else {
            setErrors({ general: err.message || "Error desconocido al enviar la información." });
        }
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderTitle = () => (
    <h2 className="text-xl sm:text-4xl font-semibold italic">
      {textoData.titulo}
      {textoData.destacado && (
        <>
          <br />
          <span className="text-2xl sm:text-5xl font-bold">{textoData.destacado}</span>
        </>
      )}
      {textoData.subtitulo && (
        <>
          <br />
          {textoData.subtitulo}
        </>
      )}
    </h2>
  );

  return (
    <dialog
      ref={dialogRef}
      className="rounded-2xl fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex flex-col-reverse sm:flex-row rounded-2xl shadow-lg max-w-[90vw] sm:max-w-5xl overflow-hidden">

        {/* Imagen - USA DIRECTAMENTE LA IMAGEN DEL PRODUCTO */}
        <div className="sm:w-1/2 aspect-[4/3] overflow-hidden">
          <img
            src={imagenPopup}
            alt={`Popup de ${productoTitulo || 'producto'}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Error cargando imagen popup:', e.target.src);
              e.target.src = '';
            }}
            onLoad={(e) => {
              console.log('Imagen popup cargada correctamente:', e.target.src);
            }}
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
              className={`w-full px-4 py-2 rounded-full bg-white text-black mb-1 ${
                errors.nombre ? 'border-2 border-red-500' : ''
              }`}
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && <p className="text-red-400 text-sm mb-2">{errors.nombre}</p>}

            <label className="block text-lg font-bold">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className={`w-full px-4 py-2 rounded-full bg-white text-black mb-1 ${
                errors.telefono ? 'border-2 border-red-500' : ''
              }`}
              placeholder="Ej: 987654321"
              maxLength={9}
            />
            {errors.telefono && <p className="text-red-400 text-sm mb-2">{errors.telefono}</p>}

            <label className="block text-lg font-bold">Correo</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-2 rounded-full bg-white text-black mb-1 ${
                errors.email ? 'border-2 border-red-500' : ''
              }`}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <p className="text-red-400 text-sm mb-2">{errors.email}</p>}

            {/* Mensajes de error y éxito */}
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-3">
                <p className="text-red-300 text-sm">{errors.general}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-3">
                <p className="text-green-300 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Debug info */}
            <div className="text-xs text-gray-300 mb-2">
              Debug: producto_id = {formData.producto_id || "null"} | 
              título: {productoTitulo || "null"} | 
              imgs: {producto?.data?.images?.length || 0} | 
              popup_img: {imagenPopup ? 'OK' : 'FAIL'}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#172649] text-white text-2xl border py-3 rounded-lg font-bold hover:bg-[#1a2954] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando..." : textoData.button}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default Emergente;