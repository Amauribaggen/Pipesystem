// ===== Comparativo de Preços: preços coletados à mão em lojas on-line (coleta em 01/11/2026) =====
// sinapi = insumo do SINAPI equivalente (site/sinapi-precos.js); fator = quantas unidades do insumo formam o item (ex.: 6 m de tubo).
// preco = o menor valor mostrado na página da loja na coleta, sem frete; obs = condição desse valor.
const LOJAS_PRECOS = { leroy: 'Leroy Merlin', telha: 'Telhanorte', amazon: 'Amazon', magalu: 'Magazine Luiza', mecanico: 'Loja do Mecânico' };
const PRECOS_LOJA_URL = { leroy: 'https://www.leroymerlin.com.br', telha: 'https://www.telhanorte.com.br', amazon: 'https://www.amazon.com.br', magalu: 'https://www.magazineluiza.com.br', mecanico: 'https://www.lojadomecanico.com.br' };
const PRECOS = {
  coleta: '01/11/2026',
  itens: [
    { id: 'tubo-pvc-25', nome: 'Tubo de PVC soldável 25 mm, barra de 6 m', cat: 'Tubos', sinapi: { cod: 9868, fator: 6 },
      chaves: ['cano', 'água fria', 'marrom', '3/4'],
      ofertas: [
        ['leroy', 'Cano Soldável Marrom 6 m 25 mm Tigre', 26.90, '', '/cano-soldavel-marrom-6m-25mm-3-4-tigre_88018343'],
        ['telha', 'Tubo Soldável de PVC 25 mm com 6 m Tigre', 38.90, '', '/tubo-soldavel-6-00m-25mm-tigre-23701/p'],
        ['magalu', 'Tubo Soldável PVC 25 mm Marrom 6 m Plastubos', 53.90, '', '/tubo-soldavel-pvc-25mm-marrom-6m-resistente-a-750-kpa-plastubos/p/ffd87ka306/cj/cohl/'],
        ['magalu', 'Tubo Soldável em PVC Marrom 25 mm 6 m Tigre', 79.90, '', '/tubo-soldavel-em-pvc-marrom-25mm-6m-tigre/p/fk9ja70dka/cj/tuch/'],
      ] },
    { id: 'joelho-25', nome: 'Joelho 90° de PVC soldável 25 mm', cat: 'Conexões', sinapi: { cod: 3529, fator: 1 },
      chaves: ['cotovelo', 'conexão', 'água fria', 'marrom'],
      ofertas: [
        ['telha', 'Joelho 90° Soldável em PVC 25 mm Krona', 0.84, 'no Pix', '/joelho-90-soldavel-pvc-25mm-2393646/p'],
        ['leroy', 'Joelho PVC Soldável 90° 25 mm Amanco', 0.90, '', '/joelho-pvc-soldavel-90-25mm-amanco_1572910679'],
        ['telha', 'Joelho 90° Soldável 25 mm Tigre', 1.09, '', '/joelho-90-soldavel-25mm-tigre-22888/p'],
        ['leroy', 'Joelho 90° PVC Marrom Solda 25 mm Tigre', 1.39, 'à vista', '/joelho-90o-pvc-marrom-soldavel-3-4-25mm-tigre_85307075'],
      ] },
    { id: 'registro-gaveta-34', nome: 'Registro de gaveta bruto 3/4"', cat: 'Válvulas', sinapi: { cod: 6016, fator: 1 },
      chaves: ['base', 'latão', 'válvula de gaveta', 'dn 20'],
      ofertas: [
        ['telha', 'Base Registro de Gaveta 3/4" Deca', 54.90, '', '/base-para-registro-de-gaveta-34-4509-202-deca-336971/p'],
        ['amazon', 'Registro de gaveta 3/4" DN 20 Deca, bruto, 1510.HD.034', 60.31, '', '/dp/B076PNGXZ9'],
        ['telha', 'Registro de Gaveta Base 3/4" Docol', 67.12, 'no Pix', '/registro-de-gaveta-base-34-docol-81914/p'],
        ['telha', 'Registro de Gaveta ABNT 3/4" Docol', 99.90, '', '/registro-de-gaveta-bruto-34-docol-144266/p'],
        ['telha', 'Registro de Gaveta Uso Semi Industrial 3/4" Deca', 109.90, '', '/registro-de-gaveta-uso-semi-industrial-34-dn20-bruto-deca-18821/p'],
      ] },
    { id: 'caixa-1000', nome: 'Caixa d\'água de polietileno 1.000 litros', cat: 'Reservatórios', sinapi: { cod: 34636, fator: 1 },
      chaves: ['caixa dagua', 'caixa de agua', '1000 litros', '1000l', 'reservatório', 'tanque', 'fortlev', 'acqualimp', 'tampa'],
      ofertas: [
        ['leroy', 'Caixa d\'Água 1.000 L em Polietileno Azul Sultanques', 429.90, '', '/caixa-dagua-1-000l-em-polietileno-azul-sultanques_92385244'],
        ['mecanico', 'Caixa d\'Água Polietileno 1000 Litros Fortlev', 468.90, 'no Pix ou boleto', '/produto/603929/31/1021/caixa-dagua-polietileno-1000-litros-fortlev'],
        ['leroy', 'Caixa d\'Água 1.000 L Polietileno Fortlev', 469.90, '', '/caixa-dagua-1-000l-em-polietileno-fortlev_89866630'],
        ['telha', 'Caixa d\'Água 1000 Litros +Green em Polietileno Acqualimp', 479.90, '', '/caixa-de-aguagreen-1000-litros-acqualimp-2365006/p'],
        ['magalu', 'Caixa d\'água Fortlev plástico 1000 litros', 639.90, '', '/caixa-d-agua-fortlev-plastico-1000-litros/p/gbcgg85g2j/cj/cxda/'],
        ['amazon', 'Caixa Água Tanque Polietileno Tecnipar 1000 Litros', 702.90, '', '/dp/B0HJRX5P8J'],
      ] },
    { id: 'adesivo-175', nome: 'Adesivo plástico para PVC, frasco de 175 g', cat: 'Acessórios', sinapi: { cod: 20080, fator: 1 },
      chaves: ['cola', 'cola de cano', 'solda'],
      ofertas: [
        ['leroy', 'Adesivo para PVC Frasco 175 g Krona', 16.91, 'no Pix', '/adesivo-p--p-v-c--frasco-175g--krona-_1571987621'],
        ['telha', 'Adesivo para PVC Incolor Tigre 175 g', 22.90, '', '/adesivo-de-pvc-incolor-frasco-175g-tigre-290343/p'],
        ['telha', 'Adesivo Plástico para PVC 175 g com Pincel Krona', 27.90, '', '/adesivo-plastico-175g-com-pincel-krona-2366347/p'],
        ['amazon', 'Adesivo PVC Incolor Frasco 175 g Tigre', 43.22, '', '/dp/B0G6FBQ1XT'],
      ] },
    { id: 'fita-veda-18-25', nome: 'Fita veda-rosca 18 mm x 25 m', cat: 'Acessórios', sinapi: { cod: 3143, fator: 1 },
      chaves: ['ptfe', 'teflon', 'vedação', 'rosca'],
      ofertas: [
        ['amazon', 'Fita Veda-Rosca 18 mm x 25 m Vonder', 6.35, '', '/dp/B07JW7XYWG'],
        ['leroy', 'Fita Veda Rosca 18 mm x 25 m Tigre', 6.90, '', '/fita-veda-rosca-18mmx25m-tigre_85302861'],
        ['amazon', 'Fita Veda Rosca Carretel 18 mm x 25 m Vedah Pró', 7.17, '', '/dp/B0FJC3HT2F'],
        ['leroy', 'Fita Veda Rosca 18 mm x 25 m Equation', 9.79, '', '/fita-veda-rosca-18mm-x-25m-equation_91875042'],
        ['telha', 'Fita Veda Rosca Tigre 18 mm x 25 m', 11.90, '', '/fita-veda-rosca-18mmx25m-tigre-24481/p'],
        ['amazon', 'Fita Veda Rosca 18 mm x 25 m Amanco', 20.27, '', '/dp/B07X4BGNXB'],
      ] },
    { id: 'tubo-esgoto-100', nome: 'Tubo de PVC para esgoto 100 mm, barra de 6 m', cat: 'Tubos', sinapi: { cod: 9836, fator: 6 },
      chaves: ['cano', 'série normal', 'esgoto primário', 'dn 100', '4 polegadas'],
      ofertas: [
        ['leroy', 'Cano PVC para Esgoto 100 mm 6 m Tigre', 124.90, '', '/cano-pvc-para-esgoto-100mm-ou-4-6m-tigre_85227786'],
        ['telha', 'Tubo de Esgoto Primário Tigre 100 mm x 6 m', 146.90, '', '/tubo-de-esgoto-primario-6m-100mm-tigre-23620/p'],
        ['magalu', 'Tubo para Esgoto PVC 6 m DN 100 mm Plastilit', 196.90, '', '/tubo-para-esgoto-pvc-6m-dn-100mm-plastilit-7898067902268/p/deg70daa78/cj/aceh/'],
        ['magalu', 'Tubo para Esgoto Série Normal PVC 100 mm 6 m Tigre', 278.89, '', '/tubo-para-esgoto-serie-normal-pvc-100mm-6m-branco-tigre/p/ke0f9hc1hc/cj/tues/'],
      ] },
    { id: 'caixa-sifonada-150', nome: 'Caixa sifonada de PVC 150 x 150 x 50 mm', cat: 'Conexões', sinapi: { cod: 11712, fator: 1 },
      chaves: ['ralo', 'esgoto', 'grelha', 'sifão'],
      ofertas: [
        ['leroy', 'Caixa Sifonada Herc Grelha Redonda 150 x 150 x 50 mm', 45.95, '', '/caixa-sifonada-herc-grelha-redonda-150x150x50mm_1567515324'],
        ['amazon', 'Caixa Sifonada Quadrada 150 x 150 x 50 mm Krona', 49.42, '', '/dp/B07F2XVD6Z'],
        ['amazon', 'Caixa Sifonada Tigre Quadrada Branco 150 x 150 x 50 mm', 55.95, '', '/dp/B076PV6813'],
        ['telha', 'Caixa Sifonada para Grelha Quadrada 150 x 150 x 50 Branco Tigre', 80.18, 'no Pix', '/caixa-sifonada-para-grelha-quadrada-150x150x50-101-brancotigre-358240/p'],
        ['leroy', 'Caixa Sifonada 150 x 150 x 50 Quadrada Branca Único', 86.03, '', '/caixa-sifonada-150x150x50-quadrada-branca-unico_1567515323'],
      ] },
    { id: 'tubo-cpvc-22', nome: 'Tubo de CPVC 22 mm, barra de 3 m', cat: 'Tubos', sinapi: { cod: 21124, fator: 3 },
      chaves: ['aquatherm', 'água quente', 'cano'],
      ofertas: [
        ['telha', 'Tubo CPVC Aquatherm 22 mm 3 m Tigre', 59.90, '', '/tubo-cpvc-aquatherm-22mm-7002-tigre-271896/p'],
        ['magalu', 'Tubo Aquatherm para Aquecimento CPVC 22 mm 3 m Tigre', 133.50, '', '/tubo-e-conexao-aquatherm-para-aquecimento-cpvc-22mm-3m-tigre/p/fb325251g8/cj/aceh/'],
        ['magalu', 'Tubo em CPVC Aquatherm 22 mm 3 m Tigre', 148.90, '', '/tubo-em-cpvc-aquatherm-22mm-3m-tigre/p/bhf84ed13b/cj/aceh/'],
      ] },
    { id: 'tubo-ppr-25', nome: 'Tubo de PPR PN 20, 25 mm, barra de 3 m', cat: 'Tubos', sinapi: { cod: 36278, fator: 3 },
      chaves: ['polipropileno', 'termofusão', 'água quente', 'cano'],
      ofertas: [
        ['telha', 'Tubo PPR PN 20, 25 mm x 3 m Tigre', 62.92, 'no Pix', '/tubo-ppr-pn-20-25mm-3m-tigre-2293005/p'],
        ['amazon', 'Tubo PPR PN 20, 25 mm x 3 m Amanco', 91.10, '', '/dp/B0DY77B4HW'],
      ] },
    { id: 'torneira-boia-34', nome: 'Torneira de boia 3/4" para caixa d\'água', cat: 'Válvulas', sinapi: { cod: 11830, fator: 1 },
      chaves: ['boia', 'bóia', 'caixa dagua', 'reservatório', 'nível'],
      ofertas: [
        ['leroy', 'Torneira Boia para Caixa d\'Água 1/2" e 3/4" Cipla', 13.90, '', '/torneira-boia-para-caixa-dagua-1-2-e-3-4-cipla_1571893720'],
        ['telha', 'Torneira Boia 3/4" Haste Alumínio Astra', 20.90, '', '/torneira-boia-34-caixa-dagua-haste-aluminio-astra-1024587/p'],
        ['amazon', 'Torneira de Boia Neo 3/4" e 1/2"', 22.50, '', '/dp/B0CBN76MQJ'],
        ['amazon', 'Torneira de Boia 3/4" com Haste de Metal Tigre', 28.84, '', '/dp/B076PMJ3DV'],
        ['amazon', 'Torneira de Boia 1/2" e 3/4" Censi', 72.96, '', '/dp/B0C5MWLD96'],
      ] },
  ],
};

