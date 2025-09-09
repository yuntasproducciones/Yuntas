/**
 * @file useClientes.ts
 * @description Este archivo contiene el hook para obtener la lista de clientes.
 * @returns {Object} Un objeto que contiene la lista de clientes, un estado de carga y un mensaje de error.
 */

import { useState, useEffect } from "react";
import type Cliente from "../../models/clients";
import { config, getApiUrl } from "../../../config"; // Importar la configuración

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

        // Usar configuración centralizada
        const endpoint = `${config.endpoints.clientes.list}?page=${page}`;
        const url = getApiUrl(endpoint);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error al obtener clientes: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("🚀 Respuesta completa:", result);

        // Acceder a los datos dentro de la estructura de respuesta
        const responseData = result.data || {};
        const clientesArray = responseData.data || [];
        const total = responseData.total || 0;
        const lastPage = responseData.last_page || 1;

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