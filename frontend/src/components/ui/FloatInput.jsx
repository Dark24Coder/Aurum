// src/components/ui/FloatInput.jsx
// ✅ Composant FloatInput partagé — label flottant, icône gauche, onKeyDown
import { useState } from "react";

export default function FloatInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onKeyDown,
  required = false,
  icon: Icon,
  rightElement,
}) {
  const [focused, setFocused] = useState(false);
  const isFloating =
    focused ||
    (value !== undefined && value !== null && String(value).length > 0);

  return (
    <main className="relative">
      <div
        className={`relative flex items-center bg-black/40 border rounded-xl transition-all duration-300 ${
          focused
            ? "border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.08)]"
            : "border-white/10"
        }`}
      >
        {Icon && (
          <div className="pl-4 flex-shrink-0">
            <Icon
              size={15}
              className={`transition-colors duration-300 ${focused ? "text-[#D4AF37]" : "text-gray-600"}`}
            />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent py-3.5 text-white text-sm outline-none placeholder-transparent transition-all ${
            Icon ? "pl-3" : "pl-4"
          } ${rightElement ? "pr-2" : "pr-4"}`}
          placeholder={label}
        />
        {rightElement && (
          <div className="pr-2.5 flex-shrink-0">{rightElement}</div>
        )}
      </div>
      <label
        className={`absolute pointer-events-none font-bold uppercase tracking-widest transition-all duration-300 ${
          isFloating
            ? "text-[9px] text-[#D4AF37] top-0 -translate-y-1/2 right-4 bg-[#111112] px-2 z-10"
            : `text-sm text-gray-600 top-1/2 -translate-y-1/2 ${Icon ? "left-10" : "left-4"}`
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#D4AF37]">*</span>}
      </label>
    </main>
  );
}
