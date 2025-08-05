import { config } from '../../config';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  status: number;
}

class HttpService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.apiUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`[HttpService] Error en ${url}:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      headers: {
        // No establecer Content-Type para FormData, el navegador lo hace automáticamente
        ...options?.headers,
      },
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async putFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: formData,
      headers: {
        ...options?.headers,
      },
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // Método para obtener headers con autenticación
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Métodos autenticados
  async authenticatedGet<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.get<T>(endpoint, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });
  }

  async authenticatedPost<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.post<T>(endpoint, data, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });
  }

  async authenticatedPostFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.postFormData<T>(endpoint, formData, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });
  }

  async authenticatedPut<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.put<T>(endpoint, data, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });
  }

  async authenticatedPutFormData<T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.putFormData<T>(endpoint, formData, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });
  }

  async authenticatedDelete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.delete<T>(endpoint, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options?.headers,
      },
    });
  }
}

export const httpService = new HttpService();
