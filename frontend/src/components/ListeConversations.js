import { useTranslation } from "react-i18next";
import { MdCheckCircle, MdAccessTime, MdDelete } from "react-icons/md";

function lireDate(valeur) {
  if (!valeur) return null;
  const s = String(valeur);
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + "T00:00:00" : s);
  return isNaN(d.getTime()) ? null : d;
}
const cleJour = (d) =>
  d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");

// Liste de conversations groupee par jour (une conversation par commande)
export default function ListeConversations({
  items, actifId, sel, onOuvrir, onSupprimer, renderNom, renderCase, couleurAvatar, titreSupprimer,
}) {
  const { t, i18n } = useTranslation();
  const langue = i18n.language || "fr";
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);

  const lignes = items
    .map((it) => ({ ...it, d: lireDate(it.date) }))
    .sort((a, b) => ((b.d ? b.d.getTime() : 0) - (a.d ? a.d.getTime() : 0)) || (Number(b.id) - Number(a.id)));

  const relatif = (d) => {
    if (!d) return "";
    const n = Math.round((aujourdhui.getTime() - d.getTime()) / 86400000);
    if (n <= 0) return t("Aujourd'hui");
    if (n === 1) return t("Hier");
    if (n < 30) return t("il y a {{n}} jours", { n });
    return d.toLocaleDateString(langue, { day: "2-digit", month: "short", year: "numeric" });
  };

  const sorties = [];
  let precedent = null;
  lignes.forEach((it) => {
    const cle = it.d ? cleJour(it.d) : "sans-date";
    if (cle !== precedent) {
      precedent = cle;
      sorties.push(
        <div key={"g-" + cle} className="msg-groupe">
          {it.d
            ? it.d.toLocaleDateString(langue, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase()
            : "—"}
        </div>
      );
    }
    const actif = actifId != null && String(actifId) === String(it.id);
    sorties.push(
      <div key={it.id} role="listitem" className={"msg-item" + (actif ? " msg-item-actif" : "")}
        onClick={() => { if (sel && sel.actif) { sel.basculer(it.id); return; } onOuvrir(it); }}>
        {renderCase ? renderCase(it) : null}
        <div className="msg-avatar" style={{ background: couleurAvatar }}>
          {String(it.nom || "?").trim()[0] || "?"}
        </div>
        <div className="msg-corps">
          <div className="msg-ligne">
            <span className="msg-nom">{renderNom ? renderNom(it) : it.nom}</span>
            <span className="msg-temps">{relatif(it.d)}</span>
          </div>
          <div className="msg-ligne">
            <span className="msg-apercu">{[it.sousTitre, it.apercu].filter(Boolean).join(" · ")}</span>
            <span className="msg-etat" title={it.statut || ""}>
              {it.accord
                ? <MdCheckCircle style={{ color: "#10b981", fontSize: 18 }} />
                : <MdAccessTime style={{ color: "#888", fontSize: 18 }} />}
            </span>
          </div>
        </div>
        <button type="button" className="msg-suppr" title={titreSupprimer} aria-label={titreSupprimer}
          onClick={(e) => { e.stopPropagation(); onSupprimer(it.id); }}>
          <MdDelete style={{ fontSize: 15 }} />
        </button>
      </div>
    );
  });

  return <div role="list">{sorties}</div>;
}
