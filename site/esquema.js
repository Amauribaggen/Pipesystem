// Dimensionamento Inteligente: desenho esquemático simplificado (corte, sem escala) da instalação escolhida.
// Lê o resultado já calculado (window.lmatApi.last(): materiais com diâmetros no nome) e as escolhas do formulário,
// para acompanhar qualquer opção do gerador sem depender das variáveis internas do cálculo.
(() => {
  const box = document.getElementById('lmEsq'), btn = document.getElementById('lmEsqBtn');
  if (!box || !btn) return;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const fmt = (n, d = 1) => n.toLocaleString('pt-BR', { maximumFractionDigits: d });
  const C = { af: '#2563eb', aq: '#e8590c', esg: '#8d6e63', pluv: '#0d9488', gas: '#d4a106', inc: '#dc2626', rec: '#1e3a8a', chuva: '#16a34a', txt: '#0f1b2d', mut: '#5b6b80', ed: '#94a3b8' };
  const NOMES = { af: 'Água fria', rec: 'Recalque / alimentação', aq: 'Água quente', esg: 'Esgoto e ventilação', pluv: 'Águas pluviais', gas: 'Gás', inc: 'Incêndio (hidrantes e sprinklers)', chuva: 'Água de chuva (não potável)' };

  // ---------- leitura do resultado ----------
  // nome curto do tubo a partir do material da lista: "Tubo PVC soldável 60 mm (2\") — colunas" → "PVC soldável 60 mm (2\")"
  const tubo = r => r ? r.item.split(' — ')[0].replace(/^Tubo (de )?/, '').replace(/^aço galvanizado leve ranhurado/, 'aço ranhurado') : '';
  function dados() {
    const L = window.lmatApi?.last?.(); if (!L) return null;
    const rows = L.rows, find = re => rows.find(r => re.test(r.item)), sum = re => rows.filter(r => re.test(r.item)).reduce((s, r) => s + r.qty, 0);
    const v = id => $(id)?.value, ck = id => !!$(id)?.checked, n = id => Math.max(0, parseFloat(v(id)) || 0);
    const tipo = v('lmTipo') || 'edificio';
    return {
      tipo: tipo.startsWith('galpao') ? 'galpao' : tipo, gt: tipo.slice(7), pav: Math.max(1, Math.round(n('lmPav'))), vagas: n('lmVagas'), pisosGar: Math.round(n('lmPisosGar')),
      gas: v('lmGas'), aq: v('lmAq'), med: !!find(/^Hidrômetro individual/), titulo: $('lmOutTitle')?.textContent || '',
      resSup: find(/^Reservatório superior/), resInf: find(/^Reservatório inferior|cisterna \(reservatório inferior\)/), caixa: find(/^Caixa d'água de polietileno (?!.*cisterna)/),
      recalque: find(/— recalque/), alim: find(/alimentação direta/), bombas: find(/^Conjunto motobomba (de recalque|da cisterna)/),
      coluna: find(/colunas de distribuição/), barrilete: find(/— barrilete$/), nCol: Math.max(1, sum(/topo das colunas/)),
      dist: find(/— distribuição interna/), coletor: find(/^Coletor predial/), esg100: find(/esgoto série normal 100/),
      condut: sum(/^Ralo hemisférico|^Bocal de calha/), calha: find(/^Calha/),
      prumGas: find(/prumadas de gás/), glp: find(/^Central de GLP/), p13: find(/^Botijão P13/), aquec: find(/^Aquecedor de passagem/), hotDist: rows.find(r => r.group === 'Água quente' && /— distribuição/.test(r.item)),
      prumHid: find(/prumada de hidrantes|^Tubo de aço.*\(DN 65\)/), nHid: sum(/^Válvula angular/), bombaInc: find(/^Bomba (de reforço|principal)/), recInc: find(/^Registro de recalque/),
      prumSpk: find(/prumada de sprinklers/), bicosG: sum(/sprinkler.*garagem/), bicosA: sum(/sprinkler residencial/), esfr: sum(/ESFR/), bicos: sum(/^Bico de sprinkler/),
      piscina: find(/^Filtro de areia/), chuva: find(/^Cisterna de água de chuva/), gordura: find(/^Caixa de gordura/),
      lgArea: n('lgArea'), lgPe: n('lgPe'), lgDocas: n('lgDocas'), camara: find(/câmara|Câmara/),
    };
  }

  // ---------- primitivas SVG ----------
  let out = [], used = new Set();
  const line = (x1, y1, x2, y2, c, w = 3, dash = '') => { out.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${C[c] || c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`); if (NOMES[c]) used.add(c); };
  const path = (d, c, w = 3, dash = '') => { out.push(`<path d="${d}" fill="none" stroke="${C[c] || c}" stroke-width="${w}"${dash ? ` stroke-dasharray="${dash}"` : ''} stroke-linejoin="round" stroke-linecap="round"/>`); if (NOMES[c]) used.add(c); };
  const rect = (x, y, w, h, fill, stroke = C.ed, sw = 1.5, extra = '') => out.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" rx="3"${extra}/>`);
  const circle = (x, y, r, c, fill = '#fff') => out.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${C[c] || c}" stroke-width="2"/>`);
  const text = (x, y, t, o = {}) => out.push(`<text x="${x}" y="${y}" font-size="${o.s || 13}" fill="${C[o.c] || o.c || C.txt}" text-anchor="${o.a || 'start'}"${o.b ? ' font-weight="700"' : ''}>${esc(t)}</text>`);
  // rótulo de várias linhas
  const label = (x, y, lines, o = {}) => lines.filter(Boolean).forEach((t, i) => text(x, y + i * ((o.s || 12) + 3), t, { s: o.s || 12, c: o.c || 'mut', a: o.a, b: i === 0 && o.b }));
  const bomba = (x, y, c = 'rec') => { circle(x, y, 9, c); path(`M${x - 4} ${y + 4} L${x + 5} ${y} L${x - 4} ${y - 4} Z`, c, 1.5); };
  const hid = (x, y) => { rect(x, y - 8, 16, 16, '#fff', C.inc, 2); text(x + 8, y + 4, 'H', { s: 10, c: 'inc', a: 'middle', b: true }); used.add('inc'); };
  const bicos = (x1, x2, y, passo = 26) => { line(x1, y, x2, y, 'inc', 2, '6 4'); for (let x = x1 + 10; x < x2; x += passo) { line(x, y, x, y + 7, 'inc', 2); circle(x, y + 9, 2.5, 'inc', C.inc); } };
  const tanque = (x, y, w, h, nome, vol, c = 'af') => { rect(x, y, w, h, '#eaf2ff', C[c], 2); rect(x + 2, y + h * .35, w - 4, h * .65 - 2, '#bfd7ff', 'none', 0); label(x + w / 2, y - 6, [nome + (vol ? ` · ${vol}` : '')], { a: 'middle', c: 'txt', s: 12, b: true }); };

  // ---------- edifício (corte) ----------
  function edificio(d) {
    const fh = 58, nShow = Math.min(d.pav, 5), quebra = d.pav > 5, sub = d.pisosGar;
    const x0 = 330, x1 = 740, G = 120 + (nShow + 1) * fh + 30, top = G - (nShow + 1) * fh;
    const floorY = i => G - (i + 1) * fh;   // topo do pavimento i (0 = térreo)
    // estrutura
    rect(x0, top, x1 - x0, G - top, '#f8fafc', C.ed, 2);
    for (let i = 1; i <= nShow; i++) line(x0, floorY(i - 1), x1, floorY(i - 1), C.ed, 1.5);
    for (let i = 0; i <= nShow; i++) {
      const andar = i === 0 ? 'Térreo' : quebra && i >= 3 ? `${d.pav - (nShow - i)}º` : `${i}º`;
      text(x0 + 8, floorY(i) + 16, andar, { s: 11, c: 'mut' });
    }
    if (quebra) { const y = floorY(2); rect(x0 + 60, y - 8, x1 - x0 - 120, 16, '#fff', C.ed, 1); text((x0 + x1) / 2, y + 4, `⋯ mais ${d.pav - nShow} andares-tipo iguais ⋯`, { s: 11, c: 'mut', a: 'middle' }); }
    for (let s = 0; s < sub; s++) { rect(x0, G + s * fh, x1 - x0, fh, '#eef2f6', C.ed, 1.5); text(x0 + 8, G + s * fh + 16, `Subsolo ${s + 1} · garagem`, { s: 11, c: 'mut' }); }
    line(20, G, 980, G, '#475569', 2); text(d.piscina ? 222 : 24, G - 6, 'Nível da rua', { s: 11, c: 'mut' });
    const fundo = G + sub * fh;

    // reservatório superior + barrilete + colunas de água fria
    const rx = 440, rw = 180, ry = top - 62;
    tanque(rx, ry, rw, 46, 'Reservatório superior', d.resSup ? `${fmt(d.resSup.qty)} m³` : '');
    if (d.prumHid) text(rx + rw / 2, ry + 32, 'inclui reserva de incêndio', { s: 10, c: 'inc', a: 'middle' });
    const cx = [395, 412].slice(0, Math.min(2, d.nCol));
    path(`M${rx + 20} ${ry + 46} V${top - 8} H${cx[0]}`, 'af', 3);
    cx.forEach(x => line(x, top - 8, x, floorY(0) + fh - 10, 'af', 3));
    for (let i = 0; i <= nShow; i++) {
      const y = floorY(i) + fh - 18;
      line(cx[0], y, 470, y, 'af', 2);
      if (d.med && i > 0) circle(452, y, 6, 'af');
      if (d.hotDist && i > 0) { rect(478, y - 10, 16, 20, '#fff4ec', C.aq, 2); line(494, y, 520, y, 'aq', 2); }
    }
    label(x0 - 12, top + 20, [d.barrilete ? `Barrilete ${tubo(d.barrilete)}` : 'Barrilete', d.coluna ? `Colunas ${tubo(d.coluna)} × ${d.nCol}` : ''], { c: 'af', b: true, a: 'end' });
    if (d.med) label(x0 + 8, floorY(1) + 30, ['○ hidrômetro por unidade'], { s: 10, c: 'af' });
    if (d.aquec) label(478, floorY(1) + 30, ['▭ aquecedor a gás'], { s: 10, c: 'aq' });

    // cisterna + recalque, ou alimentação direta
    if (d.resInf) {
      const cy = fundo + 20;
      tanque(140, cy, 120, 52, 'Cisterna', `${fmt(d.resInf.qty)} m³`);
      path(`M40 ${G + 26} H90`, 'af', 3); circle(90, G + 26, 7, 'af'); text(40, G + 46, 'Rede pública + hidrômetro', { s: 10, c: 'mut' });
      path(`M97 ${G + 26} H125 V${cy + 20} H140`, 'af', 3);
      bomba(285, cy + 40); bomba(285, cy + 18);
      path(`M260 ${cy + 40} H276 M294 ${cy + 29} H305 V${ry + 24} H${rx}`, 'rec', 3.5);
      label(296, top + 70, [d.recalque ? `Recalque ${tubo(d.recalque)}` : 'Recalque', d.bombas ? `${d.bombas.qty} bombas (1 reserva)` : ''], { c: 'rec', b: true, a: 'end' });
    } else {
      path(`M40 ${G + 26} H90`, 'af', 3); circle(90, G + 26, 7, 'af'); text(40, G + 46, 'Rede pública + hidrômetro', { s: 10, c: 'mut' });
      path(`M97 ${G + 26} H305 V${ry + 24} H${rx}`, 'rec', 3.5);
      label(296, top + 70, [d.alim ? `Alimentação direta ${tubo(d.alim)}` : 'Alimentação direta', 'sem cisterna'], { c: 'rec', b: true, a: 'end' });
    }

    // esgoto: tubo de queda + ventilação + coletor
    const xe = 650;
    line(xe, top - 34, xe, top, 'esg', 2.5, '5 4'); text(xe + 6, top - 26, 'ventilação', { s: 10, c: 'esg' });
    line(xe, top, xe, fundo + 32, 'esg', 4);
    for (let i = 0; i <= nShow; i++) { const y = floorY(i) + fh - 12; line(600, y - 8, xe, y, 'esg', 2.5); }
    rect(xe + 70, fundo + 22, 22, 18, '#fff', C.esg, 2);
    path(`M${xe} ${fundo + 32} H${xe + 70} M${xe + 92} ${fundo + 32} H960`, 'esg', 4);
    if (d.gordura) { rect(xe + 115, fundo + 22, 22, 18, '#fff7e6', C.esg, 2); text(xe + 126, fundo + 56, 'gordura', { s: 9, c: 'esg', a: 'middle' }); }
    label(960, fundo + 76, ['Rede de esgoto', d.coletor ? d.coletor.item.replace(/\s*\(.*\)/, '') : 'Coletor predial', d.esg100 ? 'Tubo de queda 100 mm' : ''], { c: 'esg', a: 'end', b: true });

    // pluviais
    if (d.condut) {
      line(x1 - 4, top, x1 - 4, G + 14, 'pluv', 3);
      path(`M${x1 - 4} ${G + 14} H${x1 + 50}`, 'pluv', 3); rect(x1 + 50, G + 6, 18, 16, '#fff', C.pluv, 2);
      path(`M${x1 + 68} ${G + 14} H960`, 'pluv', 3);
      label(960, G - 28, ['Rede pluvial', `${d.condut} condutores`], { c: 'pluv', a: 'end', b: true });
      if (d.chuva) { tanque(x1 + 90, G + 62, 90, 40, 'Água de chuva', `${fmt(d.chuva.qty)} m³`, 'chuva'); path(`M${x1 + 59} ${G + 22} V${G + 80} H${x1 + 90}`, 'chuva', 2.5); }
    }

    // gás
    if (d.prumGas || d.glp) {
      const xg = 560;
      line(xg, G - 6, xg, floorY(nShow) + fh - 26, 'gas', 3);
      for (let i = 1; i <= nShow; i++) { const y = floorY(i) + fh - 26; rect(xg - 9, y - 7, 18, 12, '#fff8db', C.gas, 2); line(xg + 9, y - 1, 595, y - 1, 'gas', 2); }
      if (d.glp) { rect(x1 + 20, G - 34, 46, 30, '#fff8db', C.gas, 2); text(x1 + 43, G - 15, 'GLP', { s: 11, c: 'gas', a: 'middle', b: true }); path(`M${x1 + 20} ${G - 20} H${xg}`, 'gas', 3); }
      else path(`M${xg} ${G - 6} V${G + 8} H${x1 + 40}`, 'gas', 3);
      label(xg + 8, G - 26, [d.glp ? 'Gás GLP (central) · medidor por andar' : 'Gás natural · medidor por andar'], { s: 10, c: 'gas', b: true });
    } else if (d.p13) label(x0 + 8, floorY(nShow) + 30, ['Gás: botijão P13 por unidade'], { s: 10, c: 'gas' });

    // incêndio: hidrantes e sprinklers
    if (d.prumHid) {
      const xi = 715;
      line(xi, ry + 30, xi, fundo + fh * 0 - 6, 'inc', 3.5);
      path(`M${rx + rw} ${ry + 30} H${xi}`, 'inc', 3.5);
      if (d.bombaInc) bomba(rx + rw + 40, ry + 30, 'inc');
      for (let i = 0; i <= nShow; i++) hid(xi - 24, floorY(i) + fh - 30);
      for (let s = 0; s < sub; s++) hid(xi - 24, G + s * fh + fh - 30);
      if (d.recInc) { path(`M${xi} ${fundo - 6} H${x1 + 30} V${G - 4}`, 'inc', 3); rect(x1 + 22, G - 6, 16, 8, C.inc, C.inc, 1); }
      label(x1 + 14, top + 30, [`Hidrantes ${tubo(d.prumHid).replace(/\s*\(DN 65\)/, '')}`, `${d.nHid} pontos · registro de recalque`], { c: 'inc', b: true });
    }
    if (d.prumSpk || d.bicos) {
      for (let s = 0; s < sub; s++) bicos(x0 + 6, x1 - 50, G + s * fh + 10);
      if (!sub && d.bicosG) bicos(x0 + 6, x1 - 50, floorY(0) + 6);
      if (d.bicosA) for (let i = 1; i <= nShow; i++) bicos(x0 + 120, x1 - 120, floorY(i) + 6, 34);
      label(x0 + 8, fundo + 20, [`Sprinklers: ${d.bicos} bicos`], { s: 10, c: 'inc' });
    }
    if (d.vagas && !sub) label(x0 + 8, G - 10, [`Garagem no térreo · ${d.vagas} vagas`], { s: 10, c: 'mut' });
    if (sub) label(x0 + 8, G + sub * fh - 8, [`${d.vagas} vagas`], { s: 10, c: 'mut' });
    if (d.piscina) { rect(60, G - 30, 150, 24, '#cfe8ff', C.af, 2); text(135, G - 14, 'Piscina (área de lazer)', { s: 11, c: 'af', a: 'middle', b: true }); }
    return fundo + 110;
  }

  // ---------- casas ----------
  function casa(d) {
    const fh = 80, n = Math.min(d.pav, 3), x0 = 330, x1 = 650, G = 140 + n * fh + 40, top = G - n * fh;
    rect(x0, top, x1 - x0, G - top, '#f8fafc', C.ed, 2);
    path(`M${x0 - 20} ${top} L${(x0 + x1) / 2} ${top - 70} L${x1 + 20} ${top}`, C.ed, 2);
    for (let i = 1; i < n; i++) line(x0, G - i * fh, x1, G - i * fh, C.ed, 1.5);
    line(20, G, 980, G, '#475569', 2); text(24, G - 6, 'Nível da rua', { s: 11, c: 'mut' });
    const cxw = 420, cy = top - 54;
    tanque(cxw, cy, 90, 38, "Caixa d'água", d.caixa ? d.caixa.item.match(/[\d.]+ L/)?.[0] : '');
    path(`M40 ${G + 24} H90`, 'af', 3); circle(90, G + 24, 7, 'af'); text(40, G + 44, 'Rede pública + hidrômetro', { s: 10, c: 'mut' });
    if (d.resInf) {
      tanque(150, G + 20, 90, 40, 'Cisterna', d.resInf.item.match(/[\d.]+ L/)?.[0]);
      path(`M97 ${G + 24} H130 V${G + 40} H150`, 'af', 3); bomba(265, G + 40);
      path(`M240 ${G + 40} H256 M274 ${G + 40} H300 V${cy + 18} H${cxw}`, 'rec', 3.5);
      label(292, top + 30, ['Recalque da cisterna', 'bomba 1/2 cv'], { c: 'rec', b: true, a: 'end' });
    } else { path(`M97 ${G + 24} H300 V${cy + 18} H${cxw}`, 'rec', 3.5); label(292, top + 30, ['Alimentação da caixa', 'direto da rede'], { c: 'rec', b: true, a: 'end' }); }
    path(`M${cxw + 45} ${cy + 38} V${G - 20}`, 'af', 3);
    for (let i = 0; i < n; i++) { const y = G - i * fh - 26; line(cxw + 45, y, 560, y, 'af', 2); if (d.hotDist) { rect(568, y - 10, 16, 20, '#fff4ec', C.aq, 2); line(584, y, 620, y, 'aq', 2); } }
    const xe = 610;
    line(xe, top - 26, xe, G + 30, 'esg', 4); text(xe + 6, top - 18, 'ventilação', { s: 10, c: 'esg' });
    path(`M${xe} ${G + 30} H700`, 'esg', 4); rect(700, G + 22, 22, 18, '#fff', C.esg, 2); if (d.gordura) { rect(740, G + 22, 22, 18, '#fff7e6', C.esg, 2); }
    path(`M722 ${G + 30} H740 M762 ${G + 30} H960`, 'esg', 4);
    label(960, G + 52, ['Rede de esgoto', 'caixas de inspeção e gordura'], { c: 'esg', a: 'end', b: true });
    line(x1 + 20, top, x1 + 20, G + 12, 'pluv', 3); path(`M${x1 + 20} ${G + 12} H960`, 'pluv', 3); label(960, G - 24, ['Calha e condutores', 'para a sarjeta ou rede pluvial'], { c: 'pluv', a: 'end', b: true });
    if (d.p13 || d.glp || d.prumGas) { rect(x0 - 70, G - 40, 34, 40, '#fff8db', C.gas, 2); text(x0 - 53, G - 16, d.p13 ? 'P13' : 'gás', { s: 10, c: 'gas', a: 'middle', b: true }); path(`M${x0 - 36} ${G - 22} H${x0 + 40} V${G - fh + 30}`, 'gas', 2.5); }
    if (d.piscina) { rect(760, G - 2, 140, 24, '#cfe8ff', C.af, 2); text(830, G + 15, 'Piscina', { s: 11, c: 'af', a: 'middle', b: true }); }
    if (d.chuva) { tanque(780, G + 96, 90, 36, 'Água de chuva', '', 'chuva'); path(`M${x1 + 20} ${G + 12} V${G + 114} H780`, 'chuva', 2.5); }
    return G + (d.chuva ? 150 : 120);
  }

  // ---------- galpões ----------
  function galpao(d) {
    const x0 = 240, x1 = 900, h = 150, G = 330, top = G - h;
    rect(x0, top, x1 - x0, h, '#f8fafc', C.ed, 2);
    path(`M${x0 - 10} ${top} L${(x0 + x1) / 2} ${top - 40} L${x1 + 10} ${top}`, C.ed, 2);
    line(20, G, 980, G, '#475569', 2);
    text((x0 + x1) / 2, top + 56, `Galpão ${d.gt} · ${fmt(d.lgArea, 0)} m² · pé-direito ${fmt(d.lgPe, 1)} m`, { s: 12, c: 'mut', a: 'middle' });
    // reservatório (torre) com reserva de incêndio e bombas
    rect(70, top - 40, 110, 70, '#eaf2ff', C.af, 2); rect(72, top - 10, 106, 38, '#bfd7ff', 'none', 0);
    label(125, top - 48, ['Reservatório', d.resSup ? `${fmt(d.resSup.qty)} m³ + incêndio` : '+ reserva de incêndio'], { a: 'middle', c: 'txt', b: true });
    line(90, top + 30, 90, G, C.ed, 3); line(160, top + 30, 160, G, C.ed, 3);
    if (d.resInf) { tanque(80, G + 20, 100, 40, 'Cisterna', `${fmt(d.resInf.qty)} m³`); path(`M180 ${G + 40} H200 V${top + 10} H180`, 'rec', 3); bomba(200, G + 40); }
    path(`M20 ${G + 70} H60 V${G + 50} H80`, 'af', 3); text(20, G + 88, 'Rede pública', { s: 10, c: 'mut' });
    // água fria e esgoto do núcleo sanitário
    path(`M180 ${top + 20} H${x0 + 40} V${G - 40} H${x0 + 70}`, 'af', 3);
    rect(x0 + 70, G - 60, 90, 60, '#eef6ff', C.af, 1.5); text(x0 + 115, G - 26, 'Vestiários', { s: 11, c: 'af', a: 'middle' });
    path(`M${x0 + 115} ${G} V${G + 30} H960`, 'esg', 4); label(960, G + 52, ['Rede de esgoto', d.coletor ? d.coletor.item.replace(/\s*\(.*\)/, '') : ''], { c: 'esg', a: 'end', b: true });
    // incêndio: bombas, anel de hidrantes e sprinklers sob a cobertura
    if (d.bombaInc) bomba(140, G - 14, 'inc');
    path(`M150 ${G - 14} H${x0 - 20} V${top + 18} H${x1 - 20}`, 'inc', 3.5);
    if (d.bicos) { bicos(x0 + 20, x1 - 30, top + 18, 30); label(x0 + 20, top + 50, [`Sprinklers ${d.esfr ? 'ESFR' : 'convencionais'} · ${d.bicos} bicos`], { s: 11, c: 'inc', b: true }); }
    // faixas: hidrantes à esquerda, câmara fria ao centro, docas à direita
    for (let i = 0; i < Math.min(3, Math.max(2, d.nHid)); i++) hid(x0 + 190 + i * 100, G - 24);
    path(`M${x0 - 20} ${G - 14} H${x0 + 420}`, 'inc', 2.5);
    if (d.nHid) label(x0 + 190, G - 40, [`${d.nHid} hidrantes`], { s: 11, c: 'inc', b: true });
    if (d.camara) { rect(x1 - 270, G - 80, 140, 80, '#e0f2fe', '#0284c7', 2); text(x1 - 200, G - 36, 'Câmara fria', { s: 11, c: '#0369a1', a: 'middle', b: true }); }
    // pluviais e docas
    line(x1 + 10, top, x1 + 10, G + 10, 'pluv', 3); path(`M${x1 + 10} ${G + 10} H975`, 'pluv', 3); label(960, top - 50, ['Calhas e condutores', 'rede pluvial'], { c: 'pluv', a: 'end', b: true });
    if (d.lgDocas) { for (let i = 0; i < Math.min(3, d.lgDocas); i++) rect(x1 - 40 - i * 36, G - 20, 28, 20, '#fff', C.ed, 1.5); text(x1 - 76, G - 26, `${d.lgDocas} docas`, { s: 10, c: 'mut', a: 'middle' }); }
    if (d.chuva) { tanque(x0 + 300, G + 64, 100, 36, 'Água de chuva', `${fmt(d.chuva.qty)} m³`, 'chuva'); }
    return G + 120;
  }

  // ---------- montagem ----------
  function draw() {
    const d = dados(); if (!d) return '';
    out = []; used = new Set();
    const h = d.tipo === 'casa' ? casa(d) : d.tipo === 'galpao' ? galpao(d) : edificio(d);
    // legenda
    const leg = [...Object.keys(NOMES)].filter(k => used.has(k));
    leg.forEach((k, i) => { const x = 30 + (i % 3) * 320, y = h + 10 + Math.floor(i / 3) * 22; line(x, y, x + 34, y, k, 4); text(x + 42, y + 4, NOMES[k], { s: 12 }); });
    const H = h + 20 + Math.ceil(leg.length / 3) * 22;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${H}" role="img" aria-label="Desenho esquemático da instalação: ${esc(d.titulo)}" font-family="Inter, Segoe UI, sans-serif">` +
      `<rect width="1000" height="${H}" fill="#ffffff"/>${out.join('')}</svg>`;
  }
  function render() {
    if (box.hidden) return;
    $('lmEsqSvg').innerHTML = draw();
  }
  btn.addEventListener('click', () => {
    box.hidden = !box.hidden;
    btn.textContent = box.hidden ? 'Ver desenho esquemático' : 'Ocultar desenho esquemático';
    render();
    if (!box.hidden) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  $('lmEsqSvgDl').addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([draw()], { type: 'image/svg+xml' }));
    a.download = 'desenho-esquematico-pipesystem.svg';
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  window.lmatEsquema = render;
})();
