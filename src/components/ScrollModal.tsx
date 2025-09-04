import { useEffect, useRef, useState } from "react";
import { config, getApiUrl } from "../../config";
import { z } from "zod";

import yuleLove from "../assets/images/emergente/yuleLove.jpg";

const MODAL_STORAGE_KEY = "asesoriaModalLastClosed";
const MODAL_COOLDOWN_MS = 1 * 60 * 1000;

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

type FormData = z.infer<typeof schema>;

const ScrollModal = () => {
    const [showModal, setShowModal] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const [formData, setFormData] = useState<FormData>({
        nombre: "",
        email: "",
        telefono: "",
    });

    const [errors, setErrors] = useState<Partial<Record<keyof FormData | "general", string>>>({});
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
            setErrors(prev => ({
                ...prev,
                [name]: ""
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
            result.error.errors.forEach(err => {
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

            const response = await fetch(getApiUrl(config.endpoints.clientes.create), {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: payload,
            });

            // Verificar si la respuesta es una redirección (CORS error)
            if (response.type === 'opaque' || response.url !== getApiUrl(config.endpoints.clientes.create)) {
                throw new Error("Error de configuración del servidor. Por favor contacta al administrador.");
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
                        validationErrors.telefono = Array.isArray(responseData.errors.celular) 
                            ? responseData.errors.celular[0] 
                            : responseData.errors.celular;
                    }

                    setErrors(validationErrors);
                    return;
                }

                // Otros errores HTTP
                throw new Error(responseData.message || `Error ${response.status}: ${response.statusText}`);
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

    // Cerrar el modal al hacer click fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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
            const scrollDirection = currentScroll < lastScrollRef.current ? "up" : "down";
            lastScrollRef.current = currentScroll;

            const atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;

            if (atBottom) hasReachedBottomRef.current = true;

            if (
                hasReachedBottomRef.current &&
                scrollDirection === "up" &&
                !hasShownRef.current
            ) {
                const lastClosed = parseInt(localStorage.getItem(MODAL_STORAGE_KEY) || "0", 10);
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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 modal-overlay">
        <div 
            ref={modalRef} 
            className={`rounded-2xl bg-white flex flex-col sm:flex-row overflow-hidden shadow-lg w-[90%] max-w-[600px] sm:max-w-3xl relative ${isClosing ? "animate-slideOut" : "animate-slideIn"}`}
        >
            {/* Imagen */}
            <div className="hidden sm:block sm:w-1/2">
                <img
                    src={yuleLove.src}
                    alt="Asesoría"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Contenido */}
            <div className="w-full sm:w-1/2 bg-[#293296] text-white relative p-8">
                <button
                    onClick={closeModal}
                    aria-label="Cerrar modal"
                    className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
                >
                    ✕
                </button>
                
                <div className="text-white mb-6">
                    <p className="text-2xl italic">Gana</p>
                    <p className="text-7xl font-bold ">
                        10<span className="text-6xl font-semibold">%</span>{" "}
                        <span className="text-5xl font-semibold italic">dto.</span>
                    </p>
                    <p className="text-2xl">en tu compra</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-1 mt-4">
                    {/* Campo Nombre */}
                    <label className="text-lg font-bold">Nombre</label>
                    <input
                        name="nombre"
                        type="text"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-full bg-white text-black mb-1 ${
                            errors.nombre ? 'border-2 border-red-500' : ''
                        }`}
                        placeholder="Ingresa tu nombre"
                    />
                    {errors.nombre && (
                        <p className="text-red-400 text-sm mb-2">{errors.nombre}</p>
                    )}

                    {/* Campo Teléfono */}
                    <label className="text-lg font-bold">Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-full bg-white text-black mb-1 ${
                            errors.telefono ? 'border-2 border-red-500' : ''
                        }`}
                        placeholder="Ej: 987654321"
                        maxLength={9}
                    />
                    {errors.telefono && (
                        <p className="text-red-400 text-sm mb-2">{errors.telefono}</p>
                    )}

                    {/* Campo Correo */}
                    <label className="text-lg font-bold">Correo</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-full bg-white text-black mb-1 ${
                            errors.email ? 'border-2 border-red-500' : ''
                        }`}
                        placeholder="ejemplo@correo.com"
                    />
                    {errors.email && (
                        <p className="text-red-400 text-sm mb-2">{errors.email}</p>
                    )}

                    {/* Mensajes */}
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

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#172649] text-white text-2xl border py-3 rounded-lg font-bold hover:bg-[#1a2954] transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Enviando..." : "Cotiza ahora"}
                    </button>
                </form>
            </div>
        </div>
    </div>
);

};

export default ScrollModal;