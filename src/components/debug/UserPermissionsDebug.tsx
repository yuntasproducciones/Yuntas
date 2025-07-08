import { useEffect, useState } from "react";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export default function UserPermissionsDebug() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No hay token de autenticación");
          setLoading(false);
          return;
        }

        console.log("🔍 Verificando permisos del usuario...");
        
        // Probar el endpoint /me o /user para obtener información del usuario
        const response = await fetch("https://apiyuntas.yuntaspublicidad.com/api/v1/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });

        console.log("📡 Response status:", response.status);

        if (response.status === 401) {
          setError("Token expirado o inválido");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          // Intentar con otro endpoint
          const response2 = await fetch("https://apiyuntas.yuntaspublicidad.com/api/user", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json",
              "Content-Type": "application/json"
            }
          });
          
          if (!response2.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const userData = await response2.json();
          console.log("👤 User data:", userData);
          setUserInfo(userData);
        } else {
          const userData = await response.json();
          console.log("👤 User data:", userData);
          setUserInfo(userData);
        }

      } catch (err) {
        console.error("❌ Error:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    checkUserPermissions();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-blue-100 border border-blue-400 rounded">
        <p className="text-blue-800">🔍 Verificando permisos del usuario...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 rounded">
        <h3 className="font-bold text-red-800">❌ Error</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white border border-gray-300 rounded shadow">
      <h3 className="text-xl font-bold mb-4 text-gray-800">🔐 Información de Permisos</h3>
      
      {userInfo ? (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700">👤 Usuario:</h4>
            <p><strong>ID:</strong> {userInfo.id}</p>
            <p><strong>Nombre:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">🎭 Roles:</h4>
            {userInfo.roles && userInfo.roles.length > 0 ? (
              <ul className="list-disc pl-5">
                {userInfo.roles.map((role, index) => (
                  <li key={index} className="text-blue-600">{role}</li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600">❌ Sin roles asignados</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-700">🔑 Permisos:</h4>
            {userInfo.permissions && userInfo.permissions.length > 0 ? (
              <ul className="list-disc pl-5">
                {userInfo.permissions.map((permission, index) => (
                  <li key={index} className={
                    permission === "ENVIAR" ? "text-green-600 font-bold" : "text-gray-600"
                  }>
                    {permission}
                    {permission === "ENVIAR" && "  (Requerido para productos)"}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600">❌ Sin permisos asignados</p>
            )}
          </div>

          <div className="bg-yellow-100 border border-yellow-400 rounded p-3">
            <h5 className="font-semibold text-yellow-800">📋 Permisos requeridos para productos:</h5>
            <ul className="text-yellow-700">
              <li>• Rol: ADMIN o USER</li>
              <li>• Permiso: ENVIAR</li>
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No se pudo obtener información del usuario</p>
      )}
    </div>
  );
}
