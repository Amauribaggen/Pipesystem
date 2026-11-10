// Acabamento do build, aplicado ao HTML já gerado em dist/:
// 1. largura e altura nas imagens que ainda não têm (a página não "pula" enquanto elas carregam);
// 2. versão no endereço dos scripts e estilos (?v=...), para o navegador poder guardá-los por muito tempo
//    (vercel.json) e ainda assim buscar o arquivo novo assim que ele muda.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';

const walk = dir => readdirSync(dir).flatMap(name => {
  const p = join(dir, name);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

// Largura e altura de PNG, JPEG, WebP e SVG, lidas do próprio arquivo
function tamanho(file) {
  const buf = readFileSync(file), ext = extname(file).toLowerCase();
  if (ext === '.png' && buf.length > 24) return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  if (ext === '.webp' && buf.toString('ascii', 0, 4) === 'RIFF') {
    const chunk = buf.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
    if (chunk === 'VP8L') { const b = buf.readUInt32LE(21); return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]; }
    if (chunk === 'VP8X') return [buf.readUIntLE(24, 3) + 1, buf.readUIntLE(27, 3) + 1];
  }
  if (ext === '.jpg' || ext === '.jpeg') {
    for (let i = 2; i + 9 < buf.length;) {
      if (buf[i] !== 0xff) return null;
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  if (ext === '.svg') {
    const tag = (buf.toString('utf8').match(/<svg\b[^>]*>/) || [''])[0];
    const num = n => { const m = tag.match(new RegExp('\\s' + n + '="([\\d.]+)(px)?"')); return m ? Number(m[1]) : 0; };
    const vb = (tag.match(/viewBox="([^"]+)"/) || [])[1];
    const [, , vw, vh] = vb ? vb.trim().split(/[\s,]+/).map(Number) : [];
    const w = num('width') || vw, h = num('height') || vh;
    if (w > 0 && h > 0) return [Math.round(w), Math.round(h)];
  }
  return null;
}

export function acabamento(outDir) {
  const htmls = walk(outDir).filter(f => f.endsWith('.html'));
  const local = (ref, html) => {                       // arquivo em dist/ a que o endereço se refere
    const limpo = decodeURI(ref.split(/[?#]/)[0]);
    return limpo.startsWith('/') ? join(outDir, limpo) : join(dirname(html), limpo);
  };

  // Versão geral (todos os scripts): usada pelos scripts que o script.js carrega depois, sob demanda
  const geral = createHash('sha1');
  walk(outDir).filter(f => f.endsWith('.js')).sort().forEach(f => geral.update(readFileSync(f)));
  const principal = join(outDir, 'script.js');
  writeFileSync(principal, readFileSync(principal, 'utf8').split('__VERSAO__').join(geral.digest('hex').slice(0, 8)));

  const dimsCache = new Map(), verCache = new Map();
  const dims = f => { if (!dimsCache.has(f)) { let d = null; try { d = existsSync(f) ? tamanho(f) : null; } catch { /* arquivo fora do padrão: fica sem medida */ } dimsCache.set(f, d); } return dimsCache.get(f); };
  const ver = f => { if (!verCache.has(f)) verCache.set(f, existsSync(f) ? createHash('sha1').update(readFileSync(f)).digest('hex').slice(0, 8) : ''); return verCache.get(f); };
  const externo = ref => /^(https?:)?\/\//.test(ref) || ref.startsWith('data:') || ref.startsWith('/_vercel') || ref.includes('${');

  let imagens = 0, versoes = 0;
  for (const html of htmls) {
    const h = readFileSync(html, 'utf8');
    const novo = h
      .replace(/<img\b(?![^>]*\swidth=)([^>]*?)\ssrc="([^"]+)"([^>]*)>/g, (tudo, a, src, b) => {
        if (externo(src)) return tudo;
        const d = dims(local(src, html));
        if (!d) return tudo;
        imagens++;
        return `<img${a} src="${src}" width="${d[0]}" height="${d[1]}"${b}>`;
      })
      .replace(/(<script\b[^>]*\ssrc="|<link\b[^>]*\srel="stylesheet"[^>]*\shref="|<link\b[^>]*\shref=")([^"?]+\.(?:js|css))(")/g, (tudo, a, ref, b) => {
        if (externo(ref)) return tudo;
        const v = ver(local(ref, html));
        if (!v) return tudo;
        versoes++;
        return `${a}${ref}?v=${v}${b}`;
      });
    if (novo !== h) writeFileSync(html, novo);
  }
  return { imagens, versoes };
}
