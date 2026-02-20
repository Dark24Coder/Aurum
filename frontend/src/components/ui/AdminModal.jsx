// src/components/ui/AdminModal.jsx
import { X } from "lucide-react";

const AdminModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#161617] border border-[#D4AF37]/20 w-full max-w-lg rounded-[2.5rem] shadow-[0_0_80px_rgba(212,175,55,0.1)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 flex-shrink-0">
          <h3 className="text-xl font-black uppercase tracking-tighter text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>
        {/* Body scrollable */}
        <div className="p-8 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default AdminModal;
