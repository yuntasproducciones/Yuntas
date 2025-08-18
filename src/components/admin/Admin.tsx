import React, { useEffect, useState } from "react";

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Redirección inmediata sin alert
      window.location.replace("/login");
      return;
    }
    
    setIsAuthenticated(true);
  }, []);

  // Mientras verifica la autenticación
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div></div>
  );
};

export default Admin;