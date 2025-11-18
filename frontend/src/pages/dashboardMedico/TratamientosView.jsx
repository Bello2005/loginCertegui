import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { toast } from "react-toastify";

const TratamientosView = () => {
  const [tratamientos, setTratamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchTratamientos = (page = 1) => {
    setLoading(true);
    api.get(`api/tratamientos?page=${page}&limit=10`)
      .then(res => {
        setTratamientos(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(err => {
        console.error('Error cargando tratamientos:', err);
        toast.error("Error al cargar tratamientos");
        setTratamientos([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTratamientos();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-md">
          <Header />
        </div>
        <main className="flex-1 flex flex-col gap-8 px-6 py-6 overflow-y-auto">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tratamientos Disponibles</h2>
            </div>

            {loading ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando tratamientos...</p>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Nombre</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Precio</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Duración</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tratamientos.map((t, idx) => (
                        <tr
                          key={t.id}
                          className={`border-t dark:border-gray-700 ${
                            idx % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-gray-50 dark:bg-gray-800/50"
                          } hover:bg-blue-50 dark:hover:bg-gray-800 transition`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{t.nombre}</td>
                          <td className="px-6 py-4 text-gray-900 dark:text-white font-semibold">
                            ${parseFloat(t.precio).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                            {t.duracion_minutos ? `${t.duracion_minutos} min` : "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{t.descripcion || "-"}</td>
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
                        onClick={() => fetchTratamientos(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchTratamientos(pagination.page + 1)}
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
        <div className="mt-auto px-6 pb-6">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default TratamientosView;

