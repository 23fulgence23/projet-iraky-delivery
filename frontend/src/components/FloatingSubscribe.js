import { useState, useEffect } from "react";
import { FiBell, FiCheck, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import useAbonnes from "../hooks/useAbonnes";

export default function FloatingSubscribe() {
  const { t } = useTranslation();
  const { abonne, envoi, sabonner } = useAbonnes();
  const [pret, setPret] = useState(false);
  const [merci, setMerci] = useState(false);
  const [ferme, setFerme] = useState(() => {
    try { return sessionStorage.getItem("iraky-abo-ferme") === "1"; } catch { return false; }
  });

  useEffect(() => {
    const id = setTimeout(() => setPret(true), 2500);
    return () => clearTimeout(id);
  }, []);

  const cliquer = async () => {
    const ok = await sabonner();
    if (ok) {
      setMerci(true);
      setTimeout(() => setMerci(false), 3500);
    }
  };

  const fermer = () => {
    setFerme(true);
    try { sessionStorage.setItem("iraky-abo-ferme", "1"); } catch {}
  };

  if (!pret) return null;
  if (!merci && (abonne || ferme)) return null;

  const base = {
    position: "fixed", left: 16, bottom: 16, zIndex: 1040,
    display: "flex", alignItems: "center", gap: 8, borderRadius: 999,
    boxShadow: "var(--iraky-card-shadow)", fontFamily: "var(--f-body)",
  };

  if (merci) {
    return (
      <div style={{ ...base, padding: "11px 18px", backgroundColor: "var(--iraky-surface)", border: "1px solid var(--iraky-gold-line)", color: "var(--iraky-gold)", fontWeight: 600, fontSize: 13.5 }}>
        <FiCheck /> {t("Merci, vous êtes abonné !")}
      </div>
    );
  }

  return (
    <div style={{ ...base, padding: 4, backgroundColor: "var(--iraky-surface)", border: "1px solid var(--iraky-gold-line)" }}>
      <button className="iraky-btn-gold" onClick={cliquer} disabled={envoi}
        style={{ padding: "10px 18px", fontSize: 13.5, display: "inline-flex", alignItems: "center", gap: 7 }}>
        <FiBell /> {envoi ? t("Un instant…") : t("S'abonner")}
      </button>
      <button onClick={fermer} aria-label={t("Fermer")}
        style={{ border: "none", background: "transparent", color: "var(--iraky-muted)", cursor: "pointer", padding: "0 10px", display: "flex" }}>
        <FiX />
      </button>
    </div>
  );
}
