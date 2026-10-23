// Normas técnicas por segmento de aplicação e por produto.
// org define o link: ABNT → página da norma no ABNT Catálogo (resumo, preço e compra);
// NR → texto oficial gratuito (gov.br); NFPA → página oficial com leitura gratuita on-line;
// ASTM, ASME, ISO, API e ASHRAE → página oficial da entidade (resumo e compra).
// Títulos e situação das NBR conferidos no ABNT Catálogo em 17/10/2026.
const NORM_GROUPS = [
  // ---------- Normas usadas pelas ferramentas de cálculo do site ----------
  { id: 'dimensionamento', tipo: 'aplicacao', name: 'Dimensionamento Inteligente (normas usadas nos cálculos)', normas: [
    { code: 'NBR 5626', org: 'ABNT', title: 'Sistemas prediais de água fria e água quente — Projeto, execução, operação e manutenção', note: 'No Dimensionamento Inteligente: pesos dos aparelhos e vazão de projeto, velocidade máxima de 3 m/s, perda de carga (Fair-Whipple-Hsiao), reservação e pressões. Norma de sistema para metais, registros e reservatórios.' },
    { code: 'NBR 5648', org: 'ABNT', title: 'Tubos e conexões de PVC-U com junta soldável para sistemas prediais de água fria', note: 'No Dimensionamento Inteligente: tubos e conexões de PVC soldável de água fria e diâmetros internos usados no cálculo.' },
    { code: 'NBR 15813-1', org: 'ABNT', title: 'Sistemas de tubulações plásticas para instalações prediais de água quente e fria — Polipropileno copolímero random PP-R — Parte 1: Tubos', note: 'No Dimensionamento Inteligente: tubos e conexões de PPR (PN 12 e PN 20) da água fria.' },
    { code: 'NBR 15884-1', org: 'ABNT', title: 'Sistemas de tubulações plásticas para instalações prediais de água quente e fria — Policloreto de vinila clorado (CPVC) — Parte 1: Tubos', note: 'No Dimensionamento Inteligente: tubos e conexões de CPVC da água quente.' },
    { code: 'NBR 15939-1', org: 'ABNT', title: 'Sistemas de tubulações plásticas para instalações prediais de água quente e fria — Polietileno reticulado (PE-X) — Parte 1: Requisitos e métodos de ensaio', note: 'No Dimensionamento Inteligente: tubos e conexões de PEX da água quente.' },
    { code: 'NBR 13206', org: 'ABNT', title: 'Tubo de cobre leve, médio e pesado, sem costura, para condução de fluidos', note: 'No Dimensionamento Inteligente: tubos de cobre classe E (água quente) e classe A (gás).' },
    { code: 'NBR 11720', org: 'ABNT', title: 'Conexões para união de tubos de cobre por soldagem ou brasagem capilar', note: 'No Dimensionamento Inteligente: joelhos, tês e conectores de cobre.' },
    { code: 'NBR 5580', org: 'ABNT', title: 'Tubos de aço-carbono para usos comuns na condução de fluidos', note: 'No Dimensionamento Inteligente: tubos galvanizados classe média (roscados) e classe leve (ranhurados) de recalque, gás e incêndio.' },
    { code: 'NBR 6943', org: 'ABNT', title: 'Conexões de ferro fundido com rosca ABNT NBR NM ISO 7-1 para tubulações', note: 'No Dimensionamento Inteligente: conexões galvanizadas roscadas e bujões dos pontos de espera.' },
    { code: 'NBR NM ISO 7-1', org: 'ABNT', title: 'Rosca para tubos onde a junta de vedação sob pressão é feita pela rosca (BSP cônica)', note: 'No Dimensionamento Inteligente: rosca das conexões galvanizadas, saídas com bucha de latão e bujões.' },
    { code: 'AWWA C606', org: 'AWWA', title: 'Grooved and Shouldered Joints', note: 'No Dimensionamento Inteligente: tês, curvas e acoplamentos do sistema ranhurado (Grooved) da rede de incêndio.' },
    { code: 'ASTM A106', org: 'ASTM', title: 'Seamless Carbon Steel Pipe for High-Temperature Service', note: 'No Dimensionamento Inteligente: tubo de aço carbono sem costura (schedule 40), quando usado.' },
    { code: 'NBR 15705', org: 'ABNT', title: 'Instalações hidráulicas prediais — Registro de gaveta — Requisitos e métodos de ensaio', note: 'No Dimensionamento Inteligente: registros de gaveta dos ambientes, colunas, barrilete e recalque.' },
    { code: 'NBR 15704-1', org: 'ABNT', title: 'Registro — Requisitos e métodos de ensaio — Parte 1: Registros de pressão', note: 'No Dimensionamento Inteligente: registros de pressão dos chuveiros.' },
    { code: 'NBR 14799', org: 'ABNT', title: 'Reservatório com corpo em polietileno, com tampa em polietileno ou em polipropileno, para água potável, com volume nominal de até 3 000 L (inclusive) — Requisitos e métodos de ensaio', note: 'No Dimensionamento Inteligente: caixas d’água e cisternas de polietileno das casas.' },
    { code: 'NBR 15097-1', org: 'ABNT', title: 'Aparelhos sanitários de material cerâmico — Parte 1: Requisitos e métodos de ensaios', note: 'No Dimensionamento Inteligente: bacias, lavatórios e tanques de louça. Confira no ABNT Catálogo a edição vigente.' },
    { code: 'NBR 9050', org: 'ABNT', title: 'Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos', note: 'No Dimensionamento Inteligente: sanitários acessíveis (PNE) das áreas comuns.' },
    { code: 'NBR 8160', org: 'ABNT', title: 'Sistemas prediais de esgoto sanitário — Projeto e execução', note: 'No Dimensionamento Inteligente: unidades Hunter de contribuição (UHC), diâmetro do coletor predial, colunas, ventilação, caixas sifonadas, de gordura e de inspeção.' },
    { code: 'NBR 5688', org: 'ABNT', title: 'Tubos e conexões de PVC-U para sistemas prediais de água pluvial, esgoto sanitário e ventilação', note: 'No Dimensionamento Inteligente: tubos e conexões de esgoto (série normal) e águas pluviais (série R).' },
    { code: 'NBR 10844', org: 'ABNT', title: 'Instalações prediais de águas pluviais — Procedimento', note: 'No Dimensionamento Inteligente: condutores, calhas, ralos e caixas de areia.' },
    { code: 'NBR 15527', org: 'ABNT', title: 'Aproveitamento de água de chuva de coberturas para fins não potáveis — Requisitos', note: 'No Dimensionamento Inteligente: cisterna, filtro, descarte da primeira chuva e rede não potável separada.' },
    { code: 'NBR 10339', org: 'ABNT', title: 'Piscina — Projeto, execução e manutenção', note: 'No Dimensionamento Inteligente: filtragem, recirculação e ralos de fundo antiaprisionamento da piscina.' },
    { code: 'NBR 15526', org: 'ABNT', title: 'Redes de distribuição interna para gases combustíveis em instalações residenciais — Projeto e execução', note: 'No Dimensionamento Inteligente: prumadas, ramais, medidores e registros de gás natural e GLP.' },
    { code: 'NBR 14177', org: 'ABNT', title: 'Tubo flexível metálico para instalações de gás combustível de baixa pressão', note: 'No Dimensionamento Inteligente: flexíveis de ligação de cooktops, aquecedores e churrasqueiras a gás.' },
    { code: 'NBR 8473', org: 'ABNT', title: 'Regulador de baixa pressão para gás liquefeito de petróleo (GLP) com capacidade até 4 kg/h', note: 'No Dimensionamento Inteligente: regulador do botijão P13.' },
    { code: 'NBR 13523', org: 'ABNT', title: 'Central de gás liquefeito de petróleo — GLP', note: 'No Dimensionamento Inteligente: central de GLP e uso de botijões.' },
    { code: 'NBR 13103', org: 'ABNT', title: 'Instalação de aparelhos a gás — Requisitos', note: 'No Dimensionamento Inteligente: aquecedores de passagem a gás e dutos de exaustão.' },
    { code: 'NBR 13714', org: 'ABNT', title: 'Sistemas de hidrantes e de mangotinhos para combate a incêndio', note: 'No Dimensionamento Inteligente: hidrantes, abrigos, mangueiras, esguichos, registro de recalque e bomba de incêndio.' },
    { code: 'NBR 11861', org: 'ABNT', title: 'Mangueira de incêndio — Requisitos e métodos de ensaio', note: 'No Dimensionamento Inteligente: mangueiras de 1 1/2" dos hidrantes.' },
    { code: 'NBR 10897', org: 'ABNT', title: 'Sistemas de proteção contra incêndio por chuveiros automáticos — Requisitos', note: 'No Dimensionamento Inteligente: área por bico de sprinkler (risco leve e ordinário), VGA, chaves de fluxo, teste e dreno.' },
    { code: 'NFPA 13', org: 'NFPA', title: 'Standard for the Installation of Sprinkler Systems', note: 'No Dimensionamento Inteligente: sprinklers ESFR de armazenagem.' },
    { code: 'NBR 14105-1', org: 'ABNT', title: 'Medidores de pressão — Parte 1: Medidores analógicos de pressão com sensor de elemento elástico', note: 'No Dimensionamento Inteligente: manômetros da rede de incêndio.' },
    { code: 'NR-13', org: 'NR', title: 'Caldeiras, vasos de pressão, tubulações e tanques metálicos de armazenamento', note: 'No Dimensionamento Inteligente: sala de máquinas de refrigeração com amônia.' },
    { code: 'NBR 16069', org: 'ABNT', title: 'Segurança em sistemas frigoríficos', note: 'No Dimensionamento Inteligente: refrigeração com amônia.' },
  ]},
  // ---------- Por aplicação ----------
  { id: 'desempenho', tipo: 'aplicacao', name: 'Desempenho de edificações (NBR 15575)', normas: [
    { code: 'NBR 15575-6', org: 'ABNT', title: 'Edificações habitacionais — Desempenho — Parte 6: Requisitos para os sistemas hidrossanitários', note: 'A norma pela qual construtoras e incorporadoras respondem pelas instalações: estanqueidade das redes de água e esgoto, separação entre água potável e não potável, temperatura segura da água quente, ruído dos equipamentos, acesso para manutenção e vida útil de projeto (VUP) mínima de 20 anos para o sistema hidrossanitário.' },
    { code: 'NBR 15575-1', org: 'ABNT', title: 'Edificações habitacionais — Desempenho — Parte 1: Requisitos gerais', note: 'Define a vida útil de projeto (VUP) de cada sistema da edificação e os prazos de garantia recomendados.' },
    { code: 'NBR 14037', org: 'ABNT', title: 'Diretrizes para elaboração de manuais de uso, operação e manutenção das edificações — Requisitos para elaboração e apresentação dos conteúdos', note: 'Manual do proprietário e das áreas comuns, entregue com o imóvel, com as instalações hidrossanitárias, os cuidados de uso e as garantias.' },
    { code: 'NBR 5674', org: 'ABNT', title: 'Manutenção de edificações — Requisitos para o sistema de gestão de manutenção', note: 'Plano de manutenção preventiva do prédio. Sem manutenção registrada, a construtora pode deixar de responder por defeitos causados pela falta dela.' },
  ] },
  { id: 'agua', tipo: 'aplicacao', name: 'Água fria e quente predial', normas: [
    { code: 'NBR 5626', org: 'ABNT', title: 'Sistemas prediais de água fria e água quente — Projeto, execução, operação e manutenção', note: 'Norma-base das instalações hidráulicas prediais: pressões, vazões, dimensionamento e materiais.' },
    { code: 'NBR 15569', org: 'ABNT', title: 'Sistema de aquecimento solar de água em circuito direto — Requisitos de projeto e instalação' },
    { code: 'NBR 15704-1', org: 'ABNT', title: 'Registro — Requisitos e métodos de ensaio — Parte 1: Registros de pressão' },
    { code: 'NBR 14799', org: 'ABNT', title: 'Reservatório com corpo em polietileno, com tampa em polietileno ou em polipropileno, para água potável, com volume nominal de até 3 000 L (inclusive) — Requisitos e métodos de ensaio' },
    { code: 'NBR 15097-1', org: 'ABNT', title: 'Aparelhos sanitários de material cerâmico — Parte 1: Requisitos e métodos de ensaios', note: 'Confira no ABNT Catálogo a edição vigente.' },
    { code: 'NBR 10339', org: 'ABNT', title: 'Piscina — Projeto, execução e manutenção' },
    { code: 'NBR 9050', org: 'ABNT', title: 'Acessibilidade a edificações, mobiliário, espaços e equipamentos urbanos', note: 'Sanitários acessíveis, barras de apoio e alturas de louças e metais.' },
  ]},
  { id: 'esgoto', tipo: 'aplicacao', name: 'Esgoto, águas pluviais e tratamento', normas: [
    { code: 'NBR 8160', org: 'ABNT', title: 'Sistemas prediais de esgoto sanitário — Projeto e execução', note: 'Declividades, ventilação, caixas sifonadas e dimensionamento de ramais e tubos de queda.' },
    { code: 'NBR 10844', org: 'ABNT', title: 'Instalações prediais de águas pluviais — Procedimento' },
    { code: 'NBR 15527', org: 'ABNT', title: 'Aproveitamento de água de chuva de coberturas para fins não potáveis — Requisitos' },
    { code: 'NBR 17076', org: 'ABNT', title: 'Projeto de sistema de tratamento de esgoto de menor porte — Requisitos', note: 'Substitui as NBR 7229 (tanques sépticos) e NBR 13969, canceladas em 2024.' },
  ]},
  { id: 'gas', tipo: 'aplicacao', name: 'Gás combustível (GN e GLP)', normas: [
    { code: 'NBR 15526', org: 'ABNT', title: 'Redes de distribuição interna para gases combustíveis em instalações residenciais — Projeto e execução' },
    { code: 'NBR 13523', org: 'ABNT', title: 'Central de gás liquefeito de petróleo — GLP' },
    { code: 'NBR 13103', org: 'ABNT', title: 'Instalação de aparelhos a gás — Requisitos', note: 'Ventilação e chaminés de aquecedores, fogões e demais aparelhos a gás.' },
    { code: 'NBR 14462-1', org: 'ABNT', title: 'Sistemas para distribuição de gás combustível para redes enterradas — Tubos e conexões de polietileno PE 80 e PE 100 — Parte 1', note: 'Substitui a NBR 14462:2000, cancelada em 2016.' },
    { code: 'NBR 14177', org: 'ABNT', title: 'Tubo flexível metálico para instalações de gás combustível de baixa pressão' },
    { code: 'NBR 8473', org: 'ABNT', title: 'Regulador de baixa pressão para gás liquefeito de petróleo (GLP) com capacidade até 4 kg/h' },
  ]},
  { id: 'incendio', tipo: 'aplicacao', name: 'Combate a incêndio', normas: [
    { code: 'NBR 13714', org: 'ABNT', title: 'Sistemas de hidrantes e de mangotinhos para combate a incêndio' },
    { code: 'NBR 10897', org: 'ABNT', title: 'Sistemas de proteção contra incêndio por chuveiros automáticos — Requisitos', note: 'Projeto e instalação de sprinklers no Brasil.' },
    { code: 'NBR 11861', org: 'ABNT', title: 'Mangueira de incêndio — Requisitos e métodos de ensaio' },
    { code: 'NBR 12779', org: 'ABNT', title: 'Mangueira de incêndio — Inspeção, manutenção e cuidados' },
    { code: 'NFPA 13', org: 'NFPA', title: 'Standard for the Installation of Sprinkler Systems', note: 'Referência internacional para sprinklers; a NFPA oferece leitura gratuita on-line.' },
    { code: 'NFPA 20', org: 'NFPA', title: 'Standard for the Installation of Stationary Pumps for Fire Protection' },
  ]},
  { id: 'vapor', tipo: 'aplicacao', name: 'Vapor, caldeiras e vasos de pressão', normas: [
    { code: 'NR-13', org: 'NR', title: 'Caldeiras, vasos de pressão, tubulações e tanques metálicos de armazenamento', note: 'Norma regulamentadora obrigatória, com texto oficial gratuito.' },
    { code: 'ASME B31.1', org: 'ASME', title: 'Power Piping — tubulações de vapor e de centrais de geração' },
    { code: 'ASME BPVC Seção I', org: 'ASME', title: 'Rules for Construction of Power Boilers — construção de caldeiras' },
  ]},
  { id: 'ar', tipo: 'aplicacao', name: 'Ar comprimido', normas: [
    { code: 'ISO 8573-1', org: 'ISO', title: 'Compressed air — Contaminants and purity classes', note: 'Define as classes de qualidade do ar (partículas, água e óleo).' },
    { code: 'ISO 1217', org: 'ISO', title: 'Displacement compressors — Acceptance tests', note: 'Medição de vazão e desempenho de compressores.' },
    { code: 'NR-13', org: 'NR', title: 'Reservatórios de ar comprimido são vasos de pressão sujeitos à NR-13' },
  ]},
  { id: 'saneamento', tipo: 'aplicacao', name: 'Saneamento e redes públicas', normas: [
    { code: 'NBR 12211', org: 'ABNT', title: 'Estudos de concepção de sistemas públicos de abastecimento de água' },
    { code: 'NBR 12215', org: 'ABNT', title: 'Projeto de adutora de água para abastecimento público' },
    { code: 'NBR 12218', org: 'ABNT', title: 'Projeto de rede de distribuição de água para abastecimento público — Procedimento' },
    { code: 'NBR 12215-1', org: 'ABNT', title: 'Projeto de adutora de água — Parte 1: Conduto forçado' },
    { code: 'NBR 9649', org: 'ABNT', title: 'Projeto de redes coletoras de esgoto sanitário — Procedimento' },
    { code: 'NBR 12214', org: 'ABNT', title: 'Projeto de estação de bombeamento ou de estação elevatória de água — Requisitos' },
  ]},
  { id: 'refrigeracao', tipo: 'aplicacao', name: 'Refrigeração e ar-condicionado', normas: [
    { code: 'NBR 16401-1', org: 'ABNT', title: 'Instalações de condicionamento de ar — Sistemas centrais e unitários — Parte 1: Projetos das instalações' },
    { code: 'NBR 16069', org: 'ABNT', title: 'Segurança em sistemas frigoríficos' },
    { code: 'ASHRAE 15', org: 'ASHRAE', title: 'Safety Standard for Refrigeration Systems' },
  ]},
  { id: 'industrial', tipo: 'aplicacao', name: 'Industrial, petróleo e combustíveis', normas: [
    { code: 'ASME B31.3', org: 'ASME', title: 'Process Piping — tubulações de processo industrial' },
    { code: 'ASME B31.4', org: 'ASME', title: 'Pipeline Transportation Systems for Liquids and Slurries — dutos de líquidos' },
    { code: 'ASME B31.8', org: 'ASME', title: 'Gas Transmission and Distribution Piping Systems — dutos de gás' },
    { code: 'NBR 17505-1', org: 'ABNT', title: 'Armazenamento de líquidos inflamáveis e combustíveis — Parte 1: Disposições gerais' },
    { code: 'API 650', org: 'API', title: 'Welded Tanks for Oil Storage — tanques soldados de armazenamento' },
  ]},

  // ---------- Por produto ----------
  { id: 'oleohidraulica', tipo: 'aplicacao', name: 'Hidráulica de potência (óleo hidráulico)', normas: [
    { code: 'ISO 4413', org: 'ISO', title: 'Hydraulic fluid power — General rules and safety requirements for systems and their components' },
    { code: 'ISO 1219-1', org: 'ISO', title: 'Fluid power systems and components — Graphical symbols and circuit diagrams' },
    { code: 'ISO 4406', org: 'ISO', title: 'Hydraulic fluid power — Fluids — Code for defining the level of contamination by solid particles' },
  ] },
  { id: 'gases', tipo: 'aplicacao', name: 'Gases medicinais e industriais', normas: [
    { code: 'NBR 12188', org: 'ABNT', title: 'Sistemas centralizados de suprimento de gases medicinais, de gases para dispositivos médicos e de vácuo para uso em serviços de saúde' },
    { code: 'ISO 7396-1', org: 'ISO', title: 'Medical gas pipeline systems — Pipelines for compressed medical gases and vacuum' },
    { code: 'NBR 12176', org: 'ABNT', title: 'Cilindros para gases — Identificação do conteúdo' },
    { code: 'ISO 9539', org: 'ISO', title: 'Gas welding equipment — Materials for equipment used in gas welding, cutting and allied processes' },
  ] },
  { id: 'sanitario', tipo: 'aplicacao', name: 'Processos sanitários (alimentos, bebidas e farmacêutica)', normas: [
    { code: 'ASME BPE', org: 'ASME', title: 'Bioprocessing Equipment — tubulações e componentes para processos higiênicos' },
    { code: 'DIN 11850', org: 'DIN', title: 'Tubos de aço inoxidável para alimentos, química e farmacêutica — dimensões' },
    { code: 'DIN 11851', org: 'DIN', title: 'Conexões sanitárias roscadas (união SMS/DIN) em aço inoxidável' },
    { code: 'DIN 32676', org: 'DIN', title: 'Conexões sanitárias tipo clamp para tubos de aço inoxidável' },
  ] },
  { id: 'plasticos', tipo: 'produto', name: 'Tubos e conexões plásticas', normas: [
    { code: 'NBR 5648', org: 'ABNT', title: 'Tubos e conexões de PVC-U com junta soldável para sistemas prediais de água fria' },
    { code: 'NBR 5688', org: 'ABNT', title: 'Tubos e conexões de PVC-U para sistemas prediais de água pluvial, esgoto sanitário e ventilação' },
    { code: 'NBR 15884-1', org: 'ABNT', title: 'Sistemas de tubulações plásticas para instalações prediais de água quente e fria — Policloreto de vinila clorado (CPVC) — Parte 1: Tubos' },
    { code: 'NBR 15939-1', org: 'ABNT', title: 'Sistemas de tubulações plásticas para instalações prediais de água quente e fria — Polietileno reticulado (PE-X) — Parte 1: Requisitos e métodos de ensaio' },
    { code: 'NBR 15813-1', org: 'ABNT', title: 'Sistemas de tubulações plásticas para instalações prediais de água quente e fria — Polipropileno copolímero random PP-R — Parte 1: Tubos' },
    { code: 'NBR 15561', org: 'ABNT', title: 'Tubulação de polietileno PE 80 e PE 100 para transporte de água e esgoto sob pressão — Requisitos' },
    { code: 'NBR 14462-1', org: 'ABNT', title: 'Tubos e conexões de polietileno PE 80 e PE 100 para redes enterradas de gás combustível — Parte 1' },
  ]},
  { id: 'metalicos', tipo: 'produto', name: 'Tubos metálicos', normas: [
    { code: 'NBR 5580', org: 'ABNT', title: 'Tubos de aço-carbono para usos comuns na condução de fluidos' },
    { code: 'NBR 5590', org: 'ABNT', title: 'Tubos de aço-carbono com ou sem solda longitudinal, pretos ou galvanizados' },
    { code: 'ASTM A53', org: 'ASTM', title: 'Pipe, Steel, Black and Hot-Dipped, Zinc-Coated, Welded and Seamless' },
    { code: 'ASTM A106', org: 'ASTM', title: 'Seamless Carbon Steel Pipe for High-Temperature Service' },
    { code: 'NBR 13206', org: 'ABNT', title: 'Tubo de cobre leve, médio e pesado, sem costura, para condução de fluidos' },
    { code: 'ASTM B88', org: 'ASTM', title: 'Seamless Copper Water Tube' },
    { code: 'NBR 7675', org: 'ABNT', title: 'Tubos e conexões de ferro dúctil e acessórios para sistemas de adução e distribuição de água' },
    { code: 'ASTM A312', org: 'ASTM', title: 'Seamless, Welded, and Heavily Cold Worked Austenitic Stainless Steel Pipes' },
  ]},
  { id: 'conexoes', tipo: 'produto', name: 'Conexões, flanges e juntas', normas: [
    { code: 'NBR 6943', org: 'ABNT', title: 'Conexões de ferro fundido com rosca ABNT NBR NM ISO 7-1 para tubulações' },
    { code: 'NBR 11720', org: 'ABNT', title: 'Conexões para união de tubos de cobre por soldagem ou brasagem capilar' },
    { code: 'AWWA C606', org: 'AWWA', title: 'Grooved and Shouldered Joints', note: 'Acoplamentos e conexões ranhuradas (Grooved).' },
    { code: 'ASME B16.3', org: 'ASME', title: 'Malleable Iron Threaded Fittings' },
    { code: 'ASME B16.5', org: 'ASME', title: 'Pipe Flanges and Flanged Fittings' },
    { code: 'ASME B16.9', org: 'ASME', title: 'Factory-Made Wrought Buttwelding Fittings' },
    { code: 'ASME B16.11', org: 'ASME', title: 'Forged Fittings, Socket-Welding and Threaded' },
    { code: 'ASME B16.22', org: 'ASME', title: 'Wrought Copper and Copper Alloy Solder-Joint Pressure Fittings — conexões de cobre para solda' },
    { code: 'ASME B16.20', org: 'ASME', title: 'Metallic Gaskets for Pipe Flanges' },
    { code: 'ASME B16.21', org: 'ASME', title: 'Nonmetallic Flat Gaskets for Pipe Flanges' },
  ]},
  { id: 'valvulas', tipo: 'produto', name: 'Válvulas e registros', normas: [
    { code: 'NBR 15704-1', org: 'ABNT', title: 'Registro — Requisitos e métodos de ensaio — Parte 1: Registros de pressão' },
    { code: 'NBR 15705', org: 'ABNT', title: 'Instalações hidráulicas prediais — Registro de gaveta — Requisitos e métodos de ensaio' },
    { code: 'ASME B16.34', org: 'ASME', title: 'Valves — Flanged, Threaded, and Welding End' },
    { code: 'API 600', org: 'API', title: 'Steel Gate Valves — Flanged and Butt-welding Ends, Bolted Bonnets' },
    { code: 'API 6D', org: 'API', title: 'Pipeline and Piping Valves' },
    { code: 'ISO 17292', org: 'ISO', title: 'Metal ball valves for petroleum, petrochemical and allied industries' },
  ]},
  { id: 'bombas', tipo: 'produto', name: 'Bombas', normas: [
    { code: 'ISO 9906', org: 'ISO', title: 'Rotodynamic pumps — Hydraulic performance acceptance tests', note: 'Ensaios de recebimento: vazão, altura, potência e rendimento.' },
    { code: 'ISO 2858', org: 'ISO', title: 'End-suction centrifugal pumps — Designation, nominal duty point and dimensions' },
    { code: 'NFPA 20', org: 'NFPA', title: 'Standard for the Installation of Stationary Pumps for Fire Protection' },
  ]},
  { id: 'instrumentos', tipo: 'produto', name: 'Manômetros e medidores', normas: [
    { code: 'NBR 14105-1', org: 'ABNT', title: 'Medidores de pressão — Parte 1: Medidores analógicos de pressão com sensor de elemento elástico' },
  ]},
  { id: 'roscas', tipo: 'produto', name: 'Roscas para tubos', normas: [
    { code: 'NBR NM ISO 7-1', org: 'ABNT', title: 'Rosca para tubos onde a junta de vedação sob pressão é feita pela rosca (BSP cônica)' },
    { code: 'ISO 228-1', org: 'ISO', title: 'Pipe threads where pressure-tight joints are not made on the threads (BSP paralela)' },
    { code: 'ASME B1.20.1', org: 'ASME', title: 'Pipe Threads, General Purpose, Inch (NPT)' },
  ]},
];

