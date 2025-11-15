import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Stethoscope, Calendar, Clock, Info, X } from "lucide-react";
import dayjs from "dayjs";

/**
 * ConfirmationModal
 * Props:
 *  - isOpen (bool)
 *  - cita (obj) -> puede venir desde el backend (cita creada) o desde el estado local
 *  - especialista (obj) -> datos del doctor (nombre, apellido)
 *  - onClose (fn)
 */
const ConfirmationModal = ({ isOpen, cita, especialista, onClose }) => {
  // cita.fecha puede ser string 'YYYY-MM-DD' o dayjs; unificamos
  const fecha = cita?.fecha ? dayjs(cita.fecha) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200/50 dark:border-slate-700/50"
          >
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <CheckCircle className="text-indigo-600 dark:text-indigo-400 w-20 h-20 mb-4" />
              </motion.div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                ¡Cita Confirmada!
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6 text-sm sm:text-base">
                Su cita ha sido agendada con éxito en <span className="font-semibold text-indigo-600 dark:text-indigo-400">ortho&mas</span>.
              </p>

              <div className="w-full bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-5 rounded-xl mb-6 border border-indigo-200 dark:border-indigo-800 text-left space-y-3">
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-indigo-600" /> 
                  <span>Especialista:</span> 
                  <span className="text-indigo-600 dark:text-indigo-400">{especialista ? `${especialista.nombre} ${especialista.apellido}` : "N/A"}</span>
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" /> 
                  <span>Fecha:</span> 
                  <span className="text-purple-600 dark:text-purple-400">{fecha ? fecha.format("dddd, D [de] MMMM [de] YYYY") : cita.fecha}</span>
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-pink-600" /> 
                  <span>Hora:</span> 
                  <span className="text-pink-600 dark:text-pink-400">{cita.hora || cita.horaSeleccionada}</span>
                </p>
                {cita.nota && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 italic flex items-start gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-indigo-600" /> 
                    <span>Nota: {cita.nota}</span>
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl w-full transition duration-300 shadow-lg hover:shadow-xl"
              >
                Entendido
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
