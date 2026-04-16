const CACHE_NAME = 'helper-guide-v2';
const urlsToCache = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './contact.html',
  './404.html',
  './offline.html',
  './legal/privacy.html',
  './legal/terms.html',
  './assets/css/style.css',
  './assets/js/main.js',
  './assets/data/search.json',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
      });
    })
  );
});
