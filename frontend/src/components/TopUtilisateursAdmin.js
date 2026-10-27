import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdEmojiEvents, MdStar, MdCheckCircle, MdAccessTime, MdDeliveryDining, MdPeople } from "react-icons/md";

const carte = {
  backgroundColor: "var(--d-card, #131330)", border: "1px solid var(--d-border, #FFD70025)",
  borderRadius: 16, padding: 18, height: "100%", boxSizing: "border-box",
};

const initiales = (prenom, nom) => ((prenom || "?")[0] + (nom || "?")[0]).toUpperCase();

function Pastille({ Icone, couleur, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 700, color: couleur, backgroundColor: `${couleur}18`, border: `1px solid ${couleur}40` }}>
      <Icone style={{ fontSize: 14 }} /> {children}
    </span>
  );
}

function Fiche({ titre, Icone, couleur, degrade, personne, children }) {
  return (
    <div style={{ padding: 14, borderRadius: 14, border: `1px solid ${couleur}33`, backgroundColor: `${couleur}08` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: couleur, fontWeight: 800, fontSize: 11,
        letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>
        <Icone style={{ fontSize: 16 }} /> {titre}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: degrade, display: "flex",
          alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#000", fontSize: 17, flexShrink: 0 }}>
          {initiales(personne.prenom, personne.nom)}
        </div>
        <div style={{ color: "var(--d-text, #fff)", fontWeight: 800, fontSize: 15, minWidth: 0 }}>
          {personne.prenom} {personne.nom}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function TopUtilisateursAdmin({ apiUrl }) {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [filtre, setFiltre] = useState("coursier");

  useEffect(() => {
    const charger = () => {
      fetch(`${apiUrl}/api/admin/top-utilisateurs`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Accept": "application/json" },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d) setData(d); })
        .catch(() => {});
    };
    charger();
    const iv = setInterval(charger, 5000);
    return () => clearInterval(iv);
  }, [apiUrl]);

  const c = data && data.coursier;
  const cl = data && data.client;

  let contenu;
  if (!data || (filtre === "coursier" && !c) || (filtre === "client" && !cl)) {
    contenu = <div style={{ color: "#888", fontSize: 13, padding: "12px 0" }}>{t("Aucune donnée pour le moment.")}</div>;
  } else if (filtre === "coursier") {
    contenu = (
      <Fiche titre={t("Coursier le plus actif")} Icone={MdDeliveryDining} couleur="#FFD700"
        degrade="linear-gradient(135deg,#FFD700,#ff8c00)" personne={c}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <Pastille Icone={MdCheckCircle} couleur="#10b981">{c.terminees} {t("terminées")}</Pastille>
          <Pastille Icone={MdAccessTime} couleur="#f59e0b">{c.en_cours} {t("en cours")}</Pastille>
          <Pastille Icone={MdStar} couleur="#FFD700">{c.etoiles} {t("étoiles")}</Pastille>
          <Pastille Icone={MdEmojiEvents} couleur="#8b5cf6">{c.trophees} {t("trophées")}</Pastille>
        </div>
        <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>
          {t("Prochain trophée : {{n}}/5 étoiles", { n: c.etoiles_cycle })}
        </div>
        <div style={{ height: 6, borderRadius: 6, backgroundColor: "#ffffff12", overflow: "hidden" }}>
          <div style={{ width: `${(c.etoiles_cycle / 5) * 100}%`, height: "100%", backgroundColor: "#FFD700" }} />
        </div>
      </Fiche>
    );
  } else {
    contenu = (
      <Fiche titre={t("Client le plus actif")} Icone={MdPeople} couleur="#3b82f6"
        degrade="linear-gradient(135deg,#3b82f6,#06b6d4)" personne={cl}>
        <div style={{ color: "var(--d-text, #fff)", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
          {cl.total} {t("commandes")}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Pastille Icone={MdCheckCircle} couleur="#10b981">{cl.terminees} {t("terminées")}</Pastille>
          <Pastille Icone={MdAccessTime} couleur="#f59e0b">{cl.en_cours} {t("en cours")}</Pastille>
        </div>
      </Fiche>
    );
  }

  return (
    <div style={carte}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#8b5cf618", border: "1px solid #8b5cf633",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MdEmojiEvents style={{ color: "#8b5cf6", fontSize: 20 }} />
        </div>
        <span style={{ color: "#8b5cf6", fontWeight: 700, fontSize: 15 }}>{t("Meilleurs utilisateurs")}</span>
      </div>

      <select value={filtre} onChange={(e) => setFiltre(e.target.value)} aria-label={t("Filtrer")}
        style={{ width: "100%", marginBottom: 12, padding: "9px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          cursor: "pointer", colorScheme: "dark", backgroundColor: "var(--d-card, #131330)", color: "var(--d-text, #fff)",
          border: "1px solid var(--d-border, #FFD70033)" }}>
        <option value="coursier">{t("Plus de missions (coursier)")}</option>
        <option value="client">{t("Plus de commandes (client)")}</option>
      </select>

      {contenu}
    </div>
  );
}
