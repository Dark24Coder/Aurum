// src/pages/dashboard/user/MesGroupages.jsx
// ✅ Onglet "Mes Groupages" dans le dashboard user
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, Ship, Clock, ChevronRight, Package } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import StatusBadge from "../components/StatusBadge";

const formatCurrency = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    n,
  );

function ProgressBar({ reserved, target }) {
  const pct = Math.min(100, Math.round((reserved / target) * 100));
  const color =
    pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-[#D4AF37]" : "bg-blue-400";
  return (
    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function MesGroupages() {
  const { db, currentUser } = useAuth();

  const myGroupageOrders = useMemo(
    () =>
      (db.orders || []).filter(
        (o) => o.userId === currentUser?.uid && o.type === "GROUPAGE",
      ),
    [db.orders, currentUser],
  );

  // Enrichir avec les infos du groupage
  const enriched = myGroupageOrders.map((order) => ({
    order,
    grp: (db.groupages || []).find((g) => g.id === order.groupageId) || null,
  }));

  if (enriched.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">
          Mes Groupages
        </h3>
        <div className="bg-[#0A0A0B] border border-dashed border-white/10 rounded-3xl p-16 text-center">
          <Ship size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-gray-500 text-sm mb-4">
            Vous n'avez encore rejoint aucun groupage.
          </p>
          <Link
            to="/groupage"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] text-black font-black text-[11px] uppercase tracking-widest hover:opacity-90"
          >
            <Users size={13} /> Voir les groupages ouverts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white uppercase tracking-tight">
          Mes Groupages
        </h3>
        <Link
          to="/groupage"
          className="flex items-center gap-1.5 text-[11px] font-black text-[#D4AF37] uppercase tracking-widest hover:underline"
        >
          Voir tous <ChevronRight size={12} />
        </Link>
      </div>

      <div className="space-y-4">
        {enriched.map(({ order, grp }) => (
          <div
            key={order.id}
            className="bg-[#161617] border border-white/5 rounded-2xl hover:border-[#D4AF37]/20 transition-colors duration-300"
          >
            {/* Desktop */}
            <div className="hidden sm:flex items-center gap-4 p-5">
              {/* Image miniature */}
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0A0A0B] flex-shrink-0">
                {grp?.img ? (
                  <img
                    src={grp.img}
                    alt={order.product}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={20} className="text-gray-700" />
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-black text-white text-sm truncate">
                    {order.product}
                  </span>
                  <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20">
                    Groupage
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap mb-2">
                  <span>Rejoint le {order.date}</span>
                  <span>·</span>
                  <span className="font-mono text-[#D4AF37]">
                    {order.trackingInternal}
                  </span>
                  <span>·</span>
                  <span className="font-bold text-white">
                    {formatCurrency(order.price)}
                  </span>
                </div>
                {grp && (
                  <div className="space-y-1">
                    <ProgressBar reserved={grp.reserved} target={grp.target} />
                    <div className="flex justify-between text-[9px] text-gray-600">
                      <span>
                        {grp.reserved}/{grp.target} réservés
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={8} /> Départ: {grp.deadline}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Statut */}
              <div className="flex-shrink-0">
                <StatusBadge status={order.status} />
              </div>
            </div>

            {/* Mobile */}
            <div className="sm:hidden p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0A0A0B] flex-shrink-0">
                    {grp?.img ? (
                      <img
                        src={grp.img}
                        alt={order.product}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={16} className="text-gray-700" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-white text-sm line-clamp-2 leading-tight">
                      {order.product}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {order.date} · {formatCurrency(order.price)}
                    </p>
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <div className="font-mono text-[10px] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-lg w-fit">
                {order.trackingInternal}
              </div>
              {grp && (
                <div className="space-y-1 pt-2 border-t border-white/5">
                  <ProgressBar reserved={grp.reserved} target={grp.target} />
                  <div className="flex justify-between text-[9px] text-gray-600">
                    <span>
                      {grp.reserved}/{grp.target} réservés
                    </span>
                    <span>Départ: {grp.deadline}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
