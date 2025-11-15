// src/components/HeaderDashboard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const HeaderDashboard = ({ title }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = dayjs().format("dddd, D [de] MMMM");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 shadow-lg"
    >
      {/* Sección izquierda - Bienvenida y resumen */}
      <div className="flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2"
        >
          ¡Bienvenido de vuelta{user?.nombre ? `, ${user.nombre}` : ""}! 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-400 text-base md:text-lg flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Hoy es <span className="font-semibold text-gray-800 dark:text-gray-200">{today}</span>.
          Revisa la actividad general de la clínica odontológica.
        </motion.p>
      </div>

      {/* Sección derecha - Botones de acción y notificaciones */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        {/* Botón de notificaciones */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 text-indigo-600 dark:text-indigo-400 transition-all duration-200 shadow-md hover:shadow-lg"
          aria-label="Notificaciones"
        >
          <Bell className="w-5 h-5" />
          {/* Indicador de notificación */}
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default HeaderDashboard;
