function StatsCard({ icon, value, label }) {
  return (
    <div className="bg-[#161617] border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all hover:-translate-y-1">
      <div className="text-[#D4AF37] mb-3 opacity-80">{icon}</div>
      <div className="text-2xl font-black text-white mb-1">{value}</div>
      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
        {label}
      </div>
    </div>
  );
}

export default StatsCard;
