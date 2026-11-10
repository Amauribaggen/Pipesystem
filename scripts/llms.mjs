// Gera dist/llms.txt: resumo do portal para assistentes de IA, montado a partir das páginas já geradas.
// Toda página de primeiro nível publicada (fora as marcadas com noindex) entra sozinha: o nome vem do
// título e a explicação vem da descrição da própria página. GRUPOS só define a ordem e os agrupamentos;
// uma seção nova que não esteja listada aparece em "Outras páginas".
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = 'https://www.pipesystem.com.br';
const GRUPOS = [
  ['Conteúdo técnico', ['materiais', 'sistemas', 'normas', 'glossario', 'comparativos', 'guias-praticos']],
  ['Ferramentas', ['dimensionamento', 'pro', 'bim-cad']],
  ['Setor', ['noticias', 'artigos', 'feiras', 'cotacoes', 'assinaturas', 'anuncie']],
  ['Sobre', ['quem-somos', 'politica-editorial', 'termos', 'privacidade']],
];
const CABECALHO = `# PipeSystem — O Portal da Hidráulica

> Portal técnico brasileiro, em português, sobre hidráulica e condução de fluidos: catálogo de materiais com fichas técnicas, sistemas hidráulicos, resumos de normas (ABNT NBR, NR, NFPA, ASME), glossário, comparativos, calculadoras de dimensionamento, preços de referência (SINAPI) e notícias do setor. Voltado a projetistas, instaladores, especificadores, construtoras, fabricantes, revendedores e estudantes.

O conteúdo é produzido e revisado pela Equipe Técnica PipeSystem, com independência em relação a anunciantes e fabricantes (ver Política Editorial). As informações são orientativas e não substituem o projeto de um profissional habilitado nem a consulta ao texto oficial das normas. Cada página informa a data da última revisão. Ao citar, use o endereço da página específica.
`;

const desfaz = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

export function llms(outDir) {
  const paginas = {};
  for (const arq of readdirSync(outDir)) {
    if (!arq.endsWith('.html')) continue;
    const id = arq.slice(0, -5);
    if (id === 'index' || id === '404') continue;
    const h = readFileSync(join(outDir, arq), 'utf8');
    if (/<meta name="robots" content="[^"]*noindex/.test(h)) continue;
    const titulo = desfaz((h.match(/<title>([^<]*)<\/title>/) || [])[1] || id).replace(/\s*[|—]\s*PipeSystem.*$/, '').trim();
    const descricao = desfaz((h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '').trim();
    const sub = join(outDir, id);
    const fichas = existsSync(sub) ? readdirSync(sub).filter(f => f.endsWith('.html')).length : 0;
    paginas[id] = `- [${titulo}](${BASE}/${id})${descricao ? ': ' + descricao : ''}${fichas ? ` Uma página por item em /${id}/ (${fichas} páginas).` : ''}`;
  }
  const usados = new Set();
  let texto = CABECALHO;
  for (const [nome, ids] of GRUPOS) {
    const linhas = ids.filter(id => paginas[id]).map(id => { usados.add(id); return paginas[id]; });
    if (linhas.length) texto += `\n## ${nome}\n\n${linhas.join('\n')}\n`;
  }
  const outras = Object.keys(paginas).filter(id => !usados.has(id)).sort();
  if (outras.length) texto += `\n## Outras páginas\n\n${outras.map(id => paginas[id]).join('\n')}\n`;
  texto += `\n## Mapa do site\n\n- [sitemap.xml](${BASE}/sitemap.xml): lista completa das páginas, com data de atualização.\n\nContato: info@pipesystem.com.br\n`;
  writeFileSync(join(outDir, 'llms.txt'), texto);
  return Object.keys(paginas).length;
}
