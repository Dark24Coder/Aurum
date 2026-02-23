import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Loader2 } from "lucide-react";

const DashboardGuard = () => {
  const { isAdmin, authLoading } = useAuth();

  // 1. Si le contexte charge encore les données, on affiche un loader
  if (authLoading) {
    return (
      <main className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="text-[#D4AF37] animate-spin" size={40} />
      </main>
    );
  }

  // 2. Redirection selon le rôle
  // isAdmin est calculé dans ton AuthContext (currentUser?.role === 'ADMIN')
  if (isAdmin) {
    return <Navigate to="/dashboard/admin" replace />;
  }

  return <Navigate to="/dashboard/user" replace />;
};

export default DashboardGuard;
