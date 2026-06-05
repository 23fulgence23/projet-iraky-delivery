function Footer() {
  return (
    <footer style={{ backgroundColor: "#0d0d25", borderTop: "1px solid #FFD70033", padding: "40px 0" }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-4 text-center text-md-start mb-3 mb-md-0">
            <span style={{ color: "#FFD700", fontWeight: "bold", fontSize: "18px" }}>
              🛵 IRAKY Delivery
            </span>
          </div>
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <small style={{ color: "#aaaaaa" }}>
              © 2026 IRAKY Delivery — Toliara, Madagascar
            </small>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <small style={{ color: "#aaaaaa" }}>
              <i className="fas fa-phone me-2" style={{ color: "#FFD700" }}></i>
              +261 38 21 266 83
            </small>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;