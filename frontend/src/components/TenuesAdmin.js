import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { MdCheckroom, MdCheckCircle, MdHourglassTop, MdErrorOutline, MdGroups } from "react-icons/md";
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
  const coursiers = d ? d.coursiers.filter((c) => filtre === "tous" || c.etat === filtre) : [];
  const bouton = (couleur) => ({ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", color: couleur, background: couleur + "18", border: "1px solid " + couleur + "55" });

  return (
    <div>
      <h4 style={{ color: "var(--d-gold)", marginBottom: 6, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FFD70018", border: "1px solid #FFD70033", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MdCheckroom style={{ color: "var(--d-gold)", fontSize: 22 }} />
        </div>
        {t("Commandes de tenues")}
      </h4>
      <p style={{ color: "var(--d-c-aaa)", marginBottom: 16, fontSize: 14 }}>{t("Suivi des T-shirts et gilets des coursiers")}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 16 }}>
        {[["tous", MdGroups, "#3b82f6", "Tous", resume.total], ...Object.entries(ETATS).map(([k, v]) => [k, v.Icon, v.couleur, v.label, resume[k]])].map(([k, Icon, col, lib, n]) => (
          <div key={k} onClick={() => setFiltre(k)}
            style={{ ...carte, cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
              borderColor: filtre === k ? col : "var(--d-border)", boxShadow: filtre === k ? "0 0 0 2px " + col + "33" : "none" }}>
            <Icon size={28} style={{ color: col }} />
            <div>
              <div style={{ color: "var(--d-text)", fontWeight: 800, fontSize: 22, lineHeight: 1 }}>{n}</div>
              <div style={{ color: "var(--d-c-aaa)", fontSize: 12 }}>{t(lib)}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 14, margin: "6px 0 10px" }}>{t("Commandes")}</div>
      {(!d || d.commandes.length === 0) && <div style={{ ...carte, color: "var(--d-c-aaa)", fontSize: 13, textAlign: "center" }}>{t("Aucune commande de tenue.")}</div>}
      {d && d.commandes.map((c) => {
        const [lib, col] = STATUT[c.statut] || [c.statut, "#999"];
        return (
          <div key={c.id} style={{ ...carte, marginBottom: 10, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", borderLeft: "4px solid " + col }}>
            <div style={{ minWidth: 200, flex: 1 }}>
              <div style={{ color: "var(--d-text)", fontWeight: 700, fontSize: 14 }}>{c.coursier}{c.telephone ? " · " + c.telephone : ""}</div>
              <div style={{ color: "var(--d-c-aaa)", fontSize: 12.5 }}>{t(c.libelle)} · {c.taille} · x{c.quantite} · {nf(c.total)} Ar</div>
              <div style={{ color: "var(--d-c-aaa)", fontSize: 12 }}>{t("Référence")} : {c.reference_paiement} · {c.date}</div>
              {c.statut === "refusee" && c.motif_refus && <div style={{ color: "#ef4444", fontSize: 12 }}>{t("Motif :")} {c.motif_refus}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ padding: "3px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: col, background: col + "18", border: "1px solid " + col + "44" }}>{t(lib)}</span>
              {c.statut === "en_attente" && (
                <>
                  <button type="button" style={bouton("#10b981")} onClick={() => valider(c)}>{t("Valider")}</button>
                  <button type="button" style={bouton("#ef4444")} onClick={() => refuser(c)}>{t("Refuser")}</button>
                </>
              )}
            </div>
          </div>
        );
      })}

      <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 14, margin: "18px 0 10px" }}>{t("Coursiers")} ({coursiers.length})</div>
      {d && coursiers.length === 0 && <div style={{ ...carte, color: "var(--d-c-aaa)", fontSize: 13, textAlign: "center" }}>{t("Aucun coursier dans cette catégorie.")}</div>}
      {coursiers.map((c) => {
        const e = ETATS[c.etat];
        return (
          <div key={c.id} style={{ ...carte, marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: "var(--d-text)", fontWeight: 700, fontSize: 14 }}>{c.nom_complet}</div>
              <div style={{ color: "var(--d-c-aaa)", fontSize: 12 }}>{c.telephone || "—"} · {t("{{n}} commande(s)", { n: c.nb_commandes })}</div>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: e.couleur, background: e.couleur + "18", border: "1px solid " + e.couleur + "44" }}>
              <e.Icon size={15} /> {t(e.label)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
