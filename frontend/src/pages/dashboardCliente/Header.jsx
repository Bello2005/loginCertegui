// src/components/Header.jsx
import React from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles, UserCircle2 } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import DarkModeToggle from "../../components/DarkModeToggle";

dayjs.locale("es");

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = dayjs().format("dddd, DD [de] MMMM");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-between items-center py-5 px-6 border-b border-gray-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-sm rounded-2xl mb-6"
    >
      {/* Sección Izquierda: Saludo y Fecha */}
      <div>
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2"
        >
          Hola, {user?.nombre || "Usuario"} <span className="animate-bounce">👋</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 dark:text-gray-400 text-base font-medium mt-1 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Bienvenida de vuelta. Hoy es {today}.
        </motion.p>
      </div>

      {/* Sección Derecha: Notificaciones + Modo Oscuro + Perfil */}
      <div className="flex items-center gap-6">
        {/* Botón de Notificaciones */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 text-indigo-600 dark:text-indigo-400 shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Bell className="text-xl" />
          {/* Indicador de notificación */}
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
        </motion.button>

        {/* Toggle de Modo Oscuro */}
        <DarkModeToggle />

        {/* Avatar del usuario */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="relative"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <UserCircle2 className="w-8 h-8 text-white" />
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
