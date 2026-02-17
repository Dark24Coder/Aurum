import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

function FloatSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
  icon: Icon,
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef(null);

  const isFloating = focused || open || (value && value.length > 0);
  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  // Fermer si clic en dehors
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <div
        onClick={() => {
          setOpen(!open);
          setFocused(true);
        }}
        className={`relative flex items-center bg-black/40 border rounded-xl cursor-pointer transition-all duration-300 ${
          open
            ? "border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
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
          className={`flex-1 py-3.5 text-sm select-none ${
            Icon ? "pl-3" : "pl-4"
          } ${selectedLabel ? "text-white" : "text-transparent"}`}
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
            ? "text-[9px] text-[#D4AF37] top-0 -translate-y-1/2 right-4 bg-[#0A0A0B] px-2 z-10"
            : `text-sm text-gray-600 top-1/2 -translate-y-1/2 ${Icon ? "left-10" : "left-4"}`
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#D4AF37]">*</span>}
      </label>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-[60] w-full mt-2 bg-[#161617] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-h-52 overflow-y-auto custom-scroll">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
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
      )}

      {/* Input invisible pour la validation 'required' du formulaire HTML5 */}
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
