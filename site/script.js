// Largura e altura reais das fotos (img-sizes.js é gerado no build), para a página não "pular" enquanto elas carregam
const imgDims = src => { const d = (window.IMG_SIZES || {})[src]; return d ? ` width="${d[0]}" height="${d[1]}"` : ''; };
// Fotos com caminho a partir da raiz: com a ficha aberta o endereço é /materiais/..., e "img/..." viraria /materiais/img/...
const imgUrl = src => /^(https?:|data:|\/)/.test(src) ? src : '/' + src;

// Para onde os formulários (contato e artigos) enviam os dados: a função api/enviar.js, que manda
// tudo (com o arquivo anexado) para info@pipesystem.com.br pelo Resend. Se ficar vazio, o envio
// volta a abrir o programa de e-mail do visitante, já preenchido.
const FORMS_ENDPOINT = '/api/enviar';
const FORM_POST_URL = FORMS_ENDPOINT || (/\.netlify\.app$/.test(location.hostname) ? '/' : '');
const postForm = data => fetch(FORM_POST_URL, { method: 'POST', body: data, headers: FORMS_ENDPOINT ? { Accept: 'application/json' } : {} });

// Menu mobile
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
// (Os submenus de todos os itens são montados no fim deste arquivo — "Submenus do menu superior")

document.getElementById('year').textContent = new Date().getFullYear();

// Contadores
const fmt = n => n.toLocaleString('pt-BR');
const counters = document.querySelectorAll('[data-count]');
const countObs = new IntersectionObserver(entries => {
  entries.forEach(({ isIntersecting, target }) => {
    if (!isIntersecting) return;
    countObs.unobserve(target);
    const end = +target.dataset.count, t0 = performance.now(), dur = 1400;
    const pre = target.dataset.prefix ?? '+', suf = target.dataset.suffix ?? '';
    const step = t => {
      const p = Math.min((t - t0) / dur, 1);
      target.textContent = (p === 1 ? pre : pre.replace('+', '')) + fmt(Math.round(end * (1 - Math.pow(1 - p, 3)))) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
});
counters.forEach(c => countObs.observe(c));

// Catálogo
const cats = ['Todos', ...new Set(CATALOG.map(c => c.cat))];
let activeCat = 'Todos';
const catEl = document.getElementById('catalog');
const searchEl = document.getElementById('catSearch');
const emptyEl = document.getElementById('catEmpty');
const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Busca tolerante: ignora acentos, maiúsculas, ordem das palavras e plural (válvulas = válvula,
// conexões = conexão) e aceita códigos com ou sem espaço (NBR5626 = NBR 5626)
const STOP = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'a', 'o', 'as', 'os', 'em', 'para', 'com', 'por', 'um', 'uma', 'no', 'na']);
const stem = w => w.length > 4 ? w.replace(/(oes|aes|ao)$/, '').replace(/(es|s)$/, '') : w;
function queryTerms(q) {
  const words = norm(q).replace(/[^a-z0-9.\-/ ]/g, ' ').split(/\s+/).filter(Boolean);
  const terms = words.filter(w => !STOP.has(w)).map(stem);
  return terms.length ? terms : words;
}
function matchText(text, terms) {
  if (!terms.length) return true;
  const t = norm(text), compact = t.replace(/[\s.\-]/g, '');
  return terms.every(w => t.includes(w) || compact.includes(w.replace(/[.\-]/g, '')));
}

searchEl.addEventListener('input', renderCatalog);

// Foto real do item do catálogo (própria ou reaproveitada da ficha técnica em products.js)
function materialPhoto(m) {
  const ref = MATERIAL_PHOTOS[m.id];
  if (Array.isArray(ref)) return (PRODUCTS.find(p => p.id === ref[0])?.fotos || [])[ref[1]];
  return ref;
}

function renderCatalog() {
  const terms = queryTerms(searchEl.value);
  const items = CATALOG.filter(m => (activeCat === 'Todos' || m.cat === activeCat) &&
    matchText([m.cat, m.name, m.apps, m.desc, ...m.normas, ...m.specs.flat()].join(' '), terms));
  catEl.innerHTML = items.map(m => {
    const f = materialPhoto(m);
    return `<a class="item" href="/materiais/${m.id.slice(4)}" data-sheet="${m.id}">
      <figure class="item__art${f ? ' item__art--foto' : ''}" style="--m:${m.tone}">${f
        ? `<img src="${imgUrl(f.src)}" alt="${f.alt}"${imgDims(f.src)} loading="lazy"${f.inteira ? ' class="inteira"' : ''}>`
        : `<svg viewBox="0 0 200 120" aria-hidden="true">${MATERIAL_ART[m.art](m.tone, m.tone2)}</svg>`}</figure>
      <small>${m.cat}</small><h3>${m.name}</h3><p>${m.apps}</p><em>Dados técnicos →</em>
    </a>`;
  }).join('');
  emptyEl.hidden = items.length > 0;
}
renderCatalog();

function searchCatalog(q) {
  activeCat = 'Todos';
  searchEl.value = q;
  renderCatalog();
}
document.querySelectorAll('[data-q]').forEach(a => a.addEventListener('click', () => searchCatalog(a.dataset.q)));

// Fichas técnicas (products.js): o antigo guia de produtos agora aparece dentro dos itens do catálogo
const productById = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const materialOf = id => MATERIAL_OF_PRODUCT[id] || id;   // endereço antigo de produto -> item do catálogo

const sheet = document.getElementById('prodSheet');
const sheetBody = document.getElementById('sheetBody');
const list = items => items.map(i => `<li>${linkNorms(i)}</li>`).join('');

// Sistemas de aplicação
const systemById = Object.fromEntries(SYSTEMS.map(s => [s.id, s]));
document.getElementById('systems').innerHTML = SYSTEMS.map(s =>
  `<a class="sys" href="/sistemas/${s.id.slice(4)}" data-sheet="${s.id}"><span class="sys__dot" style="--c:${s.color}"></span>${s.name}<span class="sys__more" aria-hidden="true">→</span></a>`).join('');

// Galeria de fotos reais com créditos (licenças livres exigem a atribuição)
// zoom (padrão): clicar na foto abre a imagem ampliada (lightbox.js)
function fotosHTML(fotos, titulo = '', zoom = true) {
  if (!fotos) return '';
  return `<figure class="pfotos${zoom ? ' pfotos--zoom' : ''}">${titulo ? `<h4>${titulo}</h4>` : ''}
      <div class="pfotos__grid">${fotos.map(f => `<div class="pfotos__item"${zoom ? ' tabindex="0" role="button" aria-label="Ampliar foto: ' + f.legenda + '"' : ''}><img src="${imgUrl(f.src)}" alt="${f.alt}"${imgDims(f.src)} loading="lazy"><span>${f.legenda}</span></div>`).join('')}</div>
      <figcaption>Fotos: ${fotos.filter((f, i, a) => a.findIndex(x => x.autor === f.autor && x.licenca === f.licenca) === i).map(f => `<a href="${f.fonte}" target="_blank" rel="noopener noreferrer" class="notranslate" translate="no">${f.autor}</a> (<a href="${f.licUrl}" target="_blank" rel="noopener noreferrer">${f.licenca}</a>)`).join(', ')}, via Wikimedia Commons</figcaption>
    </figure>`;
}

// Tabelas técnicas da ficha (ex.: comparativo de válvulas). Colunas listadas em "estrelas" recebem
// uma nota de 0 a 5: 0 vira "—" e as demais viram estrelas.
function tabelasHTML(tabelas) {
  if (!tabelas) return '';
  const cell = (t, v, i) => {
    if (!(t.estrelas || []).includes(i)) return `<td>${linkNorms(v)}</td>`;
    return v ? `<td class="ptable__stars" aria-label="${v} de 5"><span aria-hidden="true">${'★'.repeat(v)}</span></td>` : '<td class="ptable__na" aria-label="não se aplica">—</td>';
  };
  return tabelas.map(t => `<section class="ptable">
      <h4>${t.titulo}</h4>
      <div class="ptable__wrap" tabindex="0" role="region" aria-label="${t.titulo}">
        <table><thead><tr>${t.colunas.map((c, i) => `<th scope="col"${(t.estrelas || []).includes(i) ? ' class="ptable__c"' : ''}>${c}</th>`).join('')}</tr></thead>
        <tbody>${t.linhas.map(l => `<tr>${l.map((v, i) => i === 0 ? `<th scope="row">${v}</th>` : cell(t, v, i)).join('')}</tr>`).join('')}</tbody></table>
      </div>
      ${t.nota ? `<p class="ptable__note">${linkNorms(t.nota)}</p>` : ''}
    </section>`).join('');
}

function renderSystem(s) {
  sheetBody.innerHTML = `
    <div class="sheet__head"><span class="sys__dot sys__dot--lg" style="--c:${s.color}"></span>
      <div><p class="eyebrow">Sistema hidráulico</p><h3 id="sheetTitle">${s.name}</h3></div></div>
    ${revisaoHTML(s)}
    <figure class="sysfig" style="--c:${s.color}">
      <svg viewBox="0 0 320 170" role="img" aria-label="Esquema ilustrativo: ${s.name}">${s.svg}</svg>
      <figcaption>Esquema ilustrativo, sem escala</figcaption>
    </figure>
    ${fotosHTML(SYSTEM_PHOTOS[s.id], 'Instalações reais')}
    <p class="sheet__desc">${linkNorms(s.desc)}</p>
    <div class="prod__cols">
      <div><h4>Componentes principais</h4><ul>${list(s.componentes)}</ul></div>
      <div><h4>Pontos de atenção</h4><ul>${list(s.cuidados)}</ul></div>
    </div>
    <h4>Normas de referência</h4>
    <p class="tags tags--links">${normTags(s.normas)}</p>
    <p class="tags__note">Clique na norma para ver o resumo ou comprar no site oficial.</p>
    <h4>Produtos e materiais usados</h4>
    <p class="relprod">${s.produtos.map(id => materialById[materialOf(id)]).filter(Boolean).map(m => `<a href="/materiais/${m.id.slice(4)}" data-sheet="${m.id}">${m.name}</a>`).join('')}</p>
    <div class="sheet__actions">
      <a href="#contato" class="btn" data-subject="Consulta técnica" data-question="Pergunta sobre ${s.name}: ">Fazer uma pergunta</a>
      <a href="#contato" class="btn btn--ghost" data-subject="Cotação de materiais" data-question="Cotação para ${s.name}: ">Solicitar cotação</a>
    </div>`;
  // Fluxo animado sobre as tubulações do esquema
  sheetBody.querySelectorAll('.sysfig .p, .sysfig .p2, .sysfig .pe').forEach(p => {
    const f = p.cloneNode();
    f.setAttribute('class', 'flowline');
    p.after(f);
  });
}

// Catálogo de materiais
const materialById = Object.fromEntries(CATALOG.map(m => [m.id, m]));

function renderMaterial(m) {
  // ficha técnica completa (fotos, tipos, como escolher, tabelas): do antigo guia (products.js) ou do próprio item do catálogo
  const p = productById[m.rel] || (m.tipos ? { tipos: m.tipos, escolha: m.escolha || [], normas: [] } : null);
  const veja = materialById[m.veja];   // item principal que traz a visão geral (ex.: comparativo de válvulas)
  const normas = [...new Set([...m.normas, ...(p ? p.normas : [])])];
  const fabs = MANUFACTURERS[m.id] || [];
  const importers = fabs.length > 0 && fabs.every(f => f[2] === 'M'); // lista só de importadores
  const foto = materialPhoto(m);
  sheetBody.innerHTML = `
    <div class="sheet__head"><div><p class="eyebrow">Catálogo · ${m.cat}</p><h3 id="sheetTitle">${m.name}</h3></div></div>
    ${revisaoHTML(m)}
    ${p && p.fotos ? fotosHTML(p.fotos) : foto ? `<figure class="matfig matfig--foto matfig--zoom" tabindex="0" role="button" aria-label="Ampliar foto: ${foto.legenda}" data-legenda="${foto.legenda}">
      <img src="${imgUrl(foto.src)}" alt="${foto.alt}"${imgDims(foto.src)}${foto.inteira ? ' class="inteira"' : ''}>
      <figcaption>${foto.legenda} · Foto: <a href="${foto.fonte}" target="_blank" rel="noopener noreferrer" class="notranslate" translate="no">${foto.autor}</a> (<a href="${foto.licUrl}" target="_blank" rel="noopener noreferrer">${foto.licenca}</a>), via Wikimedia Commons</figcaption>
    </figure>` : `<figure class="matfig" style="--m:${m.tone}">
      <svg viewBox="0 0 200 120" role="img" aria-label="Ilustração: ${m.name}">${MATERIAL_ART[m.art](m.tone, m.tone2)}</svg>
      <figcaption>Ilustração representativa</figcaption>
    </figure>`}
    <p class="sheet__desc">${linkNorms(m.desc)}</p>
    ${p ? tabelasHTML(p.tabelas) : ''}
    <h4>Dados técnicos</h4>
    <table class="specs"><tbody>${m.specs.map(([k, v]) => `<tr><th>${k}</th><td>${linkNorms(v)}</td></tr>`).join('')}</tbody></table>
    ${p ? `<div class="prod__cols">
      <div><h4>Tipos</h4><ul>${list(p.tipos)}</ul></div>
      <div><h4>Como escolher</h4><ul>${list(p.escolha)}</ul></div>
    </div>` : ''}
    <h4>Aplicações</h4><p class="sheet__desc">${linkNorms(m.apps)}.</p>
    <h4>Normas de referência</h4>
    <p class="tags tags--links">${normTags(normas)}</p>
    <p class="tags__note">Clique na norma para ver o resumo ou comprar no site oficial.</p>
    ${veja ? `<p class="relprod"><a href="/materiais/${veja.id.slice(4)}" data-sheet="${veja.id}">Veja também: ${veja.name} →</a></p>` : ''}
    ${fabs.length ? `<h4>${importers ? 'Importadores' : fabs.some(f => f[2] === 'M') ? 'Fabricantes e importadores' : 'Fabricantes'}</h4>
    <ul class="fabs">${fabs.map(([n, u, o]) => `<li>${u ? `<a href="${u}" target="_blank" rel="noopener noreferrer">
      <span class="fabs__name notranslate" translate="no">${n}</span><span class="fabs__site notranslate" translate="no">${new URL(u).hostname.replace(/^www\./, '')} ↗</span></a>`
      : `<span class="fabs__nolink"><span class="fabs__name notranslate" translate="no">${n}</span><span class="fabs__site">site em breve</span></span>`}
      <span class="fabs__tag fabs__tag--${o}">${{ N: 'Nacional', I: 'Internacional', M: 'Importador' }[o]}</span></li>`).join('')}</ul>
    <p class="fabs__note">Lista indicativa, sem vínculo comercial com a PipeSystem. Sua empresa ${importers ? 'importa ou distribui' : fabs.some(f => f[2] === 'M') ? 'fabrica ou importa' : 'fabrica'} este produto? <a href="#anuncie">Anuncie aqui</a>.</p>` : ''}
    <div class="sheet__actions">
      <a href="#contato" class="btn" data-subject="Cotação de materiais" data-question="Cotação de ${m.name}: (informe diâmetros, quantidades e local de entrega) ">Solicitar cotação</a>
      <a href="#contato" class="btn btn--ghost" data-subject="Consulta técnica" data-question="Consulta sobre ${m.name}: ">Consulta técnica</a>
    </div>`;
}

function openProduct(id) {
  const s = systemById[id], m = materialById[id];
  if (s || m) {
    s ? renderSystem(s) : renderMaterial(m);
    sheet.classList.toggle('sheet--wide', !!(m && productById[m.rel] && productById[m.rel].tabelas));
    if (!sheet.open) sheet.showModal();
    setSheetTitle(id);
    sheet.scrollTop = 0;
    if (!/^\/(sistemas|materiais)\/./.test(location.pathname)) sheet.dataset.back = location.pathname + location.search;
    history.replaceState(null, '', sheetPath(id));   // endereço real da ficha (ex.: /materiais/bombas)
    return;
  }
  if (productById[id]) openProduct(materialOf(id));   // links antigos de produto (/produtos/...)
}
// Título da aba do navegador acompanha a ficha aberta (volta ao original ao fechar)
const BASE_TITLE = document.title;
function setSheetTitle(id) {
  const t = document.getElementById('sheetTitle'); if (t) document.title = t.textContent + ' — PipeSystem';
  // link para a página própria da ficha (endereço para compartilhar)
  const path = sheetPath(id);
  sheetBody.insertAdjacentHTML('beforeend', `<p class="sheet__perma"><a href="${path}">🔗 Página desta ficha (para compartilhar)</a></p>`);
}
const closeSheet = () => sheet.open && sheet.close();
sheet.querySelector('.sheet__close').addEventListener('click', closeSheet);
sheet.addEventListener('click', e => {
  if (e.target === sheet) closeSheet(); // clique fora da ficha
  const a = e.target.closest('a[href^="#"]');
  if (a && !hasSheet(a.getAttribute('href').slice(1))) closeSheet(); // links para seções da página
});
sheet.addEventListener('close', () => {
  document.title = BASE_TITLE;
  history.replaceState(null, '', sheet.dataset.back || '/');   // volta ao endereço de onde a ficha foi aberta
});
// Endereço próprio de cada ficha (as páginas são geradas no build: /sistemas, /materiais)
function sheetPath(id) {
  return systemById[id] ? '/sistemas/' + id.slice(4) : '/materiais/' + id.slice(4);
}

// Qualquer link para um produto, sistema ou material (menu, cartões, fichas) abre a ficha
document.addEventListener('click', e => {
  const a = e.target.closest('a[data-sheet]');
  if (!a || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openProduct(a.dataset.sheet);
});
const hasSheet = id => productById[id] || systemById[id] || materialById[id];
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || !hasSheet(a.getAttribute('href').slice(1))) return;
  e.preventDefault();
  openProduct(a.getAttribute('href').slice(1));
});
window.addEventListener('hashchange', () => openProduct(location.hash.slice(1)));
openProduct(location.hash.slice(1));

