import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import HeaderDashboard from "./HeaderDashboard";
import StatCard from "./StatCard";
import CitasChart from "./CitasChart";
import EstadoCitasChart from "./EstadoCitasChart";
import TablaProximasCitas from "./TablaProximasCitas";
import Footer from "./Footer";
import { CalendarDays, DollarSign, UserPlus, CheckCircle2 } from "lucide-react";
import { api } from "../../services/api";

const DashboardAdmin = () => {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar que el usuario sea admin
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.rol?.nombre?.toLowerCase();
    
    if (!user || !["admin", "administrador"].includes(userRole)) {
      toast.error("No tienes permisos para acceder a esta página");
      const roleRouteMap = {
        paciente: "/cliente",
        doctor: "/medico",
      };
      navigate(roleRouteMap[userRole] || "/", { replace: true });
      return;
    }
  }, [navigate]);

  useEffect(() => {
    api
      .get("api/admin/estadisticas")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        // Fallback a datos mock en caso de error
        setStats({
          citas_hoy: 0,
          ingresos_mes: 0,
          pacientes_nuevos: 0,
          tasa_confirmacion: 0,
          porcentajes: {
            citas: "+0%",
            ingresos: "+0%",
            pacientes: "+0%",
            tasa: "0%"
          }
        });
      });
  }, []);

  if (!stats) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-600 dark:text-gray-400">Cargando estadísticas...</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden min-w-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1"
        >
          {/* Header */}
          <div className="p-6 md:p-8 pb-4">
            <HeaderDashboard title="Panel de Administración" />
          </div>

          {/* Tarjetas de Estadísticas */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-8 py-4">
            <motion.div variants={containerVariants}>
              <StatCard
                title="Citas Hoy"
                value={stats.citas_hoy}
                percent={stats.porcentajes?.citas || "+0%"}
                color="text-green-600"
                icon={CalendarDays}
              />
            </motion.div>
            <motion.div variants={containerVariants}>
              <StatCard
                title="Ingresos del Mes"
                value={`$${stats.ingresos_mes.toLocaleString()}`}
                percent={stats.porcentajes?.ingresos || "+0%"}
                color="text-green-600"
                icon={DollarSign}
              />
            </motion.div>
            <motion.div variants={containerVariants}>
              <StatCard
                title="Pacientes Nuevos"
                value={stats.pacientes_nuevos}
                percent={stats.porcentajes?.pacientes || "+0%"}
                color="text-green-600"
                icon={UserPlus}
              />
            </motion.div>
            <motion.div variants={containerVariants}>
              <StatCard
                title="Tasa de Confirmación"
                value={`${stats.tasa_confirmacion}%`}
                percent={stats.porcentajes?.tasa || "0%"}
                color={stats.porcentajes?.tasa?.startsWith("+") ? "text-green-600" : "text-red-600"}
                icon={CheckCircle2}
              />
            </motion.div>
          </section>

          {/* Gráficos */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 md:px-8 mt-6">
            <motion.div
              variants={containerVariants}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <CitasChart />
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <EstadoCitasChart />
            </motion.div>
          </section>

          {/* Tabla de Próximas Citas */}
          <section className="px-6 md:px-8 mt-6 mb-8">
            <motion.div
              variants={containerVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <TablaProximasCitas />
            </motion.div>
          </section>

          {/* Footer */}
          <div className="mt-auto px-6 md:px-8 pb-6">
            <Footer />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
