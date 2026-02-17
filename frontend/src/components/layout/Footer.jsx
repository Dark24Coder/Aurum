import { Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#0A0A0B] border-t border-white/5 pt-14 pb-8 px-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
        {/* Logo + desc */}
        <div>
          <h3 className="text-[22px] text-white font-black mb-2">
            BJ<span className="text-[#D4AF37]">BUSINESS</span>
          </h3>
          <p className="text-gray-500 text-base leading-relaxed">
            Votre partenaire premium pour le sourcing et la logistique
            Chine-Afrique. Qualité, Transparence, Sécurité.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-[15px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-base text-gray-400">
            {[
              { to: "/", label: "Accueil" },
              { to: "/sourcing", label: "Sourcing" },
              { to: "/marketplace", label: "Marketplace" },
              { to: "/groupage", label: "Groupages" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="hover:text-[#D4AF37] transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Légal */}
        <div>
          <h4 className="text-[15px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">
            Légal
          </h4>
          <ul className="space-y-2.5 text-base text-gray-400">
            {[
              { to: "/terms", label: "Conditions Générales" },
              { to: "/kyc-policy", label: "Politique KYC" },
              { to: "/privacy", label: "Confidentialité" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="hover:text-[#D4AF37] transition-colors duration-200"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[15px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">
            Contact
          </h4>
          <ul className="space-y-2.5 text-base text-gray-400">
            <li className="flex items-center gap-2">
              <Mail size={20} className="text-[#D4AF37] shrink-0" />
              contact@bjbusiness.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={20} className="text-[#D4AF37] shrink-0" />
              +229 01 51 38 77 89
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={20} className="text-[#D4AF37] shrink-0" />
              Cotonou, Bénin
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 pt-5 border-t border-white/5 text-center text-base text-gray-700">
        © 2026 BJBUSINESS. Tous droits réservés.
      </div>
    </footer>
  );
}

export default Footer;
