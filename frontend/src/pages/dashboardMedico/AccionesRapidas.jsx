// src/components/AccionesRapidas.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarPlus, FaUserMd, FaClipboardList } from "react-icons/fa";

const AccionesRapidas = () => {
  // 💡 Datos de acciones rápidas (con rutas de destino)
  const acciones = [
    { icon: <FaCalendarPlus />, label: "Agendar Cita", link: "/nueva-cita" },
    { icon: <FaUserMd />, label: "Ver Doctores", link: "/doctores" },
    { icon: <FaClipboardList />, label: "Mis Citas", link: "/historial" },
  ];

  return (
    <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700 transition-all">
      {/* 🦷 Título principal */}
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6 flex items-center gap-2">
        ⚡ Acciones Rápidas
      </h2>

      {/* 🔗 Botones de acción */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {acciones.map((accion) => (
          <Link
            key={accion.label}
            to={accion.link}
            className="flex flex-col items-center justify-center p-5 rounded-xl text-center transition-all duration-200 
                       bg-gray-50 dark:bg-slate-700/40 hover:bg-teal-50 dark:hover:bg-slate-700 
                       border border-transparent hover:border-teal-300 dark:hover:border-teal-500 
                       shadow-sm group cursor-pointer"
          >
            {/* Ícono */}
            <div className="text-3xl text-teal-600 dark:text-teal-400 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-200">
              {accion.icon}
            </div>

            {/* Texto */}
            <span className="text-sm mt-3 font-semibold text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
              {accion.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default AccionesRapidas;
