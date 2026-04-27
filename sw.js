const CACHE_NAME = 'cpf-router-pwa-v2';
const PRECACHE = [
  './',
  './index.html',
  './app.js',
  './rules.js',
  './storage.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME ? caches.delete(key) : Promise.resolve()))
    ).then(() => self.clients.claim())
     .then(() => self.clients.matchAll())
     .then(clients => {
       clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
     })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html')
        .then(cached => cached || fetch(request))
        .catch(() => fetch(request))
    );
    return;
  }

  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(cached =>
        cached || fetch(request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
          return response;
        })
      )
    );
  }
});
