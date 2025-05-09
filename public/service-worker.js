const CACHE_NAME = "animangalisto-cache-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/_next/static/chunks/pages/index.js",
  "/_next/static/css/styles.chunk.css",
  "/icon192x192.png",
  "/icon.png",
  "/appleicon.png",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
