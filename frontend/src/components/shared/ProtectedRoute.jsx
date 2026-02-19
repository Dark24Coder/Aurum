import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, currentUser, loading } = useAuth();

  // 1️⃣ Loader pendant vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <Loader2 className="text-[#D4AF37] animate-spin" size={32} />
      </div>
    );
  }

  // 2️⃣ Non connecté → Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ Mauvais rôle → Redirection intelligente
  if (role && currentUser.role !== role) {
    if (currentUser.role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
