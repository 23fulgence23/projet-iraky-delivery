import { useState, useEffect, useRef } from "react";
import "../Theme.css";
import "../App.css";

function Demarche() {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("client");
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const demarcheCoursier = [
    { step: "01", icon: "fas fa-user-plus", title: "Inscription",
      desc: "Créez votre compte coursier et rejoignez la plateforme IRAKY Delivery.", badge: null },
    { step: "02", icon: "fas fa-hand-holding-usd", title: "Droit d'entrée",
      desc: "Payez le droit d'entrée unique pour activer votre compte coursier.",
      badge: "10 000 Ar", badgeColor: "var(--iraky-gold)" },
    { step: "03", icon: "fas fa-calendar-check", title: "Abonnement mensuel",
      desc: "Payez votre premier abonnement pour accéder aux offres clients.",
      badge: "10 000 Ar/mois", badgeColor: "var(--iraky-gold)" },
    { step: "04", icon: "fas fa-list-alt", title: "Voir les offres",
      desc: "Consultez toutes les demandes des clients disponibles près de vous.", badge: null },
    { step: "05", icon: "fas fa-motorcycle", title: "Accepter une mission",
      desc: "Choisissez librement les courses que vous souhaitez effectuer.", badge: null },
    { step: "06", icon: "fas fa-exclamation-triangle", title: "Renouveler l'abonnement",
      desc: "Chaque mois, sinon votre compte est désactivé automatiquement.",
      badge: "Obligatoire", badgeColor: "#EF4444" },
  ];

  return (
    <section id="demarche" ref={ref} style={{ backgroundColor: "var(--iraky-void)", padding: "110px 0" }}>
      <div className="container">

        <div className="text-center mb-5 mx-auto" style={{
          maxWidth: "560px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <span className="iraky-eyebrow justify-content-center mb-3">Le parcours</span>
          <h2 className="iraky-h2" style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: "14px" }}>
            Comment ça marche ?
          </h2>
          <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "16px", marginTop: "10px" }}>
            Choisissez votre profil et découvrez les étapes.
          </p>
        </div>

        {/* Toggle segmenté */}
        <div className="d-flex justify-content-center mb-5">
          <div style={{
            display: "inline-flex", backgroundColor: "var(--iraky-surface)",
            borderRadius: "999px", padding: "5px", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {[{ id: "client", label: "Je suis Client", icon: "fas fa-user" },
              { id: "coursier", label: "Je suis Coursier", icon: "fas fa-motorcycle" }].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="btn fw-bold"
                style={{
                  backgroundColor: activeTab === tab.id ? "var(--iraky-gold)" : "transparent",
                  color: activeTab === tab.id ? "#0a0a1e" : "var(--iraky-muted)",
                  border: "none",
                  borderRadius: "999px",
                  fontSize: "14.5px",
                  padding: "10px 26px",
                  fontFamily: "var(--f-body)",
                  transition: "all 0.25s ease",
                }}
              >
                <i className={tab.icon} style={{ marginRight: "8px" }}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "client" ? (

          <div className="row align-items-center g-5" style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease",
          }}>
            <div className="col-lg-6 text-center position-relative">
              <img
                src={require("../images/client.jpg")}
                alt="Client IRAKY Delivery"
                style={{
                  width: "100%", maxWidth: "440px", borderRadius: "22px",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(255,215,0,0.16)",
                }}
              />
            </div>

            <div className="col-lg-6">
              <span style={{
                display: "inline-block", backgroundColor: "var(--iraky-route-soft)",
                color: "var(--iraky-route)", fontFamily: "var(--f-mono)", fontSize: "12px",
                padding: "6px 14px", borderRadius: "999px", marginBottom: "16px",
              }}>
                ✓ INSCRIPTION 100% GRATUITE
              </span>
              <h3 style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: "26px" }}>
                Comment commander un coursier ?
              </h3>
              <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "15.5px", lineHeight: "1.85" }}>
                Inscrivez-vous gratuitement, connectez-vous à votre espace
                personnel, puis remplissez une demande en indiquant le service
                souhaité, votre adresse et une description. Un coursier
                disponible l'accepte rapidement, et vous êtes notifié dès la
                mission terminée — le tout dès{" "}
                <strong style={{ color: "var(--iraky-gold)" }}>5 000 Ar</strong>.
              </p>
              <div className="d-flex gap-3 mt-4 flex-wrap">
                <button className="iraky-btn-gold">
                  <i className="fas fa-user-plus me-2"></i>S'inscrire gratuitement
                </button>
                <button className="iraky-btn-ghost">
                  <i className="fas fa-sign-in-alt me-2"></i>Se connecter
                </button>
              </div>
            </div>
          </div>

        ) : (

          <div className="position-relative">
            {/* Ligne de trajet reliant les étapes — visible en grand écran uniquement */}
            <svg className="d-none d-lg-block" style={{
              position: "absolute", top: "44px", left: "8%", width: "84%", height: "2px", zIndex: 0,
            }} viewBox="0 0 100 2" preserveAspectRatio="none">
              <line x1="0" y1="1" x2="100" y2="1" stroke="var(--iraky-gold-line)" strokeWidth="2"
                strokeDasharray="0.5 2.5" className="iraky-route-path" />
            </svg>

            <div className="row g-4 justify-content-center position-relative" style={{ zIndex: 1 }}>
              {demarcheCoursier.map((step, index) => (
                <div key={index} className="col-md-6 col-lg-4" style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(28px)",
                  transition: `all 0.55s ease ${index * 0.1}s`,
                }}>
                  <div className="iraky-card p-4 h-100" style={{ cursor: "default" }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <span style={{
                        fontFamily: "var(--f-mono)", backgroundColor: "var(--iraky-gold-soft)",
                        color: "var(--iraky-gold)", fontWeight: 700, fontSize: "16px",
                        width: "42px", height: "42px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: "1px solid rgba(255,215,0,0.25)",
                      }}>
                        {step.step}
                      </span>
                      <i className={step.icon} style={{ color: "var(--iraky-gold)", fontSize: "19px" }}></i>
                      {step.badge && (
                        <span className="ms-auto" style={{
                          backgroundColor: step.badgeColor, color: step.badgeColor === "var(--iraky-gold)" ? "#0a0a1e" : "#fff",
                          fontSize: "10.5px", fontWeight: 700, padding: "5px 10px", borderRadius: "10px",
                          fontFamily: "var(--f-mono)",
                        }}>
                          {step.badge}
                        </span>
                      )}
                    </div>
                    <h6 style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: "15px" }}>
                      {step.title}
                    </h6>
                    <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px", marginBottom: 0, lineHeight: 1.6 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        )}

      </div>
    </section>
  );
}

export default Demarche;