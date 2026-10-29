// Apoio à atualização manual da seção Notícias (a cada 5 dias): busca notícias do setor no Google Notícias (RSS),
// descarta as que já estão em site/noticias.json e as fora do assunto, sugere categoria, estado e valor e grava
// as candidatas em estudos/noticias-candidatas.json (fora do site). A escolha, os resumos e a inclusão em
// site/noticias.json são feitos à mão, com revisão. Uso: node scripts/noticias.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';

const ARQ = 'site/noticias.json';
const SAIDA = 'estudos/noticias-candidatas.json';

// Buscas por setor. "when:6d" cobre os 5 dias e um de folga; as repetidas são descartadas depois.
const BUSCAS = [
  ['Saneamento', 'saneamento investimento OR obra OR adutora OR "estação de tratamento"'],
  ['Leilões e concessões', 'leilão OR concessão OR PPP água esgoto OR saneamento OR gás'],
  ['Construção e instalações prediais', '"instalações hidráulicas" OR "instalações prediais" OR "sistemas prediais" OR encanamento obra'],
  ['Construção e instalações prediais', '"materiais de construção" vendas OR Abramat OR "construção civil" hidráulica'],
  ['Indústria, óleo e gás', 'tubulação industrial OR "tubos de aço" OR gasoduto OR oleoduto OR refinaria tubulação'],
  ['Indústria, óleo e gás', 'Petrobras obra tubulação OR "plataforma" tubos OR "vapor industrial" caldeira'],
  ['Gás canalizado', '"gás natural" rede distribuição OR "gás canalizado" OR Comgás OR "gás encanado" expansão'],
  ['Incêndio', 'sprinklers OR hidrantes OR "combate a incêndio" norma OR "corpo de bombeiros" instrução técnica'],
  ['Climatização e aquecimento', '"água gelada" OR chiller OR "aquecimento solar" OR "bomba de calor" OR "aquecedor a gás" mercado'],
  ['Irrigação e agro', 'irrigação investimento OR "sistema de irrigação" OR "pivô central" OR "água no agro"'],
  ['Normas e regulação', 'ABNT "nova norma" OR "norma técnica" hidráulica OR tubos OR saneamento OR incêndio OR gás'],
  ['Feiras e eventos', 'Feicon OR Fenasan OR "Hydro Expo" OR "Expo Revestir" OR "feira" hidráulica OR saneamento OR construção'],
  ['Lançamentos e empresas', 'Tigre OR "Amanco Wavin" OR Docol OR Deca OR Krona OR Fortlev OR Tupy OR KSB OR Schneider OR Schulz lançamento OR fábrica OR investimento'],
  ['Lançamentos e empresas', 'lançamento tubos OR conexões OR válvulas OR bombas OR "metais sanitários" OR registro OR "caixa d\'água"'],
  ['Tecnologia e eficiência', '"água de reúso" OR dessalinização OR "perdas de água" OR hidrômetro inteligente OR "telemetria" água'],
];
const CATEGORIAS = [...new Set(BUSCAS.map(b => b[0])), 'Mercado'];

const UFS = { 'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM', 'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES', 'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso do Sul': 'MS', 'Mato Grosso': 'MT', 'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR', 'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN', 'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC', 'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO',
  'Sanepar': 'PR', 'Sabesp': 'SP', 'Copasa': 'MG', 'Corsan': 'RS', 'Casan': 'SC', 'Embasa': 'BA', 'Cedae': 'RJ', 'Compesa': 'PE', 'Cagece': 'CE', 'Caesb': 'DF', 'Saneago': 'GO', 'Cesan': 'ES', 'Sanesul': 'MS', 'Caern': 'RN', 'Cagepa': 'PB', 'Deso': 'SE', 'Casal': 'AL', 'Comgás': 'SP', 'Sulgás': 'RS', 'SCGás': 'SC', 'Compagas': 'PR', 'Gasmig': 'MG', 'Naturgy': 'RJ' };
