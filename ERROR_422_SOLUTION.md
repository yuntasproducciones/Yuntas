# Guía de Solución de Errores - Sistema de Blogs

## Error 422 (Unprocessable Content)

### Problema Identificado
El backend requiere que TODOS los campos sean obligatorios según `StoreBlogRequest.php`, pero el frontend los enviaba como opcionales.

### Campos Requeridos por el Backend:
- `titulo` (string, max 255)
- `link` (string, max 255) 
- `producto_id` (integer, debe existir en tabla productos)
- `parrafo` (string)
- `descripcion` (string)
- `imagen_principal` (imagen: jpeg,jpg,png, max 2MB)
- `titulo_blog` (string) **[OBLIGATORIO]**
- `subtitulo_beneficio` (string) **[OBLIGATORIO]**
- `url_video` (URL válida) **[OBLIGATORIO]**
- `titulo_video` (string) **[OBLIGATORIO]**
- `imagenes` (array) **[OBLIGATORIO]**
- `imagenes.*.imagen` (imagen: jpeg,jpg,png, max 2MB) **[OBLIGATORIO]**
- `imagenes.*.parrafo` (string, max 500, opcional)

### Correcciones Aplicadas:

1. **Actualizado `blogService.ts`**:
   - Cambiado formato de imágenes de `imagenes[0][url_imagen]` a `imagenes[0][imagen]`
   - Todos los campos se envían como obligatorios
   - Validación de campos antes del envío

2. **Actualizado `BlogModal.tsx`**:
   - Todos los campos marcados como requeridos (*)
   - Validación adicional antes del submit
   - Primera imagen adicional marcada como obligatoria

3. **Validaciones Frontend**:
   - Verificar que todos los campos estén completos
   - Al menos una imagen adicional debe estar presente
   - Validación de tipos y tamaños de archivo

### Formato Correcto del FormData:

```javascript
const formData = new FormData();
formData.append('titulo', 'Mi Blog');
formData.append('link', 'mi-blog');
formData.append('producto_id', '1');
formData.append('parrafo', 'Párrafo del blog');
formData.append('descripcion', 'Descripción del blog');
formData.append('imagen_principal', imageFile);
formData.append('titulo_blog', 'Título del blog');
formData.append('subtitulo_beneficio', 'Subtítulo');
formData.append('url_video', 'https://youtube.com/watch?v=...');
formData.append('titulo_video', 'Título del video');
formData.append('imagenes[0][imagen]', imageFile1);
formData.append('imagenes[0][parrafo]', 'Párrafo imagen 1');
```

### Cómo Probar:

1. **Completar TODOS los campos obligatorios**:
   - Título
   - Link (se genera automáticamente)
   - ID del Producto (debe existir en la BD)
   - Párrafo
   - Descripción
   - Imagen Principal
   - Título del Blog
   - Subtítulo
   - URL del Video (debe ser válida)
   - Título del Video
   - Al menos 1 imagen adicional

2. **Verificar tipos de archivo**:
   - Solo JPEG, JPG, PNG
   - Máximo 2MB cada imagen

3. **Verificar que el producto existe**:
   - El `producto_id` debe existir en la tabla `productos`

### Errores Comunes:

| Error | Causa | Solución |
|-------|-------|----------|
| `The titulo field is required` | Campo título vacío | Completar el campo |
| `The producto_id field must be an integer` | ID no numérico | Usar solo números |
| `The producto_id field must exist` | Producto no existe | Verificar ID en BD |
| `The url_video field must be a valid URL` | URL inválida | Usar formato completo |
| `The imagen_principal field is required` | Sin imagen | Seleccionar archivo |
| `The imagenes field is required` | Sin imágenes adicionales | Agregar al menos 1 |

### Notas Adicionales:

- El backend valida estrictamente TODOS los campos
- No se pueden omitir campos "opcionales"
- Las imágenes deben ser archivos válidos, no strings vacíos
- El link debe ser único en la base de datos
