// Formate une valeur datetime (ISO renvoyée par l'API) au fuseau de Madagascar.
// Accepte aussi l'ancien format "HH:MM" pour les anciennes commandes.
export function formatDateHeure(v) {
  if (!v) return "—";
  const s = String(v);
  if (/^\d{2}:\d{2}/.test(s) && !s.includes("-")) return s.slice(0, 5);
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleString("fr-FR", {
    timeZone: "Indian/Antananarivo",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