// Páginas de cada NBR no ABNT Catálogo (resumo oficial, preço e compra).
const ABNT_URLS = {
  'NBR 5580': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=RUgrTDUvODd4VXJYaU9yK2ZmMWVNcU43Z1RlcHJTZ2FaenQ5SUk0d1BITT0=',
  'NBR 5590': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=a0RXcW1kS3VIM3ZWRVdNOGdGV0REQ0hZRjdQa3ZRcXY5UmMrYXhySzVhND0=',
  'NBR 5626': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=U3RDSi9TSHpnQTRJZm9IUzVWQ2cvQ25BQWhJZVNHaGJUV1ZsTS8veFc1MD0=',
  'NBR 5648': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=VFFSRm5ObVJCa1EvOWpkS2hFMmgxVnBEZDI0MUdQaEpQSkxFaEFaanhSZz0=',
  'NBR 5688': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=NUFnSUtiR2RobzIralNwaHprNkJDSU1kQjFlOTdLLy9hcUQ4ZUtZUFFHRT0=',
  'NBR 6943': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=TjJnOFhmWkJIRmtZdmJnNHpKei9FbjNWSVM2Y0RKRTY5QlNTbExURnZWOD0=',
  'NBR 7675': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=RzNIZ0J6QUxyYzRTbHh2eVBRNUd6cFVjb3VjQ0RWNUw5dHZXUGRXZG1xST0=',
  'NBR 8160': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=TFJ0dkN6aGtsbWVOMnNQWCsyeTZTRkE5bDVpNUIveEl0ekFTQ3ZWYW1RRT0=',
  'NBR 9649': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=bmhLKzBZa1cvR1p6SUdRd0hEbWlHSm0yNEJ4bTFOTUp4czVJMWFheGw1dz0=',
  'NBR 10844': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=UXJwYWh3b2dsK2ZIc1E2OXhmSlVZL2RMZ0ZrWHU4S1pvTG9lTnVDbmdsaz0=',
  'NBR 10897': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=WUYxZWdLOG9GaW93cldGQjFXUlJ0NjJ4NDRxSTJzRUJKNkVtdVpLQkd6MD0=',
  'NBR 11720': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=UzJFTVFPV0JGRW9PdVJja1o3cThHRXNPdS8wdVUzTkVOanRUdTM1R25mOD0=',
  'NBR 11861': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=VStYeVBtY0Y1dDBhOWh2QXpaQm5kdWVYZ2xsUm5ETDhDV0l6RXFuSlpyRT0=',
  'NBR 12214': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=M1JOUFQ0V1k2U21ReXlHQ3JpT1dVaGpSLy9UbER0azNTY0cvSFdybkZ5cz0=',
  'NBR 12215-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=eXNxTjU3ajU3cjFtYkxpMHNLSXNITFhPN1N1dGt3bjFzZmM5OWhzcStTUT0=',
  'NBR 12218': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=eSs5dVlLNHV4Z3hBZ3l0SlZ0SzB2NStKc1FFZTFDSThwbVZheTR6MDdpRT0=',
  'NBR 12779': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=N3BpOXJYR05mWGJtUjN0Qk1Obzh1OEZ3Q1hIU1RMcEVMYnU3cTd3VE5kQT0=',
  'NBR 13103': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=ZDlxMXhxaTl0ZmVFVVhDM3F4T0YvSHAzbWJwRk1TMmVXdFhyakJhc0s2Yz0=',
  'NBR 13206': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=bGlqS1h1bC9IMVRvYk1TeWJLUEtEWFg4MWF6Q1NpY2tqWit4MzI2UFNNWT0=',
  'NBR 13523': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=YThMN1pWVnVGNkFYS1RBMUM4UFJrREpYKzd5cUY3Ym11QjVCQm80UlliWT0=',
  'NBR 13714': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=L2RycThha0NVNFJiWXVGQWtWU2p2YnB3NWwyN1NMdERjcTluZTJzRS9HST0=',
  'NBR 14105-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=Mk1IRnZVQWVDWWhnN1R4bU1EdGJueGNvaWJ5Y3h5SzNOMVgzT29vMWd2TT0=',
  'NBR 14462-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=SlFrcStWNXVteG1maG1jRUpSY1FKY25HaEpYYWpjK3NoQ1F2YUNUNk5aST0=',
  'NBR 15526': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=bnpxSE0zZEErNUFsM1ZPTzZGYXVaeU1QbFRHSnU0YzIwSzQwc2ZBYitORT0=',
  'NBR 15561': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=M0wzNHh5WDBWM1k1MmovbUgrc053YjlGZTJLaVVxeXVKSzB0SWZXd2hzaz0=',
  'NBR 15569': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=QjV4OEpxUFh3U0VJWEgvSDY2MlVVVDRhQVRpZjZicklBQngyWnJjZWQ3cz0=',
  'NBR 15704-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=UkZmdGx0YWRyWWd3U1RRWmVuOEZpUzNtSjExK2hBRFA4RGRXMVZKc0p4Zz0=',
  'NBR 15705': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=QXhiVHBmUDBNcVJ6a0ZPY2c0THY0Z3Rpam93dG1HY0N0UDFqNXF4N1ErWT0=',
  'NBR 15813-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=TnF4T01KVkwrZUVVOGtMUTcxRnJwZkFUUndLMHJiUTVJQW5SUVZRK1FsWT0=',
  'NBR 15884-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=ZWNaaGlWWTJJTWhyYjBjR0JkRXlMTzA3VnU1NHNNNkhUNXAzNGxlUjZUYz0=',
  'NBR 15939-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=VHRwdFdyQkZTalNaenRDdERsSTRtMVJaNmZ1R0tJWFFOYmd0SEU1NE4yTT0=',
  'NBR 16069': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=MDA0eXo0TG54b3N3VGNSZXYyT3NjTjgvQzlEOTJkT0xGN0s5TzFDSlQ0bz0=',
  'NBR 16401-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=Rlk0UnRBRjFRdUtBcEtoMFpOazVheGd4YVp2alJOZHlKS3R4ZVFlYlBuND0=',
  'NBR 17076': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=eERiQmtDV2IrbFMxVnlHdWNkejhTVEZDM1p3dEIvWDltUVlOSFd6M2Vhcz0=',
  'NBR 17505-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=V3BrSXNUenEzTm9aVEZORGk1NjJ6YmRGMTBwNGZ4ZTlUWFlPbUo1VjlRRT0=',
  'NBR NM ISO 7-1': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=TUFVTEkxZGoyOXd1QUh2cXpLNlZyQjI0RXp5VThtT0Iyd0FTaDBKaHZzND0=',
};

