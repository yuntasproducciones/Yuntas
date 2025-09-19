import { useEffect, useRef, useState } from "react";
import { config, getApiUrl } from "../../config";
import { z } from "zod";
import yuleLove from "../assets/images/emergente/yuleLove.jpg";

const MODAL_STORAGE_KEY = "asesoriaModalLastClosed";
const MODAL_COOLDOWN_MS = 1 * 10 * 1000;

const schema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),
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

type FormData = z.infer<typeof schema>;

const ScrollModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    email: "",
    telefono: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData | "general", string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const lastScrollRef = useRef(0);
  const hasReachedBottomRef = useRef(false);
  const hasShownRef = useRef(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores previos
    setErrors({});
    setSuccessMessage("");

    // Validación con Zod
    const result = schema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof FormData;
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

      const response = await fetch(
        getApiUrl(config.endpoints.clientes.create),
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
          body: payload,
        }
      );

      // Verificar si la respuesta es una redirección (CORS error)
      if (
        response.type === "opaque" ||
        response.url !== getApiUrl(config.endpoints.clientes.create)
      ) {
        throw new Error(
          "Error de configuración del servidor. Por favor contacta al administrador."
        );
      }

      // Siempre intentar leer la respuesta como JSON
      let responseData;
      try {
        const responseText = await response.text();
        if (!responseText) {
          throw new Error("Respuesta vacía del servidor");
        }
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("[ScrollModal] Error parsing response:", parseError);
        console.error("[ScrollModal] Response status:", response.status);
        console.error("[ScrollModal] Response headers:", response.headers);
        throw new Error("Error al procesar la respuesta del servidor");
      }

      if (!response.ok) {
        if (response.status === 422 && responseData.errors) {
          const validationErrors: Partial<Record<keyof FormData, string>> = {};
          // Mapear errores del backend a campos del frontend
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

        // Otros errores HTTP
        throw new Error(
          responseData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      }

      // Éxito
      setSuccessMessage("✅ Información enviada con éxito");
      setFormData({ nombre: "", email: "", telefono: "" });

      setTimeout(() => {
        closeModal();
        setSuccessMessage("");
      }, 2000);
    } catch (err: any) {
      console.error("[ScrollModal] Error:", err);

      // Mostrar mensaje de error más específico
      if (
        err.name === "TypeError" &&
        (err.message.includes("fetch") || err.message.includes("CORS"))
      ) {
        setErrors({
          general:
            "Error de conexión con el servidor. Por favor intenta nuevamente.",
        });
      } else if (err.message.includes("configuración del servidor")) {
        setErrors({
          general:
            "Error de configuración del servidor. Contacta al administrador.",
        });
      } else {
        setErrors({
          general: err.message || "Error desconocido al enviar la información.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cerrar el modal al hacer click fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  useEffect(() => {
    const handleOpenEvent = () => {
      setShowModal(true);
      hasShownRef.current = true;
    };
    window.addEventListener("open-scroll-modal", handleOpenEvent);
    return () =>
      window.removeEventListener("open-scroll-modal", handleOpenEvent);
  }, []);

  // Abierto automáticamente por scroll y por cooldown
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const scrollDirection =
        currentScroll < lastScrollRef.current ? "up" : "down";
      lastScrollRef.current = currentScroll;

      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight;

      if (atBottom) hasReachedBottomRef.current = true;

      if (
        hasReachedBottomRef.current &&
        scrollDirection === "up" &&
        !hasShownRef.current
      ) {
        const lastClosed = parseInt(
          localStorage.getItem(MODAL_STORAGE_KEY) || "0",
          10
        );
        const now = Date.now();
        if (now - lastClosed < MODAL_COOLDOWN_MS) {
          return;
        }

        setShowModal(true);
        hasShownRef.current = true;
        hasReachedBottomRef.current = false;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
      localStorage.setItem(MODAL_STORAGE_KEY, Date.now().toString());
      hasShownRef.current = false;
      // Limpiar estado del formulario al cerrar
      setFormData({ nombre: "", email: "", telefono: "" });
      setErrors({});
      setSuccessMessage("");
    }, 300);
  };

  if (!showModal) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4 modal-overlay">
      <div
        ref={modalRef}
        className={`flex flex-col sm:flex-row rounded-3xl shadow-xl w-[90vw] sm:w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white relative ${
          isClosing ? "animate-slideOut" : "animate-slideIn"
        }`}
        style={{
          border: "3px solid #e5e7eb",
        }}
      >
        {/* Contenedor de imagen - ocupa todo el ancho en móvil, lateral en desktop */}
        <div className="w-full sm:w-1/2 relative">
          <div className="w-full h-[250px] sm:h-auto sm:min-h-[400px] relative overflow-hidden sm:p-4">
            <div className="w-full h-full relative clip-vase overflow-hidden">
              <img
                src={yuleLove.src}
                alt="Asesoría"
                className="w-full h-full object-cover"
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

          {/* Título azul */}
          <div className="mb-6 sm:mb-8">
            <h2
              className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight font-montserrat text-center sm:text-left"
              style={{ color: "#0E3F88" }}
            >
              ¡Un detalle que
              <br />
              cambia todo!
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <input
                name="nombre"
                type="text"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-[95%] px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 border-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-50 ${
                  errors.nombre ? "ring-2 ring-red-400" : ""
                }`}
                placeholder="Nombre"
              />
              {errors.nombre && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`w-[95%] px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 border-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-50 ${
                  errors.telefono ? "ring-2 ring-red-400" : ""
                }`}
                placeholder="Teléfono"
                maxLength={9}
              />
              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1 ml-1">
                  {errors.telefono}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-[95%] px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-500 border-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-50 ${
                  errors.email ? "ring-2 ring-red-400" : ""
                }`}
                placeholder="Correo"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            {/* Mensajes de error y éxito */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full max-w-[220px] bg-[#0E3F88] hover:bg-[#0b3674] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4 sm:mt-6 font-montserrat"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Empieza a brillar"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollModal;
