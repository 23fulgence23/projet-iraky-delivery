import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MdChecklist, MdClose, MdDelete, MdDeleteSweep, MdSelectAll, MdCheck } from "react-icons/md";

export function useSelection() {
  const [actif, setActif] = useState(false);
  const [ids, setIds] = useState([]);
  const basculer = useCallback((id) => setIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), []);
  const choisirTous = useCallback((liste) => setIds(liste), []);
  const arreter = useCallback(() => { setActif(false); setIds([]); }, []);
  return { actif, ids, setActif, basculer, choisirTous, arreter };
}

const bouton = (couleur) => ({
  display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 10,
  fontSize: 13, fontWeight: 700, cursor: "pointer",
  background: couleur + "18", color: couleur, border: "1px solid " + couleur + "44",
});

export function BarreSelection({ sel, tous, onSupprimer, onSupprimerTout }) {
  const { t } = useTranslation();
  if (!tous.length) return null;

  if (!sel.actif) {
    return (
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button type="button" style={bouton("#FFD700")} onClick={() => sel.setActif(true)}>
          <MdChecklist size={18} /> {t("Sélectionner")}
        </button>
      </div>
    );
  }

  const toutCoche = sel.ids.length === tous.length;
  const vide = sel.ids.length === 0;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 14,
      padding: "10px 12px", borderRadius: 12, background: "var(--d-card)", border: "1px solid var(--d-border)" }}>
      <button type="button" style={bouton("#3b82f6")} onClick={() => sel.choisirTous(toutCoche ? [] : tous)}>
        <MdSelectAll size={18} /> {toutCoche ? t("Tout désélectionner") : t("Tout sélectionner")}
      </button>
      <span style={{ color: "var(--d-c-aaa)", fontSize: 13 }}>{t("{{n}} sélectionné(s)", { n: sel.ids.length })}</span>
      <span style={{ flex: 1 }} />
      <button type="button" disabled={vide} onClick={() => onSupprimer(sel.ids)}
        style={{ ...bouton("#ef4444"), opacity: vide ? 0.4 : 1, cursor: vide ? "not-allowed" : "pointer" }}>
        <MdDelete size={18} /> {t("Supprimer")} ({sel.ids.length})
      </button>
      {onSupprimerTout && (
        <button type="button" style={bouton("#ef4444")} onClick={onSupprimerTout}>
          <MdDeleteSweep size={18} /> {t("Tout supprimer")}
        </button>
      )}
      <button type="button" style={bouton("#9ca3af")} onClick={sel.arreter}>
        <MdClose size={18} /> {t("Annuler")}
      </button>
    </div>
  );
}

export function CaseSelection({ sel, id }) {
  if (!sel.actif) return null;
  const coche = sel.ids.includes(id);
  return (
    <span role="checkbox" aria-checked={coche} onClick={(e) => { e.stopPropagation(); sel.basculer(id); }}
      style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 16,
        border: coche ? "2px solid #FFD700" : "2px solid var(--d-border)", background: coche ? "#FFD700" : "transparent" }}>
      {coche && <MdCheck />}
    </span>
  );
}
