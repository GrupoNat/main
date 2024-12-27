const CACHE_NAME = "Zentrix1-cache-v2";
const urlsToCache = [
    "/",
    "/index.html",
    "/css/templatemo_main.css",
    "/js/templatemo_script.js",
    "/images/logo.png",
];

// Instalar o Service Worker
self.addEventListener("install", (event) => {
    console.log("[Service Worker] Instalando...");
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log("[Service Worker] Arquivos em cache");
                return cache.addAll(urlsToCache);
            })
            .catch((err) => console.error("[Service Worker] Falha ao adicionar ao cache", err))
    );
});

// Ativar o Service Worker
self.addEventListener("activate", (event) => {
    console.log("[Service Worker] Ativando...");
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log("[Service Worker] Removendo cache antigo:", cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar requisições
self.addEventListener("fetch", (event) => {
    console.log("[Service Worker] Interceptando:", event.request.url);
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Retorna do cache ou busca do servidor
            return response || fetch(event.request)
                .then((fetchResponse) => {
                    // Adiciona nova resposta ao cache
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
        }).catch((err) => {
            console.error("[Service Worker] Erro ao buscar recurso:", err);
        })
    );
});
