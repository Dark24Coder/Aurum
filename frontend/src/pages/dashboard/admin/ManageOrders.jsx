// src/pages/dashboard/admin/ManageOrders.jsx
import { useState } from "react";
import { Package, Search, X } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useToast } from "../../../components/ui/useToast";
import { formatCurrency } from "../../../utils/constants";
import FloatInput from "../../../components/ui/FloatInput";
import FloatSelect from "../../../components/ui/FloatSelect";

const ORDER_STATUSES = [
  { value: "EN_ATTENTE", label: "En Attente" },
  { value: "SOURCING", label: "Sourcing" },
  { value: "CONTROLE_QUALITE", label: "Contrôle Qualité" },
  { value: "EXPEDIE", label: "Expédié" },
  { value: "EN_TRANSIT", label: "En Transit" },
  { value: "LIVRE", label: "Livré" },
  { value: "ANNULE", label: "Annulé" },
];

const STATUS_STYLES = {
  LIVRE: "text-green-400  bg-green-500/10  border-green-500/20",
  EXPEDIE: "text-green-400  bg-green-500/10  border-green-500/20",
  EN_TRANSIT: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  SOURCING: "text-blue-400   bg-blue-500/10   border-blue-500/20",
  CONTROLE_QUALITE: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  EN_ATTENTE: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  ANNULE: "text-red-400    bg-red-500/10    border-red-500/20",
};

const TYPE_STYLES = {
  SOURCING: "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20",
  MARKETPLACE: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  GROUPAGE: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${STATUS_STYLES[status] || "text-gray-400 bg-white/5 border-white/10"}`}
    >
      {ORDER_STATUSES.find((s) => s.value === status)?.label ||
        status?.replace("_", " ")}
    </span>
  );
}

export default function ManageOrders() {
  const { db, adminUpdateOrderStatus } = useAuth();
  const { toast, ToastContainer } = useToast();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const STATUS_LABELS = {
    EN_ATTENTE: "En attente",
    SOURCING: "Sourcing",
    CONTROLE_QUALITE: "Contrôle qualité",
    EXPEDIE: "Expédié",
    EN_TRANSIT: "En transit",
    LIVRE: "Livré",
    ANNULE: "Annulé",
  };

  const handleStatusChange = (orderId, newStatus, productName) => {
    adminUpdateOrderStatus(orderId, newStatus);
    toast.success(
      `"${productName}" → ${STATUS_LABELS[newStatus] || newStatus}`,
    );
  };

  const orders = db.orders || [];

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.id?.toLowerCase().includes(search.toLowerCase()) ||
      o.product?.toLowerCase().includes(search.toLowerCase()) ||
      o.trackingInternal?.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || o.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <main className="space-y-6">
      {ToastContainer}

      {/* Barre filtre + recherche */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Recherche FloatInput */}
        <div className="flex-1">
          <FloatInput
            label="Rechercher par ID, produit ou tracking…"
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            rightElement={
              search ? (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-500 hover:text-white transition"
                >
                  <X size={13} />
                </button>
              ) : null
            }
          />
        </div>

        {/* Filtre type */}
        <div className="flex gap-2">
          {["ALL", "SOURCING", "MARKETPLACE", "GROUPAGE"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                filterType === t
                  ? "bg-[#D4AF37] text-black"
                  : "bg-[#111112] border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {t === "ALL" ? "Tout" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Compteur */}
      <div className="text-[11px] text-gray-500 font-bold">
        {filtered.length} commande{filtered.length > 1 ? "s" : ""}{" "}
        {search && `pour "${search}"`}
      </div>

      {/* Liste commandes */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-600">
            <Package size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">Aucune commande trouvée</p>
          </div>
        ) : (
          filtered.map((o) => (
            <div
              key={o.id}
              className="bg-[#111112] border border-white/5 rounded-2xl px-5 py-4 transition-all hover:border-white/10"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Info commande */}
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Package size={15} className="text-[#D4AF37]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-black text-white text-sm">
                        {o.product}
                      </span>
                      {o.type && (
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${TYPE_STYLES[o.type] || "text-gray-400 bg-white/5 border-white/10"}`}
                        >
                          {o.type}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap">
                      <span className="font-mono">{o.id}</span>
                      {o.trackingInternal && (
                        <span>· {o.trackingInternal}</span>
                      )}
                      {o.date && <span>· {o.date}</span>}
                      {o.price > 0 && (
                        <span className="font-bold text-gray-400">
                          · {formatCurrency(o.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contrôles */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={o.status} />
                  <div className="w-44">
                    <FloatSelect
                      label="Statut"
                      value={o.status}
                      onChange={(val) =>
                        handleStatusChange(o.id, val, o.product)
                      }
                      options={ORDER_STATUSES.map((s) => ({
                        value: s.value,
                        label: s.label,
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
