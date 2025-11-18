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

  const fetchCitas = async () => {
    try {
      setLoading(true);
      const res = await api.get(`api/citas/doctor/${doctorId}?fecha=${fechaFiltro}`);
      if (res.data.success) {
        setCitas(res.data.citas);
      } else {
        setCitas([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al obtener citas");
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
    // eslint-disable-next-line
  }, [fechaFiltro]);

  const actualizarEstado = async (id, estado) => {
    try {
      const res = await api.put(`api/citas/${id}/estado`, { estado });
      if (res.data.success) {
        toast.success("Estado actualizado");
        fetchCitas();
      } else {
        toast.error(res.data.message || "Error al actualizar");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error al actualizar estado");
    }
  };

  return (
    <div className="p-6 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Mis Citas</h2>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all"
          />
        </header>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">#</th>
                <th className="px-4 py-3 text-left font-semibold">Paciente</th>
                <th className="px-4 py-3 text-left font-semibold">Servicio</th>
                <th className="px-4 py-3 text-left font-semibold">Hora</th>
                <th className="px-4 py-3 text-left font-semibold">Estado</th>
                <th className="px-4 py-3 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500 dark:text-gray-400">
                    Cargando...
                  </td>
                </tr>
              ) : citas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No hay citas para esta fecha
                  </td>
                </tr>
              ) : (
                citas.map((c, idx) => (
                  <tr 
                    key={c.id} 
                    className="border-t border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-medium">
                      {c.paciente_nombre} {c.paciente_apellido}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{c.servicio || c.nota || 'Consulta'}</td>
                    <td className="px-4 py-3 font-mono text-gray-800 dark:text-gray-200">{c.hora}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        c.estado === "Programada" 
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700" :
                        c.estado === "Completada" 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700" 
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700"
                      }`}>
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {c.estado !== "Completada" && (
                          <button 
                            title="Marcar como atendida" 
                            onClick={() => actualizarEstado(c.id, "Completada")} 
                            className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors"
                          >
                            <FaCheck />
                          </button>
                        )}
                        {c.estado !== "Cancelada" && (
                          <button 
                            title="Marcar como no atendida" 
                            onClick={() => actualizarEstado(c.id, "Cancelada")} 
                            className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        )}
                      </div>
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
