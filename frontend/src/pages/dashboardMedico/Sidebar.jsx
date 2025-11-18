import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTooth, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Stethoscope, UserCircle2, FileText, Clock, Heart, ClipboardList } from "lucide-react";
import { api } from "../../services/api";
import PerfilModal from "../../components/PerfilModal";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
    { icon: LayoutDashboard, label: "Dashboard", path: "/medico" },
    { icon: FileText, label: "Notas", path: "/medico/notas" },
    { icon: Clock, label: "Horarios", path: "/medico/horarios" },
    { icon: Heart, label: "Tratamientos", path: "/medico/tratamientos" },
    { icon: ClipboardList, label: "Procedimientos", path: "/medico/procedimientos" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="flex flex-col justify-between h-screen w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 p-4 shadow-xl">
      <div>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-2 pb-6 border-b border-gray-200/50 dark:border-gray-700/50"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-3 rounded-xl shadow-lg"
          >
            <FaTooth className="text-white text-2xl" />
          </motion.div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              ortho&mas
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Panel Médico</p>
          </div>
        </motion.div>

        {/* Usuario */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-6 mt-6"
        >
          {!loading && user && (
            <div className="flex gap-3 items-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-700/50 shadow-md">
              <div className="relative">
                <UserCircle2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setModalOpen(true)}
                  className="text-left w-full"
                >
                  <h2 className="text-gray-900 dark:text-white font-semibold text-sm truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                    {user?.rol?.nombre === "doctor" ? "Dr. " : ""}{user?.nombre || "Nombre"} {user?.apellido || "Apellido"}
                  </h2>
                </motion.button>
                <p className="text-gray-500 dark:text-gray-300 text-xs capitalize">{user?.rol?.nombre || "Rol"}</p>
              </div>
            </div>
          )}

          {/* Menú */}
          <nav className="flex flex-col gap-2 mt-4">
            {menuItems.map((item, i) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 font-semibold ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/30"
                        : "hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      </div>

      {/* Cerrar sesión */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ x: 4 }}
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/30 dark:hover:to-rose-900/30 text-red-600 dark:text-red-400 hover:text-red-700 transition-all duration-200 font-semibold"
        >
          <FaSignOutAlt />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </motion.div>

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
  );
};

export default Sidebar;
