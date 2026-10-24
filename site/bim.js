// ===== Biblioteca BIM/CAD: onde baixar os arquivos oficiais de cada fabricante (links conferidos em 23 e 24/10/2026) =====
// O PipeSystem não hospeda os arquivos: indica a fonte oficial. mats = ids do CATALOG (a ficha do material mostra o quadro "Arquivos BIM/CAD").
const BIM_LIBS = [
  { nome: 'Tigre', orig: 'N', cat: ['Água fria e quente', 'Esgoto e pluvial', 'Drenagem'],
    desc: 'Plugin TigreBIM para Revit e AutoCAD, com inserção e quantitativo de produtos, mais catálogos em DWG 2D, DWG 3D e Revit. Tubos corrugados ADS de drenagem também no BIMobject.',
    fmts: ['Revit', 'DWG', 'Plugin'], acesso: 'Gratuito, com login',
    mats: ['mat-pvc', 'mat-conexoes-pvc', 'mat-cpvc', 'mat-conexoes-cpvc', 'mat-ppr', 'mat-ralos', 'mat-reservatorios', 'mat-pe'],
    links: [['Tigre BIM', 'https://www.tigre.com.br/tigre-bim', 'site oficial'], ['Tubos ADS Tigre', 'https://www.bimobject.com/pt-br/tigre-ads', 'BIMobject']] },
  { nome: 'Amanco Wavin', orig: 'N', cat: ['Água fria e quente', 'Esgoto e pluvial'],
    desc: 'Portal BIM com bibliotecas Revit de água fria, esgoto, FlowGuard CPVC e PPR, plugin para Revit e rotinas Dynamo. Parte do catálogo também está no BIMobject.',
    fmts: ['Revit', 'Plugin', 'Dynamo'], acesso: 'Gratuito, com cadastro',
    mats: ['mat-pvc', 'mat-conexoes-pvc', 'mat-cpvc', 'mat-conexoes-cpvc', 'mat-ppr', 'mat-pe', 'mat-reservatorios'],
    links: [['Portal BIM Amanco Wavin', 'https://bim.amanco.com.br/', 'site oficial'], ['Amanco Wavin', 'https://www.bimobject.com/pt-br/amanco-wavin', 'BIMobject']] },
  { nome: 'Krona', orig: 'N', cat: ['Água fria e quente', 'Esgoto e pluvial'],
    desc: 'Krona BIM: plugin para Revit e AutoCAD e catálogo com download de arquivos em DWG 2D, DWG 3D e Revit, com busca por produto e categoria (água fria, água quente, esgoto e acessórios).',
    fmts: ['Revit', 'DWG', 'Plugin'], acesso: 'Gratuito',
    mats: ['mat-pvc', 'mat-conexoes-pvc', 'mat-cpvc', 'mat-conexoes-cpvc', 'mat-pvc-esgoto', 'mat-pvc-agua', 'mat-cavaletes'],
    links: [['Krona BIM', 'https://www.krona.com.br/bim/', 'site oficial']] },
  { nome: 'Tupy', orig: 'N', cat: ['Água fria e quente', 'Gás', 'Incêndio', 'Industrial'],
    desc: 'Plugin TupyCAD para AutoCAD com o portfólio de conexões de ferro maleável e perfis, desenhos 2D e 3D e dados técnicos, e Biblioteca Técnica com arquivos BIM/CAD, catálogos, manuais e tabelas.',
    fmts: ['DWG', 'Plugin'], acesso: 'Gratuito',
    mats: ['mat-galv'],
    links: [['TupyCAD (plugin AutoCAD)', 'https://conexoes.tupy.com.br/pt/tupycad', 'site oficial'], ['Biblioteca Técnica (BIM/CAD)', 'https://conexoes.tupy.com.br/pt/biblioteca', 'site oficial']] },
  { nome: 'Lorenzetti', orig: 'N', cat: ['Metais e louças', 'Aquecimento'],
    desc: 'LorenCAD: arquivos CAD de duchas e chuveiros elétricos, louças e metais sanitários, com busca por linha e modelo.',
    fmts: ['DWG'], acesso: 'Gratuito',
    mats: ['mat-metais'],
    links: [['LorenCAD', 'https://www.lorenzetti.com.br/downloads/lorencad', 'site oficial']] },
  { nome: 'Fortlev', orig: 'N', cat: ['Esgoto e pluvial', 'Água fria e quente'],
    desc: 'Arquivos CAD e BIM de caixas d\'água, tanques, caixas de inspeção, fossas e linha de esgoto, enviados ao projetista por solicitação pelo site.',
    fmts: ['DWG', 'Revit'], acesso: 'Gratuito, sob solicitação', varia: true,
    mats: ['mat-reservatorios', 'mat-caixas-inspecao', 'mat-fossa', 'mat-agua-chuva', 'mat-pvc-esgoto'],
    links: [['Downloads Fortlev (solicitar CAD/BIM)', 'https://www.fortlev.com.br/downloads/', 'site oficial']] },
  { nome: 'Rinnai', orig: 'N', cat: ['Aquecimento', 'Gás'],
    desc: 'Conteúdos BIM de aquecedores a gás de passagem, aquecedores elétricos de acumulação e sistemas de recirculação, com download por modelo.',
    fmts: ['Revit'], acesso: 'Gratuito', varia: true,
    mats: ['mat-caldeiras'],
    links: [['Conteúdos BIM Rinnai', 'https://www.rinnai.com.br/bim/', 'site oficial']] },
  { nome: 'Docol', orig: 'N', cat: ['Metais e louças'],
    desc: 'Plugin com toda a biblioteca de produtos e arquivos para uso offline em Revit, AutoCAD e SketchUp: torneiras, registros, chuveiros e válvulas de descarga.',
    fmts: ['Revit', 'DWG', 'SketchUp', 'Plugin'], acesso: 'Gratuito',
    mats: ['mat-registros', 'mat-esfera'],
    links: [['Downloads Docol', 'https://www.docol.com.br/br/downloads', 'site oficial']] },
  { nome: 'Deca', orig: 'N', cat: ['Metais e louças'],
    desc: 'Metais sanitários, registros e louças em objetos BIM publicados no BIMobject.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-registros', 'mat-esfera'],
    links: [['Deca', 'https://www.bimobject.com/pt-br/deca', 'BIMobject']] },
  { nome: 'Saint-Gobain PAM', orig: 'I', cat: ['Adução e saneamento'],
    desc: 'Famílias Revit de tubos, conexões, válvulas e acessórios de ferro fundido dúctil, de DN 60 a DN 2000, com revestimento e tipo de junta como parâmetros. Site do grupo, em inglês.',
    fmts: ['Revit'], acesso: 'Gratuito',
    mats: ['mat-ferro', 'mat-ventosas'],
    links: [['PAM BIM Library', 'https://www.pamline.com/bim-library', 'site do grupo']] },
  { nome: 'GF Piping Systems', orig: 'I', cat: ['Industrial', 'Adução e saneamento'],
    desc: 'Válvulas, tubos e conexões plásticas industriais (PVC-U, PP e PE), incluindo a linha ecoFIT.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-pe', 'mat-valvulas'],
    links: [['GF Piping Systems', 'https://www.bimobject.com/pt-br/gf-piping-system', 'BIMobject']] },
  { nome: 'Viega', orig: 'I', cat: ['Água fria e quente', 'Gás'],
    desc: 'Conexões de prensar em cobre, bronze e inox, e sistemas de instalação predial.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-conexoes-cobre', 'mat-latao'],
    links: [['Viega', 'https://www.bimobject.com/pt-br/viega', 'BIMobject']] },
  { nome: 'Victaulic', orig: 'I', cat: ['Incêndio', 'Industrial'],
    desc: 'Acoplamentos e conexões ranhuradas, válvulas e sprinklers para combate a incêndio e utilidades.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-ranhurado', 'mat-grooved', 'mat-sprinklers'],
    links: [['Victaulic', 'https://www.bimobject.com/pt-br/victaulic', 'BIMobject']] },
  { nome: 'Grundfos', orig: 'I', cat: ['Bombeamento'],
    desc: 'Bombas centrífugas, pressurizadores e conjuntos de recalque com dimensões e conexões reais.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-bombas', 'mat-pressurizadores'],
    links: [['Grundfos', 'https://www.bimobject.com/pt-br/grundfos', 'BIMobject']] },
  { nome: 'KSB', orig: 'I', cat: ['Bombeamento', 'Industrial'],
    desc: 'Bombas e válvulas industriais e prediais.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-bombas', 'mat-gaveta'],
    links: [['KSB', 'https://www.bimobject.com/pt-br/ksb', 'BIMobject']] },
  { nome: 'Armacell', orig: 'I', cat: ['Isolamento'],
    desc: 'Isolamento elastomérico de tubulações de água quente, água gelada e refrigeração.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-isolamento'],
    links: [['Armacell', 'https://www.bimobject.com/pt-br/armacell', 'BIMobject']] },  { nome: 'Uponor', orig: 'I', cat: ['Água fria e quente', 'Aquecimento'],
    desc: 'Uponor BIM Platform: biblioteca de objetos, plugins e serviços de modelagem para PEX, multicamada e piso radiante. Site em inglês.',
    fmts: ['Revit', 'IFC', 'Plugin'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-pex', 'mat-multicamada'],
    links: [['Uponor BIM Platform', 'https://www.uponor.com/en-en/planner-support/bim-platform', 'site oficial']] },
  { nome: 'Viking', orig: 'I', cat: ['Incêndio'],
    desc: 'Famílias Revit e barra de ferramentas para projetar com sprinklers e válvulas de incêndio. Site em inglês.',
    fmts: ['Revit', 'Plugin'], acesso: 'Gratuito, com cadastro',
    mats: ['mat-sprinklers', 'mat-ranhurado'],
    links: [['Famílias Revit Viking', 'https://www.vikinggroupinc.com/digital/viking-design-tools/revit-families', 'site oficial']] },
  { nome: 'GROHE', orig: 'I', cat: ['Metais e louças'],
    desc: 'Torneiras, misturadores, chuveiros e sistemas de descarga em objetos BIM.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-metais'], links: [['GROHE', 'https://www.bimobject.com/pt-br/grohe', 'BIMobject']] },
  { nome: 'hansgrohe', orig: 'I', cat: ['Metais e louças'],
    desc: 'Metais, chuveiros e louças em objetos BIM.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-metais'], links: [['hansgrohe', 'https://www.bimobject.com/pt-br/hansgrohe', 'BIMobject']] },
  { nome: 'aquatherm', orig: 'I', cat: ['Água fria e quente', 'Industrial'],
    desc: 'Tubos e conexões de PP-R e PP-RCT para água fria e quente, climatização e uso industrial.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-ppr'], links: [['aquatherm', 'https://www.bimobject.com/pt-br/aquatherm', 'BIMobject']] },
  { nome: 'Caleffi', orig: 'I', cat: ['Água fria e quente', 'Aquecimento'],
    desc: 'Válvulas de by-pass, misturadoras termostáticas, redutoras e componentes para sistemas hidrônicos.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-redutora', 'mat-vasos-expansao'], links: [['Caleffi', 'https://www.bimobject.com/pt-br/caleffi', 'BIMobject']] },
  { nome: 'Watts', orig: 'I', cat: ['Água fria e quente', 'Industrial'],
    desc: 'Válvulas de esfera, borboleta, redutoras e de proteção contra refluxo, inclusive linhas sanitárias.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-redutora', 'mat-esfera', 'mat-borboleta'], links: [['Watts', 'https://www.bimobject.com/pt-br/watts', 'BIMobject']] },
  { nome: 'Danfoss', orig: 'I', cat: ['Industrial', 'Aquecimento'],
    desc: 'Válvulas solenoides, de controle e de balanceamento para utilidades, aquecimento e refrigeração.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-solenoides'], links: [['Danfoss', 'https://www.bimobject.com/pt-br/danfoss', 'BIMobject']] },
  { nome: 'Tyco', orig: 'I', cat: ['Incêndio'],
    desc: 'Sprinklers, válvulas e acoplamentos para sistemas de combate a incêndio.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-sprinklers', 'mat-ranhurado'], links: [['Tyco', 'https://www.bimobject.com/pt-br/tyco', 'BIMobject']] },
  { nome: 'Reliable', orig: 'I', cat: ['Incêndio'],
    desc: 'Sprinklers residenciais, de controle e ESFR em objetos BIM.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-sprinklers'], links: [['Reliable Sprinkler', 'https://www.bimobject.com/pt-br/reliable', 'BIMobject']] },
  { nome: 'NIBCO', orig: 'I', cat: ['Água fria e quente', 'Industrial'],
    desc: 'Conexões de cobre e bronze, válvulas e conexões de prensar.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-conexoes-cobre'], links: [['NIBCO', 'https://www.bimobject.com/pt-br/nibco', 'BIMobject']] },
  { nome: 'ASC Engineered Solutions', orig: 'I', cat: ['Incêndio', 'Industrial'],
    desc: 'Linhas Anvil e Gruvlok: conexões de ferro maleável, conexões e acoplamentos ranhurados e suportes de tubulação.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-galv', 'mat-ranhurado', 'mat-suportes'], links: [['ASC Engineered Solutions', 'https://www.bimobject.com/pt-br/asc-engineered-solutions', 'BIMobject']] },
  { nome: 'Walraven', orig: 'I', cat: ['Suportes e fixação'],
    desc: 'Abraçadeiras, perfis e sistemas de fixação de tubulações em objetos BIM.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-suportes'], links: [['Walraven', 'https://www.bimobject.com/pt-br/walraven', 'BIMobject']] },
  { nome: 'Hilti', orig: 'I', cat: ['Suportes e fixação', 'Incêndio'],
    desc: 'Sistemas de suportação MT para instalações, ancoragens e soluções corta-fogo.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-suportes', 'mat-corta-fogo'], links: [['Hilti', 'https://www.bimobject.com/pt-br/hilti', 'BIMobject']] },
  { nome: 'Genebre', orig: 'I', cat: ['Água fria e quente', 'Industrial'],
    desc: 'Válvulas de esfera, borboleta e retenção, e válvulas com atuador.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-esfera', 'mat-borboleta', 'mat-retencao'], links: [['Genebre', 'https://www.bimobject.com/pt-br/genebre', 'BIMobject']] },
  { nome: 'Plasson', orig: 'I', cat: ['Adução e saneamento', 'Gás'],
    desc: 'Conexões de polietileno de eletrofusão e de compressão para água e gás.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-conexoes-pe'], links: [['Plasson', 'https://www.bimobject.com/pt-br/plasson', 'BIMobject']] },
  { nome: 'Ebara', orig: 'I', cat: ['Bombeamento'],
    desc: 'Bombas centrífugas, multiestágio e conjuntos de pressurização (página da Ebara Europa, do mesmo grupo da Ebara Brasil).',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-bombas', 'mat-pressurizadores'], links: [['EBARA Pumps Europe', 'https://www.bimobject.com/pt-br/ebara', 'BIMobject']] },
  { nome: 'Alfa Laval', orig: 'I', cat: ['Aquecimento', 'Industrial'],
    desc: 'Trocadores de calor a placas e brasados para aquecimento, climatização e processos.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-caldeiras'], links: [['Alfa Laval', 'https://www.bimobject.com/pt-br/alfa-laval', 'BIMobject']] },
  { nome: 'Endress+Hauser', orig: 'I', cat: ['Medição', 'Industrial'],
    desc: 'Medidores de vazão, pressão, nível e temperatura para processos e utilidades.',
    fmts: ['Revit', 'IFC', 'DWG'], acesso: 'Gratuito, com cadastro', varia: true,
    mats: ['mat-medidores'], links: [['Endress+Hauser', 'https://www.bimobject.com/pt-br/endress-hauser', 'BIMobject']] },
];

