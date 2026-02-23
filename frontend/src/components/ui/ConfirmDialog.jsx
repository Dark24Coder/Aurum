// src/components/ui/ConfirmDialog.jsx
// ✅ Composant UI pur — default export uniquement (Fast Refresh compatible)
// ✅ Pour utiliser le hook → importer useConfirm depuis "./useConfirm"
import { AlertTriangle, Trash2, Info, X } from "lucide-react";

const VARIANT_CONFIG = {
  danger: {
    Icon: Trash2,
    iconBg: "bg-red-500/15",
    iconColor: "text-red-400",
    btnBg: "bg-red-500 hover:bg-red-600 text-white",
    borderAccent: "border-red-500/30",
  },
  warning: {
    Icon: AlertTriangle,
    iconBg: "bg-yellow-500/15",
    iconColor: "text-yellow-400",
    btnBg: "bg-yellow-500 hover:bg-yellow-600 text-black",
    borderAccent: "border-yellow-500/30",
  },
  info: {
    Icon: Info,
    iconBg: "bg-[#D4AF37]/15",
    iconColor: "text-[#D4AF37]",
    btnBg: "bg-[#D4AF37] hover:opacity-90 text-black",
    borderAccent: "border-[#D4AF37]/30",
  },
};

export default function ConfirmDialogUI({
  title = "Confirmer l'action",
  message = "Êtes-vous sûr de vouloir continuer ?",
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  onConfirm,
  onCancel,
}) {
  const cfg = VARIANT_CONFIG[variant] || VARIANT_CONFIG.danger;
  const Icon = cfg.Icon;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(10px)",
        animation: "cdOverlay 0.18s ease forwards",
      }}
    >
      <style>{`
        @keyframes cdOverlay { from{opacity:0}          to{opacity:1} }
        @keyframes cdPop     { from{opacity:0;transform:scale(0.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .cd-pop { animation: cdPop 0.22s cubic-bezier(0.34,1.4,0.64,1) forwards; }
      `}</style>

      <div
        className={`cd-pop bg-[#111112] border ${cfg.borderAccent} rounded-2xl w-full max-w-sm shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon size={18} className={cfg.iconColor} />
            </div>
            <h3 className="font-black text-white text-base uppercase tracking-tight leading-tight">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-600 hover:text-white transition-colors flex-shrink-0 p-1 rounded-lg hover:bg-white/5 ml-2"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message */}
        <div className="px-5 pb-5">
          <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
        </div>

        <div className="border-t border-white/5" />

        {/* Boutons */}
        <div className="flex gap-2 p-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-[0.97] ${cfg.btnBg}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
