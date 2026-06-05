import { useState, useEffect } from "react";
import coursier1 from "../images/coursier1.png";
import coursier2 from "../images/coursier2.jpg";
import coursier3 from "../images/coursier3.jpg";
import coursier4 from "../images/coursier4.jpg";

function Accueil() {
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [coursier1, coursier2, coursier3, coursier4];

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="accueil"
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a1e",
        display: "flex",
        alignItems: "center",
        paddingTop: "80px",
      }}
    >
      <div className="container">
        <div className="row align-items-center">

          {/* Texte gauche */}
          <div
            className="col-lg-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-50px)",
              transition: "all 0.8s ease",
            }}
          >
            <span
              className="badge mb-3 px-3 py-2"
              style={{ backgroundColor: "#FFD70022", color: "#FFD700", fontSize: "13px" }}
            >
              🚀 Service de coursier à Toliara
            </span>
            <h1
              className="fw-bold mb-3"
              style={{ color: "#ffffff", fontSize: "52px", lineHeight: "1.2" }}
            >
              Nous pouvons faire
              <span style={{ color: "#FFD700" }}> vos courses</span>
            </h1>
            <p
              className="mb-4"
              style={{ color: "#aaaaaa", fontSize: "18px", lineHeight: "1.8" }}
            >
              Plus besoin de vous déplacer ! IRAKY Delivery envoie un coursier
              à votre place pour seulement{" "}
              <span style={{ color: "#FFD700", fontWeight: "bold" }}>5 000 Ar</span>.
            </p>
            <div className="d-flex gap-3">
              <button
                className="btn fw-bold px-4 py-2"
                style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  borderRadius: "25px",
                  fontSize: "16px",
                }}
                onClick={() => scrollTo("services")}
              >
                Voir nos services
              </button>
              <button
                className="btn fw-bold px-4 py-2"
                style={{
                  border: "2px solid #FFD700",
                  color: "#FFD700",
                  backgroundColor: "transparent",
                  borderRadius: "25px",
                  fontSize: "16px",
                }}
                onClick={() => scrollTo("apropos")}
              >
                En savoir plus
              </button>
            </div>
          </div>

          {/* Carousel droite */}
          <div
            className="col-lg-6 text-center mt-5 mt-lg-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(50px)",
              transition: "all 0.8s ease 0.3s",
            }}
          >
            {/* Image principale */}
            <div
              style={{
                position: "relative",
                width: "600px",
                height: "380px",
                margin: "0 auto",
              }}
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`coursier ${index + 1}`}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "20px",
                    boxShadow: "0 0 60px #FFD70044",
                    opacity: currentSlide === index ? 1 : 0,
                    transition: "opacity 0.8s ease",
                  }}
                />
              ))}

              {/* Bordure animée */}
              <div
                style={{
                  position: "absolute",
                  top: "-5px",
                  left: "-5px",
                  right: "-5px",
                  bottom: "-5px",
                  borderRadius: "25px",
                  border: "2px solid #FFD70055",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>

            {/* Points indicateurs */}
            <div className="d-flex justify-content-center gap-2 mt-4">
              {images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  style={{
                    width: currentSlide === index ? "30px" : "10px",
                    height: "10px",
                    borderRadius: "5px",
                    backgroundColor: currentSlide === index ? "#FFD700" : "#ffffff33",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

          </div>

        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.02); }
        }
      `}</style>
    </section>
  );
}

export default Accueil;