// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import "./index.css";

// Context & Guards
import { AuthProvider } from "./context/AuthProvider";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import { useAuth } from "./context/useAuth";

// Layouts & UI
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AIChat from "./components/shared/AIChat";

// Pages publiques
import Home from "./pages/Home";
import Sourcing from "./pages/Sourcing";
import Marketplace from "./pages/Marketplace";
import Groupage from "./pages/Groupage";
import Suivi from "./pages/Suivi";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GalerieMarketplace from "./pages/GalerieMarketplace";

// Légales
import Terms from "./pages/legal/Terms";
import Privacy from "./pages/legal/Privacy";
import KYCPolicy from "./pages/legal/KYCPolicy";

// Dashboards
import UserLayout from "./pages/dashboard/user/UserLayout";
import AdminLayout from "./pages/dashboard/admin/AdminLayout";

// Composant d'animation de page
const MotionDiv = motion.div;
const PageWrapper = ({ children }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -12 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </MotionDiv>
);

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageWrapper key={location.pathname}>
        <Routes location={location}>
          {/* ── Publiques ── */}
          <Route path="/" element={<Home />} />
          <Route path="/sourcing" element={<Sourcing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/groupage" element={<Groupage />} />
          <Route path="/suivi" element={<Suivi />} />
          <Route path="/galerie" element={<GalerieMarketplace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── Légales ── */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/kyc-policy" element={<KYCPolicy />} />

          {/* ── Dashboards ── */}
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

          {/* ── Redirect /dashboard → bon dashboard selon rôle ── */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />
        </Routes>
      </PageWrapper>
    </AnimatePresence>
  );
}

function DashboardRedirect() {
  const { isAdmin } = useAuth();
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
