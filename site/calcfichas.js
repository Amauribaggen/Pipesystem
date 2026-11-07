// Calculadoras online (seção Dimensionamento): lista das calculadoras e ficha que abre cada uma por cima da página.
// As calculadoras ficam guardadas na página (div.tools--fichas, escondida); ao abrir, a calculadora vai para a
// janela da ficha e, ao fechar no X, volta para o lugar. CALCS também alimenta o submenu de Dimensionamento.
// [id da calculadora, nome, categoria, para que serve, norma ou base de cálculo]
const CALCS = [
  ['dimTool', 'Dimensionamento hidráulico — água fria', 'Água fria e quente', 'Vazão de projeto por pesos e diâmetro dos trechos de água fria.', 'NBR 5626 (método de 1998)'],
  ['calcTrechos', 'Água fria trecho a trecho — pressão nos pontos', 'Água fria e quente', 'Vazão, velocidade, perda e pressão em cada trecho até o ponto mais desfavorável.', 'NBR 5626 (método de 1998)'],
  ['calcRes', 'Reservatório de água — volume de reservação', 'Água fria e quente', 'Consumo diário, reservação total e divisão entre reservatórios inferior e superior.', 'NBR 5626'],
  ['calcAq', 'Aquecedor de água — gás, elétrico e solar', 'Água fria e quente', 'Vazão simultânea, potência, aquecedor a gás e volume do boiler.', 'NBR 5626 · NBR 15569'],
  ['calcVexp', 'Vaso de expansão — água quente', 'Água fria e quente', 'Volume de expansão e vaso mínimo para boilers e sistemas fechados.', 'Coeficiente de expansão da água'],
  ['calcDil', 'Dilatação térmica de tubos', 'Água fria e quente', 'Quanto o tubo cresce com o calor, por material, para prever liras e pontos fixos.', 'ΔL = α × L × ΔT'],
  ['calcEsg', 'Esgoto sanitário — unidades Hunter', 'Esgoto e águas pluviais', 'Diâmetros de ramais, tubos de queda e coletores pelas unidades de contribuição.', 'NBR 8160'],
  ['calcCalha', 'Calhas e condutores', 'Esgoto e águas pluviais', 'Vazão de chuva, calha e condutores verticais e horizontais.', 'NBR 10844'],
  ['calcChuva', 'Aproveitamento de água de chuva', 'Esgoto e águas pluviais', 'Água aproveitável por ano e volume da cisterna.', 'NBR 15527'],
  ['calcFossa', 'Tanque séptico', 'Esgoto e águas pluviais', 'Volume útil, período de detenção e profundidade do tanque séptico.', 'Método da NBR 7229 · conferir com a NBR 17076'],
  ['calcGas', 'Dimensionamento de gás', 'Gás', 'Potência, vazão e diâmetro da rede interna de gás natural ou GLP.', 'NBR 15526'],
  ['hwTool', 'Perda de carga — Hazen-Williams', 'Tubulações e bombas', 'Perda de carga e velocidade na água, pelo coeficiente C do material.', 'Hazen-Williams'],
  ['calcDarcy', 'Perda de carga — Darcy-Weisbach', 'Tubulações e bombas', 'Perda de carga para água quente, água com glicol e óleo, com rugosidade e Reynolds.', 'Darcy-Weisbach · Swamee-Jain'],
  ['calcVel', 'Velocidade e diâmetro da tubulação', 'Tubulações e bombas', 'Velocidade no tubo e diâmetro mínimo para cada aplicação.', 'Q = v × A'],
  ['calcEq', 'Comprimentos equivalentes — perdas localizadas', 'Tubulações e bombas', 'Perda nas conexões e registros em metros de tubo.', 'Tabelas de comprimento equivalente'],
  ['calcBomba', 'Bombas — altura manométrica e NPSH', 'Tubulações e bombas', 'Altura manométrica, potência e NPSH disponível.', 'Hidráulica de bombas'],
  ['calcPto', 'Curva da bomba × curva do sistema', 'Tubulações e bombas', 'Ponto de operação da bomba a partir de três pontos da curva do fabricante, com gráfico.', 'Hazen-Williams'],
  ['calcSpk', 'Sprinklers — área de operação', 'Incêndio', 'Bicos na área de operação, vazão e pressão no bico mais desfavorável (Q = K √P) e vazão total.', 'NBR 10897 (dados da classe de risco)'],
  ['calcHid', 'Hidrante mais desfavorável', 'Incêndio', 'Perda na mangueira e na tubulação e altura que a bomba de incêndio precisa entregar.', 'NBR 13714 · Hazen-Williams'],
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
  dlg.addEventListener('close', () => { if (!dlg.open) devolve(); });   // o evento chega depois: se outra calculadora já reabriu a ficha, não a devolve
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

  // ----- Link com os valores: /dimensionamento?v=…#idDaCalculadora reabre a calculadora já preenchida -----
  // Guarda cada campo (texto, número, lista, caixa de marcar) pelo id, ou pela posição na calculadora ("@3") quando
  // não tem id (ex.: quantidades de aparelhos), e a aba escolhida de cada grupo de botões (.seg)
  const campos = tool => [...tool.querySelectorAll('input, select, textarea')].filter(el => el.type !== 'file');
  const valores = tool => {
    const v = {};
    campos(tool).forEach((el, i) => { v[el.id || '@' + i] = el.type === 'checkbox' || el.type === 'radio' ? el.checked : el.value; });
    tool.querySelectorAll('.seg[id]').forEach(seg => { const b = seg.querySelector('.is-on[data-k]'); if (b) v['seg:' + seg.id] = b.dataset.k; });
    return v;
  };
  const aplica = (tool, v) => {
    Object.entries(v).filter(([k]) => k.startsWith('seg:')).forEach(([k, val]) => $(k.slice(4))?.querySelector(`[data-k="${val}"]`)?.click());
    // a lista é lida de novo a cada campo: um campo (ex.: quantidade de trechos) pode refazer a tabela
    Object.entries(v).filter(([k]) => !k.startsWith('seg:')).forEach(([k, val]) => {
      const el = k[0] === '@' ? campos(tool)[+k.slice(1)] : $(k); if (!el || !tool.contains(el)) return;
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!val; else el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  };
  const codifica = obj => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const decodifica = s => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));
  const aviso = (btn, txt) => { const old = btn.textContent; btn.textContent = txt; setTimeout(() => { btn.textContent = old; }, 2200); };

  $('calcLink')?.addEventListener('click', async e => {
    if (!aberta) return;
    const url = `${location.origin}/dimensionamento?v=${codifica(valores(aberta))}#${aberta.id}`;
    try { await navigator.clipboard.writeText(url); aviso(e.currentTarget, 'Link copiado ✓'); }
    catch { window.prompt('Copie o link da calculadora com os valores:', url); }
  });

  // ao abrir um link com ?v=, preenche a calculadora depois que as ferramentas carregam
  const qv = new URLSearchParams(location.search).get('v'), hid = location.hash.slice(1);
  if (qv && CALCS.some(c => c[0] === hid)) {
    let v = null; try { v = decodifica(qv); } catch { /* link incompleto: abre a calculadora com os valores padrão */ }
    if (v) window.addEventListener('load', () => setTimeout(() => (typeof loadTools === 'function' ? loadTools() : Promise.resolve())
      .then(() => { if (!aberta || aberta.id !== hid) window.abreCalc(hid); aplica($(hid), v); }), 80));
  }

  // ----- Memorial de cálculo: folha limpa com dados de entrada, resultados, norma e data, para imprimir ou salvar em PDF -----
  $('calcMemo')?.addEventListener('click', () => {
    if (!aberta) return;
    const info = CALCS.find(c => c[0] === aberta.id);
    const copia = aberta.cloneNode(true);
    copia.removeAttribute('id');
    copia.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    // campos viram texto com o valor atual (o clone não leva o que foi digitado)
    const orig = aberta.querySelectorAll('input, select, textarea'), clon = copia.querySelectorAll('input, select, textarea');
    clon.forEach((el, i) => {
      const o = orig[i], b = document.createElement('b');
      b.className = 'calcmem__val';
      b.textContent = o.tagName === 'SELECT' ? (o.selectedOptions[0]?.textContent || '') : o.type === 'checkbox' || o.type === 'radio' ? (o.checked ? 'sim' : 'não') : (o.value || '—');
      el.replaceWith(b);
    });
    copia.querySelectorAll('[hidden]').forEach(el => el.remove());   // campos da aba que não está em uso
    copia.querySelectorAll('.seg').forEach(seg => seg.querySelectorAll('button').forEach(bt => { if (!bt.classList.contains('is-on')) bt.remove(); }));
    copia.querySelectorAll('button:not(.seg button), .calcmem-ocultar').forEach(el => el.remove());
    const agora = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    const folha = document.createElement('div');
    folha.id = 'calcMemoria';
    folha.className = 'calcmem';
    folha.innerHTML = `<header class="calcmem__head"><b>PipeSystem · Memorial de cálculo</b><span>${agora}</span></header>
      <p class="calcmem__ref">${info[1]} · ${info[2]} · Base de cálculo: ${info[4]}</p>`;
    folha.append(copia);
    folha.insertAdjacentHTML('beforeend', `<p class="calcmem__nota">Resultado indicativo, gerado pela calculadora on-line do PipeSystem (${location.origin}/dimensionamento#${aberta.id}). Confira com a norma vigente; não substitui o projeto assinado por profissional habilitado.</p>`);
    document.body.append(folha);
    document.documentElement.classList.add('print-calc');
    const limpa = () => { document.documentElement.classList.remove('print-calc'); folha.remove(); window.removeEventListener('afterprint', limpa); };
    window.addEventListener('afterprint', limpa);
    window.print();
    setTimeout(() => { if (document.body.contains(folha) && !matchMedia('print').matches) limpa(); }, 1500);
  });
})();
