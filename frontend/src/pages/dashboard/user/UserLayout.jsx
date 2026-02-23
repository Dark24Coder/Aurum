// src/pages/dashboard/user/UserLayout.jsx
// ✅ Onglet Groupages ajouté
// ✅ SidebarContent déclaré EN DEHORS du composant principal (fix "Components created during render")
import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Ship,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";

import Overview from "./Overview";
import Orders from "./Orders";
import MesGroupages from "./MesGroupages";
import Notifications from "./Notifications";
import Profile from "./Profile";

// ── Sidebar statique — EN DEHORS du composant pour éviter le re-montage ──────
function SidebarContent({ menuItems, activeTab, onSelect, onLogout }) {
  return (
    <>
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
            onClick={() => onSelect(item.id)}
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
              <span className="bg-[#D4AF37] text-black text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="mt-auto flex items-center gap-3 p-4 text-gray-500 hover:text-red-500 font-bold text-sm transition-colors"
      >
        <LogOut size={20} /> Déconnexion
      </button>
    </>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
const UserLayout = () => {
  const { currentUser, logout, unreadCount, db } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const groupageCount = (db?.orders || []).filter(
    (o) => o.userId === currentUser?.uid && o.type === "GROUPAGE",
  ).length;

  const menuItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: <LayoutDashboard size={20} />,
    },
    { id: "orders", label: "Mes Commandes", icon: <Package size={20} /> },
    {
      id: "groupages",
      label: "Mes Groupages",
      icon: <Ship size={20} />,
      badge: groupageCount || 0,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={20} />,
      badge: unreadCount || 0,
    },
    { id: "profile", label: "Mon Profil", icon: <User size={20} /> },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-72 bg-[#0A0A0B] border-r border-white/5 flex-col p-6">
        <SidebarContent
          menuItems={menuItems}
          activeTab={activeTab}
          onSelect={handleSelect}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A0A0B] border-b border-white/5 sticky top-0 z-30">
        <h2 className="font-black text-[#D4AF37]">
          BJ<span className="text-white">BUSINESS</span>
        </h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-[#0A0A0B] border-r border-white/5 flex flex-col p-6 h-full overflow-y-auto">
            <SidebarContent
              menuItems={menuItems}
              activeTab={activeTab}
              onSelect={handleSelect}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-1 p-5 sm:p-8 md:p-12 overflow-y-auto">
        <header className="mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">
            {menuItems.find((i) => i.id === activeTab)?.label}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Bienvenue, <span className="text-white">{currentUser?.name}</span>
            <span className="text-gray-600"> · {currentUser?.uid}</span>
          </p>
        </header>

        <div>
          {activeTab === "overview" && <Overview setActiveTab={setActiveTab} />}
          {activeTab === "orders" && <Orders />}
          {activeTab === "groupages" && <MesGroupages />}
          {activeTab === "notifications" && <Notifications />}
          {activeTab === "profile" && <Profile />}
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
