/**
 * @file useClientesActions.ts - Version con debug
 * @description Versión con debugging para identificar el problema
 */

import type Cliente from "../../models/clients";
import { config, getApiUrl } from "../../../config";

const useClienteAcciones = () => {
  const getValidToken = () => {
    const token = localStorage.getItem("token");
    console.log("🔍 Token encontrado:", token ? "✅ Sí" : "❌ No");
    console.log("🔍 Token (primeros 20 chars):", token ? token.substring(0, 20) + "..." : "No token");
    
    if (!token) throw new Error("No se encontró el token");
    return token;
  };

  const updateCliente = async (
    id: number,
    updatedData: Partial<Cliente>
  ): Promise<Cliente> => {
    try {
      const token = getValidToken();
      const url = getApiUrl(config.endpoints.clientes.update(id));
      const requestOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest", 
        },
        body: JSON.stringify(updatedData),
      };

      console.log("🔍 Headers de la petición:", requestOptions.headers);

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🚨 Error response body:", errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result: { data: Cliente } = await response.json();
      console.log("✅ Respuesta exitosa:", result);
      return result.data;

    } catch (error) {
      console.error("🚨 Error completo:", error);
      throw error;
    }
  };

  const addCliente = async (
    clienteData: Partial<Cliente>
  ): Promise<Cliente> => {
    const token = getValidToken();
    const url = getApiUrl(config.endpoints.clientes.create);
    
    console.log("🔍 ADD - URL completa:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(clienteData),
    });

    console.log("🔍 ADD - Status:", response.status);
    console.log("🔍 ADD - URL final:", response.url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al agregar cliente: ${response.status} - ${errorText}`);
    }

    const result: { data: Cliente } = await response.json();
    return result.data;
  };

  const deleteCliente = async (id: number): Promise<{ message: string }> => {
    const token = getValidToken();
    const url = getApiUrl(config.endpoints.clientes.delete(id));
    
    console.log("🔍 DELETE - URL completa:", url);

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al eliminar cliente: ${response.status} - ${errorText}`);
    }

    const result: { message: string } = await response.json();
    return result;
  };

  return {
    addCliente,
    updateCliente,
    deleteCliente,
  };
};

export default useClienteAcciones;