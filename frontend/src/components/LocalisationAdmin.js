import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MdMyLocation } from "react-icons/md";

const COULEURS = { coursier: "#FFD700", client: "#3b82f6" };
const carte = { backgroundColor: "var(--d-card, #131330)", border: "1px solid var(--d-border, #FFD70025)", borderRadius: 14, padding: 14 };

export default function LocalisationAdmin({ apiUrl }) {
  const { t } = useTranslation();
  const [liste, setListe] = useState([]);
  const [filtre, setFiltre] = useState("");
  const [choisi, setChoisi] = useState(null);
  const [, setTic] = useState(0);
  const conteneur = useRef(null);
  const carteRef = useRef(null);
  const marqueurs = useRef({});
  const premier = useRef(true);

  // Carte (creee une seule fois)
  useEffect(() => {
    const m = L.map(conteneur.current).setView([-23.3516, 43.6858], 12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; OpenStreetMap" }).addTo(m);
    carteRef.current = m;
    const to = setTimeout(() => m.invalidateSize(), 250);
    return () => { clearTimeout(to); m.remove(); carteRef.current = null; marqueurs.current = {}; };
  }, []);

  // Rafraichissement toutes les 5 secondes
  useEffect(() => {
    const charger = () => {
      fetch(`${apiUrl}/api/admin/localisations`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Accept": "application/json" },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d && Array.isArray(d.utilisateurs)) { setListe(d.utilisateurs); setTic((n) => n + 1); } })
        .catch(() => {});
    };
    charger();
    const iv = setInterval(charger, 5000);
    return () => clearInterval(iv);
  }, [apiUrl]);

  const visibles = liste.filter((u) => !filtre || u.role === filtre);

  // Marqueurs : ajoutes, deplaces ou retires sans recreer la carte
  useEffect(() => {
    const m = carteRef.current;
    if (!m) return;
    const presents = new Set(visibles.map((u) => String(u.id)));
    Object.keys(marqueurs.current).forEach((id) => {
      if (!presents.has(id)) { marqueurs.current[id].remove(); delete marqueurs.current[id]; }
    });
    const bornes = [];
    visibles.forEach((u) => {
      const ll = [u.latitude, u.longitude];
      bornes.push(ll);
      let mk = marqueurs.current[u.id];
      if (!mk) {
        mk = L.circleMarker(ll, { radius: 10, color: "#ffffff", weight: 2, fillColor: COULEURS[u.role] || "#999999", fillOpacity: 1 }).addTo(m);
        mk.on("click", () => setChoisi(u.id));
        marqueurs.current[u.id] = mk;
      } else {
        mk.setLatLng(ll);
      }
      mk.unbindTooltip();
      mk.bindTooltip(`${u.prenom} ${u.nom}`);
    });
    if (premier.current && bornes.length > 0) {
      m.fitBounds(bornes, { padding: [40, 40], maxZoom: 16 });
      premier.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liste, filtre]);

  const aller = (u) => {
    setChoisi(u.id);
    const m = carteRef.current;
    if (m) {
      m.setView([u.latitude, u.longitude], 16);
      const mk = marqueurs.current[u.id];
      if (mk) mk.openTooltip();
    }
    if (conteneur.current) conteneur.current.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const depuis = (iso) => {
    const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
    return s < 60 ? t("il y a {{n}} s", { n: s }) : t("il y a {{n}} min", { n: Math.round(s / 60) });
  };

  const nbCoursiers = liste.filter((u) => u.role === "coursier").length;
  const nbClients = liste.filter((u) => u.role === "client").length;
  const filtres = [
    { code: "", label: t("Tous") + " (" + liste.length + ")" },
    { code: "coursier", label: t("Coursiers") + " (" + nbCoursiers + ")" },
    { code: "client", label: t("Clients") + " (" + nbClients + ")" },
  ];

  return (
    <div>
      <h4 style={{ color: "var(--d-gold, #FFD700)", marginBottom: 6, fontWeight: 800, fontSize: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#10b98118", border: "1px solid #10b98133",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MdMyLocation style={{ color: "#10b981", fontSize: 22 }} />
        </div>
        {t("Localisation")}
      </h4>
      <p style={{ color: "#888", marginBottom: 16, fontSize: 14 }}>
        {t("Utilisateurs connectés qui ont autorisé le partage de leur position (mise à jour toutes les 5 secondes)")}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {filtres.map((f) => (
          <button key={f.code} type="button" onClick={() => setFiltre(f.code)}
            style={{ border: "1px solid #FFD70055", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              backgroundColor: filtre === f.code ? "#FFD700" : "#FFD70018", color: filtre === f.code ? "#000" : "#FFD700" }}>
            {f.label}
          </button>
        ))}
      </div>

      <div ref={conteneur} style={{ height: 420, borderRadius: 14, overflow: "hidden", border: "1px solid var(--d-border, #FFD70025)", marginBottom: 14 }} />

      {visibles.length === 0 && (
        <div style={{ ...carte, color: "#888", textAlign: "center", fontSize: 13 }}>
          {t("Aucun utilisateur ne partage sa position pour le moment.")}
        </div>
      )}

      {visibles.map((u) => (
        <div key={u.id} onClick={() => aller(u)}
          style={{ ...carte, marginBottom: 10, cursor: "pointer", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
            borderLeft: `4px solid ${COULEURS[u.role] || "#999"}`, outline: choisi === u.id ? "2px solid #FFD70066" : "none" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ color: "var(--d-text, #fff)", fontWeight: 700, fontSize: 14 }}>{u.prenom} {u.nom}</div>
            <div style={{ color: "#888", fontSize: 12 }}>
              {u.role === "coursier" ? t("Coursier") : t("Client")} · {u.telephone || "—"}
            </div>
            {u.mission && (
              <div style={{ color: "#10b981", fontSize: 12, marginTop: 2 }}>
                {t("Mission #{{id}} — {{service}}", { id: u.mission.id, service: u.mission.service })}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#888" }}>
            <div style={{ color: "#10b981", fontWeight: 700 }}>{depuis(u.at)}</div>
            {u.precision != null && <div>{t("Précision : {{m}} m", { m: u.precision })}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
