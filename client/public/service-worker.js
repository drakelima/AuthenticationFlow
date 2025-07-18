const CACHE_NAME = 'minha-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Become available to all clients
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Determine caching strategy based on file type
  if (isImage(pathname)) {
    return cacheFirstStrategy(request, 30 * 24 * 60 * 60 * 1000); // 30 days
  } else if (isFont(pathname)) {
    return cacheFirstStrategy(request, 6 * 30 * 24 * 60 * 60 * 1000); // 6 months
  } else if (isCode(pathname)) {
    return networkFirstStrategy(request);
  } else {
    return networkFirstStrategy(request);
  }
}

// Cache-first strategy for images and fonts
async function cacheFirstStrategy(request, maxAge) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      const cachedDate = new Date(cachedResponse.headers.get('date'));
      const now = new Date();
      const age = now.getTime() - cachedDate.getTime();

      if (age < maxAge) {
        return cachedResponse;
      }
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Network-first strategy for HTML, JS, CSS, JSON
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Helper functions to determine file types
function isImage(pathname) {
  return /\.(png|jpg|jpeg|webp|svg|gif|ico)$/i.test(pathname);
}

function isFont(pathname) {
  return /\.(woff2|woff|ttf|otf|eot)$/i.test(pathname);
}

function isCode(pathname) {
  return /\.(html|js|css|json)$/i.test(pathname) || pathname === '/' || !pathname.includes('.');
}

// Handle update notifications
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});