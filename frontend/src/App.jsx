/* eslint-disable no-unused-vars */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import "./index.css";

// Context & Guards
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/shared/ProtectedRoute";

// Layouts & UI
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AIChat from "./components/shared/AIChat";

// Pages
import Home from "./pages/Home";
import Sourcing from "./pages/Sourcing";
import Marketplace from "./pages/Marketplace";
import Groupage from "./pages/Groupage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard
import UserLayout from "./pages/dashboard/user/UserLayout.jsx";
import AdminLayout from "./pages/dashboard/admin/AdminLayout";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Routes location={location}>
          {/* --- Routes Publiques --- */}
          <Route path="/" element={<Home />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/groupage" element={<Groupage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* --- Dashboard User ---
              ✅ FIX : chaque route est indépendante avec son propre ProtectedRoute.
              Plus de parent/enfant avec DashboardGuard qui bloquait l'affichage.
          */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute role="CLIENT">
                <UserLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          />

          {/* --- Fallback /dashboard → redirection selon rôle --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                {/* DashboardGuard navigue vers /dashboard/user ou /dashboard/admin */}
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

// Petit composant de redirection inline — évite d'importer DashboardGuard
function DashboardRedirect() {
  // eslint-disable-next-line no-undef
  const { isAdmin } = require("./context/useAuth").useAuth();
  // eslint-disable-next-line no-undef
  const { Navigate } = require("react-router-dom");
  return (
    <Navigate to={isAdmin ? "/dashboard/admin" : "/dashboard/user"} replace />
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-[#D4AF37]/30">
          <Navbar />
          <main className="pt-20">
            <AnimatedRoutes />
          </main>
          <Footer />
          <AIChat />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
