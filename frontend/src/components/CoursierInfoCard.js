import { useState } from "react";
import { useTranslation } from "react-i18next";
import EtoilesAvecTrophees from "../pages/etoiles/EtoilesAvecTrophees";

function initiales(nom) {
  const parts = String(nom || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const a = parts[0][0] || "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase();
}

export default function CoursierInfoCard({ cmd, onOpen }) {
  const { t } = useTranslation();
  const [imgErreur, setImgErreur] = useState(false);
  const nb = Number(cmd.coursier_nb_terminees || 0);
  const afficherPhoto = !!cmd.coursier_photo && !imgErreur;

  return (
    <div
      onClick={(e) => { e.stopPropagation(); if (onOpen && cmd.coursier_id) onOpen(cmd.coursier_id); }}
      style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4, padding: "10px 12px",
        borderRadius: 12, border: "1px solid #FFD70030", backgroundColor: "#FFD70008",
        cursor: onOpen ? "pointer" : "default", maxWidth: 380 }}>
      {afficherPhoto ? (
        <img src={cmd.coursier_photo} alt="" onError={() => setImgErreur(true)}
          style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
            border: "2px solid #FFD70055" }} />
      ) : (
        <div style={{ width: 46, height: 46, borderRadius: "50%", flexShrink: 0,
          background: "linear-gradient(135deg,#FFD700,#ff8c00)", display: "flex", alignItems: "center",
          justifyContent: "center", fontWeight: 800, color: "#000", fontSize: 16 }}>
          {initiales(cmd.coursier)}
        </div>
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, color: "var(--d-gold)", fontSize: 14, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cmd.coursier}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 3, fontSize: 12 }}>
          <span style={{ color: "#10b981", fontWeight: 700 }}>
            {t("{{n}} missions", { n: Number(cmd.coursier_nb_missions || 0) })} · {nb <= 1 ? t("{{nb}} mission terminée", { nb }) : t("{{nb}} missions terminées", { nb })}
          </span>
          <EtoilesAvecTrophees trophees={Number(cmd.coursier_trophees || 0)} etoilesActuelles={Number(cmd.coursier_etoiles || 0)} size={14} />
        </div>
      </div>
    </div>
  );
}
