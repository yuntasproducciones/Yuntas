// src/hooks/useProducts.ts
import { useState, useEffect } from "react";
import type { Product, ProductoForm } from "../models/Product";
import { productoService } from "../services/productoService";

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface UseProductResult {
    productos: Product[];
    loading: boolean;
    error: string | null;
    pagination: PaginationData; 
    refetch: (page?: number, perPage?: number) => Promise<void>; 
    createProduct: (product: ProductoForm) => Promise<Product | null>;
    updateProduct: (id: number | string, product: ProductoForm) => Promise<Product | null>;
}

export function useProducts(): UseProductResult {
    const [productos, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<PaginationData>({
        current_page: 1,
        last_page: 1,
        per_page: 6, 
        total: 0,
    });
    console.log('PRODUCTOS HOOK:', productos); 
    
const fetchProducts = async (page: number = 1, perPage: number = pagination.per_page) => {
  setLoading(true);
  setError(null);
  try {
    const response = await productoService.getAllProductos(page, perPage); 
    console.log('response from getAllProductos:', response.data);

    setProducts(response.data); // 👈 el array de productos
    setPagination({
      current_page: response.current_page,
      last_page: response.last_page,
      per_page: response.per_page,
      total: response.total,
    });

  } catch (error) {
    setError(error instanceof Error ? error.message : 'Error desconocido al obtener productos');
    console.error('Error en useProducts:', error);
  } finally {
    setLoading(false);
  }
};

    // refetch ahora puede recibir parámetros para cambiar de página o perPage
    const refetch = async (page?: number, perPage?: number) => {
        await fetchProducts(page, perPage);
    };

    useEffect(() => {
        // Al cargar el hook, obtenemos la primera página con el per_page por defecto
        fetchProducts(pagination.current_page, pagination.per_page);
    }, []); // Dependencias vacías para que se ejecute una sola vez al montar

    const createProduct = async (product: ProductoForm): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productoService.createProducto(product);
            refetch(pagination.current_page); 
            return response.data;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido al crear producto');
            console.error('Error al crear producto:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (id: number | string, product: ProductoForm): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productoService.updateProducto(id, product);
            if (!response.data) {
                throw new Error('Producto no encontrado');
            }
            // Actualizamos solo el producto modificado en el estado local para mantener la reactividad
            setProducts(prev => prev.map(p => p.id === id ? response.data : p));
            return response.data;
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido al actualizar producto');
            console.error('Error al actualizar producto:', error);
            return null;
        }
        finally {
            setLoading(false);
        }
    };

    return { productos, loading, error, pagination, refetch, createProduct, updateProduct }
}