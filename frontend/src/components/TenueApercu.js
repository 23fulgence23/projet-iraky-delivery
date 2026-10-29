import logoIraky from "../logo.png";
import logoRaiky from "../images/raiky.png";

const TISSU = "#101030";
const OR = "#FFD700";
const police = { fontFamily: "'Space Grotesk','Segoe UI',sans-serif", fontWeight: 800 };

export default function TenueApercu({ article = "tshirt", face = "devant", largeur = 280 }) {
  const gilet = article === "gilet";
  const devant = face === "devant";

  let forme;
  if (gilet) {
    forme = devant
      ? "M95 22 L78 62 L68 112 L72 300 L228 300 L232 112 L222 62 L205 22 L172 22 L150 92 L128 22 Z"
      : "M95 22 L78 62 L68 112 L72 300 L228 300 L232 112 L222 62 L205 22 Q150 40 95 22 Z";
  } else {
    forme = devant
      ? "M90 22 L18 62 L44 112 L80 97 L80 300 L220 300 L220 97 L256 112 L282 62 L210 22 Q150 64 90 22 Z"
      : "M90 22 L18 62 L44 112 L80 97 L80 300 L220 300 L220 97 L256 112 L282 62 L210 22 Q150 42 90 22 Z";
  }
  const id = "clip-" + article + "-" + face;
  const cy = devant ? (gilet ? 134 : 92) : 74;
  const cx = devant ? (gilet ? 112 : 122) : 150;

  return (
    <svg viewBox="0 0 300 320" width={largeur} height={(largeur * 320) / 300} role="img"
      aria-label={(gilet ? "Gilet" : "T-shirt") + " IRAKY Delivery"} style={{ maxWidth: "100%" }}>
      <defs>
        <clipPath id={id}><circle cx={cx} cy={cy} r="22" /></clipPath>
      </defs>

      <path d={forme} fill={TISSU} stroke={OR} strokeOpacity="0.45" strokeWidth="2" strokeLinejoin="round" />

      {!gilet && <path d={devant ? "M90 22 Q150 64 210 22" : "M90 22 Q150 42 210 22"} fill="none" stroke={OR} strokeWidth="3" />}
      {gilet && devant && <path d="M150 92 L150 300" stroke={OR} strokeOpacity="0.6" strokeWidth="2" strokeDasharray="5 4" />}
      {gilet && (
        <>
          <rect x="71" y="262" width="158" height="11" fill={OR} opacity="0.9" />
          <rect x="71" y="282" width="158" height="11" fill={OR} opacity="0.9" />
        </>
      )}

      <image href={logoIraky} x={cx - 22} y={cy - 22} width="44" height="44" clipPath={"url(#" + id + ")"} preserveAspectRatio="xMidYMid slice" />

      {devant ? (
        <>
          <image href={logoRaiky} x={gilet ? 162 : 160} y={cy - 12} width="56" height="26" preserveAspectRatio="xMidYMid meet" />
          {!gilet && <text x="150" y="165" textAnchor="middle" fill={OR} fontSize="14" textLength="110" lengthAdjust="spacingAndGlyphs" style={police}>COURSIER</text>}
        </>
      ) : (
        <>
          <text x="150" y="140" textAnchor="middle" fill={OR} fontSize="28" textLength="130" lengthAdjust="spacingAndGlyphs" style={police}>COURSIER</text>
          <text x="150" y="168" textAnchor="middle" fill="#ffffff" fontSize="16" textLength="130" lengthAdjust="spacingAndGlyphs" style={police}>IRAKY DELIVERY</text>
          <image href={logoRaiky} x="120" y="205" width="60" height="30" preserveAspectRatio="xMidYMid meet" />
        </>
      )}
    </svg>
  );
}
