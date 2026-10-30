// Página inicial vitrine + seções em páginas próprias. Roda no build, sobre dist/index.html:
// cada seção grande vira uma página (a seção + o formulário de contato + a janela das fichas) e a página inicial
// fica com a abertura (busca e números do mercado), a vitrine com um cartão por área, "Para quem é" e o contato.
// Links antigos (#materiais, #cmp-..., /#lmatTool...) continuam valendo: o mapa ID_PAGINA leva cada id à página certa.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { BASE } from './pages.mjs';

// Ordem = ordem dos cartões na vitrine. n(D, x) = número de destaque do cartão; links = atalhos para os subtemas.
export const PAGINAS = [
  { id: 'servicos', path: '/cotacoes', nome: 'Cotações e negócios', tag: 'Serviços', titulo: 'Cotações, consultoria e negócios em hidráulica | PipeSystem',
    resumo: 'Peça cotações de materiais, tire dúvidas com o consultor on-line e encontre parceiros, leilões e oportunidades do setor.',
    n: (D, x) => [x.itens.servicos?.length, 'serviços'],
    links: [['Cotações', '/cotacoes#servico-cotacoes'], ['Consultor on-line', '/cotacoes#servico-consultor-on-line'], ['Negócios e leilões', '/cotacoes#servico-negocios-leiloes']] },
  { id: 'sistemas', path: '/sistemas', nome: 'Sistemas hidráulicos', tag: 'Áreas de aplicação', titulo: 'Sistemas hidráulicos e de condução de fluidos | PipeSystem',
    resumo: 'Como funcionam água fria e quente, esgoto, incêndio, gás, vapor, ar-condicionado e outras áreas: esquema, componentes, cuidados e normas.',
    n: D => [D.SYSTEMS.length, 'sistemas explicados'],
    links: D => ['sis-incendio', 'sis-agua-quente', 'sis-split-vrf'].map(id => D.SYSTEMS.find(s => s.id === id)).filter(Boolean).map(s => [s.name, '/sistemas/' + s.id.slice(4), s.id]) },
  { id: 'materiais', path: '/materiais', nome: 'Catálogo de materiais', tag: 'Materiais', titulo: 'Catálogo de produtos e materiais hidráulicos | PipeSystem',
    resumo: 'Tubos, conexões, válvulas, bombas e acessórios com fotos, dados técnicos, como escolher, normas e fabricantes.',
    n: D => [D.CATALOG.length, 'fichas técnicas'],
    links: [['Tubos', '/materiais?busca=tubos'], ['Conexões', '/materiais?busca=conexoes'], ['Válvulas', '/materiais?busca=valvulas']] },
  { id: 'ferramentas', path: '/dimensionamento', nome: 'Dimensionamento', tag: 'Ferramentas de cálculo', titulo: 'Dimensionamento e calculadoras de hidráulica | PipeSystem',
    resumo: 'Informe o empreendimento e receba a lista orientativa de materiais com preços SINAPI, além de calculadoras de projeto.',
    n: (D, x) => [x.itens.ferramentas?.length, 'ferramentas de cálculo'],
    links: [['Dimensionamento Inteligente', '/dimensionamento#lmatTool'], ['Perda de carga', '/dimensionamento#hwTool'], ['Ferramentas on-line', '/dimensionamento#webtools']] },
  { id: 'bim', path: '/bim-cad', nome: 'Bibliotecas BIM/CAD', tag: 'Para projetistas', titulo: 'Bibliotecas BIM/CAD de fabricantes de hidráulica | PipeSystem',
    resumo: 'Onde baixar famílias Revit, objetos IFC, blocos DWG e plugins oficiais dos fabricantes de tubos, conexões e equipamentos.',
    n: D => [D.BIM_LIBS.length, 'bibliotecas de fabricantes'],
    links: [['Fabricantes', '/bim-cad#bimGrid'], ['Plataformas BIM', '/bim-cad#bimPlats']] },
  { id: 'guias', path: '/guias-praticos', nome: 'Guias práticos', tag: 'Como fazer', titulo: 'Guias práticos de instalações hidráulicas | PipeSystem',
    resumo: 'Comparativos entre materiais, passo a passo de instalação e teste, vídeos, erros comuns, checklist de entrega e glossário.',
    n: D => [D.CMPS.length, 'comparativos com fontes'],
    links: [['Comparativos', '/guias-praticos#comparativos'], ['Passo a passo', '/guias-praticos#gp-guias'], ['Glossário', '/guias-praticos#gp-glossario']],
    // a seção começa pelo bloco de comparativos: a página ganha um título geral antes dele
    head: `<p class="eyebrow">Guias práticos</p>
        <h2>Guias práticos de instalações hidráulicas</h2>
        <p>Comparativos entre materiais e sistemas, passo a passo de instalação, teste e manutenção, vídeos dos fabricantes, erros comuns com causa e solução, checklist de entrega e glossário técnico.</p>` },
  { id: 'normas', path: '/normas', nome: 'Normas técnicas', tag: 'Consulta', titulo: 'Normas técnicas de hidráulica: ABNT, NR, NFPA e ASME | PipeSystem',
    resumo: 'As normas mais usadas em projeto, instalação e especificação, por aplicação e por produto, com link para o resumo ou a compra.',
    n: D => [new Set(D.NORM_GROUPS.flatMap(g => g.normas.map(x => x.code))).size, 'normas organizadas'],
    links: [['Por aplicação', '/normas'], ['Por produto', '/normas']] },
  { id: 'artigos', path: '/artigos', nome: 'Notícias, artigos e revistas', tag: 'Notícias e leituras técnicas', titulo: 'Notícias do setor, artigos técnicos e revistas de hidráulica | PipeSystem',
    resumo: 'As notícias mais recentes do setor (atualizadas a cada 5 dias), artigos de revistas técnicas e científicas com acesso gratuito e as edições digitais das revistas especializadas.',
    n: (D, x) => [x.artigos, 'artigos selecionados'],
    links: [['Notícias', '/noticias'], ['Cursos e eventos', '/noticias#cursos'], ['Vagas do setor', '/noticias#vagas'], ['Artigos', '/artigos#artList'], ['Revistas', '/artigos#magList'], ['Envie seu artigo', '/artigos#artigo-envio']] },
  { id: 'feiras', path: '/feiras', nome: 'Feiras e eventos', tag: 'Agenda do setor', titulo: 'Feiras e eventos de hidráulica no Brasil e no exterior | PipeSystem',
    resumo: 'As próximas feiras do setor no Brasil e no exterior, com datas, e as associações e entidades do setor: normalização, fiscalização, instaladores, fabricantes e saneamento.',
    n: (D, x) => [x.itens.feiras?.length, 'feiras na agenda'],
    links: [['Agenda', '/feiras'], ['Associações e entidades', '/feiras#associacoes']] },
  { id: 'assinaturas', path: '/assinaturas', nome: 'Receba cotações', tag: 'Para distribuidores', titulo: 'Receba cotações de materiais hidráulicos | PipeSystem',
    resumo: 'Distribuidores e revendedores recebem os pedidos de cotação publicados no portal e respondem direto ao comprador.',
    n: (D, x) => [x.itens.assinaturas?.length, 'planos de assinatura'],
    links: [['Planos', '/assinaturas']] },
  { id: 'anuncie', path: '/anuncie', nome: 'Anuncie', tag: 'Para fabricantes', titulo: 'Anuncie no PipeSystem: banners para o público técnico | PipeSystem',
    resumo: 'Banners nas páginas do portal e nos boletins técnicos, diante de projetistas, instaladores e compradores.',
    n: (D, x) => [x.itens.anuncie?.length, 'planos de banner'],
    links: [['Planos', '/anuncie'], ['Onde aparecem', '/anuncie#adMap']] },
  { id: 'sobre', path: '/quem-somos', nome: 'Quem somos', tag: 'PipeSystem', titulo: 'Quem somos — PipeSystem, o portal da hidráulica',
    resumo: 'O primeiro portal brasileiro dedicado à hidráulica e à condução de fluidos: quem faz, por que existe e como trabalhamos.',
    n: () => null, links: [['Diretoria', '/quem-somos'], ['Política editorial', '/politica-editorial']] },
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
const attr = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

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

// Quantos artigos e revistas há em script.js (as listas ficam lá)
function contaArtigos(src) {
  const js = readFileSync(join(src, 'script.js'), 'utf8');
  const bloco = (js.match(/const ARTICLES = \[([\s\S]*?)\n\];/) || [])[1] || '';
  return (bloco.match(/\{ tema:/g) || []).length;
}

// Índice de busca do texto das páginas (busca.json): cada trecho vai de um título (h2 a h4) ao seguinte, com o id
// mais próximo para o link. A busca da página inicial carrega o arquivo só quando o visitante começa a digitar.
function indiceBusca(out, secoes) {
  const extras = [['/noticias', 'Notícias do setor'], ['/politica-editorial', 'Política editorial'], ['/termos', 'Termos de uso'], ['/privacidade', 'Política de privacidade']];
  for (const [path, nome] of extras) {
    try {
      const h = readFileSync(join(out, path.slice(1) + '.html'), 'utf8');
      const a = h.indexOf('<main'), b = h.indexOf('</main>');
      if (a > -1 && b > a) secoes.push({ path, nome, html: h.slice(a, b) });
    } catch {}
  }
  const itens = [];
  for (const { path, nome, html } of secoes) {
    // sem scripts, estilos, SVG e formulários (só o texto que o visitante lê)
    const limpo = html.replace(/<(script|style|svg|select|template)\b[\s\S]*?<\/\1>/gi, ' ');
    const partes = limpo.split(/(?=<h[2-4]\b)/i);
    let ultimoId = '';
    for (const parte of partes) {
      const tit = (parte.match(/^<h[2-4]\b[^>]*>([\s\S]*?)<\/h[2-4]>/i) || [])[1];
      const ids = [...parte.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
      const idTit = (parte.match(/^<h[2-4]\b[^>]*\sid="([^"]+)"/i) || [])[1];
      const x = texto(parte).slice(0, 900);
      if (tit && x.length > 20) itens.push({ p: path, s: nome, id: idTit || ultimoId, t: texto(tit).slice(0, 120), x });
      if (ids.length) ultimoId = ids[ids.length - 1];
    }
  }
  writeFileSync(join(out, 'busca.json'), JSON.stringify(itens));
  console.log(`Índice de busca: ${itens.length} trechos (${Math.round(JSON.stringify(itens).length / 1024)} KB)`);
}

export function separar(out, D, src) {
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
    for (const m of porId[p.id].html.matchAll(/\sid="([^"]+)"/g)) idPagina[m[1]] = p.path;
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

  // 4. Página inicial vitrine: abertura, um cartão por área, "Para quem é" e o contato
  const x = { itens, artigos: contaArtigos(src) };
  const cartao = p => {
    const num = p.n(D, x), links = typeof p.links === 'function' ? p.links(D) : p.links;
    return `
        <article class="vcard">
          <a class="vcard__main" href="${p.path}">
            <span class="vcard__tag">${p.tag}</span>
            <h3>${p.nome}</h3>
            <p>${p.resumo}</p>
            ${num && num[0] ? `<span class="vcard__num"><b>${num[0]}</b> ${num[1]}</span>` : ''}
            <span class="vcard__go">Abrir <span aria-hidden="true">→</span></span>
          </a>
          <p class="vcard__links">${links.map(([t, u, sheet]) => `<a href="${u}"${sheet ? ` data-sheet="${sheet}"` : ''}>${t}</a>`).join('')}</p>
        </article>`;
  };
  const vitrine = `<!-- VITRINE: uma área por cartão (scripts/secoes.mjs) -->
  <section class="section vitrine" id="areas" aria-labelledby="areas-titulo">
    <div class="container">
      <header class="section__head">
        <p class="eyebrow">O portal</p>
        <h2 id="areas-titulo">Escolha a área</h2>
        <p>Cada área tem a sua página, com o conteúdo completo. Os atalhos levam direto ao assunto.</p>
      </header>
      <div class="vitrine__grid">${PAGINAS.map(cartao).join('')}
      </div>
    </div>
  </section>`;
  // vídeo de apresentação (YouTube): só a capa até o clique, para não pesar a página
  const YT = '6Dh329t7LuA';
  const video = `<!-- VÍDEO: passeio pelo portal (scripts/secoes.mjs) -->
  <section class="section section--dark apres" id="video" aria-labelledby="video-titulo">
    <div class="container apres__grid">
      <div class="apres__txt">
        <p class="eyebrow">Vídeo narrado · 2 min</p>
        <h2 id="video-titulo">Conheça o portal em 2 minutos</h2>
        <p>Um passeio pelas áreas do PipeSystem: cotações, sistemas, catálogo de materiais, Dimensionamento Inteligente com o desenho em corte e em 3D, bibliotecas BIM, guias práticos, normas e muito mais.</p>
        <a class="link" href="https://www.youtube.com/watch?v=${YT}" target="_blank" rel="noopener">Assistir no YouTube ↗</a>
      </div>
      <button type="button" class="apres__play" data-yt="${YT}" aria-label="Assistir ao vídeo de apresentação do PipeSystem">
        <img src="img/video-apresentacao.jpg" alt="" width="960" height="540" loading="lazy" decoding="async">
        <span class="apres__btn" aria-hidden="true"></span>
      </button>
    </div>
    <script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'VideoObject', name: 'PipeSystem — um passeio pelo portal', description: 'Apresentação do PipeSystem, o 1º portal da hidráulica e condução de fluidos: cotações, sistemas, materiais, Dimensionamento Inteligente, BIM/CAD, guias práticos, normas, artigos e feiras.', thumbnailUrl: 'https://www.pipesystem.com.br/img/video-apresentacao.jpg', uploadDate: '2026-10-26', duration: 'PT2M1S', embedUrl: `https://www.youtube-nocookie.com/embed/${YT}`, contentUrl: `https://www.youtube.com/watch?v=${YT}` })}</script>
  </section>`;
  const fica = id => !PAGINAS.some(p => p.id === id);
  const home = [];
  for (const b of bs) {
    if (b.id && !fica(b.id)) continue;
    home.push(b.html);
    if (/<section class="hero/.test(b.html)) home.push(video, vitrine);   // o vídeo e a vitrine vêm logo depois da abertura
  }
  writeFileSync(file, comDados(antes + '\n  ' + home.join('\n  ') + '\n' + depois));

  // 5. Uma página para cada seção
  const urls = [];
  for (const p of PAGINAS) {
    // o título da seção vira o h1 da página (ou o título geral, quando a página tem um)
    const sec = p.head
      ? porId[p.id].html.replace(/(<div class="container">)/, `$1\n      <header class="section__head">${p.head.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/, '<h1$1>$2</h1>')}</header>`)
      : porId[p.id].html.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/, '<h1$1>$2</h1>');
    const apos = sec.slice(sec.indexOf('</h1>'));
    const desc0 = texto((apos.match(/<p\b(?![^>]*eyebrow)[^>]*>([\s\S]*?)<\/p>/) || [])[1] || p.resumo).replace(/"/g, '');
    const d = desc0.length > 158 ? desc0.slice(0, 155).replace(/\s+\S*$/, '') + '…' : desc0;
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
    const comVideo = ['sobre', 'anuncie'].includes(p.id) ? '\n  ' + video : '';   // o vídeo de apresentação também em Quem somos e Anuncie
    pg += '\n  ' + sec + comVideo + '\n  ' + fichas + '\n  ' + contato + '\n' + depois;
    writeFileSync(join(out, p.path.slice(1) + '.html'), comDados(pg));
    urls.push(p.path);
  }
  indiceBusca(out, PAGINAS.map(p => ({ path: p.path, nome: p.nome, html: porId[p.id].html })));
  return urls;
}
