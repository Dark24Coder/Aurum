// src/pages/dashboard/user/UserLayout.jsx
import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  CreditCard,
  Users,
  Fingerprint,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";

import Overview from "./Overview";
import Orders from "./Orders";
import Notifications from "./Notifications";
import Profile from "./Profile";
import Payments from "./Payments";

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
      icon: <LayoutDashboard size={18} />,
    },
    { id: "orders", label: "Mes Commandes", icon: <Package size={18} /> },
    { id: "groupages", label: "Mes Groupages", icon: <Users size={18} /> },
    { id: "payments", label: "Paiements", icon: <CreditCard size={18} /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      badge: unreadCount,
    },
    { id: "profile", label: "Mon Profil", icon: <User size={18} /> },
  ];

  const tabLabel = menuItems.find((i) => i.id === activeTab)?.label || "";

  const handleNav = (id) => {
    setActiveTab(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* ── SIDEBAR DESKTOP ─────────────────────────────────────────────── */}
      <aside className="hidden md:flex w-64 bg-[#0A0A0B] border-r border-white/5 flex-col p-6 flex-shrink-0">
        <div className="bg-[#161617] border border-white/5 p-5 rounded-2xl mb-6 text-center">
          <div className="w-14 h-14 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-2xl mx-auto mb-3">
            {currentUser?.name?.charAt(0) || "U"}
          </div>
          <h2 className="font-bold text-white text-sm truncate">
            {currentUser?.name}
          </h2>
          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
            {currentUser?.uid}
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <span
              className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${
                currentUser?.kycStatus === "VALID"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : currentUser?.kycStatus === "PENDING"
                    ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              KYC {currentUser?.kycStatus || "NONE"}
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-bold text-sm ${
                activeTab === item.id
                  ? "bg-[#D4AF37] text-black shadow-[0_4px_14px_rgba(212,175,55,0.3)] scale-[1.02]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                {item.label}
              </div>
              {item.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                    activeTab === item.id
                      ? "bg-black/20 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm"
        >
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* ── MOBILE HEADER ───────────────────────────────────────────────── */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0A0A0B] border-b border-white/5 sticky top-0 z-30">
        <div>
          <span className="font-black text-white">BJ</span>
          <span className="font-black text-[#D4AF37]">BUSINESS</span>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-1"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── MENU MOBILE DRAWER ──────────────────────────────────────────── */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="absolute left-0 top-[57px] bottom-0 w-72 bg-[#0A0A0B] border-r border-white/5 p-6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#161617] border border-white/5 p-4 rounded-2xl mb-5 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center text-black font-black text-lg flex-shrink-0">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-white text-sm truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-gray-500">{currentUser?.uid}</p>
              </div>
            </div>
            <nav className="space-y-1 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                    activeTab === item.id
                      ? "bg-[#D4AF37] text-black"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon} {item.label}
                  </div>
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition font-bold text-sm"
            >
              <LogOut size={18} /> Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* ── CONTENU PRINCIPAL ───────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
          <header className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
              {tabLabel}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Ravi de vous revoir,{" "}
              <span className="text-white font-bold">{currentUser?.name}</span>
            </p>
          </header>

          {currentUser?.kycStatus !== "VALID" && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-pulse">
              <div className="flex items-center gap-3 text-yellow-500 font-bold text-sm">
                <Fingerprint size={20} />
                Action Requise : Validez votre identité (KYC) pour commander.
              </div>
              <button
                onClick={() => setActiveTab("profile")}
                className="bg-yellow-500 text-black px-5 py-2 rounded-xl font-black text-xs uppercase hover:bg-yellow-400 transition flex-shrink-0"
              >
                Valider maintenant
              </button>
            </div>
          )}

          {/* Rendu dynamique — Groupages sans props */}
          <div key={activeTab} className="animate-fade-in-up">
            {activeTab === "overview" && (
              <Overview setActiveTab={setActiveTab} />
            )}
            {activeTab === "orders" && <Orders />}
            {activeTab === "groupages" && <GroupagesDashboard />}
            {activeTab === "payments" && <Payments />}
            {activeTab === "notifications" && <Notifications />}
            {activeTab === "profile" && <Profile />}
          </div>
        </div>
      </main>
    </div>
  );
};

// ── GROUPAGES DASHBOARD ───────────────────────────────────────────────────────
// Renommé en GroupagesDashboard pour éviter la confusion avec la page /groupage
function GroupagesDashboard() {
  const { db, currentUser } = useAuth();
  const myGroupages = db.orders.filter(
    (o) => o.userId === currentUser?.uid && o.type === "GROUPAGE",
  );

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-black text-white uppercase mb-6">
        Mes Groupages
      </h3>
      {myGroupages.length > 0 ? (
        myGroupages.map((order) => (
          <div
            key={order.id}
            className="bg-[#161617] border border-white/5 p-6 rounded-2xl flex justify-between items-center hover:border-[#D4AF37]/20 transition-colors"
          >
            <div>
              <div className="font-bold text-white">{order.product}</div>
              <div className="text-xs text-gray-500 mt-1">
                Rejoint le {order.date}
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${
                order.status === "LIVRE"
                  ? "bg-green-500/20 text-green-400 border-green-500/20"
                  : order.status === "EN_TRANSIT"
                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20"
                    : "bg-gray-500/20 text-gray-400 border-gray-500/20"
              }`}
            >
              {order.status?.replace("_", " ")}
            </span>
          </div>
        ))
      ) : (
        <div className="bg-[#0A0A0B] border border-dashed border-white/10 p-20 rounded-3xl text-center">
          <Users size={40} className="mx-auto text-white/10 mb-4" />
          <p className="text-gray-500 text-sm mb-4">Aucun groupage rejoint.</p>
          <a
            href="/groupage"
            className="inline-block bg-[#D4AF37] text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase hover:opacity-90 transition"
          >
            Voir les offres
          </a>
        </div>
      )}
    </div>
  );
}

export default UserLayout;
