// src/pages/dashboard/admin/ManageGroupages.jsx
// ✅ Gestion des conteneurs groupage côté admin
// ✅ Créer, changer statut, voir participants, supprimer
import { useState } from "react";
import { useAuth } from "../../../context/useAuth";
import {
  Ship,
  Plus,
  X,
  Trash2,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Package,
  ChevronDown,
} from "lucide-react";
import FloatInput from "../../../components/ui/FloatInput";
import FloatSelect from "../../../components/ui/FloatSelect";

const formatCurrency = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    n,
  );

const STATUS_OPTIONS = [
  { value: "OUVERT", label: "Ouvert" },
  { value: "COMPLET", label: "Complet" },
  { value: "PARTI", label: "Conteneur parti" },
  { value: "CLOSED", label: "Fermé" },
];

const ORIGIN_OPTIONS = [
  { value: "Chine", label: "Chine" },
  { value: "Turquie", label: "Turquie" },
  { value: "Dubaï", label: "Dubaï" },
  { value: "France", label: "France" },
];

const DEST_OPTIONS = [
  { value: "Cotonou", label: "Cotonou" },
  { value: "Lomé", label: "Lomé" },
  { value: "Abidjan", label: "Abidjan" },
  { value: "Dakar", label: "Dakar" },
  { value: "Douala", label: "Douala" },
];

const EMPTY = {
  name: "",
  price: "",
  target: "",
  deadline: "",
  img: "",
  desc: "",
  origin: "Chine",
  destination: "Cotonou",
};

