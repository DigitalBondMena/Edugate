const CACHE_NAME = 'egec-static-v5'; 
const LCP_IMAGES = [
  '/assets/images/home/hero/hero-1600.jpg',
  '/assets/images/home/hero/hero-1000.jpg'
];

// عند تثبيت الـ SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(LCP_IMAGES); 
    })
  );
  self.skipWaiting();
});

// عند التفعيل
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // HTML → network first
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return resp;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  const cacheableExts = ['.css', '.js', '.woff2', '.woff', '.ttf', '.otf', '.eot', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
  if (cacheableExts.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request)
          .then(resp => {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
            return resp;
          })
          .catch(() => cached)
      })
    );
  }
});
