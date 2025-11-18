import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";
import PacienteModal from "./PacienteModal";

const Pages = () => {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchPacientes = (page = 1) => {
    setCargando(true);
    api
      .get(`api/pacientes?page=${page}&limit=10`)
      .then((res) => {
        setPacientes(res.data.data);
        setPagination(res.data.pagination);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error al cargar pacientes:", err);
        setPacientes([]);
        setCargando(false);
      });
  };

  useEffect(() => {
    fetchPacientes();
  }, []);

  const handleSavePaciente = async (formData) => {
    await api.post("api/pacientes", formData);
    fetchPacientes(pagination.page);
  };

  return (
    <>
      <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition hover:shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Pacientes
          </h2>
          <button 
            onClick={() => setModalOpen(true)} 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all"
          >
            <UserPlus className="w-5 h-5" /> Nuevo Paciente
          </button>
        </div>

      {cargando ? (
        <p className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando pacientes...</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Nombre</th>
                  <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Correo</th>
                  <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Última Cita</th>
                </tr>
              </thead>
              <tbody>
                {pacientes.map((p, idx) => (
                  <tr
                    key={p.id}
                    className={`border-t dark:border-gray-700 ${
                      idx % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50 dark:bg-gray-800/50"
                    } hover:bg-blue-50 dark:hover:bg-gray-800 transition`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.nombre}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{p.correo}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{p.fecha || "Sin citas"}</td>
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
                  onClick={() => fetchPacientes(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-4 py-2 text-sm font-medium">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <button
                  onClick={() => fetchPacientes(pagination.page + 1)}
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

      {/* Modal */}
      <PacienteModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSavePaciente}
      />
    </>
  );
};

const PacientesDashboard = () => (
  <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden min-w-0">
      <div className="p-8 pb-4 flex-shrink-0">
        <HeaderDashboard title="Panel de Administración" />
      </div>
      <main className="flex-1 flex flex-col gap-8 px-8 overflow-y-auto overflow-x-hidden min-w-0">
        <Pages />
      </main>
      <div className="mt-auto px-8 pb-6 flex-shrink-0">
        <Footer />
      </div>
    </div>
  </div>
);

export default PacientesDashboard;
