// Basic service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('vizitqr-contact-v1').then((cache) => {
            return cache.addAll([
                './',
                './index.html',
                './styles.css',
                './scripts.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Update scope in registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {
        scope: 'https://vizitqr.intelliquinte.com/'
    });
} 