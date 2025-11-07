import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    // Update localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");

    // Update document class and CSS variables
    const root = document.documentElement;

    if (isDark) {
      root.classList.add("dark");
      root.style.setProperty("--bg", "#0b1020");
      root.style.setProperty("--text", "#f3f4f6");
      root.style.setProperty("--muted-text", "#9ca3af");
      root.style.setProperty("--card", "#1f2937");
      root.style.setProperty("--border", "#374151");
      root.style.setProperty("--surface", "#0b1020");
      root.style.setProperty("--primary", "#6366f1");
      root.style.setProperty("--primary-hover", "#5458e0");
      root.style.setProperty("--ring", "#6366f1");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--bg", "#ffffff");
      root.style.setProperty("--text", "#0f172a");
      root.style.setProperty("--muted-text", "#4b5563");
      root.style.setProperty("--card", "#ffffff");
      root.style.setProperty("--border", "#e5e7eb");
      root.style.setProperty("--surface", "#ffffff");
      root.style.setProperty("--primary", "#4f46e5");
      root.style.setProperty("--primary-hover", "#4338ca");
      root.style.setProperty("--ring", "#6366f1");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const value = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
