import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";

// Import de tes nouveaux composants
import FloatInput from "../components/ui/FloatInput";
import FloatSelect from "../components/ui/FloatSelect";
import Button from "../components/ui/Button";

const COUNTRIES_DATA = [
  { name: "Allemagne", code: "+49" },
  { name: "Autre", code: "+" },
  { name: "Belgique", code: "+32" },
  { name: "Bénin", code: "+229" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Cameroun", code: "+237" },
  { name: "Canada", code: "+1" },
  { name: "Chine", code: "+86" },
  { name: "Congo", code: "+242" },
  { name: "Côte d'Ivoire", code: "+225" },
  { name: "États-Unis", code: "+1" },
  { name: "France", code: "+33" },
  { name: "Gabon", code: "+241" },
  { name: "Ghana", code: "+233" },
  { name: "Mali", code: "+223" },
  { name: "Niger", code: "+227" },
  { name: "Nigéria", code: "+234" },
  { name: "RDC", code: "+243" },
  { name: "Royaume-Uni", code: "+44" },
  { name: "Sénégal", code: "+221" },
  { name: "Togo", code: "+228" },
].sort((a, b) => a.name.localeCompare(b.name));

function Register({ setCurrentUser }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    country: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCountryChange = (val) => {
    setForm((prev) => ({ ...prev, country: val, phoneNumber: "" }));
  };

  const getPrefix = () =>
    COUNTRIES_DATA.find((c) => c.name === form.country)?.code || "+";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentUser({ id: "USER-NEW", name: form.name, email: form.email });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md bg-[#161617] border border-white/5 rounded-[2.5rem] p-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
            Inscription
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            Créez votre compte professionnel
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-center">
            <p className="text-red-400 text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatInput
            label="Nom Complet"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            icon={User}
          />

          <FloatSelect
            label="Pays"
            value={form.country}
            onChange={handleCountryChange}
            options={COUNTRIES_DATA.map((c) => ({
              value: c.name,
              label: c.name,
            }))}
            required
          />

          <div className="flex gap-2">
            <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-3.5 text-[#D4AF37] font-mono font-black text-sm min-w-[70px] flex items-center justify-center">
              {getPrefix()}
            </div>
            <div className="flex-1">
              <FloatInput
                label="Téléphone"
                name="phoneNumber"
                type="tel"
                value={form.phoneNumber}
                onChange={handleChange}
                required
                icon={Phone}
              />
            </div>
          </div>

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
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <FloatInput
            label="Confirmer le mot de passe"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            required
            icon={Lock}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-gray-600 hover:text-white transition"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <Button
            type="submit"
            variant="gold"
            size="full"
            loading={loading}
            className="mt-2"
          >
            Créer mon compte
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-[#D4AF37] font-bold hover:underline"
          >
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
