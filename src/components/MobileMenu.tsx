import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaLinkedin } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface MobileMenuProps {
  isOpen: boolean;
  items: { link: string; texto: string }[];
  logo?: any;
  onClose?: () => void; // añadido para cerrar con boton o link
}

const MobileMenu = ({ isOpen, items, logo, onClose }: MobileMenuProps) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023); // tu mejora: breakpoint en 1023px
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden"; // evita scroll cuando menu abierto
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isMobile]);

  if (!isMobile) return null;

  return (
    <div
      className={`lg:hidden fixed inset-0 bg-[#0D1030] z-50 transform transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* boton cerrar arriba a la derecha */}
      <button
        onClick={onClose}
        aria-label="Cerrar menu"
        className="absolute top-6 right-6 text-white text-4xl hover:text-red-400 transition-colors"
      >
        <IoClose />
      </button>

      <div className="container mx-auto mt-28">
        {logo && (
          <img
            src={logo.src}
            alt="Logo Yuntas"
            width={80}
            height={80}
            className="h-[80px] w-auto cursor-pointer m-8"
          />
        )}
        <nav className="flex flex-col">
          {items.map((item) => (
            <a
              key={item.link}
              href={item.link}
              onClick={onClose} // se cierra al navegar
              className="text-white px-8 py-4 hover:text-indigo-200 text-xl font-medium border-b border-gray-100"
            >
              {item.texto}
            </a>
          ))}
        </nav>

        {/* redes sociales */}
        <div className="grid grid-cols-2 gap-y-2 m-8">
          <a
            href="https://www.facebook.com/yuntaspublicidad"
            target="_blank"
            aria-label="Facebook"
            className="flex items-center gap-1 text-white"
          >
            <FaFacebook className="text-2xl hover:text-blue-500" />
            <span className="font-light">Yuntas Producciones</span>
          </a>
          <a
            href="https://wa.me/912849782"
            target="_blank"
            aria-label="WhatsApp"
            className="flex items-center gap-1 text-white"
          >
            <FaWhatsapp className="text-2xl hover:text-green-500" />
            <span className="font-light">+51 912 849 782</span>
          </a>
          <a
            href="https://www.instagram.com/yuntasdecoracioncomercial/"
            target="_blank"
            aria-label="Instagram"
            className="flex items-center gap-1 text-white"
          >
            <FaInstagram className="text-2xl hover:text-pink-500" />
            <span className="font-light">Yuntas Producciones</span>
          </a>
          <a
            href="https://www.tiktok.com/@yuntasproduccione"
            target="_blank"
            aria-label="TikTok"
            className="flex items-center gap-1 text-white"
          >
            <FaTiktok className="text-2xl hover:text-purple-500" />
            <span className="font-light">Yuntas Producciones</span>
          </a>
          <a
            href="https://www.linkedin.com/company/yuntas-producciones/"
            target="_blank"
            aria-label="LinkedIn"
            className="flex items-center gap-1 text-white"
          >
            <FaLinkedin className="text-2xl hover:text-blue-700" />
            <span className="font-light">Yuntas Producciones</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
