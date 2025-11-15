import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "../../services/api";

dayjs.locale("es");

const CalendarPicker = ({ onSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [availableHours, setAvailableHours] = useState([]);
  const [selectedHour, setSelectedHour] = useState(null);

  useEffect(() => {
    fetchAvailableHours(selectedDate);
  }, [selectedDate]);

  // TODO: Actualizar endpoint al nuevo backend Node.js
  const fetchAvailableHours = async (date) => {
    try {
      const formattedDate = date.format("YYYY-MM-DD");
      // Temporalmente usando datos mock hasta que se implemente el endpoint
      setAvailableHours([]);
      
      // TODO: Reemplazar con endpoint del nuevo backend (ej: /api/horarios/disponibles?fecha=${formattedDate})
      // const response = await api.get(`medico3.php?fecha=${formattedDate}`);
      // if (response.data.success) {
      //   setAvailableHours(response.data.horas);
      // } else {
      //   setAvailableHours([]);
      // }
    } catch (error) {
      console.error(error);
      setAvailableHours([]);
    }
  };

  const handlePrevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const handleNextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const handleSelectDate = (day) => {
    setSelectedDate(day);
    setSelectedHour(null);
  };

  const handleSelectHour = (hour) => {
    setSelectedHour(hour);
    onSelect && onSelect({ date: selectedDate.format("YYYY-MM-DD"), hour });
  };

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const days = [];
  let day = startDate;

  while (day.isBefore(endDate)) {
    days.push(day);
    day = day.add(1, "day");
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          {currentMonth.format("MMMM YYYY")}
        </div>
        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-2 text-center text-gray-500 text-sm font-medium mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((dayItem) => {
          const isToday = dayItem.isSame(dayjs(), "day");
          const isSelected = dayItem.isSame(selectedDate, "day");
          const isCurrentMonth = dayItem.isSame(currentMonth, "month");
          return (
            <button
              key={dayItem.format("DD-MM")}
              onClick={() => handleSelectDate(dayItem)}
              className={`p-2 rounded-lg text-sm transition ${
                isSelected
                  ? "bg-blue-500 text-white"
                  : isToday
                  ? "border border-blue-400 text-blue-600"
                  : isCurrentMonth
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-gray-300"
              }`}
            >
              {dayItem.date()}
            </button>
          );
        })}
      </div>

      {/* Available hours */}
      <div className="mt-6">
        <h3 className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-blue-500" /> Horas disponibles
        </h3>
        {availableHours.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {availableHours.map((hour) => (
              <button
                key={hour}
                onClick={() => handleSelectHour(hour)}
                className={`py-2 px-3 rounded-lg text-sm border transition ${
                  selectedHour === hour
                    ? "bg-blue-500 text-white border-blue-500"
                    : "border-gray-300 hover:bg-blue-50"
                }`}
              >
                {hour}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center">
            No hay horas disponibles para esta fecha.
          </p>
        )}
      </div>
    </div>
  );
};

export default CalendarPicker;
