import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

const EstadoCitasChart = () => {
  const [data, setData] = useState([]);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  useEffect(() => {
    // Temporalmente usando datos mock hasta que se implemente el endpoint
    setData([
      { name: "Completadas", value: 45 },
      { name: "Pendientes", value: 30 },
      { name: "Canceladas", value: 5 }
    ]);
    
    // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/admin/estado-citas)
    // api
    //   .get("estado_citas.php")
    //   .then((res) => setData(res.data.data))
    //   .catch((err) => console.error(err));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
          <PieChartIcon className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Estado de las Citas
        </h2>
      </div>
      <div className="h-64">
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
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "12px",
                border: "none",
                color: "#f9fafb",
                padding: "12px",
              }}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{
                color: "#6b7280",
                marginTop: "10px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default EstadoCitasChart;
