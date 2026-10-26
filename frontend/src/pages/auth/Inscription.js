import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdPerson, MdEmail, MdPhone, MdLock, MdBadge, MdPhotoCamera, MdHome, MdMyLocation,
         MdArrowBack, MdArrowForward, MdCheckCircle, MdErrorOutline, MdDeliveryDining,
         MdAttachMoney, MdReceipt, MdUploadFile, MdVerified, MdCancel, MdRefresh } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { AuthShell, AuthHead, Champ, sans } from "../../components/AuthUi";
import AdresseQuartier from "../../components/AdresseQuartier";

const API = "https://projet-iraky-delivery.onrender.com/api";
const ETAPE1 = ["nom", "prenom", "email", "telephone", "adresse", "password", "password_confirmation"];

function ApercuCIN({ fichier }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!fichier || !fichier.type || !fichier.type.startsWith("image/")) { setUrl(null); return; }
    const u = URL.createObjectURL(fichier);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [fichier]);
  if (!url) return null;
  return (
    <img src={url} alt={t("Aperçu CIN")}
      style={{ width: "100%", aspectRatio: "85.6 / 54", objectFit: "contain", backgroundColor: "#000",
        borderRadius: 10, border: "1px solid var(--d-border)", marginTop: 8, display: "block" }} />
  );
}

function Fichier({ label, name, accept, fichier, onChange, error, Icon, aide, apercu }) {
  const { t } = useTranslation();
  return (
    <Champ label={label} required error={error}>
      <label className={"au-file" + (fichier ? " has" : "") + (error ? " err" : "")}>
        <input type="file" name={name} accept={accept} onChange={onChange} hidden />
        <span className="au-file-ico">{fichier ? <MdCheckCircle /> : <Icon />}</span>
        <span className="au-file-txt">
          <strong>{fichier ? fichier.name : t("Choisir un fichier")}</strong>
          {aide && <small>{aide}</small>}
        </span>
      </label>
      {apercu && <ApercuCIN fichier={fichier} />}
    </Champ>
  );
}

function Etapes({ etape, libelle2 }) {
  const { t } = useTranslation();
  const items = [t("Compte"), libelle2];
  return (
    <div className="au-steps">
      <span className="au-steps-bar"><i style={{ width: etape === 1 ? "0%" : "100%" }} /></span>
      {items.map((l, i) => {
        const n = i + 1;
        const etat = etape > n ? "done" : etape === n ? "on" : "";
        return (
          <div key={n} className={"au-step " + etat}>
            <span className="au-step-dot">{etape > n ? <MdCheckCircle /> : n}</span>
            <span className="au-step-lbl">{l}</span>
          </div>
        );
      })}
    </div>
  );
}

