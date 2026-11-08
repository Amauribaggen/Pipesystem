// Build do site: copia a pasta site/ (HTML, CSS, JS e imagens) para dist/, que é publicada pela Vercel.
// Não há etapa de compilação: o site é estático. Só usa módulos nativos do Node (sem dependências).
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { BASE, SIZES, loadData, generate, sitemap, ultimasNoticiasHTML } from './pages.mjs';
import { imageSizes, minify } from './optimize.mjs';
import { separar } from './secoes.mjs';
import { gerarRevisoes } from './revisoes.mjs';
import { datasPaginas } from './datas.mjs';
import { avisarIndexNow } from './indexnow.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'site');
const out = join(root, 'dist');

if (!existsSync(join(src, 'index.html'))) {
  console.error('Erro: site/index.html não encontrado.');
  process.exit(1);
}

// Data da última alteração de cada ficha (só com o histórico completo do git; senão vale o site/revisoes.js salvo)
const nRev = gerarRevisoes();
if (nRev) console.log(`Datas de revisão atualizadas: ${nRev} fichas`);

rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

// Últimas notícias (site/noticias.json) no alto da seção Notícias, artigos e revistas
{
  const f = join(out, 'index.html');
  // o total de notícias vai para o resumo numérico da página inicial, que não carrega o noticias.json
  const totalNoticias = JSON.parse(readFileSync('site/noticias.json', 'utf8')).itens.length;
  writeFileSync(f, readFileSync(f, 'utf8').replace(/<!-- ULTIMAS_NOTICIAS:[^>]*-->/, ultimasNoticiasHTML())
    .replace('<strong data-count="0" data-prefix="" data-num="noticias">0<', `<strong data-count="${totalNoticias}" data-prefix="" data-num="noticias">${totalNoticias}<`));
}

// Páginas próprias de cada ficha (produtos, sistemas e materiais) + sitemap.xml com todas as URLs
const D = loadData(src);
Object.assign(SIZES, imageSizes(src));
writeFileSync(join(out, 'img-sizes.js'), 'window.IMG_SIZES=' + JSON.stringify(SIZES) + ';\n');
const pages = generate(D, out);
// Seções grandes da página inicial em páginas próprias (/materiais, /dimensionamento, /bim-cad, /guias-praticos)
for (const url of separar(out, D, src)) pages.push({ url, images: [] });
const fotos = [...new Set([
  ...D.PRODUCTS.flatMap(p => (p.fotos || []).map(f => f.src)),
  ...Object.values(D.SYSTEM_PHOTOS).flatMap(a => a.map(f => f.src)),
])].map(s => `${BASE}/${s}`);
// Data real de cada página: o build local atualiza scripts/datas-paginas.json; a Vercel só lê
const { datas, mudou } = datasPaginas(out, ['/', ...pages.map(p => p.url)], !process.env.VERCEL);
console.log(`Páginas com conteúdo alterado: ${mudou}`);
sitemap(pages, [`${BASE}/img/og-pipesystem.jpg`, ...fotos], out, datas);
console.log(`Páginas geradas: ${pages.length} (+ página inicial) · sitemap.xml com ${pages.length + 1} URLs`);

// Scripts e estilos compactados
const m = minify(out);
console.log(`JS e CSS compactados: ${(m.before / 1024).toFixed(0)} KB -> ${(m.after / 1024).toFixed(0)} KB`);

// Resumo do que foi gerado
let files = 0, bytes = 0;
const walk = dir => readdirSync(dir).forEach(name => {
  const p = join(dir, name), s = statSync(p);
  if (s.isDirectory()) walk(p); else { files++; bytes += s.size; }
});
walk(out);
console.log(`Build concluído: ${files} arquivos (${(bytes / 1024 / 1024).toFixed(1)} MB) em ${relative(root, out)}/`);

if (process.env.VERCEL_ENV === 'production') await avisarIndexNow();
