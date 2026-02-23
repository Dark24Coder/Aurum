import React, { useMemo } from "react";
import {
  Bell,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
  MailOpen,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";

const Notifications = () => {
  const { db, currentUser, markNotifRead, deleteNotif } = useAuth();

  const userNotifs = useMemo(() => {
    return db.notifications
      .filter((n) => n.userId === currentUser?.uid)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [db.notifications, currentUser]);

  const unread = userNotifs.filter((n) => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle size={20} className="text-green-500" />;
      case "WARNING":
        return <AlertCircle size={20} className="text-orange-500" />;
      default:
        return <Bell size={20} className="text-[#D4AF37]" />;
    }
  };

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-white uppercase">
          Notifications
        </h3>
        {unread > 0 && (
          <span className="text-[10px] font-black text-[#D4AF37] uppercase bg-[#D4AF37]/10 px-3 py-1.5 rounded-full border border-[#D4AF37]/20">
            {unread} non {unread > 1 ? "lues" : "lue"}
          </span>
        )}
      </div>

      {/* Liste */}
      {userNotifs.length > 0 ? (
        userNotifs.map((notif) => (
          <div
            key={notif.id}
            className={`p-5 rounded-2xl border transition-all duration-300 flex gap-4 ${
              notif.read
                ? "bg-white/[0.02] border-white/5 opacity-60"
                : "bg-[#0A0A0B] border-l-4 border-l-[#D4AF37] border-white/5 shadow-[0_0_20px_rgba(212,175,55,0.05)]"
            }`}
          >
            {/* Icône */}
            <div
              className={`p-2.5 rounded-xl bg-white/5 flex-shrink-0 self-start ${!notif.read ? "animate-pulse" : ""}`}
            >
              {getIcon(notif.type)}
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4">
                <h4
                  className={`text-sm font-bold ${notif.read ? "text-gray-400" : "text-white"}`}
                >
                  {notif.title}
                </h4>
                <span className="text-[10px] text-gray-600 font-mono uppercase flex-shrink-0">
                  {notif.date}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                {notif.message}
              </p>

              {/* Actions */}
              <div className="flex gap-5 mt-4">
                {!notif.read && (
                  <button
                    onClick={() => markNotifRead(notif.id)}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase text-[#D4AF37] hover:text-white transition-colors"
                  >
                    <MailOpen size={12} /> Marquer comme lu
                  </button>
                )}
                <button
                  onClick={() => deleteNotif(notif.id)}
                  className="flex items-center gap-1.5 text-[10px] font-black uppercase text-gray-600 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-[#0A0A0B] border border-dashed border-white/10 p-20 rounded-3xl text-center">
          <Bell size={48} className="mx-auto text-white/5 mb-4" />
          <p className="text-gray-500 text-sm font-medium">
            Aucune notification pour le moment.
          </p>
        </div>
      )}
    </main>
  );
};

export default Notifications;
