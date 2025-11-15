import React from "react";
import { UserPlus, Edit3, Trash2 } from "lucide-react";

const AutoresDashboard = () => {
  const autores = [
    { nombre: "Dr. Carlos Ruiz", especialidad: "Ortodoncia", correo: "carlos@clinic.com" },
    { nombre: "Dra. María Torres", especialidad: "Endodoncia", correo: "maria@clinic.com" },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Autores / Doctores</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition-all">
          <UserPlus className="w-5 h-5" /> Nuevo Doctor
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Especialidad</th>
              <th className="px-6 py-3 font-semibold">Correo</th>
              <th className="px-6 py-3 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {autores.map((a) => (
              <tr key={a.correo} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium">{a.nombre}</td>
                <td className="px-6 py-4">{a.especialidad}</td>
                <td className="px-6 py-4">{a.correo}</td>
                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  <button className="text-blue-600 hover:text-blue-800"><Edit3 className="w-5 h-5" /></button>
                  <button className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutoresDashboard;
