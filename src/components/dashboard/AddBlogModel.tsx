import { config, getApiUrl } from "../../../config";
import { useState, useEffect } from "react";

interface BlogPOST {
  producto_id: string;
  subtitulo: string;
  imagen_principal: File | null;
  imagenes: (File | null)[];
  parrafos: string[];
}

interface Blog {
  id: number;
  producto_id: number;   
  nombre_producto: string;
  subtitulo: string;
  imagen_principal: string;
  imagenes?: { ruta_imagen: string; text_alt: string }[];
  parrafos?: { parrafo: string }[];
  created_at?: string;
  updated_at?: string;
}

interface AddBlogModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  blogToEdit?: Blog | null;
  onSuccess?: () => void;
}

const AddBlogModal = ({
  isOpen,
  setIsOpen,
  blogToEdit,
  onSuccess,
}: AddBlogModalProps) => {
  const [formData, setFormData] = useState<BlogPOST>({
    producto_id: "",
    subtitulo: "",
    imagen_principal: null,
    imagenes: [null, null, null],
    parrafos: ["", "", ""],
  });

  useEffect(() => {
    if (isOpen && blogToEdit) {
      setFormData({
        producto_id: blogToEdit.producto_id?.toString() || "", // ✅ usa el ID del producto
        subtitulo: blogToEdit.subtitulo || "",
        imagen_principal: null,
        imagenes: [null, null, null],
        parrafos: [
          blogToEdit.parrafos?.[0]?.parrafo || "",
          blogToEdit.parrafos?.[1]?.parrafo || "",
          blogToEdit.parrafos?.[2]?.parrafo || "",
        ],
      });
    } else if (isOpen && !blogToEdit) {
      // Reset form when opening for adding
      setFormData({
        producto_id: "",
        subtitulo: "",
        imagen_principal: null,
        imagenes: [null, null, null],
        parrafos: ["", "", ""],
      });
    }
  }, [isOpen, blogToEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imagen_principal: e.target.files[0] });
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updated = [...formData.imagenes];
    updated[index] = e.target.files?.[0] || null;
    setFormData({ ...formData, imagenes: updated });
  };

  const handleParrafoChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const updated = [...formData.parrafos];
    updated[index] = e.target.value;
    setFormData({ ...formData, parrafos: updated });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const isEdit = !!blogToEdit;
  const productoIdNumber = Number(formData.producto_id);

  // Validaciones básicas siempre requeridas
  if (!formData.subtitulo || !formData.producto_id || isNaN(productoIdNumber)) {
    alert("⚠️ Subtítulo y ID del producto son obligatorios.");
    return;
  }

  // Validaciones específicas para creación (no edición)
  if (!isEdit) {
    if (!formData.imagen_principal) {
      alert("⚠️ La imagen principal es obligatoria para crear un blog.");
      return;
    }
    
    if (formData.imagenes.some((img) => !img)) {
      alert("⚠️ Todas las imágenes adicionales son obligatorias para crear un blog.");
      return;
    }
  }

  // Validación de párrafos (siempre requerida)
  if (formData.parrafos.some((p) => !p.trim())) {
    alert("⚠️ Todos los párrafos deben tener contenido.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const formDataToSend = new FormData();
    if (isEdit) {
      formDataToSend.append("_method", "PATCH");
    }
    formDataToSend.append("producto_id", productoIdNumber.toString());
    formDataToSend.append("subtitulo", formData.subtitulo);

    // Solo agregar imagen principal si existe (para creación es obligatoria, para edición es opcional)
    if (formData.imagen_principal) {
      formDataToSend.append("imagen_principal", formData.imagen_principal);
    }

    // Solo agregar imágenes que no sean null
    formData.imagenes.forEach((img) => {
      if (img) formDataToSend.append("imagenes[]", img);
    });

    // Siempre agregar párrafos
    formData.parrafos.forEach((text) => {
      formDataToSend.append("parrafos[]", text);
    });

    const endpoint = isEdit
      ? getApiUrl(config.endpoints.blogs.update(blogToEdit.id))
      : getApiUrl(config.endpoints.blogs.create);

    // ⭐ CAMBIO: Usar siempre POST cuando hay _method
      const method = isEdit ? "POST" : "POST";


    const response = await fetch(endpoint, {
      method,
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("json") ? await response.json() : await response.text();

    if (response.ok) {
      alert(`✅ Blog ${isEdit ? "actualizado" : "creado"} correctamente.`);
      closeModal();
      onSuccess?.();
    } else {
      alert(`❌ Error: ${data.message || data}`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error en la solicitud.");
  }
};
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-blue-950 text-white px-10 py-8 rounded-4xl w-3/5 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4">
            {blogToEdit ? "EDITAR BLOG" : "AÑADIR BLOG"}
          </h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="grid grid-cols-2 gap-4 gap-x-12">
            {/* Campos del formulario */}
            <div className="col-span-2">
              <label className="block mb-2">ID del Producto</label>
              <input
                type="text"
                name="producto_id"
                value={formData.producto_id}
                onChange={handleInputChange}
                required
                placeholder="Ingresa el ID del producto (ej: 1, 2, 3...)"
                className="w-full bg-white text-black p-2 rounded-md"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2">Subtítulo</label>
              <input
                type="text"
                name="subtitulo"
                value={formData.subtitulo}
                onChange={handleInputChange}
                required
                placeholder="Ej: Elegancia y Profesionalismo en tu Marca"
                className="w-full bg-white text-black p-2 rounded-md"
              />
            </div>

            <div className="col-span-2">
              <label className="block mb-2">Imagen Principal</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required={!blogToEdit}
                className="w-full bg-white text-black p-2 rounded-md"
              />
              {blogToEdit && (
                <p className="text-yellow-300 text-sm mt-1">
                  Deja vacío si no quieres cambiar la imagen actual
                </p>
              )}
            </div>

            {formData.imagenes.map((img, index) => (
              <div key={index} className="col-span-2">
                <label className="block mb-2">Imagen Adicional {index + 1}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImagenChange(e, index)}
                  required={!blogToEdit}
                  className="w-full bg-white text-black p-2 rounded-md"
                />
              </div>
            ))}

            {formData.parrafos.map((text, index) => (
              <div key={index} className="col-span-2">
                <label className="block mb-2">Párrafo {index + 1}</label>
                <textarea
                  value={text}
                  onChange={(e) => handleParrafoChange(e, index)}
                  required
                  placeholder={`Contenido del párrafo ${index + 1}...`}
                  className="w-full bg-white text-black p-2 rounded-md min-h-[100px]"
                />
              </div>
            ))}

            <div className="flex gap-4 mt-6 col-span-2">
              <button type="submit" className="admin-act-btn">
                {blogToEdit ? "Guardar Cambios" : "Guardar Blog"}
              </button>
              <button type="button" onClick={closeModal} className="cancel-btn">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddBlogModal;