// Hazen-Williams
const hw = ['hwQ', 'hwD', 'hwL', 'hwC'].map(id => document.getElementById(id));
const num = (n, d = 2) => n.toLocaleString('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: d });
function calcHW() {
  const [Q, D, L, C] = hw.map(el => parseFloat(el.value));
  const out = { hf: '—', j: '—', v: '—' };
  const hint = document.getElementById('hwHint');
  hint.textContent = ''; hint.classList.remove('warn');
  if (Q > 0 && D > 0 && L >= 0 && C > 0) {
    const q = Q / 1000, d = D / 1000;
    const J = 10.67 * Math.pow(q, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.87)); // m/m
    const v = 4 * q / (Math.PI * d * d);
    out.hf = `${num(J * L)} mca`;
    out.j = `${num(J * 100)} m/100m`;
    out.v = `${num(v)} m/s`;
    if (v > 3) { hint.textContent = 'Velocidade acima de 3 m/s: risco de ruído e golpe de aríete. Considere aumentar o diâmetro.'; hint.classList.add('warn'); }
    else if (v < 0.5) hint.textContent = 'Velocidade baixa: o diâmetro pode estar superdimensionado.';
    else hint.textContent = 'Velocidade dentro da faixa usual para instalações prediais.';
  }
  document.getElementById('hwHf').textContent = out.hf;
  document.getElementById('hwJ').textContent = out.j;
  document.getElementById('hwV').textContent = out.v;
}
hw.forEach(el => el.addEventListener('input', calcHW));
calcHW();

// Conversão de unidades (fator para unidade base)
const units = {
  pressao: { bar: 1, psi: 0.0689476, kPa: 0.01, 'mca': 0.0980665, 'kgf/cm²': 0.980665, atm: 1.01325 },
  vazao: { 'L/s': 1, 'm³/h': 1 / 3.6, 'L/min': 1 / 60, 'gpm (US)': 0.0630902 },
  comprimento: { mm: 1, cm: 10, m: 1000, 'pol (")': 25.4, 'pé (ft)': 304.8 },
};
let convKind = 'pressao';
const convFrom = document.getElementById('convFrom');
const convVal = document.getElementById('convVal');
const convOut = document.getElementById('convOut');
function fillUnits() {
  convFrom.innerHTML = Object.keys(units[convKind]).map(u => `<option>${u}</option>`).join('');
  calcConv();
}
function calcConv() {
  const map = units[convKind], v = parseFloat(convVal.value);
  if (isNaN(v)) { convOut.innerHTML = ''; return; }
  const base = v * map[convFrom.value];
  convOut.innerHTML = Object.entries(map).filter(([u]) => u !== convFrom.value)
    .map(([u, f]) => `<li><span>${u}</span><b>${(base / f).toLocaleString('pt-BR', { maximumSignificantDigits: 5 })}</b></li>`).join('');
}
document.getElementById('convTabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  convKind = b.dataset.k;
  document.querySelectorAll('#convTabs button').forEach(x => x.classList.toggle('is-on', x === b));
  fillUnits();
});
convFrom.addEventListener('change', calcConv);
convVal.addEventListener('input', calcConv);
fillUnits();

