import { useTranslation } from "react-i18next";

export const EVALUATIONS = [
  { id: "excellent",    emoji: "🤝", label: "Excellent travail",    color: "#10b981" },
  { id: "retard",       emoji: "⏰", label: "Travail en retard",    color: "#ef4444" },
  { id: "rapide",       emoji: "⚡", label: "Travail rapide",       color: "#3b82f6" },
  { id: "satisfaisant", emoji: "👍", label: "Travail satisfaisant", color: "#f59e0b" },
];

const trouver = (id) => EVALUATIONS.find((e) => e.id === id);

export function EvaluationBadge({ value, style = {} }) {
  const { t } = useTranslation();
  const e = trouver(value);
  if (!e) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 999,
      fontSize: 12.5, fontWeight: 700, color: e.color, backgroundColor: e.color + "18",
      border: "1px solid " + e.color + "44", ...style }}>
      <span style={{ fontSize: 15 }}>{e.emoji}</span>{t(e.label)}
    </span>
  );
}

export function EvaluationChoix({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div style={{ width: "100%" }} onClick={(e) => e.stopPropagation()}>
      <div style={{ color: "var(--d-c-aaa)", fontSize: 12, marginBottom: 8 }}>
        {t("Évaluez le service pour pouvoir terminer la mission :")}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {EVALUATIONS.map((e) => {
          const sel = value === e.id;
          return (
            <button key={e.id} type="button" onClick={() => onChange(e.id)}
              style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 14px", borderRadius: 12,
                cursor: "pointer", fontSize: 13, fontWeight: 700,
                color: sel ? e.color : "var(--d-text)",
                backgroundColor: sel ? e.color + "22" : "var(--d-bg2)",
                border: sel ? "2px solid " + e.color : "1px solid var(--d-border)",
                transition: "all 0.15s ease" }}>
              <span style={{ fontSize: 18 }}>{e.emoji}</span>{t(e.label)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
