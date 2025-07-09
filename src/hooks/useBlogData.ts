import { useState, useEffect } from "react";
import { blogService } from "../services/blogService";
import type Blog from "../models/Blog";

interface UseBlogResult {
  blog: Blog | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBlog(idPost: string): UseBlogResult {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getBlogById(idPost);
      setBlog(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener el blog');
      console.error('Error en useBlog:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchBlog();
  };

  useEffect(() => {
    if (idPost) {
      fetchBlog();
    }
  }, [idPost]);

  return { blog, loading, error, refetch };
}
