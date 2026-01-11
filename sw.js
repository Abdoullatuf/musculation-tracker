// ===== SERVICE WORKER - MODE HORS-LIGNE =====
const CACHE_NAME = 'muscltrack-v1.0.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './app.js',
    './features.js',
    './enhancements.js',
    './styles.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Service Worker: Cache ouvert');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('✓ Service Worker: Tous les assets sont en cache');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Erreur de cache:', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activation...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Service Worker: Suppression de l\'ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✓ Service Worker: Activé');
            return self.clients.claim();
        })
    );
});

// Stratégie de cache: Network First, puis Cache
self.addEventListener('fetch', (event) => {
    // Ignorer les requêtes non-HTTP(S)
    if (!event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Si la requête réseau réussit, mettre en cache et retourner
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // Si le réseau échoue, utiliser le cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('📦 Service Worker: Réponse depuis le cache:', event.request.url);
                        return cachedResponse;
                    }

                    // Si pas dans le cache, retourner une page offline pour les pages HTML
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.delete(CACHE_NAME).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Notification de mise à jour
self.addEventListener('controllerchange', () => {
    console.log('🔄 Service Worker: Nouvelle version disponible');
});
