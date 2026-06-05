import { useState, useEffect, useRef } from "react";

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
    <section
      id="partenariats"
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
            Nos Partenaires
          </h2>
          <p style={{ color: "#aaaaaa", fontSize: "17px" }}>
            Ils nous font confiance à Toliara
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {partenaires.map((p, index) => (
            <div
              key={index}
              className="col-6 col-md-4 col-lg-2"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                transition: `all 0.6s ease ${index * 0.1}s`,
              }}
            >
              <div
                className="text-center p-3 border-0"
                style={{
                  backgroundColor: "#1a1a35",
                  borderRadius: "16px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "default",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px #FFD70022";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="mx-auto mb-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: "55px",
                    height: "55px",
                    borderRadius: "50%",
                    backgroundColor: "#FFD70022",
                  }}
                >
                  <i className={p.icon} style={{ color: "#FFD700", fontSize: "22px" }}></i>
                </div>
                <h6 className="fw-bold mb-1" style={{ color: "#ffffff" }}>{p.nom}</h6>
                <small style={{ color: "#aaaaaa" }}>{p.desc}</small>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Partenariats;