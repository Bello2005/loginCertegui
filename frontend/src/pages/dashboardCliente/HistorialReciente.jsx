// src/components/HistorialReciente.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, History } from "lucide-react";
import { api } from "../../services/api";

// Estilos del estado
const getStatusBadge = (estado) => {
  const base =
    "text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors";
  switch (estado) {
    case "Completada":
      return `${base} bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700`;
    case "Programada":
    case "Pendiente":
      return `${base} bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-700`;
    case "Cancelada":
      return `${base} bg-red-100 text-red-700 border-red-300 dark:bg-red-900 dark:text-red-300 dark:border-red-700`;
    default:
      return `${base} bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700`;
  }
};

const HistorialReciente = () => {
  const [citas, setCitas] = React.useState([]);

  useEffect(() => {
    // Llamada inicial
    fetchCitas();

    const interval = setInterval(() => {
      fetchCitas();
    }, 60000); // cada 60 segundos

    return () => clearInterval(interval);
  }, []);

  const fetchCitas = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return;

      const { data } = await api.get(`api/citas/historial?usuario_id=${user.id}`);
      setCitas(data || []);
    } catch (error) {
      console.error("Error fetching citas:", error);
      setCitas([]);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 lg:col-span-2 p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg"
    >
      {/* Título principal */}
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 border-b border-gray-200/50 dark:border-slate-600/50 pb-4 mb-6"
      >
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <History className="w-5 h-5" />
        </div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
          Historial de Citas
        </h3>
      </motion.header>

      {/* Lista de citas */}
      {citas.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {citas.map((cita, index) => (
            <motion.li
              key={cita.cita_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/citas/${cita.cita_id}`}
                className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-br from-gray-50 to-indigo-50/50 dark:from-slate-700/40 dark:to-indigo-900/20 
                           hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/20
                           border border-gray-200/50 dark:border-slate-600/50 
                           hover:border-indigo-300 dark:hover:border-indigo-500 
                           shadow-sm hover:shadow-md transition-all group"
              >
                {/* Info de cita */}
                <div className="flex items-center gap-4 flex-1">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 text-indigo-600 dark:text-indigo-300 shadow-md group-hover:shadow-lg transition-shadow"
                  >
                    <Calendar className="text-xl" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-50 text-base truncate">
                      {cita.servicio || cita.nombre || "Servicio no definido"}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(cita.fechaHora || cita.fecha).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="font-medium">{cita.doctor_nombre} {cita.doctor_apellido}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Estado */}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={getStatusBadge(cita.estado)}
                >
                  {cita.estado}
                </motion.span>
              </Link>
            </motion.li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            No hay citas en tu historial
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Tus citas aparecerán aquí una vez que las agendes
          </p>
        </div>
      )}
    </motion.section>
  );
};

export default HistorialReciente;
