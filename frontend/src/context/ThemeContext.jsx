// src/context/ThemeContext.jsx
// Toggle entre "dark" (noir total) et "gold" (reflets dorés renforcés)
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("bjb_theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("bjb_theme", theme);
    } catch {
      /* empty */
    }
    // Applique la classe sur <html> pour que Tailwind dark: fonctionne
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "gold" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggle, isGold: theme === "gold" }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme doit être dans <ThemeProvider>");
  return ctx;
}
