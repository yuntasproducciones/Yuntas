export interface User {
  id: number;
  name: string;
  email: string;
  // password: string;
  celular?: string;
  roles: string[];
  // Puedes agregar más campos según la respuesta real de la API
}   
