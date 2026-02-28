import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
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
  Zap,
  ShieldCheck,
  Smartphone,
  AlertTriangle,
  Plane,
  ChevronDown,
  Check,
  ArrowRight,
  Globe,
  Coins,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const SERVICES_DATA = [
  {
    title: "Sourcing Chine",
    desc: "Nous trouvons les meilleurs fournisseurs certifiés pour vos produits.",
    icon: <Globe className="text-[#D4AF37]" size={24} />,
    tag: "Expertise",
    modalDesc:
      "Notre équipe basée en Chine sélectionne et audite les fournisseurs pour vous. Vous recevez des devis comparatifs, des photos d'inspection et une validation qualité avant expédition.",
    points: [
      "Recherche fournisseur sous 48h",
      "Inspection produit et photos avant envoi",
      "Négociation des prix en votre nom",
      "Accompagnement jusqu'à la livraison",
    ],
    cta: { label: "Lancer un sourcing", to: "/register" },
  },
  {
    title: "Commission 1%",
    desc: "La transparence totale. Pas de frais cachés, juste une commission fixe.",
    icon: <Coins className="text-[#D4AF37]" size={24} />,
    tag: "Économie",
    modalDesc:
      "Contrairement aux intermédiaires classiques qui prennent 5 à 15%, BJ Business applique une commission fixe et transparente de 1% sur la valeur de vos achats. Tout est détaillé dans votre espace client.",
    points: [
      "1% sur la valeur d'achat, rien de plus",
      "Frais de transport facturés au réel",
      "Récapitulatif complet dans le dashboard",
      "Aucun abonnement, aucun frais fixe",
    ],
    cta: { label: "Créer un compte", to: "/register" },
  },
  {
    title: "Logistique Rapide",
    desc: "Expédition par avion ou bateau avec suivi en temps réel complet.",
    icon: <Zap className="text-[#D4AF37]" size={24} />,
    tag: "Vitesse",
    modalDesc:
      "Nous gérons l'expédition de bout en bout : dédouanement, transit et livraison finale à Cotonou ou votre ville. Chaque colis obtient un numéro de suivi unique consultable 24h/24.",
    points: [
      "Voie aérienne : 15 à 21 jours",
      "Voie maritime : 30 à 45 jours",
      "Suivi en temps réel depuis /suivi",
      "Dédouanement inclus dans nos services",
    ],
    cta: { label: "Estimer mes frais", to: null, action: "sim" },
  },
  {
    title: "Sécurité Totale",
    desc: "Vos fonds et marchandises sont protégés par l'Aurum Protocol.",
    icon: <ShieldCheck className="text-[#D4AF37]" size={24} />,
    tag: "Confiance",
    modalDesc:
      "L'Aurum Protocol garantit que vos fonds ne sont débloqués au fournisseur qu'après validation des photos d'inspection. En cas de litige, notre équipe intervient en médiateur.",
    points: [
      "Fonds sécurisés jusqu'à validation",
      "KYC obligatoire pour tous les membres",
      "Caution remboursable à tout moment",
      "Médiation gratuite en cas de litige",
    ],
    cta: { label: "En savoir plus", to: "/register" },
  },
  {
    title: "Groupage",
    desc: "Participez à des achats groupés pour réduire vos coûts d'importation.",
    icon: <Package className="text-[#D4AF37]" size={24} />,
    tag: "Économies",
    modalDesc:
      "Le groupage vous permet de partager un conteneur avec d'autres importateurs. Vous ne payez que votre portion réelle du volume, ce qui peut diviser vos frais de transport par 3 ou 4.",
    points: [
      "Partage des frais de conteneur",
      "Économies jusqu'à 70% sur le fret",
      "Conteneurs ouverts toutes les 2 semaines",
      "Suivi dédié par groupage",
    ],
    cta: { label: "Voir les groupages", to: "/groupage" },
  },
  {
    title: "Marketplace",
    desc: "Achetez et vendez des produits déjà importés en toute sécurité.",
    icon: <TrendingUp className="text-[#D4AF37]" size={24} />,
    tag: "Commerce",
    modalDesc:
      "Notre marketplace regroupe des produits déjà importés et disponibles immédiatement au Bénin. Achetez sans attendre les délais d'expédition, ou vendez vos propres stocks importés.",
    points: [
      "Livraison immédiate depuis le stock local",
      "Produits vérifiés par l'équipe BJ Business",
      "Paiement sécurisé via l'Aurum Protocol",
      "Vendeurs certifiés KYC uniquement",
    ],
    cta: { label: "Explorer la marketplace", to: "/marketplace" },
  },
];

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

