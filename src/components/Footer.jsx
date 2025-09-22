import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { useDarkMode } from "../hooks/darkmode/useDarkMode"; 
import yuntasLogo from "../assets/images/yuntas_publicidad_logo.webp";

const Footerjsx = ({ variant = "default" }) => {
    const { darkMode } = useDarkMode();
  const isAdmin = variant === "admin";
  const footerClasses =
  isAdmin
    ? darkMode
      ? "bg-gradient-to-b from-[#0d1030] to-[#1a1a3a] text-white shadow-md"
      : "bg-gradient-to-b from-[#0d1030] to-[#293296] text-white shadow-md"
    : "bg-[#172649] text-white";
  return (
    <footer
      className={`${footerClasses} ${
        isAdmin ? "py-6" : "py-16"
      } text-sm sm:text-base`}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center lg:px-20 gap-4">
        {/* Logo y redes */}
        <div className="flex flex-col items-center text-center md:text-left mb-8 md:mb-0 w-full md:w-auto">
          <img
            src={yuntasLogo.src}
            alt="Yuntas Logo"
            title="Logo Yuntas Publicidad"
            className={`mx-auto ${isAdmin ? "h-16" : "h-24"}`}
          />
          <div className="border-t-1 border-l-2 border-cyan-400 max-w-54 w-full my-2"></div>
          <div className="flex justify-center gap-3 mt-4">
            <a
              href="https://www.facebook.com/yuntaspublicidad"
              target="_blank"
              aria-label="Facebook"
            >
              <FaFacebook className="text-white text-2xl hover:text-blue-500" />
            </a>
            <a
              href="https://www.instagram.com/yuntasdecoracioncomercial/"
              target="_blank"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white text-2xl hover:text-pink-500" />
            </a>
            <a
              href="https://www.youtube.com/@yuntaspublicidad5082/"
              target="_blank"
              aria-label="YouTube"
            >
              <FaYoutube className="text-white text-2xl hover:text-red-500" />
            </a>
            <a
              href="https://wa.me/912849782"
              target="_blank"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-white text-2xl hover:text-green-500" />
            </a>
            <a
              href="https://www.tiktok.com/@yuntasproduccione"
              target="_blank"
              aria-label="TikTok"
            >
              <FaTiktok className="text-white text-2xl hover:text-purple-500" />
            </a>
          </div>
        </div>

        {/* Dirección y horario */}
        <div className="text-center md:text-left mb-8 md:mb-0">
          <h3 className="font-semibold text-[#98D8DF]">Dirección</h3>
          <p className="text-gray-300">Urb. Alameda La Rivera Mz F Lt 30</p>
          <h3 className="font-semibold text-[#98D8DF] mt-4">Horario</h3>
          <p className="text-gray-300">L - V: 9 a.m - 5 p.m</p>
          <p className="text-gray-300">S: 9 a.m - 2 p.m</p>
          <a href="/libro_reclamaciones" className="text-sm font-bold mt-2 block">
            Libro de reclamaciones
          </a>
        </div>

        {/* Contacto */}
        <div className="text-center md:text-left">
          <h3 className="font-semibold text-[#98D8DF]">Contacto</h3>
          <p className="flex items-center justify-center md:justify-start gap-2">
            <FaWhatsapp className="text-white" /> +51 912 849 782
          </p>
          <p className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <MdEmail className="text-white" />
            <a
              href="mailto:yuntaspublicidad@gmail.com"
              className="hover:text-blue-400"
            >
              yuntaspublicidad@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footerjsx;
