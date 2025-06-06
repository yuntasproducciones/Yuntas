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
  const [imagenesExistentes, setImagenesExistentes] = useState(
    initialData?.imagenes || []
  );
  const [idsAEliminar, setIdsAEliminar] = useState<string[]>([]);
  const [relacionadoInput, setRelacionadoInput] = useState("");
  const [relacionados, setRelacionados] = useState<string[]>(
    initialData?.relacionados || []
  );

  const handleAddRelacionado = () => {
    if (relacionadoInput.trim()) {
      setRelacionados([...relacionados, relacionadoInput.trim()]);
      setRelacionadoInput("");
    }
  };

  const handleRemoveRelacionado = (id: string) => {
    setRelacionados(relacionados.filter((r) => r !== id));
  };

  const deleteExistImage = (id: string) => {
    setImagenesExistentes(imagenesExistentes.filter((img) => img.id !== id));
    setIdsAEliminar([...idsAEliminar, id]);
  };

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
        formData.append(`imagenes[${index}]`, pair.file);
        formData.append(`textos_alt[${index}]`, pair.alt);
      }
    });

    const especificaciones = {
      color: formData.get("color"),
      material: formData.get("material"),
    };

    formData.append("especificaciones", JSON.stringify(especificaciones));

    relacionados.forEach((rel, index) => {
      formData.append(`relacionados[${index}]`, rel);
    });

    if (isEditing) {
      formData.append("_method", "PUT");
    }

    if (idsAEliminar.length > 0) {
      formData.append("imagenes_a_eliminar", JSON.stringify(idsAEliminar));
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
        defaultValue={initialData?.link}
        required
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
        required
      />
      <div className="col-span-2">
        <label className="font-medium text-gray-700">Relacionados (IDs)</label>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Ingresa el ID del producto relacionado."
            value={relacionadoInput}
            onChange={(e) => setRelacionadoInput(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
          />
          <button
            type="button"
            onClick={handleAddRelacionado}
            className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 text-sm"
          >
            Agregar
          </button>
        </div>
        <div className="flex flex-wrap mt-2 gap-2">
          {relacionados.map((id, idx) => (
            <span
              key={idx}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
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
      <label className="font-medium col-span-2 text-gray-700 mt-3">
        Imagenes
      </label>
      <div className="col-span-2">
        {imagenesExistentes.length === 0 ? (
          <div className="text-center text-gray-500 italic py-8">
            {isEditing
              ? "No hay imágenes registradas para este producto."
              : "Agrega imagenes para este producto."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {imagenesExistentes.map((img) => (
              <div
                key={img.id}
                className="flex flex-col items-center p-4 bg-white rounded-xl shadow-md border hover:shadow-lg transition duration-300"
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
        )}
      </div>
      <div className="col-span-2 space-y-2">
        {imageAltPairs.map((pair, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-2 bg-white rounded-xl shadow-sm border border-gray-300"
          >
            <div className="relative w-full sm:w-2/1">
              <input
                type="file"
                accept="image/*"
                name="imagenes"
                onChange={(e) =>
                  handleImageChange(index, e.target.files?.[0] || null)
                }
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 
               file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 
               hover:file:bg-blue-100 text-sm text-gray-600 rounded-md w-full file:cursor-pointer cursor-pointer"
              />
            </div>
            <input
              type="text"
              placeholder="Texto ALT"
              name="textos_alt"
              value={pair.alt}
              onChange={(e) => handleAltChange(index, e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded-md w-full text-sm"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addImageAltPair}
          className="inline-block px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition mt-2 cursor-pointer"
        >
          + Agregar otra imagen
        </button>
      </div>

      <div className="flex gap-2 mt-5 col-span-2">
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
