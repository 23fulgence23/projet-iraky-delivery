import { FiSun } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useTheme from "../hooks/useTheme";

export default function ThemeToggle({ size = 38, style = {} }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label={t("Changer de thème")}
      title={t("Mode clair / sombre")}
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        border: "1.5px solid var(--iraky-gold-line)", backgroundColor: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--iraky-gold)", cursor: "pointer", transition: "all 0.2s ease",
        ...style,
      }}
    >
      {theme === "dark"
        ? <FiSun size={Math.round(size * 0.5)} />
        : <i className="fas fa-moon" style={{ fontSize: Math.round(size * 0.37) }}></i>}
    </button>
  );
}
