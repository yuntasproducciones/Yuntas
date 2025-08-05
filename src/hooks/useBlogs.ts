import { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import type Blog from '../models/Blog';

interface UseBlogsResult {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBlogs(): UseBlogsResult {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getAllBlogs();
      setBlogs(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener blogs');
      console.error('Error en useBlogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchBlogs();
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return { blogs, loading, error, refetch };
}