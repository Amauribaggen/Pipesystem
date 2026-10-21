// Dimensionamento Inteligente: validação de listas de materiais exportadas do Revit, AutoCAD MEP/Plant 3D e similares.
// Tudo roda no navegador: lê CSV/TXT/XLSX, reconhece material, peça e diâmetro de cada linha, confere a lista por regras
// (unidades, quantidades, conexões por metro, bujões, adesivo) e calcula o orçamento SINAPI do estado escolhido.
// Usa window.lmatApi (bom.js) e FATORES_CONEXOES (fatores-conexoes.js).
(() => {
  const input = document.getElementById('lmValFile');
  if (!input) return;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const fmt = (n, d = 2) => n.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // ---------- Leitura dos arquivos ----------
  async function unzip(buf) {
    const u8 = new Uint8Array(buf), dv = new DataView(buf);
    let e = u8.length - 22;
    while (e > 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
    const files = {}, n = dv.getUint16(e + 10, true), dec = new TextDecoder();
    for (let i = 0, o = dv.getUint32(e + 16, true); i < n; i++) {
      const method = dv.getUint16(o + 10, true), size = dv.getUint32(o + 20, true), nl = dv.getUint16(o + 28, true);
      const xl = dv.getUint16(o + 30, true), cl = dv.getUint16(o + 32, true), lo = dv.getUint32(o + 42, true);
      const name = dec.decode(u8.subarray(o + 46, o + 46 + nl));
      files[name] = async () => {
        const start = lo + 30 + dv.getUint16(lo + 26, true) + dv.getUint16(lo + 28, true), d = u8.slice(start, start + size);
        const raw = method === 0 ? d : new Uint8Array(await new Response(new Blob([d]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
        return dec.decode(raw);
      };
      o += 46 + nl + xl + cl;
    }
    return files;
  }
  const xmlText = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  async function readXlsx(buf) {
    const f = await unzip(buf);
    const strs = f['xl/sharedStrings.xml'] ? [...(await f['xl/sharedStrings.xml']()).matchAll(/<si>([\s\S]*?)<\/si>/g)]
      .map(m => xmlText([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map(t => t[1]).join(''))) : [];
    const sheet = Object.keys(f).filter(k => /^xl\/worksheets\/sheet\d+\.xml$/.test(k)).sort()[0];
    if (!sheet) throw new Error('planilha sem abas');
    const col = ref => [...ref].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
    return [...(await f[sheet]()).matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)].map(m => {
      const r = [];
      for (const c of m[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const v = c[3]?.match(/<v>([\s\S]*?)<\/v>/)?.[1] ?? c[3]?.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1];
        if (v != null) r[col(c[1])] = /t="s"/.test(c[2]) ? strs[+v] : xmlText(v);
      }
      return Array.from(r, x => x ?? '');
    });
  }
  function decodeText(buf) {
    const u8 = new Uint8Array(buf);
    if (u8[0] === 0xFF && u8[1] === 0xFE) return new TextDecoder('utf-16le').decode(u8);   // .txt do Revit
    if (u8[0] === 0xFE && u8[1] === 0xFF) return new TextDecoder('utf-16be').decode(u8);
    const t = new TextDecoder('utf-8').decode(u8);
    return t.includes('�') ? new TextDecoder('windows-1252').decode(u8) : t;
  }
  function parseDelimited(text) {
    const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim());
    const sample = lines.slice(0, 15).join('\n');
    const d = ['\t', ';', ','].map(c => [c, sample.split(c).length]).sort((a, b) => b[1] - a[1])[0][0];
    return lines.map(line => {
      const out = []; let cur = '', q = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (q) { if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') q = false; else cur += ch; }
        else if (ch === '"' && !cur.trim()) q = true;   // aspa só abre texto no início do campo; 2 1/2" solto é polegada
        else if (ch === d) { out.push(cur); cur = ''; } else cur += ch;
      }
      out.push(cur);
      return out.map(c => c.trim());
    });
  }

  // ---------- Colunas ----------
  const COLS = {
    desc: /descri|material|^item$|famil|tipo|type|^nome|name|componente|produto|especifica/,
    qty: /quant|qtd|qtde|count|contagem|qty|^n[ºo°]? ?de/,
    len: /compr|length|metragem|extens/,
    unit: /^un(id|idade)?\.?$|unit|uom|^un /,
    size: /diam|size|tamanho|bitola|^dn$|^d$|polegada/,
  };
  function findHeader(rows) {
    let best = -1, score = 0;
    rows.slice(0, 15).forEach((r, i) => {
      const s = Object.values(COLS).filter(re => r.some(c => re.test(norm(c)))).length;
      if (s > score) { score = s; best = i; }
    });
    if (best < 0 || score < 2) return null;
    const h = rows[best].map(norm), map = {};
    for (const [k, re] of Object.entries(COLS)) {
      const i = h.findIndex((c, j) => re.test(c) && !Object.values(map).includes(j));
      if (i >= 0) map[k] = i;
    }
    // descrição: a coluna mais específica vence ("Família e tipo" do Revit, "Description" do CAD; "Item" só se não houver outra)
    for (const re of [/famil.*tipo|family and type/, /descri/, /material|produto|componente|especifica/, /^nome|name/, /tipo|type/]) {
      const i = h.findIndex(c => re.test(c)); if (i >= 0) { map.desc = i; break; }
    }
    return map.desc == null ? null : { row: best, map, header: rows[best] };
  }
  // número em formato brasileiro ou americano, com ou sem unidade (1.234,5 · 1,234.5 · 2500 mm · 3,5 m)
  function num(v) {
    let s = String(v ?? '').trim();
    if (!s) return { n: NaN };
    const u = (s.match(/(mm|cm|m)\b\.?$/i) || [])[1]?.toLowerCase();
    if (/['′]/.test(s)) return { n: NaN, pes: true };
    s = s.replace(/[^\d.,-]/g, '');
    if (s.includes(',') && s.includes('.')) s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
    else if (s.includes(',')) s = s.replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');
    return { n: parseFloat(s), u };
  }

  // ---------- Reconhecimento ----------
  const POL = { '1/2': 20, '3/4': 25, '1': 32, '1 1/4': 40, '1 1/2': 50, '2': 60, '2 1/2': 75, '3': 85, '4': 110 };
  const POL_PPR = { ...POL, '2': 63, '3': 90 };
  const MM_POL = { 15: '1/2', 20: '3/4', 25: '1', 32: '1 1/4', 40: '1 1/2', 50: '2', 65: '2 1/2', 80: '3', 100: '4' };
  const PVC_POL = { 20: '1/2', 25: '3/4', 32: '1', 40: '1 1/4', 50: '1 1/2', 60: '2', 63: '2', 75: '2 1/2', 85: '3', 90: '3', 110: '4' };
  function sizes(t) {
    const pol = t.match(/(\d+ \d\/\d|\d\/\d|\d+(?:[.,]\d)?)\s*(?:"|''|”|pol\b|in\b|polegada)/)?.[1]?.replace(/(\d+)[.,]5/, '$1 1/2');
    const mm = +(t.match(/(?:ø|dn|de|d)\s*=?\s*(\d{2,3})\b/)?.[1] || t.match(/\b(\d{2,3})\s*mm\b/)?.[1] || t.match(/\b(\d{2,3})\s*x\s*\d/)?.[1] || 0) || null;
    return { pol, mm };
  }
  const has = (t, re) => re.test(t);
  function classify(desc, sizeCol) {
    const t = norm(desc + ' ' + (sizeCol || ''));
    let { pol, mm } = sizes(t);
    // peças antes de "tubo": "Luva para tubo", "Adesivo para tubos" são peças
    const peca = has(t, /\b(bujao|plug|tampao)\b/) ? 'bujao'
      : has(t, /bucha de latao|com bucha|azul/) && has(t, /joelho|cotovelo/) ? 'bucha'
      : has(t, /adesivo|cola\b|cement/) ? 'adesivo'
      : has(t, /joelho|cotovelo|elbow|curva/) ? 'joelho'
      : has(t, /\b(te|tee|tes)\b|juncao|junction/) ? 'te'
      : has(t, /\bluva|coupling|acoplamento/) ? 'luva'
      : has(t, /registro|valvula|valve/) ? 'registro'
      : has(t, /uniao|union/) ? 'uniao'
      : has(t, /caixa sifonada|ralo/) ? 'ralo'
      : has(t, /\b(tubo|tubos|pipe|tubulacao|cano)\b/) ? 'tubo' : null;
    const mat = has(t, /\bppr\b|polipropileno|pp-r/) ? 'ppr'
      : has(t, /cpvc/) ? 'cpvc' : has(t, /\bpex\b/) ? 'pex'
      : has(t, /cobre|copper/) ? 'cobre'
      : has(t, /ranhur|groov|victaulic/) ? 'ranhurado'
      : has(t, /galvan|ferro galv|aco galv|steel|\baco\b|ferro/) ? 'galv'
      : has(t, /pluvial|serie r\b|reforcad/) ? 'pluvial'
      : has(t, /esgoto|serie normal|\bsn\b|sewer|dwv|ventila|\bdrain/) ? 'esgoto'
      : has(t, /pvc|soldavel|marrom/) ? 'pvc' : null;
    const sys = mat === 'pvc' || mat === 'ppr' ? 'af' : mat;
    // diâmetro em mm para plásticos, em polegadas para metais
    if ((mat === 'pvc' || mat === 'ppr' || mat === 'esgoto' || mat === 'pluvial') && !mm && pol) mm = (mat === 'ppr' ? POL_PPR : POL)[pol];
    if ((mat === 'galv' || mat === 'ranhurado' || peca === 'registro' || peca === 'bujao') && !pol && mm) pol = MM_POL[mm];
    let canon = null;
    const P = mat === 'ppr' ? 'PPR' : null;
    if (peca === 'bujao') canon = 'Bujão de ferro galvanizado 1/2" para ponto de água';
    else if (peca === 'adesivo') canon = 'Adesivo para PVC (frasco 175 g)';
    else if (peca === 'bucha') canon = mat === 'ppr' ? 'Conector PPR com inserto metálico 25 mm x 1/2"' : 'Joelho 90° soldável com bucha de latão 25 mm x 1/2" (azul)';
    else if (sys === 'af' && mm) {
      const lab = `${mm} mm (${PVC_POL[mm] || ''}")`;
      canon = { tubo: P ? `Tubo PPR ${lab}` : `Tubo PVC soldável ${lab}`, joelho: `Joelho 90° ${P || 'soldável'} ${lab}`, te: `Tê ${P || 'soldável'} ${lab}`, luva: `Luva ${P || 'soldável'} ${lab}` }[peca] || null;
    } else if (mat === 'esgoto' && mm) {
      const ang = has(t, /\b45\b/) ? 45 : 90;
      canon = { tubo: `Tubo PVC esgoto série normal ${mm} mm`, joelho: `Joelho ${ang}° esgoto ${mm} mm`, luva: `Luva de correr ${mm} mm` }[peca] || null;
    } else if (mat === 'pluvial' && mm && peca === 'tubo') canon = `Tubo PVC para águas pluviais ${mm} mm`;
    else if ((mat === 'galv' || mat === 'ranhurado') && pol) {
      if (peca === 'tubo') canon = mat === 'ranhurado' ? `Tubo de aço galvanizado leve ranhurado ${pol}"` : `Tubo de aço galvanizado ${pol}"`;
      else if (mat === 'ranhurado') canon = { te: `Tê ranhurado ${pol}"`, joelho: `Curva 90° ranhurada ${pol}"`, luva: `Acoplamento rígido ranhurado ${pol}"` }[peca] || null;
      else if (['joelho', 'te', 'luva', 'uniao'].includes(peca)) canon = `Conexões galvanizadas ${pol}" (${peca})`;
    } else if (mat === 'cobre' && peca === 'tubo' && mm) canon = `Tubo de cobre classe ${has(t, /gas|classe a/) ? 'A' : 'E'} ${mm} mm`;
    if (!canon && peca === 'registro' && pol) canon = has(t, /pressao/) ? 'Registro de pressão' : has(t, /esfera|ball/) ? `Registro de esfera ${pol}"` : `Registro de gaveta ${pol}"`;
    if (!canon && peca === 'ralo') canon = has(t, /sifonad/) ? 'Caixa sifonada 150 x 150 x 50 mm' : 'Ralo seco 100 mm';
    return { peca, mat, sys, mm, pol, canon, roscada: peca === 'bucha' || (has(t, /rosca|roscavel/) && has(t, /1\/2/) && peca !== 'tubo') };
  }
  const GRUPO = { af: 'Água fria (PVC/PPR)', esgoto: 'Esgoto', pluvial: 'Águas pluviais', galv: 'Aço galvanizado', ranhurado: 'Aço ranhurado (Grooved)', cobre: 'Cobre', cpvc: 'Água quente (CPVC)', pex: 'Água quente (PEX)' };

  // ---------- Validação ----------
  function validate(rows, fileName) {
    const hd = findHeader(rows);
    if (!hd) return { erro: 'Não encontrei a linha de cabeçalho (Descrição, Quantidade, Comprimento...). Use o modelo de planilha ou exporte a tabela com títulos nas colunas.' };
    const { map } = hd, itens = [], alertas = [];
    const alerta = (nivel, msg, linha) => alertas.push({ nivel, msg, linha });
    let mmLen = /\(mm\)|mm\b/.test(norm(hd.header[map.len] || ''));
    rows.slice(hd.row + 1).forEach((r, k) => {
      const linha = hd.row + 2 + k, desc = r[map.desc];
      if (!desc || /^(total|subtotal|soma)/i.test(norm(desc))) return;
      const c = classify(desc, map.size != null ? r[map.size] : '');
      const q = num(map.qty != null ? r[map.qty] : ''), L = num(map.len != null ? r[map.len] : '');
      let un = norm(map.unit != null ? r[map.unit] : '').replace(/\.$/, ''), qty = q.n;
      if (c.peca === 'tubo' && !isNaN(L.n)) {   // tubo: vale o comprimento
        qty = L.n / (L.u === 'mm' || mmLen ? 1000 : L.u === 'cm' ? 100 : 1); un = 'm';
        if (L.pes) alerta('erro', 'Comprimento em pés e polegadas: exporte em metros ou milímetros.', linha);
      } else if (c.peca === 'tubo' && /^(pc|pç|peca|pecas|br|barra|barras|un)$/.test(un)) {
        alerta('aviso', `Tubo lançado em ${un}: considerei barras de 6 m (${fmt(qty * 6, 0)} m). Confirme.`, linha);
        qty *= 6; un = 'm';
      }
      if (c.peca === 'tubo' && un !== 'm') un = 'm';
      if (!un) un = c.peca === 'tubo' ? 'm' : 'un';
      if (!(qty > 0)) { alerta('erro', `Sem quantidade válida: "${desc}".`, linha); return; }
      if (!c.canon) alerta('info', `Não reconhecido: "${desc}". Fica fora do orçamento; confira o nome ou cote à parte.`, linha);
      else if (c.peca === 'tubo' && c.sys === 'af' && !c.mm) alerta('aviso', `Tubo sem diâmetro: "${desc}".`, linha);
      itens.push({ linha, desc, qty, un, ...c });
    });
    // tubos em mm sem indicação: comprimento médio absurdo para metros
    const tubos = itens.filter(i => i.peca === 'tubo');
    if (!mmLen && tubos.length && tubos.reduce((s, i) => s + i.qty, 0) / tubos.length > 300 && map.len != null) {
      tubos.forEach(i => { i.qty /= 1000; });
      alerta('aviso', 'Os comprimentos parecem estar em milímetros (média acima de 300 m por linha): converti para metros.');
    }
    // duplicados
    const vistos = new Map();
    for (const i of itens) if (i.canon) { const k = i.canon; vistos.set(k, (vistos.get(k) || 0) + 1); }
    for (const [k, n] of vistos) if (n > 1) alerta('info', `${n} linhas somam o mesmo material: ${k}. Normal em tabelas por pavimento; confira se não há repetição.`);
    // conexões por metro (água fria) contra os fatores do site
    const FC = typeof FATORES_CONEXOES !== 'undefined' ? FATORES_CONEXOES : null;
    const porDiam = {};
    for (const i of itens.filter(x => x.sys === 'af' && x.mm && x.peca !== 'bucha')) {
      const d = porDiam[`${i.mat === 'ppr' ? 'PPR' : 'PVC'} ${i.mm}`] ||= { m: 0, joelho: 0, te: 0, luva: 0, mat: i.mat, mm: i.mm };
      if (i.peca === 'tubo') d.m += i.qty; else if (d[i.peca] != null) d[i.peca] += i.qty;
    }
    for (const [key, d] of Object.entries(porDiam)) {
      const mm = key;   // ex.: "PVC 25", "PPR 32"
      if (d.m === 0 && (d.joelho + d.te + d.luva) > 0) { alerta('aviso', `Há conexões ${mm} mm mas nenhum tubo ${mm} mm na lista.`); continue; }
      if (d.m >= 10 && d.joelho + d.te + d.luva === 0) { alerta('aviso', `${fmt(d.m, 0)} m de tubo ${mm} mm sem nenhum joelho, tê ou luva desse diâmetro na lista.`); continue; }
      const f = FC?.ramal[d.mm]; if (!f || d.m < 10) continue;
      for (const [k, nome, esp, fem] of [['joelho', 'joelhos', f.j], ['te', 'tês', f.t], ['luva', 'luvas', f.l * (d.mat === 'ppr' ? FC.luvaPPR || 1 : 1), 1]]) {
        const real = d[k] / d.m * 10;
        if (real < esp * 0.4) alerta('aviso', `${fem ? 'Poucas' : 'Poucos'} ${nome} de ${mm} mm: ${fmt(real, 1)} a cada 10 m de tubo (referência ≈ ${fmt(esp, 1)}). Pode faltar conexão.`);
        else if (real > esp * 3) alerta('info', `${fem ? 'Muitas' : 'Muitos'} ${nome} de ${mm} mm: ${fmt(real, 1)} a cada 10 m (referência ≈ ${fmt(esp, 1)}). Normal em trechos curtos com muitos pontos; confira.`);
      }
    }
    // bujões nas saídas roscadas e adesivo do PVC
    const saidas = itens.filter(i => i.peca === 'bucha').reduce((s, i) => s + i.qty, 0), bujoes = itens.filter(i => i.peca === 'bujao').reduce((s, i) => s + i.qty, 0);
    if (saidas > bujoes) alerta('aviso', `Faltam bujões: ${fmt(saidas, 0)} saídas roscadas (joelhos com bucha) e ${fmt(bujoes, 0)} bujões. Recomendo 1 bujão de 1/2" por ponto de espera.`);
    const pecasPVC = itens.filter(i => i.mat === 'pvc' && i.peca !== 'tubo').reduce((s, i) => s + i.qty, 0);
    if (pecasPVC > 20 && !itens.some(i => i.peca === 'adesivo')) alerta('aviso', `Lista com ${fmt(pecasPVC, 0)} conexões de PVC soldável e sem adesivo: estimo ${Math.ceil(pecasPVC / 50)} frascos de 175 g.`);
    if (itens.some(i => i.mat === 'pvc' && i.sys === 'af') && itens.some(i => i.mat === 'ppr')) alerta('info', 'A água fria mistura PVC soldável e PPR: confira se é intencional (são sistemas diferentes de junta).');
    return { itens, alertas, map, header: hd.header, fileName, linhas: rows.length - hd.row - 1 };
  }

  // ---------- Tela ----------
  let res = null;
  const NIVEL = { erro: 'Erro', aviso: 'Atenção', info: 'Observação' };
  function priced(uf) {
    const api = window.lmatApi, prices = new Map(), data = { rows: [] };
    for (const i of res.itens) {
      const row = { group: ['bujao', 'adesivo'].includes(i.peca) ? 'Acessórios e consumíveis' : GRUPO[i.sys] || (i.peca === 'registro' ? 'Registros e válvulas' : 'Outros'), item: i.desc, qty: Math.round(i.qty * 100) / 100, un: i.un,
        note: (i.canon ? `Reconhecido como: ${i.canon}` : 'Não reconhecido') + ` · linha ${i.linha} do arquivo` };
      data.rows.push(row);
      const p = uf && i.canon && api ? api.price(i.canon, uf) : null;
      if (p) prices.set(row, p);
    }
    data.rows.sort((a, b) => a.group.localeCompare(b.group));
    return { data, prices };
  }
  function render() {
    const out = $('lmValOut');
    if (!res) { out.hidden = true; return; }
    out.hidden = false;
    if (res.erro) { out.innerHTML = `<p class="hint warn">${esc(res.erro)}</p>`; return; }
    const uf = $('lmValUf').value, { data, prices } = priced(uf);
    const reconhecidos = res.itens.filter(i => i.canon).length, n = res.alertas.filter(a => a.nivel !== 'info').length;
    const grupos = new Map();
    let total = 0;
    for (const r of data.rows) { const p = prices.get(r), g = grupos.get(r.group) || { v: 0, n: 0, sem: 0 }; g.n++; if (p) { g.v += p.p * r.qty; total += p.p * r.qty; } else g.sem++; grupos.set(r.group, g); }
    const cols = Object.entries(res.map).map(([k, i]) => `${{ desc: 'Descrição', qty: 'Quantidade', len: 'Comprimento', unit: 'Unidade', size: 'Diâmetro' }[k]} = “${esc(res.header[i])}”`).join(' · ');
    $('lmValStats').innerHTML = [['Linhas lidas', res.itens.length], ['Reconhecidas', `${reconhecidos} (${Math.round(reconhecidos / Math.max(1, res.itens.length) * 100)}%)`],
      ['Erros e atenções', n], ['Com preço SINAPI', uf ? prices.size : '—']].map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    $('lmValCols').textContent = `${res.fileName} · colunas: ${cols}`;
    $('lmValAlerts').innerHTML = res.alertas.length ? `<table class="table lmat__valtab"><thead><tr><th>Tipo</th><th>Linha</th><th>O que conferir</th></tr></thead><tbody>` +
      res.alertas.sort((a, b) => ['erro', 'aviso', 'info'].indexOf(a.nivel) - ['erro', 'aviso', 'info'].indexOf(b.nivel))
        .map(a => `<tr class="is-${a.nivel}"><td>${NIVEL[a.nivel]}</td><td class="num">${a.linha || '—'}</td><td>${esc(a.msg)}</td></tr>`).join('') + '</tbody></table>'
      : '<p class="hint">Nenhum problema encontrado pelas regras de conferência.</p>';
    $('lmValSum').innerHTML = uf ? `<table class="table lmat__sintab"><thead><tr><th>Grupo</th><th class="num">Valor (R$)</th></tr></thead><tbody>` +
      [...grupos].map(([g, x]) => `<tr><td>${esc(g)}${x.sem ? ` <small>(${x.sem} sem preço)</small>` : ''}</td><td class="num">${brl(x.v)}</td></tr>`).join('') +
      `</tbody><tfoot><tr><th>Total de material da lista — ${esc(uf)}</th><th class="num">${brl(total)}</th></tr></tfoot></table>` +
      `<p class="hint">Preços SINAPI ${esc(window.lmatApi?.ref() || '')} (sem desoneração, capital do estado). Itens não reconhecidos ou sem referência ficam fora do total.</p>`
      : '<p class="hint">Escolha o estado para ver o orçamento SINAPI da lista.</p>';
    $('lmValXlsx').hidden = !uf;
    if (uf) $('lmValXlsx').textContent = `Baixar lista validada com preços SINAPI — ${uf}`;
  }
  async function load(file) {
    $('lmValName').textContent = `Lendo ${file.name}…`;
    try {
      const buf = await file.arrayBuffer();
      const rows = /\.xlsx$/i.test(file.name) ? await readXlsx(buf) : /\.xls$/i.test(file.name) ? null : parseDelimited(decodeText(buf));
      res = rows ? validate(rows, file.name) : { erro: 'Arquivo .xls (Excel antigo) não é suportado: salve como .xlsx ou CSV.' };
      $('lmValName').textContent = file.name;
    } catch (e) {
      res = { erro: `Não consegui ler o arquivo (${e.message}). Envie CSV, TXT ou XLSX.` };
      $('lmValName').textContent = file.name;
    }
    render();
    $('lmValOut').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  input.addEventListener('change', () => input.files[0] && load(input.files[0]));
  const drop = $('lmValDrop');
  ['dragover', 'dragenter'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, () => drop.classList.remove('is-over')));
  drop.addEventListener('drop', e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) load(f); });

  const ufSel = $('lmValUf');
  ufSel.innerHTML = '<option value="">Escolha o estado…</option>' + (window.lmatApi?.ufs() || []).map(([u, n]) => `<option value="${u}">${u} — ${n}</option>`).join('');
  try { const s = localStorage.getItem('lmUf'); if (s) ufSel.value = s; } catch {}
  ufSel.addEventListener('change', () => { try { localStorage.setItem('lmUf', ufSel.value); } catch {} render(); });

  $('lmValXlsx').addEventListener('click', () => {
    const uf = ufSel.value; if (!uf || !res?.itens) return;
    const { data, prices } = priced(uf);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(window.lmatApi.xlsx(data, { uf, prices }, `lista validada (${res.fileName})`));
    a.download = `lista-validada-pipesystem-${uf}.xlsx`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  // modelo de planilha para quem não tem exportação pronta
  $('lmValModelo').addEventListener('click', () => {
    const csv = ['Descrição;Diâmetro;Quantidade;Unidade;Comprimento (m)',
      'Tubo PVC soldável água fria;25 mm;;m;120,5', 'Joelho 90° PVC soldável;25 mm;30;un;', 'Tê 90° PVC soldável;25 mm;10;un;',
      'Luva PVC soldável;25 mm;6;un;', 'Joelho 90° soldável com bucha de latão;25 mm x 1/2";12;un;', 'Bujão (plugue) 1/2";1/2";12;un;',
      'Tubo PVC esgoto série normal;100 mm;;m;36', 'Tubo de aço galvanizado;2 1/2";;m;42', 'Registro de gaveta;3/4";8;un;'].join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = 'modelo-lista-de-materiais-pipesystem.csv';
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  window.lmatValidar = { validate, parseDelimited, readXlsx, decodeText, classify };   // para testes
})();
