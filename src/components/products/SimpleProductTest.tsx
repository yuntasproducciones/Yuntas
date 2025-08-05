import { useEffect, useState } from "react";

interface SimpleProduct {
  id: number;
  title: string;
  precioProducto: string;
}

export default function SimpleProductTest() {
  const [status, setStatus] = useState("Iniciando...");
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFetch = async () => {
      try {
        setStatus("Conectando a la API...");
        console.log("🚀 Iniciando prueba simple...");
        
        const url = "/api/productos";
        console.log(" URL local:", url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        
        console.log("📡 Response:", response);
        setStatus(`Estado de respuesta: ${response.status}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("📦 Data:", data);
        
        setProducts(data.data || []);
        setStatus(` API funcionando - ${data.data?.length || 0} productos`);
        
      } catch (err) {
        console.error("❌ Error:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
        setStatus("❌ Error al conectar");
      }
    };
    
    testFetch();
  }, []);

  return (
    <div className="p-4 bg-white text-black rounded-lg m-4">
      <h2 className="text-2xl font-bold mb-4">Prueba de API de Productos</h2>
      <p className="mb-4"><strong>Estado:</strong> {status}</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {products.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold mb-2">Productos encontrados:</h3>
          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={index} className="border p-2 rounded bg-gray-50">
                <p><strong>ID:</strong> {product.id}</p>
                <p><strong>Título:</strong> {product.title}</p>
                <p><strong>Precio:</strong> ${product.precioProducto}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
