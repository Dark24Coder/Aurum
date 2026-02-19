import { useState } from "react";
import { Package, X, Menu, LayoutDashboard, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const { currentUser, logout, isAdmin } = useAuth();

  const links = [
    { to: "/", label: "Accueil" },
    { to: "/sourcing", label: "Sourcing" },
    { to: "/marketplace", label: "Marketplace" },
    { to: "/suivi", label: "Suivi" },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 h-20 bg-[#0A0A0B]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="bg-[#D4AF37] p-2 rounded-lg">
            <Package className="text-black" size={22} />
          </div>
          <div>
            <h1 className="text-[19px] font-black text-white tracking-tighter leading-none">
              BJ<span className="text-[#D4AF37]">BUSINESS</span>
            </h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
              La qualité à moindre coût
            </p>
          </div>
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative hover:text-white transition-colors ${pathname === to ? "text-[#D4AF37]" : ""}`}
            >
              {label}
              {pathname === to && (
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#D4AF37] rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Espace Utilisateur Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3 bg-white/5 p-1 pr-4 rounded-full border border-white/10">
              <Link
                to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                className="bg-[#D4AF37] text-black px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 hover:bg-white transition-all"
              >
                <LayoutDashboard size={14} />
                Mon Espace
              </Link>
              <button
                onClick={logout}
                className="text-gray-500 hover:text-red-500 transition-colors"
                title="Déconnexion"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            /* RÉINTÉGRATION DE L'ANCIEN COMPORTEMENT */
            <Link
              to="/login"
              className="btn-connexion px-6 py-3 rounded-xl text-[10px]"
            >
              <span>Connexion</span>
            </Link>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0B] flex flex-col items-center justify-center gap-8 md:hidden">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-tighter text-white hover:text-[#D4AF37] transition"
            >
              {label}
            </Link>
          ))}
          <div className="mt-10 flex flex-col items-center gap-6">
            {currentUser ? (
              <>
                <Link
                  to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#D4AF37] text-lg font-black uppercase tracking-widest"
                >
                  Aller au Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="text-red-500 text-xs font-bold uppercase tracking-[0.2em]"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              /* RÉINTÉGRATION DE L'ANCIEN COMPORTEMENT MOBILE */
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-gold px-10 py-3 rounded-xl text-sm"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
