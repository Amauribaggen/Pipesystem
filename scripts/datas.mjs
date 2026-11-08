// Data real da última alteração de cada página, para o <lastmod> do sitemap e para o aviso ao IndexNow.
// Guarda em scripts/datas-paginas.json a data e a impressão digital do conteúdo principal (<main>) de cada página: a data
// só muda quando esse conteúdo muda. O build local atualiza o arquivo, que entra no commit; a Vercel só o lê.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ARQ_DATAS = join(dirname(fileURLToPath(import.meta.url)), 'datas-paginas.json');
export const hoje = (d = 0) => new Date(Date.now() - 3 * 36e5 - d * 864e5).toISOString().slice(0, 10); // horário de Brasília

const lerDatas = () => existsSync(ARQ_DATAS) ? JSON.parse(readFileSync(ARQ_DATAS, 'utf8')) : {};
const arquivo = (out, url) => join(out, url === '/' ? 'index.html' : url.slice(1) + '.html');

// Espaços normalizados: o mesmo conteúdo dá a mesma impressão digital no Windows (CRLF) e na Vercel (LF)
function impressao(html) {
  const a = html.indexOf('<main'), b = html.indexOf('</main>');
  const miolo = a >= 0 && b > a ? html.slice(a, b) : html;
  return createHash('sha1').update(miolo.replace(/\s+/g, ' ')).digest('hex').slice(0, 16);
}

export function datasPaginas(out, urls, salvar) {
  const antes = lerDatas(), novo = {}, datas = {};
  let mudou = 0;
  for (const url of [...urls].sort()) {
    const f = arquivo(out, url);
    if (!existsSync(f)) throw new Error('Página sem arquivo para o sitemap: ' + url);
    const h = impressao(readFileSync(f, 'utf8'));
    const [data, hAntes] = antes[url] || [];
    if (hAntes !== h) mudou++;
    novo[url] = [hAntes === h ? data : hoje(), h];
    datas[url] = novo[url][0];
  }
  if (salvar) writeFileSync(ARQ_DATAS, '{\n' + Object.entries(novo).map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(',\n') + '\n}\n');
  return { datas, mudou };
}
