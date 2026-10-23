import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MdReportProblem, MdClose } from "react-icons/md";
import CarteTrajet from "./CarteTrajet";
import { STATUTS, libelleMotif } from "../utils/signalements";
import { formatDateHeure } from "../utils/formatDateHeure";

const PAR_PAGE = 5;
const FILTRES = [
  { code: "", label: "Tous" },
  { code: "nouveau", label: "Nouveaux" },
  { code: "en_cours", label: "En cours" },
  { code: "resolu", label: "Résolus" },
  { code: "rejete", label: "Rejetés" },
];

const texte = "var(--d-text, #fff)";
const carte = { backgroundColor: "var(--d-card, #131330)", border: "1px solid var(--d-border, #FFD70025)", borderRadius: 14, padding: 16 };
const champ = {
  width: "100%", backgroundColor: "var(--d-card, #131330)", color: texte,
  border: "1px solid var(--d-border, #FFD70033)", borderRadius: 10, padding: "9px 12px", fontSize: 14,
};

export default function SignalementsAdmin({ apiUrl, onChange }) {
  const { t } = useTranslation();
  const [liste, setListe] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [page, setPage] = useState(1);
  const [ouvertId, setOuvertId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [statut, setStatut] = useState("nouveau");
  const [reponse, setReponse] = useState("");
  const [enregistre, setEnregistre] = useState(false);
  const [message, setMessage] = useState(null);

  const entetes = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  });

  const charger = useCallback(() => {
    const url = `${apiUrl}/api/admin/signalements` + (filtre ? `?statut=${filtre}` : "");
    fetch(url, { headers: entetes() })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (Array.isArray(d)) setListe(d); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl, filtre]);

  useEffect(() => {
    charger();
    const iv = setInterval(charger, 5000);
    return () => clearInterval(iv);
  }, [charger]);

  useEffect(() => {
    if (!ouvertId) return undefined;
    let annule = false;
    fetch(`${apiUrl}/api/admin/signalements/${ouvertId}`, { headers: entetes() })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (annule || !d) return;
        setDetail(d);
        setStatut(d.statut);
        setReponse(d.reponse_admin || "");
      })
      .catch(() => {});
    return () => { annule = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ouvertId, apiUrl]);

  const ouvrir = (id) => { setDetail(null); setMessage(null); setOuvertId(id); };

  const enregistrer = async () => {
    setEnregistre(true);
    setMessage(null);
    try {
      const res = await fetch(`${apiUrl}/api/admin/signalements/${ouvertId}/traiter`, {
        method: "POST", headers: entetes(), body: JSON.stringify({ statut, reponse }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage({ type: "success", texte: t("Signalement mis à jour.") });
        charger();
        if (onChange) onChange();
      } else setMessage({ type: "error", texte: t(d.message || "Erreur lors de l'opération") });
    } catch {
      setMessage({ type: "error", texte: t("Erreur réseau") });
    }
    setEnregistre(false);
  };

  const supprimer = async () => {
    if (!window.confirm(t("Supprimer ce signalement ?"))) return;
    try {
      await fetch(`${apiUrl}/api/admin/signalements/${ouvertId}`, { method: "DELETE", headers: entetes() });
    } catch { /* ignore */ }
    setOuvertId(null);
    charger();
    if (onChange) onChange();
  };

  const Badge = ({ code }) => {
    const s = STATUTS[code] || { label: code, color: "#888" };
    return (
      <span style={{ color: s.color, border: `1px solid ${s.color}55`, backgroundColor: `${s.color}18`,
        borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 800, whiteSpace: "nowrap" }}>{t(s.label)}</span>
    );
  };

  const role = (r) => (r === "coursier" ? t("Coursier") : t("Client"));
  const nbPages = Math.max(1, Math.ceil(liste.length / PAR_PAGE));
  const pageCourante = Math.min(page, nbPages);
  const visibles = liste.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);
  const bouton = (couleur, actif = true) => ({
    backgroundColor: `${couleur}22`, color: couleur, border: `1px solid ${couleur}55`, borderRadius: 8,
    padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: actif ? "pointer" : "not-allowed", opacity: actif ? 1 : 0.4,
  });

  const ligne = (etiquette, valeur) => (
    <div style={{ minWidth: 140 }}>
      <div style={{ color: "#888", fontSize: 11 }}>{etiquette}</div>
      <div style={{ color: texte, fontSize: 13, fontWeight: 600 }}>{valeur || "—"}</div>
    </div>
  );

  const personne = (titre, p) => (
    <div style={{ ...carte, padding: 12, flex: 1, minWidth: 220 }}>
      <div style={{ color: "var(--d-gold, #FFD700)", fontWeight: 800, fontSize: 12, marginBottom: 6 }}>{titre}</div>
      {p ? (
        <>
          <div style={{ color: texte, fontWeight: 700, fontSize: 14 }}>{p.prenom} {p.nom}</div>
          <div style={{ color: "#888", fontSize: 12 }}>{p.telephone || "—"}</div>
          <div style={{ color: "#888", fontSize: 12 }}>{p.adresse || "—"}</div>
        </>
      ) : <div style={{ color: "#888", fontSize: 12 }}>—</div>}
    </div>
  );

  const modal = ouvertId && createPortal(
    <div onClick={() => setOuvertId(null)} style={{ position: "fixed", inset: 0, zIndex: 2000,
      backgroundColor: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ ...carte, color: texte, width: "100%", maxWidth: 820,
        maxHeight: "94vh", overflowY: "auto", padding: 22, boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ color: "var(--d-gold, #FFD700)", fontWeight: 800, fontSize: 17, display: "flex", alignItems: "center", gap: 8 }}>
            <MdReportProblem style={{ fontSize: 22 }} /> {t("Signalements")} #{ouvertId}
          </div>
          <button type="button" onClick={() => setOuvertId(null)} aria-label={t("Fermer")}
            style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer", display: "flex" }}>
            <MdClose style={{ fontSize: 22 }} />
          </button>
        </div>

        {!detail ? (
          <div style={{ color: "#888", padding: 20, textAlign: "center" }}>{t("Chargement de la carte...")}</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 14 }}>
              {ligne(t("Motif"), t(libelleMotif(detail.motif)))}
              {ligne(t("Signalé par"), `${detail.auteur || "—"} (${role(detail.auteur_role)})`)}
              {ligne(t("Date"), formatDateHeure(detail.created_at))}
              <div><div style={{ color: "#888", fontSize: 11 }}>{t("Statut")}</div><Badge code={detail.statut} /></div>
            </div>

            <div style={{ ...carte, padding: 12, marginBottom: 14 }}>
              <div style={{ color: "#888", fontSize: 11, marginBottom: 4 }}>{t("Description du problème")}</div>
              <div style={{ color: texte, fontSize: 14, whiteSpace: "pre-wrap" }}>{detail.description}</div>
            </div>

            {detail.commande && (
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 14 }}>
                {ligne(t("Commande"), `#${detail.commande.id} — ${detail.commande.service}`)}
                {ligne(t("Statut"), detail.commande.statut)}
                {ligne(t("Tarif"), detail.commande.tarif != null ? `${Number(detail.commande.tarif).toLocaleString("fr-FR")} Ar` : null)}
                {ligne(t("Adresse de prise en charge"), detail.commande.adresse_pickup)}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              {personne(t("Client"), detail.client)}
              {personne(t("Coursier"), detail.coursier)}
            </div>

            {detail.commande && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ color: "var(--d-gold, #FFD700)", fontWeight: 800, fontSize: 14, marginBottom: 8 }}>{t("Trajet de la course")}</div>
                <CarteTrajet key={detail.id} pickup={detail.commande.adresse_pickup}
                  client={detail.client} coursier={detail.coursier} positions={detail.positions} />
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <label style={{ color: "#888", fontSize: 12 }}>{t("Statut")}</label>
              <select value={statut} onChange={(e) => setStatut(e.target.value)} style={{ ...champ, margin: "4px 0 12px" }}>
                {Object.keys(STATUTS).map((k) => <option key={k} value={k}>{t(STATUTS[k].label)}</option>)}
              </select>
              <label style={{ color: "#888", fontSize: 12 }}>{t("Réponse à l'auteur du signalement")}</label>
              <textarea rows={4} maxLength={1000} value={reponse} onChange={(e) => setReponse(e.target.value)}
                placeholder={t("Écrivez une réponse (elle sera envoyée à l'auteur)")}
                style={{ ...champ, margin: "4px 0 0", resize: "vertical" }} />
            </div>

            {message && (
              <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8, fontSize: 13,
                backgroundColor: message.type === "success" ? "#10b98122" : "#ef444422",
                color: message.type === "success" ? "#10b981" : "#ef4444" }}>{message.texte}</div>
            )}

            <div style={{ display: "flex", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
              <button type="button" onClick={supprimer} style={bouton("#ef4444")}>{t("Supprimer")}</button>
              <button type="button" disabled={enregistre} onClick={enregistrer}
                style={{ padding: "10px 22px", borderRadius: 12, border: "none", fontWeight: 800, fontSize: 14,
                  background: "linear-gradient(135deg,#FFD700,#ff9500)", color: "#000",
                  cursor: enregistre ? "not-allowed" : "pointer", opacity: enregistre ? 0.7 : 1 }}>
                {enregistre ? t("Enregistrement...") : t("Enregistrer")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );

  return (
    <div>
      <h4 style={{ color: "var(--d-gold, #FFD700)", marginBottom: 6, fontWeight: 800, fontSize: 20,
        display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#ef444418", border: "1px solid #ef444433",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MdReportProblem style={{ color: "#ef4444", fontSize: 22 }} />
        </div>
        {t("Signalements")}
      </h4>
      <p style={{ color: "#888", marginBottom: 18, fontSize: 14 }}>{t("Problèmes signalés par les clients et les coursiers")}</p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {FILTRES.map((f) => (
          <button key={f.code} type="button" onClick={() => { setFiltre(f.code); setPage(1); }}
            style={{ ...bouton("#FFD700"), backgroundColor: filtre === f.code ? "#FFD700" : "#FFD70018",
              color: filtre === f.code ? "#000" : "#FFD700" }}>{t(f.label)}</button>
        ))}
      </div>

      {visibles.length === 0 && (
        <div style={{ ...carte, color: "#888", textAlign: "center", fontSize: 13 }}>{t("Aucun signalement pour le moment.")}</div>
      )}

      {visibles.map((s) => {
        const couleur = (STATUTS[s.statut] || { color: "#888" }).color;
        return (
          <div key={s.id} onClick={() => ouvrir(s.id)}
            style={{ ...carte, marginBottom: 12, cursor: "pointer", borderLeft: `4px solid ${couleur}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ color: texte, fontWeight: 800, fontSize: 15 }}>{t(libelleMotif(s.motif))}</div>
              <Badge code={s.statut} />
            </div>
            <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
              {s.auteur || "—"} ({role(s.auteur_role)}) → {s.cible || "—"} · {t("Commande")} #{s.commande_id || "—"} {s.service ? `· ${s.service}` : ""}
            </div>
            <div style={{ color: texte, fontSize: 13, marginTop: 8, overflow: "hidden", display: "-webkit-box",
              WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{s.description}</div>
            <div style={{ color: "#666", fontSize: 11, marginTop: 8 }}>{formatDateHeure(s.created_at)}</div>
          </div>
        );
      })}

      {nbPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, marginTop: 6, flexWrap: "wrap" }}>
          <button type="button" disabled={pageCourante === 1} style={bouton("#FFD700", pageCourante !== 1)}
            onClick={() => setPage(pageCourante - 1)}>{t("Précédent")}</button>
          <span style={{ color: "#aaa", fontSize: 12 }}>{t("Page {{page}} / {{total}}", { page: pageCourante, total: nbPages })}</span>
          <button type="button" disabled={pageCourante === nbPages} style={bouton("#FFD700", pageCourante !== nbPages)}
            onClick={() => setPage(pageCourante + 1)}>{t("Suivant")}</button>
        </div>
      )}

      {modal}
    </div>
  );
}
