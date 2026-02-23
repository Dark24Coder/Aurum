import React, { useState } from "react";
import {
  Calculator,
  Package,
  Zap,
  Laptop,
  Smartphone,
  ShieldCheck,
  Tag,
  AlertTriangle,
} from "lucide-react";

const SHIPPING_RATES = [
  {
    id: "NORMAL",
    label: "Articles Normaux",
    price: 9000,
    unit: "Kg",
    details: "Vêtements, Chaussures, Articles quotidiens",
    delay: "21 jours",
    icon: <Package size={18} />,
  },
  {
    id: "SPECIAL",
    label: "Articles Spéciaux",
    price: 10500,
    unit: "Kg",
    details: "Liquides, Poudres, Cosmétiques, Batterie intégrée",
    delay: "30 jours",
    icon: <Zap size={18} />,
  },
  {
    id: "MEDICAL",
    label: "Médicaux & Autres",
    price: 11500,
    unit: "Kg",
    details: "Santé, Scanners, Topographie",
    delay: "30 jours",
    icon: <ShieldCheck size={18} />,
  },
  {
    id: "COMPUTER",
    label: "Ordinateurs",
    price: 25000,
    unit: "Kg",
    details: "Ordinateurs portables",
    delay: "30 jours",
    icon: <Laptop size={18} />,
  },
  {
    id: "PHONE",
    label: "Smartphones",
    price: 15000,
    unit: "Unité",
    details: "Smartphones, Tablettes",
    delay: "30 jours",
    icon: <Smartphone size={18} />,
  },
];

const PROHIBITED_ITEMS = [
  "Téléphones et ordinateurs par voie maritime",
  "Batteries pures (Powerbank) interdites de vol (risque incendie)",
  "Drones (interdits avion et bateau)",
  "Produits chimiques dangereux ou toxiques",
  "Armes réelles ou répliques parfaites",
  "Articles sous forme de sprays (aérosols)",
  "Médicaments sans autorisation d'importation",
  "Liquides inflammables et explosifs",
];

const SEA_RATE_CBM = 265000;

const formatCurrency = (amount) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF" }).format(
    amount,
  );

