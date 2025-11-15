import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { api } from "../../services/api";


const DoctorAppointmentsDashboard = ({ doctorId }) => {
  const [fechaFiltro, setFechaFiltro] = useState(dayjs().format("YYYY-MM-DD"));
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(false);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  const fetchCitas = async () => {
    try {
      setLoading(true);
      // Temporalmente usando datos mock hasta que se implemente el endpoint
      setCitas([]);
      setLoading(false);
      
      // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas/doctor/${doctorId}?fecha=${fechaFiltro})
      // const res = await api.get(`appointments_doctor.php?action=list&doctor_id=${doctorId}&fecha=${fechaFiltro}`);
      // if (res.data.success) setCitas(res.data.citas);
      // else setCitas([]);
    } catch (err) {
      console.error(err);
      toast.error("Error al obtener citas");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
    // eslint-disable-next-line
  }, [fechaFiltro]);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  const actualizarEstado = async (id, estado) => {
    // TODO: Implementar cuando el endpoint esté disponible
    toast.info("Funcionalidad pendiente de implementar en el backend");
    // try {
    //   // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas/${id}/estado)
    //   const res = await api.post(`appointments_doctor.php?action=update_status`, { id, estado });
    //   if (res.data.success) {
    //     toast.success("Estado actualizado");
    //     fetchCitas();
    //   } else {
    //     toast.error(res.data.error || "Error al actualizar");
    //   }
    // } catch (err) {
    //   console.error(err);
    //   toast.error("Error al actualizar estado");
    // }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mis Citas</h2>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white dark:bg-slate-800"
          />
        </header>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Paciente</th>
                <th className="px-4 py-3 text-left">Servicio</th>
                <th className="px-4 py-3 text-left">Hora</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="6" className="p-6 text-center">Cargando...</td></tr>
              ) : citas.length === 0 ? (
                <tr><td colSpan="6" className="p-6 text-center">No hay citas para esta fecha</td></tr>
              ) : (
                citas.map((c, idx) => (
                  <tr key={c.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3">{idx + 1}</td>
                    <td className="px-4 py-3">{c.paciente_nombre} {c.paciente_apellido}</td>
                    <td className="px-4 py-3">{c.servicio}</td>
                    <td className="px-4 py-3 font-mono">{c.hora}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        c.estado === "Programada" ? "bg-yellow-100 text-yellow-800" :
                        c.estado === "Completada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {c.estado !== "Completada" && (
                        <button title="Marcar como atendida" onClick={() => actualizarEstado(c.id, "Completada")} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700">
                          <FaCheck />
                        </button>
                      )}
                      {c.estado !== "Cancelada" && (
                        <button title="Marcar como no atendida" onClick={() => actualizarEstado(c.id, "Cancelada")} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600">
                          <FaTimes />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointmentsDashboard;
