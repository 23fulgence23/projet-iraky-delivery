import { useState, useEffect, useCallback } from "react";

const API = "https://projet-iraky-delivery.onrender.com/api";
const KEY = "iraky-abonne-id";
const EVENT = "iraky-abonnes-update";

function lireId() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

function nouvelId() {
  if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
}

export default function useAbonnes() {
  const [stats, setStats] = useState(null);
  const [abonne, setAbonne] = useState(() => !!lireId());
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState(false);

  const charger = useCallback(async () => {
    try {
      const r = await fetch(API + "/stats-abonnes", { headers: { Accept: "application/json" } });
      if (r.ok) setStats(await r.json());
    } catch {}
  }, []);

  useEffect(() => {
    charger();
    const h = (e) => {
      if (e.detail) setStats(e.detail);
      setAbonne(!!lireId());
    };
    window.addEventListener(EVENT, h);
    return () => window.removeEventListener(EVENT, h);
  }, [charger]);

  // Retourne true si l'abonnement a reussi
  const sabonner = useCallback(async () => {
    if (envoi || lireId()) return false;
    const id = nouvelId();
    setEnvoi(true);
    setErreur(false);
    // Le compteur monte tout de suite
    setStats((s) => (s ? { ...s, total: s.total + 1, visiteurs: s.visiteurs + 1, nouveaux_mois: s.nouveaux_mois + 1 } : s));
    try {
      const r = await fetch(API + "/abonnes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ device_id: id }),
      });
      if (!r.ok) throw new Error("echec");
      const data = await r.json();
      try { localStorage.setItem(KEY, id); } catch {}
      setAbonne(true);
      window.dispatchEvent(new CustomEvent(EVENT, { detail: data }));
      return true;
    } catch {
      setErreur(true);
      charger(); // annule l'augmentation affichee
      return false;
    } finally {
      setEnvoi(false);
    }
  }, [envoi, charger]);

  return { stats, abonne, envoi, erreur, sabonner };
}
