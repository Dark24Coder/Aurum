/* eslint-disable no-unused-vars */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./index.css";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AIChat from "./components/shared/AIChat";

import Home from "./pages/Home";
import Sourcing from "./pages/Sourcing";
import Marketplace from "./pages/Marketplace";
import Groupage from "./pages/Groupage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/shared/ProtectedRoute";

function AnimatedRoutes({ currentUser, setCurrentUser, logout }) {
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
          {/* Routes Publiques */}
          <Route path="/" element={<Home />} />
          <Route
            path="/sourcing"
            element={<Sourcing currentUser={currentUser} />}
          />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/groupage" element={<Groupage />} />
          <Route
            path="/login"
            element={<Login setCurrentUser={setCurrentUser} />}
          />
          <Route
            path="/register"
            element={<Register setCurrentUser={setCurrentUser} />}
          />

          {/* Route Protégée */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={currentUser}>
                <Dashboard currentUser={currentUser} logout={logout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const logout = () => setCurrentUser(null);

  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0B] text-white selection:bg-[#D4AF37]/30">
        <Navbar currentUser={currentUser} logout={logout} />

        <main className="pt-20">
          <AnimatedRoutes
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            logout={logout}
          />
        </main>

        <Footer />
        <AIChat />
      </div>
    </Router>
  );
}

export default App;
