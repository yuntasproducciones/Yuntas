import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok, FaLinkedin } from "react-icons/fa";

interface MobileMenuProps {
    isOpen: boolean;
    items: { link: string, texto: string }[];
    logo?: any;
}

const MobileMenu = ({ isOpen, items, logo }: MobileMenuProps) => {
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Solo deshabilitar scroll si está abierto EN MÓVIL
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, isMobile]);

    if (!isOpen || !isMobile) return null;

    return (
        <div className="md:hidden fixed inset-0 bg-[#0D1030] z-[-10]">
            <div className="container mx-auto mt-30">
                <img
                    src={logo.src}
                    alt="Logo Yuntas"
                    width={80}
                    height={80}
                    className="h-[80px] w-auto cursor-pointer m-8"
                />
                <nav className="flex flex-col ">
                    {items.map((item) => (
                        <a
                            key={item.link}
                            href={item.link}
                            className="text-white px-8 py-4 hover:text-indigo-200 text-xl font-medium border-b border-gray-100"
                        >
                            {item.texto}
                        </a>
                    ))}
                </nav>
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
    )
}

export default MobileMenu;