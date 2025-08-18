import { config } from '../../config';
import type { Product, ProductoForm } from '../models/Product';
import { httpService } from './httpService';

interface ProductoListResponse {
  success: boolean;
  data: Product[];
  message: string;
  status: number;
}

interface ProductoDetailResponse {
  success: boolean;
  data: Product;
  message: string;
  status: number;
}

class ProductoService {
    async getAllProductos(): Promise<ProductoListResponse> {
        try {
            const response = await httpService.get<Product[]>(config.endpoints.productos.list);
            return response;
        } catch (error) {
            console.error('[ProductoService] Error obteniendo productos:', error);
            throw error;
        }
    }

    async getProductoById(id: number | string): Promise<ProductoDetailResponse> {
        try {
            const response = await httpService.get<Product>(config.endpoints.productos.detail(id));
            return response;
        } catch (error) {
            console.error('[ProductoService] Error obteniendo producto:', error);
            throw error;
        }
    }

    async createProducto(productData: ProductoForm): Promise<ProductoDetailResponse> {
        try {
            const formData = this.buildFormData(productData);
            const response = await httpService.authenticatedPostFormData<Product>(config.endpoints.productos.create, formData);
            return response;
        } catch (error) {
            console.error('[ProductoService] Error creando producto:', error);
            throw error;
        };
    };

    async updateProducto(id: number | string, productData: ProductoForm): Promise<ProductoDetailResponse> {
        try {
            const formData = this.buildFormData(productData);
            const response = await httpService.authenticatedPutFormData<Product>(config.endpoints.productos.update(id), formData);
            return response;
        } catch (error) {
            console.error('[ProductoService] Error actualizando producto:', error);
            throw error;
        }
    }

    async deleteProducto(id: number | string): Promise<ProductoDetailResponse> {
        try {
            
            const response = await httpService.authenticatedDelete<Product>(config.endpoints.productos.delete(id));
            return response;
        } catch (error) {
            console.error('[ProductoService] Error eliminando producto:', error);
            throw error;
        }
    };

    private buildFormData(productoData: ProductoForm): FormData {
        const formData = new FormData();
        
        // Campos básicos (todos requeridos según StoreBlogRequest)
        formData.append('link', productoData.link);
        formData.append('nombre', productoData.nombre);
        formData.append('titulo', productoData.titulo);
        formData.append('descripcion', productoData.descripcion);
        formData.append('seccion', productoData.seccion);
        
        // Imagen principal (requerida)
        if (productoData.imagen_principal_file) {
          formData.append('imagen_principal', productoData.imagen_principal_file);
        }
        
        // Imágenes adicionales 
        if (productoData.imagenes_files) {
            productoData.imagenes_files.forEach((file, index) => {
                formData.append(`imagenes[${index}]`, file);
            });
        }
        
        return formData;
    };
}

export const productoService = new ProductoService();