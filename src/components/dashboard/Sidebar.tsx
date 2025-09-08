import { FaRegFolder } from "react-icons/fa";
import { useDarkMode } from "../../hooks/darkmode/useDarkMode";

// funcion logout basica
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

const Sidebar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const items = [
    { name: "Inicio", path: "/admin/inicio" },
    { name: "Seguimiento", path: "/admin/seguimiento" },
    { name: "Blogs", path: "/admin/" },
    { name: "Productos", path: "/admin/productos" },
    { name: "Usuarios", path: "/admin/usuarios" },
  ];

  return (
    <aside
      className={`sidebar hidden lg:block top-0 left-0 z-50 w-64 h-full transition-transform duration-300 ease-in-out
        ${darkMode ? "bg-[#1e1e2f] text-white" : "bg-gray-200 text-gray-800"}`}
    >
      <div className="p-4 space-y-6">
        {/* nav de enlaces */}
        <nav>
          <ul className="space-y-1">
            <li className="font-bold text-lg">★ Administración</li>
            {items.map((item, index) => (
              <li key={index}>
                <a
                  href={item.path}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <FaRegFolder className={darkMode ? "text-gray-400" : "text-gray-500"} />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* switch dark mode */}
        <div className="border-t border-gray-400 pt-4 flex items-center justify-between">
          <span className="text-sm font-medium">Dark Mode</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={darkMode}
              onChange={toggleDarkMode}
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

        {/* perfil y boton logout */}
        <div className="border-t border-gray-400 pt-4 text-center">
          <div className="flex flex-col items-center space-y-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-500 text-white"
              }`}
            >
              👤
            </div>
            <p className="font-semibold">Bienvenido</p>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Administrador
            </p>
            <button
              onClick={logout}
              className={`mt-2 w-full py-2 rounded-full transition ${
                darkMode
                  ? "bg-blue-800 hover:bg-blue-600 text-white"
                  : "bg-blue-900 hover:bg-teal-600 text-white"
              }`}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
