import { useEffect, useState } from "react";
import { MdClose, MdStar, MdStarBorder } from "react-icons/md";
import { AvatarRond } from "./AvatarProfil";

// Nom de coursier cliquable (ouvre l'aperçu). Sans id : simple texte.
export function LienCoursier({ nom, id, onOpen, style = {} }) {
  if (!id) return <span style={style}>{nom}</span>;
  const ouvrir = (e) => { e.stopPropagation(); onOpen(id); };
  return (
    <span role="button" tabIndex={0} title="Voir le profil du coursier"
      onClick={ouvrir}
      onKeyDown={(e) => { if (e.key === "Enter") ouvrir(e); }}
      style={{ cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, ...style }}>
      {nom}
    </span>
  );
}

function Etoiles5({ note }) {
  const n = Math.max(0, Math.min(5, Math.round(Number(note) || 0)));
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => i <= n
        ? <MdStar key={i} style={{ color: "#FFD700", fontSize: 20 }} />
        : <MdStarBorder key={i} style={{ color: "#555", fontSize: 20 }} />)}
    </span>
  );
}

export default function ApercuCoursierModal({ coursierId, apiUrl, onClose }) {
  const [data, setData] = useState(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    let annule = false;
    setData(null);
    setErreur("");
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}/api/coursiers/${coursierId}/apercu`, {
      headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" },
    })
      .then(async (res) => {
        const d = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(d.message || "Impossible de charger le profil.");
        return d;
      })
      .then((d) => { if (!annule) setData(d); })
      .catch((e) => { if (!annule) setErreur(e.message || "Erreur de chargement."); });
    return () => { annule = true; };
  }, [coursierId, apiUrl]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label="Profil du coursier"
      style={{ position: "fixed", inset: 0, zIndex: 3000, backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: 340, backgroundColor: "#131330",
          border: "1px solid #FFD70030", borderRadius: 18, padding: "28px 24px", textAlign: "center" }}>
        <button type="button" onClick={onClose} aria-label="Fermer"
          style={{ position: "absolute", top: 10, right: 10, background: "none", border: "none",
            color: "#888", cursor: "pointer", padding: 4, display: "flex" }}>
          <MdClose style={{ fontSize: 22 }} />
        </button>

        {!data && !erreur && <div style={{ color: "#888", padding: "30px 0" }}>Chargement du profil...</div>}
        {erreur && <div style={{ color: "#ef4444", padding: "30px 0", fontSize: 14 }}>{erreur}</div>}

        {data && (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <AvatarRond photo={data.photo_profil}
                initiales={(data.prenom?.[0] || "") + (data.nom?.[0] || "")}
                size={96} fontSize={36} style={{ boxShadow: "0 0 30px #FFD70044" }} />
            </div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>{data.prenom} {data.nom}</div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              <Etoiles5 note={data.note} />
              <span style={{ color: "#888", fontSize: 12 }}>({Math.round(Number(data.note) || 0)}/5)</span>
            </div>
            <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12,
              backgroundColor: "#0a0a1e", border: "1px solid #FFD70018" }}>
              <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 22 }}>{data.nb_terminees}</div>
              <div style={{ color: "#888", fontSize: 12 }}>
                mission{data.nb_terminees > 1 ? "s" : ""} terminée{data.nb_terminees > 1 ? "s" : ""}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
