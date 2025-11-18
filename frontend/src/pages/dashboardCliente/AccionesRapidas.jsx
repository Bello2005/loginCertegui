// src/components/AccionesRapidas.jsx
import React from "react";
// 💡 Usar Link para navegación interna de React Router (Mejora UX)
import { Link } from 'react-router-dom';

// Importa tus iconos aquí (ej. import { CalendarPlus, XCircle } from 'lucide-react';)

const AccionesRapidas = () => {
  return (
    // 💡 UI: Sombra mejorada y bordes más redondeados
    <div className="lg:col-span-1 p-4">
      <div className="flex flex-col gap-4 p-8 rounded-xl bg-white dark:bg-slate-800 h-full shadow-lg border border-gray-100 dark:border-slate-700">

        {/* 💡 UI: Título con un color más fuerte */}
        <h3 className="text-gray-900 dark:text-gray-50 text-2xl font-extrabold tracking-tight">
          Acciones Rápidas ⚡
        </h3>

        {/* 💡 UI: Descripción más concisa */}
        <p className="text-gray-500 dark:text-gray-400 text-base">
          Accede directamente a las tareas más comunes de gestión.
        </p>

        <div className="flex flex-col gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-slate-700">

          {/* 1. Botón Primario: Agendar Nueva Cita */}
          {/* 💡 UX: Usar Link directamente y añadir icono */}
          <Link
            to="/cliente/nueva-cita"
            className="flex w-full items-center justify-center rounded-lg h-12 px-5 
                           bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-base font-semibold shadow-md 
                           hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500
                           transition duration-150 transform hover:scale-[1.01]"
          >
            {/* Reemplazar 🗓️ con tu componente de Icono (ej. <CalendarPlus className="w-5 h-5 mr-2" />) */}
            🗓️ Agendar Nueva Cita
          </Link>


          {/* 2. Botón Secundario: Cancelar Cita */}
          {/* 💡 UI/UX: Mejorar el estilo secundario, añadir borde y hover para claridad */}
          <Link
            to="/cliente"
            className="flex w-full items-center justify-center rounded-lg h-12 px-5 
                           text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400
                           bg-transparent 
                           hover:bg-indigo-50 dark:hover:bg-indigo-900/30
                           text-base font-semibold transition duration-150"
          >
            {/* Reemplazar 🗑️ con tu componente de Icono (ej. <XCircle className="w-5 h-5 mr-2" />) */}
            🗑️ Ver Historial
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccionesRapidas;