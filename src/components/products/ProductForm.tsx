import { useState } from "react";
import type Producto from "../../models/Product";
import Input from "../Input";

interface Props {
  initialData?: Producto;
  onSubmit: (data: Producto) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

type ImageAltPair = {
  file: File | null;
  alt: string;
};

const ProductForm = ({ initialData, onSubmit, onCancel, isEditing }: Props) => {
  const [imageAltPairs, setImageAltPairs] = useState<ImageAltPair[]>([
    { file: null, alt: "" },
  ]);

  const handleImageChange = (index: number, file: File | null) => {
    const updated = [...imageAltPairs];
    updated[index].file = file;
    setImageAltPairs(updated);
  };

  const handleAltChange = (index: number, alt: string) => {
    const updated = [...imageAltPairs];
    updated[index].alt = alt;
    setImageAltPairs(updated);
  };

  const addImageAltPair = () => {
    const last = imageAltPairs[imageAltPairs.length - 1];
    if (last.file && last.alt.trim()) {
      setImageAltPairs([...imageAltPairs, { file: null, alt: "" }]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const imagenes: File[] = imageAltPairs
  .filter((pair) => pair.file && pair.alt.trim())
  .map((pair) => pair.file!);

const textos_alt: string[] = imageAltPairs
  .filter((pair) => pair.file && pair.alt.trim())
  .map((pair) => pair.alt);

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
      especificaciones: {
        color: formData.get("color") as string,
        material: formData.get("material") as string,
      },
      imagenes,
      textos_alt,
      _method: "PUT",
    };
    await onSubmit(data);
  };

  return (
    <form
      id="eliminentechno3"
      onSubmit={handleSubmit}
      className="grid  max-sm:grid-cols-1 grid-cols-2 gap-5"
    >
      <Input
        label="Nombre"
        name="nombre"
        defaultValue={initialData?.nombre}
        required
      />
      <Input
        label="Título"
        name="titulo"
        defaultValue={initialData?.titulo}
        required
      />
      <Input
        label="Subtítulo"
        name="subtitulo"
        defaultValue={initialData?.subtitulo}
        required
      />
      <Input
        label="Lema"
        name="lema"
        defaultValue={initialData?.lema}
        required
      />
      <Input
        label="Descripción"
        type="textarea"
        rows={3}
        name="descripcion"
        defaultValue={initialData?.descripcion}
        className="col-span-2"
        required
      />
      <Input
        label="Stock"
        type="number"
        name="stock"
        defaultValue={initialData?.stock}
        required
      />
      <Input
        label="Precio"
        type="number"
        name="precio"
        defaultValue={initialData?.precio}
        required
      />
      <Input
        label="Sección"
        name="seccion"
        defaultValue={initialData?.seccion}
        required
      />
      <Input
        label="Link"
        name="link"
        disabled
        defaultValue={initialData?.link}
        required
        className="hidden"
      />
      <Input
        label="Color"
        name="color"
        defaultValue={initialData?.especificaciones.color}
        required
      />
      <Input
        label="Material"
        name="material"
        defaultValue={initialData?.especificaciones.material}
        className="col-span-2 w-[50%]"
        required
      />
      {initialData?.imagenes.map((img) => (
        <div key={img.id} className="flex items-center gap-4">
          <img
            src={`https://apiyuntas.yuntasproducciones.com${img.url_imagen}`}
            alt={img.texto_alt_SEO}
            className="w-20 h-20 object-cover"
          />
          <span className="text-sm">{img.texto_alt_SEO}</span>
        </div>
      ))}
      <div className="col-span-2 space-y-4">
        <label className="font-medium">Nuevas Imágenes y Alts</label>
        {imageAltPairs.map((pair, index) => (
          <div key={index} className="flex gap-4 items-center">
            <input
              type="file"
              accept="image/*"
              name="imagenes"
              onChange={(e) =>
                handleImageChange(index, e.target.files?.[0] || null)
              }
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              placeholder="Texto ALT"
              name="textos_alt"
              value={pair.alt}
              onChange={(e) => handleAltChange(index, e.target.value)}
              className="border px-2 py-1 rounded w-full"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addImageAltPair}
          className="text-blue-600 underline text-sm"
        >
          + Agregar otra imagen
        </button>
      </div>

      <div className="flex gap-2 mt-8 col-span-2">
        <button
          type="submit"
          form="eliminentechno3"
          className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
        >
          {isEditing ? "Guardar Cambios" : "Añadir"}
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-300 text-gray-800 font-semibold px-5 py-2 rounded-lg hover:bg-gray-400 transition duration-200 cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
