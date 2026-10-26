import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { MdEmail, MdLock, MdLogin, MdCheckCircle, MdCancel, MdErrorOutline, MdRefresh, MdArrowForward } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { AuthShell, AuthHead, Champ, sans } from "../../components/AuthUi";

const API = "https://projet-iraky-delivery.onrender.com/api";

function Connexion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.success;
  const coursierValide = location.state?.coursierValide;
  const prenomCoursier = location.state?.prenom;
  const coursierEnAttenteId = location.state?.coursierId ?? null;

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statutPolling, setStatutPolling] = useState(null); // null | attente | valide | rejete
  const [msgRejetConnexion, setMsgRejetConnexion] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (!coursierEnAttenteId) return;
    setStatutPolling("attente");
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`${API}/verifier-statut-coursier/${coursierEnAttenteId}`);
        if (res.status === 404) { setStatutPolling("rejete"); clearInterval(iv); return; }
        const data = await res.json();
        if (data.statut === "actif") { setStatutPolling("valide"); clearInterval(iv); }
        else if (data.statut === "rejete") {
          setMsgRejetConnexion(data.message || "");
          setStatutPolling("rejete");
          clearInterval(iv);
        }
      } catch (e) { console.error(e); }
    }, 3000);
    return () => clearInterval(iv);
  }, [coursierEnAttenteId]);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("nom", data.user.nom || "");
        localStorage.setItem("prenom", data.user.prenom || "");
        localStorage.setItem("email", data.user.email || "");
        localStorage.setItem("telephone", data.user.telephone || "");
        localStorage.setItem("adresse", data.user.adresse || "");
        if (data.user.role === "admin") navigate("/dashboard-admin");
        else if (data.user.role === "coursier") navigate("/dashboard-coursier");
        else navigate("/dashboard-client");
      } else {
        setError(data.message || "Email ou mot de passe incorrect");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    }
    setLoading(false);
  };

  const Banniere = ({ type, Icon, children }) => (
    <div className={"au-banner " + type}>
      {Icon ? <Icon className="bi" /> : <span className="spinner" />}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );

  return (
    <AuthShell maxWidth={450}>
      <AuthHead titre={t("Se connecter")} sousTitre={t("Accédez à votre espace IRAKY Delivery")} />

      {statutPolling === "attente" && (
        <Banniere type="warn">
          <p><strong>{sans(t("⏳ Bonjour {{prenom}} ! Votre dossier est en cours de vérification...", { prenom: prenomCoursier }))}</strong></p>
          <p className="s">{t("L'administrateur examine votre inscription. Cette page se met à jour automatiquement.")}</p>
        </Banniere>
      )}

      {statutPolling === "valide" && (
        <Banniere type="ok" Icon={MdCheckCircle}>
          <p><strong>{t("Félicitations {{prenom}} ! Votre compte est validé et activé.", { prenom: prenomCoursier })}</strong></p>
          <p className="s">{t("Vous pouvez vous connecter maintenant avec votre email et mot de passe.")}</p>
        </Banniere>
      )}

      {statutPolling === "rejete" && (
        <Banniere type="bad" Icon={MdCancel}>
          <p><strong>{sans(t("❌ Votre dossier d'inscription a été rejeté."))}</strong></p>
          {msgRejetConnexion && (
            <p className="s">
              {msgRejetConnexion
                .replace("❌ Votre dossier a été rejeté. Raison : ", "")
                .replace(". Réinscrivez-vous en corrigeant les erreurs.", "")}
            </p>
          )}
          <p className="s">{sans(t("📧 Un email détaillé a été envoyé à votre adresse email. Corrigez les erreurs et réinscrivez-vous."))}</p>
          <button type="button" className="au-btn" style={{ marginTop: 10, height: 42, background: "#ef4444", color: "#fff", boxShadow: "none" }}
            onClick={() => navigate("/inscription")}>
            <MdRefresh /> {sans(t("🔄 Se réinscrire avec les corrections"))}
          </button>
        </Banniere>
      )}

      {coursierValide && !statutPolling && (
        <Banniere type="gold" Icon={MdCheckCircle}>
          <p><strong>{t("Bravo {{prenom}} ! Votre compte coursier est validé et activé. Vous pouvez vous connecter dès maintenant.", { prenom: prenomCoursier })}</strong></p>
        </Banniere>
      )}

      {successMessage && !statutPolling && (
        <Banniere type="ok" Icon={MdCheckCircle}><p>{t(successMessage)}</p></Banniere>
      )}

      {error && <Banniere type="bad" Icon={MdErrorOutline}><p>{t(error)}</p></Banniere>}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <Champ label={t("Email")} Icon={MdEmail} type="email" name="email" autoComplete="email"
          placeholder="votre@email.com" value={form.email} onChange={handleChange} />
        <Champ label={t("Mot de passe")} Icon={MdLock} password name="password" autoComplete="current-password"
          placeholder="••••••••" value={form.password} onChange={handleChange} />

        <div style={{ textAlign: "right", margin: "-4px 0 18px" }}>
          <Link to="/oubli-mot-de-passe" className="au-link" style={{ fontSize: 13 }}>{t("Mot de passe oublié ?")}</Link>
        </div>

        <button type="submit" className="au-btn" disabled={loading}>
          {loading ? (<><span className="au-spin" /> {t("Connexion...")}</>) : (<><MdLogin size={20} /> {t("Se connecter")}</>)}
        </button>
      </form>

      <p className="au-foot">
        {t("Pas encore de compte ?")}{" "}
        <Link to="/inscription" className="au-link">{t("S'inscrire gratuitement")} <MdArrowForward style={{ verticalAlign: "-3px" }} /></Link>
      </p>
    </AuthShell>
  );
}

export default Connexion;
