function Button({
  children,

  onClick,

  type = "button",

  variant = "gold", // gold | outline | ghost | danger

  size = "md", // sm | md | lg | full

  disabled = false,

  loading = false,

  icon,

  className = "",
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-black uppercase tracking-wide rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    gold: "bg-[#D4AF37] text-black hover:bg-[#f3cc4d] hover:scale-[1.02] active:scale-[0.98]",

    outline:
      "bg-transparent border border-white/20 text-white hover:bg-white/5 active:scale-[0.98]",

    ghost:
      "bg-transparent border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 active:scale-[0.98]",

    danger:
      "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-[0.98]",
  };

  const sizes = {
    sm: "px-5 py-2 text-xs",

    md: "px-8 py-3 text-xs",

    lg: "px-10 py-4 text-sm",

    full: "w-full py-4 text-sm",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? (
        <span className="animate-pulse">Chargement...</span>
      ) : (
        <>
          {icon && icon}

          {children}
        </>
      )}
    </button>
  );
}

export default Button;
