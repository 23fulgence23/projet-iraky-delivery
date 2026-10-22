import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MdAccessTime, MdClose, MdPayment, MdArrowBack, MdCheckCircle } from "react-icons/md";

const JOURS_RAPPEL = 5;
const MONTANT_MIN = 10000;

const champ = {
  width: "100%", backgroundColor: "#0a0a1e", border: "1px solid #FFD70033",
  color: "#fff", borderRadius: 10, padding: "10px 12px", fontSize: 14, margin: "4px 0 12px",
};
const champLecture = { ...champ, backgroundColor: "#15153a", color: "#bbb", border: "1px solid #ffffff14" };
const etiquette = { color: "#aaa", fontSize: 13 };

export default function RappelAbonnement({ apiUrl }) {
  const { t, i18n } = useTranslation();
  const [etat, setEtat] = useState(null);
  const [masque, setMasque] = useState(() => {
    try { return sessionStorage.getItem("rappel-abonnement-masque") === "1"; } catch { return false; }
  });
  const [ouvert, setOuvert] = useState(false);
  const [confirme, setConfirme] = useState(false);
  const [form, setForm] = useState({ numero_envoi: "", reference: "", montant: MONTANT_MIN });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  const entetes = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  });

  const charger = () =>
    fetch(`${apiUrl}/api/abonnement`, { headers: entetes() })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setEtat(d); })
      .catch(() => {});

  useEffect(() => {
    charger();
    const iv = setInterval(charger, 30000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!confirme) return undefined;
    const to = setTimeout(() => setConfirme(false), 6000);
    return () => clearTimeout(to);
  }, [confirme]);

  const cacher = () => {
    setMasque(true);
    try { sessionStorage.setItem("rappel-abonnement-masque", "1"); } catch {}
  };

  const soumettre = async (e) => {
    e.preventDefault();
    setErreur("");
    const montant = Number(form.montant);
    if (!form.numero_envoi.trim() || !form.reference.trim() || !montant) {
      setErreur(t("Veuillez remplir tous les champs obligatoires"));
      return;
    }
    if (montant < MONTANT_MIN) {
      setErreur(t("Le montant doit être d'au moins 10 000 Ar."));
      return;
    }
    setEnvoi(true);
    try {
      const res = await fetch(`${apiUrl}/api/abonnement/paiements`, {
        method: "POST", headers: entetes(),
        body: JSON.stringify({ numero_envoi: form.numero_envoi, reference: form.reference, montant }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok) {
        setOuvert(false);
        setConfirme(true);
        setForm((f) => ({ ...f, reference: "" }));
        charger();
      } else {
        const premier = d.errors ? Object.values(d.errors)[0][0] : null;
        setErreur(t(premier || d.message || "Impossible d'envoyer le paiement."));
      }
    } catch {
      setErreur(t("Erreur de connexion au serveur"));
    }
    setEnvoi(false);
  };

  const jours = etat ? etat.jours_restants : null;
  const enAttente = !!(etat && etat.dernier_paiement && etat.dernier_paiement.statut === "en_attente");
  const afficher = !!etat && !etat.suspendu && jours !== null && jours <= JOURS_RAPPEL && !enAttente;

  let quand = "";
  let dateTxt = "";
  if (afficher) {
    quand = jours <= 0 ? t("Votre abonnement expire aujourd'hui.")
      : jours === 1 ? t("Votre abonnement expire demain.")
      : t("Votre abonnement expire dans {{n}} jours.", { n: jours });
    try {
      dateTxt = new Date(etat.abonnement_expire).toLocaleDateString(i18n.language || "fr", { day: "2-digit", month: "long" });
    } catch { dateTxt = ""; }
  }

  const bouton = { border: "none", fontWeight: 800, fontSize: 13, borderRadius: 10, padding: "8px 14px",
    background: "linear-gradient(135deg,#FFD700,#ff9500)", color: "#000", cursor: "pointer" };

  const bandeau = (
    <div style={{ position: "fixed", top: 78, left: "50%", transform: "translateX(-50%)", zIndex: 900,
      width: "calc(100% - 24px)", maxWidth: 560, backgroundColor: "#2a1d05", border: "1px solid #f59e0b77",
      borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>
      <MdAccessTime style={{ color: "#f59e0b", fontSize: 26, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 180 }}>
        <div style={{ color: "#fcd34d", fontWeight: 800, fontSize: 14 }}>{quand}</div>
        <div style={{ color: "#d9b66a", fontSize: 12, marginTop: 2 }}>
          {t("Payez avant le {{date}} pour éviter la suspension de votre compte.", { date: dateTxt })}
        </div>
      </div>
      <button type="button" style={bouton} onClick={() => { setErreur(""); setOuvert(true); }}>{t("Payer maintenant")}</button>
      <button type="button" aria-label={t("Fermer")} onClick={cacher}
        style={{ background: "transparent", border: "none", color: "#d9b66a", cursor: "pointer", display: "flex" }}>
        <MdClose style={{ fontSize: 20 }} />
      </button>
    </div>
  );

  const confirmation = (
    <div style={{ position: "fixed", top: 78, left: "50%", transform: "translateX(-50%)", zIndex: 900,
      width: "calc(100% - 24px)", maxWidth: 560, backgroundColor: "#06241a", border: "1px solid #10b98177",
      borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10,
      boxShadow: "0 10px 30px rgba(0,0,0,0.45)" }}>
      <MdCheckCircle style={{ color: "#10b981", fontSize: 24, flexShrink: 0 }} />
      <span style={{ color: "#6ee7b7", fontWeight: 700, fontSize: 14 }}>
        {t("Paiement envoyé. Il sera validé par l'administrateur.")}
      </span>
    </div>
  );

  const modal = (
    <div onClick={() => setOuvert(false)} style={{ position: "fixed", inset: 0, zIndex: 2000,
      backgroundColor: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={soumettre} style={{ backgroundColor: "#131330",
        borderRadius: 16, border: "1px solid #FFD70025", padding: 22, width: "100%", maxWidth: 780,
        maxHeight: "92vh", overflowY: "auto", colorScheme: "dark", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ color: "#FFD700", fontWeight: 800, fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <MdPayment size={20} /> {t("Payer un abonnement")}
          </div>
          <button type="button" onClick={() => setOuvert(false)}
            style={{ background: "transparent", border: "none", color: "#aaa", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
            <MdArrowBack /> {t("Retour")}
          </button>
        </div>

        {erreur && (
          <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8, fontSize: 13,
            backgroundColor: "#ef444422", color: "#ef4444" }}>{erreur}</div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", columnGap: 16 }}>
          <div>
            <label style={etiquette}>{t("Nom")}</label>
            <input type="text" value={(etat && etat.nom) || ""} readOnly style={champLecture} />
          </div>
          <div>
            <label style={etiquette}>{t("Prénom")}</label>
            <input type="text" value={(etat && etat.prenom) || ""} readOnly style={champLecture} />
          </div>
          <div>
            <label style={etiquette}>{t("Email")}</label>
            <input type="email" value={(etat && etat.email) || ""} readOnly style={champLecture} />
          </div>
          <div>
            <label style={etiquette}>{t("Numéro de l'administrateur (envoyez le paiement ici)")}</label>
            <input type="text" value={(etat && etat.numero_paiement) || "+261 32 53 200 54"} readOnly
              style={{ ...champLecture, color: "#3b82f6", fontWeight: 700 }} />
          </div>
          <div>
            <label style={etiquette}>{t("Numéro utilisé pour l'envoi")} <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" value={form.numero_envoi} placeholder="03X XX XXX XX" style={champ}
              onChange={(e) => setForm({ ...form, numero_envoi: e.target.value })} />
          </div>
          <div>
            <label style={etiquette}>{t("Référence de la transaction")} <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" value={form.reference} placeholder={t("Ex: MVOLA-2026-XXXXXXXX")} style={champ}
              onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </div>
          <div>
            <label style={etiquette}>{t("Montant payé (Ar)")} <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="number" min={MONTANT_MIN} value={form.montant} style={champ}
              onChange={(e) => setForm({ ...form, montant: e.target.value })} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 12 }}>
            <button type="submit" disabled={envoi}
              style={{ ...bouton, width: "100%", padding: 12, fontSize: 15, borderRadius: 12,
                cursor: envoi ? "not-allowed" : "pointer", opacity: envoi ? 0.7 : 1 }}>
              {envoi ? t("Envoi en cours...") : t("Envoyer mon paiement")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {afficher && !masque && !ouvert && !confirme && createPortal(bandeau, document.body)}
      {confirme && createPortal(confirmation, document.body)}
      {ouvert && createPortal(modal, document.body)}
    </>
  );
}
