// src/pages/Suivi.jsx
// ✅ FloatInput du composant partagé src/components/ui/FloatInput
// ✅ Transitions fluides entre onglets (tab-enter animation, pas de montage brutal)
// ✅ Zéro emoji — 100% icônes Lucide
// ✅ Section "Comment ça marche" avec grandes icônes et texte mis en avant
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Ship,
  Package,
  MapPin,
  CheckCircle,
  ChevronRight,
  Truck,
  Warehouse,
  Sparkles,
  Lock,
  ArrowRight,
  ScanLine,
  Globe,
  ShieldCheck,
  Clock,
  Users,
  User,
  ClipboardList,
  Bell,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import FloatInput from "../components/ui/FloatInput";

const fmt = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    n,
  );

// ── Styles d'animation ───────────────────────────────────────────────────────
const SuiviStyles = () => (
  <style>{`
    @keyframes tab-enter {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes result-pop {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .tab-enter  { animation: tab-enter  0.30s cubic-bezier(0.22,1,0.36,1) forwards; }
    .result-pop { animation: result-pop 0.24s ease forwards; }
  `}</style>
);

// ── Données ──────────────────────────────────────────────────────────────────
const TIMELINE_STEPS = [
  {
    id: "EN_ATTENTE",
    label: "Commande validée",
    sub: "En attente de traitement",
    Icon: CheckCircle,
    matches: ["EN_ATTENTE", "SOURCING", "EN_TRANSIT", "EXPEDIE", "LIVRE"],
  },
  {
    id: "SOURCING",
    label: "Sourcing / Préparation",
    sub: "Articles sourcés ou en préparation",
    Icon: Package,
    matches: ["SOURCING", "EN_TRANSIT", "EXPEDIE", "LIVRE"],
  },
  {
    id: "EN_TRANSIT",
    label: "Expédition internationale",
    sub: "En route depuis le pays d'origine",
    Icon: Ship,
    matches: ["EN_TRANSIT", "EXPEDIE", "LIVRE"],
  },
  {
    id: "EXPEDIE",
    label: "Arrivée Hub Cotonou",
    sub: "Colis en douane / dédouanement",
    Icon: Warehouse,
    matches: ["EXPEDIE", "LIVRE"],
  },
  {
    id: "LIVRE",
    label: "Livraison finale",
    sub: "Livré à votre adresse",
    Icon: MapPin,
    matches: ["LIVRE"],
  },
];

