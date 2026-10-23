// Lista orientativa de materiais do empreendimento (seção Ferramentas).
// Quantidades por índices médios de obra: comprimentos por ponto e por ambiente molhado, colunas por pavimento.
// Usa dimPipes e num, definidos em script.js (carregado antes).
(() => {
  const form = document.getElementById('lmatForm');
  if (!form) return;
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const int = n => (Math.ceil(n - 1e-9) + 0).toLocaleString('pt-BR');

  // ---------- Tipos de unidade ----------
  const blank = i => ({ nome: 'Tipo ' + 'ABCDEFGH'[i], n: 4, area: 70, dorm: 2, ban: 2, lav: 0, varanda: false });
  let types = [{ ...blank(0) }];
  const typeFields = [
    ['nome', 'Nome', 'text'], ['n', 'Unidades por andar', 'number', 1, 40], ['area', 'Área privativa (m²)', 'number', 20, 1000],
    ['dorm', 'Dormitórios', 'number', 0, 10], ['ban', 'Banheiros', 'number', 0, 10], ['lav', 'Lavabos', 'number', 0, 5],
  ];
  const isCasa = () => $('lmTipo').value === 'casa';
  const isGalpao = () => $('lmTipo').value.startsWith('galpao');
  function renderTypes() {
    $('lmTypes').innerHTML = types.map((t, i) => `
      <div class="lmat__type" data-i="${i}">
        <div class="form form--types">
          ${typeFields.map(([f, label, type, min, max]) => `<label>${f === 'n' && isCasa() ? 'Quantidade de casas' : label}<input type="${type}" data-f="${f}" value="${esc(t[f])}"${type === 'number' ? ` min="${min}" max="${max}" step="1"` : ''}></label>`).join('')}
          <label class="lmat__check"><input type="checkbox" data-f="varanda"${t.varanda ? ' checked' : ''}> Varanda ou espaço gourmet com pia</label>
        </div>
        ${types.length > 1 ? `<button type="button" class="lmat__del" data-del="${i}" aria-label="Remover ${esc(t.nome)}">Remover</button>` : ''}
      </div>`).join('');
    $('lmAddType').hidden = types.length >= 6;
  }
  $('lmTypes').addEventListener('input', e => {
    const el = e.target, i = +el.closest('.lmat__type').dataset.i, f = el.dataset.f;
    types[i][f] = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Math.max(0, parseFloat(el.value) || 0) : el.value;
  });
  $('lmTypes').addEventListener('click', e => {
    const b = e.target.closest('[data-del]'); if (!b) return;
    types.splice(+b.dataset.del, 1); renderTypes(); live();
  });
  $('lmAddType').addEventListener('click', () => { types.push(blank(types.length)); renderTypes(); });
  function syncTipo() {
    const casa = isCasa();
    document.querySelectorAll('#lmatTool [data-edif]').forEach(el => { el.hidden = casa; });
    document.querySelectorAll('#lmatTool [data-casa]').forEach(el => { el.hidden = !casa; });
    // galpões: escondem os campos do residencial e mostram os seus, inclusive os específicos de cada tipo (data-gt)
    const gal = isGalpao(), gt = gal ? $('lmTipo').value.slice(7) : '';
    document.querySelectorAll('#lmatTool [data-res]').forEach(el => { el.hidden = gal; });
    document.querySelectorAll('#lmatTool [data-gal]').forEach(el => { el.hidden = !gal; });
    document.querySelectorAll('#lmatTool [data-gt]').forEach(el => { el.hidden = !gal || !el.dataset.gt.split(' ').includes(gt); });
    renderTypes();
  }
  // valores típicos ao escolher cada tipo de galpão (o usuário ajusta depois)
  const GALPAO = {
    logistico: { lgArea: 10000, lgPe: 12, lgEstoq: 10, lgEsc: 400, lgFunc: 80, lgTurnos: 2, lgRef: 'copa', lgDocas: 20, lgPatio: 8000, lgSpk: 'esfr' },
    industrial: { lgArea: 6000, lgPe: 10, lgEstoq: 6, lgEsc: 600, lgFunc: 150, lgTurnos: 3, lgRef: 'cozinha', lgDocas: 6, lgPatio: 5000, lgSpk: 'conv' },
    comercial: { lgArea: 3000, lgPe: 9, lgEstoq: 5, lgEsc: 300, lgFunc: 60, lgTurnos: 1, lgRef: 'copa', lgDocas: 4, lgPatio: 6000, lgSpk: 'conv' },
    crossdocking: { lgArea: 8000, lgPe: 10, lgEstoq: 3, lgEsc: 300, lgFunc: 120, lgTurnos: 3, lgRef: 'copa', lgDocas: 60, lgPatio: 20000, lgSpk: 'conv' },
    refrigerado: { lgArea: 8000, lgPe: 12, lgEstoq: 10, lgEsc: 400, lgFunc: 90, lgTurnos: 3, lgRef: 'copa', lgDocas: 16, lgPatio: 8000, lgSpk: 'esfr', lgCam: 6000 },
  };
  $('lmTipo').addEventListener('change', () => {
    if (isGalpao()) {
      Object.entries(GALPAO[$('lmTipo').value.slice(7)]).forEach(([id, val]) => { $(id).value = val; });
      $('lmCist').value = 'com'; $('lmAq').value = 'eletrico';
      $('lmGas').value = $('lgRef').value === 'cozinha' ? 'glp' : 'nenhum';
      return syncTipo();
    }
    const casa = isCasa();
    $('lmPav').value = casa ? 2 : 8; $('lmPe').value = casa ? 3 : 2.88; $('lmCist').value = casa ? 'sem' : 'com';
    if (casa && $('lmGas').value === 'gn') $('lmGas').value = 'p13';
    syncTipo();
  });

  // ---------- Tabelas de apoio ----------
  const HOT = { // [distribuição, sub-ramal, embalagem]
    pex: ['Tubo PEX 25 mm (água quente)', 'Tubo PEX 16 mm (água quente)', 'rolo', 50, 'Conexão PEX de crimpar'],
    cpvc: ['Tubo CPVC 28 mm (1")', 'Tubo CPVC 22 mm (3/4")', 'barra', 3, 'Conexão CPVC'],
    cobre: ['Tubo de cobre classe E 22 mm', 'Tubo de cobre classe E 15 mm', 'barra', 5, 'Conexão de cobre'],
  };
  const GROUPS = ['Reservação e recalque', 'Água fria — rede geral', 'Água fria — colunas e barrilete', 'Água fria — unidades', 'Vestiários e sanitários',
    'Água quente', 'Gás', 'Esgoto sanitário', 'Refeitório', 'Águas pluviais', 'Docas e pátio', 'Combate a incêndio', 'Sprinklers', 'Água de processo',
    'Ar comprimido', 'Segurança (chuveiros de emergência)', 'Câmaras frias', 'Lavagem de veículos', 'Efluentes industriais', 'Garagem', 'Áreas comuns',
    'Piscina', 'Churrasqueiras', 'Lavanderia coletiva', 'Aproveitamento de água de chuva', 'Louças e metais', 'Consumíveis e fixação'];
  const pickPipe = (mat, Q, vmax) => {
    const list = dimPipes[mat];
    const i = list.findIndex(([, D]) => 4 * Q / 1000 / (Math.PI * Math.pow(D / 1000, 2)) <= vmax);
    return list[i < 0 ? list.length - 1 : i];
  };
  const tankSizes = [500, 1000, 1500, 2000, 3000, 5000, 10000];

  // ---------- Cálculo ----------
  function compute() {
    const casa = isCasa();
    const pav = Math.max(1, Math.round(parseFloat($('lmPav').value) || 1));
    const pe = parseFloat($('lmPe').value) || 2.88;
    const aq = $('lmAq').value, aqMat = $('lmAqMat').value, gas = $('lmGas').value;
    const gal = isGalpao();
    const med = !casa && $('lmMed').checked, comum = !casa && $('lmComum').checked, inc = !casa && $('lmInc').checked, loucas = $(gal ? 'lgLoucas' : 'lmLoucas').checked;
    const perda = 1 + Math.max(0, parseFloat($(gal ? 'lgPerda' : 'lmPerda').value) || 0) / 100;
    const hot = aq !== 'eletrico', hasGas = gas !== 'nenhum';
    const val = id => Math.max(0, Math.round(parseFloat($(id).value) || 0));
    const vagas = casa ? 0 : val('lmVagas'), pisosGar = casa ? 0 : val('lmPisosGar'), ev = casa ? 0 : val('lmEv');
    const piscA = val('lmPisc'), saloes = casa ? 0 : val('lmSalao'), chur = $('lmChur').value, churN = chur === 'nenhuma' ? 0 : val('lmChurN');
    const lavCol = casa ? 0 : val('lmLavCol'), chuva = $('lmChuva').checked;
    let spk = casa ? 'nao' : $('lmSpk').value;
    const cist = $('lmCist').value === 'com';
    const Hs = pisosGar * 3; // profundidade dos subsolos de garagem
    const H = casa ? pe * pav : pe * (pav + 1); // altura até a cobertura (edifício: térreo + andares-tipo)
    const items = new Map(), warn = [];
    let joints = 0, threads = 0;   // emendas soldadas e roscas, para adesivo e fita veda-rosca
    const add = (group, item, qty, un = 'un', o = {}) => {
      if (!(qty > 0)) return;
      const k = group + '|' + item;
      const cur = items.get(k) || { group, item, qty: 0, un, loss: o.loss !== false && un !== 'm³', pack: o.pack, note: o.note };
      cur.qty += qty; items.set(k, cur);
    };
    const pvc = (g, name, m) => add(g, `Tubo PVC soldável ${name}`, m, 'm', { pack: ['barra', 6] });
    // água fria: PVC soldável ou PPR (termofusão, barras de 3 m, sem adesivo)
    const ppr = $('lmAfMat').value === 'ppr', matAF = ppr ? 'ppr' : 'pvc';
    // cada tubo de água fria traz joelhos, tês e luvas pelo fator de conexões por metro (fatores-conexoes.js);
    // o trecho sai do nome: coluna / recalque / alimentação, barrilete ou ramal (distribuição horizontal)
    const FC = typeof FATORES_CONEXOES !== 'undefined' ? FATORES_CONEXOES : null;
    const af = (g, name, m) => {
      if (ppr) add(g, `Tubo PPR ${name}`, m, 'm', { pack: ['barra', 3] }); else pvc(g, name, m);
      if (!FC || !(m > 0)) return;
      const label = name.split(' — ')[0], d = parseInt(label, 10);
      const trecho = /coluna|recalque|alimentação/.test(name) ? 'coluna' : /barrilete/.test(name) ? 'barrilete' : 'ramal';
      let f = trecho === 'ramal' ? FC.ramal[d] : FC[trecho];
      if (!f) { const ks = Object.keys(FC.ramal).map(Number); f = FC.ramal[ks.reduce((a, b) => Math.abs(b - d) < Math.abs(a - d) ? b : a)]; }
      const k = m / 10, nota = { note: 'Fator de conexões por metro' };
      add(g, `${AF.j} ${label}`, k * f.j, 'un', nota);
      add(g, `${AF.t} ${label}`, k * f.t, 'un', nota);
      add(g, `${AF.l} ${label}`, k * f.l * (ppr ? FC.luvaPPR || 1 : 1), 'un', nota);
      if (!ppr) joints += k * (f.j + f.t + f.l);
    };
    // bujão em cada saída roscada que vai receber metal ou aparelho (torneira, chuveiro, ducha, máquina, engate, gás)
    // Pontos de espera: toda saída fica fechada com bujão (roscas) ou tampão (esgoto) para o teste de estanqueidade
    // antes de fechar paredes e forros, e assim fica até a instalação do metal, do aparelho ou do bico.
    const plug = (g, n, gasPt) => { add(g, `Bujão de ferro galvanizado 1/2" para ponto de ${gasPt ? 'gás' : 'água'}`, n, 'un', { note: `Fecha o ponto de espera para o teste de estanqueidade (${gasPt ? 'NBR 15526' : 'NBR 5626'}) até a instalação do ${gasPt ? 'aparelho' : 'metal ou aparelho'}` }); threads += n; };
    const plugT = (g, item, n, norma) => { add(g, item, n, 'un', { loss: false, note: `Fecha o ponto de espera para o teste de estanqueidade (${norma})` }); threads += n; };
    const cap = (g, d, n) => add(g, `Tampão de teste PVC esgoto ${d} mm (ponto de espera)`, n, 'un', { note: 'Fecha o ponto de espera para o teste de estanqueidade do esgoto (NBR 8160)' });
    const AF = ppr ? { j: 'Joelho 90° PPR', t: 'Tê PPR', l: 'Luva PPR', bucha: 'Conector PPR com inserto metálico 25 mm x 1/2"', cx: 'Conexões PPR' }
      : { j: 'Joelho 90° soldável', t: 'Tê soldável', l: 'Luva soldável', bucha: 'Joelho 90° soldável com bucha de latão 25 mm x 1/2" (azul)', cx: 'Conexões soldáveis' };
    const esg = (g, d, m) => add(g, `Tubo PVC ${g === 'Águas pluviais' ? 'para águas pluviais' : 'esgoto série normal'} ${d} mm`, m, 'm', { pack: ['barra', 6] });
    // Arredonda, aplica perdas e ordena a lista
    const build = () => [...items.values()].map(r => {
      let q = r.loss ? r.qty * perda : r.qty;
      q = r.un === 'm³' ? Math.round(q * 10) / 10 : Math.ceil(q - 1e-9);
      const note = r.pack ? `${int(q / r.pack[1])} ${r.pack[0]}${q / r.pack[1] > 1 ? 's' : ''} de ${r.pack[1]} m` + (r.note ? ` · ${r.note}` : '') : r.note || '';
      return { ...r, qty: q, note, norma: (typeof normaDoMaterial === 'function' ? normaDoMaterial(r.item) : '') };
    }).sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group));
    warn.push('Pontos de espera: a lista inclui bujões e tampões em todas as saídas de água, gás, esgoto, ar comprimido e sprinklers, para os testes de estanqueidade antes de fechar paredes e forros.');
    if (gal) return galpao();

    // ---------- Galpões (logístico, industrial, comercial, cross-docking, refrigerado) ----------
    // Índices de obra para galpões: planta retangular 2:1, sanitários pela NR-24, pluviais pela NBR 10844 (150 mm/h),
    // incêndio por IT do Corpo de Bombeiros, NBR 10897 e NFPA 13 (ESFR). Lista orientativa: o projeto define o resto.
    function galpao() {
      const gt = $('lmTipo').value.slice(7);
      const NOMES = { logistico: 'Galpão logístico', industrial: 'Galpão industrial', comercial: 'Galpão comercial', crossdocking: 'Galpão cross-docking', refrigerado: 'Galpão refrigerado' };
      const v = id => Math.max(0, parseFloat($(id).value) || 0);
      const A = Math.max(200, v('lgArea')), peG = Math.max(4, v('lgPe') || 10), est = v('lgEstoq'), esc = v('lgEsc');
      const F = Math.max(1, Math.round(v('lgFunc'))), tur = Math.min(3, Math.max(1, Math.round(v('lgTurnos') || 1)));
      const ref = $('lgRef').value, docas = Math.round(v('lgDocas')), patio = v('lgPatio'), sif = $('lgPluv').value === 'sif';
      const spkG = $('lgSpk').value, hid = $('lgHid').checked, groove = $('lgIncMat').value === 'groove', chuvaG = $('lgChuva').checked;
      const Lg = Math.sqrt(2 * A), Wg = A / Lg, Pg = 2 * (Lg + Wg);   // planta retangular 2:1
      const heavy = gt === 'industrial' || gt === 'refrigerado';
      const cam = gt === 'refrigerado' ? Math.min(A, v('lgCam')) : 0, cong = gt === 'refrigerado' && $('lgTemp').value === 'congelado';
      const V_ = 'Vestiários e sanitários', B_ = 'Água fria — rede geral', R_ = 'Reservação e recalque', E_ = 'Esgoto sanitário', P_ = 'Águas pluviais',
        I_ = 'Combate a incêndio', S_ = 'Sprinklers', RF_ = 'Refeitório', D_ = 'Docas e pátio', PR_ = 'Água de processo', AR_ = 'Ar comprimido',
        SE_ = 'Segurança (chuveiros de emergência)', CF_ = 'Câmaras frias', LV_ = 'Lavagem de veículos', EF_ = 'Efluentes industriais',
        Q_ = 'Água quente', G_ = 'Gás', L_ = 'Louças e metais', F_ = 'Consumíveis e fixação', X_ = 'Aproveitamento de água de chuva';
      let vertical = 0, horizontal = 0, ptG = 0;

      // Pessoas e aparelhos (NR-24: 1 bacia e 1 lavatório a cada 20 trabalhadores; chuveiro a cada 10 em trabalho pesado ou 20)
      const pEsc = esc ? Math.ceil(esc / 7) : 0;
      const pub = gt === 'comercial' ? Math.round(v('lgPub')) : 0;
      const mot = gt === 'crossdocking' && $('lgMot').checked ? Math.max(1, Math.ceil(docas / 10)) : 0;
      const bac = Math.max(2, Math.ceil(F / 20)), mic = Math.ceil(F / 40), chu = Math.max(2, Math.ceil(F / (heavy ? 10 : 20))), beb = Math.max(1, Math.ceil(F / 50));
      const bacE = pEsc ? Math.max(2, Math.ceil(pEsc / 20)) : 0, bacP = pub ? 2 * Math.ceil(pub / 100) : 0, micP = pub ? Math.ceil(pub / 200) : 0;
      const nBac = bac + bacE + bacP + mot, nLav = nBac, nMic = mic + micP, nChu = chu + mot;
      const nucleos = 1 + (A > 6000 ? 1 : 0) + (esc ? 1 : 0) + (pub ? 1 : 0) + (mot ? 1 : 0);
      const torn = Math.ceil(docas / 4) + Math.ceil(Pg / 60);    // torneiras de lavagem nas docas e no perímetro
      let peso = nBac * 0.3 + nLav * 0.3 + nMic * 0.3 + nChu * (hot ? 0.4 : 0.1) + beb * 0.1 + nucleos * 0.7 + torn * 0.4;
      if (ref !== 'nao') peso += ref === 'cozinha' ? 4 * 0.7 : 0.7;

      // Consumo diário (L): funcionários com banho 70 L, escritório 50 L, refeição 25 L (cozinha) ou 10 L (copa), público 15 L
      const refeicoes = ref === 'nao' ? 0 : F * tur;
      let cons = F * tur * 70 + pEsc * 50 + refeicoes * (ref === 'cozinha' ? 25 : 10) + pub * 15 + mot * 6 * 50 + docas * 20;

      // Vestiários e sanitários
      af(V_, '32 mm (1") — distribuição dos vestiários e sanitários', nucleos * 15);
      af(V_, '25 mm (3/4") — ramais dos aparelhos', (nBac + nLav + nMic + nChu + beb) * 2.5);
      add(V_, AF.bucha, nLav + nChu + beb + nucleos, 'un', { note: 'Saída para os pontos de utilização' });
      plug(V_, nLav + nChu + beb + nucleos);
      add(V_, 'Registro de gaveta 3/4" com acabamento', nucleos * 3, 'un', { loss: false, note: 'Um por ambiente molhado' });
      add(V_, 'Registro de pressão 3/4" com acabamento', nChu, 'un', { loss: false, note: 'Chuveiros' });
      threads += (nLav + nChu + beb) * 2;
      const [dMain] = pickPipe(matAF, 0.3 * Math.sqrt(peso), 2);
      af(B_, `${dMain} — rede geral (reservatório até os núcleos sanitários)`, Lg + 20 * nucleos);
      add(B_, `Registro de gaveta ${dMain}`, nucleos + 2, 'un', { loss: false });
      horizontal += Lg + 20 * nucleos;

      // Água quente dos vestiários
      if (hot) {
        const [hD, hS, packN, packL, cx] = HOT[aqMat];
        const lq = nucleos * 12;
        add(Q_, hD + ' — distribuição dos vestiários', lq, 'm', { pack: [packN, packL] });
        add(Q_, hS + ' — sub-ramais dos chuveiros', nChu * 2.5, 'm', { pack: [packN, packL] });
        add(Q_, `${cx}: joelhos, tês e luvas`, nucleos * 6 + nChu * 3);
        add(Q_, `${cx}: terminal com rosca 1/2"`, nChu, 'un', { note: 'Saída para os chuveiros' });
        plug(Q_, nChu);
        add(Q_, 'Isolamento térmico tubular (espuma elastomérica)', lq, 'm');
        if (aq === 'gas') {
          const nAq = Math.ceil(nChu / 3);
          add(Q_, 'Aquecedor de passagem a gás 33 L/min (vestiários)', nAq, 'un', { loss: false, note: 'Um para cada 3 chuveiros em uso simultâneo' });
          add(Q_, 'Duto de exaustão do aquecedor (kit chaminé)', nAq, 'un', { loss: false });
          if (hasGas) { add(G_, 'Tubo de cobre classe A 22 mm (gás dos aquecedores)', nAq * 15, 'm', { pack: ['barra', 5] }); add(G_, 'Registro de esfera para gás 3/4"', nAq, 'un', { loss: false }); plugT(G_, 'Bujão de ferro galvanizado 3/4" para ponto de gás', nAq, 'NBR 15526'); ptG += nAq; }
        }
        if (aq === 'central') add(Q_, 'Boiler / acumulador e aquecimento central dos vestiários (dimensionar à parte)', 1, 'cj', { loss: false });
        threads += nChu;
      }

      // Esgoto sanitário
      esg(E_, 100, nBac * 2 + nucleos * 10);
      esg(E_, 50, (nChu + nMic + nucleos) * 1.5);
      esg(E_, 40, (nLav + beb) * 1.2);
      add(E_, 'Caixa sifonada 150 x 150 x 50 mm com grelha', nucleos * 2 + Math.ceil(nChu / 2));
      add(E_, 'Ralo seco 100 mm (boxes dos chuveiros)', nChu);
      add(E_, 'Joelho 90° esgoto 100 mm', nBac + nucleos * 2);
      add(E_, 'Junção simples 100 x 50 mm', nBac);
      add(E_, 'Joelho 90° esgoto 50 mm', nChu + nMic);
      add(E_, 'Joelho 90° esgoto 40 mm', nLav + beb);
      add(E_, 'Anel de vedação para saída de bacia sanitária', nBac);
      add(E_, 'Tubo PVC esgoto 50 mm — ramais de ventilação', nucleos * 8, 'm', { pack: ['barra', 6] });
      cap(E_, 100, nBac); cap(E_, 50, nChu + nMic); cap(E_, 40, nLav + beb);
      let uhcG = nBac * 6 + nLav + nMic * 2 + nChu * 2 + beb + nucleos * 3 + (ref === 'cozinha' ? 20 : ref === 'copa' ? 6 : 0);
      const dCol = uhcG <= 180 ? 100 : uhcG <= 700 ? 150 : 200, lCol = Lg + 30 + nucleos * 15;
      esg(E_, dCol, lCol);
      add(E_, `Coletor predial: ${dCol} mm (${int(uhcG)} UHC)`, 1, 'cj', { loss: false, note: 'Diâmetro pela soma das unidades Hunter (NBR 8160)' });
      add(E_, 'Caixa de inspeção 60 x 60 cm', Math.ceil(lCol / 25) + nucleos, 'un', { loss: false });
      joints += nBac * 4 + nChu * 2 + nMic * 2 + nLav * 2 + nucleos * 12;

      // Refeitório
      if (ref !== 'nao') {
        const coz = ref === 'cozinha';
        af(RF_, '32 mm (1") — distribuição do refeitório', 20);
        af(RF_, '25 mm (3/4") — pontos de pias e equipamentos', coz ? 40 : 10);
        plug(RF_, coz ? 8 : 2);
        esg(RF_, 100, 20); esg(RF_, 75, coz ? 25 : 8);
        cap(RF_, 50, coz ? 6 : 2);
        add(RF_, coz ? 'Caixa de gordura industrial (dimensionar pelo nº de refeições, NBR 8160)' : 'Caixa de gordura', 1, 'un', { loss: false });
        if (coz) {
          add(RF_, 'Ralo linear com grelha inox (piso da cozinha)', 3, 'un', { loss: false });
          add(RF_, 'Lavatório de mãos com acionamento sem contato (cozinha)', 2, 'un', { loss: false });
          if (hasGas) {
            add(G_, 'Tubo de aço galvanizado 1" (DN 25) — rede de gás da cozinha', 40, 'm', { pack: ['barra', 6] });
            add(G_, 'Conexões galvanizadas 1" (gás)', 16);
            add(G_, 'Registro de esfera para gás 1/2" (fogão, forno, caldeirão)', 4, 'un', { loss: false });
            add(G_, 'Flexível metálico para gás 1/2" (NBR 14177)', 4, 'un', { loss: false });
            plug(G_, 4, true);
            add(G_, 'Detector de vazamento de gás com válvula de bloqueio', 1, 'un', { loss: false });
            ptG += 4; threads += 24;
          } else warn.push('Cozinha industrial sem gás: escolha gás natural ou GLP no item 3, ou preveja equipamentos elétricos.');
        }
        joints += coz ? 40 : 12;
      }
      if (ptG) {
        if (gas === 'glp') { add(G_, 'Central de GLP (cilindros P190 ou tanque, dimensionar com a distribuidora)', 1, 'cj', { loss: false }); add(G_, 'Regulador de pressão de 1º estágio', 1, 'un', { loss: false }); }
        else if (gas === 'gn') add(G_, 'Abrigo de entrada e regulador geral (fornecidos pela concessionária)', 1, 'cj', { loss: false });
        add(G_, 'Regulador de pressão de 2º estágio', 1, 'un', { loss: false });
      }

      // Docas e pátio: ralos dos poços das docas, torneiras de lavagem e drenagem do pátio
      af(D_, '25 mm (3/4") — pontos de lavagem (docas e perímetro)', torn * 12);
      add(D_, 'Torneira de lavagem 3/4" com chave', torn, 'un', { loss: false });
      plug(D_, torn);
      if (docas) {
        add(D_, 'Ralo com grelha no poço da doca (rampa)', docas, 'un', { loss: false });
        esg(D_, 100, docas * 8);
        add(D_, 'Joelho 90° esgoto 100 mm', docas);
        joints += docas * 3;
      }

      // Águas pluviais (NBR 10844, intensidade de projeto 150 mm/h)
      const Qp = 150 * (A + patio) / 3600;   // L/s
      let nCond;
      const calhaL = 2 * Lg + (Wg > 40 ? Lg : 0);
      add(P_, 'Calha em chapa galvanizada ou aço (cobertura)', calhaL, 'm', { note: Wg > 40 ? 'Duas calhas de beiral e uma calha central' : 'Duas calhas de beiral' });
      if (sif) {
        const nb = Math.max(4, Math.ceil(A / 600)), nd = Math.max(2, Math.ceil(nb / 8)), lh = 2 * Lg + nb * 6;
        nCond = nd;
        add(P_, 'Bocal (ralo) sifônico para calha', nb, 'un', { loss: false });
        add(P_, 'Tubo PEAD 110 a 160 mm — coletores horizontais sob a cobertura (sifônico)', lh, 'm');
        add(P_, 'Tubo PEAD 200 mm — descidas do sistema sifônico', nd * (peG + 3), 'm');
        add(P_, 'Conexões PEAD por eletrofusão ou solda de topo (sifônico)', nb * 4 + nd * 4);
        add(P_, 'Trilho e suporte de fixação do sistema sifônico', Math.ceil(lh / 1.5));
        warn.push('Pluvial sifônico: diâmetros, bocais e descidas saem do cálculo hidráulico do fabricante do sistema.');
      } else {
        nCond = Math.max(4, Math.ceil(A / 300));
        esg(P_, 150, nCond * (peG + 2));
        add(P_, 'Bocal de calha / saída 150 mm', nCond);
        add(P_, 'Joelho 90° 150 mm (pluvial)', nCond * 2);
        joints += nCond * 4;
      }
      add(P_, 'Tubo PEAD corrugado 300 mm — coletor pluvial enterrado (perímetro)', Pg * 0.6, 'm', { pack: ['barra', 6] });
      add(P_, 'Caixa de passagem pluvial 80 x 80 cm', Math.ceil(Pg * 0.6 / 30) + Math.ceil(nCond / 2), 'un', { loss: false });
      if (patio) {
        add(P_, 'Canaleta de drenagem com grelha de ferro fundido (pátio)', 2 * Math.sqrt(patio), 'm');
        add(P_, 'Boca de lobo / caixa com grelha 60 x 60 cm (pátio)', Math.ceil(patio / 400), 'un', { loss: false });
        add(P_, 'Tubo PEAD corrugado 400 mm — drenagem do pátio', patio / 20, 'm', { pack: ['barra', 6] });
        add(P_, 'Poço de visita do pátio', Math.ceil(patio / 20 / 30) + 1, 'un', { loss: false });
      }
      add(P_, 'Reservatório de detenção de águas pluviais (volume útil)', (A + patio) * 0.03, 'm³', { loss: false, note: '≈ 30 mm sobre as áreas impermeáveis, se a lei municipal exigir' });
      vertical += nCond * (peG + 2); horizontal += Pg;

      // Incêndio: hidrantes em anel e sprinklers (controle ou ESFR)
      const steel = (g, pol, dn, trecho, m, tes, curvas) => {
        add(g, `Tubo de aço ${groove ? 'galvanizado leve ranhurado' : 'galvanizado'} ${pol}" (DN ${dn}) — ${trecho}`, m, 'm',
          { pack: ['barra', 6], note: groove ? 'Classe leve NBR 5580, ranhura laminada' : 'Classe média NBR 5580, roscável' });
        if (!groove) return add(g, `Conexões galvanizadas ${pol}" (tês, joelhos, uniões)`, tes + curvas + Math.ceil(m / 6));
        if (tes) add(g, `Tê ranhurado ${pol}" (DN ${dn})`, tes);
        if (curvas) add(g, `Curva 90° ranhurada ${pol}" (DN ${dn})`, curvas);
        add(g, `Acoplamento rígido ranhurado ${pol}" (DN ${dn})`, Math.ceil(m / 6) + tes * 3 + curvas * 2, 'un', { note: 'Emendas das barras e ligações de tês e curvas' });
      };
      let rti = 0, nBicos = 0;
      if (hid) {
        const nHid = Math.max(2, Math.ceil(Pg / 40)) + Math.floor(A / 5000);
        steel(I_, '4', 100, 'anel de hidrantes em volta do galpão', Pg * 1.1 + 20, nHid, 10);
        steel(I_, '2 1/2', 65, 'derivações dos hidrantes', nHid * 6, 0, nHid);
        add(I_, 'Válvula angular 2 1/2" com adaptador storz', nHid, 'un', { loss: false });
        add(I_, 'Abrigo para mangueira', nHid, 'un', { loss: false });
        add(I_, 'Mangueira de incêndio 2 1/2", 15 m', nHid * 2, 'un', { loss: false });
        add(I_, 'Esguicho regulável 2 1/2"', nHid, 'un', { loss: false });
        add(I_, 'Chave de mangueira storz', nHid, 'un', { loss: false });
        add(I_, 'Válvula de bloqueio 4" para setorizar o anel', Math.ceil(nHid / 4) + 1, 'un', { loss: false });
        add(I_, 'Registro de recalque (hidrante de recalque) no passeio', 1, 'un', { loss: false });
        rti += 2 * 1000 * 60 / 1000;   // 2 hidrantes simultâneos, 1.000 L/min, 60 min
      }
      if (spkG !== 'nao') {
        const esfr = spkG === 'esfr', b = Math.ceil(A / 9), bSeco = cong ? Math.ceil(cam / 9) : 0, nVGA = Math.max(1, Math.ceil(A / 3700));
        const nTr = Math.max(1, Math.ceil(Wg / 35)), lRam = A / 3 * 1.05, lTr = nTr * Lg * 1.05;
        nBicos = b;
        add(S_, esfr ? 'Bico ESFR K-25 pendente 74 °C (supressão)' : 'Bico de sprinkler K-115 74 °C para armazenagem (controle)', b - bSeco, 'un', { loss: false, note: 'Cerca de 9 m² por bico' });
        if (bSeco) add(S_, 'Bico de sprinkler seco pendente (dry pendent) — câmaras congeladas', bSeco, 'un', { loss: false });
        add(S_, 'Bicos de reserva com armário e chave de troca', Math.max(6, Math.ceil(b * 0.02)), 'un', { loss: false });
        steel(S_, esfr ? '2' : '1 1/2', esfr ? 50 : 40, 'ramais de sprinklers', lRam, 0, Math.ceil(lRam / 40));
        add(S_, `Tê de redução com saída para bico (${esfr ? '1"' : '3/4"'})`, b);
        plugT(S_, `Bujão de ferro galvanizado ${esfr ? '1"' : '3/4"'} para saída de sprinkler`, b, 'teste hidrostático, NBR 10897 / NFPA 13, antes da instalação dos bicos');
        steel(S_, '6', 150, 'troncos (subgerais) de sprinklers', lTr, Math.ceil(lRam / (Wg / nTr)), nTr * 2);
        steel(S_, '6', 150, 'alimentação das válvulas de governo', nVGA * (peG + 3), nVGA, nVGA * 2);
        add(S_, 'Válvula de governo e alarme (VGA) 6"', nVGA, 'un', { loss: false, note: 'Uma a cada 3.700 m², aproximadamente' });
        add(S_, 'Válvula de bloqueio 6" com chave supervisora', nVGA, 'un', { loss: false });
        add(S_, 'Chave detectora de fluxo', nVGA, 'un', { loss: false });
        add(S_, 'Conjunto de teste e dreno', nVGA, 'un', { loss: false });
        if (cong) add(S_, 'Sistema de pré-ação (ou tubo seco) para as câmaras congeladas, com compressor de ar', 1, 'cj', { loss: false });
        add(S_, 'Suporte de tubulação (tirante, abraçadeira e contraventamento)', Math.ceil(lRam / 3.5 + lTr / 3.5), 'un');
        add(S_, 'Registro de recalque de sprinklers no passeio', 1, 'un', { loss: false });
        rti += esfr ? 12 * 600 * 60 / 1000 : 260 * 12 * 90 / 1000;   // ESFR: 12 bicos x 60 min; controle: 260 m² x 12 mm/min x 90 min
        vertical += nVGA * (peG + 3);
        if (esfr && (est > 12.2 || peG > 13.7)) warn.push('ESFR: acima de 12,2 m de armazenagem ou 13,7 m de pé-direito, a NFPA 13 exige bicos especiais ou sprinklers nos porta-paletes (in-rack). Confirme no projeto.');
        if (!esfr && est > 3.7) warn.push('Sprinklers de controle com armazenagem acima de 3,7 m costumam exigir sprinklers também nos porta-paletes (in-rack). Avalie o ESFR.');
      } else if (A > 1500 && gt !== 'comercial') warn.push('Galpões grandes costumam exigir chuveiros automáticos pelas Instruções Técnicas do Corpo de Bombeiros (área, altura e carga de incêndio). Confirme antes de dispensar.');
      if (hid || spkG !== 'nao') {
        add(I_, 'Casa de bombas de incêndio: bomba principal elétrica, bomba reserva a diesel e bomba jóquei (conforme cálculo)', 1, 'cj', { loss: false });
        add(I_, 'Manômetro 0 a 20 bar', 4, 'un', { loss: false });
        add(I_, 'Válvula de alívio e medidor de vazão para teste da bomba', 1, 'cj', { loss: false });
        warn.push(`Reserva técnica de incêndio estimada em ${num(rti, 0)} m³ (hidrantes${spkG !== 'nao' ? ' e sprinklers' : ''}). O volume oficial sai da Instrução Técnica do Corpo de Bombeiros do estado e do cálculo hidráulico.`);
      }

      // Industrial: água de processo, ar comprimido, chuveiros de emergência e efluente
      const emerg = (gt === 'industrial' ? Math.round(v('lgEmerg')) : 0) + (gt !== 'comercial' && $('lgBat').checked ? 1 : 0);
      if (gt === 'industrial') {
        const proc = v('lgProc'), nAr = Math.round(v('lgAr'));
        if (proc) {
          add(PR_, 'Reservatório de água de processo (volume útil)', proc, 'm³', { loss: false, note: '1 dia de consumo do processo' });
          add(PR_, `Conjunto de pressurização com 2 bombas (≈ ${num(proc / 16, 1)} m³/h)`, 1, 'cj', { loss: false, note: 'Processo em 16 h por dia' });
          add(PR_, 'Tubo de aço galvanizado 2" (DN 50) — rede de água de processo', Lg + 40, 'm', { pack: ['barra', 6] });
          add(PR_, 'Conexões galvanizadas 2" (tês, joelhos, uniões)', Math.ceil((Lg + 40) / 6) + 10);
          add(PR_, 'Registro de esfera 2"', 6, 'un', { loss: false });
          add(PR_, 'Filtro Y 2"', 1, 'un', { loss: false });
          add(PR_, 'Hidrômetro da água de processo 2"', 1, 'un', { loss: false });
          plugT(PR_, 'Bujão de ferro galvanizado 1" para ponto de água de processo', 6, 'NBR 5626');
          threads += 30; horizontal += Lg + 40;
        }
        if (nAr) {
          const q = nAr * 0.25, anel = Pg * 0.7;   // 0,25 m³/min por ponto
          add(AR_, `Compressor de parafuso (≈ ${num(q * 1.3, 1)} m³/min, com margem)`, 1, 'un', { loss: false });
          add(AR_, 'Reservatório de ar comprimido 1.000 L (NR-13)', Math.max(1, Math.ceil(q / 5)), 'un', { loss: false });
          add(AR_, 'Secador de ar por refrigeração', 1, 'un', { loss: false });
          add(AR_, 'Filtros coalescentes (antes e depois do secador)', 2, 'un', { loss: false });
          add(AR_, 'Tubo de alumínio 40 mm — anel de ar comprimido', anel, 'm', { pack: ['barra', 6] });
          add(AR_, 'Conexões de alumínio 40 mm (tês, cotovelos, uniões)', Math.ceil(anel / 6) + nAr);
          add(AR_, 'Tubo de alumínio 20 mm — descidas aos pontos de consumo', nAr * 4, 'm', { pack: ['barra', 6] });
          add(AR_, 'Conjunto filtro, regulador e lubrificador (FRL) 1/2"', nAr, 'un', { loss: false });
          add(AR_, 'Engate rápido 1/2"', nAr, 'un', { loss: false });
          plugT(AR_, 'Bujão de ferro galvanizado 1/2" para ponto de ar comprimido', nAr, 'teste de pressão da rede de ar');
          add(AR_, 'Válvula de esfera 1/2"', nAr + 4, 'un', { loss: false });
          add(AR_, 'Purgador automático de condensado', Math.ceil(anel / 30) + 1, 'un', { loss: false });
          horizontal += anel;
        }
        if ($('lgEfl').checked) {
          add(EF_, 'Tubo PVC esgoto 100 mm — rede de efluente industrial (separada do esgoto sanitário)', Lg, 'm', { pack: ['barra', 6] });
          add(EF_, 'Caixa separadora de água e óleo', 1, 'un', { loss: false });
          add(EF_, 'Caixa de amostragem e medição de vazão do efluente', 1, 'un', { loss: false });
          add(EF_, 'Estação de tratamento de efluentes industriais (projeto específico)', 1, 'cj', { loss: false });
          warn.push('Efluente industrial: o tratamento e o lançamento dependem da licença ambiental e das exigências da concessionária.');
        }
      }
      if (emerg) {
        add(SE_, 'Chuveiro de emergência com lava-olhos (ANSI Z358.1)', emerg, 'un', { loss: false, note: $('lgBat').checked && gt !== 'comercial' ? 'Inclui a sala de recarga de baterias' : '' });
        af(SE_, '32 mm (1") — alimentação dos chuveiros de emergência', emerg * 15);
        add(SE_, 'Registro de esfera 1" (sempre aberto, com lacre)', emerg, 'un', { loss: false });
        plugT(SE_, 'Bujão de ferro galvanizado 1" para ponto do chuveiro de emergência', emerg, 'NBR 5626');
        add(SE_, 'Ralo com grelha 150 x 150 mm', emerg, 'un', { loss: false });
        esg(SE_, 100, emerg * 6);
        joints += emerg * 6;
      }

      // Cross-docking: box de lavagem de veículos
      if (gt === 'crossdocking' && $('lgLav').checked) {
        add(LV_, 'Hidrolavadora de alta pressão (box de lavagem)', 1, 'un', { loss: false });
        af(LV_, '32 mm (1") — alimentação do box de lavagem', 30);
        plugT(LV_, 'Bujão de ferro galvanizado 1" para ponto da hidrolavadora', 1, 'NBR 5626');
        add(LV_, 'Canaleta com grelha de ferro fundido (box de lavagem)', 15, 'm');
        add(LV_, 'Caixa de areia (sedimentação)', 1, 'un', { loss: false });
        add(LV_, 'Caixa separadora de água e óleo', 1, 'un', { loss: false });
        esg(LV_, 100, 25);
        cons += 3000;
      }

      // Refrigerado: drenos dos evaporadores, aquecimento do piso e água de condensação
      if (gt === 'refrigerado' && cam) {
        const nEv = Math.max(1, Math.ceil(cam / 120)), refr = { amonia: 'amônia', co2: 'CO₂', hfc: 'HFC/HFO' }[$('lgRefr').value];
        add(CF_, `Central frigorífica a ${refr} e ${int(nEv)} evaporadores (projeto de refrigeração)`, 1, 'cj', { loss: false, note: 'A tubulação frigorífica fica fora desta lista' });
        if (cong) {
          add(CF_, 'Tubo de cobre 28 mm — drenos de condensado dos evaporadores', nEv * 12, 'm', { pack: ['barra', 5] });
          add(CF_, 'Cabo de aquecimento autorregulável para os drenos (câmara congelada)', nEv * 12, 'm');
          add(CF_, 'Tubo PE-RT 20 mm — aquecimento do piso das câmaras (circuito de glicol)', cam * 3.3, 'm', { note: 'Evita o congelamento do solo sob a câmara' });
          add(CF_, 'Coletor (manifold) do aquecimento de piso', Math.ceil(cam / 300), 'un', { loss: false });
          add(CF_, 'Bomba de circulação e trocador de calor do glicol do piso', 1, 'cj', { loss: false });
        } else add(CF_, 'Tubo PVC esgoto 40 mm — drenos de condensado dos evaporadores', nEv * 12, 'm', { pack: ['barra', 6] });
        add(CF_, 'Sifão e caixa de descarga dos drenos de condensado', nEv, 'un', { loss: false });
        add(CF_, 'Isolamento térmico dos drenos (espuma elastomérica)', nEv * 12, 'm');
        add(CF_, 'Ralo sifonado com grelha inox (antecâmaras e docas refrigeradas)', Math.ceil(cam / 500) + docas, 'un', { loss: false });
        if ($('lgCondens').value === 'evap') {
          const kW = cam * (cong ? 0.12 : 0.08), mk = kW * 1.5 * 20;   // ~1,5 L/h por kW rejeitado, 20 h/dia
          cons += mk;
          add(CF_, 'Tubo de aço galvanizado 1 1/2" — reposição de água do condensador evaporativo', 40, 'm', { pack: ['barra', 6] });
          add(CF_, 'Válvula de nível / torneira de boia 1 1/2"', 1, 'un', { loss: false });
          add(CF_, 'Tratamento químico da água de condensação (dosadores)', 1, 'cj', { loss: false });
          esg(CF_, 75, 20);
          warn.push(`Condensador evaporativo: reposição de água estimada em ${num(mk / 1000, 1)} m³/dia, já somada ao consumo.`);
        }
        if ($('lgRefr').value === 'amonia') warn.push('Amônia: a sala de máquinas segue NR-13, NBR 16069 e as exigências de ventilação, detecção e chuveiro de emergência.');
      }

      // Reservação e recalque (2 dias de consumo, com cisterna) ou superior direto
      const H = peG + 5;
      if (cist) {
        const res = cons * 2 / 1000;
        add(R_, 'Reservatório inferior / cisterna (volume útil)', res * 0.6, 'm³', { loss: false, note: '60% de 2 dias de consumo' });
        add(R_, 'Reservatório superior / castelo d\'água (volume útil)', res * 0.4, 'm³', { loss: false, note: '40% de 2 dias de consumo' });
        const Qr = cons / 1000 / (6 * 3600), Dr = 1.3 * Math.sqrt(Qr) * Math.pow(6 / 24, 0.25) * 1000;
        const ri = Math.max(0, dimPipes.aco.findIndex(([, D]) => D >= Dr));
        const [rec] = dimPipes.aco[ri], [suc] = dimPipes.aco[Math.min(ri + 1, dimPipes.aco.length - 1)];
        add(R_, `Tubo de aço galvanizado ${rec} — recalque`, H + 20, 'm', { pack: ['barra', 6] });
        add(R_, `Tubo de aço galvanizado ${suc} — sucção`, 6, 'm', { pack: ['barra', 6] });
        add(R_, `Conexões galvanizadas ${rec} (joelhos, tês, uniões)`, 14);
        add(R_, `Válvula de retenção vertical ${rec}`, 2, 'un', { loss: false });
        add(R_, `Registro de gaveta ${rec}`, 4, 'un', { loss: false });
        add(R_, `Conjunto motobomba de recalque (Q ≈ ${num(Qr * 3600, 1)} m³/h, Hman ≈ ${num(H + 8, 0)} mca)`, 2, 'un', { loss: false, note: '1 em operação e 1 reserva' });
        add(R_, 'Chave-boia / controle de nível', 2, 'un', { loss: false });
        add(R_, 'Torneira de boia (alimentação do reservatório inferior)', 1, 'un', { loss: false });
        vertical += H + 20;
      } else {
        add(R_, 'Reservatório superior / castelo d\'água (volume útil)', cons / 1000, 'm³', { loss: false, note: '1 dia de consumo, alimentação direta pela rede' });
        const [aName] = pickPipe(matAF, cons / 86400 * 3, 1.5);
        af(R_, `${aName} — alimentação direta do reservatório`, H + 30);
        add(R_, 'Torneira de boia (alimentação do reservatório superior)', 1, 'un', { loss: false });
        warn.push('Sem cisterna: confirme se a pressão da rede pública vence a altura do reservatório.');
      }
      add(R_, 'Hidrômetro geral e cavalete (conforme concessionária)', 1, 'cj', { loss: false });
      if (rti) add(R_, 'Reserva técnica de incêndio (volume útil, estimado)', rti, 'm³', { loss: false, note: 'Reservatório separado ou volume exclusivo, conforme a Instrução Técnica' });

      // Aproveitamento de água de chuva: cobertura grande, uso em descargas, lavagem e irrigação
      if (chuvaG) {
        const vol = Math.max(10, Math.min(A * 0.05, (nBac + torn) * 0.5 * 7 + 20)), lRede = Lg + 40;
        add(X_, 'Cisterna de água de chuva (volume útil)', vol, 'm³', { loss: false, note: 'Limitada ao consumo não potável de cerca de 1 semana' });
        add(X_, 'Filtro autolimpante de água de chuva', Math.max(1, Math.ceil(A / 2000)), 'un', { loss: false });
        add(X_, 'Dispositivo de descarte da primeira chuva', Math.max(1, Math.ceil(A / 2000)), 'un', { loss: false });
        add(X_, 'Freio d\'água (entrada calma) e sifão-ladrão', 1, 'cj', { loss: false });
        add(X_, 'Conjunto motobomba para água não potável', 2, 'un', { loss: false });
        add(X_, 'Clorador de pastilhas', 1, 'un', { loss: false });
        pvc(X_, '32 mm (1") — rede de água não potável (tubo identificado)', lRede);
        add(X_, 'Conexões soldáveis 32 e 25 mm', Math.ceil(lRede / 3));
        add(X_, 'Fita de identificação de tubulação "Água não potável" (rolo 30 m)', Math.ceil(lRede / 30), 'un');
        add(X_, 'Válvula de retenção 1"', 2, 'un', { loss: false });
        add(X_, 'Registro de esfera 1"', 3, 'un', { loss: false });
        warn.push('Água de chuva: a rede não potável deve ser separada da potável, identificada e sem conexão cruzada (NBR 15527 e NBR 5626).');
        joints += Math.ceil(lRede / 3);
      }

      // Louças e metais
      if (loucas) {
        add(L_, 'Bacia sanitária com caixa acoplada ou válvula de descarga', nBac, 'un', { loss: false });
        add(L_, 'Assento sanitário', nBac, 'un', { loss: false });
        add(L_, 'Lavatório ou bancada com cuba', nLav, 'un', { loss: false });
        add(L_, 'Torneira de lavatório com fechamento automático', nLav, 'un', { loss: false });
        if (nMic) add(L_, 'Mictório com válvula de fechamento automático', nMic, 'un', { loss: false });
        add(L_, hot ? 'Chuveiro / ducha (água quente)' : 'Chuveiro elétrico', nChu, 'un', { loss: false });
        add(L_, 'Bebedouro de pressão (NR-24)', beb, 'un', { loss: false });
        add(L_, 'Kit sanitário acessível (bacia, lavatório e barras de apoio, NBR 9050)', nucleos, 'cj', { loss: false });
        add(L_, 'Tanque de limpeza (DML)', nucleos, 'un', { loss: false });
        add(L_, 'Sifão', nLav + nucleos, 'un', { loss: false });
        add(L_, 'Engate flexível', nLav + nBac, 'un', { loss: false });
      }

      // Consumíveis e fixação
      add(F_, 'Adesivo para PVC (frasco 175 g)', Math.ceil(joints / 50), 'un');
      add(F_, 'Solução limpadora para PVC (frasco 200 mL)', Math.ceil(joints / 100), 'un');
      add(F_, 'Fita veda-rosca 18 mm x 25 m', Math.ceil(threads / 20), 'un');
      add(F_, 'Abraçadeira tipo D com parafuso e bucha (trechos aparentes)', Math.ceil(vertical / 2 + horizontal / 1.5), 'un');
      if (ptG) add(F_, 'Vareta de solda para brasagem de cobre', Math.ceil(ptG * 5 / 12) + 1, 'un');

      if (hasGas && !ptG) warn.push('Gás escolhido no item 3, mas sem uso no galpão (refeitório com cozinha ou aquecedor a gás). Nenhum item de gás foi incluído.');
      warn.push('Galpão: quantidades por índices médios (planta retangular 2:1). Sanitários pela NR-24; confirme as exigências do Código de Obras municipal.');

      const stats = [
        ['Área do galpão', `${int(A)} m²`], ['Funcionários', `${int(F)} por turno · ${tur} turno${tur > 1 ? 's' : ''}`],
        ['Consumo diário', `${num(cons / 1000, 1)} m³`], ['Vazão de água fria', `${num(0.3 * Math.sqrt(peso))} L/s`],
        ['Vazão pluvial (150 mm/h)', `${num(Qp, 0)} L/s`], ['Bacias / chuveiros', `${int(nBac)} / ${int(nChu)}`],
      ];
      if (nBicos) stats.push(['Bicos de sprinkler', int(nBicos)]);
      if (rti) stats.push(['Reserva de incêndio estimada', `${num(rti, 0)} m³`]);
      if (cam) stats.push(['Câmaras frias', `${int(cam)} m² · ${cong ? 'congelado' : 'resfriado'}`]);
      if (docas) stats.push(['Docas', int(docas)]);
      return { rows: build(), stats, warn, casa: false, pav: 1, units: 0, titulo: NOMES[gt], subtitulo: ` · ${int(A)} m², ${int(F)} funcionários por turno` };
    }

    const tp = types.filter(t => t.n > 0);
    if (!tp.length) return null;

    let aptArea = 0, nChurVar = 0, nBicos = 0;
    let units = 0, unitsPerFloor = 0, pop = 0, ptF = 0, ptQ = 0, ptG = 0, pesoTot = 0, uhc = 0, plate = 0, nTQ = 0, nCoz = 0, nVar = 0;
    const A_ = 'Água fria — unidades', Q_ = 'Água quente', G_ = 'Gás', E_ = 'Esgoto sanitário', L_ = 'Louças e metais';
    for (const t of tp) {
      const U = casa ? t.n : t.n * pav, ban = Math.round(t.ban), lav = Math.round(t.lav), vr = t.varanda ? 1 : 0;
      const sq = Math.sqrt(Math.max(20, t.area));
      units += U; unitsPerFloor += casa ? 0 : t.n; pop += U * Math.max(2, 2 * t.dorm);
      plate += casa ? t.n * t.area / pav * 1.1 : t.n * t.area * 1.2;
      // Pontos por unidade
      const areas = ban + lav + 2 + vr;              // banheiros, lavabos, cozinha, serviço, varanda
      const fria = ban * 4 + lav * 2 + 2 + 2 + vr;    // bacia, lavatório, chuveiro, ducha | bacia, lavatório | pia, lava-louça | tanque, máquina | pia
      const qAreas = hot ? ban + 1 : 0, quente = hot ? ban * 2 + 1 : 0;
      const gPts = hasGas ? 1 + (aq === 'gas' ? 1 : 0) + (chur === 'gas' ? vr : 0) : 0;
      const peso = ban * (0.3 + 0.3 + (hot ? 0.4 : 0.1) + 0.4) + lav * 0.6 + 0.7 + 1 + 0.7 + 1 + vr * 0.7;
      ptF += fria * U; ptQ += quente * U; ptG += gPts * U; pesoTot += peso * U;
      uhc += U * (ban * (6 + 1 + 2) + lav * 7 + 3 + 2 + 3 + 3 + vr * 3);
      nTQ += (casa ? (pav > 1 ? ban + lav : 0) : ban + lav) * t.n; nCoz += t.n; nVar += vr * t.n;
      aptArea += t.area * U; if (chur !== 'nenhuma') nChurVar += vr * U;

      // Água fria
      const [dName] = pickPipe(matAF, 0.3 * Math.sqrt(peso), 2);
      const lDist = areas * (0.5 * sq + 2) + (casa ? 3 * (pav - 1) : 0), lSub = fria * 2.5;
      af(A_, `${dName} — distribuição interna`, lDist * U);
      af(A_, '25 mm (3/4") — ramais e sub-ramais', lSub * U);
      add(A_, AF.bucha, fria * U, 'un', { note: 'Saída para os pontos de utilização' });
      plug(A_, fria * U);
      add(A_, 'Registro de gaveta 3/4" com acabamento', (areas - vr) * U, 'un', { loss: false, note: 'Um por ambiente molhado' });
      add(A_, 'Registro de pressão 3/4" com acabamento', ban * U, 'un', { loss: false, note: 'Chuveiros' });
      if (med) {
        add(A_, 'Hidrômetro individual 3/4" (modelo aceito pela concessionária)', U, 'un', { loss: false });
        add(A_, 'Kit cavalete para hidrômetro 3/4" com registro de esfera', U, 'un', { loss: false });
      }
      if (!ppr) joints += fria * U; threads += (fria + areas + ban) * U;

      // Água quente
      if (hot) {
        const [hD, hS, packN, packL, cx] = HOT[aqMat];
        const lhD = qAreas * (0.5 * sq + 3), lhS = quente * 2.5;
        add(Q_, hD + ' — distribuição', lhD * U, 'm', { pack: [packN, packL] });
        add(Q_, hS + ' — sub-ramais', lhS * U, 'm', { pack: [packN, packL] });
        add(Q_, `${cx}: joelhos, tês e luvas`, (qAreas * 3 + quente * 3) * U);
        add(Q_, `${cx}: terminal com rosca 1/2"`, quente * U, 'un', { note: 'Saída para os pontos de água quente' });
        plug(Q_, quente * U);
        add(Q_, 'Registro de gaveta água quente com acabamento', qAreas * U, 'un', { loss: false });
        add(Q_, 'Isolamento térmico tubular (espuma elastomérica)', lhD * U, 'm');
        if (aq === 'gas') {
          const lpm = ban <= 1 ? '15 L/min' : ban === 2 ? '20 a 23 L/min' : '26 a 33 L/min';
          add(Q_, `Aquecedor de passagem a gás ${lpm}`, U, 'un', { loss: false, note: 'Capacidade pelo número de banhos simultâneos' });
          add(Q_, 'Duto de exaustão do aquecedor (kit chaminé)', U, 'un', { loss: false });
        }
        threads += quente * U;
      }

      // Gás
      if (hasGas) {
        const lg = gPts * (0.4 * sq + 3);
        add(G_, 'Tubo de cobre classe A 15 mm (gás)', lg * U, 'm', { pack: ['barra', 5] });
        add(G_, 'Conexões de cobre 15 mm para gás (joelhos, tês)', (gPts * 3 + gPts - 1) * U);
        add(G_, 'Conector terminal de cobre 15 mm x 1/2"', gPts * U);
        plug(G_, gPts * U, true);
        add(G_, 'Registro de esfera para gás 1/2"', (gPts + 1) * U, 'un', { loss: false, note: 'Um por aparelho e um de corte da unidade' });
        add(G_, 'Flexível metálico para gás 1/2" (NBR 14177)', gPts * U, 'un', { loss: false });
        add(G_, gas === 'p13' ? 'Regulador de pressão para botijão P13 (NBR 8473)' : 'Regulador de pressão de 2º estágio', U, 'un', { loss: false });
        if (gas === 'p13') add(G_, 'Botijão P13 (vasilhame) e abrigo externo ventilado', U, 'un', { loss: false });
        threads += gPts * 2 * U;
      }

      // Esgoto (dentro da unidade)
      const n40 = ban * 2 + lav + 2 + vr, n50 = ban + lav + 2 + vr;
      esg(E_, 100, (ban + lav) * 2 * U);
      esg(E_, 50, n50 * 1.5 * U);
      esg(E_, 40, n40 * 1.2 * U);
      add(E_, 'Caixa sifonada 150 x 150 x 50 mm com grelha', (ban + lav + 1) * U);
      add(E_, 'Ralo seco 100 mm (box)', ban * U);
      add(E_, 'Ralo sifonado 100 x 40 mm', vr * U);
      add(E_, 'Joelho 90° esgoto 100 mm', (ban + lav) * U);
      add(E_, 'Joelho 45° esgoto 100 mm', (ban + lav) * U);
      add(E_, 'Junção simples 100 x 50 mm', (ban + lav) * U);
      add(E_, 'Joelho 90° esgoto 50 mm', n50 * U);
      add(E_, 'Joelho 90° esgoto 40 mm', n40 * U);
      add(E_, 'Anel de vedação para saída de bacia sanitária', (ban + lav) * U);
      add(E_, 'Tubo PVC esgoto 50 mm — ramais de ventilação', (ban + lav) * 1.5 * U, 'm', { pack: ['barra', 6] });
      cap(E_, 100, (ban + lav) * U); cap(E_, 50, n50 * U); cap(E_, 40, n40 * U);
      joints += ((ban + lav) * 3 + n50 + n40 + 2) * U;

      // Louças e metais
      if (loucas) {
        const bac = ban + lav;
        add(L_, 'Bacia sanitária com caixa acoplada', bac * U, 'un', { loss: false });
        add(L_, 'Assento sanitário', bac * U, 'un', { loss: false });
        add(L_, 'Lavatório ou cuba de banheiro', bac * U, 'un', { loss: false });
        add(L_, hot ? 'Misturador de lavatório' : 'Torneira de lavatório', bac * U, 'un', { loss: false });
        add(L_, hot ? 'Chuveiro / ducha (água quente)' : 'Chuveiro elétrico', ban * U, 'un', { loss: false });
        add(L_, 'Ducha higiênica com registro', ban * U, 'un', { loss: false });
        add(L_, 'Cuba de cozinha', (1 + vr) * U, 'un', { loss: false });
        add(L_, hot ? 'Misturador de cozinha' : 'Torneira de cozinha', (1 + vr) * U, 'un', { loss: false });
        add(L_, 'Tanque com torneira', U, 'un', { loss: false });
        add(L_, 'Torneira para máquina de lavar', U, 'un', { loss: false });
        add(L_, 'Sifão', (bac + 2 + vr) * U, 'un', { loss: false });
        add(L_, 'Válvula de escoamento', (bac + 2 + vr) * U, 'un', { loss: false });
        add(L_, 'Engate flexível', (bac * (hot ? 3 : 2) + (1 + vr) * (hot ? 2 : 1)) * U, 'un', { loss: false });
      }
    }

    const qTot = 0.3 * Math.sqrt(pesoTot), cons = pop * (casa ? 150 : 200); // L/dia
    const R_ = 'Reservação e recalque', B_ = 'Água fria — colunas e barrilete', P_ = 'Águas pluviais', I_ = 'Combate a incêndio', C_ = 'Áreas comuns', F_ = 'Consumíveis e fixação';
    let vertical = 0, horizontal = 0;

    if (casa) {
      // Caixa d'água por casa: 1 dia de consumo
      for (const t of tp) {
        const v = Math.max(2, 2 * t.dorm) * 150 * 1.2, vol = tankSizes.find(s => s >= v) || 10000;
        add(R_, `Caixa d'água de polietileno ${vol.toLocaleString('pt-BR')} L`, t.n, 'un', { loss: false });
      }
      const nCasas = tp.reduce((s, t) => s + t.n, 0);
      if (cist) {   // cisterna enterrada + bomba que enche a caixa d'água
        for (const t of tp) {
          const v = Math.max(2, 2 * t.dorm) * 150, vol = tankSizes.find(s => s >= v) || 10000;
          add(R_, `Caixa d'água de polietileno ${vol.toLocaleString('pt-BR')} L — cisterna (reservatório inferior)`, t.n, 'un', { loss: false, note: '1 dia de consumo' });
        }
        add(R_, 'Conjunto motobomba da cisterna (1/2 cv)', nCasas, 'un', { loss: false });
        af(R_, '25 mm (3/4") — recalque da cisterna', nCasas * (pe * pav + 6));
        add(R_, 'Válvula de retenção vertical 3/4"', nCasas, 'un', { loss: false });
        add(R_, 'Chave-boia / controle de nível', nCasas * 2, 'un', { loss: false });
      }
      add(R_, "Adaptador soldável com flange para caixa d'água 32 mm", nCasas * (cist ? 5 : 3));
      add(R_, 'Torneira de boia 3/4"', nCasas, 'un', { loss: false });
      af(R_, '32 mm (1") — barrilete e extravasor', nCasas * 8);
      add(R_, 'Registro de gaveta 1" com acabamento', nCasas * 2, 'un', { loss: false });
      add(R_, 'Padrão de entrada de água (cavalete, conforme concessionária)', nCasas, 'cj', { loss: false });
      for (const t of tp) {
        const sq = Math.sqrt(Math.max(20, t.area));
        esg(E_, 100, t.n * (2 * sq + 8));
        if (pav > 1) esg(E_, 100, t.n * (t.ban + t.lav) * (pe * (pav - 1) + 1));
      }
      add(E_, 'Caixa de gordura', nCasas, 'un', { loss: false });
      add(E_, 'Caixa de inspeção 60 x 60 cm', nCasas * 2, 'un', { loss: false });
      const roof = plate, nCond = tp.reduce((s, t) => s + t.n * Math.max(2, Math.ceil(t.area / pav * 1.1 / 60)), 0);
      esg(P_, 100, nCond * (H + 1));
      add(P_, 'Calha (PVC ou chapa galvanizada)', 4 * Math.sqrt(roof / Math.max(1, nCasas)) * nCasas, 'm');
      add(P_, 'Bocal de calha / saída 100 mm', nCond);
      add(P_, 'Joelho 90° esgoto 100 mm (pluvial)', nCond * 2);
      add(P_, 'Caixa de areia 60 x 60 cm', nCasas, 'un', { loss: false });
      esg(P_, 100, nCasas * 10);
    } else {
      if (!cist) {
        // Sem cisterna: a rede pública abastece direto o reservatório superior, que guarda 1 dia de consumo
        add(R_, 'Reservatório superior (volume útil)', cons / 1000, 'm³', { loss: false, note: '1 dia de consumo, alimentação direta pela rede' + (inc ? ', mais a reserva de incêndio' : '') });
        const [aName] = pickPipe(matAF, cons / 86400 * 3, 1.5);
        af(R_, `${aName} — alimentação direta do reservatório superior`, H + 10);
        add(R_, `Registro de gaveta ${aName}`, 2, 'un', { loss: false });
        add(R_, 'Torneira de boia (alimentação do reservatório superior)', 1, 'un', { loss: false });
        add(R_, 'Hidrômetro geral e cavalete (conforme concessionária)', 1, 'cj', { loss: false });
        warn.push('Sem cisterna: a pressão da rede pública precisa vencer a altura do reservatório superior (' + num(H + 3, 0) + ' m). Confirme com a concessionária; em prédios altos a cisterna com bombas costuma ser obrigatória.');
        vertical += H + 10;
      } else {
      // Reservação: 2 dias de consumo, 60% inferior (cisterna) / 40% superior
      const res = cons * 2 / 1000;
      add(R_, 'Reservatório inferior / cisterna (volume útil)', res * 0.6, 'm³', { loss: false, note: '60% de 2 dias de consumo' });
      add(R_, 'Reservatório superior (volume útil)', res * 0.4, 'm³', { loss: false, note: '40% de 2 dias de consumo' + (inc ? ', mais a reserva de incêndio' : '') });
      // Recalque: Forchheimer, bombas 6 h/dia
      const Qr = cons / 1000 / (6 * 3600), Dr = 1.3 * Math.sqrt(Qr) * Math.pow(6 / 24, 0.25) * 1000;
      const ri = Math.max(0, dimPipes.aco.findIndex(([, D]) => D >= Dr));
      const [rec] = dimPipes.aco[ri], [suc] = dimPipes.aco[Math.min(ri + 1, dimPipes.aco.length - 1)];
      add(R_, `Tubo de aço galvanizado ${rec} — recalque`, H + 10, 'm', { pack: ['barra', 6] });
      add(R_, `Tubo de aço galvanizado ${suc} — sucção`, 6, 'm', { pack: ['barra', 6] });
      add(R_, `Conexões galvanizadas ${rec} (joelhos, tês, uniões)`, 14);
      add(R_, `Válvula de retenção vertical ${rec}`, 2, 'un', { loss: false });
      add(R_, `Registro de gaveta ${rec}`, 4, 'un', { loss: false });
      add(R_, `Conjunto motobomba de recalque (Q ≈ ${num(Qr * 3600, 1)} m³/h, Hman ≈ ${num(H + 8, 0)} mca)`, 2, 'un', { loss: false, note: '1 em operação e 1 reserva' });
      add(R_, 'Chave-boia / controle de nível', 2, 'un', { loss: false });
      add(R_, 'Torneira de boia (alimentação do reservatório inferior)', 1, 'un', { loss: false });
      add(R_, 'Hidrômetro geral e cavalete (conforme concessionária)', 1, 'cj', { loss: false });
      vertical += H + 10;
      }

      // Colunas e barrilete
      const nPrum = med ? Math.ceil(unitsPerFloor / 4) : unitsPerFloor * 2;
      const [pName] = pickPipe(matAF, 0.3 * Math.sqrt(pesoTot / nPrum), 2.5), [bName] = pickPipe(matAF, qTot, 2.5);
      const lBar = 2 * Math.sqrt(plate) + 4 * nPrum;
      af(B_, `${pName} — colunas de distribuição`, nPrum * (H + 3));
      af(B_, `${bName} — barrilete`, lBar);
      add(B_, `Registro de gaveta ${pName} (topo das colunas)`, nPrum, 'un', { loss: false });
      add(B_, `Registro de gaveta ${bName} (saídas do reservatório)`, 2, 'un', { loss: false });
      add(B_, `${AF.t} ${bName}`, nPrum);
      add(B_, `${AF.t} ${pName} (derivações dos andares)`, nPrum * pav);
      if (med) af(B_, '25 mm (3/4") — ramais de andar até os hidrômetros', units * 3);
      if (pav > 12) warn.push('Edifício alto: preveja válvulas redutoras de pressão nas colunas (pressão estática máxima de 40 mca nos pontos, NBR 5626). Elas não estão na lista.');
      vertical += nPrum * (H + 3); horizontal += lBar; if (!ppr) joints += nPrum * (pav + 1);

      // Esgoto: colunas, ventilação e coletor
      const lTQ = H + 1, n75 = nCoz * 2;
      esg(E_, 100, nTQ * lTQ);
      esg(E_, 75, n75 * lTQ);
      add(E_, 'Tubo PVC esgoto 75 mm — colunas de ventilação', Math.ceil(nTQ / 2) * lTQ, 'm', { pack: ['barra', 6] });
      add(E_, 'Junção 100 x 100 mm (ligação dos ramais às colunas)', nTQ * pav);
      add(E_, 'Junção 75 x 50 mm (cozinha e serviço)', n75 * pav);
      add(E_, 'Luva de correr 100 mm', nTQ * pav);
      add(E_, 'Luva de correr 75 mm', n75 * pav);
      add(E_, 'Joelho 45° esgoto 100 mm (pé das colunas)', nTQ * 2);
      add(E_, 'Joelho 45° esgoto 75 mm (pé das colunas)', n75 * 2);
      const dCol = uhc <= 180 ? 100 : uhc <= 700 ? 150 : 200;
      esg(E_, dCol, 2 * Math.sqrt(plate) + 10 + 2 * (nTQ + n75));
      add(E_, `Coletor predial: ${dCol} mm (${int(uhc)} UHC)`, 1, 'cj', { loss: false, note: 'Diâmetro pela soma das unidades Hunter (NBR 8160)' });
      add(E_, 'Caixa de gordura (coletiva, dimensionar pelo nº de cozinhas)', Math.max(1, Math.ceil(nCoz / 2)), 'un', { loss: false });
      add(E_, 'Caixa de inspeção 60 x 60 cm', Math.ceil((nTQ + n75) / 2) + 2, 'un', { loss: false });
      vertical += (nTQ + n75 + Math.ceil(nTQ / 2)) * lTQ; joints += (nTQ + n75) * (pav * 3 + 2);

      // Águas pluviais
      const nCond = Math.max(2, Math.ceil(plate / 90));
      esg(P_, 100, nCond * (H + 2));
      add(P_, 'Ralo hemisférico (abacaxi) 100 mm', nCond);
      add(P_, 'Joelho 90° esgoto 100 mm (pluvial)', nCond * 2);
      if (nVar) {
        esg(P_, 75, Math.ceil(nVar / 2) * (H - pe));
        add(P_, 'Junção 75 x 50 mm (ralos das varandas)', nVar * pav);
      }
      esg(P_, 150, 2 * Math.sqrt(plate) + 15);
      add(P_, 'Caixa de areia 60 x 60 cm', Math.ceil(nCond / 2) + 1, 'un', { loss: false });
      vertical += nCond * (H + 2);

      // Incêndio
      const areaGar = vagas * 25, garFloors = vagas ? Math.max(1, pisosGar) : 0; // 25 m² por vaga, com circulação
      // tubulação da rede de incêndio: aço galvanizado classe média roscado, ou classe leve ranhurado (Grooved) com acoplamento em cada emenda
      // (a ranhura laminada não corta a parede, por isso o sistema ranhurado aceita o tubo leve)
      const groove = $('lmIncMat').value === 'groove';
      const steel = (g, pol, dn, trecho, m, tes, curvas) => {
        add(g, `Tubo de aço ${groove ? 'galvanizado leve ranhurado' : 'galvanizado'} ${pol}" (DN ${dn}) — ${trecho}`, m, 'm',
          { pack: ['barra', 6], note: groove ? 'Classe leve NBR 5580, ranhura laminada' : 'Classe média NBR 5580, roscável' });
        if (!groove) return add(g, `Conexões galvanizadas ${pol}" (tês, joelhos, uniões)`, tes + curvas + Math.ceil(m / 6));
        add(g, `Tê ranhurado ${pol}" (DN ${dn})`, tes);
        add(g, `Curva 90° ranhurada ${pol}" (DN ${dn})`, curvas);
        add(g, `Acoplamento rígido ranhurado ${pol}" (DN ${dn})`, Math.ceil(m / 6) + tes * 3 + curvas * 2, 'un', { note: 'Emendas das barras e ligações de tês e curvas' });
      };
      if (inc) {
        const nHid = (plate > 750 ? 2 : 1) * (pav + 1) + (garFloors ? garFloors * (areaGar / garFloors > 750 ? 2 : 1) : 0);
        steel(I_, '2 1/2', 65, 'prumada de hidrantes', H + Hs + 5, nHid, 2);
        steel(I_, '2 1/2', 65, 'barrilete de incêndio', 15, 2, 4);
        add(I_, 'Válvula angular 2 1/2" com adaptador storz', nHid, 'un', { loss: false });
        add(I_, 'Abrigo para mangueira', nHid, 'un', { loss: false });
        add(I_, 'Mangueira de incêndio 1 1/2", 15 m', nHid * 2, 'un', { loss: false });
        add(I_, 'Esguicho regulável 1 1/2"', nHid, 'un', { loss: false });
        add(I_, 'Chave de mangueira storz', nHid, 'un', { loss: false });
        add(I_, 'Registro de recalque no passeio', 1, 'un', { loss: false });
        add(I_, 'Válvula de retenção 2 1/2"', 1, 'un', { loss: false });
        add(I_, 'Registro de gaveta 2 1/2"', 2, 'un', { loss: false });
        add(I_, 'Bomba de reforço de incêndio (conforme cálculo)', 1, 'cj', { loss: false });
        warn.push('Hidrantes: quantidade e reserva técnica de incêndio dependem da Instrução Técnica do Corpo de Bombeiros do estado. Confirme com o projeto aprovado.');
        vertical += H + Hs + 5;
      }

      // Garagem: ralos, lavagem e drenagem dos subsolos
      if (vagas) {
        const W_ = 'Garagem', nRalo = Math.ceil(areaGar / 150);
        add(W_, 'Ralo com grelha 150 x 150 mm (piso de garagem)', nRalo);
        esg(W_, 100, nRalo * 6 + garFloors * 20);
        add(W_, 'Joelho 90° esgoto 100 mm', nRalo + garFloors * 2);
        add(W_, 'Torneira de lavagem 3/4" com chave', garFloors * 2, 'un', { loss: false });
        af(W_, '25 mm (3/4") — pontos de lavagem', garFloors * 30);
        plug(W_, garFloors * 2);
        add(W_, 'Registro de gaveta 3/4" com acabamento', garFloors, 'un', { loss: false });
        add(W_, 'Caixa separadora de água e óleo', 1, 'un', { loss: false });
        if (pisosGar) {
          add(W_, 'Poço de drenagem com 2 bombas submersíveis (lavagem e infiltração)', 1, 'cj', { loss: false, note: 'Subsolo abaixo da rede pública' });
          add(W_, 'Tubo de aço galvanizado 2" (DN 50) — recalque da drenagem', Hs + 15, 'm', { pack: ['barra', 6] });
          add(W_, 'Válvula de retenção 2"', 2, 'un', { loss: false });
          add(W_, 'Registro de gaveta 2"', 2, 'un', { loss: false });
        }
        pesoTot += garFloors * 2 * 0.4; joints += nRalo * 3 + garFloors * 12; vertical += Hs;
      }

      // Sprinklers (NBR 10897): garagem risco ordinário ≈ 12 m²/bico; apartamentos risco leve ≈ 18 m²/bico
      if (ev && spk === 'nao') {
        spk = 'garagem';
        warn.push('Recarga de veículos elétricos: a lista inclui sprinklers na garagem, exigidos por muitos Corpos de Bombeiros nas vagas com carregador. Confirme na Instrução Técnica do seu estado.');
      }
      if (spk !== 'nao' && (vagas || spk === 'todo')) {
        const S_ = 'Sprinklers', bG = vagas ? Math.ceil(areaGar / 12) : 0, bA = spk === 'todo' ? Math.ceil(aptArea * 1.15 / 18) : 0;
        const b = bG + bA, floors = garFloors + (spk === 'todo' ? pav + 1 : 0);
        nBicos = b;
        add(S_, 'Bico de sprinkler 68 °C K80 1/2" — garagem (upright ou pendente)', bG, 'un', { note: ev ? `Inclui as ${ev} vagas com recarga de veículos elétricos` : '', loss: false });
        add(S_, 'Bico de sprinkler residencial 68 °C 1/2" — apartamentos e circulações', bA, 'un', { loss: false });
        add(S_, 'Bicos de reserva com armário e chave de troca', Math.max(6, Math.ceil(b * 0.02)), 'un', { loss: false });
        // ramais de 1" e 1 1/4" sempre roscados (galvanizados); subgerais, prumada e barrilete conforme o material escolhido
        add(S_, 'Tubo de aço galvanizado 1" (DN 25) — ramais de sprinklers', b * 3, 'm', { pack: ['barra', 6] });
        add(S_, 'Tubo de aço galvanizado 1 1/4" (DN 32) — ramais de sprinklers', b * 0.6, 'm', { pack: ['barra', 6] });
        add(S_, 'Conexões galvanizadas 1" e 1 1/4" (tês, joelhos, reduções)', b * 1.2);
        add(S_, 'Tê de redução com saída 1/2" para bico', b);
        plugT(S_, 'Bujão de ferro galvanizado 1/2" para saída de sprinkler', b, 'teste hidrostático, NBR 10897, antes da instalação dos bicos');
        steel(S_, '2', 50, 'subgerais de sprinklers', b * 0.4, Math.ceil(b / 8), floors * 2);
        steel(S_, '4', 100, 'prumada de sprinklers', (spk === 'todo' ? H : 0) + Hs + 3, floors, 2);
        steel(S_, '4', 100, 'barrilete de sprinklers', 20, 2, 4);
        add(S_, 'Suporte de tubulação (tirante e abraçadeira)', Math.ceil(b * 4 / 3));
        add(S_, 'Válvula de controle seccional com chave supervisora', floors, 'un', { loss: false });
        add(S_, 'Chave detectora de fluxo', floors, 'un', { loss: false });
        add(S_, 'Conjunto de teste e dreno', floors, 'un', { loss: false });
        add(S_, 'Válvula de governo e alarme (VGA) 4"', 1, 'un', { loss: false });
        add(S_, 'Registro de recalque de sprinklers no passeio', 1, 'un', { loss: false });
        add(S_, 'Bomba principal e bomba jóquei de sprinklers (conforme cálculo)', 1, 'cj', { loss: false });
        add(S_, 'Manômetro 0 a 20 bar', 4, 'un', { loss: false });
        warn.push('Sprinklers: a reserva técnica de incêndio soma hidrantes e sprinklers. Bicos, diâmetros e bombas saem do cálculo hidráulico da NBR 10897.');
        vertical += (spk === 'todo' ? H : 0) + Hs;
      }

      // Áreas comuns
      if (comum) {
        af(C_, '32 mm (1") — distribuição', 30);
        af(C_, '25 mm (3/4") — ramais', 40);
        add(C_, 'Torneira de jardim 3/4"', 4, 'un', { loss: false });
        plug(C_, 4);
        add(C_, 'Registro de gaveta 3/4" com acabamento', 4, 'un', { loss: false });
        esg(C_, 100, 15); esg(C_, 50, 12); esg(C_, 40, 8);
        cap(C_, 100, 2); cap(C_, 40, 3);
        add(C_, 'Caixa sifonada 150 x 150 x 50 mm com grelha', 3);
        if (loucas) {
          add(C_, 'Bacia e lavatório acessíveis (PNE), com barras de apoio', 2, 'cj', { loss: false });
          add(C_, 'Cuba e torneira de copa', 1, 'cj', { loss: false });
        }
        pesoTot += 2 * 0.6 + 0.7 + 4 * 0.4;
      }

      // Salões de festas: 2 sanitários e copa por salão
      if (saloes) {
        const n = saloes;
        af(C_, '32 mm (1") — distribuição', n * 15);
        af(C_, '25 mm (3/4") — ramais', n * 15);
        plug(C_, n * 5);
        add(C_, 'Registro de gaveta 3/4" com acabamento', n * 3, 'un', { loss: false });
        esg(C_, 100, n * 6); esg(C_, 50, n * 6); esg(C_, 40, n * 5);
        cap(C_, 100, n * 2); cap(C_, 40, n * 3);
        add(C_, 'Caixa sifonada 150 x 150 x 50 mm com grelha', n * 2);
        add(C_, 'Caixa de gordura (copa dos salões)', n, 'un', { loss: false });
        if (hasGas) {
          add(G_, 'Tubo de cobre classe A 15 mm (gás)', n * 12, 'm', { pack: ['barra', 5] });
          plug(G_, n, true);
          add(G_, 'Registro de esfera para gás 1/2"', n, 'un', { loss: false });
          add(G_, 'Flexível metálico para gás 1/2" (NBR 14177)', n, 'un', { loss: false });
        }
        if (loucas) {
          add(C_, 'Bacia sanitária com caixa acoplada (salões)', n * 2, 'un', { loss: false });
          add(C_, 'Lavatório com torneira (salões)', n * 2, 'un', { loss: false });
          add(C_, 'Cuba e torneira de copa', n, 'cj', { loss: false });
        }
        pesoTot += n * (2 * 0.6 + 0.7); joints += n * 40;
      }

      // Lavanderia coletiva
      if (lavCol) {
        const V_ = 'Lavanderia coletiva', n = lavCol;
        af(V_, '32 mm (1") — distribuição', 15);
        af(V_, '25 mm (3/4") — ramais das máquinas e tanques', n * 2.5 + 10);
        add(V_, AF.bucha, n + 2);
        plug(V_, n + 2);
        add(V_, 'Registro de esfera 3/4" (um por máquina)', n, 'un', { loss: false });
        add(V_, 'Torneira para máquina de lavar', n, 'un', { loss: false });
        add(V_, 'Tanque com torneira', 2, 'un', { loss: false });
        esg(V_, 50, n * 1.5 + 10); esg(V_, 75, 12);
        cap(V_, 50, n); cap(V_, 40, 2);
        add(V_, 'Caixa sifonada 150 x 150 x 50 mm com grelha', Math.ceil(n / 3));
        add(V_, 'Ralo linear com grelha (piso da lavanderia)', 2);
        add(V_, 'Joelho 90° esgoto 50 mm', n + 2);
        pesoTot += n * 1 + 2 * 0.7; joints += n * 6 + 20;
      }
    }

    // Gás: prumadas e central
    if (hasGas && !casa && gas !== 'p13') {
      const nGp = Math.ceil(unitsPerFloor / 4);
      add(G_, 'Tubo de aço galvanizado 1" (DN 25) — prumadas de gás', nGp * (H + 3), 'm', { pack: ['barra', 6] });
      add(G_, 'Conexões galvanizadas 1" (tês das derivações)', nGp * pav + 6);
      add(G_, 'Tubo de cobre classe A 22 mm — ramais até os medidores', units * 3, 'm', { pack: ['barra', 5] });
      add(G_, 'Abrigo de medidores de gás por pavimento', pav, 'un', { loss: false });
      add(G_, 'Válvula de bloqueio da prumada 1"', nGp, 'un', { loss: false });
      if (gas === 'glp') {
        add(G_, 'Central de GLP (cilindros P190 ou tanque, dimensionar com a distribuidora)', 1, 'cj', { loss: false });
        add(G_, 'Regulador de pressão de 1º estágio', 1, 'un', { loss: false });
        add(G_, 'Tubo de aço galvanizado 1" — da central à prumada', 20, 'm', { pack: ['barra', 6] });
      } else add(G_, 'Abrigo de entrada e regulador geral (fornecidos pela concessionária)', 1, 'cj', { loss: false });
      vertical += nGp * (H + 3); threads += nGp * pav * 2;
    }
    // Piscina (NBR 10339): filtragem do volume em 6 h
    if (piscA) {
      const K_ = 'Piscina', vol = piscA * 1.4, qf = vol / 6, sq = Math.sqrt(piscA);
      add(K_, `Filtro de areia para piscina (vazão ≥ ${num(qf, 1)} m³/h)`, 1, 'un', { loss: false, note: `Volume estimado ${num(vol, 0)} m³ (profundidade média 1,4 m)` });
      add(K_, `Motobomba de piscina com pré-filtro (${num(qf, 1)} m³/h)`, 1, 'un', { loss: false });
      add(K_, 'Skimmer (coadeira)', Math.ceil(piscA / 40), 'un', { loss: false });
      add(K_, 'Dispositivo de retorno', Math.ceil(piscA / 20) + 1, 'un', { loss: false });
      add(K_, 'Dispositivo de aspiração', Math.ceil(piscA / 50), 'un', { loss: false });
      add(K_, 'Ralo de fundo antiaprisionamento (par interligado)', 1, 'cj', { loss: false, note: 'Segurança contra sucção, NBR 10339' });
      pvc(K_, '50 mm (1 1/2") — sucção e retorno', 6 * sq + 20);
      pvc(K_, '60 mm (2") — dreno de fundo', 20);
      add(K_, 'Conexões soldáveis 50 e 60 mm', Math.ceil(sq * 3) + 20);
      add(K_, 'Registro de esfera 50 mm (casa de máquinas)', 6, 'un', { loss: false });
      add(K_, 'Torneira de boia 3/4" (reposição de água)', 1, 'un', { loss: false });
      add(K_, 'Chuveiro / ducha de piscina', 1, 'un', { loss: false });
      add(K_, 'Clorador / dosador automático', 1, 'un', { loss: false });
      esg(K_, 75, 15);
      joints += Math.ceil(sq * 3) + 20;
    }

    // Churrasqueiras: pia em cada churrasqueira das áreas comuns; ponto de gás quando a gás
    if (chur !== 'nenhuma' && (churN || nChurVar)) {
      const J_ = 'Churrasqueiras';
      if (churN) {
        af(J_, '25 mm (3/4") — pontos de água das churrasqueiras', churN * 8);
        plug(J_, churN);
        esg(J_, 50, churN * 6);
        cap(J_, 50, churN);
        add(J_, 'Caixa de gordura pequena', churN, 'un', { loss: false });
        if (loucas) add(J_, 'Cuba e torneira da churrasqueira', churN, 'cj', { loss: false });
        pesoTot += churN * 0.7; joints += churN * 8;
      }
      if (chur === 'gas') {
        if (!hasGas) warn.push('Churrasqueira a gás precisa de gás: escolha gás natural, GLP ou botijão.');
        else {
          if (churN) {
            add(G_, 'Tubo de cobre classe A 15 mm (gás)', churN * 15, 'm', { pack: ['barra', 5] });
            plug(G_, churN, true);
            add(G_, 'Registro de esfera para gás 1/2"', churN, 'un', { loss: false });
            add(G_, 'Flexível metálico para gás 1/2" (NBR 14177)', churN, 'un', { loss: false });
          }
          add(J_, 'Churrasqueira a gás (queimadores, equipamento)', churN + nChurVar, 'un', { loss: false, note: nChurVar ? `${int(nChurVar)} nas varandas, ponto de gás incluído em Gás` : '' });
        }
      } else add(J_, 'Churrasqueira a carvão: coifa e duto de exaustão (fora da hidráulica)', churN + nChurVar, 'un', { loss: false });
    }

    // Aproveitamento de água de chuva (NBR 15527): rede separada, uso não potável
    if (chuva) {
      const X_ = 'Aproveitamento de água de chuva', roof = plate, nCasas = casa ? tp.reduce((s, t) => s + t.n, 0) : 1;
      const vol = Math.max(casa ? nCasas * 1 : 5, roof * 0.05), lRede = 2 * Math.sqrt(roof) + (casa ? 15 * nCasas : 30 + pisosGar * 20);
      add(X_, 'Cisterna de água de chuva (volume útil)', vol, 'm³', { loss: false, note: '≈ 50 mm de chuva sobre a cobertura' });
      add(X_, 'Filtro autolimpante de água de chuva', Math.ceil(roof / 300) * (casa ? nCasas : 1), 'un', { loss: false });
      add(X_, 'Dispositivo de descarte da primeira chuva', Math.ceil(roof / 300) * (casa ? nCasas : 1), 'un', { loss: false });
      add(X_, 'Freio d\'água (entrada calma) e sifão-ladrão', casa ? nCasas : 1, 'cj', { loss: false });
      add(X_, 'Conjunto motobomba para água não potável', casa ? nCasas : 2, 'un', { loss: false });
      add(X_, 'Clorador de pastilhas', casa ? nCasas : 1, 'un', { loss: false });
      pvc(X_, '32 mm (1") — rede de água não potável (tubo identificado)', lRede);
      add(X_, 'Conexões soldáveis 32 e 25 mm', Math.ceil(lRede / 3));
      add(X_, 'Torneira de uso restrito com placa "Água não potável"', casa ? 2 * nCasas : 4 + 2 * pisosGar, 'un', { loss: false });
      plug(X_, casa ? 2 * nCasas : 4 + 2 * pisosGar);
      add(X_, 'Fita de identificação de tubulação "Água não potável" (rolo 30 m)', Math.ceil(lRede / 30), 'un');
      add(X_, 'Válvula de retenção 1"', casa ? nCasas : 2, 'un', { loss: false });
      add(X_, 'Registro de esfera 1"', (casa ? nCasas : 1) * 3, 'un', { loss: false });
      warn.push('Água de chuva: a rede não potável deve ser totalmente separada da potável, identificada e sem conexão cruzada (NBR 15527 e NBR 5626).');
      joints += Math.ceil(lRede / 3);
    }

    if (hasGas && gas === 'p13' && !casa) warn.push('Botijão P13 dentro de apartamentos não é aceito pela maioria dos Corpos de Bombeiros em edifícios novos: prefira gás natural ou GLP em central.');
    if (aq === 'gas' && !hasGas) warn.push('O aquecedor a gás precisa de gás: escolha gás natural, GLP ou botijão.');
    warn.push('NBR 15575-6 (desempenho): nas edificações habitacionais, as instalações hidrossanitárias devem ter vida útil de projeto mínima de 20 anos, estanqueidade comprovada por teste, separação entre água potável e não potável, água quente em temperatura segura e acesso para manutenção. Registre os testes e entregue o manual de uso e manutenção (NBR 14037).');
    if (aq === 'central') warn.push('Aquecimento central ou solar: a lista inclui só a distribuição dentro das unidades. Boiler, coletores e recirculação devem ser dimensionados à parte.');

    // Consumíveis e fixação
    add(F_, 'Adesivo para PVC (frasco 175 g)', Math.ceil(joints / 50), 'un');
    add(F_, 'Solução limpadora para PVC (frasco 200 mL)', Math.ceil(joints / 100), 'un');
    add(F_, 'Fita veda-rosca 18 mm x 25 m', Math.ceil(threads / 20), 'un');
    add(F_, 'Abraçadeira tipo D com parafuso e bucha (colunas e trechos aparentes)', Math.ceil(vertical / 2 + horizontal / 1.5), 'un');
    if (hasGas || (hot && aqMat === 'cobre')) add(F_, 'Vareta de solda para brasagem de cobre', Math.ceil((ptG * 5 + (hot && aqMat === 'cobre' ? ptQ * 4 : 0)) / 12) + 1, 'un');

    const rows = build();

    const stats = [
      [casa ? 'Casas' : 'Unidades', int(units)], ['População estimada', `${int(pop)} pessoas`],
      ['Consumo diário', `${num(cons / 1000, 1)} m³`], ['Vazão de projeto', `${num(0.3 * Math.sqrt(pesoTot))} L/s`],
      ['Pontos de água fria', int(ptF)], ['Pontos de água quente', int(ptQ)], ['Pontos de gás', int(ptG)],
      [casa ? 'Altura da casa' : 'Altura do edifício', `${num(H, 1)} m`],
    ];
    if (vagas) stats.push(['Área de garagem', `${int(vagas * 25)} m²`]);
    if (nBicos) stats.push(['Bicos de sprinkler', int(nBicos)]);
    if (piscA) stats.push(['Volume da piscina', `${num(piscA * 1.4, 0)} m³`]);
    return { rows, stats, warn, casa, pav, units };
  }

  // ---------- Saída ----------
  let last = null;
  function render() {
    last = compute();
    const out = $('lmatOut');
    if (!last) { out.hidden = true; return; }
    out.hidden = false;
    const nome = $('lmNome').value.trim();
    $('lmOutTitle').textContent = last.titulo ? (nome || last.titulo) + last.subtitulo : (nome || (last.casa ? 'Conjunto de casas' : 'Edifício residencial')) +
      (last.casa ? ` · ${int(last.units)} casa${last.units > 1 ? 's' : ''} de ${last.pav} pavimento${last.pav > 1 ? 's' : ''}` : ` · ${last.pav} andares-tipo, ${int(last.units)} unidades`);
    $('lmStats').innerHTML = last.stats.map(([k, v]) => `<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    $('lmWarn').innerHTML = last.warn.map(w => `<p class="hint warn">${esc(w)}</p>`).join('');
    // colunas de preço e subtotais por grupo: só aparecem no Imprimir / PDF, em branco para preencher
    const pc = '<td class="lmat__pc"></td><td class="lmat__pc"></td>';
    const sub = grp => `<tr class="lmat__sub"><td colspan="5">Subtotal — ${esc(grp)} (R$)</td><td class="lmat__pc"></td><td></td></tr>`;
    let g = '';
    $('lmRows').innerHTML = last.rows.map(r => {
      const head = r.group !== g ? (g ? sub(g) : '') + `<tr class="lmat__group"><th colspan="7">${esc(g = r.group)}</th></tr>` : '';
      return head + `<tr><td>${esc(r.item)}</td><td class="num">${r.un === 'm³' ? num(r.qty, 1) : int(r.qty)}</td><td>${r.un}</td><td class="lmat__norma">${esc(r.norma || '—')}</td>${pc}<td>${esc(r.note)}</td></tr>`;
    }).join('') + sub(g);
    $('lmQuote').dataset.question = asText(true);
    renderSinapi();
    if (window.lmatEsquema) window.lmatEsquema();   // redesenha o esquema aberto (esquema.js)
  }
  function asText(short) {
    const lines = [$('lmOutTitle').textContent, ...last.stats.map(([k, v]) => `${k}: ${v}`), ''];
    // cada item com espaço para o preço unitário e o total; subtotal por grupo e total geral no fim
    const blank = 'R$ ________';
    const qty = r => r.un === 'm³' ? num(r.qty, 1) : int(r.qty);
    if (short) return quoteTable(lines, qty);
    let g = '';
    for (const r of last.rows) {
      if (r.group !== g) {
        if (g) lines.push(`Subtotal ${g}: ${blank}`);
        lines.push('', (g = r.group).toUpperCase());
      }
      lines.push(`- ${r.item}: ${r.un === 'm³' ? num(r.qty, 1) : int(r.qty)} ${r.un}${r.norma ? ` | Norma: ${r.norma}` : ''}${r.note && !short ? ` (${r.note})` : ''} | Preço unit.: ${blank} | Total: ${blank}`);
    }
    lines.push(`Subtotal ${g}: ${blank}`, '', `TOTAL GERAL: ${blank}`);
    return (short ? 'Cotação para a lista de materiais gerada no portal (preencha o preço unitário e o total de cada item):\n\n' : '') + lines.join('\n') +
      '\n\nLista orientativa gerada em pipesystem.com.br. Não substitui o projeto hidráulico.';
  }
  // Pedido de cotação: o e-mail (mailto) só aceita texto puro, então a tabela é montada em texto, colunas com "|"
  function quoteTable(lines, qty) {
    const W = Math.max(...last.rows.map(r => r.item.length)), P = 16, NW = Math.max(5, ...last.rows.map(r => (r.norma || '').length));
    const cols = (n, mat, q, un, nr, pu, tot) => `${n.padStart(3)} | ${mat.padEnd(W)} | ${q.padStart(6)} | ${un.padEnd(3)} | ${nr.padEnd(NW)} | ${pu.padEnd(P)} | ${tot}`.trimEnd();
    const rule = `${'-'.repeat(3)}-+-${'-'.repeat(W)}-+-${'-'.repeat(6)}-+-${'-'.repeat(3)}-+-${'-'.repeat(P)}-+-${'-'.repeat(P)}`;
    const out = ['Cotação para a lista de materiais gerada no portal.', 'Preencha o preço unitário e o total de cada item e devolva este e-mail.', '', ...lines,
      cols('Nº', 'Material', 'Qtd.', 'Un.', 'Norma', 'Preço unit. (R$)', 'Total (R$)'), rule];
    let g = '', i = 0;
    const sub = grp => out.push(cols('', `Subtotal — ${grp}`, '', '', '', '', ''), rule);
    for (const r of last.rows) {
      if (r.group !== g) { if (g) sub(g); out.push(`>>> ${(g = r.group).toUpperCase()}`); }
      out.push(cols(String(++i), r.item, qty(r), r.un, r.norma || '—', '', ''));
    }
    sub(g);
    out.push(cols('', 'TOTAL GERAL', '', '', '', '', ''), '', 'Lista orientativa gerada em pipesystem.com.br. Não substitui o projeto hidráulico.');
    return out.join('\n');
  }
  let shown = false;
  const live = () => { if (shown) render(); };
  form.addEventListener('submit', e => {
    e.preventDefault(); shown = true; render();
    $('lmatOut').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  form.addEventListener('input', live);
  form.addEventListener('change', live);

  $('lmCopy').addEventListener('click', async e => {
    try { await navigator.clipboard.writeText(asText(false)); e.target.textContent = 'Copiado ✓'; }
    catch { e.target.textContent = 'Não foi possível copiar'; }
    setTimeout(() => { e.target.textContent = 'Copiar'; }, 2000);
  });
  // ---------- Planilha Excel (.xlsx) com preço unitário e totais ----------
  // ZIP com compressão deflate (como o Excel grava) + SpreadsheetML com propriedades do documento; fórmulas em inglês,
  // válidas em qualquer idioma do Excel. Um .xlsx "fora do padrão" (sem compressão, sem data, sem docProps) era
  // marcado como suspeito por antivírus ao ser baixado.
  const crcTable = Array.from({ length: 256 }, (_, n) => { for (let k = 0; k < 8; k++) n = n & 1 ? 0xEDB88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
  const crc32 = b => { let c = 0xFFFFFFFF; for (const x of b) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
  const deflate = async d => typeof CompressionStream === 'undefined' ? null
    : new Uint8Array(await new Response(new Blob([d]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());
  async function zip(files) {
    const enc = new TextEncoder(), parts = [], dir = [];
    const now = new Date();
    const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    let off = 0;
    for (const [name, text] of files) {
      const n = enc.encode(name), raw = enc.encode(text), crc = crc32(raw);
      const z = await deflate(raw).catch(() => null), d = z || raw, method = z ? 8 : 0;
      const h = new DataView(new ArrayBuffer(30));
      [[0, 0x04034b50, 4], [4, 20, 2], [6, 0x0800, 2], [8, method, 2], [10, dosTime, 2], [12, dosDate, 2], [14, crc, 4], [18, d.length, 4], [22, raw.length, 4], [26, n.length, 2]]
        .forEach(([o, v, s]) => s === 4 ? h.setUint32(o, v, true) : h.setUint16(o, v, true));
      const c = new DataView(new ArrayBuffer(46));
      [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [8, 0x0800, 2], [10, method, 2], [12, dosTime, 2], [14, dosDate, 2], [16, crc, 4], [20, d.length, 4], [24, raw.length, 4], [28, n.length, 2], [42, off, 4]]
        .forEach(([o, v, s]) => s === 4 ? c.setUint32(o, v, true) : c.setUint16(o, v, true));
      parts.push(h, n, d); dir.push(c, n); off += 30 + n.length + d.length;
    }
    const size = dir.reduce((s, p) => s + p.byteLength, 0), e = new DataView(new ArrayBuffer(22));
    [[0, 0x06054b50, 4], [8, files.length, 2], [10, files.length, 2], [12, size, 4], [16, off, 4]]
      .forEach(([o, v, s]) => s === 4 ? e.setUint32(o, v, true) : e.setUint16(o, v, true));
    return new Blob([...parts, ...dir, e], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
  const xe = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  // sin (opcional): preços SINAPI do estado escolhido → preenche o preço e acrescenta as colunas de fonte
  function xlsx(sin, data = last, title = $('lmOutTitle').textContent) {
    // estilos: 1 título, 2 cabeçalho, 3 preço (a preencher), 4 moeda, 5 grupo, 6 total, 7 nota
    const rows = [], cell = (ref, v, st = 0) => v === '' ? `<c r="${ref}" s="${st}"/>` : typeof v === 'number' ? `<c r="${ref}" s="${st}"><v>${v}</v></c>`
      : v && v.f ? `<c r="${ref}" s="${st}"><f>${xe(v.f)}</f></c>` : `<c r="${ref}" s="${st}" t="inlineStr"><is><t xml:space="preserve">${xe(v ?? '')}</t></is></c>`;
    const row = (r, cells) => rows.push(`<row r="${r}">${cells.map(([c, v, st]) => cell(c + r, v, st)).join('')}</row>`);
    row(1, [['A', 'Dimensionamento Inteligente PipeSystem — ' + title + (sin ? ` — preços SINAPI ${SINAPI_PRECOS.ref}, ${sin.uf}` : ''), 1]]);
    row(2, [['A', sin ? `Preços de referência de material do SINAPI (Caixa), ${SINAPI_PRECOS.ref}, sem desoneração, ${UF_NOMES[sin.uf]}. Sem mão de obra, BDI e frete, salvo indicação. Itens "sem referência" ficam em branco: preencha com cotação.`
      : 'Lista orientativa. Preencha a coluna "Preço unitário": os totais por item, por grupo e o total geral são calculados automaticamente.', 7]]);
    const cols = sin ? 'ABCDEFGHIJ' : 'ABCDEFGH';
    row(4, ['Grupo', 'Material', 'Qtd.', 'Un.', 'Preço unitário (R$)', 'Total (R$)', 'Norma', 'Observação', 'Fonte do preço', 'Link para conferência'].slice(0, cols.length).map((t, i) => [cols[i], t, 2]));
    let r = 5;
    const first = r;
    for (const it of data.rows) {
      const p = sin && sin.prices.get(it);
      row(r, [['A', it.group], ['B', it.item], ['C', it.qty], ['D', it.un], ['E', p ? p.p : '', 3], ['F', { f: `IF(E${r}="","",C${r}*E${r})` }, 4], ['G', it.norma || ''], ['H', it.note],
        ...(sin ? [['I', p ? p.fonte : 'Sem referência SINAPI — cotar com fornecedores'], ['J', p ? p.url : '']] : [])]);
      r++;
    }
    const lastR = r - 1;
    r++;
    row(r++, [['A', 'Subtotais por grupo', 5], ['B', '', 5], ['C', '', 5], ['D', '', 5], ['E', '', 5], ['F', '', 5], ['G', '', 5]]);
    for (const g of [...new Set(data.rows.map(x => x.group))])
      row(r++, [['B', g], ['F', { f: `SUMIF($A$${first}:$A$${lastR},"${g.replace(/"/g, '""')}",$F$${first}:$F$${lastR})` }, 4]]);
    r++;
    row(r, [['B', 'TOTAL GERAL', 6], ['F', { f: `SUM(F${first}:F${lastR})` }, 6]]);
    row(r + 2, [['A', 'Gerado em pipesystem.com.br. Não substitui o projeto hidráulico.', 7]]);
    const widths = [30, 62, 9, 6, 18, 18, 24, 48, 80, 60].slice(0, cols.length);
    const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
      `<sheetViews><sheetView workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>` +
      `<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>` +
      `<sheetData>${rows.join('')}</sheetData><autoFilter ref="A4:${cols.at(-1)}${lastR}"/></worksheet>`;
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
      `<numFmts count="1"><numFmt numFmtId="164" formatCode="&quot;R$&quot; #,##0.00"/></numFmts>` +
      `<fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="14"/><color rgb="FFF2A03D"/><name val="Calibri"/></font>` +
      `<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font><font><i/><sz val="10"/><color rgb="FF5B6B80"/><name val="Calibri"/></font></fonts>` +
      `<fills count="5"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>` +
      `<fill><patternFill patternType="solid"><fgColor rgb="FF0A2240"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFFFF4D6"/></patternFill></fill>` +
      `<fill><patternFill patternType="solid"><fgColor rgb="FFDDF5F8"/></patternFill></fill></fills>` +
      `<borders count="2"><border/><border><left style="thin"><color rgb="FFBFBFBF"/></left><right style="thin"><color rgb="FFBFBFBF"/></right><top style="thin"><color rgb="FFBFBFBF"/></top><bottom style="thin"><color rgb="FFBFBFBF"/></bottom></border></borders>` +
      `<cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="8"><xf/>` +
      `<xf fontId="1" applyFont="1"/><xf fontId="2" fillId="2" applyFont="1" applyFill="1"/>` +
      `<xf numFmtId="164" fillId="3" borderId="1" applyNumberFormat="1" applyFill="1" applyBorder="1"><protection locked="0"/></xf>` +
      `<xf numFmtId="164" applyNumberFormat="1"/><xf fontId="2" fillId="2" applyFont="1" applyFill="1"/>` +
      `<xf numFmtId="164" fontId="2" fillId="2" applyNumberFormat="1" applyFont="1" applyFill="1"/><xf fontId="3" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
    const iso = new Date().toISOString().replace(/\.\d+Z$/, 'Z');
    return zip([
      ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`],
      ['_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`],
      ['docProps/core.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xe('Lista de materiais — ' + title)}</dc:title><dc:creator>PipeSystem</dc:creator><cp:lastModifiedBy>PipeSystem</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${iso}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${iso}</dcterms:modified></cp:coreProperties>`],
      ['docProps/app.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>PipeSystem</Application><Company>PipeSystem</Company><DocSecurity>0</DocSecurity></Properties>`],
      ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Cotação" sheetId="1" r:id="rId1"/></sheets><calcPr fullCalcOnLoad="1"/></workbook>`],
      ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
      ['xl/worksheets/sheet1.xml', sheet],
      ['xl/styles.xml', styles],
    ]);
  }
  // a planilha é gerada de forma assíncrona (compressão): baixa quando fica pronta
  async function saveFile(blob, name) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(await blob);
    a.download = name;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  const downloadXlsx = () => saveFile(xlsx(), 'dimensionamento-inteligente-pipesystem.xlsx');
  $('lmCsv').addEventListener('click', downloadXlsx);

  // ---------- Preços SINAPI por estado ----------
  // Regras em sinapi-regras.js (material → insumo) e preços em sinapi-precos.js (gerado de 1 em 1 mês com scripts/sinapi.mjs).
  const UF_NOMES = { AC: 'Acre', AL: 'Alagoas', AM: 'Amazonas', AP: 'Amapá', BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
    GO: 'Goiás', MA: 'Maranhão', MG: 'Minas Gerais', MS: 'Mato Grosso do Sul', MT: 'Mato Grosso', PA: 'Pará', PB: 'Paraíba', PE: 'Pernambuco',
    PI: 'Piauí', PR: 'Paraná', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RO: 'Rondônia', RR: 'Roraima', RS: 'Rio Grande do Sul',
    SC: 'Santa Catarina', SE: 'Sergipe', SP: 'São Paulo', TO: 'Tocantins' };
  const HAS_SINAPI = typeof SINAPI_PRECOS !== 'undefined' && typeof SINAPI_REGRAS !== 'undefined';
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  // preço de um insumo no estado; sem preço lá → mediana dos estados que têm preço
  function insumo(code, ui) {
    const it = SINAPI_PRECOS.ins[code]; if (!it) return null;
    const p = it[2 + ui];
    if (p != null) return { p, med: false };
    const all = it.slice(2).filter(x => x != null).sort((a, b) => a - b);
    const n = all.length, mid = n >> 1;
    return n ? { p: n % 2 ? all[mid] : (all[mid - 1] + all[mid]) / 2, med: true } : null;
  }
  const fixed = (w, nota) => ({ p: w.v, fonte: w.fonte + (nota ? `. ${nota}` : '') + ' (valor único para todos os estados)', url: w.url || '' });
  function resolve(spec, m, ui, uf) {
    if (typeof spec === 'string') spec = { c: spec };
    if (spec.zero) return { p: 0, fonte: `Sem custo de material: ${spec.zero}`, url: '' };
    if (spec.v != null) return fixed(spec);
    if (spec.by) {
      const key = (spec.key || (x => x))(m[spec.g || 1] || ''), sub = spec.by[key];
      const r = sub ? resolve(typeof sub === 'string' ? { c: sub, nota: spec.nota } : { nota: spec.nota, ...sub }, m, ui, uf) : null;
      return r || (spec.fbBy?.[key] ? fixed(spec.fbBy[key]) : spec.fb ? fixed(spec.fb) : null);
    }
    const codes = [].concat(spec.c || spec.s), vals = codes.map(c => insumo(c, ui));
    if (vals.some(v => !v)) return spec.fb ? fixed(spec.fb, spec.nota) : null;
    let p = vals.reduce((s, v) => s + v.p, 0);
    if (!spec.s) p /= vals.length;
    p = p * (spec.f || 1) + (spec.mais ? spec.mais.v : 0);
    const med = vals.some(v => v.med);
    const fonte = `SINAPI ${SINAPI_PRECOS.ref} — ${uf}, ${codes.length > 1 ? (spec.s ? 'soma dos insumos ' : 'média dos insumos ') : 'insumo '}${codes.join(', ')}` +
      (med ? ` (sem preço em ${uf}: mediana dos estados com preço)` : '') + (spec.nota ? `. ${spec.nota}` : '') + (spec.mais ? ` + ${spec.mais.fonte}` : '');
    return { p: Math.round(p * 100) / 100, fonte, url: SINAPI_PRECOS.fonte + (spec.mais ? ' ; ' + spec.mais.url : ''), med };
  }
  function priceOf(name, uf) {
    const ui = SINAPI_PRECOS.ufs.indexOf(uf);
    for (const [re, spec] of SINAPI_REGRAS) {
      const m = name.match(re);
      if (m) return resolve(spec, m, ui, uf);
    }
    return null;
  }
  function priceList(uf, rows = last.rows) {
    const prices = new Map();
    for (const it of rows) { const r = priceOf(it.item, uf); if (r) prices.set(it, r); }
    return prices;
  }
  function renderSinapi() {
    const box = $('lmSinapi'), uf = $('lmUf').value;
    if (!HAS_SINAPI) { box.hidden = true; return; }
    box.hidden = false;
    const out = $('lmSinRes');
    if (!uf || !last) { out.innerHTML = ''; $('lmSinXlsx').hidden = true; return; }
    const prices = priceList(uf), groups = new Map();
    let total = 0, semRef = 0, web = 0;
    for (const it of last.rows) {
      const g = groups.get(it.group) || { v: 0, n: 0, sem: 0 };
      const p = prices.get(it);
      if (p) { g.v += p.p * it.qty; total += p.p * it.qty; if (!/^SINAPI|^Sem custo/.test(p.fonte)) web++; } else { g.sem++; semRef++; }
      g.n++; groups.set(it.group, g);
    }
    out.innerHTML = `<table class="table lmat__sintab"><thead><tr><th>Grupo</th><th class="num">Valor (R$)</th><th class="num">%</th></tr></thead><tbody>` +
      [...groups].map(([g, x]) => `<tr><td>${esc(g)}${x.sem ? ` <small>(${x.sem} sem referência)</small>` : ''}</td><td class="num">${brl(x.v)}</td><td class="num">${total ? num(x.v / total * 100, 1) : '0'}%</td></tr>`).join('') +
      `</tbody><tfoot><tr><th>Total de material — ${esc(UF_NOMES[uf])}</th><th class="num">${brl(total)}</th><th class="num">100%</th></tr></tfoot></table>` +
      `<p class="hint">${prices.size} de ${last.rows.length} itens com preço: SINAPI ${SINAPI_PRECOS.ref} (Caixa, sem desoneração, capital do estado)` +
      (web ? `, e ${web} com preço pesquisado na internet` : '') + '.' +
      (semRef ? ` <b>${semRef} ${semRef > 1 ? 'itens ficam' : 'item fica'} sem referência</b> e fora do total: cote com fornecedores.` : '') +
      ' Só material: sem mão de obra, BDI e frete.</p>';
    $('lmSinXlsx').hidden = false;
    $('lmSinXlsx').textContent = `Baixar planilha com preços SINAPI — ${uf}`;
  }
  if (HAS_SINAPI) {
    $('lmUf').innerHTML = '<option value="">Escolha o estado da obra…</option>' +
      SINAPI_PRECOS.ufs.map(u => `<option value="${u}">${u} — ${UF_NOMES[u] || u}</option>`).join('');
    try { const s = localStorage.getItem('lmUf'); if (s && SINAPI_PRECOS.ufs.includes(s)) $('lmUf').value = s; } catch {}
    $('lmSinRef').textContent = `SINAPI ${SINAPI_PRECOS.ref}`;
    $('lmUf').addEventListener('change', () => { try { localStorage.setItem('lmUf', $('lmUf').value); } catch {} renderSinapi(); });
    $('lmSinXlsx').addEventListener('click', () => {
      const uf = $('lmUf').value; if (!uf || !last) return;
      saveFile(xlsx({ uf, prices: priceList(uf) }), `dimensionamento-inteligente-pipesystem-sinapi-${uf}.xlsx`);
    });
  }
  window.lmatXlsx = () => last && downloadXlsx();   // usado pelo formulário de contato quando a lista não cabe no e-mail
  // usados pelo validador de listas exportadas (validador.js)
  window.lmatApi = {
    last: () => last,
    price: (name, uf) => HAS_SINAPI ? priceOf(name, uf) : null,
    xlsx: (data, sin, title) => xlsx(sin, data, title),   // devolve uma Promise<Blob>
    save: saveFile,
    ufs: () => HAS_SINAPI ? SINAPI_PRECOS.ufs.map(u => [u, UF_NOMES[u] || u]) : [],
    ref: () => HAS_SINAPI ? SINAPI_PRECOS.ref : '',
  };
  $('lmPrint').addEventListener('click', () => {
    document.documentElement.classList.add('print-lmat');
    window.print();
    setTimeout(() => document.documentElement.classList.remove('print-lmat'), 500);
  });

  syncTipo();
})();
