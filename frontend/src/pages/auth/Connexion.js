import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import logo from "../../logo.png";

function Connexion() {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.success;
  const coursierValide = location.state?.coursierValide;
  const prenomCoursier = location.state?.prenom;
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
if (response.ok) {
  localStorage.setItem("token",     data.token);
  localStorage.setItem("role",      data.user.role);
  localStorage.setItem("nom",       data.user.nom       || "");
  localStorage.setItem("prenom",    data.user.prenom    || "");
  localStorage.setItem("email",     data.user.email     || "");
  localStorage.setItem("telephone", data.user.telephone || "");
  localStorage.setItem("adresse",   data.user.adresse   || "");
  if (data.user.role === "admin")    navigate("/dashboard-admin");
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

  return (
<div style={{ minHeight: "100vh", backgroundColor: "#0a0a1e",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "80px 16px 40px 16px" }}>
      <div style={{ backgroundColor: "#1a1a35", borderRadius: "20px",
    padding: "clamp(20px, 5vw, 40px)",
    width: "100%", maxWidth: "450px",
    boxShadow: "0 0 50px #FFD70022" }}>

        {/* Logo */}
        <div className="text-center mb-4">
          <img src={logo} alt="IRAKY"
            style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
          <h4 className="fw-bold mt-3" style={{ color: "#FFD700" }}>Se connecter</h4>
          <p style={{ color: "#aaaaaa", fontSize: "14px" }}>
            Accédez à votre espace IRAKY Delivery
          </p>
        </div>
                {/* ✅ Message spécial coursier validé */}
        {coursierValide && (
          <div className="mb-3 p-3 text-center"
            style={{ backgroundColor: "#FFD70018", border: "1px solid #FFD70044",
              borderRadius: "10px", display: "flex", alignItems: "center",
              gap: 10, justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>🎉</span>
            <span style={{ color: "#FFD700", fontSize: 14, fontWeight: 700 }}>
              Bravo {prenomCoursier} ! Votre compte coursier est validé et activé.
              Vous pouvez vous connecter dès maintenant.
            </span>
          </div>
        )}

        {/* ✅ Message succès après inscription */}
        {successMessage && (
          <div className="mb-3 p-2 text-center"
            style={{ backgroundColor: "#28a74522", color: "#28a745",
              borderRadius: "8px", fontSize: "14px" }}>
            ✅ {successMessage}
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="mb-3 p-2 text-center"
            style={{ backgroundColor: "#dc354522", color: "#dc3545",
              borderRadius: "8px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div className="mb-3">
          <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Email</label>
          <input type="email" name="email" className="form-control mt-1"
            placeholder="votre@email.com" value={form.email} onChange={handleChange}
            style={{ backgroundColor: "#0a0a1e", border: "1px solid #FFD70033",
              color: "#ffffff", borderRadius: "10px" }} />
        </div>

        {/* Mot de passe */}
{/* Mot de passe */}
<div className="mb-3">
  <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Mot de passe</label>
  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      className="form-control mt-1"
      placeholder="••••••••"
      value={form.password}
      onChange={handleChange}
      style={{
        backgroundColor: "#0a0a1e",
        border: "1px solid #FFD70033",
        color: "#ffffff",
        borderRadius: "10px",
        paddingRight: "42px",
      }}
    />
    <span
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: 12,
        top: "calc(50% + 4px)",
        transform: "translateY(-50%)",
        cursor: "pointer",
        color: "#aaaaaa",
        display: "flex",
        alignItems: "center",
      }}
    >
      {showPassword
        ? <MdVisibilityOff style={{ fontSize: 20 }} />
        : <MdVisibility style={{ fontSize: 20 }} />}
    </span>
  </div>
</div>

        {/* Mot de passe oublié */}
        <div className="text-end mb-3">
          <Link to="/oubli-mot-de-passe" style={{ color: "#FFD700", fontSize: "13px" }}>
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Bouton connexion */}
        <button onClick={handleSubmit} disabled={loading}
          className="btn fw-bold w-100 py-2"
          style={{ backgroundColor: "#FFD700", color: "#000",
            borderRadius: "10px", fontSize: "16px" }}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Lien inscription */}
        <p className="text-center mt-3" style={{ color: "#aaaaaa", fontSize: "14px" }}>
          Pas encore de compte ?{" "}
          <Link to="/inscription" style={{ color: "#FFD700" }}>
            S'inscrire gratuitement
          </Link>
        </p>

        {/* Retour portail */}
        <p className="text-center mt-2">
          <Link to="/" style={{ color: "#aaaaaa", fontSize: "13px" }}>
            ← Retour au portail
          </Link>
        </p>
      </div>
    </div>
  );
  
}

export default Connexion;