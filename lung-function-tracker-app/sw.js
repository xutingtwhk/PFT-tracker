/* Lung Function Tracker service worker: offline app shell.
   Bump VERSION whenever you change index.html so installed copies update. */
const VERSION = "v1";
const SHELL = `ltracker-shell-${VERSION}`;
const RUNTIME = "ltracker-runtime";
const ASSETS = ["./", "./index.html", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/icon-maskable-512.png", "./icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(SHELL).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((k) => k.startsWith("ltracker-shell-") && k !== SHELL).map((k) => caches.delete(k))
  )).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Page navigations: network first (picks up updates), fall back to cached shell offline.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((res) => {
      const copy = res.clone(); caches.open(SHELL).then((c) => c.put("./index.html", copy)); return res;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  // Same-origin files and Google Fonts: cache first, then network.
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(url.origin === location.origin ? SHELL : RUNTIME).then((c) => c.put(req, copy)); }
      return res;
    })));
  }
});
