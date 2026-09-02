import { useState, useEffect } from "react";
import coursier1 from "../images/coursier1.png";
import coursier2 from "../images/coursier2.jpg";
import coursier3 from "../images/coursier3.jpg";
import coursier4 from "../images/coursier4.jpg";
import "../Theme.css";
import "../App.css";
function Accueil() {
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [coursier1, coursier2, coursier3, coursier4];

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 120);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: "5 000 Ar", label: "dès la 1ère course" },
    { value: "15–30 min", label: "délai moyen" },
    { value: "100 %", label: "coursiers locaux" },
  ];

  return (
    <section
      id="accueil"
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse 900px 500px at 15% 15%, rgba(255,215,0,0.07), transparent 60%), radial-gradient(ellipse 700px 500px at 90% 80%, rgba(52,211,153,0.05), transparent 60%), var(--iraky-void)",
        display: "flex",
        alignItems: "center",
        paddingTop: "96px",
        paddingBottom: "60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="container position-relative">
        <div className="row align-items-center g-5">

          {/* Texte gauche */}
          <div
            className="col-lg-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-32px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span className="iraky-eyebrow mb-4 d-inline-flex">Service de coursier · Toliara</span>

            <h1
              style={{
                fontFamily: "var(--f-display)",
                fontWeight: 700,
                color: "var(--iraky-ink)",
                fontSize: "clamp(34px, 5vw, 54px)",
                lineHeight: 1.12,
                letterSpacing: "-1px",
                marginTop: "18px",
                marginBottom: "20px",
              }}
            >
              On fait la queue
              <br />
              <span style={{ color: "var(--iraky-gold)" }}>à votre place.</span>
            </h1>

            <p
              style={{
                fontFamily: "var(--f-body)",
                color: "var(--iraky-muted)",
                fontSize: "17px",
                lineHeight: "1.75",
                maxWidth: "460px",
                marginBottom: "32px",
              }}
            >
              Facture, banque, courses, colis, documents — un coursier vérifié
              de Toliara s'en charge pour vous, à partir de{" "}
              <strong style={{ color: "var(--iraky-gold)" }}>5 000 Ar</strong>.
            </p>

            <div className="d-flex gap-3 flex-wrap mb-5">
              <button className="iraky-btn-gold" onClick={() => scrollTo("services")}>
                Voir nos services
              </button>
              <button className="iraky-btn-ghost" onClick={() => scrollTo("apropos")}>
                En savoir plus
              </button>
            </div>

            {/* Stats */}
            <div className="d-flex flex-wrap" style={{ gap: "28px" }}>
              {stats.map((s, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "var(--f-mono)", color: "var(--iraky-gold)",
                    fontWeight: 700, fontSize: "18px" }}>{s.value}</div>
                  <div style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted-dim)",
                    fontSize: "12.5px", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel droite */}
          <div
            className="col-lg-6 text-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(32px)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s",
            }}
          >
            <div style={{ position: "relative", width: "100%", maxWidth: "540px", margin: "0 auto" }}>

              {/* Trajet en pointillés — élément signature, visible seulement en grand écran */}
              <svg
                className="d-none d-lg-block"
                viewBox="0 0 540 60"
                style={{ position: "absolute", top: "-46px", left: "-40px", width: "200px", height: "60px", opacity: 0.8 }}
              >
                <path d="M 4 50 Q 90 10 180 24" fill="none" stroke="var(--iraky-route)" strokeWidth="2"
                  className="iraky-route-path" />
                <circle cx="4" cy="50" r="4" fill="var(--iraky-route)" />
                <circle cx="180" cy="24" r="4" fill="var(--iraky-gold)" />
              </svg>

              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "540 / 380",
                  borderRadius: "24px",
                  overflow: "hidden",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.5)",
                }}
              >
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Coursier IRAKY Delivery ${index + 1}`}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: currentSlide === index ? 1 : 0,
                      transition: "opacity 1s ease",
                    }}
                  />
                ))}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, transparent 60%, rgba(7,7,15,0.55))",
                  pointerEvents: "none",
                }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "24px",
                  border: "1px solid rgba(255,215,0,0.25)", pointerEvents: "none",
                }} />
              </div>

              {/* Badge flottant "en route" — signature */}
              <div
                className="d-none d-md-flex"
                style={{
                  position: "absolute", bottom: "-18px", left: "-18px",
                  backgroundColor: "var(--iraky-surface)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "14px",
                  padding: "12px 16px",
                  alignItems: "center", gap: "10px",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
                  animation: "iraky-float 3.5s ease-in-out infinite",
                }}
              >
                <span style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: "var(--iraky-route)", animation: "iraky-pulse-dot 1.8s infinite",
                }} />
                <div>
                  <div style={{ fontFamily: "var(--f-mono)", fontSize: "11px", color: "var(--iraky-route)", fontWeight: 700 }}>
                    COURSIER EN ROUTE
                  </div>
                  <div style={{ fontFamily: "var(--f-body)", fontSize: "11px", color: "var(--iraky-muted)" }}>
                    Arrivée estimée : 18 min
                  </div>
                </div>
              </div>

              {/* Points indicateurs */}
              <div className="d-flex justify-content-center gap-2 mt-5">
                {images.map((_, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    style={{
                      width: currentSlide === index ? "26px" : "7px",
                      height: "7px",
                      borderRadius: "4px",
                      backgroundColor: currentSlide === index ? "var(--iraky-gold)" : "rgba(255,255,255,0.18)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Accueil;