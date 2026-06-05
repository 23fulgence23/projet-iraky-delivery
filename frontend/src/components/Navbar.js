import { useState, useEffect } from "react";
import logo from "../logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("accueil");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ état menu mobile

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = ["accueil", "apropos", "services", "contact"];
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false); // ✅ ferme le menu après clic
  };

  const menuItems = [
    { id: "accueil", label: "Accueil" },
    { id: "apropos", label: "À propos" },
    { id: "services", label: "Nos Services" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      className="navbar navbar-dark fixed-top shadow"
      style={{
        backgroundColor: scrolled ? "rgba(10,10,30,0.98)" : "rgba(10,10,30,0.85)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        borderBottom: "1px solid #FFD70033",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center flex-wrap">

        {/* Logo */}
        <span
          className="navbar-brand d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={() => scrollTo("accueil")}
        >
          <img
            src={logo}
            alt="IRAKY"
            style={{ width: "80px", height: "80px", borderRadius: "50%" }}
          />
          <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "20px" }}>
            IRAKY Delivery
          </span>
        </span>

        {/* ✅ Bouton hamburger — visible uniquement mobile */}
        <button
          className="d-lg-none btn"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            backgroundColor: "transparent",
            border: "2px solid #FFD700",
            borderRadius: "8px",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          {/* 3 barres */}
          {menuOpen ? (
            // ✅ Croix si menu ouvert
            <span style={{ color: "#FFD700", fontSize: "20px", lineHeight: 1 }}>✕</span>
          ) : (
            // ✅ 3 barres si menu fermé
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              <div style={{ width: "22px", height: "2px", backgroundColor: "#FFD700" }} />
              <div style={{ width: "22px", height: "2px", backgroundColor: "#FFD700" }} />
              <div style={{ width: "22px", height: "2px", backgroundColor: "#FFD700" }} />
            </div>
          )}
        </button>

        {/* Menu desktop — caché sur mobile */}
        <div className="d-none d-lg-flex align-items-center gap-4">
          {menuItems.map((item) => (
            <span
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                cursor: "pointer",
                color: activeSection === item.id ? "#FFD700" : "#ffffff",
                fontWeight: activeSection === item.id ? "bold" : "normal",
                borderBottom: activeSection === item.id ? "2px solid #FFD700" : "2px solid transparent",
                paddingBottom: "4px",
                transition: "all 0.3s ease",
                fontSize: "15px",
              }}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* Boutons desktop */}
        <div className="d-none d-lg-flex gap-2">
          <button
            onClick={() => navigate("/connexion")}
            className="btn btn-sm fw-bold"
            style={{
              border: "2px solid #FFD700",
              color: "#FFD700",
              backgroundColor: "transparent",
              borderRadius: "20px",
              padding: "6px 18px",
            }}
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate("/inscription")}
            className="btn btn-sm fw-bold"
            style={{
              backgroundColor: "#FFD700",
              color: "#000",
              border: "none",
              borderRadius: "20px",
              padding: "6px 18px",
            }}
          >
            S'inscrire
          </button>
        </div>

        {/* ✅ Menu mobile déroulant */}
        {menuOpen && (
          <div
            className="d-lg-none w-100"
            style={{
              backgroundColor: "rgba(10,10,30,0.98)",
              borderTop: "1px solid #FFD70033",
              padding: "16px 0",
              marginTop: "10px",
            }}
          >
            {/* Liens */}
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  padding: "12px 20px",
                  cursor: "pointer",
                  color: activeSection === item.id ? "#FFD700" : "#ffffff",
                  fontWeight: activeSection === item.id ? "bold" : "normal",
                  borderLeft: activeSection === item.id ? "3px solid #FFD700" : "3px solid transparent",
                  fontSize: "15px",
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </div>
            ))}

            {/* Boutons */}
            <div className="d-flex gap-2 px-3 mt-3">
              <button
                onClick={() => { navigate("/connexion"); setMenuOpen(false); }}
                className="btn btn-sm fw-bold flex-fill"
                style={{
                  border: "2px solid #FFD700",
                  color: "#FFD700",
                  backgroundColor: "transparent",
                  borderRadius: "20px",
                  padding: "8px",
                }}
              >
                Se connecter
              </button>
              <button
                onClick={() => { navigate("/inscription"); setMenuOpen(false); }}
                className="btn btn-sm fw-bold flex-fill"
                style={{
                  backgroundColor: "#FFD700",
                  color: "#000",
                  border: "none",
                  borderRadius: "20px",
                  padding: "8px",
                }}
              >
                S'inscrire
              </button>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;