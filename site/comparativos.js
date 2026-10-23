// ===== Comparativos entre sistemas e materiais (bloco inicial de Guias práticos e páginas /comparativos/...) =====
// Neutros: falam de materiais e sistemas, não de marcas. Cada dado traz a referência (norma, estudo, ficha de fabricante
// ou SINAPI). Quando fichas de fabricantes divergem, mostra-se a faixa. Custos: insumo SINAPI do estado escolhido.
// Fontes conferidas em 23/10/2026. Revisado pela Equipe Técnica PipeSystem.
const CMP_FONTES = {
  nbr5626: ['ABNT NBR 5626:2020 — Sistemas prediais de água fria e água quente: projeto, execução, operação e manutenção', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr5648: ['ABNT NBR 5648 — Tubos e conexões de PVC-U com junta soldável para sistemas prediais de água fria (pressão de serviço 750 kPa a 20 °C)', 'https://mediahub.wavin.com/m/1fdc60976edd69fd/original/FT-Soldavel-Agua-Fria.pdf', 'norma'],
  nbr15884: ['ABNT NBR 15884-1 — Tubulações plásticas para água quente e fria: CPVC (pressões de projeto de 900 kPa até 70 °C e 2 400 kPa a 20 °C)', 'https://www.target.com.br/produtos/normas-tecnicas/42045/nbr15884-1-sistemas-de-tubulacoes-plasticas-para-instalacoes-prediais-de-agua-quente-e-fria-policloreto-de-vinila-clorado-cpvc-parte-1-tubos-requisitos', 'norma'],
  nbr15813: ['ABNT NBR 15813 — Tubulações plásticas para água quente e fria: polipropileno copolímero random (PP-R)', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr15939: ['ABNT NBR 15939-1 — Tubulações plásticas para água quente e fria: polietileno reticulado (PE-X), edição 05/2025', 'https://www.normas.com.br/visualizar/abnt-nbr-nm/30800/abnt-nbr15939-1-sistemas-de-tubulacoes-plasticas-para-instalacoes-prediais-de-agua-quente-e-fria-polietileno-reticulado-pe-x-parte-1-requisitos-e-metodos-de-ensaio', 'norma'],
  iso21003: ['ISO 21003 — Sistemas de tubos multicamada para água quente e fria; classe 2: 70 °C por 49 anos, 80 °C por 1 ano, 95 °C por 100 h (certificação Kiwa K536)', 'https://www.kiwa.com/nl/en/service/certification/k536-k-multilayer-piping-systems', 'norma'],
  nbr13206: ['ABNT NBR 13206 — Tubo de cobre leve, médio e pesado, sem costura, para condução de fluidos', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr15575: ['ABNT NBR 15575-6 — Edificações habitacionais: desempenho dos sistemas hidrossanitários (VUP mínima de 20 anos; critérios acústicos não obrigatórios)', 'https://poli-integra.poli.usp.br/wp-content/uploads/2022/11/2018_Luiz-Gustavo-Montalvao-Garbossa.pdf', 'norma'],
  nbr8160: ['ABNT NBR 8160 — Sistemas prediais de esgoto sanitário: projeto e execução', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr5688: ['ABNT NBR 5688 — Tubos e conexões de PVC-U para esgoto e águas pluviais prediais (séries normal e reforçada)', 'https://www.abntcatalogo.com.br/', 'norma'],
  en877: ['EN 877 — Tubos e conexões de ferro fundido para drenagem de edificações (norma europeia de referência do ferro fundido SMU)', 'https://www.en-standard.eu/', 'norma'],
  iso16422: ['ISO 16422 — Tubos e juntas de PVC orientado (PVC-O) para condução de água sob pressão', 'https://www.iso.org/', 'norma'],
  iso2531: ['ISO 2531 / ABNT NBR 7675 — Tubos e conexões de ferro dúctil para água', 'https://www.iso.org/', 'norma'],
  iso4427: ['ISO 4427 / ABNT NBR 15561 — Tubos de polietileno (PEAD) para abastecimento de água', 'https://www.iso.org/', 'norma'],
  nbr10897: ['ABNT NBR 10897 — Sistemas de proteção contra incêndio por chuveiros automáticos', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr13714: ['ABNT NBR 13714 — Sistemas de hidrantes e de mangotinhos para combate a incêndio', 'https://www.abntcatalogo.com.br/', 'norma'],
  ul1821: ['UL — Q&A sobre tubos plásticos de sprinkler (UL 1821): uso em ocupações de risco leve da NFPA 13 e residenciais (NFPA 13R/13D)', 'https://ul.com/news/qa-installation-plastic-fire-sprinkler-pipe-exposed-locations', 'norma'],
  nyc: ['Corpo de Bombeiros de Nova York (FDNY) — condições para CPVC em sprinklers de risco leve: sem trechos aparentes, com barreira resistente ao fogo', 'https://www.nyc.gov/assets/buildings/pdf/170-07-e.pdf', 'norma'],
  nbr15526: ['ABNT NBR 15526 — Redes de distribuição interna para gases combustíveis em instalações residenciais e comerciais', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr16821: ['ABNT NBR 16821 — Sistemas multicamada PE-AL-PE para gases combustíveis (citada pelo CBMGO, Orientação Técnica 03/2020: até 60 °C, protegido de UV)', 'https://www.bombeiros.go.gov.br/wp-content/uploads/2014/11/Orientacao_Tecnica_03_2020_-_Tubos_Multicamada.pdf', 'norma'],
  nbr17247: ['ABNT NBR 17247-1 — Tubulação de aço revestido com polietileno para gases combustíveis (até 1,5 bar)', 'https://www.target.com.br/produtos/materias-tecnicas/2026/07/01/6632/a-conformidade-das-tubulacoes-de-aco-revestido-com-polietileno-para-gases-combustiveis', 'norma'],
  nbr12188: ['ABNT NBR 12188 — Sistemas centralizados de suprimento de gases medicinais (tubulação de cobre)', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr15569: ['ABNT NBR 15569 — Sistema de aquecimento solar de água em circuito direto: projeto e instalação', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr13103: ['ABNT NBR 13103 — Instalação de aparelhos a gás para uso residencial: requisitos', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr14799: ['ABNT NBR 14799 — Reservatório poliolefínico para água potável', 'https://www.abntcatalogo.com.br/', 'norma'],
  loi: ['SpecialChem — Índice de oxigênio limite (LOI): materiais com LOI abaixo de 21% queimam ao ar; acima de ~26% são considerados autoextinguíveis', 'https://www.specialchem.com/plastics/guide/fire-resistance-loi', 'estudo'],
  loiCpvc: ['Spears — Propriedades físicas de tubos de PVC e CPVC (LOI ASTM D2863: PVC 43, CPVC 60)', 'https://www.spearsmfg.com/IP-4/03%20Physical%20Properties%20of%20PVC%20&%20CPVC%20Pipe.pdf', 'fab'],
  isaacson: ['Isaacson, K. P. et al. (2021) — Contaminação da água potável pela degradação térmica de tubos plásticos em incêndios, Environ. Sci.: Water Res. Technol.', 'https://pubs.rsc.org/en/content/articlehtml/2021/ew/d0ew00836b', 'estudo'],
  cullom: ['Cullom, A. C. et al. (2020) — Revisão: materiais de instalações prediais (cobre, ferro, PVC, PEX) e o crescimento de Legionella, Pathogens', 'https://www.mdpi.com/2076-0817/9/11/957', 'estudo'],
  galv1: ['Acuren — Corrosão de tubulações galvanizadas em sistemas prediais de água (água mole e quente consome o zinco)', 'https://www.acuren.com/wp-content/uploads/2023/08/Corrosion-of-Galvanized-Piping-in-Domestic-Water-Systems.pdf', 'estudo'],
  galv2: ['Materiales de Construcción (CSIC) — Causas e efeitos da corrosão em instalação predial de aço galvanizado', 'https://materconstrucc.revistas.csic.es/index.php/materconstrucc/article/view/336', 'estudo'],
  abrh: ['ABRHidro — Comparação de campo entre ferro fundido dúctil e PVC-O em adutora (Garanhuns/PE)', 'https://files.abrhidro.org.br/Eventos/Trabalhos/152/fc3763903d05beec0721436e7e6a3ed2_99c1e1d52a7d7650a08a5f4b9d4018d0.pdf', 'estudo'],
  ufpe: ['Magalhães, C. H. M. (UFPE) — Transientes hidráulicos em adutora: ferro fundido × PVC-O (simulação)', 'https://repositorio.ufpe.br/bitstream/123456789/33041/1/DISSERTA%c3%87%c3%83O%20Cl%c3%a1udio%20Henrique%20Milfont%20de%20Magalh%c3%a3es.pdf', 'estudo'],
  celer: ['Tabela de celeridade por material (DN 500): ferro dúctil ≈ 1.095 m/s, PVC-U PN16 ≈ 424 m/s, PEAD PN16 ≈ 320 m/s, PVC-O ≈ 318 m/s — dado de fabricante de PVC-O', 'https://www.iagua.es/noticias/molecor/redes-mas-eficientes-pvc-orientado-innovacion-minimizar-fugas-y-optimizar-recursos', 'fab'],
  ftPvc: ['Ficha técnica de tubo PVC soldável água fria: 750 kPa a 20 °C, fator de redução até 45 °C (0,6)', 'https://blog.wavin.com/hubfs/FTC000066%20-%20FT%20Sold%C3%A1vel%20Agua%20Fria%20PL-1.pdf', 'fab'],
  ftPpr: ['Fichas técnicas de PPR: PN 20 para água quente até 70 °C; PN 25 indicado até 70 °C por um fabricante e até 95 °C (aquecimento) por outro', 'https://topfusion.com.br/wp-content/uploads/2025/10/Ficha-Tecnica-Linha-TOPHIDRO.pdf', 'fab'],
  ftPpr2: ['Ficha técnica de PP-R (segundo fabricante, para comparação das faixas)', 'https://mediahub.wavin.com/asset/80b9cca8-3aa7-4451-b466-fd348f17deac/FT-PPR.pdf', 'fab'],
  ftMulti: ['Ficha técnica de tubo PE-X/Al/PE-X: 60 °C por 49 anos, 80 °C por 1 ano, 95 °C por 100 h (água quente sanitária)', 'https://dam.giacomini.com/es.giacomini.com/product_documentations/datasheets/R999I.pdf', 'fab'],
  ftCpvc: ['Literatura de CPVC para sprinklers: 175 psi a 150 °F (≈ 12 bar a 65 °C), listagem UL', 'https://vikinggroupinc.com/sites/default/files/databook/related/cpvc%20pipe%20and%20fittings/cpvc.pdf', 'fab'],
  acust: ['Ficha técnica de esgoto em PVC acústico (valores de ruído autodeclarados segundo VDI 4100 / DIN 4109)', 'https://mediahub.wavin.com/m/36bfd4f2b82d83de/original/FT-Esgoto-Silentium.pdf', 'fab'],
  sinapi: ['Caixa Econômica Federal — SINAPI 09/2026, preços de insumos sem desoneração, Santa Catarina (base usada pelo Dimensionamento Inteligente do portal)', 'https://www.caixa.gov.br/site/Paginas/downloads.aspx#categoria_888', 'preco'],
};
const CMP_KIND = { norma: 'norma', estudo: 'estudo', fab: 'ficha de fabricante', preco: 'preço' };

const CMPS = [
  { id: 'agua-quente', tema: 'Água quente predial', titulo: 'Água quente: CPVC, PPR, PEX, multicamada ou cobre?',
    resumo: 'Para casa e prédio, os plásticos (CPVC, PPR, PEX, multicamada) atendem à água quente com custo menor; o cobre continua a escolha para temperaturas mais altas, casas de máquinas, trechos aparentes e onde se exige material incombustível.',
    opcoes: [['CPVC', 'cpvc'], ['PPR', 'ppr'], ['PEX', 'pex'], ['Multicamada (PEX-AL-PEX)', 'multicamada'], ['Cobre', 'cobre']],
    linhas: [
      ['Temperatura de trabalho', ['Até 70 °C na pressão de projeto da norma; fichas citam até 80–90 °C {nbr15884}', 'PN 20: até 70 °C; PN 25: 70 a 95 °C conforme a ficha {ftPpr}{ftPpr2}', 'Conforme a classe de aplicação da NBR 15939 (água quente sanitária: 60–70 °C) {nbr15939}', 'Classe 2: 70 °C contínuo, 80 °C por 1 ano, 95 °C em falha {iso21003}{ftMulti}', 'Acima de 100 °C; o limite costuma ser a junta (solda ou brasagem)']],
      ['Pressão', ['900 kPa até 70 °C; 2 400 kPa a 20 °C (projeto) {nbr15884}', 'Cai com a temperatura: confira a tabela pressão × temperatura da ficha {ftPpr2}', 'Depende da classe e da temperatura {nbr15939}', 'Típico 10 bar a 20 °C e cerca de 6 bar a 95 °C, conforme ficha {ftMulti}', 'Alta; classes E, A e I conforme a espessura {nbr13206}']],
      ['Vida útil', ['Projetada para a VUP da NBR 15575 (≥ 20 anos) quando usada na classe certa {nbr15575}', 'Idem; ensaios de regressão a longo prazo das normas de PP-R {nbr15813}', 'Idem {nbr15939}', 'Projeto de 50 anos na classe de aplicação {iso21003}', 'Longa, mas sensível a água agressiva e a velocidades altas (corrosão por erosão)']],
      ['Incêndio', ['LOI ≈ 60: não sustenta chama ao ar {loiCpvc}', 'Poliolefina: queima ao ar (LOI < 21%) {loi}', 'Poliolefina: queima ao ar {loi}', 'Camadas de PE-X: queimam; alumínio no meio', 'Incombustível']],
      ['Química / qualidade da água', ['Não usar com solventes, óleos e alguns selantes de rosca', 'Boa resistência química; sem corrosão', 'Boa; sensível a UV (não deixar exposto ao sol)', 'Boa; alumínio protegido entre camadas', 'Água ácida ou muito mole corrói; efeito sobre biofilme é misto {cullom}']],
      ['Junta', ['Soldável (adesivo próprio)', 'Termofusão', 'Conexões de anel, crimpagem ou engate', 'Prensagem ou rosca com anel', 'Solda capilar (estanho) ou brasagem; prensagem']],
      ['Ferramenta e mão de obra', ['Simples; exige tempo de cura', 'Termofusor; instalador treinado', 'Ferramenta do sistema; rápido, poucas conexões (tubo flexível)', 'Prensa e mordentes do sistema', 'Maçarico e soldador experiente (ou prensa)']],
      ['Normas', ['NBR 15884', 'NBR 15813', 'NBR 15939', 'ISO 21003', 'NBR 13206']],
      ['Custo de referência (tubo, por metro)', [{ ins: '21124', d: 'CPVC 22 mm' }, { ins: '36278', d: 'PPR PN 20 DN 25' }, null, null, { ins: '12743', d: 'cobre classe E 22 mm' }]],
    ],
    pros: [[['Material autoextinguível', 'Leve e de solda simples', 'Mesma ferramenta do PVC'], ['Adesivo errado ou sem cura causa vazamento', 'Sensível a solventes e a alguns produtos de obra']],
      [['Junta homogênea, sem adesivo', 'Bom custo na água quente', 'Sem corrosão'], ['Exige termofusor e treino', 'Dilatação alta: precisa de liras', 'Queima em incêndio']],
      [['Flexível: menos conexões e emendas', 'Montagem rápida, sistema "pex-a-pex"', 'Tolera congelamento'], ['Conexões e ferramenta próprias de cada sistema', 'Não pode ficar exposto ao sol', 'Queima em incêndio']],
      [['Mantém a forma ao dobrar', 'Dilatação menor que a dos plásticos puros', 'Boa para trechos aparentes e radiadores'], ['Conexões caras; prensa específica', 'Sem preço de referência no SINAPI do portal']],
      [['Incombustível; suporta altas temperaturas', 'Material consagrado em hospitais e gases medicinais', 'Reciclável'], ['Custo alto de material e mão de obra', 'Corrosão com água agressiva', 'Furto em obra']]],
    erros: ['Usar PVC marrom (água fria) no trecho de água quente', 'Não prever dilatação térmica em trechos longos de PPR e CPVC', 'Ligar cobre direto ao aço galvanizado (corrosão galvânica)', 'Trocar o adesivo de CPVC pelo de PVC'],
    apps: { casa: 'CPVC, PPR ou PEX: o custo e a mão de obra local decidem. PEX reduz emendas dentro das paredes.', predio: 'CPVC ou PPR nas prumadas e ramais; PEX/multicamada em sistemas com distribuidor (manifold) por apartamento.', hospital: 'Cobre nas áreas técnicas e de maior temperatura; plásticos aceitos nos ramais conforme projeto. Controle de temperatura contra Legionella vale para qualquer material {cullom}.', industria: 'Cobre ou aço inox para temperaturas e pressões maiores; plásticos só dentro da classe de aplicação.' },
    fontes: ['nbr5626', 'nbr15884', 'nbr15813', 'nbr15939', 'iso21003', 'nbr13206', 'nbr15575', 'loi', 'loiCpvc', 'cullom', 'ftPpr', 'ftPpr2', 'ftMulti', 'sinapi'] },

  { id: 'agua-fria', tema: 'Água fria predial', titulo: 'Água fria: PVC soldável, PPR ou PEX?',
    resumo: 'O PVC soldável é o padrão de custo para água fria; PPR e PEX entram quando a obra quer um só sistema para água fria e quente, ou menos emendas.',
    opcoes: [['PVC soldável', 'pvc'], ['PPR', 'ppr'], ['PEX', 'pex']],
    linhas: [
      ['Temperatura', ['Até 20 °C na pressão nominal; com redução até 45 °C {ftPvc}', 'Fria e quente (classe conforme PN) {ftPpr}', 'Fria e quente {nbr15939}']],
      ['Pressão', ['750 kPa a 20 °C {nbr5648}', 'PN 12,5 para fria; PN 20/25 para quente {ftPpr}', 'Conforme classe {nbr15939}']],
      ['Vida útil', ['Atende à VUP da NBR 15575 {nbr15575}', 'Idem', 'Idem']],
      ['Incêndio', ['LOI ≈ 43: autoextinguível, libera gases ácidos {loiCpvc}', 'Queima ao ar {loi}', 'Queima ao ar {loi}']],
      ['Junta', ['Soldável ou roscável', 'Termofusão', 'Anel, crimpagem ou engate']],
      ['Mão de obra', ['A mais difundida no país', 'Termofusor e treino', 'Ferramenta do sistema']],
      ['Normas', ['NBR 5648 · NBR 5626', 'NBR 15813', 'NBR 15939']],
      ['Custo de referência (tubo, por metro)', [{ ins: '9868', d: 'PVC soldável 25 mm' }, { ins: '36278', d: 'PPR PN 20 DN 25 (o PN 12,5 é mais barato, sem preço no portal)' }, null]],
    ],
    pros: [[['Menor custo', 'Peças em qualquer loja', 'Mão de obra disponível'], ['Não serve para água quente', 'Junta soldável não admite correção']],
      [['Um só sistema para fria e quente', 'Junta homogênea'], ['Custo maior na água fria', 'Exige termofusor']],
      [['Menos emendas, rápido', 'Bom para retrofit (passa em conduítes)'], ['Sistema proprietário de conexões', 'Sem preço no SINAPI do portal']]],
    erros: ['Pressurizar a rede antes do tempo de cura do adesivo', 'Esquecer o teste de estanqueidade antes de fechar as paredes', 'Deixar pontos de espera sem bujão'],
    apps: { casa: 'PVC soldável na água fria; outro material só na quente.', predio: 'PVC nas colunas e ramais; atenção à pressão estática (válvula redutora acima de 40 mca) {nbr5626}.', hospital: 'Conforme projeto; muitos especificam um só material para fria e quente para simplificar a manutenção.', industria: 'PVC em água de utilidades sem calor; metais ou PP em linhas de processo.' },
    fontes: ['nbr5626', 'nbr5648', 'ftPvc', 'nbr15813', 'ftPpr', 'nbr15939', 'nbr15575', 'loi', 'loiCpvc', 'sinapi'] },

  { id: 'esgoto', tema: 'Esgoto predial', titulo: 'Esgoto: PVC série normal, PVC reforçado/acústico ou ferro fundido?',
    resumo: 'PVC série normal para casas e ramais; série reforçada ou PVC acústico em prumadas de prédios; ferro fundido onde ruído e comportamento em incêndio pesam mais (hotéis, hospitais, prédios altos).',
    opcoes: [['PVC série normal', 'pvc'], ['PVC série reforçada / acústico', 'pvc'], ['Ferro fundido (SMU)', 'smu']],
    linhas: [
      ['Uso típico', ['Ramais e casas', 'Prumadas, áreas sob tráfego, prédios', 'Prumadas de prédios altos, hotéis, hospitais']],
      ['Ruído', ['O mais ruidoso dos três', 'Linhas acústicas com valores autodeclarados baixos {acust}', 'Baixo pela massa do tubo']],
      ['Incêndio', ['Autoextinguível; exige selagem corta-fogo nas passagens de laje {loiCpvc}', 'Idem', 'Incombustível']],
      ['Resistência química', ['Boa para esgoto doméstico', 'Boa', 'Revestimento interno protege contra corrosão']],
      ['Junta', ['Soldável ou elástica', 'Elástica', 'Abraçadeira de inox com anel (sem bolsa)']],
      ['Mão de obra', ['Simples', 'Simples', 'Fácil de montar, peças pesadas']],
      ['Normas', ['NBR 5688 · NBR 8160', 'NBR 5688 · NBR 8160', 'EN 877 · NBR 8160']],
      ['Custo de referência (tubo DN 100, por metro)', [{ ins: '9836', d: 'série normal' }, { ins: '9841', d: 'série R' }, null]],
    ],
    pros: [[['Menor custo', 'Leve'], ['Ruído de queda d’água audível', 'Não usar onde o projeto pede série reforçada']],
      [['Parede mais grossa', 'Linhas acústicas reduzem o ruído'], ['Custo maior que a série normal']],
      [['Silencioso', 'Incombustível', 'Junta desmontável para manutenção'], ['Peso e custo', 'Sem preço no SINAPI do portal']]],
    erros: ['Declividade insuficiente (entupimentos)', 'Ligar ramais na zona de pressão de espuma', 'Falta de ventilação (perda do fecho hídrico)', 'Passar tubo plástico por laje sem selagem corta-fogo'],
    apps: { casa: 'PVC série normal.', predio: 'PVC série reforçada ou acústico nas prumadas; ferro fundido em prédios de alto padrão.', hospital: 'Ferro fundido nas prumadas, pelo ruído e pelo incêndio; conforme projeto.', industria: 'Conforme o efluente: plásticos para químicos, ferro fundido para alta temperatura.' },
    fontes: ['nbr8160', 'nbr5688', 'en877', 'nbr15575', 'acust', 'loiCpvc', 'sinapi'] },

  { id: 'adutoras', tema: 'Saneamento e adutoras', titulo: 'Adutoras e redes de água: PEAD, PVC-O ou ferro dúctil?',
    resumo: 'Ferro dúctil quando há cargas externas altas, travessias e pressões elevadas; PVC-O e PEAD reduzem peso, custo e golpe de aríete. O PVC-O é alternativa ao ferro dúctil, não substituto automático.',
    opcoes: [['PEAD', 'pe'], ['PVC-O (orientado)', 'pvc'], ['Ferro dúctil', 'ferro']],
    linhas: [
      ['Celeridade (golpe de aríete)', ['≈ 320 m/s (PN 16, DN 500) {celer}', '≈ 318 m/s {celer}', '≈ 1.095 m/s: sobrepressão maior {celer}{ufpe}']],
      ['Pressão', ['PN conforme SDR {iso4427}', 'PN 12,5 a 25 típicos {iso16422}', 'Alta; classes K7/K9 {iso2531}']],
      ['Vida útil', ['Longa; depende de solda bem feita', 'Fabricantes declaram mais de 100 anos — alegação comercial {celer}', 'Longa; depende do revestimento e do solo {abrh}']],
      ['Resistência química e solo', ['Não corrói', 'Não corrói', 'Revestimento interno e externo contra corrosão']],
      ['Junta', ['Solda de topo ou eletrofusão (linha contínua)', 'Ponta e bolsa com anel', 'Ponta e bolsa com anel; travada em curvas']],
      ['Mão de obra', ['Máquina de solda e soldador certificado', 'Leve: montagem manual rápida', 'Pesado: exige equipamento']],
      ['Normas', ['ISO 4427 · NBR 15561', 'ISO 16422', 'ISO 2531 · NBR 7675']],
      ['Custo de referência', [null, null, null]],
    ],
    pros: [[['Flexível, aceita recalques do solo', 'Linha soldada sem vazamento nas juntas', 'Golpe de aríete menor'], ['Solda exige controle', 'Dilatação alta']],
      [['Leve e barato no transporte', 'Golpe de aríete menor', 'Baixa rugosidade'], ['Mais recente no Brasil (desde 2014) {abrh}', 'Sensível a danos na instalação']],
      [['Muito resistente a cargas e impactos', 'Histórico longo no país (desde 1910) {abrh}'], ['Peso e custo', 'Golpe de aríete maior', 'Revestimento precisa estar íntegro']]],
    erros: ['Não prever ventosas nos pontos altos', 'Não analisar transientes (golpe de aríete) no recalque', 'Assentar sem berço adequado'],
    apps: { casa: '— (redes públicas)', predio: 'Ramal predial: PEAD ou PVC conforme a concessionária.', hospital: '—', industria: 'Linhas de água bruta e recalque: decisão por análise de transientes, solo e custo de ciclo de vida.' },
    fontes: ['iso4427', 'iso16422', 'iso2531', 'abrh', 'ufpe', 'celer'] },

  { id: 'incendio', tema: 'Rede de incêndio', titulo: 'Incêndio: aço ranhurado, aço roscado/soldado ou CPVC?',
    resumo: 'Aço é a regra em redes de hidrantes e sprinklers; o ranhurado acelera a montagem. O CPVC listado é aceito em sprinklers de risco leve e residencial, dentro das condições da listagem.',
    opcoes: [['Aço com conexão ranhurada', 'ranhurado'], ['Aço roscado ou soldado', 'aco'], ['CPVC para sprinkler', 'cpvc']],
    linhas: [
      ['Onde é aceito', ['Hidrantes e sprinklers {nbr10897}{nbr13714}', 'Hidrantes e sprinklers', 'Só sprinklers de risco leve e residencial, com produto listado {ul1821}']],
      ['Pressão / temperatura', ['Conforme schedule e acoplamento', 'Conforme schedule', '175 psi a 150 °F (≈ 12 bar a 65 °C) segundo literatura de fabricante {ftCpvc}']],
      ['Incêndio', ['Incombustível', 'Incombustível', 'Exige proteção (forro/barreira) e não pode ficar aparente em muitos casos {nyc}']],
      ['Junta', ['Ranhura + acoplamento com anel', 'Rosca ou solda', 'Soldável com adesivo específico']],
      ['Mão de obra', ['Rápida, sem solda no local', 'Soldador/rosqueadeira; trabalho a quente', 'Leve e rápida; atenção a produtos incompatíveis']],
      ['Normas', ['NBR 10897 · NBR 13714', 'NBR 10897 · NBR 13714', 'NFPA 13/13R/13D · UL 1821']],
      ['Custo de referência (tubo 2", por metro)', [{ ins: '21013', d: 'galvanizado classe leve, base do ranhurado' }, { ins: '21148', d: 'aço carbono SCH 40' }, null]],
    ],
    pros: [[['Montagem rápida e limpa', 'Acoplamento flexível absorve dilatação'], ['Acoplamentos com custo próprio']],
      [['Solução tradicional, aceita em todos os riscos'], ['Trabalho a quente na obra', 'Mais mão de obra']],
      [['Leve, rápido, não corrói'], ['Restrito a riscos leves e à listagem', 'Incompatível com alguns óleos e selantes']]],
    erros: ['Usar CPVC fora da listagem (risco, área ou exposição)', 'Misturar acoplamentos e tubos de fabricantes sem compatibilidade declarada', 'Deixar a reserva técnica de incêndio ser consumida pelo uso diário'],
    apps: { casa: 'Raramente exigido; em residências com sprinkler, CPVC listado.', predio: 'Aço ranhurado nas prumadas; CPVC listado em apartamentos (risco leve), se aceito pelo Corpo de Bombeiros local.', hospital: 'Aço, pelo risco e pela exigência de incombustibilidade.', industria: 'Aço (ranhurado ou soldado) conforme o risco.' },
    fontes: ['nbr10897', 'nbr13714', 'ul1821', 'nyc', 'ftCpvc', 'sinapi'] },

  { id: 'gas', tema: 'Gás combustível', titulo: 'Gás: cobre, aço, multicamada (PE-AL-PE) ou polietileno?',
    resumo: 'Cobre e aço são os materiais tradicionais da NBR 15526; o multicamada para gás tem norma própria e aceitação que varia por estado; o polietileno é para trechos enterrados.',
    opcoes: [['Cobre', 'cobre'], ['Aço (galvanizado ou revestido)', 'aco'], ['Multicamada PE-AL-PE', 'multicamada'], ['Polietileno (PE)', 'pe']],
    linhas: [
      ['Onde usar', ['Aparente e embutido {nbr15526}', 'Aparente, embutido; aço revestido de PE até 1,5 bar {nbr17247}', 'Embutido ou protegido de UV, após o regulador, conforme Corpo de Bombeiros {nbr16821}', 'Enterrado']],
      ['Temperatura', ['Alta', 'Alta', 'Até 60 °C {nbr16821}', 'Ambiente (enterrado)']],
      ['Incêndio', ['Incombustível', 'Incombustível', 'Camadas plásticas queimam', 'Queima; por isso só enterrado']],
      ['Junta', ['Solda/brasagem ou prensagem', 'Rosca ou solda', 'Prensagem do sistema', 'Eletrofusão ou termofusão']],
      ['Mão de obra', ['Soldador experiente', 'Rosqueadeira; vedante certificado para gás', 'Prensa do sistema', 'Máquina de solda de PE']],
      ['Normas', ['NBR 15526', 'NBR 15526 · NBR 17247-1', 'NBR 16821', 'NBR 15526']],
      ['Custo de referência (tubo, por metro)', [{ ins: '39748', d: 'cobre classe A 22 mm (gás)' }, { ins: '40626', d: 'aço galvanizado classe média 1"' }, null, null]],
    ],
    pros: [[['Consagrado, incombustível'], ['Custo e furto']], [['Resistente, menor custo de material'], ['Corrosão se exposto sem proteção', 'Rosca exige vedante para gás']], [['Rápido, poucas emendas'], ['Aceitação varia por estado', 'Proteção contra UV']], [['Ideal enterrado, não corrói'], ['Não pode ficar aparente']]],
    erros: ['Vedante de rosca não certificado para gás', 'Procurar vazamento com chama', 'Liberar a rede sem teste de estanqueidade e laudo'],
    apps: { casa: 'Cobre ou multicamada (onde aceito) dentro de casa; PE no trecho enterrado.', predio: 'Prumadas em cobre ou aço; ramais conforme projeto e concessionária.', hospital: 'Cobre; gases medicinais têm norma própria (NBR 12188) {nbr12188}.', industria: 'Aço, conforme pressão e projeto.' },
    fontes: ['nbr15526', 'nbr16821', 'nbr17247', 'nbr12188', 'sinapi'] },

  { id: 'valvulas', tema: 'Válvulas', titulo: 'Válvula de bloqueio: gaveta, esfera, borboleta ou globo?',
    resumo: 'Esfera para abrir e fechar rápido em diâmetros pequenos; gaveta onde se quer passagem plena e manobra lenta; borboleta em diâmetros grandes; globo quando é preciso regular a vazão.',
    opcoes: [['Gaveta', 'gaveta'], ['Esfera', 'esfera'], ['Borboleta', 'borboleta'], ['Globo', 'globo']],
    linhas: [
      ['Função', ['Bloqueio (aberta ou fechada)', 'Bloqueio rápido (1/4 de volta)', 'Bloqueio e regulagem grosseira', 'Regulagem de vazão']],
      ['Perda de carga aberta', ['Muito baixa', 'Muito baixa (passagem plena)', 'Baixa a média (disco no fluxo)', 'Alta']],
      ['Golpe de aríete', ['Fechamento lento: menor risco', 'Fechamento rápido: maior risco em linhas longas', 'Rápida com alavanca; usar redutor', 'Lento']],
      ['Diâmetros usuais', ['Pequenos a médios', 'Pequenos a médios', 'Médios a grandes', 'Pequenos a médios']],
      ['Manutenção', ['Desgaste da cunha; não usar para regular', 'Simples; vedação de PTFE', 'Troca de anel/sede', 'Sede e obturador']],
      ['Custo de referência (3/4")', [{ ins: '6016', d: 'gaveta bruta em latão' }, { ins: '6032', d: 'esfera de PVC (material diferente)' }, null, null]],
    ],
    pros: [[['Passagem plena, fechamento lento'], ['Não serve para regular']], [['Rápida, estanque, compacta'], ['Pode provocar golpe se fechada de uma vez']], [['Leve e compacta em DN grande'], ['Disco no fluxo']], [['Regula bem'], ['Perda de carga alta']]],
    erros: ['Usar gaveta parcialmente aberta para regular vazão', 'Fechar esfera de uma vez em linhas longas (golpe de aríete)'],
    apps: { casa: 'Esfera ou gaveta nos ramais; registro de pressão nos chuveiros.', predio: 'Gaveta ou esfera no barrilete; borboleta em DN grandes.', hospital: 'Esfera de fechamento rápido em setores; conforme projeto.', industria: 'Conforme a função: bloqueio, regulagem e diâmetro.' },
    fontes: ['nbr5626', 'sinapi'] },

  { id: 'aquecimento', tema: 'Aquecimento de água', titulo: 'Aquecimento de água: solar, gás, bomba de calor ou elétrico?',
    resumo: 'Solar reduz o custo de operação e precisa de apoio; gás entrega vazão alta; bomba de calor gasta menos energia que a resistência elétrica; o elétrico tem o menor custo de instalação e o maior de operação.',
    opcoes: [['Solar', 'solar'], ['Gás', 'caldeiras'], ['Bomba de calor', 'solar'], ['Elétrico', 'caldeiras']],
    linhas: [
      ['Custo de instalação', ['Médio a alto', 'Médio', 'Alto', 'Baixo']],
      ['Custo de operação', ['O menor (apoio em dias nublados)', 'Médio (tarifa do gás)', 'Baixo (usa várias vezes menos energia que a resistência)', 'O maior']],
      ['Vazão de água quente', ['Conforme o reservatório', 'Alta e contínua (passagem)', 'Conforme o reservatório', 'Limitada']],
      ['Exigências', ['Área de telhado e orientação {nbr15569}', 'Ventilação e chaminé {nbr13103}', 'Local ventilado para a unidade externa', 'Circuito elétrico dimensionado']],
      ['Normas', ['NBR 15569', 'NBR 13103 · NBR 15526', '—', 'NBR 5410 (elétrica)']],
    ],
    pros: [[['Energia gratuita'], ['Precisa de apoio e espaço']], [['Vazão alta'], ['Exige ventilação e rede de gás']], [['Eficiente'], ['Investimento alto']], [['Barato para instalar'], ['Operação cara', 'Pico na rede elétrica']]],
    erros: ['Instalar aquecedor a gás em banheiro sem ventilação', 'Rede de água quente em PVC marrom'],
    apps: { casa: 'Solar com apoio elétrico ou gás.', predio: 'Central a gás ou solar coletivo com recirculação.', hospital: 'Central com redundância e controle de temperatura.', industria: 'Caldeira ou bomba de calor conforme a carga.' },
    fontes: ['nbr15569', 'nbr13103'] },

  { id: 'reservatorios', tema: 'Reservatórios', titulo: "Caixa d'água: polietileno, fibra de vidro ou concreto?",
    resumo: 'Polietileno até alguns milhares de litros pela leveza e preço; fibra de vidro para volumes maiores; concreto quando o reservatório faz parte da estrutura do prédio.',
    opcoes: [['Polietileno', 'reservatorios'], ['Fibra de vidro', 'reservatorios'], ['Concreto', 'reservatorios']],
    linhas: [
      ['Volumes usuais', ['Até ~15 mil L', 'Até dezenas de milhares de litros', 'Qualquer volume (moldado no local)']],
      ['Instalação', ['Leve; base plana e contínua', 'Base e içamento', 'Obra civil, impermeabilização']],
      ['Manutenção', ['Limpeza semestral', 'Limpeza semestral', 'Limpeza e impermeabilização periódica']],
      ['Normas', ['NBR 14799 · NBR 5626', 'NBR 5626', 'NBR 5626']],
      ['Custo de referência (por litro)', [{ ins: '37105', div: 5000, d: 'caixa de 5.000 L' }, { ins: '43982', div: 20000, d: 'reservatório de 20.000 L com tampa' }, null]],
    ],
    pros: [[['Leve, barata, fácil de instalar'], ['Deforma com base ruim']], [['Grandes volumes, leve'], ['Exige içamento']], [['Integra a estrutura; grandes volumes'], ['Impermeabilização e fissuras']]],
    erros: ['Base com ripas ou apoios isolados', 'Extravasor escondido', 'Caixa sem tampa'],
    apps: { casa: 'Polietileno.', predio: 'Fibra ou concreto (inferior e superior).', hospital: 'Concreto ou fibra, com volume de reserva definido no projeto.', industria: 'Conforme volume: fibra, concreto ou aço.' },
    fontes: ['nbr14799', 'nbr5626', 'sinapi'] },

  { id: 'pressurizacao', tema: 'Pressão da água', titulo: 'Pressão: caixa elevada, pressurizador ou hidropneumático?',
    resumo: 'A caixa elevada (gravidade) é a mais simples e confiável; o pressurizador corrige pressão baixa em pontos específicos; o hidropneumático pressuriza toda a rede quando não há altura.',
    opcoes: [['Caixa elevada (gravidade)', 'reservatorios'], ['Pressurizador', 'pressurizadores'], ['Hidropneumático / conjunto pressurizado', 'bombas']],
    linhas: [
      ['Energia', ['Só o recalque até a caixa', 'Liga a cada uso', 'Liga conforme a pressão']],
      ['Falta de energia', ['Continua abastecendo', 'Perde a pressão extra', 'Para (sem reserva elevada)']],
      ['Ruído', ['Nenhum na distribuição', 'Do equipamento', 'Do equipamento']],
      ['Limite', ['Pressão depende da altura; acima de 40 mca usar redutora {nbr5626}', 'Pontos isolados', 'Projeto com tanque e controle']],
    ],
    pros: [[['Simples, sem energia na distribuição'], ['Pouca pressão nos últimos andares']], [['Resolve chuveiro fraco'], ['Ruído e manutenção']], [['Pressão constante sem caixa elevada'], ['Depende de energia', 'Manutenção do tanque']]],
    erros: ['Instalar pressurizador sem verificar a vazão disponível', 'Ignorar a pressão estática máxima nos andares baixos'],
    apps: { casa: 'Caixa elevada; pressurizador se o chuveiro ficar fraco.', predio: 'Caixa superior; conjunto pressurizado nos últimos andares, se preciso.', hospital: 'Redundância de bombas e reserva elevada.', industria: 'Conjunto pressurizado com inversor de frequência.' },
    fontes: ['nbr5626'] },

  { id: 'metais-industria', tema: 'Indústria', titulo: 'Tubulação industrial: aço carbono, galvanizado ou inox?',
    resumo: 'Aço carbono para vapor, óleo e ar comprimido; galvanizado para utilidades e incêndio; inox para alimentos, farmacêutica e fluidos corrosivos.',
    opcoes: [['Aço carbono', 'aco'], ['Aço galvanizado', 'galv'], ['Aço inox', 'inox']],
    linhas: [
      ['Corrosão', ['Precisa de pintura ou revestimento', 'Zinco protege até ser consumido; água mole e quente acelera {galv1}{galv2}', 'Resiste à maioria dos meios; atenção a cloretos']],
      ['Uso típico', ['Vapor, condensado, óleo, ar', 'Incêndio, ar, água de utilidades', 'Processos sanitários, química']],
      ['Junta', ['Solda, flange, rosca', 'Rosca ou ranhura (não soldar sem retocar a proteção)', 'Solda orbital, tri-clamp, flange']],
      ['Custo de referência (tubo 1", por metro)', [{ ins: '42574', d: 'SCH 40 sem costura' }, { ins: '40626', d: 'classe média com costura' }, null]],
    ],
    pros: [[['Resistente e barato para alta pressão e temperatura'], ['Corrói sem proteção']], [['Proteção de fábrica'], ['Corrosão em água quente e mole', 'Não usar em água potável quente']], [['Higiênico e durável'], ['Custo alto', 'Solda especializada']]],
    erros: ['Galvanizado em água quente', 'Ligar galvanizado direto ao cobre'],
    apps: { casa: '—', predio: 'Galvanizado em incêndio.', hospital: 'Inox em cozinhas e áreas técnicas especiais.', industria: 'Conforme o fluido, a temperatura e a higiene exigida.' },
    fontes: ['galv1', 'galv2', 'sinapi'] },
];

// Insumo SINAPI do custo de referência: { ins, div } → preço por metro, unidade ou litro no estado escolhido
function cmpCusto(c, uf) {
  if (!c || typeof SINAPI_PRECOS === 'undefined') return null;
  const row = SINAPI_PRECOS.ins[c.ins], i = SINAPI_PRECOS.ufs.indexOf(uf);
  const v = row && i >= 0 ? row[2 + i] : null;
  return typeof v === 'number' ? v / (c.div || 1) : null;
}

// HTML de um comparativo. o.base: prefixo dos links do portal ('' no site; '' também nas páginas próprias)
// o.uf: estado do custo · o.erros: link de Erros e patologias · as referências são numeradas dentro de cada comparativo
function comparativoHTML(c, o = {}) {
  const uf = o.uf || 'SC', h = o.page ? 'h2' : 'h4';
  const ids = []; const num = id => { let k = ids.indexOf(id); if (k < 0) { ids.push(id); k = ids.length - 1; } return k + 1; };
  c.fontes.forEach(num);
  const esc = s => String(s).replace(/"/g, '&quot;');
  const refs = txt => String(txt).replace(/\{(\w+)\}/g, (_, id) => CMP_FONTES[id] ? `<a class="cp-src" href="#cp-${c.id}-ref-${id}" title="${esc(CMP_FONTES[id][0])}">[${num(id)}]</a>` : '');
  const custo = (x, label) => {
    if (!x) return '<span class="cp-na">sem referência SINAPI no portal</span>';
    const v = cmpCusto(x, uf);
    return v == null ? `<span class="cp-na">${x.d}: sem preço SINAPI em ${uf}</span>`
      : `<span class="cp-cost" data-ins="${x.ins}" data-div="${x.div || 1}">${cmpR$(v)}</span><br><small>${x.d}</small> ${refs('{sinapi}')}`;
  };
  const temCusto = c.linhas.some(([k]) => /^Custo de referência/.test(k));
  const apps = { casa: 'Casa', predio: 'Prédio alto', hospital: 'Hospital', industria: 'Indústria' };
  const fichas = [...new Map(c.opcoes.map(([n, m]) => [m, n])).entries()];
  return `
      <p class="cp-oneline"><b>Quando usar cada um:</b> ${refs(c.resumo)}</p>
      <${h} class="cp-h">Lado a lado</${h}>
      <div class="cp-tablewrap"><table class="cp-table">
        <thead><tr><th scope="col">Critério</th>${c.opcoes.map(([n, m]) => `<th scope="col">${n}<a href="/materiais/${m}" data-sheet="mat-${m}">ver ficha</a></th>`).join('')}</tr></thead>
        <tbody>${c.linhas.map(([k, vals]) => `<tr><th scope="row">${k}${/^Custo de referência/.test(k) ? ` <span class="cp-uf">${uf}</span>` : ''}</th>${vals.map(v => `<td>${/^Custo de referência/.test(k) ? custo(v) : refs(v)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>
      ${temCusto ? `<p class="cp-note">Custo: só o material, SINAPI ${typeof SINAPI_PRECOS !== 'undefined' ? SINAPI_PRECOS.ref : ''}, ${uf}, sem desoneração. Não inclui conexões, mão de obra, BDI e frete.</p>` : ''}
      <${h} class="cp-h">Prós e contras</${h}>
      <div class="cp-opts">${c.opcoes.map(([n], i) => `<div class="cp-opt"><b>${n}</b><ul class="cp-pro">${c.pros[i][0].map(x => `<li>${refs(x)}</li>`).join('')}</ul><ul class="cp-con">${c.pros[i][1].map(x => `<li>${refs(x)}</li>`).join('')}</ul></div>`).join('')}</div>
      <${h} class="cp-h">Escolha por aplicação</${h}>
      <div class="cp-apps">${Object.entries(c.apps).map(([k, v]) => `<div class="cp-app"><b>${apps[k]}</b>${refs(v)}</div>`).join('')}</div>
      <${h} class="cp-h">Erros comuns</${h}>
      <ul class="cp-errs">${c.erros.map(e => `<li>${e}</li>`).join('')}</ul>
      <p class="cp-note"><a href="${o.erros || '/guias-praticos'}">Veja causas e soluções em Erros e patologias →</a></p>
      <${h} class="cp-h">Fontes deste comparativo</${h}>
      <ol class="cp-refs">${ids.map((id, k) => `<li value="${k + 1}" id="cp-${c.id}-ref-${id}"><a href="${CMP_FONTES[id][1]}" target="_blank" rel="noopener noreferrer">${CMP_FONTES[id][0]}</a> <span class="cp-kind cp-kind--${CMP_FONTES[id][2]}">${CMP_KIND[CMP_FONTES[id][2]]}</span></li>`).join('')}</ol>
      <div class="cp-actions">
        ${fichas.map(([m, n]) => `<a class="btn btn--ghost btn--sm" href="/materiais/${m}" data-sheet="mat-${m}">Ficha: ${n}</a>`).join('')}
        <a class="btn btn--sm" href="${o.cotacao || '#contato'}" data-subject="Cotação de materiais" data-question="Cotação (comparativo: ${esc(c.titulo)}): informe material, diâmetros, quantidades e local de entrega ">Solicitar cotação</a>
      </div>`;
}
const cmpR$ = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// Comparativos em que um material aparece (ficha do material)
function cmpLinksHTML(matId, h = 'h4') {
  const slug = matId.replace(/^mat-/, '');
  const cs = CMPS.filter(c => c.opcoes.some(([, m]) => m === slug));
  if (!cs.length) return '';
  return `<${h}${h === 'h4' ? '' : ' class="page__h"'}>Compare com outras opções</${h}>
    <p class="relprod">${cs.map(c => `<a href="/comparativos/${c.id}">${c.titulo}</a>`).join('')}</p>`;
}

// Bloco "Comparativos" no início de Guias práticos (página inicial). Montado ao fim do carregamento da página,
// porque os preços (sinapi-precos.js) carregam depois deste arquivo.
typeof document !== 'undefined' && document.addEventListener('DOMContentLoaded', () => {
  const box = document.getElementById('cpList');
  if (!box) return;
  const ufSel = document.getElementById('cpUf');
  let uf = 'SC';
  try { const s = localStorage.getItem('lmUf'); if (s && SINAPI_PRECOS.ufs.includes(s)) uf = s; } catch {}
  if (typeof SINAPI_PRECOS !== 'undefined') {
    ufSel.innerHTML = SINAPI_PRECOS.ufs.map(u => `<option value="${u}"${u === uf ? ' selected' : ''}>${u}</option>`).join('');
  } else ufSel.closest('label').hidden = true;
  document.getElementById('cpIndex').innerHTML = CMPS.map(c => `<a href="#cmp-${c.id}"><span>${c.tema}</span><b>${c.titulo}</b></a>`).join('');
  box.innerHTML = CMPS.map(c => `
    <details class="cp-cmp" id="cmp-${c.id}">
      <summary><span class="cp-tag">${c.tema}</span><h3>${c.titulo}</h3><span class="gpguide__chev" aria-hidden="true">▾</span></summary>
      <div class="cp-body">${comparativoHTML(c, { uf, erros: '#gp-pats' })}
        <p class="cp-note"><a href="/comparativos/${c.id}">Página própria deste comparativo →</a></p>
      </div>
    </details>`).join('');
  if (typeof glossarize === 'function') box.querySelectorAll('.cp-oneline, .cp-opts, .cp-apps, .cp-errs').forEach(el => glossarize(el, { max: 4 }));
  // troca do estado: atualiza só os preços
  ufSel.addEventListener('change', () => {
    uf = ufSel.value;
    try { localStorage.setItem('lmUf', uf); } catch {}
    box.querySelectorAll('.cp-cost').forEach(el => { const v = cmpCusto({ ins: el.dataset.ins, div: +el.dataset.div }, uf); el.textContent = v == null ? '—' : cmpR$(v); });
    box.querySelectorAll('.cp-uf').forEach(el => { el.textContent = uf; });
    box.querySelectorAll('.cp-note').forEach(el => { el.innerHTML = el.innerHTML.replace(/, [A-Z]{2}, sem desoneração/, `, ${uf}, sem desoneração`); });
  });
  // índice e submenu: abre o comparativo antes de o roteador rolar até ele
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#cmp-"]'); if (!a) return;
    const d = document.getElementById(a.getAttribute('href').slice(1)); if (d) d.open = true;
  }, true);
  if (location.hash.startsWith('#cmp-')) { const d = document.getElementById(location.hash.slice(1)); if (d) d.open = true; }
});
