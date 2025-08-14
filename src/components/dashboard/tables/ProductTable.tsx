import { FaTrash, FaRegEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../../Modal";
import ProductForm from "../../products/ProductForm";
import type Producto from "../../../models/Product";
import { config, getApiUrl } from "../../../../config";
import TableContainer from "./TableContainer";

export default function DataTable() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
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
    const productos = responseData.data ?? [];
    setProductos(productos);
  };

  const eliminarProducto = async (id: string | number) => {
    const url = getApiUrl(config.endpoints.productos.delete(id));
    const token = localStorage.getItem("token");

    // Verificar que el token exista
    if (!token) {
      Swal.fire({
        title: "Error de autenticación",
        text: "No se encontró token de acceso. Por favor inicia sesión nuevamente.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
      return;
    }

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
        console.log("🗑️ Eliminando producto ID:", id);
        console.log("URL delete:", url);

        // Hacer la petición DELETE
        const respuesta = await fetch(url, {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        console.log("Respuesta status:", respuesta.status);
        const data = await respuesta.json();
        console.log("Respuesta data:", data);

        if (respuesta.ok) {
          Swal.fire("¡Eliminado!", data.message, "success");
          // Actualizar la lista de productos
          obtenerDatos();
        } else {
          // Manejar diferentes tipos de errores
          let errorMessage = data.message || "Error desconocido al eliminar";

          if (respuesta.status === 401) {
            errorMessage =
              "Token expirado o inválido. Por favor inicia sesión nuevamente.";
            localStorage.removeItem("token");
          } else if (respuesta.status === 403) {
            if (
              data.message?.includes("roles") ||
              data.error?.includes("roles")
            ) {
              errorMessage =
                "No tienes el rol necesario para eliminar productos.";
            } else if (
              data.message?.includes("permission") ||
              data.error?.includes("permission")
            ) {
              errorMessage =
                "No tienes el permiso necesario para eliminar productos.";
            } else {
              errorMessage = "Acceso denegado. Contacta al administrador.";
            }
          } else if (respuesta.status === 404) {
            errorMessage = "El producto no existe o ya fue eliminado.";
          }

          Swal.fire("Error", errorMessage, "error");
        }
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
      }
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  const totalPages = Math.ceil(productos.length / itemsPerPage);

  const handleEdit = (producto: Producto) => {
    setCurrentProduct(producto);
    setIsOpen(true);
  };

  const handleSubmit = async function (formData: FormData) {
    const urlCreate = getApiUrl(config.endpoints.productos.create);
    const token = localStorage.getItem("token");

    // Verificar que el token exista y sea válido
    if (!token) {
      Swal.fire(
        "Error",
        "No hay token de autenticación. Por favor inicia sesión.",
        "error"
      );
      return;
    }

    // Debug: mostrar información del token
    console.log("Token exists:", !!token);
    console.log("Token length:", token.length);
    console.log("Token preview:", token.substring(0, 20) + "...");
    console.log("FormData entries:", [...formData.entries()]);

    try {
      const url = currentProduct
        ? getApiUrl(config.endpoints.productos.update(currentProduct.id))
        : urlCreate;

      console.log("Making request to:", url);

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
      console.log("Response status:", respuesta.status);
      console.log("Response headers:", [...respuesta.headers.entries()]);

      const result = await respuesta.json();
      console.log("Response data:", result);

      if (respuesta.ok) {
        Swal.fire({
          title: `${result.message || "Producto guardado exitosamente"}`,
          icon: "success",
        });
        setIsOpen(false);
        obtenerDatos();
      } else {
        // Manejar diferentes tipos de errores
        let errorMessage = result.message || "Error desconocido";

        if (respuesta.status === 401) {
          errorMessage =
            "Token expirado o inválido. Por favor inicia sesión nuevamente.";
          // Opcional: limpiar token inválido y redirigir al login
          localStorage.removeItem("token");
          // window.location.href = "/login";
        } else if (respuesta.status === 403) {
          errorMessage = "Acceso denegado. Permisos insuficientes.";
        } else if (respuesta.status === 422) {
          errorMessage =
            "Datos de entrada inválidos: " +
            (result.message || "Verifica los campos del formulario");
        }

        Swal.fire("Error", errorMessage, "error");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
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

  useEffect(() => {
    console.log("📦 Productos cargados:", productos);
  }, [productos]);

  return (
    <>
      <div className="flex flex-row gap-4 mb-4">
        <button
          onClick={() => {
            setCurrentProduct(undefined);
            setIsOpen(true);
          }}
          className="mt-4 bg-blue-950 hover:bg-blue-800 text-white text-lg px-10 py-1.5 rounded-full flex items-center gap-2"
        >
          Añadir Producto
        </button>
      </div>
      <TableContainer tableType="productos">
        <thead>
          <tr className="bg-cyan-400 dark:bg-cyan-600 text-white uppercase text-xs font-bold">
            <th className="px-4 py-2 rounded-md">ID</th>
            <th className="px-4 py-2 rounded-md">NOMBRE</th>
            <th className="px-4 py-2 rounded-md">SECCIÓN</th>
            <th className="px-4 py-2 rounded-md">PRECIO</th>
            <th className="px-4 py-2 rounded-md">ACCIÓN</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => {
            const isEven = index % 2 === 0;
            const bgLight = isEven ? "bg-gray-100" : "bg-gray-200";
            const bgDark = isEven ? "dark:bg-gray-800" : "dark:bg-gray-700";
            const text = "text-gray-900 dark:text-gray-100";
            const key = item.id ?? `producto-${index}`;

            return (
              <tr key={key} className={`${bgLight} ${bgDark}`}>
                <td className={`px-4 py-2 font-bold rounded-md ${text}`}>
                  {item.id}
                </td>
                <td className={`px-4 py-2 font-bold rounded-md ${text}`}>
                  {item.nombreProducto || item.subtitle || item.nombre}
                </td>
                <td className={`px-4 py-2 font-bold rounded-md ${text}`}>
                  {item.section || item.tagline || item.seccion}
                </td>
                <td className={`px-4 py-2 font-bold rounded-md ${text}`}>
                  ${item.precioProducto || item.precio}
                </td>
                <td className={`px-4 py-2 rounded-md ${text}`}>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Editar"
                    >
                      <FaRegEdit size={18} />
                    </button>
                    <button
                      onClick={() => eliminarProducto(item.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Eliminar"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableContainer>
  {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-950 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      {/* Modal */}
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
        <ProductForm
          initialData={currentProduct}
          onSubmit={handleSubmit}
          isEditing={!!currentProduct}
        />
      </Modal>
    </>
  );
}