const BIM_PLATFORMS = [
  { nome: 'Plataforma BIM BR (BNBIM)', url: 'https://plataformabimbr.abdi.com.br/', tag: 'Governo federal',
    desc: 'Biblioteca Nacional BIM, mantida pela ABDI. Busca por categoria e fabricante, regulamento técnico e tabela de nomenclatura de objetos.' },
  { nome: 'BIMobject', url: 'https://www.bimobject.com/pt-br', tag: 'Gratuito',
    desc: 'Maior portal de objetos de fabricantes, com muitas marcas brasileiras. Download gratuito com cadastro, em vários formatos.' },
  { nome: 'MEPcontent', url: 'https://www.mepcontent.com/', tag: 'Gratuito · em inglês',
    desc: 'Biblioteca da Trimble focada em instalações (MEP), com objetos genéricos e de fabricantes em Revit, IFC e DWG.' },
  { nome: 'BIMsmith', url: 'https://bimsmith.com/', tag: 'Gratuito · em inglês',
    desc: 'Portal de famílias Revit de fabricantes, mais forte em produtos do mercado norte-americano.' },
];

const BIM_ORIG = { N: 'Nacional', I: 'Internacional' };
const bimFmts = fmts => `<span class="bim__fmts">${fmts.map(f => `<span class="bim__fmt bim__fmt--${f}">${f}</span>`).join('')}</span>`;

