// src/pages/dashboard/admin/ManagePromos.jsx
// Gestion codes promo : créer, activer/désactiver, supprimer
import { useState } from "react";
import { useAuth } from "../../../context/useAuth";
import {
  Tag,
  Plus,
  X,
  Check,
  Copy,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Percent,
  Calendar,
  Users,
} from "lucide-react";
import { generateId } from "../../../utils/constants";

const EMPTY_FORM = {
  code: "",
  discount: "",
  type: "PERCENT", // PERCENT | FIXED
  maxUses: "",
  expiresAt: "",
  minOrder: "",
};

const TYPE_OPTIONS = [
  { value: "PERCENT", label: "% Réduction", icon: "%" },
  { value: "FIXED", label: "Montant fixe (FCFA)", icon: "F" },
];

function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  // Génère un code aléatoire style AURUM20
  const generateCode = () => {
    const words = ["AURUM", "GOLD", "BJB", "VIP", "PROMO", "LUXE"];
    const numbers = ["10", "15", "20", "25", "30", "50"];
    set(
      "code",
      words[Math.floor(Math.random() * words.length)] +
        numbers[Math.floor(Math.random() * numbers.length)],
    );
  };

  const submit = () => {
    if (!form.code.trim()) return setError("Le code est requis.");
    if (
      !form.discount ||
      isNaN(Number(form.discount)) ||
      Number(form.discount) <= 0
    )
      return setError("La réduction doit être un nombre positif.");
    if (form.type === "PERCENT" && Number(form.discount) > 100)
      return setError("La réduction % ne peut pas dépasser 100.");
    setError("");
    onCreate({
      id: generateId("PROMO"),
      code: form.code.trim().toUpperCase(),
      discount: Number(form.discount),
      type: form.type,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
      minOrder: form.minOrder ? Number(form.minOrder) : 0,
      uses: 0,
      active: true,
      createdAt: new Date().toLocaleDateString("fr-FR"),
    });
    onClose();
  };

  const inputCls =
    "w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/50 transition-colors";

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#111112] border border-[#D4AF37]/20 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <h3 className="font-black text-white uppercase tracking-tight text-lg flex items-center gap-2">
            <Tag size={18} className="text-[#D4AF37]" /> Nouveau Code Promo
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Code */}
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
              Code promo *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: AURUM20"
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                className={inputCls + " flex-1 font-mono tracking-widest"}
              />
              <button
                onClick={generateCode}
                className="px-3 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-black text-[10px] uppercase tracking-wide hover:bg-[#D4AF37]/20 transition-colors whitespace-nowrap"
              >
                Générer
              </button>
            </div>
          </div>

          {/* Type de réduction */}
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
              Type de réduction *
            </label>
            <div className="flex gap-3">
              {TYPE_OPTIONS.map((t) => (
                <button
                  key={t.value}
                  onClick={() => set("type", t.value)}
                  className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide border transition-all ${
                    form.type === t.value
                      ? "bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]"
                      : "bg-white/3 border-white/10 text-gray-500 hover:border-white/20"
                  }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Réduction + commande min */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                Réduction {form.type === "PERCENT" ? "(%)" : "(FCFA)"} *
              </label>
              <input
                type="number"
                min="0"
                placeholder={form.type === "PERCENT" ? "Ex: 20" : "Ex: 5000"}
                value={form.discount}
                onChange={(e) => set("discount", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                Commande min (FCFA)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 50000"
                value={form.minOrder}
                onChange={(e) => set("minOrder", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Utilisations max + expiration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                <Users size={10} className="inline mr-1" />
                Utilisations max
              </label>
              <input
                type="number"
                min="1"
                placeholder="Illimité"
                value={form.maxUses}
                onChange={(e) => set("maxUses", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                <Calendar size={10} className="inline mr-1" />
                Date d'expiration
              </label>
              <input
                type="date"
                value={form.expiresAt}
                onChange={(e) => set("expiresAt", e.target.value)}
                className={inputCls + " [color-scheme:dark]"}
              />
            </div>
          </div>

          {/* Preview */}
          {form.code && form.discount && (
            <div className="p-3.5 bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-500 font-black uppercase">
                  Aperçu
                </p>
                <p className="text-sm font-black text-white mt-0.5">
                  Code{" "}
                  <span className="text-[#D4AF37] font-mono tracking-widest">
                    {form.code}
                  </span>{" "}
                  →{" "}
                  {form.type === "PERCENT"
                    ? `-${form.discount}%`
                    : `-${form.discount} FCFA`}
                  {form.minOrder ? ` (min ${form.minOrder} FCFA)` : ""}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button
            onClick={submit}
            className="w-full py-3.5 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90 transition-opacity"
          >
            Créer le code promo
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManagePromos() {
  const { db, setDb } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(null);

  const promos = db.promoCodes || [];

  const addPromo = (newPromo) => {
    setDb((prev) => ({
      ...prev,
      promoCodes: [newPromo, ...(prev.promoCodes || [])],
    }));
  };

  const toggleActive = (id) => {
    setDb((prev) => ({
      ...prev,
      promoCodes: prev.promoCodes.map((p) =>
        p.id === id ? { ...p, active: !p.active } : p,
      ),
    }));
  };

  const deletePromo = (id) => {
    if (!window.confirm("Supprimer ce code promo ?")) return;
    setDb((prev) => ({
      ...prev,
      promoCodes: prev.promoCodes.filter((p) => p.id !== id),
    }));
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeCount = promos.filter((p) => p.active).length;
  const totalUses = promos.reduce((s, p) => s + (p.uses || 0), 0);

  // Statut d'un promo
  const getStatus = (p) => {
    if (!p.active)
      return {
        label: "Inactif",
        color: "text-gray-400   bg-white/5       border-white/10",
      };
    if (p.expiresAt && new Date(p.expiresAt) < new Date())
      return {
        label: "Expiré",
        color: "text-red-400    bg-red-500/10    border-red-500/20",
      };
    if (p.maxUses && p.uses >= p.maxUses)
      return {
        label: "Épuisé",
        color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
      };
    return {
      label: "Actif",
      color: "text-green-400 bg-green-500/10 border-green-500/20",
    };
  };

  return (
    <div className="space-y-6">
      {/* Stats + bouton */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="grid grid-cols-3 gap-3 flex-1 min-w-0">
          {[
            { label: "Codes actifs", count: activeCount, color: "#10B981" },
            { label: "Total créés", count: promos.length, color: "#D4AF37" },
            { label: "Utilisations", count: totalUses, color: "#818cf8" },
          ].map(({ label, count, color }) => (
            <div
              key={label}
              className="bg-[#111112] border border-white/5 rounded-2xl p-4"
            >
              <div className="text-2xl font-black" style={{ color }}>
                {count}
              </div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                {label}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90 flex-shrink-0"
        >
          <Plus size={15} /> Nouveau code
        </button>
      </div>

      {/* Liste des promos */}
      {promos.length === 0 ? (
        <div className="bg-[#111112] border border-white/5 rounded-2xl py-16 text-center">
          <Tag size={32} className="mx-auto text-gray-700 mb-3" />
          <p className="text-gray-500 text-sm font-bold">
            Aucun code promo créé
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] font-black text-[10px] uppercase tracking-widest hover:bg-[#D4AF37]/20 transition-colors"
          >
            Créer le premier code
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map((p) => {
            const status = getStatus(p);
            return (
              <div
                key={p.id}
                className={`bg-[#111112] border rounded-2xl px-5 py-4 flex items-center justify-between gap-3 flex-wrap transition-colors ${
                  p.active
                    ? "border-white/5 hover:border-white/10"
                    : "border-white/3 opacity-60"
                }`}
              >
                {/* Gauche — code + infos */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                    {p.type === "PERCENT" ? (
                      <Percent size={16} className="text-[#D4AF37]" />
                    ) : (
                      <Tag size={16} className="text-[#D4AF37]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-white text-base tracking-widest">
                        {p.code}
                      </span>
                      <button
                        onClick={() => copyCode(p.code)}
                        className="p-1 rounded text-gray-600 hover:text-[#D4AF37] transition-colors"
                        title="Copier"
                      >
                        {copied === p.code ? (
                          <Check size={12} className="text-green-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-3 flex-wrap">
                      <span className="text-[#D4AF37] font-bold">
                        {p.type === "PERCENT"
                          ? `-${p.discount}%`
                          : `-${p.discount} FCFA`}
                      </span>
                      {p.minOrder > 0 && (
                        <span>Min {p.minOrder.toLocaleString()} FCFA</span>
                      )}
                      {p.maxUses && (
                        <span>
                          {p.uses}/{p.maxUses} utilisations
                        </span>
                      )}
                      {!p.maxUses && (
                        <span>
                          {p.uses} utilisation{p.uses !== 1 ? "s" : ""}
                        </span>
                      )}
                      {p.expiresAt && (
                        <span>
                          Exp.{" "}
                          {new Date(p.expiresAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Droite — actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(p.id)}
                    className={`p-2 rounded-lg transition-all ${
                      p.active
                        ? "text-green-400 hover:bg-green-500/10"
                        : "text-gray-600 hover:bg-white/5"
                    }`}
                    title={p.active ? "Désactiver" : "Activer"}
                  >
                    {p.active ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => deletePromo(p.id)}
                    className="p-2 rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Supprimer"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <CreateModal onClose={() => setShowModal(false)} onCreate={addPromo} />
      )}
    </div>
  );
}