// Onde consultar e comprar
const NORM_SOURCES = {
  ABNT: { label: 'ABNT Catálogo', home: 'https://www.abntcatalogo.com.br/', action: 'Ver resumo e comprar' },
  NR: { label: 'gov.br (MTE)', home: 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-13-nr-13', action: 'Ler grátis' },
  NFPA: { label: 'NFPA', home: 'https://www.nfpa.org/for-professionals/codes-and-standards/list-of-codes-and-standards', action: 'Ler on-line e comprar' },
  ASME: { label: 'ANSI Webstore', home: 'https://www.asme.org/codes-standards/find-codes-standards', action: 'Ver resumo e comprar' },
  ASTM: { label: 'ASTM', home: 'https://store.astm.org/', action: 'Ver resumo e comprar' },
  ISO: { label: 'ISO', home: 'https://www.iso.org/obp/ui', action: 'Ver resumo e prévia' },
  API: { label: 'API Webstore', home: 'https://www.apiwebstore.org/', action: 'Ver resumo e comprar' },
  ASHRAE: { label: 'ASHRAE', home: 'https://www.ashrae.org/technical-resources/standards-and-guidelines', action: 'Ver na ASHRAE' },
  EN: { label: 'ANSI Webstore', home: 'https://webstore.ansi.org/', action: 'Ver resumo e comprar' },
  DIN: { label: 'ANSI Webstore', home: 'https://webstore.ansi.org/', action: 'Ver resumo e comprar' },
  MSS: { label: 'ANSI Webstore', home: 'https://webstore.ansi.org/', action: 'Ver resumo e comprar' },
  AWWA: { label: 'ANSI Webstore', home: 'https://webstore.ansi.org/', action: 'Ver resumo e comprar' },
  UL: { label: 'ANSI Webstore', home: 'https://webstore.ansi.org/', action: 'Ver resumo e comprar' },
  FM: { label: 'FM Approvals', home: 'https://www.fmapprovals.com/resources/examination-standards', action: 'Baixar grátis na FM Approvals' },
};

// Busca na loja oficial da ANSI (vende normas ASME, EN, DIN, MSS, AWWA e UL)
const ansiSearch = q => `https://webstore.ansi.org/search/find?in=1&st=${encodeURIComponent(q)}`;

// Links diretos para normas cuja página não segue um padrão
const NORM_EXTRA_URLS = {
  'ASME B31.1': 'https://www.asme.org/codes-standards/find-codes-standards/b31-1-power-piping',
  'ASME B31.3': 'https://www.asme.org/codes-standards/find-codes-standards/b31-3-process-piping',
  'ASME Seção I': ansiSearch('ASME BPVC Section I'),
  'ASME BPVC Seção I': ansiSearch('ASME BPVC Section I'),
  'ASHRAE 15': 'https://www.ashrae.org/technical-resources/bookstore/standards-15-34',
  'ISO 9261': 'https://www.abntcatalogo.com.br/pnm.aspx?Q=ejNWZ3hBUThaU1UrN204bkJTVElLQTR4U284eEZKUFlnTWp3UkhuZDJ3cz0=',
  'UL 199': ansiSearch('UL 199 Ed'),
  // Resumo na Target Normas (revenda autorizada da ABNT)
  'NBR 6925': 'https://normas.com.br/visualizar/abnt-nbr-nm/6577/abnt-nbr6925-conexoes-de-ferro-fundido-de-classes-150-e-300-com-rosca-asme-b1201-tipo-npt-para-tubulacoes',
  'NBR 13786': 'https://normas.com.br/visualizar/abnt-nbr-nm/10344/abnt-nbr13786-armazenamento-de-liquidos-inflamaveis-e-combustiveis-selecao-dos-componentes-do-combustivel-sasc-e-sistema-de-armazenamento-subterraneo-de-oleo-lubrificante-usado-e-contaminado-oluc',
  'NBR 14177': 'https://www.normas.com.br/visualizar/abnt-nbr-nm/10909/abnt-nbr14177-tubo-flexivel-metalico-para-instalacoes-de-gas-combustivel-de-baixa-pressao',
  'NBR 15097-1': 'https://www.normas.com.br/visualizar/abnt-nbr-nm/30378/abnt-nbr15097-1-aparelhos-sanitarios-de-material-ceramico-parte-1-requisitos-e-metodos-de-ensaios',
  'AWWA C606': 'https://store.awwa.org/AWWA-C606-22-Grooved-and-Shouldered-Joints',
  'NBR 15345': 'https://normas.com.br/visualizar/abnt-nbr-nm/25054/abnt-nbr15345-instalacao-predial-de-tubos-e-conexoes-de-cobre-e-ligas-de-cobre-procedimento',
};

function normUrl(n) {
  if (NORM_EXTRA_URLS[n.code]) return NORM_EXTRA_URLS[n.code];
  switch (n.org) {
    case 'ABNT': return ABNT_URLS[n.code] || ABNT_URLS[n.code + '-1'] || NORM_SOURCES.ABNT.home;
    case 'NFPA': { const num = n.code.replace('NFPA ', ''); return `https://www.nfpa.org/codes-and-standards/nfpa-${num}-standard-development/${num}`; }
    case 'ASTM': return `https://store.astm.org/catalogsearch/result/?q=${encodeURIComponent(n.code.replace('ASTM ', ''))}`;
    case 'ISO': return `https://www.iso.org/search.html?q=${encodeURIComponent(n.code)}`;
    case 'API': return `https://www.apiwebstore.org/standards/${encodeURIComponent(n.code.replace(/^API (STD |RP )?/, ''))}`;
    case 'ASME': case 'EN': case 'DIN': case 'MSS': case 'AWWA': case 'UL': return ansiSearch(n.code);
  }
  return NORM_SOURCES[n.org].home;
}

const NORM_ORGS = [[/^NBR /, 'ABNT'], [/^NFPA /, 'NFPA'], [/^NR-/, 'NR'], [/^ASME /, 'ASME'], [/^ASTM /, 'ASTM'], [/^ISO /, 'ISO'],
  [/^ASHRAE /, 'ASHRAE'], [/^API /, 'API'], [/^EN /, 'EN'], [/^DIN /, 'DIN'], [/^MSS /, 'MSS'], [/^AWWA /, 'AWWA'], [/^UL /, 'UL'], [/^FM /, 'FM']];

// Devolve {url, org, action, label} para um código de norma, ou null se não for uma norma publicada
function normLink(code) {
  const org = (NORM_ORGS.find(([re]) => re.test(code)) || [])[1];
  if (!org) return null;
  return { url: normUrl({ org, code }), org, action: NORM_SOURCES[org].action, label: NORM_SOURCES[org].label };
}

// Transforma em link as normas citadas dentro de textos corridos
const NORM_IN_TEXT = /\b(NBR(?: NM)?(?: ISO)? \d[\d-]*\d|ISO \d[\d-]*\d|ASME B\d[\d.]*\d|ASTM [A-F]\d+|NFPA \d+|NR-\d+|API \d+|EN \d[\d-]*\d|DIN \d+|MSS SP-\d+|AWWA C\d+)\b/g;
function linkNorms(text) {
  return String(text).replace(NORM_IN_TEXT, code => {
    const l = normLink(code);
    return l ? `<a class="normref notranslate" translate="no" href="${l.url}" target="_blank" rel="noopener noreferrer" title="${l.action} · ${l.label}">${code}</a>` : code;
  });
}

// Etiquetas de normas clicáveis: abrem o resumo ou a página de compra
function normTags(codes) {
  return codes.map(code => {
    const l = normLink(code);
    return l
      ? `<a href="${l.url}" target="_blank" rel="noopener noreferrer" class="notranslate" translate="no" title="${l.action} · ${l.label}">${code} <span aria-hidden="true">↗</span></a>`
      : `<span>${code}</span>`;
  }).join('');
}
