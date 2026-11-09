// Build do site: copia a pasta site/ (HTML, CSS, JS e imagens) para dist/, que é publicada pela Vercel.
// Não há etapa de compilação: o site é estático. Só usa módulos nativos do Node (sem dependências).
import { cpSync, existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, writeFileSync } from 'node:fs';
import { BASE, SIZES, loadData, generate, sitemap, ultimasNoticiasHTML } from './pages.mjs';
import { imageSizes, minify } from './optimize.mjs';
import { separar } from './secoes.mjs';
import { gerarRevisoes } from './revisoes.mjs';
import vm from 'node:vm';
import { GLOSSARIO_EXTRA } from './glossario-extra.mjs';
import { datasPaginas } from './datas.mjs';
import { avisarIndexNow } from './indexnow.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'site');
const out = join(root, 'dist');

if (!existsSync(join(src, 'index.html'))) {
  console.error('Erro: site/index.html não encontrado.');
  process.exit(1);
}

// Data da última alteração de cada ficha (só com o histórico completo do git; senão vale o site/revisoes.js salvo)
const nRev = gerarRevisoes();
if (nRev) console.log(`Datas de revisão atualizadas: ${nRev} fichas`);

rmSync(out, { recursive: true, force: true });
cpSync(src, out, { recursive: true });

// Últimas notícias (site/noticias.json) no alto da seção Notícias, artigos e revistas
{
  const f = join(out, 'index.html');
  // o total de notícias vai para o resumo numérico da página inicial, que não carrega o noticias.json
  const totalNoticias = JSON.parse(readFileSync('site/noticias.json', 'utf8')).itens.length;
  writeFileSync(f, readFileSync(f, 'utf8').replace(/<!-- ULTIMAS_NOTICIAS:[^>]*-->/, ultimasNoticiasHTML())
    .replace('<strong data-count="0" data-prefix="" data-num="noticias">0<', `<strong data-count="${totalNoticias}" data-prefix="" data-num="noticias">${totalNoticias}<`));
}

