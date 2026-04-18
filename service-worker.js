const CACHE_NAME = 'yojna-finder-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/offline.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/data/search.json',
  '/assets/images/icon-192.svg',
  '/assets/images/icon-512.svg',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
