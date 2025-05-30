import { useState } from "react";
import { FaUpload, FaCheckCircle  } from "react-icons/fa";

export default function FileSelect({multiple = false}: {multiple?:boolean}){
    const [fileSelected, setFileSelected] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(true);
    } else {
      setFileSelected(false);
    }
  };

    return (
        <label
            className="flex flex-col items-center rounded border bg-blue-100 border-gray-300 p-4 text-gray-900 shadow-sm sm:p-6"
        >
            {fileSelected 
            ? <FaCheckCircle/>
            : <FaUpload />}

            <span className="mt-4 text-sm font-medium text-center"> 
            {fileSelected
            ? "Imagen(es) seleccionada(s)"
            : "Subir imagen(es)"}
            </span>

            {multiple
            ? <input multiple type="file" id="File" accept="image/*" className="sr-only" onChange={handleFileChange}/>
            : <input type="file" id="File" accept="image/*" className="sr-only" onChange={handleFileChange}/>}
        </label>
    )
}