// Dimensionamento de água fria (NBR 5626): diâmetro pela velocidade máxima, perda por Fair-Whipple-Hsiao
const dimPipes = {
  pvc: [['20 mm (1/2")', 17], ['25 mm (3/4")', 21.6], ['32 mm (1")', 27.8], ['40 mm (1 1/4")', 35.2], ['50 mm (1 1/2")', 44], ['60 mm (2")', 53.4], ['75 mm (2 1/2")', 66.6], ['85 mm (3")', 75.6], ['110 mm (4")', 97.8]],
  cobre: [['15 mm', 14], ['22 mm', 20.8], ['28 mm', 26.8], ['35 mm', 33.6], ['42 mm', 40.4], ['54 mm', 52.2], ['66 mm', 64.7], ['79 mm', 77], ['104 mm', 102.4]],
  // PPR: PN 20 até 25 mm e PN 12 a partir de 32 mm (água fria)
  ppr: [['20 mm (1/2")', 13.2], ['25 mm (3/4")', 16.6], ['32 mm (1")', 26.2], ['40 mm (1 1/4")', 32.6], ['50 mm (1 1/2")', 40.8], ['63 mm (2")', 51.4], ['75 mm (2 1/2")', 61.4], ['90 mm (3")', 73.6], ['110 mm (4")', 90]],
  aco: [['1/2" (DN 15)', 16], ['3/4" (DN 20)', 21.6], ['1" (DN 25)', 27], ['1 1/4" (DN 32)', 35.7], ['1 1/2" (DN 40)', 41.6], ['2" (DN 50)', 52.8], ['2 1/2" (DN 65)', 68.6], ['3" (DN 80)', 80.9], ['4" (DN 100)', 105.3]],
};
// J em kPa/m com Q em L/s e D em mm: tubos lisos (PVC, cobre) e aço galvanizado
const dimJ = (mat, Q, D) => mat === 'aco' ? 20.2e6 * Math.pow(Q, 1.88) * Math.pow(D, -4.88) : 8.69e6 * Math.pow(Q, 1.75) * Math.pow(D, -4.75);
const dimApps = [
  ['Bacia c/ caixa acoplada', 0.3, 2], ['Bacia c/ válvula de descarga', 32, 0], ['Chuveiro / ducha', 0.4, 2], ['Lavatório', 0.3, 2],
  ['Pia de cozinha', 0.7, 1], ['Tanque', 0.7, 1], ['Máquina de lavar roupa', 1, 1], ['Máquina de lavar louça', 1, 0],
  ['Bidê', 0.1, 0], ['Banheira', 1, 0], ['Mictório c/ válvula', 2.8, 0], ['Torneira de jardim', 0.4, 0],
];
const dimAppsEl = document.getElementById('dimApps');
dimAppsEl.innerHTML = dimApps.map(([n, p, q], i) =>
  `<label>${n} <span>peso ${String(p).replace('.', ',')}</span><input type="number" data-i="${i}" value="${q}" min="0" step="1" aria-label="Quantidade: ${n}"></label>`).join('');
let dimMode = 'vazao';
const dimEls = ['dimQ', 'dimMat', 'dimV', 'dimL'].map(id => document.getElementById(id));
function calcDim() {
  const [qEl, matEl, vEl, lEl] = dimEls;
  const mat = matEl.value, vmax = parseFloat(vEl.value), L = parseFloat(lEl.value) || 0;
  const hint = document.getElementById('dimHint'), rows = document.getElementById('dimRows');
  let Q = parseFloat(qEl.value), sumP = 0;
  if (dimMode === 'pesos') {
    sumP = [...dimAppsEl.querySelectorAll('input')].reduce((s, el) => s + (parseFloat(el.value) || 0) * dimApps[el.dataset.i][1], 0);
    Q = 0.3 * Math.sqrt(sumP);
  }
  const set = (d, v, h) => { document.getElementById('dimD').textContent = d; document.getElementById('dimVel').textContent = v; document.getElementById('dimHf').textContent = h; };
  hint.classList.remove('warn');
  if (!(Q > 0)) { set('—', '—', '—'); hint.textContent = dimMode === 'pesos' ? 'Informe a quantidade de aparelhos.' : 'Informe a vazão.'; rows.innerHTML = ''; return; }
  const list = dimPipes[mat].map(([name, D]) => {
    const v = 4 * Q / 1000 / (Math.PI * Math.pow(D / 1000, 2));
    return { name, D, v, J: dimJ(mat, Q, D) / 9.80665 }; // kPa/m -> m/m
  });
  let k = list.findIndex(p => p.v <= vmax);
  const fits = k >= 0;
  if (!fits) k = list.length - 1;
  const p = list[k];
  set(p.name, `${num(p.v)} m/s`, `${num(p.J * L)} mca`);
  const qTxt = `Vazão de projeto: ${num(Q)} L/s (${num(Q * 3.6)} m³/h)` + (dimMode === 'pesos' ? `, ΣP = ${num(sumP, 1)}.` : '.');
  if (!fits) { hint.textContent = `${qTxt} Nenhum diâmetro da lista atende a ${num(vmax, 1)} m/s: divida a vazão em mais ramais ou consulte um projetista.`; hint.classList.add('warn'); }
  else hint.textContent = `${qTxt} Perda unitária: ${num(p.J * 100)} m/100m.`;
  rows.innerHTML = list.slice(Math.max(0, k - 1), k + 3).map(r =>
    `<tr${r === p ? ' class="is-on"' : ''}><td>${r.name}</td><td>${num(r.D, 1)}</td><td>${num(r.v)}</td><td>${num(r.J * 100)}</td></tr>`).join('');
}
document.getElementById('dimTabs').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  dimMode = b.dataset.k;
  document.querySelectorAll('#dimTabs button').forEach(x => x.classList.toggle('is-on', x === b));
  document.querySelectorAll('#dimTool [data-dim]').forEach(el => { el.hidden = el.dataset.dim !== dimMode; });
  calcDim();
});
dimEls.forEach(el => el.addEventListener('input', calcDim));
dimAppsEl.addEventListener('input', calcDim);
calcDim();

// Planos -> assunto do formulário
const assunto = document.getElementById('assunto');
{
  const qs = new URLSearchParams(location.search);
  const as = qs.get('assunto'), msg = qs.get('msg');
  if (as && [...assunto.options].some(o => o.text === as || o.value === as)) assunto.value = as;
  if (msg) document.querySelector('#contactForm textarea').value = msg;
}
document.addEventListener('click', e => {
  const a = e.target.closest('[data-plan], [data-subject]');
  if (!a) return;
  assunto.value = a.dataset.plan || a.dataset.subject;
  if (a.dataset.question) {
    const msg = document.querySelector('#contactForm textarea');
    msg.value = a.dataset.question;
    setTimeout(() => { msg.focus({ preventScroll: true }); msg.setSelectionRange(msg.value.length, msg.value.length); }, 400);
  }
});

// Anexo da lista de materiais (aparece em cotações e negócios & leilões)
const UPLOAD_SUBJECTS = ['Cotação de materiais', 'Negócios & leilões'];
const MAX_FILE = 4 * 1024 * 1024; // 4 MB (limite de envio da Vercel)
const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('arquivo');
const uploadDrop = document.getElementById('uploadDrop');
const uploadFile = document.getElementById('uploadFile');
const uploadError = document.getElementById('uploadError');
const fmtSize = b => b < 1024 * 1024 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
function syncUpload() {
  const on = UPLOAD_SUBJECTS.includes(assunto.value);
  uploadBox.hidden = !on;
  if (!on) clearFile();
}
function clearFile() {
  fileInput.value = '';
  uploadFile.hidden = true; uploadDrop.hidden = false; uploadError.hidden = true;
}
function showFile() {
  const f = fileInput.files[0];
  uploadError.hidden = true;
  if (!f) return clearFile();
  if (f.size > MAX_FILE) {
    clearFile();
    uploadError.textContent = `O arquivo tem ${fmtSize(f.size)}. O limite é 4 MB — envie uma versão menor ou em PDF.`;
    uploadError.hidden = false;
    return;
  }
  document.getElementById('uploadName').textContent = `${f.name} · ${fmtSize(f.size)}`;
  uploadFile.hidden = false; uploadDrop.hidden = true;
}
assunto.addEventListener('change', syncUpload);
document.addEventListener('click', e => { if (e.target.closest('[data-plan], [data-subject]')) syncUpload(); });
fileInput.addEventListener('change', showFile);
document.getElementById('uploadRemove').addEventListener('click', () => { clearFile(); fileInput.focus(); });
['dragenter', 'dragover'].forEach(ev => uploadDrop.addEventListener(ev, e => { e.preventDefault(); uploadDrop.classList.add('is-over'); }));
['dragleave', 'drop'].forEach(ev => uploadDrop.addEventListener(ev, () => uploadDrop.classList.remove('is-over')));
uploadDrop.addEventListener('drop', e => {
  e.preventDefault();
  if (!e.dataTransfer.files.length) return;
  const dt = new DataTransfer(); dt.items.add(e.dataTransfer.files[0]);
  fileInput.files = dt.files;
  showFile();
});
syncUpload();

