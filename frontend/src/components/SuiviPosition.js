import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { MdMyLocation, MdLocationOff } from "react-icons/md";

const INTERVALLE = 20000; // envoi de la position toutes les 20 s

export default function SuiviPosition({ apiUrl, role }) {
  const { t } = useTranslation();
  const obligatoire = role === "coursier";
  const [consentement, setConsentement] = useState(undefined); // undefined = chargement, null = jamais demande
  const [permission, setPermission] = useState("attente");      // attente | accordee | refusee | indisponible
  const [essai, setEssai] = useState(0);
  const derniere = useRef(null);
  const dernierEnvoi = useRef(0);

  const entetes = () => ({
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  });

  // 1. Etat du consentement (enregistre cote serveur, par compte)
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    fetch(`${apiUrl}/api/position/etat`, { headers: entetes() })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setConsentement(d.consentement); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actif = obligatoire || consentement === true;

  const envoyer = useCallback(() => {
    const p = derniere.current;
    if (!p || !localStorage.getItem("token")) return;
    dernierEnvoi.current = Date.now();
    fetch(`${apiUrl}/api/position`, {
      method: "POST", headers: entetes(),
      body: JSON.stringify({ latitude: p.lat, longitude: p.lng, precision: p.precision }),
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  // 2. Suivi de la position : uniquement connecte, et si l'utilisateur a autorise
  useEffect(() => {
    if (!actif || !localStorage.getItem("token")) return undefined;
    if (!navigator.geolocation) { setPermission("indisponible"); return undefined; }

    const succes = (pos) => {
      derniere.current = {
        lat: pos.coords.latitude, lng: pos.coords.longitude,
        precision: Math.round(pos.coords.accuracy || 0),
      };
      setPermission("accordee");
      if (Date.now() - dernierEnvoi.current >= INTERVALLE) envoyer();
    };
    const echec = (err) => {
      if (err && err.code === 1) setPermission("refusee");
      else if (err && err.code === 2 && !derniere.current) setPermission("indisponible");
    };
    const options = { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 };

    const id = navigator.geolocation.watchPosition(succes, echec, options);
    const cycle = setInterval(envoyer, INTERVALLE);
    // A chaque retour dans l'application : position fraiche et envoi immediat
    const retour = () => {
      if (document.visibilityState === "visible") {
        navigator.geolocation.getCurrentPosition((p) => { succes(p); envoyer(); }, echec, options);
      }
    };
    document.addEventListener("visibilitychange", retour);

    return () => {
      navigator.geolocation.clearWatch(id);
      clearInterval(cycle);
      document.removeEventListener("visibilitychange", retour);
    };
  }, [actif, essai, envoyer]);

  // 3. Si l'utilisateur autorise la localisation dans le navigateur apres un refus
  useEffect(() => {
    if (!navigator.permissions || !navigator.permissions.query) return undefined;
    let statut = null;
    navigator.permissions.query({ name: "geolocation" }).then((s) => {
      statut = s;
      s.onchange = () => { if (s.state === "granted") { setPermission("attente"); setEssai((n) => n + 1); } };
    }).catch(() => {});
    return () => { if (statut) statut.onchange = null; };
  }, []);

  const repondre = (accepte) => {
    fetch(`${apiUrl}/api/position/consentement`, {
      method: "POST", headers: entetes(), body: JSON.stringify({ accepte }),
    }).then((r) => {
      if (r.ok) {
        if (!accepte) derniere.current = null;
        setConsentement(accepte);
      }
    }).catch(() => {});
  };

  const arreter = () => {
    if (window.confirm(t("Arrêter le partage de votre position ?"))) repondre(false);
  };

  const bloque = obligatoire && (permission === "refusee" || permission === "indisponible");
  const demandeConsentement = !obligatoire && consentement === null;

  const bouton = {
    padding: 12, borderRadius: 12, border: "none", fontWeight: 800, fontSize: 14, cursor: "pointer",
    background: "linear-gradient(135deg,#FFD700,#ff9500)", color: "#000",
  };

  const puce = (couleur, contenu, onClick) => (
    <div onClick={onClick} style={{ position: "fixed", left: 12, bottom: 12, zIndex: 700, display: "flex",
      alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 20, fontSize: 11, fontWeight: 700,
      backgroundColor: "var(--d-card, #131330)", color: couleur, border: `1px solid ${couleur}66`,
      cursor: onClick ? "pointer" : "default", boxShadow: "0 4px 14px rgba(0,0,0,0.4)" }}>
      {contenu}
    </div>
  );

  return (
    <>
      {demandeConsentement && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 2500, backgroundColor: "rgba(0,0,0,0.78)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ backgroundColor: "var(--d-card, #131330)", color: "var(--d-text, #fff)", borderRadius: 16,
            border: "1px solid var(--d-border, #FFD70025)", padding: 22, width: "100%", maxWidth: 420,
            boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--d-gold, #FFD700)", fontWeight: 800, fontSize: 17, marginBottom: 10 }}>
              <MdMyLocation style={{ fontSize: 24 }} /> {t("Autoriser la localisation ?")}
            </div>
            <p style={{ color: "#aaa", fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
              {t("IRAKY Delivery souhaite connaître votre position tant que vous êtes connecté, pour faciliter les courses et la sécurité. Elle n'est visible que par l'administrateur et vous pouvez l'arrêter à tout moment.")}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" onClick={() => repondre(false)}
                style={{ ...bouton, flex: 1, background: "transparent", color: "#aaa", border: "1px solid #ffffff30", fontWeight: 700 }}>
                {t("Refuser")}
              </button>
              <button type="button" onClick={() => repondre(true)} style={{ ...bouton, flex: 2 }}>{t("Autoriser")}</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {bloque && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 3000, backgroundColor: "rgba(5,5,20,0.97)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ maxWidth: 420, textAlign: "center", color: "var(--d-text, #fff)" }}>
            <MdLocationOff style={{ fontSize: 56, color: "#ef4444" }} />
            <h4 style={{ color: "var(--d-gold, #FFD700)", fontWeight: 800, margin: "10px 0" }}>{t("Localisation obligatoire")}</h4>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.6 }}>
              {permission === "indisponible"
                ? t("Localisation indisponible sur cet appareil.")
                : t("La localisation est obligatoire pour les coursiers. Autorisez-la dans votre navigateur, puis cliquez sur Réessayer.")}
            </p>
            <button type="button" style={{ ...bouton, width: "100%", marginTop: 12 }}
              onClick={() => { setPermission("attente"); setEssai((n) => n + 1); }}>{t("Réessayer")}</button>
          </div>
        </div>,
        document.body
      )}

      {!bloque && actif && permission === "accordee" && createPortal(
        obligatoire
          ? puce("#10b981", <><MdMyLocation style={{ fontSize: 14 }} /> {t("Localisation active")}</>)
          : puce("#10b981", <><MdMyLocation style={{ fontSize: 14 }} /> {t("Position partagée")}</>, arreter),
        document.body
      )}

      {!obligatoire && consentement === false && createPortal(
        puce("#9ca3af", <><MdLocationOff style={{ fontSize: 14 }} /> {t("Partager ma position")}</>, () => repondre(true)),
        document.body
      )}
    </>
  );
}
