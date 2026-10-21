// Gera site/sinapi-precos.js a partir do pacote mensal do SINAPI (Caixa), só com os insumos usados em site/sinapi-regras.js.
// Uso: baixe "SINAPI-AAAA-MM-formato-xlsx.zip" em https://www.caixa.gov.br/site/Paginas/downloads.aspx#categoria_888
//      e rode: node scripts/sinapi.mjs caminho/SINAPI-AAAA-MM-formato-xlsx.zip
// Lê a aba ISD (insumos sem desoneração) do arquivo SINAPI_Referência_AAAA_MM.xlsx: preço mediano por estado (capitais).
import { readFileSync, writeFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { runInNewContext } from 'node:vm';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) { console.error('Uso: node scripts/sinapi.mjs SINAPI-AAAA-MM-formato-xlsx.zip'); process.exit(1); }

// ZIP: lê o diretório central e devolve { nome: () => Buffer }
function unzip(buf) {
  let e = buf.length - 22;
  while (buf.readUInt32LE(e) !== 0x06054b50) e--;
  const n = buf.readUInt16LE(e + 10), files = {};
  for (let i = 0, o = buf.readUInt32LE(e + 16); i < n; i++) {
    const method = buf.readUInt16LE(o + 10), size = buf.readUInt32LE(o + 20), nl = buf.readUInt16LE(o + 28);
    const extra = buf.readUInt16LE(o + 30), comment = buf.readUInt16LE(o + 32), local = buf.readUInt32LE(o + 42);
    const name = buf.toString('utf8', o + 46, o + 46 + nl);
    files[name] = () => {
      const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28), data = buf.subarray(start, start + size);
      return method === 0 ? data : inflateRawSync(data);
    };
    o += 46 + nl + extra + comment;
  }
  return files;
}
const xml = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

let pack = unzip(readFileSync(src));
const refName = Object.keys(pack).find(k => /Refer.*\.xlsx$/i.test(k));
const xlsx = refName ? unzip(pack[refName]()) : pack;   // aceita o .zip mensal ou o .xlsx de referência direto
const wb = xlsx['xl/workbook.xml']().toString();
const rid = wb.match(/<sheet [^>]*name="ISD"[^>]*r:id="([^"]+)"/)?.[1];
if (!rid) throw new Error('Aba ISD não encontrada');
const rels = xlsx['xl/_rels/workbook.xml.rels']().toString();
const target = rels.match(new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"`))?.[1] || rels.match(new RegExp(`Target="([^"]+)"[^>]*Id="${rid}"`))[1];
const strs = [...xlsx['xl/sharedStrings.xml']().toString().matchAll(/<si>([\s\S]*?)<\/si>/g)]
  .map(m => xml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]).join('')));
const col = ref => [...ref.replace(/\d/g, '')].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
const rows = [...xlsx['xl/' + target.replace(/^\/?xl\//, '')]().toString().matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)].map(m => {
  const r = [];
  for (const c of m[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
    const v = c[3]?.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? c[3]?.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
    if (v == null) continue;
    r[col(c[1])] = /t="s"/.test(c[2]) ? strs[+v] : xml(v);
  }
  return r;
});
const head = rows.findIndex(r => r.some(v => /^C[óo]digo do/i.test(v || '')));
const ufCol = rows[head].findIndex(v => v === 'AC'), ufs = rows[head].slice(ufCol).filter(Boolean);
const mes = rows.find(r => /M[êe]s de Refer/i.test(r[0] || ''))?.[1], emissao = rows.find(r => /Data de emiss/i.test(r[0] || ''))?.[1];
const capitais = rows[head - 4]?.slice(ufCol, ufCol + ufs.length);

// Busca para montar regras: node scripts/sinapi.mjs pacote.zip --buscar "POLIPROPILENO" [UF]
if (process.argv[3] === '--buscar') {
  const re = new RegExp(process.argv[4], 'i'), ui = ufs.indexOf((process.argv[5] || 'SC').toUpperCase());
  for (const r of rows.slice(head + 1)) if (r[1] && re.test(r[2] || '')) console.log(`${r[1]} | ${r[2]} | ${r[3]} | ${ufs[ui]} = ${r[ufCol + ui] ?? '—'}`);
  process.exit(0);
}

// insumos usados nas regras
const regras = runInNewContext(readFileSync(join(root, 'site', 'sinapi-regras.js'), 'utf8') + ';SINAPI_REGRAS');
const codes = new Set();
const walk = s => {
  if (typeof s === 'string') return codes.add(s);
  if (!s || typeof s !== 'object') return;
  if (Array.isArray(s)) return s.forEach(walk);
  ['c', 's'].forEach(k => s[k] && walk(s[k]));
  if (s.by) Object.values(s.by).forEach(walk);
};
regras.forEach(([, spec]) => walk(spec));

const ins = {};
for (const r of rows.slice(head + 1)) {
  if (!r[1] || !codes.has(String(r[1]))) continue;
  ins[r[1]] = [r[2], r[3], ...ufs.map((_, i) => { const p = parseFloat(r[ufCol + i]); return isNaN(p) ? null : Math.round(p * 100) / 100; })];
}
const missing = [...codes].filter(c => !ins[c]);
const out = `// Gerado por scripts/sinapi.mjs a partir de ${src.split(/[\\/]/).pop()} — não edite à mão.\n` +
  `// SINAPI (Caixa): relatório de preços de insumos, sem desoneração, preço mediano na capital de cada estado.\n` +
  `const SINAPI_PRECOS = ${JSON.stringify({ ref: mes, emissao, fonte: 'https://www.caixa.gov.br/site/Paginas/downloads.aspx#categoria_888', ufs, capitais, ins })};\n`;
writeFileSync(join(root, 'site', 'sinapi-precos.js'), out);
console.log(`SINAPI ${mes}: ${Object.keys(ins).length} insumos × ${ufs.length} estados → site/sinapi-precos.js (${(out.length / 1024).toFixed(0)} KB)`);
if (missing.length) console.log('Códigos das regras que não existem nesta edição:', missing.join(', '));