// Formulário de contato: com um serviço de formulários configurado (FORM_POST_URL) envia direto,
// com anexo; sem ele, abre o e-mail do visitante.
const contactForm = document.getElementById('contactForm');
const PUBLISHED = !!FORM_POST_URL;
contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const f = new FormData(contactForm);
  const file = fileInput.files[0];
  if (!file) f.delete('arquivo');
  if (PUBLISHED) {
    const btn = contactForm.querySelector('[type=submit]');
    btn.disabled = true; btn.textContent = file ? 'Enviando arquivo…' : 'Enviando…';
    let falhou = false;
    try {
      const res = await postForm(f);
      if (!res.ok) throw new Error(res.status);
      contactForm.reset(); clearFile(); syncUpload();
      toast(file ? 'Mensagem e lista de materiais enviadas. Responderemos em breve.' : 'Mensagem enviada. Responderemos em breve.');
    } catch { falhou = true; }
    finally { btn.disabled = false; btn.textContent = 'Enviar mensagem'; }
    if (!falhou) return;
    // se o envio pelo site falhar, nenhum pedido se perde: abre o e-mail do visitante com a mensagem pronta
  }
  const head = `Nome: ${f.get('nome')}\nE-mail: ${f.get('email')}\nEmpresa: ${f.get('empresa') || '-'}\n\n`;
  const mailto = body => `mailto:info@pipesystem.com.br?subject=${encodeURIComponent('[Site] ' + f.get('assunto'))}&body=${encodeURIComponent(body)}`;
  let url = mailto((file ? attachLine(file.name) : '') + head + f.get('mensagem'));
  // O Windows não abre o e-mail (Outlook etc.) quando o link mailto passa de ~2.000 caracteres, sem nenhum aviso.
  // Mensagem longa (ex.: lista de materiais): copia o texto completo, baixa a planilha e abre o e-mail com um texto curto.
  const long = url.length > MAILTO_MAX;
  if (long) {
    const msg = f.get('mensagem'), isList = window.lmatXlsx && msg.startsWith('Cotação para a lista de materiais');
    let copied = false;
    try { await navigator.clipboard.writeText(msg); copied = true; } catch {}
    if (isList) window.lmatXlsx();
    const steps = [copied ? '>>> A LISTA COMPLETA FOI COPIADA: CLIQUE AQUI E COLE COM Ctrl+V <<<' : '>>> COLE AQUI A LISTA DE MATERIAIS (botão "Copiar" no site) <<<'];
    if (isList) steps.push(`>>> ANEXE A PLANILHA "${LMAT_FILE}" (baixada agora, pasta Downloads) <<<`);
    if (file) steps.push(`>>> ANEXE O ARQUIVO "${file.name}" <<<`);
    url = mailto(steps.join('\n') + '\n\n' + head + msg.split('\n')[0] + '\n\n');
    longNote(contactForm, copied, isList, file && file.name);
  }
  window.location.href = url;
  if (long) return;
  if (file) attachNote(contactForm, file.name); else toast('Abrindo seu programa de e-mail para enviar a mensagem…');
});
const MAILTO_MAX = 1900, LMAT_FILE = 'dimensionamento-inteligente-pipesystem.xlsx';
function longNote(form, copied, isList, fileName) {
  let n = form.querySelector('.attach-note');
  if (!n) {
    n = document.createElement('div'); n.className = 'attach-note full'; n.setAttribute('role', 'alert');
    form.querySelector('[type=submit]').insertAdjacentElement('beforebegin', n);
  }
  const items = [copied ? '<li><b>Cole a lista:</b> ela já foi copiada. Clique no corpo do e-mail e use <b>Ctrl+V</b>.</li>'
    : '<li><b>Cole a lista:</b> volte ao Dimensionamento Inteligente, clique em “Copiar” e cole no e-mail com <b>Ctrl+V</b>.</li>'];
  if (isList) items.push(`<li><b>Anexe a planilha</b> “${LMAT_FILE}”, baixada agora na pasta Downloads (botão 📎 do e-mail).</li>`);
  if (fileName) items.push('<li><b>Anexe o arquivo</b> <span class="attach-note__file"></span>.</li>');
  n.innerHTML = '<b>A mensagem é grande demais para ir inteira pelo link de e-mail.</b> Seu programa de e-mail abriu com um texto curto. Antes de enviar:' +
    `<ol>${items.join('')}</ol><button type="button" class="attach-note__close" aria-label="Fechar aviso">×</button>`;
  if (fileName) n.querySelector('.attach-note__file').textContent = `“${fileName}”`;
  n.querySelector('.attach-note__close').addEventListener('click', () => n.remove());
  n.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Anexos: enquanto os formulários abrem o e-mail do visitante (mailto), o arquivo não vai junto (o navegador
// não permite). Por isso o site avisa em três lugares: ao escolher o arquivo, no topo do e-mail e num aviso fixo.
const attachLine = name => `>>> ATENÇÃO: ANEXE A ESTE E-MAIL O ARQUIVO "${name}" ANTES DE ENVIAR <<<\n\n`;
function attachNote(form, name) {
  let n = form.querySelector('.attach-note');
  if (!n) {
    n = document.createElement('div'); n.className = 'attach-note full'; n.setAttribute('role', 'alert');
    form.querySelector('[type=submit]').insertAdjacentElement('beforebegin', n);
  }
  n.innerHTML = '<b>Falta um passo: anexe o arquivo no e-mail.</b> Seu programa de e-mail abriu com a mensagem pronta, mas o arquivo ' +
    '<span class="attach-note__file"></span> não vai junto automaticamente. Use o botão de anexar (📎) do e-mail, escolha o arquivo e depois envie.' +
    '<button type="button" class="attach-note__close" aria-label="Fechar aviso">×</button>';
  n.querySelector('.attach-note__file').textContent = `“${name}”`;
  n.querySelector('.attach-note__close').addEventListener('click', () => n.remove());
  n.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
if (!PUBLISHED) document.querySelectorAll('.upload__file').forEach(box => {
  const hint = document.createElement('small'); hint.className = 'upload__hint';
  hint.textContent = 'Ao enviar, seu e-mail vai abrir com a mensagem pronta: anexe este arquivo nele antes de enviar.';
  box.insertAdjacentElement('afterend', hint);
  hint.hidden = box.hidden;
  new MutationObserver(() => { hint.hidden = box.hidden; }).observe(box, { attributes: true, attributeFilter: ['hidden'] });
});
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

// Animação de entrada
const revealObs = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); }
}), { threshold: .12 });
document.querySelectorAll('.section__head, .card, .sys, .tool, .plan, .audience > div, .person, .fair').forEach(el => {
  el.classList.add('reveal'); revealObs.observe(el);
});

// ===== Fale conosco flutuante =====
// Número do WhatsApp com DDI + DDD, só dígitos (ex.: '5547999999999'). Enquanto vazio, a opção avisa que está em configuração.
const WHATSAPP = '5547988027372'; // +55 (47) 98802-7372
const CONTACT_EMAIL = 'info@pipesystem.com.br';
(() => {
  const fab = document.getElementById('fab');
  const btn = document.getElementById('fabBtn');
  const panel = document.getElementById('fabPanel');
  const wa = document.getElementById('fabWa');
  const note = document.getElementById('fabNote');
  const setOpen = open => { panel.hidden = !open; btn.setAttribute('aria-expanded', open); if (!open) note.hidden = true; };
  btn.addEventListener('click', () => setOpen(panel.hidden));
  document.addEventListener('click', e => { if (!fab.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  if (WHATSAPP) {
    wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo site da PipeSystem e gostaria de falar sobre ')}`;
  } else {
    wa.addEventListener('click', e => {
      e.preventDefault();
      note.textContent = 'O atendimento por WhatsApp está sendo configurado. Por enquanto, fale conosco por e-mail.';
      note.hidden = false;
    });
  }
  // E-mail: abre o programa de e-mail padrão do visitante (mailto) e mostra alternativas na web
  const mail = document.getElementById('fabMail');
  const mailAlt = document.getElementById('fabMailAlt');
  const subject = 'Contato pelo site PipeSystem';
  const body = 'Olá! Vim pelo site da PipeSystem e gostaria de falar sobre ';
  document.getElementById('fabGmail').href = `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  document.getElementById('fabOutlook').href = `https://outlook.live.com/mail/0/deeplink/compose?to=${CONTACT_EMAIL}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  mail.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = mail.href; // chama o aplicativo de e-mail configurado no aparelho
    mailAlt.hidden = false;
  });
  const resetAlt = () => { mailAlt.hidden = true; };
  btn.addEventListener('click', resetAlt);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (a === mail || (a === wa && !WHATSAPP)) return; // mantém o painel aberto
    setOpen(false);
  }));
  document.getElementById('fabCopy').addEventListener('click', e => {
    const b = e.currentTarget;
    const ok = () => { b.textContent = 'E-mail copiado ✓'; setTimeout(() => { b.textContent = 'Copiar e-mail'; }, 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(CONTACT_EMAIL).then(ok).catch(() => { b.textContent = CONTACT_EMAIL; });
    else b.textContent = CONTACT_EMAIL;
  });
})();

// ===== Ferramentas gratuitas na internet =====
(() => {
  const grid = document.getElementById('webtoolGrid');
  const chips = document.getElementById('webtoolChips');
  const cats = ['Todas', ...new Set(WEB_TOOLS.map(t => t.cat))];
  let active = 'Todas';
  chips.innerHTML = cats.map(c => {
    const n = c === 'Todas' ? WEB_TOOLS.length : WEB_TOOLS.filter(t => t.cat === c).length;
    return `<button type="button" role="tab" aria-selected="${c === active}" data-cat="${c}">${c} <span>${n}</span></button>`;
  }).join('');
  const host = u => new URL(u).hostname.replace(/^www\./, '');
  const render = () => {
    grid.innerHTML = WEB_TOOLS.filter(t => active === 'Todas' || t.cat === active).map(t => `
      <a class="wt" href="${t.url}" target="_blank" rel="noopener noreferrer">
        <span class="wt__top"><span class="wt__cat">${t.cat}</span><span class="wt__tipo">${t.tipo}</span></span>
        <strong class="wt__name">${t.name}</strong>
        <span class="wt__desc">${t.desc}</span>
        <span class="wt__link">${host(t.url)} ↗</span>
      </a>`).join('');
  };
  chips.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    active = b.dataset.cat;
    chips.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b));
    render();
  });
  render();
})();

// ===== Normas técnicas =====
(() => {
  const groupsEl = document.getElementById('normGroups');
  const listEl = document.getElementById('normList');
  const search = document.getElementById('normSearch');
  let mode = 'aplicacao';
  let active = NORM_GROUPS.find(g => g.tipo === mode).id;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const badge = { ABNT: 'ABNT NBR', NR: 'NR · grátis', NFPA: 'NFPA', ASME: 'ASME', ASTM: 'ASTM', ISO: 'ISO', API: 'API', ASHRAE: 'ASHRAE' };

  const row = n => `
    <article class="nrm__item">
      <div class="nrm__code"><b class="notranslate" translate="no">${n.code}</b><span class="nrm__org nrm__org--${n.org}">${badge[n.org]}</span></div>
      <div class="nrm__text"><p class="nrm__title">${n.title}</p>${n.note ? `<p class="nrm__note">${n.note}</p>` : ''}</div>
      <a class="nrm__btn" href="${normUrl(n)}" target="_blank" rel="noopener noreferrer">${NORM_SOURCES[n.org].action} ↗</a>
    </article>`;

  function renderGroups() {
    groupsEl.innerHTML = NORM_GROUPS.filter(g => g.tipo === mode).map(g =>
      `<button type="button" data-id="${g.id}" aria-current="${g.id === active}">${g.name}<span>${g.normas.length}</span></button>`).join('');
  }
  function renderList() {
    const terms = queryTerms(search.value);
    if (search.value.trim()) {
      const seen = new Set();
      const hits = [];
      NORM_GROUPS.forEach(g => g.normas.forEach(n => {
        const key = n.code + n.title;
        if (seen.has(key)) return;
        if (matchText([n.code, n.title, n.note || '', g.name].join(' '), terms)) { seen.add(key); hits.push(n); }
      }));
      listEl.innerHTML = `<h3 class="nrm__heading">${hits.length} norma${hits.length === 1 ? '' : 's'} para “${search.value.trim().replace(/</g, '&lt;')}”</h3>` +
        (hits.length ? hits.map(row).join('') : '<p class="nrm__empty">Nenhuma norma encontrada nesta lista. Tente o número da norma ou o nome do produto.</p>');
      groupsEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', 'false'));
      return;
    }
    const g = NORM_GROUPS.find(x => x.id === active);
    listEl.innerHTML = `<h3 class="nrm__heading">${g.name}</h3>` + g.normas.map(row).join('');
    groupsEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-current', b.dataset.id === active));
    // No celular os grupos viram uma faixa horizontal: mantém o grupo ativo visível
    const cur = groupsEl.querySelector('[aria-current="true"]');
    if (cur && groupsEl.scrollWidth > groupsEl.clientWidth) groupsEl.scrollLeft = cur.offsetLeft - 8;
  }
  document.querySelector('.nrm__mode').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    mode = b.dataset.mode;
    document.querySelectorAll('.nrm__mode button').forEach(x => x.setAttribute('aria-selected', x === b));
    active = NORM_GROUPS.find(g => g.tipo === mode).id;
    search.value = '';
    renderGroups(); renderList();
  });
  groupsEl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    active = b.dataset.id; search.value = '';
    renderList();
    if (window.innerWidth < 860) listEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  search.addEventListener('input', renderList);
  renderGroups(); renderList();
})();

