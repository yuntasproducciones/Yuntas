import { config, getApiUrl } from "../../../config";
import { useState, useEffect } from "react";

interface ImagenAdicional {
  url_imagen: File | null;
  parrafo_imagen: string;
}

interface BlogPOST {
  titulo: string;
  parrafo: string;
  descripcion: string;
  imagen_principal: File | null;
  titulo_blog: string;
  subtitulo_beneficio: string;
  url_video: string;
  titulo_video: string;
  imagenes: ImagenAdicional[];
  link: string; // NUEVO
  producto_id: string; // NUEVO
}

interface Blog {
  id: number;
  titulo: string;
  parrafo: string;
  descripcion: string;
  imagenPrincipal: string;
  tituloBlog?: string;
  subTituloBlog?: string;
  videoBlog?: string;
  tituloVideoBlog?: string;
  created_at?: string | null;
  link?: string; // <-- Añade esto
  producto_id?: string; // <-- Y esto
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
  // Nuevo estado para la imagen principal existente
  const [imagenPrincipalExistente, setImagenPrincipalExistente] = useState<string | null>(null);

  const [formData, setFormData] = useState<BlogPOST>({
    titulo: "",
    parrafo: "",
    descripcion: "",
    imagen_principal: null,
    titulo_blog: "",
    subtitulo_beneficio: "",
    url_video: "",
    titulo_video: "",
    imagenes: [
      {
        url_imagen: null,
        parrafo_imagen: "",
      },
      {
        url_imagen: null,
        parrafo_imagen: "",
      },
    ],
    link: "", // NUEVO
    producto_id: "", // NUEVO
  });

  useEffect(() => {
    if (isOpen && blogToEdit) {
      setFormData({
        titulo: blogToEdit.titulo || "",
        parrafo: blogToEdit.parrafo || "",
        descripcion: blogToEdit.descripcion || "",
        imagen_principal: null, // Siempre null al editar
        titulo_blog: blogToEdit.tituloBlog || "",
        subtitulo_beneficio: blogToEdit.subTituloBlog || "",
        url_video: blogToEdit.videoBlog || "",
        titulo_video: blogToEdit.tituloVideoBlog || "",
        imagenes: [
          { url_imagen: null, parrafo_imagen: "" },
          { url_imagen: null, parrafo_imagen: "" },
        ],
        link: blogToEdit.link ?? "", // Usa nullish coalescing para aceptar valores falsy válidos
        producto_id: blogToEdit.producto_id ?? "", // Igual aquí
      });
      setImagenPrincipalExistente(blogToEdit.imagenPrincipal || null); // Guarda la imagen existente
    } else if (!isOpen) {
      setFormData({
        titulo: "",
        parrafo: "",
        descripcion: "",
        imagen_principal: null,
        titulo_blog: "",
        subtitulo_beneficio: "",
        url_video: "",
        titulo_video: "",
        imagenes: [
          { url_imagen: null, parrafo_imagen: "" },
          { url_imagen: null, parrafo_imagen: "" },
        ],
        link: "", // NUEVO
        producto_id: "", // NUEVO
      });
      setImagenPrincipalExistente(null);
    }
  }, [isOpen, blogToEdit]);

