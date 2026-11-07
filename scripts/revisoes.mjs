// Data da última alteração de cada ficha do catálogo (site/revisoes.js), tirada do git blame de site/catalog.js:
// vale a linha mais recente do bloco da ficha, da foto do cartão (MATERIAL_PHOTOS) e dos fabricantes (MANUFACTURERS).
// Linhas ainda não salvas no git contam como hoje. Roda no build local; num clone raso (sem histórico) não roda e
// o build usa o site/revisoes.js já salvo no repositório.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const git = (...a) => execFileSync('git', a, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

export function gerarRevisoes() {
  try { if (git('rev-parse', '--is-shallow-repository').trim() !== 'false') return false; } catch { return false; }
  // data de cada linha (author-time); linhas não salvas aparecem com o hash 0000…
  const blame = git('blame', '--line-porcelain', 'site/catalog.js').split('\n');
  const datas = [];
  let t = 0;
  for (const l of blame) {
    if (l.startsWith('author-time ')) t = +l.slice(12);
    else if (l.startsWith('\t')) datas.push(t);
  }
  const linhas = readFileSync(join(root, 'site/catalog.js'), 'utf8').split('\n');
  const rev = {};
  const marca = (id, i) => { if (datas[i] > (rev[id] || 0)) rev[id] = datas[i]; };
  let atual = null;
  linhas.forEach((l, i) => {
    const ini = l.match(/^  \{ id: '(mat-[^']+)'/);
    if (ini) atual = ini[1];
    else if (/^(\];|const )/.test(l)) atual = null;
    if (atual) marca(atual, i);
    const ref = l.match(/^  '(mat-[^']+)': [[{]/);   // linha da ficha em MATERIAL_PHOTOS e MANUFACTURERS
    if (ref) marca(ref[1], i);
  });
  const dia = s => new Date(s * 1000).toISOString().slice(0, 10);
  const corpo = Object.keys(rev).sort().map(id => `  '${id}': '${dia(rev[id])}',`).join('\n');
  writeFileSync(join(root, 'site/revisoes.js'),
    '// Gerado por scripts/revisoes.mjs a partir do histórico do git: data da última alteração de cada ficha do catálogo.\n' +
    `const REVISOES = {\n${corpo}\n};\n`);
  return Object.keys(rev).length;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log('Fichas com data:', gerarRevisoes());
