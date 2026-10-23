// Servidor local simples para conferir a pasta dist/ antes do deploy: npm run build && npm run preview
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT) || 3000;
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^([/\\])+/, '');
  if (!path || path.endsWith('/') || path.endsWith('\\')) path += 'index.html';
  else if (!extname(path)) path += '.html';   // URLs limpas, como na Vercel: /produtos/bombas -> produtos/bombas.html
  const file = join(dist, path);
  if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
  // seções da página inicial (/sistemas, /contato...) entregam index.html, como os rewrites do vercel.json
  const secoes = /^(cotacoes|sistemas|materiais|dimensionamento|bim-cad|normas|artigos|feiras|para-quem-e|anuncie|assinaturas|quem-somos|contato)\.html$/;
  try {
    const body = await readFile(secoes.test(path) ? join(dist, 'index.html') : file);
    res.writeHead(200, { 'Content-Type': types[extname(file).toLowerCase()] || 'application/octet-stream' }).end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Não encontrado');
  }
}).listen(port, () => console.log(`Prévia em http://localhost:${port}`));
