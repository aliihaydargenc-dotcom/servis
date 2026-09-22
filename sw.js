const CACHE='sehir-asistani-v2-alpha1';
const SHELL=['./','./index.html','./styles.css','./manifest.webmanifest','./src/main.js','./src/app.js','./src/state.js','./src/views/common.js','./src/views/city.js','./src/views/content.js','./src/views/local.js','./src/views/index.js','./src/config.js','./src/location.js','./src/storage/db.js','./src/utils/geo.js','./src/utils/format.js','./src/providers/weather.js','./src/providers/traffic.js','./src/providers/news.js','./src/providers/radio.js','./src/providers/markets.js','./src/providers/pharmacy.js','./src/games/game2048.js','./icons/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.origin===location.origin){ e.respondWith(caches.match(e.request).then(c=>c||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(x=>x.put(e.request,copy));return r;}))); }
});