// ===== Painel (aba Preços de Guias práticos) =====
(() => {
  if (typeof document === 'undefined') return;   // carregado também no gerador das páginas (Node)
  const grid = document.getElementById('precoGrid');
  if (!grid) return;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pct = (v, min) => {
    const p = (v / min - 1) * 100;
    return '+' + p.toLocaleString('pt-BR', { maximumFractionDigits: p < 10 ? 1 : 0, minimumFractionDigits: p < 10 ? 1 : 0 }) + '%';
  };
  const st = { q: '', uf: 'SP' };

  // Preço SINAPI do item no estado escolhido (coluna do estado no insumo, igual ao bom.js)
  const sinapi = it => {
    if (typeof SINAPI_PRECOS === 'undefined') return null;
    const ins = SINAPI_PRECOS.ins[it.sinapi.cod], i = SINAPI_PRECOS.ufs.indexOf(st.uf);
    if (!ins || i < 0 || !ins[2 + i]) return null;
    const uni = ins[2 + i], f = it.sinapi.fator;
    return { sinapi: true, preco: Math.round(uni * f * 100) / 100,
      produto: `Referência SINAPI: insumo ${it.sinapi.cod}`,
      obs: `${SINAPI_PRECOS.ref}, ${st.uf}${f > 1 ? `, ${f} ${ins[1].toLowerCase()} a ${brl(uni)}` : ''}`,
      url: SINAPI_PRECOS.fonte, loja: 'SINAPI (Caixa)' };
  };
  const linhas = it => [
    ...it.ofertas.map(([l, produto, preco, obs, path]) => ({ loja: LOJAS_PRECOS[l], produto, preco, obs, url: PRECOS_LOJA_URL[l] + path })),
    sinapi(it),
  ].filter(Boolean).sort((a, b) => a.preco - b.preco);

  const painel = it => {
    const ls = linhas(it), min = ls[0].preco;
    return `<article class="preco" id="preco-${it.id}">
      <header class="preco__head"><span class="preco__cat">${it.cat}</span><h3>${it.nome}</h3></header>
      <ol class="preco__lista">${ls.map((x, i) => `
        <li class="preco__linha${i === 0 ? ' preco__linha--menor' : ''}${x.sinapi ? ' preco__linha--sinapi' : ''}">
          <a class="preco__prod" href="${x.url}" target="_blank" rel="noopener noreferrer"><span class="preco__nome">${x.produto}</span>
            <small>${x.loja}${x.obs ? ' · ' + x.obs : ''} ↗</small></a>
          <strong class="preco__valor">${brl(x.preco)}</strong>
          <span class="preco__pct">${x.preco === min ? 'Menor preço' : pct(x.preco, min)}</span>
        </li>`).join('')}
      </ol>
    </article>`;
  };

  function render() {
    const list = PRECOS.itens.filter(it => !st.q || matchText([it.nome, it.cat, ...it.chaves, ...it.ofertas.map(o => o[1] + ' ' + LOJAS_PRECOS[o[0]])].join(' '), queryTerms(st.q)));
    document.getElementById('precoCount').textContent = `${list.length} de ${PRECOS.itens.length} itens · coleta em ${PRECOS.coleta}`;
    grid.innerHTML = list.length ? list.map(painel).join('') : '<p class="bim__empty">Nenhum item com essa busca.</p>';
  }

  document.getElementById('precoBusca').addEventListener('input', e => { st.q = norm(e.target.value.trim()); render(); });
  const sel = document.getElementById('precoUf');
  sel.addEventListener('change', () => { st.uf = sel.value; render(); });
  render();
  // Base SINAPI: script.js carrega em Guias práticos e avisa; o painel é refeito com a linha de referência
  document.addEventListener('ferramentas-prontas', () => {
    if (typeof SINAPI_PRECOS === 'undefined') return;
    sel.innerHTML = SINAPI_PRECOS.ufs.map(u => `<option value="${u}"${u === st.uf ? ' selected' : ''}>${u}</option>`).join('');
    document.getElementById('precoRef').textContent = `SINAPI ${SINAPI_PRECOS.ref}, preço mediano na capital do estado, sem desoneração`;
    render();
  });
})();
