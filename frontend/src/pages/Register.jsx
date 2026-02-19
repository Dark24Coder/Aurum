// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useAuth } from "../context/useAuth";
import FloatInput  from "../components/ui/FloatInput";
import FloatSelect from "../components/ui/FloatSelect";
import Button from "../components/ui/Button";

function Register() {
  const navigate = useNavigate();
  const { register, authLoading, COUNTRIES_DATA } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState("");
  const [form, setForm]                 = useState({
    name: "", country: "", phoneNumber: "", email: "", password: "", confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleCountryChange = (val) => {
    setForm((prev) => ({ ...prev, country: val, phoneNumber: "" }));
  };

  const getPrefix = () => COUNTRIES_DATA.find((c) => c.name === form.country)?.code || "+";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    const result = await register({
      name: form.name,
      email: form.email,
      phone: `${getPrefix()} ${form.phoneNumber}`,
      country: form.country,
      password: form.password,
    });
    if (result.success) {
      navigate("/dashboard/user");
    } else {
      setError(result.error || "Une erreur est survenue");
    }
  };

  const countryOptions = COUNTRIES_DATA.map((c) => ({ value: c.name, label: c.name }));

  return (
    /* ── py réduit pour coller à la navbar et au footer ── */
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-md bg-[#161617] border border-white/5 rounded-[2rem] p-7 sm:p-10 shadow-2xl animate-fade-in-up">

        <div className="text-center mb-7">
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-1">
            Inscription
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Créez votre compte professionnel
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-center">
            <p className="text-red-400 text-xs font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatInput label="Nom Complet" name="name" value={form.name} onChange={handleChange} required icon={User} />

          <FloatSelect
            label="Pays"
            value={form.country}
            onChange={handleCountryChange}
            options={countryOptions}
            required
          />

          {/* Téléphone avec indicatif */}
          <div className="flex gap-2 items-start">
            <div className="bg-black/40 border border-white/10 rounded-xl px-3 py-[14px] text-[#D4AF37] font-mono font-black text-sm min-w-[62px] flex items-center justify-center flex-shrink-0">
              {getPrefix()}
            </div>
            <div className="flex-1">
              <FloatInput label="Téléphone" name="phoneNumber" type="tel" value={form.phoneNumber} onChange={handleChange} required icon={Phone} />
            </div>
          </div>

          <FloatInput label="Email" name="email" type="email" value={form.email} onChange={handleChange} required icon={Mail} />

          <FloatInput
            label="Mot de passe" name="password"
            type={showPassword ? "text" : "password"}
            value={form.password} onChange={handleChange} required icon={Lock}
            rightElement={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-600 hover:text-white transition">
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <FloatInput
            label="Confirmer le mot de passe" name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            value={form.confirmPassword} onChange={handleChange} required icon={Lock}
            rightElement={
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-600 hover:text-white transition">
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />

          <Button type="submit" variant="gold" size="full" loading={authLoading} className="mt-2">
            Créer mon compte
          </Button>
        </form>

        <div className="mt-5 text-center text-xs text-gray-400">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-[#D4AF37] font-bold hover:underline">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;