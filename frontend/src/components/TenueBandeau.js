import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdErrorOutline, MdHourglassTop, MdArrowForward } from "react-icons/md";

export default function TenueBandeau({ apiUrl, onAller }) {
  const { t } = useTranslation();
  const [etat, setEtat] = useState(null);
  useEffect(() => {
    fetch(apiUrl + "/api/tenues/mes", { headers: { Authorization: "Bearer " + localStorage.getItem("token"), Accept: "application/json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => { if (x) setEtat(x.etat); })
      .catch(() => {});
  }, [apiUrl]);
  if (!etat || etat === "avec_tenue") return null;
  const attente = etat === "en_attente";
  const col = attente ? "#f59e0b" : "#ef4444";
  const Icone = attente ? MdHourglassTop : MdErrorOutline;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between",
      padding: "12px 16px", borderRadius: 14, marginBottom: 18, background: col + "14", border: "1px solid " + col + "55" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center", color: col, fontWeight: 700, fontSize: 14 }}>
        <Icone size={22} />
        {attente ? t("Commande en attente de validation par l'administrateur.") : t("Tenue obligatoire : vous n'avez pas encore de tenue validée.")}
      </div>
      {!attente && (
        <button type="button" onClick={onAller}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, cursor: "pointer",
            fontWeight: 800, fontSize: 13, color: "#000", background: "linear-gradient(135deg,#FFD700,#ff9500)", border: "none" }}>
          {t("Commander ma tenue")} <MdArrowForward />
        </button>
      )}
    </div>
  );
}
