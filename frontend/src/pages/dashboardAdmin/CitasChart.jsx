import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { api } from "../../services/api";

const CitasChart = () => {
  const [data, setData] = useState([]);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  useEffect(() => {
    // Temporalmente usando datos mock hasta que se implemente el endpoint
    setData([
      { name: "Lun", citas: 5 },
      { name: "Mar", citas: 8 },
      { name: "Mié", citas: 3 },
      { name: "Jue", citas: 6 },
      { name: "Vie", citas: 4 },
      { name: "Sáb", citas: 2 },
      { name: "Dom", citas: 1 }
    ]);
    
    // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/admin/citas-por-dia)
    // api
    //   .get("citas_por_dia.php")
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
          <BarChart3 className="w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
          Citas por Día
        </h2>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                borderRadius: "12px",
                border: "none",
                color: "#f9fafb",
                padding: "12px",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
            />
            <Bar
              dataKey="citas"
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CitasChart;
