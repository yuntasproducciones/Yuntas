import { useEffect, useRef, useState } from "react";
import { config, getApiUrl } from "../../config";
import { z } from "zod";

import yuleLove from "../assets/images/emergente/yuleLove.jpg";

const MODAL_STORAGE_KEY = "asesoriaModalLastClosed";
const MODAL_COOLDOWN_MS = 5 * 60 * 1000;

const schema = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio"),
    email: z.string().email("Correo inválido"),
    telefono: z
        .string()
        .min(7, "El número de teléfono es demasiado corto")
        .max(15, "El número de teléfono es demasiado largo")
        .regex(
            /^\+?\d+$/,
            "El teléfono debe contener solo números (y opcionalmente +)"
        ),
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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

        setErrors({});
        setIsSubmitting(true);
        setSuccessMessage("");

        try {
            const payload = new FormData();
            payload.append("name", result.data.nombre);
            payload.append("email", result.data.email);
            payload.append("celular", result.data.telefono);

            const response = await fetch(getApiUrl(config.endpoints.clientes.create), {
                method: "POST",
                body: payload,
            });

            if (!response.ok) {
                throw new Error("No se pudo enviar la información. Intenta nuevamente.");
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
            setErrors({ general: err.message || "Error desconocido." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const lastScrollRef = useRef(0);
    const hasReachedBottomRef = useRef(false);
    const hasShownRef = useRef(false);

    useEffect(() => {
        const handleOpenEvent = () => {
            setShowModal(true);
            hasShownRef.current = true;
        };
        window.addEventListener("open-scroll-modal", handleOpenEvent);
        return () =>
            window.removeEventListener("open-scroll-modal", handleOpenEvent);
    }, []);

    // Abierto automáticamente por scroll
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
                const lastClosed = parseInt(localStorage.getItem(MODAL_STORAGE_KEY) || "0", 10);
                const now = Date.now();
                if (now - lastClosed < MODAL_COOLDOWN_MS) {
                    return; // Todavía dentro del tiempo de enfriamiento
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
        }, 300);
    };



    //   const handleSubmit = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     if (!validateForm()) return;

    //     setIsSubmitting(true);
    //     try {
    //       const formData = new FormData();
    //       formData.append("name", nombre);
    //       formData.append("email", correo);
    //       formData.append("celular", telefono);

    //       const response = await fetch(
    //         getApiUrl(config.endpoints.clientes.create),
    //         {
    //           method: "POST",
    //           body: formData,
    //         }
    //       );

    //       if (!response.ok) {
    //         const errorData = await response.json().catch(() => null);
    //         console.error("[ScrollModal] Error al enviar:", errorData);

    //         if (errorData?.errors) {
    //           const newErrors: { [key: string]: string } = {};
    //           if (errorData.errors.name)
    //             newErrors.nombre = errorData.errors.name.join(" ");
    //           if (errorData.errors.celular)
    //             newErrors.telefono = errorData.errors.celular.join(" ");
    //           if (errorData.errors.email)
    //             newErrors.correo = errorData.errors.email.join(" ");
    //           setErrors(newErrors);
    //         } else {
    //           setErrors({
    //             general: "No se pudo enviar la información. Intenta nuevamente.",
    //           });
    //         }
    //         return; // Evita que continúe como éxito
    //       }

    //       console.log("[ScrollModal] Enviado exitosamente:", {
    //         nombre,
    //         telefono,
    //         correo,
    //       });

    //       // Mostrar mensaje de éxito antes de cerrar
    //       setErrors({ general: "✅ Información enviada con éxito ✅" });
    //       setTimeout(() => {
    //         closeModal();
    //         setErrors({});
    //       }, 1500);
    //     } catch (err: any) {
    //       console.error("[ScrollModal] Error al enviar:", err);
    //       setErrors({ general: err.message || "Error desconocido." });
    //     } finally {
    //       setIsSubmitting(false);
    //     }
    //   };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4 modal-overlay">
            <div
                className={`bg-white flex flex-col sm:flex-row overflow-hidden shadow-lg w-[90%] max-w-md sm:max-w-3xl relative ${isClosing ? "animate-slideOut" : "animate-slideIn"
                    }`}
            >
                {/* Imagen */}
                <div className="hidden sm:block w-2/5 relative">
                    <img
                        src={yuleLove.src}
                        alt="Asesoría"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Contenido */}
                <div className="w-full sm:w-3/5 bg-[#1E2A78] text-white relative">
                    <div className="py-6 px-4 sm:py-10 mx-2 sm:mx-8 min-h-[420px]">
                        <button
                            onClick={closeModal}
                            aria-label="Cerrar modal"
                            className="absolute top-4 right-5 text-md text-white hover:text-gray-300"
                        >
                            X
                        </button>
                        <div className="text-white mb-6">
                            <p className="text-2xl italic">Gana</p>
                            <p className="text-7xl font-bold ">
                                10<span className="text-6xl font-semibold">%</span>{" "}
                                <span className="text-5xl font-semibold italic">dto.</span>
                            </p>
                            <p className="text-2xl">en tu compra</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-1">
                            <h3 className="text-base sm:text-lg font-bold">Nombre</h3>
                            <input
                                name="nombre"
                                type="text"
                                value={formData.nombre}
                                onChange={handleChange}
                                className="py-2 px-4 rounded-full bg-white text-black outline-none mb-1"
                            />
                            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}

                            <h3 className="text-base sm:text-lg font-bold">Teléfono</h3>
                            <input
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                className="py-2 px-4 rounded-full bg-white text-black outline-none mb-1"
                            />
                            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}

                            <h3 className="text-base sm:text-lg font-bold">Correo</h3>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="py-2 px-4 rounded-full bg-white text-black outline-none mb-1"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                            {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
                            {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-950 hover:bg-blue-700 text-white w-full sm:max-w-fit p-3 sm:p-4 text-xl sm:text-3xl font-bold rounded-xl mx-auto text-center border border-white/20 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                            >
                                {isSubmitting ? "Enviando..." : "Cotiza ahora"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollModal;
