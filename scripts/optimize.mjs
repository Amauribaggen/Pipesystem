// Otimizações do build (SEO etapa C): tamanho real das fotos e compactação de scripts e estilos.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { transformSync } from 'esbuild';

const walk = dir => readdirSync(dir).flatMap(name => {
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// Largura e altura de uma imagem WebP, lidas do cabeçalho do arquivo (formatos VP8, VP8L e VP8X)
function webpSize(buf) {
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') return null;
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (chunk === 'VP8L') { const b = buf.readUInt32LE(21); return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]; }
  if (chunk === 'VP8X') return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  return null;
}

// { 'img/produtos/bombas-1.webp': [800, 600], ... } para todas as fotos WebP do site
export function imageSizes(siteDir) {
  const sizes = {};
  for (const file of walk(join(siteDir, 'img'))) {
    if (extname(file).toLowerCase() !== '.webp') continue;
    const size = webpSize(readFileSync(file));
    if (size) sizes[relative(siteDir, file).replace(/\\/g, '/')] = size;
  }
  return sizes;
}

// Compacta os .js e .css publicados (sem renomear as variáveis globais compartilhadas entre os scripts)
export function minify(outDir) {
  let before = 0, after = 0;
  for (const file of walk(outDir)) {
    const ext = extname(file).toLowerCase();
    if (ext !== '.js' && ext !== '.css') continue;
    const code = readFileSync(file, 'utf8');
    const out = transformSync(code, { loader: ext.slice(1), minify: true, charset: 'utf8', target: 'es2020', legalComments: 'none' }).code;
    writeFileSync(file, out);
    before += Buffer.byteLength(code); after += Buffer.byteLength(out);
  }
  return { before, after };
}
