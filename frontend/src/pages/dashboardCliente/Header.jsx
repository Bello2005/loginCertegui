// src/components/Header.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles, UserCircle2, Download, FileText } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import DarkModeToggle from "../../components/DarkModeToggle";
import { generateHistoriaClinicaPDF } from "../../utils/pdfGenerator";
import { api } from "../../services/api";
import { toast } from "react-toastify";

dayjs.locale("es");

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = dayjs().format("dddd, DD [de] MMMM");
  const [generandoPDF, setGenerandoPDF] = useState(false);

  const handleDownloadHistoriaClinica = async () => {
    if (!user || !user.id) {
      toast.error("Error: Usuario no encontrado");
      return;
    }

    setGenerandoPDF(true);
    try {
      toast.info("Generando historia clínica...");
      
      // Obtener información completa del paciente
      const pacienteRes = await api.get(`api/usuario/me?usuario_id=${user.id}`);
      const pacienteData = pacienteRes.data;
      
      // Obtener historial completo de citas (sin límite)
      const citasRes = await api.get(`api/citas?paciente_id=${user.id}`);
      const citas = Array.isArray(citasRes.data) ? citasRes.data : [];
      
      // Obtener notas médicas del paciente
      let notas = [];
      try {
        const notasRes = await api.get(`api/notas?paciente_id=${user.id}&page=1&limit=1000`);
        notas = notasRes.data?.data || [];
      } catch (error) {
        console.log("No se pudieron cargar las notas médicas:", error);
        // Continuar sin notas si no hay endpoint disponible
      }
      
      // Generar PDF
      await generateHistoriaClinicaPDF(pacienteData, citas, notas);
      toast.success("Historia clínica generada exitosamente");
    } catch (error) {
      console.error("Error generando historia clínica:", error);
      toast.error("Error al generar la historia clínica");
    } finally {
      setGenerandoPDF(false);
    }
  };

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

      {/* Sección Derecha: Descargar Historia + Notificaciones + Modo Oscuro + Perfil */}
      <div className="flex items-center gap-4">
        {/* Botón de Descargar Historia Clínica */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownloadHistoriaClinica}
          disabled={generandoPDF}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generandoPDF ? (
            <>
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-sm font-semibold">Generando...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold">Historia Clínica</span>
            </>
          )}
        </motion.button>

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