const SIGLAS = Object.values(UFS);
// Termos do setor (sem marcas): uma notícia que só cita a marca ("tigre", "Schneider") não basta
const SETOR = /saneamento|água|esgoto|hidr[aá]ul|tubo|tubula|conex|válvula|bomba|adutora|reservat|estação de tratamento|ET[AE]|sprinkler|hidrante|bombeiro|norma|ABNT|drenagem|irriga|reúso|dessaliniz|gás|gasoduto|oleoduto|refinaria|caldeira|vapor|chiller|climatiza|aquec|instala[cç]|constru|metais sanit|louça|registro|caixa d/i;
const RELEVANTE = /saneamento|água|esgoto|hidr[aá]ul|tubo|tubula|conex|válvula|bomba|adutora|reservat|estação de tratamento|\bET[AE]\b|incêndio|sprinkler|hidrante|bombeiro|norma|ABNT|drenagem|irriga|reúso|dessaliniz|gás|gasoduto|oleoduto|refinaria|caldeira|vapor|chiller|climatiza|aquec|instala[cç]|constru|obra|feira|Feicon|Fenasan|Tigre|Amanco|Docol|Deca|Krona|Fortlev|Tupy|KSB|Schneider|Schulz|Sabesp|Sanepar|Petrobras/i;
const EXCLUI = /futebol|novela|BBB|horóscopo|celebridade|loteria|euros?\b|projecto|Moçambique|Angola|Portugal|Lisboa|Vietn|Kuwait|multad|reajuste|tarifa|despenca|ações|rompimento|falta d.água|interrup|desabastec|morre|morte|preso|polícia|acidente|incêndio (atinge|destr|em casa|em apartamento|em loja|em empresa|em estabelecimento)|incêndio florestal|queimada|aposta|LEGO|zagueiro|Sul-Americana|K-pop|previsão de chuva|temperatura|Feira de Santana|hospital|escola|inscrições abertas/i;
const FONTES_FORA = /Vietnam|XINHUA|O Mirante|Jornal Domingo|Notícias ao Minuto|Público|Observador|RTP|SIC Notícias|Expresso|Jornal de Notícias|Diário de Aveiro|Médio Tejo|Novum Canal|A Verdade|Instagram|Facebook|Demócrata|DECO Proteste/i;
const REGRAS = [ // classificação sem IA
  ['Leilões e concessões', /leil[aã]o|concess[aã]o|PPP|licita|edital|privatiz/i],
  ['Normas e regulação', /\bnorma|ABNT|regula|marco legal|STF|\blei\b|decreto|resolu|instrução técnica/i],
  ['Feiras e eventos', /(?<![-w])feiras?|Feicon|Fenasan|congresso|semin[aá]rio|expo/i],
  ['Incêndio', /inc[eê]ndio|sprinkler|hidrante|bombeiro/i],
  ['Gás canalizado', /g[aá]s natural|g[aá]s canalizado|g[aá]s encanado|Comg[aá]s|distribuidora de g[aá]s/i],
  ['Indústria, óleo e gás', /Petrobras|refinaria|gasoduto|oleoduto|industrial|caldeira|vapor/i],
  ['Climatização e aquecimento', /chiller|[aá]gua gelada|climatiza|aquecimento|aquecedor|bomba de calor/i],
  ['Irrigação e agro', /irriga|agro|piv[oô]/i],
  ['Lançamentos e empresas', /lan[cç]a|nova linha|novo produto|f[aá]brica|amplia produ|aquisi/i],
  ['Tecnologia e eficiência', /re[uú]so|dessaliniz|perdas de [aá]gua|tecnologia|telemetria|digital|intelig/i],
  ['Construção e instalações prediais', /constru|instala[cç]|predia|imobili/i],
];

const hoje = new Date();
const iso = d => d.toISOString().slice(0, 10);
const chave = t => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\W+/g, ' ').trim().slice(0, 70);
const ent = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/<!\[CDATA\[|\]\]>/g, '');

