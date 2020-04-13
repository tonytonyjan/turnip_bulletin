import { precacheAndRoute } from "workbox-precaching";
import { skipWaiting, clientsClaim } from "workbox-core";
import * as googleAnalytics from "workbox-google-analytics";

skipWaiting();
clientsClaim();

const manifest = self.__WB_MANIFEST;

precacheAndRoute(
  manifest.concat([
    {
      url: "/",
      revision: manifest.find(({ url }) => url.startsWith("/packs/js/app-"))
        .revision,
    },
    { url: "/favicon.ico", revision: "1" },
    { url: "/images/touch/turnip192.png", revision: "1" },
    {
      url:
        "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap",
      revision: "1",
    },
    { url: "/images/turnip.svg", revision: "1" },
    { url: "/manifest.webmanifest", revision: "1" },
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
