import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const CENTRE = [-23.3516, 43.6858]; // Toliara
const cache = {};
let dernierAppel = 0;

async function geocoder(texte) {
  const q = String(texte || "").trim();
  if (!q) return null;
  if (cache[q] !== undefined) return cache[q];
  const attente = 1100 - (Date.now() - dernierAppel);
  if (attente > 0) await new Promise((r) => setTimeout(r, attente));
  dernierAppel = Date.now();
  try {
    const url = "https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=mg&q=" + encodeURIComponent(q);
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    const d = r.ok ? await r.json() : [];
    cache[q] = Array.isArray(d) && d[0] ? [parseFloat(d[0].lat), parseFloat(d[0].lon)] : null;
  } catch {
    cache[q] = null;
  }
  return cache[q];
}

function distanceKm(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b[0] - a[0]), dLon = rad(b[1] - a[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function CarteTrajet({ pickup, client, coursier, positions }) {
  const { t } = useTranslation();
  const conteneur = useRef(null);
  const [etat, setEtat] = useState({ fini: false, distance: null, messages: [] });

  const cle = JSON.stringify([
    pickup,
    client && [client.latitude, client.longitude, client.adresse],
    coursier && [coursier.latitude, coursier.longitude, coursier.position_latitude, coursier.position_longitude],
    positions ? positions.length : 0,
  ]);

  useEffect(() => {
    let annule = false;
    const carte = L.map(conteneur.current, { scrollWheelZoom: false }).setView(CENTRE, 12);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "&copy; OpenStreetMap",
    }).addTo(carte);
    setTimeout(() => { if (!annule) carte.invalidateSize(); }, 250);

    const bornes = [];
    const marqueur = (latlng, couleur, libelle) => {
      L.circleMarker(latlng, { radius: 9, color: "#ffffff", weight: 2, fillColor: couleur, fillOpacity: 1 })
        .addTo(carte).bindTooltip(libelle);
      bornes.push(latlng);
    };

    (async () => {
      const messages = [];
      let distance = null;

      let ptPickup = null;
      if (pickup && pickup.trim()) {
        ptPickup = await geocoder(pickup + ", Toliara, Madagascar");
        if (annule) return;
        if (!ptPickup) messages.push("Adresse de prise en charge introuvable sur la carte.");
      }

      let ptClient = null;
      if (client && client.latitude != null && client.longitude != null) ptClient = [client.latitude, client.longitude];
      else if (client && client.adresse) {
        ptClient = await geocoder(client.adresse + ", Toliara, Madagascar");
        if (annule) return;
      }
      if (!ptClient) messages.push("Position du client indisponible.");

      if (ptPickup) marqueur(ptPickup, "#f59e0b", t("Prise en charge"));
      if (ptClient) marqueur(ptClient, "#3b82f6", t("Client"));
      if (coursier && coursier.position_latitude != null && coursier.position_longitude != null) {
        marqueur([coursier.position_latitude, coursier.position_longitude], "#10b981", t("Dernière position connue du coursier"));
      } else if (coursier && coursier.latitude != null && coursier.longitude != null) {
        marqueur([coursier.latitude, coursier.longitude], "#9ca3af", t("Position enregistrée du coursier"));
      }

      if (ptPickup && ptClient) {
        let tracé = false;
        try {
          const u = "https://router.project-osrm.org/route/v1/driving/" +
            ptPickup[1] + "," + ptPickup[0] + ";" + ptClient[1] + "," + ptClient[0] + "?overview=full&geometries=geojson";
          const r = await fetch(u);
          const d = r.ok ? await r.json() : null;
          if (annule) return;
          if (d && d.routes && d.routes[0]) {
            const coords = d.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
            L.polyline(coords, { color: "#8b5cf6", weight: 5, opacity: 0.85 }).addTo(carte);
            distance = d.routes[0].distance / 1000;
            tracé = true;
          }
        } catch { /* repli ci-dessous */ }
        if (!tracé) {
          L.polyline([ptPickup, ptClient], { color: "#8b5cf6", weight: 4, dashArray: "8 8" }).addTo(carte);
          distance = distanceKm(ptPickup, ptClient);
        }
      }

      if (positions && positions.length > 1) {
        L.polyline(positions.map((p) => [p.lat, p.lng]), { color: "#10b981", weight: 4 }).addTo(carte);
        positions.forEach((p) => bornes.push([p.lat, p.lng]));
      }

      if (bornes.length > 1) carte.fitBounds(bornes, { padding: [30, 30], maxZoom: 16 });
      else if (bornes.length === 1) carte.setView(bornes[0], 15);
      else messages.push("Aucune donnée de localisation exploitable pour cette course.");

      if (!annule) setEtat({ fini: true, distance, messages });
    })();

    return () => { annule = true; carte.remove(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle]);

  const point = (couleur) => (
    <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", backgroundColor: couleur, marginRight: 5 }} />
  );

  return (
    <div>
      <div ref={conteneur} style={{ height: 320, borderRadius: 12, overflow: "hidden",
        border: "1px solid var(--d-border, #FFD70025)" }} />
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 8, fontSize: 12, color: "#888" }}>
        <span>{point("#f59e0b")}{t("Prise en charge")}</span>
        <span>{point("#3b82f6")}{t("Client")}</span>
        <span>{point("#10b981")}{t("Dernière position connue du coursier")}</span>
        <span>{point("#9ca3af")}{t("Position enregistrée du coursier")}</span>
        {positions && positions.length > 1 && <span>{point("#10b981")}{t("Trajet parcouru par le coursier")}</span>}
      </div>
      {!etat.fini && <div style={{ marginTop: 6, fontSize: 12, color: "#888" }}>{t("Chargement de la carte...")}</div>}
      {etat.distance != null && (
        <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: "var(--d-gold, #FFD700)" }}>
          {t("Distance estimée : {{km}} km", { km: etat.distance.toFixed(1) })}
        </div>
      )}
      {etat.messages.map((m) => <div key={m} style={{ marginTop: 4, fontSize: 12, color: "#f59e0b" }}>{t(m)}</div>)}
    </div>
  );
}
