// Alíquotas de importação dos NCMs do Radar de Importações e cotação do dólar, para o simulador de custo nacionalizado.
// Gera site/importacoes-tarifas.json a partir das fontes oficiais:
//   - Imposto de Importação: anexos da Resolução Gecex 272/2021 (TEC e exceções brasileiras), página "Tarifas vigentes" do MDIC
//   - IPI: TIPI da Receita Federal (planilha consolidada)
//   - Dólar: PTAX de venda do Banco Central (último dia útil)
// Uso: node scripts/tarifas.mjs   (rode junto com scripts/comex.mjs, ou quando a Camex/Receita mudarem alíquotas)
import { writeFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { COMEX_NCM } from './comex-ncm.mjs';

const PAGINA_TEC = 'https://www.gov.br/mdic/pt-br/assuntos/camex/se-camex/strat/tarifas/vigentes';
const TIPI = 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/documentos-e-arquivos/tipi.xlsx/@@download/file';

// ---------- leitor mínimo de .xlsx (ZIP + XML), sem dependências ----------
function unzip(buf) {
  let e = buf.length - 22;
  while (buf.readUInt32LE(e) !== 0x06054b50) e--;
  const n = buf.readUInt16LE(e + 10), files = {};
  for (let i = 0, o = buf.readUInt32LE(e + 16); i < n; i++) {
    const method = buf.readUInt16LE(o + 10), size = buf.readUInt32LE(o + 20), nl = buf.readUInt16LE(o + 28);
    const extra = buf.readUInt16LE(o + 30), comment = buf.readUInt16LE(o + 32), local = buf.readUInt32LE(o + 42);
    const name = buf.toString('utf8', o + 46, o + 46 + nl);
    files[name] = () => { const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28), data = buf.subarray(start, start + size); return method === 0 ? data : inflateRawSync(data); };
    o += 46 + nl + extra + comment;
  }
  return files;
}
const xml = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const col = ref => [...ref].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
function planilha(buf) {
  const z = unzip(buf), wb = z['xl/workbook.xml']().toString(), rels = z['xl/_rels/workbook.xml.rels']().toString();
  const strs = z['xl/sharedStrings.xml'] ? [...z['xl/sharedStrings.xml']().toString().matchAll(/<si>([\s\S]*?)<\/si>/g)].map(m => xml([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]).join(''))) : [];
  const abas = [...wb.matchAll(/<sheet [^>]*?name="([^"]+)"[^>]*?r:id="([^"]+)"/g)].map(m => [xml(m[1]), m[2]]);
  return prefixo => {
    const aba = abas.find(([nome]) => nome.startsWith(prefixo));
    if (!aba) throw new Error(`Aba "${prefixo}" não encontrada`);
    const target = rels.match(new RegExp(`Id="${aba[1]}"[^>]*Target="([^"]+)"`))?.[1] || rels.match(new RegExp(`Target="([^"]+)"[^>]*Id="${aba[1]}"`))[1];
    return [...z['xl/' + target.replace(/^\/?xl\//, '')]().toString().matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map(m => {
      const r = [];
      for (const c of m[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const v = c[3]?.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? c[3]?.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
        if (v != null) r[col(c[1])] = /t="s"/.test(c[2]) ? strs[+v] : xml(v);
      }
      return r;
    });
  };
}
const baixa = async url => { const r = await fetch(url); if (!r.ok) throw new Error(`${url} respondeu ${r.status}`); return Buffer.from(await r.arrayBuffer()); };
const fmt = n => `${n.slice(0, 4)}.${n.slice(4, 6)}.${n.slice(6)}`;
const num = v => { const x = parseFloat(String(v ?? '').replace(',', '.')); return Number.isFinite(x) ? x : null; };
const semEx = v => v == null || /^\s*-?\s*$/.test(String(v));   // linha do código inteiro, não de um "Ex" específico

const ncms = [...new Set(Object.values(COMEX_NCM).flatMap(m => m.ncm))];
const alvo = new Set(ncms.map(fmt));

// ---------- Imposto de Importação ----------
const pagina = await (await fetch(PAGINA_TEC)).text();
const urlTec = pagina.match(/https:\/\/[^"]+anexos-i-a-x-resolucao-gecex-272-21\.xlsx/i)?.[0];
if (!urlTec) throw new Error('Link da planilha da TEC não encontrado na página de tarifas vigentes do MDIC');
const tec = planilha(await baixa(urlTec));
const atualizadoAte = rows => rows.slice(0, 3).map(r => r[0]).find(v => /Atualizad/i.test(v || ''))?.replace(/^\*\s*/, '').trim();
const ii = {};
// Anexo I: alíquota da TEC (ex.: "12,6BK")
const a1 = tec('Anexo I -');
for (const r of a1) { const c = String(r[0] || '').trim(); if (alvo.has(c)) ii[c] = { tec: num(r[2]), aplicada: num(r[2]), base: 'TEC (Anexo I)' }; }
// Anexo II: alíquota aplicada no Brasil, quando diferente da TEC
for (const r of tec('Anexo II -')) { const c = String(r[0] || '').trim(); if (alvo.has(c) && num(r[5]) != null) Object.assign(ii[c] ||= {}, { aplicada: num(r[5]), base: 'Alíquota aplicada no Brasil (Anexo II)' }); }
// Listas de exceção, na ordem em que se sobrepõem: LEBIT/BK, LETEC, LETEC+ e, por último, elevações DCC.
// Só valem as linhas do NCM inteiro, sem cota e em vigor hoje (linhas de "Ex" específico ou com cota ficam de fora).
const hoje = new Date();
const dataXls = v => { const x = num(v); return x && x > 20000 ? new Date(Date.UTC(1899, 11, 30) + x * 864e5) : null; };
for (const [aba, rotulo] of [['Anexo VI -', 'LEBIT/BK (Anexo VI)'], ['Anexo V -', 'LETEC (Anexo V)'], ['Anexo XI -', 'LETEC+ (Anexo XI)'], ['Anexo IX -', 'DCC (Anexo IX)']]) {
  const rows = tec(aba), h = rows.findIndex(r => String(r[0] || '').trim() === 'NCM');
  if (h < 0) continue;
  const cab = rows[h].map(v => String(v || '').toLowerCase());
  const cAliq = cab.findIndex(v => v.startsWith('alíquota')), cEx = cab.findIndex(v => v.includes('ex')), cQuota = cab.findIndex(v => v === 'quota');
  const cIni = cab.findIndex(v => v.startsWith('início')), cFim = cab.findIndex(v => v.startsWith('término'));
  for (const r of rows.slice(h + 1)) {
    const c = String(r[0] || '').trim();
    if (!alvo.has(c) || !semEx(r[cEx]) || (cQuota >= 0 && !semEx(r[cQuota]))) continue;
    const ini = dataXls(r[cIni]), fim = dataXls(r[cFim]);
    if ((ini && ini > hoje) || (fim && fim < hoje) || num(r[cAliq]) == null) continue;
    Object.assign(ii[c] ||= {}, { aplicada: num(r[cAliq]), base: rotulo });
  }
}
const atualizacaoTec = atualizadoAte(a1);

// ---------- IPI ----------
const tipiRows = planilha(await baixa(TIPI))('Tabela');
const ipi = {};
let atual = null;
for (const r of tipiRows) {
  const c = String(r[0] || '').trim();
  if (/^\d{4}\.\d{2}\.\d{2}$/.test(c)) atual = c;
  if (alvo.has(c) && semEx(r[1])) ipi[c] = String(r[3] || '').trim().toUpperCase() === 'NT' ? 0 : num(r[3]);
}
const atualizacaoTipi = String(tipiRows.slice(0, 4).map(r => r[0]).find(v => /^\s*Atualiza/i.test(v || '')) || '').trim().split('\n').filter(Boolean).pop();

// ---------- Dólar (PTAX de venda) ----------
const d = new Date(), mdY = x => `${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}-${x.getFullYear()}`;
const ini = new Date(d - 15 * 864e5);
const ptaxUrl = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${mdY(ini)}'&@dataFinalCotacao='${mdY(d)}'&$format=json`;
const cot = (await (await fetch(ptaxUrl)).json()).value.at(-1);

// ---------- grava ----------
const saida = { fonteII: `Resolução Gecex 272/2021 e anexos (${atualizacaoTec || 'tarifas vigentes'})`, urlII: PAGINA_TEC,
  fonteIPI: `TIPI, Decreto 11.158/2022 (${atualizacaoTipi || 'consolidada'})`, urlIPI: 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/documentos-e-arquivos/tipi',
  ptax: { valor: cot.cotacaoVenda, data: cot.dataHoraCotacao.slice(0, 10) }, ncm: {} };
const faltam = [];
for (const n of ncms) {
  const f = fmt(n), t = ii[f];
  if (!t || ipi[f] === undefined) faltam.push(f);
  saida.ncm[n] = { ii: t?.aplicada ?? null, tec: t?.tec ?? null, base: t?.base ?? null, ipi: ipi[f] ?? null };
}
writeFileSync('site/importacoes-tarifas.json', JSON.stringify(saida));
const dif = ncms.filter(n => saida.ncm[n].ii != null && saida.ncm[n].ii !== saida.ncm[n].tec);
console.log(`Gravado site/importacoes-tarifas.json · PTAX R$ ${cot.cotacaoVenda} (${saida.ptax.data}) · ${ncms.length} NCMs`);
console.log(`Alíquota aplicada diferente da TEC: ${dif.map(n => `${fmt(n)} ${saida.ncm[n].tec}→${saida.ncm[n].ii}% (${saida.ncm[n].base})`).join('; ') || 'nenhuma'}`);
if (faltam.length) console.log(`Sem alíquota encontrada (II ou IPI): ${faltam.join(', ')}`);
