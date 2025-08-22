// sw.js
const CACHE = "abj-v3"; // <- versiyonu artır

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

// 52 kart görselini pre-cache (isteğe bağlı)
const SUITS = ["S","H","D","C"];
const RANKS = ["A","2","3","4","5","6","7","8","9","0","J","Q","K"];
const CARD_IMGS = [];
for (const s of SUITS) for (const r of RANKS) {
  CARD_IMGS.push(`https://deckofcardsapi.com/static/img/${r}${s}.png`);
}

self.addEventListener("install", (e) => {
  // Yeni SW’yi hemen aktifleştirmeye hazırlık
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll([...APP_ASSETS, ...CARD_IMGS]))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      // Eski cache’leri temizle
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
      // Yeni SW kontrolü devralsın
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  e.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(net => {
        // YALNIZCA BAŞARILI yanıtları cache’le
        if (net && net.ok && net.type !== "opaque") {
          const clone = net.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return net;
      }).catch(() => caches.match("/"));
    })
  );
});
// Not: Yukarıdaki catch bloğu, ağ hatası durumunda ana sayfayı döner.