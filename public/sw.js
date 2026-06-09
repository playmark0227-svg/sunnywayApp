// Sunnyway 最小 Service Worker（インストール可能化＋オフライン時のフォールバック）
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(fetch(req).catch(() => caches.match(req)));
});
