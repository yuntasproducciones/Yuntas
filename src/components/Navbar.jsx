import { useEffect, useState } from "react";
import "../styles/navbar.css";

const rutas = [
    { link: "/", texto: "INICIO" },
    { link: "/products", texto: "PRODUCTOS" },
    { link: "/about", texto: "NOSOTROS" },
    { link: "/blog", texto: "BLOG" },
    { link: "/contact", texto: "CONTACTO" },
];

const Navbarjsx = ({ logo }) => {
    const [pathname, setPathname] = useState("/");

    useEffect(() => {
        const updatePath = () => setPathname(window.location.pathname);

        // Ejecutar al montar
        updatePath();

        // En caso de navegación normal
        window.addEventListener("popstate", updatePath);

        // Parche para pushState/replaceState
        const pushState = history.pushState;
        const replaceState = history.replaceState;

        history.pushState = function (...args) {
            pushState.apply(history, args);
            window.dispatchEvent(new Event("pushstate"));
            window.dispatchEvent(new Event("locationchange"));
        };

        history.replaceState = function (...args) {
            replaceState.apply(history, args);
            window.dispatchEvent(new Event("replacestate"));
            window.dispatchEvent(new Event("locationchange"));
        };

        window.addEventListener("pushstate", updatePath);
        window.addEventListener("replacestate", updatePath);
        window.addEventListener("locationchange", updatePath);

        return () => {
            window.removeEventListener("popstate", updatePath);
            window.removeEventListener("pushstate", updatePath);
            window.removeEventListener("replacestate", updatePath);
            window.removeEventListener("locationchange", updatePath);
        };
    }, []);

    return (
        <header className="fixed w-full z-20">
            <nav className="relative w-full grid lg:grid-cols-7 grid-cols-3 bg-linear-to-b from-slate-900/85 from-50% items-center h-32 px-10 lg:px-0 lg:place-items-center py-2 text-white font-semibold">
                {/* Logo */}
                <a href="/" className="h-16 col-span-1">
                    <img src={logo.src} alt="Logo de Yuntas" className="h-full w-auto justify-self-center" />
                </a>

                {/* Links */}
                {rutas.map(({ link, texto }) => (
                    <a
                        key={link}
                        href={link}
                        className={`hidden lg:block relative px-6 py-2 ${
                            pathname === link ? "border-effect" : ""
                        }`}
                    >
                        <span className="relative">{texto}</span>
                    </a>
                ))}

                {/* Icono de login */}
                <a href="/login" className="lg:justify-self-center justify-self-end">
                    <svg viewBox="0 0 16 16" fill="none" className="w-10" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
                            fill="currentColor"
                        ></path>
                        <path
                            d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
                            fill="currentColor"
                        ></path>
                    </svg>
                </a>
            </nav>
        </header>
    );
};

export default Navbarjsx;