import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  LogOut,
  Hospital,
  UserCircle2,
} from "lucide-react";

// Mapeo de íconos
const iconMap = {
  Dashboard: LayoutDashboard,
  Calendario: CalendarDays,
  Pacientes: Users,
  Doctores: Stethoscope,
};

// Enlace con diseño mejorado
const SidebarLink = ({ name, icon: Icon, to, isLogout, onClick }) => {
  const baseClasses =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer select-none font-semibold";
  const getLinkClasses = ({ isActive }) => {
    const activeClasses =
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.02]";
    let inactiveClasses =
      "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400";
    if (isLogout)
      inactiveClasses =
        "hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 text-red-600 dark:text-red-400 hover:text-red-700";
    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <motion.div
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      <NavLink to={to} onClick={onClick} className={getLinkClasses}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm truncate">{name}</span>
      </NavLink>
    </motion.div>
  );
};

// Sidebar principal
const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { name: "Dashboard", to: "/admin" },
    { name: "Calendario", to: "/calendario" },
    { name: "Pacientes", to: "/pacientes" },
    { name: "Doctores", to: "/doctores" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col h-full p-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-700/50"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-xl shadow-lg"
          >
            <Hospital className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
              ortho&mas
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
              Clínica Odontológica
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
                  {user.rol?.nombre || "Usuario"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navegación principal */}
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => {
            const Icon = iconMap[item.name];
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SidebarLink
                  name={item.name}
                  icon={Icon}
                  to={item.to}
                />
              </motion.div>
            );
          })}
        </nav>

        {/* Footer con logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-4"
        >
          <SidebarLink
            name="Salir"
            icon={LogOut}
            to="#"
            isLogout={true}
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
            © 2025 ortho&mas
          </p>
        </motion.div>
      </div>
    </aside>
  );
};

export default Sidebar;
