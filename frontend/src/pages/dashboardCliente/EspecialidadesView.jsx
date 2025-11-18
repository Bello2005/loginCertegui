import { useEffect, useState } from "react";
import { api } from "../../services/api";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import { toast } from "react-toastify";

const EspecialidadesView = () => {
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchEspecialidades = (page = 1) => {
    setLoading(true);
    api.get(`api/especialidades?page=${page}&limit=10`)
      .then(res => {
        setEspecialidades(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(err => {
        console.error('Error cargando especialidades:', err);
        toast.error("Error al cargar especialidades");
        setEspecialidades([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEspecialidades();
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
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Especialidades
              </h2>
            </div>

            {loading ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando especialidades...</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {especialidades.map((esp) => (
                    <div
                      key={esp.id}
                      className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all"
                    >
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {esp.nombre}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {esp.descripcion || "Sin descripción"}
                      </p>
                    </div>
                  ))}
                </div>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Mostrando {((pagination.page - 1) * pagination.limit) + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => fetchEspecialidades(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchEspecialidades(pagination.page + 1)}
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

export default EspecialidadesView;

