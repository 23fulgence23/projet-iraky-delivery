import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MdLocationOn, MdEdit } from "react-icons/md";
import QUARTIERS from "../data/quartiersToliara";

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function AdresseQuartier({ onChange, error }) {
  const { t } = useTranslation();
  const [texte, setTexte] = useState("");
  const [quartier, setQuartier] = useState("");
  const [complement, setComplement] = useState("");
  const [ouvert, setOuvert] = useState(false);

  const liste = useMemo(() => {
    const q = norm(texte.trim());
    return q ? QUARTIERS.filter((x) => norm(x).includes(q)) : QUARTIERS;
  }, [texte]);

  const emettre = (q, c) => onChange(q ? (c.trim() ? q + " — " + c.trim() : q) : "");
  const saisir = (v) => { setTexte(v); setQuartier(""); setOuvert(true); emettre("", complement); };
  const choisir = (q) => { setTexte(q); setQuartier(q); setOuvert(false); emettre(q, complement); };

  return (
    <div>
      <div className="au-input-wrap">
        <span className="au-ico"><MdLocationOn /></span>
        <input type="text" value={texte} autoComplete="off"
          className={"au-input" + (error ? " err" : "")}
          placeholder={t("Tapez votre quartier (ex : Tsimenatse)")}
          onChange={(e) => saisir(e.target.value)}
          onFocus={() => setOuvert(true)}
          onBlur={() => setTimeout(() => setOuvert(false), 120)} />
        {ouvert && (
          <div className="au-dd">
            {liste.length === 0 && <div className="au-dd-item" style={{ cursor: "default" }}>{t("Aucun quartier trouvé")}</div>}
            {liste.map((q) => (
              <div key={q} className="au-dd-item" onMouseDown={(e) => { e.preventDefault(); choisir(q); }}>{q}</div>
            ))}
          </div>
        )}
      </div>
      {texte && !quartier && <small className="au-hint" style={{ color: "#f59e0b" }}>{t("Choisissez un quartier dans la liste.")}</small>}
      <div className="au-input-wrap" style={{ marginTop: 10 }}>
        <span className="au-ico"><MdEdit /></span>
        <input type="text" value={complement} className="au-input"
          placeholder={t("Précision (facultatif) : rue, repère, près de...")}
          onChange={(e) => { setComplement(e.target.value); emettre(quartier, e.target.value); }} />
      </div>
    </div>
  );
}
