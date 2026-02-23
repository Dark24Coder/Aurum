// src/pages/dashboard/admin/ManageMarket.jsx
// ✅ CRUD complet : Ajouter / Modifier / Supprimer / Toggle statut
// ✅ Upload image local (FileReader → base64) + URL externe
// ✅ ConfirmDialog custom — zero window.confirm
import { useState, useRef } from "react";
import {
  Store,
  Search,
  X,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Image as ImageIcon,
  Pencil,
  Upload,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { formatCurrency, generateId } from "../../../utils/constants";
import { useConfirm } from "../../../components/ui/useConfirm";

const CATEGORIES_LIST = ["ELECTRONIQUE", "MODE", "MAISON", "AUTO"];
const FILTER_CATS = ["TOUT", ...CATEGORIES_LIST];

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

const inputCls =
  "w-full bg-[#0A0A0B] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/50 transition-colors";

// ── Modal ajout / édition produit ─────────────────────────────────────────────
function ProductModal({ initial, onClose, onSave, title }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const [error, setError] = useState("");
  const [imgMode, setImgMode] = useState("url"); // "url" | "upload"
  const [preview, setPreview] = useState(initial?.img || "");
  const fileRef = useRef(null);

  const change = (field, val) => setForm((p) => ({ ...p, [field]: val }));

  // Upload image locale → base64
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return setError("Fichier non valide — images uniquement.");
    if (file.size > 5 * 1024 * 1024)
      return setError("Image trop lourde (max 5 Mo).");
    setError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result;
      setPreview(b64);
      change("img", b64);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (val) => {
    change("img", val);
    setPreview(val);
  };

  const submit = () => {
    if (!form.name.trim()) return setError("Le nom est requis.");
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      return setError("Entrez un prix valide (en FCFA).");
    if (!form.desc.trim()) return setError("La description est requise.");
    setError("");
    onSave({ ...form, price: parseInt(form.price, 10) });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#111112] border border-[#D4AF37]/20 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <h3 className="font-black text-white uppercase tracking-tight text-lg">
            {title}
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
          <div className="aspect-video bg-[#0A0A0B] border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden relative group">
            {preview ? (
              <img
                src={preview}
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

          {/* Toggle mode image */}
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 gap-1">
            {[
              { id: "url", label: "URL externe" },
              { id: "upload", label: "Image locale" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setImgMode(m.id);
                  setError("");
                }}
                className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all ${
                  imgMode === m.id
                    ? "bg-[#D4AF37] text-black"
                    : "text-gray-500 hover:text-white"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Input image selon mode */}
          {imgMode === "url" ? (
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                URL Image{" "}
                <span className="text-gray-700 font-normal normal-case">
                  (optionnel)
                </span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.img.startsWith("data:") ? "" : form.img}
                onChange={(e) => handleUrlChange(e.target.value)}
                className={inputCls}
              />
            </div>
          ) : (
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                Fichier image{" "}
                <span className="text-gray-700 font-normal normal-case">
                  (JPG, PNG, WEBP — max 5 Mo)
                </span>
              </label>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full bg-[#0A0A0B] border border-dashed border-white/20 rounded-xl px-4 py-4 text-sm text-gray-500 hover:text-white hover:border-[#D4AF37]/40 transition-all flex items-center justify-center gap-2"
              >
                <Upload size={16} className="text-[#D4AF37]" />
                <span className="font-bold">Choisir un fichier</span>
                {form.img.startsWith("data:") && (
                  <span className="text-[10px] text-green-400 font-black ml-2">
                    ✓ Image chargée
                  </span>
                )}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </div>
          )}

          {/* Nom */}
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
              Nom du produit *
            </label>
            <input
              type="text"
              placeholder="Ex: AirPods Pro 2"
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Catégorie + Prix */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                Catégorie *
              </label>
              <select
                value={form.category}
                onChange={(e) => change("category", e.target.value)}
                className={inputCls + " cursor-pointer bg-[#0A0A0B]"}
              >
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1.5 block">
                Prix (FCFA) *
              </label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 35000"
                value={form.price}
                onChange={(e) => change("price", e.target.value)}
                className={inputCls}
              />
            </div>
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

          {/* Statut */}
          <div>
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-2 block">
              Statut
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
            {title}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PAGE PRINCIPALE ───────────────────────────────────────────────────────────
export default function ManageMarket() {
  const { db, setDb } = useAuth();
  const { confirm, ConfirmDialog } = useConfirm();
  const [search, setSearch] = useState("");
  const [catFilter, setCat] = useState("TOUT");
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null); // item en cours d'édition

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

  const deleteItem = async (id, name) => {
    const ok = await confirm({
      title: "Supprimer le produit",
      message: `Êtes-vous sûr de vouloir supprimer "${name}" ? Cette action est irréversible.`,
      confirmLabel: "Supprimer",
      variant: "danger",
    });
    if (!ok) return;
    setDb((prev) => ({
      ...prev,
      marketplace: prev.marketplace.filter((i) => i.id !== id),
    }));
  };

  const addProduct = (data) => {
    setDb((prev) => ({
      ...prev,
      marketplace: [
        { ...data, id: generateId("MK"), sellerId: "ADMIN-01" },
        ...prev.marketplace,
      ],
    }));
  };

  const updateProduct = (data) => {
    setDb((prev) => ({
      ...prev,
      marketplace: prev.marketplace.map((i) =>
        i.id === editItem.id ? { ...i, ...data } : i,
      ),
    }));
    setEditItem(null);
  };

  const activeCount = marketplace.filter((i) => i.status === "ACTIVE").length;
  const ruptureCount = marketplace.filter((i) => i.status === "RUPTURE").length;

  return (
    <main className="space-y-6">
      {ConfirmDialog}

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

        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-black font-black uppercase text-[11px] tracking-widest rounded-xl hover:opacity-90 transition-opacity flex-shrink-0"
        >
          <Plus size={15} /> Ajouter produit
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Rechercher un produit…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111112] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
          {FILTER_CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCat(cat)}
              className={`px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                catFilter === cat
                  ? "bg-[#D4AF37] text-black"
                  : "bg-[#111112] border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {cat === "TOUT" ? "Tout" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[680px]">
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
                      onClick={() => setShowAdd(true)}
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
                        {/* Modifier */}
                        <button
                          onClick={() => setEditItem(item)}
                          className="p-2 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all"
                          title="Modifier"
                        >
                          <Pencil size={14} />
                        </button>
                        {/* Toggle statut */}
                        <button
                          onClick={() => toggleStatus(item.id)}
                          className={`p-2 rounded-lg transition-all ${
                            item.status === "ACTIVE"
                              ? "bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white"
                              : "bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-black"
                          }`}
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
                        {/* Supprimer */}
                        <button
                          onClick={() => deleteItem(item.id, item.name)}
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

      {/* Modal ajout */}
      {showAdd && (
        <ProductModal
          title="Ajouter un produit"
          onClose={() => setShowAdd(false)}
          onSave={addProduct}
        />
      )}

      {/* Modal édition */}
      {editItem && (
        <ProductModal
          title="Modifier le produit"
          initial={{ ...editItem, price: String(editItem.price) }}
          onClose={() => setEditItem(null)}
          onSave={updateProduct}
        />
      )}
    </main>
  );
}
