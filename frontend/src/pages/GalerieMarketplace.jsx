// src/pages/GalerieMarketplace.jsx
// ✅ Page galerie dédiée — accessible via /galerie
// handleMarketplaceBuy et registerStockAlert fournis par AuthProvider
// MARKETPLACE_CATEGORIES fourni par AuthProvider
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  BellRing,
  Search,
  CheckCircle,
  X,
  Tag,
  Store,
  Package,
  ChevronRight,
  Sparkles,
  Info,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/useAuth";

const COMMISSION_RATE = 0.01;
const formatCurrency = (n) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    n,
  );

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const styles = {
    success: "bg-green-500/20 border-green-500/40 text-green-300",
    error: "bg-red-500/20   border-red-500/40   text-red-300",
    info: "bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]",
  };
  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl ${styles[toast.type || "info"]}`}
      style={{
        animation: "toastIn .3s cubic-bezier(.34,1.4,.64,1) forwards",
        minWidth: "280px",
        maxWidth: "90vw",
      }}
    >
      <style>{`@keyframes toastIn{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
      {toast.type === "success" && (
        <CheckCircle size={16} className="flex-shrink-0" />
      )}
      {toast.type === "error" && <X size={16} className="flex-shrink-0" />}
      {toast.type === "info" && <Info size={16} className="flex-shrink-0" />}
      <span className="text-sm font-bold flex-1">{toast.message}</span>
      {toast.link && (
        <Link
          to={toast.link.to}
          className="text-[10px] font-black uppercase tracking-widest underline opacity-80 hover:opacity-100 flex-shrink-0"
        >
          {toast.link.label}
        </Link>
      )}
      <button
        onClick={onClose}
        className="opacity-50 hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ── StatusBadge ───────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === "ACTIVE")
    return (
      <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
        Disponible
      </span>
    );
  return (
    <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">
      Rupture
    </span>
  );
}

