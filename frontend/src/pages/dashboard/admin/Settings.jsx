// src/pages/dashboard/admin/Settings.jsx
import { useState } from "react";
import {
  UserCircle,
  Lock,
  DollarSign,
  Globe,
  Save,
  Eye,
  EyeOff,
  Check,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import FloatInput from "../../../components/ui/FloatInput";

export default function Settings() {
  const { currentUser, updateProfile } = useAuth();

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [econForm, setEconForm] = useState({
    dollarRate: "650",
    logisticRate: "8500",
    commission: "1",
    maintenance: false,
  });
  const [econSaved, setEconSaved] = useState(false);

  const handleProfileSave = async () => {
    await updateProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleEconSave = () => {
    setEconSaved(true);
    setTimeout(() => setEconSaved(false), 2500);
  };

  return (
    <main className="space-y-6 pb-10">
      {/* ── Profil Admin ── */}
      <section className="bg-[#111112] border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-5">
          <div className="p-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
            <UserCircle size={18} className="text-[#D4AF37]" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-white">
            Mon Profil Admin
          </h3>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-black font-black text-xl flex-shrink-0">
            {currentUser?.name?.[0] || "A"}
          </div>
          <div>
            <div className="text-sm font-black text-white">
              {currentUser?.name}
            </div>
            <div className="text-[10px] text-red-400 font-black uppercase tracking-widest">
              Administrateur
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">
              {currentUser?.uid}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatInput
            label="Nom public"
            name="name"
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm((p) => ({ ...p, name: e.target.value }))
            }
          />
          <FloatInput
            label="Email"
            name="email"
            type="email"
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm((p) => ({ ...p, email: e.target.value }))
            }
          />
        </div>

        <div className="border-t border-white/5 pt-4">
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-3">
            Changer le mot de passe
          </p>
          <div className="relative">
            <FloatInput
              label="Nouveau mot de passe"
              name="password"
              type={showPwd ? "text" : "password"}
              value={profileForm.password}
              onChange={(e) =>
                setProfileForm((p) => ({ ...p, password: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          onClick={handleProfileSave}
          className={`w-full py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 transition-all ${
            profileSaved
              ? "bg-green-500 text-white"
              : "bg-[#D4AF37] text-black hover:opacity-90"
          }`}
        >
          {profileSaved ? (
            <>
              <Check size={15} /> Enregistré
            </>
          ) : (
            "Mettre à jour mon profil"
          )}
        </button>
      </section>

      {/* ── Paramètres économiques ── */}
      <section className="bg-[#111112] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/5 pb-5">
          <div className="p-2 rounded-xl bg-white/5 border border-white/10">
            <Globe size={18} className="text-[#D4AF37]" />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight text-white">
            Paramètres Économiques
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FloatInput
            label="Taux Change Dollar ($)"
            name="dollarRate"
            type="number"
            value={econForm.dollarRate}
            onChange={(e) =>
              setEconForm((p) => ({ ...p, dollarRate: e.target.value }))
            }
          />
          <FloatInput
            label="Frais Logistique / KG (FCFA)"
            name="logisticRate"
            type="number"
            value={econForm.logisticRate}
            onChange={(e) =>
              setEconForm((p) => ({ ...p, logisticRate: e.target.value }))
            }
          />
          <FloatInput
            label="Commission Marketplace (%)"
            name="commission"
            type="number"
            value={econForm.commission}
            onChange={(e) =>
              setEconForm((p) => ({ ...p, commission: e.target.value }))
            }
          />
        </div>

        {/* Maintenance toggle */}
        <div className="flex items-center justify-between p-4 bg-white/3 rounded-xl border border-white/5">
          <div>
            <p className="text-sm font-black text-white">Mode Maintenance</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">
              Couper les accès publics
            </p>
          </div>
          <button
            onClick={() =>
              setEconForm((p) => ({ ...p, maintenance: !p.maintenance }))
            }
            className={`w-12 h-6 rounded-full transition-all duration-300 flex items-center ${
              econForm.maintenance
                ? "bg-red-500 justify-end"
                : "bg-white/10 justify-start"
            } p-0.5`}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
          </button>
        </div>

        {econForm.maintenance && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[11px] text-red-400 font-bold">
            ⚠️ Le site sera inaccessible aux visiteurs en mode maintenance.
          </div>
        )}

        <button
          onClick={handleEconSave}
          className={`w-full py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 border transition-all ${
            econSaved
              ? "bg-green-500 border-green-500 text-white"
              : "border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
          }`}
        >
          {econSaved ? (
            <>
              <Check size={15} /> Enregistré
            </>
          ) : (
            <>
              <Save size={15} /> Enregistrer la configuration
            </>
          )}
        </button>
      </section>
    </main>
  );
}
