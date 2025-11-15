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
  // TODO: Actualizar endpoint al nuevo backend Node.js
  const fetchCitas = async () => {
    try {
      // Temporalmente usando datos mock hasta que se implemente el endpoint
      setCitas([]);
      setLoading(false);
      
      // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas/calendario)
      // const res = await api.get("calendario.php");
      // if (res.data.success) {
      //   const citasData = res.data.data.map((c) => ({
      //     id: c.cita_id,
      //     title: `${c.servicio} - ${c.paciente_nombre} ${c.paciente_apellido}`,
      //     start: new Date(`${c.fecha}T${c.hora}`),
      //     end: new Date(
      //       new Date(`${c.fecha}T${c.hora}`).getTime() + 30 * 60000
      //     ), // duración de 30 min
      //     estado: c.estado,
      //     doctor: `${c.doctor_nombre} ${c.doctor_apellido}`,
      //     descripcion: c.descripcion_servicio,
      //   }));
      //   setCitas(citasData);
      // } else {
      //   toast.error("Error al cargar las citas");
      // }
    } catch (err) {
      console.error("Error al cargar citas:", err);
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
    // TODO: Implementar cuando el endpoint esté disponible
    toast.info("Funcionalidad pendiente de implementar en el backend");
    setModalOpen(false);
    // try {
    //   // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas)
    //   const res = await axios.post("calendario.php", nuevaCita);
    //   if (res.data.success) {
    //     toast.success("Cita agendada correctamente");
    //     setModalOpen(false);
    //     fetchCitas();
    //     setNuevaCita({
    //       paciente_id: "",
    //       doctor_id: "",
    //       servicio_id: "",
    //       fecha: "",
    //       hora: "",
    //     });
    //   } else {
    //     toast.error(res.data.message || "Error al agendar la cita");
    //   }
    // } catch {
    //   toast.error("Error en el servidor");
    // }
  };

  // =============================
  // 🔹 3. Eliminar cita
  // =============================
  const eliminarCita = async (id) => {
    if (window.confirm("¿Deseas eliminar esta cita?")) {
      // TODO: Implementar cuando el endpoint esté disponible
      toast.info("Funcionalidad pendiente de implementar en el backend");
      // try {
      //   // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas/${id})
      //   const res = await axios.delete(`calendario.php?id=${id}`);
      //   if (res.data.success) {
      //     toast.success("Cita eliminada correctamente");
      //     fetchCitas();
      //   } else {
      //     toast.error(res.data.message);
      //   }
      // } catch {
      //   toast.error("Error al eliminar la cita");
      // }
    }
  };

  // =============================
  // 🔹 4. Render principal
  // =============================
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="p-8 pb-4">
          <HeaderDashboard title="Panel de Administración" />
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CalendarDays className="w-6 h-6 text-blue-600" />
              Calendario de Citas
            </h2>

          </div>

          {/* Calendario */}
          {loading ? (
            <p className="text-gray-500 text-center">Cargando citas...</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-[400px] p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
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
                className="border rounded-lg p-2"
                required
              />
              <input
                type="number"
                placeholder="ID Doctor"
                value={nuevaCita.doctor_id}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, doctor_id: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              <input
                type="number"
                placeholder="ID Servicio"
                value={nuevaCita.servicio_id}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, servicio_id: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              <input
                type="date"
                value={nuevaCita.fecha}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, fecha: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              <input
                type="time"
                value={nuevaCita.hora}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, hora: e.target.value })
                }
                className="border rounded-lg p-2"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
