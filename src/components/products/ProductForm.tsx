

import type Producto from "../../models/Product";
import type Specs from "../../models/Specs";

interface Props {
  initialData?: Producto;
  onSubmit: (data: Producto) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}


const ProductForm = ({ initialData, onSubmit, onCancel, isEditing }: Props) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Producto = {
      id: initialData?.id || "0",
      nombre: formData.get("nombre") as string,
      titulo: formData.get("titulo") as string,
      link: formData.get("link") as string,
      seccion: formData.get("seccion") as string,
      precio: parseFloat(formData.get("precio") as string),
      stock: parseFloat(formData.get("stock") as string),
      subtitulo: formData.get("subtitulo") as string,
      lema: formData.get("lema") as string,
      descripcion: formData.get("descripcion") as string,
      especificaciones: formData.get("especificaciones") as string,
      imagenes: formData.get("imagenes") as unknown as string[],
      textos_alt: formData.get("textos_alt") as unknown as string[],
    };
    await onSubmit(data);
  };

  return (
    <form
      id="eliminentechno3"
      onSubmit={handleSubmit}
      className="grid grid-cols-4 gap-4 gap-x-12"
    >
      <div className="col-span-2">
        <label className="block">Nombre</label>
        <input
          type="text"
          name="nombre"
          required
          defaultValue={initialData?.nombre}
          className="w-full bg-white outline-none p-2 rounded-md text-black"
        />
      </div>

      <div className="col-span-2">
        <label className="block">Título</label>
        <input
          type="text"
          name="titulo"
          required
          defaultValue={initialData?.titulo}
          className="w-full bg-white outline-none p-2 rounded-md text-black"
        />
      </div>

      <div className="col-span-2">
        <label className="block">Subtítulo</label>
        <input
          type="text"
          name="subtitulo"
          required
          defaultValue={initialData?.subtitulo}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div>

      <div className="col-span-2">
        <label className="block">Lema</label>
        <input
          type="text"
          name="lema"
          required
          defaultValue={initialData?.lema}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div>

      <div className="col-span-4">
        <label className="block">Descripción</label>
        <textarea
          name="descripcion"
          rows={3}
          required
          defaultValue={initialData?.descripcion}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        ></textarea>
      </div>

      <div className="col-span-2">
        <label className="block">Imágenes</label>
        <input
          type="text"
          name="imagenes"
          required
          defaultValue={initialData?.imagenes}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div>

      <div>
        <label className="block">Stock</label>
        <input
          type="number"
          name="stock"
          required
          defaultValue={initialData?.stock}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div>

      <div>
        <label className="block">Precio</label>
        <input
          type="number"
          name="precio"
          step="0.01"
          required
          defaultValue={initialData?.precio}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div>

      <div>
        <label className="block">Sección</label>
        <input
          type="text"
          name="seccion"
          required
          defaultValue={initialData?.seccion}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div>
      <div>
        <label className="block">Link</label>
        <input
          type="text"
          name="link"
          required
          defaultValue={initialData?.link}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> 
      <div>
        <label className="block">Especificaciones</label>
        <input
          type="text"
          name="especificaciones"
          required
          defaultValue={initialData?.especificaciones} //pasarlo en dos inputs pq es object, cambiar en el model a tipo Specs como estaba antes
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> 
      <div>
        <label className="block">Textos Alt</label>
        <input
          type="text"
          name="link"
          required
          defaultValue={initialData?.textos_alt}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> 

      {/* <div>
        <label className="block">Color (espec.)</label>
        <input
          type="text"
          name="color"
          required
          defaultValue={initialData?.c}
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> */}

      {/* <div>
        <label className="block">Alto</label>
        <input
          type="text"
          name="alto"
          required
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> */}

      {/* <div>
        <label className="block">Largo</label>
        <input
          type="text"
          name="largo"
          required
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> */}

      {/* <div>
        <label className="block">Ancho</label>
        <input
          type="text"
          name="ancho"
          required
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> */}

      {/* <div>
        <label className="block">Productos relac.</label>
        <input
          type="text"
          name="productos_relacionados"
          required
          className="w-full bg-white p-2 outline-none rounded-md text-black"
        />
      </div> */}
      <div className="flex gap-2 mt-8">
        <button type="submit" form="eliminentechno3" className="admin-act-btn">
          {isEditing ? "Guardar Cambios" : "Añadir"}
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
