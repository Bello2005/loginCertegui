import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CalendarDays, CalendarRange } from "lucide-react";
import {api} from '../../services/api'

// TODO: Actualizar endpoint al nuevo backend Node.js
// const API_URL = "http://localhost/ortho_mas/backend.php"; // Eliminado - usar backend Node.js

const viewOptions = [
  { label: "Vista del Día", value: "day", icon: <CalendarDays className="w-4 h-4" /> },
  { label: "Vista Semanal", value: "week", icon: <CalendarRange className="w-4 h-4" /> },
];

const SegmentedButtons = ({ initialView = "day" }) => {
  const [activeView, setActiveView] = useState(initialView);
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔄 Cargar citas al montar o cambiar vista
  useEffect(() => {
    obtenerCitas(activeView);
  }, [activeView]);

  // 📅 Función para obtener citas del backend
  // TODO: Actualizar endpoint al nuevo backend Node.js (ej: /api/citas/medico?view=${vista})
  const obtenerCitas = async (vista) => {
    try {
      setLoading(true);
      // Temporalmente usando datos mock hasta que se implemente el endpoint
      setCitas([]);
      setLoading(false);
      
      // TODO: Reemplazar con endpoint del nuevo backend
      // const res = await api.get(`medico1.php?action=obtener_citas&vista=${vista}`);
      // setCitas(res.data);
    } catch (error) {
      toast.error("Error al cargar las citas");
      console.error(error);
      setLoading(false);
    }
  };

  // 🧭 Cambiar vista
  const handleViewChange = (view) => {
    setActiveView(view);
  };

  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-slate-800 shadow-md transition-all">
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 rounded-xl p-1 mb-4">
        {viewOptions.map((option) => {
          const isActive = option.value === activeView;
          const buttonClasses = `
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 
            ${isActive
              ? "bg-white dark:bg-slate-900 text-brand dark:text-brand-light shadow-md"
              : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"}
          `;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleViewChange(option.value)}
              className={buttonClasses}
              aria-pressed={isActive}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Tabla de Citas */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md overflow-hidden">
        {loading ? (
          <p className="text-center py-6 text-gray-500">Cargando citas...</p>
        ) : citas.length === 0 ? (
          <p className="text-center py-6 text-gray-500">No hay citas programadas</p>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Paciente</th>
                <th className="px-4 py-2">Doctor</th>
                <th className="px-4 py-2">Servicio</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Hora</th>
                <th className="px-4 py-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {citas.map((cita, index) => (
                <tr
                  key={cita.id}
                  className={`border-b hover:bg-gray-100 dark:hover:bg-slate-800 ${
                    cita.estado === "Cancelada" ? "text-red-500" : ""
                  }`}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{cita.paciente}</td>
                  <td className="px-4 py-2">{cita.doctor}</td>
                  <td className="px-4 py-2">{cita.servicio}</td>
                  <td className="px-4 py-2">{cita.fecha}</td>
                  <td className="px-4 py-2">{cita.hora}</td>
                  <td className="px-4 py-2 font-semibold">{cita.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SegmentedButtons;
