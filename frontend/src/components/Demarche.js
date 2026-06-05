import { useState, useEffect, useRef } from "react";

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
    {
      step: "01",
      icon: "fas fa-user-plus",
      title: "Inscription",
      desc: "Créez votre compte coursier et rejoignez la plateforme IRAKY Delivery.",
      badge: null,
    },
    {
      step: "02",
      icon: "fas fa-hand-holding-usd",
      title: "Droit d'entrée",
      desc: "Payez le droit d'entrée unique pour activer votre compte coursier.",
      badge: "10 000 Ar",
      badgeColor: "#FFD700",
    },
    {
      step: "03",
      icon: "fas fa-calendar-check",
      title: "Abonnement mensuel",
      desc: "Payez votre premier abonnement mensuel pour accéder aux offres clients.",
      badge: "10 000 Ar/mois",
      badgeColor: "#FFD700",
    },
    {
      step: "04",
      icon: "fas fa-list-alt",
      title: "Voir les offres",
      desc: "Accédez à votre espace et consultez toutes les demandes des clients disponibles.",
      badge: null,
    },
    {
      step: "05",
      icon: "fas fa-motorcycle",
      title: "Accepter une mission",
      desc: "Choisissez librement les courses que vous souhaitez effectuer.",
      badge: null,
    },
    {
      step: "06",
      icon: "fas fa-exclamation-triangle",
      title: "Renouveler l'abonnement",
      desc: "Renouvelez votre abonnement chaque mois. Sinon votre compte sera désactivé automatiquement.",
      badge: "⚠️ Obligatoire",
      badgeColor: "#dc3545",
    },
  ];

  return (
    <section
      id="demarche"
      ref={ref}
      style={{ backgroundColor: "#0a0a1e", padding: "100px 0" }}
    >
      <div className="container">

        {/* Titre */}
        <div
          className="text-center mb-5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.7s ease",
          }}
        >
          <h2 className="fw-bold" style={{ color: "#FFD700", fontSize: "40px" }}>
            Comment ça marche ?
          </h2>
          <p style={{ color: "#aaaaaa", fontSize: "17px" }}>
            Choisissez votre profil et découvrez les étapes
          </p>
        </div>

        {/* Tabs Client / Coursier */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          <button
            onClick={() => setActiveTab("client")}
            className="btn fw-bold px-5 py-2"
            style={{
              backgroundColor: activeTab === "client" ? "#FFD700" : "transparent",
              color: activeTab === "client" ? "#000" : "#FFD700",
              border: "2px solid #FFD700",
              borderRadius: "25px",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
          >
            <i className="fas fa-user me-2"></i>
            Je suis Client
          </button>
          <button
            onClick={() => setActiveTab("coursier")}
            className="btn fw-bold px-5 py-2"
            style={{
              backgroundColor: activeTab === "coursier" ? "#FFD700" : "transparent",
              color: activeTab === "coursier" ? "#000" : "#FFD700",
              border: "2px solid #FFD700",
              borderRadius: "25px",
              fontSize: "16px",
              transition: "all 0.3s ease",
            }}
          >
            <i className="fas fa-motorcycle me-2"></i>
            Je suis Coursier
          </button>
        </div>

        {/* Contenu */}
        {activeTab === "client" ? (

          /* CLIENT — image gauche + description droite */
          <div
            className="row align-items-center g-5"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.7s ease",
            }}
          >
            {/* Image gauche */}
            <div className="col-lg-6 text-center">
              <img
                src={require("../images/client.jpg")}
                alt="Client IRAKY"
                style={{
                  width: "100%",
                  maxWidth: "450px",
                  borderRadius: "20px",
                  boxShadow: "0 0 50px #FFD70033",
                }}
              />
            </div>

            {/* Description droite */}
            <div className="col-lg-6">
              <span
                className="badge mb-3 px-3 py-2"
                style={{
                  backgroundColor: "#FFD70022",
                  color: "#FFD700",
                  fontSize: "13px",
                }}
              >
                ✅ Inscription 100% gratuite
              </span>
              <h3 className="fw-bold mb-3" style={{ color: "#ffffff" }}>
                Comment commander un coursier ?
              </h3>
              <p style={{ color: "#aaaaaa", fontSize: "16px", lineHeight: "1.9" }}>
                Inscrivez-vous gratuitement sur IRAKY Delivery, connectez-vous
                à votre espace personnel, puis remplissez un simple formulaire
                de demande en indiquant le type de service souhaité, votre
                adresse et une description. Soumettez votre demande et un
                coursier disponible l'acceptera rapidement. Vous serez notifié
                dès que la mission est terminée, le tout à seulement{" "}
                <span style={{ color: "#FFD700", fontWeight: "bold" }}>
                  5 000 Ar
                </span>.
              </p>
              <div className="d-flex gap-3 mt-4">
                <button
                  className="btn fw-bold px-4 py-2"
                  style={{
                    backgroundColor: "#FFD700",
                    color: "#000",
                    borderRadius: "25px",
                    fontSize: "15px",
                  }}
                >
                  <i className="fas fa-user-plus me-2"></i>
                  S'inscrire gratuitement
                </button>
                <button
                  className="btn fw-bold px-4 py-2"
                  style={{
                    border: "2px solid #FFD700",
                    color: "#FFD700",
                    backgroundColor: "transparent",
                    borderRadius: "25px",
                    fontSize: "15px",
                  }}
                >
                  <i className="fas fa-sign-in-alt me-2"></i>
                  Se connecter
                </button>
              </div>
            </div>
          </div>

        ) : (

          /* COURSIER — étapes */
          <div className="row g-4 justify-content-center">
            {demarcheCoursier.map((step, index) => (
              <div
                key={index}
                className="col-md-6 col-lg-4"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(40px)",
                  transition: `all 0.6s ease ${index * 0.15}s`,
                }}
              >
                <div
                  className="p-4 h-100"
                  style={{
                    backgroundColor: "#1a1a35",
                    borderRadius: "16px",
                    borderTop: "3px solid #FFD700",
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
                    <span
                      style={{
                        backgroundColor: "#FFD70022",
                        color: "#FFD700",
                        fontWeight: "bold",
                        fontSize: "18px",
                        width: "45px",
                        height: "45px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {step.step}
                    </span>
                    <i
                      className={step.icon}
                      style={{ color: "#FFD700", fontSize: "22px" }}
                    ></i>
                    {step.badge && (
                      <span
                        className="badge ms-auto"
                        style={{
                          backgroundColor: step.badgeColor,
                          color: step.badgeColor === "#FFD700" ? "#000" : "#fff",
                          fontSize: "11px",
                          padding: "5px 10px",
                          borderRadius: "10px",
                        }}
                      >
                        {step.badge}
                      </span>
                    )}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: "#ffffff" }}>
                    {step.title}
                  </h6>
                  <p style={{ color: "#aaaaaa", fontSize: "14px", marginBottom: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        )}

      </div>
    </section>
  );
}

export default Demarche;