import { useEffect, useState } from "react";
import { UserPlus, Edit3, Trash2, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";
import { api } from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { generateInventarioPDF } from "../../utils/pdfGenerator";

const InventarioModal = ({ isOpen, onClose, inventario = null, onSave }) => {
  const [formData, setFormData] = useState({ material_id: "", proveedor_id: "", cantidad: "", cantidad_minima: "", ubicacion: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (inventario) {
      setFormData({
        material_id: inventario.material_id || "",
        proveedor_id: inventario.proveedor_id || "",
        cantidad: inventario.cantidad || "",
        cantidad_minima: inventario.cantidad_minima || "",
        ubicacion: inventario.ubicacion || ""
      });
    } else {
      setFormData({ material_id: "", proveedor_id: "", cantidad: "", cantidad_minima: "", ubicacion: "" });
    }
    setErrors({});
  }, [inventario, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.cantidad) newErrors.cantidad = "La cantidad es requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(formData);
      toast.success(inventario ? "Inventario actualizado" : "Inventario creado");
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
              {inventario ? "Editar Inventario" : "Nuevo Inventario"}
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
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Material ID</label>
              <input
                type="number"
                value={formData.material_id}
                onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Proveedor ID</label>
              <input
                type="number"
                value={formData.proveedor_id}
                onChange={(e) => setFormData({ ...formData, proveedor_id: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Cantidad *</label>
                <input
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                    errors.cantidad ? "border-red-500" : "border-gray-300 dark:border-gray-600 focus:border-indigo-500"
                  } bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`}
                />
                {errors.cantidad && <p className="text-red-500 text-xs mt-1">{errors.cantidad}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Cantidad Mínima</label>
                <input
                  type="number"
                  value={formData.cantidad_minima}
                  onChange={(e) => setFormData({ ...formData, cantidad_minima: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-white">Ubicación</label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
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
                {loading ? "Guardando..." : inventario ? "Actualizar" : "Crear"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const InventarioDashboard = () => {
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingInventario, setEditingInventario] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });

  const fetchInventario = (page = 1) => {
    setLoading(true);
    api.get(`api/inventario?page=${page}&limit=10`)
      .then(res => {
        setInventario(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch(err => {
        console.error('Error cargando inventario:', err);
        toast.error("Error al cargar inventario");
        setInventario([]);
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (inventario = null) => {
    setEditingInventario(inventario);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingInventario(null);
  };

  const handleSaveInventario = async (formData) => {
    if (editingInventario) {
      await api.put(`api/inventario/${editingInventario.id}`, formData);
    } else {
      await api.post('api/inventario', formData);
    }
    fetchInventario(pagination.page);
  };

  const eliminarInventario = (id) => {
    if (window.confirm("¿Eliminar este registro de inventario?")) {
      api.delete(`api/inventario/${id}`)
        .then(() => {
          toast.success("Registro eliminado");
          fetchInventario(pagination.page);
        })
        .catch(err => {
          toast.error("Error al eliminar registro");
          console.error('Error eliminando inventario:', err);
        });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      toast.info("Generando PDF...");
      const res = await api.get(`api/inventario?page=1&limit=1000`);
      const allInventario = res.data.data || inventario;
      generateInventarioPDF(allInventario);
      toast.success("PDF generado exitosamente");
    } catch (error) {
      console.error("Error generando PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  useEffect(() => { fetchInventario(); }, []);

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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario</h2>
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
                  <UserPlus className="w-5 h-5" /> Nuevo Registro
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
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Material</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Proveedor</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Cantidad</th>
                        <th className="px-6 py-3 font-semibold text-gray-900 dark:text-white">Ubicación</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventario.map(i => (
                        <tr key={i.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{i.material_nombre || `ID: ${i.material_id}`}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{i.proveedor_nombre || `ID: ${i.proveedor_id}`}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{i.cantidad}</td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{i.ubicacion || "-"}</td>
                          <td className="px-6 py-4 text-right flex justify-end gap-3">
                            <button onClick={() => handleOpenModal(i)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                              <Edit3 className="w-5 h-5" />
                            </button>
                            <button onClick={() => eliminarInventario(i.id)} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors">
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
                        onClick={() => fetchInventario(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-medium">
                        Página {pagination.page} de {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => fetchInventario(pagination.page + 1)}
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

      <InventarioModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        inventario={editingInventario}
        onSave={handleSaveInventario}
      />
    </div>
  );
};

export default InventarioDashboard;

