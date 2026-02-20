// src/pages/dashboard/components/StatusBadge.jsx
import React from "react";

const STATUS_STYLES = {
  LIVRE: "bg-green-500/20 text-green-400 border-green-500/20",
  EXPEDIE: "bg-green-500/20 text-green-400 border-green-500/20",
  EN_TRANSIT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  SOURCING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20",
  EN_ATTENTE: "bg-gray-500/20 text-gray-400 border-gray-500/20",
  CONTROLE_QUALITE: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  ANNULE: "bg-red-500/20 text-red-400 border-red-500/20",
  PENDING: "bg-orange-500/20 text-orange-400 border-orange-500/20",
  VALID: "bg-green-500/20 text-green-400 border-green-500/20",
  REJECTED: "bg-red-500/20 text-red-400 border-red-500/20",
};

const StatusBadge = ({ status }) => {
  const style =
    STATUS_STYLES[status] || "bg-gray-500/20 text-gray-400 border-gray-500/20";
  const label = status?.replace(/_/g, " ") || "—";

  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border tracking-wide ${style}`}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