// ── Champ code promo ──────────────────────────────────────────────────────────
function PromoInput({ price, onDiscount }) {
  const { validatePromoCode, applyPromoCode } = useAuth();
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const apply = () => {
    if (!code.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const res = validatePromoCode(code, price);
      setResult(res);
      if (res.valid) {
        onDiscount(
          res.discount,
          res.promo
            ? { ...res.promo, markUsed: () => applyPromoCode(res.promo.id) }
            : null,
        );
      } else {
        onDiscount(0, null);
      }
      setLoading(false);
    }, 400);
  };

  const clear = () => {
    setCode("");
    setResult(null);
    onDiscount(0, null);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={12}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Code promo (ex: AURUM20)"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setResult(null);
              onDiscount(0, null);
            }}
            className="w-full bg-[#0A0A0B] border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/40 transition-colors font-mono"
          />
          {code && (
            <button
              onClick={clear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </div>
        <button
          onClick={apply}
          disabled={!code.trim() || loading}
          className="px-3 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] font-black text-[10px] uppercase tracking-wide hover:bg-[#D4AF37]/20 transition-colors disabled:opacity-40 whitespace-nowrap"
        >
          {loading ? "…" : "Appliquer"}
        </button>
      </div>
      {result && (
        <p
          className={`text-[10px] font-bold flex items-center gap-1.5 ${result.valid ? "text-green-400" : "text-red-400"}`}
        >
          {result.valid ? (
            <>
              <CheckCircle size={11} /> -{formatCurrency(result.discount)} de
              réduction appliquée !
            </>
          ) : (
            <>
              <X size={11} /> {result.message}
            </>
          )}
        </p>
      )}
    </div>
  );
}

// ── ProductCard ───────────────────────────────────────────────────────────────
function ProductCard({ item, onBuy, onAlert, alertedItems }) {
  const isActive = item.status === "ACTIVE";
  const isAlerted = alertedItems.has(item.id);
  const [discount, setDiscount] = useState(0);
  const [promo, setPromo] = useState(null);

  const finalPrice = Math.max(0, item.price - discount);

  return (
    <div className="group relative bg-[#111112] border border-white/5 rounded-[1.75rem] overflow-hidden flex flex-col transition-all duration-500 hover:border-[#D4AF37]/25 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-[#0A0A0B]">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111112]/80 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <StatusBadge status={item.status} />
        </div>
        <div className="absolute top-3 right-3">
          <span className="bg-black/60 backdrop-blur-md text-white/60 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border border-white/10">
            {item.category}
          </span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-white font-black text-base uppercase tracking-tight mb-1 leading-tight line-clamp-2">
          {item.name}
        </h3>
        <p className="text-gray-500 text-[11px] leading-relaxed mb-4 line-clamp-2">
          {item.desc}
        </p>

        <div className="mt-auto space-y-3">
          {isActive ? (
            <>
              {/* Code promo */}
              <PromoInput
                price={item.price}
                onDiscount={(d, p) => {
                  setDiscount(d);
                  setPromo(p);
                }}
              />

              {/* Prix */}
              <div className="flex items-end justify-between border-t border-white/5 pt-3">
                <div>
                  <div className="text-[9px] text-gray-600 font-bold uppercase mb-0.5">
                    Prix vendeur
                  </div>
                  <div
                    className={`text-xl font-black ${discount > 0 ? "line-through text-gray-600 text-base" : "text-white"}`}
                  >
                    {formatCurrency(item.price)}
                  </div>
                  {discount > 0 && (
                    <div className="text-xl font-black text-green-400">
                      {formatCurrency(finalPrice)}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-gray-600 font-bold uppercase mb-0.5">
                    Commission BJ (1%)
                  </div>
                  <div className="text-[11px] font-bold text-[#D4AF37]">
                    +{formatCurrency(finalPrice * COMMISSION_RATE)}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl px-3 py-2 flex justify-between items-center">
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">
                  Total à payer
                </span>
                <span className="text-sm font-black text-white">
                  {formatCurrency(finalPrice * (1 + COMMISSION_RATE))}
                </span>
              </div>

              <button
                onClick={() => onBuy(item, finalPrice, promo)}
                className="w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] active:scale-[0.98]"
                style={{ background: "#D4AF37", color: "#0A0A0B" }}
              >
                <ShoppingCart size={14} /> Acheter maintenant
              </button>
            </>
          ) : (
            <>
              <div className="border-t border-white/5 pt-3">
                <div className="text-[9px] text-gray-600 font-bold uppercase mb-0.5">
                  Prix
                </div>
                <div className="text-xl font-black text-gray-600 line-through">
                  {formatCurrency(item.price)}
                </div>
              </div>
              <button
                onClick={() => onAlert(item)}
                disabled={isAlerted}
                className={`w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all duration-300 border ${
                  isAlerted
                    ? "bg-green-500/10 border-green-500/30 text-green-400 cursor-default"
                    : "bg-transparent border-white/20 text-gray-400 hover:border-[#D4AF37]/50 hover:text-[#D4AF37] active:scale-[0.98]"
                }`}
              >
                {isAlerted ? (
                  <>
                    <CheckCircle size={14} /> Alerte enregistrée
                  </>
                ) : (
                  <>
                    <BellRing size={14} /> M'alerter du retour en stock
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── PAGE PRINCIPALE ────────────────────────────────────────────────────────────
export default function GalerieMarketplace() {
  const {
    isAuthenticated,
    db,
    handleMarketplaceBuy,
    registerStockAlert,
    MARKETPLACE_CATEGORIES,
  } = useAuth();
  const [activeCategory, setActiveCategory] = useState("TOUT");
  const [searchQuery, setSearchQuery] = useState("");
  const [alertedItems, setAlertedItems] = useState(new Set());
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info", link = null) => {
    setToast({ message, type, link });
    setTimeout(() => setToast(null), 4000);
  };

  const filteredItems = (db.marketplace || []).filter((item) => {
    const catMatch =
      activeCategory === "TOUT" || item.category === activeCategory;
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return catMatch && nameMatch;
  });

  const activeItems = filteredItems.filter((i) => i.status === "ACTIVE");
  const rupturItems = filteredItems.filter((i) => i.status === "RUPTURE");

  const handleBuy = (item, finalPrice, promo) => {
    if (!isAuthenticated) {
      showToast("Vous devez être connecté pour acheter.", "error", {
        to: "/login",
        label: "Se connecter →",
      });
      return;
    }
    const result = handleMarketplaceBuy({ ...item, price: finalPrice });
    if (result.needsLogin) {
      showToast("Connexion requise.", "error", {
        to: "/login",
        label: "Se connecter →",
      });
      return;
    }
    if (result.needsKyc) {
      showToast("KYC requis avant d'acheter.", "error", {
        to: "/dashboard/user",
        label: "Vérifier →",
      });
      return;
    }
    if (promo) promo.markUsed?.();
    showToast(
      `Commande pour "${item.name}" créée !${promo ? ` (Code ${promo.code} appliqué)` : ""}`,
      "success",
    );
  };

  const handleAlert = (item) => {
    if (!isAuthenticated) {
      showToast("Connectez-vous pour être alerté.", "error", {
        to: "/login",
        label: "Se connecter →",
      });
      return;
    }
    const result = registerStockAlert(item.id);
    if (result.success) {
      setAlertedItems((prev) => new Set([...prev, item.id]));
      showToast(`Alerte enregistrée pour "${item.name}" !`, "success");
    }
  };

  const categories = MARKETPLACE_CATEGORIES || [
    { id: "TOUT", label: "Tout", icon: "📦" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] pb-24">
      {/* En-tête */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% -10%,rgba(212,175,55,0.12) 0%,transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-10">
          <div className="flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-6">
            <Link
              to="/marketplace"
              className="hover:text-[#D4AF37] transition-colors"
            >
              Marketplace
            </Link>
            <ChevronRight size={10} />
            <span className="text-[#D4AF37]">Galerie Produits</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-[#D4AF37]" />
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">
                  Produits vérifiés
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter">
                Galerie <span className="text-[#D4AF37]">Marketplace</span>
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                {activeItems.length} produit{activeItems.length > 1 ? "s" : ""}{" "}
                disponible{activeItems.length > 1 ? "s" : ""} · Commission
                transparente 1%
              </p>
            </div>
            <Link
              to="/marketplace"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/20 transition-all flex-shrink-0"
            >
              <Store size={13} /> Accéder à la Marketplace
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* Recherche */}
        <div className="relative mb-6">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Rechercher un produit…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111112] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 outline-none focus:border-[#D4AF37]/40 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filtres catégorie */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
          <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat.id
                  ? "bg-[#D4AF37] text-black shadow-[0_0_14px_rgba(212,175,55,0.3)]"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-white/20"
              }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>

        {/* Grille disponibles */}
        {activeItems.length > 0 && (
          <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                onBuy={handleBuy}
                onAlert={handleAlert}
                alertedItems={alertedItems}
              />
            ))}
          </div>
        )}

        {/* Section ruptures */}
        {rupturItems.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <BellRing size={11} /> Rupture de stock — Alertes disponibles
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-75">
              {rupturItems.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onBuy={handleBuy}
                  onAlert={handleAlert}
                  alertedItems={alertedItems}
                />
              ))}
            </div>
          </div>
        )}

        {/* Aucun résultat */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <Package size={40} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-white font-black text-lg uppercase mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? `Aucun résultat pour "${searchQuery}"`
                : "Aucun produit dans cette catégorie."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-[#D4AF37] text-sm font-bold hover:underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}

        {/* CTA connecté */}
        {isAuthenticated && (
          <div className="mt-8 p-6 sm:p-8 rounded-[2rem] bg-[#D4AF37]/5 border border-[#D4AF37]/15 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div>
              <h3 className="text-white font-black text-lg uppercase tracking-tight mb-1">
                Vous avez des produits à vendre ?
              </h3>
              <p className="text-gray-500 text-sm">
                Publiez vos annonces sur la Marketplace BJ Business. Commission
                1% seulement.
              </p>
            </div>
            <Link
              to="/marketplace"
              className="flex-shrink-0 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest bg-[#D4AF37] text-black hover:opacity-90"
            >
              Publier un produit
            </Link>
          </div>
        )}

        {/* CTA non connecté */}
        {!isAuthenticated && (
          <div className="mt-8 p-6 sm:p-8 rounded-[2rem] bg-white/3 border border-white/10 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                <Lock size={20} className="text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-white font-black text-base uppercase tracking-tight mb-0.5">
                  Connectez-vous pour acheter
                </h3>
                <p className="text-gray-500 text-sm">
                  Créez un compte gratuit ou connectez-vous pour passer
                  commande.
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest bg-[#D4AF37] text-black hover:opacity-90"
              >
                Se connecter
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest border border-white/20 text-white hover:bg-white/5"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
