# Configuración del Sistema de Blogs - Yuntas

## Variables de Entorno

### Desarrollo
```bash
# .env.development
PUBLIC_API_URL=http://localhost:8000
PUBLIC_ENVIRONMENT=development
PUBLIC_DEBUG=true
```

### Producción
```bash
# .env.production
PUBLIC_API_URL=https://apiyuntas.yuntaspublicidad.com
PUBLIC_ENVIRONMENT=production
PUBLIC_DEBUG=false
```

## Configuración de la API

### Endpoints Base
- **Base URL**: `https://apiyuntas.yuntaspublicidad.com`
- **Blogs**: `/api/blogs`
- **Autenticación**: `/api/v1/auth`

### Headers Requeridos
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {token}' // Solo para endpoints autenticados
}
```

## Configuración de Archivos

### Límites de Archivos
- **Tamaño máximo**: 10MB
- **Tipos permitidos**: JPEG, PNG, JPG, WEBP
- **Resolución recomendada**: 1920x1080 máximo

### Estructura de FormData
```javascript
const formData = new FormData();
formData.append('titulo', 'Título del blog');
formData.append('link', 'titulo-del-blog');
formData.append('producto_id', '1');
formData.append('parrafo', 'Párrafo del blog');
formData.append('descripcion', 'Descripción del blog');
formData.append('imagen_principal', imageFile);
formData.append('imagenes[0][url_imagen]', imageFile1);
formData.append('imagenes[0][parrafo_imagen]', 'Párrafo de la imagen 1');
```

## Configuración de Seguridad

### Autenticación
- **Tipo**: Bearer Token
- **Almacenamiento**: localStorage
- **Clave**: `auth_token`

### Permisos Requeridos
- **Crear blogs**: `crear-blogs`
- **Editar blogs**: `editar-blogs`
- **Eliminar blogs**: `eliminar-blogs`

## Configuración de Tailwind CSS

### Clases Personalizadas
```css
/* Agregadas en blog-system.css */
.line-clamp-2 { /* Truncar a 2 líneas */ }
.line-clamp-3 { /* Truncar a 3 líneas */ }
.blog-card { /* Estilos para cards de blog */ }
.action-btn { /* Estilos para botones de acción */ }
```

## Configuración de TypeScript

### Tipos Requeridos
```typescript
// tsconfig.json debe incluir:
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

## Configuración de Rutas

### Estructura de Rutas
```
/blog                    # Lista de blogs públicos
/blogs/[id]             # Blog individual
/dashboard/blogs        # Dashboard administrativo
```

### Configuración de Astro
```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    react(),
    tailwind()
  ],
  output: 'static',
  adapter: node({
    mode: 'standalone'
  })
});
```

## Configuración de Desarrollo

### Scripts de Package.json
```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

### Dependencias Requeridas
```json
{
  "dependencies": {
    "astro": "^latest",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@astrojs/react": "^latest",
    "@astrojs/tailwind": "^latest",
    "tailwindcss": "^latest"
  }
}
```

## Configuración de Producción

### Build Process
1. `npm run build` - Genera archivos estáticos
2. Deploy a servidor web
3. Configurar proxy reverso si es necesario

### Optimizaciones
- **Imágenes**: Compresión automática
- **CSS**: Minificación
- **JavaScript**: Tree shaking
- **Lazy Loading**: Para imágenes grandes

## Configuración de Monitoreo

### Logging
```javascript
// En desarrollo
console.log('[BlogService] Creando blog:', data);

// En producción
// Usar servicio de logging externo
```

### Métricas
- Tiempo de respuesta de API
- Errores de validación
- Uso de almacenamiento
- Rendimiento de carga

## Configuración de Testing

### Jest Configuration
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### Testing Library
```javascript
// src/setupTests.ts
import '@testing-library/jest-dom';
```

## Configuración de CI/CD

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy
```
