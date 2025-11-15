import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TriangleAlert, Clock } from "lucide-react";

const HorasDisponibles = ({ fechaSeleccionada, selectedEspecialista, horaSeleccionada, setHoraSeleccionada }) => {
  const [availableHours, setAvailableHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // cuando cambia la fecha o el especialista, cargamos las horas
  useEffect(() => {
    const fetchHoras = () => {
      setError(null);
      setLoading(true);

      // simulamos datos estáticos (puedes reemplazar con axios si tu backend está listo)
      const horas = [
        { hora: "09:00 AM", value: "09:00", disponible: true },
        { hora: "09:30 AM", value: "09:30", disponible: true },
        { hora: "10:00 AM", value: "10:00", disponible: true },
        { hora: "10:30 AM", value: "10:30", disponible: true },
        { hora: "11:00 AM", value: "11:00", disponible: true },
        { hora: "11:30 AM", value: "11:30", disponible: true },
        { hora: "02:00 PM", value: "14:00", disponible: true },
        { hora: "02:30 PM", value: "14:30", disponible: true },
        { hora: "03:00 PM", value: "15:00", disponible: true },
        { hora: "03:30 PM", value: "15:30", disponible: true },
        { hora: "04:00 PM", value: "16:00", disponible: true }
      ];

      setAvailableHours(horas);
      setLoading(false);
    };

    if (fechaSeleccionada && selectedEspecialista) {
      fetchHoras();
    }
  }, [fechaSeleccionada, selectedEspecialista]);

  if (!fechaSeleccionada || !selectedEspecialista) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl text-yellow-800 dark:text-yellow-300 flex items-center gap-3 border border-yellow-200 dark:border-yellow-800"
      >
        <TriangleAlert className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm">
          Primero seleccione un <strong>Especialista</strong> y una <strong>Fecha</strong>.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 transition-all hover:shadow-xl"
    >
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-600" />
        4. Seleccione Horario
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
          ({fechaSeleccionada.format("ddd, D MMM")})
        </span>
      </h2>

      {loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Cargando horarios...</p>
      )}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
        {availableHours.length === 0 && !loading ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 col-span-full">No hay horas registradas para esta fecha.</p>
        ) : (
          availableHours.map((hora, index) => (
            <motion.button
              key={hora.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!hora.disponible}
              onClick={() => setHoraSeleccionada(hora.value)}
              className={`
                h-12 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-300
                ${!hora.disponible
                  ? "bg-gray-100 text-gray-400 dark:bg-slate-700 dark:text-gray-600 cursor-not-allowed line-through opacity-50"
                  : horaSeleccionada === hora.value
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/50"
                  : "bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 text-gray-800 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-400"
                }`}
            >
              {hora.hora}
            </motion.button>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default HorasDisponibles;
