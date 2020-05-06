import { precacheAndRoute } from "workbox-precaching";
import * as googleAnalytics from "workbox-google-analytics";
import db from "db";
import releaseNotes from "releaseNotes";

const manifest = self.__WB_MANIFEST;

precacheAndRoute(
  manifest.concat([
    {
      url: "/",
      revision: manifest.find(({ url }) => url.startsWith("/packs/js/app-"))
        .revision,
    },
    {
      url:
        "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap",
      revision: "1",
    },
    { url: "/manifest.webmanifest", revision: "2" },
    {
      url: "https://unpkg.com/sakura.css@1.0.0/css/sakura.css",
      revision: null,
    },
    { url: "/about?iframe=1", revision: "1" },
    { url: "/help?iframe=1", revision: "2" },
  ])
);

googleAnalytics.initialize();

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key === "runtime" || key.startsWith("turnip-"))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => clients.claim())
  );
});

self.addEventListener("install", () => {
  db.then((db) => {
    new Promise((resolve) => {
      const settings = {};
      db
        .transaction("settings")
        .objectStore("settings")
        .openCursor().onsuccess = ({ target: { result: cursor } }) => {
        if (cursor) {
          settings[cursor.key] = cursor.value;
          cursor.continue();
        } else resolve(settings);
      };
    }).then(({ island, resident, timezone }) => {
      if (!island || !resident) return;
      fetch("/price_records/update_timezone", {
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
        body: JSON.stringify({
          island,
          resident,
          timezone:
            timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
    });
  });
});

self.addEventListener("message", ({ data, ports }) => {
  switch (data.type) {
    case "SKIP_WAITING":
      skipWaiting();
      break;
    case "REQUEST_RELEASE_NOTES":
      ports[0].postMessage(releaseNotes);
      break;
    default:
      break;
  }
});
