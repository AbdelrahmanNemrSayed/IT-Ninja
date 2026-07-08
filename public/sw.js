const CACHE_NAME = "it-ninja-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/favicon.png",
  "/manifest.json"
];

// Install Service Worker and cache core shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Smart Fetch Strategy: Stale-While-Revalidate for local assets & External Fonts
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and avoid Supabase API calls caching
  if (event.request.method !== "GET" || event.request.url.includes("supabase.co")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache new successful requests dynamically
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback
        return null;
      });

      // Return cached version immediately if available, while fetching update in background
      return cachedResponse || fetchPromise;
    })
  );
});
