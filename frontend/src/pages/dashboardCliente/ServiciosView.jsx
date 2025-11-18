import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

const ServiciosView = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchServicios = (page = 1) => {
    setLoading(true);
    api.get(`api/servicios?page=${page}&limit=10`)
      .then(res => {
        // Filtrar solo servicios activos
        const serviciosActivos = res.data.data.filter(s => s.activo === 1);
        setServicios(serviciosActivos);
        setPagination({
          ...res.data.pagination,
          total: serviciosActivos.length
        });
      })
      .catch(err => {
        console.error('Error cargando servicios:', err);
        toast.error("Error al cargar servicios");
        setServicios([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 flex flex-col">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 p-6 md:p-8">
          <Header />
          
          <div className="mt-6 p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Servicios Disponibles
              </h2>
            </div>

            {loading ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando servicios...</p>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Nombre</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Categoría</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Precio</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {servicios.map((s, idx) => (
                        <tr
                          key={s.id}
                          className={`border-t dark:border-gray-700 ${
                            idx % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-gray-50 dark:bg-gray-800/50"
                          } hover:bg-blue-50 dark:hover:bg-gray-800 transition`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{s.nombre}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{s.categoria || "-"}</td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                            ${parseFloat(s.precio).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{s.descripcion || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchServicios(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchServicios(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ServiciosView;

