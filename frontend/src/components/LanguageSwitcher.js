import { useTranslation } from "react-i18next";

const OPTIONS = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "mg", label: "MG" },
];

export default function LanguageSwitcher({ style = {} }) {
  const { i18n } = useTranslation();
  const actuelle = (i18n.resolvedLanguage || i18n.language || "fr").slice(0, 2);
  return (
    <div role="group" aria-label="Langue" style={{ display: "inline-flex", gap: 4, ...style }}>
      {OPTIONS.map((o) => {
        const actif = actuelle === o.code;
        return (
          <button key={o.code} type="button" aria-pressed={actif}
            onClick={() => i18n.changeLanguage(o.code)}
            style={{
              padding: "4px 9px", borderRadius: 14, fontSize: 12, fontWeight: 700, cursor: "pointer",
              border: actif ? "1px solid #FFD700" : "1px solid #ffffff25",
              backgroundColor: actif ? "#FFD70022" : "transparent",
              color: actif ? "#FFD700" : "#aaa",
            }}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
