import { useState } from 'react';
import { blogService } from '../services/blogService';
import type Blog from '../models/Blog';
import type { BlogFormData } from '../models/Blog';

interface UseBlogActionsResult {
  loading: boolean;
  error: string | null;
  createBlog: (blogData: BlogFormData) => Promise<Blog | null>;
  updateBlog: (id: number | string, blogData: BlogFormData) => Promise<Blog | null>;
  deleteBlog: (id: number | string) => Promise<boolean>;
  clearError: () => void;
}

export function useBlogActions(): UseBlogActionsResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const createBlog = async (blogData: BlogFormData): Promise<Blog | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.createBlog(blogData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el blog';
      setError(errorMessage);
      console.error('Error creando blog:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (id: number | string, blogData: BlogFormData): Promise<Blog | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogService.updateBlog(id, blogData);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar el blog';
      setError(errorMessage);
      console.error('Error actualizando blog:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: number | string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await blogService.deleteBlog(id);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el blog';
      setError(errorMessage);
      console.error('Error eliminando blog:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createBlog,
    updateBlog,
    deleteBlog,
    clearError,
  };
}
