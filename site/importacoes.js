// Radar de Importações (/importacoes): importações brasileiras dos materiais do catálogo, com dados do Comex Stat (MDIC).
// Dados: /importacoes-dados.json (gerado por scripts/comex.mjs). Fichas: window.IMP_MAT (injetado pela página).
(() => {
  const raiz = document.getElementById('imp');
  if (!raiz) return;
  const MAT = window.IMP_MAT || [];
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const nf = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const usd = v => v >= 1e9 ? `US$ ${nf(v / 1e9, 1)} bi` : v >= 1e6 ? `US$ ${nf(v / 1e6, 1)} mi` : v >= 1e3 ? `US$ ${nf(v / 1e3, 0)} mil` : `US$ ${nf(v, 0)}`;
  const ton = kg => kg >= 1e6 ? `${nf(kg / 1e6, 1)} mil t` : kg >= 1e3 ? `${nf(kg / 1e3, 0)} t` : `${nf(kg, 0)} kg`;
  const pkg = v => `US$ ${nf(v, v < 10 ? 2 : 1)}/kg`;
  const pct = (v, sinal = true) => `${sinal && v > 0 ? '+' : ''}${nf(v * 100, Math.abs(v) < .1 ? 1 : 0)}%`;
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const mesTxt = ym => `${MESES[+ym.slice(5) - 1]}/${ym.slice(2, 4)}`;
  const mesLongo = ym => `${MESES[+ym.slice(5) - 1]}/${ym.slice(0, 4)}`;

  let D, T, porId = {};
  const MERCOSUL = new Set(['Argentina', 'Paraguai', 'Uruguai']);
  // Alíquotas da ficha: média dos NCMs ponderada pelo valor importado em 12 meses
  function aliquotas(ncms) {
    if (!T) return { ii: null, ipi: null, txt: 'Alíquotas oficiais indisponíveis agora: informe-as nos campos.' };
    const ult = new Set(meses(D.ultimoMes, 12)), peso = n => (D.serie[n] || []).reduce((t, [ym, f]) => t + (ult.has(ym) ? f : 0), 0) || 1e-9;
    const media = campo => { let s = 0, w = 0; for (const n of ncms) { const v = T.ncm[n]?.[campo]; if (v != null) { s += v * peso(n); w += peso(n); } } return w ? Math.round(s / w * 100) / 100 : null; };
    const fmtN = n => n.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
    const det = ncms.filter(n => T.ncm[n]?.ii != null).map(n => `NCM ${fmtN(n)}: II ${nf(T.ncm[n].ii, 1)}% (${T.ncm[n].base}${T.ncm[n].tec !== T.ncm[n].ii ? `; TEC ${nf(T.ncm[n].tec, 1)}%` : ''}), IPI ${nf(T.ncm[n].ipi ?? 0, 2)}%`).join(' · ');
    return { ii: media('ii'), ipi: media('ipi'), txt: `${esc(det)}${ncms.length > 1 ? '. Com mais de um NCM, vale a média ponderada pelo valor importado.' : '.'} Fontes: <a href="${T.urlII}" target="_blank" rel="noopener noreferrer">${esc(T.fonteII)}</a> e <a href="${T.urlIPI}" target="_blank" rel="noopener noreferrer">${esc(T.fonteIPI)}</a>. PIS 2,10% e COFINS 9,65% são as alíquotas gerais da Lei 10.865/2004.` };
  }

  // ---------- agregação: soma os NCMs de uma ficha ----------
  const meses = (fim, n) => { const out = []; let [a, m] = fim.split('-').map(Number); for (let i = 0; i < n; i++) { out.unshift(`${a}-${String(m).padStart(2, '0')}`); if (--m === 0) { m = 12; a--; } } return out; };
  function agrega(ncms) {
    const s = {};
    for (const n of ncms) for (const [ym, f, kg, cif] of D.serie[n] || []) { const x = (s[ym] ||= [0, 0, 0]); x[0] += f; x[1] += kg; x[2] += cif; }
    const soma = (lista, campo) => { const acc = {}; for (const n of ncms) for (const [nome, f, kg] of (D[campo][n] || [])) { const x = (acc[nome] ||= [0, 0]); x[0] += f; x[1] += kg; } return Object.entries(acc).map(([nome, [f, kg]]) => ({ nome, f, kg })).sort((a, b) => b.f - a.f); };
    const todos = Object.keys(s).sort();
    const ult = meses(D.ultimoMes, 12), ant = meses(meses(D.ultimoMes, 13)[0], 12);
    const tot = lista => lista.reduce((t, ym) => { const x = s[ym]; if (x) { t.f += x[0]; t.kg += x[1]; t.cif += x[2]; } return t; }, { f: 0, kg: 0, cif: 0 });
    const a12 = tot(ult), p12 = tot(ant);
    return { s, todos, a12, p12, var: p12.f ? a12.f / p12.f - 1 : null, pais: soma(0, 'pais'), uf: soma(0, 'uf'), urf: soma(0, 'urf'), via: soma(0, 'via') };
  }

  // ---------- gráfico de colunas ou de linha (uma série, um eixo) com dica ao passar o mouse ----------
  const dica = document.createElement('div'); dica.className = 'imp__dica'; dica.hidden = true; document.body.appendChild(dica);
  function grafico(alvo, pontos, { tipo = 'colunas', fmt = usd, rotulo = p => p.x, marcaX = () => false, titulo }) {
    const W = 720, H = 230, m = { t: 12, r: 8, b: 26, l: 62 };
    const w = W - m.l - m.r, h = H - m.t - m.b, n = pontos.length;
    const valores = pontos.map(p => p.v).filter(v => v != null);
    const max = Math.max(...valores, 0) || 1;
    const passo = 10 ** Math.floor(Math.log10(max / 4)); const tick = [1, 2, 2.5, 5, 10].map(k => k * passo).find(t => max / t <= 4.5);
    const topo = Math.ceil(max / tick) * tick;
    const y = v => m.t + h - (v / topo) * h, bw = w / n;
    let g = '';
    for (let t = 0; t <= topo + 1e-9; t += tick) g += `<line x1="${m.l}" x2="${W - m.r}" y1="${y(t)}" y2="${y(t)}" class="imp__grade"/><text x="${m.l - 8}" y="${y(t) + 4}" class="imp__eixo" text-anchor="end">${fmt(t).replace('US$ ', '')}</text>`;
    pontos.forEach((p, i) => { if (marcaX(p, i)) g += `<text x="${m.l + bw * i + bw / 2}" y="${H - 6}" class="imp__eixo" text-anchor="middle">${esc(rotulo(p))}</text>`; });
    if (tipo === 'colunas') {
      const lb = Math.max(2, Math.min(18, bw - 2));
      pontos.forEach((p, i) => { if (!p.v) return; const x = m.l + bw * i + (bw - lb) / 2, yy = y(p.v), r = Math.min(3, lb / 2, (m.t + h - yy));
        g += `<path class="imp__col${p.destaque ? ' imp__col--hoje' : ''}" d="M${x},${m.t + h}V${yy + r}q0,-${r} ${r},-${r}h${lb - 2 * r}q${r},0 ${r},${r}V${m.t + h}Z"/>`; });
    } else {
      const d = pontos.map((p, i) => p.v == null ? null : `${m.l + bw * i + bw / 2},${y(p.v)}`).filter(Boolean);
      g += `<polyline class="imp__linha" points="${d.join(' ')}"/>`;
    }
    g += `<line class="imp__mira" y1="${m.t}" y2="${m.t + h}" x1="0" x2="0" hidden/><circle class="imp__ponto" r="5" cx="0" cy="0" hidden/>`;
    alvo.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(titulo)}">${g}<rect class="imp__alvo" x="${m.l}" y="${m.t}" width="${w}" height="${h}"/></svg>`;
    const svg = alvo.firstChild, mira = svg.querySelector('.imp__mira'), ponto = svg.querySelector('.imp__ponto');
    const mostra = e => {
      const r = svg.getBoundingClientRect(), xs = (e.clientX - r.left) * W / r.width;
      const i = Math.max(0, Math.min(n - 1, Math.floor((xs - m.l) / bw))), p = pontos[i];
      const cx = m.l + bw * i + bw / 2; mira.setAttribute('x1', cx); mira.setAttribute('x2', cx); mira.hidden = false;
      if (tipo === 'linha' && p.v != null) { ponto.setAttribute('cx', cx); ponto.setAttribute('cy', y(p.v)); ponto.hidden = false; } else ponto.hidden = true;
      dica.innerHTML = `<b>${esc(p.dica || rotulo(p))}</b>${p.v == null ? 'sem importação' : fmt(p.v)}${p.extra ? `<small>${p.extra}</small>` : ''}`;
      dica.hidden = false;
      const dx = r.left + cx * r.width / W; dica.style.left = Math.min(innerWidth - dica.offsetWidth - 8, Math.max(8, dx - dica.offsetWidth / 2)) + 'px';
      dica.style.top = (r.top + scrollY - dica.offsetHeight - 6) + 'px';
    };
    const some = () => { dica.hidden = true; mira.hidden = true; ponto.hidden = true; };
    svg.addEventListener('pointermove', mostra); svg.addEventListener('pointerdown', mostra); svg.addEventListener('pointerleave', some);
  }

  // barras horizontais em HTML, com o valor escrito ao lado (sem depender de cor)
  const barras = (itens, total, extra = () => '') => `<ol class="imp__barras">${itens.map(it => `<li><span class="imp__bn">${esc(it.nome)}</span>
      <span class="imp__bt"><span style="width:${Math.max(1, it.f / itens[0].f * 100)}%"></span></span><span class="imp__bv">${usd(it.f)} <small>${pct(it.f / total, false)}</small>${extra(it)}</span></li>`).join('')}</ol>`;

  // ---------- destaques (página de abertura) ----------
  function grupos() {
    const g = {};
    for (const m of MAT) { const c = D.materiais[m.id]; if (!c) continue; const k = c.ncm.join(','); (g[k] ||= { ncm: c.ncm, fichas: [] }).fichas.push(m); }
    return Object.values(g).map(x => ({ ...x, a: agrega(x.ncm) })).filter(x => x.a.a12.f > 0);
  }
  function destaques() {
    const G = grupos();
    const nomeG = x => x.fichas[0].name + (x.fichas.length > 1 ? ` <small>e mais ${x.fichas.length - 1}</small>` : '');
    const cartao = x => `<li><a href="${'/importacoes/' + x.fichas[0].slug}" data-m="${x.fichas[0].id}"><span class="imp__cn">${nomeG(x)}</span><span class="imp__cv">${usd(x.a.a12.f)}</span>
        ${x.a.var != null ? `<span class="imp__var imp__var--${x.a.var >= 0 ? 'sobe' : 'desce'}">${x.a.var >= 0 ? '▲' : '▼'} ${pct(x.a.var)}</span>` : ''}</a></li>`;
    const altos = G.filter(x => x.a.a12.f >= 1e6 && x.a.var != null).sort((a, b) => b.a.var - a.a.var).slice(0, 6);
    const quedas = G.filter(x => x.a.a12.f >= 1e6 && x.a.var != null).sort((a, b) => a.a.var - b.a.var).slice(0, 6);
    const maiores = [...G].sort((a, b) => b.a.a12.f - a.a.a12.f).slice(0, 8);
    // total do catálogo: cada NCM uma vez só
    const unicos = [...new Set(G.flatMap(x => x.ncm))], tot = agrega(unicos);
    const china = tot.pais.find(p => p.nome === 'China');
    $('impResumo').innerHTML = `<div class="imp__kpis">
        <div><small>Soma dos ${unicos.length} NCMs acompanhados</small><b>${usd(tot.a12.f)}</b><span>FOB em 12 meses, todos os usos</span></div>
        <div><small>Contra os 12 meses anteriores</small><b>${pct(tot.var)}</b><span>${usd(tot.p12.f)} antes</span></div>
        <div><small>Peso importado nesses NCMs</small><b>${ton(tot.a12.kg)}</b><span>${pkg(tot.a12.f / tot.a12.kg)} em média</span></div>
        ${china ? `<div><small>Participação da China</small><b>${pct(china.f / tot.a12.f, false)}</b><span>maior origem: ${esc(tot.pais[0].nome)}</span></div>` : ''}
      </div>
      <p class="imp__nota">Esta soma <b>não é o tamanho do mercado brasileiro de hidráulica</b>. Muitos NCMs abrangem também produtos de outros setores, como juntas e flexíveis automotivos, tubos para petróleo e gás e equipamentos industriais. Use o total como tendência das importações ligadas ao catálogo; para cada material, veja o quadro próprio e o aviso sobre o NCM.</p>`;
    $('impDestaques').innerHTML = `<div class="imp__ranks">
        <section><h3>Mais importados</h3><ol class="imp__cards">${maiores.map(cartao).join('')}</ol></section>
        <section><h3>Em alta</h3><p class="imp__mini">Maior crescimento contra os 12 meses anteriores (acima de US$ 1 milhão)</p><ol class="imp__cards">${altos.map(cartao).join('')}</ol></section>
        <section><h3>Em queda</h3><p class="imp__mini">Maior queda contra os 12 meses anteriores (acima de US$ 1 milhão)</p><ol class="imp__cards">${quedas.map(cartao).join('')}</ol></section>
      </div>`;
  }

  // ---------- busca e categorias ----------
  function busca() {
    const cats = [...new Set(MAT.filter(m => D.materiais[m.id]).map(m => m.cat))];
    $('impCats').innerHTML = `<button type="button" class="nt__chip" aria-pressed="true" data-c="">Todas</button>` + cats.map(c => `<button type="button" class="nt__chip" aria-pressed="false" data-c="${esc(c)}">${esc(c)}</button>`).join('');
    let cat = '';
    const cache = {}, valor = id => (cache[id] ??= agrega(D.materiais[id].ncm).a12.f);
    const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const lista = () => {
      const q = norm($('impBusca').value.trim());
      const it = MAT.filter(m => D.materiais[m.id] && (!cat || m.cat === cat) && (!q || norm(m.name + ' ' + D.materiais[m.id].ncm.join(' ') + ' ' + m.chaves).includes(q)));
      $('impLista').innerHTML = it.length ? it.map(m => `<li><a href="${'/importacoes/' + m.slug}" data-m="${m.id}">${esc(m.name)}<small>${usd(valor(m.id))}</small></a></li>`).join('') : '<li class="imp__vazio">Nenhuma ficha encontrada. Tente outro nome ou o código NCM.</li>';
    };
    $('impCats').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (!b) return; cat = b.dataset.c; $('impCats').querySelectorAll('.nt__chip').forEach(x => x.setAttribute('aria-pressed', x === b)); lista(); });
    $('impBusca').addEventListener('input', lista);
    lista();
  }

  // ---------- painel de um material ----------
  function detalhe(id, rolar) {
    const m = porId[id], c = D.materiais[id];
    if (!m || !c) { $('impDetalhe').hidden = true; $('impInicio').hidden = false; return; }
    const A = agrega(c.ncm);
    $('impInicio').hidden = true; const box = $('impDetalhe'); box.hidden = false;
    const preco = A.a12.kg ? A.a12.f / A.a12.kg : 0, frete = A.a12.f ? A.a12.cif / A.a12.f - 1 : 0;
    const top = A.pais.filter(p => p.kg > 0 && p.f / A.a12.f >= .01).slice(0, 10);
    const ufs = A.uf.slice(0, 10), urfs = A.urf.slice(0, 8);
    const tx = aliquotas(c.ncm);
    box.innerHTML = `
      <p class="imp__voltar"><a href="/importacoes" data-m="">← Todos os materiais</a></p>
      <p class="eyebrow">${esc(m.cat)} · NCM ${c.ncm.map(n => n.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')).join(', ')}</p>
      <h2 class="imp__h2">${esc(m.name)}</h2>
      ${c.nota ? `<p class="imp__nota">${esc(c.nota)}</p>` : ''}
      ${A.a12.f ? `<div class="imp__kpis">
        <div><small>Importado em 12 meses</small><b>${usd(A.a12.f)}</b><span>FOB, ${mesLongo(meses(D.ultimoMes, 12)[0])} a ${mesLongo(D.ultimoMes)}</span></div>
        <div><small>Contra os 12 meses anteriores</small><b class="imp__var--${(A.var || 0) >= 0 ? 'sobe' : 'desce'}">${A.var == null ? '—' : pct(A.var)}</b><span>${usd(A.p12.f)} antes</span></div>
        <div><small>Peso</small><b>${ton(A.a12.kg)}</b><span>preço médio ${pkg(preco)}</span></div>
        <div><small>Frete e seguro internacional</small><b>${pct(frete, false)}</b><span>sobre o valor FOB (CIF ${usd(A.a12.cif)})</span></div>
      </div>` : '<p class="imp__nota">Sem importação registrada nos últimos 12 meses.</p>'}
      <section class="imp__bloco"><h3>Importações por mês</h3><p class="imp__mini">Valor FOB em dólares, desde ${A.todos[0] ? mesLongo(A.todos[0]) : '—'}. O mês mais recente fica em laranja.</p><div id="impG1" class="imp__graf"></div></section>
      <div class="imp__duas">
        <section class="imp__bloco"><h3>Preço médio por kg</h3><p class="imp__mini">Valor FOB dividido pelo peso, mês a mês. Sobe com produtos mais caros ou com o dólar.</p><div id="impG2" class="imp__graf"></div></section>
        <section class="imp__bloco"><h3>Sazonalidade</h3><p class="imp__mini">Média de cada mês do ano, em percentual do total anual.</p><div id="impG3" class="imp__graf"></div></section>
      </div>
      <section class="imp__bloco"><h3>De onde vem</h3><p class="imp__mini">Países de origem nos últimos 12 meses, com o preço médio de cada um (acima de 1% do total).</p>
        ${barras(top, A.a12.f, p => ` <em class="imp__pk${p.f / p.kg < preco * .8 ? ' imp__pk--baixo' : p.f / p.kg > preco * 1.25 ? ' imp__pk--alto' : ''}">${pkg(p.f / p.kg)}</em>`)}
        <p class="imp__mini">Preço em verde: pelo menos 20% abaixo da média. Em laranja: pelo menos 25% acima. Preço médio por kg varia com o mix de diâmetros, ligas e acabamentos de cada país.</p></section>
      <div class="imp__duas">
        <section class="imp__bloco"><h3>Para onde vai</h3><p class="imp__mini">Estado da empresa importadora</p>${barras(ufs, A.a12.f)}</section>
        <section class="imp__bloco"><h3>Por onde entra</h3><p class="imp__mini">Porto, aeroporto ou fronteira de despacho</p>${barras(urfs, A.a12.f)}
          <p class="imp__vias">${A.via.slice(0, 4).map(v => `<span><b>${esc(v.nome)}</b> ${pct(v.f / A.a12.f, false)}</span>`).join('')}</p></section>
      </div>
      <section class="imp__bloco imp__sim"><h3>Simule um lote: quanto custa importar?</h3><p class="imp__mini">Preço FOB pela média de cada origem nos últimos 12 meses, frete e seguro pela média do material, e tributos pelas alíquotas oficiais do NCM. Não é cotação: o preço real depende de diâmetro, norma, marca, quantidade e do enquadramento fiscal da sua empresa.</p>
        <div class="imp__simcampos">
          <div><label for="impKg">Peso do lote (kg)</label><input id="impKg" type="number" min="1" step="1" inputmode="numeric" value="1000"></div>
          <div><label for="impOrig">Origem</label><select id="impOrig">${top.slice(0, 10).map(p => `<option>${esc(p.nome)}</option>`).join('')}</select></div>
          <div><label for="impDol">Dólar (R$)</label><input id="impDol" type="number" min="0" step="0.01" inputmode="decimal" value="${T ? T.ptax.valor.toFixed(4) : ''}"><small>${T ? `PTAX de venda de ${T.ptax.data.split('-').reverse().join('/')}` : 'Informe a cotação'}</small></div>
          <div><label for="impIcms">ICMS do estado de destino (%)</label><input id="impIcms" type="number" min="0" max="35" step="0.5" inputmode="decimal" value="18"><small>Alíquota interna do seu estado</small></div>
          <div><label for="impDesp">Despesas no Brasil (R$)</label><input id="impDesp" type="number" min="0" step="100" inputmode="numeric" value="0"><small>Despachante, armazenagem, frete até a obra</small></div>
        </div>
        <details class="imp__aliq"><summary>Alíquotas usadas (editáveis)</summary>
          <div class="imp__simcampos">
            <div><label for="impII">Imposto de Importação (%)</label><input id="impII" type="number" min="0" step="0.1" inputmode="decimal" value="${tx.ii ?? ''}"></div>
            <div><label for="impIPI">IPI (%)</label><input id="impIPI" type="number" min="0" step="0.1" inputmode="decimal" value="${tx.ipi ?? ''}"></div>
            <div><label for="impPis">PIS-Importação (%)</label><input id="impPis" type="number" min="0" step="0.01" inputmode="decimal" value="2.10"></div>
            <div><label for="impCof">COFINS-Importação (%)</label><input id="impCof" type="number" min="0" step="0.01" inputmode="decimal" value="9.65"></div>
            <div class="imp__check"><label><input id="impMar" type="checkbox"${(A.via[0] || {}).nome === 'Marítima' ? ' checked' : ''}> Transporte marítimo (AFRMM de 8% sobre o frete)</label></div>
          </div>
          <p class="imp__mini">${tx.txt}</p>
        </details>
        <div id="impSimRes"></div></section>
      <details class="imp__ncms"><summary>NCMs incluídos e tabela de dados</summary>
        <ul>${c.ncm.map(n => `<li><b>${n.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}</b> ${esc(D.ncm[n] || 'sem importação no período')}</li>`).join('')}</ul>
        <div class="ptable__wrap" tabindex="0" role="region" aria-label="Importações por mês"><table><thead><tr><th scope="col">Mês</th><th scope="col">FOB (US$)</th><th scope="col">Peso (kg)</th><th scope="col">US$/kg</th><th scope="col">CIF (US$)</th></tr></thead>
        <tbody>${[...A.todos].reverse().map(ym => { const [f, kg, cif] = A.s[ym]; return `<tr><th scope="row">${mesLongo(ym)}</th><td>${nf(f)}</td><td>${nf(kg)}</td><td>${kg ? nf(f / kg, 2) : '—'}</td><td>${nf(cif)}</td></tr>`; }).join('')}</tbody></table></div>
        <p><button type="button" class="btn btn--sm btn--ghost" id="impCsv">Baixar planilha (CSV)</button></p>
      </details>
      <div class="sheet__actions">
        <a class="btn" href="${'/materiais/' + m.slug}">Ficha técnica</a>
        <a class="btn btn--ghost" href="/?assunto=${encodeURIComponent('Cotação de materiais')}&msg=${encodeURIComponent(`Cotação de ${m.name} (vi no Radar de Importações): `)}#contato">Solicitar cotação</a>
        <button type="button" class="btn btn--ghost" id="impShare">Compartilhar</button>
      </div>`;

    // gráficos
    const serie = meses(D.ultimoMes, A.todos.length ? Math.max(12, mesesEntre(A.todos[0], D.ultimoMes)) : 12);
    const pts = serie.map(ym => { const x = A.s[ym]; return { x: ym, v: x ? x[0] : 0, dica: mesLongo(ym), destaque: ym === D.ultimoMes, extra: x ? `${ton(x[1])} · ${x[1] ? pkg(x[0] / x[1]) : ''}` : '' }; });
    grafico($('impG1'), pts, { titulo: `Importações mensais de ${m.name}`, marcaX: p => p.x.endsWith('-01'), rotulo: p => p.x.endsWith('-01') ? p.x.slice(0, 4) : mesTxt(p.x) });
    const pp = serie.map(ym => { const x = A.s[ym]; return { x: ym, v: x && x[1] ? x[0] / x[1] : null, dica: mesLongo(ym) }; });
    grafico($('impG2'), pp, { tipo: 'linha', fmt: v => pkg(v), titulo: `Preço médio por kg de ${m.name}`, marcaX: p => p.x.endsWith('-01'), rotulo: p => p.x.endsWith('-01') ? p.x.slice(0, 4) : mesTxt(p.x) });
    const anos = [...new Set(A.todos.map(ym => ym.slice(0, 4)))].filter(a => A.todos.filter(ym => ym.startsWith(a)).length === 12);
    const saz = MESES.map((nome, i) => { const v = anos.length ? anos.reduce((t, a) => { const totA = A.todos.filter(ym => ym.startsWith(a)).reduce((s, ym) => s + A.s[ym][0], 0); const x = A.s[`${a}-${String(i + 1).padStart(2, '0')}`]; return t + (x && totA ? x[0] / totA : 0); }, 0) / anos.length : 0; return { x: nome, v, dica: nome }; });
    grafico($('impG3'), saz, { fmt: v => `${nf(v * 100, 1)}%`, titulo: `Sazonalidade das importações de ${m.name}`, marcaX: () => true, rotulo: p => p.x });

    // simulador de custo nacionalizado
    const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const pctTxt = v => `${nf(v, v % 1 ? 2 : 0)}%`;
    const custo = (p, kg, o) => {
      const fob = kg * p.f / p.kg * o.dol, fs = fob * frete, va = fob + fs;               // valor aduaneiro (CIF) em reais
      const aII = MERCOSUL.has(p.nome) ? 0 : o.ii;
      const II = va * aII / 100, IPI = (va + II) * o.ipi / 100, PIS = va * o.pis / 100, COF = va * o.cof / 100;
      const AFRMM = o.mar ? fs * .08 : 0, SISC = 154.23;                                    // frete aproximado por frete + seguro
      const baseIcms = (va + II + IPI + PIS + COF + AFRMM + SISC) / (1 - o.icms / 100), ICMS = baseIcms * o.icms / 100;
      const total = va + II + IPI + PIS + COF + AFRMM + SISC + ICMS + o.desp;
      return { fob, fs, va, aII, II, IPI, PIS, COF, AFRMM, SISC, ICMS, total, trib: II + IPI + PIS + COF + AFRMM + SISC + ICMS };
    };
    const sim = () => {
      const n = id => Math.max(0, parseFloat(String($(id).value).replace(',', '.')) || 0);
      const kg = n('impKg'), o = { dol: n('impDol'), ii: n('impII'), ipi: n('impIPI'), pis: n('impPis'), cof: n('impCof'), icms: Math.min(n('impIcms'), 90), desp: n('impDesp'), mar: $('impMar').checked };
      if (!kg || !o.dol) { $('impSimRes').innerHTML = '<p class="imp__mini">Informe o peso e a cotação do dólar.</p>'; return; }
      const sel = top.find(p => p.nome === $('impOrig').value) || top[0], r = custo(sel, kg, o);
      const linha = (nome, v, nota = '') => `<tr><th scope="row">${nome}${nota ? ` <small>${nota}</small>` : ''}</th><td>${brl(v)}</td></tr>`;
      $('impSimRes').innerHTML = `
        <div class="imp__simres">
          <div class="imp__simtot"><small>Custo nacionalizado estimado · ${esc(sel.nome)}</small><b>${brl(r.total)}</b>
            <span>${brl(r.total / kg)} por kg · ${nf(r.total / r.fob, 2).replace(/,?0+$/, '')} vezes o valor FOB · tributos ${pct(r.trib / r.total, false)} do custo</span></div>
          <table class="imp__simt imp__simt--det"><tbody>
            ${linha('Mercadoria (FOB)', r.fob, `US$ ${nf(r.fob / o.dol)}`)}
            ${linha('Frete e seguro internacionais', r.fs, `${pct(frete, false)} do FOB, média do material`)}
            <tr class="imp__sub"><th scope="row">Valor aduaneiro (CIF)</th><td>${brl(r.va)}</td></tr>
            ${linha('Imposto de Importação', r.II, MERCOSUL.has(sel.nome) ? '0%: origem Mercosul, com certificado de origem' : pctTxt(r.aII))}
            ${linha('IPI', r.IPI, pctTxt(o.ipi))}
            ${linha('PIS-Importação', r.PIS, pctTxt(o.pis))}
            ${linha('COFINS-Importação', r.COF, pctTxt(o.cof))}
            ${o.mar ? linha('AFRMM', r.AFRMM, '8% sobre o frete marítimo') : ''}
            ${linha('Taxa Siscomex', r.SISC, '1 declaração com 1 adição')}
            ${linha('ICMS', r.ICMS, `${pctTxt(o.icms)}, calculado "por dentro"`)}
            ${o.desp ? linha('Despesas no Brasil', o.desp) : ''}
            <tr class="imp__tot"><th scope="row">Custo nacionalizado</th><td>${brl(r.total)}</td></tr>
          </tbody></table>
        </div>
        <h4 class="imp__simh">Comparando as origens</h4>
        <div class="ptable__wrap" tabindex="0" role="region" aria-label="Custo por origem"><table class="imp__simt"><thead><tr><th scope="col">Origem</th><th scope="col">FOB (US$)</th><th scope="col">CIF (US$)</th><th scope="col">Nacionalizado</th><th scope="col">Por kg</th></tr></thead>
        <tbody>${top.slice(0, 8).map(p => { const x = custo(p, kg, o); return `<tr${p === sel ? ' class="imp__sel"' : ''}><th scope="row">${esc(p.nome)}${MERCOSUL.has(p.nome) ? ' <small>Mercosul</small>' : ''}</th><td>${usd(x.fob / o.dol)}</td><td>${usd(x.va / o.dol)}</td><td>${brl(x.total)}</td><td>${brl(x.total / kg)}</td></tr>`; }).join('')}</tbody></table></div>
        <p class="imp__mini">Empresas do Lucro Real costumam recuperar IPI, PIS, COFINS e ICMS como crédito, e o custo efetivo fica menor. Ex-tarifários, regimes especiais (Drawback, Recof), acordos comerciais e benefícios estaduais também mudam a conta. Confirme com seu despachante.</p>`;
    };
    ['impKg', 'impOrig', 'impDol', 'impIcms', 'impDesp', 'impII', 'impIPI', 'impPis', 'impCof', 'impMar'].forEach(id => $(id).addEventListener('input', sim)); sim();

    $('impCsv').addEventListener('click', () => {
      const linhas = [['mes', 'ncm', 'fob_usd', 'peso_kg', 'cif_usd'].join(';')];
      for (const n of c.ncm) for (const [ym, f, kg, cif] of D.serie[n] || []) linhas.push([ym, n, f, kg, cif].join(';'));
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + linhas.join('\n')], { type: 'text/csv' })); a.download = `importacoes-${m.slug}.csv`; a.click();
      if (window.va) window.va('event', { name: 'imp_csv', data: { material: m.slug } });
    });
    $('impShare').addEventListener('click', async () => {
      const url = location.origin + '/importacoes/' + m.slug, texto = `Importações de ${m.name} no Brasil: ${usd(A.a12.f)} em 12 meses (${A.var == null ? '' : pct(A.var)}). Radar de Importações PipeSystem`;
      try { if (navigator.share) await navigator.share({ title: document.title, text: texto, url }); else { await navigator.clipboard.writeText(`${texto} ${url}`); $('impShare').textContent = 'Link copiado'; } } catch (e) { /* compartilhamento cancelado */ }
    });
    document.title = `Importação de ${/^[A-ZÀ-Ú][a-zà-ú]/.test(m.name) ? m.name[0].toLowerCase() + m.name.slice(1) : m.name} no Brasil | PipeSystem`;
    if (window.va) window.va('event', { name: 'imp_material', data: { material: m.slug } });
    if (rolar) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  const mesesEntre = (a, b) => (+b.slice(0, 4) - +a.slice(0, 4)) * 12 + (+b.slice(5) - +a.slice(5)) + 1;

  // ---------- navegação (/importacoes/<slug>; o antigo ?m=slug também vale), sem recarregar a página ----------
  const slugUrl = () => (location.pathname.match(/^\/importacoes\/([^/?#]+)/) || [])[1] || new URLSearchParams(location.search).get('m') || '';
  const tituloOriginal = document.title;
  const vai = (slug, rolar) => { const m = MAT.find(x => x.slug === slug); if (m) detalhe(m.id, rolar); else { $('impDetalhe').hidden = true; $('impInicio').hidden = false; document.title = tituloOriginal; } };
  raiz.addEventListener('click', e => {
    // na página própria de um material (/importacoes/<slug>), os links carregam a página nova (título e texto certos)
    const a = e.target.closest('a[data-m]'); if (!a || e.ctrlKey || e.metaKey || /^\/importacoes\/./.test(location.pathname)) return;
    e.preventDefault(); const m = porId[a.dataset.m];
    history.pushState(null, '', m ? '/importacoes/' + m.slug : '/importacoes'); vai(m ? m.slug : '', true);
  });
  addEventListener('popstate', () => vai(slugUrl()));

  Promise.all([fetch('/importacoes-dados.json').then(r => r.json()), fetch('/importacoes-tarifas.json').then(r => r.ok ? r.json() : null).catch(() => null)]).then(([j, t]) => {
    D = j; T = t; porId = Object.fromEntries(MAT.map(m => [m.id, m]));
    $('impData').textContent = `Dados até ${mesLongo(D.ultimoMes)} · atualizado pelo MDIC em ${D.atualizado.split('-').reverse().join('/')}`;
    destaques(); busca();
    vai(slugUrl());
    raiz.classList.add('imp--pronto');
  }).catch(() => { $('impData').textContent = 'Não foi possível carregar os dados agora. Tente recarregar a página.'; });
})();
