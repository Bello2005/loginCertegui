import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const StatCard = ({ title, value, percent, color, icon: Icon }) => {
  const isPositive = percent?.startsWith("+");
  const percentValue = percent?.replace(/[+-%]/g, "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 border border-white/20 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Gradiente de fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        {/* Header con icono y título */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md">
                <Icon className="w-5 h-5" />
              </div>
            )}
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
              {title}
            </p>
          </div>
        </div>

        {/* Valor principal */}
        <div className="mb-3">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        {/* Porcentaje con indicador */}
        {percent && (
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-sm font-semibold ${
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {percent}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              vs mes anterior
            </span>
          </div>
        )}
      </div>

      {/* Barra de progreso decorativa */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700">
        <motion.div
          className={`h-full ${
            isPositive
              ? "bg-gradient-to-r from-green-400 to-emerald-500"
              : "bg-gradient-to-r from-red-400 to-rose-500"
          }`}
          initial={{ width: 0 }}
          animate={{ width: percentValue ? `${Math.min(parseFloat(percentValue), 100)}%` : "0%" }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
};

export default StatCard;
