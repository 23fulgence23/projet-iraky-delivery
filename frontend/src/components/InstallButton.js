import { useState, useEffect } from "react";

// Bouton d'installation PWA personnalise.
// Capte l'evenement natif Chrome "beforeinstallprompt" pour proposer
// l'installation directement, sans passer par le menu du navigateur.
// Ne s'affiche que si :
//  - le navigateur supporte l'installation (Chrome/Edge Android, desktop)
//  - l'app n'est pas deja installee
// Sur iOS/Safari, cet evenement n'existe pas : le bouton reste invisible
// (Safari impose son propre flux "Partager > Sur l'ecran d'accueil").
export default function InstallButton({ style, className, children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Deja installee ? (mode standalone actif)
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    // Que le choix soit "accepted" ou "dismissed", le prompt ne peut
    // servir qu'une fois : on le vide.
    setDeferredPrompt(null);
  };

  // Rien a afficher si deja installee ou si le navigateur ne propose pas
  // l'installation (pas encore de signal beforeinstallprompt recu).
  if (isInstalled || !deferredPrompt) return null;

  return (
    <button
      onClick={handleInstallClick}
      className={className}
      style={{
        backgroundColor: "#FFD700",
        color: "#000",
        border: "none",
        borderRadius: 10,
        padding: "10px 18px",
        fontWeight: 800,
        fontSize: 13,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: 8,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      📲 {children || "Installer l'application"}
    </button>
  );
}
