import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";
import Modal from "react-modal";
import { Calendar, Eye, RefreshCw, X, Clock, User, FileText } from "lucide-react";
import { api } from "../../services/api";

dayjs.extend(relativeTime);
dayjs.locale("es");

// Configuración global del modal
Modal.setAppElement("#root");

const ProximaCita = () => {
  const [cita, setCita] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  // Cargar próxima cita
  useEffect(() => {
    const fetchCita = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const { data } = await api.get(`api/citas/proxima?usuario_id=${user.id}`);
        setCita(data);
      } catch (error) {
        console.error("Error al cargar la cita", error);
      }
    };
    fetchCita();
    const interval = setInterval(fetchCita, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!cita) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Tu Próxima Cita
          </h2>
        </div>
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            No tienes próximas citas programadas
          </p>
        </div>
      </motion.section>
    );
  }

  // Manejar el formato de fecha_hora del backend
  let nextAppointmentDate;
  if (cita.fecha_hora) {
    // El backend devuelve fecha_hora como "YYYY-MM-DDTHH:mm"
    nextAppointmentDate = dayjs(cita.fecha_hora);
  } else if (cita.fecha && cita.hora) {
    // Fallback: combinar fecha y hora si vienen separados
    nextAppointmentDate = dayjs(`${cita.fecha}T${cita.hora}`);
  } else {
    nextAppointmentDate = dayjs();
  }
  const timeUntil = nextAppointmentDate.fromNow();

  // Abrir y cerrar modal
  const openModal = (type, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setModalType(type);
    setModalIsOpen(true);
    if (type === "detalles") {
      fetchDetalles(cita.id);
    }
  };

  const closeModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setModalIsOpen(false);
    setDetalle(null);
    setNuevaFecha("");
    setNuevaHora("");
  };

  // Ver detalles
  const fetchDetalles = async (id) => {
    try {
      const { data } = await api.get(`api/citas/${id}`);
      if (data && data.success && data.data) {
        const cita = data.data;
        setDetalle({
          servicio: cita.nota || 'Consulta',
          doctor: cita.doctor?.nombre_completo || `${cita.doctor?.nombre || ''} ${cita.doctor?.apellido || ''}`.trim() || 'Doctor',
          fecha: cita.fecha,
          hora: cita.hora
        });
      } else if (data && data.fecha) {
        // Fallback para formato antiguo
        setDetalle({
          servicio: data.nota || data.servicio || 'Consulta',
          doctor: data.doctor_nombre || 'Doctor',
          fecha: data.fecha,
          hora: data.hora
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error al cargar los detalles.");
    }
  };

  // Reprogramar cita
  const handleReprogramar = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!nuevaFecha || !nuevaHora) {
      alert("Por favor completa la nueva fecha y hora");
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("Error: Usuario no encontrado");
        return;
      }

      const doctorId = cita.doctor_id;
      if (!doctorId) {
        alert("Error: No se pudo obtener el ID del doctor");
        return;
      }

      // Primero eliminar la cita antigua
      await api.delete(`api/citas/${cita.id}`);
      
      // Crear una nueva cita con la nueva fecha y hora
      const response = await api.post("api/citas", {
        pacienteId: user.id,
        doctorId: doctorId,
        fecha: nuevaFecha,
        hora: nuevaHora,
        nota: cita.descripcion || cita.servicio || ""
      });

      if (response.data && response.data.success) {
        alert("Cita reprogramada exitosamente");
        setCita(null);
        closeModal();
        // Recargar la próxima cita
        const { data } = await api.get(`api/citas/proxima?usuario_id=${user.id}`);
        setCita(data);
      } else {
        alert("Error al reprogramar la cita");
      }
    } catch (err) {
      console.error("Error al reprogramar la cita:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
      alert("Error al reprogramar la cita: " + errorMessage);
    }
  };

  // Cancelar cita
  const handleCancelar = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      const response = await api.put(`api/citas/${cita.id}/estado`, { estado: 'Cancelada' });
      if (response.data && (response.data.success || response.status === 200)) {
        alert("Cita cancelada exitosamente");
        setCita(null);
        closeModal();
        // Recargar para actualizar el estado
        const user = JSON.parse(localStorage.getItem("user"));
        if (user && user.id) {
          const { data } = await api.get(`api/citas/proxima?usuario_id=${user.id}`);
          setCita(data);
        }
      } else {
        alert("Error al cancelar la cita");
      }
    } catch (err) {
      console.error("Error al cancelar la cita:", err);
      const errorMessage = err.response?.data?.message || err.message || "Error desconocido";
      alert("Error al cancelar la cita: " + errorMessage);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <Calendar className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Tu Próxima Cita
        </h2>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50 flex flex-col md:flex-row items-start gap-6 shadow-md"
      >
        {/* Avatar del doctor */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-24 h-24 bg-center bg-cover rounded-full shadow-lg border-4 border-white dark:border-gray-800"
          style={{ backgroundImage: `url(${cita.doctor_avatar})` }}
        />

        {/* Información de la cita */}
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{cita.servicio}</p>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
              <User className="w-4 h-4" />
              Con {cita.doctor}
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{nextAppointmentDate.format("dddd, DD [de] MMMM - h:mm A")}</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">({timeUntil})</span>
          </div>

          {cita.descripcion && (
            <p className="text-gray-500 dark:text-gray-400 flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {cita.descripcion}
            </p>
          )}

          {/* Botones de acción */}
          <div className="mt-4 flex gap-3 flex-wrap">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => openModal("detalles", e)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
            >
              <Eye className="w-4 h-4" />
              Ver Detalles
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => openModal("reprogramar", e)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Reprogramar
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => openModal("cancelar", e)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-red-600 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 transition-all"
            >
              <X className="w-4 h-4" />
              Cancelar
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Modal dinámico */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md mx-auto mt-32 relative border border-white/20 dark:border-gray-700/50"
        overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-start z-50"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.1, rotate: 90 }}
          onClick={(e) => closeModal(e)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Modal de Detalles */}
        {modalType === "detalles" && detalle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Detalles de la cita
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Servicio</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{detalle.servicio}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{detalle.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fecha y Hora</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{detalle.fecha} - {detalle.hora}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Modal de Reprogramar */}
        {modalType === "reprogramar" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Reprogramar cita
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Nueva Fecha</label>
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Nueva Hora</label>
                <input
                  type="time"
                  value={nuevaHora}
                  onChange={(e) => setNuevaHora(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => handleReprogramar(e)}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
              >
                Guardar Cambios
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Modal de Cancelar */}
        {modalType === "cancelar" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
              Cancelar cita
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              ¿Estás seguro de que deseas cancelar esta cita?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => closeModal(e)}
                className="px-6 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                No
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleCancelar(e)}
                className="px-6 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 transition-all shadow-md"
              >
                Sí, cancelar
              </motion.button>
            </div>
          </motion.div>
        )}
      </Modal>
    </motion.section>
  );
};

export default ProximaCita;
