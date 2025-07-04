# Sistema de Blogs Refactorizado - Yuntas

## 📋 Resumen de Cambios

Se ha refactorizado completamente el sistema de blogs para mejorar la arquitectura, consistencia y funcionalidad. Ahora cuenta con:

- ✅ Servicio HTTP centralizado
- ✅ Hooks personalizados para gestión de estado
- ✅ Componentes CRUD completos
- ✅ Tipado TypeScript mejorado
- ✅ Manejo de errores robusto
- ✅ Dashboard administrativo funcional

## 🏗️ Arquitectura Nueva

### Servicios
- `services/httpService.ts`: Servicio HTTP centralizado con métodos autenticados
- `services/blogService.ts`: Servicio específico para operaciones de blogs

### Hooks
- `hooks/useBlogs.ts`: Hook para obtener lista de blogs
- `hooks/useBlogData.ts`: Hook para obtener un blog específico
- `hooks/useBlogActions.ts`: Hook para operaciones CRUD (crear, actualizar, eliminar)

### Componentes
- `components/dashboard/BlogList.tsx`: Lista de blogs con tabla administrativa
- `components/dashboard/BlogModal.tsx`: Modal para crear/editar blogs
- `components/dashboard/BlogDashboard.tsx`: Wrapper para el dashboard

### Modelos
- `models/Blog.ts`: Interfaces TypeScript actualizadas

## 🚀 Funcionalidades Implementadas

### 1. Gestión de Blogs (CRUD)
- **Crear**: Formulario completo con validaciones
- **Leer**: Lista paginada con búsqueda
- **Actualizar**: Edición en modal
- **Eliminar**: Con confirmación

### 2. Dashboard Administrativo
- Acceso en: `/dashboard/blogs`
- Tabla con información de blogs
- Búsqueda en tiempo real
- Botones de acción (Editar, Eliminar, Ver)

### 3. Páginas Públicas
- `/blog`: Lista de todos los blogs
- `/blogs/[id]`: Vista individual del blog

## 🔧 Uso del Sistema

### Para Administradores

1. **Acceder al Dashboard**:
   ```
   http://localhost:3000/dashboard/blogs
   ```

2. **Crear un Blog**:
   - Hacer clic en "Crear Nuevo Blog"
   - Completar formulario obligatorio:
     - Título
     - Link (se genera automáticamente)
     - ID del Producto
     - Párrafo
     - Descripción
     - Imagen Principal
   - Campos opcionales:
     - Título del Blog
     - Subtítulo
     - URL del Video
     - Título del Video
     - Imágenes adicionales (hasta 2)

3. **Editar un Blog**:
   - Hacer clic en "Editar" en la tabla
   - Modificar campos necesarios
   - Guardar cambios

4. **Eliminar un Blog**:
   - Hacer clic en "Eliminar" en la tabla
   - Confirmar acción

### Para Desarrolladores

1. **Usar el Hook useBlogs**:
   ```typescript
   import { useBlogs } from '../hooks/useBlogs';
   
   const { blogs, loading, error, refetch } = useBlogs();
   ```

2. **Usar el Hook useBlogActions**:
   ```typescript
   import { useBlogActions } from '../hooks/useBlogActions';
   
   const { createBlog, updateBlog, deleteBlog, loading, error } = useBlogActions();
   ```

3. **Usar el Servicio de Blogs**:
   ```typescript
   import { blogService } from '../services/blogService';
   
   // Obtener todos los blogs
   const response = await blogService.getAllBlogs();
   
   // Crear un blog
   const newBlog = await blogService.createBlog(formData);
   ```

## 📊 Estructura de Datos

### Blog Interface
```typescript
interface Blog {
  id: number;
  titulo: string;
  link: string;
  producto_id: number;
  parrafo: string;
  descripcion: string;
  imagenPrincipal: string;
  tituloBlog?: string;
  subTituloBlog?: string;
  imagenesBlog: Array<{
    url: string;
    parrafo: string;
  }>;
  video_id?: string;
  videoBlog?: string;
  tituloVideoBlog?: string;
  created_at: string;
}
```

### BlogFormData Interface
```typescript
interface BlogFormData {
  titulo: string;
  link: string;
  producto_id: string;
  parrafo: string;
  descripcion: string;
  imagen_principal: File | null;
  titulo_blog?: string;
  subtitulo_beneficio?: string;
  url_video?: string;
  titulo_video?: string;
  imagenes?: Array<{
    url_imagen: File | null;
    parrafo_imagen: string;
  }>;
}
```

## 🔗 Endpoints de la API

### Públicos
- `GET /api/blogs` - Obtener todos los blogs
- `GET /api/blogs/{id}` - Obtener blog por ID
- `GET /api/blogs/link/{link}` - Obtener blog por link

### Autenticados
- `POST /api/blogs` - Crear blog
- `PUT /api/blog/{id}` - Actualizar blog
- `DELETE /api/blogs/{id}` - Eliminar blog

## 🛠️ Configuración

### Variables de Entorno
```typescript
// config.ts
export const config = {
  apiUrl: "https://apiyuntas.yuntaspublicidad.com",
  endpoints: {
    blogs: {
      list: "/api/blogs",
      detail: (id: number | string) => `/api/blogs/${id}`,
      create: "/api/blogs",
      update: (id: number | string) => `/api/blogs/${id}`,
      delete: (id: number | string) => `/api/blogs/${id}`,
    },
  },
};
```

### Autenticación
El sistema usa tokens Bearer para autenticación. El token se obtiene del localStorage con la clave `auth_token`.

## 🚦 Estados de Carga

Todos los hooks y componentes manejan estados de:
- `loading`: Indica si hay una operación en progreso
- `error`: Contiene mensajes de error si ocurre algún problema
- `success`: Indica operaciones exitosas

## 📝 Validaciones

### Campos Obligatorios
- Título
- Link
- ID del Producto
- Párrafo
- Descripción
- Imagen Principal (solo al crear)

### Validaciones de Archivos
- Tipos permitidos: JPEG, PNG, JPG
- Tamaño máximo: 10MB

## 🔄 Flujo de Datos

1. **Carga Inicial**: `useBlogs` obtiene todos los blogs
2. **Crear Blog**: `useBlogActions.createBlog` → `refetch` para actualizar lista
3. **Editar Blog**: `useBlogActions.updateBlog` → `refetch` para actualizar lista
4. **Eliminar Blog**: `useBlogActions.deleteBlog` → `refetch` para actualizar lista

## 🎯 Próximos Pasos

1. **Autenticación**: Implementar login/logout completo
2. **Permisos**: Validar permisos por rol
3. **Paginación**: Implementar paginación en la lista
4. **Filtros**: Añadir filtros avanzados
5. **Notificaciones**: Sistema de notificaciones toast
6. **Optimizaciones**: Lazy loading de imágenes
7. **Testing**: Pruebas unitarias y de integración

## 🐛 Solución de Problemas

### Error: "Cannot read properties of undefined"
- Verificar que el token de autenticación esté presente
- Comprobar que la API esté disponible

### Error: "Network Error"
- Verificar conexión a internet
- Comprobar URL de la API en config.ts

### Error: "Validation Error"
- Revisar que todos los campos obligatorios estén completos
- Verificar formato de archivos de imagen

## 📞 Soporte

Para dudas o problemas, revisar:
1. Console del navegador para errores
2. Network tab para problemas de API
3. Verificar permisos y autenticación
