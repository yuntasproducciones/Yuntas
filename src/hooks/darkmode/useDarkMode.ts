// hooks/useDarkMode.ts
import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Función para aplicar el dark mode a todo el documento
  const applyDarkMode = (isDark: boolean) => {
    if (typeof window === "undefined") return;

    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const mainElement = document.getElementById("main-content");

    if (isDark) {
      htmlElement.classList.add("dark");
      bodyElement.classList.add("dark");
      
      // Actualizar el main element específicamente
      if (mainElement) {
        mainElement.classList.remove("bg-gray-50", "text-gray-900");
        mainElement.classList.add("bg-gray-800", "text-gray-100");
      }
    } else {
      htmlElement.classList.remove("dark");
      bodyElement.classList.remove("dark");
      
      // Actualizar el main element específicamente
      if (mainElement) {
        mainElement.classList.remove("bg-gray-800", "text-gray-100");
        mainElement.classList.add("bg-gray-50", "text-gray-900");
      }
    }
  };

  // Función para cambiar el modo
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
    applyDarkMode(newMode);

    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(
      new CustomEvent("darkModeToggle", {
        detail: { darkMode: newMode },
      })
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Leer estado inicial del localStorage
    const stored = localStorage.getItem("darkMode");
    const initialMode = stored ? JSON.parse(stored) : false;
    setDarkMode(initialMode);
    applyDarkMode(initialMode);

    // Escuchar eventos de cambio de dark mode
    const handleDarkModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ darkMode: boolean }>;
      const newMode = customEvent.detail.darkMode;
      setDarkMode(newMode);
    };

    window.addEventListener("darkModeToggle", handleDarkModeChange);

    return () => {
      window.removeEventListener("darkModeToggle", handleDarkModeChange);
    };
  }, []);

  return { darkMode, toggleDarkMode };
};