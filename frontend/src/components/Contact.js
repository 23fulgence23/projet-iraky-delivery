import { useState, useEffect, useRef } from "react";
import "../Theme.css";
import "../App.css";

function Contact() {
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [envoye, setEnvoye] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const inputStyle = {
    backgroundColor: "var(--iraky-input-bg)",
    border: "1px solid var(--iraky-gold-line)",
    color: "var(--iraky-ink)",
    borderRadius: "10px",
    fontFamily: "var(--f-body)",
    fontSize: "14px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const onFocus = (e) => { e.target.style.borderColor = "var(--iraky-gold)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,215,0,0.12)"; };
  const onBlur = (e) => { e.target.style.borderColor = "var(--iraky-gold-line)"; e.target.style.boxShadow = "none"; };

  const envoyer = (e) => {
    e.preventDefault();
    const sujet = encodeURIComponent(form.sujet || "Contact depuis le site IRAKY Delivery");
    const corps = encodeURIComponent(
      `Nom : ${form.nom}\nEmail : ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:irakydelivery@gmail.com?subject=${sujet}&body=${corps}`;
    setEnvoye(true);
    setTimeout(() => setEnvoye(false), 4000);
  };

  const infos = [
    { icon: "fas fa-phone", label: "Téléphone", value: "+261 38 21 266 83" },
    { icon: "fas fa-envelope", label: "Email", value: "irakydelivery@gmail.com" },
    { icon: "fas fa-map-marker-alt", label: "Adresse", value: "Enceinte Score BazarBe, Toliara" },
  ];

  return (
    <section id="contact" ref={ref} style={{ backgroundColor: "var(--iraky-deep)", padding: "110px 0" }}>
      <div className="container">

        <div className="text-center mb-5 mx-auto" style={{
          maxWidth: "520px",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.7s ease",
        }}>
          <span className="iraky-eyebrow justify-content-center mb-3">Une question ?</span>
          <h2 className="iraky-h2" style={{ fontSize: "clamp(28px,4vw,40px)", marginTop: "14px" }}>
            Contactez-nous
          </h2>
          <p style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "16px", marginTop: "10px" }}>
            Nous sommes disponibles pour vous aider.
          </p>
        </div>

        <div className="row g-5 align-items-start">

          {/* Infos gauche */}
          <div className="col-lg-5" style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-28px)",
            transition: "all 0.7s ease",
          }}>
            {infos.map((info, index) => (
              <div key={index} className="iraky-card d-flex align-items-center gap-4 mb-3 p-3">
                <div style={{
                  width: "48px", height: "48px", borderRadius: "13px", backgroundColor: "var(--iraky-gold-soft)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <i className={info.icon} style={{ color: "var(--iraky-gold)", fontSize: "18px" }}></i>
                </div>
                <div>
                  <small style={{ fontFamily: "var(--f-mono)", color: "var(--iraky-muted-dim)", fontSize: "10.5px", letterSpacing: "1px" }}>
                    {info.label.toUpperCase()}
                  </small>
                  <p className="mb-0" style={{ fontFamily: "var(--f-body)", fontWeight: 700, color: "var(--iraky-ink)", fontSize: "14.5px" }}>
                    {info.value}
                  </p>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: "24px", padding: "16px 18px", borderRadius: "14px",
              backgroundColor: "var(--iraky-route-soft)", border: "1px solid rgba(52,211,153,0.2)",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <i className="fas fa-clock" style={{ color: "var(--iraky-route)" }}></i>
              <span style={{ fontFamily: "var(--f-body)", color: "var(--iraky-ink)", fontSize: "13px" }}>
                Réponse habituelle sous <strong>5 minutes</strong> via le chat du site.
              </span>
            </div>
          </div>

          {/* Formulaire droite */}
          <div className="col-lg-7" style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(28px)",
            transition: "all 0.7s ease 0.15s",
          }}>
            <form onSubmit={envoyer} className="iraky-card p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13px" }}>Nom</label>
                  <input type="text" className="form-control mt-1" placeholder="Votre nom" required
                    value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                    onFocus={onFocus} onBlur={onBlur} style={inputStyle} />
                </div>
                <div className="col-md-6">
                  <label style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13px" }}>Email</label>
                  <input type="email" className="form-control mt-1" placeholder="Votre email" required
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={onFocus} onBlur={onBlur} style={inputStyle} />
                </div>
                <div className="col-12">
                  <label style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13px" }}>Sujet</label>
                  <input type="text" className="form-control mt-1" placeholder="Sujet de votre message"
                    value={form.sujet} onChange={e => setForm({ ...form, sujet: e.target.value })}
                    onFocus={onFocus} onBlur={onBlur} style={inputStyle} />
                </div>
                <div className="col-12">
                  <label style={{ fontFamily: "var(--f-body)", color: "var(--iraky-muted)", fontSize: "13px" }}>Message</label>
                  <textarea className="form-control mt-1" rows="4" placeholder="Votre message..." required
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    onFocus={onFocus} onBlur={onBlur} style={{ ...inputStyle, resize: "none" }} />
                </div>
                <div className="col-12">
                  <button type="submit" className="iraky-btn-gold w-100 py-2" style={{ fontSize: "15px" }}>
                    <i className="fas fa-paper-plane me-2"></i>
                    {envoye ? "Ouverture de votre messagerie..." : "Envoyer le message"}
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Contact;