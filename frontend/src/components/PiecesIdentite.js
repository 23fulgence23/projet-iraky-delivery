import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdBadge, MdHome, MdPictureAsPdf, MdErrorOutline } from "react-icons/md";

const BASE_URL = "https://projet-iraky-delivery.onrender.com";

function Carte({ titre, Icon, couleur, piece, chargement }) {
  const { t } = useTranslation();
  const pdf = piece && piece.data && piece.data.startsWith("data:application/pdf");

  const ouvrirPdf = async () => {
    try {
      const blob = await (await fetch(piece.data)).blob();
      window.open(URL.createObjectURL(blob), "_blank");
    } catch (e) { /* ignore */ }
  };

  const centre = { aspectRatio: "85.6 / 54", display: "flex", alignItems: "center", justifyContent: "center",
    flexDirection: "column", gap: 8, color: "#777", fontSize: 12, textAlign: "center", padding: 8 };

  let corps;
  if (chargement) corps = <div style={centre}>{t("Chargement…")}</div>;
  else if (piece && piece.data && pdf) {
    corps = (
      <div style={centre}>
        <MdPictureAsPdf style={{ fontSize: 40, color: "#ef4444" }} />
        <button type="button" onClick={ouvrirPdf}
          style={{ background: "none", border: "1px solid " + couleur, color: couleur, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontWeight: 700 }}>
          {t("Ouvrir le PDF")}
        </button>
      </div>
    );
  } else if (piece && piece.data) {
    corps = <img src={piece.data} alt={titre} style={{ width: "100%", aspectRatio: "85.6 / 54", objectFit: "contain", backgroundColor: "#000", display: "block" }} />;
  } else if (piece && piece.perdu) {
    corps = <div style={{ ...centre, color: "#f59e0b" }}><MdErrorOutline style={{ fontSize: 34 }} />{t("Fichier perdu : à renvoyer")}</div>;
  } else {
    corps = <div style={centre}><Icon style={{ fontSize: 36 }} />{t("Non fourni")}</div>;
  }

  return (
    <div style={{ backgroundColor: "var(--d-bg2)", borderRadius: 12, border: "1px solid " + couleur + "33", overflow: "hidden" }}>
      <div style={{ padding: "8px 12px", borderBottom: "1px solid " + couleur + "22", color: "var(--d-c-aaa)", fontSize: 12,
        display: "flex", alignItems: "center", gap: 6 }}>
        <Icon style={{ color: couleur }} /> {titre}
      </div>
      {corps}
    </div>
  );
}

export default function PiecesIdentite({ endpoint }) {
  const { t } = useTranslation();
  const [d, setD] = useState(null);

  useEffect(() => {
    let vivant = true;
    setD(null);
    fetch(BASE_URL + endpoint, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token"), Accept: "application/json" },
    })
      .then((r) => (r.ok ? r.json() : {}))
      .then((x) => { if (vivant) setD(x); })
      .catch(() => { if (vivant) setD({}); });
    return () => { vivant = false; };
  }, [endpoint]);

  const c = d === null;
  return (
    <>
      <Carte titre={t("CIN Recto")} Icon={MdBadge} couleur="#06b6d4" piece={d && d.recto} chargement={c} />
      <Carte titre={t("CIN Verso")} Icon={MdBadge} couleur="#8b5cf6" piece={d && d.verso} chargement={c} />
      <Carte titre={t("Certificat de résidence")} Icon={MdHome} couleur="#10b981" piece={d && d.certificat} chargement={c} />
    </>
  );
}
