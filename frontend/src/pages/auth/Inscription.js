import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MdVisibility, MdVisibilityOff, MdCheckCircle, MdClose,
         MdDeliveryDining, MdAttachMoney, MdReceipt } from "react-icons/md";
import logo from "../../logo.png";

function Inscription() {
  const navigate = useNavigate();
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [localisation, setLocalisation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [modalSucces, setModalSucces] = useState(false);
  const [userIdCree, setUserIdCree] = useState(null);
  const [etapeValidation, setEtapeValidation] = useState(1);
  const [msgRejetRecu, setMsgRejetRecu] = useState("");
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    adresse: "", password: "", password_confirmation: "",
    cin: "", photo_recto: null, photo_verso: null,
    mvola_transaction: "",
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
      if (errors[e.target.name]) {
        setErrors(prev => ({ ...prev, [e.target.name]: "" }));
      }
    }
  };

  const getLocalisation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      setErrors(prev => ({ ...prev, localisation: "Géolocalisation non supportée." }));
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalisation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLocLoading(false);
        setErrors(prev => ({ ...prev, localisation: "" }));
      },
      (err) => {
        setLocLoading(false);
        if (err.code === 1) {
          setErrors(prev => ({ ...prev, localisation:
            "Permission refusée. Cliquez sur le 🔒 cadenas → Localisation → Autoriser, puis réessayez." }));
        } else {
          setErrors(prev => ({ ...prev, localisation: "Position indisponible. Réessayez." }));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // ✅ CORRECTION : accolades bien fermées
  const valider = () => {
    const e = {};
    if (!form.nom.trim())    e.nom    = "Le nom est obligatoire.";
    if (!form.prenom.trim()) e.prenom = "Le prénom est obligatoire.";
    if (!form.email.trim())  e.email  = "L'email est obligatoire.";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide.";
    if (!form.telephone.trim()) e.telephone = "Le téléphone est obligatoire.";
    if (!form.adresse.trim())   e.adresse   = "L'adresse est obligatoire.";
    if (!form.password)         e.password  = "Le mot de passe est obligatoire.";
    if (form.password.length < 6) e.password = "Minimum 6 caractères.";
    if (form.password !== form.password_confirmation)
      e.password_confirmation = "Les mots de passe ne correspondent pas.";

    if (role === "coursier") {
      if (!form.cin.trim())              e.cin               = "Le numéro CIN est obligatoire.";
      if (!form.photo_recto)             e.photo_recto       = "La photo recto est obligatoire.";
      if (!form.photo_verso)             e.photo_verso       = "La photo verso est obligatoire.";
      if (!form.mvola_transaction.trim()) e.mvola_transaction = "La référence de paiement est obligatoire.";
    } // ✅ fermeture du if coursier

    return e; // ✅ return HORS du if
  };

  const handleSubmit = async () => {
    const errs = valider();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setError("");
    setErrors({});

    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("prenom", form.prenom);
      formData.append("email", form.email);
      formData.append("telephone", form.telephone);
      formData.append("adresse", form.adresse);
      formData.append("password", form.password);
      formData.append("password_confirmation", form.password_confirmation);
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
      }

      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

    if (response.ok) {
      if (role === "coursier") {
        setUserIdCree(data.user.id); // ✅ récupère l'ID pour le polling
        setModalSucces(true);
      } else {
        navigate("/connexion", {
          state: { success: "Inscription réussie ! Connectez-vous maintenant." }
        });
      }
    } else {
        if (data.errors) {
          const laravelErrors = {};
          Object.keys(data.errors).forEach(k => {
            laravelErrors[k] = data.errors[k][0];
          });
          setErrors(laravelErrors);
        } else {
          setError(data.message || "Erreur lors de l'inscription");
        }
      }
    } catch {
      setError("Erreur de connexion au serveur");
    }
    setLoading(false);
  };

  const inp = (champ) => ({
    backgroundColor: "#0a0a1e",
    border: `1px solid ${errors[champ] ? "#ef4444" : "#FFD70033"}`,
    color: "#ffffff",
    borderRadius: "10px",
    transition: "border-color 0.2s",
  });
