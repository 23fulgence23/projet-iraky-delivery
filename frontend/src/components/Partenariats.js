import { useState, useEffect, useRef } from "react";
import "../Theme.css";
import "../App.css";

function Partenariats() {
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

  const partenaires = [
    { icon: "fas fa-store", nom: "SCORE", desc: "Supermarché" },
    { icon: "fas fa-shopping-bag", nom: "BazarBe", desc: "Marché partenaire" },
    { icon: "fas fa-building", nom: "SCAMA", desc: "Commerce partenaire" },
    { icon: "fas fa-bolt", nom: "JIRAMA", desc: "Eau et électricité" },
    { icon: "fas fa-university", nom: "BFV", desc: "Banque partenaire" },
    { icon: "fas fa-mobile-alt", nom: "Mvola", desc: "Mobile Money" },
  ];

  return (
    <section id="partenariats" ref={ref} style={{ backgroundColor: "var(--iraky-deep)", padding: "110px 0" }}>
      <div className="container">

        <div className="text-center mb-5 mx-auto" style={{
          maxWidth: "520px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <span className="iraky-eyebrow justify-content-center mb-3">Écosystème local</span>
          <h2 className="iraky-h2" style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: "14px" }}>
            Nos Partenaires
          </h2>
          <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "16px", marginTop: "10px" }}>
            Ils nous font confiance à Toliara.
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {partenaires.map((p, index) => (
            <div key={index} className="col-6 col-md-4 col-lg-2" style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: `all 0.55s ease ${index * 0.07}s`,
            }}>
              <div className="iraky-card text-center p-3" style={{ cursor: "default" }}>
                <div className="mx-auto mb-2 d-flex align-items-center justify-content-center" style={{
                  width: "52px", height: "52px", borderRadius: "14px", backgroundColor: "var(--iraky-gold-soft)",
                }}>
                  <i className={p.icon} style={{ color: "var(--iraky-gold)", fontSize: "20px" }}></i>
                </div>
                <h6 style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: "14px", marginBottom: "2px" }}>
                  {p.nom}
                </h6>
                <small style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted-dim)", fontSize: "11px" }}>
                  {p.desc}
                </small>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Partenariats;