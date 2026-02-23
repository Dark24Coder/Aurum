// src/pages/dashboard/admin/ManageOrders.jsx
import { useState } from "react";
import { Package, Search, X } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { formatCurrency } from "../../../utils/constants";

// 🔥 Import des composants
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

// 🔥 Options pour le filtre type
const TYPE_OPTIONS = [
  { value: "ALL", label: "Tous types" },
  { value: "SOURCING", label: "Sourcing" },
  { value: "MARKETPLACE", label: "Marketplace" },
  { value: "GROUPAGE", label: "Groupage" },
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
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

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
      {/* 🔥 Barre filtre + recherche avec FloatInput */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Recherche avec FloatInput */}
        <div className="flex-1">
          <FloatInput
            label="Rechercher par ID, produit ou tracking…"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        {/* 🔥 Filtre type avec FloatSelect */}
        <div className="w-56">
          <FloatSelect
            label="Type de commande"
            value={filterType}
            onChange={setFilterType}
            options={TYPE_OPTIONS}
            icon={Package}
          />
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

                {/* Contrôles avec FloatSelect */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StatusBadge status={o.status} />

                  {/* FloatSelect pour changer le statut */}
                  <div className="w-48">
                    <FloatSelect
                      label="Statut"
                      value={o.status}
                      onChange={(newStatus) => {
                        adminUpdateOrderStatus(o.id, newStatus);
                      }}
                      options={ORDER_STATUSES}
                      icon={Package}
                      required
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
