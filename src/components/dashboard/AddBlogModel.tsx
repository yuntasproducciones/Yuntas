import { config, getApiUrl } from "../../../config";
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import type Blog from "../../models/Blog.ts";


interface ImagenAdicional {
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
  titulo_blog: string;
  subtitulo_beneficio: string;
  url_video: string;
  titulo_video: string;
  imagenes: ImagenAdicional[];
}

interface AddBlogModalProps {
  onBlogAdded?: () => void;
}

const AddBlogModal: React.FC<AddBlogModalProps> = ({ onBlogAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);
  const [formData, setFormData] = useState<BlogPOST>({
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
    ], // 👈 inicializamos como un arreglo vacío
  });
  useEffect(() => {
    if (isOpen) {
      fetch(getApiUrl(config.endpoints.blogs.list), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      })
          .then((res) => res.json())
          .then((data) => {
            const linksUsados = data?.data
                ?.map((b: any) => parseInt(b.link))
                .filter((n: number) => Number.isInteger(n) && n > 0);

            const linkLibre = obtenerPrimerNumeroLibre(linksUsados || []);
            setFormData((prev) => ({ ...prev, link: String(linkLibre) }));
          })
          .catch((err) => console.error("Error al obtener blogs:", err));
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      fetch(getApiUrl(config.endpoints.productos.list), {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json",
        },
      })
          .then((res) => res.json())
          .then((data) => {
            console.log("Respuesta productos:", data);
            setProductos(data || []); // ← Usamos `data` directamente
          })
          .catch((err) => console.error("Error al obtener productos:", err));
    }
  }, [isOpen]);

  function obtenerPrimerNumeroLibre(numeros: number[]): number {
    const set = new Set(numeros);
    let i = 1;
    while (set.has(i)) {
      i++;
    }
    return i;
  }
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
    });
  };

  // Enviar los datos a la API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos requeridos
    if (
        !formData.titulo ||
        !formData.link ||
        !formData.parrafo ||
        !formData.descripcion ||
        !formData.subtitulo_beneficio ||
        !formData.titulo_blog ||
        !formData.titulo_video ||
        !formData.url_video ||
        !formData.imagen_principal ||
        formData.imagenes.some((img) => !img.url_imagen)
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
          formDataToSend.append(`imagenes[${index}][imagen]`, item.url_imagen as File);
        }
        formDataToSend.append(`imagenes[${index}][parrafo_imagen]`, item.parrafo_imagen);
      });

      const response = await fetch(getApiUrl(config.endpoints.blogs.create), {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });


      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      if (response.ok) {await Swal.fire({
        icon: "success",
        title: "Blog añadido exitosamente",
        showConfirmButton: true,
      });
        closeModal(); // Cerrar modal
      } else {Swal.fire({
        icon: "error",
        title: "Error",
        text: `❌ Error: ${data.message}`,
      });

      }
      if (onBlogAdded) onBlogAdded();
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
