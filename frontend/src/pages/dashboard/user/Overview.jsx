import React, { useMemo } from "react";
import {
  Package,
  Plane,
  Users,
  Wallet,
  TrendingUp,
  ShoppingBag,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { Link } from "react-router-dom";
import { formatCurrency, CAUTION_AMOUNT } from "../../../utils/constants";
import StatusBadge from "../components/StatusBadge";
import StatsCard from "../components/StatsCard";

const Overview = ({ setActiveTab }) => {
  const { db, currentUser } = useAuth();

  const userOrders = useMemo(
    () => db.orders.filter((o) => o.userId === currentUser?.uid),
    [db.orders, currentUser],
  );

  // KPIs identiques à mon_code.html
  const stats = useMemo(() => {
    const expenses =
      userOrders.reduce((acc, o) => acc + (o.price || 0), 0) +
      (currentUser?.depositPaid ? CAUTION_AMOUNT : 0);
    return [
      {
        label: "Commandes",
        value: userOrders.length,
        icon: <Package size={22} />,
        color: "text-blue-400",
      },
      {
        label: "En Transit",
        value: userOrders.filter((o) => o.status === "EN_TRANSIT").length,
        icon: <Plane size={22} />,
        color: "text-[#D4AF37]",
      },
      {
        label: "Groupages",
        value: userOrders.filter((o) => o.type === "GROUPAGE").length,
        icon: <Users size={22} />,
        color: "text-purple-400",
      },
      {
        label: "Dépenses",
        value: formatCurrency(expenses),
        icon: <Wallet size={22} />,
        color: "text-green-400",
        isLarge: true,
      },
    ];
  }, [userOrders, currentUser]);

  return (
    <div className="space-y-10">
      {/* ── STATS ─────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>

      {/* ── COMMANDES RÉCENTES + ACCÈS RAPIDE ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Commandes récentes (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/50">
              Commandes Récentes
            </h3>
            <button
              onClick={() => setActiveTab("orders")}
              className="text-[10px] font-bold text-[#D4AF37] hover:underline uppercase tracking-widest"
            >
              Voir tout →
            </button>
          </div>

          <div className="space-y-3">
            {userOrders.length > 0 ? (
              userOrders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="bg-[#161617] border border-white/5 p-5 rounded-2xl flex items-center justify-between hover:border-[#D4AF37]/20 transition-colors duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/5 rounded-xl flex-shrink-0">
                      <Package className="text-[#D4AF37]" size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {order.product}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {order.date} • {order.type}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))
            ) : (
              <div className="bg-[#0A0A0B] border border-dashed border-white/10 p-16 rounded-3xl text-center">
                <Package size={36} className="mx-auto text-white/10 mb-4" />
                <p className="text-gray-500 text-sm">
                  Aucune activité récente.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Accès rapide (1/3) — exact de mon_code.html */}
        <div className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/50">
            Accès Rapide
          </h3>
          <Link
            to="/marketplace"
            className="w-full p-4 rounded-2xl bg-white/5 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 border border-transparent transition-all flex items-center gap-3 text-sm font-bold text-gray-300"
          >
            <ShoppingBag size={18} /> Marketplace
            <ArrowRight size={14} className="ml-auto" />
          </Link>
          <Link
            to="/groupage"
            className="w-full p-4 rounded-2xl bg-white/5 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 border border-transparent transition-all flex items-center gap-3 text-sm font-bold text-gray-300"
          >
            <Users size={18} /> Groupages
            <ArrowRight size={14} className="ml-auto" />
          </Link>
          <button
            onClick={() => setActiveTab("orders")}
            className="w-full p-4 rounded-2xl bg-white/5 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 border border-transparent transition-all flex items-center gap-3 text-sm font-bold text-gray-300"
          >
            <Plus size={18} /> Nouvelle Commande
            <ArrowRight size={14} className="ml-auto" />
          </button>

          {/* Card sourcing promo */}
          <div className="bg-[#D4AF37] p-6 rounded-3xl text-black mt-4">
            <h4 className="font-black text-base leading-tight mb-2">
              Lancez un sourcing
            </h4>
            <p className="text-xs font-medium mb-5 opacity-70">
              Trouvez les meilleurs fournisseurs en Chine avec notre équipe.
            </p>
            <Link
              to="/sourcing"
              className="block w-full py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase text-center hover:scale-105 transition-transform"
            >
              Démarrer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
