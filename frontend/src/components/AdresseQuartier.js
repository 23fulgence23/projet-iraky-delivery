import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import QUARTIERS from "../data/quartiersToliara";

const norm = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function AdresseQuartier({ onChange, inputStyle = {} }) {
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

  const saisir = (v) => {
    setTexte(v); setQuartier(""); setOuvert(true); emettre("", complement);
  };
  const choisir = (q) => {
    setTexte(q); setQuartier(q); setOuvert(false); emettre(q, complement);
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <input type="text" className="form-control mt-1" value={texte} style={inputStyle}
          placeholder={t("Tapez votre quartier (ex : Tsimenatse)")}
          onChange={(e) => saisir(e.target.value)}
          onFocus={() => setOuvert(true)}
          onBlur={() => setTimeout(() => setOuvert(false), 120)}
          autoComplete="off" />
        {ouvert && (
          <div style={{ position: "absolute", left: 0, right: 0, top: "100%", zIndex: 50, maxHeight: 220, overflowY: "auto",
            marginTop: 4, borderRadius: 10, border: "1px solid var(--d-border, #333355)",
            backgroundColor: "var(--d-card, #131330)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
            {liste.length === 0 && (
              <div style={{ padding: "10px 14px", color: "#888", fontSize: 13 }}>{t("Aucun quartier trouvé")}</div>
            )}
            {liste.map((q) => (
              <div key={q} onMouseDown={(e) => { e.preventDefault(); choisir(q); }}
                style={{ padding: "9px 14px", cursor: "pointer", fontSize: 14, color: "var(--d-text, #fff)",
                  borderBottom: "1px solid var(--d-border, #333355)" }}>{q}</div>
            ))}
          </div>
        )}
      </div>
      {texte && !quartier && (
        <small style={{ color: "#f59e0b", fontSize: 11 }}>{t("Choisissez un quartier dans la liste.")}</small>
      )}
      <input type="text" className="form-control mt-2" value={complement} style={inputStyle}
        placeholder={t("Précision (facultatif) : rue, repère, près de...")}
        onChange={(e) => { setComplement(e.target.value); emettre(quartier, e.target.value); }} />
    </div>
  );
}
