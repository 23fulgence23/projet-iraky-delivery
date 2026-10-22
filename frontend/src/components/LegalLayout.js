import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import logo from "../logo.png";
import ThemeToggle from "./ThemeToggle";
import "../Theme.css";
import "../App.css";
import "../Legal.css";

export default function LegalLayout({ eyebrow, titre, intro, maj, sections, autre }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const aller = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ backgroundColor: "var(--iraky-void)", minHeight: "100vh" }}>
      {/* Barre du haut */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        backgroundColor: "var(--iraky-nav-bg-scrolled)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--iraky-nav-border-scrolled)",
      }}>
        <div className="container d-flex align-items-center justify-content-between py-2">
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={logo} alt="IRAKY" style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }} />
            <span style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: 17 }}>
              IRAKY <span style={{ color: "var(--iraky-gold)" }}>Delivery</span>
            </span>
          </Link>
          <div className="d-flex align-items-center gap-2">
            <Link to="/" className="iraky-btn-ghost"
              style={{ padding: "8px 16px", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <FiArrowLeft /> Retour au portail
            </Link>
            <ThemeToggle size={38} />
          </div>
        </div>
      </div>

      {/* En-tête de page */}
      <div style={{ background: "linear-gradient(180deg, var(--iraky-gold-soft), transparent)", padding: "56px 0 32px" }}>
        <div className="container" style={{ maxWidth: 1000 }}>
          <div className="iraky-eyebrow mb-3">{eyebrow}</div>
          <h1 className="iraky-h2" style={{ fontSize: "clamp(28px, 5vw, 44px)", marginBottom: 14 }}>{titre}</h1>
          <p className="iraky-body" style={{ maxWidth: 680, fontSize: 15.5, lineHeight: 1.7 }}>{intro}</p>
          <small style={{ fontFamily: "var(--f-mono)", color: "var(--iraky-muted-dim)", fontSize: 12 }}>
            Dernière mise à jour : {maj}
          </small>
        </div>
      </div>

      {/* Contenu */}
      <div className="container" style={{ maxWidth: 1000, paddingBottom: 72 }}>
        <div className="row g-4">
          <div className="col-lg-3 d-none d-lg-block">
            <nav className="legal-toc" style={{ position: "sticky", top: 90 }}>
              <div style={{ fontFamily: "var(--f-mono)", fontSize: 11.5, letterSpacing: 1.5, color: "var(--iraky-muted-dim)", marginBottom: 10 }}>
                SOMMAIRE
              </div>
              {sections.map((s, i) => (
                <a key={s.id} href={"#" + s.id} onClick={(e) => aller(e, s.id)}>{i + 1}. {s.titre}</a>
              ))}
            </nav>
          </div>

          <div className="col-lg-9">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="iraky-card p-4"
                style={{ marginBottom: 16, scrollMarginTop: 90 }}>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <span style={{
                    width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                    backgroundColor: "var(--iraky-gold-soft)", border: "1px solid var(--iraky-gold-line)",
                    color: "var(--iraky-gold)", fontFamily: "var(--f-mono)", fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{String(i + 1).padStart(2, "0")}</span>
                  <h2 style={{ fontFamily: "var(--f-display)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: 19, margin: 0 }}>
                    {s.titre}
                  </h2>
                </div>
                <div className="legal-body">{s.contenu}</div>
              </section>
            ))}

            <div style={{ textAlign: "center", marginTop: 28 }}>
              <Link to={autre.to} className="iraky-btn-ghost"
                style={{ padding: "10px 22px", fontSize: 13.5, textDecoration: "none" }}>
                {autre.label} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