// Páginas próprias de cada ficha (produtos, sistemas e materiais) + sitemap.xml com todas as URLs
const D = loadData(src);
Object.assign(SIZES, imageSizes(src));
writeFileSync(join(out, 'img-sizes.js'), 'window.IMG_SIZES=' + JSON.stringify(SIZES) + ';\n');
// PipeSystem de Bolso: glossário e normas num arquivo só, guardado no aparelho para uso sem internet
{
  // Checklists: só o trecho de dados do guias.js, que no resto mexe na página
  const guias = readFileSync(join(src, 'guias.js'), 'utf8'), ini = guias.indexOf('const CHECK_ENTREGA'), fim = guias.indexOf('(() => {', guias.indexOf('const CHECKS'));
  const CHECKS = vm.runInNewContext(guias.slice(ini, fim) + ';CHECKS');
  const LN = vm.runInNewContext(readFileSync(join(src, 'normas.js'), 'utf8') + ';({ normUrl, NORM_SOURCES })', { URL, console });
  const vistas = new Set();
  writeFileSync(join(out, 'bolso-dados.json'), JSON.stringify({
    g: D.GLOSSARIO.map(x => ({ id: x.id, t: x.t, en: x.en, tema: x.tema, def: x.def, exp: x.exp, f: x.f, norma: x.norma, x: GLOSSARIO_EXTRA[x.id] })),
    ntc: JSON.parse(readFileSync(join(src, 'noticias.json'), 'utf8')).itens.slice().sort((x, y) => y.data.localeCompare(x.data)).slice(0, 5).map(({ titulo, link, data, fonte }) => ({ titulo, link, data, fonte })),
    gu: vm.runInNewContext(guias.slice(guias.indexOf('const GUIAS'), guias.indexOf('\n];', guias.indexOf('const GUIAS')) + 3) + ';GUIAS').map(({ id, tema, titulo, resumo, tempo, nivel, norma, separar, passos, atencao, videos, mats }) => ({ id, tema, titulo, resumo, tempo, nivel, norma, separar, passos, atencao, videos, mats })),
    v: Object.entries(vm.runInNewContext(guias.slice(guias.indexOf('const VIDEOS'), guias.indexOf('\n};', guias.indexOf('const VIDEOS')) + 3) + ';VIDEOS')).map(([k, x]) => ({ k, id: x.id, t: x.t, canal: x.canal, dur: x.dur, tema: x.tema, d: x.d })),
    cm: D.CMPS.map(({ id, tema, titulo, resumo, opcoes, linhas, pros, erros, apps }) => ({ id, tema, titulo, resumo, opcoes, linhas, pros, erros, apps })),
    nt: JSON.parse(readFileSync(join(src, 'noticias.json'), 'utf8')).itens.slice().sort((x, y) => y.data.localeCompare(x.data)),
    cu: JSON.parse(readFileSync(join(src, 'cursos.json'), 'utf8')).itens,
    va: (V => V.itens.map(x => ({ ...x, fim: x.ate || new Date(Date.parse(x.publicada) + (V.validadePadrao || 30) * 864e5).toISOString().slice(0, 10) })))(JSON.parse(readFileSync(join(src, 'vagas.json'), 'utf8'))),
    c: CHECKS,
    p: vm.runInNewContext(guias.slice(guias.indexOf('const PATS'), guias.indexOf('];', guias.indexOf('const PATS')) + 2) + ';PATS').map(({ tema, sev, t, sint, causa, sol }) => ({ tema, sev, t, sint, causa, sol })),
    t: D.CATALOG.flatMap(m => (m.tabelas || []).map(x => ({ titulo: x.titulo, colunas: x.colunas, linhas: x.linhas, ficha: m.name }))),
    m: D.CATALOG.map(m => ({ id: m.id.replace(/^mat-/, ''), n: m.name, c: m.cat, a: m.apps || '', d: m.desc || '', f: [...new Set((D.MANUFACTURERS[m.id] || []).map(f => f[0].split(' (')[0]))].slice(0, 8) })),
    s: (({ ref, ufs, ins }) => ({ ref, ufs, ins }))(vm.runInNewContext(readFileSync(join(src, 'sinapi-precos.js'), 'utf8') + ';SINAPI_PRECOS')),
    n: D.NORM_GROUPS.flatMap(g => g.normas).filter(n => !vistas.has(n.code) && vistas.add(n.code)).map(n => ({ code: n.code, org: n.org, title: n.title, note: n.note, url: LN.normUrl(n), acao: LN.NORM_SOURCES[n.org].action, home: LN.NORM_SOURCES[n.org].home, fonte: LN.NORM_SOURCES[n.org].label })),
  }));
}
const pages = generate(D, out);
// Seções grandes da página inicial em páginas próprias (/materiais, /dimensionamento, /bim-cad, /guias-praticos)
for (const url of separar(out, D, src)) pages.push({ url, images: [] });
const fotos = [...new Set([
  ...D.PRODUCTS.flatMap(p => (p.fotos || []).map(f => f.src)),
  ...Object.values(D.SYSTEM_PHOTOS).flatMap(a => a.map(f => f.src)),
])].map(s => `${BASE}/${s}`);
// Links que só preenchem o formulário de contato: o Google não precisa segui-los (ver também o robots.txt)
const marcarNofollow = dir => readdirSync(dir, { withFileTypes: true }).forEach(e => {
  const p = join(dir, e.name);
  if (e.isDirectory()) return marcarNofollow(p);
  if (!e.name.endsWith('.html')) return;
  const h = readFileSync(p, 'utf8'), novo = h.replace(/<a (?![^>]*\brel=)([^>]*\bhref="[^"]*\?assunto=)/g, '<a rel="nofollow" $1');
  if (novo !== h) writeFileSync(p, novo);
});
marcarNofollow(out);

// Data real de cada página: o build local atualiza scripts/datas-paginas.json; a Vercel só lê
const { datas, mudou } = datasPaginas(out, ['/', ...pages.map(p => p.url)], !process.env.VERCEL);
console.log(`Páginas com conteúdo alterado: ${mudou}`);
sitemap(pages, [`${BASE}/img/og-pipesystem.jpg`, ...fotos], out, datas);
console.log(`Páginas geradas: ${pages.length} (+ página inicial) · sitemap.xml com ${pages.length + 1} URLs`);

// Scripts e estilos compactados
const m = minify(out);
console.log(`JS e CSS compactados: ${(m.before / 1024).toFixed(0)} KB -> ${(m.after / 1024).toFixed(0)} KB`);

// Resumo do que foi gerado
let files = 0, bytes = 0;
const walk = dir => readdirSync(dir).forEach(name => {
  const p = join(dir, name), s = statSync(p);
  if (s.isDirectory()) walk(p); else { files++; bytes += s.size; }
});
walk(out);
console.log(`Build concluído: ${files} arquivos (${(bytes / 1024 / 1024).toFixed(1)} MB) em ${relative(root, out)}/`);

if (process.env.VERCEL_ENV === 'production') await avisarIndexNow();
