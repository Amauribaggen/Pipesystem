// Calculadoras online (seção Dimensionamento): lista das calculadoras e ficha que abre cada uma por cima da página.
// As calculadoras ficam guardadas na página (div.tools--fichas, escondida); ao abrir, a calculadora vai para a
// janela da ficha e, ao fechar no X, volta para o lugar. CALCS também alimenta o submenu de Dimensionamento.
// [id da calculadora, nome, categoria, para que serve, norma ou base de cálculo]
const CALCS = [
  ['dimTool', 'Dimensionamento hidráulico — água fria', 'Água fria e quente', 'Vazão de projeto por pesos e diâmetro dos trechos de água fria.', 'NBR 5626'],
  ['calcRes', 'Reservatório de água — volume de reservação', 'Água fria e quente', 'Consumo diário, reservação total e divisão entre reservatórios inferior e superior.', 'NBR 5626'],
  ['calcAq', 'Aquecedor de água — gás, elétrico e solar', 'Água fria e quente', 'Vazão simultânea, potência, aquecedor a gás e volume do boiler.', 'NBR 5626 · NBR 15569'],
  ['calcVexp', 'Vaso de expansão — água quente', 'Água fria e quente', 'Volume de expansão e vaso mínimo para boilers e sistemas fechados.', 'Coeficiente de expansão da água'],
  ['calcDil', 'Dilatação térmica de tubos', 'Água fria e quente', 'Quanto o tubo cresce com o calor, por material, para prever liras e pontos fixos.', 'ΔL = α × L × ΔT'],
  ['calcEsg', 'Esgoto sanitário — unidades Hunter', 'Esgoto e águas pluviais', 'Diâmetros de ramais, tubos de queda e coletores pelas unidades de contribuição.', 'NBR 8160'],
  ['calcCalha', 'Calhas e condutores', 'Esgoto e águas pluviais', 'Vazão de chuva, calha e condutores verticais e horizontais.', 'NBR 10844'],
  ['calcChuva', 'Aproveitamento de água de chuva', 'Esgoto e águas pluviais', 'Água aproveitável por ano e volume da cisterna.', 'NBR 15527'],
  ['calcFossa', 'Tanque séptico', 'Esgoto e águas pluviais', 'Volume útil, período de detenção e profundidade do tanque séptico.', 'NBR 7229'],
  ['calcGas', 'Dimensionamento de gás', 'Gás', 'Potência, vazão e diâmetro da rede interna de gás natural ou GLP.', 'NBR 15526'],
  ['hwTool', 'Perda de carga — Hazen-Williams', 'Tubulações e bombas', 'Perda de carga e velocidade na água, pelo coeficiente C do material.', 'Hazen-Williams'],
  ['calcDarcy', 'Perda de carga — Darcy-Weisbach', 'Tubulações e bombas', 'Perda de carga para água quente, água com glicol e óleo, com rugosidade e Reynolds.', 'Darcy-Weisbach · Swamee-Jain'],
  ['calcVel', 'Velocidade e diâmetro da tubulação', 'Tubulações e bombas', 'Velocidade no tubo e diâmetro mínimo para cada aplicação.', 'Q = v × A'],
  ['calcEq', 'Comprimentos equivalentes — perdas localizadas', 'Tubulações e bombas', 'Perda nas conexões e registros em metros de tubo.', 'Tabelas de comprimento equivalente'],
  ['calcBomba', 'Bombas — altura manométrica e NPSH', 'Tubulações e bombas', 'Altura manométrica, potência e NPSH disponível.', 'Hidráulica de bombas'],
  ['calcGolpe', 'Golpe de aríete', 'Tubulações e bombas', 'Celeridade da onda, sobrepressão e pressão máxima no fechamento.', 'Joukowsky'],
  ['calcEsp', 'Espessura de parede de tubo de aço', 'Industrial', 'Espessura mínima por pressão e corrosão, e o schedule que atende.', 'ASME B31.3'],
  ['calcAmb', 'Aquecimento de ambiente — potência estimada', 'Climatização', 'Potência de aquecimento pelo volume, isolamento e clima.', 'Regra prática por volume'],
  ['calcConv', 'Conversão de unidades', 'Conversões e tabelas', 'Pressão, vazão e comprimento nas unidades mais usadas.', 'Conversão'],
  ['calcBitolas', 'Bitolas — polegada × DN', 'Conversões e tabelas', 'Rosca em polegadas, DN e diâmetro externo do tubo de aço.', 'Tabela'],
];

(() => {
  const $ = id => document.getElementById(id);
  const lista = $('calcList'), dlg = $('calcDlg');
  if (!lista || !dlg) return;
  const cats = [...new Set(CALCS.map(c => c[2]))];
  let cat = '';
  // lista e filtro por categoria
  $('calcChips').innerHTML = ['', ...cats].map(c => `<button type="button" class="calcs__chip" aria-pressed="${c === cat}" data-cat="${c}">${c || 'Todas'} <small>${c ? CALCS.filter(x => x[2] === c).length : CALCS.length}</small></button>`).join('');
  lista.innerHTML = CALCS.filter(([id]) => $(id)).map(([id, nome, c, res, norma]) => `
        <li data-cat="${c}"><a class="calcs__item" href="#${id}" data-calc="${id}">
          <span class="calcs__cat">${c}</span><b>${nome}</b><span class="calcs__res">${res}</span><span class="calcs__norma">${norma}</span>
          <span class="calcs__abrir">Abrir calculadora →</span></a></li>`).join('');
  $('calcChips').addEventListener('click', e => {
    const b = e.target.closest('[data-cat]'); if (!b) return;
    cat = b.dataset.cat;
    $('calcChips').querySelectorAll('.calcs__chip').forEach(x => x.setAttribute('aria-pressed', x === b));
    lista.querySelectorAll('li').forEach(li => { li.hidden = !!cat && li.dataset.cat !== cat; });
  });

  // ficha: a calculadora sai do depósito, aparece na janela e volta para o lugar ao fechar
  let aberta = null, marca = null;
  // devolve a calculadora ao lugar (no X, no Esc ou no clique fora da ficha)
  const devolve = () => {
    if (aberta && marca && marca.parentNode) marca.replaceWith(aberta);
    aberta = marca = null;
  };
  const fecha = () => { devolve(); if (dlg.open) dlg.close(); };
  dlg.addEventListener('close', devolve);
  dlg.addEventListener('cancel', devolve);
  dlg.querySelector('.calcdlg__x').addEventListener('click', fecha);
  dlg.addEventListener('click', e => { if (e.target === dlg) fecha(); });   // clique fora da ficha fecha
  window.abreCalc = id => {
    const tool = $(id), info = CALCS.find(c => c[0] === id);
    if (!tool || !info) return false;
    if (typeof loadTools === 'function') loadTools();   // carrega as calculadoras, se ainda não carregaram
    fecha();
    marca = document.createComment('calculadora');
    tool.replaceWith(marca);
    $('calcDlgBody').append(tool);
    aberta = tool;
    $('calcDlgCat').textContent = `${info[2]} · ${info[4]}`;
    dlg.showModal();
    dlg.scrollTop = 0;
    return true;
  };
  lista.addEventListener('click', e => {
    const a = e.target.closest('[data-calc]'); if (!a) return;
    e.preventDefault(); e.stopImmediatePropagation();
    window.abreCalc(a.dataset.calc);
  });
})();
