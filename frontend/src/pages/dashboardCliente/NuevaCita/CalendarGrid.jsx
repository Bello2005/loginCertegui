import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import dayjs from "dayjs";

/**
 * CalendarGrid - componente puro (sin llamadas al backend)
 * Props:
 *  - currentMonth (dayjs)
 *  - setCurrentMonth (fn)
 *  - fechaSeleccionada (dayjs)
 *  - setFechaSeleccionada (fn)
 */
const CalendarGrid = ({ currentMonth, setCurrentMonth, fechaSeleccionada, setFechaSeleccionada }) => {
  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const firstDayOfWeek = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const leadingEmptyDays = firstDayOfWeek;
  const totalDaysToShow = daysInMonth + leadingEmptyDays;
  const totalSlots = Math.ceil(totalDaysToShow / 7) * 7;
  const trailingEmptyDays = totalSlots - totalDaysToShow;

  const calendarGrid = useMemo(() => {
    const days = [];
    for (let i = 0; i < leadingEmptyDays; i++) days.push({ type: "empty" });
    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i);
      days.push({ type: "day", date, isToday: date.isSame(dayjs(), "day") });
    }
    for (let i = 0; i < trailingEmptyDays; i++) days.push({ type: "empty" });
    return days;
  }, [currentMonth, daysInMonth, leadingEmptyDays, trailingEmptyDays, startOfMonth]);

  const changeMonth = (delta) => setCurrentMonth(currentMonth.add(delta, "month"));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50 dark:border-slate-700/50 transition-all hover:shadow-xl"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-600" />
        2. Seleccione una Fecha
      </h2>

      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700 mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <p className="text-lg font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {currentMonth.format("MMMM YYYY").charAt(0).toUpperCase() + currentMonth.format("MMMM YYYY").slice(1)}
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => changeMonth(1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-all duration-300"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase text-gray-600 dark:text-gray-400 mb-3">
        {["dom", "lun", "mar", "mié", "jue", "vie", "sáb"].map((day) => (
          <span key={day} className="py-2">{day}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {calendarGrid.map((slot, index) => (
          <div key={index} className="flex items-center justify-center h-12">
            {slot.type === "day" ? (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFechaSeleccionada(slot.date)}
                disabled={slot.date.isBefore(dayjs(), "day")}
                className={`
                  w-10 h-10 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-300
                  ${slot.date.isBefore(dayjs(), "day")
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
                    : slot.date.isSame(fechaSeleccionada, "day")
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/50 ring-2 ring-indigo-300 dark:ring-indigo-500"
                    : slot.isToday
                    ? "border-2 border-indigo-400 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                    : "hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-800 dark:text-gray-200"
                  }`}
              >
                {slot.date.date()}
              </motion.button>
            ) : (
              <span className="h-10 w-10"></span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarGrid;
