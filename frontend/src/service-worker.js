/* eslint-disable no-restricted-globals */

// Ce service worker est base sur le template officiel de Create React App
// avec Workbox : https://github.com/facebook/create-react-app/blob/main/packages/cra-template/template/src/service-worker.js

import { clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute, createHandlerBoundToURL } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate, CacheFirst } from "workbox-strategies";

clientsClaim();

// self.__WB_MANIFEST est injecte automatiquement au build par
// react-scripts (CRA) : il contient la liste des fichiers a precacher.
precacheAndRoute(self.__WB_MANIFEST);

// Route App Shell pour une SPA : toute navigation qui n'est pas un fichier
// (ex: /admin, /connexion) renvoie index.html, sauf les appels API.
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");
registerRoute(
  ({ request, url }) => {
    if (request.mode !== "navigate") {
      return false;
    }
    if (url.pathname.startsWith("/_")) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + "/index.html")
);

// Cache les images (icones, logos) avec une strategie CacheFirst.
registerRoute(
  ({ url }) => url.origin === self.location.origin && url.pathname.match(/\.(?:png|jpg|jpeg|svg|gif|ico)$/),
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// Cache les polices/CDN externes (MDB, Font Awesome) avec StaleWhileRevalidate.
registerRoute(
  ({ url }) => url.origin === "https://cdnjs.cloudflare.com",
  new StaleWhileRevalidate({
    cacheName: "cdn-assets",
  })
);

// N'intercepte jamais les appels vers l'API backend (Render) : ils doivent
// toujours passer par le reseau, jamais servis depuis un cache obsolete.
registerRoute(
  ({ url }) => url.hostname.endsWith("onrender.com"),
  new (class {
    handle({ request }) {
      return fetch(request);
    }
  })()
);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
