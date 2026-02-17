import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import FloatInput from "../components/ui/FloatInput";
import Button from "../components/ui/Button";

function Login({ setCurrentUser }) {
  const navigate = useNavigate();
  const [step, setStep] = useState("LOGIN");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    resetPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser({ id: "1", name: "Client Privilège", email: form.email });
      navigate("/dashboard");
    }, 1500);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
    }, 1500);
  };

  const handleReset = (e) => {
    e.preventDefault();
    if (form.resetPassword !== form.confirmPassword)
      return setError("Mots de passe différents.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetDone(true);
      setTimeout(() => {
        setStep("LOGIN");
        setResetDone(false);
        setEmailSent(false);
      }, 2000);
    }, 1500);
  };

  const titles = {
    LOGIN: { main: "Connexion", sub: "Accès Premium BJ Business" },
    FORGOT: { main: "Récupération", sub: "Un lien vous sera envoyé" },
    RESET: { main: "Sécurité", sub: "Mise à jour du mot de passe" },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md bg-[#161617] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          {step !== "LOGIN" && (
            <button
              onClick={() => setStep("LOGIN")}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-[#D4AF37] uppercase tracking-widest transition mb-4 mx-auto font-black"
            >
              <ArrowLeft size={12} /> Retour
            </button>
          )}
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1 italic">
            {titles[step].main}
          </h2>
          <p className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">
            {titles[step].sub}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-6 text-center text-red-400 text-xs font-bold uppercase tracking-tight">
            {error}
          </div>
        )}

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
            <Button type="submit" variant="gold" size="full" loading={loading}>
              Entrer dans l'espace
            </Button>
            <div className="flex flex-col items-center gap-4 mt-6">
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

        {step === "FORGOT" && !emailSent && (
          <form onSubmit={handleForgot} className="space-y-5">
            <FloatInput
              label="Email de récupération"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              icon={Mail}
            />
            <Button type="submit" variant="gold" size="full" loading={loading}>
              Récupérer l'accès
            </Button>
          </form>
        )}

        {step === "FORGOT" && emailSent && (
          <div className="text-center py-4 space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/20">
              <CheckCircle size={32} className="text-[#D4AF37]" />
            </div>
            <p className="text-white text-sm font-bold px-4">
              Consultez votre boîte mail pour réinitialiser votre accès.
            </p>
            <Button
              variant="premium"
              size="sm"
              onClick={() => setStep("RESET")}
            >
              Simuler lien (Dev)
            </Button>
          </div>
        )}

        {step === "RESET" && !resetDone && (
          <form onSubmit={handleReset} className="space-y-4">
            <FloatInput
              label="Nouveau mot de passe"
              name="resetPassword"
              type="password"
              value={form.resetPassword}
              onChange={handleChange}
              required
              icon={ShieldCheck}
            />
            <FloatInput
              label="Confirmer mot de passe"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              icon={Lock}
            />
            <Button type="submit" variant="gold" size="full" loading={loading}>
              Confirmer le changement
            </Button>
          </form>
        )}

        {step === "RESET" && resetDone && (
          <div className="text-center py-4 space-y-4 animate-fade-in-up">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <p className="text-white text-sm font-bold italic tracking-tight">
              Accès mis à jour. Redirection...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
