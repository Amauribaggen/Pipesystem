// Dimensionamento Inteligente: abas do desenho esquemático (esquema.js desenha o corte):
//  1) corte com fluxo animado nas tubulações (padrão) e
//  2) vista isométrica (3D) da mesma instalação, também com fluxo.
// Lê os mesmos dados do desenho em corte: window.lmatApi.last() + escolhas do formulário.
(() => {
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = (n, d = 1) => n.toLocaleString('pt-BR', { maximumFractionDigits: d });
  const C = { af: '#2563eb', aq: '#e8590c', esg: '#8d6e63', pluv: '#0d9488', gas: '#d4a106', inc: '#dc2626', rec: '#1e3a8a', chuva: '#16a34a', txt: '#0f1b2d', mut: '#5b6b80', ed: '#94a3b8' };
  const NOMES = { af: 'Água fria', rec: 'Recalque / alimentação', aq: 'Água quente', esg: 'Esgoto e ventilação', pluv: 'Águas pluviais', gas: 'Gás', inc: 'Incêndio', chuva: 'Água de chuva' };
  const CORES_TUBO = new Set(Object.entries(C).filter(([k]) => NOMES[k]).map(([, v]) => v));

  // ---------- estilos das abas e do fluxo ----------
  // tubos 1,6× mais grossos com o fluxo ligado, e traços de fluxo visíveis mesmo com o desenho reduzido na tela
  const GROSSO = 1.6;
  document.head.insertAdjacentHTML('beforeend', `<style>
    .esq-tabs { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 10px; }
    .esq-tabs button { font: inherit; font-size: .88rem; font-weight: 700; padding: .45em .9em; border-radius: 999px; border: 1px solid rgba(255,255,255,.3); background: transparent; color: #e6eef8; cursor: pointer; }
    .esq-tabs button[aria-pressed="true"] { background: #1fb6c9; border-color: #1fb6c9; color: #04202a; }
    .esq-flow { fill: none; stroke: #fff; stroke-linecap: round; opacity: .9; stroke-dasharray: 7 11; animation: esq-flui 1s linear infinite; pointer-events: none; }
    .esq-flow--lento { animation-duration: 1.8s; }
    @keyframes esq-flui { to { stroke-dashoffset: -36; } }
    .esq-pausa .esq-flow { animation-play-state: paused; }
    .esq-iso [data-sys] { transition: opacity .2s; }
    .esq-iso.esq-foco [data-sys]:not(.esq-on) { opacity: .12; }
    .esq-legend { cursor: pointer; }
  </style>`);

  // ---------- dados (mesma leitura de esquema.js) ----------
  const tubo = r => r ? r.item.split(' — ')[0].replace(/^Tubo (de )?/, '') : '';
  function dados() {
    const L = window.lmatApi?.last?.(); if (!L) return null;
    const rows = L.rows, find = re => rows.find(r => re.test(r.item)), sum = re => rows.filter(r => re.test(r.item)).reduce((s, r) => s + r.qty, 0);
    const v = id => $(id)?.value, n = id => Math.max(0, parseFloat(v(id)) || 0);
    const tipo = v('lmTipo') || 'edificio';
    return {
      tipo: tipo.startsWith('galpao') ? 'galpao' : tipo, pav: Math.max(1, Math.round(n('lmPav'))), pisosGar: Math.round(n('lmPisosGar')),
      med: !!find(/^Hidrômetro individual/), titulo: $('lmOutTitle')?.textContent || '',
      resSup: find(/^Reservatório superior/), resInf: find(/^Reservatório inferior|cisterna \(reservatório inferior\)/), caixa: find(/^Caixa d'água de polietileno (?!.*cisterna)/),
      recalque: find(/— recalque/), coluna: find(/colunas de distribuição/), nCol: Math.max(1, sum(/topo das colunas/)),
      hotDist: rows.find(r => r.group === 'Água quente' && /— distribuição/.test(r.item)), aquec: find(/^Aquecedor de passagem/),
      prumGas: find(/prumadas de gás/), gas: v('lmGas'), temGas: rows.some(r => r.group === 'Gás'), glp: find(/^Central de GLP/), p13: find(/^Botijão P13/),
      prumHid: find(/prumada de hidrantes|^Tubo de aço.*\(DN 65\)/), nHid: sum(/^Válvula angular/), bicos: sum(/^Bico de sprinkler/),
      condut: sum(/^Ralo hemisférico|^Bocal de calha/), chuva: find(/^Cisterna de água de chuva/),
      lgArea: n('lgArea'),
    };
  }

  // ---------- 1) fluxo animado sobre o corte atual ----------
  function animaCorte(svg) {
    svg.querySelectorAll('.esq-flow').forEach(e => e.remove());
    svg.querySelectorAll('line, path').forEach(el => {
      const cor = el.getAttribute('stroke'), w = parseFloat(el.getAttribute('stroke-width')) || 0;
      if (!CORES_TUBO.has(cor) || w < 2 || el.getAttribute('stroke-dasharray') === '5 4') return;   // só tubos (não a ventilação)
      const wg = w * GROSSO;
      el.setAttribute('stroke-width', wg);
      const f = el.cloneNode();
      f.removeAttribute('stroke-dasharray');
      f.setAttribute('class', 'esq-flow' + (cor === C.esg || cor === C.pluv ? ' esq-flow--lento' : ''));
      f.setAttribute('stroke-width', Math.max(2, wg * .5));
      el.after(f);
    });
  }

  // ---------- 2) vista isométrica ----------
  // eixo x = frente do prédio (esquerda→direita), y = profundidade, z = altura. Unidade = 1 m (fora de escala).
  let S = 15;   // pixels por metro (o galpão usa escala menor)
  const COS = Math.cos(Math.PI / 6), SIN = Math.sin(Math.PI / 6);
  let O = [520, 0], out = [], used = new Set();
  const P = (x, y, z) => [O[0] + (x - y) * COS * S, O[1] + (x + y) * SIN * S - z * S];
  const pts = a => a.map(p => P(...p).map(v => v.toFixed(1)).join(',')).join(' ');
  const g0 = sys => out.push(`<g data-sys="${sys || 'ed'}">`), g1 = () => out.push('</g>');
  const tuboIso = (sys, a, w = 3.5) => { used.add(sys); out.push(`<polyline points="${pts(a)}" fill="none" stroke="${C[sys]}" stroke-width="${w * 1.5}" stroke-linejoin="round" stroke-linecap="round" class="esq-tubo"/>`); };
  const poli = (a, fill, stroke = C.ed, sw = 1.2, op = 1) => out.push(`<polygon points="${pts(a)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" fill-opacity="${op}"/>`);
  const caixa = (x, y, z, w, d, h, cor, op = .85) => {   // sólido: topo, frente (y=0 do bloco) e lado direito
    poli([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], cor.topo, cor.borda, 1.2, op);
    poli([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]], cor.frente, cor.borda, 1.2, op);
    poli([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]], cor.lado, cor.borda, 1.2, op);
  };
  const AGUA = { topo: '#bfd7ff', frente: '#93b8f5', lado: '#7aa4ea', borda: C.af };
  const GLP = { topo: '#fff3c4', frente: '#f7df86', lado: '#eccd5e', borda: C.gas };
  const CHUVA = { topo: '#bbf7d0', frente: '#86efac', lado: '#4ade80', borda: C.chuva };
  // cisterna de água de chuva enterrada, ligada ao condutor pluvial que desce em (x, y)
  const cisternaChuva = (x, y, cx, cy) => { g0('chuva'); tuboIso('chuva', [[x, y, .1], [cx + 1.5, y, .1], [cx + 1.5, y > cy + 3 ? cy + 3 : cy, -.2]], 2.4); caixa(cx, cy, -1.8, 3, 3, 1.8, CHUVA); txt(cx + 3.6, cy + 3.2, -.4, 'Água de chuva', { s: 10, c: 'chuva', b: true }); g1(); };
  const txt = (x, y, z, t, o = {}) => { const [a, b] = P(x, y, z); out.push(`<text x="${a.toFixed(1)}" y="${b.toFixed(1)}" font-size="${o.s || 12}" fill="${C[o.c] || o.c || C.txt}" text-anchor="${o.a || 'start'}"${o.b ? ' font-weight="700"' : ''}>${esc(t)}</text>`); };
  const ponto = (x, y, z, sys, r = 4) => { const [a, b] = P(x, y, z); out.push(`<circle cx="${a.toFixed(1)}" cy="${b.toFixed(1)}" r="${r}" fill="#fff" stroke="${C[sys]}" stroke-width="2"/>`); };

  function isoEdificio(d) {
    const W = 22, D = 13, fh = 3, nShow = Math.min(d.pav, 5), quebra = d.pav > 5, topo = (nShow + 1) * fh;
    O = [470, 120 + topo * S];
    // terreno e rua
    g0('ed');
    poli([[-12, -4, 0], [W + 10, -4, 0], [W + 10, D + 6, 0], [-12, D + 6, 0]], '#eef2f6', '#cbd5e1', 1);
    poli([[-12, D + 6, 0], [W + 10, D + 6, 0], [W + 10, D + 10, 0], [-12, D + 10, 0]], '#d7dde6', '#cbd5e1', 1);
    txt(W + 9, D + 9, 0, 'Rua', { s: 11, c: 'mut', a: 'end' });
    // lajes (de baixo para cima), paredes de fundo leves
    poli([[0, 0, 0], [0, 0, topo], [W, 0, topo], [W, 0, 0]], '#f8fafc', C.ed, 1, .6);
    poli([[0, 0, 0], [0, D, 0], [0, D, topo], [0, 0, topo]], '#f1f5f9', C.ed, 1, .6);
    for (let i = 0; i <= nShow + 1; i++) {
      const z = i * fh;
      poli([[0, 0, z], [W, 0, z], [W, D, z], [0, D, z]], i === nShow + 1 ? '#e2e8f0' : '#ffffff', C.ed, 1.2, i === nShow + 1 ? .95 : .35);
      if (i <= nShow) txt(-0.6, D, z + 1.2, i === 0 ? 'Térreo' : quebra && i >= 3 ? `${d.pav - (nShow - i)}º` : `${i}º`, { s: 10, c: 'mut', a: 'end' });
    }
    if (quebra) txt(W / 2, D, 2.5 * fh + 1.5, `⋯ mais ${d.pav - nShow} andares iguais ⋯`, { s: 10, c: 'mut', a: 'middle' });
    g1();

    // reservatório superior e colunas de água fria
    g0('af');
    const rz = topo, rx = 6, ry = 3;
    caixa(rx, ry, rz + .4, 7, 5, 2.4, AGUA);
    txt(rx + 3.5, ry, rz + 3.6, 'Reservatório superior' + (d.resSup ? ` · ${fmt(d.resSup.qty)} m³` : ''), { s: 11, b: true, a: 'middle' });
    const cols = [[8, 2], [11, 2]].slice(0, Math.min(2, d.nCol));
    cols.forEach(([x, y]) => tuboIso('af', [[x, ry + 2.5, rz + .4], [x, y, rz + .4], [x, y, 0.4]]));
    for (let i = 0; i <= nShow; i++) {
      const z = i * fh + .5;
      tuboIso('af', [[cols[0][0], 2, z], [15, 2, z], [15, 9, z]], 2.2);
      if (d.med && i) ponto(13, 2, z, 'af', 3.5);
      if (d.hotDist && i) { caixa(15.2, 9.2, z - .2, 1, .8, 1.2, { topo: '#ffe3d1', frente: '#ffd0b3', lado: '#ffbf99', borda: C.aq }); tuboIso('aq', [[16.2, 9.6, z + .3], [19, 9.6, z + .3], [19, 11, z + .3]], 2.2); }
    }
    txt(cols[0][0] + .6, 2, topo - 2.2, d.coluna ? `Colunas ${tubo(d.coluna)} × ${d.nCol}` : 'Colunas de água fria', { s: 11, c: 'af', b: true });
    g1();

    // cisterna, bombas e recalque (ou alimentação direta)
    g0('rec');
    // cisterna na frente do terreno, junto à rua (enterrada); a rede pública chega pela calçada
    tuboIso('af', [[-11, D + 8, .2], [-9, D + 8, .2], [-9, D + 4.5, .2]], 3);
    ponto(-10, D + 8, .2, 'af', 4);
    txt(-12.5, D + 10.5, 0, 'Rede pública + hidrômetro', { s: 10, c: 'mut' });
    const ry2 = D + 2;   // linha do recalque (frente-esquerda do prédio)
    if (d.resInf) {
      caixa(-9, D + 1, -2.6, 5, 3.5, 2.4, AGUA, .9);
      txt(-6.5, D + 4.5, -3.2, `Cisterna · ${fmt(d.resInf.qty)} m³`, { s: 11, b: true, a: 'middle' });
      ponto(-3.2, ry2, -.6, 'rec', 5); ponto(-3.2, ry2 + 1.3, -.6, 'rec', 5);
      tuboIso('rec', [[-3.2, ry2, -.6], [-1.5, ry2, -.6], [-1.5, ry2, rz + 1.6], [-1.5, ry + 1, rz + 1.6], [rx, ry + 1, rz + 1.6]], 4);
      txt(-2.2, ry2, rz * .55, d.recalque ? `Recalque ${tubo(d.recalque)}` : 'Recalque', { s: 11, c: 'rec', b: true, a: 'end' });
    } else {
      tuboIso('rec', [[-9, D + 4.5, .2], [-1.5, ry2, .2], [-1.5, ry2, rz + 1.6], [-1.5, ry + 1, rz + 1.6], [rx, ry + 1, rz + 1.6]], 4);
      txt(-2.2, ry2, rz * .55, 'Alimentação direta', { s: 11, c: 'rec', b: true, a: 'end' });
    }
    g1();

    // esgoto: ramais por andar, tubo de queda, ventilação e coletor até a rua
    g0('esg');
    const xe = 18, ye = 11;
    for (let i = 0; i <= nShow; i++) tuboIso('esg', [[13, 11, i * fh + .9], [xe, ye, i * fh + .6]], 2.4);
    tuboIso('esg', [[xe, ye, topo + 1.5], [xe, ye, -0.6], [xe, D + 8, -0.6]], 4.5);
    txt(xe + .5, ye, topo + 1.6, 'ventilação', { s: 10, c: 'esg' });
    txt(xe + 1, D + 7, -0.6, 'Rede de esgoto', { s: 11, c: 'esg', b: true });
    g1();

    // pluviais
    if (d.condut) { g0('pluv'); tuboIso('pluv', [[W, D, topo], [W, D, 0.1], [W, D + 8.5, 0.1]], 3); txt(W + .6, D, topo - 1, `${d.condut} condutores pluviais`, { s: 10, c: 'pluv' }); g1(); }
    if (d.chuva) cisternaChuva(W, D + 1.5, W + 4, D - 4);   // ao lado do prédio, fora da rua

    // gás
    if (d.prumGas || d.glp) {
      g0('gas');
      const xg = 5, yg = D - 1;   // prumada de gás na fachada da frente, longe dos rótulos dos andares
      tuboIso('gas', [[xg, yg, .3], [xg, yg, nShow * fh + .8]], 3);
      for (let i = 1; i <= nShow; i++) tuboIso('gas', [[xg, yg, i * fh + .8], [xg + 4, yg, i * fh + .8]], 2);
      if (d.glp) { caixa(W + 2, D - 3, 0, 2.5, 2.5, 2, GLP); tuboIso('gas', [[W + 2, D - 2, .3], [xg, D - 2, .3], [xg, yg, .3]], 3); txt(W + 3.2, D - 3, 2.6, 'GLP', { s: 11, c: 'gas', b: true, a: 'middle' }); }
      txt(xg + .4, yg, nShow * fh + 1.4, d.glp ? 'Gás GLP · prumada' : 'Gás natural · prumada', { s: 10, c: 'gas', b: true });
      g1();
    } else if (d.p13) {   // botijão P13 em abrigo de cada unidade, ligado ao fogão
      g0('gas');
      const xg = 5, yg = D - 1;
      for (let i = 1; i <= nShow; i++) { caixa(xg - .5, yg - .5, i * fh + .1, 1, 1, 1.2, GLP); tuboIso('gas', [[xg + .5, yg, i * fh + .8], [xg + 4, yg, i * fh + .8]], 2); }
      txt(xg + .4, yg, nShow * fh + 1.6, 'Botijão P13 por unidade', { s: 10, c: 'gas', b: true });
      g1();
    }

    // incêndio: prumada de hidrantes e abrigos por andar
    if (d.prumHid) {
      g0('inc');
      tuboIso('inc', [[rx + 7, ry + 2, rz + 1], [21, 1, rz + 1], [21, 1, 0.2]], 4);
      for (let i = 0; i <= nShow; i++) caixa(19.6, 1.3, i * fh + .6, 1.2, .6, 1.4, { topo: '#fecaca', frente: '#f87171', lado: '#ef4444', borda: C.inc });
      txt(21.6, 1, topo - .5, `Hidrantes · ${d.nHid} pontos`, { s: 11, c: 'inc', b: true });
      if (d.bicos) for (let i = 0; i <= Math.min(nShow, 1); i++) tuboIso('inc', [[2, 2, i * fh + 2.7], [W - 2, 2, i * fh + 2.7], [W - 2, D - 2, i * fh + 2.7]], 1.6);
      g1();
    }
    return 120 + topo * S + 26 * S;
  }

  function isoCasa(d) {
    const W = 12, D = 9, fh = 3, n = Math.min(d.pav, 3), topo = n * fh;
    O = [470, 160 + topo * S];
    g0('ed');
    poli([[-8, -3, 0], [W + 8, -3, 0], [W + 8, D + 5, 0], [-8, D + 5, 0]], '#eef2f6', '#cbd5e1', 1);
    poli([[0, 0, 0], [0, 0, topo], [W, 0, topo], [W, 0, 0]], '#f8fafc', C.ed, 1, .6);
    poli([[0, 0, 0], [0, D, 0], [0, D, topo], [0, 0, topo]], '#f1f5f9', C.ed, 1, .6);
    for (let i = 0; i <= n; i++) poli([[0, 0, i * fh], [W, 0, i * fh], [W, D, i * fh], [0, D, i * fh]], '#fff', C.ed, 1.2, .35);
    poli([[0, 0, topo], [W, 0, topo], [W, D / 2, topo + 3], [0, D / 2, topo + 3]], '#e2e8f0', C.ed, 1.2, .9);
    poli([[0, D / 2, topo + 3], [W, D / 2, topo + 3], [W, D, topo], [0, D, topo]], '#cbd5e1', C.ed, 1.2, .9);
    g1();
    g0('af');
    caixa(3, 2, topo + .3, 2.4, 2.4, 1.6, AGUA);
    txt(4.2, 2, topo + 2.6, "Caixa d'água", { s: 11, b: true, a: 'middle' });
    tuboIso('af', [[4.2, 4.4, topo + .3], [4.2, 5, topo + .3], [4.2, 5, .4]]);
    for (let i = 0; i < n; i++) { tuboIso('af', [[4.2, 5, i * fh + .5], [9, 5, i * fh + .5]], 2.2); if (d.hotDist) tuboIso('aq', [[9, 5.4, i * fh + .8], [11, 5.4, i * fh + .8]], 2.2); }
    g1();
    g0('rec');
    tuboIso('af', [[-7, D + 4, .2], [-3, D + 4, .2]], 3); ponto(-5, D + 4, .2, 'af', 4);
    tuboIso('rec', [[-3, D + 4, .2], [-1, D + 4, .2], [-1, 3, topo + .9], [3, 3, topo + .9]], 3.5);
    g1();
    g0('esg');
    tuboIso('esg', [[10, 7, topo + 1.4], [10, 7, -.5], [10, D + 4.5, -.5]], 4);
    for (let i = 0; i < n; i++) tuboIso('esg', [[7, 7, i * fh + .8], [10, 7, i * fh + .5]], 2.4);
    txt(10.5, D + 4, -.5, 'Rede de esgoto', { s: 11, c: 'esg', b: true });
    g1();
    g0('pluv'); tuboIso('pluv', [[W, D, topo], [W, D, .1], [W, D + 4.8, .1]], 3); g1();
    if (d.chuva) cisternaChuva(W, D + 1, W + 4, D - 3);   // ao lado da casa, além do ramal de gás
    // gás da casa (gás natural, GLP ou P13): abrigo ao lado da casa e tubo até a cozinha do térreo
    if (d.temGas) {
      g0('gas');
      if (d.gas === 'gn') tuboIso('gas', [[W + 2.7, D + 4.5, .2], [W + 2.7, 3.4, .2]], 2.4);   // ramal da rede da rua
      caixa(W + 2, 2, 0, 1.4, 1.4, 1.6, GLP);
      tuboIso('gas', [[W + 2, 2.7, .5], [W - 2, 2.7, .5], [W - 2, 2.7, 1.2]], 2.4);
      txt(W + 2.7, 2, 3.4, { gn: 'Gás natural · medidor', glp: 'GLP · regulador', p13: 'Botijão P13' }[d.gas] || 'Gás', { s: 10, c: 'gas', b: true, a: 'middle' });
      g1();
    }
    return 160 + topo * S + 22 * S;
  }

  function isoGalpao(d) {
    const W = 40, D = 24, h = 9;
    S = 10;
    O = [420, 110 + h * S];
    g0('ed');
    poli([[-10, -4, 0], [W + 6, -4, 0], [W + 6, D + 6, 0], [-10, D + 6, 0]], '#eef2f6', '#cbd5e1', 1);
    poli([[0, 0, 0], [0, 0, h], [W, 0, h], [W, 0, 0]], '#f8fafc', C.ed, 1, .5);
    poli([[0, 0, 0], [0, D, 0], [0, D, h], [0, 0, h]], '#f1f5f9', C.ed, 1, .5);
    poli([[0, 0, h], [W, 0, h], [W, D, h], [0, D, h]], '#fff', C.ed, 1.2, .25);
    txt(W / 2, D, h + 1.5, `Galpão · ${fmt(d.lgArea, 0)} m²`, { s: 11, c: 'mut', a: 'middle' });
    g1();
    g0('af');
    caixa(-8, 2, 6, 4, 4, 3, AGUA);
    out.push(`<polyline points="${pts([[-7.6, 2.4, 0], [-7.6, 2.4, 6]])}" stroke="${C.ed}" stroke-width="3"/><polyline points="${pts([[-4.4, 5.6, 0], [-4.4, 5.6, 6]])}" stroke="${C.ed}" stroke-width="3"/>`);
    txt(-6, 2, 9.8, 'Reservatório + reserva de incêndio', { s: 11, b: true, a: 'middle' });
    tuboIso('af', [[-4, 4, 6.5], [4, 4, 6.5], [4, 20, .5], [8, 20, .5]], 3);
    g1();
    g0('inc');
    tuboIso('inc', [[-4, 3, 6], [-2, 3, 6], [-2, 3, h - 1], [W - 2, 3, h - 1]], 4);
    if (d.bicos) for (let y = 6; y < D - 2; y += 4) tuboIso('inc', [[2, y, h - .6], [W - 4, y, h - .6]], 1.4);
    tuboIso('inc', [[-2, 3, .3], [-2, D - 2, .3], [W - 2, D - 2, .3]], 3);
    for (let i = 0; i < Math.min(4, Math.max(2, d.nHid)); i++) caixa(6 + i * 9, D - 2.8, .3, 1.4, .7, 1.6, { topo: '#fecaca', frente: '#f87171', lado: '#ef4444', borda: C.inc });
    txt(W - 2, 3, h + .4, d.bicos ? `Sprinklers · ${d.bicos} bicos` : 'Rede de incêndio', { s: 11, c: 'inc', b: true, a: 'end' });
    g1();
    g0('esg'); tuboIso('esg', [[8, 21, .5], [8, D + 5, -.4], [W + 4, D + 5, -.4]], 4); txt(W + 3, D + 4, -.4, 'Rede de esgoto', { s: 11, c: 'esg', b: true, a: 'end' }); g1();
    g0('pluv'); tuboIso('pluv', [[W, D, h], [W, D, .1], [W + 5, D, .1]], 3); g1();
    if (d.chuva) cisternaChuva(W + 2.5, D, W + 1.5, D - 5);
    // gás da cozinha do refeitório: central (GLP) ou entrada (gás natural) do lado de fora
    if (d.temGas) {
      g0('gas');
      caixa(W + 1.5, 6, 0, 2.5, 2.5, 2, GLP);
      tuboIso('gas', [[W + 1.5, 7.2, .5], [W - 6, 7.2, .5], [W - 6, 7.2, 1.2]], 2.4);
      txt(W + 2.7, 6, 3.2, d.gas === 'gn' ? 'Gás natural' : 'Central de GLP', { s: 10, c: 'gas', b: true, a: 'middle' });
      txt(W - 6, 7.2, 2.2, 'cozinha', { s: 10, c: 'gas', a: 'middle' });
      g1();
    }
    return 110 + h * S + 44 * S;
  }

  function isoSVG() {
    const d = dados(); if (!d) return '';
    out = []; used = new Set(); S = 15;
    const H0 = d.tipo === 'casa' ? isoCasa(d) : d.tipo === 'galpao' ? isoGalpao(d) : isoEdificio(d);
    const leg = Object.keys(NOMES).filter(k => used.has(k));
    leg.forEach((k, i) => {
      const x = 30 + (i % 4) * 240, y = H0 + 10 + Math.floor(i / 4) * 24;
      out.push(`<g class="esq-legend" data-leg="${k}"><line x1="${x}" y1="${y}" x2="${x + 32}" y2="${y}" stroke="${C[k]}" stroke-width="5" stroke-linecap="round"/><text x="${x + 40}" y="${y + 4}" font-size="12" fill="${C.txt}">${NOMES[k]}</text></g>`);
    });
    const H = H0 + 24 + Math.ceil(leg.length / 4) * 24;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${H}" class="esq-iso" role="img" aria-label="Vista isométrica da instalação: ${esc(d.titulo)}" font-family="Inter, Segoe UI, sans-serif"><rect width="1000" height="${H}" fill="#fff"/>${out.join('')}` +
      `<text x="985" y="${H - 8}" font-size="10" fill="${C.mut}" text-anchor="end">Vista isométrica esquemática, fora de escala · clique na legenda para destacar um sistema</text></svg>`;
  }

  // ---------- abas e ligação com o desenho atual ----------
  let modo = 'fluxo', aplicando = false;   // o desenho abre com o fluxo animado
  function aplica() {
    const box = $('lmEsqSvg'); if (!box || aplicando) return;
    aplicando = true;
    if (modo === 'iso') {
      box.innerHTML = isoSVG();
      const svg = box.querySelector('svg');
      if (svg) { svg.querySelectorAll('.esq-tubo').forEach(el => { const f = el.cloneNode(); f.setAttribute('class', 'esq-flow'); f.setAttribute('stroke-width', Math.max(2, el.getAttribute('stroke-width') * .5)); el.after(f); }); }
    } else {
      window.lmatEsquema?.();   // desenho atual (corte)
      const svg = box.querySelector('svg');
      if (svg && modo === 'fluxo') animaCorte(svg);
    }
    aplicando = false;
  }
  function instala() {
    const box = $('lmEsq'), alvo = $('lmEsqSvg');
    if (!box || !alvo || $('esqTabs')) return;
    alvo.insertAdjacentHTML('beforebegin', `<div class="esq-tabs" id="esqTabs" role="group" aria-label="Tipo de desenho">
      <button type="button" data-m="fluxo" aria-pressed="true">Corte com fluxo</button>
      <button type="button" data-m="corte" aria-pressed="false">Corte simples</button>
      <button type="button" data-m="iso" aria-pressed="false">Isométrico 3D</button>
      <button type="button" id="esqPausa" aria-pressed="false">⏸ Pausar fluxo</button></div>`);
    const tabs = $('esqTabs');
    // quem pediu ao sistema para reduzir animações vê o fluxo parado (os traços já mostram o sentido) e liga quando quiser
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { alvo.classList.add('esq-pausa'); $('esqPausa').setAttribute('aria-pressed', 'true'); $('esqPausa').textContent = '▶ Animar fluxo'; }
    tabs.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (b.id === 'esqPausa') { const p = alvo.classList.toggle('esq-pausa'); b.setAttribute('aria-pressed', p); b.textContent = p ? '▶ Animar fluxo' : '⏸ Pausar fluxo'; return; }
      modo = b.dataset.m;
      tabs.querySelectorAll('[data-m]').forEach(x => x.setAttribute('aria-pressed', x === b));
      $('esqPausa').hidden = modo === 'corte';
      aplica();
    });
    // a legenda do isométrico destaca o sistema clicado
    alvo.addEventListener('click', e => {
      const l = e.target.closest('[data-leg]'); if (!l) return;
      const svg = alvo.querySelector('svg.esq-iso'), k = l.dataset.leg;
      const on = svg.dataset.foco !== k;
      svg.dataset.foco = on ? k : '';
      svg.classList.toggle('esq-foco', on);
      svg.querySelectorAll('[data-sys]').forEach(g => g.classList.toggle('esq-on', g.dataset.sys === k || g.dataset.sys === 'ed'));
    });
    // sempre que o desenho atual for refeito (novo cálculo), reaplica o modo escolhido
    new MutationObserver(() => {
      const svg = alvo.querySelector('svg');
      const pronto = !svg || (modo === 'iso' ? svg.classList.contains('esq-iso') : !!svg.querySelector('.esq-flow'));
      if (!aplicando && modo !== 'corte' && !pronto) aplica();
    }).observe(alvo, { childList: true });
  }
  const espera = setInterval(() => { if ($('lmEsqSvg') && window.lmatEsquema) { clearInterval(espera); instala(); } }, 300);
})();
