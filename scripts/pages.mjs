// Gera uma página HTML própria (indexável pelo Google) para cada ficha do portal:
//   /sistemas/<id>   — sistemas / áreas de aplicação (SYSTEMS)
//   /materiais/<id>  — catálogo de produtos e materiais (CATALOG)
// Os dados vêm dos mesmos arquivos usados pelo site (site/*.js), executados num contexto isolado.
// Também gera o sitemap.xml com todas as URLs e imagens.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';
import { EMPRESA, institutionalPages } from './institucional.mjs';

export const BASE = 'https://www.pipesystem.com.br';

// ---------- dados ----------
export function loadData(siteDir) {
  const files = ['webtools.js', 'normas.js', 'products.js', 'systems.js', 'catalog.js', 'bim.js', 'glossario.js', 'sinapi-precos.js', 'comparativos.js'];
  const code = files.map(f => readFileSync(join(siteDir, f), 'utf8')).join('\n;\n') +
    '\n;({ PRODUCT_GROUPS, PRODUCTS, SYSTEMS, SYSTEM_PHOTOS, CATALOG, MANUFACTURERS, MATERIAL_PHOTOS, MATERIAL_ART, MATERIAL_OF_PRODUCT, REVISAO, revisaoData, revisaoHTML, normTags, linkNorms, bimBoxHTML, GLOSSARIO, CMPS, comparativoHTML, cmpLinksHTML, cmpTiposHTML, NORM_GROUPS, BIM_LIBS, WEB_TOOLS });';
  return vm.runInNewContext(code, { URL, console }, { filename: 'dados-do-site.js' });
}

// ---------- utilidades ----------
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const plain = s => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
function cut(text, max) {
  const t = plain(text);
  if (t.length <= max) return t;
  const s = t.slice(0, max - 1); return s.slice(0, s.lastIndexOf(' ')).replace(/[,;:.\s]+$/, '') + '…';
}
const abs = src => src.startsWith('http') ? src : `${BASE}/${src.replace(/^\//, '')}`;
const rel = src => src.startsWith('http') ? src : '/' + src.replace(/^\//, '');

export const pathOf = {
  sistema: id => `/sistemas/${id.replace(/^sis-/, '')}`,
  material: id => `/materiais/${id.replace(/^mat-/, '')}`,
};

// ---------- blocos reaproveitados das fichas do site ----------
// zoom (padrão): clicar na foto abre a imagem ampliada (site/lightbox.js)
function fotosHTML(fotos, titulo = '', zoom = true) {
  if (!fotos || !fotos.length) return '';
  const credits = fotos.filter((f, i, a) => a.findIndex(x => x.autor === f.autor && x.licenca === f.licenca) === i)
    .map(f => `<a href="${esc(f.fonte)}" target="_blank" rel="noopener noreferrer" class="notranslate" translate="no">${esc(f.autor)}</a> (<a href="${esc(f.licUrl)}" target="_blank" rel="noopener noreferrer">${esc(f.licenca)}</a>)`).join(', ');
  return `<figure class="pfotos${zoom ? ' pfotos--zoom' : ''}">${titulo ? `<h2 class="page__h">${titulo}</h2>` : ''}
      <div class="pfotos__grid">${fotos.map((f, i) => `<div class="pfotos__item"${zoom ? ' tabindex="0" role="button" aria-label="Ampliar foto: ' + esc(plain(f.legenda)) + '"' : ''}><img src="${esc(rel(f.src))}" alt="${esc(f.alt)}"${dims(f.src)}${i ? ' loading="lazy"' : ''} decoding="async"><span>${f.legenda}</span></div>`).join('')}</div>
      <figcaption>Fotos: ${credits}, via Wikimedia Commons</figcaption>
    </figure>`;
}
function tabelasHTML(tabelas, linkNorms) {
  if (!tabelas) return '';
  const cell = (t, v, i) => {
    if (!(t.estrelas || []).includes(i)) return `<td>${linkNorms(v)}</td>`;
    return v ? `<td class="ptable__stars" aria-label="${v} de 5"><span aria-hidden="true">${'★'.repeat(v)}</span></td>` : '<td class="ptable__na" aria-label="não se aplica">—</td>';
  };
  return tabelas.map(t => `<section class="ptable">
      <h2 class="page__h">${t.titulo}</h2>
      <div class="ptable__wrap" tabindex="0" role="region" aria-label="${esc(t.titulo)}">
        <table><thead><tr>${t.colunas.map((c, i) => `<th scope="col"${(t.estrelas || []).includes(i) ? ' class="ptable__c"' : ''}>${c}</th>`).join('')}</tr></thead>
        <tbody>${t.linhas.map(l => `<tr>${l.map((v, i) => i === 0 ? `<th scope="row">${v}</th>` : cell(t, v, i)).join('')}</tr>`).join('')}</tbody></table>
      </div>
      ${t.nota ? `<p class="ptable__note">${linkNorms(t.nota)}</p>` : ''}
    </section>`).join('');
}
const list = (items, linkNorms) => items.map(i => `<li>${linkNorms(i)}</li>`).join('');
const contato = (assunto, msg) => `/?assunto=${encodeURIComponent(assunto)}&msg=${encodeURIComponent(msg)}#contato`;
function materialPhoto(D, m) {
  const ref = D.MATERIAL_PHOTOS[m.id];
  if (Array.isArray(ref)) return (D.PRODUCTS.find(p => p.id === ref[0])?.fotos || [])[ref[1]];
  return ref;
}

// ---------- página ----------
const FONT_LINKS = `<!-- Fontes do próprio site (styles.css): Inter (texto), Space Grotesk 700 (títulos) e Montserrat só com as letras da logomarca -->
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/space-grotesk-700-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/montserrat-logo.woff2" as="font" type="font/woff2" crossorigin>`;

// Largura e altura reais das fotos (preenchido pelo build), para a página não "pular" enquanto elas carregam
export const SIZES = {};
const dims = src => SIZES[src] ? ` width="${SIZES[src][0]}" height="${SIZES[src][1]}"` : '';
const LOGO = `<svg class="logo__svg" viewBox="0 0 300 86" aria-hidden="true"><path d="M26 6c9 12 16 21 16 30a16 16 0 0 1-32 0c0-9 7-18 16-30z" fill="#1fb6c9"/><path d="M16 38c4 3 8 3 10 0s6-3 10 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><text x="56" y="40" textLength="230" lengthAdjust="spacingAndGlyphs" font-family="Montserrat, 'Arial Black', sans-serif" font-weight="800" font-size="28" fill="#fff">PIPESYSTEM</text><rect x="56" y="50" width="236" height="6" rx="3" fill="#1fb6c9"/><rect x="128" y="47" width="6" height="12" rx="1.5" fill="#0a2240" stroke="#7ee7f2" stroke-width="1.5"/><rect x="212" y="47" width="6" height="12" rx="1.5" fill="#0a2240" stroke="#7ee7f2" stroke-width="1.5"/><path d="M286 46l8 7-8 7" fill="none" stroke="#f2a03d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="57" y="80" textLength="235" lengthAdjust="spacing" font-family="Montserrat, Arial, sans-serif" font-weight="500" font-size="14" fill="#f2a03d">conduzindo soluções</text></svg>`;

// Menu principal das páginas próprias: os mesmos itens, na mesma ordem, do menu da página inicial (site/index.html)
const MENU = [['/cotacoes', 'Cotações', 'pg-top__hot'], ['/sistemas', 'Sistemas'], ['/materiais', 'Materiais'], ['/dimensionamento', 'Dimensionamento'],
  ['/bim-cad', 'BIM/CAD'], ['/guias-praticos', 'Guias práticos'], ['/normas', 'Normas'], ['/artigos', 'Notícias'], ['/feiras', 'Feiras'],
  ['/anuncie', 'Anuncie'], ['/quem-somos', 'Quem somos'], ['/#contato', 'Cadastre-se', 'btn btn--sm']];
// Item do menu marcado como atual em cada página própria
const secaoAtual = url => url.startsWith('/sistemas') ? '/sistemas' : url.startsWith('/materiais') ? '/materiais'
  : /^\/(comparativos|glossario)/.test(url) ? '/guias-praticos' : url === '/noticias' ? '/artigos' : '';

function page({ url, title, description, image, imageAlt, crumbs, body, wide, keywords, reviewed, ld: extraLd = [], glossSkip }) {
  const canonical = BASE + url;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': canonical + '#pagina', url: canonical, name: title, description, inLanguage: 'pt-BR',
        isPartOf: { '@id': BASE + '/#site' }, publisher: { '@id': BASE + '/#organizacao' },
        ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
        ...(keywords ? { keywords } : {}),
        ...(reviewed ? { lastReviewed: reviewed, reviewedBy: { '@id': BASE + '/#organizacao' } } : {}),
        breadcrumb: { '@id': canonical + '#trilha' } },
      { '@type': 'BreadcrumbList', '@id': canonical + '#trilha',
        itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, ...(c.url ? { item: BASE + c.url } : {}) })) },
      ...extraLd,
    ],
  };
  const ogImage = image || `${BASE}/img/og-pipesystem.jpg`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#061527">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="PipeSystem">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:url" content="${canonical}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:alt" content="${esc(imageAlt || title)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  <link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32.png">
  <link rel="apple-touch-icon" href="/img/icons/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  ${FONT_LINKS}
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
</head>
<body class="pg"${glossSkip ? ` data-gloss-skip="${glossSkip}"` : ''}>
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="pg-top">
  <div class="container pg-top__inner">
    <a href="/" class="logo" aria-label="PIPESYSTEM — página inicial">${LOGO}</a>
    <button class="pg-top__toggle" id="pgToggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="pgNav"><span></span><span></span><span></span></button>
    <nav class="pg-top__nav" id="pgNav" aria-label="Seções do portal">
      ${MENU.map(([href, nome, cls]) => `<a href="${href}"${cls ? ` class="${cls}"` : ''}${href === secaoAtual(url) ? ' aria-current="page"' : ''}>${nome}</a>`).join('')}
    </nav>
  </div>
