// src/components/ui/FloatSelect.jsx
// Version corrigée : dropdown via ReactDOM.createPortal
// pour échapper à tout overflow:hidden parent (modals, dashboards, etc.)
import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import { ChevronDown, Check } from "lucide-react";

function FloatSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
  icon: Icon,
  scrollContainerRef, // ref optionnelle du parent scrollable
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  const isFloating = focused || open || (value && value.length > 0);
  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  // Fermer si clic en dehors
  useEffect(() => {
    const h = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Calculer la position du dropdown et l'updater si scroll
  useEffect(() => {
    if (!open) return;

    const update = () => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    };

    update();

    // Écoute scroll global + resize
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    // Écoute le scroll du conteneur modal si fourni
    const scrollEl = scrollContainerRef?.current;
    if (scrollEl) scrollEl.addEventListener("scroll", update);

    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      if (scrollEl) scrollEl.removeEventListener("scroll", update);
    };
  }, [open, scrollContainerRef]);

  const handleOpen = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    }
    setOpen((v) => !v);
    setFocused(true);
  };

  return (
    <div className="relative" ref={wrapRef}>
      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={handleOpen}
        className={`relative flex items-center bg-black/40 border rounded-xl cursor-pointer transition-all duration-300 ${
          open
            ? "border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.08)]"
            : "border-white/10"
        }`}
      >
        {Icon && (
          <div className="pl-4 flex-shrink-0">
            <Icon
              size={15}
              className={`transition-colors duration-300 ${open ? "text-[#D4AF37]" : "text-gray-600"}`}
            />
          </div>
        )}
        <div
          className={`flex-1 py-3.5 text-sm select-none ${Icon ? "pl-3" : "pl-4"} ${selectedLabel ? "text-white" : "text-transparent"}`}
        >
          {selectedLabel || label}
        </div>
        <div className="pr-4">
          <ChevronDown
            size={15}
            className={`text-gray-500 transition-transform duration-300 ${open ? "rotate-180 text-[#D4AF37]" : ""}`}
          />
        </div>
      </div>

      {/* Label flottant */}
      <label
        className={`absolute pointer-events-none font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
          isFloating
            ? "text-[9px] text-[#D4AF37] top-0 -translate-y-1/2 right-4 bg-[#161617] px-2 z-10"
            : `text-sm text-gray-600 top-1/2 -translate-y-1/2 ${Icon ? "left-10" : "left-4"}`
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#D4AF37]">*</span>}
      </label>

      {/* Dropdown via Portal — échappe à tout overflow:hidden */}
      {open &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 9999,
            }}
          >
            <div
              className="bg-[#161617] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
              style={{
                animation: "dropIn 0.22s cubic-bezier(0.22,1,0.36,1) forwards",
                transformOrigin: "top",
              }}
            >
              <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px) scaleY(0.95)}to{opacity:1;transform:translateY(0) scaleY(1)}}`}</style>
              <div style={{ maxHeight: "13rem", overflowY: "auto" }}>
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    onMouseDown={(e) => {
                      e.preventDefault(); // empêche le blur/mousedown de fermer avant onClick
                      onChange(opt.value);
                      setOpen(false);
                      setFocused(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-all ${
                      value === opt.value
                        ? "bg-[#D4AF37]/10 text-[#D4AF37] font-bold"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && (
                      <Check size={14} className="text-[#D4AF37]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Input invisible pour validation HTML5 required */}
      <input
        tabIndex="-1"
        className="absolute opacity-0 pointer-events-none w-full bottom-0"
        value={value || ""}
        onChange={() => {}}
        required={required}
      />
    </div>
  );
}

export default FloatSelect;