function ProgressBar({ reserved, target }) {
  const pct = Math.min(100, Math.round((reserved / target) * 100));
  const color =
    pct >= 90 ? "bg-red-400" : pct >= 60 ? "bg-[#D4AF37]" : "bg-blue-400";
  return (
    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ── Modal création ────────────────────────────────────────────────────────────
function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) return setError("Nom requis.");
    if (!form.price || isNaN(+form.price) || +form.price <= 0)
      return setError("Prix requis.");
    if (!form.target || isNaN(+form.target) || +form.target < 2)
      return setError("Objectif min 2 places.");
    if (!form.deadline) return setError("Deadline requise.");
    setError("");
    onCreate({
      id: `GRP-${Math.floor(Math.random() * 100000)}`,
      name: form.name.trim(),
      price: +form.price,
      target: +form.target,
      reserved: 0,
      deadline: new Date(form.deadline).toLocaleDateString("fr-FR"),
      img:
        form.img.trim() ||
        "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600",
      desc: form.desc.trim(),
      origin: form.origin,
      destination: form.destination,
      status: "OUVERT",
      createdAt: new Date().toLocaleDateString("fr-FR"),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#111112] border border-[#D4AF37]/20 w-full max-w-lg rounded-3xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <h3 className="font-black text-white uppercase tracking-tight text-base flex items-center gap-2">
            <Ship size={17} className="text-[#D4AF37]" /> Nouveau Groupage
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={17} />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <FloatInput
            label="Nom du produit / groupage *"
            name="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                Prix / unité (FCFA) *
              </label>
              <FloatInput
                label="Ex: 185000"
                name="price"
                type="number"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                Objectif places *
              </label>
              <FloatInput
                label="Ex: 50"
                name="target"
                type="number"
                value={form.target}
                onChange={(e) => set("target", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
              Date limite *
            </label>
            <FloatInput
              label="Deadline"
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                Origine
              </label>
              <FloatSelect
                label="Origine"
                value={form.origin}
                onChange={(v) => set("origin", v)}
                options={ORIGIN_OPTIONS}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                Destination
              </label>
              <FloatSelect
                label="Destination"
                value={form.destination}
                onChange={(v) => set("destination", v)}
                options={DEST_OPTIONS}
              />
            </div>
          </div>

          <FloatInput
            label="URL image (optionnel)"
            name="img"
            value={form.img}
            onChange={(e) => set("img", e.target.value)}
          />
          <FloatInput
            label="Description courte (optionnel)"
            name="desc"
            value={form.desc}
            onChange={(e) => set("desc", e.target.value)}
          />

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/5 flex-shrink-0">
          <button
            onClick={submit}
            className="w-full py-3.5 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90"
          >
            Créer le groupage
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card groupage admin ────────────────────────────────────────────────────────
function GroupageRow({ grp, onStatusChange, onDelete, participants }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.min(100, Math.round((grp.reserved / grp.target) * 100));

  return (
    <div
      className={`bg-[#111112] border rounded-2xl overflow-hidden transition-colors ${grp.status === "OUVERT" ? "border-white/5 hover:border-white/10" : "border-white/3 opacity-70"}`}
    >
      {/* Ligne principale */}
      <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 flex-wrap">
        {/* Image */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#0A0A0B] flex-shrink-0">
          <img
            src={grp.img}
            alt={grp.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200";
            }}
          />
        </div>

        {/* Infos */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-black text-white text-sm truncate">
              {grp.name}
            </span>
            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded border text-gray-400 bg-white/5 border-white/10">
              {grp.origin} → {grp.destination}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-gray-500 flex-wrap mb-2">
            <span className="text-[#D4AF37] font-bold">
              {formatCurrency(grp.price)}
            </span>
            <span>
              <Clock size={9} className="inline mr-0.5" />
              Deadline: {grp.deadline}
            </span>
            <span className="text-gray-400">
              {participants.length} participant
              {participants.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-1">
            <ProgressBar reserved={grp.reserved} target={grp.target} />
            <div className="flex justify-between text-[9px] text-gray-600">
              <span>
                {grp.reserved}/{grp.target} réservés ({pct}%)
              </span>
              {grp.createdAt && <span>Créé le {grp.createdAt}</span>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Statut select compact */}
          <div className="w-36 sm:w-44">
            <FloatSelect
              label="Statut"
              value={grp.status || "OUVERT"}
              onChange={(v) => onStatusChange(grp.id, v)}
              options={STATUS_OPTIONS}
            />
          </div>
          {/* Participants toggle */}
          {participants.length > 0 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-xl text-gray-500 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
              title="Voir participants"
            >
              <Users size={15} />
            </button>
          )}
          {/* Supprimer */}
          <button
            onClick={() => onDelete(grp.id)}
            className="p-2 rounded-xl text-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Participants expandable */}
      {expanded && participants.length > 0 && (
        <div className="border-t border-white/5 px-4 sm:px-5 py-4 space-y-2">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3">
            {participants.length} participant
            {participants.length > 1 ? "s" : ""}
          </p>
          {participants.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center font-black text-[#D4AF37] text-xs flex-shrink-0">
                  {p.userId?.[0] || "?"}
                </div>
                <div>
                  <div className="text-white text-xs font-bold">{p.userId}</div>
                  <div className="text-gray-600 text-[10px]">
                    {p.date} · {formatCurrency(p.price)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#D4AF37] text-[10px] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                  {p.trackingInternal}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function ManageGroupages() {
  const { db, setDb } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const groupages = db.groupages || [];
  const orders = db.orders || [];

  const addGroupage = (g) =>
    setDb((prev) => ({ ...prev, groupages: [g, ...(prev.groupages || [])] }));

  const changeStatus = (id, status) =>
    setDb((prev) => ({
      ...prev,
      groupages: prev.groupages.map((g) =>
        g.id === id ? { ...g, status } : g,
      ),
    }));

  const deleteGroupage = (id) => {
    if (
      !window.confirm(
        "Supprimer ce groupage ? Les commandes associées restent dans le système.",
      )
    )
      return;
    setDb((prev) => ({
      ...prev,
      groupages: prev.groupages.filter((g) => g.id !== id),
    }));
  };

  const getParticipants = (grpId) =>
    orders.filter((o) => o.groupageId === grpId && o.type === "GROUPAGE");

  const totalReserved = groupages.reduce((s, g) => s + (g.reserved || 0), 0);
  const openCount = groupages.filter(
    (g) => g.status === "OUVERT" || !g.status,
  ).length;

  return (
    <div className="space-y-6">
      {/* Stats + bouton */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="grid grid-cols-3 gap-3 flex-1 min-w-0">
          {[
            { label: "Ouverts", count: openCount, color: "#10B981" },
            { label: "Total", count: groupages.length, color: "#D4AF37" },
            { label: "Places prises", count: totalReserved, color: "#818cf8" },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="bg-[#111112] border border-white/5 rounded-2xl p-3 sm:p-4"
            >
              <div className="text-xl sm:text-2xl font-black" style={{ color }}>
                {count}
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5 leading-tight">
                {label}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-3 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90 flex-shrink-0"
        >
          <Plus size={15} />{" "}
          <span className="hidden sm:inline">Nouveau groupage</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* Liste */}
      {groupages.length === 0 ? (
        <div className="bg-[#111112] border border-white/5 rounded-2xl py-16 text-center">
          <Ship size={32} className="mx-auto text-gray-700 mb-3" />
          <p className="text-gray-500 text-sm font-bold">Aucun groupage créé</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] font-black text-[10px] uppercase tracking-widest hover:bg-[#D4AF37]/20"
          >
            Créer le premier
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {groupages.map((grp) => (
            <GroupageRow
              key={grp.id}
              grp={grp}
              onStatusChange={changeStatus}
              onDelete={deleteGroupage}
              participants={getParticipants(grp.id)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <CreateModal
          onClose={() => setShowModal(false)}
          onCreate={addGroupage}
        />
      )}
    </div>
  );
}
