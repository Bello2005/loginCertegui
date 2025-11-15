import { useEffect, useState } from "react";
import axios from "axios";
import { UserPlus, Edit3, Trash2 } from "lucide-react";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderDashboard from "./HeaderDashboard";
import { api } from "../../services/api";

const DoctorDashboard = () => {
  const [doctores, setDoctores] = useState([]);
  const [loading, setLoading] = useState(true);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  // const API_URL = api + "doctores2.php"; // Eliminado - usar backend Node.js

  const fetchDoctores = () => {
    setLoading(true);
    // Temporalmente usando datos mock hasta que se implemente el endpoint
    setDoctores([]);
    setLoading(false);
    
    // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/doctores)
    // api.get('doctores2.php')
    //   .then(res => setDoctores(res.data))
    //   .finally(() => setLoading(false));
  };

  const agregarDoctor = () => {
    const nombre = prompt("Nombre:");
    const apellido = prompt("Apellido:");
    const correo = prompt("Correo:");
    const password = prompt("Password:");
    if(nombre && apellido && correo && password) {
      // TODO: Implementar cuando el endpoint esté disponible
      alert("Funcionalidad pendiente de implementar en el backend");
      // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/doctores)
      // api.post('doctores2.php', { nombre, apellido, correo, password })
      //   .then(fetchDoctores);
    }
  };

  const editarDoctor = (d) => {
    const nombre = prompt("Nombre:", d.nombre.split(" ")[0]);
    const apellido = prompt("Apellido:", d.nombre.split(" ")[1] || "");
    const correo = prompt("Correo:", d.correo);
    if(nombre && apellido && correo) {
      // TODO: Implementar cuando el endpoint esté disponible
      alert("Funcionalidad pendiente de implementar en el backend");
      // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/doctores/${d.id})
      // api.put('doctores2.php', { id: d.id, nombre, apellido, correo })
      //     .then(fetchDoctores);
    }
  };

  const eliminarDoctor = (id) => {
    if(window.confirm("¿Eliminar este doctor?")) {
      // TODO: Implementar cuando el endpoint esté disponible
      alert("Funcionalidad pendiente de implementar en el backend");
      // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/doctores/${id})
      // api.delete(`doctores2.php?id=${id}`)
      //   .then(fetchDoctores);
    }
  };

  useEffect(() => { fetchDoctores() }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-8 pb-4">
          <HeaderDashboard title="Panel de Administración" />
        </div>
        <main className="flex-1 flex flex-col gap-8 px-8 overflow-y-auto">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Doctores</h2>
              <button onClick={agregarDoctor} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow transition-all">
                <UserPlus className="w-5 h-5" /> Nuevo Doctor
              </button>
            </div>

            {loading ? <p>Cargando...</p> :
            <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Nombre</th>
                    <th className="px-6 py-3 font-semibold">Correo</th>
                    <th className="px-6 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {doctores.map(d => (
                    <tr key={d.id} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-6 py-4 font-medium">{d.nombre}</td>
                      <td className="px-6 py-4">{d.correo}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button onClick={() => editarDoctor(d)} className="text-blue-600 hover:text-blue-800"><Edit3 className="w-5 h-5" /></button>
                        <button onClick={() => eliminarDoctor(d.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>}
          </div>
        </main>
        <div className="mt-auto px-8 pb-6">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
