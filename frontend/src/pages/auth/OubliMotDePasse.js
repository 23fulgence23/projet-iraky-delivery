import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../logo.png";

function OubliMotDePasse() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:8000/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#1a1a35",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 0 50px #FFD70022",
        }}
      >
        <div className="text-center mb-4">
          <img src={logo} alt="IRAKY"
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
          />
          <h4 className="fw-bold mt-3" style={{ color: "#FFD700" }}>
            Mot de passe oublié
          </h4>
          <p style={{ color: "#aaaaaa", fontSize: "14px" }}>
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {sent ? (
          <div
            className="text-center p-3"
            style={{
              backgroundColor: "#28a74522",
              color: "#28a745",
              borderRadius: "10px",
            }}
          >
            <i className="fas fa-check-circle me-2"></i>
            Un email de réinitialisation a été envoyé !
          </div>
        ) : (
          <>
            <div className="mb-3">
              <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ backgroundColor: "#0a0a1e", border: "1px solid #FFD70033", color: "#ffffff", borderRadius: "10px" }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn fw-bold w-100 py-2"
              style={{ backgroundColor: "#FFD700", color: "#000", borderRadius: "10px", fontSize: "16px" }}
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </>
        )}

        <p className="text-center mt-3">
          <Link to="/connexion" style={{ color: "#FFD700", fontSize: "14px" }}>
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}

export default OubliMotDePasse;