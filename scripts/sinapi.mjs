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
// linhas de uma aba (pelo nome), como listas de valores por coluna
function sheetRows(nome) {
  const rid = wb.match(new RegExp(`<sheet [^>]*name="${nome}"[^>]*r:id="([^"]+)"`))?.[1];
  if (!rid) throw new Error(`Aba ${nome} não encontrada`);
  const target = rels.match(new RegExp(`Id="${rid}"[^>]*Target="([^"]+)"`))?.[1] || rels.match(new RegExp(`Target="([^"]+)"[^>]*Id="${rid}"`))[1];
  return [...xlsx['xl/' + target.replace(/^\/?xl\//, '')]().toString().matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)].map(m => {
    const r = [];
    for (const c of m[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const v = c[3]?.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? c[3]?.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
      if (v == null) continue;
      r[col(c[1])] = /t="s"/.test(c[2]) ? strs[+v] : xml(v);
    }
    return r;
  });
}
const rels = xlsx['xl/_rels/workbook.xml.rels']().toString();
const strs = [...xlsx['xl/sharedStrings.xml']().toString().matchAll(/<si>([\s\S]*?)<\/si>/g)]
  .map(m => xml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]).join('')));
const col = ref => [...ref.replace(/\d/g, '')].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
const rows = sheetRows('ISD');
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

// Produtividade de mão de obra (aba Analítico): horas de profissional e de ajudante por unidade de cada insumo das regras.
// Vale a mediana das composições de "fornecimento e instalação" em que o insumo é o item principal
// (a descrição da composição começa pela mesma palavra do insumo: TUBO, JOELHO, REGISTRO...). Kits ficam de fora.
const sem = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
const ana = sheetRows(wb.match(/<sheet [^>]*name="(Anal[^"]*tico)"/)[1]);   // "Analítico" (sem custo)
const comps = new Map();   // código → { desc, prof, aux, ins: Map(código → coeficiente) }
for (const r of ana) {
  const cod = r[1], tipo = r[2], item = r[3];
  if (!cod || !/^\d+$/.test(String(cod))) continue;
  if (!tipo) { comps.set(cod, { desc: sem(r[4] || ''), prof: 0, aux: 0, ins: new Map() }); continue; }
  const c = comps.get(cod); if (!c) continue;
  const k = parseFloat(r[6]); if (!(k > 0)) continue;
  if (tipo === 'COMPOSICAO' && r[5] === 'H' && /COM ENCARGOS/.test(sem(r[4] || ''))) {
    if (/AUXILIAR|AJUDANTE|SERVENTE/.test(sem(r[4]))) c.aux += k; else c.prof += k;
  } else if (tipo === 'INSUMO') c.ins.set(String(item), k);
}
const descIns = Object.fromEntries(rows.slice(head + 1).filter(r => r[1]).map(r => [String(r[1]), sem(r[2] || '')]));
const mediana = a => { const v = [...a].sort((x, y) => x - y), n = v.length; return n % 2 ? v[n >> 1] : (v[n / 2 - 1] + v[n / 2]) / 2; };
const prod = {};
for (const code of codes) {
  const pal = (descIns[code] || '').split(/[ ,]/)[0]; if (!pal) continue;
  const amostras = [];
  for (const c of comps.values()) {
    const k = c.ins.get(code);
    if (!k || !(c.prof + c.aux > 0) || /^KIT/.test(c.desc) || c.desc.split(/[ ,]/)[0] !== pal) continue;
    amostras.push([c.prof / k, c.aux / k]);
  }
  if (amostras.length) prod[code] = [+mediana(amostras.map(a => a[0])).toFixed(4), +mediana(amostras.map(a => a[1])).toFixed(4), amostras.length];
}
// custo horário com encargos (aba CSD, composições sem desoneração): encanador e auxiliar de encanador, por estado
const csd = sheetRows('CSD'), hc = csd.findIndex(r => r.some(v => /^C[óo]digo da/i.test(v || '')));
const csdUf = csd[hc - 1].findIndex(v => v === 'AC');   // linha acima do cabeçalho: siglas, com Custo e %AS por estado
const hora = {};
for (const r of csd.slice(hc + 1)) {
  const d = sem(r[2] || '');
  const k = /^ENCANADOR OU BOMBEIRO HIDRAULICO COM ENCARGOS/.test(d) ? 'prof' : /^AUXILIAR DE ENCANADOR OU BOMBEIRO HIDRAULICO COM ENCARGOS/.test(d) ? 'aux' : null;
  if (!k || hora[k]) continue;
  hora[k] = { cod: String(ana.find(a => a[2] === 'COMPOSICAO' && sem(a[4] || '') === d)?.[3] || ''), v: ufs.map((_, i) => { const p = parseFloat(r[csdUf + i * 2]); return isNaN(p) ? null : Math.round(p * 100) / 100; }) };
}
const missing = [...codes].filter(c => !ins[c]);
const out = `// Gerado por scripts/sinapi.mjs a partir de ${src.split(/[\\/]/).pop()} — não edite à mão.\n` +
  `// SINAPI (Caixa): relatório de preços de insumos, sem desoneração, preço mediano na capital de cada estado.\n` +
  `const SINAPI_PRECOS = ${JSON.stringify({ ref: mes, emissao, fonte: 'https://www.caixa.gov.br/site/Paginas/downloads.aspx#categoria_888', ufs, capitais, ins, prod, hora })};\n`;
writeFileSync(join(root, 'site', 'sinapi-precos.js'), out);
console.log(`Produtividade: ${Object.keys(prod).length} insumos com horas de mão de obra; custo horário: ${Object.keys(hora).join(', ')}`);
console.log(`SINAPI ${mes}: ${Object.keys(ins).length} insumos × ${ufs.length} estados → site/sinapi-precos.js (${(out.length / 1024).toFixed(0)} KB)`);
if (missing.length) console.log('Códigos das regras que não existem nesta edição:', missing.join(', '));
