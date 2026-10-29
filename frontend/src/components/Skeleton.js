import { useTranslation } from "react-i18next";

const carte = {
  backgroundColor: "var(--d-card, #131330)",
  border: "1px solid var(--d-border, #FFD70018)",
  borderRadius: 16, padding: 18, boxSizing: "border-box",
};

// Bloc de base : le reflet est defini dans la feuille de style (.sk)
export function Skeleton({ w = "100%", h = 14, r = 8, style }) {
  return (
    <span className="sk" aria-hidden="true"
      style={{ display: "block", width: w, height: h, borderRadius: r, flexShrink: 0, ...style }} />
  );
}

export function SkeletonCarte({ children, style }) {
  return <div style={{ ...carte, ...style }}>{children}</div>;
}

// Cartes de statistiques (icone + chiffre + libelle)
export function SkeletonStats({ n = 4 }) {
  return (
    <div className="sk-grille">
      {Array.from({ length: n }, (_, i) => (
        <SkeletonCarte key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Skeleton w={48} h={48} r={14} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 9 }}>
            <Skeleton w="45%" h={22} />
            <Skeleton w="75%" h={10} />
          </div>
        </SkeletonCarte>
      ))}
    </div>
  );
}

// Liste de lignes (avatar, deux lignes de texte, pastille a droite)
export function SkeletonListe({ n = 5, avatar = true }) {
  return (
    <div>
      {Array.from({ length: n }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0",
          borderBottom: i < n - 1 ? "1px solid var(--d-border, #ffffff0d)" : "none" }}>
          {avatar && <Skeleton w={42} h={42} r={21} />}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
            <Skeleton w={`${55 + ((i * 13) % 30)}%`} h={13} />
            <Skeleton w={`${30 + ((i * 17) % 25)}%`} h={10} />
          </div>
          <Skeleton w={64} h={24} r={12} />
        </div>
      ))}
    </div>
  );
}

// Cartes de commandes ou de missions
export function SkeletonCartes({ n = 4 }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <SkeletonCarte key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1, minWidth: 200 }}>
              <Skeleton w={40} h={40} r={20} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                <Skeleton w="50%" h={15} />
                <Skeleton w="75%" h={10} />
                <Skeleton w="40%" h={10} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
              <Skeleton w={88} h={24} r={12} />
              <Skeleton w={70} h={16} />
            </div>
          </div>
        </SkeletonCarte>
      ))}
    </>
  );
}

// Tableau (en-tete + lignes)
export function SkeletonTableau({ lignes = 6, colonnes = 5 }) {
  const largeurs = ["60%", "45%", "70%", "40%", "55%", "50%"];
  const grille = { display: "grid", gridTemplateColumns: `repeat(${colonnes}, minmax(0, 1fr))`, gap: 14, alignItems: "center" };
  return (
    <div>
      <div style={{ ...grille, padding: "6px 0 12px", borderBottom: "1px solid var(--d-border, #ffffff14)" }}>
        {Array.from({ length: colonnes }, (_, j) => <Skeleton key={j} w="55%" h={10} />)}
      </div>
      {Array.from({ length: lignes }, (_, i) => (
        <div key={i} style={{ ...grille, padding: "14px 0", borderBottom: "1px solid var(--d-border, #ffffff0a)" }}>
          {Array.from({ length: colonnes }, (_, j) => <Skeleton key={j} w={largeurs[(i + j) % largeurs.length]} h={13} />)}
        </div>
      ))}
    </div>
  );
}

// Histogramme
export function SkeletonGraphique({ h = 200 }) {
  const barres = [40, 65, 30, 80, 55, 70, 35, 90, 50, 60, 45, 85];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: h }}>
      {barres.map((p, i) => (
        <div key={i} style={{ flex: 1, height: `${p}%` }}><Skeleton w="100%" h="100%" r={6} /></div>
      ))}
    </div>
  );
}

const Titre = ({ largeur = 260 }) => (
  <div style={{ marginBottom: 24 }}>
    <Skeleton w={largeur} h={26} />
    <Skeleton w={largeur + 60} h={12} style={{ marginTop: 10 }} />
  </div>
);

const Barre = () => (
  <div style={{ display: "flex", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
    <Skeleton w="100%" h={42} r={12} style={{ flex: 1, minWidth: 200 }} />
    <Skeleton w={110} h={42} r={12} />
  </div>
);

// formes : accueil-admin | accueil | liste | tableau | discussion
export function SkeletonPage({ forme = "accueil", libelle }) {
  const { t } = useTranslation();
  let contenu;
  if (forme === "accueil-admin") {
    contenu = (
      <>
        <Titre />
        <SkeletonStats n={4} />
        <SkeletonStats n={4} />
        <div className="sk-deux">
          <SkeletonCarte>
            <Skeleton w={220} h={16} style={{ marginBottom: 18 }} />
            <SkeletonGraphique h={230} />
          </SkeletonCarte>
          <SkeletonCarte>
            <Skeleton w={160} h={16} style={{ marginBottom: 18 }} />
            <SkeletonListe n={2} />
          </SkeletonCarte>
        </div>
        <SkeletonCarte>
          <Skeleton w={200} h={16} style={{ marginBottom: 18 }} />
          <SkeletonTableau lignes={6} colonnes={5} />
        </SkeletonCarte>
      </>
    );
  } else if (forme === "accueil") {
    contenu = (
      <>
        <Titre largeur={220} />
        <SkeletonStats n={4} />
        <SkeletonCarte style={{ marginBottom: 20 }}>
          <Skeleton w={180} h={16} style={{ marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <Skeleton w={120} h={20} />
            <Skeleton w={60} h={22} />
            <Skeleton w={160} h={12} />
          </div>
        </SkeletonCarte>
        <SkeletonCarte>
          <Skeleton w={200} h={16} style={{ marginBottom: 14 }} />
          <SkeletonListe n={3} avatar={false} />
        </SkeletonCarte>
      </>
    );
  } else if (forme === "tableau") {
    contenu = (
      <>
        <Titre />
        <Barre />
        <SkeletonCarte><SkeletonTableau lignes={8} colonnes={5} /></SkeletonCarte>
      </>
    );
  } else if (forme === "discussion") {
    contenu = (
      <>
        <Titre largeur={200} />
        <div className="sk-support">
          <SkeletonCarte><SkeletonListe n={5} /></SkeletonCarte>
          <SkeletonCarte style={{ minHeight: 320, display: "flex", flexDirection: "column", gap: 14 }}>
            <Skeleton w="55%" h={38} r={14} />
            <Skeleton w="45%" h={38} r={14} style={{ alignSelf: "flex-end" }} />
            <Skeleton w="60%" h={38} r={14} />
          </SkeletonCarte>
        </div>
      </>
    );
  } else {
    contenu = (
      <>
        <Titre />
        <SkeletonCartes n={4} />
      </>
    );
  }
  return (
    <div role="status" aria-busy="true" aria-label={libelle || t("Chargement des données...")}>
      {contenu}
    </div>
  );
}

// Admin : la forme depend de l'onglet ouvert
export function SkeletonAdmin({ onglet }) {
  const tableaux = ["clients", "coursiers", "commandes", "historique", "paiements", "signalements"];
  const forme = onglet === "accueil" ? "accueil-admin"
    : onglet === "support" ? "discussion"
    : tableaux.includes(onglet) ? "tableau" : "liste";
  return <SkeletonPage forme={forme} />;
}

export default Skeleton;
