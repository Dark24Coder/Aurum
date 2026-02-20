// src/pages/dashboard/components/StatsCard.jsx
import React from "react";

const StatsCard = ({ label, value, icon, color, isLarge }) => {
  return (
    <div className="bg-[#161617] border border-white/5 p-5 sm:p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:scale-105 hover:border-[#D4AF37]/20 transition-all duration-300 cursor-default">
      <div className={`mb-3 opacity-80 ${color}`}>{icon}</div>
      <div
        className={`font-black text-white mb-1 ${isLarge ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"}`}
      >
        {value}
      </div>
      <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        {label}
      </div>
    </div>
  );
};

export default StatsCard;
