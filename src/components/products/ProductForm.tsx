import { useState } from "react";
import type Producto from "../../models/Product";
import Input from "../Input";

interface Props {
  initialData?: Producto;
  onSubmit: (formData: FormData) => Promise<void>;
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

    imageAltPairs.forEach((pair, index) => {
      if (pair.file) {
        formData.append(`imagenes[${index}]`, pair.file); // <- archivo real
        formData.append(`textos_alt[${index}]`, pair.alt); // <- texto alt correspondiente
      }
    });

    const especificaciones = {
      color: formData.get("color") as string,
      material: formData.get("material") as string,
    };
    
    formData.append("especificaciones", JSON.stringify(especificaciones));

    if (isEditing) {
      formData.append("_method", "PUT");
    }

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    await onSubmit(formData);
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
        /* disabled */
        defaultValue={initialData?.link}
        required
        /* className="hidden" */
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
