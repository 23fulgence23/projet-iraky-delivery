import { useEffect } from "react";

// Ajuste la hauteur du cadre de messagerie pour qu'il tienne dans l'ecran,
// sans defilement de la page autour (ordinateur uniquement)
export default function AjusteHauteur({ selecteur = ".msg-layout", marge = 34, minimum = 300 }) {
  useEffect(() => {
    const ajuster = () => {
      const el = document.querySelector(selecteur);
      if (!el) return;
      if (window.innerWidth < 768) { el.style.height = ""; return; }
      const haut = el.getBoundingClientRect().top + (window.pageYOffset || 0);
      el.style.height = Math.max(minimum, Math.floor(window.innerHeight - haut - marge)) + "px";
    };
    ajuster();
    const t1 = setTimeout(ajuster, 150);
    const t2 = setTimeout(ajuster, 600);
    const iv = setInterval(ajuster, 1000);
    window.addEventListener("resize", ajuster);
    window.addEventListener("orientationchange", ajuster);
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearInterval(iv);
      window.removeEventListener("resize", ajuster);
      window.removeEventListener("orientationchange", ajuster);
    };
  }, [selecteur, marge, minimum]);
  return null;
}