function Inscription() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [etape, setEtape] = useState(1);
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [localisation, setLocalisation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [modalSucces, setModalSucces] = useState(false);
  const [userIdCree, setUserIdCree] = useState(null);
  const [etapeValidation, setEtapeValidation] = useState(1);
  const [msgRejetRecu, setMsgRejetRecu] = useState("");
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    adresse: "", password: "", password_confirmation: "",
    cin: "", photo_recto: null, photo_verso: null,
    mvola_transaction: "", certificat_residence: null,
  });

  const haut = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;
    setForm((f) => ({ ...f, [name]: type === "file" ? files[0] : value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const getLocalisation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      setErrors((p) => ({ ...p, localisation: t("Géolocalisation non supportée.") }));
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalisation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocLoading(false);
        setErrors((p) => ({ ...p, localisation: "" }));
      },
      (err) => {
        setLocLoading(false);
        setErrors((p) => ({ ...p, localisation: err.code === 1
          ? t("Permission refusée. Cliquez sur le 🔒 cadenas → Localisation → Autoriser, puis réessayez.")
          : t("Position indisponible. Réessayez.") }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const validerEtape1 = () => {
    const e = {};
    if (!form.nom.trim()) e.nom = t("Le nom est obligatoire.");
    if (!form.prenom.trim()) e.prenom = t("Le prénom est obligatoire.");
    if (!form.email.trim()) e.email = t("L'email est obligatoire.");
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = t("Email invalide.");
    if (!form.telephone.trim()) e.telephone = t("Le téléphone est obligatoire.");
    if (!form.adresse.trim()) e.adresse = t("L'adresse est obligatoire.");
    if (!form.password) e.password = t("Le mot de passe est obligatoire.");
    else if (form.password.length < 6) e.password = t("Minimum 6 caractères.");
    if (form.password !== form.password_confirmation) e.password_confirmation = t("Les mots de passe ne correspondent pas.");
    return e;
  };

  const validerEtape2 = () => {
    const e = {};
    if (!form.cin.trim()) e.cin = t("Le numéro CIN est obligatoire.");
    if (!form.photo_recto) e.photo_recto = t("La photo recto est obligatoire.");
    if (!form.photo_verso) e.photo_verso = t("La photo verso est obligatoire.");
    if (!form.certificat_residence) e.certificat_residence = t("Le certificat de résidence est obligatoire.");
    else if (form.certificat_residence.size > 10 * 1024 * 1024) e.certificat_residence = t("Fichier trop lourd (10 Mo maximum).");
    if (!localisation) e.localisation = t("La localisation est obligatoire pour les coursiers.");
    if (!form.mvola_transaction.trim()) e.mvola_transaction = t("La référence de paiement est obligatoire.");
    return e;
  };

  const continuer = () => {
    const e = validerEtape1();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setEtape(2);
    haut();
    if (role === "coursier" && !localisation) getLocalisation();
  };

  const handleSubmit = async () => {
    if (role === "coursier") {
      const e2 = validerEtape2();
      if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    }
    setLoading(true);
    setError("");
    setErrors({});
    try {
      const formData = new FormData();
      ETAPE1.forEach((k) => formData.append(k, form[k]));
      formData.append("role", role);
      if (localisation) {
        formData.append("latitude", localisation.latitude);
        formData.append("longitude", localisation.longitude);
        formData.append("localisation", `${localisation.latitude},${localisation.longitude}`);
      }
      if (role === "coursier") {
        formData.append("cin", form.cin);
        formData.append("photo_recto", form.photo_recto);
        formData.append("photo_verso", form.photo_verso);
        formData.append("mvola_transaction", form.mvola_transaction);
        formData.append("certificat_residence", form.certificat_residence);
      }
      const response = await fetch(`${API}/register`, { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) {
        if (role === "coursier") { setUserIdCree(data.user.id); setModalSucces(true); }
        else navigate("/connexion", { state: { success: "Inscription réussie ! Connectez-vous maintenant." } });
      } else if (data.errors) {
        const le = {};
        Object.keys(data.errors).forEach((k) => { le[k] = data.errors[k][0]; });
        if (le.latitude || le.longitude) le.localisation = le.latitude || le.longitude;
        setErrors(le);
        if (ETAPE1.some((k) => le[k])) { setEtape(1); haut(); }
      } else {
        setError(data.message || t("Erreur lors de l'inscription"));
      }
    } catch {
      setError(t("Erreur de connexion au serveur"));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!modalSucces || !userIdCree) return;
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`${API}/verifier-statut-coursier/${userIdCree}`);
        if (res.status === 404) { setEtapeValidation(0); clearInterval(iv); return; }
        const data = await res.json();
        if (data.statut === "actif") { setEtapeValidation(4); clearInterval(iv); }
        else if (data.statut === "rejete") {
          setMsgRejetRecu(data.message || "Votre dossier a été rejeté.");
          setEtapeValidation(0);
          clearInterval(iv);
        } else setEtapeValidation(2);
      } catch (e) { console.error(e); }
    }, 3000);
    return () => clearInterval(iv);
  }, [modalSucces, userIdCree]);

  const estCoursier = role === "coursier";
  const rolesDispo = [
    { id: "client", Icon: MdPerson, titre: t("Client"), sous: t("Gratuit") },
    { id: "coursier", Icon: MdDeliveryDining, titre: t("Coursier"), sous: t("10 000 Ar droit d'inscription") },
  ];
  const sequence = [
    t("Dossier envoyé à l'administrateur"), t("Vérification en cours..."),
    t("Notification de validation"), t("Connexion autorisée"),
  ];

  return (
    <>
      {modalSucces && (
        <div className="au-modal">
          <div className="au-card">
            <div className="au-head" style={{ marginBottom: 16 }}>
              <div className="au-logo" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg,#f59e0b,#FFD700)", color: "#000" }}>
                <MdDeliveryDining size={40} />
              </div>
              <h2 className="au-title" style={{ fontSize: 21 }}>{sans(t("Inscription reçue ! 🎉"))}</h2>
              <p style={{ color: "var(--d-text)", fontSize: 15, margin: "6px 0" }}>
                {t("Merci")} <strong style={{ color: "var(--d-gold)" }}>{form.prenom} {form.nom}</strong> {t("pour votre inscription.")}
              </p>
              <p className="au-sub">{t("Votre dossier est en cours de vérification par l'administrateur. Vous recevrez une notification dès que votre compte sera validé.")}</p>
            </div>

            <div className="au-seq">
              {sequence.map((txt, i) => {
                const done = etapeValidation >= i + 1;
                return (
                  <div key={i} className={"au-seq-row" + (done ? " done" : "")}>
                    <span className="au-seq-dot">{done ? <MdCheckCircle /> : i + 1}</span>{txt}
                  </div>
                );
              })}
            </div>

            {etapeValidation === 4 && (
              <div className="au-banner ok" style={{ justifyContent: "center" }}>
                <p><strong>{sans(t("🎉 Votre compte a été validé ! Vous pouvez vous connecter."))}</strong></p>
              </div>
            )}

            {etapeValidation === 0 && (
              <div className="au-banner bad" style={{ textAlign: "left", flexDirection: "column" }}>
                <p><strong>{sans(t("❌ Votre dossier a été rejeté"))}</strong></p>
                {msgRejetRecu && (
                  <p className="s">
                    {msgRejetRecu.replace("❌ Votre dossier a été rejeté. Raison : ", "").replace(". Réinscrivez-vous en corrigeant les erreurs.", "")}
                  </p>
                )}
                <p className="s">{sans(t("📧 Un email de notification a été envoyé à"))} <strong>{form.email}</strong></p>
                <button type="button" className="au-btn" style={{ height: 42, marginTop: 6, background: "#ef4444", color: "#fff", boxShadow: "none" }}
                  onClick={() => { setModalSucces(false); setEtapeValidation(1); setEtape(1); }}>
                  <MdRefresh /> {sans(t("🔄 Corriger et se réinscrire"))}
                </button>
              </div>
            )}

            <button type="button" className="au-btn"
              onClick={() => navigate("/connexion", { state: etapeValidation === 4 ? { coursierValide: true, prenom: form.prenom } : {} })}>
              {t("Retour à la connexion")}
            </button>
          </div>
        </div>
      )}

      <AuthShell maxWidth={640}>
        <AuthHead titre={t("Créer un compte")} sousTitre={t("Rejoignez IRAKY Delivery")} />
        <Etapes etape={etape} libelle2={estCoursier ? t("Vérification") : t("Finalisation")} />

        {error && (
          <div className="au-banner bad"><MdErrorOutline className="bi" /><p>{t(error)}</p></div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); if (etape === 1) continuer(); else handleSubmit(); }}>

          {/* ───── Étape 1 : compte ───── */}
          <div className="au-pane" style={{ display: etape === 1 ? "block" : "none" }}>
            <div className="au-roles">
              {rolesDispo.map((r) => (
                <button type="button" key={r.id} className={"au-role" + (role === r.id ? " on" : "")}
                  onClick={() => setRole(r.id)}>
                  <r.Icon /><strong>{r.titre}</strong><small>{r.sous}</small>
                </button>
              ))}
            </div>

            {estCoursier && (
              <div className="au-banner warn">
                <MdVerified className="bi" />
                <div>
                  <p><strong>{t("Inscription coursier — Vérification requise")}</strong></p>
                  <p className="s">
                    {t("Votre compte sera vérifié par l'administrateur avant activation. Payez le droit d'inscription de")} <strong>10 000 Ar</strong> {t("par MVola au")} <strong>+261 38 56 040 35</strong> {t("(Administrateur) puis renseignez la référence ci-dessous.")}
                  </p>
                </div>
              </div>
            )}

            <div className="au-row">
              <Champ label={t("Nom")} required Icon={MdPerson} name="nom" placeholder={t("Votre nom")} value={form.nom} onChange={handleChange} error={errors.nom} />
              <Champ label={t("Prénom")} required Icon={MdPerson} name="prenom" placeholder={t("Votre prénom")} value={form.prenom} onChange={handleChange} error={errors.prenom} />
            </div>
            <div className="au-row">
              <Champ label={t("Email")} required Icon={MdEmail} type="email" name="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} error={errors.email} />
              <Champ label={t("Téléphone")} required Icon={MdPhone} name="telephone" placeholder="+261 XX XX XXX XX" value={form.telephone} onChange={handleChange} error={errors.telephone} />
            </div>

            <Champ label={t("Adresse")} required error={errors.adresse}>
              <AdresseQuartier error={errors.adresse}
                onChange={(v) => { setForm((f) => ({ ...f, adresse: v })); if (v) setErrors((p) => ({ ...p, adresse: "" })); }} />
            </Champ>

            <div className="au-row">
              <Champ label={t("Mot de passe")} required Icon={MdLock} password name="password" placeholder="••••••••" autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password} />
              <Champ label={t("Confirmation")} required Icon={MdLock} password name="password_confirmation" placeholder="••••••••" autoComplete="new-password" value={form.password_confirmation} onChange={handleChange} error={errors.password_confirmation} />
            </div>

            <div className="au-actions">
              <button type="submit" className="au-btn">{t("Continuer")} <MdArrowForward size={20} /></button>
            </div>
          </div>

          {/* ───── Étape 2 ───── */}
          <div className="au-pane" style={{ display: etape === 2 ? "block" : "none" }}>

            {estCoursier && (
              <>
                <Champ label={t("Numéro CIN")} required Icon={MdBadge} name="cin" placeholder={t("Votre numéro CIN")} value={form.cin} onChange={handleChange} error={errors.cin} />
                <div className="au-row">
                  <Fichier label={t("Photo CIN — Recto")} name="photo_recto" accept="image/*" Icon={MdPhotoCamera}
                    fichier={form.photo_recto} onChange={handleChange} error={errors.photo_recto} apercu />
                  <Fichier label={t("Photo CIN — Verso")} name="photo_verso" accept="image/*" Icon={MdPhotoCamera}
                    fichier={form.photo_verso} onChange={handleChange} error={errors.photo_verso} apercu />
                </div>
                <Fichier label={t("Certificat de résidence")} name="certificat_residence" accept="image/*,application/pdf" Icon={MdHome}
                  aide={t("Photo ou PDF — 10 Mo maximum.")} fichier={form.certificat_residence} onChange={handleChange} error={errors.certificat_residence} />
              </>
            )}

            <Champ label={<>{t("Localisation")}{!estCoursier && <span style={{ opacity: 0.7, fontWeight: 400 }}> {t("(optionnelle)")}</span>}</>} required={estCoursier} error={errors.localisation}>
              <div className="au-loc">
                <button type="button" className={localisation ? "ok" : ""} onClick={getLocalisation} disabled={locLoading}>
                  {locLoading ? <span className="au-spin" style={{ borderColor: "rgba(255,215,0,.3)", borderTopColor: "#FFD700", width: 16, height: 16 }} />
                    : localisation ? <MdCheckCircle size={18} /> : <MdMyLocation size={18} />}
                  {sans(locLoading ? t("⏳ En cours...") : localisation ? t("✅ Position obtenue") : t("📍 Activer ma localisation"))}
                </button>
                {localisation && <span style={{ color: "#10b981", fontSize: 12 }}>({localisation.latitude.toFixed(4)}, {localisation.longitude.toFixed(4)})</span>}
              </div>
              <small className="au-hint">{estCoursier ? t("Obligatoire pour les coursiers.") : t("Pour que les coursiers vous trouvent facilement.")}</small>
            </Champ>

            {estCoursier && (
              <div className="au-box">
                <div className="au-box-title"><MdAttachMoney size={22} /> {t("Paiement du droit d'inscription")}</div>
                <div className="au-kv">
                  <div><small>{t("Montant")}</small><b style={{ color: "var(--d-gold)" }}>10 000 Ar</b></div>
                  <div><small>{t("Service")}</small><b style={{ color: "#10b981" }}>MVola</b></div>
                  <div><small>{t("Numéro admin")}</small><b style={{ color: "#3b82f6" }}>+261 38 56 040 35</b></div>
                  <div><small>{t("Nom bénéficiaire")}</small><b style={{ color: "#8b5cf6" }}>{t("Administrateur")}</b></div>
                </div>
                <Champ label={t("Référence de transaction mobile money")} required Icon={MdReceipt} name="mvola_transaction"
                  placeholder={t("Ex: référence reçue par SMS")} value={form.mvola_transaction} onChange={handleChange} error={errors.mvola_transaction} />
                <small className="au-hint" style={{ marginTop: -8 }}>{t("Numéro de référence reçu par SMS après votre paiement mobile money.")}</small>
              </div>
            )}

            {!estCoursier && (
              <div className="au-banner gold">
                <MdCheckCircle className="bi" />
                <div>
                  <p><strong>{form.prenom} {form.nom}</strong></p>
                  <p className="s">{form.email} · {form.adresse}</p>
                </div>
              </div>
            )}

            <p className="au-hint" style={{ textAlign: "center", marginBottom: 14 }}>
              {t("En créant un compte, vous acceptez nos")} <Link to="/conditions" className="au-link">{t("Conditions d'utilisation")}</Link> {t("et notre")} <Link to="/confidentialite" className="au-link">{t("Confidentialité")}</Link>
            </p>

            <div className="au-actions">
              <button type="button" className="au-btn-ghost" onClick={() => { setEtape(1); haut(); }}><MdArrowBack size={20} /> {t("Retour")}</button>
              <button type="submit" className="au-btn" disabled={loading}>
                {loading ? (<><span className="au-spin" /> {t("Inscription en cours...")}</>) : t("S'inscrire gratuitement")}
              </button>
            </div>
          </div>
        </form>

        <p className="au-foot">
          {t("Déjà un compte ?")}{" "}<Link to="/connexion" className="au-link">{t("Se connecter")}</Link>
        </p>
      </AuthShell>
    </>
  );
}

export default Inscription;
