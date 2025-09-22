import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaLinkedin, FaRegFolder } from "react-icons/fa";
import { useDarkMode } from "../hooks/darkmode/useDarkMode";

interface MobileMenuUnifiedProps {
  isOpen: boolean;
  logo?: any;
  onClose?: () => void;
}

const MobileMenuUnified = ({ isOpen, logo, onClose }: MobileMenuUnifiedProps) => {
  const [isMobile, setIsMobile] = useState(true);
  const [adminOpen, setAdminOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    setMounted(true);
    setHasToken(!!localStorage.getItem("token"));
    
    const handleResize = () => setIsMobile(window.innerWidth <= 1023);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) return null;

  // links públicos
  const publicLinks = [
    { texto: "Inicio", link: "/" },
    { texto: "Productos", link: "/products" },
    { texto: "Nosotros", link: "/about" },
    { texto: "Blog", link: "/blogs" },
    { texto: "Contacto", link: "/contact" },
  ];

  // links admin
  const adminLinks = [
    { name: "Dashboard", path: "/admin/inicio" },
    { name: "Seguimiento", path: "/admin/seguimiento" },
    { name: "Blogs", path: "/admin/" },
    { name: "Productos", path: "/admin/productos" },
    { name: "Usuarios", path: "/admin/usuarios" },
  ];

  async function logout() {
    try {
      const response = await fetch("https://apiyuntas.yuntaspublicidad.com/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.removeItem("token");
        window.location.href = "/";
      } else {
        alert(data.message || "Error al cerrar sesión");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  }

  return (
    <div
      className={`lg:hidden fixed inset-0 bg-[#0D1030] z-50 transform transition-transform duration-500 ease-in-out overflow-y-auto ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header con logo y botón cerrar */}
      <div className="flex items-center justify-between p-6">
        {logo && (
          <img
            src={'/images/yuntas_publicidad_logo.webp'}
            srcSet={'/images/yuntas_publicidad_logo_mobile.webp 60w, /images/yuntas_publicidad_logo_tablet.webp 125w'}
            sizes="(max-width: 640px) 60px, 125px"
            alt="Logo Yuntas"
            width={80}
            height={80}
            className="h-[50px] w-auto cursor-pointer"
          />
        )}
        <button
          onClick={onClose}
          aria-label="Cerrar menu"
          className="text-white text-4xl hover:text-red-400 transition-colors"
        >
          <IoClose />
        </button>
      </div>

      {/* Navegación pública */}
      <nav className="flex flex-col">
        {publicLinks.map((item) => (
          <a
            key={item.link}
            href={item.link}
            onClick={onClose}
            className="text-white px-8 py-4 hover:text-indigo-200 text-xl font-medium border-b border-gray-100"
          >
            {item.texto}
          </a>
        ))}

        {/* Admin con desplegable - Solo se renderiza en cliente después de montar */}
        {mounted && hasToken && (
          <div className="border-b border-gray-100">
            <button
              onClick={() => setAdminOpen(!adminOpen)}
              className="w-full flex justify-between items-center px-8 py-4 text-white text-xl font-medium hover:text-indigo-200"
            >
              Admin
              <span>{adminOpen ? "▲" : "▼"}</span>
            </button>
            {adminOpen && (
              <div className="flex flex-col pl-12 pb-2">
                {adminLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.path}
                    onClick={onClose}
                    className="flex items-center gap-2 py-2 text-white hover:text-indigo-200"
                  >
                    <FaRegFolder />
                    {item.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Dark Mode */}
      <div className="border-b border-gray-100 px-8 py-4 flex justify-between items-center text-white">
        <span className="text-lg">Dark Mode</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={darkMode}
            onChange={toggleDarkMode}
            aria-label="Activar modo oscuro"
          />
          <div
            className={`w-10 h-5 rounded-full transition-colors duration-300 ${
              darkMode ? "bg-gray-700" : "bg-gray-400"
            }`}
          >
            <div
              className={`absolute w-4 h-4 rounded-full shadow-md transition-transform translate-y-0.5 duration-300 flex items-center justify-center ${
                darkMode ? "translate-x-5 bg-white" : "translate-x-1 bg-white"
              }`}
            ></div>
          </div>
        </label>
      </div>

      {/* Redes sociales */}
      <div className="grid grid-cols-2 gap-y-2 m-8">
        <a
          href="https://www.facebook.com/yuntaspublicidad"
          target="_blank"
          aria-label="Facebook"
          title="Facebook - Yuntas Publicidad"
          className="flex items-center gap-1 text-white"
        >
          <FaFacebook className="text-2xl hover:text-blue-500" />
          <span className="font-light">Yuntas Producciones</span>
        </a>
        <a
          href="https://wa.me/912849782"
          target="_blank"
          aria-label="WhatsApp"
          title="WhatsApp - Yuntas Publicidad"
          className="flex items-center gap-1 text-white"
        >
          <FaWhatsapp className="text-2xl hover:text-green-500" />
          <span className="font-light">+51 912 849 782</span>
        </a>
        <a
          href="https://www.instagram.com/yuntasdecoracioncomercial/"
          target="_blank"
          aria-label="Instagram"
          title="Instagram - Yuntas Publicidad"
          className="flex items-center gap-1 text-white"
        >
          <FaInstagram className="text-2xl hover:text-pink-500" />
          <span className="font-light">Yuntas Producciones</span>
        </a>
        <a
          href="https://www.tiktok.com/@yuntasproduccione"
          target="_blank"
          aria-label="TikTok"
          title="TikTok - Yuntas Publicidad"
          className="flex items-center gap-1 text-white"
        >
          <FaTiktok className="text-2xl hover:text-purple-500" />
          <span className="font-light">Yuntas Producciones</span>
        </a>
        <a
          href="https://www.linkedin.com/company/yuntas-producciones/"
          target="_blank"
          aria-label="LinkedIn"
          title="LinkedIn - Yuntas Publicidad"
          className="flex items-center gap-1 text-white"
        >
          <FaLinkedin className="text-2xl hover:text-blue-700" />
          <span className="font-light">Yuntas Producciones</span>
        </a>
      </div>

      {/* Perfil + logout (solo si está logeado) - Solo se renderiza en cliente después de montar */}
      {mounted && hasToken && (
        <div className="border-t border-gray-400 pt-4 text-center px-6 pb-8">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gray-500 text-white">
              👤
            </div>
            <p className="font-semibold text-white">Bienvenido</p>
            <p className="text-sm text-gray-300">Administrador</p>
            <button
              onClick={logout}
              className="mt-2 w-full py-2 rounded-full transition bg-blue-800 hover:bg-blue-600 text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenuUnified;