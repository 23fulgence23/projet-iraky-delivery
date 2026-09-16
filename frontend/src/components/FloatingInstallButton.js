import { useState, useEffect } from "react";
import { MdPhoneAndroid, MdFileDownload } from "react-icons/md";

// Bouton d'installation PWA flottant.
// Fixe en bas a droite de l'ecran, reste visible pendant le defilement.
// Capte l'evenement natif Chrome "beforeinstallprompt" pour proposer
// l'installation directement, sans passer par le menu du navigateur.
// Disparait automatiquement si l'app est deja installee, ou si le
// navigateur ne propose pas l'installation (ex: Safari iOS).
export default function FloatingInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
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
    setDeferredPrompt(null);
  };

  if (isInstalled || !deferredPrompt) return null;

  return (
    <button
      onClick={handleInstallClick}
      aria-label="Installer l'application IRAKY Delivery"
      title="Installer l'application"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        backgroundColor: "#FFD700",
        border: "none",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 0.2s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      <MdPhoneAndroid style={{ color: "#000", fontSize: "26px" }} />
      <span
        style={{
          position: "absolute",
          bottom: "-2px",
          right: "-2px",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          backgroundColor: "#0a0a1e",
          border: "2px solid #FFD700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MdFileDownload style={{ color: "#FFD700", fontSize: "13px" }} />
      </span>
    </button>
  );
}
