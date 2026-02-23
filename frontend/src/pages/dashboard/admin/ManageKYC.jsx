// src/pages/dashboard/admin/ManageKYC.jsx
import { useState } from "react";
import { CheckCircle, X, Eye, ShieldCheck, Clock, User } from "lucide-react";
import { useAuth } from "../../../context/useAuth";

const STATUS_STYLES = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  VALID: "text-green-400  bg-green-500/10  border-green-500/20",
  REJECTED: "text-red-400    bg-red-500/10    border-red-500/20",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${STATUS_STYLES[status] || STATUS_STYLES.PENDING}`}
    >
      {status}
    </span>
  );
}

// Modal détail document
function DocModal({ req, onClose }) {
  if (!req) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#111112] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="font-black text-white uppercase tracking-tight">
            Dossier KYC — {req.userName || req.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "ID Demande", value: req.id },
              { label: "Utilisateur", value: req.userName || req.name },
              { label: "Type document", value: req.docType },
              { label: "N° pièce", value: req.docNumber },
              { label: "Date", value: req.date },
              { label: "Statut", value: <StatusBadge status={req.status} /> },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white/3 rounded-xl px-4 py-3 border border-white/5"
              >
                <div className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-1">
                  {label}
                </div>
                <div className="text-sm font-black text-white">{value}</div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="pt-2">
            <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3">
              Documents soumis
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["front", "back", "selfie"].map((type) =>
                req.documents?.[type] ? (
                  <div
                    key={type}
                    className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-xl p-3 text-center"
                  >
                    <ShieldCheck
                      size={20}
                      className="text-[#D4AF37] mx-auto mb-1"
                    />
                    <div className="text-[9px] font-black text-gray-400 uppercase">
                      {type}
                    </div>
                    <div className="text-[9px] text-[#D4AF37] truncate mt-0.5">
                      {req.documents[type]}
                    </div>
                  </div>
                ) : (
                  <div
                    key={type}
                    className="bg-white/3 border border-white/5 rounded-xl p-3 text-center opacity-40"
                  >
                    <div className="text-[9px] font-black text-gray-600 uppercase">
                      {type}
                    </div>
                    <div className="text-[9px] text-gray-700 mt-0.5">N/A</div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ManageKYC() {
  const { db, adminUpdateKyc } = useAuth();
  const [detailReq, setDetailReq] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const kycRequests = db.kycRequests || [];
  const filtered =
    filter === "ALL"
      ? kycRequests
      : kycRequests.filter((k) => k.status === filter);

  const pendingCount = kycRequests.filter((k) => k.status === "PENDING").length;
  const validCount = kycRequests.filter((k) => k.status === "VALID").length;
  const rejectedCount = kycRequests.filter(
    (k) => k.status === "REJECTED",
  ).length;

  return (
    <main className="space-y-6">
      {/* Compteurs rapides */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "En attente",
            count: pendingCount,
            color: "#F59E0B",
            id: "PENDING",
          },
          {
            label: "Validés",
            count: validCount,
            color: "#10B981",
            id: "VALID",
          },
          {
            label: "Rejetés",
            count: rejectedCount,
            color: "#EF4444",
            id: "REJECTED",
          },
        ].map(({ label, count, color, id }) => (
          <button
            key={id}
            onClick={() => setFilter(filter === id ? "ALL" : id)}
            className={`p-4 rounded-2xl border text-left transition-all ${filter === id ? "border-[#D4AF37]/30" : "border-white/5 hover:border-white/10"} bg-[#111112]`}
          >
            <div className="text-2xl font-black" style={{ color }}>
              {count}
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
              {label}
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Document
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  N° Pièce
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Statut
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-gray-600 text-sm"
                  >
                    Aucune demande KYC{" "}
                    {filter !== "ALL" ? `avec le statut ${filter}` : ""}
                  </td>
                </tr>
              ) : (
                filtered.map((k) => (
                  <tr
                    key={k.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                  >
                    {/* Utilisateur */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                          <User size={12} className="text-[#D4AF37]" />
                        </div>
                        <span className="font-black text-white text-sm">
                          {k.userName || k.name}
                        </span>
                      </div>
                    </td>
                    {/* Doc */}
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {k.docType}
                    </td>
                    {/* N° pièce */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-[#D4AF37] text-sm">
                        {k.docNumber || "—"}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {k.date}
                    </td>
                    {/* Statut */}
                    <td className="px-4 py-3">
                      <StatusBadge status={k.status} />
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {/* Voir détail */}
                        <button
                          onClick={() => setDetailReq(k)}
                          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Voir le dossier"
                        >
                          <Eye size={14} />
                        </button>
                        {/* Valider / Rejeter — seulement si PENDING */}
                        {k.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => adminUpdateKyc(k.id, "VALID")}
                              className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-black transition-all"
                              title="Valider"
                            >
                              <CheckCircle size={14} />
                            </button>
                            <button
                              onClick={() => adminUpdateKyc(k.id, "REJECTED")}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                              title="Rejeter"
                            >
                              <X size={14} />
                            </button>
                          </>
                        )}
                        {/* Si déjà traité — indicateur visuel */}
                        {k.status === "VALID" && (
                          <span className="text-[9px] text-green-400 font-black uppercase">
                            Approuvé
                          </span>
                        )}
                        {k.status === "REJECTED" && (
                          <span className="text-[9px] text-red-400 font-black uppercase">
                            Rejeté
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal détail */}
      {detailReq && (
        <DocModal req={detailReq} onClose={() => setDetailReq(null)} />
      )}
    </main>
  );
}
