import { useEffect, useState } from "react";

export default function ProductsDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const testEndpoints = async () => {
      const results: any = {};
      
      // Probar endpoint local
      try {
        console.log("🧪 Probando endpoint local /api/productos...");
        const localResponse = await fetch("/api/productos");
        const localData = await localResponse.json();
        
        results.local = {
          status: localResponse.status,
          ok: localResponse.ok,
          data: localData,
          dataType: typeof localData,
          hasData: !!localData.data,
          dataLength: Array.isArray(localData.data) ? localData.data.length : 'No es array'
        };
        
        console.log("✅ Respuesta local:", results.local);
      } catch (err) {
        console.error("❌ Error con endpoint local:", err);
        results.local = { error: err instanceof Error ? err.message : "Error desconocido" };
      }

      // Probar endpoint directo
      try {
        console.log("🧪 Probando endpoint directo...");
        const directResponse = await fetch("https://apiyuntas.yuntaspublicidad.com/api/v1/productos");
        const directData = await directResponse.json();
        
        results.direct = {
          status: directResponse.status,
          ok: directResponse.ok,
          data: directData,
          dataType: typeof directData,
          hasData: !!directData.data,
          dataLength: Array.isArray(directData.data) ? directData.data.length : 'No es array'
        };
        
        console.log("✅ Respuesta directa:", results.direct);
      } catch (err) {
        console.error("❌ Error con endpoint directo:", err);
        results.direct = { error: err instanceof Error ? err.message : "Error desconocido" };
      }

      setDebugInfo(results);
    };

    testEndpoints();
  }, []);

  return (
    <div className="bg-white text-black p-6 rounded-lg m-4">
      <h2 className="text-2xl font-bold mb-4">🔍 Debug de Productos</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">📡 Endpoint Local (/api/productos)</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.local, null, 2)}
          </pre>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">🌐 Endpoint Directo</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo.direct, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
