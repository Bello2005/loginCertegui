import { useEffect, useState } from "react";
import { UserPlus, Edit3, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";
import DoctorModal from "./DoctorModal";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { generateDoctoresPDF } from "../../utils/pdfGenerator";

const DoctorDashboard = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchDoctores = (page = 1) => {
    setLoading(true);
    api.get(`api/doctores?page=${page}&limit=10`)
      .then(res => {
        setDoctores(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(err => {
        console.error('Error cargando doctores:', err);
        setDoctores([]);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (doctor = null) => {
    setEditingDoctor(doctor);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDoctor(null);
  };

  const handleSaveDoctor = async (formData) => {
    if (editingDoctor) {
      // Editar doctor existente
      await api.put(`api/doctores/${editingDoctor.id}`, {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        especialidad: formData.especialidad
      });
    } else {
      // Crear nuevo doctor
      await api.post('api/doctores', formData);
    }
    fetchDoctores(pagination.page);
  };

  const eliminarDoctor = (id) => {
    if(window.confirm("¿Eliminar este doctor?")) {
      api.delete(`api/doctores/${id}`)
        .then(() => {
          toast.success("Doctor eliminado exitosamente");
          fetchDoctores(pagination.page);
        })
        .catch(err => {
          console.error('Error eliminando doctor:', err);
          toast.error("Error al eliminar doctor: " + (err.response?.data?.message || err.message));
        });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.info("Generando PDF...");
      const res = await api.get(`api/doctores?page=1&limit=1000`);
      const allDoctores = res.data.data || doctores;
      generateDoctoresPDF(allDoctores);
      toast.success("PDF generado exitosamente");
    } catch (error) {
      console.error("Error generando PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  useEffect(() => { fetchDoctores() }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="p-8 pb-4 flex-shrink-0">
          <HeaderDashboard title="Panel de Administración" />
        </div>
        <main className="flex-1 flex flex-col gap-8 px-8 overflow-y-auto overflow-x-hidden min-w-0">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Doctores</h2>
              <div className="flex gap-3">
                <button 
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all"
                >
                  <Download className="w-5 h-5" /> Descargar PDF
                </button>
                <button 
                  onClick={() => handleOpenModal()} 
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all"
                >
                  <UserPlus className="w-5 h-5" /> Nuevo Doctor
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando...</p>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Nombre</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Correo</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Especialidad</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctores.map(d => (
                        <tr key={d.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{d.nombre}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{d.correo}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{d.especialidad || "-"}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                            <button 
                              onClick={() => handleOpenModal(d)} 
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => eliminarDoctor(d.id)} 
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
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
                        onClick={() => fetchDoctores(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchDoctores(pagination.page + 1)}
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
        <div className="mt-auto px-8 pb-6">
          <Footer />
        </div>
      </div>

      {/* Modal */}
      <DoctorModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        doctor={editingDoctor}
        onSave={handleSaveDoctor}
      />
    </div>
  );
};

export default DoctorDashboard;
