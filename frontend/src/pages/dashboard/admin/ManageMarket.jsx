// src/pages/dashboard/admin/ManageMarket.jsx
// ✅ Ajout produit via modal (formulaire complet)
// ✅ Toggle disponible/rupture, suppression
import { useState } from "react";
import {
  Store,
  Search,
  X,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Image as ImageIcon,
  Tag, // 🔥 Import pour FloatSelect
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { formatCurrency, generateId } from "../../../utils/constants";

// 🔥 Import des composants
import FloatInput from "../../../components/ui/FloatInput";
import FloatSelect from "../../../components/ui/FloatSelect";

const CATEGORIES_LIST = ["ELECTRONIQUE", "MODE", "MAISON", "AUTO"];

// 🔥 Options pour FloatSelect
const CATEGORY_OPTIONS = [
  { value: "TOUT", label: "Toutes catégories" },
  { value: "ELECTRONIQUE", label: "Électronique" },
  { value: "MODE", label: "Mode" },
  { value: "MAISON", label: "Maison" },
  { value: "AUTO", label: "Auto" },
];

const STATUS_STYLES = {
  ACTIVE: "text-green-400 bg-green-500/10 border-green-500/20",
  RUPTURE: "text-red-400   bg-red-500/10   border-red-500/20",
};

const EMPTY_FORM = {
  name: "",
  category: "ELECTRONIQUE",
  price: "",
  desc: "",
  img: "",
  status: "ACTIVE",
};

// ── Modal ajout produit ───────────────────────────────────────────────────────
function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const change = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  const submit = () => {
    if (!form.name.trim()) return setError("Le nom est requis.");
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return setError("Entrez un prix valide (en FCFA).");
    if (!form.desc.trim()) return setError("La description est requise.");
    setError("");
    onAdd({
      ...form,
      price: parseInt(form.price, 10),
      img:
        form.img.trim() ||
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400",
      id: generateId("MK"),
      sellerId: "ADMIN-01",
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
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <h3 className="font-black text-white uppercase tracking-tight text-lg">
            Ajouter un produit
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Preview image */}
          <div className="aspect-video bg-[#0A0A0B] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
            {form.img ? (
              <img
                src={form.img}
                alt="preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="text-center text-gray-700">
                <ImageIcon size={32} className="mx-auto mb-2" />
                <p className="text-[10px] font-bold uppercase">Aperçu image</p>
              </div>
            )}
          </div>

          {/* URL image */}
          <FloatInput
            label="URL Image"
            name="img"
            type="url"
            value={form.img}
            onChange={(e) => change("img", e.target.value)}
            icon={ImageIcon}
            placeholder="https://images.unsplash.com/..."
          />

          {/* Nom du produit */}
          <FloatInput
            label="Nom du produit *"
            name="name"
            value={form.name}
            onChange={(e) => change("name", e.target.value)}
            icon={Store}
            required
          />

          {/* Catégorie + Prix */}
          <div className="grid grid-cols-2 gap-3">
            <FloatSelect
              label="Catégorie *"
              value={form.category}
              onChange={(val) => change("category", val)}
              options={CATEGORY_OPTIONS.filter((opt) => opt.value !== "TOUT")}
              icon={Tag}
              required
            />
            <FloatInput
              label="Prix (FCFA) *"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => change("price", e.target.value)}
              icon={Store}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
              Description *
            </label>
            <textarea
              rows={3}
              placeholder="Décrivez le produit..."
              value={form.desc}
              onChange={(e) => change("desc", e.target.value)}
              className={inputCls + " resize-none"}
            />
          </div>

          {/* Statut initial */}
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
              Statut initial
            </label>
            <div className="flex gap-3">
              {[
                { val: "ACTIVE", label: "Disponible" },
                { val: "RUPTURE", label: "Rupture de stock" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  onClick={() => change("status", val)}
                  className={`flex-1 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wide border transition-all ${
                    form.status === val
                      ? val === "ACTIVE"
                        ? "bg-green-500/20 border-green-500/40 text-green-400"
                        : "bg-red-500/20 border-red-500/40 text-red-400"
                      : "bg-white/3 border-white/10 text-gray-500 hover:border-white/20"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex-shrink-0">
          <button
            onClick={submit}
            className="w-full py-3.5 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90 transition-opacity"
          >
            Publier sur la Marketplace
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────────────────
export default function ManageMarket() {
  const { db, setDb } = useAuth();
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("TOUT");
  const [showModal, setShowModal] = useState(false);

  const marketplace = db.marketplace || [];

  const filtered = marketplace.filter((item) => {
    const matchSearch =
      !search || item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "TOUT" || item.category === catFilter;
    return matchSearch && matchCat;
  });

  const toggleStatus = (id) => {
    setDb((prev) => ({
      ...prev,
      marketplace: prev.marketplace.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "ACTIVE" ? "RUPTURE" : "ACTIVE" }
          : item,
      ),
    }));
  };

  const deleteItem = (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    setDb((prev) => ({
      ...prev,
      marketplace: prev.marketplace.filter((i) => i.id !== id),
    }));
  };

  const addProduct = (newItem) => {
    setDb((prev) => ({ ...prev, marketplace: [newItem, ...prev.marketplace] }));
  };

  const activeCount = marketplace.filter((i) => i.status === "ACTIVE").length;
  const ruptureCount = marketplace.filter((i) => i.status === "RUPTURE").length;

  return (
    <div className="space-y-6">
      {/* Stats + bouton ajout */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="grid grid-cols-3 gap-3 flex-1 min-w-0">
          {[
            { label: "Actifs", count: activeCount, color: "#10B981" },
            { label: "Rupture", count: ruptureCount, color: "#EF4444" },
            { label: "Total", count: marketplace.length, color: "#D4AF37" },
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

        {/* Bouton ajouter */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <Plus size={15} /> Ajouter produit
        </button>
      </div>

      {/* Filtres avec FloatInput et FloatSelect */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 🔥 Recherche avec FloatInput */}
        <div className="flex-1">
          <FloatInput
            label="Rechercher un produit..."
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        {/* 🔥 Filtre catégorie avec FloatSelect */}
        <div className="w-64">
          <FloatSelect
            label="Catégorie"
            value={catFilter}
            onChange={setCat}
            options={CATEGORY_OPTIONS}
            icon={Tag}
          />
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="text-[11px] text-gray-500 font-bold">
        {filtered.length} produit{filtered.length > 1 ? "s" : ""} trouvé
        {filtered.length > 1 ? "s" : ""}
      </div>

      {/* Table */}
      <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {["Produit", "Catégorie", "Prix", "Statut", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-14 text-center text-gray-600"
                  >
                    <Store size={30} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucun produit trouvé</p>
                    <button
                      onClick={() => setShowModal(true)}
                      className="mt-3 px-4 py-2 rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] font-black text-[10px] uppercase tracking-widest hover:bg-[#D4AF37]/20 transition-colors"
                    >
                      Ajouter le premier produit
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.img}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-white/5 flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-black text-white text-sm truncate max-w-[160px]">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-gray-600 font-mono">
                            {item.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-bold">
                      {item.category}
                    </td>
                    <td className="px-4 py-3 font-black text-white text-sm">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${STATUS_STYLES[item.status] || "text-gray-400 bg-white/5 border-white/10"}`}
                      >
                        {item.status === "ACTIVE" ? "Disponible" : "Rupture"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className={`p-2 rounded-lg transition-all ${item.status === "ACTIVE" ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white" : "bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-black"}`}
                          title={
                            item.status === "ACTIVE"
                              ? "Passer en rupture"
                              : "Remettre disponible"
                          }
                        >
                          {item.status === "ACTIVE" ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={addProduct}
        />
      )}
    </div>
  );
}
