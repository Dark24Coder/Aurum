// src/pages/Groupage.jsx
// ✅ Page publique /groupage — conteneurs partagés Chine→Afrique
// ✅ Participation nécessite connexion + KYC + caution
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Users,
  Package,
  Clock,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Ship,
  AlertCircle,
  Search,
  MapPin,
  Coins,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const formatCurrency = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    n,
  );

// Barre de progression animée
function ProgressBar({ reserved, target }) {
  const pct = Math.min(100, Math.round((reserved / target) * 100));
  const color =
    pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-[#D4AF37]" : "bg-blue-400";
  return (
    <main>
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] font-bold">
        <span
          className={
            pct >= 90
              ? "text-red-400"
              : pct >= 60
                ? "text-[#D4AF37]"
                : "text-blue-400"
          }
        >
          {reserved} / {target} réservés
        </span>
        <span className="text-gray-600">{pct}%</span>
      </div>
    </main>
  );
}

// Deadline countdown
function DeadlineTag({ deadline }) {
  const end = new Date(deadline.split("/").reverse().join("-"));
  const now = new Date();
  const days = Math.max(0, Math.ceil((end - now) / 86400000));
  const urgent = days <= 7;
  return (
    <span
      className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-full border ${
        urgent
          ? "text-red-400 bg-red-500/10 border-red-500/20"
          : "text-gray-400 bg-white/5 border-white/10"
      }`}
    >
      <Clock size={9} />
      {days === 0 ? "Expire aujourd'hui" : `${days}j restants`}
    </span>
  );
}

// Card groupage
function GroupageCard({ grp, onJoin }) {
  const isFull = grp.reserved >= grp.target;
  const isClosed = grp.status === "CLOSED" || grp.status === "PARTI";

  return (
    <main className="group bg-[#111112] border border-white/5 rounded-[2rem] overflow-hidden hover:border-[#D4AF37]/25 hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-[#0A0A0B]">
        <img
          src={grp.img}
          alt={grp.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111112]/90 via-transparent to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isClosed && (
            <span className="bg-gray-700/80 backdrop-blur text-gray-300 text-[9px] font-black uppercase px-2 py-1 rounded-full border border-white/10">
              {grp.status === "PARTI" ? "Conteneur parti" : "Fermé"}
            </span>
          )}
          {!isClosed && isFull && (
            <span className="bg-red-500/80 backdrop-blur text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">
              Complet
            </span>
          )}
          {!isClosed && !isFull && (
            <span className="bg-green-500/80 backdrop-blur text-white text-[9px] font-black uppercase px-2 py-1 rounded-full">
              Ouvert
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-black/60 backdrop-blur text-white/60 text-[9px] font-bold uppercase px-2 py-1 rounded-md border border-white/10">
            {grp.origin || "Chine"} → {grp.destination || "Cotonou"}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        <div>
          <h3 className="text-white font-black text-base uppercase tracking-tight leading-tight mb-1 line-clamp-2">
            {grp.name}
          </h3>
          {grp.desc && (
            <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2">
              {grp.desc}
            </p>
          )}
        </div>

        {/* Progression */}
        <ProgressBar reserved={grp.reserved} target={grp.target} />

        {/* Deadline + Prix */}
        <div className="flex items-center justify-between">
          <DeadlineTag deadline={grp.deadline} />
          <div className="text-right">
            <div className="text-[9px] text-gray-600 font-bold uppercase">
              Prix / unité
            </div>
            <div className="text-lg font-black text-white">
              {formatCurrency(grp.price)}
            </div>
          </div>
        </div>

        {/* Bouton */}
        <button
          onClick={() => onJoin(grp)}
          disabled={isFull || isClosed}
          className={`w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
            isFull || isClosed
              ? "bg-white/5 text-gray-600 border border-white/10 cursor-not-allowed"
              : "bg-[#D4AF37] text-black hover:opacity-90 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          }`}
        >
          {isClosed ? (
            <>
              <Ship size={13} /> Conteneur parti
            </>
          ) : isFull ? (
            <>
              <AlertCircle size={13} /> Complet
            </>
          ) : (
            <>
              <Users size={13} /> Rejoindre ce groupage
            </>
          )}
        </button>
      </div>
    </main>
  );
}

