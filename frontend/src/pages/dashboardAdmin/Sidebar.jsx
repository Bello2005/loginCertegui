import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../../services/api";
import PerfilModal from "../../components/PerfilModal";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Stethoscope,
  LogOut,
  Hospital,
  UserCircle2,
  Pill,
  ClipboardList,
  Package,
  Wrench,
  Truck,
  Boxes,
  Sparkles,
  GraduationCap,
  Clock,
  FileText,
  Menu,
  X,
} from "lucide-react";

// Mapeo de íconos
const iconMap = {
  Dashboard: LayoutDashboard,
  Calendario: CalendarDays,
  Pacientes: Users,
  Doctores: Stethoscope,
  Tratamientos: Pill,
  Procedimientos: ClipboardList,
  Materiales: Package,
  Equipos: Wrench,
  Proveedores: Truck,
  Inventario: Boxes,
  Servicios: Sparkles,
  Especialidades: GraduationCap,
  Horarios: Clock,
  Notas: FileText,
};

// Enlace con diseño mejorado
const SidebarLink = ({ name, icon: Icon, to, isLogout, onClick }) => {
  const baseClasses =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out cursor-pointer select-none font-semibold w-full";
  const getLinkClasses = ({ isActive }) => {
    const activeClasses =
      "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30";
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
      className="w-full"
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.id) {
          try {
            const res = await api.get(`api/usuario/me?usuario_id=${storedUser.id}`);
            if (res.data) {
              setUser(res.data);
              localStorage.setItem("user", JSON.stringify(res.data));
            } else {
              setUser(storedUser);
            }
          } catch (apiError) {
            // Si el endpoint falla, usar el usuario almacenado
            // No mostrar errores 404 (son silenciosos) ni errores marcados como silenciosos
            if (!apiError.silent && apiError.response?.status !== 404) {
              console.error("Error obteniendo usuario:", apiError);
            }
            setUser(storedUser);
          }
        } else {
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error parseando usuario:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const menuItems = [
    { name: "Dashboard", to: "/admin" },
    { name: "Calendario", to: "/calendario" },
    { name: "Pacientes", to: "/pacientes" },
    { name: "Doctores", to: "/doctores" },
    { name: "Tratamientos", to: "/tratamientos" },
    { name: "Procedimientos", to: "/procedimientos" },
    { name: "Materiales", to: "/materiales" },
    { name: "Equipos", to: "/equipos" },
    { name: "Proveedores", to: "/proveedores" },
    { name: "Inventario", to: "/inventario" },
    { name: "Servicios", to: "/servicios" },
    { name: "Especialidades", to: "/especialidades" },
    { name: "Horarios", to: "/horarios" },
    { name: "Notas", to: "/notas" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Botón hamburguesa para móvil */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        aria-label="Toggle menu"
      >
        <motion.div
          animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </motion.div>
      </button>

      {/* Overlay para móvil */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static top-0 left-0 z-40
        h-screen w-64 flex flex-col border-r border-gray-200/50 dark:border-gray-800/50 
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        overflow-hidden
      `}>
      <div className="flex flex-col h-full p-5 overflow-hidden">
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
        {!loading && user && (
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
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModalOpen(true)}
                  className="text-left w-full"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                    {user.nombre} {user.apellido}
                  </p>
                </motion.button>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                  {user.rol?.nombre || "Usuario"}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navegación principal */}
        <nav className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
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
                  onClick={() => setIsMobileMenuOpen(false)}
                />
              </motion.div>
            );
          })}
        </nav>

        {/* Footer con logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto border-t border-gray-200/50 dark:border-gray-700/50 pt-4 flex-shrink-0"
        >
          <SidebarLink
            name="Salir"
            icon={LogOut}
            to="#"
            isLogout={true}
            onClick={(e) => {
              e.preventDefault();
              setIsMobileMenuOpen(false);
              handleLogout();
            }}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
            © 2025 ortho&mas
          </p>
        </motion.div>
      </div>

      {/* Modal de Perfil */}
      <PerfilModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={user}
        onUpdate={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }}
      />
      </aside>
    </>
  );
};

export default Sidebar;
