import { useEffect, useState } from "react";
import type Producto from "../../models/Product";
import Input from "../Input";
import Swal from "sweetalert2";
import type { Product } from "../../models/Product";

interface ImagenLegacy {
  id: string;
  url_imagen: string;
  texto_alt_SEO: string;
}

interface Props {
  initialData?: Product;
  onSubmit: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
}

  // Validación de peso de imagen (máx. 2MB)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "¡Imagen muy grande!",
        text: "Máx. 2 MB.",
      });
      e.target.value = "";
    }
  };

const ProductForm = ({ initialData, onSubmit, isEditing }: Props) => {
  useEffect(() => {
    if (initialData) {
      console.log("Inicializando especificaciones y beneficios desde specs:", initialData.especificaciones);

      const specs = initialData.especificaciones
        ? Object.entries(initialData.especificaciones)
          .filter(([key]) => key.startsWith("spec_"))
          .map(([, value]) => String(value).trim())
        : [];

      setEspecificaciones(specs.length > 0 ? specs : [""]);

      const benefits = initialData.especificaciones
        ? Object.entries(initialData.especificaciones)
          .filter(([key]) => key.startsWith("beneficio_"))
          .map(([, value]) => String(value).trim())
        : [];

      setBeneficios(benefits.length > 0 ? benefits : [""]);
    };

  }, [initialData]);

  // Estados para imágenes existentes (legacy) - convertir desde la estructura v1
  const [imagenesExistentes, setImagenesExistentes] = useState(
    initialData?.imagenes || []
  );
  const [idsAEliminar, setIdsAEliminar] = useState<string[]>([]);

  // Estados para especificaciones - extraer desde specs
  const [especificaciones, setEspecificaciones] = useState<string[]>(
    (() => {
      if (!initialData?.especificaciones) return [""];
      const specs = Object.entries(initialData.especificaciones)
        .filter(([key]) => key.startsWith('spec_'))
        .map(([, value]) => String(value));
      return specs.length > 0 ? specs : [""];
    })()
  );

  // Estados para beneficios - extraer desde specs
  const [beneficios, setBeneficios] = useState<string[]>(
    (() => {
      if (!initialData?.especificaciones) return [""];
      const benefits = Object.entries(initialData.especificaciones)
        .filter(([key]) => key.startsWith('beneficio_'))
        .map(([, value]) => String(value));
      return benefits.length > 0 ? benefits : [""];
    })()
  );

  // Funciones para manejar imágenes existentes
  const deleteExistImage = (id: string) => {
    setImagenesExistentes(imagenesExistentes.filter((img) => img.id !== id));
    setIdsAEliminar([...idsAEliminar, id]);
  };

  // Funciones para manejar especificaciones
  const handleEspecificacionChange = (index: number, value: string) => {
    const updated = [...especificaciones];
    updated[index] = value;
    setEspecificaciones(updated);
  };

  const addEspecificacion = () => {
    const last = especificaciones[especificaciones.length - 1];
    if (last.trim()) {
      setEspecificaciones([...especificaciones, ""]);
    }
  };

  const removeEspecificacion = (index: number) => {
    if (especificaciones.length > 1) {
      setEspecificaciones(especificaciones.filter((_, i) => i !== index));
    }
  };

  // Funciones para manejar beneficios (igual que especificaciones)
  const handleBeneficioChange = (index: number, value: string) => {
    const updated = [...beneficios];
    updated[index] = value;
    setBeneficios(updated);
  };

  const addBeneficio = () => {
    const last = beneficios[beneficios.length - 1];
    if (last.trim()) {
      setBeneficios([...beneficios, ""]);
    }
  };

  const removeBeneficio = (index: number) => {
    if (beneficios.length > 1) {
      setBeneficios(beneficios.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Crear FormData con los campos exactos que espera el backend
    const finalFormData = new FormData();

    // CAMPOS REQUERIDOS por StoreProductoRequest
    finalFormData.append('nombre', formData.get('nombre') as string);
    finalFormData.append('link', formData.get('link') as string);
    finalFormData.append('titulo', formData.get('titulo_hero') as string);
    finalFormData.append('stock', formData.get('stock') as string);

    // Limpiar el precio (quitar el símbolo $)
    const precioValue = (formData.get('precio') as string).replace('$', '').trim();
    finalFormData.append('precio', precioValue);

    // CAMPOS OPCIONALES
    finalFormData.append('subtitulo', formData.get('nombre') as string); // Usar nombre como subtítulo
    finalFormData.append('descripcion', formData.get('descripcion_informacion') as string);
    finalFormData.append('seccion', formData.get('seccion') as string);

    // IMAGEN PRINCIPAL (para catálogo/lista) - Solo si se subió una nueva
    const imagenListaProductos = formData.get('imagen_lista_productos') as File;
    if (imagenListaProductos && imagenListaProductos.size > 0) {
      finalFormData.append('imagen_principal', imagenListaProductos);
    }

    // ESPECIFICACIONES como array asociativo
    const especificacionesObj: any = {};
    especificaciones.forEach((esp, index) => {
      if (esp.trim()) {
        especificacionesObj[`spec_${index + 1}`] = esp.trim();
      }
    });

    // Agregar beneficios a especificaciones
    beneficios.forEach((ben, index) => {
      if (ben.trim()) {
        especificacionesObj[`beneficio_${index + 1}`] = ben.trim();
      }
    });

    // Solo agregar especificaciones si hay alguna
    if (Object.keys(especificacionesObj).length > 0) {
      Object.entries(especificacionesObj).forEach(([key, value]) => {
        finalFormData.append(`especificaciones[${key}]`, value as string);
      });
    }

    // IMÁGENES ADICIONALES - Orden específico y solo las que se modificaron
    const tiposImagenes = [
      { key: 'imagen_hero', file: formData.get('imagen_hero') as File, index: 0 },
      { key: 'imagen_especificaciones', file: formData.get('imagen_especificaciones') as File, index: 1 },
      { key: 'imagen_beneficios', file: formData.get('imagen_beneficios') as File, index: 2 },
      { key: 'imagen_popups', file: formData.get('imagen_popups') as File, index: 3 }
    ];

    console.log('=== DEBUGGING IMÁGENES FRONTEND ===');
    let imagenesEnviadas = 0;
    tiposImagenes.forEach((imagen) => {
      console.log(`Revisando imagen ${imagen.index} (${imagen.key}):`, {
        hasFile: imagen.file instanceof File,
        fileName: imagen.file?.name || 'N/A',
        fileSize: imagen.file?.size || 0,
        fileType: imagen.file?.type || 'N/A'
      });

      if (imagen.file && imagen.file instanceof File && imagen.file.size > 0) {
        console.log(`✅ Agregando imagen ${imagen.index}:`, imagen.key, imagen.file.name, `(${imagen.file.size} bytes)`);
        // Usar el índice original para mantener el orden correcto
        finalFormData.append(`imagenes[${imagen.index}]`, imagen.file);
        // También enviar el tipo de imagen para que el backend sepa qué es
        finalFormData.append(`imagen_tipos[${imagen.index}]`, imagen.key);
        imagenesEnviadas++;
      } else {
        console.log(`❌ Imagen ${imagen.index} (${imagen.key}) no tiene archivo válido o está vacía`);
      }
    });

    console.log(`Total de imágenes enviadas: ${imagenesEnviadas}`);

    // Agregar información sobre imágenes a eliminar (para futuras mejoras)
    if (idsAEliminar.length > 0) {
      idsAEliminar.forEach((id, index) => {
        finalFormData.append(`imagenes_eliminar[${index}]`, id);
      });
    }

    // etiqueta
    const metaTitulo = formData.get('meta_título') as string;
    const metaDescripcion = formData.get('meta_descripcion') as string;
    if (metaTitulo.trim() || metaDescripcion.trim()) {
      finalFormData.append('etiqueta[meta_titulo]', metaTitulo.trim());
      finalFormData.append('etiqueta[meta_descripcion]', metaDescripcion.trim());
    }

    // Log para debugging
    console.log('=== DATOS ENVIADOS AL BACKEND ===');
    finalFormData.forEach((value, key) => {
      if (value instanceof File) {
        console.log(`Campo: ${key}, Archivo: ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`Campo: ${key}, Valor: ${value}`);
      }
    });

    if (isEditing) {
      finalFormData.append("_method", "PUT");
    }

    await onSubmit(finalFormData);
  };

  return (
    <form
      id="product-form"
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto p-6"
    >
      {/* SECCIÓN: DATOS PARA DASHBOARD */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
          Datos para Dashboard (Gestión Interna)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto <span className="text-blue-600 text-sm">(Aparece en tabla)</span>
            </label>
            <input
              name="nombre"
              defaultValue={initialData?.nombre || initialData?.titulo}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <small className="text-gray-500 block mt-1">Máx. 255 caracteres (letras, números y espacios).</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sección/Categoría <span className="text-blue-600 text-sm">(Aparece en tabla)</span>
            </label>
            <input
              name="seccion"
              defaultValue={initialData?.seccion}
              placeholder="ej: Letreros LED, Sillas LED, Pisos LED, etc."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <small className="text-gray-500 block mt-1">Máx. 255 caracteres (letras, números y espacios).</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio <span className="text-blue-600 text-sm">(Aparece en tabla)</span>
            </label>
            <input
              name="precio"
              defaultValue={initialData?.precio ? `$${initialData.precio}` : initialData?.precio}
              placeholder="ej: $500.00"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <small className="text-gray-500 block mt-1">Coloca el precio en números (máx. 100 000).</small>
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock <span className="text-blue-600 text-sm">(Control de inventario)</span>
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={initialData?.stock || 0}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>  */}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link/URL <span className="text-blue-600 text-sm">(ej: letreros-neon-led)</span>
            </label>
            <input
              name="link"
              defaultValue={initialData?.link || (initialData?.titulo ? initialData.titulo.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') : '')}
              placeholder="letreros-neon-led"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <small className="text-gray-500 block mt-1">Solo minúsculas y guiones. Hasta 255 letras, números o espacios.</small>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Título <span className="text-blue-600 text-sm">(SEO)</span>
            </label>
            <input
              name="meta_título"
              defaultValue={initialData?.etiqueta?.meta_titulo || ""}
              placeholder="Título para SEO del producto"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <small className="text-gray-500 block mt-1">Máx. 70 caracteres (letras, números y espacios).</small>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Descripción <span className="text-blue-600 text-sm">(SEO)</span>
            </label>
            <textarea
              name="meta_descripcion"
              defaultValue={initialData?.etiqueta?.meta_descripcion || ""}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Descripción breve del producto para SEO..."
            />
            <small className="text-gray-500 block mt-1">Máx. 160 caracteres (letras, números y espacios).</small>
          </div>
        </div>
      </div>

      {/* SECCIÓN: DATOS PARA PÁGINA DE PRODUCTO */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
          Datos para Página de Producto (Frontend)
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título Hero <span className="text-green-600 text-sm">(Aparece sobre la imagen principal)</span>
            </label>
            <input
              name="titulo_hero"
              defaultValue={initialData?.titulo}
              placeholder="ej: Letreros Neón LED"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
            <small className="text-gray-500 block mt-1">Máx. 255 caracteres (letras, números y espacios).</small>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-green-600 text-sm">(Sección "Información")</span>
            </label>
            <textarea
              rows={4}
              name="descripcion_informacion"
              defaultValue={initialData?.descripcion}
              placeholder="Describe el producto, sus usos y características principales..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
            <small className="text-gray-500 block mt-1">Descripción detallada. 300-600 palabras.</small>
          </div>
        </div>
      </div>
      {/* SECCIÓN: ESPECIFICACIONES */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          Especificaciones (Checkmarks en el producto)
        </h3>

        <div className="space-y-3">
          {especificaciones.map((esp, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={esp}
                onChange={(e) => handleEspecificacionChange(index, e.target.value)}
                placeholder="ej: Materiales duraderos"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
              {especificaciones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEspecificacion(index)}
                  className="text-red-500 hover:text-red-700 px-2 py-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addEspecificacion}
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            + Agregar especificación
          </button>
        </div>
      </div>

      {/* SECCIÓN: BENEFICIOS */}
      <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
          Beneficios (Lista en el producto)
        </h3>

        <div className="space-y-3">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={beneficio}
                onChange={(e) => handleBeneficioChange(index, e.target.value)}
                placeholder="ej: Iluminación con colores vibrantes"
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
              {beneficios.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBeneficio(index)}
                  className="text-red-500 hover:text-red-700 px-2 py-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addBeneficio}
            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
          >
            + Agregar beneficio
          </button>
        </div>
      </div>

      {/* SECCIÓN: IMÁGENES */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          Imágenes del Producto (4 imágenes específicas requeridas)
        </h3>

        {/* Imágenes existentes */}
        {imagenesExistentes.length > 0 && (
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-3">Imágenes actuales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imagenesExistentes.map((img) => (
                <div
                  key={img.id}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition"
                >
                  <img
                    src={`${img.url_imagen}`}
                    alt={img.texto_alt_SEO}
                    className="w-32 h-32 object-cover rounded-lg mb-2"
                  />
                  <span className="text-center text-gray-700 text-sm mb-2">
                    {img.texto_alt_SEO}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteExistImage(img.id)}
                    className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full hover:bg-red-200 transition"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Imágenes específicas requeridas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagen para lista de productos */}
          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <h4 className="text-md font-semibold text-blue-700 mb-3">
              Imagen para Lista de Productos <span className="text-red-500">*</span>
            </h4>
            <p className="text-sm text-gray-600 mb-3">Esta imagen aparece en la página "Nuestros Productos" y es <strong>obligatoria</strong></p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_lista_productos"
                required={!isEditing}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={handleImageFileChange}
              />
              <small className="text-gray-500 block mt-1">Cada imagen debe pesar menos de 2 MB.</small>
              <input
                type="text"
                name="alt_imagen_lista"
                placeholder="Texto ALT para SEO"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Imagen Hero */}
          <div className="bg-white p-4 rounded-lg border border-green-200">
            <h4 className="text-md font-semibold text-green-700 mb-3">
              🎯 Imagen Hero del Producto <span className="text-sm text-gray-500">(Banner Principal)</span>
            </h4>
            <p className="text-sm text-gray-600 mb-3">Imagen de fondo grande en la página individual del producto - <strong>Banner superior principal</strong></p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_hero"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                onChange={handleImageFileChange}
              />
              <small className="text-gray-500 block mt-1">Cada imagen debe pesar menos de 2 MB.</small>
              <input
                type="text"
                name="alt_imagen_hero"
                placeholder="Texto ALT para SEO"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Imagen de Especificaciones */}
          <div className="bg-white p-4 rounded-lg border border-purple-200">
            <h4 className="text-md font-semibold text-purple-700 mb-3">
              📋 Imagen para Especificaciones <span className="text-sm text-gray-500">(Sección Izquierda)</span>
            </h4>
            <p className="text-sm text-gray-600 mb-3">Imagen que acompaña la sección de especificaciones - <strong>Lado izquierdo de la página</strong></p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_especificaciones"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                onChange={handleImageFileChange}
              />
              <small className="text-gray-500 block mt-1">Cada imagen debe pesar menos de 2 MB.</small>
              <input
                type="text"
                name="alt_imagen_especificaciones"
                placeholder="Texto ALT para SEO"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Imagen de Beneficios */}
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h4 className="text-md font-semibold text-orange-700 mb-3">
              🎁 Imagen para Beneficios <span className="text-sm text-gray-500">(Sección Derecha)</span>
            </h4>
            <p className="text-sm text-gray-600 mb-3">Imagen que acompaña la sección de beneficios - <strong>Lado derecho de la página</strong></p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_beneficios"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                onChange={handleImageFileChange}
              />
              <small className="text-gray-500 block mt-1">Cada imagen debe pesar menos de 2 MB.</small>
              <input
                type="text"
                name="alt_imagen_beneficios"
                placeholder="Texto ALT para SEO"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
            {/* Imagen de Popups*/}
            <div className="bg-white p-4 rounded-lg border border-yellow-200">
              <h4 className="text-md font-semibold text-yellow-700 mb-3">
                💬 Imagen para Popups
              </h4>
              <p className="text-sm text-gray-600 mb-3">Imagen que acompaña los popups de registro clientes</p>
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  name="imagen_popups"
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                  onChange={handleImageFileChange}
                />
                <small className="text-gray-500 block mt-1">Cada imagen debe pesar menos de 2 MB.</small>
                <input
                  type="text"
                  name="alt_imagen_popups"
                  placeholder="Texto ALT para SEO"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Estructura CORRECTA de imágenes:</strong><br />
              📸 <strong>Lista Productos:</strong> Imagen para vista de catálogo (imagen_principal)<br />
              🎯 <strong>Hero:</strong> Banner principal superior (images[0])<br />
              📋 <strong>Especificaciones:</strong> Acompaña características (images[1])<br />
              🎁 <strong>Beneficios:</strong> Acompaña ventajas (images[2])<br />
              💬 <strong>Popups:</strong> Acompaña popups registro (images[3]) 
            </p>
          </div>
          </div>
      </div>
      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        {/*<button
          type="button"
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Cancelar
        </button>*/}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          {isEditing ? 'Actualizar' : 'Crear'} Producto
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
