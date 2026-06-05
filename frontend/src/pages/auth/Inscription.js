import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../../logo.png";

function Inscription() {
  const navigate = useNavigate();
  const [role, setRole] = useState("client");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [localisation, setLocalisation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [form, setForm] = useState({
    nom: "", prenom: "", email: "", telephone: "",
    adresse: "", password: "", password_confirmation: "",
    cin: "", photo_recto: null, photo_verso: null,
  });

  const handleChange = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, [e.target.name]: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const getLocalisation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocalisation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocLoading(false);
      },
      () => {
        alert("Impossible d'obtenir votre position. Vérifiez les permissions.");
        setLocLoading(false);
      }
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

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
        if (form.cin) formData.append("cin", form.cin);
        if (form.photo_recto) formData.append("photo_recto", form.photo_recto);
        if (form.photo_verso) formData.append("photo_verso", form.photo_verso);
      }

      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        navigate("/connexion", {
          state: { success: "Inscription réussie ! Connectez-vous maintenant." }
        });
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch {
      setError("Erreur de connexion au serveur");
    }
    setLoading(false);
  };

  const inp = {
    backgroundColor: "#0a0a1e",
    border: "1px solid #FFD70033",
    color: "#ffffff",
    borderRadius: "10px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a1e",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px" }}>
      <div style={{ backgroundColor: "#1a1a35", borderRadius: "20px",
        padding: "40px", width: "100%", maxWidth: "620px",
        boxShadow: "0 0 50px #FFD70022" }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <img src={logo} alt="IRAKY"
            style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
          <h4 className="fw-bold mt-3" style={{ color: "#FFD700" }}>
            Créer un compte
          </h4>
          <p style={{ color: "#aaaaaa", fontSize: "14px" }}>
            Rejoignez IRAKY Delivery
          </p>
        </div>

        {error && (
          <div className="mb-3 p-2 text-center"
            style={{ backgroundColor: "#dc354522", color: "#dc3545",
              borderRadius: "8px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <div className="row g-3">
          {/* Champs communs */}
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Nom</label>
            <input type="text" name="nom" className="form-control mt-1"
              placeholder="Votre nom" value={form.nom} onChange={handleChange}
              style={inp} />
          </div>
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Prénom</label>
            <input type="text" name="prenom" className="form-control mt-1"
              placeholder="Votre prénom" value={form.prenom} onChange={handleChange}
              style={inp} />
          </div>
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Email</label>
            <input type="email" name="email" className="form-control mt-1"
              placeholder="votre@email.com" value={form.email} onChange={handleChange}
              style={inp} />
          </div>
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Téléphone</label>
            <input type="text" name="telephone" className="form-control mt-1"
              placeholder="+261 XX XX XXX XX" value={form.telephone} onChange={handleChange}
              style={inp} />
          </div>
          <div className="col-12">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Adresse</label>
            <input type="text" name="adresse" className="form-control mt-1"
              placeholder="Votre adresse à Toliara" value={form.adresse} onChange={handleChange}
              style={inp} />
          </div>
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Mot de passe</label>
            <input type="password" name="password" className="form-control mt-1"
              placeholder="••••••••" value={form.password} onChange={handleChange}
              style={inp} />
          </div>
          <div className="col-md-6">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
              Confirmation mot de passe
            </label>
            <input type="password" name="password_confirmation" className="form-control mt-1"
              placeholder="••••••••" value={form.password_confirmation} onChange={handleChange}
              style={inp} />
          </div>

          {/* Rôle */}
          <div className="col-12">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Rôle</label>
            <select className="form-select mt-1" value={role}
              onChange={(e) => setRole(e.target.value)}
              style={inp}>
              <option value="client">👤 Client — Gratuit</option>
              <option value="coursier">🚴 Coursier — Gratuit</option>
            </select>
          </div>

          {/* Localisation */}
          <div className="col-12">
            <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
              📍 Localisation
            </label>
            <div className="d-flex gap-2 mt-1 align-items-center">
              <button type="button"
                onClick={getLocalisation}
                disabled={locLoading}
                className="btn fw-bold"
                style={{ backgroundColor: "#FFD70022", color: "#FFD700",
                  border: "1px solid #FFD70033", borderRadius: "10px",
                  padding: "8px 16px", fontSize: "13px" }}>
                {locLoading ? "Localisation en cours..." : "📍 Activer ma localisation"}
              </button>
              {localisation && (
                <span style={{ color: "#10b981", fontSize: "12px" }}>
                  ✅ Position obtenue ({localisation.latitude.toFixed(4)}, {localisation.longitude.toFixed(4)})
                </span>
              )}
            </div>
            <small style={{ color: "#666", fontSize: "11px" }}>
              Obligatoire pour que les clients vous trouvent facilement.
            </small>
          </div>

          {/* Champs spécifiques coursier */}
          {role === "coursier" && (
            <>
              <div className="col-12">
                <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
                  Numéro CIN
                </label>
                <input type="text" name="cin" className="form-control mt-1"
                  placeholder="Votre numéro CIN" value={form.cin} onChange={handleChange}
                  style={inp} />
              </div>

              {/* Photo recto */}
              <div className="col-md-6">
                <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
                  📷 Photo CIN — Recto
                </label>
                <input type="file" name="photo_recto" className="form-control mt-1"
                  accept="image/*" onChange={handleChange}
                  style={inp} />
                <small style={{ color: "#666", fontSize: "11px" }}>
                  Face avant de votre CIN
                </small>
              </div>

              {/* Photo verso */}
              <div className="col-md-6">
                <label style={{ color: "#aaaaaa", fontSize: "14px" }}>
                  📷 Photo CIN — Verso
                </label>
                <input type="file" name="photo_verso" className="form-control mt-1"
                  accept="image/*" onChange={handleChange}
                  style={inp} />
                <small style={{ color: "#666", fontSize: "11px" }}>
                  Face arrière de votre CIN
                </small>
              </div>

              {/* Info paiement désactivé */}
              <div className="col-12">
                <div className="p-3"
                  style={{ backgroundColor: "#28a74511",
                    border: "1px solid #28a74555", borderRadius: "12px" }}>
                  <p className="fw-bold mb-1" style={{ color: "#28a745" }}>
                    ✅ Inscription gratuite — Paiement temporairement désactivé
                  </p>
                  <p style={{ color: "#aaaaaa", fontSize: "13px", marginBottom: 0 }}>
                    Le droit d'entrée de{" "}
                    <strong style={{ color: "#FFD700" }}>10 000 Ar</strong> sera
                    requis prochainement.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Bouton inscription */}
          <div className="col-12 mt-2">
            <button onClick={handleSubmit} disabled={loading}
              className="btn fw-bold w-100 py-2"
              style={{ backgroundColor: "#FFD700", color: "#000",
                borderRadius: "10px", fontSize: "16px" }}>
              {loading ? "Inscription..." : "S'inscrire gratuitement"}
            </button>
          </div>
        </div>

        <p className="text-center mt-3" style={{ color: "#aaaaaa", fontSize: "14px" }}>
          Déjà un compte ?{" "}
          <Link to="/connexion" style={{ color: "#FFD700" }}>Se connecter</Link>
        </p>
        <p className="text-center mt-2">
          <Link to="/" style={{ color: "#aaaaaa", fontSize: "13px" }}>
            ← Retour au portail
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Inscription;