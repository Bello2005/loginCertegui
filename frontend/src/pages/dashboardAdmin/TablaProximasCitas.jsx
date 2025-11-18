import React, { useEffect, useState } from "react";
import { CalendarDays, Eye, Download } from "lucide-react";
import { api } from "../../services/api";
import CitaModal from "../../components/CitaModal";
import { generateCitasPDF } from "../../utils/pdfGenerator";
import { toast } from "react-toastify";

const TablaProximasCitas = () => {
  const [citas, setCitas] = useState([]);
  const [selectedCitaId, setSelectedCitaId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await api.get("api/citas/proximas");
        // El endpoint devuelve { status: 'success', data: [...] }
        if (res.data && res.data.data) {
          const citasData = Array.isArray(res.data.data) ? res.data.data : [];
          // Filtrar solo citas que tengan un ID válido
          const citasValidas = citasData.filter(cita => cita.cita_id || cita.id);
          setCitas(citasValidas);
          console.log(`[Frontend] Citas próximas cargadas: ${citasValidas.length}`);
        } else if (Array.isArray(res.data)) {
          const citasValidas = res.data.filter(cita => cita.cita_id || cita.id);
          setCitas(citasValidas);
        } else {
          setCitas([]);
        }
      } catch (err) {
        console.error("Error obteniendo próximas citas:", err);
        setCitas([]);
      }
    };
    
    fetchCitas();
  }, []);

  const handleDownloadPDF = () => {
    try {
      toast.info("Generando PDF...");
      generateCitasPDF(citas);
      toast.success("PDF generado exitosamente");
    } catch (error) {
      console.error("Error generando PDF:", error);
      toast.error("Error al generar el PDF");
    }
  };

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <CalendarDays className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            Próximas Citas
          </h2>
        </div>
        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-lg transition-all"
        >
          <Download className="w-5 h-5" /> Descargar PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <table className="min-w-full divide-y divide-gray-200/50 dark:divide-gray-700/50">
              <thead className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30">
                <tr>
                  {["Paciente", "Doctor", "Servicio", "Hora", "Acción"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {citas.length > 0 ? (
                  citas.map((cita) => (
                    <tr
                      key={cita.cita_id || cita.id}
                      className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {cita.paciente}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {cita.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {cita.servicio}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {cita.hora}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const id = cita.cita_id || cita.id;
                            if (id) {
                              setSelectedCitaId(id);
                              setIsModalOpen(true);
                            } else {
                              console.error("ID de cita no encontrado:", cita);
                            }
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <CalendarDays className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          No hay citas programadas para hoy.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Detalles de Cita */}
      <CitaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCitaId(null);
        }}
        citaId={selectedCitaId}
      />
    </div>
  );
};

export default TablaProximasCitas;