// ===== Espaços publicitários ("Seu banner aqui!") =====
const AD_FORMATS = {
  master: { plan: 'Banner Premium', size: '970 × 90 px · celular 320 × 100 px' },
  padrao: { plan: 'Banner Padrão', size: '728 × 90 px · celular 320 × 100 px' },
  vertical: { plan: 'Banner Padrão', size: '300 × 250 px' },
  basico: { plan: 'Banner Básico', size: '300 × 100 px' },
  card: { plan: 'Banner Básico', size: 'cartão 300 × 250 px' },
};
// Anúncios contratados: o nome do espaço (data-place) -> banner do anunciante. Aparecem sempre com o rótulo "Patrocinado".
// Exemplo: 'Fichas técnicas — patrocínio da ficha': { img: 'img/anuncios/empresa.webp', url: 'https://empresa.com.br', anunciante: 'Empresa X' },
const ADS = {};
function adHTML(kind, place, id) {
  const f = AD_FORMATS[kind], ad = ADS[place];
  if (ad) return `<a class="ad ad--${kind} ad--sponsored" ${id ? `id="${id}"` : ''} href="${ad.url}" target="_blank" rel="sponsored noopener">
    <span class="ad__label">Patrocinado</span>
    <img src="${imgUrl(ad.img)}" alt="Anúncio: ${ad.anunciante}" loading="lazy">
  </a>`;
  // espaço ainda livre: convite para anunciar
  return `<a class="ad ad--${kind}" ${id ? `id="${id}"` : ''} href="#contato" data-plan="${f.plan}" data-question="Tenho interesse no espaço publicitário: ${place} (${f.plan}, ${f.size}). ">
    <span class="ad__label">Espaço publicitário</span>
    <span class="ad__main"><b>Seu banner aqui!</b><small>${place}</small></span>
    <span class="ad__meta"><span class="ad__size">${f.plan} · ${f.size}</span><span class="ad__cta">Anuncie →</span></span>
  </a>`;
}
const AD_SPOTS = [];
document.querySelectorAll('[data-ad]').forEach((el, i) => {
  const kind = el.dataset.variant === 'vertical' ? 'vertical' : el.dataset.ad;
  const id = `ad-${i + 1}`;
  el.innerHTML = adHTML(kind, el.dataset.place, id);
  AD_SPOTS.push({ id, kind, place: el.dataset.place });
});

// Cartão patrocinado dentro do catálogo (4ª posição), refeito a cada filtro
(() => {
  const cat = document.getElementById('catalog');
  if (!cat) return;
  const place = cat.dataset.adCard;
  const insert = () => {
    if (cat.querySelector('.ad--card')) return;
    const items = cat.querySelectorAll('.item');
    if (items.length < 3) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = adHTML('card', place, 'ad-catalogo');
    items[Math.min(3, items.length) - 1].after(wrap.firstElementChild);
  };
  new MutationObserver(insert).observe(cat, { childList: true });
  insert();
  AD_SPOTS.push({ id: 'ad-catalogo', kind: 'card', place });
})();

// Patrocínio em cada ficha técnica (produtos, sistemas e materiais)
(() => {
  const body = document.getElementById('sheetBody');
  const place = 'Fichas técnicas — patrocínio da ficha';
  new MutationObserver(() => {
    if (body.querySelector('.ad')) return;
    const actions = body.querySelector('.sheet__actions');
    if (!actions) return;
    const wrap = document.createElement('div');
    wrap.className = 'adslot adslot--sheet';
    wrap.innerHTML = adHTML('basico', place);
    actions.before(wrap);
  }).observe(body, { childList: true });
  AD_SPOTS.push({ id: null, kind: 'basico', place, sample: '#bombas' });
})();

// Mapa dos espaços na seção Anuncie
(() => {
  const map = document.getElementById('adMap');
  if (!map) return;
  map.innerHTML = AD_SPOTS.map(s => {
    const f = AD_FORMATS[s.kind];
    const href = s.sample || `#${s.id}`;
    return `<div class="admap__item">
      <span class="admap__plan admap__plan--${s.kind}">${f.plan}</span>
      <b>${s.place}</b>
      <small>${f.size}</small>
      <span class="admap__links"><a href="${href}" data-goto-ad="${s.id || ''}">Ver o local</a><a href="#contato" data-plan="${f.plan}" data-question="Tenho interesse no espaço publicitário: ${s.place} (${f.plan}, ${f.size}). ">Pedir proposta</a></span>
    </div>`;
  }).join('');
  // Destaca o espaço ao chegar nele
  map.addEventListener('click', e => {
    const a = e.target.closest('[data-goto-ad]');
    if (!a || !a.dataset.gotoAd) return;
    const el = document.getElementById(a.dataset.gotoAd);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('ad--flash'); void el.offsetWidth; el.classList.add('ad--flash');
  });
})();

// ===== Idioma: Português / English (tradução automática do Google) =====
(() => {
  const btns = document.querySelectorAll('.lang__btn');
  const COOKIE = 'googtrans';
  const readLang = () => {
    const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    return m && decodeURIComponent(m[1]).endsWith('/en') ? 'en' : 'pt';
  };
  // O Google lê o cookie "googtrans" no domínio atual e no domínio principal
  const domains = () => {
    const h = location.hostname, parts = h.split('.');
    const list = [''];
    if (parts.length > 1 && !/^\d+(\.\d+){3}$/.test(h)) for (let i = 0; i < parts.length - 1; i++) list.push('.' + parts.slice(i).join('.'));
    return list;
  };
  const writeCookie = value => domains().forEach(d => {
    document.cookie = `${COOKIE}=${value};path=/${d ? ';domain=' + d : ''}${value ? '' : ';expires=Thu, 01 Jan 1970 00:00:00 GMT'}`;
  });
  const mark = lang => {
    btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  };
  let loader;
  const loadTranslator = () => loader || (loader = new Promise(resolve => {
    window.googleTranslateElementInit = () => {
      new google.translate.TranslateElement({ pageLanguage: 'pt', includedLanguages: 'en,pt', autoDisplay: false }, 'google_translate_element');
      resolve(true);
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  }));
  const waitCombo = () => new Promise(resolve => {
    const t0 = Date.now();
    (function poll() {
      const c = document.querySelector('.goog-te-combo');
      if (c && c.options.length > 1) return resolve(c);
      if (Date.now() - t0 > 6000) return resolve(null);
      setTimeout(poll, 150);
    })();
  });
  async function toEnglish() {
    writeCookie('/pt/en');
    mark('en');
    const ok = await loadTranslator();
    if (!ok) { mark('pt'); writeCookie(''); toast('Translation is unavailable right now. Please try again later.'); return; }
    const combo = await waitCombo();
    if (combo) { combo.value = 'en'; combo.dispatchEvent(new Event('change')); }
    else location.reload();
  }
  function toPortuguese() {
    writeCookie('');
    mark('pt');
    location.reload(); // volta ao texto original
  }
  btns.forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === readLang() && b.getAttribute('aria-pressed') === 'true') return;
    b.dataset.lang === 'en' ? toEnglish() : toPortuguese();
  }));
  // Visitante que já escolheu inglês: traduz ao abrir
  const lang = readLang();
  mark(lang);
  if (lang === 'en') loadTranslator();
})();

// ===== Voltar ao início (logo, "Início" e "Voltar ao topo") =====
// O menu superior é fixo, então "#top" não rolaria a página: levamos à abertura do site.
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#top"]');
  if (!a) return;
  e.preventDefault();
  const sheet = document.getElementById('prodSheet');
  if (sheet && sheet.open) sheet.close();
  if (location.pathname !== '/' || location.hash) history.pushState(null, '', '/');   // topo = página inicial
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

