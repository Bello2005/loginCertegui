import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Eye } from "lucide-react";
import { api } from "../../services/api";

const TablaProximasCitas = () => {
  const [citas, setCitas] = useState([]);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  useEffect(() => {
    // Temporalmente usando datos mock hasta que se implemente el endpoint
    setCitas([]);
    
    // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas/proximas)
    // api
    //   .get("proximas_citas.php")
    //   .then((res) => {
    //     if (res.data.status === "success") {
    //       setCitas(res.data.data);
    //     }
    //   })
    //   .catch((err) => console.error(err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <CalendarDays className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Próximas Citas
        </h2>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                <tr>
                  {["Paciente", "Doctor", "Servicio", "Hora", "Acción"].map((h, index) => (
                    <motion.th
                      key={h}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                    >
                      {h}
                    </motion.th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {citas.length > 0 ? (
                  citas.map((cita, index) => (
                    <motion.tr
                      key={cita.cita_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(99, 102, 241, 0.05)" }}
                      className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {cita.paciente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {cita.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {cita.servicio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {cita.hora}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <CalendarDays className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          No hay citas programadas para hoy.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TablaProximasCitas;
