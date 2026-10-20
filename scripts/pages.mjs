// Gera uma página HTML própria (indexável pelo Google) para cada ficha do portal:
//   /sistemas/<id>   — sistemas / áreas de aplicação (SYSTEMS)
//   /materiais/<id>  — catálogo de produtos e materiais (CATALOG)
// Os dados vêm dos mesmos arquivos usados pelo site (site/*.js), executados num contexto isolado.
// Também gera o sitemap.xml com todas as URLs e imagens.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import vm from 'node:vm';

export const BASE = 'https://www.pipesystem.com.br';

// ---------- dados ----------
export function loadData(siteDir) {
  const files = ['webtools.js', 'normas.js', 'products.js', 'systems.js', 'catalog.js'];
  const code = files.map(f => readFileSync(join(siteDir, f), 'utf8')).join('\n;\n') +
    '\n;({ PRODUCT_GROUPS, PRODUCTS, SYSTEMS, SYSTEM_PHOTOS, CATALOG, MANUFACTURERS, MATERIAL_PHOTOS, MATERIAL_ART, MATERIAL_OF_PRODUCT, normTags, linkNorms });';
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
// Teste: fotos ampliáveis (lightbox.js) só nestas fichas — o mesmo conjunto de site/script.js
const ZOOM_TEST = new Set(['sis-gas']);
function fotosHTML(fotos, titulo = '', zoom = false) {
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
const FONT_LINKS = `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- Fontes sem bloquear a exibição: Inter (texto), Space Grotesk 700 (títulos) e Montserrat só com as letras da logomarca -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;800&display=swap&text=PIPESYSTEMconduzindo%20solu%C3%A7%C3%B5es" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@700&family=Montserrat:wght@500;800&display=swap" rel="stylesheet"></noscript>`;

// Largura e altura reais das fotos (preenchido pelo build), para a página não "pular" enquanto elas carregam
export const SIZES = {};
const dims = src => SIZES[src] ? ` width="${SIZES[src][0]}" height="${SIZES[src][1]}"` : '';
const LOGO = `<svg class="logo__svg" viewBox="0 0 300 86" aria-hidden="true"><path d="M26 6c9 12 16 21 16 30a16 16 0 0 1-32 0c0-9 7-18 16-30z" fill="#1fb6c9"/><path d="M16 38c4 3 8 3 10 0s6-3 10 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/><text x="56" y="40" textLength="230" lengthAdjust="spacingAndGlyphs" font-family="Montserrat, 'Arial Black', sans-serif" font-weight="800" font-size="28" fill="#fff">PIPESYSTEM</text><rect x="56" y="50" width="236" height="6" rx="3" fill="#1fb6c9"/><rect x="128" y="47" width="6" height="12" rx="1.5" fill="#0a2240" stroke="#7ee7f2" stroke-width="1.5"/><rect x="212" y="47" width="6" height="12" rx="1.5" fill="#0a2240" stroke="#7ee7f2" stroke-width="1.5"/><path d="M286 46l8 7-8 7" fill="none" stroke="#f2a03d" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><text x="57" y="80" textLength="235" lengthAdjust="spacing" font-family="Montserrat, Arial, sans-serif" font-weight="500" font-size="14" fill="#f2a03d">conduzindo soluções</text></svg>`;

function page({ url, title, description, image, imageAlt, crumbs, body, wide, keywords }) {
  const canonical = BASE + url;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': canonical + '#pagina', url: canonical, name: title, description, inLanguage: 'pt-BR',
        isPartOf: { '@id': BASE + '/#site' }, publisher: { '@id': BASE + '/#organizacao' },
        ...(image ? { primaryImageOfPage: { '@type': 'ImageObject', url: image } } : {}),
        ...(keywords ? { keywords } : {}),
        breadcrumb: { '@id': canonical + '#trilha' } },
      { '@type': 'BreadcrumbList', '@id': canonical + '#trilha',
        itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, ...(c.url ? { item: BASE + c.url } : {}) })) },
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
<body class="pg">
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<header class="pg-top">
  <div class="container pg-top__inner">
    <a href="/" class="logo" aria-label="PIPESYSTEM — página inicial">${LOGO}</a>
    <nav class="pg-top__nav" aria-label="Seções do portal">
      <a href="/#sistemas">Sistemas</a><a href="/#materiais">Materiais</a><a href="/#normas">Normas</a><a href="/#contato" class="btn btn--sm">Fale conosco</a>
    </nav>
  </div>
</header>
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
    <p><a href="/">Página inicial</a> · <a href="/#materiais">Catálogo de produtos e materiais</a> · <a href="/#normas">Normas</a> · <a href="mailto:info@pipesystem.com.br">info@pipesystem.com.br</a> · <a href="https://wa.me/5547988027372" target="_blank" rel="noopener noreferrer">WhatsApp</a></p>
    <p class="pg-foot__copy">© ${new Date().getFullYear()} PipeSystem Serviços de Consultoria Ltda.</p>
  </div>
