# Solución del problema de visualización de productos

## 🔍 Problema identificado

Los productos no se visualizaban en la página pública `/products` a pesar de estar disponibles en el dashboard admin y funcionar correctamente en Postman.

## 🔬 Diagnóstico

### Síntomas
-  Dashboard admin mostraba productos correctamente
-  API respondía correctamente en Postman
- ❌ Página pública `/products` no mostraba productos
- ❌ Componente `FetchProductsList` no obtenía datos

### Causa raíz: Problema de CORS

El problema estaba en que la API externa no tenía configurados los headers CORS (Cross-Origin Resource Sharing) correctamente. Esto causaba que:

1. **Postman funcionara**: Las herramientas de desarrollo no aplican restricciones CORS
2. **Dashboard admin funcionara**: Posiblemente usaba una configuración diferente o autenticación
3. **Página pública fallara**: El navegador bloqueaba las peticiones cross-origin desde `localhost:4322` a `https://apiyuntas.yuntaspublicidad.com`

### Evidencia del problema
- Headers CORS ausentes en la respuesta de la API:
  ```
  // Headers presentes:
  Transfer-Encoding: chunked
  Content-Type: application/json
  
  // Headers CORS ausentes:
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```

## 🛠️ Solución implementada

### 1. Proxy Server-Side con Astro

Se creó un endpoint API local que actúa como proxy entre el frontend y la API externa:

**Archivo:** `src/pages/api/productos.ts`

```typescript
export async function GET() {
  try {
    const response = await fetch("https://apiyuntas.yuntaspublicidad.com/api/v1/productos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });

  } catch (error) {
    console.error("Error en el servidor:", error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      message: "Error al obtener productos",
      error: error instanceof Error ? error.message : "Error desconocido"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
```

### 2. Actualización del Frontend

Se modificó el componente `FetchProductsList` para usar el endpoint local:

**Archivo:** `src/components/products/FetchProductsList.tsx`

```typescript
// Antes (con problema CORS):
const response = await fetch(getApiUrl(config.endpoints.productos.list), {
  // ...
});

// Después (usando proxy local):
const response = await fetch("/api/productos", {
  // ...
});
```

### 3. Mejoras en el manejo de errores

Se agregaron validaciones para casos donde los productos no tienen imagen:

**Archivo:** `src/components/products/ProductCard.jsx`

```jsx
{imagenUrl ? (
    <img
        className="w-full h-full object-cover"
        src={`https://apiyuntas.yuntaspublicidad.com${imagenUrl.startsWith('/') ? '' : '/'}${imagenUrl}`}
        alt={imagenAlt}
    />
) : (
    <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
        <p className="text-white text-xl font-bold">Sin imagen</p>
    </div>
)}
```

##  Resultado

### Funcionamiento actual
-  Página pública `/products` muestra todos los productos
-  Se obtienen 9 productos correctamente
-  Las imágenes se muestran correctamente o muestran placeholder
-  Los títulos se muestran correctamente
-  Los enlaces funcionan correctamente

### Flujo de datos
1. Usuario visita `/products`
2. Componente `FetchProductsList` hace petición a `/api/productos`
3. Endpoint local `/api/productos` hace petición a API externa
4. API externa responde con datos
5. Endpoint local agrega headers CORS y devuelve datos
6. Frontend recibe datos y renderiza productos

## 🚀 Cómo probar

### Probar la página pública
```bash
# Iniciar servidor de desarrollo
npm run dev

# Visitar en el navegador
http://localhost:4322/products
```

### Probar el endpoint API local
```bash
# PowerShell
Invoke-RestMethod -Uri "http://localhost:4322/api/productos" -Method GET

# Debería devolver:
# success: True
# message: "Productos obtenidos exitosamente"
# data: [array con 9 productos]
```

### Probar la API externa directamente
```bash
# PowerShell
Invoke-RestMethod -Uri "https://apiyuntas.yuntaspublicidad.com/api/v1/productos" -Method GET

# Funciona desde servidor pero no desde navegador por CORS
```

## 🔧 Solución alternativa (recomendada para producción)

Para una solución más robusta, se recomienda configurar CORS en el backend Laravel:

### Opción 1: Middleware CORS en Laravel
```php
// En bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(\Fruitcake\Cors\HandleCors::class);
});
```

### Opción 2: Headers manuales en controladores
```php
// En el controller
public function index()
{
    $productos = // ... obtener productos
    
    return response()->json([
        'success' => true,
        'message' => 'Productos obtenidos exitosamente',
        'data' => $productos
    ])->header('Access-Control-Allow-Origin', '*')
      ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}
```

## 📝 Archivos modificados

- `src/pages/api/productos.ts` (nuevo)
- `src/components/products/FetchProductsList.tsx`
- `src/components/products/ProductCard.jsx`

##  Próximos pasos

1.  Problema resuelto y productos visualizándose
2. 🔄 Considerar implementar cache en el endpoint proxy
3. 🔄 Implementar CORS en el backend Laravel para solución definitiva
4. 🔄 Agregar manejo de errores más robusto
5. 🔄 Implementar loading states mejorados
