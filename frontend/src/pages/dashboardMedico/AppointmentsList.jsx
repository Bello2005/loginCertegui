import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { api } from "../../services/api";

const getStatusClasses = (estado) => {
  switch (estado) {
    case "Confirmada":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "Pendiente":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    case "Completada":
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    case "Cancelada":
      return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
  }
};

const AppointmentsList = () => {
  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  useEffect(() => {
    // Temporalmente usando datos mock hasta que se implemente el endpoint
    setCitas([]);
    setCargando(false);
    
    // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/citas/hoy)
    // api
    //   .get("medico2.php")
    //   .then((res) => {
    //     setCitas(res.data);
    //     setCargando(false);
    //   })
    //   .catch((err) => {
    //     console.error("Error al cargar citas:", err);
    //     setCargando(false);
    //   });
  }, []);

  const hasAppointments = citas.length > 0;

  if (cargando) {
    return (
      <section className="bg-white dark:bg-slate-800 p-7 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
        <h2 className="text-gray-900 dark:text-gray-50 text-2xl font-bold pb-4 border-b border-gray-200 dark:border-slate-700 mb-4">
          Citas para Hoy 🕐
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 py-10">
          Cargando citas...
        </p>
      </section>
    );
  }

  return (
    <section className="bg-white dark:bg-slate-800 p-7 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 transition-all">
      <h2 className="text-gray-900 dark:text-gray-50 text-2xl font-bold pb-4 border-b border-gray-200 dark:border-slate-700 mb-4">
        Citas para Hoy 🕐
      </h2>

      {hasAppointments ? (
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-slate-700">
          {citas.map((cita) => (
            <Link
              key={cita.id}
              to={`/citas/${cita.id}`}
              className="flex items-center justify-between py-4 px-3 rounded-lg hover:bg-teal-50 dark:hover:bg-slate-700/40 transition"
            >
              <div className="flex items-center gap-6 flex-grow">
                <p className="text-gray-900 dark:text-white font-extrabold text-lg w-20 flex-shrink-0">
                  {cita.hora}
                </p>
                <div className="flex flex-col flex-grow">
                  <p className="text-gray-900 dark:text-white font-semibold text-base">
                    {cita.nombre}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">{cita.tipo}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${getStatusClasses(
                  cita.estado
                )}`}
              >
                {cita.estado}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-slate-700/40 rounded-xl">
          <span className="material-symbols-outlined text-5xl text-gray-400 dark:text-gray-500 mb-3">
            event_busy
          </span>
          <p className="text-gray-800 dark:text-gray-100 font-semibold mb-2">
            ¡Todo despejado! No tienes citas agendadas para hoy.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Aprovecha para agendar tu próxima visita.
          </p>
          <Link
            to="/nueva-cita"
            className="flex items-center justify-center rounded-lg h-10 px-5 bg-teal-600 text-white text-sm font-semibold shadow-md hover:bg-teal-700 transition"
          >
            + Agendar Nueva Cita
          </Link>
        </div>
      )}
    </section>
  );
};

export default AppointmentsList;
