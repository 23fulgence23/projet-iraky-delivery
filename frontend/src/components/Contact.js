import { useState, useEffect, useRef } from "react";

function Contact() {
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

  return (
    <section
      id="contact"
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
            Contactez-nous
          </h2>
          <p style={{ color: "#aaaaaa", fontSize: "17px" }}>
            Nous sommes disponibles pour vous aider
          </p>
        </div>

        <div className="row g-5 align-items-center">

          {/* Infos contact gauche */}
          <div
            className="col-lg-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.7s ease",
            }}
          >
            {[
              { icon: "fas fa-phone", label: "Téléphone", value: "+261 38 21 266 83" },
              { icon: "fas fa-envelope", label: "Email", value: "irakydelivery@gmail.com" },
              { icon: "fas fa-map-marker-alt", label: "Adresse", value: "Enceinte Score BazarBe, Toliara" },
            ].map((info, index) => (
              <div
                key={index}
                className="d-flex align-items-center gap-4 mb-4 p-3"
                style={{
                  backgroundColor: "#1a1a35",
                  borderRadius: "14px",
                  borderLeft: "4px solid #FFD700",
                }}
              >
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    backgroundColor: "#FFD70022",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <i className={info.icon} style={{ color: "#FFD700", fontSize: "20px" }}></i>
                </div>
                <div>
                  <small style={{ color: "#aaaaaa" }}>{info.label}</small>
                  <p className="mb-0 fw-bold" style={{ color: "#ffffff" }}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire droite */}
          <div
            className="col-lg-7"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.7s ease 0.2s",
            }}
          >
            <div
              className="p-4"
              style={{
                backgroundColor: "#1a1a35",
                borderRadius: "20px",
              }}
            >
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Nom</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Votre nom"
                    style={{
                      backgroundColor: "#0a0a1e",
                      border: "1px solid #FFD70033",
                      color: "#ffffff",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div className="col-md-6">
                  <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Email</label>
                  <input
                    type="email"
                    className="form-control mt-1"
                    placeholder="Votre email"
                    style={{
                      backgroundColor: "#0a0a1e",
                      border: "1px solid #FFD70033",
                      color: "#ffffff",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div className="col-12">
                  <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Sujet</label>
                  <input
                    type="text"
                    className="form-control mt-1"
                    placeholder="Sujet de votre message"
                    style={{
                      backgroundColor: "#0a0a1e",
                      border: "1px solid #FFD70033",
                      color: "#ffffff",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div className="col-12">
                  <label style={{ color: "#aaaaaa", fontSize: "14px" }}>Message</label>
                  <textarea
                    className="form-control mt-1"
                    rows="4"
                    placeholder="Votre message..."
                    style={{
                      backgroundColor: "#0a0a1e",
                      border: "1px solid #FFD70033",
                      color: "#ffffff",
                      borderRadius: "10px",
                      resize: "none",
                    }}
                  />
                </div>
                <div className="col-12">
                  <button
                    className="btn fw-bold w-100 py-2"
                    style={{
                      backgroundColor: "#FFD700",
                      color: "#000",
                      borderRadius: "10px",
                      fontSize: "16px",
                    }}
                  >
                    <i className="fas fa-paper-plane me-2"></i>
                    Envoyer le message
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Contact;