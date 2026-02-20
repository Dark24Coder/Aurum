// src/pages/dashboard/admin/Users.jsx
import { useState } from "react";
import {
  Users as UsersIcon,
  Search,
  X,
  Shield,
  User,
  CheckCircle,
  Filter,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";

// 🔥 Import des composants
import FloatInput from "../../../components/ui/FloatInput";
import FloatSelect from "../../../components/ui/FloatSelect";

const KYC_STYLES = {
  VALID: "text-green-400  bg-green-500/10  border-green-500/20",
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  NONE: "text-gray-400   bg-white/5       border-white/10",
  REJECTED: "text-red-400    bg-red-500/10    border-red-500/20",
};

// 🔥 Options pour les selects
const ROLE_OPTIONS = [
  { value: "ALL", label: "Tous les rôles" },
  { value: "CLIENT", label: "Clients" },
  { value: "ADMIN", label: "Administrateurs" },
];

const KYC_OPTIONS = [
  { value: "ALL", label: "Tous les KYC" },
  { value: "VALID", label: "KYC Validés" },
  { value: "PENDING", label: "En attente" },
  { value: "REJECTED", label: "Rejetés" },
  { value: "NONE", label: "Non soumis" },
];

// Données mock enrichies pour la démo — en prod elles viendraient de db.users
const MOCK_USERS = [
  {
    uid: "ADMIN-01",
    name: "Admin BJB",
    email: "admin@bjbusiness.com",
    role: "ADMIN",
    kycStatus: "VALID",
    country: "Bénin",
    depositPaid: true,
    createdAt: "01/01/2024",
  },
  {
    uid: "USER-01",
    name: "Client Privilège",
    email: "client@test.com",
    role: "CLIENT",
    kycStatus: "PENDING",
    country: "Bénin",
    depositPaid: false,
    createdAt: "15/01/2024",
  },
  {
    uid: "USR-55421",
    name: "Aminata Diallo",
    email: "aminata@gmail.com",
    role: "CLIENT",
    kycStatus: "VALID",
    country: "Sénégal",
    depositPaid: true,
    createdAt: "20/01/2024",
  },
  {
    uid: "USR-89012",
    name: "Kofi Mensah",
    email: "kofi@outlook.com",
    role: "CLIENT",
    kycStatus: "NONE",
    country: "Ghana",
    depositPaid: false,
    createdAt: "05/02/2024",
  },
  {
    uid: "USR-32100",
    name: "Marie Traoré",
    email: "marie.t@mail.com",
    role: "CLIENT",
    kycStatus: "REJECTED",
    country: "Côte d'Ivoire",
    depositPaid: false,
    createdAt: "12/02/2024",
  },
];

function KycBadge({ status }) {
  return (
    <span
      className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${KYC_STYLES[status] || KYC_STYLES.NONE}`}
    >
      KYC {status}
    </span>
  );
}

export default function UsersAdmin() {
  const { db } = useAuth();
  const [search, setSearch] = useState("");
  const [roleFilter, setRole] = useState("ALL");
  const [kycFilter, setKyc] = useState("ALL");

  // Fusion db.users (créés dynamiquement) + mock de base
  const allUsers = [
    ...MOCK_USERS,
    ...(db.users || []).filter((u) => !MOCK_USERS.find((m) => m.uid === u.uid)),
  ];

  const filtered = allUsers.filter((u) => {
    const matchSearch =
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.uid?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    const matchKyc = kycFilter === "ALL" || u.kycStatus === kycFilter;
    return matchSearch && matchRole && matchKyc;
  });

  const totalClients = allUsers.filter((u) => u.role === "CLIENT").length;
  const validKyc = allUsers.filter((u) => u.kycStatus === "VALID").length;
  const pendingKyc = allUsers.filter((u) => u.kycStatus === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Clients", count: totalClients, color: "#D4AF37" },
          { label: "KYC Validés", count: validKyc, color: "#10B981" },
          { label: "KYC En attente", count: pendingKyc, color: "#F59E0B" },
        ].map(({ label, count, color }) => (
          <div
            key={label}
            className="bg-[#111112] border border-white/5 rounded-2xl p-4"
          >
            <div className="text-2xl font-black" style={{ color }}>
              {count}
            </div>
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Filtres avec FloatInput et FloatSelect */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Recherche avec FloatInput */}
        <div className="flex-1">
          <FloatInput
            label="Rechercher par nom, email ou UID…"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        {/* 🔥 Filtre rôle avec FloatSelect */}
        <div className="w-56">
          <FloatSelect
            label="Rôle"
            value={roleFilter}
            onChange={setRole}
            options={ROLE_OPTIONS}
            icon={User}
          />
        </div>

        {/* 🔥 Filtre KYC avec FloatSelect */}
        <div className="w-56">
          <FloatSelect
            label="Statut KYC"
            value={kycFilter}
            onChange={setKyc}
            options={KYC_OPTIONS}
            icon={Shield}
          />
        </div>
      </div>

      {/* Compteur */}
      <div className="text-[11px] text-gray-500 font-bold">
        {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
      </div>

      {/* Table utilisateurs */}
      <div className="bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Utilisateur
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  UID
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Pays
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Rôle
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  KYC
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Caution
                </th>
                <th className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Inscrit
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-gray-600"
                  >
                    <UsersIcon size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucun utilisateur trouvé</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u.uid}
                    className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors"
                  >
                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-black text-sm ${
                            u.role === "ADMIN"
                              ? "bg-red-500/20 text-red-400 border border-red-500/20"
                              : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
                          }`}
                        >
                          {u.name?.[0] || "?"}
                        </div>
                        <div>
                          <div className="font-black text-white text-sm">
                            {u.name}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* UID */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-[#D4AF37] text-[11px]">
                        {u.uid}
                      </span>
                    </td>
                    {/* Pays */}
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {u.country || "—"}
                    </td>
                    {/* Rôle */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-1 rounded-md border ${
                          u.role === "ADMIN"
                            ? "text-red-400 bg-red-500/10 border-red-500/20"
                            : "text-gray-400 bg-white/5 border-white/10"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    {/* KYC */}
                    <td className="px-4 py-3">
                      <KycBadge status={u.kycStatus} />
                    </td>
                    {/* Caution */}
                    <td className="px-4 py-3">
                      {u.depositPaid ? (
                        <CheckCircle size={15} className="text-green-400" />
                      ) : (
                        <span className="text-[10px] text-gray-600 font-bold">
                          Non
                        </span>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {u.createdAt || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
