import { useEffect, useState } from "react";
import {api} from "../../services/api";
import { UserPlus, Eye } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";

const Pages = () => {
  const [pacientes, setPacientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  useEffect(() => {
    // Temporalmente usando datos mock hasta que se implemente el endpoint
    setPacientes([]);
    setCargando(false);
    
    // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/pacientes)
    // api
    //   .get("pacientes.php")
    //   .then((res) => {
    //     setPacientes(res.data);
    //     setCargando(false);
    //   })
    //   .catch((err) => {
    //     console.error("Error al cargar pacientes:", err);
    //     setCargando(false);
    //   });
  }, []);

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-600 dark:text-gray-300">
        Cargando pacientes...
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg transition hover:shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Pacientes
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Nombre</th>
              <th className="px-6 py-3 font-semibold">Correo</th>
              <th className="px-6 py-3 font-semibold">Última Cita</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p, idx) => (
              <tr
                key={p.id}
                className={`border-t dark:border-gray-700 ${
                  idx % 2 === 0
                    ? "bg-white dark:bg-gray-900"
                    : "bg-gray-50 dark:bg-gray-800/50"
                } hover:bg-blue-50 dark:hover:bg-gray-800 transition`}
              >
                <td className="px-6 py-4 font-medium">{p.nombre}</td>
                <td className="px-6 py-4">{p.correo}</td>
                <td className="px-6 py-4">{p.fecha || "Sin citas"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PacientesDashboard = () => (
  <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <div className="p-8 pb-4">
        <HeaderDashboard title="Panel de Administración" />
      </div>
      <main className="flex-1 flex flex-col gap-8 px-8 overflow-y-auto">
        <Pages />
      </main>
      <div className="mt-auto px-8 pb-6">
        <Footer />
      </div>
    </div>
  </div>
);

export default PacientesDashboard;
