import React, { useState, useRef } from "react";
import {
  Search,
  Car,
  Upload,
  X,
  Link as LinkIcon,
  MessageSquare,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Star,
  Clock,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import FloatInput from "../components/ui/FloatInput";

const Sourcing = ({ currentUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sourcing");
  const [animatingTab, setAnimatingTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleTabSwitch = (tab) => {
    if (tab === activeTab) return;
    setAnimatingTab(tab);
    setTimeout(() => {
      setActiveTab(tab);
      setAnimatingTab(null);
    }, 1200);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

  const handleProcess = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert(
        "Accès restreint : Veuillez vous connecter pour soumettre une demande.",
      );
      navigate("/login");
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0A0A0B] pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
            {activeTab === "sourcing" ? "Sourcing " : "Service "}
            <span className="text-[#D4AF37]">
              {activeTab === "sourcing" ? "Elite" : "Express"}
            </span>
          </h1>

          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto mt-8 backdrop-blur-md">
            <button
              onClick={() => handleTabSwitch("sourcing")}
              className={`relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden w-32 h-10 flex items-center justify-center ${activeTab === "sourcing" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" : "text-gray-500 hover:text-white"}`}
            >
              <span
                className={`transition-opacity duration-500 ${
                  animatingTab === "sourcing" ? "opacity-0" : "opacity-100"
                }`}
              >
                Sourcing
              </span>
              {animatingTab === "sourcing" && (
                <Search size={18} className="absolute animate-slide-button" />
              )}
            </button>
            <button
              onClick={() => handleTabSwitch("logistique")}
              className={`relative px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 overflow-hidden w-36 h-10 flex items-center justify-center ${activeTab === "logistique" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" : "text-gray-500 hover:text-white"}`}
            >
              <span
                className={`transition-opacity duration-500 ${
                  animatingTab === "logistique" ? "opacity-0" : "opacity-100"
                }`}
              >
                Logistique
              </span>
              {animatingTab === "logistique" && (
                <Car size={20} className="absolute animate-drive-button" />
              )}
            </button>
          </div>
        </div>

        {/* --- SECTION QUALITÉS --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-fade-in-up delay-100">
          <QualityCard
            icon={<Star size={18} />}
            title="Premium"
            desc="Qualité vérifiée"
          />
          <QualityCard
            icon={<Clock size={18} />}
            title="48h Max"
            desc="Réponse rapide"
          />
          <QualityCard
            icon={<ShieldCheck size={18} />}
            title="Sécurisé"
            desc="Paiement garanti"
          />
          <QualityCard
            icon={<Target size={18} />}
            title="Direct"
            desc="Prix usine"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6 animate-fade-in-up delay-200">
            {/* INPUT LIEN + PLATEFORMES */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 shadow-xl">
              <h4 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-4 flex items-center gap-2 italic">
                <LinkIcon size={14} /> Lien de l'article (Optionnel)
              </h4>
              <input
                type="text"
                placeholder="Collez le lien ici..."
                className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white outline-none focus:border-[#D4AF37] transition-all mb-6"
              />

              <div className="space-y-3">
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Ou recherchez sur :
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <PlatformLink name="Alibaba" url="https://alibaba.com" />
                  <PlatformLink name="1688.com" url="https://1688.com" />
                  <PlatformLink
                    name="Made-In-China"
                    url="https://made-in-china.com"
                  />
                  <PlatformLink
                    name="AliExpress"
                    url="https://aliexpress.com"
                  />
                </div>
              </div>
            </div>

            {/* NOTE CAUTION */}
            {activeTab === "sourcing" && (
              <div className="bg-[#D4AF37]/5 border-l-4 border-[#D4AF37] rounded-r-[2rem] p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#D4AF37] p-2 rounded-lg text-black">
                    <Zap size={16} fill="black" />
                  </div>
                  <h4 className="text-white font-black uppercase text-xs tracking-widest">
                    Engagement & Caution
                  </h4>
                </div>
                <p className="text-[11px] text-gray-400 leading-relaxed font-medium uppercase tracking-wide text-left">
                  Le sourcing personnel nécessite une caution unique de{" "}
                  <span className="text-white font-black">10 000 F CFA</span>.
                  <br />
                  <br />
                  Cette somme garantit le{" "}
                  <span className="text-[#D4AF37]">
                    sérieux de votre demande
                  </span>{" "}
                  et sera intégralement déduite de votre facture finale.
                  <span className="text-white block mt-2 underline">
                    Non remboursable en cas d'annulation.
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* --- FORMULAIRE --- */}
          <div className="lg:col-span-8 bg-[#161617] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <form onSubmit={handleProcess} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FloatInput label="Nom du produit" icon={Search} required />
                <FloatInput
                  label="Budget Estimé (FCFA)"
                  type="number"
                  icon={DollarSign}
                  required
                />
              </div>

              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white text-sm outline-none focus:border-[#D4AF37] transition-all min-h-[150px]"
                placeholder="Décrivez votre besoin précisément (Couleurs, Tailles, Quantités...)"
                required
              ></textarea>

              <div
                onClick={() => fileInputRef.current.click()}
                className="group border-2 border-dashed border-white/5 rounded-[2rem] p-10 flex flex-col items-center gap-4 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 cursor-pointer transition-all"
              >
                <Upload
                  className="text-gray-500 group-hover:text-[#D4AF37]"
                  size={32}
                />
                <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
                  Photos de référence (Optionnel)
                </span>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 group"
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="submit"
                variant="gold"
                size="full"
                loading={loading}
                className="py-6"
              >
                {activeTab === "sourcing"
                  ? "Payer la Caution & Lancer le Sourcing"
                  : "Valider l'expédition"}
              </Button>
            </form>
          </div>
        </div>

        {/* --- SECTION WHATSAPP --- */}
        <div className="mt-16 bg-[#161617] border border-white/5 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up delay-300">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center text-[#D4AF37] border border-[#D4AF37]/20">
                <MessageSquare size={28} />
              </div>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#25D366] rounded-full border-2 border-[#161617] animate-whatsapp-pulse shadow-[0_0_15px_#25D366]"></span>
            </div>
            <div className="text-left">
              <h4 className="text-lg font-black text-white uppercase italic">
                Besoin d'aide ?
              </h4>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                Un gérant est en ligne pour vous répondre.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/22990000000"
            target="_blank"
            className="bg-[#25D366] text-white px-8 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all flex items-center gap-2"
          >
            Discuter sur WhatsApp <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </main>
  );
};

const QualityCard = ({ icon, title, desc }) => (
  <main className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:border-[#D4AF37]/20 transition-all group">
    <div className="text-[#D4AF37] mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h5 className="text-white text-[10px] font-black uppercase tracking-tighter text-left">
      {title}
    </h5>
    <p className="text-gray-600 text-[9px] font-bold uppercase tracking-widest text-left">
      {desc}
    </p>
  </main>
);

const PlatformLink = ({ name, url }) => (
  <a
    href={url}
    target="_blank"
    rel="noreferrer"
    className="flex items-center justify-between bg-white/5 border border-white/5 px-3 py-2 rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all group"
  >
    <span className="text-[9px] font-black uppercase tracking-widest">
      {name}
    </span>
    <ArrowRight size={10} className="opacity-0 group-hover:opacity-100" />
  </a>
);

export default Sourcing;
