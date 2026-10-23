import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import EtoilesAvecTrophees from "../pages/etoiles/EtoilesAvecTrophees";

const API = "https://projet-iraky-delivery.onrender.com/api/coursiers-pour-commande";

function Avatar({ photo, nom }) {
  const [ko, setKo] = useState(false);
  const ini = nom.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();
  return (
    <span style={{ width: 42, height: 42, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14,
      background: "linear-gradient(135deg,var(--d-gold),#ff8c00)", color: "#000" }}>
      {photo && !ko
        ? <img src={photo} alt="" onError={() => setKo(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : ini}
    </span>
  );
}


export default function CoursierPicker({ mode, coursierId, onMode, onPick }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    if (mode !== "choisir" || data) return;
    fetch(API, { headers: { Authorization: "Bearer " + localStorage.getItem("token"), Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setErreur(true));
  }, [mode, data]);

  const groupes = data ? [
    [t("Les meilleurs coursiers"), data.top, "🏆"],
    [t("Vos coursiers habituels"), data.habituels, "🤝"],
    [t("Autres coursiers"), data.autres, ""],
  ].filter(([, l]) => l.length > 0) : [];

  const gris = { color: "var(--d-c-aaa)", fontSize: 12 };

  return (
    <div>
      <label style={{ color: "var(--d-gold)", fontSize: 13, fontWeight: 700, display: "block", marginBottom: 12 }}>
        {t("Qui doit réaliser votre commande ?")}
      </label>

      <select value={mode} onChange={(e) => { onMode(e.target.value); if (e.target.value === "tous") onPick(null); }}
        style={{ width: "100%", padding: "12px 14px", borderRadius: 12, fontSize: 14, cursor: "pointer",
          backgroundColor: "var(--d-bg2)", color: "var(--d-text)", border: "1px solid var(--d-border)" }}>
        <option value="tous">{t("Publier pour tous les coursiers")}</option>
        <option value="choisir">{t("Choisir un coursier")}</option>
      </select>

      <div style={{ ...gris, fontSize: 12.5, marginTop: 8 }}>
        {mode === "tous"
          ? t("Tous les coursiers recevront une notification.")
          : t("Le coursier choisi recevra votre commande directement (statut Accepté).")}
      </div>

      {mode === "choisir" && (
        <div style={{ marginTop: 14, maxHeight: 380, overflowY: "auto", borderRadius: 12,
          border: "1px solid var(--d-border)", backgroundColor: "var(--d-bg2)" }}>
          {!data && !erreur && <div style={{ padding: 16, ...gris, fontSize: 13 }}>{t("Chargement…")}</div>}
          {erreur && <div style={{ padding: 16, color: "#ef4444", fontSize: 13 }}>{t("Erreur de connexion au serveur")}</div>}
          {data && groupes.length === 0 && (
            <div style={{ padding: 16, ...gris, fontSize: 13 }}>{t("Aucun coursier disponible pour le moment.")}</div>
          )}
          {groupes.map(([titre, liste, ico]) => (
            <div key={titre}>
              <div style={{ position: "sticky", top: 0, zIndex: 1, padding: "8px 14px", fontSize: 11.5, fontWeight: 800,
                letterSpacing: 0.5, color: "var(--d-gold)", backgroundColor: "var(--d-card3)" }}>
                {ico ? ico + " " : ""}{titre.toUpperCase()}
              </div>
              {liste.map((c) => {
                const sel = coursierId === c.id;
                return (
                  <div key={c.id} onClick={() => onPick(c.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer",
                      borderLeft: sel ? "4px solid var(--d-gold)" : "4px solid transparent",
                      backgroundColor: sel ? "#FFD70014" : "transparent", borderBottom: "1px solid var(--d-border)" }}>
                    <Avatar photo={c.photo_profil} nom={c.nom_complet} />
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <span style={{ color: "var(--d-text)", fontWeight: 700, fontSize: 14 }}>{c.nom_complet}</span>
                        
                      </span>
                      <span style={{ display: "block", ...gris, marginTop: 2 }}>
                        <span style={{ display:"inline-block", verticalAlign:"middle", marginRight:6 }}><EtoilesAvecTrophees trophees={c.trophees} etoilesActuelles={c.etoiles} size={14} /></span>· {t("{{n}} missions", { n: c.nb_missions })} · {t("{{n}} terminées", { n: c.nb_terminees })}
                      </span>
                    </span>
                    {sel && <span style={{ color: "var(--d-gold)", fontWeight: 800 }}>✓</span>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
