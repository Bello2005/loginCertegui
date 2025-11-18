import { useEffect, useState } from "react";
import { UserPlus, Edit3, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const HorariosModal = ({ isOpen, onClose, horario = null, onSave }) => {
  const [formData, setFormData] = useState({ doctor_id: "", dia_semana: "", hora_inicio: "", hora_fin: "", activo: 1 });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (horario) {
      setFormData({
        doctor_id: horario.doctor_id || "",
        dia_semana: horario.dia_semana || "",
        hora_inicio: horario.hora_inicio || "",
        hora_fin: horario.hora_fin || "",
        activo: horario.activo !== undefined ? horario.activo : 1
      });
    } else {
      setFormData({ doctor_id: "", dia_semana: "", hora_inicio: "", hora_fin: "", activo: 1 });
    }
    setErrors({});
  }, [horario, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.dia_semana) newErrors.dia_semana = "El día es requerido";
    if (!formData.hora_inicio) newErrors.hora_inicio = "La hora inicio es requerida";
    if (!formData.hora_fin) newErrors.hora_fin = "La hora fin es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(formData);
      toast.success(horario ? "Horario actualizado" : "Horario creado");
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
              {horario ? "Editar Horario" : "Nuevo Horario"}
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
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Doctor ID</label>
              <input
                type="number"
                value={formData.doctor_id}
                onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Día de la Semana *</label>
              <select
                value={formData.dia_semana}
                onChange={(e) => setFormData({ ...formData, dia_semana: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.dia_semana ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`}
              >
                <option value="">Seleccionar día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
              {errors.dia_semana && <p className="text-red-500 text-xs mt-1">{errors.dia_semana}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Hora Inicio *</label>
                <input
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.hora_inicio ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                  } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.hora_inicio && <p className="text-red-500 text-xs mt-1">{errors.hora_inicio}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Hora Fin *</label>
                <input
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.hora_fin ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                  } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.hora_fin && <p className="text-red-500 text-xs mt-1">{errors.hora_fin}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Activo</label>
              <select
                value={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              >
                <option value={1}>Sí</option>
                <option value={0}>No</option>
              </select>
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
                {loading ? "Guardando..." : horario ? "Actualizar" : "Crear"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const HorariosDashboard = () => {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchHorarios = (page = 1) => {
    setLoading(true);
    api.get(`api/horarios?page=${page}&limit=10`)
      .then(res => {
        setHorarios(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(err => {
        console.error('Error cargando horarios:', err);
        toast.error("Error al cargar horarios");
        setHorarios([]);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (horario = null) => {
    setEditingHorario(horario);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingHorario(null);
  };

  const handleSaveHorario = async (formData) => {
    if (editingHorario) {
      await api.put(`api/horarios/${editingHorario.id}`, formData);
    } else {
      await api.post('api/horarios', formData);
    }
    fetchHorarios(pagination.page);
  };

  const eliminarHorario = (id) => {
    if (window.confirm("¿Eliminar este horario?")) {
      api.delete(`api/horarios/${id}`)
        .then(() => {
          toast.success("Horario eliminado");
          fetchHorarios(pagination.page);
        })
        .catch(err => {
          toast.error("Error al eliminar horario");
          console.error('Error eliminando horario:', err);
        });
    }
  };

  useEffect(() => { fetchHorarios(); }, []);

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Horarios</h2>
              <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all"
              >
                <UserPlus className="w-5 h-5" /> Nuevo Horario
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
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Doctor</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Día</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Hora Inicio</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Hora Fin</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Estado</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {horarios.map(h => (
                        <tr key={h.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{h.doctor_nombre || `ID: ${h.doctor_id}`}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{h.dia_semana}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{h.hora_inicio}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{h.hora_fin}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{h.activo ? "Activo" : "Inactivo"}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                            <button onClick={() => handleOpenModal(h)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button onClick={() => eliminarHorario(h.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
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
                        onClick={() => fetchHorarios(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchHorarios(pagination.page + 1)}
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

      <HorariosModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        horario={editingHorario}
        onSave={handleSaveHorario}
      />
    </div>
  );
};

export default HorariosDashboard;

