import { useState } from "react";
import { IoPerson } from "react-icons/io5";
import clsx from "clsx"; 

import { useDarkMode } from "../hooks/darkmode/useDarkMode";
import { RUTAS } from "../constants/navigation"; // MEJORA: Constantes externalizadas
import "../styles/navbar.css";

import MobileMenuUnified from "./MobileMenuUnified";
import ToggleNavbar from "./ui/ToggleNavbar";
import "../styles/navbar.css";

// MEJORA: Tipado de las props

interface NavbarProps {
  variant?: "default" | "admin";
  pathname: string;
}

// MEJORA: Componente NavItem para reutilizar la lógica del enlace
const NavItem = ({ link, texto, title, isActive }) => (
  <a
    href={link}
    title={title}
    className={clsx("relative px-6 py-2", { "border-effect": isActive })}
  >
    <span className="relative">{texto}</span>
  </a>
);

// MEJORA: Navbar
const Navbar = ({ variant = "default", pathname }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode } = useDarkMode();

  // MEJORA: Uso de clsx para una mejor legibilidad de las clases
  const navClasses = clsx(
    "relative w-full flex justify-between items-center h-20 px-6 lg:px-10 py-4 font-semibold text-white",
    {
      "bg-gradient-to-b from-[#0d1030] to-[#1a1a3a] shadow-md": variant === "admin" && darkMode,
      "bg-gradient-to-b from-[#0d1030] to-[#293296] shadow-md": variant === "admin" && !darkMode,
      "bg-gradient-to-b from-slate-900/85 to-transparent": variant === "default",
    }
  );

  const headerClasses = clsx("w-full z-20", {
    fixed: variant !== "admin",
  });

  return (
    <header className={headerClasses}>
      <nav className={navClasses}>
        <div className="flex items-center lg:hidden">
          <ToggleNavbar
            isOpen={menuOpen}
            setIsOpen={setMenuOpen}
            controlsId="mobile-nav"
          />
        </div>

        <a href="/" title="Ir a la página de inicio">
          <img
            src={'/images/yuntas_publicidad_logo.webp'}
            width={59}
            height={56}
            srcSet={'/images/yuntas_publicidad_logo_mobile.webp 60w, /images/yuntas_publicidad_logo_tablet.webp 125w'}
            sizes="(max-width: 640px) 60px, 125px"
            alt="Logo Yuntas"
            title="Logo Yuntas Publicidad"
            loading="eager"
            className="h-14 w-auto" // Se quita cursor-pointer porque ya está en un <a>
            fetchPriority="high"
          />
        </a>

        <div className="hidden lg:flex justify-between gap-x-6">
          {RUTAS.map((ruta) => (
            <NavItem
              key={ruta.link}
              {...ruta}
              isActive={pathname === ruta.link}
            />
          ))}
        </div>

        <a href="/login" className="ml-4" title="Iniciar Sesión - Yuntas Publicidad">
          <IoPerson className="text-3xl" aria-label="Login" />
        </a>
      </nav>

      <MobileMenuUnified
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
};

export default Navbar;