import { config, getApiUrl } from "../../../config";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface BlogPOST {
  producto_id: string;
  titulo: string;
  subtitulo: string;
  link: string;
  meta_titulo: string;
  meta_descripcion: string;
  imagen_principal: File | null;
  alt_imagen_principal: string;
  imagen_card: File | null;
  alt_imagen_card: string;
  imagenes_secundarias: (File | null)[];
  alt_imagenes_secundarias: string[];
  parrafos: string[];
}

interface Blog {
  id: number;
  producto_id: number;
  nombre_producto: string;
  titulo?: string;
  subtitulo: string;
  link?: string;
  meta_titulo?: string;
  meta_descripcion?: string;
  imagen_principal: string;
  imagen_card?: string;
  imagenes?: { ruta_imagen: string; text_alt: string }[];
  parrafos?: { parrafo: string }[];
  alt_imagen_card?: string;
  alt_imagen_principal?: string;
  created_at?: string;
  updated_at?: string;
}

interface Producto {
  id: number;
  nombre: string;
  link: string;
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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);
  const [selectedTextRange, setSelectedTextRange] = useState<{ start: number; end: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [isProductLinkModalOpen, setIsProductLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const defaultFormData: BlogPOST = {
    producto_id: "",
    titulo: "",
    subtitulo: "",
    link: "",
    meta_titulo: "",
    meta_descripcion: "",
    imagen_principal: null,
    alt_imagen_principal: "",
    imagen_card: null,
    alt_imagen_card: "",
    imagenes_secundarias: [null, null, null],
    alt_imagenes_secundarias: ["", "", ""],
    parrafos: ["", "", ""],
  };

  const [formData, setFormData] = useState<BlogPOST>(defaultFormData);

  useEffect(() => {
    if (!isOpen) return;

    if (blogToEdit) {
      setFormData({
        producto_id: blogToEdit.producto_id?.toString() || "",
        titulo: blogToEdit.titulo || "",
        subtitulo: blogToEdit.subtitulo || "",
        link: blogToEdit.link || "",
        meta_titulo: blogToEdit.meta_titulo || "",
        meta_descripcion: blogToEdit.meta_descripcion || "",
        imagen_principal: null,
        alt_imagen_principal: blogToEdit.alt_imagen_principal || "",
        imagen_card: null,
        alt_imagen_card: blogToEdit.alt_imagen_card || "",
        imagenes_secundarias: [null, null, null],
        alt_imagenes_secundarias: [
          blogToEdit.imagenes?.[0]?.text_alt || "",
          blogToEdit.imagenes?.[1]?.text_alt || "",
          blogToEdit.imagenes?.[2]?.text_alt || "",
        ],
        parrafos: [
          blogToEdit.parrafos?.[0]?.parrafo || "",
          blogToEdit.parrafos?.[1]?.parrafo || "",
          blogToEdit.parrafos?.[2]?.parrafo || "",
        ],
      });
    } else {
      setFormData({
        producto_id: "",
        titulo: "",
        subtitulo: "",
        link: "",
        meta_titulo: "",
        meta_descripcion: "",
        imagen_principal: null,
        alt_imagen_principal: "",
        imagen_card: null,
        alt_imagen_card: "",
        imagenes_secundarias: [null, null, null],
        alt_imagenes_secundarias: ["", "", ""],
        parrafos: ["", "", ""],
      });
    }
  }, [isOpen, blogToEdit]);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        
        const res = await fetch(getApiUrl(config.endpoints.productos.list), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Respuesta de productos/select:", data);
        
        if (data.success && Array.isArray(data.data)) {
          setProductos(data.data);
        } else if (Array.isArray(data)) {
          setProductos(data);
        } else {
          console.error("La respuesta no contiene un array de productos:", data);
          setProductos([]);
        }

      } catch (error) {
        console.error("Error al obtener productos:", error);
        setProductos([]);
        alert("❌ Error al cargar los productos. Por favor, intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof BlogPOST
  ) => {
    if (e.target.files?.[0]) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleImagenSecundariaChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updated = [...formData.imagenes_secundarias];
    updated[index] = e.target.files?.[0] || null;
    setFormData({ ...formData, imagenes_secundarias: updated });
  };

  const handleAltImagenSecundariaChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const updated = [...formData.alt_imagenes_secundarias];
    updated[index] = e.target.value;
    setFormData({ ...formData, alt_imagenes_secundarias: updated });
  };

  const handleParrafoChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const updated = [...formData.parrafos];
    updated[index] = e.target.value;
    setFormData({ ...formData, parrafos: updated });
  };

  // ✅ Función para abrir el modal de enlace manual
  const handleInsertLinkClick = (index: number) => {
    const textarea = document.getElementById(`parrafo-${index}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (start === end) {
      Swal.fire(
        "Selecciona texto",
        "Por favor selecciona una palabra o frase antes de insertar el enlace.",
        "warning"
      );
      return;
    }

    const selected = textarea.value.substring(start, end);
    setSelectedParagraphIndex(index);
    setSelectedTextRange({ start, end });
    setSelectedText(selected);
    setIsLinkModalOpen(true);
  };

  // ✅ Función para insertar enlace manual
  const handleInsertManualLink = () => {
    if (selectedParagraphIndex === null || selectedTextRange === null || !linkUrl.trim()) {
      alert("❌ Faltan datos para insertar el enlace");
      return;
    }

    const currentText = formData.parrafos[selectedParagraphIndex];
    const linkedText = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${selectedText}</a>`;

    const newText =
      currentText.slice(0, selectedTextRange.start) +
      linkedText +
      currentText.slice(selectedTextRange.end);

    const updatedParrafos = [...formData.parrafos];
    updatedParrafos[selectedParagraphIndex] = newText;

    setFormData({ ...formData, parrafos: updatedParrafos });
    
    // Limpiar estados
    setSelectedParagraphIndex(null);
    setSelectedTextRange(null);
    setSelectedText("");
    setLinkUrl("");
    setIsLinkModalOpen(false);
  };

  // ✅ Función para abrir selector de producto
  const handleProductLinkClick = (index: number) => {
    const textarea = document.getElementById(`parrafo-${index}`) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);

    if (!selected) {
      Swal.fire(
        "Selecciona texto",
        "Por favor selecciona una palabra o frase para enlazar a un producto.",
        "warning"
      );
      return;
    }

    setSelectedParagraphIndex(index);
    setSelectedTextRange({ start, end });
    setSelectedText(selected);
    setIsProductLinkModalOpen(true);
  };

  // ✅ Función para insertar enlace a producto
  const handleInsertProductLink = (producto: Producto) => {
    if (selectedParagraphIndex === null || selectedTextRange === null) return;

    const currentText = formData.parrafos[selectedParagraphIndex];
    const link = producto.link;
    const linkedText = `<a href="/products/producto/?link=${encodeURIComponent(link)}">${selectedText}</a>`;

    const newText =
      currentText.slice(0, selectedTextRange.start) +
      linkedText +
      currentText.slice(selectedTextRange.end);

    const updatedParrafos = [...formData.parrafos];
    updatedParrafos[selectedParagraphIndex] = newText;

    setFormData({ ...formData, parrafos: updatedParrafos });
    
    // Limpiar estados
    setSelectedParagraphIndex(null);
    setSelectedTextRange(null);
    setSelectedText("");
    setIsProductLinkModalOpen(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Limpiar todos los estados relacionados
    setSelectedParagraphIndex(null);
    setSelectedTextRange(null);
    setSelectedText("");
    setIsLinkModalOpen(false);
    setIsProductLinkModalOpen(false);
    setLinkUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!blogToEdit;

    if (!formData.titulo || !formData.subtitulo) {
      return alert("⚠️ Título y subtítulo son obligatorios.");
    }

    if (!isEdit && !formData.imagen_principal) {
      return alert("⚠️ La imagen principal es obligatoria para crear.");
    }

    if (formData.parrafos.some((p) => !p.trim())) {
      return alert("⚠️ Todos los párrafos deben estar completos.");
    }

    const urlRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (formData.link && !urlRegex.test(formData.link)) {
      return alert(
        "⚠️ El link debe ser URL-friendly (solo minúsculas, guiones y números)."
      );
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      if (isEdit) formDataToSend.append("_method", "PUT");

      // Campos simples
      for (const key in formData) {
        if (
          key === "imagenes_secundarias" ||
          key === "alt_imagenes_secundarias" ||
          key === "parrafos"
        )
          continue;
        const value = (formData as any)[key];
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else {
          formDataToSend.append(key, value ?? "");
        }
      }

      // Imagenes secundarias + ALT
      formData.imagenes_secundarias.forEach((img) => {
        if (img) formDataToSend.append("imagenes[]", img);
      });
      formData.alt_imagenes_secundarias.forEach((alt) => {
        formDataToSend.append("alt_imagenes[]", alt);
      });

      // Párrafos
      formData.parrafos.forEach((p) => formDataToSend.append("parrafos[]", p));

      const endpoint = isEdit
        ? getApiUrl(config.endpoints.blogs.update(blogToEdit.id))
        : getApiUrl(config.endpoints.blogs.create);
      
      console.log("👉 Endpoint blogs:", endpoint);
      
      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("json")
        ? await res.json()
        : await res.text();

      if (res.ok) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white text-black px-8 py-6 rounded-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">
          {blogToEdit ? "Editar Blog" : "Añadir Blog"}
        </h2>
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-y-8 max-w-3xl mx-auto"
        >
          {/* Información Principal & SEO */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              Información Principal & SEO
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Producto */}
              <div className="col-span-4">
                <label className="block mb-2">Selecciona un Producto</label>
                <select
                  name="producto_id"
                  value={formData.producto_id}
                  onChange={handleSelectChange}
                  required
                  className="w-full bg-white text-black p-2 rounded-md"
                  disabled={loading}
                >
                  <option value="">
                    {loading ? "Cargando productos..." : "-- Selecciona un producto --"}
                  </option>
                  {Array.isArray(productos) && productos.length > 0 ? (
                    productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre || `Producto ${producto.id}`}
                      </option>
                    ))
                  ) : (
                    !loading && (
                      <option value="" disabled>
                        No hay productos disponibles
                      </option>
                    )
                  )}
                </select>
                
                {productos.length > 0 && (
                  <p className="text-xs text-green-400 mt-1">
                    ✅ {productos.length} productos cargados
                  </p>
                )}
              </div>

              {/* Título */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {/* Subtítulo */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Subtítulo</label>
                <input
                  name="subtitulo"
                  value={formData.subtitulo}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>

              {/* Meta Título */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Meta Título (SEO)</label>
                <input
                  type="text"
                  name="meta_titulo"
                  value={formData.meta_titulo}
                  onChange={handleInputChange}
                  placeholder="Título optimizado para SEO"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: 50-60 caracteres
                </p>
              </div>

              {/* Meta Descripción */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Meta Descripción (SEO)</label>
                <textarea
                  name="meta_descripcion"
                  value={formData.meta_descripcion}
                  onChange={handleInputChange}
                  placeholder="Descripción optimizada para motores de búsqueda"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: 150-160 caracteres
                </p>
              </div>

              {/* Link */}
              <div className="md:col-span-4">
                <label className="block font-medium mb-1">
                  Link (URL amigable)
                </label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="ejemplo: mi-blog-post"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Imágenes */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Imágenes</h3>

            {/* Imagen Principal + ALT */}
            <div>
              <label className="block font-medium mb-1">Imagen Principal</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "imagen_principal")}
                className="w-full file:py-2 file:px-3 file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
              />
              <input
                type="text"
                name="alt_imagen_principal"
                placeholder="Texto ALT para SEO"
                value={formData.alt_imagen_principal}
                onChange={handleInputChange}
                className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Imagen Card + ALT */}
            <div className="mt-4">
              <label className="block font-medium mb-1">Imagen Card</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "imagen_card")}
                className="w-full file:py-2 file:px-3 file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
              />
              <input
                type="text"
                name="alt_imagen_card"
                placeholder="Texto ALT para SEO"
                value={formData.alt_imagen_card}
                onChange={handleInputChange}
                className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Imágenes Secundarias + ALT */}
            <div className="mt-6 space-y-6">
              <label className="block font-semibold">Imágenes Secundarias</label>
              {formData.imagenes_secundarias.map((_, i) => (
                <div key={i} className="space-y-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImagenSecundariaChange(e, i)}
                    className="w-full file:py-2 file:px-3 file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                  />
                  <input
                    type="text"
                    placeholder={`Texto ALT imagen secundaria #${i + 1}`}
                    value={formData.alt_imagenes_secundarias[i]}
                    onChange={(e) => handleAltImagenSecundariaChange(e, i)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Párrafos */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200 relative">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Párrafos</h3>
            {formData.parrafos.map((p, i) => (
              <div key={i} className="relative mb-6">
                <textarea
                  id={`parrafo-${i}`}
                  value={p}
                  onChange={(e) => handleParrafoChange(e, i)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-20"
                  rows={4}
                  placeholder={`Párrafo ${i + 1}`}
                  required
                />

                {/* Botones para insertar enlaces */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleInsertLinkClick(i)}
                    title="Insertar enlace manual"
                    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProductLinkClick(i)}
                    title="Enlazar a producto"
                    className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition-all duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              {blogToEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>

        {/* Modal para enlace manual */}
        {isLinkModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[60]">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Insertar Enlace</h3>
              <p className="text-sm text-gray-600 mb-2">
                Texto seleccionado: <strong>"{selectedText}"</strong>
              </p>
              <div className="mb-4">
                <label className="block font-medium mb-1">URL del enlace</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://ejemplo.com"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleInsertManualLink}
                  disabled={!linkUrl.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded"
                >
                  Insertar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para enlace a producto */}
        {isProductLinkModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[60]">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Enlazar a Producto</h3>
              <p className="text-sm text-gray-600 mb-4">
                Texto seleccionado: <strong>"{selectedText}"</strong>
              </p>
              <div className="mb-4">
                <label className="block font-medium mb-1">Selecciona un producto</label>
                <select
                  onChange={(e) => {
                    const selectedId = parseInt(e.target.value);
                    const selectedProduct = productos.find(p => p.id === selectedId);
                    if (selectedProduct) {
                      handleInsertProductLink(selectedProduct);
                    }
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">-- Seleccionar producto --</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsProductLinkModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBlogModal;