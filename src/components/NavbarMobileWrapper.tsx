import { useState } from "react";
import MobileMenuUnified from "./MobileMenuUnified";
import ToggleNavbar from "./ui/ToggleNavbar";
import logo from "../assets/images/yuntas_publicidad_logo.webp";

const NavbarMobileWrapper = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ToggleNavbar isOpen={isOpen} setIsOpen={setIsOpen} />
      <MobileMenuUnified isOpen={isOpen} onClose={() => setIsOpen(false)} logo={logo} />
    </>
  );
};

export default NavbarMobileWrapper;
