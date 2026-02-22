// src/pages/dashboard/admin/AdminLayout.jsx
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  Package,
  Store,
  Users,
  LogOut,
  ChevronRight,
  Bell,
  Settings as SettingsIcon,
  UserCircle,
  X,
  Tag,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";

import AdminOverview from "./AdminOverview";
import ManageKYC from "./ManageKYC";
import ManageOrders from "./ManageOrders";
import ManageMarket from "./ManageMarket";
import UsersAdmin from "./Users";
import Settings from "./Settings";
import ManagePromos from "./ManagePromos";

const TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: "kyc", label: "KYC", icon: ShieldCheck },
  { id: "orders", label: "Commandes", icon: Package },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "users", label: "Utilisateurs", icon: Users },
  { id: "promos", label: "Promos", icon: Tag },
  { id: "settings", label: "Configuration", icon: SettingsIcon },
];

const MOCK_NOTIFS = [
  {
    id: 1,
    text: "Nouveau dossier KYC à valider",
    time: "Il y a 5 min",
    read: false,
    tab: "kyc",
  },
  {
    id: 2,
    text: "Commande #ORD-9921 en attente",
    time: "Il y a 20 min",
    read: false,
    tab: "orders",
  },
  {
    id: 3,
    text: "Nouveau utilisateur inscrit",
    time: "Il y a 1h",
    read: true,
    tab: "users",
  },
  {
    id: 4,
    text: "Produit AirPods Pro 2 — stock faible",
    time: "Il y a 2h",
    read: true,
    tab: "marketplace",
  },
];

export default function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const notifRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const current = TABS.find((t) => t.id === activeTab);
  const unread = notifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const goToTab = (tab) => {
    setActiveTab(tab);
    setNotifOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:flex w-64 bg-[#0A0A0B] border-r border-white/5 flex-col fixed top-20 left-0 bottom-0 z-30 overflow-y-auto">
        <div className="p-5 flex flex-col h-full">
          <div className="mb-6 p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-black text-sm flex-shrink-0">
                {currentUser?.name?.[0] || "A"}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-black text-white truncate">
                  {currentUser?.name}
                </div>
                <div className="text-[9px] font-black text-red-400 uppercase tracking-widest">
                  Administrateur
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {TABS.map((tab) => {
              const TIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                    activeTab === tab.id
                      ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                      : "text-gray-500 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TIcon size={16} />
                    {tab.label}
                  </div>
                  {activeTab === tab.id && <ChevronRight size={13} />}
                </button>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 p-3 text-gray-500 hover:text-red-400 font-bold text-sm transition-colors rounded-xl hover:bg-red-500/5"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="md:ml-64 min-h-screen flex flex-col">
        {/* Header desktop sticky */}
        <header className="hidden md:flex h-16 border-b border-white/5 items-center justify-between px-6 lg:px-8 sticky top-20 bg-[#050505]/95 backdrop-blur-xl z-20 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.3em]">
                Admin
              </span>
              <span className="text-gray-700 text-[9px]">·</span>
              <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
                {current?.label}
              </span>
            </div>
            <h1 className="text-lg font-black uppercase tracking-tighter text-white leading-tight">
              {current?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#D4AF37] rounded-full text-black text-[8px] font-black flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div
                  className="absolute top-12 right-0 w-80 bg-[#111112] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  style={{ animation: "fadeInN .2s ease" }}
                >
                  <style>{`@keyframes fadeInN{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest">
                      Notifications
                    </span>
                    <div className="flex items-center gap-2">
                      {unread > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[9px] text-gray-500 hover:text-white uppercase font-black tracking-wider"
                        >
                          Tout lire
                        </button>
                      )}
                      <button
                        onClick={() => setNotifOpen(false)}
                        className="text-gray-600 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => goToTab(n.tab)}
                        className={`w-full text-left px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors ${!n.read ? "bg-[#D4AF37]/3" : ""}`}
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${!n.read ? "bg-[#D4AF37]" : "opacity-0"}`}
                          />
                          <div className="min-w-0">
                            <p
                              className={`text-xs leading-snug ${n.read ? "text-gray-500" : "text-white font-bold"}`}
                            >
                              {n.text}
                            </p>
                            <p className="text-[9px] text-gray-600 mt-0.5">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profil → Settings */}
            <button
              onClick={() => setActiveTab("settings")}
              className="flex items-center gap-2.5 pl-3 border-l border-white/10 group"
            >
              <div className="text-right hidden lg:block">
                <p className="text-[10px] font-black uppercase text-white group-hover:text-[#D4AF37] transition-colors">
                  {currentUser?.name}
                </p>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
                  Gérer profil
                </p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37] group-hover:border-[#D4AF37]/40 transition-all">
                <UserCircle size={20} />
              </div>
            </button>
          </div>
        </header>

        {/* Barre mobile */}
        <div className="md:hidden sticky top-20 z-20 bg-[#050505]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center text-black font-black text-xs">
                {currentUser?.name?.[0] || "A"}
              </div>
              <div>
                <span className="text-xs font-black text-white">
                  {currentUser?.name}
                </span>
                <span className="text-[9px] font-black text-red-400 uppercase tracking-widest ml-2">
                  Admin
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="relative p-1.5 text-gray-400"
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#D4AF37] rounded-full text-black text-[7px] font-black flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setNotifOpen(false);
                }}
                className="p-1.5 text-gray-400 hover:text-[#D4AF37] transition-colors"
              >
                <SettingsIcon size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 text-red-400 font-black text-[10px] uppercase"
              >
                <LogOut size={11} />
              </button>
            </div>
          </div>

          {notifOpen && (
            <div className="mb-3 bg-[#111112] border border-white/10 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest">
                  Notifications
                </span>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[9px] text-gray-500 uppercase font-black"
                  >
                    Tout lire
                  </button>
                )}
              </div>
              {notifs.slice(0, 4).map((n) => (
                <button
                  key={n.id}
                  onClick={() => goToTab(n.tab)}
                  className={`w-full text-left px-3 py-2.5 border-b border-white/5 last:border-0 ${!n.read ? "bg-[#D4AF37]/3" : ""}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${!n.read ? "bg-[#D4AF37]" : "opacity-0"}`}
                    />
                    <p
                      className={`text-[11px] leading-snug ${n.read ? "text-gray-500" : "text-white font-bold"}`}
                    >
                      {n.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
            {TABS.map((tab) => {
              const TIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setNotifOpen(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wide whitespace-nowrap transition-all flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-[#D4AF37] text-black"
                      : "bg-white/5 text-gray-400 border border-white/10"
                  }`}
                >
                  <TIcon size={11} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <div key={activeTab}>
            {activeTab === "overview" && (
              <AdminOverview setActiveTab={setActiveTab} />
            )}
            {activeTab === "kyc" && <ManageKYC />}
            {activeTab === "orders" && <ManageOrders />}
            {activeTab === "marketplace" && <ManageMarket />}
            {activeTab === "users" && <UsersAdmin />}
            {activeTab === "settings" && <Settings />}
            {activeTab === "promos" && <ManagePromos />}
          </div>
        </div>
      </main>
    </div>
  );
}
