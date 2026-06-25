import { MdStar, MdStarBorder, MdMilitaryTech } from "react-icons/md";

// affichage trophées + étoiles restantes (système cumulatif)
function EtoilesAvecTrophees({ trophees = 0, etoilesActuelles = 0, size = 18 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      {trophees > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <MdMilitaryTech style={{ color: "#FFD700", fontSize: size + 4 }} />
          <span style={{ color: "#FFD700", fontWeight: 800, fontSize: size - 2 }}>
            ×{trophees}
          </span>
        </div>
      )}
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) =>
          i <= etoilesActuelles ? (
            <MdStar key={i} style={{ color: "#FFD700", fontSize: size }} />
          ) : (
            <MdStarBorder key={i} style={{ color: "#444", fontSize: size }} />
          )
        )}
      </div>
    </div>
  );
}

export default EtoilesAvecTrophees;