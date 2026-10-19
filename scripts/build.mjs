// Build do site: copia a pasta site/ (HTML, CSS, JS e imagens) para dist/, que é publicada pela Vercel.
// Não há etapa de compilação: o site é estático. Só usa módulos nativos do Node (sem dependências).
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE, loadData, generate, sitemap } from './pages.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'site');
const out = join(root, 'dist');

if (!existsSync(join(src, 'index.html'))) {
  console.error('Erro: site/index.html não encontrado.');
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

// Páginas próprias de cada ficha (produtos, sistemas e materiais) + sitemap.xml com todas as URLs
const D = loadData(src);
const pages = generate(D, out);
const fotos = [...new Set([
  ...D.PRODUCTS.flatMap(p => (p.fotos || []).map(f => f.src)),
  ...Object.values(D.SYSTEM_PHOTOS).flatMap(a => a.map(f => f.src)),
])].map(s => `${BASE}/${s}`);
sitemap(pages, [`${BASE}/img/og-pipesystem.jpg`, ...fotos], out);
console.log(`Páginas geradas: ${pages.length} (+ página inicial) · sitemap.xml com ${pages.length + 1} URLs`);

// Resumo do que foi gerado
let files = 0, bytes = 0;
const walk = dir => readdirSync(dir).forEach(name => {
  const p = join(dir, name), s = statSync(p);
  if (s.isDirectory()) walk(p); else { files++; bytes += s.size; }
});
walk(out);
console.log(`Build concluído: ${files} arquivos (${(bytes / 1024 / 1024).toFixed(1)} MB) em ${relative(root, out)}/`);
