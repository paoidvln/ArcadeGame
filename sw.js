// Pixel Arcade offline cache.
// Online: every file comes fresh from the network (and a copy is saved). Offline: the saved copy is used.
const CACHE = 'pixel-arcade-3';
const CORE = ['./', 'pirates/', 'space/', 'ghostbound/', 'lizzy/', 'shared/arcade.css', 'shared/arcade.js', 'shared/wand.css', 'lizzy/data.js', 'lizzy/extras.js',
  'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png',
  'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js', 'https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap'];
// same-site files are saved without their ?v=… so one copy serves every version
const keyOf = req => { const u = new URL(req.url); if (u.origin === location.origin) { u.search = ''; u.hash = ''; return u.href; } return req.url; };

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(p => {
    const url = new URL(p, self.registration.scope).href;
    return fetch(url, { cache: 'no-cache' }).then(r => { if (r.ok) return c.put(url, r); }).catch(() => {});
  }))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !/^https?:/.test(req.url)) return;
  const u = new URL(req.url);
  if (u.origin === location.origin && u.pathname.endsWith('/version.json')) return; // the update check must always hit the network
  if (u.origin !== location.origin && !/fonts\.(googleapis|gstatic)\.com$|unpkg\.com$/.test(u.hostname)) return; // e.g. Telegram, PeerJS servers
  const key = keyOf(req);
  e.respondWith(fetch(req).then(res => {
    if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {}); }
    return res;
  }).catch(() => caches.open(CACHE).then(c => c.match(key)).then(hit => hit || Response.error())));
});
