const CACHE_NAME = 'rpc-v1';
const urlsToCache = [
  '/rpc-championships/',
  '/rpc-championships/index.html',
  '/rpc-championships/manifest.json',
  '/rpc-championships/icon-192.svg',
  '/rpc-championships/icon-512.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          // If fetch fails, try to return cached index.html for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/rpc-championships/index.html');
          }
        });
      })
  );
});
