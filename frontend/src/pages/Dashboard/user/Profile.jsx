// src/pages/dashboard/user/Profile.jsx
import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Globe2,
  Lock,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Loader2,
  Save,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { COUNTRIES_DATA } from "../../../utils/constants";
import FloatInput from "../../../components/ui/FloatInput";
import FloatSelect from "../../../components/ui/FloatSelect";

const Profile = () => {
  const { currentUser, updateProfile, submitKyc, authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "",
    phone: currentUser?.phone || "",
    country: currentUser?.country || "",
    password: "",
  });

  const [kycForm, setKycForm] = useState({
    docType: "ID_CARD",
    docNumber: "",
    documents: { front: null, back: null, selfie: null },
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // FloatSelect renvoie la valeur directement (pas un event)
  const handleCountryChange = (val) => {
    const country = COUNTRIES_DATA.find((c) => c.name === val);
    setProfileForm((prev) => ({
      ...prev,
      country: val,
      phone: country ? country.code : prev.phone,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(profileForm);
    setLoading(false);
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setKycForm((prev) => ({
        ...prev,
        documents: { ...prev.documents, [field]: file.name },
      }));
    }
  };

  const handleSubmitKyc = async (e) => {
    e.preventDefault();
    await submitKyc(kycForm);
  };

  const countryOptions = COUNTRIES_DATA.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const docTypeOptions = [
    { value: "ID_CARD", label: "Carte d'Identité" },
    { value: "PASSPORT", label: "Passeport" },
    { value: "RESIDENCE_PERMIT", label: "Titre de Séjour" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* INFORMATIONS PERSONNELLES */}
      <div>
        <h3 className="text-xl font-black text-white uppercase mb-6 text-center">
          Mon Profil
        </h3>

        <form
          onSubmit={handleUpdateProfile}
          className="bg-[#161617] border border-white/5 p-7 sm:p-8 rounded-3xl space-y-5"
        >
          <div className="flex justify-center mb-2">
            <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-3xl">
              {currentUser?.name?.charAt(0) || "U"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FloatInput
              label="Nom Complet"
              name="name"
              value={profileForm.name}
              onChange={handleProfileChange}
              icon={User}
              required
            />

            <FloatSelect
              label="Pays"
              value={profileForm.country}
              onChange={handleCountryChange}
              options={countryOptions}
              icon={Globe2}
            />

            <FloatInput
              label="Téléphone"
              name="phone"
              type="tel"
              value={profileForm.phone}
              onChange={handleProfileChange}
              icon={Phone}
            />

            {/* Email non éditable */}
            <div className="relative">
              <div className="relative flex items-center bg-black/20 border border-white/5 rounded-xl">
                <div className="pl-4 flex-shrink-0">
                  <Mail size={15} className="text-gray-700" />
                </div>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="w-full bg-transparent py-3.5 pl-3 pr-4 text-gray-600 text-sm outline-none cursor-not-allowed"
                />
              </div>
              <label className="absolute pointer-events-none font-bold uppercase tracking-widest text-[9px] text-gray-600 top-0 -translate-y-1/2 right-4 bg-[#161617] px-2">
                Email
              </label>
            </div>

            <div className="md:col-span-2">
              <FloatInput
                label="Nouveau Mot de Passe"
                name="password"
                type="password"
                value={profileForm.password}
                onChange={handleProfileChange}
                icon={Lock}
              />
              <p className="text-[10px] text-gray-600 mt-1.5 ml-1">
                Laisser vide pour ne pas modifier
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] active:scale-[0.98] disabled:opacity-50"
            style={{ background: "#D4AF37", color: "#0A0A0B" }}
          >
            {loading || authLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Enregistrement...
              </>
            ) : (
              <>
                <Save size={15} /> Mettre à jour
              </>
            )}
          </button>
        </form>
      </div>

      {/* KYC */}
      <div className="bg-[#161617] border border-white/5 p-7 sm:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            Vérification KYC{" "}
            <ShieldCheck className="text-[#D4AF37]" size={18} />
          </h3>
          <span
            className={`px-3 py-1.5 rounded-full border text-[10px] font-black uppercase flex items-center gap-1.5 ${
              currentUser?.kycStatus === "VALID"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : currentUser?.kycStatus === "PENDING"
                  ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            {currentUser?.kycStatus === "VALID" ? (
              <>
                <CheckCircle size={12} /> Validé
              </>
            ) : currentUser?.kycStatus === "PENDING" ? (
              <>
                <Clock size={12} /> En attente
              </>
            ) : (
              <>
                <AlertCircle size={12} /> Non vérifié
              </>
            )}
          </span>
        </div>

        {currentUser?.kycStatus === "VALID" && (
          <div className="bg-green-500/5 border border-green-500/10 p-8 rounded-2xl text-center">
            <CheckCircle size={44} className="mx-auto text-green-500 mb-4" />
            <h4 className="text-white font-black text-lg mb-2">
              Identité confirmée
            </h4>
            <p className="text-gray-500 text-sm">
              Vous avez accès complet à tous nos services.
            </p>
          </div>
        )}

        {currentUser?.kycStatus === "PENDING" && (
          <div className="bg-orange-500/5 border border-orange-500/10 p-8 rounded-2xl text-center">
            <Clock size={44} className="mx-auto text-orange-500 mb-4" />
            <h4 className="text-white font-black text-lg mb-2">
              Vérification en cours
            </h4>
            <p className="text-gray-500 text-sm">
              Notre équipe examine vos documents. Délai moyen : 24h à 48h.
            </p>
          </div>
        )}

        {(!currentUser?.kycStatus ||
          currentUser?.kycStatus === "NONE" ||
          currentUser?.kycStatus === "REJECTED") && (
          <form onSubmit={handleSubmitKyc} className="space-y-5">
            <p className="text-gray-500 text-sm">
              Obligatoire pour les opérations de sourcing et logistique.
            </p>

            <FloatSelect
              label="Type de document"
              value={kycForm.docType}
              onChange={(val) => setKycForm({ ...kycForm, docType: val })}
              options={docTypeOptions}
              required
            />

            <FloatInput
              label="Numéro du document"
              name="docNumber"
              value={kycForm.docNumber}
              onChange={(e) =>
                setKycForm({ ...kycForm, docNumber: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UploadZone
                label="Recto"
                value={kycForm.documents.front}
                onChange={(e) => handleFileChange(e, "front")}
                required
              />
              {kycForm.docType !== "PASSPORT" && (
                <UploadZone
                  label="Verso"
                  value={kycForm.documents.back}
                  onChange={(e) => handleFileChange(e, "back")}
                />
              )}
              <div
                className={
                  kycForm.docType !== "PASSPORT" ? "md:col-span-2" : ""
                }
              >
                <UploadZone
                  label="Selfie avec pièce"
                  value={kycForm.documents.selfie}
                  onChange={(e) => handleFileChange(e, "selfie")}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
              style={{ background: "#D4AF37", color: "#0A0A0B" }}
            >
              {authLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Envoi en
                  cours...
                </>
              ) : (
                <>
                  <ShieldCheck size={15} /> Soumettre pour validation
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

function UploadZone({ label, value, onChange, required }) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-1 mb-1.5 block">
        {label}
      </label>
      <div className="relative h-28 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center hover:border-[#D4AF37]/50 transition cursor-pointer">
        <input
          type="file"
          required={required}
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={onChange}
        />
        {value ? (
          <span className="text-[#D4AF37] text-xs font-bold px-4 text-center">
            {value}
          </span>
        ) : (
          <>
            <Upload size={22} className="text-gray-500 mb-2" />
            <span className="text-xs text-gray-600">Cliquez pour ajouter</span>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
