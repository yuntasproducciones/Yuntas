import { FaTrash, FaRegEdit, FaTags } from "react-icons/fa";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Modal from "../../Modal";
import ProductForm from "../../products/ProductForm";
import type { Product } from "../../../models/Product";
import { config, getApiUrl } from "../../../../config";
import TableContainer from "./TableContainer";
import { useProducts } from "../../../hooks/useProducts";

export default function DataTable() {
  const { productos, loading, createProduct, updateProduct, error, refetch } =
    useProducts();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const [isOpen, setIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | undefined>(
    undefined
  );

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
          refetch();
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productos.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(productos.length / itemsPerPage);

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
        refetch();
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
      <TableContainer tableType="productos">
        <div className="overflow-x-auto">
          <table className="w-full responsive-table">
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12">
                    <div className="flex justify-center items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
                      <span className="text-teal-500 font-medium">
                        Cargando productos...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item, index) => {
                  const isEven = index % 2 === 0;
                  const bgLight = isEven ? "bg-gray-100" : "bg-gray-200";
                  const bgDark = isEven ? "dark:bg-gray-800" : "dark:bg-gray-700";
                  const text = "text-gray-900 dark:text-gray-100";
                  const key = item.id ?? `producto-${index}`;

                  return (
                    <tr key={key} className={`${bgLight} ${bgDark}`}>
                      <td data-label="ID" className={`px-4 py-2 font-bold rounded-md ${text}`}>
                        {item.id}
                      </td>
                      <td data-label="Nombre" className={`px-4 py-2 font-bold rounded-md ${text}`}>
                        {item.nombre}
                      </td>
                      <td data-label="Sección" className={`px-4 py-2 font-bold rounded-md ${text}`}>
                        {item.seccion}
                      </td>
                      <td data-label="Precio" className={`px-4 py-2 font-bold rounded-md ${text}`}>
                        ${item.precio ? item.precio.toFixed(2) : ""}
                      </td>
                      <td data-label="Acción" className={`px-4 py-2 rounded-md ${text}`}>
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
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-teal-50 p-6 rounded-full">
                        <FaTags className="h-10 w-10 text-teal-300" />
                      </div>
                      <p className="text-xl font-medium text-gray-600 mt-4">
                        No hay productos registrados
                      </p>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Comienza agregando productos a tu catálogo con el botón 'Añadir Producto'
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
