import { useState } from "react";
import { IoPerson } from "react-icons/io5";
import { useDarkMode } from "../hooks/darkmode/useDarkMode";
import "../styles/navbar.css";
import MobileMenuUnified from "./MobileMenuUnified"; // reemplazo
import ToggleNavbar from "./ui/ToggleNavbar";

const rutas = [
  { link: "/", texto: "INICIO" , title:"Página de Inicio - Yuntas Publicidad"},
  { link: "/products", texto: "PRODUCTOS" , title:"Productos - Yuntas Publicidad"},
  { link: "/about", texto: "NOSOTROS" , title:"Nosotros - Yuntas Publicidad"},
  { link: "/blogs", texto: "BLOG" , title:"Blog - Yuntas Publicidad"},
  { link: "/contact", texto: "CONTACTO" , title:"Contacto - Yuntas Publicidad"},
];

const Navbarjsx = ({ variant = "default", pathname }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode } = useDarkMode();

  // Estilos según modo oscuro y variante (admin / default)
  const navClasses =
    variant === "admin"
      ? darkMode
        ? "bg-gradient-to-b from-[#0d1030] to-[#1a1a3a] text-white shadow-md"
        : "bg-gradient-to-b from-[#0d1030] to-[#293296] text-white shadow-md"
      : "bg-gradient-to-b from-slate-900/85 to-transparent text-white";

  const headerClasses = variant === "admin" ? "w-full z-20" : "fixed w-full z-20";

  return (
    <header className={headerClasses}>
      <nav
        className={`relative w-full flex justify-between items-center h-20 px-6 lg:px-10 py-4 font-semibold ${navClasses}`}
      >
        {/* Botón hamburguesa - solo móvil */}
        <div className="flex items-center lg:hidden">
          <ToggleNavbar
            isOpen={menuOpen}
            setIsOpen={setMenuOpen}
            controlsId="mobile-nav"
          />
        </div>

        {/* Logo */}
        <img
          src={'/images/yuntas_publicidad_logo.webp'}
          width={59}
          height={56}
          srcSet={'/images/yuntas_publicidad_logo_mobile.webp 60w, /images/yuntas_publicidad_logo_tablet.webp 125w'}
          sizes="(max-width: 640px) 60px, 125px"
          alt="Logo Yuntas"
          title="Logo Yuntas Publicidad"
          loading="eager"
          className="h-14 w-auto cursor-pointer"
          fetchPriority="high"
        />

        {/* Links - solo en desktop */}
        <div className="hidden lg:flex justify-between gap-x-6">
          {rutas.map(({ link, texto, title }) => (
            <a
              key={link}
              href={link}
              title={title}
              className={`relative px-6 py-2 ${pathname === link ? "border-effect" : ""}`}
            >
              <span className="relative">{texto}</span>
            </a>
          ))}
        </div>

        {/* Icono login/admin */}
        <a href="/login" className="ml-4" title="Iniciar Sesión - Yuntas Publicidad">
          <IoPerson className="text-3xl" aria-label="Login" />
        </a>
      </nav>

      {/* Menú móvil unificado */}
      <MobileMenuUnified
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
};

export default Navbarjsx;
