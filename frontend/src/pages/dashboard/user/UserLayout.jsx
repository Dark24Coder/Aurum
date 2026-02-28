import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Bell,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";

// Imports des composants de ton dossier user
import Overview from "./Overview";
import Orders from "./Orders";
import Notifications from "./Notifications";
import Profile from "./Profile";

const UserLayout = () => {
  const { currentUser, logout, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "orders", label: "Mes Commandes", icon: <Package size={20} /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      badge: unreadCount,
    },
    { id: "profile", label: "Mon Profil", icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="hidden md:flex w-72 bg-[#0A0A0B] border-r border-white/5 flex-col p-6">
        <div className="mb-10">
          <h2 className="text-xl font-black tracking-tighter uppercase">
            BJ<span className="text-[#D4AF37]">BUSINESS</span>
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
            Espace Client
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 font-bold text-sm ${
                activeTab === item.id
                  ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                  : "text-gray-500 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.badge > 0 && (
                <span className="bg-[#D4AF37] text-black text-[10px] px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-4 text-gray-500 hover:text-red-500 font-bold text-sm transition-colors"
        >
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* --- MOBILE HEADER --- */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A0A0B] border-b border-white/5">
        <h2 className="font-black text-[#D4AF37]">BJB</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* --- CONTENU PRINCIPAL --- */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {/* Header du contenu */}
        <header className="mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            {menuItems.find((i) => i.id === activeTab)?.label}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Ravi de vous revoir,{" "}
            <span className="text-white">{currentUser?.name}</span> (ID:{" "}
            {currentUser?.uid})
          </p>
        </header>

        {/* Affichage dynamique des pages */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "overview" && <Overview />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "profile" && <Profile />}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
