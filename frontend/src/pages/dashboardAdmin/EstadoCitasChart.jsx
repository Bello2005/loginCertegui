import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { api } from "../../services/api";

// Mapeo de colores por estado
const getColorByEstado = (estado) => {
  const estadoLower = estado?.toLowerCase() || '';
  const colorMap = {
    'completada': '#10b981', // Verde esmeralda - éxito
    'completadas': '#10b981',
    'programada': '#3b82f6', // Azul - programada/pendiente
    'programadas': '#3b82f6',
    'pendiente': '#f59e0b', // Ámbar - pendiente
    'pendientes': '#f59e0b',
    'cancelada': '#ef4444', // Rojo - cancelada
    'canceladas': '#ef4444',
  };
  return colorMap[estadoLower] || '#6b7280'; // Gris por defecto
};

const EstadoCitasChart = () => {
  const [data, setData] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Detectar modo oscuro
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    api
      .get("api/admin/estado-citas")
      .then((res) => {
        const datos = res.data.data || [];
        // Ordenar los datos: Completadas primero, luego Programadas, luego Canceladas
        const ordenPreferido = ['Completada', 'Completadas', 'Programada', 'Programadas', 'Pendiente', 'Pendientes', 'Cancelada', 'Canceladas'];
        const datosOrdenados = datos.sort((a, b) => {
          const indexA = ordenPreferido.findIndex(estado => a.name?.toLowerCase().includes(estado.toLowerCase()));
          const indexB = ordenPreferido.findIndex(estado => b.name?.toLowerCase().includes(estado.toLowerCase()));
          return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
        });
        setData(datosOrdenados);
      })
      .catch((err) => {
        console.error(err);
        // Fallback a datos mock
        setData([
          { name: "Completadas", value: 0 },
          { name: "Programadas", value: 0 },
          { name: "Canceladas", value: 0 }
        ]);
      });
  }, []);

  return (
    <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <PieChartIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Estado de las Citas
        </h2>
      </div>
      <div className="h-64 min-h-[256px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getColorByEstado(entry.name)}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(255, 255, 255)",
                borderRadius: "12px",
                border: isDark ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
                color: isDark ? "rgb(249, 250, 251)" : "rgb(17, 24, 39)",
                padding: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              labelStyle={{ color: isDark ? "rgb(249, 250, 251)" : "rgb(17, 24, 39)" }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{
                color: isDark ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
                marginTop: "10px",
                fontSize: "12px",
              }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default EstadoCitasChart;
