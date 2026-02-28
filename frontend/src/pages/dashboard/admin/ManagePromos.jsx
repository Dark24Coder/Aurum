// src/pages/dashboard/admin/ManagePromos.jsx
// ✅ FloatInput + FloatSelect pour les champs du formulaire
// ✅ Responsive mobile/tablette/desktop
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
import FloatInput from "../../../components/ui/FloatInput";
import { useConfirm } from "../../../components/ui/useConfirm";
import { useToast } from "../../../components/ui/useToast";
import FloatSelect from "../../../components/ui/FloatSelect";

const EMPTY_FORM = {
  code: "",
  discount: "",
  type: "PERCENT",
  maxUses: "",
  expiresAt: "",
  minOrder: "",
};

const TYPE_OPTIONS = [
  { value: "PERCENT", label: "% Réduction" },
  { value: "FIXED", label: "Montant fixe (FCFA)" },
];

// ── Modal Création ─────────────────────────────────────────────────────────────
function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

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

  return (
    <main
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#111112] border border-[#D4AF37]/20 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <h3 className="font-black text-white uppercase tracking-tight text-base sm:text-lg flex items-center gap-2">
            <Tag size={18} className="text-[#D4AF37]" /> Nouveau Code Promo
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* Code */}
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
              Code promo *
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <FloatInput
                  label="Ex: AURUM20"
                  name="code"
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                />
              </div>
              <button
                onClick={generateCode}
                className="px-3 py-2 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-black text-[10px] uppercase tracking-wide hover:bg-[#D4AF37]/20 transition-colors whitespace-nowrap self-start mt-1"
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
            <FloatSelect
              label="Type"
              value={form.type}
              onChange={(val) => set("type", val)}
              options={TYPE_OPTIONS}
              icon={Percent}
            />
          </div>

          {/* Réduction + commande min */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                Réduction {form.type === "PERCENT" ? "(%)" : "(FCFA)"} *
              </label>
              <FloatInput
                label={form.type === "PERCENT" ? "Ex: 20" : "Ex: 5000"}
                name="discount"
                type="number"
                value={form.discount}
                onChange={(e) => set("discount", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                Commande min (FCFA)
              </label>
              <FloatInput
                label="Ex: 50000"
                name="minOrder"
                type="number"
                value={form.minOrder}
                onChange={(e) => set("minOrder", e.target.value)}
              />
            </div>
          </div>

          {/* Utilisations max + expiration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                <Users size={10} className="inline mr-1" /> Utilisations max
              </label>
              <FloatInput
                label="Illimité"
                name="maxUses"
                type="number"
                value={form.maxUses}
                onChange={(e) => set("maxUses", e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
                <Calendar size={10} className="inline mr-1" /> Date d'expiration
              </label>
              <FloatInput
                label="Date"
                name="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={(e) => set("expiresAt", e.target.value)}
              />
            </div>
          </div>

          {/* Preview */}
          {form.code && form.discount && (
            <div className="p-3.5 bg-[#D4AF37]/8 border border-[#D4AF37]/20 rounded-xl">
              <p className="text-[10px] text-gray-500 font-black uppercase mb-1">
                Aperçu
              </p>
              <p className="text-sm font-black text-white">
                Code{" "}
                <span className="text-[#D4AF37] font-mono tracking-widest">
                  {form.code}
                </span>
                {" → "}
                {form.type === "PERCENT"
                  ? `-${form.discount}%`
                  : `-${form.discount} FCFA`}
                {form.minOrder ? ` (min ${form.minOrder} FCFA)` : ""}
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button
            onClick={submit}
            className="w-full py-3.5 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90 transition-opacity"
          >
            Créer le code promo
          </button>
        </div>
      </div>
    </main>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function ManagePromos() {
  const { db, setDb } = useAuth();
  const { confirm, ConfirmDialog } = useConfirm();
  const { toast, ToastContainer } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(null);

  const promos = db.promoCodes || [];

  const addPromo = (newPromo) => {
    setDb((prev) => ({
      ...prev,
      promoCodes: [newPromo, ...(prev.promoCodes || [])],
    }));
    toast.success(`Code "${newPromo.code}" créé avec succès !`);
  };

  const toggleActive = (id) => {
    let nowActive;
    setDb((prev) => ({
      ...prev,
      promoCodes: prev.promoCodes.map((p) => {
        if (p.id !== id) return p;
        nowActive = !p.active;
        return { ...p, active: nowActive };
      }),
    }));
    setTimeout(() => {
      toast.info(nowActive ? "Code promo activé." : "Code promo désactivé.");
    }, 0);
  };

  const deletePromo = async (id, code) => {
    const ok = await confirm({
      title: "Supprimer le code promo",
      message: `Supprimer le code "${code}" ? Cette action est irréversible.`,
      confirmLabel: "Supprimer",
      variant: "danger",
    });
    if (!ok) return;
    setDb((prev) => ({
      ...prev,
      promoCodes: prev.promoCodes.filter((p) => p.id !== id),
    }));
    toast.success("Code promo supprimé.");
  };

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeCount = promos.filter((p) => p.active).length;
  const totalUses = promos.reduce((s, p) => s + (p.uses || 0), 0);

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
    <main className="space-y-6">
      {ConfirmDialog}
      {ToastContainer}

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
          <span className="hidden sm:inline">Nouveau code</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      {/* Liste promos */}
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
                className={`bg-[#111112] border rounded-2xl px-4 sm:px-5 py-4 flex items-center justify-between gap-3 flex-wrap transition-colors ${
                  p.active
                    ? "border-white/5 hover:border-white/10"
                    : "border-white/3 opacity-60"
                }`}
              >
                {/* Gauche */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                    {p.type === "PERCENT" ? (
                      <Percent size={15} className="text-[#D4AF37]" />
                    ) : (
                      <Tag size={15} className="text-[#D4AF37]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    {/* Ligne code + statut */}
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-mono font-black text-white text-sm sm:text-base tracking-widest">
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
                    {/* Infos */}
                    <div className="text-[10px] sm:text-[11px] text-gray-500 flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="text-[#D4AF37] font-bold">
                        {p.type === "PERCENT"
                          ? `-${p.discount}%`
                          : `-${p.discount} FCFA`}
                      </span>
                      {p.minOrder > 0 && (
                        <span>Min {p.minOrder.toLocaleString()} F</span>
                      )}
                      {p.maxUses ? (
                        <span>
                          {p.uses}/{p.maxUses} util.
                        </span>
                      ) : (
                        <span>{p.uses} util.</span>
                      )}
                      {p.expiresAt && (
                        <span className="hidden sm:inline">
                          Exp.{" "}
                          {new Date(p.expiresAt).toLocaleDateString("fr-FR")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Droite — actions */}
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(p.id)}
                    className={`p-2 rounded-lg transition-all ${p.active ? "text-green-400 hover:bg-green-500/10" : "text-gray-600 hover:bg-white/5"}`}
                    title={p.active ? "Désactiver" : "Activer"}
                  >
                    {p.active ? (
                      <ToggleRight size={20} />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                  <button
                    onClick={() => deletePromo(p.id, p.code)}
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
    </main>
  );
}
