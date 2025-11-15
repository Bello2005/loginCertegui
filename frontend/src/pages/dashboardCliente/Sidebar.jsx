// src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  CalendarPlus,
  History,
  User,
  LogOut,
  Sparkles,
  UserCircle2,
  Stethoscope,
} from "lucide-react";

const navItems = [
  { icon: Home, text: "Inicio", link: "/cliente" },
  { icon: CalendarPlus, text: "Agendar Cita", link: "/cliente/nueva-cita" },
  { icon: User, text: "Mi Perfil", link: "/perfil" },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="flex h-screen flex-col justify-between bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-5 w-64 fixed shadow-2xl border-r border-gray-100/50 dark:border-slate-700/50 z-30">
      {/* Logo y usuario */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 pb-4 border-b border-gray-200/50 dark:border-slate-700/50 mb-6"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full p-3 shadow-lg"
          >
            <Stethoscope className="text-2xl" />
          </motion.div>
          <div>
            <h1 className="text-indigo-600 dark:text-indigo-400 text-xl font-extrabold leading-snug bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Ortho&Mas
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Centro Odontológico
            </p>
          </div>
        </motion.div>

        {/* Información del usuario */}
        {user && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <UserCircle2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user.rol?.nombre || "Paciente"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Menú */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.link;
            const Icon = item.icon;
            return (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.link}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-semibold ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                  }`}
                >
                  <Icon
                    className={`text-lg ${
                      isActive ? "text-white" : "text-indigo-500 dark:text-indigo-400"
                    }`}
                  />
                  <p
                    className={`text-base ${
                      isActive
                        ? "text-white"
                        : "text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {item.text}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Cerrar Sesión */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ x: 4 }}
        className="border-t border-gray-200/50 dark:border-slate-700/50 pt-4"
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 font-semibold"
        >
          <LogOut className="text-red-500 text-xl" />
          <p className="text-base font-semibold text-red-600 dark:text-red-400">
            Salir de la Cuenta
          </p>
        </button>
      </motion.div>
    </aside>
  );
};

export default Sidebar;
