import { CheckCircle, Trash2 } from "lucide-react";

function Notifications({ notifications, markAsRead, deleteNotification }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-white uppercase mb-6">
        Notifications
      </h3>

      {notifications.map((n) => (
        <div
          key={n.id}
          className={`bg-[#161617] rounded-2xl p-5 flex justify-between gap-4 border ${
            n.read ? "border-white/5" : "border-[#D4AF37]/30"
          }`}
        >
          <div>
            <div className="font-bold text-white text-sm">{n.title}</div>
            <div className="text-xs text-gray-400 mt-1">{n.message}</div>
            <div className="text-[10px] text-gray-600 mt-2">{n.date}</div>
          </div>

          <div className="flex gap-2">
            {!n.read && (
              <button
                onClick={() => markAsRead(n.id)}
                className="text-green-400 hover:text-green-300"
              >
                <CheckCircle size={16} />
              </button>
            )}
            <button
              onClick={() => deleteNotification(n.id)}
              className="text-red-400 hover:text-red-300"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {notifications.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Aucune notification.
        </div>
      )}
    </div>
  );
}

export default Notifications;
