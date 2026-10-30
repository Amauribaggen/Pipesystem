// Calculadoras de projeto (seção Dimensionamento): esgoto (NBR 8160), calhas e condutores (NBR 10844),
// gás (NBR 15526), bombas (altura manométrica e NPSH), comprimentos equivalentes, golpe de aríete, aquecimento,
// velocidade, Darcy-Weisbach, dilatação, reservatório (NBR 5626), vaso de expansão, água de chuva (NBR 15527),
// tanque séptico (NBR 7229) e espessura de parede (ASME B31.3).
// Resultados indicativos: o projeto final segue as normas completas e o cálculo do projetista.
(() => {
  const $ = id => document.getElementById(id);
  if (!$('calcEsg')) return;
  const n = (x, d = 2) => Number(x).toLocaleString('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: d });
  const v = id => parseFloat(($(id) || {}).value) || 0;
  const set = (id, t) => { $(id).textContent = t; };
  const hint = (id, t, warn) => { const el = $(id); el.textContent = t; el.classList.toggle('warn', !!warn); };
  const on = (box, fn) => { $(box).addEventListener('input', fn); $(box).addEventListener('change', fn); fn(); };
  // listas de quantidades (aparelhos, conexões): nome + campo numérico
  const qtyList = (box, items, prefix) => {
    $(box).innerHTML = items.map(([key, label], i) =>
      `<label class="calc__row"><span>${label}</span><input type="number" min="0" step="1" value="${items[i][2] || 0}" id="${prefix}${key}" inputmode="numeric"></label>`).join('');
  };

  // ---------- 1. Esgoto sanitário por unidades Hunter (NBR 8160) ----------
  // [chave, aparelho, quantidade inicial, UHC, DN mínimo do ramal de descarga]
  const APAR = [
    ['bacia', 'Bacia sanitária', 1, 6, 100], ['lav', 'Lavatório residencial', 1, 1, 40], ['chu', 'Chuveiro residencial', 1, 2, 40],
    ['ban', 'Banheira', 0, 2, 40], ['bide', 'Bidê', 0, 1, 40], ['pia', 'Pia de cozinha residencial', 1, 3, 50],
    ['mll', 'Máquina de lavar louças', 0, 2, 50], ['tanque', 'Tanque de lavar roupas', 1, 3, 40], ['mlr', 'Máquina de lavar roupas', 1, 3, 50],
    ['micv', 'Mictório com válvula de descarga', 0, 6, 75], ['micc', 'Mictório com caixa de descarga', 0, 5, 50],
    ['lavg', 'Lavatório de uso geral', 0, 2, 40], ['chuc', 'Chuveiro coletivo', 0, 4, 40], ['beb', 'Bebedouro', 0, 0.5, 40],
  ];
  qtyList('esgAparelhos', APAR, 'esg_');
  const RAMAL = [[40, 3], [50, 6], [75, 20], [100, 160]];                       // ramais de esgoto: DN, UHC máximo
  const QUEDA = [[40, 4, 2, 8], [50, 10, 6, 24], [75, 30, 16, 70], [100, 240, 90, 500], [150, 960, 350, 1900],
    [200, 2200, 600, 3600], [250, 3800, 1000, 5600], [300, 6000, 1500, 8400]];   // DN, até 3 pav., >3 pav. por pavimento, >3 pav. no tubo todo
  const COLETOR = [[100, [null, 180, 216, 250]], [150, [null, 700, 840, 1000]], [200, [1400, 1600, 1920, 2300]], [250, [2500, 2900, 3500, 4200]],
    [300, [3900, 4600, 5600, 6700]], [400, [7000, 8300, 10000, 12000]]];          // DN, UHC máx. a 0,5 / 1 / 2 / 4 %
  function calcEsg() {
    let uhc = 0, dnMin = 40, temBacia = false;
    for (const [k, , , u, dn] of APAR) { const q = Math.max(0, Math.round(v('esg_' + k))); if (q) { uhc += q * u; dnMin = Math.max(dnMin, dn); if (k === 'bacia') temBacia = true; } }
    const pav = Math.max(1, Math.round(v('esgPav'))), decl = +$('esgDecl').value, tot = uhc * pav;
    set('esgUhc', `${n(uhc, 1)} UHC`);
    if (!uhc) { set('esgRamal', '—'); set('esgQueda', '—'); set('esgCol', '—'); return hint('esgHint', 'Informe os aparelhos de um pavimento (ou do conjunto).'); }
    const ramal = (RAMAL.find(([d, m]) => uhc <= m && d >= dnMin) || [null])[0];
    set('esgRamal', ramal ? `DN ${ramal}` : 'acima de DN 100: divida em mais ramais');
    const queda = QUEDA.find(([d, a, b, c]) => d >= (temBacia ? 100 : 40) && (pav <= 3 ? tot <= a : uhc <= b && tot <= c));
    set('esgQueda', queda ? `DN ${queda[0]}` : 'acima de DN 300');
    const col = COLETOR.find(([d, cap]) => cap[decl] && tot <= cap[decl]);
    set('esgCol', col ? `DN ${col[0]} (${n(tot, 0)} UHC)` : 'acima de DN 400');
    hint('esgHint', `Total no tubo de queda: ${n(tot, 1)} UHC em ${pav} pavimento${pav > 1 ? 's' : ''}. ` +
      (temBacia ? 'Com bacia sanitária, ramal e tubo de queda têm no mínimo DN 100. ' : '') +
      'Coletor predial com DN mínimo 100. Dimensione também a ventilação pela NBR 8160.');
  }
  on('calcEsg', calcEsg);

  // ---------- 2. Calhas e condutores (NBR 10844) ----------
  const COND_V = [[75, 5.8], [100, 12.1], [125, 22.7], [150, 35.5], [200, 76.2]];  // condutor vertical: DN, L/s (capacidade de referência)
  const COND_H = [[50, [32, 45, 64, 90]], [75, [95, 133, 188, 267]], [100, [204, 287, 405, 575]], [125, [370, 521, 735, 1040]], [150, [602, 847, 1190, 1690]],
    [200, [1300, 1820, 2570, 3650]], [250, [2350, 3310, 4660, 6620]], [300, [3820, 5380, 7590, 10800]]];  // L/min, n = 0,011, a 0,5 / 1 / 2 / 4 %
  const manning = (S, P, nn, i) => 60000 * S / nn * Math.pow(S / P, 2 / 3) * Math.sqrt(i);   // L/min (NBR 10844)
  function calcCalha() {
    const a = v('calA'), b = v('calB'), h = v('calH'), I = v('calI'), nn = +$('calN').value, i = Math.max(0.005, v('calDecl') / 100);
    const nd = Math.max(1, Math.round(v('calNd'))), tipo = $('calTipo').value, dH = +$('calDeclH').value;
    $('calRet').hidden = tipo !== 'ret';
    const A = (a + h / 2) * b, Q = I * A / 60;   // área de contribuição (superfície inclinada) e vazão de projeto em L/min
    set('calArea', `${n(A, 1)} m²`); set('calQ', `${n(Q, 0)} L/min (${n(Q / 60, 1)} L/s)`);
    if (!(A > 0 && I > 0)) { set('calCalha', '—'); set('calCv', '—'); set('calCh', '—'); return; }
    if (tipo === 'semi') {
      const D = [100, 125, 150, 200, 250, 300].find(d => { const r = d / 2000; return manning(Math.PI * r * r / 2, Math.PI * r, nn, i) >= Q; });
      set('calCalha', D ? `Semicircular Ø ${D} mm` : 'acima de Ø 300 mm: mais descidas');
    } else {
      const L = v('calLarg') / 1000, Hc = v('calAlt') / 1000, y = Hc / 2;   // lâmina na metade da altura (borda livre)
      const cap = L > 0 && Hc > 0 ? manning(L * y, L + 2 * y, nn, i) : 0;
      set('calCalha', cap ? `${n(cap, 0)} L/min — ${cap >= Q ? 'atende' : 'NÃO atende'}` : '—');
    }
    const qd = Q / 60 / nd, cv = COND_V.find(([, c]) => c >= qd);
    set('calCv', cv ? `${nd} × DN ${cv[0]}` : 'aumente o nº de descidas');
    const ch = COND_H.find(([, cap]) => cap[dH] >= Q / nd);
    set('calCh', ch ? `DN ${ch[0]} por descida` : 'acima de DN 300');
    hint('calHint', `Vazão por descida: ${n(qd, 2)} L/s. Condutor vertical com diâmetro interno mínimo de 70 mm; confirme pelos ábacos da NBR 10844, que dependem da altura da lâmina na calha e do comprimento do condutor.`, !cv);
  }
  on('calcCalha', calcCalha);

  // ---------- 3. Dimensionamento de gás (NBR 15526) ----------
  const GAS_AP = [['fogao4', 'Fogão 4 bocas com forno (kW)', 1, 9], ['fogao6', 'Fogão 6 bocas com forno (kW)', 0, 12], ['cook', 'Cooktop 4 bocas (kW)', 0, 7],
    ['aq15', 'Aquecedor de passagem 15 L/min (kW)', 0, 26], ['aq20', 'Aquecedor de passagem 20 L/min (kW)', 1, 35], ['sec', 'Secadora de roupas (kW)', 0, 6], ['chur', 'Churrasqueira a gás (kW)', 0, 10]];
  $('gasAparelhos').innerHTML = GAS_AP.map(([k, label, q, kw]) =>
    `<div class="calc__row calc__row--2"><span>${label.replace(' (kW)', '')}</span><input type="number" min="0" step="1" value="${q}" id="gq_${k}" aria-label="Quantidade: ${label}"><input type="number" min="0" step="0.5" value="${kw}" id="gk_${k}" aria-label="Potência em kW: ${label}"></div>`).join('');
  const TUBOS_GAS = { cobre: [['15 mm', 13.6], ['22 mm', 20.2], ['28 mm', 26.2], ['35 mm', 32.8], ['42 mm', 39.8], ['54 mm', 51.6]],
    aco: [['1/2"', 15.8], ['3/4"', 21.0], ['1"', 26.6], ['1 1/4"', 35.1], ['1 1/2"', 40.9], ['2"', 52.5]] };
  const GASES = { gn: { pci: 8600, s: 0.6, p: 2.2 }, glp: { pci: 24000, s: 1.8, p: 2.8 } };   // PCI kcal/m³, densidade relativa, pressão de operação kPa
  const fator = C => C < 350 ? 100 : C < 9612 ? 100 / (1 + 0.001 * Math.pow(C - 349, 0.8712)) : C < 20000 ? 100 / (1 + 0.4705 * Math.pow(C - 1055, 0.19931)) : 23;
  function calcGas() {
    const g = GASES[$('gasTipo').value];
    let kw = 0;
    for (const [k] of GAS_AP) kw += Math.max(0, Math.round(v('gq_' + k))) * v('gk_' + k);
    const C = kw * 860 / 60, F = fator(C), Cad = C * F / 100, Q = Cad * 60 / g.pci;   // kcal/min, %, kcal/min, m³/h
    const L = v('gasL') * (1 + v('gasConex') / 100), dPmax = g.p * 1000 * v('gasPerda') / 100;   // m, Pa
    set('gasPot', `${n(kw, 1)} kW`); set('gasF', `${n(F, 0)} %`); set('gasQ', `${n(Q, 2)} m³/h`);
    if (!(Q > 0 && L > 0)) { set('gasD', '—'); set('gasDp', '—'); return hint('gasHint', 'Informe os aparelhos e o comprimento do trecho.'); }
    const res = TUBOS_GAS[$('gasMat').value].map(([nome, D]) => {
      const dp = 23200 * g.s * L * Math.pow(Q, 1.82) * Math.pow(D, -4.82) * 100;   // Renouard (baixa pressão): Pa
      const vel = Q / 3600 / (Math.PI * Math.pow(D / 1000, 2) / 4);
      return { nome, dp, vel };
    });
    const ok = res.find(r => r.dp <= dPmax && r.vel <= 20);
    set('gasD', ok ? ok.nome : 'acima do maior diâmetro');
    set('gasDp', ok ? `${n(ok.dp, 0)} Pa · ${n(ok.vel, 1)} m/s` : '—');
    hint('gasHint', `Potência adotada ${n(Cad * 60 / 860, 1)} kW (fator de simultaneidade da NBR 15526). Perda máxima admitida: ${n(dPmax, 0)} Pa (${n(v('gasPerda'), 0)}% de ${n(g.p, 1)} kPa). Confira a potência na placa de cada aparelho.`, !ok);
  }
  on('calcGas', calcGas);

  // ---------- 4. Bombas: altura manométrica, potência e NPSH ----------
  const PV = [[0, 0.06], [10, 0.13], [20, 0.24], [30, 0.43], [40, 0.75], [50, 1.26], [60, 2.03], [70, 3.17], [80, 4.83], [90, 7.15]];   // °C, pressão de vapor em mca
  const pv = t => { for (let k = 1; k < PV.length; k++) if (t <= PV[k][0]) { const [t0, p0] = PV[k - 1], [t1, p1] = PV[k]; return p0 + (p1 - p0) * (t - t0) / (t1 - t0); } return PV[PV.length - 1][1]; };
  const hwJ = (q, d, C) => 10.67 * Math.pow(q, 1.852) / (Math.pow(C, 1.852) * Math.pow(d, 4.87));   // m/m, q em m³/s, d em m
  const MOTORES = [0.25, 0.33, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 6, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75, 100, 125, 150, 200];
  function calcBomba() {
    const q = v('bbQ') / 3600, C = +$('bbC').value, ds = v('bbDs') / 1000, dr = v('bbDr') / 1000;
    const Hs = parseFloat($('bbHs').value) || 0, Hr = v('bbHr'), Ls = v('bbLs'), Lr = v('bbLr'), Pres = v('bbPres'), eta = Math.max(0.1, v('bbEta') / 100);
    if (!(q > 0 && ds > 0 && dr > 0)) { ['bbHman', 'bbPot', 'bbNpsh'].forEach(id => set(id, '—')); return; }
    const hfs = hwJ(q, ds, C) * Ls, hfr = hwJ(q, dr, C) * Lr, H = Hs + Hr + hfs + hfr + Pres;
    const cv = 1000 * q * H / (75 * eta), motor = MOTORES.find(m => m >= cv * 1.15);
    const patm = 10.33 * Math.pow(1 - 2.2558e-5 * v('bbAlt'), 5.2559), npshd = patm - Hs - hfs - pv(v('bbT')), npshr = v('bbNpshr');
    const vs = q / (Math.PI * ds * ds / 4), vr = q / (Math.PI * dr * dr / 4);
    set('bbHman', `${n(H, 1)} mca`);
    set('bbPot', `${n(cv, 2)} cv → motor ${motor ? n(motor, motor < 1 ? 2 : 1) + ' cv' : '> 200 cv'}`);
    set('bbNpsh', `${n(npshd, 1)} m disponível`);
    const avisos = [`Perdas: sucção ${n(hfs, 2)} m, recalque ${n(hfr, 2)} m. Velocidades: sucção ${n(vs, 2)} m/s, recalque ${n(vr, 2)} m/s.`];
    let warn = false;
    if (npshr && npshd < npshr + 0.5) { avisos.push(`Risco de cavitação: o NPSH disponível deve superar o requerido (${n(npshr, 1)} m) com folga de pelo menos 0,5 m.`); warn = true; }
    if (vs > 1.5) { avisos.push('Velocidade na sucção acima de 1,5 m/s: aumente o diâmetro da sucção.'); warn = true; }
    if (vr > 3) { avisos.push('Velocidade no recalque acima de 3 m/s.'); warn = true; }
    avisos.push('Motor com 15% de folga sobre a potência calculada.');
    hint('bbHint', avisos.join(' '), warn);
  }
  on('calcBomba', calcBomba);

  // ---------- 5. Comprimentos equivalentes (perdas localizadas) ----------
  // Tubos lisos (PVC e cobre), metros de tubulação equivalente; valores de referência de catálogo
  const DNS = [['20 mm (1/2")', 17.0], ['25 mm (3/4")', 21.6], ['32 mm (1")', 27.8], ['40 mm (1 1/4")', 35.2], ['50 mm (1 1/2")', 44.0], ['60 mm (2")', 53.4],
    ['75 mm (2 1/2")', 66.6], ['85 mm (3")', 75.6], ['110 mm (4")', 97.8]];
  const PECAS = [
    ['j90', 'Joelho 90°', [1.1, 1.2, 1.5, 2.0, 3.2, 3.4, 3.7, 3.9, 4.3]], ['j45', 'Joelho 45°', [0.4, 0.5, 0.7, 1.0, 1.3, 1.5, 1.7, 1.8, 1.9]],
    ['c90', 'Curva 90°', [0.4, 0.5, 0.6, 0.7, 1.2, 1.3, 1.4, 1.5, 1.6]], ['c45', 'Curva 45°', [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]],
    ['tpd', 'Tê — passagem direta', [0.7, 0.8, 0.9, 1.5, 2.2, 2.3, 2.4, 2.5, 2.6]], ['tsl', 'Tê — saída lateral', [2.3, 2.4, 3.1, 4.6, 7.3, 7.6, 7.8, 8.0, 8.3]],
    ['ent', 'Entrada normal', [0.3, 0.4, 0.5, 0.6, 1.0, 1.5, 1.6, 2.0, 2.2]], ['entb', 'Entrada de borda', [0.9, 1.0, 1.2, 1.8, 2.3, 2.8, 3.3, 3.7, 4.0]],
    ['sai', 'Saída de canalização', [0.8, 0.9, 1.3, 1.4, 3.2, 3.3, 3.5, 3.7, 3.9]], ['vpe', 'Válvula de pé com crivo', [8.1, 9.5, 13.3, 15.5, 18.3, 23.7, 25.0, 26.8, 28.6]],
    ['vrl', 'Válvula de retenção leve', [2.5, 2.7, 3.8, 4.9, 6.8, 7.1, 8.2, 9.3, 10.4]], ['vrp', 'Válvula de retenção pesada', [3.6, 4.1, 5.8, 7.4, 9.1, 10.8, 12.5, 14.2, 16.0]],
    ['rgl', 'Registro de globo aberto', [11.1, 11.4, 15.0, 22.0, 35.8, 37.9, 38.0, 40.0, 42.3]], ['rga', 'Registro de gaveta aberto', [0.1, 0.2, 0.3, 0.4, 0.7, 0.8, 0.9, 0.9, 1.0]],
    ['ran', 'Registro de ângulo aberto', [5.9, 6.1, 8.4, 10.5, 17.0, 18.5, 19.0, 20.0, 22.1]],
  ];
  $('eqDn').innerHTML = DNS.map(([nome], i) => `<option value="${i}"${i === 1 ? ' selected' : ''}>${nome}</option>`).join('');
  qtyList('eqPecas', PECAS.map(([k, nome]) => [k, nome, 0]), 'eq_');
  function calcEq() {
    const i = +$('eqDn').value, Lr = v('eqL'), Qls = v('eqQ');
    let Le = 0;
    for (const [k, , vals] of PECAS) Le += Math.max(0, Math.round(v('eq_' + k))) * vals[i];
    set('eqLe', `${n(Le, 1)} m`); set('eqLt', `${n(Le + Lr, 1)} m`);
    if (Qls > 0) {
      const d = DNS[i][1] / 1000, J = hwJ(Qls / 1000, d, 150), vel = Qls / 1000 / (Math.PI * d * d / 4);
      set('eqHf', `${n(J * (Le + Lr), 2)} mca`);
      hint('eqHint', `Hazen-Williams com C = 150 e diâmetro interno do PVC soldável (${n(DNS[i][1], 1)} mm). Velocidade: ${n(vel, 2)} m/s.`, vel > 3);
    } else { set('eqHf', '—'); hint('eqHint', 'Valores para tubos lisos (PVC e cobre). Para aço e ferro, os comprimentos equivalentes são maiores. Informe a vazão para calcular a perda de carga.'); }
  }
  on('calcEq', calcEq);

  // ---------- 6. Golpe de aríete (Joukowsky / Michaud) ----------
  const E = { aco: 2.07e11, dutil: 1.7e11, cobre: 1.1e11, concreto: 3.0e10, pvc: 3.0e9, pead: 0.95e9, ppr: 0.8e9 };   // módulo de elasticidade, Pa
  function calcGolpe() {
    const D = v('gaD') / 1000, e = v('gaE') / 1000, L = v('gaL'), Q = v('gaQ') / 1000, T = v('gaT'), Hest = v('gaH'), PN = v('gaPN');
    if (!(D > 0 && e > 0 && L > 0 && Q > 0)) { ['gaA', 'gaDh', 'gaPmax'].forEach(id => set(id, '—')); return; }
    const K = 2.2e9, a = Math.sqrt(K / 1000) / Math.sqrt(1 + K * D / (E[$('gaMat').value] * e));
    const V = Q / (Math.PI * D * D / 4), Tc = 2 * L / a, rapida = T <= Tc;
    const dH = rapida ? a * V / 9.81 : 2 * L * V / (9.81 * T);
    set('gaA', `${n(a, 0)} m/s`);
    set('gaDh', `${n(dH, 1)} mca (${rapida ? 'manobra rápida' : 'manobra lenta'})`);
    set('gaPmax', `${n(Hest + dH, 1)} mca`);
    const avisos = [`Velocidade ${n(V, 2)} m/s. Período crítico 2L/a = ${n(Tc, 2)} s: fechamentos mais rápidos que isso produzem a sobrepressão máxima.`];
    let warn = rapida;
    if (Hest - dH < -8) { avisos.push(`Pressão mínima de ${n(Hest - dH, 1)} mca: risco de vácuo e separação da coluna. Preveja ventosas e proteção antigolpe.`); warn = true; }
    if (PN && Hest + dH > PN) { avisos.push(`A pressão máxima passa da classe da tubulação (${n(PN, 0)} mca).`); warn = true; }
    avisos.push('Em adutoras e recalques, confirme com análise de transientes (NBR 12215).');
    hint('gaHint', avisos.join(' '), warn);
  }
  on('calcGolpe', calcGolpe);

  // ---------- 7. Aquecedor de água: vazão simultânea, potência, aquecedor a gás e reservatório ----------
  // potência: Q (L/min) × 4,186 kJ/kg·°C × ΔT / 60 = kW. Aquecedor a gás: vazão de etiqueta com ΔT de 20 °C (como na Rinnai).
  const COMERCIAL = [100, 150, 200, 300, 400, 500, 600, 800, 1000, 1500, 2000];
  function calcAq() {
    const Q = v('aqDuchas') * v('aqVd') + v('aqTorn') * v('aqVt'), dT = v('aqTq') - v('aqTf');
    if (!(Q > 0 && dT > 0)) { ['aqQ', 'aqP', 'aqGas', 'aqV'].forEach(id => set(id, '—')); hint('aqHint', 'Informe ao menos um ponto e uma temperatura do banho maior que a da água fria.', true); return; }
    const kW = Q * 4.186 * dT / 60, etiq = Q * dT / 20;
    set('aqQ', `${n(Q, 1)} L/min`);
    set('aqP', `${n(kW, 1)} kW (${n(Q * 60 * dT, 0)} kcal/h)`);
    set('aqGas', `no mínimo ${n(Math.ceil(etiq), 0)} L/min`);
    const dia = v('aqPes') * v('aqCons'), res = COMERCIAL.find(x => x >= dia) || dia;
    set('aqV', `${n(dia, 0)} L/dia → ${n(res, 0)} L`);
    const kwDucha = v('aqVd') * 4.186 * dT / 60, qMax = 7.5 * 60 / (4.186 * dT);
    const avisos = [`A vazão de etiqueta dos aquecedores a gás vale para um aumento de 20 °C; com a água a ${n(v('aqTf'), 0)} °C e banho a ${n(v('aqTq'), 0)} °C o aumento é de ${n(dT, 0)} °C.`];
    avisos.push(kwDucha > 7.5 ? `Um chuveiro elétrico de 7,5 kW não aquece ${n(v('aqVd'), 1)} L/min a essa temperatura: a vazão cai para cerca de ${n(qMax, 1)} L/min.` : `Cada ducha pede ${n(kwDucha, 1)} kW: um chuveiro elétrico de 7,5 kW dá conta.`);
    avisos.push(`Solar: área de coletores estimada entre ${n(dia / 100, 1)} e ${n(dia / 80, 1)} m², conforme a região; o projeto segue a NBR 15569. Confira também nas calculadoras dos fabricantes, em Ferramentas gratuitas.`);
    hint('aqHint', avisos.join(' '), kwDucha > 7.5);
  }
  on('calcAq', calcAq);

  // ---------- 8. Aquecimento de ambiente: estimativa pela regra prática por volume ----------
  // 30, 40 ou 50 kcal/h por m³ (isolamento bom, médio ou ruim), ajustado pelo clima. 1 kcal/h = 1,163 W; 1 W = 3,412 BTU/h.
  function calcAmb() {
    const vol = v('amA') * v('amH'), kcal = vol * v('amIso') * v('amClima'), W = kcal * 1.163;
    if (!(vol > 0)) { ['amP', 'amBtu', 'amPort', 'amCons'].forEach(id => set(id, '—')); return; }
    set('amP', `${n(W / 1000, 1)} kW (${n(kcal, 0)} kcal/h)`);
    set('amBtu', `${n(W * 3.412, 0)} BTU/h`);
    set('amPort', `${n(Math.ceil(W / 2000), 0)} aparelho(s)`);
    set('amCons', `${n(W / 1000, 1)} kW × cerca de ${n(W / 3000, 1)} kW`);
    hint('amHint', `Volume de ${n(vol, 1)} m³. Estimativa pela regra prática de potência por volume: serve para comparar opções, não substitui o cálculo de carga térmica. No ar-condicionado, escolha o modelo pela capacidade de aquecimento informada na etiqueta, que costuma ser diferente da de resfriamento. Lareiras e aquecedores a gás exigem chaminé e entrada de ar (NBR 13103).`, false);
  }
  on('calcAmb', calcAmb);

  // ---------- 9. Velocidade e diâmetro: Q = v × A ----------
  function calcVel() {
    const Q = v('velQ') * parseFloat($('velU').value) / 1000, D = v('velD') / 1000, vmax = v('velVmax');   // m³/s, m
    if (!(Q > 0 && D > 0 && vmax > 0)) { ['velV', 'velDmin', 'velQmax'].forEach(id => set(id, '—')); return; }
    const A = Math.PI * D * D / 4, vel = Q / A, Dmin = Math.sqrt(4 * Q / (Math.PI * vmax)) * 1000, Qmax = vmax * A * 1000;
    set('velV', `${n(vel, 2)} m/s`);
    set('velDmin', `${n(Dmin, 1)} mm`);
    set('velQmax', `${n(Qmax, 2)} L/s (${n(Qmax * 3.6, 1)} m³/h)`);
    hint('velHint', vel > vmax ? `A ${n(vel, 2)} m/s a velocidade passa do limite escolhido: aumente o diâmetro para pelo menos ${n(Dmin, 1)} mm internos. Velocidade alta causa ruído, golpe de aríete e desgaste.`
      : `Velocidade dentro do limite escolhido. Na água predial a NBR 5626 limita a 3 m/s; em recalque e sucção, velocidades menores reduzem a perda de carga e protegem a bomba.`, vel > vmax);
  }
  on('calcVel', calcVel);
  $('velApp').addEventListener('change', () => { $('velVmax').value = $('velApp').value; calcVel(); });

  // ---------- 10. Darcy-Weisbach com fator de atrito de Swamee-Jain (turbulento) ou 64/Re (laminar) ----------
  function calcDarcy() {
    const [nu, rho] = $('dwFl').value.split('|').map(Number), eps = parseFloat($('dwEps').value) / 1000;
    const Q = v('dwQ') / 1000, D = v('dwD') / 1000, L = v('dwL'), K = v('dwK');
    if (!(Q > 0 && D > 0)) { ['dwV', 'dwRe', 'dwF', 'dwH'].forEach(id => set(id, '—')); return; }
    const vel = Q / (Math.PI * D * D / 4), Re = vel * D / nu;
    const f = Re < 2300 ? 64 / Re : 0.25 / Math.pow(Math.log10(eps / (3.7 * D) + 5.74 / Math.pow(Re, 0.9)), 2);
    const hd = f * (L / D) * vel * vel / 19.62, hl = K * vel * vel / 19.62, h = hd + hl;
    set('dwV', `${n(vel, 2)} m/s`);
    set('dwRe', `${n(Re, 0)} (${Re < 2300 ? 'laminar' : Re < 4000 ? 'transição' : 'turbulento'})`);
    set('dwF', n(f, 4));
    set('dwH', `${n(h, 2)} m (${n(h * rho * 9.81 / 1000, 1)} kPa)`);
    hint('dwHint', `Na tubulação: ${n(hd, 2)} m (${n(L > 0 ? hd / L * 100 : 0, 2)} m por 100 m); nas peças: ${n(hl, 2)} m. ` +
      (Re >= 2300 && Re < 4000 ? 'Regime de transição: o resultado é incerto. ' : '') + 'Fator de atrito pela equação de Swamee-Jain (aproximação da de Colebrook). Rugosidades de tubos novos; tubos velhos e incrustados perdem mais.', Re >= 2300 && Re < 4000);
  }
  on('calcDarcy', calcDarcy);

  // ---------- 11. Dilatação térmica: ΔL = α × L × ΔT ----------
  function calcDil() {
    const a = parseFloat($('dlMat').value), L = v('dlL'), dT = v('dlTo') - v('dlTi');
    if (!(L > 0)) { ['dlDT', 'dlDL', 'dl10'].forEach(id => set(id, '—')); return; }
    const dL = a * L * Math.abs(dT);
    set('dlDT', `${n(dT, 0)} °C`);
    set('dlDL', `${n(dL, 1)} mm`);
    set('dl10', `${n(a * 10 * Math.abs(dT), 1)} mm`);
    hint('dlHint', dL > 10 ? `Dilatação de ${n(dL, 0)} mm: preveja liras, braços de dilatação ou juntas, com pontos fixos e guias. O comprimento do braço sai da tabela ou fórmula do fabricante do tubo.`
      : 'Dilatação pequena: costuma ser absorvida pelas mudanças de direção do traçado, desde que o tubo não fique preso entre dois pontos fixos.', dL > 10);
  }
  on('calcDil', calcDil);

  // ---------- 12. Reservatório: consumo diário × dias de reservação (NBR 5626) ----------
  const CAIXAS = [500, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000];
  const caixas = L => { if (L <= 0) return '—'; const c = CAIXAS.find(x => x >= L); return c ? `1 de ${n(c, 0)} L` : `${Math.ceil(L / 20000)} de 20.000 L`; };
  function calcRes() {
    const dia = v('rsN') * v('rsC'), tot = dia * v('rsDias'), inf = tot * v('rsInf') / 100, sup = tot - inf, rti = v('rsRti');
    if (!(dia > 0)) { ['rsDia', 'rsTot', 'rsVinf', 'rsVsup'].forEach(id => set(id, '—')); return; }
    set('rsDia', `${n(dia, 0)} L`);
    set('rsTot', `${n(tot, 0)} L`);
    set('rsVinf', `${n(inf, 0)} L · ${caixas(inf)}`);
    set('rsVsup', `${n(sup + rti, 0)} L${rti ? ' (com a reserva de incêndio)' : ''} · ${caixas(sup + rti)}`);
    hint('rsHint', 'Consumos por pessoa são valores usuais de referência da literatura técnica; use dados reais quando houver. A NBR 5626 pede reservação de pelo menos um dia de consumo; na prática usa-se de 1 a 2 dias, com cerca de 60% no inferior e 40% no superior. A reserva de incêndio segue a instrução técnica do Corpo de Bombeiros do estado.');
  }
  on('calcRes', calcRes);
  $('rsTipo').addEventListener('change', () => { $('rsC').value = $('rsTipo').value; calcRes(); });

  // ---------- 13. Vaso de expansão: Vn = e × V / (1 − Pi/Pf), pressões absolutas ----------
  // massa específica da água (kg/m³) por temperatura (°C), para o coeficiente de expansão
  const RHO = [[4, 1000], [10, 999.7], [20, 998.2], [30, 995.7], [40, 992.2], [50, 988.0], [60, 983.2], [70, 977.8], [80, 971.8], [90, 965.3], [95, 961.9]];
  const rho = t => { for (let i = 1; i < RHO.length; i++) if (t <= RHO[i][0]) { const [t0, r0] = RHO[i - 1], [t1, r1] = RHO[i]; return r0 + (r1 - r0) * (t - t0) / (t1 - t0); } return RHO[RHO.length - 1][1]; };
  const VASOS = [2, 5, 8, 12, 18, 24, 35, 50, 60, 80, 100, 150, 200, 300, 500];
  function calcVexp() {
    const V = v('veV'), tf = v('veTf'), tq = v('veTq'), Pi = v('vePi') + 1, Pf = v('vePs') - 0.5 + 1;
    if (!(V > 0 && tq > tf)) { ['veE', 'veVe', 'veVn', 'veCom'].forEach(id => set(id, '—')); hint('veHint', 'Informe o volume e uma temperatura quente maior que a fria.', true); return; }
    if (Pf <= Pi) { ['veVn', 'veCom'].forEach(id => set(id, '—')); hint('veHint', 'A válvula de segurança precisa abrir acima da pressão da rede (com folga de 0,5 bar). Se a rede tem pressão alta, use válvula redutora de pressão antes do aquecedor.', true); return; }
    const e = rho(tf) / rho(tq) - 1, Ve = e * V, Vn = Ve / (1 - Pi / Pf);
    set('veE', `${n(e * 100, 2)}%`);
    set('veVe', `${n(Ve, 1)} L`);
    set('veVn', `${n(Vn, 1)} L`);
    set('veCom', `${n(VASOS.find(x => x >= Vn) || Math.ceil(Vn), 0)} L`);
    hint('veHint', `Pré-carga do vaso igual à pressão da rede (${n(Pi - 1, 1)} bar), ajustada com o vaso vazio. Pressões em valor absoluto (+1 bar) e pressão final 0,5 bar abaixo do ajuste da válvula de segurança, como recomendam os fabricantes. Use vaso próprio para água potável (membrana atóxica).`);
  }
  on('calcVexp', calcVexp);

  // ---------- 14. Água de chuva: V = P × A × C × η; reservatório pelo método prático alemão (6% do menor) ----------
  function calcChuva() {
    const A = v('chA'), P = v('chP'), C = parseFloat($('chC').value), eta = v('chEta'), dem = v('chDem');
    if (!(A > 0 && P > 0)) { ['chVano', 'chVmes', 'chAtend', 'chRes'].forEach(id => set(id, '—')); return; }
    const ano = P * A * C * eta / 1000, consAno = dem * 365 / 1000, res = 0.06 * Math.min(ano, consAno || ano);
    set('chVano', `${n(ano, 1)} m³ (${n(ano * 1000, 0)} L)`);
    set('chVmes', `${n(ano / 12, 1)} m³`);
    set('chAtend', consAno > 0 ? `${n(Math.min(100, ano / consAno * 100), 0)}% do consumo anual` : '—');
    set('chRes', `${n(res, 1)} m³ (${n(res * 1000, 0)} L)`);
    hint('chHint', 'Volume aproveitável = chuva × área × coeficiente de escoamento × eficiência. O reservatório pelo método prático alemão da NBR 15527 é 6% do menor valor entre a água aproveitável e o consumo do ano. Água de chuva só para usos não potáveis, com rede separada e identificada. A NBR 15527 também traz métodos com dados de chuva mensais (Rippl e simulação), mais precisos.');
  }
  on('calcChuva', calcChuva);

  // ---------- 15. Tanque séptico: V = 1000 + N × (C × T + K × Lf) (NBR 7229) ----------
  const DETENCAO = [[1500, 1.00, 24], [3000, 0.92, 22], [4500, 0.83, 20], [6000, 0.75, 18], [7500, 0.67, 16], [9000, 0.58, 14], [Infinity, 0.50, 12]];
  const KLODO = [[94, 65, 57], [134, 105, 97], [174, 145, 137], [214, 185, 177], [254, 225, 217]];   // intervalo 1 a 5 anos × temperatura
  function calcFossa() {
    const [C, Lf] = $('fsTipo').value.split('|').map(Number), N = v('fsN');
    if (!(N > 0)) { ['fsCd', 'fsTd', 'fsV', 'fsH'].forEach(id => set(id, '—')); return; }
    const cd = N * C, [, T, horas] = DETENCAO.find(x => cd <= x[0]), K = KLODO[+$('fsInt').value][+$('fsT').value];
    const V = 1000 + N * (C * T + K * Lf), m3 = V / 1000;
    const [hmin, hmax] = m3 <= 6 ? [1.2, 2.2] : m3 <= 10 ? [1.5, 2.5] : [1.8, 2.8];
    set('fsCd', `${n(cd, 0)} L/dia`);
    set('fsTd', `${n(T, 2)} dia (${horas} h)`);
    set('fsV', `${n(V, 0)} L (${n(m3, 2)} m³)`);
    set('fsH', `${n(hmin, 2)} a ${n(hmax, 2)} m`);
    const larg = Math.max(0.8, Math.sqrt(m3 / hmin / 2)), comp = m3 / hmin / larg;
    hint('fsHint', `Taxa de acumulação de lodo K = ${K} dias. Tanque retangular com profundidade útil de ${n(hmin, 2)} m: cerca de ${n(larg, 2)} m de largura por ${n(comp, 2)} m de comprimento (relação comprimento/largura entre 2 e 4, largura mínima de 0,80 m). Distâncias mínimas: 1,5 m de construções e divisas, 3 m de árvores e da rede de água e 15 m de poços e cursos d'água. O efluente segue para filtro anaeróbio, sumidouro ou vala de infiltração (NBR 13969).`);
  }
  on('calcFossa', calcFossa);

  // ---------- 16. Espessura de parede: t = P·D / 2(S·E·W + P·Y) (ASME B31.3, Y = 0,4, W = 1) ----------
  // espessuras de parede Sch 40 e Sch 80 (ASME B36.10) por diâmetro externo
  const SCH = { 21.3: [2.77, 3.73], 26.7: [2.87, 3.91], 33.4: [3.38, 4.55], 42.2: [3.56, 4.85], 48.3: [3.68, 5.08], 60.3: [3.91, 5.54], 73: [5.16, 7.01],
    88.9: [5.49, 7.62], 114.3: [6.02, 8.56], 168.3: [7.11, 10.97], 219.1: [8.18, 12.70], 273: [9.27, 15.09], 323.8: [10.31, 17.48] };
  function calcEsp() {
    const D = parseFloat($('epNps').value), P = v('epP') / 10, S = v('epS'), E = parseFloat($('epE').value), c = v('epC'), tol = v('epTol') / 100;
    if (!(P > 0 && S > 0)) { ['epT', 'epTm', 'epTn', 'epSch'].forEach(id => set(id, '—')); return; }
    const t = P * D / (2 * (S * E + P * 0.4)), tm = t + c, tn = tm / (1 - tol), [s40, s80] = SCH[D];
    set('epT', `${n(t, 2)} mm`);
    set('epTm', `${n(tm, 2)} mm`);
    set('epTn', `${n(tn, 2)} mm`);
    set('epSch', tn <= s40 ? `Sch 40 (${n(s40, 2)} mm)` : tn <= s80 ? `Sch 80 (${n(s80, 2)} mm)` : `acima do Sch 80 (${n(s80, 2)} mm)`);
    hint('epHint', 'A tensão admissível S depende do material e da temperatura de projeto: confira na Tabela A-1 da ASME B31.3 (aço-carbono A106 Gr. B e A53 Gr. B ficam em torno de 138 MPa até cerca de 200 °C). Fórmula para t < D/6; acima disso, ou com cargas externas, vácuo e flexão, o cálculo é mais completo. Verificação de apoio, não substitui o projeto.', tn > s80);
  }
  on('calcEsp', calcEsp);
})();
