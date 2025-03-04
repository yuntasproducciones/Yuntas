import { useEffect, useState } from "react";
import { fakeUsers } from "../utils/fakeUsers";
import "../../src/styles/login.css";
import logo from "../assets/images/logo_yuntas.webp?url";

const Login = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsActive(true);
    }, 100);
  }, []);

  const handleLogin = () => {
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;

    const user = fakeUsers.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      window.location.href = "/admin"; // Redirigir a la vista de administrador
    } else {
      console.log("Credenciales incorrectas");
    }
  };

  return (
    <div className="flex h-screen">
      <div
        className={`mov-login ${
          isActive ? "active" : ""
        } w-full h-screen lg:w-auto lg:h-auto`}
      >
        <div className="w-full md:w-[120%] h-full shadow-lg flex flex-col items-center justify-center px-12 fondo-container mx-auto md:mx-0">
          <img src={logo} alt="Logo Yuntas" className="w-28 md:w mb-6" />
          <h1 className="text-4xl font-bold mt-4 mb-6 text-center text-amber-50">
            BIENVENIDO
          </h1>
          <form className="w-full max-w-md">
            <div className="mb-6 flex justify-center w-full">
              <input
                type="email"
                id="email"
                className="rounded-full bg-white w-72 py-3 px-4 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-600"
                placeholder="Usuario"
              />
            </div>
            <div className="mb-6 flex justify-center w-full">
              <input
                type="password"
                id="password"
                className="rounded-full bg-white w-72 py-3 px-4 text-black leading-tight focus:outline-none focus:shadow-outline placeholder-gray-600"
                placeholder="Password"
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-[#23C1DE] hover:bg-gray-100 text-white font-bold py-2 px-11 rounded-full focus:outline-none focus:shadow-outline transition duration-300"
                type="button"
                onClick={handleLogin}
              >
                INGRESAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
