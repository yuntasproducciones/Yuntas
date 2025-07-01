import { FaTrash, FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../../Modal";
import ProductForm from "../../products/ProductForm";
import type Producto from "../../../models/Product";
import { config, getApiUrl } from "../../../../config";

export default function DataTable() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Producto | undefined>(
    undefined
  );

  const obtenerDatos = async () => {
    const url = getApiUrl(config.endpoints.productos.list);
    const token = localStorage.getItem("token");
    const respuesta = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const responseData = await respuesta.json();
    
    // Manejar la estructura de respuesta de la API v1
    const productosData = responseData.data || responseData;
    const productos = Array.isArray(productosData) ? productosData : [productosData];
    
    setProductos(productos);
  };

  const eliminarProducto = async (id: string | number) => {
    const url = getApiUrl(config.endpoints.productos.delete(id));
    const token = localStorage.getItem("token");
    
    const confirmacion = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      try {
        // Revertir: SÍ requiere autenticación
        const respuesta = await fetch(url, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
          Swal.fire("¡Eliminado!", data.message, "success");
          // Actualizar la lista de productos
          obtenerDatos();
        } else {
          Swal.fire("Error", data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
  };

  const handleEdit = (producto: Producto) => {
    setCurrentProduct(producto);
    setIsOpen(true);
  };

  const handleSubmit = async function (formData: FormData) {
    const urlCreate = getApiUrl(config.endpoints.productos.create);
    const token = localStorage.getItem("token");
    
    // Verificar que el token exista y sea válido
    if (!token) {
      Swal.fire("Error", "No hay token de autenticación. Por favor inicia sesión.", "error");
      return;
    }
    
    // Debug: mostrar información del token
    console.log('Token exists:', !!token);
    console.log('Token length:', token.length);
    console.log('Token preview:', token.substring(0, 20) + '...');
    console.log('FormData entries:', [...formData.entries()]);
    
    try {
      const url = currentProduct
        ? getApiUrl(config.endpoints.productos.update(currentProduct.id))
        : urlCreate;

      console.log('Making request to:', url);

      // Revertir: API v1 SÍ requiere autenticación en este caso
      const respuesta = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
          // No agregar Content-Type para FormData - el browser lo hace automáticamente
        },
        body: formData,
      });
      
      // Debug: log de la respuesta para ver el error específico
      console.log('Response status:', respuesta.status);
      console.log('Response headers:', [...respuesta.headers.entries()]);
      
      const result = await respuesta.json();
      console.log('Response data:', result);
      
      if (respuesta.ok) {
        Swal.fire({
          title: `${result.message || 'Producto guardado exitosamente'}`,
          icon: "success",
        });
        setIsOpen(false);
        obtenerDatos();
      } else {
        // Manejar diferentes tipos de errores
        let errorMessage = result.message || 'Error desconocido';
        
        if (respuesta.status === 401) {
          errorMessage = 'Token expirado o inválido. Por favor inicia sesión nuevamente.';
          // Opcional: limpiar token inválido y redirigir al login
          localStorage.removeItem("token");
          // window.location.href = "/login";
        } else if (respuesta.status === 403) {
          errorMessage = 'Acceso denegado. Permisos insuficientes.';
        } else if (respuesta.status === 422) {
          errorMessage = 'Datos de entrada inválidos: ' + (result.message || 'Verifica los campos del formulario');
        }
        
        Swal.fire("Error", errorMessage, "error");
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      Swal.fire({
        title: `Hubo un error al insertar el producto`,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Bloquea el scroll del fondo
      document.body.style.overflow = "hidden";
    } else {
      // Restaura el scroll del fondo
      document.body.style.overflow = "auto";
    }

    // Limpieza por si acaso el componente se desmonta
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    obtenerDatos();
    
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4">
        {/* Botón para abrir el modal */}
        <button
          onClick={() => {
            setCurrentProduct(undefined); // Reset para modo "añadir"
            setIsOpen(true);
          }}
          className="mt-4 bg-blue-950 hover:bg-blue-800 text-white text-lg px-10 py-1.5 rounded-full flex items-center gap-2"
        >
          Añadir Producto
        </button>
      </div>
      {/* Tabla */}
      <table className="w-full border-separate border-spacing-2">
        <thead>
          <tr className="bg-blue-950 text-white">
            <th className="px-4 py-2 rounded-xl">ID</th>
            <th className="px-4 py-2 rounded-xl">NOMBRE</th>
            <th className="px-4 py-2 rounded-xl">SECCION</th>
            <th className="px-4 py-2 rounded-xl">PRECIO</th>
            <th className="px-4 py-2 rounded-xl">ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((item, index) => (
            <tr
              key={item.id}
              className={`text-center ${
                index % 2 === 0 ? "bg-gray-100" : "bg-gray-300"
              }`}
            >
              <td className="p-2 font-bold rounded-xl">{item.id}</td>
              <td className="p-2 font-bold rounded-xl">{item.nombreProducto || item.subtitle || item.nombre}</td>
              <td className="p-2 font-bold rounded-xl">{item.section || item.tagline || item.seccion}</td>
              <td className="p-2 font-bold rounded-xl">${item.precioProducto || item.precio}</td>
              <td className="p-2 rounded-xl">
                {/* Contenedor de acciones con íconos */}
                <div className="flex justify-center gap-5 rounded-xl">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-green-600 hover:text-green-800 transition cursor-pointer"
                    title="Confirmar"
                  >
                    <FaRegEdit size={18} />
                  </button>
                  <button
                    onClick={() => eliminarProducto(item.id)}
                    className="text-red-600 hover:text-red-800 transition cursor-pointer"
                    title="Eliminar"
                  >
                    <FaTrash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setCurrentProduct(undefined);
        }}
        title={currentProduct ? "Editar Datos" : "Ingresar Datos"}
        form="eliminentechno3"
        btnText={currentProduct ? "Guardar Cambios" : "Añadir"}
      >
        {/* Formulario */}
        <ProductForm
          initialData={currentProduct}
          onSubmit={handleSubmit}
          isEditing={!!currentProduct}
        />
      </Modal>
    </>
  );
}
