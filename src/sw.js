// sw.js
const CACHE_NAME = 'egec-static-v6';
const TTL = 24 * 60 * 60 * 1000; // 24 ساعة بالميلي ثانية
const LCP_IMAGES = [
  '/assets/images/home/hero/hero-1600.jpg',
  '/assets/images/home/hero/hero-1000.jpg'
];

const CACHEABLE_EXTS = [
  '.css', '.js', '.woff2', '.woff', '.ttf', '.otf', '.eot',
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'
];

// ---------- Install Event ----------
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(LCP_IMAGES))
  );
  self.skipWaiting();
});

// ---------- Activate Event ----------
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      // حذف أي cache قديم
      await Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      );

      // تنظيف أي resource منتهية الصلاحية
      const cache = await caches.open(CACHE_NAME);
      const requests = await cache.keys();
      for (const req of requests) {
        const resp = await cache.match(req);
        if (resp && resp.headers.get('sw-fetched-at')) {
          const fetchedAt = new Date(resp.headers.get('sw-fetched-at'));
          if (Date.now() - fetchedAt.getTime() > TTL) {
            await cache.delete(req);
          }
        }
      }
    })()
  );
  self.clients.claim();
});

// ---------- Fetch Event ----------
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // --------- HTML → Network First ----------
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(resp => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, addTimestamp(copy)));
          return resp;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // --------- Other Assets → Cache First with TTL ----------
  if (CACHEABLE_EXTS.some(ext => url.pathname.endsWith(ext))) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async cache => {
        const cached = await cache.match(request);
        if (cached) {
          const fetchedAtHeader = cached.headers.get('sw-fetched-at');
          if (fetchedAtHeader) {
            const fetchedAt = new Date(fetchedAtHeader);
            if (Date.now() - fetchedAt.getTime() > TTL) {
              // Cache expired → fetch from network
              try {
                const networkResp = await fetch(request);
                cache.put(request, addTimestamp(networkResp.clone()));
                return networkResp;
              } catch {
                return cached; // fallback to old cache
              }
            }
          }
          return cached;
        }

        // Not cached yet → fetch from network
        try {
          const networkResp = await fetch(request);
          cache.put(request, addTimestamp(networkResp.clone()));
          return networkResp;
        } catch {
          return cached || new Response(null, { status: 404 });
        }
      })
    );
  }
});

// ---------- Helper: Add Timestamp ----------
function addTimestamp(response) {
  const headers = new Headers(response.headers);
  headers.set('sw-fetched-at', new Date().toISOString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}
