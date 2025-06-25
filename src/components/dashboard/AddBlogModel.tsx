import { config, getApiUrl } from "../../../config";
import { useState, useEffect } from "react";

interface ImagenAdicional {
  url_imagen: File | null;
  url_imagen: File | null;
  parrafo_imagen: string;
}

interface BlogPOST {
  producto_id: number;
  titulo: string;
  link: string;
  parrafo: string;
  descripcion: string;
  imagen_principal: File | null;
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
    producto_id: 0,
    titulo: "",
    link: "",
    parrafo: "",
    descripcion: "",
    imagen_principal: null,
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
        imagen_principal: null, // No se puede rellenar un File
        titulo_blog: blogToEdit.tituloBlog || "",
        subtitulo_beneficio: blogToEdit.subTituloBlog || "",
        url_video: blogToEdit.videoBlog || "",
        titulo_video: blogToEdit.tituloVideoBlog || "",
        imagenes: [
          { url_imagen: null, parrafo_imagen: "" },
          { url_imagen: null, parrafo_imagen: "" },
        ],
        link: "", // NUEVO
        producto_id: "", // NUEVO
      });
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
    }
  }, [isOpen, blogToEdit]);

  // Manejar cambios en los inputs de texto
  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "link") {
      const sanitized = value
          .normalize("NFD") // descompone letras acentuadas
          .replace(/[\u0300-\u036f]/g, "") // elimina las marcas diacríticas
          .toLowerCase()
          .replaceAll(" ", "-");

      setFormData((prev) => ({
        ...prev,
        link: sanitized,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      producto_id: 0,
      titulo: "",
      link: "",
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

    // Validar campos requeridos
    if (
      !formData.titulo ||
      !formData.parrafo ||
      !formData.descripcion ||
      !formData.subtitulo_beneficio ||
      !formData.titulo_blog ||
      !formData.titulo_video ||
      !formData.url_video ||
      !formData.imagen_principal ||
      !formData.imagenes ||
      formData.imagenes.some((imagen) => !imagen.url_imagen) ||
      !formData.link || // NUEVO
      !formData.producto_id // NUEVO
    ) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "⚠️ Todos los campos son obligatorios.",
      });

      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();


      console.log("Producto ID a enviar:", formData.producto_id);
      if (formData.producto_id && !isNaN(formData.producto_id)) {
        formDataToSend.append("producto_id", String(formData.producto_id));
      } else {
        alert("⚠️ Debes seleccionar un producto válido.");
        return;
      }
      formDataToSend.append("titulo", formData.titulo);
      formDataToSend.append("link", formData.link);
      formDataToSend.append("parrafo", formData.parrafo);
      formDataToSend.append("descripcion", formData.descripcion);
      formDataToSend.append("subtitulo_beneficio", formData.subtitulo_beneficio);
      formDataToSend.append("titulo_blog", formData.titulo_blog);
      formDataToSend.append("titulo_video", formData.titulo_video);
      formDataToSend.append("url_video", formData.url_video);
      formDataToSend.append("imagen_principal", formData.imagen_principal as File);

      formData.imagenes.forEach((item, index) => {
        if (item.url_imagen) {
          formDataToSend.append(
            `imagenes[${index}][imagen]`,
            item.url_imagen as File
          );
        }
        formDataToSend.append(`imagenes[${index}][parrafo_imagen]`, item.parrafo_imagen);
      });
      formDataToSend.append(
        "imagen_principal",
        formData.imagen_principal as File
      );
      formDataToSend.append("link", formData.link); // NUEVO
      formDataToSend.append("producto_id", formData.producto_id); // NUEVO

      let url = getApiUrl(config.endpoints.blogs.create);
      let method = "POST";
      if (blogToEdit && blogToEdit.id) {
        url = `https://apiyuntas.yuntaspublicidad.com/api/blogs/${blogToEdit.id}`;
        // Si tu backend es Laravel, usa POST + _method: PUT, si no, usa PUT directamente:
        // method = "PUT";
        method = "POST";
        formDataToSend.append("_method", "PUT");
      }

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      let data: any = null;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Si no es JSON, intenta leer como texto y mostrar el error
        const text = await response.text();
        console.error("Respuesta no JSON:", text);
        alert("❌ Error inesperado del servidor.");
        return;
      }
      console.log("Respuesta del servidor:", data);

      if (response.ok) {
        alert(
          blogToEdit
            ? "✅ Blog editado exitosamente"
            : "✅ Blog añadido exitosamente"
        );
        closeModal();
        if (onSuccess) onSuccess();
      } else {
        alert(`❌ Error: ${data.message || "Error desconocido"}`);
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert(`❌ Error: ${error}`);
    }
  };

  // @ts-ignore
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
            <h2 className="text-3xl font-bold text-white mb-4">Añadir Nuevo Blog</h2>

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
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>
              <div>
                <label className="block">Link</label>
                <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
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
                  className="w-full bg-white outline-none p-2 rounded-md text-black"
                />
              </div>
              <div className="col-span-2">
                <label className="block">Producto</label>
                <select
                    name="producto_id"
                    value={formData.producto_id || ""} // En blanco si es 0
                    onChange={(e) =>
                        setFormData({ ...formData, producto_id: Number(e.target.value) })
                    }
                    required
                    className="w-full bg-white outline-none p-2 rounded-md text-black"
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((producto) => (
                      <option key={producto.id} value={producto.id}>
                        {producto.nombre || producto.titulo}
                      </option>
                  ))}
                </select>
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
                  Añadir Blog
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
