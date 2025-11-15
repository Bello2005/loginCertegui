// src/components/ProximaCita.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaUserMd } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

const ProximaCita = () => {
  // 📅 Datos simulados
  const cita = {
    id: 101,
    fechaHoraISO: "2025-11-15T10:30:00",
    doctor: "Dra. Marcela Gómez",
    especialidad: "Ortodoncia",
  };

  const appointmentTime = dayjs(cita.fechaHoraISO);
  const timeUntil = appointmentTime.fromNow();

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700">
      {/* 🕒 Título y tiempo restante */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-3 flex justify-between items-center">
        Próxima Cita 🔔
        <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/50 px-3 py-1 rounded-full">
          {timeUntil.charAt(0).toUpperCase() + timeUntil.slice(1)}
        </span>
      </h2>

      <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
        {/* 📆 Fecha y hora */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-dashed border-gray-200 dark:border-slate-700/50">
          <div className="flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light font-extrabold text-center">
            <p className="text-xl leading-none">{appointmentTime.format("DD")}</p>
            <p className="text-xs uppercase">{appointmentTime.format("MMM")}</p>
          </div>
          <div>
            <p className="text-gray-900 dark:text-white text-2xl font-extrabold leading-tight">
              {cita.especialidad}
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-base font-semibold flex items-center">
              <FaClock className="inline-block size-4 mr-2 text-brand" />
              {appointmentTime.format("h:mm A")}
            </p>
          </div>
        </div>

        {/* 👩‍⚕️ Información del doctor */}
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p className="flex items-center text-base">
            <FaUserMd className="text-brand dark:text-brand-light mr-3 size-4 flex-shrink-0" />
            <span className="font-semibold text-gray-900 dark:text-white mr-1">
              Doctor(a):
            </span>
            {cita.doctor}
          </p>
        </div>

        {/* 🔗 Botón de acción */}
        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700">
          <Link
            to={`/citas/${cita.id}/detalles`}
            className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition duration-150 shadow-md"
          >
            Ver Detalles de la Cita
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProximaCita;
