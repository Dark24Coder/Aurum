import React, { useState } from "react";
import {
  BarChart3,
  Users,
  ShieldCheck,
  PackageCheck,
  LogOut,
  Bell,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useNavigate } from "react-router-dom";

// Note : Assure-toi que ces composants existent ou crée des fichiers vides pour l'instant
const AdminOverview = () => (
  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
    Vue d'ensemble Admin
  </div>
);
const UsersList = () => (
  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
    Liste des utilisateurs
  </div>
);
const ManageKYC = () => (
  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
    Gestion des KYC
  </div>
);
const ManageOrders = () => (
  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
    Gestion des commandes
  </div>
);

const AdminLayout = () => {
  const { logout, db } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const pendingKycCount =
    db?.kycRequests?.filter((r) => r.status === "PENDING").length || 0;

  const menuItems = [
    { id: "overview", label: "Statistiques", icon: <BarChart3 size={20} /> },
    { id: "users", label: "Utilisateurs", icon: <Users size={20} /> },
    {
      id: "kyc",
      label: "Vérifications KYC",
      icon: <ShieldCheck size={20} />,
      badge: pendingKycCount,
    },
    {
      id: "orders",
      label: "Gestion Commandes",
      icon: <PackageCheck size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0A0A0B] border-r border-white/5 flex flex-col p-6">
        <div className="mb-10">
          <h2 className="text-xl font-black tracking-tighter uppercase italic">
            ADMIN<span className="text-[#D4AF37]">PANEL</span>
          </h2>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                activeTab === item.id
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm font-bold">{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-4 text-gray-500 hover:text-red-500 font-bold transition-colors"
        >
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-center">
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            {menuItems.find((i) => i.id === activeTab)?.label}
          </h1>
          <button className="p-3 bg-white/5 rounded-full relative">
            <Bell size={20} />
          </button>
        </header>

        <div className="animate-in fade-in duration-500">
          {activeTab === "overview" && <AdminOverview />}
          {activeTab === "users" && <UsersList />}
          {activeTab === "kyc" && <ManageKYC />}
          {activeTab === "orders" && <ManageOrders />}
        </div>
      </main>
    </div>
  );
};

// LA LIGNE CRUCIALE :
export default AdminLayout;
