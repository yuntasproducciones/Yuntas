import { config, getApiUrl } from "../../../config";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

interface BlogPOST {
  producto_id: string;
  subtitulo: string;
  link: string;
  meta_titulo?: string;
  meta_descripcion?: string;
  imagen_principal: File | null;
  text_alt_principal: string;
  alt_imagen_card: string;
  imagenes_secundarias: (File | null)[];
  alt_imagenes_secundarias: string[];
  parrafos: string[];
  url_video: string;
}

interface Blog {
  id: number;
  producto_id: number;
  nombre_producto: string;
  subtitulo: string;
  link?: string;
  etiqueta?: { meta_titulo: string; meta_descripcion: string };
  imagen_principal: string;
  imagenes?: { ruta_imagen: string; text_alt: string }[];
  parrafos?: { parrafo: string }[];
  alt_imagen_card?: string;
  text_alt_principal?: string;
  url_video: string;
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
  const [nombreProducto, setNombreProducto] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedParagraphIndex, setSelectedParagraphIndex] = useState<number | null>(null);
  const [selectedTextRange, setSelectedTextRange] = useState<{ start: number; end: number } | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const [isProductLinkModalOpen, setIsProductLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const defaultFormData: BlogPOST = {
    producto_id: "",
    subtitulo: "",
    link: "",
    meta_titulo: "",
    meta_descripcion: "",
    imagen_principal: null,
    text_alt_principal: "",
    alt_imagen_card: "",
    imagenes_secundarias: [null, null, null],
    alt_imagenes_secundarias: ["", "", ""],
    parrafos: ["", "", ""],
    url_video: ""
  };

  const [formData, setFormData] = useState<BlogPOST>(defaultFormData);

  useEffect(() => {
    if (!isOpen) return;

    if (blogToEdit) {
      const productoIdString = blogToEdit.producto_id?.toString() || "";
      setFormData({
        producto_id: productoIdString,
        subtitulo: blogToEdit.subtitulo || "",
        link: blogToEdit.link || "",
        meta_titulo: blogToEdit.etiqueta?.meta_titulo || "",
        meta_descripcion: blogToEdit.etiqueta?.meta_descripcion || "",
        imagen_principal: null,
        text_alt_principal: blogToEdit.text_alt_principal || "",
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
        url_video: blogToEdit.url_video || ""
      });
      setNombreProducto(blogToEdit.nombre_producto || "");
    } else {
      setFormData(defaultFormData);
      setNombreProducto("");
    }
  }, [isOpen, blogToEdit]);

  // Cargar productos
  useEffect(() => {
    const fetchProductos = async () => {
      if (!isOpen) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(getApiUrl(config.endpoints.productos.all), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setProductos(data.data);
        } else if (Array.isArray(data)) {
          setProductos(data);
        } else {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof BlogPOST) => {
    const file = e.target.files?.[0];
    if (file) {
      if (field === "imagen_principal" && file.size > 2048 * 1024) {
        Swal.fire({
          icon: "warning",
          title: "¡Imagen muy grande!",
          text: "Máx. 2 MB.",
        });
        if (e.target) e.target.value = "";
        return;
      }
      setFormData({ ...formData, [field]: file });
    }
  };

  const handleImagenSecundariaChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 2048 * 1024) {
      Swal.fire({
        icon: "warning",
        title: "¡Imagen muy grande!",
        text: "Máx. 2 MB.",
      });
      if (e.target) e.target.value = "";
      return;
    }
    const updated = [...formData.imagenes_secundarias];
    updated[index] = file;
    setFormData({ ...formData, imagenes_secundarias: updated });
  };

  const handleAltImagenSecundariaChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updated = [...formData.alt_imagenes_secundarias];
    updated[index] = e.target.value;
    setFormData({ ...formData, alt_imagenes_secundarias: updated });
  };

  const handleParrafoChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const updated = [...formData.parrafos];
    updated[index] = e.target.value;
    setFormData({ ...formData, parrafos: updated });
  };

  // Funciones para enlaces en párrafos
  const handleInsertLinkClick = (index: number) => {
    const textarea = document.getElementById(`parrafo-${index}`) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) {
      Swal.fire("Selecciona texto", "Selecciona una palabra o frase antes de insertar el enlace.", "warning");
      return;
    }
    const selected = textarea.value.substring(start, end);
    setSelectedParagraphIndex(index);
    setSelectedTextRange({ start, end });
    setSelectedText(selected);
    setIsLinkModalOpen(true);
  };

  const handleInsertManualLink = () => {
    if (selectedParagraphIndex === null || selectedTextRange === null || !linkUrl.trim()) return;
    const currentText = formData.parrafos[selectedParagraphIndex];
    const linkedText = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" title="${selectedText}">${selectedText}</a>`;
    const newText = currentText.slice(0, selectedTextRange.start) + linkedText + currentText.slice(selectedTextRange.end);
    const updatedParrafos = [...formData.parrafos];
    updatedParrafos[selectedParagraphIndex] = newText;
    setFormData({ ...formData, parrafos: updatedParrafos });
    setSelectedParagraphIndex(null);
    setSelectedTextRange(null);
    setSelectedText("");
    setLinkUrl("");
    setIsLinkModalOpen(false);
  };

  const handleProductLinkClick = (index: number) => {
    const textarea = document.getElementById(`parrafo-${index}`) as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    if (!selected) {
      Swal.fire("Selecciona texto", "Selecciona una palabra o frase para enlazar a un producto.", "warning");
      return;
    }
    setSelectedParagraphIndex(index);
    setSelectedTextRange({ start, end });
    setSelectedText(selected);
    setIsProductLinkModalOpen(true);
  };

  const handleInsertProductLink = (producto: Producto) => {
    if (selectedParagraphIndex === null || selectedTextRange === null) return;
    const currentText = formData.parrafos[selectedParagraphIndex];
    const link = producto.link;
    const linkedText = `<a href="/products/producto/?link=${link}" style="color: blue; text-decoration: underline;" title="${link}">${selectedText}</a>`;
    const newText = currentText.slice(0, selectedTextRange.start) + linkedText + currentText.slice(selectedTextRange.end);
    const updatedParrafos = [...formData.parrafos];
    updatedParrafos[selectedParagraphIndex] = newText;
    setFormData({ ...formData, parrafos: updatedParrafos });
    setSelectedParagraphIndex(null);
    setSelectedTextRange(null);
    setSelectedText("");
    setIsProductLinkModalOpen(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedParagraphIndex(null);
    setSelectedTextRange(null);
    setSelectedText("");
    setIsLinkModalOpen(false);
    setIsProductLinkModalOpen(false);
    setLinkUrl("");
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEdit = !!blogToEdit;

    if (!formData.producto_id) return alert("⚠️ Debe seleccionar un producto.");
    if (!formData.subtitulo.trim()) return alert("⚠️ El subtítulo es obligatorio.");
    if (!isEdit && !formData.imagen_principal) return alert("⚠️ La imagen principal es obligatoria para crear.");
    const parrafosConContenido = formData.parrafos.filter(p => p.trim());
    if (parrafosConContenido.length === 0) return alert("⚠️ Debe haber al menos un párrafo con contenido.");
    const urlRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (formData.link && !urlRegex.test(formData.link)) {
      return alert("⚠️ El link debe ser URL-friendly (solo minúsculas, guiones y números).");
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();
      formDataToSend.append('producto_id', formData.producto_id);
      formDataToSend.append('subtitulo', formData.subtitulo);
      formDataToSend.append('url_video', formData.url_video);

      if (formData.link?.trim()) formDataToSend.append('link', formData.link.trim());
      const etiqueta = {
        meta_titulo: formData.meta_titulo?.trim() || "",
        meta_descripcion: formData.meta_descripcion?.trim() || ""
      };
      if (etiqueta.meta_titulo || etiqueta.meta_descripcion) {
        formDataToSend.append('etiqueta', JSON.stringify(etiqueta));
      }
      if (formData.text_alt_principal?.trim()) formDataToSend.append('text_alt_principal', formData.text_alt_principal.trim());
      if (formData.alt_imagen_card?.trim()) formDataToSend.append('alt_imagen_card', formData.alt_imagen_card.trim());
      if (formData.imagen_principal) formDataToSend.append("imagen_principal", formData.imagen_principal);

      const imagenesConArchivo = formData.imagenes_secundarias.filter(img => img !== null);
      imagenesConArchivo.forEach((img) => formDataToSend.append("imagenes[]", img as File));
      formData.alt_imagenes_secundarias.forEach((alt, index) => {
        if (formData.imagenes_secundarias[index] !== null || (isEdit && alt.trim())) {
          formDataToSend.append("alt_imagenes[]", alt.trim());
        }
      });
      parrafosConContenido.forEach((parrafo) => formDataToSend.append("parrafos[]", parrafo.trim()));

      const endpoint = isEdit
        ? getApiUrl(config.endpoints.blogs.update(blogToEdit.id))
        : getApiUrl(config.endpoints.blogs.create);

      if (isEdit) formDataToSend.append("_method", "PUT");
      const res = await fetch(endpoint, {
        method: "POST",
        body: formDataToSend,
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      let data;
      try { data = await res.json(); } catch { data = await res.text(); }
      if (res.ok) {
        alert(`✅ Blog ${isEdit ? "actualizado" : "creado"} correctamente.`);
        closeModal();
        onSuccess?.();
      } else {
        if (data.errors) {
          let errorMessage = "❌ Errores de validación:\n";
          Object.keys(data.errors).forEach(field => {
            const errors = Array.isArray(data.errors[field]) ? data.errors[field] : [data.errors[field]];
            errorMessage += `• ${field}: ${errors.join(', ')}\n`;
          });
          alert(errorMessage);
        } else {
          alert(`❌ Error (${res.status}): ${data.message || JSON.stringify(data)}`);
        }
      }
    } catch (err) {
      console.error("❌ Error en la solicitud:", err);
      alert("❌ Error en la conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white text-black px-4 sm:px-6 md:px-8 py-6 rounded-lg max-h-[90vh] w-full max-w-5xl mx-2 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-center md:text-left">
          {blogToEdit ? "Editar Blog" : "Añadir Blog"}
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
          {/* Información Principal & SEO */}
        <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">Información Principal & SEO</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Producto */}
            <div className="col-span-1 md:col-span-4">
              <label className="block mb-2 font-medium">Producto <span className="text-red-500">*</span></label>
              <select
                name="producto_id"
                value={formData.producto_id}
                onChange={handleSelectChange}
                required
                className="w-full bg-white text-black p-2 rounded-md border border-gray-300"
                disabled={loading}
              >
                <option value="">{loading ? "Cargando productos..." : "-- Selecciona un producto --"}</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id.toString()}>
                    {producto.nombre || `Producto ${producto.id}`}
                  </option>
                ))}
              </select>
                <small className="text-gray-500">Selecciona el producto relacionado con este blog. Requerido.</small>
              {nombreProducto && (
                <p className="text-xs text-gray-500 mt-1">
                  Producto seleccionado: <strong>{nombreProducto}</strong>
                </p>
              )}
            </div>

            {/* Subtítulo */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1">Subtítulo <span className="text-red-500">*</span></label>
              <input
                name="subtitulo"
                value={formData.subtitulo}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
              <small className="text-gray-500 block mt-1">
              Máx. 120 caracteres (letras, números y espacios).
              </small>
            </div>

            {/* Meta título */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1">Meta título</label>
              <input
                type="text"
                name="meta_titulo"
                value={formData.meta_titulo || ""}
                onChange={handleInputChange}
                placeholder="Título optimizado para SEO"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <small className="text-gray-500 block mt-1">
                Máx. 70 caracteres (letras, números y espacios).
              </small>
            </div>

            {/* Meta descripción */}
            <div className="col-span-1 md:col-span-2">
              <label className="block font-medium mb-1">Meta descripción</label>
              <input
                type="text"
                name="meta_descripcion"
                value={formData.meta_descripcion || ""}
                onChange={handleInputChange}
                placeholder="Descripción optimizada para SEO"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <small className="text-gray-500 block mt-1">
              Máx. 160 caracteres (letras, números y espacios).
              </small>
            </div>

            {/* Link */}
            <div className="col-span-1 md:col-span-4">
              <label className="block font-medium mb-1">Link (URL amigable)</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="ejemplo: mi-blog-post"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
                <small className="text-gray-500">Escribe solo minúsculas y guiones. Máx. 255 letras o números.</small>
            </div>
          </div>
        </div>


          {/* Imágenes */}
          <div className="bg-green-50 p-4 sm:p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Imágenes</h3>
            <div className="space-y-6">
              {/* Imagen Principal */}
              <div className="border border-green-400 rounded p-4">
                <label className="block font-medium mb-2">Imagen Principal {!blogToEdit && <span className="text-red-500">*</span>}</label>
                {blogToEdit?.imagen_principal && (
                  <img
                    src={blogToEdit.imagen_principal}
                    alt={formData.text_alt_principal || "Imagen principal"}
                    className="w-full h-48 sm:h-64 object-cover rounded mb-4 border"
                  />
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "imagen_principal")} className="w-full file:py-2 file:px-3 file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200" />
                <small className="text-gray-500">Peso máximo: 2 MB.</small>
                <input
                  type="text"
                  name="text_alt_principal"
                  placeholder="Texto ALT para SEO"
                  value={formData.text_alt_principal}
                  onChange={handleInputChange}
                  className="mt-2 w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              {/* Imágenes Secundarias */}
              <div className="border border-green-400 rounded p-4">
                <label className="block font-semibold mb-4">Imágenes Secundarias</label>
                  <small className="text-gray-500">Imágenes adicionales del artículo. Se creará un registro por archivo en la tabla imagen_blogs.</small>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {formData.imagenes_secundarias.map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      {blogToEdit?.imagenes?.[i]?.ruta_imagen && (
                        <img
                          src={blogToEdit.imagenes[i].ruta_imagen}
                          alt={formData.alt_imagenes_secundarias[i] || `Imagen secundaria #${i + 1}`}
                          className="w-full h-32 object-cover rounded mb-2 border"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImagenSecundariaChange(e, i)}
                        className="w-full file:py-2 file:px-3 file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                      />
                        <small className="text-gray-500">Archivo de imagen secundaria #{i+1}.<br/>Tamaño máximo: 2 MB.</small>
                      <input
                        type="text"
                        placeholder={`Texto ALT imagen secundaria #${i + 1}`}
                        value={formData.alt_imagenes_secundarias[i]}
                        onChange={(e) => handleAltImagenSecundariaChange(e, i)}
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Video */}
          <div className="bg-purple-50 p-4 sm:p-6 rounded-lg border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-4">Video</h3>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL del Video *</label>
            <input
              type="url"
              name="url_video"
              value={formData.url_video}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
              <small className="text-gray-500">Solo minúsculas y guiones. Hasta 255 letras, números o espacios.</small>
          </div>

          {/* Párrafos */}
          <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">Párrafos <span className="text-red-500">*</span></h3>
            {formData.parrafos.map((p, i) => (
              <div key={i} className="relative mb-6">
                <textarea
                  id={`parrafo-${i}`}
                  value={p}
                  onChange={(e) => handleParrafoChange(e, i)}
                  className="w-full border border-gray-300 rounded px-3 py-2 pr-20"
                  rows={4}
                  placeholder={`Párrafo ${i + 1} (opcional)`}
                />
                  <small className="text-gray-500">Máx. 100 caracteres (letras, números y espacios).</small>
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleInsertLinkClick(i)}
                    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition"
                  >
                    🔗
                  </button>
                  <button
                    type="button"
                    onClick={() => handleProductLinkClick(i)}
                    className="bg-green-500 hover:bg-green-700 text-white p-2 rounded-full shadow-lg transition"
                  >
                    🛒
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Procesando..." : (blogToEdit ? "Actualizar" : "Crear")}
            </button>
          </div>
        </form>

        {/* Modal enlace manual */}
        {isLinkModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[60]">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Insertar Enlace</h3>
              <p className="text-sm text-gray-600 mb-2">Texto seleccionado: <strong>"{selectedText}"</strong></p>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://ejemplo.com"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsLinkModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancelar</button>
                <button type="button" onClick={handleInsertManualLink} disabled={!linkUrl.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-4 py-2 rounded">Insertar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal enlace producto */}
        {isProductLinkModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[60]">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold mb-4">Enlazar a Producto</h3>
              <p className="text-sm text-gray-600 mb-4">Texto seleccionado: <strong>"{selectedText}"</strong></p>
              <select
                onChange={(e) => {
                  const selectedId = parseInt(e.target.value);
                  const selectedProduct = productos.find(p => p.id === selectedId);
                  if (selectedProduct) handleInsertProductLink(selectedProduct);
                }}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              >
                <option value="">-- Seleccionar producto --</option>
                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                ))}
              </select>
              <div className="flex justify-end">
                <button type="button" onClick={() => setIsProductLinkModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBlogModal;