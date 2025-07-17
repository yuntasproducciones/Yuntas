import { useEffect, useState } from "react";
import type Producto from "../../models/Product.ts";
import { config, getApiUrl } from "../../../config";
import ProductCard from "./ProductCard.jsx";

export default function FetchProductsList() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🚀 Iniciando fetch de productos...');
        
        // Usar el endpoint local para evitar problemas de CORS
        const url = "/api/productos";
        console.log('📡 URL del endpoint:', url);
        
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        });

        console.log('📡 Respuesta HTTP:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Respuesta no OK:', errorText);
          throw new Error(`Error al obtener productos de la API: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();
        console.log('📦 Respuesta JSON completa:', jsonResponse);

        // Verificar si la respuesta tiene la estructura esperada
        if (!jsonResponse) {
          throw new Error('Respuesta vacía de la API');
        }

        // Manejar la estructura de respuesta de la API v1
        const productData = jsonResponse.data || jsonResponse;
        console.log('📦 Datos de productos extraídos:', productData);

        if (!productData) {
          console.warn('⚠️ No se encontraron datos de productos');
          setProducts([]);
          return;
        }

        const products = Array.isArray(productData) ? productData : [productData];
        console.log('📦 Array de productos final:', products);
        console.log('📦 Cantidad de productos:', products.length);

        // Validar que los productos tengan la estructura esperada
        const validProducts = products.filter(producto => {
          const isValid = producto && (producto.id || producto.title || producto.name);
          if (!isValid) {
            console.warn('⚠️ Producto inválido encontrado:', producto);
          }
          return isValid;
        });

        console.log('✅ Productos válidos:', validProducts.length);
        setProducts(validProducts);

      } catch (err) {
        console.error("❌ Error al obtener productos:", err);
        console.error("❌ Detalles del error:", {
          message: err instanceof Error ? err.message : "Error desconocido",
          stack: err instanceof Error ? err.stack : "No stack disponible",
          name: err instanceof Error ? err.name : "Error"
        });
        
        // En caso de error, intentar con la API directa como fallback
        console.log('🔄 Intentando con API directa como fallback...');
        try {
          const fallbackResponse = await fetch('https://apiyuntas.yuntaspublicidad.com/api/v1/productos', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            }
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const fallbackProducts = fallbackData.data || fallbackData;
            const validFallbackProducts = Array.isArray(fallbackProducts) ? fallbackProducts : [fallbackProducts];
            console.log('✅ Fallback exitoso, productos:', validFallbackProducts.length);
            setProducts(validFallbackProducts);
          } else {
            console.error('❌ Fallback también falló');
            setProducts([]);
          }
        } catch (fallbackErr) {
          console.error('❌ Error en fallback:', fallbackErr);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return (
    <div className="grid place-content-center min-h-screen">
      <p className="text-white text-3xl animate-pulse font-extrabold">Cargando productos...</p>
      <p className="text-white/70 text-lg mt-2">Conectando con la API...</p>
    </div>
  )

  console.log('🎨 Renderizando componente con:', {
    productsCount: products.length,
    products: products.map(p => ({ id: p.id, title: p.title, image: p.image }))
  });

  return (
    <div className="w-full">
      {/* Debug info - solo en desarrollo */}
      {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
        <div className="bg-black/80 text-white p-4 mb-4 rounded-lg text-sm">
          <p>🔍 <strong>Debug Info:</strong></p>
          <p>📊 Productos cargados: {products.length}</p>
          <p>🌐 Endpoint usado: /api/productos</p>
          {products.length > 0 && (
            <p>✅ Productos: {products.map(p => p.title || p.nombreProducto).join(', ')}</p>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length > 0 ? (
          products.map((producto, index) => (
            <div key={producto.id || index} className="flex justify-center">
              <div className="max-w-[300px] sm:max-w-[250px]">
                <ProductCard producto={producto} />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-white text-2xl mb-4">No hay productos disponibles</p>
            <p className="text-white/70 text-lg">
              Por favor, verifica la conexión con la API o contacta al administrador.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              🔄 Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
