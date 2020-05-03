self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('video-store').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/index.js',
                '/worker.js',
                '/app.css',
                '/assets/sprites/tileset.png',
                '/assets/sprites/tileset.json',
                '/assets/sounds/click1.ogg',
                '/assets/images/view-01.jpg',
            ]);
        })
    );
});

self.addEventListener('fetch', function (e) {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});