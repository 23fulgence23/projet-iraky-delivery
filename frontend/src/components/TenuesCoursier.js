import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MdCheckroom, MdCheckCircle, MdHourglassTop, MdErrorOutline, MdReceipt, MdSend, MdAutorenew } from "react-icons/md";
import TenueApercu from "./TenueApercu";
import { notifierSucces } from "../utils/supprimer";

const nf = (n) => new Intl.NumberFormat("fr-FR").format(n);
const carte = { backgroundColor: "var(--d-card)", border: "1px solid var(--d-border)", borderRadius: 16, padding: 18 };
const ETAT = {
  avec_tenue: { couleur: "#10b981", Icon: MdCheckCircle, texte: "Votre tenue est validée. Merci de la porter pendant vos missions." },
  en_attente: { couleur: "#f59e0b", Icon: MdHourglassTop, texte: "Commande en attente de validation par l'administrateur." },
  sans_tenue: { couleur: "#ef4444", Icon: MdErrorOutline, texte: "Tenue obligatoire : vous n'avez pas encore de tenue validée." },
};
const STATUT = { en_attente: ["En attente de validation", "#f59e0b"], validee: ["Validée", "#10b981"], refusee: ["Refusée", "#ef4444"] };
const entetes = () => ({ Authorization: "Bearer " + localStorage.getItem("token"), Accept: "application/json", "Content-Type": "application/json" });

