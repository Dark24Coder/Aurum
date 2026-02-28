// src/components/ui/ToastContainer.jsx
// ✅ Composants UI purs uniquement — Fast Refresh compatible
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { TOAST_CONFIGS, TOAST_DURATION } from "./toastConfig";

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

function ToastItem({ t, onDismiss }) {
  const cfg = TOAST_CONFIGS[t.type] || TOAST_CONFIGS.info;
  const Icon = ICONS[t.type] || Info;
  return (
    <div
      className={`pointer-events-auto ${t.exiting ? "toast-exit" : "toast-enter"}`}
    >
      <div
        className={`relative bg-[#111112] border ${cfg.border} rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.85)] overflow-hidden flex items-start gap-3 px-4 py-3.5`}
      >
        <div
          className={`w-8 h-8 rounded-xl ${cfg.bgCls} flex items-center justify-center flex-shrink-0 mt-0.5`}
        >
          <Icon size={15} className={cfg.iconCls} />
        </div>
        <p className="text-white text-sm font-bold leading-snug flex-1 pr-1 mt-1">
          {t.message}
        </p>
        <button
          onClick={() => onDismiss(t.id)}
          className="text-gray-600 hover:text-white transition-colors flex-shrink-0 mt-1 p-0.5 rounded hover:bg-white/5"
        >
          <X size={13} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
          <div
            className={`h-full ${cfg.bar} opacity-50`}
            style={{
              animation: `toastBar ${TOAST_DURATION}ms linear forwards`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ToastListContainer({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <>
      <style>{`
        @keyframes toastIn  { from{opacity:0;transform:translateX(110%) scale(0.95)} to{opacity:1;transform:translateX(0) scale(1)} }
        @keyframes toastOut { from{opacity:1;transform:translateX(0) scale(1)} to{opacity:0;transform:translateX(110%) scale(0.95)} }
        @keyframes toastBar { from{width:100%} to{width:0%} }
        .toast-enter { animation: toastIn  0.3s cubic-bezier(0.34,1.3,0.64,1) forwards; }
        .toast-exit  { animation: toastOut 0.25s ease-in forwards; }
      `}</style>
      <div
        className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
}
