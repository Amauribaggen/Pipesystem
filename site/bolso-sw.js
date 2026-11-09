// PipeSystem de Bolso: guarda a página no aparelho para funcionar sem internet.
// Com internet, busca a versão nova e atualiza a cópia; sem internet, usa a cópia.
const CACHE = 'bolso-v2';
const ARQUIVOS = ['/bolso', '/bolso.webmanifest', '/bolso-dados.json', '/img/icons/icon-192.png', '/img/icons/favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith('bolso-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.ok) { const copia = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copia)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
