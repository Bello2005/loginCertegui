import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { motion } from "framer-motion";
import { Calendar, Stethoscope, AlertCircle } from "lucide-react";
import CalendarGrid from "./CalendarGrid";
import HorasDisponibles from "./HorasDisponibles";
import ConfirmationModal from "./ConfirmationModal";
import {api} from "../../../services/api";

dayjs.locale("es");

const NuevaCita = ({ pacienteId: pacienteIdProp = null }) => {
  // estados principales
  const [especialistasData, setEspecialistasData] = useState([]); // viene del backend
  const [especialistaId, setEspecialistaId] = useState(null); // id numérico
  const [nota, setNota] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState(null); // valor "HH:mm"
  const [fechaSeleccionada, setFechaSeleccionada] = useState(dayjs());
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const [citaCreada, setCitaCreada] = useState(null);

  // obtener pacienteId: props -> localStorage -> fallback 4
  const pacienteId = useMemo(() => {
    if (pacienteIdProp) return pacienteIdProp;
    try {
      const u = JSON.parse(localStorage.getItem("usuario") || "null");
      if (u && u.id) return u.id;
    } catch (e) {
      // ignore
    }
    return 4;
  }, [pacienteIdProp]);

  // traer especialistas desde backend al montar
  // TODO: Actualizar endpoint al nuevo backend Node.js
  useEffect(() => {
    const fetchEspecialistas = async () => {
      try {
        // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/doctores)
        const res = await api.get("Cita3.php?accion=especialistas");
        // backend devuelve [{id, nombre, apellido, ...}]
        setEspecialistasData(res.data || []);
      } catch (err) {
        console.error("Error cargando especialistas:", err);
      }
    };
    fetchEspecialistas();
  }, []);

  // selectedEspecialista obj para pasarlo a HorasDisponibles y ConfirmationModal
  const selectedEspecialista = useMemo(() => {
    if (!especialistaId) return null;
    return especialistasData.find((e) => Number(e.id) === Number(especialistaId)) || null;
  }, [especialistaId, especialistasData]);

  const isFormValid = especialistaId && horaSeleccionada && fechaSeleccionada;

  const handleConfirmar = async () => {
    setError(null);
    if (!isFormValid) {
      setError("Formulario incompleto. Seleccione especialista, fecha y hora.");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        pacienteId,
        doctorId: Number(especialistaId),
        fecha: fechaSeleccionada.format("YYYY-MM-DD"),
        hora: horaSeleccionada, // backend espera "09:00"
        nota,
      }; 

      // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas)
      const res = await api.post("Cita3.php", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data && res.data.success) {
        setCitaCreada(res.data.cita);
        console.log("Cita creada:", res.data);
        setShowConfirmation(true);
      } else {
        setError(res.data.error || "Error al crear la cita");
      }
    } catch (err) {
      console.error(err);
      setError("Error creando la cita. Intente nuevamente.");
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowConfirmation(false);
    // opcional: resetear formulario
    setEspecialistaId(null);
    setNota("");
    setHoraSeleccionada(null);
    setFechaSeleccionada(dayjs());
    setCurrentMonth(dayjs());
    setCitaCreada(null);
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex items-center gap-3">
          <Calendar className="w-10 h-10 text-indigo-600" />
          Programar Nueva Cita
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-base">
          Seleccione un especialista, fecha y hora para agendar su cita
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          {/* Selección de Especialista desde backend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 transition-all hover:shadow-xl"
          >
            <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-indigo-600" />
              1. Seleccione Especialista
            </h2>
            <div className="space-y-3">
              {especialistasData.map((esp, index) => {
                const isSelected = Number(especialistaId) === Number(esp.id);
                return (
                  <motion.button
                    key={esp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEspecialistaId(esp.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3
                      ${isSelected
                        ? "border-indigo-500 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 shadow-md text-indigo-700 dark:text-indigo-300 font-bold"
                        : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 text-gray-800 dark:text-gray-300"
                      }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-indigo-100 dark:bg-indigo-900/50" : "bg-gray-100 dark:bg-slate-700"}`}>
                      <Stethoscope className={`w-5 h-5 ${isSelected ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className="font-semibold leading-none">{`${esp.nombre} ${esp.apellido}`}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{esp.especialidad || "Especialista"}</p>
                    </div>
                  </motion.button>
                );
              })}
              {especialistasData.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Cargando especialistas...
                </p>
              )}
            </div>
          </motion.div>

          {/* Nota */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 transition-all hover:shadow-xl"
          >
            <label htmlFor="nota" className="text-lg font-bold mb-4 block text-gray-800 dark:text-gray-200">
              3. Nota / Motivo de la visita (Opcional)
            </label>
            <textarea
              id="nota"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              rows={4}
              placeholder="e.g. Dolor en muela del juicio, chequeo anual..."
              className="w-full resize-none rounded-xl border border-gray-300 dark:border-slate-600 p-4 bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <CalendarGrid
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            fechaSeleccionada={fechaSeleccionada}
            setFechaSeleccionada={setFechaSeleccionada}
          />
          <HorasDisponibles
            fechaSeleccionada={fechaSeleccionada}
            selectedEspecialista={selectedEspecialista}
            allHorasDisponibles={[]} // ya no lo usamos; el componente consulta al backend
            horaSeleccionada={horaSeleccionada}
            setHoraSeleccionada={setHoraSeleccionada}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700 flex flex-col gap-3 items-end"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!isFormValid || creating}
          onClick={handleConfirmar}
          className="h-14 px-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed dark:disabled:bg-slate-700 transition-all duration-300"
        >
          {creating ? "Creando..." : "Confirmar Cita"}
        </motion.button>
      </motion.div>

      <ConfirmationModal
        isOpen={showConfirmation}
        cita={citaCreada || { especialistaId, fecha: fechaSeleccionada, hora: horaSeleccionada, nota }}
        especialista={selectedEspecialista}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default NuevaCita;
