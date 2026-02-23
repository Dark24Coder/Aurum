import React, { useMemo } from "react";
import { CreditCard, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { formatCurrency, CAUTION_AMOUNT } from "../../../utils/constants";

const Payments = () => {
  const { db, currentUser } = useAuth();

  const userOrders = useMemo(
    () => db.orders.filter((o) => o.userId === currentUser?.uid),
    [db.orders, currentUser],
  );

  const paidOrders = userOrders.filter((o) => (o.price || 0) > 0);

  return (
    <main className="space-y-4 max-w-3xl">
      <h3 className="text-xl font-black text-white uppercase mb-6">
        Historique Financier
      </h3>

      {/* Caution de garantie */}
      <div className="bg-[#161617] border border-white/5 border-l-4 border-l-[#D4AF37] p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="font-bold text-white">Caution de Garantie</div>
          <div className="text-xs text-gray-500 mt-1">
            Dépôt de sécurité obligatoire pour le sourcing
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-black text-white text-lg">
            {formatCurrency(CAUTION_AMOUNT)}
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase border mt-1 ${
              currentUser?.depositPaid
                ? "bg-green-500/20 text-green-400 border-green-500/20"
                : "bg-red-500/20 text-red-400 border-red-500/20"
            }`}
          >
            {currentUser?.depositPaid ? (
              <>
                <CheckCircle size={10} /> PAYÉE
              </>
            ) : (
              <>
                <XCircle size={10} /> NON PAYÉE
              </>
            )}
          </span>
        </div>
      </div>

      {/* Commandes payées */}
      {paidOrders.length > 0 ? (
        paidOrders.map((order) => (
          <div
            key={order.id}
            className="bg-[#161617] border border-white/5 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-[#D4AF37]/20 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/5 rounded-xl flex-shrink-0">
                <CreditCard className="text-[#D4AF37]" size={18} />
              </div>
              <div>
                <div className="font-bold text-white">
                  Achat : {order.product}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {order.date} • {order.type}
                </div>
              </div>
            </div>
            <div className="text-right ml-16 sm:ml-0">
              <div className="font-black text-white text-lg">
                {formatCurrency(order.price)}
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase bg-green-500/20 text-green-400 border border-green-500/20 mt-1">
                <CheckCircle size={10} /> PAYÉ
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-[#0A0A0B] border border-dashed border-white/10 p-16 rounded-3xl text-center">
          <CreditCard size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-gray-500 text-sm">
            Aucune transaction enregistrée.
          </p>
        </div>
      )}
    </main>
  );
};

export default Payments;