// ===== Artigos técnicos (links conferidos em 17/10 e 23/10/2026) =====
const ARTICLES = [
  { tema: 'Perda de carga', title: 'Ajuste da equação de Hazen-Williams para determinação da perda de carga contínua em tubulações de PVC',
    autores: 'Miranda, E. P. et al.', fonte: 'Revista Irriga (UNESP)', ano: 2019, url: 'https://revistas.fca.unesp.br/index.php/irriga/article/view/3907',
    resumo: 'Compara Hazen-Williams com Darcy-Weisbach em tubos de PVC e propõe um ajuste para o cálculo da perda de carga.' },
  { tema: 'Golpe de aríete', title: 'Análise do efeito do golpe de aríete numa adutora com uma junção de ramificação',
    autores: 'Sanders Neto, H.; Barbosa, J. M. G.', fonte: 'Revista DAE (Sabesp)', ano: 2020, url: 'https://doi.org/10.36659/dae.2020.058', pdf: true,
    resumo: 'Simula transientes em uma adutora com ramificação e mostra como o fechamento de registros eleva a pressão na rede.' },
  { tema: 'Instalações prediais', title: 'Avaliação das condições de operação de equipamentos hidrossanitários em edificações públicas',
    autores: 'Kalbusch, A. et al.', fonte: 'Ambiente Construído (SciELO)', ano: 2018, url: 'https://www.scielo.br/j/ac/a/PVCxhtbQ5MvZpStJ9Qcwn3t/?lang=pt',
    resumo: 'Mede vazões, vazamentos e defeitos em torneiras, bacias, mictórios e chuveiros de dez prédios públicos de Joinville (SC).' },
  { tema: 'Bombas e energia', title: 'Economia de energia em sistemas de bombeamento: aplicação de um sistema Fuzzy',
    autores: 'Bezerra, S. T. M. et al.', fonte: 'Revista Ciência & Engenharia (UFU)', ano: 2015, url: 'https://seer.ufu.br/index.php/cieng/article/view/22536',
    resumo: 'Controle de rotação de bombas com inversor de frequência e lógica Fuzzy, com redução de 35% no consumo de energia.' },
  { tema: 'Água quente', title: 'Avaliação técnica e viabilidade econômica de um sistema de aquecimento solar em um edifício residencial',
    autores: 'Medeiros, J. M. et al.', fonte: 'Revista Principia (IFPB)', ano: 2014, url: 'https://periodicos.ifpb.edu.br/index.php/principia/article/view/145',
    resumo: 'Doze meses de medição de um sistema solar com apoio a gás: fração solar, eficiência térmica e retorno do investimento.' },
  // Artigos internacionais (acesso aberto, licença Creative Commons ou "open access" da editora), conferidos em 23/10/2026
  { tema: 'Dimensionamento', idioma: 'en', title: 'Determination of Fixture-Use Probability for Peak Water Demand Design Using High-Level Water End-Use Statistics and Stochastic Simulation',
    autores: 'Josey, B. M. et al.', fonte: 'Journal of Water Resources Planning and Management (ASCE)', ano: 2023, url: 'https://doi.org/10.1061/JWRMD5.WRENG-6146',
    resumo: 'Calcula a probabilidade de uso de cada aparelho para estimar a vazão de pico em projetos prediais por simulação, alternativa aos métodos tradicionais, como o de Hunter, que tendem a superdimensionar as tubulações.' },
  { tema: 'Consumo de água', title: 'Water End-Uses in Low-Income Houses in Southern Brazil', idioma: 'en',
    autores: 'Marinoski, A. K. et al.', fonte: 'Water (MDPI)', ano: 2014, url: 'https://www.mdpi.com/2073-4441/6/7/1985',
    resumo: 'Mede os usos finais de água em casas de baixa renda no Sul do Brasil e mostra onde estão as maiores oportunidades de economia.' },
  { tema: 'Consumo de água', idioma: 'en', title: 'Variability in Consumption and End Uses of Water for Residential Users in Logan and Providence, Utah, US',
    autores: 'Bastidas Pacheco, C. J. et al.', fonte: 'Journal of Water Resources Planning and Management (ASCE)', ano: 2023, url: 'https://doi.org/10.1061/(ASCE)WR.1943-5452.0001633',
    resumo: 'Medição de alta resolução em residências: o consumo interno depende mais da frequência de uso do que das características dos aparelhos. Dados e ferramentas disponíveis gratuitamente.' },
  { tema: 'Golpe de aríete', idioma: 'en', title: 'Exploring the Sensitivity of the Transient Response following Power Failure to Air Valve and Pipeline Characteristics',
    autores: 'Tasca, E. et al.', fonte: 'Water (MDPI)', ano: 2023, url: 'https://www.mdpi.com/2073-4441/15/19/3476',
    resumo: 'Simula o transiente após a queda de energia das bombas numa linha de recalque com ventosa e mostra como a ventosa e a tubulação alteram as pressões máximas e mínimas.' },
  { tema: 'Qualidade da água', idioma: 'en', title: 'Critical Review: Propensity of Premise Plumbing Pipe Materials to Enhance or Diminish Growth of Legionella and Other Opportunistic Pathogens',
    autores: 'Cullom, A. C. et al.', fonte: 'Pathogens (MDPI)', ano: 2020, url: 'https://www.mdpi.com/2076-0817/9/11/957',
    resumo: 'Revisão sobre como cobre, ferro, PVC e PEX favorecem ou inibem a Legionella e outros patógenos nas instalações prediais, pelo efeito sobre nutrientes, cloro residual e biofilme.' },
  { tema: 'Corrosão', idioma: 'en', title: 'Copper Tube Pitting in Santa Fe Municipal Water Caused by Microbial Induced Corrosion',
    autores: 'Burleigh, T. D. et al.', fonte: 'Materials (MDPI)', ano: 2014, url: 'https://www.mdpi.com/1996-1944/7/6/4321',
    resumo: 'Investiga os furos (pinholes) em tubos de cobre de água potável em Santa Fé (EUA) e mostra que a corrosão foi causada por micro-organismos presentes nos pites.' },
  { tema: 'Tubos plásticos', idioma: 'en', title: 'Drinking water contamination from the thermal degradation of plastics: implications for wildfire and structure fire response',
    autores: 'Isaacson, K. P. et al.', fonte: 'Environmental Science: Water Research & Technology (RSC)', ano: 2021, url: 'https://pubs.rsc.org/en/content/articlehtml/2021/ew/d0ew00836b',
    resumo: 'Tubos plásticos de água potável aquecidos entre 200 e 400 °C, como num incêndio, liberaram benzeno e outros compostos na água. A inspeção visual não basta para avaliar o risco: após incêndios, a rede precisa ser testada.' },
  { tema: 'Água de chuva', idioma: 'en', title: 'Rainwater Harvesting in Buildings in Brazil: A Literature Review',
    autores: 'Teston, A. et al.', fonte: 'Water (MDPI)', ano: 2018, url: 'https://www.mdpi.com/2073-4441/10/4/471',
    resumo: 'Revisão dos estudos brasileiros sobre aproveitamento de água de chuva em edificações: economia média potencial de 53% da água potável, e pouca pesquisa sobre manutenção e desempenho real dos sistemas.' },
  { tema: 'Água de chuva', idioma: 'en', title: 'Comprehensive Environmental Assessment of Rainwater Harvesting Systems: A Literature Review',
    autores: 'Teston, A. et al.', fonte: 'Water (MDPI)', ano: 2022, url: 'https://www.mdpi.com/2073-4441/14/17/2716',
    resumo: 'Avaliação ambiental de sistemas de água de chuva: nos estudos analisados, economia de 20% a 65% de água potável e redução de 13% a 91% do escoamento pluvial.' },
  { tema: 'Reúso de água', idioma: 'en', title: 'Current Research Trends and Challenges Related to the Use of Greywater in Buildings',
    autores: 'Niewitecka, K. et al.', fonte: 'Water (MDPI)', ano: 2025, url: 'https://www.mdpi.com/2073-4441/17/23/3431',
    resumo: 'Revisão do reúso de águas cinzas em edifícios, principalmente na descarga de bacias: tecnologias de tratamento e as barreiras técnicas, normativas e de aceitação pelos usuários.' },
];
(() => {
  const list = document.getElementById('artList');
  if (!list) return;
  const host = u => new URL(u).hostname.replace(/^www\./, '');
  list.innerHTML = ARTICLES.map((a, i) => `
    <article class="art">
      <span class="art__num">${String(i + 1).padStart(2, '0')}</span>
      <div class="art__body">
        <span class="art__tema">${a.tema}</span>
        <h3 class="art__title"><a href="${a.url}" target="_blank" rel="noopener noreferrer">${a.title}</a></h3>
        <p class="art__meta"><span class="notranslate" translate="no">${a.autores}</span> · ${a.fonte} · ${a.ano}${a.idioma === 'en' ? ' · <span class="art__lang">Em inglês</span>' : ''}</p>
        <p class="art__resumo">${a.resumo}</p>
      </div>
      <a class="art__btn" href="${a.url}" target="_blank" rel="noopener noreferrer">${a.pdf ? 'Ler (PDF)' : 'Ler o artigo'} ↗<small>${host(a.url)}</small></a>
    </article>`).join('') +
    `<a class="art art--add" href="#artigo-envio"><span class="art__plus">+</span><div class="art__body"><h3 class="art__title">Adicione seu Artigo Técnico Aqui</h3><p class="art__resumo">Anexe o arquivo ou indique o link do seu trabalho para publicarmos nesta seção.</p></div></a>`;
})();

