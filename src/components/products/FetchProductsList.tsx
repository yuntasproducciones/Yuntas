import { useEffect, useState } from "react";
import type Producto from "../../models/Product.ts";
import { config, getApiUrl } from "../../../config";
import ProductCard from "./ProductCard.jsx";

export default function FetchProductsList() {
  const [products, setProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.PUBLIC_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(getApiUrl(config.endpoints.productos.list), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          }
        });

        if (!response.ok) throw new Error("Error al obtener productos de la API");

        const jsonResponse = await response.json();
        console.log("Respuesta completa de la API:", jsonResponse);

        setProducts(jsonResponse);

      } catch (err) {
        console.error("Error al obtener productos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Cargando productos...</p>;

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
