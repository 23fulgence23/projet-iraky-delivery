import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../logo.png";
import "../Theme.css";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("accueil");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("iraky-theme") || "dark";
  });

  // ✅ Applique et persiste le thème (clair/sombre) dès le chargement et à chaque changement
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("iraky-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "dark" ? "light" : "dark"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["accueil", "apropos", "services", "demarche", "partenariats", "contact"];
      sections.forEach((section) => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) setActiveSection(section);
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const menuItems = [
    { id: "accueil", label: "Accueil" },
    { id: "apropos", label: "À propos" },
    { id: "services", label: "Nos Services" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav
      className="navbar navbar-dark fixed-top"
      style={{
        backgroundColor: scrolled ? "var(--iraky-nav-bg-scrolled)" : "var(--iraky-nav-bg)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        transition: "background-color 0.3s ease, border-color 0.3s ease",
        borderBottom: `1px solid ${scrolled ? "var(--iraky-nav-border-scrolled)" : "var(--iraky-nav-border)"}`,
        padding: "12px 0",
      }}
    >
      <div className="container d-flex justify-content-between align-items-center flex-wrap">

        {/* Logo */}
        <span
          className="d-flex align-items-center gap-2"
          style={{ cursor: "pointer" }}
          onClick={() => scrollTo("accueil")}
        >
          <img
            src={logo}
            alt="IRAKY Delivery"
            style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover",
              border: "1.5px solid rgba(255,215,0,0.4)" }}
          />
          <span style={{ fontFamily: "var(--f-display)", color: "var(--iraky-ink)",
            fontWeight: 700, fontSize: "19px", letterSpacing: "-0.3px" }}>
            IRAKY <span style={{ color: "var(--iraky-gold)" }}>Delivery</span>
          </span>
        </span>

        {/* Hamburger + bascule thème mobile */}
        <div className="d-lg-none d-flex align-items-center gap-2">
          <button onClick={toggleTheme} aria-label="Changer de thème"
            style={{
              width: "36px", height: "36px", borderRadius: "50%",
              border: "1.5px solid rgba(255,215,0,0.35)", backgroundColor: "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--iraky-gold)", cursor: "pointer",
            }}>
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"} style={{ fontSize: "13px" }}></i>
          </button>
          <button
            className="btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              backgroundColor: "transparent",
              border: "1.5px solid rgba(255,215,0,0.35)",
              borderRadius: "10px",
              padding: "8px 11px",
              cursor: "pointer",
            }}
          >
            {menuOpen ? (
              <span style={{ color: "var(--iraky-gold)", fontSize: "18px", lineHeight: 1 }}>✕</span>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ width: "20px", height: "2px", backgroundColor: "#FFD700", borderRadius: 2 }} />
                <div style={{ width: "20px", height: "2px", backgroundColor: "#FFD700", borderRadius: 2 }} />
                <div style={{ width: "14px", height: "2px", backgroundColor: "#FFD700", borderRadius: 2 }} />
              </div>
            )}
          </button>
        </div>

        {/* Menu desktop — pilule active */}
        <div className="d-none d-lg-flex align-items-center" style={{ gap: "4px" }}>
          {menuItems.map((item) => (
            <span
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                cursor: "pointer",
                color: activeSection === item.id ? "#0a0a1e" : "var(--iraky-muted)",
                fontFamily: "var(--f-body)",
                fontWeight: 600,
                fontSize: "14px",
                padding: "8px 16px",
                borderRadius: "999px",
                backgroundColor: activeSection === item.id ? "var(--iraky-gold)" : "transparent",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={(e) => { if (activeSection !== item.id) e.currentTarget.style.color = "var(--iraky-ink)"; }}
              onMouseLeave={(e) => { if (activeSection !== item.id) e.currentTarget.style.color = "var(--iraky-muted)"; }}
            >
              {item.label}
            </span>
          ))}
        </div>

        {/* Boutons desktop */}
        <div className="d-none d-lg-flex gap-2 align-items-center">
          <button onClick={toggleTheme} aria-label="Changer de thème" title="Mode clair / sombre"
            style={{
              width: "38px", height: "38px", borderRadius: "50%",
              border: "1.5px solid var(--iraky-gold-line)", backgroundColor: "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--iraky-gold)", cursor: "pointer", transition: "all 0.2s ease",
            }}>
            <i className={theme === "dark" ? "fas fa-sun" : "fas fa-moon"} style={{ fontSize: "14px" }}></i>
          </button>
          <button onClick={() => navigate("/connexion")} className="iraky-btn-ghost"
            style={{ padding: "9px 20px", fontSize: "14px" }}>
            Se connecter
          </button>
          <button onClick={() => navigate("/inscription")} className="iraky-btn-gold"
            style={{ padding: "9px 20px", fontSize: "14px" }}>
            S'inscrire
          </button>
        </div>

        {/* Menu mobile déroulant */}
        {menuOpen && (
          <div
            className="d-lg-none w-100"
            style={{
              backgroundColor: "var(--iraky-nav-bg-scrolled)",
              borderTop: "1px solid var(--iraky-nav-border-scrolled)",
              padding: "14px 0",
              marginTop: "12px",
            }}
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  padding: "12px 20px",
                  cursor: "pointer",
                  color: activeSection === item.id ? "var(--iraky-gold)" : "var(--iraky-ink)",
                  fontFamily: "var(--f-body)",
                  fontWeight: activeSection === item.id ? 700 : 500,
                  borderLeft: activeSection === item.id ? "3px solid var(--iraky-gold)" : "3px solid transparent",
                  fontSize: "15px",
                  transition: "all 0.2s ease",
                }}
              >
                {item.label}
              </div>
            ))}

            <div className="d-flex gap-2 px-3 mt-3">
              <button
                onClick={() => { navigate("/connexion"); setMenuOpen(false); }}
                className="iraky-btn-ghost flex-fill" style={{ fontSize: "14px" }}>
                Se connecter
              </button>
              <button
                onClick={() => { navigate("/inscription"); setMenuOpen(false); }}
                className="iraky-btn-gold flex-fill" style={{ fontSize: "14px" }}>
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