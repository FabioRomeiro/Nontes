const version = 7;
let isOnline = true;
let cachingSubnotes = false;

const dataCacheName = `nontes-data-${version}`;
const staticCacheName = `nontes-static-${version}`;
const urlsToStaticCache = [
    '/',
    '/note',
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

async function onMessage({ data }) {
    if (data.statusUpdate) {
        isOnline = data.statusUpdate.isOnline;
    }
    if (data.preloadSubnotes) {
        await cacheSubnotes(data.preloadSubnotes.path);
    }
}

function onFetch(event) {
    event.respondWith(router(event.request));
}

async function onInstall(event) {
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
    let cacheItemName = '/note';

    if (url.search || urlsToStaticCache.includes(url.pathname)) {
        cacheItemName = url.pathname + url.search;
    }
    
    let cache = await getCache(url);

    if (url.origin === location.origin) {
        let res;
        const isSavingNote = request.method === 'PUT';
        
        if (isOnline) {
            try {
                let cacheResponse = true;

                let fetchOptions = {
                    method: request.method,
                    headers: request.headers,
                    cache: 'no-store'
                };

                if (isSavingNote) {
                    const body = await request.json();
                    fetchOptions.body = JSON.stringify(body);
                    cacheResponse = false;
                }

                res = await fetch(url.toString(), fetchOptions);
            
                if (res && res.ok) {
                    if (cacheResponse) {
                        await cache.put(cacheItemName, res.clone());
                    }
                    return res;
                }
            }
            catch (err) {}
        }

        if (!isSavingNote) {
            res = await cache.match(cacheItemName);
            if (res) {
                return res.clone();
            }
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
async function cacheSubnotes(currentNodePath) {
    if (!isOnline || cachingSubnotes) {
        return;
    }
    cachingSubnotes = true;
    await delay(5000);
    let cache = await caches.open(dataCacheName);

    try {
        const fetchOptions = {
            method: 'GET',
            cache: 'no-store'
        };
        const url = getDataUrlFromPath(currentNodePath) + '&deep=true';
        const res = await fetch(url, fetchOptions);
        if (res && res.ok) {
            const note = await res.json();
            await cacheNotesRecursively(note, currentNodePath, res, cache);
        }
    }
    catch (err) {
        console.error(err);
    }
    finally {
        cachingSubnotes = false;
    }
}

async function cacheNotesRecursively(note, path, res, cache) {
    if (typeof note === 'string') {
        return;
    }

    const shallowNote = {
        ...note,
        subNotes: note.subNotes.map(subnote => subnote.name)
    };
    const response = new Response(JSON.stringify(shallowNote), res.headers);
    const url = getDataUrlFromPath(path);
    await cache.put(url, response.clone()); 

    return note.subNotes.forEach(subnote =>
        cacheNotesRecursively(subnote, `${path}/${subnote.name}`, res, cache)
    );
}

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
                cache: 'no-store'
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

function getDataUrlFromPath(path) {
    return `${path}?data`;
}

async function getCache(url) {
    if (isNoteData(url.search)) {
        return caches.open(dataCacheName);
    }
    else {
        return caches.open(staticCacheName);
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

