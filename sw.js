// sw.js
const CACHE = "abj-v6";

// Uygulama kabuğu
const APP_ASSETS = [
  "/", "/history",
  "/manifest.webmanifest",
  "/static/css/style.css",
  "/static/js/engine.js",
  "/static/js/ui.js",
  "/static/js/audio.js",
  "/static/js/pwa.js",
  "/static/img/ui/icon-48.png",
  "/static/img/ui/icon-192.png"
];

// Statik kart görsellerini önceden cache’le (görsel URL'leri statik)
const SUITS = ["S","H","D","C"];
const RANKS = ["A","2","3","4","5","6","7","8","9","0","J","Q","K"]; // 10 = "0"
const CARD_IMGS = [];
for (const s of SUITS) for (const r of RANKS) {
  CARD_IMGS.push(`https://deckofcardsapi.com/static/img/${r}${s}.png`);
}

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([...APP_ASSETS, ...CARD_IMGS]))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // ❌ Deck of Cards API (dinamik): ASLA cache'leme
  const isDeckAPI =
    url.hostname.endsWith("deckofcardsapi.com") &&
    url.pathname.startsWith("/api/deck/");

  // ❌ Diğer origin'ler: default fetch (CORS/opaque cache karmaşasından kaçın)
  if (!isSameOrigin || isDeckAPI || request.method !== "GET") {
    e.respondWith(fetch(request).catch(() => caches.match("/")));
    return;
  }

  // ✅ Sadece aynı origin GET isteklerine cache-first
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(net => {
        if (net && net.ok) {
          const clone = net.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return net;
      }).catch(() => caches.match("/"));
    })
  );
});
// Not: Dinamik cache temizliği için LRU stratejisi eklenebilir (şimdilik basit tutuyoruz)
