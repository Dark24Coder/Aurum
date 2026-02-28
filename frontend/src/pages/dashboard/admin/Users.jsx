// src/pages/dashboard/admin/Users.jsx
// ✅ FloatInput + FloatSelect — composants custom
// ✅ Suppression d'utilisateur avec confirmation
// ✅ Responsive mobile/tablette/desktop
import { useState } from "react";
import {
  Users as UsersIcon,
  Search,
  Shield,
  User,
  CheckCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import FloatInput from "../../../components/ui/FloatInput";
import FloatSelect from "../../../components/ui/FloatSelect";
import { useToast } from "../../../components/ui/useToast";

const KYC_STYLES = {
  VALID: "text-green-400  bg-green-500/10  border-green-500/20",
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  NONE: "text-gray-400   bg-white/5       border-white/10",
  REJECTED: "text-red-400    bg-red-500/10    border-red-500/20",
};

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
      {status}
    </span>
  );
}

// ── Modal de confirmation de suppression ─────────────────────────────────────
function ConfirmDeleteModal({ user, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-md"
        onClick={onCancel}
      />
      <div className="relative bg-[#111112] border border-red-500/20 w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-black text-white text-sm uppercase tracking-tight">
              Supprimer l'utilisateur
            </h3>
            <p className="text-gray-500 text-[11px] mt-0.5">
              Cette action est irréversible.
            </p>
          </div>
        </div>

        <div className="bg-white/3 border border-white/5 rounded-xl p-3">
          <p className="text-white font-black text-sm">{user.name}</p>
          <p className="text-gray-500 text-[11px]">{user.email}</p>
          <p className="text-[#D4AF37] font-mono text-[10px] mt-1">
            {user.uid}
          </p>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed">
          Cet utilisateur sera retiré de la plateforme et ne pourra plus se
          connecter.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 font-black text-[11px] uppercase tracking-wide hover:bg-white/5 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-black text-[11px] uppercase tracking-wide hover:bg-red-500/30 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Card utilisateur — vue mobile ─────────────────────────────────────────────
function UserCard({ u, onDelete }) {
  return (
    <div
      className={`bg-[#111112] border border-white/5 rounded-2xl p-4 flex items-start justify-between gap-3 ${u.role === "ADMIN" ? "border-red-500/10" : ""}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-base ${
            u.role === "ADMIN"
              ? "bg-red-500/20 text-red-400 border border-red-500/20"
              : "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20"
          }`}
        >
          {u.name?.[0] || "?"}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="font-black text-white text-sm truncate">
              {u.name}
            </span>
            <span
              className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                u.role === "ADMIN"
                  ? "text-red-400 bg-red-500/10 border-red-500/20"
                  : "text-gray-500 bg-white/5 border-white/10"
              }`}
            >
              {u.role}
            </span>
          </div>
          <p className="text-gray-500 text-[11px] truncate">{u.email}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="font-mono text-[#D4AF37] text-[10px]">
              {u.uid}
            </span>
            <KycBadge status={u.kycStatus} />
            {u.depositPaid && (
              <CheckCircle size={12} className="text-green-400" />
            )}
          </div>
          <p className="text-gray-600 text-[10px] mt-1">
            {u.country || "—"} · {u.createdAt}
          </p>
        </div>
      </div>
      {u.role !== "ADMIN" && (
        <button
          onClick={() => onDelete(u)}
          className="p-2 rounded-xl text-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0 mt-0.5"
          title="Supprimer"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}

export default function UsersAdmin() {
  const { db, setDb } = useAuth();
  const { toast, ToastContainer } = useToast();
  const [search, setSearch] = useState("");
  const [roleFilter, setRole] = useState("ALL");
  const [kycFilter, setKyc] = useState("ALL");
  const [toDelete, setToDelete] = useState(null);
  // IDs supprimés localement (mock + db)
  const [deletedIds, setDeletedIds] = useState(new Set());

  const allUsers = [
    ...MOCK_USERS,
    ...(db.users || []).filter((u) => !MOCK_USERS.find((m) => m.uid === u.uid)),
  ].filter((u) => !deletedIds.has(u.uid));

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

  const handleDelete = (user) => setToDelete(user);

  const confirmDelete = () => {
    if (!toDelete) return;
    const name = toDelete.name || toDelete.email;
    setDb?.((prev) => ({
      ...prev,
      users: (prev.users || []).filter((u) => u.uid !== toDelete.uid),
    }));
    setDeletedIds((prev) => new Set([...prev, toDelete.uid]));
    setToDelete(null);
    toast.success(`Utilisateur "${name}" supprimé.`);
  };

  const totalClients = allUsers.filter((u) => u.role === "CLIENT").length;
  const validKyc = allUsers.filter((u) => u.kycStatus === "VALID").length;
  const pendingKyc = allUsers.filter((u) => u.kycStatus === "PENDING").length;

  return (
    <main className="space-y-6">
      {ToastContainer}
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Clients", count: totalClients, color: "#D4AF37" },
          { label: "KYC Validés", count: validKyc, color: "#10B981" },
          { label: "En attente", count: pendingKyc, color: "#F59E0B" },
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

      {/* Filtres */}
      <div className="flex flex-col gap-3">
        {/* Recherche pleine largeur */}
        <FloatInput
          label="Rechercher par nom, email ou UID…"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
        {/* Selects côte à côte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FloatSelect
            label="Rôle"
            value={roleFilter}
            onChange={(val) => setRole(val)}
            options={ROLE_OPTIONS}
            icon={User}
          />
          <FloatSelect
            label="Statut KYC"
            value={kycFilter}
            onChange={(val) => setKyc(val)}
            options={KYC_OPTIONS}
            icon={Shield}
          />
        </div>
      </div>

      {/* Compteur */}
      <div className="text-[11px] text-gray-500 font-bold">
        {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
        {deletedIds.size > 0 && (
          <span className="ml-2 text-red-400/60">
            · {deletedIds.size} supprimé{deletedIds.size > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* ── Vue mobile : cards ── */}
      <div className="flex flex-col gap-3 lg:hidden">
        {filtered.length === 0 ? (
          <div className="bg-[#111112] border border-white/5 rounded-2xl py-12 text-center">
            <UsersIcon size={28} className="mx-auto mb-2 text-gray-700" />
            <p className="text-gray-500 text-sm">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          filtered.map((u) => (
            <UserCard key={u.uid} u={u} onDelete={handleDelete} />
          ))
        )}
      </div>

      {/* ── Vue desktop : table ── */}
      <div className="hidden lg:block bg-[#111112] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[750px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/3">
                {[
                  "Utilisateur",
                  "UID",
                  "Pays",
                  "Rôle",
                  "KYC",
                  "Caution",
                  "Inscrit",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-[10px] font-black text-gray-500 uppercase tracking-widest"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
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
                    <td className="px-4 py-3">
                      <span className="font-mono text-[#D4AF37] text-[11px]">
                        {u.uid}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {u.country || "—"}
                    </td>
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
                    <td className="px-4 py-3">
                      <KycBadge status={u.kycStatus} />
                    </td>
                    <td className="px-4 py-3">
                      {u.depositPaid ? (
                        <CheckCircle size={15} className="text-green-400" />
                      ) : (
                        <span className="text-[10px] text-gray-600 font-bold">
                          Non
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {u.createdAt || "—"}
                    </td>
                    <td className="px-4 py-3">
                      {u.role !== "ADMIN" ? (
                        <button
                          onClick={() => handleDelete(u)}
                          className="p-2 rounded-xl text-red-500/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      ) : (
                        <span className="text-gray-700 text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal confirmation suppression */}
      {toDelete && (
        <ConfirmDeleteModal
          user={toDelete}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </main>
  );
}