export default function TenuesCoursier({ apiUrl }) {
  const { t } = useTranslation();
  const [d, setD] = useState(null);
  const [article, setArticle] = useState("tshirt");
  const [taille, setTaille] = useState("M");
  const [quantite, setQuantite] = useState(1);
  const [reference, setReference] = useState("");
  const [face, setFace] = useState("devant");
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  const charger = useCallback(() => {
    fetch(apiUrl + "/api/tenues/mes", { headers: entetes() })
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => { if (x) setD(x); })
      .catch(() => {});
  }, [apiUrl]);
  useEffect(() => { charger(); const iv = setInterval(charger, 15000); return () => clearInterval(iv); }, [charger]);

  const prix = d ? d.prix[article] : 0;
  const total = prix * quantite;
  const etat = d ? ETAT[d.etat] : null;
  const bloque = d && d.etat === "en_attente";

  const commander = async () => {
    setErreur("");
    if (!reference.trim()) { setErreur(t("La référence de paiement est obligatoire.")); return; }
    setEnvoi(true);
    try {
      const r = await fetch(apiUrl + "/api/tenues", {
        method: "POST", headers: entetes(),
        body: JSON.stringify({ article, taille, quantite, reference_paiement: reference.trim() }),
      });
      const x = await r.json().catch(() => ({}));
      if (r.ok) {
        setReference("");
        await notifierSucces(t("Commande envoyée. L'administrateur va la valider."));
        charger();
      } else {
        const premier = x.errors ? Object.values(x.errors)[0][0] : null;
        setErreur(t(premier || x.message || "Erreur de connexion au serveur"));
      }
    } catch {
      setErreur(t("Erreur de connexion au serveur"));
    }
    setEnvoi(false);
  };

  const pastille = (actif, couleur = "#FFD700") => ({
    padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 13,
    color: actif ? "#000" : "var(--d-text)", background: actif ? couleur : "var(--d-bg2)",
    border: "1px solid " + (actif ? couleur : "var(--d-border)"),
  });

  return (
    <div>
      <h4 style={{ color: "var(--d-gold)", marginBottom: 6, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#FFD70018", border: "1px solid #FFD70033", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MdCheckroom style={{ color: "var(--d-gold)", fontSize: 22 }} />
        </div>
        {t("Tenue Iraky Delivery")}
      </h4>
      <p style={{ color: "var(--d-c-aaa)", marginBottom: 18, fontSize: 14 }}>
        {t("Commandez votre T-shirt ou votre gilet officiel. Le port de la tenue est obligatoire pour tous les coursiers.")}
      </p>

      {etat && (
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "12px 14px", borderRadius: 12, marginBottom: 18,
          background: etat.couleur + "14", border: "1px solid " + etat.couleur + "55", color: etat.couleur, fontWeight: 700, fontSize: 14 }}>
          <etat.Icon size={22} /> {t(etat.texte)}
        </div>
      )}

      <div className="row g-3">
        <div className="col-lg-6">
          <div style={{ ...carte, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 10 }}>
              <button type="button" style={pastille(face === "devant")} onClick={() => setFace("devant")}>{t("Devant")}</button>
              <button type="button" style={pastille(face === "dos")} onClick={() => setFace("dos")}><MdAutorenew style={{ verticalAlign: "-3px" }} /> {t("Dos")}</button>
            </div>
            <TenueApercu article={article} face={face} largeur={300} />
            <div style={{ color: "var(--d-c-aaa)", fontSize: 11.5, marginTop: 6 }}>{t("Aperçu (illustration)")}</div>
          </div>
        </div>

        <div className="col-lg-6">
          <div style={carte}>
            <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 14, marginBottom: 10 }}>{t("Choisissez votre tenue")}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {["tshirt", "gilet"].map((a) => (
                <button key={a} type="button" onClick={() => setArticle(a)}
                  style={{ padding: 14, borderRadius: 12, cursor: "pointer", textAlign: "center",
                    background: article === a ? "#FFD70018" : "var(--d-bg2)",
                    border: "2px solid " + (article === a ? "#FFD700" : "var(--d-border)"), color: "var(--d-text)" }}>
                  <MdCheckroom size={28} style={{ color: "var(--d-gold)" }} />
                  <div style={{ fontWeight: 800, marginTop: 4 }}>{t(a === "tshirt" ? "T-shirt" : "Gilet")}</div>
                  <div style={{ color: "var(--d-gold)", fontWeight: 800 }}>{d ? nf(d.prix[a]) : "—"} Ar</div>
                </button>
              ))}
            </div>

            <div style={{ color: "var(--d-c-aaa)", fontSize: 13, marginBottom: 6 }}>{t("Taille")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              {(d ? d.tailles : ["S", "M", "L", "XL"]).map((x) => (
                <button key={x} type="button" style={pastille(taille === x)} onClick={() => setTaille(x)}>{x}</button>
              ))}
            </div>

            <div style={{ color: "var(--d-c-aaa)", fontSize: 13, marginBottom: 6 }}>{t("Quantité")}</div>
            <select value={quantite} onChange={(e) => setQuantite(Number(e.target.value))}
              style={{ width: 90, padding: "8px 10px", borderRadius: 10, marginBottom: 14, background: "var(--d-bg2)", color: "var(--d-text)", border: "1px solid var(--d-border)" }}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>

            <div style={{ background: "var(--d-bg2)", border: "1px solid var(--d-border)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ color: "var(--d-c-aaa)", fontSize: 13 }}>{t("Total à payer")}</span>
                <strong style={{ color: "var(--d-gold)", fontSize: 20 }}>{nf(total)} Ar</strong>
              </div>
              <div style={{ color: "var(--d-c-aaa)", fontSize: 12, lineHeight: 1.5 }}>
                {t("Payez {{montant}} Ar au +261 38 56 040 35 (Administrateur) par mobile money (MVola, Orange Money ou Airtel Money), puis saisissez la référence reçue par SMS.", { montant: nf(total) })}
              </div>
            </div>

            <label style={{ color: "var(--d-c-aaa)", fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <MdReceipt style={{ color: "var(--d-gold)" }} /> {t("Référence de transaction mobile money")} <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} disabled={bloque}
              placeholder={t("Ex: référence reçue par SMS")}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, marginBottom: 10, background: "var(--d-bg2)", color: "var(--d-text)", border: "1px solid var(--d-border)" }} />

            {erreur && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 10 }}>{erreur}</div>}

            <button type="button" onClick={commander} disabled={envoi || bloque}
              style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", fontWeight: 800, fontSize: 15,
                background: "linear-gradient(135deg,#FFD700,#ff9500)", color: "#000",
                cursor: envoi || bloque ? "not-allowed" : "pointer", opacity: envoi || bloque ? 0.55 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <MdSend /> {envoi ? t("Un instant…") : t("Envoyer la commande")}
            </button>
          </div>
        </div>
      </div>

      <div style={{ ...carte, marginTop: 16 }}>
        <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 14, marginBottom: 10 }}>{t("Mes commandes de tenue")}</div>
        {(!d || d.commandes.length === 0) && <div style={{ color: "var(--d-c-aaa)", fontSize: 13 }}>{t("Aucune commande pour le moment.")}</div>}
        {d && d.commandes.map((c) => {
          const [lib, col] = STATUT[c.statut] || [c.statut, "#999"];
          return (
            <div key={c.id} style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", justifyContent: "space-between",
              padding: "10px 0", borderTop: "1px solid var(--d-border)" }}>
              <div>
                <div style={{ color: "var(--d-text)", fontWeight: 700, fontSize: 14 }}>{t(c.libelle)} · {c.taille} · x{c.quantite}</div>
                <div style={{ color: "var(--d-c-aaa)", fontSize: 12 }}>{c.date} · {nf(c.total)} Ar</div>
                {c.statut === "refusee" && c.motif_refus && <div style={{ color: "#ef4444", fontSize: 12 }}>{t("Motif :")} {c.motif_refus}</div>}
              </div>
              <span style={{ padding: "3px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: col, background: col + "18", border: "1px solid " + col + "44" }}>{t(lib)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
