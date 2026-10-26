// Seções grandes da página inicial que viram páginas próprias: /materiais, /dimensionamento, /bim-cad e /guias-praticos.
// Roda no build, sobre dist/index.html: cada página leva a sua seção + o formulário de contato + a janela das fichas;
// a página inicial fica com um resumo de cada uma, com o botão para abri-la.
// Links antigos (#materiais, #cmp-..., /#lmatTool...) continuam valendo: o mapa ID_PAGINA leva cada id à página certa.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE } from './pages.mjs';

export const PAGINAS = [
  { id: 'materiais', path: '/materiais', botao: 'Abrir o catálogo', titulo: 'Catálogo de produtos e materiais hidráulicos | PipeSystem' },
  { id: 'ferramentas', path: '/dimensionamento', botao: 'Abrir Dimensionamento', titulo: 'Dimensionamento e calculadoras de hidráulica | PipeSystem' },
  { id: 'bim', path: '/bim-cad', botao: 'Abrir BIM/CAD', titulo: 'Bibliotecas BIM/CAD de fabricantes de hidráulica | PipeSystem' },
  { id: 'guias', path: '/guias-praticos', botao: 'Abrir Guias práticos', titulo: 'Guias práticos de instalações hidráulicas | PipeSystem',
    // a seção começa pelo bloco de comparativos: a página ganha um título geral antes dele
    head: `<p class="eyebrow">Guias práticos</p>
        <h2>Guias práticos de instalações hidráulicas</h2>
        <p>Comparativos entre materiais e sistemas, passo a passo de instalação, teste e manutenção, vídeos dos fabricantes, erros comuns com causa e solução, checklist de entrega e glossário técnico.</p>` },
];

// Cartões que o submenu e a busca da página inicial listam (mesmos prefixos do submenu em script.js)
const ITENS = [
  ['servicos', 'servicos', 'svc', 'servico'], ['assinaturas', 'assinaturas', 'qplan', 'assinatura'],
  ['ferramentas', 'ferramentas', 'tool', 'calc'], ['feiras', 'feiras', 'fair', 'feira'],
  ['anuncie', 'anuncie', 'plan', 'plano'], ['sobre', 'sobre', 'person__row', 'diretor'],
];

const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const texto = s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// Blocos de primeiro nível dentro de <main>: seções (com ou sem id), a janela das fichas e o resto
function blocos(main) {
  const out = [];
  const tok = /<(section|dialog)\b[^>]*>|<\/(section|dialog)>/g;
  let depth = 0, start = 0, tag = null, last = 0, m;
  while ((m = tok.exec(main))) {
    if (m[0][1] !== '/') {
      if (depth === 0) {
        // comentário logo antes da seção (<!-- MATERIAIS -->) vai junto com ela
        let s = m.index;
        const before = main.slice(last, s), c = before.match(/<!--[^>]*-->\s*$/);
        if (c) s -= c[0].length;
        if (main.slice(last, s).trim()) out.push({ html: main.slice(last, s) });
        start = s; tag = m[1];
      }
      if (m[1] === tag) depth++;
    } else if (m[2] === tag) {
      depth--;
      if (depth === 0) {
        const html = main.slice(start, m.index + m[0].length);
        const id = (html.match(/<(?:section|dialog)\b[^>]*\bid="([^"]+)"/) || [])[1];
        out.push({ html, id, tag });
        last = m.index + m[0].length;
      }
    }
  }
  if (main.slice(last).trim()) out.push({ html: main.slice(last) });
  return out;
}

