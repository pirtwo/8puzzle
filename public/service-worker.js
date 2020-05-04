self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open('8-puzzle').then(function (cache) {
            return cache.addAll([
                '/',
                '/index.html',
                '/js/bundle.js',
                '/js/puzzle-worker.js',
                '/css/app.css',
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