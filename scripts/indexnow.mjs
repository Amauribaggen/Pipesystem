// Avisa Bing, Yandex e outros buscadores do IndexNow sobre páginas novas ou alteradas (o Google não participa).
// A chave é pública por definição: fica no próprio site, em /b14cba9a1276f1e5354ff0a47e182e22.txt.
// No build de produção da Vercel, envia as páginas alteradas nos últimos 2 dias. Uso manual: node scripts/indexnow.mjs --todas
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ARQ_DATAS, hoje } from './datas.mjs';

const HOST = 'www.pipesystem.com.br';
const KEY = 'b14cba9a1276f1e5354ff0a47e182e22';

// Uma falha no aviso nunca derruba a publicação
export async function avisarIndexNow(todas = false) {
  try {
    const desde = hoje(1);
    const urlList = Object.entries(JSON.parse(readFileSync(ARQ_DATAS, 'utf8')))
      .filter(([, [data]]) => todas || data >= desde)
      .map(([u]) => 'https://' + HOST + (u === '/' ? '/' : u));
    if (!urlList.length) return console.log('IndexNow: nenhuma página alterada');
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: 'https://' + HOST + '/' + KEY + '.txt', urlList }),
      signal: AbortSignal.timeout(20000),
    });
    console.log('IndexNow: ' + urlList.length + ' páginas enviadas, resposta ' + r.status);
  } catch (e) { console.log('IndexNow: aviso não enviado (' + e.message + ')'); }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await avisarIndexNow(process.argv.includes('--todas'));
