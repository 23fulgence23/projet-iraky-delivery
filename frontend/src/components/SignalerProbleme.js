import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MdFlag, MdClose, MdCheckCircle, MdHelpOutline } from "react-icons/md";
import { MOTIFS } from "../utils/signalements";

const texte = "var(--d-text, #fff)";
const champ = {
  width: "100%", backgroundColor: "var(--d-card, #131330)", color: texte,
  border: "1px solid var(--d-border, #FFD70033)", borderRadius: 10, padding: "10px 12px",
  fontSize: 14, margin: "4px 0 14px",
};

export default function SignalerProbleme({ cmd, apiUrl, onClose }) {
  const { t } = useTranslation();
  const [etape, setEtape] = useState("confirmation"); // confirmation | formulaire
  const [motif, setMotif] = useState("");
  const [description, setDescription] = useState("");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    if (!motif || description.trim().length < 10) {
      setErreur(t("Choisissez un motif et décrivez le problème (au moins 10 caractères)."));
      return;
    }
    setEnvoi(true);
    try {
      const res = await fetch(`${apiUrl}/api/signalements`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commande_id: cmd.id, motif, description: description.trim() }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) setEnvoye(true);
      else {
        const premier = d.errors ? Object.values(d.errors)[0][0] : null;
        setErreur(t(premier || d.message || "Impossible d'envoyer le signalement."));
      }
    } catch {
      setErreur(t("Erreur de connexion au serveur"));
    }
    setEnvoi(false);
  };

  const principal = {
    padding: 12, borderRadius: 12, border: "none", fontWeight: 800, fontSize: 14,
    background: "linear-gradient(135deg,#FFD700,#ff9500)", color: "#000", cursor: "pointer",
  };
  const secondaire = {
    padding: 12, borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer",
    backgroundColor: "transparent", color: "#aaa", border: "1px solid var(--d-border, #ffffff30)",
  };

  let corps;
  if (envoye) {
    corps = (
      <div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 14, borderRadius: 12,
          backgroundColor: "#10b98118", border: "1px solid #10b98155", marginBottom: 16 }}>
          <MdCheckCircle style={{ color: "#10b981", fontSize: 24, flexShrink: 0 }} />
          <span style={{ color: "#10b981", fontWeight: 700, fontSize: 14 }}>
            {t("Signalement envoyé. L'administrateur a été notifié.")}
          </span>
        </div>
        <button type="button" onClick={onClose} style={{ ...principal, width: "100%" }}>{t("Fermer")}</button>
      </div>
    );
  } else if (etape === "confirmation") {
    corps = (
      <div>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: 14, borderRadius: 12,
          backgroundColor: "#f59e0b18", border: "1px solid #f59e0b55", marginBottom: 16 }}>
          <MdHelpOutline style={{ color: "#f59e0b", fontSize: 24, flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>
              {t("Voulez-vous vraiment signaler un problème concernant la commande #{{id}} ?", { id: cmd.id })}
            </div>
            <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
              {t("L'administrateur sera informé et pourra consulter les détails de la course.")}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={onClose} style={{ ...secondaire, flex: 1 }}>{t("Annuler")}</button>
          <button type="button" onClick={() => setEtape("formulaire")} style={{ ...principal, flex: 2 }}>{t("Oui, signaler")}</button>
        </div>
      </div>
    );
  } else {
    corps = (
      <form onSubmit={soumettre}>
        <label style={{ color: "#aaa", fontSize: 13 }}>{t("Motif")} <span style={{ color: "#ef4444" }}>*</span></label>
        <select value={motif} onChange={(e) => setMotif(e.target.value)} style={champ}>
          <option value="">{t("Choisissez un motif")}</option>
          {MOTIFS.map((m) => <option key={m.code} value={m.code}>{t(m.label)}</option>)}
        </select>

        <label style={{ color: "#aaa", fontSize: 13 }}>{t("Description du problème")} <span style={{ color: "#ef4444" }}>*</span></label>
        <textarea rows={5} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder={t("Décrivez le problème en quelques phrases (10 caractères minimum)")}
          style={{ ...champ, resize: "vertical" }} />

        {erreur && (
          <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8, fontSize: 13,
            backgroundColor: "#ef444422", color: "#ef4444" }}>{erreur}</div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={onClose} style={{ ...secondaire, flex: 1 }}>{t("Annuler")}</button>
          <button type="submit" disabled={envoi}
            style={{ ...principal, flex: 2, cursor: envoi ? "not-allowed" : "pointer", opacity: envoi ? 0.7 : 1 }}>
            {envoi ? t("Envoi en cours...") : t("Envoyer le signalement")}
          </button>
        </div>
      </form>
    );
  }

  return createPortal(
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 2000, backgroundColor: "rgba(0,0,0,0.78)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--d-card, #131330)", color: texte,
        border: "1px solid var(--d-border, #FFD70025)", borderRadius: 16, padding: 22, width: "100%", maxWidth: 480,
        maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <div style={{ color: "var(--d-gold, #FFD700)", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
            <MdFlag style={{ fontSize: 22 }} /> {t("Signaler un problème")}
          </div>
          <button type="button" onClick={onClose} aria-label={t("Fermer")}
            style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer", display: "flex" }}>
            <MdClose style={{ fontSize: 22 }} />
          </button>
        </div>
        <div style={{ color: "#888", fontSize: 12, marginBottom: 16 }}>
          {t("Commande #{{id}} — {{service}}", { id: cmd.id, service: cmd.service })}
        </div>
        {corps}
      </div>
    </div>,
    document.body
  );
}
