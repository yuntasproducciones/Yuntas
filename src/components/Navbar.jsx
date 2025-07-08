import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoPerson } from "react-icons/io5";
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
    const [menuOpen, setMenuOpen] = useState(false); // Nuevo estado para el responsive

    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    return (
        <header className="fixed w-full z-20">
            <nav className="relative w-full flex justify-between items-center bg-linear-to-b from-slate-900/85  lg:from-50% h-32 px-10 lg:px-10 lg:place-items-center py-2 text-white font-semibold">

                <RxHamburgerMenu className="block lg:hidden size-10 cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}/>
                
                <img 
                    src={logo.src} 
                    alt=" Logo de Yuntas Publicidad, especialistas en soluciones LED, letreros personalizados, paneles electrónicos y tecnología visual innovadora para negocios y espacios comerciales" 
                    className="h-16 w-auto hidden lg:block cursor-pointer"
                />

                {/* Links - Para pantallas grandes */}
                <div className="flex justify-between lg:gap-x-6">
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
                </div>

                {/* Menú desplegable para pantallas pequeñas */}
                

                {/* Icono de login */}
                <a href="/login" className="lg:justify-self-center justify-self-end" aria-label="Iniciar sesión">
                    <IoPerson className="size-10"/>
                </a>
                
            </nav>
            <nav className={`lg:hidden ${menuOpen ? 'flex' : 'hidden'} flex-col gap-y-4 absolute top-20 justify-center items-center w-screen bg-linear-to-b to-slate-900/85 text-white font-bold py-8`}>
                {rutas.map(({ link, texto }) => (
                    <a
                        key={link}
                        href={link}
                        className={`relative px-6 py-2 ${pathname === link ? "border-effect" : ""}`}
                        onClick={() => setMenuOpen(false)} // Cierra el menú al hacer clic en un enlace
                    >
                        <span className="relative">{texto}</span>
                    </a>
                ))}
            </nav>
        </header>
    );
};

export default Navbarjsx;
