import { useState, useEffect, useRef } from "react";
import "../Theme.css";
import "../App.css";

function NosServices() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const services = [
    { icon: "fas fa-bolt", title: "Facture JIRAMA", desc: "Réglez votre facture JIRAMA sans vous déplacer." },
    { icon: "fas fa-id-card", title: "Légalisation CIN", desc: "Légalisez votre CIN ou tout document administratif." },
    { icon: "fas fa-university", title: "Banque / Trésor", desc: "Fini les longues files à la banque ou au trésor." },
    { icon: "fas fa-shopping-cart", title: "Achats", desc: "Courses au SCORE, BazarBe, SCAMA et partout à Toliara." },
    { icon: "fas fa-graduation-cap", title: "Mentor universitaire", desc: "Aide les étudiants à trouver un mentor dans leur domaine." },
    { icon: "fas fa-box", title: "Livraison de colis", desc: "Livrez vos colis et documents partout dans Toliara rapidement." },
  ];

  return (
    <section id="services" ref={ref} style={{ backgroundColor: "var(--iraky-void)", padding: "110px 0" }}>
      <div className="container">

        <div className="text-center mb-5 mx-auto" style={{
          maxWidth: "560px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <span className="iraky-eyebrow justify-content-center mb-3">Ce qu'on fait pour vous</span>
          <h2 className="iraky-h2" style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: "14px" }}>
            Nos Services
          </h2>
          <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "16px", marginTop: "10px" }}>
            Tout ce que nous pouvons faire à votre place.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {services.map((service, index) => (
            <div key={index} className="col-md-6 col-lg-4" style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: `all 0.6s ease ${index * 0.08}s`,
            }}>
              <div className="iraky-card h-100 p-4" style={{ cursor: "default" }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "13px",
                    backgroundColor: "var(--iraky-gold-soft)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "transform 0.3s ease",
                  }}>
                    <i className={service.icon} style={{ color: "var(--iraky-gold)", fontSize: "19px" }}></i>
                  </div>
                  <h5 style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: "16px", margin: 0 }}>
                    {service.title}
                  </h5>
                </div>
                <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px", lineHeight: 1.6, marginBottom: 0 }}>
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Prix — pilule signature */}
        <div className="text-center mt-5" style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.6s ease 0.5s",
        }}>
          <div className="d-inline-flex align-items-center gap-3" style={{
            backgroundColor: "var(--iraky-surface)",
            border: "1px solid rgba(255,215,0,0.25)",
            borderRadius: "999px",
            padding: "14px 30px",
            boxShadow: "0 16px 40px rgba(255,215,0,0.08)",
          }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "var(--iraky-route)",
              animation: "iraky-pulse-dot 1.8s infinite", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--f-body)", color: "var(--iraky-ink)", fontWeight: 700, fontSize: "17px" }}>
              À seulement <span style={{ color: "var(--iraky-gold)" }}>5 000 Ar</span> par course
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default NosServices;