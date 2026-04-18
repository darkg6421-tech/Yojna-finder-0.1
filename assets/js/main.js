/* Yojna Finder – Main JS */

(function () {
  'use strict';

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
    });
  }
})();
