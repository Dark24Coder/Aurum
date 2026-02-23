// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuth } from "../context/useAuth";
import FloatInput from "../components/ui/FloatInput";
import Button from "../components/ui/Button";

function Login() {
  const navigate = useNavigate();
  const { login, recoverPassword, authLoading } = useAuth();

  const [step, setStep] = useState("LOGIN");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password, rememberMe);
    if (result.success) {
      navigate(
        result.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user",
      );
    } else {
      setError(result.error || "Identifiants incorrects");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const result = await recoverPassword(form.email);
    setMessage(result.message);
    setEmailSent(true);
  };

  const titles = {
    LOGIN: { main: "Connexion", sub: "Accès Premium BJ Business" },
    FORGOT: { main: "Récupération", sub: "Un lien vous sera envoyé" },
  };

  return (
    /* ── py réduit pour coller à la navbar et au footer ── */
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-md bg-[#161617] border border-white/5 rounded-[2rem] p-7 sm:p-10 shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-7">
          {step !== "LOGIN" && (
            <button
              onClick={() => setStep("LOGIN")}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-[#D4AF37] uppercase tracking-widest transition mb-4 mx-auto font-black"
            >
              <ArrowLeft size={12} /> Retour
            </button>
          )}
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-1 italic">
            {titles[step].main}
          </h2>
          <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
            {titles[step].sub}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-center text-red-400 text-xs font-bold uppercase tracking-tight">
            {error}
          </div>
        )}

        {/* LOGIN */}
        {step === "LOGIN" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <FloatInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              icon={Mail}
            />
            <FloatInput
              label="Mot de passe"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
            {/* Se souvenir de moi */}
            <label className="flex items-center gap-3 cursor-pointer group select-none">
              <div
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  rememberMe
                    ? "bg-[#D4AF37] border-[#D4AF37]"
                    : "border-white/20 bg-transparent group-hover:border-[#D4AF37]/50"
                }`}
              >
                {rememberMe && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L4 7L9 1"
                      stroke="#000"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs text-gray-400 font-bold group-hover:text-white transition-colors">
                Se souvenir de moi{" "}
                <span className="text-gray-600 font-normal">(7 jours)</span>
              </span>
            </label>

            <Button
              type="submit"
              variant="gold"
              size="full"
              loading={authLoading}
            >
              Entrer dans l'espace
            </Button>
            <div className="flex flex-col items-center gap-3 mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("FORGOT")}
              >
                Identifiants perdus ?
              </Button>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Nouveau ici ?{" "}
                <Link
                  to="/register"
                  className="text-[#D4AF37] hover:underline ml-1"
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* FORGOT */}
        {step === "FORGOT" && !emailSent && (
          <form onSubmit={handleForgot} className="space-y-4">
            <FloatInput
              label="Email de récupération"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              icon={Mail}
            />
            <Button
              type="submit"
              variant="gold"
              size="full"
              loading={authLoading}
            >
              Récupérer l'accès
            </Button>
          </form>
        )}

        {step === "FORGOT" && emailSent && (
          <div className="text-center py-4 space-y-4 animate-fade-in-up">
            <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/20">
              <CheckCircle size={28} className="text-[#D4AF37]" />
            </div>
            <p className="text-white text-sm font-bold px-4">{message}</p>
            <Button variant="ghost" size="sm" onClick={() => setStep("LOGIN")}>
              Retour à la connexion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