</header>
<script>
(() => {
  // O menu nunca passa da tela: se não couber, aperta (pg-tight, pg-tighter) e, por fim, vira o botão de três linhas (pg-collapse)
  const html = document.documentElement, nav = document.getElementById('pgNav'), btn = document.getElementById('pgToggle');
  const inner = nav.parentElement, logo = inner.querySelector('.logo');
  const cabe = () => logo.getBoundingClientRect().width + 24 + nav.scrollWidth <= inner.clientWidth;
  const ajusta = () => {
    html.classList.remove('pg-tight', 'pg-tighter', 'pg-collapse');
    if (cabe()) return;
    html.classList.add('pg-tight'); if (cabe()) return;
    html.classList.add('pg-tighter'); if (cabe()) return;
    html.classList.remove('pg-tight', 'pg-tighter'); html.classList.add('pg-collapse');
  };
  ajusta();
  addEventListener('resize', ajusta);
  if (document.fonts) document.fonts.ready.then(ajusta);
  btn.addEventListener('click', () => { const a = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', a); btn.setAttribute('aria-label', a ? 'Fechar menu' : 'Abrir menu'); });
})();
</script>
<main id="conteudo" tabindex="-1" class="pg-main">
  <div class="container">
    <nav class="crumbs" aria-label="Você está em">
      <ol>${crumbs.map((c, i) => `<li>${c.url && i < crumbs.length - 1 ? `<a href="${c.url}">${esc(c.name)}</a>` : `<span aria-current="page">${esc(c.name)}</span>`}</li>`).join('')}</ol>
    </nav>
    <article class="sheet sheet--page${wide ? ' sheet--wide' : ''}">
${body}
    </article>
  </div>
</main>
<footer class="pg-foot">
  <div class="container pg-foot__inner">
    <p><strong>PipeSystem</strong> — o portal da hidráulica e dos sistemas de condução de fluidos.</p>
    <p><a href="/">Página inicial</a> · <a href="/materiais">Catálogo de produtos e materiais</a> · <a href="/normas">Normas</a> · <a href="mailto:info@pipesystem.com.br">info@pipesystem.com.br</a> · <a href="https://wa.me/5547988027372" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
    <p class="pg-foot__copy">© ${new Date().getFullYear()} ${[EMPRESA.razao, EMPRESA.cnpj && 'CNPJ ' + EMPRESA.cnpj, EMPRESA.endereco].filter(Boolean).join(' · ')} · <a href="/politica-editorial">Política Editorial</a> · <a href="/privacidade">Política de Privacidade</a> · <a href="/termos">Termos de Uso</a></p>
  </div>
</footer>
<script src="/lightbox.js" defer></script>
<script src="/glossario.js" defer></script>
<!-- Medição de audiência sem cookies (Vercel Web Analytics): dados agregados e anônimos -->
<script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;
}

// ---------- geração ----------
export function generate(D, outDir) {
  const pages = [];
  const { linkNorms, normTags } = D;
  const productById = Object.fromEntries(D.PRODUCTS.map(p => [p.id, p]));
  const materialById = Object.fromEntries(D.CATALOG.map(m => [m.id, m]));
  const materialOf = id => materialById[D.MATERIAL_OF_PRODUCT[id] || id];
  const systemsUsing = m => D.SYSTEMS.filter(s => (s.produtos || []).some(id => (D.MATERIAL_OF_PRODUCT[id] || id) === m.id));
  const normNote = '<p class="tags__note">Clique na norma para ver o resumo ou comprar no site oficial.</p>';
  const links = arr => `<p class="relprod">${arr.map(([href, name]) => `<a href="${href}">${esc(name)}</a>`).join('')}</p>`;

  // Sistemas
  for (const s of D.SYSTEMS) {
    const url = pathOf.sistema(s.id);
    const svg = s.svg.replace(/<path class="(p2?|pe)([^"]*)"([^>]*)\/>/g, m => m + m.replace(/class="[^"]*"/, 'class="flowline"'));
    const fotos = D.SYSTEM_PHOTOS[s.id] || [];
    const outros = D.SYSTEMS.filter(x => x.id !== s.id);
    const body = `      <div class="sheet__head"><span class="sys__dot sys__dot--lg" style="--c:${s.color}"></span>
        <div><p class="eyebrow">Sistema hidráulico</p><h1 id="sheetTitle" class="page__title">${esc(s.name)}</h1></div></div>
      ${D.revisaoHTML(s)}
      <figure class="sysfig" style="--c:${s.color}">
        <svg viewBox="0 0 320 170" role="img" aria-label="Esquema ilustrativo: ${esc(s.name)}">${svg}</svg>
        <figcaption>Esquema ilustrativo, sem escala</figcaption>
      </figure>
      ${fotosHTML(fotos, 'Instalações reais')}
      <p class="sheet__desc page__lead">${linkNorms(s.desc)}</p>
      <div class="prod__cols">
        <section><h2 class="page__h">Componentes principais</h2><ul>${list(s.componentes, linkNorms)}</ul></section>
        <section><h2 class="page__h">Pontos de atenção</h2><ul>${list(s.cuidados, linkNorms)}</ul></section>
      </div>
      <h2 class="page__h">Normas de referência</h2>
      <p class="tags tags--links">${normTags(s.normas)}</p>${normNote}
      <h2 class="page__h">Produtos e materiais usados</h2>${links([...new Set(s.produtos.map(materialOf).filter(Boolean))].map(m => [pathOf.material(m.id), m.name]))}
      <h2 class="page__h">Outros sistemas</h2>${links(outros.map(x => [pathOf.sistema(x.id), x.name]))}
      <div class="sheet__actions">
        <a href="${contato('Consulta técnica', `Pergunta sobre ${s.name}: `)}" class="btn">Fazer uma pergunta</a>
        <a href="${contato('Cotação de materiais', `Cotação para ${s.name}: `)}" class="btn btn--ghost">Solicitar cotação</a>
      </div>`;
    pages.push({ url, images: fotos.map(f => abs(f.src)), html: page({
      url, body, reviewed: D.revisaoData(s),
      title: `${s.name} — sistema hidráulico: componentes e normas | PipeSystem`,
      description: cut(`${plain(s.desc)}`, 158),
      image: fotos[0] && abs(fotos[0].src), imageAlt: fotos[0] && fotos[0].alt, keywords: [s.name, ...s.normas].join(', '),
      crumbs: [{ name: 'Início', url: '/' }, { name: 'Sistemas hidráulicos', url: '/sistemas' }, { name: s.name, url }],
    }) });
  }

  // Catálogo de materiais
  for (const m of D.CATALOG) {
    const url = pathOf.material(m.id); const foto = materialPhoto(D, m);
    const p = productById[m.rel] || (m.tipos ? { tipos: m.tipos, escolha: m.escolha || [], normas: [], fotos: m.fotos } : null); const veja = materialById[m.veja]; const fabs = D.MANUFACTURERS[m.id] || [];
    const normas = [...new Set([...m.normas, ...(p ? p.normas : [])])]; const sist = systemsUsing(m);
    const fotos = p && p.fotos && p.fotos.length ? p.fotos : m.fotos && m.fotos.length ? m.fotos : null;
    const importers = fabs.length > 0 && fabs.every(f => f[2] === 'M'); const misto = fabs.some(f => f[2] === 'M');
    const mesmos = D.CATALOG.filter(x => x.cat === m.cat && x.id !== m.id);
    const fig = fotos ? fotosHTML(fotos) : foto ? `<figure class="matfig matfig--foto matfig--zoom" tabindex="0" role="button" aria-label="Ampliar foto: ${esc(plain(foto.legenda))}" data-legenda="${esc(plain(foto.legenda))}">
        <img src="${esc(rel(foto.src))}" alt="${esc(foto.alt)}"${dims(foto.src)}${foto.inteira ? ' class="inteira"' : ''} decoding="async">
        <figcaption>${foto.legenda} · Foto: <a href="${esc(foto.fonte)}" target="_blank" rel="noopener noreferrer" class="notranslate" translate="no">${esc(foto.autor)}</a> (<a href="${esc(foto.licUrl)}" target="_blank" rel="noopener noreferrer">${esc(foto.licenca)}</a>), via Wikimedia Commons</figcaption>
      </figure>` : `<figure class="matfig" style="--m:${m.tone}">
        <svg viewBox="0 0 200 120" role="img" aria-label="Ilustração: ${esc(m.name)}">${D.MATERIAL_ART[m.art](m.tone, m.tone2)}</svg>
        <figcaption>Ilustração representativa</figcaption>
      </figure>`;
    const body = `      <div class="sheet__head"><div><p class="eyebrow">Catálogo · ${esc(m.cat)}</p><h1 id="sheetTitle" class="page__title">${esc(m.name)}</h1></div></div>
      ${D.revisaoHTML(m)}
      ${fig}
      <p class="sheet__desc page__lead">${linkNorms(m.desc)}</p>
      ${p ? tabelasHTML(p.tabelas, linkNorms) : ''}
      <h2 class="page__h">Dados técnicos</h2>
      <table class="specs"><tbody>${m.specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${linkNorms(v)}</td></tr>`).join('')}</tbody></table>
      ${p ? `<div class="prod__cols">
        <section><h2 class="page__h">Tipos</h2><ul>${list(p.tipos, linkNorms)}</ul></section>
        <section><h2 class="page__h">Como escolher</h2><ul>${list(p.escolha, linkNorms)}</ul></section>
      </div>` : ''}
      <h2 class="page__h">Aplicações</h2><p class="sheet__desc">${linkNorms(m.apps)}.</p>
      <h2 class="page__h">Normas de referência</h2>
      <p class="tags tags--links">${normTags(normas)}</p>${normNote}
      ${veja ? `<p class="relprod"><a href="${pathOf.material(veja.id)}">Veja também: ${esc(veja.name)} →</a></p>` : ''}
      ${sist.length ? `<h2 class="page__h">Onde é usado</h2>${links(sist.map(x => [pathOf.sistema(x.id), x.name]))}` : ''}
      ${fabs.length ? `<h2 class="page__h">${importers ? 'Importadores' : misto ? 'Fabricantes e importadores' : 'Fabricantes'}</h2>
      <ul class="fabs">${fabs.map(([n, u, o]) => `<li>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">
        <span class="fabs__name notranslate" translate="no">${esc(n)}</span><span class="fabs__site notranslate" translate="no">${new URL(u).hostname.replace(/^www\./, '')} ↗</span></a>`
        : `<span class="fabs__nolink"><span class="fabs__name notranslate" translate="no">${esc(n)}</span><span class="fabs__site">site em breve</span></span>`}
        <span class="fabs__tag fabs__tag--${o}">${{ N: 'Nacional', I: 'Internacional', M: 'Importador' }[o]}</span></li>`).join('')}</ul>
      <p class="fabs__note">Lista indicativa, sem vínculo comercial com a PipeSystem. Sua empresa ${importers ? 'importa ou distribui' : misto ? 'fabrica ou importa' : 'fabrica'} este produto? <a href="/anuncie">Anuncie aqui</a>.</p>` : ''}
      ${D.cmpTiposHTML(m.id, 'h2')}
      ${D.bimBoxHTML(m.id, 'h2')}
      ${D.cmpLinksHTML(m.id, 'h2')}
      ${mesmos.length ? `<h2 class="page__h">Outros itens de ${esc(m.cat)}</h2>${links(mesmos.map(x => [pathOf.material(x.id), x.name]))}` : ''}
      <div class="sheet__actions">
        <a href="${contato('Cotação de materiais', `Cotação de ${m.name}: (informe diâmetros, quantidades e local de entrega) `)}" class="btn">Solicitar cotação</a>
        <a href="${contato('Consulta técnica', `Consulta sobre ${m.name}: `)}" class="btn btn--ghost">Consulta técnica</a>
      </div>`;
    const imgs = fotos ? fotos.map(f => abs(f.src)) : foto ? [abs(foto.src)] : [];
    const capa = fotos ? fotos[0] : foto;
    pages.push({ url, images: imgs, html: page({
      url, body, wide: !!(p && p.tabelas), reviewed: D.revisaoData(m),
      title: `${m.name} — dados técnicos, tipos, normas e fabricantes | PipeSystem`,
      description: cut(`${plain(m.desc)} Dados técnicos, normas e ${importers ? 'importadores' : 'fabricantes'}.`, 158),
      image: capa && abs(capa.src), imageAlt: capa && capa.alt, keywords: [...new Set([m.name, m.cat, ...normas, ...(m.chaves || []), ...fabs.map(f => f[0])])].join(', '),
      crumbs: [{ name: 'Início', url: '/' }, { name: 'Catálogo de produtos e materiais', url: '/materiais' }, { name: m.name, url }],
    }) });
  }

  // Glossário técnico: índice (/glossario) e uma página por termo (/glossario/<termo>)
  const G = D.GLOSSARIO, gById = Object.fromEntries(G.map(x => [x.id, x]));
  const SET_ID = BASE + '/glossario#glossario';
  const gCrumbs = [{ name: 'Início', url: '/' }, { name: 'Guias práticos', url: '/guias-praticos' }, { name: 'Glossário técnico', url: '/glossario' }];
  const letterOf = x => x.t.normalize('NFD').replace(/[̀-ͯ]/g, '')[0].toUpperCase();
  const gLetters = [...new Set(G.map(letterOf))];
  {
    const url = '/glossario';
    const body = `      <div class="sheet__head"><div><p class="eyebrow">Guias práticos</p><h1 id="sheetTitle" class="page__title">Glossário técnico da hidráulica</h1></div></div>
      <p class="sheet__desc page__lead">${G.length} termos usados em projeto, obra, compra e manutenção de instalações hidráulicas e de condução de fluidos, com o termo em inglês, a fórmula quando houver, a norma de referência e links para as fichas, as calculadoras e os guias do portal.</p>
      <nav class="glindex__letters" aria-label="Letra inicial">${gLetters.map(l => `<a href="#letra-${l}">${l}</a>`).join('')}</nav>
      <div class="glindex">${gLetters.map(l => `
        <h2 class="page__h" id="letra-${l}">${l}</h2>
        <dl>${G.filter(x => letterOf(x) === l).map(x => `<div><dt><a href="/glossario/${x.id}">${esc(x.t)}</a> <span class="glterm__en" lang="en">${esc(x.en)}</span></dt><dd>${esc(x.def)}</dd></div>`).join('')}</dl>`).join('')}
      </div>
      <div class="sheet__actions">
        <a href="/guias-praticos" class="btn">Ver os guias práticos</a>
        <a href="${contato('Consulta técnica', 'Sugestão de termo para o glossário: ')}" class="btn btn--ghost">Sugerir um termo</a>
      </div>`;
    pages.push({ url, images: [], html: page({ url, body, glossSkip: '-',
      title: 'Glossário técnico da hidráulica e condução de fluidos | PipeSystem',
      description: cut(`${G.length} termos de instalações hidráulicas explicados: perda de carga, golpe de aríete, NPSH, fecho hídrico, SDR, UHC, termofusão e mais, com fórmulas e normas.`, 158),
      crumbs: gCrumbs,
      ld: [{ '@type': 'DefinedTermSet', '@id': SET_ID, name: 'Glossário técnico PipeSystem', url: BASE + url, inLanguage: 'pt-BR',
        hasDefinedTerm: G.map(x => ({ '@type': 'DefinedTerm', name: x.t, url: BASE + '/glossario/' + x.id })) }],
    }) });
  }
  for (const x of G) {
    const url = '/glossario/' + x.id;
    const ver = x.ver.filter(v => gById[v]);
    const mesmos = G.filter(y => y.tema === x.tema && y.id !== x.id);
    const body = `      <div class="sheet__head"><div><p class="eyebrow">Glossário técnico · ${esc(x.tema)}</p><h1 id="sheetTitle" class="page__title">${esc(x.t)}</h1></div></div>
      <p class="glpage__en" lang="en">Em inglês: ${esc(x.en)}</p>
      <p class="glpage__answer"><b>O que é:</b> ${x.def}</p>
      ${x.exp ? `<h2 class="page__h">Como funciona</h2><p class="sheet__desc">${x.exp}</p>` : ''}
      ${x.f ? `<div class="formula">${x.f[0]}<small>${x.f[1]}</small></div>` : ''}
      ${x.norma ? `<h2 class="page__h">Norma de referência</h2><p class="tags tags--links">${normTags(x.norma.split(' · '))}</p>${normNote}` : ''}
      ${x.links.length ? `<h2 class="page__h">No portal</h2>${links(x.links.map(([n, u]) => [u, n]))}` : ''}
      ${ver.length ? `<h2 class="page__h">Termos relacionados</h2>${links(ver.map(v => ['/glossario/' + v, gById[v].t]))}` : ''}
      ${mesmos.length ? `<h2 class="page__h">Outros termos de ${esc(x.tema)}</h2>${links(mesmos.map(y => ['/glossario/' + y.id, y.t]))}` : ''}
      <div class="sheet__actions">
        <a href="/glossario" class="btn">Ver todo o glossário</a>
        <a href="${contato('Consulta técnica', `Dúvida sobre ${x.t}: `)}" class="btn btn--ghost">Fazer uma pergunta</a>
      </div>`;
    pages.push({ url, images: [], html: page({ url, body, glossSkip: x.id,
      title: `${x.t}: o que é — Glossário técnico | PipeSystem`,
      description: cut(`${plain(x.def)} ${plain(x.exp || '')}`, 158),
      keywords: [x.t, x.en, x.tema, x.norma].filter(Boolean).join(', '),
      crumbs: [...gCrumbs, { name: x.t, url }],
      ld: [{ '@type': 'DefinedTerm', '@id': BASE + url + '#termo', name: x.t, alternateName: x.en, description: plain(x.def), url: BASE + url, inDefinedTermSet: SET_ID }],
    }) });
  }

  // Comparativos: índice (/comparativos) e uma página por comparativo (/comparativos/<tema>)
  {
    const cCrumbs = [{ name: 'Início', url: '/' }, { name: 'Guias práticos', url: '/guias-praticos' }, { name: 'Comparativos', url: '/comparativos' }];
    const url = '/comparativos';
    const body = `      <div class="sheet__head"><div><p class="eyebrow">Guias práticos</p><h1 id="sheetTitle" class="page__title">Comparativos: qual material ou sistema escolher?</h1></div></div>
      <p class="sheet__desc page__lead">Comparativos neutros, por material e sistema (sem marcas), com temperatura e pressão, vida útil, incêndio, junta, mão de obra, normas, custo de referência SINAPI e as fontes de cada dado.</p>
      <dl class="glindex">${D.CMPS.map(c => `<div><dt><a href="/comparativos/${c.id}">${esc(c.titulo)}</a></dt><dd>${esc(c.resumo.replace(/\{\w+\}/g, ''))}</dd></div>`).join('')}</dl>
      <div class="sheet__actions"><a href="/guias-praticos" class="btn">Ver os guias práticos</a></div>`;
    pages.push({ url, images: [], html: page({ url, body, glossSkip: '-',
      title: 'Comparativos de materiais e sistemas hidráulicos | PipeSystem',
      description: cut('Qual escolher? CPVC, PPR, PEX ou cobre; PVC ou ferro fundido no esgoto; PEAD, PVC-O ou ferro dúctil; gaveta ou esfera: comparativos com fontes e custo SINAPI.', 158),
      crumbs: cCrumbs }) });
    for (const c of D.CMPS) {
      const u = '/comparativos/' + c.id;
      const outros = D.CMPS.filter(x => x.id !== c.id);
      const body = `      <div class="sheet__head"><div><p class="eyebrow">Comparativo · ${esc(c.tema)}</p><h1 id="sheetTitle" class="page__title">${esc(c.titulo)}</h1></div></div>
      ${D.revisaoHTML({})}
      ${D.comparativoHTML(c, { page: true, uf: 'SC', erros: '/guias-praticos', cotacao: contato('Cotação de materiais', `Cotação (comparativo: ${c.titulo}): `) })}
      <p class="cp-note">Custos em Santa Catarina. Na <a href="/guias-praticos">página de Guias práticos</a> você escolhe o estado.</p>
      <h2 class="page__h">Outros comparativos</h2>${links(outros.map(x => ['/comparativos/' + x.id, x.titulo]))}`;
      pages.push({ url: u, images: [], html: page({ url: u, body, wide: true, reviewed: D.revisaoData({}),
        title: `${c.titulo} Comparativo | PipeSystem`,
        description: cut(plain(c.resumo.replace(/\{\w+\}/g, '')), 158),
        keywords: [...new Set([c.tema, ...c.opcoes.map(o => o[0]), ...(c.chaves || [])])].join(', '),
        crumbs: [...cCrumbs, { name: c.titulo, url: u }] }) });
    }
  }

  // Notícias do setor (/noticias): lista curada à mão a cada 5 dias em site/noticias.json, das mais novas para as mais antigas
  if (existsSync('site/noticias.json')) {
    const N = JSON.parse(readFileSync('site/noticias.json', 'utf8'));
    const url = '/noticias';
    const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const br = d => d.split('-').reverse().join('/');
    const cats = [...new Set(N.itens.map(n => n.categoria))];
    const ufs = [...new Set(N.itens.map(n => n.uf).filter(Boolean))].sort();
    const relTitulo = Object.fromEntries(D.CMPS.map(c => ['/comparativos/' + c.id, c.titulo]));
    // Lotes de 5 dias contados a partir da última atualização
    const ref = Date.parse(N.atualizado);
    const lote = d => {
      const k = Math.max(0, Math.floor((ref - Date.parse(d)) / 864e5 / 5));
      const fim = new Date(ref - k * 5 * 864e5), ini = new Date(fim - 4 * 864e5);
      const f = x => `${x.getUTCDate()} ${MES[x.getUTCMonth()]}`;
      return k === 0 ? `Atualização mais recente · ${f(ini)} a ${f(fim)}` : `${f(ini)} a ${f(fim)} de ${fim.getUTCFullYear()}`;
    };
    let atual = '';
    const lista = N.itens.map(n => {
      const g = lote(n.data); const cab = g !== atual ? `<li class="nt__lote">${g}</li>` : ''; atual = g;
      const [a, m, d] = n.data.split('-');
      return `${cab}<li class="nt__item" data-cat="${esc(n.categoria)}" data-uf="${esc(n.uf || '')}"${n.oportunidade ? ' data-op="1"' : ''}>
        <time class="nt__data" datetime="${n.data}"><b>${d}</b>${MES[m - 1]} ${a}</time>
        <div><p class="nt__meta"><span class="nt__tag nt__tag--cat">${esc(n.categoria)}</span>${n.uf ? `<span class="nt__tag">${esc(n.uf)}</span>` : ''}${n.valor ? `<span class="nt__tag nt__tag--valor">${esc(n.valor)}</span>` : ''}${n.oportunidade ? '<span class="nt__tag nt__tag--op">Oportunidade de negócio</span>' : ''}</p>
        <h2 class="nt__titulo"><a href="${esc(n.link)}" target="_blank" rel="noopener nofollow">${esc(n.titulo)}</a></h2>
        ${n.resumo ? `<p class="nt__resumo">${esc(n.resumo)}</p>` : ''}
        <p class="nt__fonte"><span>Fonte: ${esc(n.fonte)}</span>${n.relacionado && relTitulo[n.relacionado] ? `<a href="${n.relacionado}">No portal: ${esc(relTitulo[n.relacionado])} →</a>` : ''}</p></div></li>`;
    }).join('');
    const body = `      <div class="nt__hero">
        <p class="nt__sobre">Portal da Hidráulica</p>
        <h1 id="sheetTitle" class="nt__h1">Notícias do setor</h1>
        <p class="nt__lead">Investimentos, obras, leilões, lançamentos e normas de saneamento, instalações hidráulicas, gás, indústria e combate a incêndio. Selecionadas a cada 5 dias, das mais recentes para as mais antigas.</p>
        <p class="nt__abas"><a href="#ntLista">Notícias do setor</a><a href="#cursos">Cursos, treinamentos e eventos</a><a href="#vagas">Vagas do setor</a></p>
      </div>
      <div class="nt__filtros" role="group" aria-label="Filtrar notícias">
        <div class="nt__chips" id="ntCats"><button type="button" class="nt__chip" aria-pressed="true" data-c="">Todas</button>${cats.map(c => `<button type="button" class="nt__chip" aria-pressed="false" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div>
        <select id="ntUf" aria-label="Estado"><option value="">Todos os estados</option>${ufs.map(u => `<option>${u}</option>`).join('')}</select>
        <input id="ntBusca" type="search" placeholder="Buscar: Sanepar, adutora, leilão..." aria-label="Buscar nas notícias">
        <label class="nt__op"><input type="checkbox" id="ntOp"> Só oportunidades de negócio</label>
      </div>
      <ol class="nt" id="ntLista">${lista}</ol>
      <p class="nt__vazio" id="ntVazio" hidden>Nenhuma notícia com esses filtros.</p>
      <p class="nt__nota">Os títulos, as datas e os links são das fontes originais; cada notícia abre no site que a publicou. Os resumos são escritos pelo PipeSystem. Viu uma notícia do setor que não está aqui? <a href="${contato('Sugestão de notícia', 'Link da notícia: ')}">Envie para nós</a>.</p>
      <script>
      (() => {
        const $ = id => document.getElementById(id), itens = [...document.querySelectorAll('#ntLista .nt__item')], lotes = [...document.querySelectorAll('#ntLista .nt__lote')];
        let cat = '';
        const filtra = () => {
          const u = $('ntUf').value, q = $('ntBusca').value.trim().toLowerCase(), op = $('ntOp').checked;
          let n = 0;
          for (const li of itens) { const ok = (!cat || li.dataset.cat === cat) && (!u || li.dataset.uf === u) && (!op || li.dataset.op) && (!q || li.textContent.toLowerCase().includes(q)); li.hidden = !ok; n += ok ? 1 : 0; }
          for (const l of lotes) { let x = l.nextElementSibling, vis = false; while (x && !x.classList.contains('nt__lote')) { vis ||= !x.hidden; x = x.nextElementSibling; } l.hidden = !vis; }
          $('ntVazio').hidden = n > 0;
        };
        $('ntCats').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $('ntCats').querySelectorAll('.nt__chip').forEach(x => x.setAttribute('aria-pressed', x === b)); filtra(); });
        ['ntUf', 'ntBusca', 'ntOp'].forEach(id => $(id).addEventListener('input', filtra));
      })();
      </script>
      ${cursosHTML()}
      ${vagasHTML()}`;
    pages.push({ url, images: [], html: page({ url, body, wide: true, glossSkip: '-',
      title: 'Notícias do setor: hidráulica, saneamento, gás e construção | PipeSystem',
      description: cut('Investimentos, obras, leilões, lançamentos e normas de saneamento, instalações hidráulicas, gás, indústria e combate a incêndio, selecionados a cada 5 dias.', 158),
      keywords: ['notícias', 'saneamento', 'hidráulica', 'construção', 'leilão', 'investimento', 'lançamento', ...cats,
        'cursos', 'treinamentos', 'eventos', 'feiras', 'capacitação', 'curso de instalador hidráulico', 'curso de encanador', 'NBR 5626', 'sprinklers', 'bombas',
        'vagas', 'emprego', 'vaga de encanador', 'bombeiro hidráulico', 'projetista hidráulico', 'tubulação industrial', 'operador de ETA'].join(', '),
      crumbs: [{ name: 'Início', url: '/' }, { name: 'Notícias', url }],
      ld: [{ '@type': 'ItemList', '@id': BASE + url + '#lista', itemListOrder: 'https://schema.org/ItemListOrderDescending', numberOfItems: N.itens.length,
        itemListElement: N.itens.slice(0, 50).map((n, i) => ({ '@type': 'ListItem', position: i + 1, url: n.link, name: n.titulo })) }],
    }) });
  }

  // Política de Privacidade e Termos de Uso
  for (const p of institutionalPages()) {
    pages.push({ url: p.url, images: [], html: page({ url: p.url, title: p.title, description: p.description, body: p.body,
      crumbs: [{ name: 'Início', url: '/' }, { name: p.h1, url: p.url }] }) });
  }

  for (const p of pages) {
    const file = join(outDir, p.url.replace(/^\//, '') + '.html');
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, p.html);
  }
  return pages;
}

// ---------- cursos, treinamentos e eventos (site/cursos.json, curado à mão junto com as notícias) ----------
// Itens com data saem sozinhos depois do fim; os sem data (programas contínuos, turmas a anunciar) ficam até serem retirados
const curSlug = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
const CUR_PUB = { instalador: 'Instaladores', projeto: 'Projetistas e engenheiros', industrial: 'Industrial e tubulações', bombas: 'Bombas',
  incendio: 'Incêndio e sprinklers', clima: 'Água quente e climatização', evento: 'Feiras e eventos' };
function cursosData() {
  if (!existsSync('site/cursos.json')) return null;
  const C = JSON.parse(readFileSync('site/cursos.json', 'utf8')), hoje = new Date().toISOString().slice(0, 10);
  const datados = C.itens.filter(c => c.inicio && (c.fim || c.inicio) >= hoje).sort((a, b) => a.inicio.localeCompare(b.inicio));
  return { ...C, datados, continuos: C.itens.filter(c => !c.inicio) };
}
function cursosHTML() {
  const C = cursosData();
  if (!C) return '';
  const br = d => d.split('-').reverse().join('/');
  const item = c => `<li class="cur__item" data-p="${c.publico.join(' ')}">
          <div class="cur__quando"><b>${esc(c.quando)}</b>${c.detalhe ? `<small>${esc(c.detalhe)}</small>` : ''}</div>
          <div><p class="nt__meta"><span class="nt__tag nt__tag--cat">${esc(c.tipo)}</span>${c.publico.map(p => `<span class="nt__tag">${CUR_PUB[p]}</span>`).join('')}${c.situacao === 'ok' ? '' : '<span class="nt__tag nt__tag--valor">Confirmar data</span>'}</p>
          <h4 class="cur__titulo" id="curso-${curSlug(c.titulo + (c.inicio ? '-' + c.inicio : ''))}"><a href="${esc(c.link)}" target="_blank" rel="noopener nofollow">${esc(c.titulo)}</a></h4>
          <p class="cur__meta"><b>${esc(c.entidade)}</b> · ${esc(c.local)} · ${esc(c.carga)}</p>${c.obs ? `<p class="cur__obs">${esc(c.obs)}</p>` : ''}</div></li>`;
  return `<section class="cur" id="cursos">
        <h2 class="cur__h2">Cursos, treinamentos e eventos</h2>
        <p class="cur__lead">Capacitação de fabricantes, associações, escolas e entidades para instaladores, projetistas e engenheiros de instalações hidráulicas prediais, comerciais e industriais. Em ordem de data, da mais próxima para a mais distante.</p>
        <div class="nt__chips" id="curPub" role="group" aria-label="Filtrar cursos por público"><button type="button" class="nt__chip" aria-pressed="true" data-p="">Todos</button>${Object.entries(CUR_PUB).map(([k, v]) => `<button type="button" class="nt__chip" aria-pressed="false" data-p="${k}">${v}</button>`).join('')}</div>
        <h3 class="cur__sub">Próximos, com data</h3>
        <ol class="cur__lista">${C.datados.map(item).join('')}</ol>
        <h3 class="cur__sub">Programas contínuos e turmas a anunciar</h3>
        <ol class="cur__lista">${C.continuos.map(item).join('')}</ol>
        <p class="nt__nota">"Confirmar data": a data veio de notícia ou de agenda de terceiros, ou a página do organizador não mostra o ano. Confirme sempre com o organizador. Promove um curso, treinamento ou evento do setor? <a href="${contato('Divulgação de curso ou evento', 'Nome, data, local e link do curso ou evento: ')}">Envie para nós</a>.</p>
        <script>
        (() => {
          const box = document.getElementById('curPub'), itens = [...document.querySelectorAll('#cursos .cur__item')];
          box.addEventListener('click', e => { const b = e.target.closest('[data-p]'); if (!b) return; box.querySelectorAll('.nt__chip').forEach(x => x.setAttribute('aria-pressed', x === b));
            itens.forEach(li => { li.hidden = !!b.dataset.p && !li.dataset.p.split(' ').includes(b.dataset.p); }); });
        })();
        </script>
      </section>`;
}

// ---------- vagas do setor (site/vagas.json, curado à mão junto com as notícias) ----------
// Cada vaga sai sozinha no build depois do prazo (`ate`) ou, sem prazo, depois de `validadePadrao` dias da publicação
const VAGA_AREA = { predial: 'Instalações prediais', industrial: 'Tubulação industrial e caldeiraria', bombas: 'Manutenção e bombas',
  incendio: 'Combate a incêndio', saneamento: 'Saneamento', projeto: 'Projeto', vendas: 'Vendas técnicas' };
function vagasData() {
  if (!existsSync('site/vagas.json')) return null;
  const V = JSON.parse(readFileSync('site/vagas.json', 'utf8')), hoje = new Date().toISOString().slice(0, 10);
  const fim = v => v.ate || new Date(Date.parse(v.publicada) + (V.validadePadrao || 30) * 864e5).toISOString().slice(0, 10);
  return { ...V, itens: V.itens.filter(v => fim(v) >= hoje).sort((a, b) => b.publicada.localeCompare(a.publicada)) };
}
function vagasHTML() {
  const V = vagasData();
  if (!V || !V.itens.length) return '';
  const br = d => d.split('-').reverse().join('/');
  const areas = Object.keys(VAGA_AREA).filter(k => V.itens.some(v => v.area === k));
  const item = v => `<li class="cur__item" data-a="${v.area}">
          <div class="cur__quando"><b>${br(v.publicada)}</b><small>publicação${v.ate ? ` · inscrições até ${br(v.ate)}` : ''}</small></div>
          <div><p class="nt__meta"><span class="nt__tag nt__tag--cat">${VAGA_AREA[v.area]}</span></p>
          <h4 class="cur__titulo" id="vaga-${curSlug(v.titulo + '-' + v.local)}"><a href="${esc(v.link)}" target="_blank" rel="noopener nofollow">${esc(v.titulo)}</a></h4>
          <p class="cur__meta"><b>${esc(v.empresa)}</b> · ${esc(v.local)} · ${esc(v.contrato)}</p>${v.obs ? `<p class="cur__meta">${esc(v.obs)}</p>` : ''}</div></li>`;
  return `<section class="cur" id="vagas">
        <h2 class="cur__h2">Vagas do setor</h2>
        <p class="cur__lead">Vagas de emprego para encanadores, bombeiros hidráulicos, tubulação industrial, manutenção e bombas, combate a incêndio, saneamento, projeto e vendas técnicas de materiais hidráulicos, publicadas em portais de emprego e empresas. Da mais recente para a mais antiga.</p>
        <div class="nt__chips" id="vagaArea" role="group" aria-label="Filtrar vagas por área"><button type="button" class="nt__chip" aria-pressed="true" data-a="">Todas (${V.itens.length})</button>${areas.map(k => `<button type="button" class="nt__chip" aria-pressed="false" data-a="${k}">${VAGA_AREA[k]} (${V.itens.filter(v => v.area === k).length})</button>`).join('')}</div>
        <ol class="cur__lista">${V.itens.map(item).join('')}</ol>
        <p class="nt__nota">A candidatura é feita no site que publicou a vaga. O PipeSystem não participa da seleção. As vagas saem da lista depois do prazo ou cerca de 30 dias após a publicação; confirme na página da vaga se ela continua aberta. Sua empresa tem uma vaga no setor? <a href="${contato('Divulgação de vaga', 'Cargo, cidade, contrato e link da vaga: ')}">Envie para nós</a>.</p>
        <script>
        (() => {
          const box = document.getElementById('vagaArea'), itens = [...document.querySelectorAll('#vagas .cur__item')];
          box.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; box.querySelectorAll('.nt__chip').forEach(x => x.setAttribute('aria-pressed', x === b));
            itens.forEach(li => { li.hidden = !!b.dataset.a && li.dataset.a !== b.dataset.a; }); });
        })();
        </script>
      </section>`;
}

// ---------- últimas notícias na página inicial (seção Notícias, artigos e revistas) ----------
export function ultimasNoticiasHTML(qtd = 6) {
  if (!existsSync('site/noticias.json')) return '';
  const N = JSON.parse(readFileSync('site/noticias.json', 'utf8'));
  const br = d => d.split('-').reverse().join('/');
  const itens = N.itens.slice(0, qtd).map(n => `<li class="ntc__item"><time datetime="${n.data}">${br(n.data).slice(0, 5)}</time><div>
          <span class="nt__tag nt__tag--cat">${esc(n.categoria)}</span>${n.oportunidade ? ' <span class="nt__tag nt__tag--op">Oportunidade</span>' : ''}
          <a href="${esc(n.link)}" target="_blank" rel="noopener nofollow">${esc(n.titulo)}</a><small>${esc(n.fonte)}</small></div></li>`).join('');
  return `<div class="ntc" id="ultimas-noticias">
        <div class="ntc__head"><h3 class="mags__title">Notícias do setor</h3><div class="ntc__botoes"><a class="btn btn--sm" href="/noticias">Ver todas as notícias</a><a class="btn btn--sm" href="/noticias#cursos">Cursos, treinamentos e eventos</a><a class="btn btn--sm" href="/noticias#vagas">Vagas do setor</a></div></div>
        <ol class="ntc__lista">${itens}</ol>${proximosCursos()}
        <p class="ntc__nota">Novas notícias a cada 5 dias: investimentos, obras, leilões, lançamentos, normas e feiras.</p>
      </div>`;
}

// próximos 3 cursos ou eventos com data, abaixo das últimas notícias da página inicial
function proximosCursos(qtd = 3) {
  const C = cursosData();
  if (!C || !C.datados.length) return '';
  return `
        <h4 class="ntc__sub">Próximos cursos e eventos <a href="/noticias#cursos">Ver todos</a></h4>
        <ol class="ntc__lista">${C.datados.slice(0, qtd).map(c => `<li class="ntc__item ntc__item--cur"><time datetime="${c.inicio}">${c.inicio.slice(8, 10)}/${c.inicio.slice(5, 7)}</time><div>
          <span class="nt__tag nt__tag--cat">${esc(c.tipo)}</span>
          <a href="${esc(c.link)}" target="_blank" rel="noopener nofollow">${esc(c.titulo)}</a><small>${esc(c.entidade)} · ${esc(c.local.replace(/^Presencial · /, ''))}</small></div></li>`).join('')}</ol>`;
}

// ---------- sitemap ----------
export function sitemap(pages, homeImages, outDir) {
  const today = new Date().toISOString().slice(0, 10);
  const urlEntry = (loc, imgs, priority) => [
    '  <url>', `    <loc>${loc}</loc>`, `    <lastmod>${today}</lastmod>`, `    <priority>${priority}</priority>`,
    ...imgs.map(i => `    <image:image><image:loc>${esc(i)}</image:loc></image:image>`), '  </url>'].join('\n');
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    urlEntry(BASE + '/', homeImages, '1.0'),
    ...pages.map(p => urlEntry(BASE + p.url, p.images, '0.8')),
    '</urlset>', ''].join('\n');
  writeFileSync(join(outDir, 'sitemap.xml'), xml);
}
