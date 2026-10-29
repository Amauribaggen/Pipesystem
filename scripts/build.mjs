// Build do site: copia a pasta site/ (HTML, CSS, JS e imagens) para dist/, que é publicada pela Vercel.
// Não há etapa de compilação: o site é estático. Só usa módulos nativos do Node (sem dependências).
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { BASE, SIZES, loadData, generate, sitemap, ultimasNoticiasHTML } from './pages.mjs';
import { imageSizes, minify } from './optimize.mjs';
import { separar } from './secoes.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'site');
const out = join(root, 'dist');

if (!existsSync(join(src, 'index.html'))) {
  console.error('Erro: site/index.html não encontrado.');
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

// Últimas notícias (site/noticias.json) no alto da seção Notícias, artigos e revistas
{
  const f = join(out, 'index.html');
  writeFileSync(f, readFileSync(f, 'utf8').replace(/<!-- ULTIMAS_NOTICIAS:[^>]*-->/, ultimasNoticiasHTML()));
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
sitemap(pages, [`${BASE}/img/og-pipesystem.jpg`, ...fotos], out);
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
