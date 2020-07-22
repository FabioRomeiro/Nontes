const version = 4;
let isOnline = true;

const notesCacheName = `nontes-notes-${version}`;
const dataCacheName = `nontes-data-${version}`;
const staticCacheName = `nontes-static-${version}`;
const urlsToStaticCache = [
    '/',
    '/js/landing.js',
    '/js/nontes.js',
    '/js/note.js',
    '/css/global.css',
    '/css/note.css',
    '/css/landing.css',
    '/assets/images/no-internet.svg',
    '/favicon.ico'
];

self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('message', onMessage);
self.addEventListener('fetch', onFetch);

/* Event Handlers */

function onMessage({ data }) {
    if (data.statusUpdate) {
        console.log(`Service Worker ${version} is Online: ${data.statusUpdate.isOnline}`);
        isOnline = data.statusUpdate.isOnline;
    }
}

function onFetch(event) {
    event.respondWith(router(event.request));
}

async function onInstall(event) {
    console.log(`Service Worker ${version} installed.`);
    self.skipWaiting();
}

function onActivate(event) {
    event.waitUntil(handleActivation());
}


main().catch(console.error);

async function main() {
    console.log(`Service Worker ${version} is starting...`);
    await sendMessage({ requestStatusUpdate: true });
    await cacheStaticFiles();
}

async function sendMessage(message) {
    const allClients = await clients.matchAll({ includeUncontrolled: true });
    return Promise.all(allClients.map(client => {
        const channel = new MessageChannel();
        channel.port1.onmessage = onMessage;
        client.postMessage(message, [channel.port2]);
    }))
}

async function router(request) {
    const url = new URL(request.url);
    const cacheItemName = url.pathname + url.search;
    
    let cache = await getCache(url);

    if (url.origin === location.origin) {
        let res;
        
        if (isOnline) {
            try {
                const fetchOptions = {
                    method: request.method,
                    cache: 'no-store'
                };
                res = await fetch(url.toString(), fetchOptions);
            
                if (res && res.ok) {
                    await cache.put(cacheItemName, res.clone());
                    return res;
                }
            }
            catch (err) {}
        }

        res = await cache.match(cacheItemName);
        if (res) {
            return res.clone();
        }
    }
}

async function handleActivation() {
    await clearStaticFilesCache();
    await cacheStaticFiles(true);
    await clients.claim();
    console.log(`Service Worker ${version} activated.`);
}


/* Cache Utils */
async function cacheStaticFiles(forceReload) {
    const cache = await caches.open(staticCacheName);

    return Promise.all(urlsToStaticCache.map(async url => {
        try {
            let res;
            
            if (!forceReload) {
                res = await cache.match(url);
                if (res) {
                    return res;
                }
            }

            const fetchOptions = {
                method: 'GET',
                cache: 'no-store',
                body
            };
            res = await fetch(url, fetchOptions);
        
            if (res && res.ok) {
                await cache.put(url, res);
            }
        }
        catch(err) {}
    }));
}

function clearStaticFilesCache() {
    return clearCaches(/^nontes-static-(\d+)$/);
}

function clearNotesCache() {
    return clearCaches(/^nontes-notes-(\d+)$/);
}

async function clearCaches(regex) {
    const cacheNames = await caches.keys();
    let invalidCaches = cacheNames.filter(name => {
        if (regex.test(name)) {
            [, cacheVersion] = name.match(regex);
            
            return cacheVersion && +cacheVersion != version;
        }
    });
    return Promise.all(invalidCaches.map(cache => caches.delete(cache)));
}


/* Helpers */
function isNoteData(url) {
    return url.includes('?data');
}

function isStaticFilePath(path) {
    return urlsToStaticCache.includes(path);
}

async function getCache(url) {
    if (isStaticFilePath(url.pathname)) {
        return caches.open(staticCacheName);
    }
    else if (isNoteData(url.search)) {
        return caches.open(dataCacheName);
    }
    else {
        return caches.open(notesCacheName);
    }
}