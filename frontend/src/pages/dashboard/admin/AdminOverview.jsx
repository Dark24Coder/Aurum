// src/pages/dashboard/admin/AdminOverview.jsx
// Version améliorée avec graphique barres, stats enrichies, actions rapides
import { useAuth } from "../../../context/useAuth";
import { formatCurrency } from "../../../utils/constants";
import {
  TrendingUp,
  Package,
  ShieldCheck,
  Users,
  AlertTriangle,
  ShoppingCart,
  ArrowUpRight,
} from "lucide-react";

const CHART_DATA = [55, 30, 85, 45, 95, 60, 75, 50, 80, 40, 65, 90];
const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export default function AdminOverview({ setActiveTab }) {
  const { db } = useAuth();

  const pendingKyc =
    db.kycRequests?.filter((k) => k.status === "PENDING").length || 0;
  const totalOrders = db.orders?.length || 0;
  const activeOrders =
    db.orders?.filter((o) => !["LIVRE", "ANNULE"].includes(o.status)).length ||
    0;
  const totalUsers = (db.users?.length || 0) + 2;
  const activeItems =
    db.marketplace?.filter((i) => i.status === "ACTIVE").length || 0;
  const totalRevenue =
    db.orders?.reduce((sum, o) => sum + (o.price || 0), 0) || 0;
  const mkRevenue =
    db.orders
      ?.filter((o) => o.type === "MARKETPLACE")
      .reduce((s, o) => s + (o.price || 0), 0) || 0;

  const stats = [
    {
      label: "Chiffre d'affaires",
      value: formatCurrency(totalRevenue),
      change: "+12.5%",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-500/10",
      onClick: null,
    },
    {
      label: "Ventes Marketplace",
      value: formatCurrency(mkRevenue),
      change: `${activeItems} produits actifs`,
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      onClick: () => setActiveTab("marketplace"),
    },
    {
      label: "Commandes totales",
      value: String(totalOrders),
      change: `${activeOrders} en cours`,
      icon: Package,
      color: "text-[#D4AF37]",
      bg: "bg-[#D4AF37]/10",
      onClick: () => setActiveTab("orders"),
    },
    {
      label: "Nouveaux clients",
      value: `+${totalUsers}`,
      change: "Ce mois",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      onClick: () => setActiveTab("users"),
    },
  ];

  const statusColors = {
    LIVRE: "text-green-400  bg-green-500/10  border-green-500/20",
    EN_TRANSIT: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    EN_ATTENTE: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    SOURCING: "text-blue-400   bg-blue-500/10   border-blue-500/20",
    EXPEDIE: "text-green-400  bg-green-500/10  border-green-500/20",
    ANNULE: "text-red-400    bg-red-500/10    border-red-500/20",
  };

  return (
    <main className="space-y-6">
      {/* Alerte KYC */}
      {pendingKyc > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <AlertTriangle
              size={16}
              className="text-yellow-400 flex-shrink-0"
            />
            <div>
              <div className="text-sm font-black text-white">
                {pendingKyc} dossier{pendingKyc > 1 ? "s" : ""} KYC en attente
              </div>
              <div className="text-[10px] text-yellow-400/70">
                Validation requise
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("kyc")}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-yellow-500 text-black font-black text-[10px] uppercase tracking-wide"
          >
            Traiter
          </button>
        </div>
      )}

      {/* Stats grid — 2 cols mobile, 4 desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              onClick={s.onClick}
              className={`bg-[#111112] border border-white/5 p-4 sm:p-6 rounded-2xl relative overflow-hidden group hover:border-[#D4AF37]/20 transition-all duration-300 ${s.onClick ? "cursor-pointer hover:-translate-y-0.5" : ""}`}
            >
              <div
                className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}
              >
                <Icon size={20} />
              </div>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-tight">
                {s.label}
              </p>
              <h3 className="text-xl sm:text-2xl font-black mt-1.5 tracking-tighter text-white">
                {s.value}
              </h3>
              <p className={`text-[9px] font-bold mt-1.5 uppercase ${s.color}`}>
                {s.change}
              </p>
              <div className="absolute -bottom-3 -right-3 w-14 h-14 bg-white/[0.02] rounded-full group-hover:scale-150 transition-transform duration-700" />
            </div>
          );
        })}
      </div>

      {/* Graphique + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Graphique barres — 2/3 */}
        <div
          className="lg:col-span-2 bg-[#111112] border border-white/5 rounded-2xl p-5 sm:p-8 flex flex-col"
          style={{ minHeight: "320px" }}
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tighter text-white">
                Performance Sourcing
              </h3>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                Flux de marchandises mensuel
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase text-gray-400">
                Live
              </span>
            </div>
          </div>

          {/* Barres */}
          <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-2 min-h-[160px]">
            {CHART_DATA.map((h, i) => (
              <div key={i} className="flex-1 group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black text-[8px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">
                  {h}M FCFA
                </div>
                <div
                  className="w-full bg-gradient-to-t from-[#D4AF37]/5 via-[#D4AF37]/20 to-[#D4AF37] rounded-t-xl hover:brightness-125 transition-all"
                  style={{ height: `${h}%` }}
                />
              </div>
            ))}
          </div>

          {/* Axe X */}
          <div className="flex justify-between mt-4 pt-3 border-t border-white/5 text-[8px] sm:text-[9px] font-black text-gray-600 uppercase tracking-wider">
            {MONTHS.slice(0, 6).map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Actions rapides — 1/3 */}
        <div className="bg-[#111112] border border-white/5 rounded-2xl p-5 sm:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black uppercase text-[#D4AF37] mb-6">
              Rapports & Accès
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-[#D4AF37] transition-colors flex-shrink-0">
                  <ArrowUpRight size={16} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase text-white">
                    Rapport Mensuel
                  </p>
                  <p className="text-[9px] font-bold text-gray-500 uppercase">
                    Télécharger PDF
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer p-3 rounded-xl hover:bg-white/5 transition-colors border-t border-white/5 pt-4">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck size={16} className="text-green-400" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase text-white">
                    Sécurité Système
                  </p>
                  <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">
                    Optimisé
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("orders")}
            className="w-full py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] transition-all duration-300 mt-6"
          >
            Historique complet
          </button>
        </div>
      </div>

      {/* Dernières commandes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-black text-white uppercase tracking-widest">
            Commandes récentes
          </h2>
          <button
            onClick={() => setActiveTab("orders")}
            className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline"
          >
            Voir tout →
          </button>
        </div>
        <div className="space-y-2">
          {(db.orders || []).slice(0, 5).map((o) => (
            <div
              key={o.id}
              className="flex items-center justify-between bg-[#111112] border border-white/5 rounded-xl px-3 py-2.5 hover:border-white/10 transition-colors gap-2"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Package size={12} className="text-[#D4AF37]" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-white truncate">
                    {o.product}
                  </div>
                  <div className="text-[9px] text-gray-600 truncate">
                    {o.id}
                  </div>
                </div>
              </div>
              <span
                className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border flex-shrink-0 ${statusColors[o.status] || "text-gray-400 bg-white/5 border-white/10"}`}
              >
                {o.status?.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
