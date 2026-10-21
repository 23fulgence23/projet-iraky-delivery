import { useState, useEffect, useCallback } from "react";

const KEY = "iraky-theme";
const EVENT = "iraky-theme-change";

function read() {
  try {
    return localStorage.getItem(KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try { localStorage.setItem(KEY, theme); } catch {}
}

export default function useTheme() {
  const [theme, setTheme] = useState(read);

  useEffect(() => {
    applyTheme(theme);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: theme }));
  }, [theme]);

  // Synchronise plusieurs boutons présents en même temps
  useEffect(() => {
    const h = (e) => setTheme(e.detail);
    window.addEventListener(EVENT, h);
    return () => window.removeEventListener(EVENT, h);
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return { theme, toggleTheme };
}