// Páginas do portal que podem ser sugeridas como leitura relacionada (lidas dos comparativos)
function paginasDoPortal() {
  const src = readFileSync('site/comparativos.js', 'utf8');
  const lista = [...src.matchAll(/\{ id: '([a-z0-9-]+)', tema: '[^']*', titulo: (['"])(.*?)\2/g)].map(m => ({ url: '/comparativos/' + m[1], titulo: m[3] }));
  return lista;
}

async function busca(q) {
  const url = 'https://news.google.com/rss/search?' + new URLSearchParams({ q: q + ' when:6d', hl: 'pt-BR', gl: 'BR', ceid: 'BR:pt-419' });
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (PipeSystem noticias)' } });
  if (!r.ok) throw new Error(`Google Notícias ${r.status} em "${q}"`);
  const xml = await r.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
    const g = tag => ent((it.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`)) || [, ''])[1]);
    let titulo = g('title').trim(); const fonte = g('source').trim();
    if (fonte && titulo.endsWith(' - ' + fonte)) titulo = titulo.slice(0, -(fonte.length + 3));
    return { titulo, link: g('link').trim(), data: iso(new Date(g('pubDate'))), fonte };
  });
}

function porRegras(n, catBusca, paginas) {
  const t = n.titulo;
  const uf = Object.entries(UFS).find(([k]) => new RegExp(`\\b${k}\\b`).test(t))?.[1] || '';
  const valor = (t.match(/R\$ ?[\d.,]+ ?(?:mil|milh[õo]es|milh[aã]o|bilh[õo]es|bilh[aã]o|bi|mi)\b/i) || [''])[0];
  const rel = paginas.find(p => {
    const id = p.url.split('/').pop();
    return (id === 'esgoto' && /esgoto|\bETE\b/i.test(t)) || (id === 'adutoras' && /adutora/i.test(t)) || (id === 'incendio' && /inc[eê]ndio|sprinkler|hidrante/i.test(t)) ||
      (id === 'gas' && /g[aá]s/i.test(t)) || (id === 'bombas-fluidos' && /bomba/i.test(t)) || (id === 'compressores' && /ar comprimido|compressor/i.test(t)) || (id === 'aquecimento' && /aquec/i.test(t));
  });
  return { categoria: REGRAS.find(([, rx]) => rx.test(t))?.[0] || catBusca, uf, valor, resumo: '',
    oportunidade: /leil[aã]o|licita|edital|obra|PPP|concess|amplia|expans/i.test(t), relacionado: rel ? rel.url : '' };
}

async function main() {
  const antigo = existsSync(ARQ) ? JSON.parse(readFileSync(ARQ, 'utf8')) : { itens: [] };
  const vistos = new Set(antigo.itens.flatMap(i => [i.link, chave(i.titulo)]));
  const paginas = paginasDoPortal();

  // 1. Busca e pré-filtro
  const cands = [];
  for (const [cat, q] of BUSCAS) {
    let res = [];
    try { res = await busca(q); } catch (e) { console.warn(e.message); continue; }
    for (const n of res) {
      const k = chave(n.titulo);
      if (vistos.has(n.link) || vistos.has(k) || !RELEVANTE.test(n.titulo) || !SETOR.test(n.titulo) || EXCLUI.test(n.titulo) || FONTES_FORA.test(n.fonte)) continue;
      vistos.add(n.link); vistos.add(k);
      cands.push({ ...n, catBusca: cat });
    }
    await new Promise(r => setTimeout(r, 800));
  }
  console.log(`${cands.length} candidatos novos`);

  // 2. Sugestões por regras; a seleção final é manual
  const sugestoes = cands.map(({ catBusca, ...n }) => ({ ...n, ...porRegras(n, catBusca, paginas) }))
    .sort((x, y) => y.data.localeCompare(x.data));
  mkdirSync('estudos', { recursive: true });
  writeFileSync(SAIDA, JSON.stringify({ coletado: iso(hoje), candidatas: sugestoes }, null, 1) + '\n');
  console.log(`${SAIDA}: ${sugestoes.length} candidatas para revisar`);
}

main().catch(e => { console.error(e); process.exit(1); });
