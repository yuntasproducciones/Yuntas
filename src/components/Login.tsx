import { useEffect, useState, type FormEvent } from "react";
import "../../src/styles/login.css";
import logo from "../assets/images/logo_yuntas.webp?url";
import loginImagen from "../assets/images/login/Login_fondo.webp?url";
import { config, getApiUrl } from "../../config";

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasCheckedWidth, setHasCheckedWidth] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      setIsDesktop(width >= 768);
      setHasCheckedWidth(true);
      if (width >= 768) {
        setTimeout(() => {
          setIsActive(true);
        }, 100);
      }
    }
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(JSON.stringify({ email, password }));
    try {
      const response = await fetch(getApiUrl(config.endpoints.auth.login), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Respuesta recibida:", response);

      const data = await response.json();
      console.log("Datos del servidor:", data);

      if (response.ok) {
        localStorage.setItem("token", data.data.token);
        window.location.href = "/admin/inicio";
      } else {
        console.error("Error en la respuesta del servidor:", data.message);
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error("Error de conexión con el servidor:", error);
      alert("Error de conexión con el servidor.");
    }
  };

  return (
      <div className="flex h-screen">
        {/* Fondo lateral que solo se ve en desktop */}
        <div
            className="hidden md:flex w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${loginImagen})` }}
        ></div>

        {hasCheckedWidth ? (
            <div
                className={`mov-login ${isDesktop && isActive ? "active" : ""} w-full lg:w-2/5 h-full flex items-center justify-center`}
            >
              <div className="fondo-container w-full h-full shadow-lg flex flex-col items-center justify-center px-8">
                <img src={logo} alt="Logo Yuntas" className="w-16 md:w-32 mb-4" />
                <h1 className="text-2xl font-bold mt-4 mb-4 text-center text-amber-50">
                  BIENVENIDO
                </h1>
                <form onSubmit={handleLogin} className="w-full max-w-xs">
                  <div className="mb-4 flex justify-center w-full">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="rounded-full bg-white w-64 py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-600"
                        placeholder="Usuario"
                    />
                  </div>
                  <div className="mb-4 flex justify-center w-full">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="rounded-full bg-white w-64 py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-600"
                        placeholder="Password"
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                        className="bg-[#23C1DE] hover:bg-gray-100 text-white font-bold py-2 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
                        type="submit"
                    >
                      INGRESAR
                    </button>
                  </div>
                </form>
              </div>
            </div>
        ) : (
            // Espacio en blanco para que el layout flex padre no salte
            <div className="w-full lg:w-2/5 h-full"></div>
        )}
      </div>
  );
};

export default Login;