import { useMemo } from "react";
import { Package, Plane, Users, Wallet, ShoppingBag, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "./components/StatsCard";
import StatusBadge from "./components/StatusBadge";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    amount,
  );

function Overview({ orders }) {
  const stats = useMemo(() => {
    const expenses = orders
      .filter((o) => o.price > 0)
      .reduce((sum, o) => sum + o.price, 0);

    return [
      { label: "Commandes", value: orders.length, icon: <Package size={24} /> },
      {
        label: "En Transit",
        value: orders.filter((o) => o.status === "EN_TRANSIT").length,
        icon: <Plane size={24} />,
      },
      {
        label: "Groupages",
        value: orders.filter((o) => o.type === "GROUPAGE").length,
        icon: <Users size={24} />,
      },
      {
        label: "Dépenses",
        value: formatCurrency(expenses),
        icon: <Wallet size={24} />,
      },
    ];
  }, [orders]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <StatsCard key={i} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </div>

      {/* Commandes récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-black text-white uppercase">Récentes</h3>

          {orders.slice(0, 3).map((order) => (
            <div
              key={order.id}
              className="bg-[#161617] border border-white/5 rounded-2xl p-5 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <Package className="text-[#D4AF37]" size={20} />
                <div>
                  <div className="font-bold text-white">{order.product}</div>
                  <div className="text-xs text-gray-500">
                    {order.date} • {order.type}
                  </div>
                </div>
              </div>
              <StatusBadge status={order.status} />
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              Aucune activité récente.
            </p>
          )}
        </div>

        {/* Accès rapide */}
        <div className="space-y-3">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">
            Accès Rapide
          </h3>

          {[
            {
              to: "/marketplace",
              icon: <ShoppingBag size={18} />,
              label: "Marketplace",
            },
            { to: "/groupage", icon: <Users size={18} />, label: "Groupages" },
            {
              to: "/sourcing",
              icon: <Plus size={18} />,
              label: "Nouvelle Commande",
            },
          ].map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className="w-full p-4 rounded-2xl bg-white/5 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition flex items-center gap-3 text-sm font-bold text-gray-300"
            >
              {icon} {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Overview;
