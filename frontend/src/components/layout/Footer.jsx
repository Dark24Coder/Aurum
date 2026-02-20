// src/components/layout/Footer.jsx
import { useState } from "react";
import { Mail, Phone, ChevronDown, Facebook, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (s) => setOpenSection(openSection === s ? null : s);

  const sections = {
    navigation: [
      { to: "/", label: "Accueil" },
      { to: "/sourcing", label: "Sourcing" },
      { to: "/marketplace", label: "Marketplace" },
      { to: "/groupage", label: "Groupages" },
    ],
    legal: [
      { to: "/terms", label: "Conditions" },
      { to: "/kyc-policy", label: "KYC" },
      { to: "/privacy", label: "Confidentialité" },
    ],
  };

  return (
    <footer className="bg-[#0A0A0B] border-t border-white/5 pt-8 pb-6 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ══════════════════════════════════════════════════════════════
            MOBILE  (<md)  : accordéon vertical — espacement réduit
            TABLETTE (md)  : logo centré | 3 colonnes de liens | socials
            DESKTOP  (lg+) : row, inchangé
        ══════════════════════════════════════════════════════════════ */}

        {/* ── MOBILE & DESKTOP : layout original ── */}
        <div
          className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-8
                        md:hidden lg:flex"
        >
          {/* Logo */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left mb-6 lg:mb-0 lg:max-w-[280px]">
            <h3 className="text-xl text-white font-black tracking-tighter uppercase mb-2">
              BJ<span className="text-[#D4AF37]">BUSINESS</span>
            </h3>
            <p className="text-gray-500 text-[13px] leading-relaxed font-bold">
              Sourcing et logistique Chine-Afrique. Qualité, Transparence,
              Sécurité.
            </p>
          </div>

          {/* Navigation — mobile accordéon */}
          <div className="border-y lg:border-none border-white/5 w-full lg:w-auto">
            <button
              onClick={() => toggleSection("nav")}
              className="w-full flex justify-between items-center py-4 lg:py-0 lg:mb-4"
            >
              <h4 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">
                Navigation
              </h4>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform lg:hidden ${openSection === "nav" ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`${openSection === "nav" ? "flex" : "hidden"} lg:flex flex-col space-y-2.5 pb-5 lg:pb-0 text-[12px] text-gray-400 font-bold`}
            >
              {sections.navigation.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal — mobile accordéon */}
          <div className="border-b lg:border-none border-white/5 w-full lg:w-auto">
            <button
              onClick={() => toggleSection("legal")}
              className="w-full flex justify-between items-center py-4 lg:py-0 lg:mb-4"
            >
              <h4 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">
                Légal
              </h4>
              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform lg:hidden ${openSection === "legal" ? "rotate-180" : ""}`}
              />
            </button>
            <ul
              className={`${openSection === "legal" ? "flex" : "hidden"} lg:flex flex-col space-y-2.5 pb-5 lg:pb-0 text-[12px] text-gray-400 font-bold`}
            >
              {sections.legal.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="w-full lg:w-auto">
            <div className="py-4 lg:py-0 lg:mb-4 text-center lg:text-left">
              <h4 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">
                Contact
              </h4>
            </div>
            <ul className="flex flex-col space-y-2.5 pb-5 lg:pb-0 text-[13px] text-gray-400 font-bold">
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <Mail size={14} className="text-[#D4AF37]" />{" "}
                contact@bjbusiness.com
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <Phone size={14} className="text-[#D4AF37]" /> +229 01 51 38 77
                89
              </li>
            </ul>
          </div>
        </div>

        {/* ── TABLETTE (md uniquement, masqué en lg+) ── */}
        <div className="hidden md:block lg:hidden">
          {/* Logo centré */}
          <div className="text-center mb-6">
            <h3 className="text-xl text-white font-black tracking-tighter uppercase mb-2">
              BJ<span className="text-[#D4AF37]">BUSINESS</span>
            </h3>
            <p className="text-gray-500 text-[12px] leading-relaxed max-w-xs mx-auto">
              Sourcing et logistique Chine-Afrique. Qualité, Transparence,
              Sécurité.
            </p>
          </div>

          {/* 3 colonnes : Navigation | Légal | Contact */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <h4 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-3">
                Navigation
              </h4>
              <ul className="flex flex-col space-y-2 text-[12px] text-gray-400 font-bold">
                {sections.navigation.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-3">
                Légal
              </h4>
              <ul className="flex flex-col space-y-2 text-[12px] text-gray-400 font-bold">
                {sections.legal.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[11px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-3">
                Contact
              </h4>
              <ul className="flex flex-col space-y-2 text-[12px] text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail size={13} className="text-[#D4AF37] flex-shrink-0" />{" "}
                  contact@bjbusiness.com
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={13} className="text-[#D4AF37] flex-shrink-0" />{" "}
                  +229 01 51 38 77 89
                </li>
              </ul>
            </div>
          </div>

          {/* Socials + copyright */}
          <div className="border-t border-white/5 pt-5 flex flex-col items-center gap-3">
            <div className="flex gap-5">
              <Facebook
                size={16}
                className="text-gray-600 hover:text-[#D4AF37] cursor-pointer transition-colors"
              />
              <Instagram
                size={16}
                className="text-gray-600 hover:text-[#D4AF37] cursor-pointer transition-colors"
              />
            </div>
            <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest text-center">
              © 2026 BJBUSINESS. TOUS DROITS RÉSERVÉS.
            </p>
          </div>
        </div>

        {/* ── BAS DU FOOTER : mobile + desktop (tablette a le sien au-dessus) ── */}
        <div className="md:hidden lg:block mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3">
          <div className="flex gap-6">
            <Facebook
              size={16}
              className="text-gray-600 hover:text-[#D4AF37] cursor-pointer transition-colors"
            />
            <Instagram
              size={16}
              className="text-gray-600 hover:text-[#D4AF37] cursor-pointer transition-colors"
            />
          </div>
          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-widest text-center">
            © 2026 BJBUSINESS. TOUS DROITS RÉSERVÉS.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
