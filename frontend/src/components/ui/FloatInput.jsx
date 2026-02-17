import { useState } from "react";

function FloatInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  icon: Icon,
  rightElement,
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value?.length > 0;

  return (
    <div className="relative">
      {/* Input */}
      <div
        className={`relative flex items-center bg-black/40 border rounded-xl transition-all duration-300 ${
          focused ? "border-[#D4AF37]/60" : "border-white/10"
        }`}
      >
        {/* Icône gauche */}
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
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent py-3.5 text-white text-sm outline-none placeholder-transparent transition-all ${
            Icon ? "pl-3" : "pl-4"
          } ${rightElement ? "pr-12" : "pr-4"}`}
          placeholder={label}
        />

        {/* Élément droite (ex: bouton œil) */}
        {rightElement && (
          <div className="pr-3 flex-shrink-0">{rightElement}</div>
        )}
      </div>

      {/* Label flottant — part de la droite vers le haut */}
      <label
        className={`absolute pointer-events-none font-bold uppercase tracking-widest transition-all duration-300 ${
          isFloating
            ? "text-[9px] text-[#D4AF37] top-0 -translate-y-1/2 right-4 bg-[#161617] px-2"
            : `text-sm text-gray-600 top-1/2 -translate-y-1/2 ${Icon ? "left-10" : "left-4"}`
        }`}
      >
        {label}
      </label>
    </div>
  );
}

export default FloatInput;
