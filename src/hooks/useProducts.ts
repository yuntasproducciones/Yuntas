import { useState, useEffect } from "react";
import type { Product, ProductoForm } from "../models/Product";
import { productoService } from "../services/productoService";
import { s } from "framer-motion/client";

interface UseProductResult {
    productos: Product[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    createProduct: (product: ProductoForm) => Promise<Product | null>;
    updateProduct: (id: number | string, product: ProductoForm) => Promise<Product | null>;
}

export function useProducts(): UseProductResult {
    const [productos, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {   
            const response = await productoService.getAllProductos();
            setProducts(response.data);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido al obtener productos');
            console.error('Error en useBlogs:', error);
        } finally {
            setLoading(false);
        }
    }

    const refetch = async () => {
        await fetchProducts();
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const createProduct = async (product: ProductoForm): Promise<Product | null> => {
        setLoading(true);
        setError(null);
        try {
            const response = await productoService.createProducto(product);
            setProducts(prev => [...prev, response.data]);
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

    return { productos, loading, error, refetch, createProduct, updateProduct }
}