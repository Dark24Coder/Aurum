function StatusBadge({ status }) {
  const colors = {
    LIVRE: "bg-green-500/20 text-green-400 border border-green-500/20",
    EN_TRANSIT: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    ANNULE: "bg-red-500/20 text-red-400 border border-red-500/20",
  };

  return (
    <span
      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${colors[status] || "bg-yellow-500/20 text-yellow-400"}`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;
