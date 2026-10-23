import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { settingsApi } from "../services/api";
import { ThemeContext } from "./ThemeContextInstance";

export const ThemeProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();

  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem("codetrack_theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  // Apply theme attribute to html root element
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("codetrack_theme", theme);
  }, [theme]);

  const setTheme = (newTheme) => {
    const target = newTheme === "light" ? "light" : "dark";
    setThemeState(target);
    document.documentElement.setAttribute("data-theme", target);
    localStorage.setItem("codetrack_theme", target);

    if (isAuthenticated) {
      settingsApi.updateSettings({ theme: target }).catch((err) => {
        console.warn("Failed to persist theme to server:", err.message);
      });
    }
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
