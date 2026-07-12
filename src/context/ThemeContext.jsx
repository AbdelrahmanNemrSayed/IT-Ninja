import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("it-ninja-theme") || "stealth";
  });

  useEffect(() => {
    localStorage.setItem("it-ninja-theme", theme);
    
    // Apply class to HTML root
    const root = document.documentElement;
    root.classList.remove("theme-stealth", "theme-matrix", "theme-cyberpunk");
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
