// src/pages/CalendarioCitas.jsx
import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import { format, parseISO } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "moment/locale/es";
import axios from "axios";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";
import { CalendarDays, Plus } from "lucide-react";
import { toast } from "react-toastify";
import {api} from "../../services/api";

moment.locale("es");
const localizer = momentLocalizer(moment);
// TODO: Actualizar endpoint al nuevo backend Node.js
// const API_URL = api + "calendario.php"; // Eliminado - usar backend Node.js

const CalendarioCitas = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    paciente_id: "",
    doctor_id: "",
    servicio_id: "",
    fecha: "",
    hora: "",
  });

  // =============================
  // 🔹 1. Cargar citas del backend
  // =============================
  const fetchCitas = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/citas/calendario");
      if (res.data.success) {
        const citasData = res.data.data.map((c) => ({
          id: c.cita_id,
          title: `${c.servicio || 'Cita'} - ${c.paciente_nombre} ${c.paciente_apellido || ''}`,
          start: new Date(`${c.fecha}T${c.hora}`),
          end: new Date(
            new Date(`${c.fecha}T${c.hora}`).getTime() + 30 * 60000
          ), // duración de 30 min
          estado: c.estado,
          doctor: `${c.doctor_nombre} ${c.doctor_apellido || ''}`,
          descripcion: c.descripcion_servicio || c.servicio,
        }));
        setCitas(citasData);
      } else {
        toast.error("Error al cargar las citas");
        setCitas([]);
      }
    } catch (err) {
      console.error("Error al cargar citas:", err);
      toast.error("Error al cargar las citas");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  // =============================
  // 🔹 2. Guardar nueva cita
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("api/citas", {
        pacienteId: nuevaCita.paciente_id,
        doctorId: nuevaCita.doctor_id,
        fecha: nuevaCita.fecha,
        hora: nuevaCita.hora,
        nota: nuevaCita.servicio_id || ""
      });
      if (res.data.success) {
        toast.success("Cita agendada correctamente");
        setModalOpen(false);
        fetchCitas();
        setNuevaCita({
          paciente_id: "",
          doctor_id: "",
          servicio_id: "",
          fecha: "",
          hora: "",
        });
      } else {
        toast.error(res.data.message || "Error al agendar la cita");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error en el servidor");
    }
  };

  // =============================
  // 🔹 3. Eliminar cita
  // =============================
  const eliminarCita = async (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      try {
        const res = await api.delete(`api/citas/${id}`);
        if (res.data.success) {
          toast.success("Cita eliminada correctamente");
          fetchCitas();
        } else {
          toast.error(res.data.message || "Error al eliminar");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Error al eliminar la cita");
      }
    }
  };

  // =============================
  // 🔹 4. Render principal
  // =============================
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden min-w-0">
        {/* Header */}
        <div className="p-8 pb-4 flex-shrink-0">
          <HeaderDashboard title="Calendario de Citas" />
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Calendario de Citas
            </h2>

          </div>

          {/* Calendario */}
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center">Cargando citas...</p>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl h-[600px] p-4 bg-gray-50 dark:bg-gray-800">
              <BigCalendar
                localizer={localizer}
                events={citas}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 540 }}
                messages={{
                  next: "Sig.",
                  previous: "Ant.",
                  today: "Hoy",
                  month: "Mes",
                  week: "Semana",
                  day: "Día",
                }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor:
                      event.estado === "Completada"
                        ? "#10b981"
                        : event.estado === "Cancelada"
                        ? "#ef4444"
                        : "#3b82f6",
                    color: "white",
                    borderRadius: "8px",
                    padding: "4px",
                  },
                })}
                onSelectEvent={(event) =>
                  eliminarCita(event.id)
                }
              />
            </div>
          )}
        </div>

        <div className="mt-auto px-8 pb-6">
          <Footer />
        </div>
      </main>

      {/* =============================
          🔹 Modal Nueva Cita
      ============================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-[400px] p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Agendar Nueva Cita
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="number"
                placeholder="ID Paciente"
                value={nuevaCita.paciente_id}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, paciente_id: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                required
              />
              <input
                type="number"
                placeholder="ID Doctor"
                value={nuevaCita.doctor_id}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, doctor_id: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                required
              />
              <input
                type="number"
                placeholder="ID Servicio"
                value={nuevaCita.servicio_id}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, servicio_id: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                required
              />
              <input
                type="date"
                value={nuevaCita.fecha}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, fecha: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              <input
                type="time"
                value={nuevaCita.hora}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, hora: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 bg-gray-400 dark:bg-gray-600 text-white rounded-lg hover:bg-gray-500 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioCitas;
