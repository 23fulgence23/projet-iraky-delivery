import { useState, useEffect, useRef } from "react";
import Demarche from "./Demarche";
import Partenariats from "./Partenariats";

function APropos() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const cards = [
    { icon: "fas fa-briefcase", title: "Emploi local", desc: "Nous créons des opportunités d'emploi pour les jeunes coursiers de Toliara." },
    { icon: "fas fa-clock", title: "Gain de temps", desc: "Plus besoin de faire la queue. Notre coursier s'occupe de tout à votre place." },
    { icon: "fas fa-coins", title: "Prix abordable", desc: "Un service complet à seulement 5 000 Ar par course, accessible à tous." },
    { icon: "fas fa-shield-alt", title: "Service fiable", desc: "Des coursiers vérifiés et de confiance pour chaque mission." },
  ];

  return (
    <section id="apropos">

      {/* À propos principal */}
      <div
        ref={ref}
        style={{ backgroundColor: "#0d0d25", padding: "100px 0" }}
      >
        <div className="container">

          <div
            className="text-center mb-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
              transition: "all 0.7s ease",
            }}
          >
            <h2 className="fw-bold" style={{ color: "#FFD700", fontSize: "40px" }}>
              À propos de nous
            </h2>
            <p style={{ color: "#aaaaaa", fontSize: "17px", maxWidth: "600px", margin: "0 auto" }}>
              IRAKY Delivery est une plateforme numérique qui met en relation
              les habitants de Toliara avec des coursiers locaux de confiance.
            </p>
          </div>

          <div className="row g-4">
            {cards.map((card, index) => (
              <div
                key={index}
                className="col-md-6 col-lg-3"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.7s ease ${index * 0.15}s`,
                }}
              >
                <div
                  className="card h-100 text-center p-4 border-0"
                  style={{
                    backgroundColor: "#1a1a35",
                    borderRadius: "16px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "default",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = "0 20px 40px #FFD70022";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: "#FFD70022",
                    }}
                  >
                    <i className={card.icon} style={{ color: "#FFD700", fontSize: "24px" }}></i>
                  </div>
                  <h5 className="fw-bold" style={{ color: "#ffffff" }}>{card.title}</h5>
                  <p style={{ color: "#aaaaaa", fontSize: "14px" }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Démarche incluse */}
      <Demarche />

      {/* Partenariats inclus */}
      <Partenariats />

    </section>
  );
}

export default APropos;