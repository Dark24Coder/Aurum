import { useState, useMemo } from "react";
import { Search, Package, Filter } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import StatusBadge from "../components/StatusBadge";
import FloatInput from "../../../components/ui/FloatInput";
import FloatSelect from "../../../components/ui/FloatSelect";

const ORDER_STATUSES = [
  { value: "ALL", label: "Tous les statuts" },
  { value: "EN_ATTENTE", label: "En Attente" },
  { value: "SOURCING", label: "Sourcing" },
  { value: "EN_TRANSIT", label: "En Transit" },
  { value: "EXPEDIE", label: "Expédié" },
  { value: "LIVRE", label: "Livré" },
  { value: "ANNULE", label: "Annulé" },
];

// Couleur selon statut pour les cards mobile
const STATUS_DOT = {
  EN_ATTENTE: "bg-yellow-400",
  SOURCING: "bg-blue-400",
  EN_TRANSIT: "bg-purple-400",
  EXPEDIE: "bg-orange-400",
  LIVRE: "bg-green-400",
  ANNULE: "bg-red-400",
};

const Orders = () => {
  const { db, currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const userOrders = useMemo(() => {
    return (db.orders || []).filter((order) => {
      const matchesUser = order.userId === currentUser?.uid;
      const matchesSearch =
        order.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filterStatus === "ALL" || order.status === filterStatus;
      return matchesUser && matchesSearch && matchesFilter;
    });
  }, [db.orders, currentUser, searchTerm, filterStatus]);

  return (
    <main className="space-y-6">
      <h3 className="text-xl font-black text-white uppercase tracking-tight">
        Historique des Commandes
      </h3>

      {/* ── Barre filtres ─ sur une seule ligne ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <FloatInput
            label="Rechercher un produit ou un ID…"
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="w-44 sm:w-52 flex-shrink-0">
          <FloatSelect
            label="Statut"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val)}
            options={ORDER_STATUSES}
            icon={Filter}
          />
        </div>
      </div>

      {/* Compteur */}
      {userOrders.length > 0 && (
        <p className="text-[11px] text-gray-500 font-bold">
          {userOrders.length} commande{userOrders.length > 1 ? "s" : ""}
        </p>
      )}

      {/* ── Liste commandes ── */}
      <div className="space-y-3">
        {userOrders.length > 0 ? (
          userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#161617] border border-white/5 rounded-2xl hover:border-[#D4AF37]/20 transition-colors duration-300"
            >
              {/* Layout desktop */}
              <div className="hidden sm:flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-4 min-w-0">
                  {/* Dot statut */}
                  <div className="relative flex-shrink-0">
                    <div className="p-3 bg-white/5 rounded-xl">
                      <Package className="text-[#D4AF37]" size={20} />
                    </div>
                    <span
                      className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#161617] ${STATUS_DOT[order.status] || "bg-gray-500"}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white text-base truncate">
                      {order.product}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-gray-500">
                        ID: {order.id}
                      </span>
                      <span className="text-gray-700">·</span>
                      <span className="text-[11px] text-gray-500">
                        {order.date}
                      </span>
                      <span className="text-gray-700">·</span>
                      <span className="text-[10px] text-gray-600 font-bold uppercase">
                        {order.type}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
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

              {/* Layout mobile */}
              <div className="sm:hidden p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="p-2.5 bg-white/5 rounded-xl">
                        <Package className="text-[#D4AF37]" size={16} />
                      </div>
                      <span
                        className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-[#161617] ${STATUS_DOT[order.status] || "bg-gray-500"}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm leading-tight line-clamp-2">
                        {order.product}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        {order.date} ·{" "}
                        <span className="uppercase">{order.type}</span>
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-white/5">
                  <span className="text-[10px] text-gray-600">ID:</span>
                  <span className="text-[10px] font-mono text-gray-400">
                    {order.id}
                  </span>
                  <span className="text-[11px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-md ml-auto">
                    {order.trackingInternal}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-[#0A0A0B] border border-dashed border-white/10 p-16 sm:p-20 rounded-3xl text-center">
            <Package size={36} className="mx-auto text-white/10 mb-4" />
            <p className="text-gray-500 text-sm">
              {searchTerm || filterStatus !== "ALL"
                ? "Aucune commande ne correspond à votre recherche."
                : "Vous n'avez pas encore passé de commande."}
            </p>
            {(searchTerm || filterStatus !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("ALL");
                }}
                className="mt-3 text-[#D4AF37] text-xs font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;
