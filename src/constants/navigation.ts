export interface Route {
  link: string;
  texto: string;
  title: string;
}

export const RUTAS: Route[] = [
  { link: "/", texto: "INICIO", title: "Página de Inicio - Yuntas Publicidad" },
  { link: "/products", texto: "PRODUCTOS", title: "Productos - Yuntas Publicidad" },
  { link: "/about", texto: "NOSOTROS", title: "Nosotros - Yuntas Publicidad" },
  { link: "/blogs", texto: "BLOG", title: "Blog - Yuntas Publicidad" },
  { link: "/contact", texto: "CONTACTO", title: "Contacto - Yuntas Publicidad" },
];