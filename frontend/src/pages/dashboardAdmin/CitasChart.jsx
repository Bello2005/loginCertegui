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
      .get("api/admin/citas-por-dia")
      .then((res) => setData(res.data.data))
      .catch((err) => {
        console.error(err);
        // Fallback a datos mock
        setData([
          { name: "Lun", citas: 0 },
          { name: "Mar", citas: 0 },
          { name: "Mié", citas: 0 },
          { name: "Jue", citas: 0 },
          { name: "Vie", citas: 0 },
          { name: "Sáb", citas: 0 },
          { name: "Dom", citas: 0 }
        ]);
      });
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
      <div className="h-64 min-h-[256px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="currentColor" 
              className="text-gray-300 dark:text-gray-700"
              opacity={0.3} 
            />
            <XAxis
              dataKey="name"
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: "12px" }}
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              stroke="currentColor"
              className="text-gray-600 dark:text-gray-400"
              style={{ fontSize: "12px" }}
              tick={{ fill: "currentColor" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "rgb(31, 41, 55)" : "rgb(255, 255, 255)",
                borderRadius: "12px",
                border: isDark ? "1px solid rgb(55, 65, 81)" : "1px solid rgb(229, 231, 235)",
                color: isDark ? "rgb(249, 250, 251)" : "rgb(17, 24, 39)",
                padding: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              }}
              cursor={{ fill: "rgba(99, 102, 241, 0.1)" }}
              labelStyle={{ color: isDark ? "rgb(249, 250, 251)" : "rgb(17, 24, 39)" }}
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
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            No hay datos disponibles
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CitasChart;
