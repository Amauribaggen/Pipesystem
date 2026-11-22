// Radar de Compras Públicas (/compras-publicas): o que o governo federal compra de cada material do catálogo.
// Dados: /compras-dados.json (gerado por scripts/compras.py a partir das NF-e do Portal da Transparência). Fichas: window.CP_MAT.
(() => {
  const raiz = document.getElementById('cpub');
  if (!raiz) return;
  const MAT = window.CP_MAT || [];
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const brl = v => v >= 1e9 ? `R$ ${nf(v / 1e9, 2)} bi` : v >= 1e6 ? `R$ ${nf(v / 1e6, 2)} mi` : v >= 1e3 ? `R$ ${nf(v / 1e3, 1)} mil` : `R$ ${nf(v, 2)}`;
  const reais = v => `R$ ${nf(v, 2)}`;
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const mesTxt = ym => `${MESES[+ym.slice(5) - 1]}/${ym.slice(2, 4)}`;
  const mesLongo = ym => `${MESES[+ym.slice(5) - 1]}/${ym.slice(0, 4)}`;
  const dataBR = d => d.split('-').reverse().join('/');
  const UN = { UNIDAD: 'unidade', UN: 'unidade', UND: 'unidade', 'PEÇA': 'peça', PC: 'peça', METRO: 'metro', M: 'metro', KG: 'kg', CX: 'caixa', CAIXA: 'caixa', PCT: 'pacote', ROLO: 'rolo', BARRA: 'barra', BR: 'barra', JOGO: 'jogo', CJ: 'conjunto', PAR: 'par', LITRO: 'litro', L: 'litro' };
  const un = u => UN[u] || u.toLowerCase();
  const titulo = s => String(s).toLowerCase().replace(/(^|[\s(/-])([a-zà-ú])/g, (m, a, b) => a + b.toUpperCase()).replace(/\b(De|Da|Do|Das|Dos|E|Em|Para)\b/g, w => w.toLowerCase())
    .replace(/\b(Ltda|S\.?a|Me|Epp|Eireli)\b\.?/gi, w => w.toUpperCase());

  let D;
  const barras = (lin, total) => `<ol class="imp__barras">${lin.map(([nome, sub, v, n]) => `<li><span class="imp__bn" title="${esc(nome)}">${esc(nome)}${sub ? ` <small>${esc(sub)}</small>` : ''}</span>
    <span class="imp__bt"><span style="width:${Math.max(1, v / lin[0][2] * 100).toFixed(1)}%"></span></span><span class="imp__bv">${brl(v)}<small>${nf(n)} nota${n > 1 ? 's' : ''}</small></span></li>`).join('')}</ol>`;
  const colunas = s => {
    const max = Math.max(...s.map(x => x[1]), 1), w = 640, h = 190, b = w / s.length;
    return `<svg viewBox="0 0 ${w} ${h + 22}" role="img" aria-label="Compras por mês">${[0.5, 1].map(f => `<line class="imp__grade" x1="0" x2="${w}" y1="${h - h * f}" y2="${h - h * f}"/>`).join('')}
      ${s.map(([m, v, n], i) => `<rect class="imp__col${i === s.length - 1 ? ' imp__col--hoje' : ''}" x="${i * b + b * .15}" y="${h - v / max * h}" width="${b * .7}" height="${Math.max(1, v / max * h)}"><title>${mesLongo(m)}: ${brl(v)} em ${nf(n)} notas</title></rect>
      <text class="imp__eixo" x="${i * b + b / 2}" y="${h + 16}" text-anchor="middle">${mesTxt(m)}</text>`).join('')}</svg>`;
  };
  const kpis = A => `<div class="imp__kpis">
      <div><small>Comprado em 12 meses</small><b>${brl(A.v)}</b><span>valor dos itens nas notas</span></div>
      <div><small>Notas fiscais</small><b>${nf(A.n)}</b><span>${nf(A.it)} itens comprados</span></div>
      <div><small>Órgãos compradores</small><b>${nf(A.nc)}</b><span>unidades do governo federal</span></div>
      <div><small>Empresas que venderam</small><b>${nf(A.nf)}</b><span>fornecedores diferentes</span></div></div>`;
  const comp = A => A.comp.map(([nome, sup, uf, v, n]) => [titulo(nome), [sup, uf].filter(Boolean).join(' · '), v, n]);
  const forn = A => A.forn.map(([nome, uf, mun, v, n]) => [titulo(nome), [mun, uf].filter(Boolean).join(' / '), v, n]);
  const ufs = (lista) => lista.filter(x => x[0]).slice(0, 10).map(([uf, v, n]) => [uf, '', v, n]);

  function inicio() {
    const A = D.geral;
    $('cpResumo').innerHTML = kpis(A);
    const rank = MAT.map(m => ({ m, A: D.grupos[D.materiais[m.id]] })).filter(x => x.A).sort((a, b) => b.A.v - a.A.v);
    $('cpTop').innerHTML = `<div class="imp__ranks">
      <section><h3>Materiais que o governo mais compra</h3><p class="imp__mini">Valor em 12 meses. Clique para ver quem compra e quem vende.</p>
        <ol class="imp__cards">${rank.slice(0, 10).map(({ m, A }) => `<li><a href="${'/compras-publicas/' + m.slug}" data-m="${m.id}"><span class="imp__cn">${esc(m.name)}</span><span class="imp__cv">${brl(A.v)}</span></a></li>`).join('')}</ol></section>
      <section><h3>Quem mais compra</h3><p class="imp__mini">Órgãos federais, somando todos os materiais do site.</p>${barras(comp(A).slice(0, 8), A.v)}</section>
      <section><h3>Quem mais vende</h3><p class="imp__mini">Empresas que emitiram as notas.</p>${barras(forn(A).slice(0, 8), A.v)}</section></div>`;
    lista();
  }
  function lista() {
    const q = ($('cpBuscaMat').value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const it = MAT.filter(m => D.materiais[m.id] && (!q || (m.name + ' ' + m.chaves + ' ' + (D.ncmPorMat[m.id] || []).join(' ')).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(q)));
    $('cpLista').innerHTML = it.length ? it.map(m => `<li><a href="${'/compras-publicas/' + m.slug}" data-m="${m.id}">${esc(m.name)}<small>${brl(D.grupos[D.materiais[m.id]].v)}</small></a></li>`).join('') : '<li class="imp__vazio">Nenhum material encontrado.</li>';
  }

  function detalhe(id) {
    const m = MAT.find(x => x.id === id), A = m && D.grupos[D.materiais[id]];
    if (!A) return mostra(false);
    const ncms = (D.ncmPorMat[id] || []).map(n => n.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')).join(', ');
    const top = A.comp[0], topF = A.forn[0];
    $('cpDetalhe').innerHTML = `<p class="imp__voltar"><a href="/compras-publicas" data-volta>← Todos os materiais</a></p>
      <p class="eyebrow">${esc(m.cat)} · NCM ${ncms}</p><h2 class="imp__h2">${esc(m.name)}</h2>
      ${kpis(A)}
      <div class="cpub__oport"><h3>O que estes números dizem para quem vende</h3><ul>
        <li><b>Há demanda:</b> o governo federal comprou ${brl(A.v)} deste material em 12 meses, em ${nf(A.n)} notas fiscais.</li>
        ${top ? `<li><b>Maior comprador:</b> ${esc(titulo(top[0]))}${top[2] ? ` (${esc(top[2])})` : ''}, com ${brl(top[3])}. Esses órgãos compram por licitação e dispensa: acompanhe os avisos deles no <a href="https://www.gov.br/compras/pt-br" target="_blank" rel="noopener noreferrer">Compras.gov.br</a>.</li>` : ''}
        ${topF ? `<li><b>Concorrência:</b> ${nf(A.nf)} empresas venderam este material ao governo. A que mais vendeu foi ${esc(titulo(topF[0]))}${topF[1] ? ` (${esc(topF[1])})` : ''}.</li>` : ''}
        ${A.pr[0] ? `<li><b>Preço de referência:</b> metade das compras por ${un(A.pr[0][0])} saiu entre ${reais(A.pr[0][2])} e ${reais(A.pr[0][4])} (mediana ${reais(A.pr[0][3])}). Os itens têm medidas e modelos diferentes: use para ter ordem de grandeza, não como cotação.</li>` : ''}
      </ul></div>
      <section class="imp__bloco"><h3>Compras por mês</h3><p class="imp__mini">Valor dos itens nas notas fiscais. O mês mais recente fica em laranja.</p><div class="imp__graf">${colunas(A.s)}</div></section>
      <div class="imp__duas">
        <section class="imp__bloco"><h3>Quem compra</h3><p class="imp__mini">Órgão destinatário da nota (ministério ou entidade, quando informado, e estado).</p>${barras(comp(A), A.v)}</section>
        <section class="imp__bloco"><h3>Quem vende</h3><p class="imp__mini">Empresa que emitiu a nota, com cidade e estado.</p>${barras(forn(A), A.v)}</section>
      </div>
      <div class="imp__duas">
        <section class="imp__bloco"><h3>Onde o governo compra</h3><p class="imp__mini">Estado do órgão comprador.</p>${barras(ufs(A.ufc), A.v)}</section>
        <section class="imp__bloco"><h3>De onde vêm os fornecedores</h3><p class="imp__mini">Estado da empresa que vendeu.</p>${barras(ufs(A.uff), A.v)}</section>
      </div>
      ${A.pr.length ? `<section class="imp__bloco"><h3>Preço pago por unidade</h3><p class="imp__mini">Faixa do meio das compras (metade dos preços fica entre o 1º e o 3º valor), pela unidade da nota.</p>
        <div class="cpub__tab"><table><thead><tr><th>Unidade</th><th>Itens</th><th>25% pagaram até</th><th>Mediana</th><th>75% pagaram até</th></tr></thead>
        <tbody>${A.pr.map(([u, k, a, b, c]) => `<tr><td>${esc(un(u))}</td><td>${nf(k)}</td><td>${reais(a)}</td><td><b>${reais(b)}</b></td><td>${reais(c)}</td></tr>`).join('')}</tbody></table></div></section>` : ''}
      <section class="imp__bloco"><h3>Últimas compras</h3><p class="imp__mini">As notas mais recentes, como aparecem no Portal da Transparência.</p>
        <div class="cpub__tab"><table><thead><tr><th>Data</th><th>Item</th><th>Qtd.</th><th>Preço unit.</th><th>Total</th><th>Vendedor</th><th>Comprador</th></tr></thead>
        <tbody>${A.ult.map(([d, desc, q, u, vu, v, f, c, uf]) => `<tr><td>${dataBR(d)}</td><td>${esc(desc)}</td><td>${nf(q, q % 1 ? 2 : 0)} ${esc(un(u))}</td><td>${reais(vu)}</td><td>${brl(v)}</td><td>${esc(titulo(f))}</td><td>${esc(titulo(c))}${uf ? ` (${esc(uf)})` : ''}</td></tr>`).join('')}</tbody></table></div></section>
      <p class="tags__note">Veja também <a href="${'/materiais/' + m.slug}">a ficha técnica</a> e <a href="${'/importacoes/' + m.slug}">quanto o Brasil importa deste material</a>.</p>`;
    mostra(true);
  }
  function mostra(det) {
    $('cpInicio').hidden = det; $('cpDetalhe').hidden = !det;
    if (det) raiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function rota() {
    const slug = (location.pathname.match(/^\/compras-publicas\/([^/?#]+)/) || [])[1] || new URLSearchParams(location.search).get('m');
    const m = slug && MAT.find(x => x.slug === slug);
    m ? detalhe(m.id) : mostra(false);
  }
  raiz.addEventListener('click', e => {
    const a = e.target.closest('a[data-m], a[data-volta]');
    if (!a || e.ctrlKey || e.metaKey || /^\/compras-publicas\/./.test(location.pathname)) return;   // página própria do material: link normal
    e.preventDefault();
    history.pushState(null, '', a.dataset.m ? '/compras-publicas/' + MAT.find(x => x.id === a.dataset.m).slug : '/compras-publicas');
    rota();
  });
  window.addEventListener('popstate', rota);
  $('cpBuscaMat').addEventListener('input', () => D && lista());
  fetch('/compras-dados.json').then(r => r.json()).then(d => { D = d; inicio(); rota(); })
    .catch(() => { $('cpResumo').innerHTML = '<p class="imp__vazio">Não foi possível carregar os dados agora. Recarregue a página.</p>'; });
})();