const CostSimulator = () => {
  const [mode, setMode] = useState("AIR");
  const [category, setCategory] = useState(SHIPPING_RATES[0].id);
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "",
    height: "",
    weight: "",
    quantity: "1",
  });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const L = parseFloat(dimensions.length) || 0;
    const W = parseFloat(dimensions.width) || 0;
    const H = parseFloat(dimensions.height) || 0;
    const Weight = parseFloat(dimensions.weight) || 0;
    const Qty = parseFloat(dimensions.quantity) || 1;

    const rate = SHIPPING_RATES.find((r) => r.id === category);

    if (mode === "AIR") {
      if (rate.unit === "Unité") {
        const cost = rate.price * Qty;
        setResult({
          type: "AIR_UNIT",
          cost,
          details: `${Qty} x ${rate.label}`,
        });
      } else {
        const volWeight = (L * W * H) / 6000;
        const chargeableWeight = Math.max(Weight, volWeight);
        const cost = chargeableWeight * rate.price;
        setResult({
          type: "AIR_KG",
          volWeight,
          chargeableWeight,
          cost,
          details: `Poids Volumétrique: ${volWeight.toFixed(2)} kg (Tarif: ${formatCurrency(rate.price)}/kg)`,
        });
      }
    } else {
      const cbm = (L * W * H) / 1000000;
      const cost = Math.max(cbm, 0.1) * SEA_RATE_CBM;
      setResult({
        type: "SEA",
        cbm,
        cost,
        details: `Volume: ${cbm.toFixed(3)} CBM`,
      });
    }
  };

  return (
    <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto animate-in">
      <h2 className="text-3xl font-black text-white uppercase mb-8 text-center">
        Simulateur de Frais
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* CALCULATOR */}
        <div className="card-premium p-8 rounded-3xl space-y-6">
          <div className="flex bg-[#161617] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => {
                setMode("AIR");
                setResult(null);
              }}
              className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase transition ${mode === "AIR" ? "bg-[#D4AF37] text-black" : "text-gray-400"}`}
            >
              Aérien
            </button>
            <button
              onClick={() => {
                setMode("SEA");
                setResult(null);
              }}
              className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase transition ${mode === "SEA" ? "bg-[#D4AF37] text-black" : "text-gray-400"}`}
            >
              Maritime
            </button>
          </div>

          {mode === "AIR" && (
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Catégorie de Marchandise
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-std mt-1"
              >
                {SHIPPING_RATES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {mode === "AIR" &&
          SHIPPING_RATES.find((r) => r.id === category)?.unit === "Unité" ? (
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase">
                Quantité
              </label>
              <input
                type="number"
                className="input-std mt-1"
                value={dimensions.quantity}
                onChange={(e) =>
                  setDimensions({ ...dimensions, quantity: e.target.value })
                }
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    L (cm)
                  </label>
                  <input
                    type="number"
                    className="input-std mt-1"
                    value={dimensions.length}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, length: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    l (cm)
                  </label>
                  <input
                    type="number"
                    className="input-std mt-1"
                    value={dimensions.width}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, width: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    H (cm)
                  </label>
                  <input
                    type="number"
                    className="input-std mt-1"
                    value={dimensions.height}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, height: e.target.value })
                    }
                  />
                </div>
              </div>
              {mode === "AIR" && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Poids Réel (kg)
                  </label>
                  <input
                    type="number"
                    className="input-std mt-1"
                    value={dimensions.weight}
                    onChange={(e) =>
                      setDimensions({ ...dimensions, weight: e.target.value })
                    }
                  />
                </div>
              )}
            </>
          )}

          <button
            onClick={calculate}
            className="w-full btn-gold py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Calculator size={18} /> Calculer
          </button>

          {result && (
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-6 animate-in">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase mb-1">
                  Estimation Coût Transport
                </div>
                <div className="text-3xl font-black text-[#D4AF37]">
                  {formatCurrency(result.cost)}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-gray-400 flex justify-between">
                <span>Base de calcul</span>
                <span className="font-bold text-white">{result.details}</span>
              </div>
              <div className="mt-2 text-[10px] text-gray-500 text-center italic">
                Hors frais de douane spécifiques
              </div>
            </div>
          )}
        </div>

        {/* INFO PANEL */}
        <div className="space-y-6">
          {/* Rates Table */}
          <div className="card-premium p-6 rounded-3xl">
            <h3 className="text-lg font-black text-white uppercase mb-4 flex items-center gap-2">
              <Tag size={20} className="text-[#D4AF37]" /> Grille Tarifaire
              Aérienne
            </h3>
            <div className="space-y-3">
              {SHIPPING_RATES.map((rate) => (
                <div
                  key={rate.id}
                  className="p-3 bg-white/5 rounded-xl flex items-center justify-between border border-white/5 hover:border-[#D4AF37]/30 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-[#D4AF37]">{rate.icon}</div>
                    <div>
                      <div className="text-sm font-bold text-white">
                        {rate.label}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {rate.details}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-white">
                      {formatCurrency(rate.price)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      / {rate.unit}
                    </div>
                    <div className="text-[9px] text-[#D4AF37]">
                      {rate.delay}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prohibited Items */}
          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl">
            <h3 className="text-lg font-black text-red-500 uppercase mb-4 flex items-center gap-2">
              <AlertTriangle size={20} /> Marchandises Interdites
            </h3>
            <ul className="space-y-2">
              {PROHIBITED_ITEMS.map((item, i) => (
                <li
                  key={i}
                  className="text-xs text-red-400/80 flex items-start gap-2"
                >
                  <span className="mt-1 block w-1 h-1 rounded-full bg-red-500 flex-shrink-0"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CostSimulator;
