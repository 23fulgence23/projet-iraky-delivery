import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatDateHeure } from "../utils/formatDateHeure";

const COULEURS = { en_attente: "#f59e0b", valide: "#10b981", rejete: "#ef4444" };
const PAR_PAGE = 5;

export default function PaiementsAbonnementAdmin({ apiUrl, onChange }) {
  const { t } = useTranslation();
  const [paiements, setPaiements] = useState([]);
  const [rejetId, setRejetId] = useState(null);
  const [motif, setMotif] = useState("");
  const [occupe, setOccupe] = useState(null);
  const [message, setMessage] = useState(null);
  const [page, setPage] = useState(1);

  const entetes = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  });

  const charger = useCallback(() => {
    fetch(`${apiUrl}/api/admin/abonnements/paiements`, { headers: entetes() })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => { if (Array.isArray(d)) setPaiements(d); })
      .catch(() => {});
  }, [apiUrl]);

  useEffect(() => {
    charger();
    const iv = setInterval(charger, 10000);
    return () => clearInterval(iv);
  }, [charger]);

  const action = async (cle, url, corps) => {
    setOccupe(cle);
    setMessage(null);
    try {
      const res = await fetch(`${apiUrl}${url}`, {
        method: "POST", headers: entetes(), body: corps ? JSON.stringify(corps) : undefined,
      });
      const d = await res.json().catch(() => ({}));
      setMessage({ type: res.ok ? "success" : "error",
        texte: t(d.message || (res.ok ? "Opération réussie" : "Erreur lors de l'opération")) });
      if (res.ok) { setRejetId(null); setMotif(""); charger(); if (onChange) onChange(); }
    } catch {
      setMessage({ type: "error", texte: t("Erreur réseau") });
    }
    setOccupe(null);
  };

  const enAttente = paiements.filter((p) => p.statut === "en_attente");
  const traites = paiements.filter((p) => p.statut !== "en_attente");
  const tous = enAttente.concat(traites);
  const nbPages = Math.max(1, Math.ceil(tous.length / PAR_PAGE));
  const pageCourante = Math.min(page, nbPages);
  const visibles = tous.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);
  const dernierParCoursier = {};
  paiements.forEach((p) => { if (!dernierParCoursier[p.user_id] || p.id > dernierParCoursier[p.user_id]) dernierParCoursier[p.user_id] = p.id; });

  const libelle = { en_attente: t("En attente"), valide: t("Validé"), rejete: t("Rejeté") };
  const bouton = (couleur) => ({ backgroundColor: couleur + "22", color: couleur, border: `1px solid ${couleur}55`,
    borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer" });

  return (
    <div style={{ backgroundColor: "var(--d-bg3)", border: "1px solid #FFD70025", borderRadius: 16,
      padding: 18, marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 15 }}>{t("Paiements d'abonnement")}</div>
        <div style={{ color: enAttente.length ? "#f59e0b" : "#666", fontSize: 12, fontWeight: 700 }}>
          {t("{{nb}} en attente de validation", { nb: enAttente.length })}
        </div>
      </div>

      {message && (
        <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8, fontSize: 13,
          backgroundColor: message.type === "success" ? "#10b98122" : "#ef444422",
          color: message.type === "success" ? "#10b981" : "#ef4444" }}>
          {message.texte}
        </div>
      )}

      {visibles.length === 0 && (
        <div style={{ color: "#555", fontSize: 13, textAlign: "center", padding: 14 }}>
          {t("Aucun paiement d'abonnement pour le moment.")}
        </div>
      )}

      {visibles.map((p) => {
        const c = p.coursier || {};
        const couleur = COULEURS[p.statut] || "#888";
        const peutReactiver = p.statut === "valide" && c.statut === "suspendu" && dernierParCoursier[p.user_id] === p.id;
        return (
          <div key={p.id} style={{ backgroundColor: "var(--d-bg)", borderRadius: 12, padding: 14,
            border: `1px solid ${couleur}33`, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
              <div style={{ color: "var(--d-text)", fontWeight: 700 }}>{c.prenom} {c.nom}</div>
              <span style={{ color: couleur, fontSize: 11, fontWeight: 800, border: `1px solid ${couleur}55`,
                borderRadius: 20, padding: "2px 10px" }}>{libelle[p.statut] || p.statut}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8,
              marginTop: 10, fontSize: 12 }}>
              <div><div style={{ color: "#666" }}>{t("Référence")}</div><div style={{ color: "var(--d-gold)", fontWeight: 700 }}>{p.reference}</div></div>
              <div><div style={{ color: "#666" }}>{t("Numéro d'envoi")}</div><div style={{ color: "var(--d-c-ddd)" }}>{p.numero_envoi}</div></div>
              <div><div style={{ color: "#666" }}>{t("Date du paiement")}</div><div style={{ color: "var(--d-c-ddd)" }}>{formatDateHeure(p.paye_le)}</div></div>
              <div><div style={{ color: "#666" }}>{t("Montant")}</div><div style={{ color: "var(--d-c-ddd)" }}>{Number(p.montant).toLocaleString("fr-FR")} Ar</div></div>
            </div>
            {p.statut === "rejete" && p.motif_rejet && (
              <div style={{ marginTop: 8, color: "#ef4444", fontSize: 12 }}>{p.motif_rejet}</div>
            )}
            {c.statut === "suspendu" && (
              <div style={{ marginTop: 8, color: "#ef4444", fontSize: 11, fontWeight: 700 }}>{t("Compte suspendu")}</div>
            )}

            {p.statut === "en_attente" && rejetId !== p.id && (
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <button type="button" disabled={occupe !== null} style={bouton("#10b981")}
                  onClick={() => action("v" + p.id, `/api/admin/abonnements/paiements/${p.id}/valider`)}>{t("Valider")}</button>
                <button type="button" disabled={occupe !== null} style={bouton("#ef4444")}
                  onClick={() => { setRejetId(p.id); setMotif(""); }}>{t("Rejeter")}</button>
              </div>
            )}
            {p.statut === "en_attente" && rejetId === p.id && (
              <div style={{ marginTop: 12 }}>
                <input type="text" value={motif} placeholder={t("Motif du rejet")} onChange={(e) => setMotif(e.target.value)}
                  style={{ width: "100%", backgroundColor: "var(--d-bg2)", border: "1px solid #ef444440", color: "var(--d-text)",
                    borderRadius: 8, padding: "8px 10px", fontSize: 13, marginBottom: 8 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button type="button" disabled={occupe !== null || !motif.trim()} style={bouton("#ef4444")}
                    onClick={() => action("r" + p.id, `/api/admin/abonnements/paiements/${p.id}/rejeter`, { motif })}>{t("Confirmer le rejet")}</button>
                  <button type="button" style={bouton("#888")} onClick={() => setRejetId(null)}>{t("Annuler")}</button>
                </div>
              </div>
            )}
            {peutReactiver && (
              <div style={{ marginTop: 12 }}>
                <button type="button" disabled={occupe !== null} style={bouton("var(--d-gold)")}
                  onClick={() => action("a" + p.id, `/api/admin/abonnements/coursiers/${p.user_id}/reactiver`)}>{t("Réactiver le compte")}</button>
              </div>
            )}
          </div>
        );
      })}

      {nbPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
          <button type="button" disabled={pageCourante === 1}
            style={{ ...bouton("var(--d-gold)"), opacity: pageCourante === 1 ? 0.4 : 1 }}
            onClick={() => setPage(pageCourante - 1)}>{t("Précédent")}</button>
          <span style={{ color: "var(--d-c-aaa)", fontSize: 12 }}>{t("Page {{page}} / {{total}}", { page: pageCourante, total: nbPages })}</span>
          <button type="button" disabled={pageCourante === nbPages}
            style={{ ...bouton("var(--d-gold)"), opacity: pageCourante === nbPages ? 0.4 : 1 }}
            onClick={() => setPage(pageCourante + 1)}>{t("Suivant")}</button>
        </div>
      )}
    </div>
  );
}
