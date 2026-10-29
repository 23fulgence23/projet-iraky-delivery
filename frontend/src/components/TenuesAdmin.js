import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { MdCheckroom, MdCheckCircle, MdHourglassTop, MdErrorOutline, MdGroups, MdCheck, MdClose } from "react-icons/md";
import { notifierSucces } from "../utils/supprimer";

const nf = (n) => new Intl.NumberFormat("fr-FR").format(n);
const entetes = () => ({ Authorization: "Bearer " + localStorage.getItem("token"), Accept: "application/json", "Content-Type": "application/json" });
const base = () => ({ background: "var(--d-card)", color: "var(--d-text)", customClass: { popup: "swal-iraky" } });
const ETATS = {
  avec_tenue: { couleur: "#10b981", Icon: MdCheckCircle, label: "Avec tenue" },
  en_attente: { couleur: "#f59e0b", Icon: MdHourglassTop, label: "En attente" },
  sans_tenue: { couleur: "#ef4444", Icon: MdErrorOutline, label: "Sans tenue" },
};
const STATUT = { en_attente: ["En attente de validation", "#f59e0b"], validee: ["Validée", "#10b981"], refusee: ["Refusée", "#ef4444"] };
const carte = { backgroundColor: "var(--d-card)", border: "1px solid var(--d-border)", borderRadius: 14, padding: 14 };

const PAR_PAGE = 10;

