import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Mail, Stethoscope, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { api } from "../services/api";
import { toast } from "react-toastify";

const CitaModal = ({ isOpen, onClose, citaId }) => {
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCita = useCallback(async () => {
    if (!citaId) {
      toast.error("ID de cita no proporcionado");
      onClose();
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.get(`api/citas/${citaId}`);
      if (res.data && res.data.success && res.data.data) {
        setCita(res.data.data);
      } else {
        const errorMsg = res.data?.message || "Error al cargar los detalles de la cita";
        toast.error(errorMsg);
        onClose();
      }
    } catch (error) {
      console.error("Error obteniendo cita:", error);
      const errorMsg = error.response?.data?.message || "Error al cargar los detalles de la cita";
      toast.error(errorMsg);
      // No cerrar el modal automáticamente en caso de error 404, solo mostrar el mensaje
      if (error.response?.status !== 404) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  }, [citaId, onClose]);

  useEffect(() => {
    if (isOpen && citaId) {
      fetchCita();
    } else {
      setCita(null);
    }
  }, [isOpen, citaId, fetchCita]);


  const getEstadoColor = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    switch (estadoLower) {
      case 'completada':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'programada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getEstadoIcon = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    switch (estadoLower) {
      case 'completada':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelada':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Detalles de la Cita
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

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : cita ? (
              <div className="space-y-6">
                {/* Estado */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Estado:</span>
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(cita.estado)}`}>
                      {getEstadoIcon(cita.estado)}
                      {cita.estado}
                    </span>
                  </div>
                </div>

                {/* Fecha y Hora */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50">
                    <div className="p-2 rounded-lg bg-indigo-500 text-white">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Fecha</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {new Date(cita.fecha).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200/50 dark:border-purple-700/50">
                    <div className="p-2 rounded-lg bg-purple-500 text-white">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Hora</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{cita.hora}</p>
                    </div>
                  </div>
                </div>

                {/* Información del Paciente */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-500 text-white">
                      <User className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Paciente</h3>
                  </div>
                  <div className="space-y-2 ml-12">
                    <p className="text-gray-900 dark:text-white font-semibold">{cita.paciente.nombre_completo}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{cita.paciente.correo}</span>
                    </div>
                  </div>
                </div>

                {/* Información del Doctor */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500 text-white">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Doctor</h3>
                  </div>
                  <div className="space-y-2 ml-12">
                    <p className="text-gray-900 dark:text-white font-semibold">{cita.doctor.nombre_completo}</p>
                    {cita.doctor.especialidad && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">Especialidad: {cita.doctor.especialidad}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{cita.doctor.correo}</span>
                    </div>
                  </div>
                </div>

                {/* Notas/Servicio */}
                {cita.nota && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200/50 dark:border-amber-700/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-amber-500 text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notas / Servicio</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 ml-12">{cita.nota}</p>
                  </div>
                )}

                {/* Información adicional */}
                {cita.created_at && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    Cita creada el {new Date(cita.created_at).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No se pudo cargar la información de la cita</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default CitaModal;

