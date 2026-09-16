// Ce fichier optionnel est basé sur le template officiel de
// Create React App pour l'enregistrement du service worker (PWA).
// https://github.com/facebook/create-react-app/blob/main/packages/cra-template/template/src/serviceWorkerRegistration.js

// Ce code enregistre un service worker pour rendre l'app
// disponible hors-ligne et plus rapide lors des visites suivantes.
// Par défaut, un nouveau service worker n'active un nouveau contenu
// qu'après la fermeture de tous les onglets ouverts (voir le point
// "Understanding the Cache and Update Cycle" dans la doc CRA).

const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Le service worker ne fonctionnera pas si PUBLIC_URL est sur une
      // origine différente de celle où la page est servie (ex: CDN).
      return;
    }

    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Vérifie que le service worker existe bien ou non en local.
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log(
            "Cette app est servie via un cache-first service worker en local dev."
          );
        });
      } else {
        // Pas en localhost : enregistre directement le service worker.
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === "installed") {
            if (navigator.serviceWorker.controller) {
              // Le nouveau contenu a été mis en cache.
              console.log(
                "Nouveau contenu disponible ; il sera utilisé une fois tous les onglets IRAKY Delivery fermés."
              );
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Tout le contenu a été précaché pour un usage hors-ligne.
              console.log("Contenu mis en cache pour un usage hors-ligne.");
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error(
        "Erreur lors de l'enregistrement du service worker :",
        error
      );
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { "Service-Worker": "script" },
  })
    .then((response) => {
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "Pas de connexion internet detectee. L'app fonctionne en mode hors-ligne."
      );
    });
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
