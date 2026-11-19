// Baixa da API pública do Comex Stat (MDIC) as importações dos NCMs das fichas (scripts/comex-ncm.mjs)
// e grava site/importacoes-dados.json, usado pelo Radar de Importações (/importacoes) e pelas fichas.
// Atualizar todo mês (o MDIC publica no início do mês seguinte):  node scripts/comex.mjs
import { writeFileSync } from 'node:fs';
import { COMEX_NCM } from './comex-ncm.mjs';

const API = 'https://api-comexstat.mdic.gov.br';
const ANO_INICIAL = 2022;
const espera = ms => new Promise(r => setTimeout(r, ms));

async function consulta(corpo, tentativa = 1) {
  const r = await fetch(`${API}/general?language=pt`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo) });
  if (!r.ok) {
    if (tentativa < 5) { await espera(3000 * tentativa); return consulta(corpo, tentativa + 1); }
    throw new Error(`Comex Stat respondeu ${r.status}`);
  }
  const j = await r.json();
  await espera(800);   // educação com a API pública
  return j.data.list;
}

const ncms = [...new Set(Object.values(COMEX_NCM).flatMap(m => m.ncm))].sort();
const lotes = []; for (let i = 0; i < ncms.length; i += 30) lotes.push(ncms.slice(i, i + 30));
const filtro = lote => [{ filter: 'ncm', values: lote }];
const ym = (a, m) => `${a}-${String(m).padStart(2, '0')}`;

const att = (await (await fetch(`${API}/general/dates/updated`)).json()).data;
const anoF = +att.year, mesF = +att.monthNumber;
console.log(`Comex Stat atualizado em ${att.updated}, dados até ${ym(anoF, mesF)}. ${ncms.length} NCMs.`);

// Série mensal (FOB, kg, CIF) de cada NCM desde ANO_INICIAL
const desc = {}, serie = {};
for (let ano = ANO_INICIAL; ano <= anoF; ano++) {
  for (const lote of lotes) {
    const l = await consulta({ flow: 'import', monthDetail: true, period: { from: ym(ano, 1), to: ym(ano, ano === anoF ? mesF : 12) },
      filters: filtro(lote), details: ['ncm'], metrics: ['metricFOB', 'metricKG', 'metricCIF'] });
    for (const x of l) { desc[x.coNcm] = x.ncm; (serie[x.coNcm] ||= []).push([ym(x.year, +x.monthNumber), +x.metricFOB, +x.metricKG, +x.metricCIF]); }
  }
  console.log(`  série ${ano} ok`);
}
for (const k in serie) serie[k].sort((a, b) => a[0].localeCompare(b[0]));

// Últimos 12 meses por país de origem, estado do importador, local de entrada (URF) e via de transporte.
// A API só agrega dentro de um mesmo ano: com a janela atravessando o ano, soma as duas partes.
const ini = mesF === 12 ? [anoF, 1] : [anoF - 1, mesF + 1];
const periodos = ini[0] === anoF ? [[ym(anoF, 1), ym(anoF, 12)]] : [[ym(ini[0], ini[1]), ym(ini[0], 12)], [ym(anoF, 1), ym(anoF, mesF)]];
const quebras = {};
for (const [campo, chave] of [['country', 'pais'], ['state', 'uf'], ['urf', 'urf'], ['via', 'via']]) {
  const acc = {};
  for (const [from, to] of periodos) for (const lote of lotes) {
    const l = await consulta({ flow: 'import', monthDetail: false, period: { from, to }, filters: filtro(lote), details: ['ncm', campo], metrics: ['metricFOB', 'metricKG'] });
    for (const x of l) { const n = x[campo]; const a = ((acc[x.coNcm] ||= {})[n] ||= [0, 0]); a[0] += +x.metricFOB; a[1] += +x.metricKG; }
  }
  quebras[chave] = Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, Object.entries(v).map(([n, [f, kg]]) => [n, f, kg]).filter(r => r[1] > 0).sort((a, b) => b[1] - a[1])]));
  console.log(`  ${chave} ok`);
}
// Nome do local de entrada sem o código: "0817800 - PORTO DE SANTOS" -> "Porto de Santos"
const titulo = s => s.toLowerCase().replace(/(^|[\s(/-])([a-zà-ú])/g, (m, p, c) => p + c.toUpperCase()).replace(/\b(De|Da|Do|Das|Dos|E)\b/g, w => w.toLowerCase());
const limpaUrf = n => titulo(n.replace(/^\d+\s*-\s*/, '').replace(/^(IRF|ALF|DRF)\s*-\s*/, '$1 ')).replace(/^(Irf|Alf|Drf)\b/, s => s.toUpperCase());
const VIAS = { MARITIMA: 'Marítima', AEREA: 'Aérea', RODOVIARIA: 'Rodoviária', FERROVIARIA: 'Ferroviária', FLUVIAL: 'Fluvial', LACUSTRE: 'Lacustre', POSTAL: 'Postal' };
for (const k in quebras.urf) quebras.urf[k] = quebras.urf[k].map(([n, f, kg]) => [limpaUrf(n), f, kg]);
for (const k in quebras.via) quebras.via[k] = quebras.via[k].filter(([n]) => !/FICTA/i.test(n)).map(([n, f, kg]) => [VIAS[n] || titulo(n), f, kg]);

const dados = {
  fonte: 'Comex Stat (MDIC), API pública',
  atualizado: att.updated, ultimoMes: ym(anoF, mesF), janela: periodos.map(p => p.join('/')),
  materiais: COMEX_NCM, ncm: desc, serie, ...quebras,
};
writeFileSync('site/importacoes-dados.json', JSON.stringify(dados));
const sem = ncms.filter(n => !serie[n]);
console.log(`Gravado site/importacoes-dados.json${sem.length ? ` · sem importação no período: ${sem.join(', ')}` : ''}`);
