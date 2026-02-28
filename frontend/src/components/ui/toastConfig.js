// src/components/ui/toastConfig.js
// ✅ Constantes partagées entre ToastContainer.jsx et useToast.jsx
export const TOAST_DURATION = 3500;

export const TOAST_CONFIGS = {
  success: { iconCls: "text-green-400",  bgCls: "bg-green-500/15",  bar: "bg-green-400",  border: "border-green-500/25"  },
  error:   { iconCls: "text-red-400",    bgCls: "bg-red-500/15",    bar: "bg-red-400",    border: "border-red-500/25"    },
  warning: { iconCls: "text-yellow-400", bgCls: "bg-yellow-500/15", bar: "bg-yellow-400", border: "border-yellow-500/25" },
  info:    { iconCls: "text-[#D4AF37]",  bgCls: "bg-[#D4AF37]/15",  bar: "bg-[#D4AF37]",  border: "border-[#D4AF37]/25"  },
};