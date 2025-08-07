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
        
        // Llamar directamente a la API de producción para evitar problemas de cache
        const timestamp = new Date().getTime();
        const apiUrl = `https://apiyuntas.yuntaspublicidad.com/api/v1/productos?_t=${timestamp}`;
        console.log('📡 URL del endpoint:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
            // Removemos headers de cache para evitar problemas CORS
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Respuesta no OK:', errorText);
          throw new Error(`Error al obtener productos de la API: ${response.status} - ${errorText}`);
        }

        const jsonResponse = await response.json();

        if (jsonResponse.success && jsonResponse.data?.data) {
          setProducts(jsonResponse.data.data);
        } else {
          console.error("Error en la respuesta:", jsonResponse.message);
          setProducts([]);
        }

      } catch (err) {
        console.error("Error al obtener productos:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <p className="grid place-content-center min-h-screen text-white text-3xl animate-pulse font-extrabold">
        Cargando productos...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.length > 0 ? (
        products.map((producto, index) => (
          <div key={index} className="flex justify-center">
            <div className="max-w-[300px] sm:max-w-[250px]">
              <ProductCard producto={producto} />
            </div>
          </div>
        ))
      ) : (
        <p className="text-white text-center">No hay productos disponibles</p>
      )}
    </div>
  );
}