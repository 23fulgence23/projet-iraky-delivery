import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://iraky-delivery.vercel.app";
const MARQUE = "IRAKY Delivery";

const PUBLIC = {
  "/": "IRAKY Delivery — Coursier et livraison à Toliara",
  "/connexion": "Se connecter | " + MARQUE,
  "/inscription": "Créer un compte | " + MARQUE,
  "/confidentialite": "Politique de confidentialité | " + MARQUE,
  "/conditions": "Conditions d'utilisation | " + MARQUE,
};
const PRIVE = {
  "/dashboard-admin": "Espace administrateur | " + MARQUE,
  "/dashboard-client": "Espace client | " + MARQUE,
  "/dashboard-coursier": "Espace coursier | " + MARQUE,
  "/oubli-mot-de-passe": "Mot de passe oublié | " + MARQUE,
};

function meta(nom) {
  let m = document.head.querySelector('meta[name="' + nom + '"]');
  if (!m) { m = document.createElement("meta"); m.setAttribute("name", nom); document.head.appendChild(m); }
  return m;
}

export default function SeoRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    const chemin = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
    const prive = chemin in PRIVE;
    document.title = PUBLIC[chemin] || PRIVE[chemin] || MARQUE;
    meta("robots").setAttribute("content", prive ? "noindex, nofollow" : "index, follow");
    let c = document.head.querySelector('link[rel="canonical"]');
    if (!c) { c = document.createElement("link"); c.setAttribute("rel", "canonical"); document.head.appendChild(c); }
    c.setAttribute("href", SITE + (chemin === "/" ? "/" : chemin));
  }, [pathname]);
  return null;
}
