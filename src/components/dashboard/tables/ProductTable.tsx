// src/components/admin/DataTable.tsx
import { FaTrash, FaRegEdit, FaTags } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../../Modal";
import ProductForm from "../../products/ProductForm";
import type { Product } from "../../../models/Product";
import { config, getApiUrl } from "../../../../config";
import TableContainer from "./TableContainer";
import { useProducts } from "../../../hooks/useProducts";
import { useDarkMode } from "../../../hooks/darkmode/useDarkMode";
export default function DataTable() {
  const { productos, loading, createProduct, updateProduct, error, pagination, refetch } =
    useProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(
    undefined
  );
  const { darkMode, toggleDarkMode } = useDarkMode()
  console.log('Productos cargados:', productos); // Depuración básica
  const eliminarProducto = async (id: string | number) => {
    const url = getApiUrl(config.endpoints.productos.delete(id));
    const token = localStorage.getItem("token");

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
          // Después de eliminar, recargamos la página actual
          refetch(pagination.current_page);
        } else {
          let errorMessage = data.message || "Error desconocido al eliminar";

          if (respuesta.status === 401) {
            errorMessage =
              "Token expirado o inválido. Por favor inicia sesión nuevamente.";
            localStorage.removeItem("token");
          } else if (respuesta.status === 403) {
            errorMessage =
              "Acceso denegado. No tienes permisos para eliminar productos.";
          } else if (respuesta.status === 404) {
            errorMessage = "El producto no existe o ya fue eliminado.";
          }

          Swal.fire("Error", errorMessage, "error");
        }
      } catch (error) {
        Swal.fire("Error", "No se pudo conectar con el servidor.", "error");
      }
    }
  };
  const handlePageChange = (pageNumber: number) => {
    // Al cambiar de página, llamamos a refetch con la nueva página
    refetch(pageNumber, pagination.per_page);
  };

  const handleEdit = (producto: Product) => {
    setCurrentProduct(producto);
    setIsOpen(true);
  };

  const handleSubmit = async function (formData: FormData) {
    const urlCreate = getApiUrl(config.endpoints.productos.create);
    const token = localStorage.getItem("token");

    if (!token) {
      Swal.fire(
        "Error",
        "No hay token de autenticación. Por favor inicia sesión.",
        "error"
      );
      return;
    }

    try {
      const url = currentProduct
        ? getApiUrl(config.endpoints.productos.update(currentProduct.id))
        : urlCreate;

      const respuesta = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData,
      });

      const result = await respuesta.json();

      if (respuesta.ok) {
        Swal.fire({
          title: `${result.message || "Producto guardado exitosamente"}`,
          icon: "success",
        });
        setIsOpen(false);
        // Después de guardar/editar, recargamos la página actual
        refetch(pagination.current_page);
      } else {
        let errorMessage = result.message || "Error desconocido";

        if (respuesta.status === 401) {
          errorMessage =
            "Token expirado o inválido. Por favor inicia sesión nuevamente.";
          localStorage.removeItem("token");
        } else if (respuesta.status === 403) {
          errorMessage = "Acceso denegado. Permisos insuficientes.";
        } else if (respuesta.status === 422) {
          errorMessage =
            "Datos inválidos: " +
            (result.message || "Verifica los campos del formulario");
        }

        Swal.fire("Error", errorMessage, "error");
      }
    } catch (error) {
      Swal.fire({
        title: `Hubo un error al insertar el producto`,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

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

      <div className="overflow-x-auto p-4">
        <TableContainer tableType="productos">
          <thead className="hidden md:table-header-group">
            <tr>
              {["ID", "Nombre", "Sección", "Precio", "Acción"].map((header) => (
                <th
                  key={header}
                  className={`px-4 py-2 text-white uppercase text-xs font-bold rounded-md ${darkMode ? 'bg-cyan-900' : 'bg-cyan-400'}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-12">
                  <div className="flex justify-center items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                    <span className="text-teal-500 font-medium">Cargando productos...</span>
                  </div>
                </td>
              </tr>
            ) : productos.length > 0 ? (
              productos.map((item, index) => {
                const rowBg = (index % 2 === 0 && darkMode) ? "bg-white text-black" : "text-black bg-white";
                const key = item.id ?? `producto-${index}`;

                return (
                  <tr
                    key={key}
                    className={`text-center md:table-row block md:mb-0 mb-4 rounded-lg shadow-sm ${rowBg}`}
                  >
                    <td data-label="ID" className={`px-4 py-2 font-bold border block md:table-cell ${darkMode ? 'bg-gray-300' : 'bg-white'}`}>
                      {item.id}
                    </td>
                    <td data-label="Nombre" className={`px-4 py-2 font-bold border block md:table-cell ${darkMode ? 'bg-gray-300' : 'bg-white'}`}>
                      {item.nombre}
                    </td>
                    <td data-label="Sección" className={`px-4 py-2 font-bold border block md:table-cell ${darkMode ? 'bg-gray-300' : 'bg-white'}`}>
                      {item.seccion}
                    </td>
                    <td data-label="Precio" className={`px-4 py-2 font-bold border block md:table-cell ${darkMode ? 'bg-gray-300' : 'bg-white'}`}>
                      ${item.precio ? item.precio.toFixed(2) : ""}
                    </td>
                    <td data-label="Acción" className={`px-4 py-2 border block md:table-cell ${darkMode ? 'bg-gray-300' : 'bg-white'}`}>
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center justify-center gap-2 p-2 text-yellow-600 hover:text-yellow-800 transition bg-yellow-100 rounded-lg shadow-sm"
                          title="Editar"
                        >
                          <FaRegEdit size={18} />
                        </button>
                        <button
                          onClick={() => eliminarProducto(item.id)}
                          className="flex items-center justify-center gap-2 p-2 text-red-600 hover:text-red-800 transition bg-red-100 rounded-lg shadow-sm"
                          title="Eliminar"
                        >
                          <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="bg-teal-50 p-6 rounded-full">
                      <FaTags className="h-10 w-10 text-teal-300" />
                    </div>
                    <p className="text-xl font-medium text-gray-600 mt-4">No hay productos registrados</p>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Comienza agregando productos a tu catálogo con el botón 'Añadir Producto'
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </TableContainer>
      </div>

      {/* Paginación */}
      {pagination.last_page > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <button
            onClick={() => handlePageChange(pagination.current_page - 1)}
            disabled={pagination.current_page === 1}
            className="px-4 py-2 bg-blue-950 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div className="flex gap-1">
            {Array.from({ length: pagination.last_page }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 rounded-md ${pagination.current_page === pageNum
                    ? "bg-blue-950 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(pagination.current_page + 1)}
            disabled={pagination.current_page === pagination.last_page}
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