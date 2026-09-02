import { useNavigate } from "react-router-dom";
import logo from "../logo.png";
import "../Theme.css";
import "../App.css";

function Footer() {
  const navigate = useNavigate();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const liens = [
    { id: "accueil", label: "Accueil" },
    { id: "apropos", label: "À propos" },
    { id: "services", label: "Nos services" },
    { id: "demarche", label: "Comment ça marche" },
    { id: "contact", label: "Contact" },
  ];

  const services = [
    "Facture JIRAMA", "Légalisation CIN", "Banque / Trésor",
    "Achats", "Mentor universitaire", "Livraison de colis",
  ];

  return (
    <footer style={{ backgroundColor: "var(--iraky-void)", position: "relative", overflow: "hidden" }}>

      {/* Liseré de trajet en haut du footer */}
      <div style={{
        height: "1px", width: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.4), rgba(52,211,153,0.3), transparent)",
      }} />

      {/* Bandeau CTA double-cible */}
      <div className="container" style={{ paddingTop: "64px" }}>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="iraky-card p-4 h-100 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <div className="iraky-eyebrow mb-2">Vous êtes client</div>
                <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-ink)", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                  Faites gérer vos courses en quelques clics.
                </p>
              </div>
              <button className="iraky-btn-gold" style={{ fontSize: "13px", padding: "10px 20px", whiteSpace: "nowrap" }}
                onClick={() => navigate("/inscription")}>
                S'inscrire <i className="fas fa-arrow-right ms-1"></i>
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <div className="iraky-card p-4 h-100 d-flex align-items-center justify-content-between flex-wrap gap-3">
              <div>
                <div className="iraky-eyebrow mb-2" style={{ color: "var(--iraky-route)" }}>Vous êtes coursier</div>
                <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-ink)", fontWeight: 600, fontSize: "15px", margin: 0 }}>
                  Rejoignez la flotte et générez un revenu.
                </p>
              </div>
              <button className="iraky-btn-ghost" style={{ fontSize: "13px", padding: "10px 20px", whiteSpace: "nowrap",
                borderColor: "rgba(52,211,153,0.35)", color: "var(--iraky-route)" }}
                onClick={() => navigate("/inscription")}>
                Devenir coursier <i className="fas fa-motorcycle ms-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Colonnes */}
      <div className="container" style={{ padding: "56px 0 32px" }}>
        <div className="row g-4">

          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img src={logo} alt="IRAKY" style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover" }} />
              <span style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: "17px" }}>
                IRAKY <span style={{ color: "var(--iraky-gold)" }}>Delivery</span>
              </span>
            </div>
            <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px", lineHeight: 1.7, maxWidth: "280px" }}>
              La plateforme de coursiers qui connecte les habitants de Toliara
              à des livreurs locaux vérifiés, pour toutes les démarches du quotidien.
            </p>
            <div className="d-flex gap-2 mt-3">
              {["facebook-f", "whatsapp", "instagram"].map((net) => (
                <a key={net} href="#" onClick={(e) => e.preventDefault()} style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  backgroundColor: "var(--iraky-surface)", border: "1px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--iraky-muted)", transition: "all 0.2s ease", textDecoration: "none",
                }}
                onMouseEnter={e => { e.currentTarget.style.color = "#0a0a1e"; e.currentTarget.style.backgroundColor = "var(--iraky-gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--iraky-muted)"; e.currentTarget.style.backgroundColor = "var(--iraky-surface)"; }}
                >
                  <i className={`fab fa-${net}`} style={{ fontSize: "14px" }}></i>
                </a>
              ))}
            </div>
          </div>

          <div className="col-lg-2 col-md-6">
            <div style={{ fontFamily: "var(--f-mono)", fontSize: "11.5px", letterSpacing: "1.5px",
              color: "var(--iraky-muted-dim)", marginBottom: "16px" }}>NAVIGATION</div>
            {liens.map(l => (
              <div key={l.id} onClick={() => scrollTo(l.id)} style={{
                fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px",
                cursor: "pointer", marginBottom: "12px", transition: "color 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--iraky-gold)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--iraky-muted)"}
              >
                {l.label}
              </div>
            ))}
          </div>

          <div className="col-lg-3 col-md-6">
            <div style={{ fontFamily: "var(--f-mono)", fontSize: "11.5px", letterSpacing: "1.5px",
              color: "var(--iraky-muted-dim)", marginBottom: "16px" }}>SERVICES</div>
            {services.map(s => (
              <div key={s} style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px", marginBottom: "12px" }}>
                {s}
              </div>
            ))}
          </div>

          <div className="col-lg-3 col-md-6">
            <div style={{ fontFamily: "var(--f-mono)", fontSize: "11.5px", letterSpacing: "1.5px",
              color: "var(--iraky-muted-dim)", marginBottom: "16px" }}>CONTACT</div>
            <div className="d-flex align-items-start gap-2 mb-3">
              <i className="fas fa-phone mt-1" style={{ color: "var(--iraky-gold)", fontSize: "12px" }}></i>
              <span style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px" }}>+261 38 21 266 83</span>
            </div>
            <div className="d-flex align-items-start gap-2 mb-3">
              <i className="fas fa-envelope mt-1" style={{ color: "var(--iraky-gold)", fontSize: "12px" }}></i>
              <span style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px" }}>irakydelivery@gmail.com</span>
            </div>
            <div className="d-flex align-items-start gap-2">
              <i className="fas fa-map-marker-alt mt-1" style={{ color: "var(--iraky-gold)", fontSize: "12px" }}></i>
              <span style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px" }}>Enceinte Score BazarBe, Toliara</span>
            </div>
          </div>

        </div>
      </div>

      {/* Barre du bas */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <small style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted-dim)", fontSize: "12.5px" }}>
            © 2026 IRAKY Delivery — Toliara, Madagascar
          </small>
          <small style={{ fontFamily: "var(--f-mono)", color: "var(--iraky-muted-dim)", fontSize: "11px", letterSpacing: "0.5px" }}>
            FAIT AVEC 🛵 À TOLIARA
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;