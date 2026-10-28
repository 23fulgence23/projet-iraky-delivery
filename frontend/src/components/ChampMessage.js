import { useLayoutEffect, useRef } from "react";

const tactile = () =>
  typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

// Zone de message : grandit avec le texte (6 lignes environ au maximum)
// Telephone : Entree = nouvelle ligne, le bouton envoie
// Ordinateur : Entree envoie, Maj + Entree = nouvelle ligne
export default function ChampMessage({ value, onEnvoyer, style, ...reste }) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const bordures = el.offsetHeight - el.clientHeight;
    el.style.height = Math.min(el.scrollHeight + bordures, 132) + "px";
  }, [value]);

  const touche = (e) => {
    if (e.key !== "Enter" || e.shiftKey || (e.nativeEvent && e.nativeEvent.isComposing)) return;
    if (tactile()) return;
    e.preventDefault();
    if (String(value || "").trim() && onEnvoyer) onEnvoyer();
  };

  return (
    <textarea ref={ref} rows={1} value={value} onKeyDown={touche}
      style={{ resize: "none", fontFamily: "inherit", lineHeight: 1.4, overflowY: "auto", ...style }}
      {...reste} />
  );
}
