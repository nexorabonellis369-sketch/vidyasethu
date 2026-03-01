const CACHE_NAME = 'vidhyasethu-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/src/main.js',
    '/src/styles/index.css',
    '/src/styles/components.css',
    '/src/styles/modes.css',
    '/src/assets/logo.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
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
