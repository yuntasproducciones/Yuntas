import { useState } from "react";
import type Producto from "../../models/Product";
import Input from "../Input";

interface ImagenLegacy {
  id: string;
  url_imagen: string;
  texto_alt_SEO: string;
}

interface Props {
  initialData?: Producto;
  onSubmit: (formData: FormData) => Promise<void>;
  isEditing?: boolean;
}

const ProductForm = ({ initialData, onSubmit, isEditing }: Props) => {
  // Estados para imágenes existentes (legacy) - convertir desde la estructura v1
  const [imagenesExistentes, setImagenesExistentes] = useState<ImagenLegacy[]>(
    initialData?.images?.map((url, index) => ({
      id: `img_${index}`,
      url_imagen: url,
      texto_alt_SEO: `Imagen ${index + 1}`
    })) || []
  );
  const [idsAEliminar, setIdsAEliminar] = useState<string[]>([]);

  // Estados para productos relacionados - convertir desde relatedProducts
  const [relacionadoInput, setRelacionadoInput] = useState("");
  const [relacionados, setRelacionados] = useState<string[]>(
    initialData?.relatedProducts?.map(id => String(id)) || []
  );

  // Estados para especificaciones - extraer desde specs
  const [especificaciones, setEspecificaciones] = useState<string[]>(
    (() => {
      if (!initialData?.specs) return [""];
      const specs = Object.entries(initialData.specs)
        .filter(([key]) => key.startsWith('spec_'))
        .map(([, value]) => String(value));
      return specs.length > 0 ? specs : [""];
    })()
  );

  // Estados para beneficios - extraer desde specs
  const [beneficios, setBeneficios] = useState<string[]>(
    (() => {
      if (!initialData?.specs) return [""];
      const benefits = Object.entries(initialData.specs)
        .filter(([key]) => key.startsWith('beneficio_'))
        .map(([, value]) => String(value));
      return benefits.length > 0 ? benefits : [""];
    })()
  );

  // Funciones para manejar productos relacionados
  const handleAddRelacionado = () => {
    if (relacionadoInput.trim()) {
      setRelacionados([...relacionados, relacionadoInput.trim()]);
      setRelacionadoInput("");
    }
  };

  const handleRemoveRelacionado = (id: string) => {
    setRelacionados(relacionados.filter((r) => r !== id));
  };

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

    // Mapear campos del formulario a la estructura de la API v1
    const title = formData.get('titulo_hero') as string;
    const subtitle = formData.get('nombre') as string;
    const tagline = formData.get('seccion') as string;
    const description = formData.get('descripcion_informacion') as string;
    const nombreProducto = formData.get('nombre') as string;
    const stockProducto = parseInt(formData.get('stock') as string);
    const precioProducto = (formData.get('precio') as string).replace('$', ''); // Mantener como string según v1
    const section = formData.get('seccion') as string;
    const link = formData.get('link') as string;

    // Crear el objeto specs combinando especificaciones
    const specs: any = {};
    especificaciones.forEach((esp, index) => {
      if (esp.trim()) {
        specs[`spec_${index + 1}`] = esp.trim();
      }
    });

    // Agregar beneficios al specs también
    beneficios.forEach((ben, index) => {
      if (ben.trim()) {
        specs[`beneficio_${index + 1}`] = ben.trim();
      }
    });

    // Convertir relacionados a números
    const relatedProducts = relacionados
      .filter(rel => rel.trim())
      .map(rel => parseInt(rel.trim()))
      .filter(rel => !isNaN(rel));

    // Preparar datos para la API v1 de manera más simple
    const apiData = {
      title,
      subtitle,
      tagline,
      description,
      specs,
      relatedProducts,
      nombreProducto,
      stockProducto,
      precioProducto,
      section,
      link
    };

    // Crear FormData directamente con los campos individuales
    const finalFormData = new FormData();
    
    // Agregar campos básicos
    finalFormData.append('title', title);
    finalFormData.append('subtitle', subtitle);
    finalFormData.append('tagline', tagline);
    finalFormData.append('description', description);
    finalFormData.append('nombreProducto', nombreProducto);
    finalFormData.append('stockProducto', stockProducto.toString());
    finalFormData.append('precioProducto', precioProducto); // Ya es string
    finalFormData.append('section', section);
    finalFormData.append('link', link);
    
    // Agregar specs como JSON
    finalFormData.append('specs', JSON.stringify(specs));
    
    // Agregar productos relacionados como JSON
    finalFormData.append('relatedProducts', JSON.stringify(relatedProducts));
    
    // Agregar imágenes si existen
    ['imagen_lista_productos', 'imagen_hero', 'imagen_especificaciones', 'imagen_beneficios'].forEach(key => {
      const file = formData.get(key) as File;
      if (file && file.size > 0) {
        finalFormData.append(key, file);
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
          📊 Datos para Dashboard (Gestión Interna)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Producto <span className="text-blue-600 text-sm">(Aparece en tabla)</span>
            </label>
            <input
              name="nombre"
              defaultValue={initialData?.nombreProducto || initialData?.subtitle}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sección/Categoría <span className="text-blue-600 text-sm">(Aparece en tabla)</span>
            </label>
            <select
              name="seccion"
              defaultValue={initialData?.section || initialData?.tagline}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Selecciona una sección</option>
              <option value="Letreros LED">Letreros LED</option>
              <option value="Sillas LED">Sillas LED</option>
              <option value="Pisos LED">Pisos LED</option>
              <option value="Mesas LED">Mesas LED</option>
              <option value="Barras LED">Barras LED</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio <span className="text-blue-600 text-sm">(Aparece en tabla)</span>
            </label>
            <input
              name="precio"
              defaultValue={initialData?.precioProducto ? `$${initialData.precioProducto}` : initialData?.precio}
              placeholder="ej: $500.00"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock <span className="text-blue-600 text-sm">(Control de inventario)</span>
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={initialData?.stockProducto || initialData?.stock}
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link/URL <span className="text-blue-600 text-sm">(ej: letreros-neon-led)</span>
            </label>
            <input
              name="link"
              defaultValue={initialData?.link || (initialData?.title ? initialData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '') : '')}
              placeholder="letreros-neon-led"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
      </div>

      {/* SECCIÓN: DATOS PARA PÁGINA DE PRODUCTO */}
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
          🌐 Datos para Página de Producto (Frontend)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título Hero <span className="text-green-600 text-sm">(Aparece sobre la imagen principal)</span>
            </label>
            <input
              name="titulo_hero"
              defaultValue={initialData?.title || initialData?.titulo_hero}
              placeholder="ej: Letreros Neón LED"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción <span className="text-green-600 text-sm">(Sección "Información")</span>
            </label>
            <textarea
              rows={4}
              name="descripcion_informacion"
              defaultValue={initialData?.description || initialData?.descripcion_informacion}
              placeholder="Describe el producto, sus usos y características principales..."
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
        </div>
      </div>
      {/* SECCIÓN: ESPECIFICACIONES */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center">
          ✅ Especificaciones (Checkmarks en el producto)
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
          🎯 Beneficios (Lista en el producto)
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
          📸 Imágenes del Producto (4 imágenes específicas requeridas)
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
                    src={`https://apiyuntas.yuntaspublicidad.com${img.url_imagen}`}
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
              🏷️ Imagen para Lista de Productos
            </h4>
            <p className="text-sm text-gray-600 mb-3">Esta imagen aparece en la página "Nuestros Productos"</p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_lista_productos"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
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
              🖼️ Imagen Hero del Producto
            </h4>
            <p className="text-sm text-gray-600 mb-3">Imagen de fondo grande en la página individual del producto</p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_hero"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
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
              ✅ Imagen para Especificaciones
            </h4>
            <p className="text-sm text-gray-600 mb-3">Imagen que acompaña la sección de especificaciones</p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_especificaciones"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
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
              🎯 Imagen para Beneficios
            </h4>
            <p className="text-sm text-gray-600 mb-3">Imagen que acompaña la sección de beneficios</p>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                name="imagen_beneficios"
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              <input
                type="text"
                name="alt_imagen_beneficios"
                placeholder="Texto ALT para SEO"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>💡 Importante:</strong> Solo se requieren estas 4 imágenes específicas para cada producto. 
            Cada una tiene un propósito específico en la página web.
          </p>
        </div>
      </div>

      {/* SECCIÓN: PRODUCTOS RELACIONADOS */}
      <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
          🔗 Productos Relacionados
        </h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresa el ID del producto relacionado"
              value={relacionadoInput}
              onChange={(e) => setRelacionadoInput(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddRelacionado}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
            >
              Agregar
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {relacionados.map((id, idx) => (
              <span
                key={idx}
                className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {id}
                <button
                  type="button"
                  onClick={() => handleRemoveRelacionado(id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
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
