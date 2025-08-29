/**
 * @file useClientes.ts
 * @description Este archivo contiene el hook para obtener la lista de clientes.
 * @returns {Object} Un objeto que contiene la lista de clientes, un estado de carga y un mensaje de error.
 */

import { useState, useEffect } from "react";
import type Cliente from "../../models/clients.ts";

const useClientes = (trigger: boolean, page: number = 1) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No se encontró el token de autenticación");

        // Agregar parámetro de página a la URL
        const response = await fetch(`https://apiyuntas.yuntaspublicidad.com/api/v1/clientes?page=${page}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok)
          throw new Error(`Error al obtener clientes: ${response.statusText}`);

        const result = await response.json();
        console.log("🚀 Respuesta completa:", result);
        
        // Acceder a los datos dentro de la estructura de respuesta
        const responseData = result.data || {};
        const clientesArray = responseData.data || [];
        const total = responseData.total || 0;
        const lastPage = responseData.last_page || 1;
        
        console.log("🚀 Clientes obtenidos:", clientesArray);
        console.log("🚀 Total:", total);
        console.log("🚀 Última página:", lastPage);
        
        setClientes(clientesArray);
        setTotalPages(lastPage);

      } catch (err) {
        console.error("🚨 Error en fetchClientes:", err);
        setError(
          err instanceof Error ? err.message : "Ocurrió un error desconocido"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, [trigger, page]);

  return {
    clientes,
    totalPages,
    loading,
    error,
  };
};
export default useClientes;
