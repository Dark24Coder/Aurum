import { useState, useEffect } from "react";
import {
  Send,
  X,
  MessageCircle,
  Headset,
  Zap,
  User,
  Bot,
  Sparkles,
} from "lucide-react";

function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Bonjour ! Je suis l'assistante intelligente de BJ Business. Comment puis-je orienter votre projet aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState("");

  // Gestion des icônes tournantes (toutes les 5s)
  const [iconIndex, setIconIndex] = useState(0);
  const icons = [
    <Headset size={20} className="text-black" />,
    <User size={20} className="text-black" />,
    <Bot size={20} className="text-black" />,
    <Zap size={20} className="text-black" />,
    <Sparkles size={20} className="text-black" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 5000); // 5 secondes
    return () => clearInterval(interval);
  }, [icons.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.toLowerCase();
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      let aiResponse =
        "C'est noté. Souhaitez-vous des précisions sur le Sourcing ou la Logistique ?";
      let showWhatsApp = false;

      if (userText.includes("sourcing") || userText.includes("recherche")) {
        aiResponse =
          "Le Sourcing Premium vous permet de trouver des usines fiables. Une caution de 10.000 FCFA est requise pour lancer nos agents.";
      } else if (
        userText.includes("logistique") ||
        userText.includes("envoi") ||
        userText.includes("voiture")
      ) {
        aiResponse =
          "Notre service Logistique s'occupe du transport de vos marchandises en toute sécurité.";
      } else if (
        userText.includes("humain") ||
        userText.includes("gerant") ||
        userText.includes("payer") ||
        userText.includes("whatsapp")
      ) {
        aiResponse =
          "Je comprends. Pour finaliser les détails ou parler à un humain, nos gérants sont disponibles sur WhatsApp.";
        showWhatsApp = true;
      }
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: aiResponse, isLink: showWhatsApp },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div
          className="w-80 rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-fade-in-up"
          style={{ background: "#111112" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b border-white/10"
            style={{ background: "#161617" }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-[#D4AF37] flex items-center justify-center animate-morph">
                  {icons[iconIndex]}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#161617] rounded-full"></span>
              </div>
              <div>
                <p className="text-white text-[11px] font-black uppercase tracking-tighter">
                  Assistante BJ
                </p>
                <p className="text-[#D4AF37] text-[9px] font-bold uppercase tracking-widest opacity-80 italic">
                  Intelligence Artificielle
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white transition p-1"
            >
              <X size={18} />
            </button>
          </div>

          <div className="h-72 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[11px] leading-relaxed ${m.role === "user" ? "bg-[#D4AF37] text-black font-bold rounded-tr-none" : "bg-white/5 text-gray-300 border border-white/5 rounded-tl-none"}`}
                >
                  {m.text}
                  {m.isLink && (
                    <a
                      href="https://wa.me/22890000000"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex items-center gap-2 bg-[#25D366] text-white p-2 rounded-xl text-center justify-center hover:scale-105 transition-all font-black uppercase text-[9px]"
                    >
                      <Zap size={10} fill="white" /> Parler au Gérant
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div
            className="p-4 border-t border-white/5"
            style={{ background: "#161617" }}
          >
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Écrivez ici..."
                className="flex-1 bg-transparent text-white text-[11px] outline-none placeholder:text-gray-600"
              />
              <button
                onClick={handleSend}
                className="text-[#D4AF37] hover:scale-110 transition-transform"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden shadow-[#D4AF37]/20"
        style={{ background: "#D4AF37" }}
      >
        <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
        <MessageCircle
          size={26}
          className="text-black transition-all duration-300 group-hover:scale-0 absolute"
        />
        <Headset
          size={28}
          className="text-black transition-all duration-300 scale-0 group-hover:scale-100 absolute"
        />
      </button>
    </div>
  );
}

export default AIChat;
