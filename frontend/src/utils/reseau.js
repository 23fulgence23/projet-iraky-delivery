// Reseau : pause quand l'onglet est cache, fusion des lectures identiques, un nouvel essai sur erreur serveur
if (typeof window !== "undefined" && !window.__irakyReseau) {
  window.__irakyReseau = true;

  const si = window.setInterval.bind(window);
  window.setInterval = (fn, ms, ...args) =>
    si(typeof fn === "function" ? (...a) => { if (!document.hidden) fn(...a); } : fn, ms, ...args);

  const f = window.fetch.bind(window);
  const enVol = new Map();
  const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

  window.fetch = async (input, init) => {
    const methode = String((init && init.method) || "GET").toUpperCase();
    if (methode !== "GET" || typeof input !== "string" || (init && init.signal)) return f(input, init);

    const h = (init && init.headers) || {};
    const cle = input + "|" + (h.Authorization || h.authorization || "");
    if (!enVol.has(cle)) {
      const p = (async () => {
        let r;
        try { r = await f(input, init); } catch (e) { await attendre(1500); r = await f(input, init); }
        if ([502, 503, 504].includes(r.status)) { await attendre(1500); r = await f(input, init); }
        return r;
      })().finally(() => enVol.delete(cle));
      enVol.set(cle, p);
    }
    return (await enVol.get(cle)).clone();
  };
}
