import { useState, useEffect, useRef } from "react";
import Demarche from "./Demarche";
import Partenariats from "./Partenariats";
import "../Theme.css";
import "../App.css";

function APropos() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cards = [
    { icon: "fas fa-briefcase", title: "Emploi local", desc: "Des opportunités concrètes pour les jeunes coursiers de Toliara." },
    { icon: "fas fa-clock", title: "Gain de temps", desc: "Plus besoin de faire la queue. Notre coursier s'en charge à votre place." },
    { icon: "fas fa-coins", title: "Prix abordable", desc: "Un service complet dès 5 000 Ar la course, accessible à tous." },
    { icon: "fas fa-shield-alt", title: "Service fiable", desc: "Des coursiers vérifiés, identifiés et suivis en temps réel." },
  ];

  return (
    <section id="apropos">
      <div ref={ref} style={{ backgroundColor: "var(--iraky-deep)", padding: "110px 0" }}>
        <div className="container">

          <div
            className="text-center mb-5 mx-auto"
            style={{
              maxWidth: "620px",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.7s ease",
            }}
          >
            <span className="iraky-eyebrow justify-content-center mb-3">Qui sommes-nous</span>
            <h2 className="iraky-h2" style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: "14px" }}>
              À propos de nous
            </h2>
            <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "16px", marginTop: "10px" }}>
              IRAKY Delivery met en relation les habitants de Toliara avec des
              coursiers locaux de confiance, pour toutes les démarches du quotidien.
            </p>
          </div>

          <div className="row g-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className="col-md-6 col-lg-3"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(28px)",
                  transition: `all 0.6s ease ${index * 0.1}s`,
                }}
              >
                <div className="iraky-card h-100 text-center p-4" style={{ cursor: "default" }}>
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{ width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "var(--iraky-gold-soft)" }}
                  >
                    <i className={card.icon} style={{ color: "var(--iraky-gold)", fontSize: "22px" }}></i>
                  </div>
                  <h5 style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: "16px" }}>
                    {card.title}
                  </h5>
                  <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13.5px", lineHeight: 1.6 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Demarche />
      <Partenariats />
    </section>
  );
}

export default APropos;