// Comment ça marche
const STEPS = [
  {
    Icon: Search,
    color: "text-[#D4AF37]",
    bg: "bg-[#D4AF37]/10 border-[#D4AF37]/20",
    title: "Choisissez un groupage",
    desc: "Sélectionnez un conteneur selon vos produits et la destination souhaitée.",
  },
  {
    Icon: ShieldCheck,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    title: "Réservez votre place",
    desc: "Rejoignez le groupage en payant votre part. KYC et caution requis.",
  },
  {
    Icon: Package,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    title: "Préparez vos colis",
    desc: "Envoyez vos produits à notre entrepôt partenaire en Chine ou ailleurs.",
  },
  {
    Icon: MapPin,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    title: "Suivi en temps réel",
    desc: "Suivez votre colis de l'entrepôt jusqu'à la livraison finale chez vous.",
  },
];

export default function GroupagePage() {
  const { isAuthenticated, currentUser, db, setDb } = useAuth();
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const groupages = db.groupages || [];

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleJoin = (grp) => {
    if (!isAuthenticated) {
      showToast("Connectez-vous pour rejoindre un groupage.", "error");
      setTimeout(() => navigate("/login"), 1200);
      return;
    }
    if (currentUser?.kycStatus !== "VALID") {
      showToast("KYC requis — validez votre identité d'abord.", "error");
      setTimeout(() => navigate("/dashboard/user"), 1200);
      return;
    }
    if (!currentUser?.depositPaid) {
      showToast("Caution requise avant de participer.", "error");
      setTimeout(() => navigate("/dashboard/user"), 1200);
      return;
    }

    // Vérifier si déjà rejoint
    const already = (db.orders || []).some(
      (o) => o.groupageId === grp.id && o.userId === currentUser.uid,
    );
    if (already) {
      showToast("Vous avez déjà rejoint ce groupage.", "info");
      return;
    }

    // Créer la commande + incrémenter reserved
    const newOrder = {
      id: `ORD-GRP-${Math.floor(Math.random() * 100000)}`,
      userId: currentUser.uid,
      groupageId: grp.id,
      type: "GROUPAGE",
      product: grp.name,
      price: grp.price,
      status: "EN_ATTENTE",
      date: new Date().toLocaleDateString("fr-FR"),
      trackingInternal: `TRK-${Math.floor(Math.random() * 100000)}`,
      trackingCarrier: "PENDING",
    };

    setDb((prev) => ({
      ...prev,
      groupages: prev.groupages.map((g) =>
        g.id === grp.id ? { ...g, reserved: g.reserved + 1 } : g,
      ),
      orders: [newOrder, ...(prev.orders || [])],
    }));

    showToast(`Participation enregistrée pour "${grp.name}" !`, "success");
  };

  const open = groupages.filter(
    (g) =>
      g.status !== "CLOSED" && g.status !== "PARTI" && g.reserved < g.target,
  );
  const full = groupages.filter(
    (g) =>
      g.status !== "CLOSED" && g.status !== "PARTI" && g.reserved >= g.target,
  );
  const closed = groupages.filter(
    (g) => g.status === "CLOSED" || g.status === "PARTI",
  );

  return (
    <main className="min-h-screen bg-[#0A0A0B] pb-24">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center gap-3 text-sm font-bold ${
            toast.type === "success"
              ? "bg-green-500/20 border-green-500/40 text-green-300"
              : toast.type === "error"
                ? "bg-red-500/20 border-red-500/40 text-red-300"
                : "bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]"
          }`}
          style={{ minWidth: 280, maxWidth: "90vw" }}
        >
          {toast.type === "success" && <CheckCircle size={16} />}
          {toast.type === "error" && <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(212,175,55,0.13) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-12">
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">
              Accueil
            </Link>
            <ChevronRight size={10} />
            <span className="text-[#D4AF37]">Groupage</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
                  Transport groupé
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter leading-tight mb-4">
                Groupages <span className="text-[#D4AF37]">Ouverts</span>
              </h1>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                Partagez le coût d'un conteneur avec d'autres acheteurs et
                importez depuis la Chine à prix réduit. Commission BJ Business :
                1% seulement.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3 lg:gap-2 flex-shrink-0">
              {[
                {
                  label: "Conteneurs ouverts",
                  value: open.length,
                  color: "text-green-400",
                },
                {
                  label: "Places réservées",
                  value: groupages.reduce((s, g) => s + g.reserved, 0),
                  color: "text-[#D4AF37]",
                },
                { label: "Destinations", value: "5+", color: "text-blue-400" },
              ].map(({ label, value, color }) => (
                <div
                  key={label}
                  className="bg-[#111112] border border-white/5 rounded-2xl px-4 py-3 text-center"
                >
                  <div className={`text-2xl font-black ${color}`}>{value}</div>
                  <div className="text-[10px] text-gray-600 font-bold uppercase mt-0.5">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        {/* ── Avantages ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12">
          {[
            {
              Icon: Coins,
              color: "text-[#D4AF37]",
              label: "Commission 1%",
              sub: "Transparente",
            },
            {
              Icon: Ship,
              color: "text-blue-400",
              label: "Chine → Afrique",
              sub: "Transport sécurisé",
            },
            {
              Icon: MapPin,
              color: "text-purple-400",
              label: "Suivi temps réel",
              sub: "À chaque étape",
            },
            {
              Icon: ShieldCheck,
              color: "text-green-400",
              label: "KYC vérifié",
              sub: "Communauté sûre",
            },
          ].map(({ Icon: RawAvIcon, label, sub, color }) => {
            const AvIcon = RawAvIcon;
            return (
              <div
                key={label}
                className="bg-[#111112]/60 border border-white/5 rounded-2xl p-4 flex items-center gap-3"
              >
                <AvIcon size={20} className={`flex-shrink-0 ${color}`} />
                <div>
                  <div className="text-white font-black text-xs uppercase tracking-wide">
                    {label}
                  </div>
                  <div className="text-gray-600 text-[10px]">{sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Groupages ouverts ── */}
        {open.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-black text-white uppercase tracking-tight mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />{" "}
              Disponibles — {open.length} conteneur{open.length > 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {open.map((grp) => (
                <GroupageCard key={grp.id} grp={grp} onJoin={handleJoin} />
              ))}
            </div>
          </div>
        )}

        {/* ── Complets ── */}
        {full.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                Complets — liste d'attente
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 opacity-70">
              {full.map((grp) => (
                <GroupageCard key={grp.id} grp={grp} onJoin={handleJoin} />
              ))}
            </div>
          </div>
        )}

        {/* ── Partis / Fermés ── */}
        {closed.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <Ship size={10} /> Conteneurs partis
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 opacity-50">
              {closed.map((grp) => (
                <GroupageCard key={grp.id} grp={grp} onJoin={handleJoin} />
              ))}
            </div>
          </div>
        )}

        {/* Aucun groupage */}
        {groupages.length === 0 && (
          <div className="text-center py-20">
            <Ship size={44} className="mx-auto text-gray-700 mb-4" />
            <h3 className="text-white font-black text-xl uppercase mb-2">
              Aucun groupage disponible
            </h3>
            <p className="text-gray-500 text-sm">
              Revenez bientôt — de nouveaux conteneurs ouvrent régulièrement.
            </p>
          </div>
        )}

        {/* ── Comment ça marche ── */}
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-black text-white uppercase tracking-tight text-center mb-10">
            Comment <span className="text-[#D4AF37]">ça marche</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className="relative bg-[#111112] border border-white/5 rounded-2xl p-5"
              >
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${step.bg}`}
                >
                  <step.Icon size={24} className={step.color} />
                </div>
                <div className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">
                  Étape {i + 1}
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-[11px] leading-relaxed">
                  {step.desc}
                </p>
                {i < STEPS.length - 1 && (
                  <ArrowRight
                    size={14}
                    className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-[#D4AF37]/40"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 rounded-[2rem] bg-[#D4AF37]/5 border border-[#D4AF37]/15 flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div>
              <h3 className="text-white font-black text-lg uppercase tracking-tight mb-1">
                Prêt à importer moins cher ?
              </h3>
              <p className="text-gray-500 text-sm">
                Créez un compte, validez votre KYC et rejoignez votre premier
                groupage.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest bg-[#D4AF37] text-black hover:opacity-90"
              >
                Commencer
              </Link>
              <Link
                to="/login"
                className="px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest border border-white/20 text-white hover:bg-white/5"
              >
                Se connecter
              </Link>
            </div>
          </div>
        ) : currentUser?.kycStatus !== "VALID" ? (
          <div className="p-6 sm:p-8 rounded-[2rem] bg-yellow-500/5 border border-yellow-500/15 flex flex-col sm:flex-row items-center gap-5 justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck
                size={28}
                className="text-yellow-400 flex-shrink-0"
              />
              <div>
                <h3 className="text-white font-black text-base uppercase tracking-tight mb-0.5">
                  KYC requis pour participer
                </h3>
                <p className="text-gray-500 text-sm">
                  Validez votre identité dans votre dashboard pour rejoindre un
                  groupage.
                </p>
              </div>
            </div>
            <Link
              to="/dashboard/user"
              className="flex-shrink-0 px-5 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest bg-yellow-400 text-black hover:opacity-90"
            >
              Valider mon KYC
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
