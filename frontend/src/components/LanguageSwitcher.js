import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdTranslate, MdKeyboardArrowDown, MdCheck } from "react-icons/md";

const LANGUES = [
  { code: "fr", court: "FR", nom: "Français" },
  { code: "en", court: "EN", nom: "English" },
  { code: "mg", court: "MG", nom: "Malagasy" },
];

function Drapeau({ code }) {
  let contenu;
  if (code === "fr") {
    contenu = (
      <svg viewBox="0 0 3 2" width="22" height="15" preserveAspectRatio="none" aria-hidden="true">
        <rect width="1" height="2" fill="#0055A4" />
        <rect x="1" width="1" height="2" fill="#FFFFFF" />
        <rect x="2" width="1" height="2" fill="#EF4135" />
      </svg>
    );
  } else if (code === "mg") {
    contenu = (
      <svg viewBox="0 0 3 2" width="22" height="15" preserveAspectRatio="none" aria-hidden="true">
        <rect width="1" height="2" fill="#FFFFFF" />
        <rect x="1" width="2" height="1" fill="#FC3D32" />
        <rect x="1" y="1" width="2" height="1" fill="#007E3A" />
      </svg>
    );
  } else {
    contenu = (
      <svg viewBox="0 0 60 30" width="22" height="15" preserveAspectRatio="none" aria-hidden="true">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2.5" />
        <path d="M30,0 V30 M0,15 H60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    );
  }
  return (
    <span style={{ display: "inline-flex", width: 22, height: 15, borderRadius: 3, overflow: "hidden",
      border: "1px solid #ffffff30", flexShrink: 0 }}>
      {contenu}
    </span>
  );
}

export default function LanguageSwitcher({ style = {} }) {
  const { i18n } = useTranslation();
  const actuelle = (i18n.resolvedLanguage || i18n.language || "fr").slice(0, 2);
  const courante = LANGUES.find((l) => l.code === actuelle) || LANGUES[0];
  const [ouvert, setOuvert] = useState(false);
  const [aligne, setAligne] = useState({ right: 0 });
  const racine = useRef(null);
  const bouton = useRef(null);

  const basculer = () => {
    if (!ouvert && bouton.current) {
      const r = bouton.current.getBoundingClientRect();
      setAligne(r.right >= 180 ? { right: 0 } : { left: 0 });
    }
    setOuvert(!ouvert);
  };

  useEffect(() => {
    if (!ouvert) return undefined;
    const fermer = () => setOuvert(false);
    const clic = (e) => { if (racine.current && !racine.current.contains(e.target)) fermer(); };
    const touche = (e) => { if (e.key === "Escape") fermer(); };
    document.addEventListener("mousedown", clic);
    document.addEventListener("touchstart", clic);
    document.addEventListener("keydown", touche);
    window.addEventListener("resize", fermer);
    return () => {
      document.removeEventListener("mousedown", clic);
      document.removeEventListener("touchstart", clic);
      document.removeEventListener("keydown", touche);
      window.removeEventListener("resize", fermer);
    };
  }, [ouvert]);

  return (
    <div ref={racine} style={{ position: "relative", display: "inline-block", ...style }}>
      <button ref={bouton} type="button" aria-haspopup="listbox" aria-expanded={ouvert} onClick={basculer}
        style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 9px", borderRadius: 16,
          fontSize: 12, fontWeight: 700, cursor: "pointer", border: "1px solid #FFD70055",
          backgroundColor: "#FFD70014", color: "#FFD700" }}>
        <MdTranslate style={{ fontSize: 16 }} />
        <Drapeau code={courante.code} />
        <span>{courante.court}</span>
        <MdKeyboardArrowDown style={{ fontSize: 16, transition: "transform 0.2s",
          transform: ouvert ? "rotate(180deg)" : "none" }} />
      </button>

      {ouvert && (
        <ul role="listbox" style={{ position: "absolute", top: "calc(100% + 6px)", ...aligne, zIndex: 3000,
          margin: 0, padding: 6, listStyle: "none", minWidth: 160, backgroundColor: "#131330",
          border: "1px solid #FFD70033", borderRadius: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.5)" }}>
          {LANGUES.map((l) => {
            const actif = l.code === actuelle;
            return (
              <li key={l.code} role="option" aria-selected={actif}>
                <button type="button" onClick={() => { i18n.changeLanguage(l.code); setOuvert(false); }}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
                    border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", fontSize: 13,
                    fontWeight: actif ? 700 : 500, backgroundColor: actif ? "#FFD70022" : "transparent",
                    color: actif ? "#FFD700" : "#ddd" }}>
                  <Drapeau code={l.code} />
                  <span style={{ flex: 1 }}>{l.nom}</span>
                  {actif && <MdCheck style={{ fontSize: 16 }} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