const SEA_RATE_CBM = 265000;
const SHIPPING_RATES = [
  {
    id: "NORMAL",
    label: "Articles Normaux",
    price: 9000,
    unit: "Kg",
    details: "Vêtements, Chaussures, Articles quotidiens",
    delay: "21 jours",
  },
  {
    id: "SPECIAL",
    label: "Articles Spéciaux",
    price: 10500,
    unit: "Kg",
    details: "Liquides, Poudres, Cosmétiques, Batterie intégrée",
    delay: "30 jours",
  },
  {
    id: "MEDICAL",
    label: "Médicaux & Autres",
    price: 11500,
    unit: "Kg",
    details: "Santé, Scanners, Topographie",
    delay: "30 jours",
  },
  {
    id: "COMPUTER",
    label: "Ordinateurs",
    price: 25000,
    unit: "Kg",
    details: "Ordinateurs portables",
    delay: "30 jours",
  },
  {
    id: "PHONE",
    label: "Smartphones",
    price: 15000,
    unit: "Unité",
    details: "Smartphones, Tablettes",
    delay: "30 jours",
  },
];
const PROHIBITED_ITEMS = [
  "Téléphones et ordinateurs par voie maritime",
  "Batteries pures (Powerbank) interdites de vol (risque incendie)",
  "Drones (interdits avion et bateau)",
  "Produits chimiques dangereux ou toxiques",
  "Armes réelles ou répliques parfaites",
  "Articles sous forme de sprays (aérosols)",
  "Médicaments sans autorisation d'importation",
  "Liquides inflammables et explosifs",
];
const TRACKING_STEPS = [
  {
    label: "Commande validée",
    statuses: ["EN_ATTENTE", "SOURCING", "EXPEDIE", "EN_TRANSIT", "LIVRE"],
    Icon: CheckCircle,
  },
  {
    label: "Expédition Internationale",
    statuses: ["EXPEDIE", "EN_TRANSIT", "LIVRE"],
    Icon: Ship,
  },
  { label: "En Transit", statuses: ["EN_TRANSIT", "LIVRE"], Icon: Package },
  { label: "Arrivée Hub Cotonou", statuses: ["LIVRE"], Icon: MapPin },
];
const MODES = [
  { id: "AIR", label: "Aérien", ModeIcon: Plane },
  { id: "SEA", label: "Maritime", ModeIcon: Ship },
];
const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    n,
  );

const AnimStyles = () => (
  <style>{`
    @keyframes overlayIn   { from{opacity:0} to{opacity:1} }
    @keyframes modalPop    { from{opacity:0;transform:scale(0.96) translateY(14px)} to{opacity:1;transform:scale(1) translateY(0)} }
    @keyframes fadeUp      { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
    @keyframes tabFade     { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:translateY(0)} }
    @keyframes dropIn      { from{opacity:0;transform:translateY(-6px) scaleY(0.95)} to{opacity:1;transform:translateY(0) scaleY(1)} }
    @keyframes fadeSlideIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes autoScroll  { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .anim-overlay { animation:overlayIn   0.22s ease forwards; }
    .anim-modal   { animation:modalPop    0.32s cubic-bezier(0.34,1.4,0.64,1) forwards; }
    .anim-fade-up { animation:fadeUp      0.28s ease forwards; }
    .anim-tab     { animation:tabFade     0.20s ease forwards; }
    .anim-drop    { animation:dropIn      0.22s cubic-bezier(0.22,1,0.36,1) forwards; transform-origin:top; }
    .anim-hero    { animation:fadeSlideIn 0.6s ease-out forwards; }
    .slider-track { display:flex; width:max-content; animation:autoScroll 60s linear infinite; will-change:transform; }
    .slider-track:hover { animation-play-state:paused; }
    .slider-wrapper {
      overflow:hidden;
      -webkit-mask-image:linear-gradient(to right,transparent 0%,black 8%,black 92%,transparent 100%);
      mask-image:linear-gradient(to right,transparent 0%,black 8%,black 92%,transparent 100%);
    }
    .custom-scroll::-webkit-scrollbar       { width:3px }
    .custom-scroll::-webkit-scrollbar-track { background:transparent }
    .custom-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.07);border-radius:99px }
    @keyframes badgePulse {
      0%,100% { box-shadow:0 0 0 0 rgba(212,175,55,0); opacity:1; }
      50%      { box-shadow:0 0 0 6px rgba(212,175,55,0.18); opacity:0.85; }
    }
    .badge-gold {
      display:inline-flex;
      align-items:center;
      gap:6px;
      padding:6px 14px;
      border-radius:999px;
      background:rgba(212,175,55,0.08);
      border:1px solid rgba(212,175,55,0.3);
      color:#D4AF37;
      font-size:10px;
      font-weight:900;
      text-transform:uppercase;
      letter-spacing:0.15em;
      animation:badgePulse 2s ease-in-out infinite;
    }
  `}</style>
);

