import React, { useState, useEffect, useRef } from "react";
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
  Bell,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import FloatInput from "../components/ui/FloatInput";
import FloatSelect from "../components/ui/FloatSelect";

const Marketplace = ({ currentUser }) => {
  const navigate = useNavigate();
  const discoveryRef = useRef(null);

  // --- ÉTATS ---
  const [category, setCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState("grid");
  const [activeMode, setActiveMode] = useState("acheter");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sortValue, setSortValue] = useState("new");
  const [priceRange, setPriceRange] = useState(200000000); // Max par défaut
  const [alert, setAlert] = useState({ show: false, message: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Simulation du chargement
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [category, sortValue]);

  // --- DONNÉES ---
  const products = [
    {
      id: 1,
      name: "Rolex Submariner Gold",
      price: 8500000,
      priceDisplay: "8.500.000",
      description:
        "Montre de luxe iconique en or jaune 18 ct avec lunette Cerachrom noire.",
      img: "https://images.unsplash.com/photo-1547996160-81dfa63595dd?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=600",
      cat: "Luxe",
      badge: "Rare",
      isAvailable: true,
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max",
      price: 950000,
      priceDisplay: "950.000",
      description:
        "Le summum de la technologie Apple avec châssis en titane et puce A17 Pro.",
      img: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1696423602354-9333333792f4?q=80&w=600",
      cat: "Tech",
      badge: "New",
      isAvailable: false,
    },
    {
      id: 3,
      name: "Sac Hermès Birkin",
      price: 12000000,
      priceDisplay: "12.000.000",
      description:
        "Cuir Togo authentique, finitions palladium. Pièce de collection exclusive.",
      img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1594931936715-381ac207799c?q=80&w=600",
      cat: "Luxe",
      badge: "Prestige",
      isAvailable: true,
    },
    {
      id: 4,
      name: "MacBook Pro M3 Max",
      price: 2450000,
      priceDisplay: "2.450.000",
      description:
        "Station de travail ultime pour créatifs avec 128Go de mémoire unifiée.",
      img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=600",
      cat: "Tech",
      badge: "Premium",
      isAvailable: true,
    },
    {
      id: 5,
      name: "Jordan 1 Retro High",
      price: 185000,
      priceDisplay: "185.000",
      description:
        "Édition limitée Chicago Lost & Found. Cuir premium vieilli.",
      img: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=600",
      cat: "Mode",
      badge: "Limited",
      isAvailable: true,
    },
    {
      id: 6,
      name: "Parfum Dior Sauvage",
      price: 85000,
      priceDisplay: "85.000",
      description: "Eau de parfum intense. Notes de bergamote et bois ambrés.",
      img: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=600",
      cat: "Beauté",
      badge: "Top Sale",
      isAvailable: true,
    },
    {
      id: 7,
      name: "Porsche 911 GT3",
      price: 145000000,
      priceDisplay: "145.000.000",
      description:
        "Performance pure. Moteur atmosphérique de 4.0 litres. Couleur Shark Blue.",
      img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=600",
      cat: "Auto",
      badge: "Elite",
      isAvailable: true,
    },
    {
      id: 8,
      name: "Vision Pro Apple",
      price: 2800000,
      priceDisplay: "2.800.000",
      description:
        "L'ère de l'informatique spatiale commence ici. Expérience immersive totale.",
      img: "https://images.unsplash.com/photo-1699912052445-56557816be3b?q=80&w=600",
      imgHover:
        "https://images.unsplash.com/photo-1701314324546-5e04e902b9e1?q=80&w=600",
      cat: "Tech",
      badge: "Futur",
      isAvailable: true,
    },
  ];

  const categories = ["Tous", "Luxe", "Tech", "Mode", "Beauté", "Auto"];

  // --- LOGIQUE FILTRE & TRI ---
  const filteredProducts = products
    .filter((p) => (category === "Tous" ? true : p.cat === category))
    .filter((p) => p.price <= priceRange)
    .sort((a, b) => {
      if (sortValue === "asc") return a.price - b.price;
      if (sortValue === "desc") return b.price - a.price;
      return 0;
    });

  // --- ACTIONS ---
  const openDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  const handleAction = () => {
    if (!selectedProduct.isAvailable) {
      setAlert({
        show: true,
        message: "Alerte de retour en stock enregistrée !",
      });
      setTimeout(() => setAlert({ show: false, message: "" }), 3000);
      setShowDetailModal(false);
      return;
    }

    if (!currentUser) {
      setAlert({ show: true, message: "Connexion requise pour l'achat..." });
      setTimeout(() => navigate("/login"), 2000);
    } else {
      navigate("/dashboard/orders");
    }
  };

  const scrollToDiscovery = () => {
    discoveryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] pt-32 pb-20 px-4 text-white">
      {/* TOAST SÉCURITÉ */}
      <div
        className={`fixed top-10 left-1/2 -translate-x-1/2 z-[500] transition-all duration-500 ${alert.show ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-[#161617] border border-[#D4AF37]/50 backdrop-blur-xl px-8 py-4 rounded-2xl flex items-center gap-4 shadow-2xl">
          <div className="bg-[#D4AF37] p-1.5 rounded-lg">
            <Lock size={16} className="text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-white text-[10px] font-black uppercase tracking-widest">
              Aurum Protocol
            </span>
            <span className="text-gray-400 text-[10px] uppercase">
              {alert.message}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-16 space-y-8">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic text-center">
            Aurum <span className="text-[#D4AF37]">Market</span>
          </h1>
          <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
            {["acheter", "vendre"].map((mode) => (
              <button
                key={mode}
                onClick={() => setActiveMode(mode)}
                className={`px-12 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 ${activeMode === mode ? "bg-[#D4AF37] text-black" : "text-gray-500 hover:text-white"}`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {activeMode === "vendre" ? (
          <div className="flex flex-col items-center justify-center py-24 animate-in fade-in slide-in-from-bottom-4">
            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] mb-6 border border-[#D4AF37]/20">
              <Lock size={32} />
            </div>
            <h2 className="text-2xl font-black uppercase italic mb-4">
              Accès Vendeur Restreint
            </h2>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] mb-8">
              Authentification requise pour lister des produits.
            </p>
            <Button variant="gold" onClick={() => navigate("/login")}>
              Se Connecter
            </Button>
          </div>
        ) : (
          <>
            {/* HERO */}
            <div className="relative w-full h-[500px] rounded-[3.5rem] overflow-hidden mb-16 border border-white/5 group">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1500"
                className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-[5000ms]"
                alt="Hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-16">
                <span className="text-[#D4AF37] font-black uppercase tracking-[0.4em] text-[10px] mb-4">
                  Curated Excellence 2026
                </span>
                <h2 className="text-5xl md:text-7xl font-black uppercase italic leading-[0.85] mb-8">
                  L'Art de <br />{" "}
                  <span className="text-[#D4AF37]">Posséder</span>
                </h2>
                <button
                  onClick={scrollToDiscovery}
                  className="bg-white text-black font-black uppercase text-[10px] tracking-widest px-12 py-5 rounded-full w-fit hover:bg-[#D4AF37] transition-all shadow-2xl"
                >
                  Découvrir la Galerie
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* SIDEBAR AVEC FILTRE PRIX */}
              <aside className="w-full lg:w-72 space-y-10">
                <div className="bg-[#161617] border border-white/5 rounded-[2.5rem] p-8 sticky top-32">
                  <div className="flex items-center gap-2 mb-10 text-[#D4AF37] font-black uppercase text-[10px] tracking-widest">
                    <SlidersHorizontal size={16} /> Configuration
                  </div>

                  <div className="space-y-8">
                    <div>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest mb-6">
                        Rayons
                      </p>
                      <div className="space-y-3">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`w-full flex justify-between items-center text-[11px] font-bold uppercase transition-all ${category === cat ? "text-[#D4AF37]" : "text-gray-500 hover:text-white"}`}
                          >
                            {cat}
                            <div
                              className={`w-1 h-1 rounded-full ${category === cat ? "bg-[#D4AF37] scale-[2]" : "bg-white/10"}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-white text-[10px] font-black uppercase tracking-widest mb-6">
                        Budget Max (CFA)
                      </p>
                      <input
                        type="range"
                        min="50000"
                        max="150000000"
                        step="500000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full accent-[#D4AF37] bg-white/10 h-1 rounded-full appearance-none"
                      />
                      <div className="flex justify-between mt-4 text-[10px] font-black text-[#D4AF37]">
                        <span>0</span>
                        <span>{priceRange.toLocaleString()} F</span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* MAIN MARKET */}
              <main className="flex-1">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-[#161617]/50 p-6 rounded-[2.5rem] border border-white/5">
                  <div className="w-full md:w-80">
                    <FloatInput label="Rechercher une pièce..." icon={Search} />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-48">
                      <FloatSelect
                        label="Trier"
                        value={sortValue}
                        options={[
                          { value: "new", label: "Nouveautés" },
                          { value: "asc", label: "Prix croissant" },
                          { value: "desc", label: "Prix décroissant" },
                        ]}
                        onChange={setSortValue}
                        icon={Sliders}
                      />
                    </div>
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2.5 rounded-lg ${viewMode === "grid" ? "bg-[#D4AF37] text-black" : "text-gray-400"}`}
                      >
                        <LayoutGrid size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2.5 rounded-lg ${viewMode === "list" ? "bg-[#D4AF37] text-black" : "text-gray-400"}`}
                      >
                        <List size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* GRILLE PRINCIPALE */}
                <div
                  className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
                >
                  {isLoading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="bg-[#161617] h-96 rounded-[2.5rem] animate-pulse"
                          />
                        ))
                    : filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="group bg-[#161617] border border-white/5 rounded-[3rem] overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col"
                        >
                          <div className="relative aspect-square overflow-hidden bg-black">
                            <img
                              src={product.img}
                              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-0 transition-all duration-700"
                              alt={product.name}
                            />
                            <img
                              src={product.imgHover}
                              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 scale-110 group-hover:scale-100 transition-all duration-700"
                              alt={product.name}
                            />

                            <div className="absolute top-6 left-6">
                              <span className="bg-[#D4AF37] text-black text-[8px] font-black uppercase px-3 py-1 rounded-full">
                                {product.badge}
                              </span>
                            </div>
                            <div
                              className={`absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase border backdrop-blur-md ${product.isAvailable ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}
                            >
                              {product.isAvailable ? (
                                <CheckCircle2 size={10} />
                              ) : (
                                <AlertCircle size={10} />
                              )}{" "}
                              {product.isAvailable ? "En Stock" : "Épuisé"}
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                              <button
                                onClick={() => openDetails(product)}
                                className="bg-white text-black p-4 rounded-full hover:scale-110 transition-transform shadow-2xl"
                              >
                                <Eye size={24} />
                              </button>
                            </div>
                          </div>
                          <div className="p-8">
                            <p className="text-[#D4AF37] text-[9px] font-black uppercase tracking-widest mb-2">
                              {product.cat}
                            </p>
                            <h3 className="text-white font-bold text-lg mb-4 uppercase">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                              <span className="text-xl font-black italic">
                                {product.priceDisplay}{" "}
                                <small className="text-[10px] text-[#D4AF37]">
                                  CFA
                                </small>
                              </span>
                              <button
                                onClick={() => openDetails(product)}
                                className="text-[#D4AF37] hover:translate-x-2 transition-transform"
                              >
                                <ArrowRight size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>

                {/* GRILLE DÉCOUVERTE (Simulation 100 images) */}
                <section
                  ref={discoveryRef}
                  className="mt-40 pt-20 border-t border-white/5"
                >
                  <div className="mb-12">
                    <h2 className="text-4xl font-black uppercase italic">
                      La Galerie <span className="text-[#D4AF37]">Aurum</span>
                    </h2>
                    <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-2">
                      Exploration visuelle de nos collections exclusives.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {/* On réutilise les produits pour simuler une grande grille */}
                    {[...products, ...products, ...products].map((p, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer"
                        onClick={() => openDetails(p)}
                      >
                        <img
                          src={p.img}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                          alt=""
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                          <span className="text-[8px] font-black uppercase text-[#D4AF37] mb-1">
                            {p.cat}
                          </span>
                          <span className="text-[10px] font-bold uppercase text-white mb-4">
                            {p.name}
                          </span>
                          <div className="bg-white/10 p-2 rounded-full backdrop-blur-md border border-white/20">
                            <Eye size={16} />
                          </div>
                        </div>
                        {!p.isAvailable && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-[7px] font-black uppercase px-2 py-0.5 rounded-full">
                            Out
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* SOURCING BANNER */}
                <div className="mt-32 bg-gradient-to-br from-[#D4AF37]/20 via-[#161617] to-transparent border border-white/5 rounded-[4rem] p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
                  <div className="max-w-xl">
                    <h2 className="text-4xl font-black uppercase italic leading-tight">
                      L'Exceptionnel sur <br />{" "}
                      <span className="text-[#D4AF37]">Mesure</span>.
                    </h2>
                    <p className="text-gray-500 text-[10px] mt-6 uppercase tracking-[0.2em] leading-loose">
                      Notre réseau mondial dénichera la pièce rare que vous
                      convoitez, même si elle ne figure pas dans notre catalogue
                      actuel.
                    </p>
                  </div>
                  <Button
                    variant="gold"
                    onClick={() => navigate("/sourcing")}
                    className="px-12 py-7 h-auto"
                  >
                    Lancer un Sourcing <ArrowRight size={20} className="ml-4" />
                  </Button>
                </div>
              </main>
            </div>
          </>
        )}

        {/* MODAL DÉTAILS DYNAMIQUE */}
        {showDetailModal && selectedProduct && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center px-4 animate-in fade-in duration-300">
            <div
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setShowDetailModal(false)}
            />
            <div className="bg-[#161617] border border-white/10 w-full max-w-5xl rounded-[3.5rem] overflow-hidden relative z-10 flex flex-col md:flex-row max-h-[90vh]">
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white hover:rotate-90 transition-all z-20"
              >
                <X size={32} />
              </button>

              <div className="w-full md:w-1/2 bg-black h-80 md:h-auto">
                <img
                  src={selectedProduct.img}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div className="p-12 md:p-16 flex-1 flex flex-col justify-center">
                <p className="text-[#D4AF37] text-[10px] font-black uppercase mb-4 tracking-widest">
                  {selectedProduct.cat}
                </p>
                <h2 className="text-4xl md:text-5xl font-black uppercase italic mb-8 leading-none">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-400 text-xs uppercase leading-loose tracking-[0.1em] mb-12">
                  {selectedProduct.description}
                </p>

                <div className="bg-white/5 p-8 rounded-3xl border border-white/5 mb-10 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">
                      Prix Final
                    </span>
                    <span className="text-4xl font-black italic tracking-tighter">
                      {selectedProduct.priceDisplay}{" "}
                      <small className="text-xs text-[#D4AF37]">CFA</small>
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase ${selectedProduct.isAvailable ? "border-green-500/30 text-green-500" : "border-red-500/30 text-red-500"}`}
                  >
                    {selectedProduct.isAvailable
                      ? "Disponible Immédiatement"
                      : "En cours de réappro"}
                  </div>
                </div>

                <Button
                  variant={selectedProduct.isAvailable ? "gold" : "outline"}
                  size="full"
                  className="py-8 text-[11px] font-black"
                  onClick={handleAction}
                >
                  {selectedProduct.isAvailable ? (
                    <>
                      <ShoppingCart size={20} className="mr-3" /> Procéder à
                      l'acquisition
                    </>
                  ) : (
                    <>
                      <Bell size={20} className="mr-3" /> M'alerter du retour en
                      stock
                    </>
                  )}
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
