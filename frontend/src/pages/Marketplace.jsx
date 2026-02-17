import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  ArrowRight,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Lock,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import FloatInput from "../components/ui/FloatInput";
import FloatSelect from "../components/ui/FloatSelect";

const Marketplace = ({ currentUser }) => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState("grid");
  const [activeMode, setActiveMode] = useState("acheter");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortValue, setSortValue] = useState("new");

  // ÉTAT POUR L'ALERTE PERSONNALISÉE
  const [alert, setAlert] = useState({ show: false, message: "" });

  const products = [
    {
      id: 1,
      name: "Rolex Submariner Gold",
      price: "8.500.000",
      oldPrice: "9.200.000",
      description:
        "Montre de luxe iconique en or jaune 18 ct avec lunette Cerachrom noire.",
      img: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=600",
      cat: "Luxe",
      badge: "Rare",
      isAvailable: true,
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: "950.000",
      oldPrice: null,
      description:
        "Le summum de la technologie Apple avec châssis en titane et puce A17 Pro.",
      img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=600",
      cat: "Tech",
      badge: "New",
      isAvailable: false,
    },
    {
      id: 3,
      name: "Sac Hermès Birkin",
      price: "12.000.000",
      oldPrice: null,
      description:
        "Cuir Togo authentique, finitions palladium. Pièce de collection exclusive.",
      img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600",
      cat: "Luxe",
      badge: "Prestige",
      isAvailable: true,
    },
    {
      id: 4,
      name: "MacBook Pro M3 Max",
      price: "2.450.000",
      oldPrice: "2.600.000",
      description:
        "Station de travail ultime pour créatifs avec 128Go de mémoire unifiée.",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600",
      cat: "Tech",
      badge: "Premium",
      isAvailable: true,
    },
    {
      id: 5,
      name: "Jordan 1 Retro High",
      price: "185.000",
      oldPrice: "210.000",
      description:
        "Édition limitée Chicago Lost & Found. Cuir premium vieilli.",
      img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600",
      cat: "Mode",
      badge: "Limited",
      isAvailable: true,
    },
    {
      id: 6,
      name: "Parfum Dior Sauvage",
      price: "85.000",
      oldPrice: null,
      description: "Eau de parfum intense. Notes de bergamote et bois ambrés.",
      img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
      cat: "Beauté",
      badge: "Top Sale",
      isAvailable: true,
    },
  ];

  const categories = ["Tous", "Luxe", "Tech", "Mode", "Beauté", "Auto"];
  const sortOptions = [
    { value: "new", label: "Nouveautés" },
    { value: "asc", label: "Prix croissant" },
    { value: "desc", label: "Prix décroissant" },
  ];

  // ACTION DE COMMANDE SÉCURISÉE
  const handleBuyAction = () => {
    if (!currentUser) {
      setAlert({
        show: true,
        message: "Accès refusé : Veuillez vous connecter pour passer commande.",
      });
      setTimeout(() => setAlert({ show: false, message: "" }), 4000);
      // Optionnel : on peut rediriger après un petit délai
    } else {
      navigate("/dashboard/orders");
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-32 pb-20 px-4">
      {/* --- NOTIFICATION PERSONNALISÉE (Toast) --- */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[200] transition-all duration-500 transform ${alert.show ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-[#161617] border border-[#D4AF37]/50 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_20px_rgba(212,175,55,0.1)] flex items-center gap-4">
          <div className="bg-[#D4AF37] p-1.5 rounded-lg">
            <Lock size={16} className="text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-[11px] font-black uppercase tracking-widest">
              Sécurité Aurum
            </span>
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">
              {alert.message}
            </span>
          </div>
          <button
            onClick={() => setAlert({ show: false, message: "" })}
            className="ml-4 text-gray-600 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col items-center mb-12 space-y-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic text-center">
            Aurum <span className="text-[#D4AF37]">Market</span>
          </h1>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit backdrop-blur-md">
            <button
              onClick={() => setActiveMode("acheter")}
              className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeMode === "acheter" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" : "text-gray-500 hover:text-white"}`}
            >
              Acheter
            </button>
            <button
              onClick={() => setActiveMode("vendre")}
              className={`px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeMode === "vendre" ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20" : "text-gray-500 hover:text-white"}`}
            >
              Vendre
            </button>
          </div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] text-center">
            Produits vérifiés, disponibles immédiatement.{" "}
            <span className="text-[#D4AF37]">Commission 1% transparente.</span>
          </p>
        </div>

        {activeMode === "vendre" ? (
          <div className="flex flex-col items-center justify-center py-24 animate-fade-in-up">
            <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] mb-6 border border-[#D4AF37]/20 shadow-[0_0_50px_rgba(212,175,55,0.1)]">
              <Lock size={40} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase italic mb-4">
              Espace Vendeur Protégé
            </h2>
            <p className="text-gray-500 text-sm max-w-md text-center mb-8 uppercase tracking-widest leading-loose font-medium">
              Connectez-vous pour pouvoir opérer des opérations dans ce volet.
            </p>
            <Button variant="gold" onClick={() => navigate("/login")}>
              Se connecter
            </Button>
          </div>
        ) : (
          <>
            {/* HERO SLIDER */}
            <div className="relative w-full h-[300px] md:h-[450px] rounded-[3rem] overflow-hidden mb-12 border border-white/5">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1500"
                className="w-full h-full object-cover opacity-40 hover:scale-105 transition-transform duration-[2000ms]"
                alt="Banner"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-12 md:px-24">
                <span className="text-[#D4AF37] font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                  Collection Hiver 2026
                </span>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic leading-[0.9]">
                  L'Excellence <br />{" "}
                  <span className="text-[#D4AF37]">Sans Compromis</span>
                </h2>
                <button className="mt-10 bg-[#D4AF37] text-black font-black uppercase text-[10px] tracking-widest px-10 py-5 rounded-xl w-fit hover:scale-110 transition-all duration-500 shadow-xl shadow-[#D4AF37]/20">
                  Découvrir
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* SIDEBAR FILTRES */}
              <aside className="w-full lg:w-72 space-y-8">
                <div className="bg-[#161617] border border-white/5 rounded-[2.5rem] p-8 sticky top-32 transition-all">
                  <div className="flex items-center gap-2 mb-8 text-[#D4AF37] font-black uppercase text-[10px] tracking-widest">
                    <SlidersHorizontal size={16} /> Filtres
                  </div>

                  <div className="space-y-4">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest mb-6">
                      Rayons
                    </p>
                    {categories.map((cat) => (
                      <label
                        key={cat}
                        className="flex items-center justify-between group cursor-pointer py-1"
                      >
                        <span
                          className={`text-[11px] font-bold transition-all duration-300 ${category === cat ? "text-[#D4AF37] translate-x-1" : "text-gray-500 group-hover:text-white uppercase"}`}
                        >
                          {cat}
                        </span>
                        <input
                          type="radio"
                          name="cat"
                          className="hidden"
                          checked={category === cat}
                          onChange={() => setCategory(cat)}
                        />
                        <div
                          className={`w-1.5 h-1.5 rounded-full transition-all ${category === cat ? "bg-[#D4AF37] scale-150" : "bg-white/10"}`}
                        ></div>
                      </label>
                    ))}
                  </div>

                  <div className="h-[1px] bg-white/5 my-8"></div>

                  {/* BUDGET */}
                  <div>
                    <p className="text-white text-[10px] font-black uppercase tracking-widest mb-6">
                      Budget (FCFA)
                    </p>
                    <input
                      type="range"
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      min="0"
                      max="10000000"
                    />
                    <div className="flex justify-between mt-4 text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                      <span>0 F</span>
                      <span>10M+ F</span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* ZONE PRODUITS */}
              <main className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-[#161617]/50 p-6 rounded-[2rem] border border-white/5">
                  <div className="w-full md:w-80">
                    <FloatInput
                      label="Rechercher un article..."
                      icon={Search}
                    />
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-56">
                      <FloatSelect
                        label="Trier par"
                        value={sortValue}
                        options={sortOptions}
                        onChange={(val) => setSortValue(val)}
                        icon={Sliders}
                      />
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg transition-all duration-500 ${viewMode === "grid" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-500"}`}
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg transition-all duration-500 ${viewMode === "list" ? "bg-[#D4AF37] text-black shadow-lg" : "text-gray-500"}`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`grid transition-all duration-700 ease-in-out gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
                >
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`group bg-[#161617] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-500 ${viewMode === "list" ? "flex items-center h-64" : "flex flex-col h-full"}`}
                    >
                      <div
                        className={`relative overflow-hidden bg-black transition-all duration-700 ${viewMode === "list" ? "w-80 h-full" : "aspect-square w-full"}`}
                      >
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1000ms]"
                        />
                        <div
                          className={`absolute top-6 left-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase backdrop-blur-md border ${product.isAvailable ? "bg-green-500/10 border-green-500 text-green-500" : "bg-red-500/10 border-red-500 text-red-500"}`}
                        >
                          {product.isAvailable ? (
                            <CheckCircle2 size={10} />
                          ) : (
                            <AlertCircle size={10} />
                          )}{" "}
                          {product.isAvailable ? "Disponible" : "Épuisé"}
                        </div>
                      </div>

                      <div className="p-8 flex flex-col flex-1 min-h-[190px]">
                        <div className="flex-1">
                          <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                            {product.cat}
                          </p>
                          <h3 className="text-white font-bold text-lg mb-3 uppercase truncate transition-colors group-hover:text-[#D4AF37]">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-loose line-clamp-2 transition-opacity duration-500 group-hover:opacity-80">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex items-end justify-between mt-6">
                          <div className="flex flex-col">
                            {product.oldPrice && (
                              <span className="text-gray-600 text-[10px] line-through mb-1 font-bold uppercase tracking-tighter">
                                {product.oldPrice} F
                              </span>
                            )}
                            <span className="text-2xl font-black text-white italic tracking-tighter">
                              {product.price}{" "}
                              <small className="text-[10px] not-italic text-[#D4AF37]">
                                CFA
                              </small>
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setShowDetailModal(true);
                            }}
                            className="bg-white/5 border border-white/10 text-white p-3.5 rounded-2xl hover:bg-[#D4AF37] hover:text-black transition-all duration-500 transform hover:rotate-[360deg] shadow-lg"
                          >
                            <Eye size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* BANNIÈRE SOURCING */}
                <div className="mt-20 bg-gradient-to-br from-[#D4AF37]/10 via-[#161617] to-transparent border border-white/5 rounded-[3.5rem] p-12 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="max-w-xl">
                    <h2 className="text-3xl font-black text-white uppercase italic leading-tight">
                      S'il n'est pas ici, <br />
                      nous le <span className="text-[#D4AF37]">trouverons</span>
                      .
                    </h2>
                    <p className="text-gray-500 text-xs mt-4 uppercase tracking-[0.2em] leading-relaxed font-medium">
                      Faites une demande de sourcing si vous ne trouvez pas
                      l'article de vos rêves dans notre catalogue.
                    </p>
                  </div>
                  <Button
                    variant="gold"
                    onClick={() => navigate("/sourcing")}
                    className="px-12 py-6"
                  >
                    Faire un Sourcing <ArrowRight size={18} className="ml-3" />
                  </Button>
                </div>
              </main>
            </div>
          </>
        )}

        {/* MODAL DÉTAILS */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 animate-in fade-in duration-500">
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setShowDetailModal(false)}
            ></div>
            <div className="bg-[#161617] border border-white/10 w-full max-w-5xl rounded-[4rem] overflow-hidden relative z-10 flex flex-col md:flex-row animate-in zoom-in-95 duration-500">
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-10 right-10 text-gray-500 hover:text-white transition-all hover:rotate-90 z-20"
              >
                <X size={28} />
              </button>
              <div className="w-full md:w-1/2 h-96 md:h-auto bg-black">
                <img
                  src={selectedProduct.img}
                  className="w-full h-full object-cover opacity-90"
                  alt={selectedProduct.name}
                />
              </div>
              <div className="p-12 md:p-16 flex-1 flex flex-col justify-center">
                <p className="text-[#D4AF37] text-xs font-black uppercase tracking-widest mb-3">
                  {selectedProduct.cat}
                </p>
                <h2 className="text-4xl font-black text-white uppercase italic mb-8 leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-400 text-xs uppercase leading-loose tracking-[0.15em] mb-12">
                  {selectedProduct.description}
                </p>
                <div className="flex items-center justify-between mb-12 bg-white/5 p-8 rounded-3xl border border-white/5">
                  <span className="text-4xl font-black text-white italic tracking-tighter">
                    {selectedProduct.price}{" "}
                    <small className="text-xs text-[#D4AF37]">CFA</small>
                  </span>
                  <span
                    className={`font-black text-[10px] uppercase tracking-widest px-4 py-2 rounded-full border ${selectedProduct.isAvailable ? "border-green-500/30 text-green-500 bg-green-500/5" : "border-red-500/30 text-red-500 bg-red-500/5"}`}
                  >
                    {selectedProduct.isAvailable
                      ? "Stock Disponible"
                      : "Stock Épuisé"}
                  </span>
                </div>
                <Button
                  variant="gold"
                  size="full"
                  className="py-7 text-xs"
                  disabled={!selectedProduct.isAvailable}
                  onClick={handleBuyAction}
                >
                  <ShoppingCart size={20} className="mr-3" /> Confirmer l'achat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