</footer>
<script src="/lightbox.js" defer></script>
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
      <figure class="sysfig" style="--c:${s.color}">
        <svg viewBox="0 0 320 170" role="img" aria-label="Esquema ilustrativo: ${esc(s.name)}">${svg}</svg>
        <figcaption>Esquema ilustrativo, sem escala</figcaption>
      </figure>
      ${fotosHTML(fotos, 'Instalações reais', ZOOM_TEST.has(s.id))}
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
      url, body,
      title: `${s.name} — sistema hidráulico: componentes e normas | PipeSystem`,
      description: cut(`${plain(s.desc)}`, 158),
      image: fotos[0] && abs(fotos[0].src), imageAlt: fotos[0] && fotos[0].alt, keywords: [s.name, ...s.normas].join(', '),
      crumbs: [{ name: 'Início', url: '/' }, { name: 'Sistemas hidráulicos', url: '/#sistemas' }, { name: s.name, url }],
    }) });
  }

  // Catálogo de materiais
  for (const m of D.CATALOG) {
    const url = pathOf.material(m.id); const foto = materialPhoto(D, m);
    const p = productById[m.rel]; const veja = materialById[m.veja]; const fabs = D.MANUFACTURERS[m.id] || [];
    const normas = [...new Set([...m.normas, ...(p ? p.normas : [])])]; const sist = systemsUsing(m);
    const fotos = p && p.fotos && p.fotos.length ? p.fotos : null;
    const importers = fabs.length > 0 && fabs.every(f => f[2] === 'M'); const misto = fabs.some(f => f[2] === 'M');
    const mesmos = D.CATALOG.filter(x => x.cat === m.cat && x.id !== m.id);
    const fig = fotos ? fotosHTML(fotos) : foto ? `<figure class="matfig matfig--foto">
        <img src="${esc(rel(foto.src))}" alt="${esc(foto.alt)}"${dims(foto.src)}${foto.inteira ? ' class="inteira"' : ''} decoding="async">
        <figcaption>${foto.legenda} · Foto: <a href="${esc(foto.fonte)}" target="_blank" rel="noopener noreferrer" class="notranslate" translate="no">${esc(foto.autor)}</a> (<a href="${esc(foto.licUrl)}" target="_blank" rel="noopener noreferrer">${esc(foto.licenca)}</a>), via Wikimedia Commons</figcaption>
      </figure>` : `<figure class="matfig" style="--m:${m.tone}">
        <svg viewBox="0 0 200 120" role="img" aria-label="Ilustração: ${esc(m.name)}">${D.MATERIAL_ART[m.art](m.tone, m.tone2)}</svg>
        <figcaption>Ilustração representativa</figcaption>
      </figure>`;
    const body = `      <div class="sheet__head"><div><p class="eyebrow">Catálogo · ${esc(m.cat)}</p><h1 id="sheetTitle" class="page__title">${esc(m.name)}</h1></div></div>
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
      <p class="fabs__note">Lista indicativa, sem vínculo comercial com a PipeSystem. Sua empresa ${importers ? 'importa ou distribui' : misto ? 'fabrica ou importa' : 'fabrica'} este produto? <a href="/#anuncie">Anuncie aqui</a>.</p>` : ''}
      ${mesmos.length ? `<h2 class="page__h">Outros itens de ${esc(m.cat)}</h2>${links(mesmos.map(x => [pathOf.material(x.id), x.name]))}` : ''}
      <div class="sheet__actions">
        <a href="${contato('Cotação de materiais', `Cotação de ${m.name}: (informe diâmetros, quantidades e local de entrega) `)}" class="btn">Solicitar cotação</a>
        <a href="${contato('Consulta técnica', `Consulta sobre ${m.name}: `)}" class="btn btn--ghost">Consulta técnica</a>
      </div>`;
    const imgs = fotos ? fotos.map(f => abs(f.src)) : foto ? [abs(foto.src)] : [];
    const capa = fotos ? fotos[0] : foto;
    pages.push({ url, images: imgs, html: page({
      url, body, wide: !!(p && p.tabelas),
      title: `${m.name} — dados técnicos, tipos, normas e fabricantes | PipeSystem`,
      description: cut(`${plain(m.desc)} Dados técnicos, normas e ${importers ? 'importadores' : 'fabricantes'}.`, 158),
      image: capa && abs(capa.src), imageAlt: capa && capa.alt, keywords: [m.name, m.cat, ...normas].join(', '),
      crumbs: [{ name: 'Início', url: '/' }, { name: 'Catálogo de produtos e materiais', url: '/materiais' }, { name: m.name, url }],
    }) });
  }

  for (const p of pages) {
    const file = join(outDir, p.url.replace(/^\//, '') + '.html');
    mkdirSync(join(file, '..'), { recursive: true });
    writeFileSync(file, p.html);
  }
  return pages;
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
