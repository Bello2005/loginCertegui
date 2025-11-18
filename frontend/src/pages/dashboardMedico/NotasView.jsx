import { useEffect, useState } from "react";
import { UserPlus, Edit3, Trash2, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const NotasModal = ({ isOpen, onClose, nota = null, onSave, usuarioId }) => {
  const [formData, setFormData] = useState({ paciente_id: "", titulo: "", contenido: "", fecha: "" });
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Cargar pacientes para el select
    api.get('api/pacientes?page=1&limit=100')
      .then(res => setPacientes(res.data.data || []))
      .catch(() => setPacientes([]));
  }, []);

  useEffect(() => {
    if (nota) {
      setFormData({
        paciente_id: nota.paciente_id || "",
        titulo: nota.titulo || "",
        contenido: nota.contenido || "",
        fecha: nota.fecha || ""
      });
    } else {
      const hoy = new Date().toISOString().split('T')[0];
      setFormData({ paciente_id: "", titulo: "", contenido: "", fecha: hoy });
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
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Paciente</label>
              <select
                value={formData.paciente_id}
                onChange={(e) => setFormData({ ...formData, paciente_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Seleccionar paciente</option>
                {pacientes.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Título *</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.titulo ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400`}
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
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

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Fecha *</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  errors.fecha ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400`}
              />
              {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
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

const NotasView = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchNotas = (page = 1) => {
    setLoading(true);
    api.get(`api/notas?page=${page}&limit=10&usuario_id=${user?.id}`)
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
    try {
      // Obtener doctor_id desde usuario_id
      const doctorRes = await api.get(`api/doctores/me?usuario_id=${user?.id}`);
      const doctorId = doctorRes.data.doctor_id;
      
      const dataToSave = {
        ...formData,
        doctor_id: doctorId
      };
      
      if (editingNota) {
        await api.put(`api/notas/${editingNota.id}`, dataToSave);
      } else {
        await api.post('api/notas', dataToSave);
      }
      fetchNotas(pagination.page);
    } catch (error) {
      toast.error("Error al guardar nota");
      console.error('Error guardando nota:', error);
    }
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

  useEffect(() => {
    fetchNotas();
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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Notas</h2>
              </div>
              <button 
                onClick={() => handleOpenModal()} 
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg transition-all"
              >
                <UserPlus className="w-5 h-5" /> Nueva Nota
              </button>
            </div>

            {loading ? (
              <p className="text-center py-8 text-gray-600 dark:text-gray-400">Cargando notas...</p>
            ) : (
              <>
                <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                  <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Título</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Paciente</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Fecha</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {notas.map((n, idx) => (
                        <tr
                          key={n.id}
                          className={`border-t dark:border-gray-700 ${
                            idx % 2 === 0
                              ? "bg-white dark:bg-gray-900"
                              : "bg-gray-50 dark:bg-gray-800/50"
                          } hover:bg-blue-50 dark:hover:bg-gray-800 transition`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{n.titulo}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{n.paciente_nombre || "-"}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{n.fecha}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                            <button
                              onClick={() => handleOpenModal(n)}
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => eliminarNota(n.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
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
                        onClick={() => fetchNotas(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
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
        <div className="mt-auto px-6 pb-6">
          <Footer />
        </div>
      </div>

      <NotasModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        nota={editingNota}
        onSave={handleSaveNota}
        usuarioId={user?.id}
      />
    </div>
  );
};

export default NotasView;