const STATUS_MAP = {
  EN_ATTENTE: {
    label: "En attente",
    cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
  SOURCING: {
    label: "Sourcing",
    cls: "bg-blue-500/20   text-blue-400   border-blue-500/30",
  },
  EN_TRANSIT: {
    label: "En transit",
    cls: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  EXPEDIE: {
    label: "Expédié",
    cls: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  LIVRE: {
    label: "Livré",
    cls: "bg-green-500/20  text-green-400  border-green-500/30",
  },
  ANNULE: {
    label: "Annulé",
    cls: "bg-red-500/20    text-red-400    border-red-500/30",
  },
};

const TYPE_COLOR = {
  SOURCING: "text-blue-400",
  MARKETPLACE: "text-purple-400",
  GROUPAGE: "text-green-400",
};

// ── Composants ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.EN_ATTENTE;
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border flex-shrink-0 ${s.cls}`}
    >
      {s.label}
    </span>
  );
}

function Timeline({ status }) {
  if (status === "ANNULE") {
    return (
      <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
          <ShieldCheck size={16} className="text-red-400" />
        </div>
        <div>
          <div className="text-red-400 font-black text-sm uppercase">
            Commande annulée
          </div>
          <div className="text-gray-500 text-[11px] mt-0.5">
            Cette commande a été annulée.
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      {TIMELINE_STEPS.map((step, i) => {
        const done = step.matches.includes(status);
        const current =
          step.id === status || (status === "EN_ATTENTE" && i === 0);
        const TLIcon = step.Icon;
        return (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  done
                    ? current
                      ? "bg-[#D4AF37] border-[#D4AF37] shadow-[0_0_14px_rgba(212,175,55,0.4)]"
                      : "bg-[#D4AF37]/20 border-[#D4AF37]/40"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <TLIcon
                  size={15}
                  className={
                    done
                      ? current
                        ? "text-black"
                        : "text-[#D4AF37]"
                      : "text-gray-700"
                  }
                />
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 transition-colors duration-500 ${done ? "bg-[#D4AF37]/30" : "bg-white/5"}`}
                />
              )}
            </div>
            <div className="pb-7 min-w-0 flex-1">
              <div
                className={`font-black text-sm uppercase tracking-tight transition-colors ${done ? "text-white" : "text-gray-700"}`}
              >
                {step.label}
              </div>
              <div
                className={`text-[11px] mt-0.5 transition-colors ${current ? "text-[#D4AF37]" : done ? "text-gray-500" : "text-gray-700"}`}
              >
                {current ? "En cours" : done ? "Complété" : step.sub}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TrackingResult({ order }) {
  return (
    <div className="bg-[#111112] border border-[#D4AF37]/20 rounded-[2rem] overflow-hidden result-pop">
      <div className="px-5 sm:px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-[#D4AF37]" />
          </div>
          <div>
            <div className="font-black text-white text-base uppercase tracking-tight">
              {order.product}
            </div>
            <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[#D4AF37]">
                {order.trackingInternal}
              </span>
              {order.type && (
                <span
                  className={`text-[9px] font-black uppercase ${TYPE_COLOR[order.type] || "text-gray-500"}`}
                >
                  {order.type}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1.5">
          <StatusBadge status={order.status} />
          {order.price > 0 && (
            <div className="text-[#D4AF37] text-xs font-bold">
              {fmt(order.price)}
            </div>
          )}
          <div className="text-gray-600 text-[10px]">{order.date}</div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-5">
          Suivi du colis
        </div>
        <Timeline status={order.status} />
        {order.trackingCarrier && order.trackingCarrier !== "PENDING" && (
          <div className="mt-4 p-3 bg-white/3 border border-white/5 rounded-xl flex items-center gap-3">
            <Truck size={14} className="text-gray-500 flex-shrink-0" />
            <div>
              <div className="text-[9px] text-gray-600 uppercase font-bold">
                N° transporteur
              </div>
              <div className="font-mono text-white text-xs">
                {order.trackingCarrier}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Recherche publique ────────────────────────────────────────────────────────
function PublicTracker({ db }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const doSearch = () => {
    if (!query.trim()) return;
    const found = (db.orders || []).find(
      (o) =>
        o.trackingInternal?.toLowerCase() === query.trim().toLowerCase() ||
        o.id?.toLowerCase() === query.trim().toLowerCase(),
    );
    setResult(found || "NOT_FOUND");
  };

  return (
    <div className="space-y-5">
      {/* FloatInput partagé + bouton */}
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <FloatInput
            label="N° de suivi ou ID commande (ex : BJ-TRK-889)"
            name="tracking"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setResult(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            icon={ScanLine}
          />
        </div>
        <button
          onClick={doSearch}
          className="h-[50px] px-5 sm:px-6 rounded-xl bg-[#D4AF37] text-black font-black text-[11px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all flex-shrink-0 flex items-center gap-2"
        >
          <Search size={15} />
          <span className="hidden sm:inline">Suivre</span>
        </button>
      </div>

      {result === "NOT_FOUND" && (
        <div className="p-5 bg-red-500/5 border border-red-500/15 rounded-2xl text-center result-pop">
          <ShieldCheck size={22} className="mx-auto text-red-400 mb-2" />
          <div className="text-red-400 font-black text-sm uppercase mb-1">
            Aucune commande trouvée
          </div>
          <div className="text-gray-500 text-xs">
            Vérifiez votre numéro de suivi et réessayez.
          </div>
        </div>
      )}
      {result && result !== "NOT_FOUND" && <TrackingResult order={result} />}
    </div>
  );
}

// ── Mes commandes (connecté) ──────────────────────────────────────────────────
function MyOrdersTracker({ db, currentUser }) {
  const [selected, setSelected] = useState(null);
  const [filterQ, setFilterQ] = useState("");

  const myOrders = useMemo(
    () =>
      (db.orders || [])
        .filter((o) => o.userId === currentUser?.uid)
        .filter(
          (o) =>
            !filterQ ||
            o.product?.toLowerCase().includes(filterQ.toLowerCase()) ||
            o.trackingInternal?.toLowerCase().includes(filterQ.toLowerCase()),
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [db.orders, currentUser, filterQ],
  );

  const selectedOrder = myOrders.find((o) => o.id === selected);

  return (
    <div className="space-y-5">
      <FloatInput
        label="Filtrer par produit ou numéro de suivi…"
        name="filter"
        value={filterQ}
        onChange={(e) => {
          setFilterQ(e.target.value);
          setSelected(null);
        }}
        icon={Search}
      />

      {myOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">
          {filterQ
            ? "Aucune commande ne correspond à cette recherche."
            : "Vous n'avez pas encore de commande."}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            {myOrders.map((o) => (
              <button
                key={o.id}
                onClick={() => setSelected(selected === o.id ? null : o.id)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  selected === o.id
                    ? "bg-[#D4AF37]/5 border-[#D4AF37]/30"
                    : "bg-[#111112] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-black text-white text-sm truncate">
                        {o.product}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase ${TYPE_COLOR[o.type] || "text-gray-500"}`}
                      >
                        {o.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <span className="font-mono">{o.trackingInternal}</span>
                      <span>·</span>
                      <span>{o.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={o.status} />
                    <ChevronRight
                      size={12}
                      className={`text-gray-600 transition-transform duration-200 ${selected === o.id ? "rotate-90" : ""}`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Panel desktop */}
          <div className="hidden lg:block">
            {selectedOrder ? (
              <TrackingResult order={selectedOrder} />
            ) : (
              <div className="h-full min-h-[200px] flex items-center justify-center text-center p-10 bg-[#111112]/40 border border-dashed border-white/5 rounded-2xl">
                <div>
                  <ArrowRight
                    size={28}
                    className="mx-auto text-gray-700 mb-3"
                  />
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Sélectionnez une commande
                    <br />
                    pour voir son suivi détaillé
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="lg:hidden">
          <TrackingResult order={selectedOrder} />
        </div>
      )}
    </div>
  );
}

// ── Comment ça marche ─────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    Icon: ClipboardList,
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10 border-[#D4AF37]/20",
    step: "01",
    title: "Passez votre commande",
    desc: "Créez votre compte, choisissez votre service — Sourcing, Marketplace ou Groupage — et soumettez votre demande. Notre équipe prend en charge le reste dès réception.",
  },
  {
    Icon: Globe,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    step: "02",
    title: "Sourcing et préparation",
    desc: "Nos équipes sourcent vos produits auprès de fournisseurs certifiés, inspectent chaque article et les préparent pour l'expédition internationale vers le hub de Cotonou.",
  },
  {
    Icon: Ship,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    step: "03",
    title: "Expédition et suivi",
    desc: "Votre colis est expédié par voie aérienne ou maritime. Vous recevez un numéro de suivi unique et pouvez suivre chaque étape en temps réel directement depuis cette page.",
  },
  {
    Icon: MapPin,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    step: "04",
    title: "Livraison à votre porte",
    desc: "Après dédouanement au hub de Cotonou, votre commande est livrée à l'adresse de votre choix. Commission unique de 1 %, aucun frais caché, aucune mauvaise surprise.",
  },
];

const GUARANTEES = [
  {
    Icon: ShieldCheck,
    color: "text-[#D4AF37]",
    label: "KYC vérifié",
    sub: "Communauté 100 % sécurisée",
  },
  {
    Icon: Clock,
    color: "text-blue-400",
    label: "Suivi temps réel",
    sub: "Notification à chaque étape",
  },
  {
    Icon: Users,
    color: "text-purple-400",
    label: "Groupage disponible",
    sub: "Partagez vos frais de port",
  },
  {
    Icon: Bell,
    color: "text-green-400",
    label: "Support dédié",
    sub: "Une équipe à votre écoute",
  },
];

function HowItWorks() {
  return (
    <section className="mt-20 pb-4">
      {/* Titre section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#D4AF37]/40" />
          <Sparkles size={14} className="text-[#D4AF37]" />
          <div className="h-px w-12 bg-[#D4AF37]/40" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter mb-3">
          Comment <span className="text-[#D4AF37]">ça marche</span>
        </h2>
        <p className="text-gray-400 text-sm sm:text-[15px] max-w-xl mx-auto leading-relaxed">
          De la commande à la livraison, voici les quatre étapes qui
          garantissent la sécurité et la transparence de chaque importation.
        </p>
      </div>

      {/* Grille 4 étapes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {HOW_STEPS.map((s, i) => {
          const HIcon = s.Icon;
          return (
            <div
              key={i}
              className="relative bg-[#111112] border border-white/5 rounded-[1.75rem] p-6 sm:p-8 hover:border-white/10 transition-colors duration-300 overflow-hidden group"
            >
              {/* Numéro d'étape en filigrane */}
              <div className="absolute top-4 right-6 text-[4.5rem] font-black text-white/[0.03] select-none leading-none pointer-events-none">
                {s.step}
              </div>

              {/* Icône grande */}
              <div
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-105 ${s.bg}`}
              >
                <HIcon size={28} className={s.color} />
              </div>

              {/* Label étape */}
              <div
                className={`text-[10px] font-black uppercase tracking-[0.25em] mb-2 ${s.color}`}
              >
                Étape {s.step}
              </div>

              {/* Titre */}
              <h3 className="text-white font-black text-lg sm:text-xl uppercase tracking-tight leading-tight mb-3">
                {s.title}
              </h3>

              {/* Description mise en avant — texte plus grand */}
              <p className="text-gray-400 text-sm sm:text-[15px] leading-[1.8]">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bande garanties */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {GUARANTEES.map(({ Icon: RawGIcon, color, label, sub }) => {
          const GIcon = RawGIcon;
          return (
            <div
              key={label}
              className="bg-[#111112]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3 hover:border-white/10 transition-colors"
            >
              <GIcon size={22} className={`flex-shrink-0 ${color}`} />
              <div>
                <div className="text-white font-black text-xs uppercase tracking-wide leading-tight">
                  {label}
                </div>
                <div className="text-gray-600 text-[10px] mt-0.5 leading-tight">
                  {sub}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────────────────
export default function SuiviPage() {
  const { isAuthenticated, currentUser, db } = useAuth();
  const [mode, setMode] = useState(
    isAuthenticated ? "mes-commandes" : "recherche",
  );
  const [animKey, setAnimKey] = useState(0);

  const switchMode = (m) => {
    if (m === mode) return;
    setMode(m);
    setAnimKey((k) => k + 1);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] pb-24">
      <SuiviStyles />

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% -10%, rgba(212,175,55,0.11) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-12">
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">
              Accueil
            </Link>
            <ChevronRight size={10} />
            <span className="text-[#D4AF37]">Suivi de colis</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-[#D4AF37]" />
            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
              Suivi en temps réel
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
            Suivi <span className="text-[#D4AF37]">de Colis</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed max-w-xl">
            Suivez vos commandes à chaque étape — de l'entrepôt d'origine
            jusqu'à la livraison finale. Numéro de suivi ou compte client, c'est
            vous qui choisissez.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* ── Toggle onglets ── */}
        <div className="flex bg-[#111112] border border-white/5 rounded-2xl p-1 mb-8 gap-1">
          <button
            onClick={() => switchMode("recherche")}
            className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
              mode === "recherche"
                ? "bg-[#D4AF37] text-black shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <ScanLine size={13} />
            Recherche rapide
          </button>

          <button
            onClick={() =>
              isAuthenticated ? switchMode("mes-commandes") : null
            }
            title={
              !isAuthenticated
                ? "Connexion requise pour accéder à vos commandes"
                : undefined
            }
            className={`flex-1 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 ${
              mode === "mes-commandes"
                ? "bg-[#D4AF37] text-black shadow-[0_2px_12px_rgba(212,175,55,0.25)]"
                : isAuthenticated
                  ? "text-gray-500 hover:text-white"
                  : "text-gray-700 cursor-not-allowed opacity-60"
            }`}
          >
            <User size={13} />
            {!isAuthenticated && <Lock size={10} />}
            Mes commandes
          </button>
        </div>

        {/* ── Contenu — transition fluide via animKey ──
            Chaque switch recrée la div avec une nouvelle clé
            ce qui rejoue l'animation tab-enter sans montage brutal.
        ── */}
        <div>
          {mode === "recherche" && (
            <div key={`r-${animKey}`} className="tab-enter">
              <PublicTracker db={db} />
            </div>
          )}

          {mode === "mes-commandes" && isAuthenticated && (
            <div key={`m-${animKey}`} className="tab-enter">
              <MyOrdersTracker db={db} currentUser={currentUser} />
            </div>
          )}

          {mode === "mes-commandes" && !isAuthenticated && (
            <div key={`l-${animKey}`} className="tab-enter">
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                  <Lock size={28} className="text-gray-600" />
                </div>
                <h3 className="text-white font-black text-lg uppercase mb-2">
                  Connexion requise
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                  Connectez-vous pour accéder à toutes vos commandes et leur
                  suivi détaillé.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/login"
                    className="px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest bg-[#D4AF37] text-black hover:opacity-90 transition-opacity"
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest border border-white/20 text-white hover:bg-white/5 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Comment ça marche ── */}
        <HowItWorks />
      </div>
    </div>
  );
}
