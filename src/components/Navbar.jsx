import { useState } from "react";
import { IoPerson } from "react-icons/io5";
import { useDarkMode } from "../hooks/darkmode/useDarkMode";
import "../styles/navbar.css";
import MobileMenu from "./MobileMenu";
import ToggleNavbar from "./ui/ToggleNavbar";

const rutas = [
  { link: "/", texto: "INICIO" },
  { link: "/products", texto: "PRODUCTOS" },
  { link: "/about", texto: "NOSOTROS" },
  { link: "/blogs", texto: "BLOG" },
  { link: "/contact", texto: "CONTACTO" },
];

const Navbarjsx = ({ logo, variant = "default", pathname }) => {
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
          src={logo.src}
          alt="Logo Yuntas"
          loading="eager"
          className="h-14 w-auto cursor-pointer"
        />

        {/* Links - solo en desktop */}
        <div className="hidden lg:flex justify-between gap-x-6">
          {rutas.map(({ link, texto }) => (
            <a
              key={link}
              href={link}
              className={`relative px-6 py-2 ${pathname === link ? "border-effect" : ""}`}
            >
              <span className="relative">{texto}</span>
            </a>
          ))}
        </div>

        {/* Icono login */}
        <a href="/login" className="ml-4">
          <IoPerson className="text-3xl" aria-label="Login" />
        </a>
      </nav>

      {/* Menú móvil */}
      <MobileMenu
        isOpen={menuOpen}
        items={rutas}
        logo={logo}
        onClose={() => setMenuOpen(false)} // tu mejora: cerrar desde links/botón
      />
    </header>
  );
};

export default Navbarjsx;
