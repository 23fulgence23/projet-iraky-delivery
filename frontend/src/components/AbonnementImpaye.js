import ThemeToggle from "./ThemeToggle";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdWarning, MdLogout, MdCheckCircle, MdAccessTime, MdCancel, MdPayment, MdArrowBack } from "react-icons/md";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../logo.png";
import { formatDateHeure } from "../utils/formatDateHeure";

const MONTANT_MIN = 10000;

const champ = {
  width: "100%", backgroundColor: "var(--d-bg2)", border: "1px solid #FFD70033",
  color: "var(--d-text)", borderRadius: 10, padding: "10px 12px", fontSize: 14, margin: "4px 0 12px",
};
const champLecture = { ...champ, backgroundColor: "var(--d-card2)", color: "var(--d-c-bbb)", border: "1px solid #ffffff14" };
const etiquette = { color: "var(--d-c-aaa)", fontSize: 13 };

export default function AbonnementImpaye({ profil, apiUrl }) {
  const { t } = useTranslation();
  const [etat, setEtat] = useState(null);
  const [ouvert, setOuvert] = useState(false);
  const [form, setForm] = useState({ numero_envoi: "", reference: "", montant: MONTANT_MIN });
  const [envoi, setEnvoi] = useState(false);
  const [message, setMessage] = useState({ type: "", texte: "" });

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
    const iv = setInterval(charger, 10000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profil && profil.telephone) {
      setForm((f) => (f.numero_envoi ? f : { ...f, numero_envoi: profil.telephone }));
    }
  }, [profil]);

  const soumettre = async (e) => {
    e.preventDefault();
    setMessage({ type: "", texte: "" });
    const montant = Number(form.montant);
    if (!form.numero_envoi.trim() || !form.reference.trim() || !montant) {
      setMessage({ type: "error", texte: t("Veuillez remplir tous les champs obligatoires") });
      return;
    }
    if (montant < MONTANT_MIN) {
      setMessage({ type: "error", texte: t("Le montant doit être d'au moins 10 000 Ar.") });
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
        setMessage({ type: "", texte: "" });
        setForm((f) => ({ ...f, reference: "" }));
        setOuvert(false);
        charger();
      } else {
        const premier = d.errors ? Object.values(d.errors)[0][0] : null;
        setMessage({ type: "error", texte: t(premier || d.message || "Impossible d'envoyer le paiement.") });
      }
    } catch {
      setMessage({ type: "error", texte: t("Erreur de connexion au serveur") });
    }
    setEnvoi(false);
  };

  const deconnexion = () => { localStorage.clear(); window.location.href = "/connexion"; };

  const dernier = etat && etat.dernier_paiement;
  const enAttente = dernier && dernier.statut === "en_attente";
  const echeanceFuture = etat && etat.abonnement_expire && new Date(etat.abonnement_expire) > new Date();
  const attenteReactivation = !enAttente && dernier && dernier.statut === "valide" && echeanceFuture;
  const rejete = !enAttente && !attenteReactivation && dernier && dernier.statut === "rejete";
  const peutPayer = !!etat && !enAttente;

  const bandeau = (couleur, Icone, contenu) => (
    <div style={{ backgroundColor: couleur + "14", border: `1px solid ${couleur}55`, borderRadius: 14,
      padding: 16, display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
      <Icone style={{ color: couleur, fontSize: 24, flexShrink: 0 }} />
      <div style={{ fontSize: 14 }}>{contenu}</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--d-bg)", color: "var(--d-text)",
      fontFamily: "'Segoe UI', sans-serif", padding: "20px 16px 40px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img src={logo} alt="" style={{ width: 40, height: 40, borderRadius: "50%" }} />
            <span style={{ color: "var(--d-gold)", fontWeight: 800 }}>IRAKY Delivery</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LanguageSwitcher />
            <ThemeToggle size={34} />
            <button type="button" onClick={deconnexion}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent",
                border: "1px solid #ef444455", color: "#ef4444", borderRadius: 10,
                padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>
              <MdLogout /> {t("Se déconnecter")}
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: "#ef444414", border: "1px solid #ef444455", borderRadius: 16,
          padding: 20, marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <MdWarning style={{ color: "#ef4444", fontSize: 28 }} />
            <h4 style={{ margin: 0, color: "#ef4444", fontWeight: 800, fontSize: 18 }}>{t("Abonnement impayé")}</h4>
          </div>
          <p style={{ margin: "0 0 6px", fontWeight: 700 }}>{t("Vous n'avez pas encore payé votre abonnement.")}</p>
          <p style={{ margin: 0, color: "var(--d-c-bbb)", fontSize: 14, lineHeight: 1.6 }}>
            {t("Votre compte est suspendu. Pour le réactiver, envoyez votre abonnement mensuel puis renseignez les informations de votre paiement ci-dessous.")}
          </p>
          {etat && etat.abonnement_expire && (
            <p style={{ margin: "10px 0 0", color: "#888", fontSize: 12 }}>
              {t("Échéance :")} {formatDateHeure(etat.abonnement_expire)}
            </p>
          )}
        </div>

        {enAttente && bandeau("#f59e0b", MdAccessTime,
          <span style={{ color: "#f59e0b", fontWeight: 700 }}>{t("Paiement envoyé — en attente de validation par l'administrateur.")}</span>)}
        {attenteReactivation && bandeau("#10b981", MdCheckCircle,
          <span style={{ color: "#10b981", fontWeight: 700 }}>{t("Paiement validé. L'administrateur va réactiver votre compte.")}</span>)}
        {rejete && bandeau("#ef4444", MdCancel, <>
          <div style={{ color: "#ef4444", fontWeight: 700 }}>{t("Votre dernier paiement a été rejeté :")}</div>
          <div style={{ color: "var(--d-text)", margin: "4px 0" }}>{dernier.motif_rejet}</div>
          <div style={{ color: "var(--d-c-999)", fontSize: 12 }}>{t("Vous pouvez envoyer un nouveau paiement.")}</div>
        </>)}

        {peutPayer && (
          <button type="button" onClick={() => setOuvert(true)}
            style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", fontWeight: 800, fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              background: "linear-gradient(135deg,var(--d-gold),#ff9500)", color: "#000", cursor: "pointer" }}>
            <MdPayment size={20} /> {t("Payer un abonnement")}
          </button>
        )}

        {peutPayer && ouvert && (
          <div onClick={() => setOuvert(false)} style={{ position: "fixed", inset: 0, zIndex: 1000,
            backgroundColor: "rgba(0,0,0,0.78)", display: "flex", alignItems: "center",
            justifyContent: "center", padding: 16 }}>
            <form onClick={(e) => e.stopPropagation()} onSubmit={soumettre} style={{ backgroundColor: "var(--d-card)",
              borderRadius: 16, border: "1px solid #FFD70025", padding: 22, width: "100%", maxWidth: 780,
              maxHeight: "92vh", overflowY: "auto", colorScheme: "dark",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ color: "var(--d-gold)", fontWeight: 800, fontSize: 16 }}>{t("Payer un abonnement")}</div>
                <button type="button" onClick={() => setOuvert(false)}
                  style={{ background: "transparent", border: "none", color: "var(--d-c-aaa)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                  <MdArrowBack /> {t("Retour")}
                </button>
              </div>

              {message.texte && (
                <div style={{ marginBottom: 12, padding: "8px 12px", borderRadius: 8, fontSize: 13,
                  backgroundColor: message.type === "success" ? "#10b98122" : "#ef444422",
                  color: message.type === "success" ? "#10b981" : "#ef4444" }}>
                  {message.texte}
                </div>
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
                    style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", fontWeight: 800, fontSize: 15,
                      background: "linear-gradient(135deg,var(--d-gold),#ff9500)", color: "#000",
                      cursor: envoi ? "not-allowed" : "pointer", opacity: envoi ? 0.7 : 1 }}>
                    {envoi ? t("Envoi en cours...") : t("Envoyer mon paiement")}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