export function separar(out) {
  const file = join(out, 'index.html');
  let html = readFileSync(file, 'utf8');

  // 1. Espaços publicitários com número fixo (o mesmo em todas as páginas)
  let n = 0;
  html = html.replace(/<div([^>]*)\bdata-ad="([^"]+)"/g, (all, pre, kind) => `<div${pre}data-ad-id="ad-${++n}" data-ad="${kind}"`);

  // 2. Blocos da página
  const iMain = html.indexOf('<main'), iMainIn = html.indexOf('>', iMain) + 1, iMainOut = html.indexOf('</main>');
  const antes = html.slice(0, iMainIn), depois = html.slice(iMainOut);
  const bs = blocos(html.slice(iMainIn, iMainOut));
  const porId = Object.fromEntries(bs.filter(b => b.id).map(b => [b.id, b]));

  // 3. Cartões listados no submenu e na busca ganham id fixo (o submenu de outras páginas usa a lista gerada aqui)
  const itens = {};
  for (const [chave, secao, cls, prefixo] of ITENS) {
    const b = porId[secao];
    if (!b) continue;
    const re = new RegExp(`<(article|div|li|a)\\b([^>]*\\bclass="(?:[^"]*\\s)?${cls}(?:\\s[^"]*)?")([^>]*)>`, 'g');
    const lista = [];
    b.html = b.html.replace(re, (all, tag, a1, a2, pos, str) => {
      const resto = str.slice(pos);
      const h = resto.match(/<(h3|h4|strong|b)\b[^>]*>([\s\S]*?)<\/\1>/);
      if (!h) return all;
      const label = texto(h[2]), proprio = (all.match(/\sid="([^"]+)"/) || [])[1];   // cartão que já tem id mantém o seu
      const id = proprio || `${prefixo}-${slug(label)}`;
      lista.push({ id, label, intl: /\bfair--intl\b/.test(a1 + a2), texto: texto(resto.slice(0, 600)).slice(0, 220) });
      return proprio ? all : `<${tag} id="${id}"${a1}${a2}>`;
    });
    itens[chave] = lista;
  }
  const contato = porId.contato.html, fichas = porId.prodSheet.html;

  // ids de cada página (para os links antigos) e espaços publicitários por página
  const idPagina = {}, adAll = [];
  for (const p of PAGINAS) {
    const h = porId[p.id].html;
    for (const m of h.matchAll(/\sid="([^"]+)"/g)) idPagina[m[1]] = p.path;
  }
  for (const b of bs) {
    const pg = PAGINAS.find(p => p.id === b.id);
    for (const m of b.html.matchAll(/<div[^>]*data-ad-id="([^"]+)" data-ad="([^"]+)"[^>]*>/g)) {
      const place = (m[0].match(/data-place="([^"]*)"/) || [])[1] || '';
      const kind = /data-variant="vertical"/.test(m[0]) ? 'vertical' : m[2];
      adAll.push({ id: m[1], kind, place, page: pg ? pg.path : '/' });
    }
  }
  adAll.push({ id: 'ad-catalogo', kind: 'card', place: 'Catálogo de materiais — cartão entre os produtos', page: '/materiais' });
  const dados = `<script>window.ID_PAGINA=${JSON.stringify(idPagina)};window.SECOES_ITENS=${JSON.stringify(itens)};window.AD_ALL=${JSON.stringify(adAll)};</script>\n`;
  const comDados = s => s.replace(/(<script[^>]*src="webtools\.js")/, dados + '$1');

  // 4. Página inicial: no lugar de cada seção separada, um resumo com o botão para a página
  const resumo = p => {
    const h = porId[p.id].html;
    const cls = (h.match(/<section\b[^>]*class="([^"]+)"/) || [])[1] || 'section';
    const head = p.head || (h.match(/<header class="section__head">([\s\S]*?)<\/header>/) || [])[1] || '';
    return `<!-- ${p.id.toUpperCase()} (página própria: ${p.path}) -->
  <section class="${cls} secao-resumo" aria-labelledby="resumo-${p.id}">
    <div class="container secao-resumo__box">
      <div class="secao-resumo__txt">${head.replace(/<h2\b/, `<h2 id="resumo-${p.id}"`)}</div>
      <a class="btn secao-resumo__btn" href="${p.path}">${p.botao} <span aria-hidden="true">→</span></a>
    </div>
  </section>`;
  };
  const home = bs.map(b => { const p = PAGINAS.find(x => x.id === b.id); return p ? resumo(p) : b.html; }).join('\n  ');
  writeFileSync(file, comDados(antes + '\n  ' + home + '\n' + depois));

  // 5. Uma página para cada seção
  const urls = [];
  for (const p of PAGINAS) {
    // o título da seção vira o h1 da página (ou o título geral, quando a página tem um)
    const sec = p.head
      ? porId[p.id].html.replace(/(<div class="container">)/, `$1\n      <header class="section__head">${p.head.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/, '<h1$1>$2</h1>')}</header>`)
      : porId[p.id].html.replace(/(<header class="section__head">[\s\S]*?)<h2\b([^>]*)>([\s\S]*?)<\/h2>/, '$1<h1$2>$3</h1>');
    const head = (sec.match(/<header class="section__head">([\s\S]*?)<\/header>/) || [])[1] || '';
    const ps = [...head.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(m => texto(m[1]));
    const desc = (ps[ps.length - 1] || '').replace(/"/g, '');
    const d = desc.length > 158 ? desc.slice(0, 155).replace(/\s+\S*$/, '') + '…' : desc;
    const url = BASE + p.path;
    let pg = antes
      .replace(/<title>[^<]*<\/title>/, `<title>${attr(p.titulo)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*"/, `$1${attr(d)}"`)
      .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`)
      .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
      .replace(/(<meta property="og:title" content=")[^"]*"/, `$1${attr(p.titulo)}"`)
      .replace(/(<meta name="twitter:title" content=")[^"]*"/, `$1${attr(p.titulo)}"`)
      .replace(/(<meta property="og:description" content=")[^"]*"/, `$1${attr(d)}"`)
      .replace(/(<meta name="twitter:description" content=")[^"]*"/, `$1${attr(d)}"`)
      .replace('<body>', `<body data-pagina="${p.id}">`);
    pg += '\n  ' + sec + '\n  ' + fichas + '\n  ' + contato + '\n' + depois;
    writeFileSync(join(out, p.path.slice(1) + '.html'), comDados(pg));
    urls.push(p.path);
  }
  return urls;
}
