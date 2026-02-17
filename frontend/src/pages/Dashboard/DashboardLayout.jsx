import { useState } from "react";
import { Bell } from "lucide-react";

import Overview from "./Overview";
import Orders from "./Orders";
import Notifications from "./Notifications";

// ── DONNÉES MOCK TEMPORAIRES ──
const INITIAL_ORDERS = [
  {
    id: "CMD-2401-001",
    userId: "BJ-ID-002",
    type: "SOURCING",
    product: "Ecran LED 55 pouces",
    price: 0,
    status: "EN_TRANSIT",
    date: "2024-01-15",
    trackingInternal: "BJ-TRK-889",
    trackingCarrier: "DHL-998212",
  },
  {
    id: "CMD-2401-002",
    userId: "BJ-ID-002",
    type: "MARKETPLACE",
    product: "iPhone 15 Pro",
    price: 750000,
    status: "LIVRE",
    date: "2024-01-10",
    trackingInternal: "BJ-TRK-774",
    trackingCarrier: "FEDEX-1123",
  },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-001",
    title: "Bienvenue !",
    message: "Votre compte a été créé avec succès.",
    date: "2024-01-10",
    read: false,
  },
  {
    id: "NOTIF-002",
    title: "Commande Expédiée",
    message: "Votre commande #CMD-2401-001 est en route.",
    date: "2024-01-16",
    read: true,
  },
];

function DashboardLayout() {
  const [activeTab, setActiveTab] = useState("overview");
  const [orders] = useState(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview orders={orders} />;
      case "orders":
        return <Orders orders={orders} />;
      case "notifications":
        return (
          <Notifications
            notifications={notifications}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
          />
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "orders", label: "Commandes" },
    {
      id: "notifications",
      label: `Notifications ${unreadCount > 0 ? `(${unreadCount})` : ""}`,
    },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-4 md:px-10 max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
            Mon <span className="text-[#D4AF37]">Dashboard</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bienvenue sur votre espace personnel
          </p>
        </div>

        <div className="relative">
          <Bell className="text-gray-400" size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] rounded-full text-[9px] font-black text-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-3 overflow-x-auto pb-2 mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === t.id
                ? "bg-[#D4AF37] text-black"
                : "bg-[#161617] text-gray-400 border border-white/10 hover:border-[#D4AF37]/30"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* CONTENU */}
      {renderContent()}
    </div>
  );
}

export default DashboardLayout;