// Quadro "Arquivos BIM/CAD" da ficha de um material (usado no site e nas páginas /materiais/...)
function bimBoxHTML(matId, h = 'h4') {
  const libs = BIM_LIBS.filter(b => b.mats.includes(matId));
  if (!libs.length) return '';
  const cls = h === 'h4' ? '' : ' class="page__h"';
  return `<${h}${cls}>Arquivos BIM/CAD</${h}>
    <ul class="bimbox">${libs.map(b => `<li><a href="${b.links[0][1]}" target="_blank" rel="noopener noreferrer">
      <span class="fabs__name notranslate" translate="no">${b.nome}</span>${bimFmts(b.fmts)}<span class="bimbox__dl">Baixar ↗</span></a></li>`).join('')}</ul>
    <p class="fabs__note">Arquivos oficiais do fabricante (Revit, IFC, DWG ou plugin). Veja todas as bibliotecas na seção <a href="/bim-cad">BIM/CAD</a>.</p>`;
}

// Seção BIM/CAD da página inicial: filtros por formato, aplicação, origem e busca
(() => {
  if (typeof document === 'undefined') return;   // carregado também no gerador das páginas (Node)
  const grid = document.getElementById('bimGrid');
  if (!grid) return;
  const nome = id => (typeof CATALOG !== 'undefined' && CATALOG.find(m => m.id === id) || {}).name || id;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const FMTS = ['Revit', 'IFC', 'DWG', 'SketchUp', 'Plugin'];
  const CATS = [...new Set(BIM_LIBS.flatMap(b => b.cat))];
  const st = { q: '', fmt: null, cat: null, orig: null };

  const chips = (box, list, key, label = x => x) => list.forEach(v => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'bim__chip'; b.textContent = label(v); b.setAttribute('aria-pressed', 'false');
    b.onclick = () => {
      st[key] = st[key] === v ? null : v;
      box.querySelectorAll('.bim__chip').forEach(c => c.setAttribute('aria-pressed', String(c === b && st[key] !== null)));
      render();
    };
    box.appendChild(b);
  });
  chips(document.getElementById('bimFmt'), FMTS, 'fmt');
  chips(document.getElementById('bimCat'), CATS, 'cat');
  chips(document.getElementById('bimOrig'), ['N', 'I'], 'orig', v => BIM_ORIG[v]);
  document.getElementById('bimSearch').addEventListener('input', e => { st.q = norm(e.target.value.trim()); render(); });

  const card = b => `
    <article class="bimcard" id="bim-${slug(b.nome)}">
      <div class="bimcard__head"><h3 class="notranslate" translate="no">${b.nome}</h3><span class="fabs__tag fabs__tag--${b.orig}">${BIM_ORIG[b.orig]}</span></div>
      <p>${b.desc}</p>
      ${bimFmts(b.fmts)}
      <p class="bimcard__meta">${b.acesso}${b.varia ? ' · formatos variam por produto' : ''}</p>
      <p class="bimcard__mats">${b.mats.map(id => `<a href="/materiais/${id.slice(4)}" data-sheet="${id}">${nome(id)}</a>`).join('')}</p>
      <div class="bimcard__links">${b.links.map((l, i) => `<a class="bimcard__btn${i ? ' bimcard__btn--ghost' : ''}" href="${l[1]}" target="_blank" rel="noopener noreferrer">${l[0]} <small>${l[2]} ↗</small></a>`).join('')}</div>
    </article>`;

  function render() {
    const list = BIM_LIBS.filter(b =>
      (!st.fmt || b.fmts.includes(st.fmt)) && (!st.cat || b.cat.includes(st.cat)) && (!st.orig || b.orig === st.orig) &&
      (!st.q || norm([b.nome, b.desc, ...b.cat, ...b.fmts, ...b.mats.map(nome)].join(' ')).includes(st.q)));
    document.getElementById('bimCount').textContent = `${list.length} de ${BIM_LIBS.length} bibliotecas`;
    grid.innerHTML = list.length ? list.map(card).join('') : '<p class="bim__empty">Nenhuma biblioteca com esses filtros.</p>';
  }
  render();

  document.getElementById('bimPlats').innerHTML = BIM_PLATFORMS.map(p => `
    <a class="bimplat" id="bim-${slug(p.nome)}" href="${p.url}" target="_blank" rel="noopener noreferrer">
      <span class="eyebrow">${p.tag}</span><strong class="notranslate" translate="no">${p.nome}</strong><span>${p.desc}</span><span class="bimplat__go">Abrir ↗</span></a>`).join('');
})();