function Tableau({ colonnes, lignes, texteVide, largeur = 640 }) {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(lignes.length / PAR_PAGE));
  const courante = Math.min(page, pages - 1);
  const visibles = lignes.slice(courante * PAR_PAGE, (courante + 1) * PAR_PAGE);
  const navBtn = (desactive) => ({
    padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
    cursor: desactive ? "not-allowed" : "pointer", opacity: desactive ? 0.4 : 1,
    color: "var(--d-text)", background: "var(--d-bg2)", border: "1px solid var(--d-border)",
  });

  return (
    <div style={{ ...carte, padding: 0, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: largeur, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {colonnes.map((c) => (
                <th key={c} style={{ textAlign: "left", padding: "12px 14px", fontSize: 11, fontWeight: 700, letterSpacing: 1,
                  textTransform: "uppercase", color: "var(--d-c-aaa)", borderBottom: "1px solid var(--d-border)" }}>{t(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibles.length === 0 ? (
              <tr>
                <td colSpan={colonnes.length} style={{ padding: 20, textAlign: "center", color: "var(--d-c-aaa)", fontSize: 13 }}>{texteVide}</td>
              </tr>
            ) : visibles.map((l) => (
              <tr key={l.key}>
                {l.cells.map((cell, i) => (
                  <td key={i} style={{ padding: "12px 14px", fontSize: 14, borderTop: "1px solid var(--d-border)", verticalAlign: "middle" }}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, padding: 12, borderTop: "1px solid var(--d-border)" }}>
          <button type="button" style={navBtn(courante === 0)} disabled={courante === 0} onClick={() => setPage(courante - 1)}>‹</button>
          <span style={{ color: "var(--d-c-aaa)", fontSize: 13 }}>{courante + 1} / {pages}</span>
          <button type="button" style={navBtn(courante >= pages - 1)} disabled={courante >= pages - 1} onClick={() => setPage(courante + 1)}>›</button>
        </div>
      )}
    </div>
  );
}

export default function TenuesAdmin({ apiUrl }) {
  const { t } = useTranslation();
  const [d, setD] = useState(null);
  const [filtre, setFiltre] = useState("tous");

  const charger = useCallback(() => {
    fetch(apiUrl + "/api/admin/tenues", { headers: entetes() })
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => { if (x) setD(x); })
      .catch(() => {});
  }, [apiUrl]);
  useEffect(() => { charger(); const iv = setInterval(charger, 10000); return () => clearInterval(iv); }, [charger]);

  const echec = async (r) => {
    const x = await r.json().catch(() => ({}));
    Swal.fire({ ...base(), icon: "error", title: t("Erreur"), text: t(x.message || "Action impossible."), confirmButtonColor: "#FFD700" });
  };

  const valider = async (c) => {
    const { isConfirmed } = await Swal.fire({
      ...base(), icon: "question", title: t("Valider"),
      text: t("Valider la commande de {{nom}} ?", { nom: c.coursier }),
      showCancelButton: true, confirmButtonText: t("Valider"), cancelButtonText: t("Annuler"),
      confirmButtonColor: "#10b981", cancelButtonColor: "#6b7280", reverseButtons: true,
    });
    if (!isConfirmed) return;
    const r = await fetch(apiUrl + "/api/admin/tenues/" + c.id + "/valider", { method: "POST", headers: entetes() });
    if (r.ok) { await notifierSucces(t("Commande validée avec succès."), t("Validée")); charger(); } else echec(r);
  };

  const refuser = async (c) => {
    const res = await Swal.fire({
      ...base(), icon: "warning", title: t("Refuser"),
      text: t("Refuser la commande de {{nom}} ?", { nom: c.coursier }),
      input: "textarea", inputPlaceholder: t("Motif du refus (facultatif)"), inputAttributes: { maxlength: 255 },
      showCancelButton: true, confirmButtonText: t("Refuser"), cancelButtonText: t("Annuler"),
      confirmButtonColor: "#ef4444", cancelButtonColor: "#6b7280", reverseButtons: true,
    });
    if (!res.isConfirmed) return;
    const r = await fetch(apiUrl + "/api/admin/tenues/" + c.id + "/refuser", {
      method: "POST", headers: entetes(), body: JSON.stringify({ motif: (res.value || "").trim() }),
    });
    if (r.ok) { await notifierSucces(t("Commande refusée."), t("Refusée")); charger(); } else echec(r);
  };

  const resume = d ? d.resume : { avec_tenue: 0, en_attente: 0, sans_tenue: 0, total: 0 };
  const cartes = [
    ["tous", MdGroups, "#3b82f6", "Coursiers", "coursiers actifs", resume.total],
    ["en_attente", MdHourglassTop, "#f59e0b", "En attente", "à valider", resume.en_attente],
    ["avec_tenue", MdCheckCircle, "#10b981", "Avec tenue", "tenue validée", resume.avec_tenue],
    ["sans_tenue", MdErrorOutline, "#ef4444", "Sans tenue", "à équiper", resume.sans_tenue],
  ];

  const badge = (couleur, Icon, texte) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 999, fontSize: 12,
      fontWeight: 700, color: couleur, background: couleur + "18", border: "1px solid " + couleur + "44" }}>
      {Icon && <Icon size={15} />}{texte}
    </span>
  );
  const carre = (couleur, Icon, titre, onClick) => (
    <button type="button" title={titre} onClick={onClick}
      style={{ width: 32, height: 32, borderRadius: 8, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: couleur, background: couleur + "18", border: "1px solid " + couleur + "44" }}>
      <Icon size={17} />
    </button>
  );
  const gris = { color: "var(--d-c-aaa)" };

  const lignesCommandes = (d ? d.commandes : []).map((c) => {
    const [lib, col] = STATUT[c.statut] || [c.statut, "#999"];
    return {
      key: c.id,
      cells: [
        <span style={gris}>#{c.id}</span>,
        <div><strong style={{ color: "var(--d-text)" }}>{c.coursier}</strong>{c.telephone && <div style={{ ...gris, fontSize: 12 }}>{c.telephone}</div>}</div>,
        <span style={{ color: "var(--d-text)" }}>{t(c.libelle)} · {c.taille} · x{c.quantite}</span>,
        <strong style={{ color: "var(--d-gold)" }}>{nf(c.total)} Ar</strong>,
        <span style={gris}>{c.reference_paiement}</span>,
        <div>{badge(col, null, t(lib))}{c.statut === "refusee" && c.motif_refus && <div style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{c.motif_refus}</div>}</div>,
        <span style={{ ...gris, fontSize: 13 }}>{c.date}</span>,
        c.statut === "en_attente"
          ? <div style={{ display: "flex", gap: 8 }}>{carre("#10b981", MdCheck, t("Valider"), () => valider(c))}{carre("#ef4444", MdClose, t("Refuser"), () => refuser(c))}</div>
          : <span style={gris}>—</span>,
      ],
    };
  });

  const lignesCoursiers = (d ? d.coursiers : []).filter((c) => filtre === "tous" || c.etat === filtre).map((c) => {
    const e = ETATS[c.etat];
    return {
      key: c.id,
      cells: [
        <strong style={{ color: "var(--d-text)" }}>{c.nom_complet}</strong>,
        <span style={gris}>{c.telephone || "—"}</span>,
        badge(e.couleur, e.Icon, t(e.label)),
        <span style={gris}>{c.nb_commandes}</span>,
      ],
    };
  });

  return (
    <div>
      <h4 style={{ color: "var(--d-gold)", marginBottom: 6, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FFD70018", border: "1px solid #FFD70033", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MdCheckroom style={{ color: "var(--d-gold)", fontSize: 22 }} />
        </div>
        {t("Commandes de tenues")}
      </h4>
      <p style={{ color: "var(--d-c-aaa)", marginBottom: 20, fontSize: 14 }}>{t("Suivi des T-shirts et gilets des coursiers")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 }}>
        {cartes.map(([k, Icon, col, lib, sous, n]) => {
          const actif = filtre === k;
          return (
            <div key={k} onClick={() => setFiltre(k)}
              style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 16, padding: "20px 22px", borderRadius: 16,
                background: col + "0d", border: "1px solid " + col + (actif ? "99" : "44"),
                boxShadow: actif ? "0 0 0 2px " + col + "22" : "none", transition: "all 0.2s" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={26} style={{ color: col }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: "var(--d-text)", fontWeight: 800, fontSize: 26, lineHeight: 1 }}>{n}</div>
                <div style={{ color: "var(--d-c-aaa)", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 6 }}>{t(lib)}</div>
                <div style={{ color: col, fontSize: 12, marginTop: 2 }}>{t(sous)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 15, marginBottom: 6 }}>{t("Commandes")}</div>
      <Tableau largeur={860} colonnes={["#", "Coursier", "Article", "Total", "Référence", "Statut", "Date", "Actions"]}
        lignes={lignesCommandes} texteVide={t("Aucune commande de tenue.")} />

      <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 15, margin: "30px 0 6px" }}>{t("Coursiers")} ({lignesCoursiers.length})</div>
      <Tableau key={filtre} colonnes={["Coursier", "Téléphone", "État", "Commandes"]}
        lignes={lignesCoursiers} texteVide={t("Aucun coursier dans cette catégorie.")} />
    </div>
  );
}
