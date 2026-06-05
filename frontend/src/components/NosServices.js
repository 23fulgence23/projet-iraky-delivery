import { useState, useEffect, useRef } from "react";

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
    { icon: "fas fa-box", title: "Livraison de colis", 
  desc: "Livrez vos colis et documents partout dans Toliara rapidement." },
  ];

  return (
    <section
      id="services"
      ref={ref}
      style={{ backgroundColor: "#0a0a1e", padding: "100px 0" }}
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
            Nos Services
          </h2>
          <p style={{ color: "#aaaaaa", fontSize: "17px" }}>
            Tout ce que nous pouvons faire à votre place
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          {services.map((service, index) => (
            <div
              key={index}
              className="col-md-6 col-lg-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.7s ease ${index * 0.15}s`,
              }}
            >
              <div
                className="card h-100 p-4 border-0"
                style={{
                  backgroundColor: "#1a1a35",
                  borderRadius: "16px",
                  borderLeft: "4px solid #FFD700",
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
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "12px",
                      backgroundColor: "#FFD70022",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i className={service.icon} style={{ color: "#FFD700", fontSize: "20px" }}></i>
                  </div>
                  <h5 className="fw-bold mb-0" style={{ color: "#ffffff" }}>
                    {service.title}
                  </h5>
                </div>
                <p style={{ color: "#aaaaaa", fontSize: "14px", marginBottom: "0" }}>
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Prix */}
        <div
          className="text-center mt-5"
          style={{
            opacity: visible ? 1 : 0,
            transition: "all 0.7s ease 0.8s",
          }}
        >
          <div
            className="d-inline-block px-5 py-3"
            style={{
              backgroundColor: "#FFD700",
              borderRadius: "50px",
              boxShadow: "0 0 40px #FFD70055",
            }}
          >
            <span style={{ color: "#000", fontWeight: "bold", fontSize: "22px" }}>
              🚀 À seulement 5 000 Ar par course !
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default NosServices;