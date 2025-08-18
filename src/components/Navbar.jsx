import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
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

const Navbarjsx = ({ logo, variant = "default", pathname }) => { // pathname dinámico desde navbar.astro
  // const [pathname, setPathname] = useState("/");
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode } = useDarkMode();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     setPathname(window.location.pathname);
  //   }
  // }, []);

  // Cambiar clases según modo oscuro y variante
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
        className={`relative w-full flex justify-between items-center h-40 px-10 lg:px-10 py-4 font-semibold ${navClasses}`}
      >
        {/* <RxHamburgerMenu
          className="block lg:hidden text-3xl cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        /> */}
        <ToggleNavbar
          isOpen={menuOpen}
          setIsOpen={setMenuOpen}
          controlsId="mobile-nav"
        />

        <img
          src={logo.src}
          alt="Logo Yuntas"
          loading="eager"
          className="h-16 w-auto hidden lg:block cursor-pointer"
        />

        {/* Links - desktop */}
        <div className="flex justify-between lg:gap-x-6">
          {rutas.map(({ link, texto }) => (
            <a
              key={link}
              href={link}
              className={`hidden lg:block relative px-6 py-2 ${pathname === link ? "border-effect" : ""
                }`}
            >
              <span className="relative">{texto}</span>
            </a>
          ))}
        </div>

        <a href="/login">
          <IoPerson className="text-3xl" aria-label="Login" />
        </a>
      </nav>

      {/* Menú mobile */}
      {/* <nav
        className={`lg:hidden ${menuOpen ? "flex" : "hidden"
          } flex-col gap-y-4 absolute top-20 left-0 right-0 justify-center items-center w-full ${darkMode
            ? "bg-gray-900/95"
            : "bg-gradient-to-b from-slate-900/85 to-transparent"
          } text-white font-bold py-8`}
      >
        {rutas.map(({ link, texto }) => (
          <a
            key={link}
            href={link}
            className={`relative px-6 py-2 ${pathname === link ? "border-effect" : ""
              }`}
            onClick={() => setMenuOpen(false)}
          >
            {texto}
          </a>
        ))}
      </nav> */}
      <MobileMenu
        isOpen={menuOpen}
        items={rutas}
        logo={logo}
      />
    </header>
  );
};

export default Navbarjsx;