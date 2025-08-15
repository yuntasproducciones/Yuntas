/**
 * @abstract Config file
 * @description Este archivo contiene la configuraci贸n de la aplicaci贸n.
 * para esto, se ha creado un objeto config que contiene la url de la api y los endpoints.
 * Los endpoints estan divididos por secciones, como auth, users, clientes, productos y blogs.
 **/
export const config = {

  // apiUrl: "http://localhost:8000", // API local para desarrollo
  apiUrl: "https://apiyuntas.yuntaspublicidad.com", // API desplegada (comentada para desarrollo)
  environment: import.meta.env.MODE || "development", // Entorno de la aplicación, por defecto development
  endpoints: {
    auth: {
      // Endpoints de autenticaci贸
      login: "/api/v1/auth/login",
      logout: "/api/v1/auth/logout",
    },
    users: {
      // Endpoints de usuarios
      list: "/api/v1/users",
      detail: (id: number | string) => `/api/v1/users/${id}`,
      create: "/api/v1/users",
      update: (id: number | string) => `/api/v1/users/${id}`,
      delete: (id: number | string) => `/api/v1/users/${id}`,
    },
    clientes: {
      // Endpoints de clientes
      list: "/api/v1/clientes",
      detail: (id: number | string) => `/api/v1/clientes/${id}`,
      create: "/api/v1/clientes",
      update: (id: number | string) => `/api/v1/clientes/${id}`,
      delete: (id: number | string) => `/api/v1/clientes/${id}`,
    },
    productos: {
      // Endpoints de productos
      list: '/api/v1/productos',
      detail: (id: string | number) => `/api/v1/productos/${id}`,
      link: (link: string) => `/api/v1/productos/link/${link}`,
      create: "/api/v1/productos",
      update: (id: number | string) => `/api/v1/productos/${id}`,
      delete: (id: number | string) => `/api/v1/productos/${id}`,
    },
    blogs: {
      // Endpoints de blogs
      list: "/api/blogs",
      detail: (id: number | string) => `/api/blogs/${id}`,
      link: (link: string) => `/api/blogs/link/${link}`,
      create: "/api/blogs",
      update: (id: number | string) => `/api/blogs/${id}`,
      delete: (id: number | string) => `/api/blogs/${id}`,
    },
  },
};

export const getApiUrl = (endpoint: string) => {
  const url = `${config.apiUrl}${endpoint}`;
  console.log(`[${config.environment}] Requesting:`, url);
  return url;
};