// ── FLOAT INPUT ───────────────────────────────────────────────────────────────
function FloatInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onKeyDown,
  required = false,
  icon: Icon,
  rightElement,
}) {
  const [focused, setFocused] = useState(false);
  const isFloating =
    focused ||
    (value !== undefined && value !== null && String(value).length > 0);
  return (
    <main className="relative">
      <div
        className={`relative flex items-center bg-black/40 border rounded-xl transition-all duration-300 ${focused ? "border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.08)]" : "border-white/10"}`}
      >
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
          onKeyDown={onKeyDown}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-transparent py-3.5 text-white text-sm outline-none placeholder-transparent transition-all ${Icon ? "pl-3" : "pl-4"} ${rightElement ? "pr-2" : "pr-4"}`}
          placeholder={label}
        />
        {rightElement && (
          <div className="pr-2.5 flex-shrink-0">{rightElement}</div>
        )}
      </div>
      <label
        className={`absolute pointer-events-none font-bold uppercase tracking-widest transition-all duration-300 ${
          isFloating
            ? "text-[9px] text-[#D4AF37] top-0 -translate-y-1/2 right-4 bg-[#111112] px-2 z-10"
            : `text-sm text-gray-600 top-1/2 -translate-y-1/2 ${Icon ? "left-10" : "left-4"}`
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#D4AF37]">*</span>}
      </label>
    </main>
  );
}

// ── FLOAT SELECT — Portal (dropdown rendu sur document.body) ──────────────────
// ⚠️ NE PAS wrapper ce composant dans un FadePanel avec key dynamique
// car cela détruit/recrée le DOM et la ref triggerRef devient null
function FloatSelect({
  label,
  value,
  onChange,
  options = [],
  required = false,
  icon: Icon,
  scrollContainerRef,
  onOpenChange,
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);

  const isFloating = focused || open || (value && value.length > 0);
  const selectedLabel = options.find((o) => o.value === value)?.label || "";

  const setOpenAndNotify = (v) => {
    setOpen(v);
    onOpenChange?.(v);
  };

  useEffect(() => {
    const h = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpenAndNotify(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const updatePos = () => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, left: r.left, width: r.width });
    }
  };

  useEffect(() => {
    if (!open) return;
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    const el = scrollContainerRef?.current;
    if (el) el.addEventListener("scroll", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
      if (el) el.removeEventListener("scroll", updatePos);
    };
  }, [open, scrollContainerRef]);

  return (
    <main className="relative" ref={wrapRef}>
      <div
        ref={triggerRef}
        onClick={() => {
          updatePos();
          setOpenAndNotify(!open);
          setFocused(true);
        }}
        className={`relative flex items-center bg-black/40 border rounded-xl cursor-pointer transition-all duration-300 ${open ? "border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.08)]" : "border-white/10"}`}
      >
        {Icon && (
          <div className="pl-4 flex-shrink-0">
            <Icon
              size={15}
              className={`transition-colors duration-300 ${open ? "text-[#D4AF37]" : "text-gray-600"}`}
            />
          </div>
        )}
        <div
          className={`flex-1 py-3.5 text-sm select-none ${Icon ? "pl-3" : "pl-4"} ${selectedLabel ? "text-white" : "text-transparent"}`}
        >
          {selectedLabel || label}
        </div>
        <div className="pr-4">
          <ChevronDown
            size={15}
            className={`text-gray-500 transition-transform duration-300 ${open ? "rotate-180 text-[#D4AF37]" : ""}`}
          />
        </div>
      </div>
      <label
        className={`absolute pointer-events-none font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
          isFloating
            ? "text-[9px] text-[#D4AF37] top-0 -translate-y-1/2 right-4 bg-[#111112] px-2 z-10"
            : `text-sm text-gray-600 top-1/2 -translate-y-1/2 ${Icon ? "left-10" : "left-4"}`
        }`}
      >
        {label}
        {required && <span className="ml-1 text-[#D4AF37]">*</span>}
      </label>

      {open &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              top: pos.top,
              left: pos.left,
              width: pos.width,
              zIndex: 9999,
            }}
          >
            <div className="bg-[#111112] border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] anim-drop">
              <div className="max-h-52 overflow-y-auto custom-scroll">
                {options.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(opt.value);
                      setOpenAndNotify(false);
                      setFocused(false);
                    }}
                    className={`flex items-center justify-between px-4 py-3 text-sm cursor-pointer transition-all ${value === opt.value ? "bg-[#D4AF37]/10 text-[#D4AF37] font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                  >
                    <span>{opt.label}</span>
                    {value === opt.value && (
                      <Check size={14} className="text-[#D4AF37]" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body,
        )}
      <input
        tabIndex="-1"
        className="absolute opacity-0 pointer-events-none w-full bottom-0"
        value={value || ""}
        onChange={() => {}}
        required={required}
      />
    </main>
  );
}

const StatusBadge = ({ status }) => {
  const c = {
    LIVRE: "bg-green-500/20 text-green-400 border border-green-500/20",
    EXPEDIE: "bg-green-500/20 text-green-400 border border-green-500/20",
    EN_TRANSIT: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    SOURCING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    EN_ATTENTE: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
    ANNULE: "bg-red-500/20 text-red-400 border border-red-500/20",
  };
  return (
    <span
      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase flex-shrink-0 ${c[status] || "bg-yellow-500/20 text-yellow-400"}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};

const ServiceCard = ({ service, onOpen }) => (
  <div
    onClick={() => onOpen(service)}
    className="min-w-[280px] sm:min-w-[320px] group relative p-8 rounded-[2.5rem] bg-[#111112] border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden mx-3 cursor-pointer"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="relative z-10 flex flex-col items-start text-left">
      <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform duration-500">
        {service.icon}
      </div>
      <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest mb-2 opacity-60">
        {service.tag}
      </span>
      <h3 className="text-white font-black text-lg uppercase mb-3 tracking-tight">
        {service.title}
      </h3>
      <p className="text-gray-500 text-xs leading-loose font-medium mb-6">
        {service.desc}
      </p>
      <div className="mt-auto flex items-center gap-2 text-white font-black text-[10px] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
        En savoir plus <ArrowRight size={12} className="text-[#D4AF37]" />
      </div>
    </div>
  </div>
);

/* ── Modal détail service ──────────────────────────────────────────────────── */
const ServiceModal = ({ service, onClose, onOpenSim }) => {
  if (!service) return null;
  return (
    <main
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 anim-overlay"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#111112] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl anim-modal max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
              {service.icon}
            </div>
            <div>
              <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest opacity-60">
                {service.tag}
              </span>
              <h3 className="text-base font-black text-white uppercase tracking-tight leading-tight">
                {service.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps */}
        <div className="overflow-y-auto custom-scroll flex-1 p-5 sm:p-6 space-y-5">
          {/* Description longue */}
          <p className="text-gray-400 text-sm leading-relaxed">
            {service.modalDesc}
          </p>

          {/* Points clés */}
          <div className="bg-white/3 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Ce que vous obtenez
            </div>
            {service.points.map((pt, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle size={11} className="text-[#D4AF37]" />
                </div>
                <span className="text-white text-sm font-medium leading-relaxed">
                  {pt}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          {service.cta &&
            (service.cta.action === "sim" ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenSim();
                }}
                className="w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#D4AF37", color: "#0A0A0B" }}
              >
                {service.cta.label} <ArrowRight size={13} />
              </button>
            ) : (
              <Link
                to={service.cta.to || "/register"}
                onClick={onClose}
                className="w-full py-3.5 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#D4AF37", color: "#0A0A0B" }}
              >
                {service.cta.label} <ArrowRight size={13} />
              </Link>
            ))}
        </div>
      </div>
    </main>
  );
};

export default function Home() {
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const [simOpen, setSimOpen] = useState(false);
  const [serviceModal, setServiceModal] = useState(null); // service sélectionné pour le modal
  const [tab, setTab] = useState("calc");
  const [mode, setMode] = useState("AIR");
  const [category, setCategory] = useState("NORMAL");
  const [dims, setDims] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    quantity: "1",
  });
  const [simResult, setSimResult] = useState(null);

  // Ref du conteneur scrollable du modal simulateur — passée au FloatSelect
  const simScrollRef = useRef(null);
  const [selectDropOpen, setSelectDropOpen] = useState(false);

  const rate = SHIPPING_RATES.find((r) => r.id === category);
  const isUnit = rate?.unit === "Unité";

  const handleTrack = () => {
    if (!search.trim()) return;
    const found = MOCK_ORDERS.find(
      (o) => o.trackingInternal === search.trim() || o.id === search.trim(),
    );
    setResult(found || "NOT_FOUND");
    setSearched(true);
  };
  const closeTracking = () => {
    setTrackingOpen(false);
    setSearch("");
    setResult(null);
    setSearched(false);
  };

  const calculate = () => {
    const L = parseFloat(dims.length) || 0,
      W = parseFloat(dims.width) || 0,
      H = parseFloat(dims.height) || 0;
    const Wt = parseFloat(dims.weight) || 0,
      Q = parseFloat(dims.quantity) || 1;
    if (mode === "AIR") {
      if (isUnit) {
        setSimResult({
          cost: rate.price * Q,
          label: `${Q} × ${rate.label}`,
          sub: null,
        });
      } else {
        const vol = (L * W * H) / 6000,
          chrg = Math.max(Wt, vol);
        setSimResult({
          cost: chrg * rate.price,
          label: `${chrg.toFixed(2)} kg facturés`,
          sub: `Poids volumétrique : ${vol.toFixed(2)} kg — Tarif : ${fmt(rate.price)}/kg`,
        });
      }
    } else {
      const cbm = (L * W * H) / 1_000_000;
      setSimResult({
        cost: Math.max(cbm, 0.1) * SEA_RATE_CBM,
        label: `Volume : ${cbm.toFixed(3)} CBM`,
        sub: `Tarif maritime : ${fmt(SEA_RATE_CBM)}/CBM`,
      });
    }
  };
  const closeSim = () => {
    setSimOpen(false);
    setSimResult(null);
    setTab("calc");
    setMode("AIR");
    setCategory("NORMAL");
    setDims({ length: "", width: "", height: "", weight: "", quantity: "1" });
  };
  const changeMode = (m) => {
    setMode(m);
    setSimResult(null);
  };

  const categoryOptions = SHIPPING_RATES.map((r) => ({
    value: r.id,
    label: `${r.label} — ${fmt(r.price)}/${r.unit}`,
  }));
  const loopedServices = [...SERVICES_DATA, ...SERVICES_DATA];

  return (
    <main className="min-h-screen flex flex-col justify-start items-center text-center px-4 sm:px-6 pt-20 relative overflow-hidden">
      <AnimStyles />

      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(212,175,55,0.08) 0%,transparent 70%)",
          filter: "blur(100px)",
        }}
      />

      <div className="badge-gold mb-8 sm:mb-10 anim-hero">
        <Sparkles size={11} />
        <span className="text-[10px] sm:text-[11px]">
          Sourcing Premium Chine-Afrique
        </span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-4 sm:mb-6 tracking-tighter leading-[0.88] uppercase max-w-5xl anim-hero">
        Importez sans <br />
        <span className="text-[#D4AF37]">Aucune Crainte.</span>
      </h1>

      <p className="text-gray-500 text-sm sm:text-base md:text-lg max-w-xl sm:max-w-2xl mb-10 sm:mb-14 font-medium leading-relaxed px-2 anim-hero">
        La solution facile pour vos imports Chine-Afrique : Achat, Groupage et
        Livraison à domicile.{" "}
        <span className="text-gray-300">
          1% de commission, tout simplement.
        </span>
      </p>

      <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full max-w-2xl px-2 mb-24 anim-hero">
        <Link
          to="/login"
          className="relative flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-wide transition-all duration-300 active:scale-95"
          style={{ background: "#D4AF37", color: "#0A0A0B" }}
        >
          Commencer maintenant
        </Link>
        <button
          onClick={() => setTrackingOpen(true)}
          className="relative flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-wide transition-all duration-300 active:scale-95"
          style={{
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        >
          <Shield size={13} /> Suivre un colis
        </button>
        <button
          onClick={() => setSimOpen(true)}
          className="relative flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-wide transition-all duration-300 active:scale-95"
          style={{
            background: "transparent",
            border: "1px solid rgba(212,175,55,0.4)",
            color: "#D4AF37",
          }}
        >
          <Calculator size={13} /> Estimer Frais
        </button>
      </div>

      <div className="w-full mb-28">
        <div className="flex items-center justify-between mb-10 px-4 sm:px-8 max-w-6xl mx-auto">
          <h2 className="text-white font-black text-xl sm:text-2xl uppercase tracking-tighter italic text-left">
            Pourquoi nous <span className="text-[#D4AF37]">choisir ?</span>
          </h2>
          <div className="h-[1px] flex-1 bg-white/5 mx-6 hidden sm:block" />
          <span className="text-gray-600 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] hidden sm:block">
            Cliquez pour en savoir plus
          </span>
        </div>
        <div className="slider-wrapper w-full py-4">
          <div className="slider-track">
            {loopedServices.map((s, i) => (
              <ServiceCard key={i} service={s} onOpen={setServiceModal} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══ MODAL SUIVI ═══════════════════════════════════════════════════ */}
      {trackingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 anim-overlay"
          style={{
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(10px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeTracking()}
        >
          <div className="bg-[#111112] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-md shadow-2xl anim-modal max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/5 flex-shrink-0">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Suivi de <span className="text-[#D4AF37]">Colis</span>
              </h3>
              <button
                onClick={closeTracking}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>
            <div className="overflow-y-auto custom-scroll flex-1 p-4 sm:p-6 space-y-4">
              <p className="text-gray-500 text-[11px] sm:text-xs">
                Entrez votre numéro de suivi interne ou l'ID de commande
              </p>
              <FloatInput
                label="Ex : BJ-TRK-889 ou CMD-2401-001"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                icon={Search}
                rightElement={
                  <button
                    onClick={handleTrack}
                    className="bg-[#D4AF37] text-black p-2 rounded-lg hover:bg-[#f0c93a] transition-colors active:scale-95"
                  >
                    <Search size={13} />
                  </button>
                }
              />
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-[9px] text-gray-600 uppercase font-bold">
                  Essayer :
                </span>
                {["BJ-TRK-889", "BJ-TRK-774"].map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setSearch(ex)}
                    className="text-[9px] sm:text-[10px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2.5 py-1 rounded-full hover:bg-[#D4AF37]/20 transition-colors"
                  >
                    {ex}
                  </button>
                ))}
              </div>
              {result && result !== "NOT_FOUND" && (
                <div className="bg-white/3 border border-white/5 rounded-2xl p-4 sm:p-5 anim-fade-up space-y-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">
                        Produit
                      </div>
                      <div className="font-black text-white text-sm sm:text-base break-words">
                        {result.product}
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        {result.date} • {result.type}
                      </div>
                    </div>
                    <StatusBadge status={result.status} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl px-3 py-2.5">
                      <div className="text-[8px] text-gray-500 uppercase font-bold mb-1">
                        Tracking BJ
                      </div>
                      <div className="font-mono text-[#D4AF37] font-black text-[10px] sm:text-xs break-all">
                        {result.trackingInternal}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                      <div className="text-[8px] text-gray-500 uppercase font-bold mb-1">
                        Transporteur
                      </div>
                      <div className="font-mono text-white font-black text-[10px] sm:text-xs break-all">
                        {result.trackingCarrier}
                      </div>
                    </div>
                  </div>
                  <div>
                    {TRACKING_STEPS.map((step, i) => {
                      const StepIcon = step.Icon,
                        active = step.statuses.includes(result.status),
                        last = i === TRACKING_STEPS.length - 1;
                      return (
                        <div key={i} className="flex gap-3">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <div
                              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-500 ${active ? "bg-[#D4AF37] text-black shadow-[0_0_10px_rgba(212,175,55,0.3)]" : "bg-white/5 text-gray-600 border border-white/10"}`}
                            >
                              <StepIcon size={13} />
                            </div>
                            {!last && (
                              <div
                                className={`w-0.5 h-5 sm:h-6 transition-colors duration-500 ${active ? "bg-[#D4AF37]/35" : "bg-white/10"}`}
                              />
                            )}
                          </div>
                          <div
                            className={`pt-1.5 pb-4 flex-1 text-[11px] sm:text-xs font-bold transition-colors duration-300 ${active ? "text-white" : "text-gray-600"}`}
                          >
                            {step.label}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {searched && result === "NOT_FOUND" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 anim-fade-up">
                  <div className="text-red-400 font-black text-[10px] uppercase tracking-widest mb-1">
                    Aucune commande trouvée
                  </div>
                  <p className="text-gray-500 text-[10px] sm:text-xs">
                    Vérifiez le numéro ou contactez le support.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL SIMULATEUR ══════════════════════════════════════════════
          ⚠️ FIX CRITIQUE : le FloatSelect N'EST PAS dans un FadePanel.
          Un FadePanel avec key dynamique recrée le DOM à chaque re-render,
          ce qui détruit triggerRef et fait buguer le positionnement du dropdown.
          Solution : onglet "calc" = un seul div.anim-tab stable, pas de FadePanel imbriqué.
      ══════════════════════════════════════════════════════════════════════ */}
      {simOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 anim-overlay"
          style={{
            background: "rgba(0,0,0,0.82)",
            backdropFilter: "blur(10px)",
          }}
          onClick={(e) => e.target === e.currentTarget && closeSim()}
        >
          <div className="bg-[#111112] border border-white/10 rounded-2xl sm:rounded-3xl w-full max-w-lg shadow-2xl anim-modal max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/5 flex-shrink-0">
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                Simulateur de <span className="text-[#D4AF37]">Frais</span>
              </h3>
              <button
                onClick={closeSim}
                className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex border-b border-white/5 flex-shrink-0">
              {[
                { id: "calc", label: "Calculer" },
                { id: "rates", label: "Tarifs" },
                { id: "prohibited", label: "Interdits" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex-1 py-3 text-[10px] sm:text-xs font-black uppercase tracking-wide transition-all duration-300 border-b-2 ${tab === t.id ? "border-[#D4AF37] text-[#D4AF37]" : "border-transparent text-gray-500 hover:text-gray-300"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Conteneur scrollable — ref transmise au FloatSelect */}
            <div
              className="custom-scroll flex-1"
              style={{ overflowY: selectDropOpen ? "hidden" : "auto" }}
              ref={simScrollRef}
            >
              <div className="p-4 sm:p-6">
                {/* ── CALCULER : PAS de FadePanel imbriqué autour du FloatSelect ── */}
                {tab === "calc" && (
                  <div className="anim-tab space-y-4">
                    {/* Toggle mode */}
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
                      {MODES.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => changeMode(m.id)}
                          className={`flex-1 py-2.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 ${mode === m.id ? "bg-[#D4AF37] text-black shadow-[0_0_14px_rgba(212,175,55,0.28)]" : "text-gray-400 hover:text-white"}`}
                        >
                          <m.ModeIcon size={12} /> {m.label}
                        </button>
                      ))}
                    </div>

                    {/* FloatSelect stable — pas dans un FadePanel */}
                    {mode === "AIR" && (
                      <FloatSelect
                        label="Catégorie de marchandise"
                        value={category}
                        onChange={(v) => {
                          setCategory(v);
                          setSimResult(null);
                        }}
                        options={categoryOptions}
                        icon={Package}
                        scrollContainerRef={simScrollRef}
                        onOpenChange={setSelectDropOpen}
                      />
                    )}

                    {/* Inputs dynamiques selon catégorie/mode */}
                    {mode === "AIR" && isUnit ? (
                      <FloatInput
                        label="Quantité"
                        type="number"
                        value={dims.quantity}
                        onChange={(e) =>
                          setDims({ ...dims, quantity: e.target.value })
                        }
                        icon={Smartphone}
                      />
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2 sm:gap-3">
                          {[
                            { k: "length", l: "Long. (cm)" },
                            { k: "width", l: "Larg. (cm)" },
                            { k: "height", l: "Haut. (cm)" },
                          ].map(({ k, l }) => (
                            <FloatInput
                              key={k}
                              label={l}
                              type="number"
                              value={dims[k]}
                              onChange={(e) =>
                                setDims({ ...dims, [k]: e.target.value })
                              }
                            />
                          ))}
                        </div>
                        {mode === "AIR" && (
                          <FloatInput
                            label="Poids réel (kg)"
                            type="number"
                            value={dims.weight}
                            onChange={(e) =>
                              setDims({ ...dims, weight: e.target.value })
                            }
                            icon={Package}
                          />
                        )}
                      </>
                    )}

                    <button
                      onClick={calculate}
                      className="w-full py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_22px_rgba(212,175,55,0.28)] active:scale-[0.98]"
                      style={{ background: "#D4AF37", color: "#0A0A0B" }}
                    >
                      <Calculator size={14} /> Calculer
                    </button>

                    {simResult && (
                      <div className="bg-white/3 border border-white/5 rounded-2xl p-4 sm:p-5 anim-fade-up">
                        <div className="text-center mb-3">
                          <div className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-widest mb-2">
                            Estimation transport
                          </div>
                          <div className="text-2xl sm:text-3xl font-black text-[#D4AF37]">
                            {fmt(simResult.cost)}
                          </div>
                        </div>
                        <div className="border-t border-white/5 pt-3 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] sm:text-xs">
                            <span className="text-gray-500">
                              Base de calcul
                            </span>
                            <span className="font-black text-white">
                              {simResult.label}
                            </span>
                          </div>
                          {simResult.sub && (
                            <div className="text-[9px] sm:text-[10px] text-gray-600 text-center">
                              {simResult.sub}
                            </div>
                          )}
                          <div className="text-[8px] sm:text-[9px] text-gray-600 text-center italic pt-1">
                            Hors frais de douane spécifiques
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── TARIFS ── */}
                {tab === "rates" && (
                  <div className="anim-tab space-y-2.5">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-4">
                      Tarifs en vigueur
                    </p>
                    {SHIPPING_RATES.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 bg-white/3 border border-white/5 hover:border-[#D4AF37]/25 rounded-xl px-3 sm:px-4 py-3 transition-all duration-300 group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                            {r.label}
                          </div>
                          <div className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                            {r.details}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs sm:text-sm font-black text-white">
                            {fmt(r.price)}
                          </div>
                          <div className="text-[8px] sm:text-[9px] text-gray-500">
                            / {r.unit}
                          </div>
                          <div className="text-[8px] sm:text-[9px] font-bold text-[#D4AF37]">
                            {r.delay}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 py-1">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-[9px] text-gray-600 uppercase font-bold">
                        Maritime
                      </span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                    <div className="flex items-center gap-3 bg-white/3 border border-white/5 hover:border-[#D4AF37]/25 rounded-xl px-3 sm:px-4 py-3 transition-all duration-300 group">
                      <div className="text-[#D4AF37] flex-shrink-0">
                        <Ship size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs sm:text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                          Maritime
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-gray-500 truncate">
                          Toutes marchandises (sauf téléphones/ordinateurs)
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs sm:text-sm font-black text-white">
                          {fmt(SEA_RATE_CBM)}
                        </div>
                        <div className="text-[8px] sm:text-[9px] text-gray-500">
                          / CBM
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── INTERDITS ── */}
                {tab === "prohibited" && (
                  <div className="anim-tab bg-red-500/10 border border-red-500/20 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex items-center gap-2 text-red-400 font-black text-[10px] sm:text-xs uppercase tracking-widest">
                      <AlertTriangle size={14} /> Marchandises interdites
                    </div>
                    <ul className="space-y-3">
                      {PROHIBITED_ITEMS.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-[10px] sm:text-xs text-red-400/80"
                        >
                          <span className="mt-1.5 block w-1.5 h-1.5 rounded-full bg-red-500/70 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ═══ MODAL SERVICE ═══════════════════════════════════════════════════ */}
      <ServiceModal
        service={serviceModal}
        onClose={() => setServiceModal(null)}
        onOpenSim={() => {
          setSimOpen(true);
          setServiceModal(null);
        }}
      />
    </main>
  );
}
