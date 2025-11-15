import React from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const currentHour = dayjs().hour();
  const todayFormatted = dayjs().format("dddd, DD [de] MMMM");

  const getGreeting = () => {
    if (currentHour < 12) return "Buenos Días";
    if (currentHour < 18) return "Buenas Tardes";
    return "Buenas Noches";
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap justify-between items-center gap-4"
    >
      {/* Bloque de saludo */}
      <div className="flex flex-col gap-2">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2"
        >
          {getGreeting()}, {user?.rol?.nombre === "doctor" ? "Dr. " : ""}{user?.apellido || "Usuario"} 👩‍⚕️
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 dark:text-gray-400 text-sm capitalize flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          {todayFormatted} &middot; Resumen de su jornada.
        </motion.p>
      </div>

      {/* Bloque de acciones */}
      <div className="flex items-center gap-5">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notificaciones"
          className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 hover:from-indigo-200 hover:to-purple-200 dark:hover:from-indigo-800 dark:hover:to-purple-800 text-indigo-600 dark:text-indigo-400 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Bell className="text-xl" />
          <span className="absolute top-2 right-2 h-3 w-3 bg-red-600 rounded-full animate-pulse border-2 border-white dark:border-gray-900"></span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;
