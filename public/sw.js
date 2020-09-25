const CACHE_NAME = 'static-cache-v3';
const DATA_CACHE_NAME = 'data-cache-v2';

const FILE_TO_CACHE = [
    '/',
    'index.html',
];



self.addEventListener('install', (event) => {
    console.log("SW Install cycle");

    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Pre-Caching offline page');
            return cache.addAll(FILE_TO_CACHE);
        })
    );

    self.skipWaiting();
})


self.addEventListener('fetch', (event) => {
    console.log("SW fetch cycle, "+event.request.url);


    //fetch at /cat/index
    if(event.request.url.includes('/cat/')){
        console.log('[Service Worker] Fetch (data)', event.request.url);
        event.respondWith(
            caches.open(DATA_CACHE_NAME)
            .then(async (cache) => {
                try {
                    //put request into cache data
                    const response = await fetch(event.request);
                    if (response.status === 200) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                } catch (err) {
                    //return cache match
                    return cache.match(event.request);
                }
            })
        );
        console.log("hello");
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then(async cache => {
            //console.log('alseo helo');
            const response = await cache.match(event.request);
            return response || fetch(event.request);
        })
    );
});


self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    
    event.waitUntil(
        caches.keys().then(keylist => {
            return Promise.all(keylist.map(key => {
                if( key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                    console.log('service worker removing old cache', key);
                }
                return caches.delete(key);
            }));
        })
    );
    self.clients.claim();
});