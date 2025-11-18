// src/pages/Perfil.jsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck,
  Stethoscope,
  Smile,
  UserCircle2,
  LogOut,
  TrendingUp,
  Mail,
  CreditCard,
  User,
  Phone,
  CalendarPlus,
} from "lucide-react";

const Perfil = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          No hay usuario autenticado.
        </p>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Datos simulados de widgets
  const widgets = [
    {
      icon: CalendarCheck,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      label: "Próxima Cita",
      value: "15 Nov 2025, 9:00 AM",
    },
    {
      icon: Stethoscope,
      iconColor: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      label: "Tratamientos Completados",
      value: "12",
    },
    {
      icon: Smile,
      iconColor: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      label: "Satisfacción Promedio",
      value: "9.3 / 10",
    },
    {
      icon: UserCircle2,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      label: "Último Doctor Atendido",
      value: "Dr. Carlos Ruiz",
    },
  ];

  const infoItems = [
    { icon: Mail, label: "Correo", value: user.correo || "No especificado" },
    { icon: CreditCard, label: "Documento", value: user.documento || "No registrado" },
    { icon: User, label: "Usuario", value: user.username || "No definido" },
    { icon: Phone, label: "Teléfono", value: user.telefono || "No disponible" },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Mi Perfil
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base">
            Gestiona tu información personal y revisa tu historial
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition shadow-lg hover:shadow-xl"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </motion.button>
      </motion.div>

      {/* Información principal */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Perfil básico */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 flex flex-col gap-4"
        >
          <div className="flex items-center gap-4 border-b border-gray-200 dark:border-slate-700 pb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <UserCircle2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {user.nombre} {user.apellido}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user.rol?.nombre || "Paciente"}
              </p>
            </div>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
            {infoItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                    <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/cliente/nueva-cita")}
            className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2.5 rounded-xl text-sm font-medium transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            Agendar Nueva Cita
          </motion.button>
        </motion.div>

        {/* Widgets */}
        <div className="col-span-2 grid sm:grid-cols-2 gap-6">
          {widgets.map((w, index) => {
            const Icon = w.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 p-6 flex items-center justify-between hover:shadow-xl transition-all"
              >
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{w.label}</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {w.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${w.bgColor}`}>
                  <Icon className={`w-8 h-8 ${w.iconColor}`} />
                </div>
              </motion.div>
            );
          })}

          {/* Widget adicional: Evolución del paciente */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white p-6 rounded-2xl shadow-xl flex justify-between items-center col-span-2 hover:shadow-2xl transition-all"
          >
            <div>
              <p className="text-sm opacity-90 mb-1">Evolución del paciente</p>
              <p className="text-3xl font-bold">+14% mejora este mes</p>
            </div>
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <TrendingUp className="w-10 h-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