useEffect(() => {
  if (!modalSucces || !userIdCree) return;

  const iv = setInterval(async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/verifier-statut-coursier/${userIdCree}`);

      if (res.status === 404) {
        setEtapeValidation(0);
        clearInterval(iv);
        return;
      }

      const data = await res.json();

      if (data.statut === "actif") {
        setEtapeValidation(4);
        clearInterval(iv);
      } else if (data.statut === "rejete") {
        // ✅ Stocker le message de rejet pour l'afficher
        setMsgRejetRecu(data.message || "Votre dossier a été rejeté.");
        setEtapeValidation(0);
        clearInterval(iv);
      } else {
        setEtapeValidation(2);
      }
    } catch (e) {
      console.error(e);
    }
  }, 3000);

  return () => clearInterval(iv);
}, [modalSucces, userIdCree]);
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a1e",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px" }}>

      {/* MODAL SUCCÈS COURSIER */}
      {modalSucces && (
        <div style={{ position: "fixed", inset: 0, zIndex: 500,
          backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ backgroundColor: "#131330", borderRadius: 20, padding: 36,
            width: "100%", maxWidth: 480, border: "1px solid #FFD70040",
            boxShadow: "0 0 60px rgba(255,215,0,0.15)", textAlign: "center",
            animation: "modalIn 0.3s ease" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%",
              background: "linear-gradient(135deg,#f59e0b,#FFD700)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", boxShadow: "0 0 30px #FFD70055" }}>
              <MdDeliveryDining style={{ fontSize: 42, color: "#000" }}/>
            </div>
            <h4 style={{ color: "#FFD700", fontWeight: 800, marginBottom: 12, fontSize: 20 }}>
              Inscription reçue ! 🎉
            </h4>
            <p style={{ color: "#fff", fontSize: 15, lineHeight: 1.7, marginBottom: 8 }}>
              Merci <strong style={{ color: "#FFD700" }}>{form.prenom} {form.nom}</strong> pour votre inscription.
            </p>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Votre dossier est en cours de vérification par l'administrateur.
              Vous recevrez une notification dès que votre compte sera validé.
            </p>
              <div style={{ backgroundColor: "#0a0a1e", borderRadius: 14,
                padding: 16, marginBottom: 24, textAlign: "left" }}>
                {[
                  { step: "1", text: "Dossier envoyé à l'administrateur" },
                  { step: "2", text: "Vérification en cours..." },
                  { step: "3", text: "Notification de validation" },
                  { step: "4", text: "Connexion autorisée" },
                ].map((s) => {
          const num = parseInt(s.step);
          const done = etapeValidation >= num;
                      return (
            <div key={s.step} style={{ display: "flex", alignItems: "center",
              gap: 12, marginBottom: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                backgroundColor: done ? "#FFD700" : "#1a1a35",
                border: `2px solid ${done ? "#FFD700" : "#ffffff20"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: done ? "#000" : "#555",
                transition: "all 0.4s ease" }}>
                {done ? "✓" : s.step}
              </div>
              <span style={{ color: done ? "#FFD700" : "#666", fontSize: 13,
                transition: "color 0.4s ease" }}>
                {s.text}
              </span>
            </div>
          );
        })}
      </div>
      {/* ✅ Message dynamique selon l'état */}
      {etapeValidation === 4 && (
        <div style={{ backgroundColor: "#10b98118", border: "1px solid #10b98144",
          borderRadius: 10, padding: "10px 14px", marginBottom: 16, textAlign: "center" }}>
          <span style={{ color: "#10b981", fontWeight: 700, fontSize: 13 }}>
            🎉 Votre compte a été validé ! Vous pouvez vous connecter.
          </span>
        </div>
      )}
{etapeValidation === 0 && (
  <div style={{ backgroundColor: "#ef444418", border: "1px solid #ef444444",
    borderRadius: 12, padding: "16px", marginBottom: 16, textAlign: "left" }}>
    <p style={{ color: "#ef4444", fontWeight: 800, fontSize: 14, margin: "0 0 8px" }}>
      ❌ Votre dossier a été rejeté
    </p>
    {/* ✅ Affiche le message de l'admin */}
    {msgRejetRecu && (
      <div style={{ backgroundColor: "#0a0a1e40", borderRadius: 8,
        padding: "10px 12px", marginBottom: 10 }}>
        <p style={{ color: "#aaa", fontSize: 12, margin: "0 0 4px" }}>
          Message de l'administrateur :
        </p>
        <p style={{ color: "#fff", fontSize: 13, margin: 0, lineHeight: 1.6 }}>
          {msgRejetRecu.replace("❌ Votre dossier a été rejeté. Raison : ", "").replace(". Réinscrivez-vous en corrigeant les erreurs.", "")}
        </p>
      </div>
    )}
    <p style={{ color: "#888", fontSize: 12, margin: "0 0 10px" }}>
      📧 Un email de notification a été envoyé à <strong style={{ color: "#fff" }}>{form.email}</strong>
    </p>
    <button
      onClick={() => { setModalSucces(false); setEtapeValidation(1); }}
      style={{ backgroundColor: "#ef4444", color: "#fff", border: "none",
        borderRadius: 8, padding: "8px 16px", cursor: "pointer",
        fontWeight: 700, fontSize: 13, width: "100%" }}>
      🔄 Corriger et se réinscrire
    </button>
  </div>
)}
          <button
            onClick={() => navigate("/connexion", {
              state: etapeValidation === 4
                ? { coursierValide: true, prenom: form.prenom }
                : {}
            })}
            style={{ width: "100%", padding: "13px", borderRadius: 12,
              background: "linear-gradient(135deg,#FFD700,#ff9500)",
              color: "#000", border: "none", cursor: "pointer",
              fontWeight: 800, fontSize: 15 }}>
            Retour à la connexion
          </button>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: "#1a1a35", borderRadius: "20px",
        padding: "40px", width: "100%", maxWidth: "640px",
        boxShadow: "0 0 50px #FFD70022" }}>

        <div className="text-center mb-4">
          <img src={logo} alt="IRAKY" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
          <h4 className="fw-bold mt-3" style={{ color: "#FFD700" }}>Créer un compte</h4>
          <p style={{ color: "#aaaaaa", fontSize: "14px" }}>Rejoignez IRAKY Delivery</p>
        </div>

        {error && (
          <div className="mb-3 p-3" style={{ backgroundColor: "#dc354522", color: "#dc3545",
            borderRadius: "10px", fontSize: "14px", display: "flex", alignItems: "center", gap: 8 }}>
            <MdClose style={{ fontSize: 18, flexShrink: 0 }}/> {error}
          </div>
        )}

        {role === "coursier" && (
          <div style={{ backgroundColor: "#f59e0b11", border: "1px solid #f59e0b33",
            borderRadius: 12, padding: "12px 16px", marginBottom: 20,
            display: "flex", alignItems: "flex-start", gap: 10 }}>
            <MdDeliveryDining style={{ color: "#f59e0b", fontSize: 22, flexShrink: 0, marginTop: 2 }}/>
            <div>
              <p style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, margin: 0 }}>
                Inscription coursier — Vérification requise
              </p>
              <p style={{ color: "#888", fontSize: 12, margin: "4px 0 0" }}>
                Votre compte sera vérifié par l'administrateur avant activation.
                Payez le droit d'inscription de <strong style={{ color: "#FFD700" }}>10 000 Ar</strong> par
                MVola au <strong style={{ color: "#FFD700" }}>+261 38 56 040 35</strong> (Administrateur)
                puis renseignez la référence ci-dessous.
              </p>
            </div>
          </div>
        )}

        <div className="row g-3">

          {/* Nom */}
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Nom <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" name="nom" className="form-control mt-1"
              placeholder="Votre nom" value={form.nom} onChange={handleChange} style={inp("nom")} />
            {errors.nom && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.nom}</small>}
          </div>

          {/* Prénom */}
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Prénom <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" name="prenom" className="form-control mt-1"
              placeholder="Votre prénom" value={form.prenom} onChange={handleChange} style={inp("prenom")} />
            {errors.prenom && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.prenom}</small>}
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Email <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="email" name="email" className="form-control mt-1"
              placeholder="votre@email.com" value={form.email} onChange={handleChange} style={inp("email")} />
            {errors.email && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.email}</small>}
          </div>

          {/* Téléphone */}
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Téléphone <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" name="telephone" className="form-control mt-1"
              placeholder="+261 XX XX XXX XX" value={form.telephone} onChange={handleChange} style={inp("telephone")} />
            {errors.telephone && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.telephone}</small>}
          </div>

          {/* Adresse */}
          <div className="col-12">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Adresse <span style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" name="adresse" className="form-control mt-1"
              placeholder="Votre adresse à Toliara" value={form.adresse} onChange={handleChange} style={inp("adresse")} />
            {errors.adresse && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.adresse}</small>}
          </div>

          {/* Mot de passe */}
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Mot de passe <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} name="password"
                className="form-control mt-1" placeholder="••••••••"
                value={form.password} onChange={handleChange}
                style={{ ...inp("password"), paddingRight: "42px" }} />
              <span onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 12, top: "calc(50% + 4px)",
                  transform: "translateY(-50%)", cursor: "pointer", color: "#aaaaaa",
                  display: "flex", alignItems: "center" }}>
                {showPassword ? <MdVisibilityOff style={{ fontSize: 20 }}/> : <MdVisibility style={{ fontSize: 20 }}/>}
              </span>
            </div>
            {errors.password && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.password}</small>}
          </div>

          {/* Confirmation */}
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Confirmation <span style={{ color: "#ef4444" }}>*</span></label>
            <div style={{ position: "relative" }}>
              <input type={showPasswordConfirm ? "text" : "password"} name="password_confirmation"
                className="form-control mt-1" placeholder="••••••••"
                value={form.password_confirmation} onChange={handleChange}
                style={{ ...inp("password_confirmation"), paddingRight: "42px" }} />
              <span onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                style={{ position: "absolute", right: 12, top: "calc(50% + 4px)",
                  transform: "translateY(-50%)", cursor: "pointer", color: "#aaaaaa",
                  display: "flex", alignItems: "center" }}>
                {showPasswordConfirm ? <MdVisibilityOff style={{ fontSize: 20 }}/> : <MdVisibility style={{ fontSize: 20 }}/>}
              </span>
            </div>
            {errors.password_confirmation && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.password_confirmation}</small>}
          </div>

          {/* Rôle */}
          <div className="col-12">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Rôle</label>
            <select className="form-select mt-1" value={role}
              onChange={(e) => setRole(e.target.value)} style={inp("role")}>
              <option value="client">👤 Client — Gratuit</option>
              <option value="coursier">🚴 Coursier — 10 000 Ar droit d'inscription</option>
            </select>
          </div>

          {/* ✅ Localisation optionnelle pour tous */}
          <div className="col-12">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
              📍 Localisation <span style={{ color: "#666", fontSize: 12 }}>(optionnelle)</span>
            </label>
            <div className="d-flex gap-2 mt-1 align-items-center flex-wrap">
              <button type="button" onClick={getLocalisation} disabled={locLoading}
                className="btn fw-bold"
                style={{ backgroundColor: localisation ? "#10b98122" : "#FFD70022",
                  color: localisation ? "#10b981" : "#FFD700",
                  border: `1px solid ${localisation ? "#10b98133" : "#FFD70033"}`,
                  borderRadius: "10px", padding: "8px 16px", fontSize: "13px" }}>
                {locLoading ? "⏳ En cours..." : localisation ? "✅ Position obtenue" : "📍 Activer ma localisation"}
              </button>
              {localisation && (
                <span style={{ color: "#10b981", fontSize: "12px" }}>
                  ({localisation.latitude.toFixed(4)}, {localisation.longitude.toFixed(4)})
                </span>
              )}
            </div>
            {errors.localisation && (
              <div style={{ backgroundColor: "#f59e0b11", border: "1px solid #f59e0b33",
                borderRadius: 8, padding: "8px 12px", marginTop: 6 }}>
                <small style={{ color: "#f59e0b", fontSize: 11 }}>⚠️ {errors.localisation}</small>
                <small style={{ color: "#666", fontSize: 11, display: "block", marginTop: 2 }}>
                  💡 Cliquez sur le 🔒 cadenas → Localisation → Autoriser
                </small>
              </div>
            )}
            <small style={{ color: "#666", fontSize: "11px", display: "block", marginTop: 4 }}>
              {role === "coursier" ? "Optionnelle — votre adresse ci-dessus suffit." : "Pour que les coursiers vous trouvent facilement."}
            </small>
          </div>

          {/* ✅ Champs spécifiques coursier */}
          {role === "coursier" && (
            <>
              {/* Zone de livraison */}
              <div className="col-12">
                <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
                  🏙️ Zone d'opération <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <select name="zone" className="form-select mt-1"
                  onChange={e => {
                    setForm({...form, adresse: e.target.value});
                    if (errors.adresse) setErrors(prev => ({...prev, adresse: ""}));
                  }}
                  style={inp("adresse")}>
                  <option value="">Sélectionnez votre zone</option>
                  <option value="Toliara Centre">Toliara Centre</option>
                  <option value="Toliara - Mahavatsy">Toliara - Mahavatsy</option>
                  <option value="Toliara - Mangabe">Toliara - Mangabe</option>
                  <option value="Toliara - Tsimenatse">Toliara - Tsimenatse</option>
                  <option value="Toliara - Sanfily">Toliara - Sanfily</option>
                  <option value="Toliara - Besakoa">Toliara - Besakoa</option>
                </select>
                {errors.adresse && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.adresse}</small>}
              </div>

              {/* CIN */}
              <div className="col-12">
                <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
                  Numéro CIN <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input type="text" name="cin" className="form-control mt-1"
                  placeholder="Votre numéro CIN" value={form.cin} onChange={handleChange}
                  style={inp("cin")} />
                {errors.cin && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.cin}</small>}
              </div>

              {/* Photos CIN */}
              <div className="col-md-6">
                <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
                  📷 Photo CIN — Recto <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input type="file" name="photo_recto" className="form-control mt-1"
                  accept="image/*" onChange={handleChange} style={inp("photo_recto")} />
                {errors.photo_recto && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.photo_recto}</small>}
              </div>

              <div className="col-md-6">
                <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
                  📷 Photo CIN — Verso <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input type="file" name="photo_verso" className="form-control mt-1"
                  accept="image/*" onChange={handleChange} style={inp("photo_verso")} />
                {errors.photo_verso && <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.photo_verso}</small>}
              </div>

              {/* Bloc paiement MVola */}
              <div className="col-12">
                <div style={{ backgroundColor: "#FFD70010", border: "1px solid #FFD70030",
                  borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <MdAttachMoney style={{ color: "#FFD700", fontSize: 22 }}/>
                    <span style={{ color: "#FFD700", fontWeight: 800, fontSize: 14 }}>
                      Paiement du droit d'inscription
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                    {[
                      { label: "Montant",          val: "10 000 Ar",         color: "#FFD700" },
                      { label: "Service",           val: "MVola",             color: "#10b981" },
                      { label: "Numéro admin",      val: "+261 38 56 040 35", color: "#3b82f6" },
                      { label: "Nom bénéficiaire",  val: "Administrateur",    color: "#8b5cf6" },
                    ].map(item => (
                      <div key={item.label} style={{ backgroundColor: "#0a0a1e40",
                        borderRadius: 10, padding: "10px 14px" }}>
                        <div style={{ color: "#666", fontSize: 11 }}>{item.label}</div>
                        <div style={{ color: item.color, fontWeight: 700, fontSize: 13 }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                  <label style={{ color: "#aaaaaa", fontSize: "14px",
                    display: "flex", alignItems: "center", gap: 6 }}>
                    <MdReceipt style={{ color: "#FFD700", fontSize: 16 }}/>
                    Référence de transaction MVola <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input type="text" name="mvola_transaction"
                    className="form-control mt-1"
                    placeholder="Ex: MVOLA-2026-XXXXXXXX"
                    value={form.mvola_transaction} onChange={handleChange}
                    style={{ ...inp("mvola_transaction"), marginTop: 6 }} />
                  {errors.mvola_transaction && (
                    <small style={{ color: "#ef4444", fontSize: 11 }}>{errors.mvola_transaction}</small>
                  )}
                  <small style={{ color: "#666", fontSize: 11, marginTop: 4, display: "block" }}>
                    Numéro de référence reçu par SMS après votre paiement MVola.
                  </small>
                </div>
              </div>
            </>
          )}

          {/* Bouton inscription */}
          <div className="col-12 mt-2">
            <button onClick={handleSubmit} disabled={loading}
              className="btn fw-bold w-100 py-2"
              style={{ backgroundColor: loading ? "#FFD70077" : "#FFD700", color: "#000",
                borderRadius: "10px", fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10, transition: "all 0.2s" }}>
              {loading ? (
                <>
                  <div style={{ width: 18, height: 18, border: "3px solid #00000040",
                    borderTop: "3px solid #000", borderRadius: "50%",
                    animation: "spin 0.7s linear infinite" }}/>
                  Inscription en cours...
                </>
              ) : "S'inscrire gratuitement"}
            </button>
          </div>

        </div>

        <p className="text-center mt-3" style={{ color: "#aaaaaa", fontSize: "14px" }}>
          Déjà un compte ?{" "}
          <Link to="/connexion" style={{ color: "#FFD700" }}>Se connecter</Link>
        </p>
        <p className="text-center mt-2">
          <Link to="/" style={{ color: "#aaaaaa", fontSize: "13px" }}>← Retour au portail</Link>
        </p>
      </div>

      <style>{`
        @keyframes modalIn { from{transform:scale(0.92);opacity:0} to{transform:scale(1);opacity:1} }
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

export default Inscription;