import React, { useState, useMemo } from "react";
import { Search, Filter, Package, Clock } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import StatusBadge from "../components/StatusBadge";

const ORDER_STATUSES = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "EN_ATTENTE", label: "En Attente" },
  { value: "SOURCING", label: "Sourcing" },
  { value: "EN_TRANSIT", label: "En Transit" },
  { value: "EXPEDIE", label: "Expédié" },
  { value: "LIVRE", label: "Livré" },
  { value: "ANNULE", label: "Annulé" },
];

const Orders = () => {
  const { db, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const userOrders = useMemo(() => {
    return db.orders.filter((order) => {
      const matchesUser = order.userId === currentUser?.uid;
      const matchesSearch =
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "ALL" || order.status === filterStatus;
      return matchesUser && matchesSearch && matchesFilter;
    });
  }, [db.orders, currentUser, searchTerm, filterStatus]);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-black text-white uppercase">
        Historique des Commandes
      </h3>

      {/* ── BARRE DE RECHERCHE & FILTRES ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0A0A0B] p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Rechercher un produit ou un ID..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#D4AF37] outline-none transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-[#D4AF37] flex-shrink-0" />
          <select
            className="bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white outline-none cursor-pointer focus:border-[#D4AF37]"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s.value} value={s.value} className="bg-[#111112]">
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── LISTE DES COMMANDES ───────────────────────────────────────── */}
      <div className="space-y-4">
        {userOrders.length > 0 ? (
          userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#161617] border border-white/5 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#D4AF37]/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl flex-shrink-0">
                  <Package className="text-[#D4AF37]" size={20} />
                </div>
                <div>
                  <p className="font-bold text-white text-base">
                    {order.product}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    ID: {order.id} • {order.date}
                  </p>
                  <p className="text-[10px] text-gray-600 font-bold uppercase mt-0.5">
                    {order.type}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-2 ml-16 sm:ml-0">
                <StatusBadge status={order.status} />
                <span className="text-[11px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded-lg">
                  {order.trackingInternal}
                </span>
                {order.trackingCarrier &&
                  order.trackingCarrier !== "PENDING" && (
                    <span className="text-[10px] text-gray-500 font-mono">
                      {order.trackingCarrier}
                    </span>
                  )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#0A0A0B] border border-dashed border-white/10 p-20 rounded-3xl text-center">
            <Package size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== "ALL"
                ? "Aucune commande ne correspond à votre recherche."
                : "Vous n'avez pas encore passé de commande."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
