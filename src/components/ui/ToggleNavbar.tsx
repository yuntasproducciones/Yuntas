import { IoClose } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

interface ToggleNavbarButtonProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  controlsId?: string; 
}

const ToggleNavbar: React.FC<ToggleNavbarButtonProps> = ({
  isOpen,
  setIsOpen,
  controlsId = "mobile-nav",
}) => {
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={isOpen}
      aria-controls={controlsId}
      className="block lg:hidden cursor-pointer"
    >
      {isOpen ? (
        <IoClose className="text-3xl" />
      ) : (
        <RxHamburgerMenu className="text-3xl" />
      )}
    </button>
  );
};

export default ToggleNavbar;
