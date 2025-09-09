export default interface Cliente {
    id: number;
    name: string;
    email: string;
    celular: string;
    producto_id: number | null; 
    nombre_producto: string;
    created_at: string;
}