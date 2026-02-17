import { Package } from "lucide-react";
import StatusBadge from "./components/StatusBadge";

function Orders({ orders }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-white uppercase mb-6">
        Historique des Commandes
      </h3>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-[#161617] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Package className="text-[#D4AF37]" size={20} />
            <div>
              <div className="font-bold text-white">{order.product}</div>
              <div className="text-xs text-gray-500 mt-1">
                ID: {order.id} • {order.date}
              </div>
              <div className="text-xs text-gray-500">
                {order.trackingCarrier}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={order.status} />
            <div className="text-xs font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-lg">
              {order.trackingInternal}
            </div>
          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Vous n'avez pas encore passé de commande.
        </div>
      )}
    </div>
  );
}

export default Orders;