  // Manejar cambios en los inputs de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar cambios en la imagen (file input)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, imagen_principal: e.target.files[0] });
    }
  };

  const handleFileChangeAdicional = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const nuevoArray = [...formData.imagenes];

      // Agregar el archivo y su parrafo
      nuevoArray[index] = {
        ...nuevoArray[index],
        url_imagen: e.target.files[0],
      };

      setFormData({ ...formData, imagenes: nuevoArray });
    }
  };

  const handleParrafoChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const nuevoArray = [...formData.imagenes];
    nuevoArray[index] = {
      ...nuevoArray[index],
      parrafo_imagen: e.target.value,
    };
    setFormData({ ...formData, imagenes: nuevoArray });
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormData({
      titulo: "",
      parrafo: "",
      descripcion: "",
      imagen_principal: null,
      titulo_blog: "",
      subtitulo_beneficio: "",
      url_video: "",
      titulo_video: "",
      imagenes: [
        {
          url_imagen: null,
          parrafo_imagen: "",
        },
        {
          url_imagen: null,
          parrafo_imagen: "",
        },
      ],
      link: "", // NUEVO
      producto_id: "", // NUEVO
    });
  };

  // Enviar los datos a la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación temporal: no permitir edición hasta que se implemente la ruta
    if (blogToEdit && blogToEdit.id) {
      alert("⚠️ La funcionalidad de edición no está disponible aún. La API no tiene implementada la ruta de actualización.");
      return;
    }

    // Resto de la validación para creación
    // Validar campos requeridos según las reglas del backend
    const imagenPrincipalValida = formData.imagen_principal || imagenPrincipalExistente;

    // Validar producto_id como número
    const productoIdNumber = Number(formData.producto_id);

    // Validar url_video como URL
    const urlVideoValida = /^https?:\/\/.+\..+/.test(formData.url_video);

    if (
      !formData.titulo ||
      !formData.link ||
      !formData.producto_id ||
      isNaN(productoIdNumber) ||
      !formData.parrafo ||
      !formData.descripcion ||
      !imagenPrincipalValida ||
      !formData.titulo_blog ||
      !formData.subtitulo_beneficio ||
      !formData.url_video ||
      !urlVideoValida ||
      !formData.titulo_video ||
      !formData.imagenes ||
      !Array.isArray(formData.imagenes) ||
      formData.imagenes.length === 0 ||
      formData.imagenes.some((img) => !img.url_imagen)
    ) {
      alert("⚠️ Todos los campos son obligatorios y deben tener el formato correcto.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("link", formData.link);
      formDataToSend.append("producto_id", productoIdNumber.toString());
      formDataToSend.append("parrafo", formData.parrafo);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("titulo_blog", formData.titulo_blog);
      formDataToSend.append("subtitulo_beneficio", formData.subtitulo_beneficio);
      formDataToSend.append("url_video", formData.url_video);
      formDataToSend.append("titulo_video", formData.titulo_video);

      // Imagen principal (solo si se seleccionó una nueva)
      if (formData.imagen_principal) {
        formDataToSend.append("imagen_principal", formData.imagen_principal as File);
      }

      // Imágenes adicionales - CORREGIR nombres de campos
      formData.imagenes.forEach((item, index) => {
        if (item.url_imagen) {
          // Cambia 'url_imagen' por 'imagen' para coincidir con backend
          formDataToSend.append(`imagenes[${index}][imagen]`, item.url_imagen as File);
        }
        // Cambia 'parrafo_imagen' por 'parrafo' para coincidir con backend
        formDataToSend.append(`imagenes[${index}][parrafo]`, item.parrafo_imagen || "");
      });

      // Solo crear, no editar
      let url = getApiUrl(config.endpoints.blogs.create);
      let method = "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
        throw new Error("Respuesta inesperada del servidor: " + data);
      }

      if (response.ok) {
        alert(
          blogToEdit
            ? " Blog editado exitosamente"
            : " Blog añadido exitosamente"
        );
        closeModal();
        if (onSuccess) onSuccess();
      } else {
        alert(`❌ Error: ${data.message || data}`);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert(`❌ Error: ${error}`);
    }
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 bg-blue-950 hover:bg-blue-950 text-white text-lg px-10 py-1.5 rounded-full flex items-center gap-2"
      >
        Añadir Blog
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="h-3/4 overflow-y-scroll bg-blue-950 text-white px-10 py-8 rounded-4xl w-3/5">
            <h2 className="text-2xl font-bold mb-4">AÑADIR BLOG</h2>

            {/* Formulario */}
            <form
              encType="multipart/form-data"
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4 gap-x-12"
            >
              <div>
                <label className="block">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              <div>
                <label className="block">Párrafo</label>
                <input
                  type="text"
                  name="parrafo"
                  value={formData.parrafo}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              <div className="col-span-2">
                <label className="block">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              <div className="col-span-2">
                <label className="block">Subtítulo Beneficio</label>
                <input
                  type="text"
                  name="subtitulo_beneficio"
                  value={formData.subtitulo_beneficio}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              <div>
                <label className="block">Título Blog</label>
                <input
                  type="text"
                  name="titulo_blog"
                  value={formData.titulo_blog}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              <div>
                <label className="block">Título Video</label>
                <input
                  type="text"
                  name="titulo_video"
                  value={formData.titulo_video}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              <div className="col-span-2">
                <label className="block">URL del Video</label>
                <input
                  type="text"
                  name="url_video"
                  value={formData.url_video}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              <div className="col-span-2">
                <label className="block">Imagen Principal</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  name="imagen_principal"
                  onChange={handleFileChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>
              {formData.imagenes.map((imagen, index) => (
                <div key={index} className="col-span-2">
                  <label className="block">Imagen {index + 1}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      handleFileChangeAdicional(e, index);
                    }}
                    required
                    className="w-full bg-white outline-none p-2 rounded-md text-black"
                  />
                  <textarea
                    onChange={(e) => {
                      handleParrafoChange(e, index);
                    }}
                    required
                    placeholder="Descripción de la imagen..."
                    className="w-full bg-white outline-none p-2 rounded-md text-black mt-2 min-h-36"
                  />
                </div>
              ))}

              <div>
                <label className="block">Link</label>
                <input
                  type="text"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block">Producto ID</label>
                <input
                  type="text"
                  name="producto_id"
                  value={formData.producto_id}
                  onChange={handleChange}
                  required
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-2 mt-8">
                <button type="submit" className="admin-act-btn">
                  {blogToEdit ? "Guardar cambios" : "Añadir Blog"}
                </button>
                <button
                  onClick={closeModal}
                  type="button"
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddBlogModal;