import React, { useState } from "react";
import {
  Sparkles,
  Shield,
  Calculator,
  Search,
  X,
  CheckCircle,
  Ship,
  MapPin,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

// Données mock
const MOCK_ORDERS = [
  {
    id: "CMD-2401-001",
    type: "SOURCING",
    product: "Ecran LED 55 pouces",
    status: "EN_TRANSIT",
    date: "2024-01-15",
    trackingInternal: "BJ-TRK-889",
    trackingCarrier: "DHL-998212",
  },
  {
    id: "CMD-2401-002",
    type: "MARKETPLACE",
    product: "iPhone 15 Pro",
    status: "LIVRE",
    date: "2024-01-10",
    trackingInternal: "BJ-TRK-774",
    trackingCarrier: "FEDEX-1123",
  },
];

const StatusBadge = ({ status }) => {
  const colors = {
    LIVRE: "bg-green-500/20 text-green-400 border border-green-500/20",
    EXPEDIE: "bg-green-500/20 text-green-400 border border-green-500/20",
    EN_TRANSIT: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    SOURCING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    EN_ATTENTE: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    ANNULE: "bg-red-500/20 text-red-400 border border-red-500/20",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${colors[status] || "bg-yellow-500/20 text-yellow-400"}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};

const actionLinks = [
  { to: "/marketplace", label: "Commencer maintenant" },
  {
    to: null,
    label: "Suivre un colis",
    icon: <Shield size={15} />,
    isTracking: true,
  },
  { to: "/sourcing", label: "Estimer Frais", icon: <Calculator size={15} /> },
];

const steps = [
  {
    label: "Commande validée",
    icon: <CheckCircle size={15} />,
    statuses: ["EN_ATTENTE", "SOURCING", "EXPEDIE", "EN_TRANSIT", "LIVRE"],
  },
  {
    label: "Expédition Internationale",
    icon: <Ship size={15} />,
    statuses: ["EXPEDIE", "EN_TRANSIT", "LIVRE"],
  },
  {
    label: "En Transit",
    icon: <Package size={15} />,
    statuses: ["EN_TRANSIT", "LIVRE"],
  },
  {
    label: "Arrivée Hub Cotonou",
    icon: <MapPin size={15} />,
    statuses: ["LIVRE"],
  },
];

const Home = () => {
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = () => {
    if (!search.trim()) return;
    const found = MOCK_ORDERS.find(
      (o) => o.trackingInternal === search.trim() || o.id === search.trim(),
    );
    setResult(found || "NOT_FOUND");
    setSearched(true);
  };

  const closeModal = () => {
    setTrackingOpen(false);
    setSearch("");
    setResult(null);
    setSearched(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-start items-center text-center px-4 pt-20 relative overflow-hidden">
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      {/* Badge */}
      <div className="badge-gold mb-10">
        <Sparkles size={13} />
        Sourcing Premium Chine-Afrique
      </div>

      {/* Titre */}
      <h1 className="text-6xl md:text-8xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[0.85] uppercase">
        Importez sans <br />
        <span className="text-[#D4AF37]">Aucune Crainte.</span>
      </h1>

      {/* Description */}
      <p className="text-gray-500 text-base md:text-lg max-w-2xl mb-14 font-medium leading-relaxed">
        La solution facile pour vos imports Chine-Afrique : Achat, Groupage et
        Livraison à domicile.{" "}
        <span className="text-gray-300">
          1% de commission, tout simplement.
        </span>
      </p>

      {/* Boutons */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        {actionLinks.map(({ to, label, icon, isTracking }) => {
          const commonClass =
            "relative flex items-center justify-center gap-2 px-10 py-4 rounded-full font-black text-sm uppercase tracking-wide transition-all duration-300";

          if (isTracking) {
            return (
              <button
                key={label}
                onClick={() => setTrackingOpen(true)}
                className={commonClass}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
              >
                {icon} {label}
              </button>
            );
          }

          return (
            <Link
              key={to}
              to={to}
              className={commonClass}
              style={
                to === "/marketplace"
                  ? { background: "#D4AF37", color: "#0A0A0B" }
                  : {
                      background: "transparent",
                      border: "1px solid rgba(212,175,55,0.4)",
                      color: "#D4AF37",
                    }
              }
            >
              {icon} {label}
            </Link>
          );
        })}
      </div>

      {/* ── MODAL SUIVI ── */}
      {trackingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-[#111112] border border-white/10 rounded-3xl w-full max-w-md shadow-2xl animate-fade-in-up">
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Suivi de <span className="text-[#D4AF37]">Colis</span>
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-white transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Corps modal */}
            <div className="p-6 space-y-5">
              <p className="text-gray-500 text-xs">
                Entrez votre numéro de suivi interne ou l'ID de commande
              </p>

              {/* Input recherche */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: BJ-TRK-889"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm px-5 py-3.5 pr-14 rounded-xl outline-none focus:border-[#D4AF37]/50 transition placeholder:text-gray-600"
                />
                <button
                  onClick={handleTrack}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#D4AF37] text-black p-2.5 rounded-lg hover:bg-[#f3cc4d] transition"
                >
                  <Search size={16} />
                </button>
              </div>

              {/* Exemples */}
              <div className="flex gap-2 flex-wrap">
                {["BJ-TRK-889", "BJ-TRK-774"].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setSearch(ex)}
                    className="text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full hover:bg-[#D4AF37]/20 transition"
                  >
                    {ex}
                  </button>
                ))}
              </div>

              {/* Résultat trouvé */}
              {result && result !== "NOT_FOUND" && (
                <div className="bg-white/3 border border-white/5 rounded-2xl p-5 animate-fade-in-up space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">
                        Produit
                      </div>
                      <div className="font-black text-white">
                        {result.product}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {result.date} • {result.type}
                      </div>
                    </div>
                    <StatusBadge status={result.status} />
                  </div>

                  {/* Numéros tracking */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl px-3 py-2">
                      <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">
                        Tracking BJ
                      </div>
                      <div className="font-mono text-[#D4AF37] font-black text-xs">
                        {result.trackingInternal}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                      <div className="text-[9px] text-gray-500 uppercase font-bold mb-1">
                        Transporteur
                      </div>
                      <div className="font-mono text-white font-black text-xs">
                        {result.trackingCarrier}
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-0 pt-2">
                    {steps.map((step, i) => {
                      const isActive = step.statuses.includes(result.status);
                      const isLast = i === steps.length - 1;
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? "bg-[#D4AF37] text-black" : "bg-white/5 text-gray-600 border border-white/10"}`}
                            >
                              {step.icon}
                            </div>
                            {!isLast && (
                              <div
                                className={`w-0.5 h-6 ${isActive ? "bg-[#D4AF37]/40" : "bg-white/10"}`}
                              />
                            )}
                          </div>
                          <div className="pt-1.5 pb-6">
                            <span
                              className={`text-xs font-bold ${isActive ? "text-white" : "text-gray-600"}`}
                            >
                              {step.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Non trouvé */}
              {searched && result === "NOT_FOUND" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-fade-in-up">
                  <div className="text-red-400 font-black text-xs uppercase tracking-widest mb-1">
                    Aucune commande trouvée
                  </div>
                  <p className="text-gray-500 text-xs">
                    Vérifiez le numéro ou contactez-nous.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
