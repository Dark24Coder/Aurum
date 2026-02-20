// src/components/shared/ProtectedRoute.jsx
// ✅ Gère le loading pendant la lecture localStorage au démarrage
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, currentUser, authLoading } = useAuth();

  // Pendant la lecture initiale de localStorage → loader
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="text-[#D4AF37] animate-spin" size={32} />
      </div>
    );
  }

  // Non connecté → Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Mauvais rôle → redirection
  if (role && currentUser?.role !== role) {
    return (
      <Navigate
        to={
          currentUser?.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"
        }
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