// Envio de artigo: arquivo ou link
(() => {
  const form = document.getElementById('artForm');
  if (!form) return;
  const file = document.getElementById('artFile'), drop = document.getElementById('artDrop');
  const box = document.getElementById('artFileBox'), nameEl = document.getElementById('artFileName');
  const link = document.getElementById('artLink'), err = document.getElementById('artError');
  const MAX = 4 * 1024 * 1024;
  const size = b => b < 1048576 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1048576).toFixed(1).replace('.', ',')} MB`;
  const showErr = m => { err.textContent = m; err.hidden = !m; };
  const clear = () => { file.value = ''; box.hidden = true; drop.hidden = false; };
  const show = () => {
    const f = file.files[0];
    if (!f) return clear();
    if (f.size > MAX) { clear(); return showErr(`O arquivo tem ${size(f.size)}. O limite é 4 MB — envie um PDF menor ou um link.`); }
    showErr(''); nameEl.textContent = `${f.name} · ${size(f.size)}`; box.hidden = false; drop.hidden = true;
  };
  file.addEventListener('change', show);
  document.getElementById('artFileRemove').addEventListener('click', () => { clear(); file.focus(); });
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove('is-over')));
  drop.addEventListener('drop', e => { e.preventDefault(); if (!e.dataTransfer.files.length) return; const dt = new DataTransfer(); dt.items.add(e.dataTransfer.files[0]); file.files = dt.files; show(); });
  form.addEventListener('input', () => showErr(''));
  const published = !!FORM_POST_URL;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(form);
    const hasFile = !!file.files[0], hasLink = !!link.value.trim();
    if (!f.get('nome').trim() || !form.email.checkValidity() || !f.get('email').trim()) return showErr('Informe seu nome e um e-mail válido.');
    if (!f.get('titulo').trim()) return showErr('Informe o título do artigo.');
    if (!hasFile && !hasLink) return showErr('Anexe o arquivo do artigo ou informe o link onde podemos acessá-lo.');
    if (hasLink && !link.checkValidity()) return showErr('O link precisa começar com http:// ou https://');
    if (!form.autorizacao.checked) return showErr('Confirme que você é autor(a) ou tem autorização para divulgar o trabalho.');
    if (!form.privacidade.checked) return showErr('Para enviar, aceite a Política de Privacidade e os Termos de Uso.');
    if (!hasFile) f.delete('arquivo');
    if (published) {
      const btn = form.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Enviando…';
      let falhou = false;
      try {
        const res = await postForm(f);
        if (!res.ok) throw new Error(res.status);
        form.reset(); clear();
        toast('Artigo enviado! Nossa equipe vai avaliar e entrar em contato.');
      } catch { falhou = true; }
      finally { btn.disabled = false; btn.textContent = 'Enviar artigo para avaliação'; }
      if (!falhou) return;
      // se o envio pelo site falhar, abre o e-mail do visitante com o artigo pronto (como antes)
    }
    const body = (hasFile ? attachLine(file.files[0].name) : '') + `Nome: ${f.get('nome')}\nE-mail: ${f.get('email')}\nTítulo: ${f.get('titulo')}\nAutor(es): ${f.get('autores') || '-'}\nLink: ${f.get('link') || '-'}\n\nResumo:\n${f.get('resumo') || '-'}`;
    window.location.href = `mailto:info@pipesystem.com.br?subject=${encodeURIComponent('[Site] Artigo técnico: ' + f.get('titulo'))}&body=${encodeURIComponent(body)}`;
    if (hasFile) attachNote(form, file.files[0].name); else toast('Abrindo seu e-mail para enviar o artigo…');
  });
})();

// ===== Busca geral do portal (caixa da página de abertura) =====
(() => {
  const form = document.getElementById('heroSearch');
  const input = document.getElementById('heroSearchInput');
  const box = document.getElementById('heroResults');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const plain = s => String(s).replace(/<[^>]+>/g, '');
  const clean = s => plain(s).replace(/\s+/g, ' ').trim();

  // Marca os termos encontrados (comparando sem acentos)
  function mark(s, terms) {
    s = esc(clean(s));
    const n = [...s].map(c => norm(c)).join('');
    if (n.length !== s.length) return s;
    const hits = [];
    terms.forEach(t => { let i = n.indexOf(t); while (t && i > -1) { hits.push([i, i + t.length]); i = n.indexOf(t, i + t.length); } });
    if (!hits.length) return s;
    hits.sort((a, b) => a[0] - b[0]);
    let out = '', pos = 0;
    hits.forEach(([a, b]) => { if (a < pos) return; out += s.slice(pos, a) + '<mark>' + s.slice(a, b) + '</mark>'; pos = b; });
    return out + s.slice(pos);
  }
  // Trecho do texto em volta da primeira ocorrência
  function snippet(text, terms, fallback) {
    const t = clean(text), n = norm(t);
    const i = Math.min(...terms.map(w => n.indexOf(w)).filter(i => i > -1));
    if (!isFinite(i)) return fallback;
    const a = Math.max(0, i - 40);
    return (a > 0 ? '…' : '') + t.slice(a, a + 140);
  }

  // Itens da página que não vêm de listas de dados (serviços, feiras, planos…)
  const DOM_ITEMS = [
    ['#servicos .svc', 'Serviços'], ['#ferramentas .tool', 'Calculadoras on-line'], ['#feiras .fair', 'Feiras'],
    ['#publico .audience > div', 'Para quem é'], ['#anuncie .plan', 'Anuncie'], ['#assinaturas .qplan', 'Assinaturas de cotações'],
    ['#assinaturas .qtime__step', 'Assinaturas de cotações'], ['#sobre .person', 'Quem somos'],
  ];
  const DATA_SECTIONS = new Set(['sistemas', 'materiais', 'normas', 'artigos']);
  const titleOf = el => clean((el.querySelector('h2, h3, h4, strong, b') || el).textContent);

  function search(q) {
    const terms = queryTerms(q);
    const groups = [];
    const add = (name, items, more) => {
      if (!items.length) return;
      const g = groups.find(x => x.name === name);
      g ? g.items.push(...items) : groups.push({ name, items, more });
    };
    const pick = (list, textOf, make) => list.filter(x => matchText(textOf(x), terms))
      .map(x => ({ ...make(x), score: matchText(make(x).title, terms) ? 2 : 0 })).sort((a, b) => b.score - a.score);

    const sysText = s => [s.name, s.desc, ...s.componentes, ...s.cuidados, ...s.normas].join(' ');
    add('Áreas de aplicação', pick(SYSTEMS, sysText, s => ({ href: '/sistemas/' + s.id.slice(4), sheet: s.id, title: s.name, sub: snippet(sysText(s), terms, s.desc) })));

    const matText = m => { const p = productById[m.rel] || { tipos: m.tipos || [], escolha: m.escolha || [], normas: [], desc: '' };
      return [m.cat, m.name, m.apps, m.desc, p.desc, ...m.normas, ...p.normas, ...p.tipos, ...p.escolha, ...m.specs.flat(), ...(MANUFACTURERS[m.id] || []).map(f => f[0])].join(' '); };
    add('Produtos e materiais', pick(CATALOG, matText, m => ({ href: '/materiais/' + m.id.slice(4), sheet: m.id, title: m.name, sub: snippet(matText(m), terms, m.apps) })),
      { label: 'Ver no catálogo', run: () => { searchCatalog(q); goTo('materiais'); } });

    const seen = new Set(), norms = [];
    NORM_GROUPS.forEach(g => g.normas.forEach(n => { if (!seen.has(n.code)) { seen.add(n.code); norms.push({ ...n, grupo: g.name }); } }));
    add('Normas técnicas', pick(norms, n => [n.code, n.title, n.note || '', n.grupo].join(' '),
      n => ({ run: () => showNorm(n.code), title: n.code, sub: n.title })),
      { label: 'Ver na seção Normas Técnicas', run: () => showNorm(q) });

    add('Ferramentas on-line grátis', pick(WEB_TOOLS, t => [t.name, t.cat, t.tipo, t.desc || ''].join(' '),
      t => ({ href: t.url, ext: true, title: t.name, sub: `${t.cat} · ${new URL(t.url).hostname.replace(/^www\./, '')}` })));

    add('Artigos técnicos', pick(ARTICLES, a => [a.tema, a.title, a.autores, a.fonte, a.resumo].join(' '),
      a => ({ href: a.url, ext: true, title: a.title, sub: `${a.fonte} · ${a.ano}` })));

    // Demais conteúdos da página
    const found = new Set();
    DOM_ITEMS.forEach(([sel, name]) => {
      const els = [...document.querySelectorAll(sel)].filter(el => matchText(el.textContent, terms));
      els.forEach(el => found.add(el.closest('section')));
      add(name, els.map(el => ({ run: () => flash(el), title: titleOf(el), sub: snippet(el.textContent, terms, '') })));
    });
    // Qualquer outra palavra: aponta a seção em que ela aparece
    const secs = [...document.querySelectorAll('section[id]')].filter(s => !DATA_SECTIONS.has(s.id) && !found.has(s) && matchText(s.textContent, terms));
    add('Outras seções do site', secs.map(s => ({ run: () => goTo(s.id), title: titleOf(s.querySelector('.section__head') || s), sub: snippet(s.textContent, terms, '') })));
    // Grupos com o termo no título dos itens vêm primeiro (ex.: "perda de carga" → calculadora)
    groups.forEach((g, i) => { g.i = g.name === 'Calculadoras on-line' ? -1 : i; g.items.forEach(it => { it.score ??= matchText(it.title, terms) ? 2 : 0; }); g.items.sort((a, b) => b.score - a.score); g.best = g.items[0].score; });
    groups.sort((a, b) => b.best - a.best || a.i - b.i);
    return { terms, groups };
  }

  function goTo(id) {
    hide();
    document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function flash(el) {
    hide();
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    el.classList.remove('search-flash'); void el.offsetWidth; el.classList.add('search-flash');
  }
  function showNorm(q) {
    const s = document.getElementById('normSearch');
    s.value = q; s.dispatchEvent(new Event('input'));
    goTo('normas');
  }

  let actions = [];
  function render() {
    const q = input.value.trim();
    if (q.length < 2) { hide(); return; }
    const { terms, groups } = search(q);
    actions = [];
    const total = groups.reduce((n, g) => n + g.items.length, 0);
    const item = it => {
      const inner = `<strong>${mark(it.title, terms)}</strong>${it.sub ? `<span>${mark(it.sub, terms)}</span>` : ''}`;
      if (it.href) return `<a class="sresults__item" href="${esc(it.href)}"${it.sheet ? ` data-sheet="${it.sheet}"` : ''}${it.ext ? ' target="_blank" rel="noopener noreferrer"' : ''}>${inner}</a>`;
      actions.push(it.run);
      return `<button type="button" class="sresults__item" data-act="${actions.length - 1}">${inner}</button>`;
    };
    box.innerHTML = `<div class="sresults__head"><span><b>${total}</b> resultado${total === 1 ? '' : 's'} para “${esc(q)}”</span><button type="button" class="sresults__close" aria-label="Fechar resultados">Fechar ✕</button></div>` +
      (total ? groups.map(g => {
        const shown = g.items.slice(0, 8);
        let more = '';
        if (g.more && g.items.length > shown.length) { actions.push(g.more.run); more = `<button type="button" class="sresults__item" data-act="${actions.length - 1}"><strong>${g.more.label} (${g.items.length}) →</strong></button>`; }
        return `<div class="sresults__group"><p class="sresults__gtitle">${g.name}</p>${shown.map(item).join('')}${more}</div>`;
      }).join('')
      : `<p class="sresults__empty">Nada encontrado no site. Tente outra palavra ou <a href="#contato" data-subject="Consulta técnica" data-question="Procurei por “${esc(q)}” no site e não encontrei: ">envie sua pergunta para a equipe</a>.</p>`);
    box.hidden = false;
  }
  function hide() { box.hidden = true; }

  let timer;
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(render, 150); });
  input.addEventListener('keydown', e => { if (e.key === 'Escape') { input.value = ''; hide(); } });
  form.addEventListener('submit', e => {
    e.preventDefault();
    clearTimeout(timer); render();
    const first = box.querySelector('.sresults__item');
    if (first && window.innerWidth < 860) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  // Busca aberta pela URL (?q=válvulas): usada pelo Google ("caixa de busca do site") e para compartilhar buscas
  const q0 = new URLSearchParams(location.search).get('q');
  if (q0) { input.value = q0; render(); }
  box.addEventListener('click', e => {
    if (e.target.closest('.sresults__close')) { hide(); input.focus(); return; }
    const b = e.target.closest('[data-act]');
    if (b) actions[b.dataset.act]();
  });
})();
// ===== Submenus do menu superior (abrem ao passar o mouse em qualquer item) =====
(() => {
  const caret = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // Dá um id aos cartões da página para que o submenu leve direto a eles
  const tag = (sel, prefix) => [...document.querySelectorAll(sel)].map(el => {
    const head = el.querySelector('h3, h4, strong') || el, date = head.querySelector('time');
    const title = date ? head.firstChild.textContent.trim() + ' · ' + date.textContent.trim() : head.textContent.trim();
    if (!el.id) el.id = prefix + '-' + slug(title);
    return { href: '#' + el.id, label: title };
  });
  const link = l => `<a href="${l.href}"${l.ext ? ' target="_blank" rel="noopener noreferrer"' : ''}${l.attrs || ''}>${l.label}${l.ext ? ' <span aria-hidden="true">↗</span>' : ''}</a>`;
  const group = (title, items) => `<div class="dd__group">${title ? `<p>${title}</p>` : ''}${items.map(link).join('')}</div>`;

  const MENUS = {
    servicos: () => group('Serviços', tag('#servicos .svc', 'servico')) +
      group('Receber cotações', [{ href: '#assinaturas', label: 'Assinaturas para distribuidores' }, ...tag('#assinaturas .qplan', 'assinatura')]),
    sistemas: () => group('Áreas de aplicação', SYSTEMS.map(s => ({ href: '/sistemas/' + s.id.slice(4), label: s.name, attrs: ` data-sheet="${s.id}"` }))),
    materiais: () => [...new Set(CATALOG.map(m => m.cat))].map(cat =>
      group(cat, CATALOG.filter(m => m.cat === cat).map(m => ({ href: '/materiais/' + m.id.slice(4), label: m.name, attrs: ` data-sheet="${m.id}"` })))).join(''),
    ferramentas: () => group('Calculadoras', tag('#ferramentas .tool', 'calc')) +
      group('Na internet', [{ href: '#webtools', label: `Ferramentas on-line grátis (${WEB_TOOLS.length})` }]),
    normas: () => ['aplicacao', 'produto'].map(tipo =>
      group(tipo === 'aplicacao' ? 'Por aplicação' : 'Por produto', NORM_GROUPS.filter(g => g.tipo === tipo)
        .map(g => ({ href: '#normas', label: g.name, attrs: ` data-norm-mode="${tipo}" data-norm-group="${g.id}"` })))).join(''),
    artigos: () => group('Artigos publicados', ARTICLES.map(a => ({ href: a.url, ext: true, label: a.tema }))) +
      group('', [{ href: '#artigo-envio', label: 'Adicione seu artigo técnico aqui' }]),
    feiras: () => group('No Brasil', tag('#feiras .fair:not(.fair--intl)', 'feira')) + group('No exterior', tag('#feiras .fair--intl', 'feira')) +
      group('', [{ href: '#links-uteis', label: 'Links úteis: entidades e normas do setor' }]),
    anuncie: () => group('Planos de banner', tag('#anuncie .plan', 'plano')) +
      group('', [{ href: '#adMap', label: 'Onde os banners aparecem' }]),
    sobre: () => group('Diretoria', tag('#sobre .person__row', 'diretor')) +
      group('', [{ href: '#contato', label: 'Consultoria técnica & comercial', attrs: ' data-subject="Consultoria técnica & comercial e pesquisa de mercado"' },
        { href: '#contato', label: 'Fale conosco' }]),
  };
  const WIDE = { materiais: 'dd__menu--mega', normas: 'dd__menu--cols2', sistemas: 'dd__menu--cols2' };

  // Transforma cada link do menu em item com submenu (o clique no nome continua levando à seção)
  links.querySelectorAll(':scope > a[href^="#"]:not(.btn)').forEach(a => {
    const id = a.getAttribute('href').slice(1);
    if (!MENUS[id]) return;
    const wrap = document.createElement('div');
    wrap.className = 'dd';
    a.replaceWith(wrap);
    a.classList.add('dd__btn', 'dd__btn--link');
    a.insertAdjacentHTML('beforeend', ' ' + caret);
    const menu = document.createElement('div');
    menu.className = 'dd__menu' + (WIDE[id] ? ' ' + WIDE[id] : '');
    menu.innerHTML = MENUS[id]();
    wrap.append(a, menu);
  });

  const dds = [...links.querySelectorAll('.dd')];
  const setDd = (dd, open) => { dd.classList.toggle('open', open); dd.querySelector('.dd__btn').setAttribute('aria-expanded', open); };
  // Mantém o submenu dentro da tela: nos lados (o de Produtos saía pela esquerda) e embaixo
  // (em telas baixas, os últimos itens ficavam abaixo da janela): primeiro ganha mais colunas, e se ainda não couber, rola.
  const fit = dd => {
    const menu = dd.querySelector('.dd__menu');
    Object.assign(menu.style, { marginLeft: '0px', width: '', columns: '', maxHeight: '', overflowY: '' });
    if (compact()) return;
    requestAnimationFrame(() => {
      let r = menu.getBoundingClientRect();
      if (!r.width) return;
      const avail = innerHeight - r.top - 12;
      if (r.height > avail) {
        let n = parseInt(getComputedStyle(menu).columnCount) || 0;
        if (n) {
          const colW = r.width / n;
          while (r.height > avail && (n + 1) * colW <= innerWidth - 24) {
            n++;
            Object.assign(menu.style, { width: n * colW + 'px', columnCount: n });
            r = menu.getBoundingClientRect();
          }
        }
        if (r.height > avail) {   // tela muito baixa: uma coluna só, com rolagem
          if (n) Object.assign(menu.style, { width: Math.min(r.width, 300) + 'px', columns: 'auto' });
          Object.assign(menu.style, { maxHeight: avail + 'px', overflowY: 'auto' });
          r = menu.getBoundingClientRect();
        }
      }
      const shift = r.left < 12 ? 12 - r.left : r.right > innerWidth - 12 ? innerWidth - 12 - r.right : 0;
      menu.style.marginLeft = shift + 'px';
    });
  };
  dds.forEach(dd => {
    dd.addEventListener('mouseenter', () => fit(dd));
    dd.addEventListener('focusin', () => fit(dd));
    // Depois de escolher um item, mantém o submenu fechado até o mouse sair dele
    dd.addEventListener('mouseleave', () => dd.classList.remove('dd--hold'));
  });
  // Menu compacto (celular ou cabeçalho sem espaço): tocar em "Produtos" abre a lista; no computador, leva à seção
  const compact = () => matchMedia('(max-width: 1180px)').matches || document.documentElement.classList.contains('nav-collapse');
  document.addEventListener('click', e => dds.forEach(dd => { if (!dd.contains(e.target)) setDd(dd, false); }));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') dds.forEach(dd => setDd(dd, false)); });
  links.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    links.classList.remove('open'); toggle.setAttribute('aria-expanded', false);
    dds.forEach(dd => setDd(dd, false));
    const dd = a.closest('.dd');
    if (dd) dd.classList.add('dd--hold');
    a.blur();
    // Normas: abre o grupo escolhido
    if (a.dataset.normGroup) {
      const mode = document.querySelector(`.nrm__mode button[data-mode="${a.dataset.normMode}"]`);
      if (mode && mode.getAttribute('aria-selected') !== 'true') mode.click();
      document.querySelector(`#normGroups button[data-id="${a.dataset.normGroup}"]`)?.click();
    }
  });
  // Destaca o cartão escolhido no submenu
  window.addEventListener('hashchange', () => {
    const el = document.getElementById(location.hash.slice(1));
    if (el && !el.matches('section, dialog') && el.closest('main')) { el.classList.remove('search-flash'); void el.offsetWidth; el.classList.add('search-flash'); }
  });
})();
// ===== Cabeçalho que sempre cabe na tela =====
// Mede o cabeçalho com o espaçamento normal; se não couber (fonte maior, zoom do navegador,
// tela estreita), aperta o espaçamento e, se ainda faltar espaço, usa o menu de três linhas.
(() => {
  const root = document.documentElement;
  const inner = document.querySelector('.nav__inner');
  const fits = () => inner.scrollWidth <= inner.clientWidth + 1 && root.scrollWidth <= window.innerWidth + 1;
  function fitHeader() {
    if (matchMedia('(max-width: 1180px)').matches) { root.classList.remove('nav-tight', 'nav-collapse'); return; }
    const wasOpen = links.classList.contains('open');
    root.classList.remove('nav-tight', 'nav-collapse');
    if (fits()) return;
    root.classList.add('nav-tight');
    if (fits()) return;
    root.classList.add('nav-collapse');
    if (!wasOpen) links.classList.remove('open');
  }
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(fitHeader, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHeader);
  window.addEventListener('load', fitHeader);
  fitHeader();
})();
// ===== Vinheta de abertura (vídeo do logotipo) =====
// Toca em tela cheia na primeira entrada da visita e depois some, revelando a página.
// Começa sem som (os navegadores só permitem tocar sozinho assim); o visitante pode ativar o som ou pular.
// Não aparece em links diretos para uma seção/ficha (ex.: /#bombas) nem se o vídeo demorar para carregar.
(() => {
  const intro = document.getElementById('intro');
  const video = document.getElementById('introVideo');
  const bar = document.getElementById('introProgress');
  const soundBtn = document.getElementById('introSound');
  if (!intro || !video) return;
  const SEEN = 'pipesystem-vinheta-vista';
  let timer, maxTimer, closing = false;

  function close() {
    if (closing || intro.hidden) return;
    closing = true;
    clearTimeout(timer); clearTimeout(maxTimer);
    try { sessionStorage.setItem(SEEN, '1'); } catch {}
    intro.classList.add('intro--out');
    document.documentElement.classList.remove('intro-open');
    setTimeout(() => { intro.hidden = true; intro.classList.remove('intro--out'); video.pause(); closing = false; }, 600);
  }
  function open() {
    intro.hidden = false;
    document.documentElement.classList.add('intro-open');
    video.muted = true; soundBtn.textContent = '🔇 Ativar som'; soundBtn.setAttribute('aria-pressed', 'false');
    video.currentTime = 0;
    video.preload = 'auto';
    // Se o vídeo não começar em 4 s (internet lenta, bloqueio), a página aparece direto
    timer = setTimeout(() => { if (video.currentTime < 0.1) close(); }, 4000);
    // Segurança: a vinheta nunca fica presa na tela por mais de 15 s
    maxTimer = setTimeout(close, 15000);
    video.play().catch(close);
    document.getElementById('introSkip').focus({ preventScroll: true });
  }

  video.addEventListener('ended', close);
  // Se o visitante trocar de aba, o navegador pausa o vídeo; ao voltar, ele continua
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !intro.hidden && video.paused) video.play().catch(close); });
  video.addEventListener('error', close);
  video.addEventListener('timeupdate', () => { if (video.duration) bar.style.width = (video.currentTime / video.duration * 100) + '%'; });
  document.getElementById('introSkip').addEventListener('click', close);
  soundBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    soundBtn.textContent = video.muted ? '🔇 Ativar som' : '🔊 Som ativado';
    soundBtn.setAttribute('aria-pressed', String(!video.muted));
  });
  intro.addEventListener('click', e => { if (e.target === intro || e.target === video) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !intro.hidden) close(); });
  document.getElementById('introReplay')?.addEventListener('click', e => { e.preventDefault(); open(); });

  let seen = false;
  try { seen = sessionStorage.getItem(SEEN) === '1'; } catch {}
  if (!seen && !location.hash && !location.search && location.pathname === '/') open();
})();

