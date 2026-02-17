import { useState } from "react";

import { Package, X, Menu } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

function Navbar({ currentUser, logout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Accueil" },

    { to: "/sourcing", label: "Sourcing" },

    { to: "/marketplace", label: "Marketplace" },

    { to: "/dashboard", label: "Suivi" },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 h-30 flex items-center justify-between px-6 lg:px-10">
        {/* Logo */}

        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="bg-[#D4AF37] p-2 rounded-lg">
            <Package className="text-black" size={22} />
          </div>

          <div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none">
              BJ<span className="text-[#D4AF37]">BUSINESS</span>
            </h1>

            <p className="text-[12px] text-gray-500 font-bold uppercase tracking-[0.2em]">
              La qualité à moindre coût
            </p>
          </div>
        </Link>

        {/* Liens desktop */}

        <div className="hidden md:flex gap-8 text-base font-bold uppercase tracking-widest text-gray-400">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} className="nav-link">
              {label}

              {pathname === to && <span className="nav-dot" />}
            </Link>
          ))}
        </div>

        {/* Bouton connexion desktop */}

        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <>
              <Link
                to="/dashboard"
                className="btn-gold px-5 py-2 rounded-lg text-xs"
              >
                Dashboard
              </Link>

              <button
                onClick={logout}
                className="text-red-500 px-4 py-2 rounded-lg border border-red-500/30 text-xs font-bold hover:bg-red-500/10 transition"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-connexion px-6 py-3 rounded-xl text-xs"
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

      {/* Menu mobile plein écran */}

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0B]/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              className="text-2xl font-black uppercase tracking-widest text-white hover:text-[#D4AF37] transition"
            >
              {label}
            </Link>
          ))}

          <div className="mt-6">
            {currentUser ? (
              <button
                onClick={() => {
                  logout();

                  setMenuOpen(false);
                }}
                className="text-red-500 text-sm font-bold uppercase tracking-widest"
              >
                Déconnexion
              </button>
            ) : (
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
