import { useEffect, useState } from "react";
import { UserPlus, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const NotasModal = ({ isOpen, onClose, nota = null, onSave }) => {
  const [formData, setFormData] = useState({ paciente_id: "", doctor_id: "", titulo: "", contenido: "", fecha: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (nota) {
      setFormData({
        paciente_id: nota.paciente_id || "",
        doctor_id: nota.doctor_id || "",
        titulo: nota.titulo || "",
        contenido: nota.contenido || "",
        fecha: nota.fecha || ""
      });
    } else {
      setFormData({ paciente_id: "", doctor_id: "", titulo: "", contenido: "", fecha: "" });
    }
    setErrors({});
  }, [nota, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = "El título es requerido";
    if (!formData.fecha) newErrors.fecha = "La fecha es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(formData);
      toast.success(nota ? "Nota actualizada" : "Nota creada");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              {nota ? "Editar Nota" : "Nueva Nota"}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Paciente ID</label>
                <input
                  type="number"
                  value={formData.paciente_id}
                  onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Doctor ID</label>
                <input
                  type="number"
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.titulo ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`}
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Fecha *</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.fecha ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`}
              />
              {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Contenido</label>
              <textarea
                value={formData.contenido}
                onChange={(e) => setFormData({ ...formData, contenido: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                rows="4"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-semibold text-gray-700 dark:text-white"
              >
                Cancelar
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : nota ? "Actualizar" : "Crear"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const NotasDashboard = () => {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchNotas = (page = 1) => {
    setLoading(true);
    api.get(`api/notas?page=${page}&limit=10`)
      .then(res => {
        setNotas(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(err => {
        console.error('Error cargando notas:', err);
        toast.error("Error al cargar notas");
        setNotas([]);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (nota = null) => {
    setEditingNota(nota);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingNota(null);
  };

  const handleSaveNota = async (formData) => {
    if (editingNota) {
      await api.put(`api/notas/${editingNota.id}`, formData);
    } else {
      await api.post('api/notas', formData);
    }
    fetchNotas(pagination.page);
  };

  const eliminarNota = (id) => {
    if (window.confirm("¿Eliminar esta nota?")) {
      api.delete(`api/notas/${id}`)
        .then(() => {
          toast.success("Nota eliminada");
          fetchNotas(pagination.page);
        })
        .catch(err => {
          toast.error("Error al eliminar nota");
          console.error('Error eliminando nota:', err);
        });
    }
  };

  useEffect(() => { fetchNotas(); }, []);

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notas</h2>
              <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all"
              >
                <UserPlus className="w-5 h-5" /> Nueva Nota
              </button>
            </div>

            {loading ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando...</p>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Título</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Paciente</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Doctor</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Fecha</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notas.map(n => (
                        <tr key={n.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{n.titulo}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{n.paciente_nombre || `ID: ${n.paciente_id}`}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{n.doctor_nombre || `ID: ${n.doctor_id}`}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{n.fecha}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                            <button onClick={() => handleOpenModal(n)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button onClick={() => eliminarNota(n.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
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
                        onClick={() => fetchNotas(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchNotas(pagination.page + 1)}
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

      <NotasModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        nota={editingNota}
        onSave={handleSaveNota}
      />
    </div>
  );
};

export default NotasDashboard;