// ===== Endereços das seções =====
// Cada seção da página inicial tem um endereço próprio: clicar em "Sistemas" mostra /sistemas na barra,
// abrir /sistemas direto (link compartilhado ou F5) leva à seção, e o botão "voltar" volta à seção anterior.
// Na Vercel, esses endereços entregam a página inicial (rewrites em vercel.json); o canonical continua "/".
const SECTION_PATHS = {
  servicos: 'cotacoes', sistemas: 'sistemas', materiais: 'materiais', ferramentas: 'dimensionamento',
  normas: 'normas', artigos: 'artigos', feiras: 'feiras', publico: 'para-quem-e', anuncie: 'anuncie',
  assinaturas: 'assinaturas', sobre: 'quem-somos', contato: 'contato',
};
const SECTION_OF_PATH = Object.fromEntries(Object.entries(SECTION_PATHS).map(([id, path]) => [path, id]));
(() => {
  // id pode ser a própria seção ou um item dentro dela (ex.: #lmatTool em Dimensionamento): rola até o item
  // e mostra na barra o endereço da seção (/dimensionamento), sem "#"
  const sectionOf = id => SECTION_PATHS[id] ? id : document.getElementById(id)?.closest('section[id]')?.id;
  const go = (id, how = 'push', smooth = true) => {
    const el = document.getElementById(id), sec = sectionOf(id); if (!el || !SECTION_PATHS[sec]) return;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    if (sec !== id && !el.matches('dialog')) { el.classList.remove('search-flash'); void el.offsetWidth; el.classList.add('search-flash'); }   // destaca o cartão escolhido no submenu
    const url = '/' + SECTION_PATHS[sec];
    if (location.pathname + location.search + location.hash !== url) history[how === 'push' ? 'pushState' : 'replaceState']({ secao: sec }, '', url);
  };
  // cliques em qualquer link para uma seção ou item de seção (menu, rodapé, botões "Fale conosco"...)
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.button || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    const id = a.getAttribute('href').slice(1);
    if (!id || !SECTION_PATHS[sectionOf(id)]) return;
    e.preventDefault();
    if (sheet.open) sheet.close();
    go(id);
  });
  // "voltar" / "avançar" do navegador (a rolagem é feita aqui, não pelo navegador)
  history.scrollRestoration = 'manual';
  window.addEventListener('popstate', () => {
    const id = SECTION_OF_PATH[location.pathname.slice(1)];
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else if (location.pathname === '/') window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  // ao abrir o site por um endereço de seção (/sistemas) ou por um link antigo com "#" (/#sistemas)
  const start = () => {
    const byPath = SECTION_OF_PATH[location.pathname.slice(1)];
    const h = location.hash.slice(1), byHash = h && SECTION_PATHS[sectionOf(h)] ? h : null;
    const id = byHash || byPath;   // /contato#lmatTool (link antigo) vai ao item e corrige para /dimensionamento
    if (!id || sheet.open) return;
    const qs = new URLSearchParams(location.search);
    const onlyForm = [...qs.keys()].every(k => k === 'assunto' || k === 'msg');   // ?assunto=&msg= já preencheram o formulário
    go(id, 'replace', false);
    if (location.search && onlyForm) history.replaceState({ secao: sectionOf(id) }, '', '/' + SECTION_PATHS[sectionOf(id)]);
  };
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1); if (id && SECTION_PATHS[sectionOf(id)] && !sheet.open) go(id, 'replace'); });
})();
