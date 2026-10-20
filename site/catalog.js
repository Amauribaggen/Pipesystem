// Catálogo de produtos e materiais: dados técnicos, normas e ilustração de cada item.
// art = desenho do produto (ver MATERIAL_ART), tone = cor do material, rel = ficha relacionada no guia (products.js).
const CATALOG = [
  // Tubos
  { id: 'mat-pvc', cat: 'Tubos', name: 'Tubos de PVC rígido', apps: 'Água fria, esgoto e drenagem predial', art: 'pipe', tone: '#e6eaee', rel: 'tubos-pvc',
    desc: 'Tubos de PVC-U, leves e imunes à corrosão. A linha soldável atende à água fria predial e a linha de esgoto atende à coleta sanitária e pluvial.',
    specs: [['Material', 'PVC-U (policloreto de vinila não plastificado)'], ['Diâmetros', 'Água fria soldável: 20 a 110 mm · Esgoto: 40 a 150 mm'], ['Pressão de serviço', 'Água fria: 750 kPa (75 mca) a 20 °C'], ['Temperatura', 'Somente água fria'], ['União', 'Solda química (adesivo), rosca ou junta elástica']],
    normas: ['NBR 5648', 'NBR 5688'] },
  { id: 'mat-cpvc', cat: 'Tubos', name: 'Tubos de CPVC', apps: 'Água quente predial e industrial', art: 'pipe', tone: '#e7cf9f', rel: 'tubos-cpvc',
    desc: 'PVC clorado, resistente a temperaturas elevadas, para redes prediais de água quente e fria e para linhas industriais com fluidos químicos.',
    specs: [['Material', 'CPVC (policloreto de vinila clorado)'], ['Diâmetros', 'Predial: 15 a 114 mm · Industrial: 1/2" a 8" (SCH 40/80)'], ['Pressão de serviço', 'Predial: 600 kPa a 80 °C'], ['Temperatura', 'Até 80 °C'], ['União', 'Soldagem a frio com adesivo próprio para CPVC']],
    normas: ['NBR 15884', 'ASTM F441'] },
  { id: 'mat-pex', cat: 'Tubos', name: 'PEX — polietileno reticulado', apps: 'Água quente e fria, sistemas flexíveis', art: 'pipe', tone: '#d9534f', tone2: '#2d7fd3',
    desc: 'Tubos flexíveis, fornecidos em rolos, que permitem trechos contínuos sem conexões intermediárias. São muito usados no sistema "tubo dentro de tubo", com distribuição por coletores (manifolds).',
    specs: [['Material', 'Polietileno reticulado (PE-X)'], ['Diâmetros', '16, 20, 25 e 32 mm (os mais usuais)'], ['Temperatura', 'Água quente e fria, conforme a classe de aplicação do fabricante'], ['União', 'Conexões por crimpagem ou prensagem, com anel'], ['Instalação', 'Coletores de distribuição e tubo-guia corrugado, que permite trocar o tubo']],
    normas: ['NBR 15939', 'ISO 15875'] },
  { id: 'mat-cobre', cat: 'Tubos', name: 'Tubos de cobre', apps: 'Água quente, gás e refrigeração', art: 'pipe', tone: '#d1834e', rel: 'tubos-cobre',
    desc: 'Tubos de cobre rígidos ou flexíveis, duráveis e resistentes a temperatura, para água quente e fria, gás combustível, gases medicinais e refrigeração.',
    specs: [['Material', 'Cobre fosforoso (Cu-DHP)'], ['Diâmetros', '15 a 104 mm (predial)'], ['Classes', 'E (leve), A (média) e I (pesada)'], ['Temperatura', 'Água quente e fria, vapor de baixa pressão e refrigeração'], ['União', 'Solda capilar, brasagem, compressão ou prensagem']],
    normas: ['NBR 13206', 'NBR 15345', 'ASTM B88'] },
  { id: 'mat-aco', cat: 'Tubos', name: 'Aço-carbono e galvanizado', apps: 'Incêndio, vapor, ar comprimido e industrial', art: 'pipe', tone: '#b9c3cc', rel: 'tubos-aco',
    desc: 'Tubos de aço com ou sem costura, pretos ou galvanizados a fogo. São a base das redes de incêndio, vapor, ar comprimido e das linhas industriais.',
    specs: [['Material', 'Aço-carbono; galvanizado por imersão a quente'], ['Diâmetros', '1/4" a 6" (roscáveis) e maiores para solda'], ['Espessura', 'Schedule 40 e 80; classes leve, média e pesada'], ['Pressão', 'Definida pelo schedule e pela temperatura de operação'], ['União', 'Rosca BSP ou NPT, solda de topo, encaixe ou ranhura']],
    normas: ['NBR 5580', 'NBR 5590', 'ASTM A53', 'ASTM A106'] },
  { id: 'mat-pe', cat: 'Tubos', name: 'Polietileno e polipropileno', apps: 'Irrigação, saneamento e gás natural', art: 'pipe', tone: '#3a4048', tone2: '#7fbf6a',
    desc: 'O PEAD é flexível e tenaz, usado em adutoras, redes de água, gás natural enterrado e irrigação. O PPR (polipropileno copolímero random) é usado em água quente e fria predial, com união por termofusão.',
    specs: [['Material', 'PEAD (PE 80 / PE 100) e PPR'], ['Diâmetros', 'PEAD: 20 a 630 mm ou mais · PPR: 20 a 110 mm'], ['Pressão', 'PEAD: PN 4 a PN 16 · PPR: conforme a classe (PN 12, 20, 25)'], ['Temperatura', 'PEAD: água fria e gás · PPR: água quente e fria'], ['União', 'Termofusão de topo ou de soquete, eletrofusão e conexões de compressão']],
    normas: ['NBR 15561', 'NBR 14462-1', 'NBR 15813'] },
  { id: 'mat-ferro', cat: 'Tubos', name: 'Ferro fundido', apps: 'Saneamento, adução e esgoto', art: 'pipe', tone: '#5a5f66',
    desc: 'Tubos de ferro fundido dúctil com revestimento interno de argamassa de cimento. Têm alta resistência mecânica para adutoras e redes de distribuição de água e esgoto.',
    specs: [['Material', 'Ferro fundido dúctil (grafita esferoidal)'], ['Diâmetros', 'DN 80 a DN 1200'], ['Classes', 'K7 e K9, conforme a espessura'], ['Revestimento', 'Interno: argamassa de cimento · Externo: zinco e pintura betuminosa'], ['União', 'Junta elástica (ponta e bolsa), travada ou flangeada']],
    normas: ['NBR 7675', 'ISO 2531'] },
  { id: 'mat-inox', cat: 'Tubos', name: 'Aço inox', apps: 'Indústria alimentícia, química e farmacêutica', art: 'pipe', tone: '#d7dde3', rel: 'tubos-inox',
    desc: 'Tubos de aço inoxidável austenítico para processos sanitários, químicos, farmacêuticos e água potável, onde há exigência de higiene e resistência à corrosão.',
    specs: [['Material', 'AISI 304, 304L, 316 e 316L'], ['Diâmetros', 'Processo: 1/4" a 12" · Sanitário (OD): 1" a 4"'], ['Acabamento', 'Decapado, escovado ou polido (sanitário)'], ['Temperatura', 'Ampla faixa, de criogenia a alta temperatura'], ['União', 'Solda orbital, clamp, prensagem ou flange']],
    normas: ['ASTM A312', 'ASTM A270', 'ASTM A554'] },

  // Conexões
  { id: 'mat-galv', cat: 'Conexões', name: 'Conexões galvanizadas', apps: 'Ferro maleável, rosca BSP e NPT', art: 'fittings', tone: '#b9c3cc', rel: 'conexoes-ferro',
    desc: 'Conexões roscadas de ferro fundido maleável galvanizado, para redes de água, incêndio, gás e ar comprimido em tubos de aço.',
    specs: [['Material', 'Ferro fundido maleável, galvanizado ou preto'], ['Diâmetros', '1/4" a 6"'], ['Pressão', 'Classe 10 (1,0 MPa) e classe 150 lb'], ['Rosca', 'BSP (NBR NM ISO 7-1) ou NPT (ASME B1.20.1)'], ['Peças', 'Cotovelos, tês, luvas, uniões, niples, buchas, bujões e tampões']],
    normas: ['NBR 6943', 'NBR 6925', 'ASME B16.3'] },
  { id: 'mat-conexoes-pvc', cat: 'Conexões', name: 'Conexões de PVC', apps: 'Água fria, esgoto e drenagem predial', art: 'fittings', tone: '#e6eaee', rel: 'conexoes-pvc',
    desc: 'Conexões de PVC-U que completam as redes de água fria e de esgoto, unidas por solda química, rosca ou junta elástica.',
    specs: [['Material', 'PVC-U (policloreto de vinila não plastificado)'], ['Diâmetros', 'Água fria soldável: 20 a 110 mm · Esgoto: 40 a 150 mm'], ['União', 'Solda química (adesivo), rosca ou junta elástica com anel de borracha'], ['Temperatura', 'Somente água fria'], ['Peças', 'Joelhos, tês, luvas, reduções, buchas, adaptadores e tampões']],
    normas: ['NBR 5648', 'NBR 5688'] },
  { id: 'mat-conexoes-cpvc', cat: 'Conexões', name: 'Conexões de CPVC', apps: 'Água quente e fria predial', art: 'fittings', tone: '#e7cf9f', rel: 'conexoes-cpvc',
    desc: 'Conexões de CPVC para redes de água quente e fria, incluindo transições para metais e para aquecedores.',
    specs: [['Material', 'CPVC (policloreto de vinila clorado)'], ['Diâmetros', 'Predial: 15 a 114 mm'], ['União', 'Soldagem a frio com adesivo próprio para CPVC; transições com inserto metálico roscado'], ['Temperatura', 'Até 80 °C'], ['Peças', 'Cotovelos, tês, luvas, reduções, conectores de transição e adaptadores para aquecedores e misturadores']],
    normas: ['NBR 15884'] },
  { id: 'mat-grooved', cat: 'Conexões', name: 'Conexões Ranhuradas (Grooved)', apps: 'Incêndio, HVAC, água e mineração', art: 'coupling', tone: '#e5534b', rel: 'conexoes-ranhuradas',
    desc: 'Conexões com pontas ranhuradas (curvas, tês, reduções, cruzetas e tampões), unidas por acoplamentos mecânicos com junta de borracha. A montagem é rápida, sem solda e sem rosca. São padrão em redes de sprinklers e hidrantes e cada vez mais usadas em HVAC, água gelada, saneamento e mineração.',
    specs: [['Material', 'Ferro dúctil ASTM A536 (65-45-12), pintado em vermelho ou galvanizado'], ['Diâmetros', '1" a 12" (DN 25 a DN 300)'], ['Pressão', 'Até 300 psi (2,07 MPa), conforme o modelo e o diâmetro'], ['Peças', 'Curvas de 90° e 45°, tês, tês de redução, cruzetas, reduções concêntricas e tampões'], ['Ranhura', 'Laminada (roll groove) ou usinada (cut groove), conforme AWWA C606'], ['Aprovações', 'UL / FM para sistemas de combate a incêndio']],
    normas: ['AWWA C606', 'UL 213', 'ASTM A536', 'NFPA 13'] },
  { id: 'mat-conexoes-cobre', cat: 'Conexões', name: 'Conexões de Cobre', apps: 'Água quente e fria, gás, GLP e refrigeração', art: 'fittings', tone: '#d1834e', rel: 'conexoes-cobre',
    desc: 'Conexões de cobre para redes de tubos de cobre, unidas por solda capilar, brasagem ou prensagem. Formam com o tubo um sistema rígido, durável e resistente a altas temperaturas, usado em água quente, gás, GLP, ar-condicionado e refrigeração.',
    specs: [['Material', 'Cobre desoxidado (Cu-DHP) nos diâmetros menores; latão ou bronze nos maiores e nas transições'], ['Diâmetros', '15 a 104 mm, compatíveis com os tubos de cobre classes A, E e I (NBR 13206)'], ['União', 'Solda capilar (com ou sem anel de solda), brasagem ou prensagem (press-fit) com anel de vedação'], ['Peças', 'Curvas de 45° e 90°, cotovelos, tês, luvas, reduções, uniões, conectores e tampões'], ['Transições', 'Conectores e adaptadores de bronze com rosca para registros, válvulas e equipamentos']],
    normas: ['NBR 11720', 'NBR 13206', 'NBR 15345', 'ASME B16.22'] },
  { id: 'mat-latao', cat: 'Conexões', name: 'Conexões de latão e bronze', apps: 'Água, gás e GLP', art: 'fittings', tone: '#d8b45a', veja: 'mat-conexoes-cobre',
    desc: 'Conexões em ligas de cobre para redes de cobre, transições entre materiais e instalações de gás e GLP.',
    specs: [['Material', 'Latão forjado e bronze fundido'], ['Diâmetros', '15 a 104 mm (solda) · 1/4" a 2" (rosca)'], ['União', 'Solda capilar, compressão (anilha), prensagem ou rosca'], ['Aplicação', 'Água quente e fria, gás, GLP e refrigeração'], ['Peças', 'Cotovelos, tês, luvas, uniões, adaptadores e transições']],
    normas: ['NBR 11720', 'NBR 15345'] },
  { id: 'mat-conexoes-inox', cat: 'Conexões', name: 'Conexões inox', apps: 'Processos sanitários, químicos e industriais', art: 'fittings', tone: '#c9d1d9', rel: 'conexoes-inox',
    desc: 'Conexões em aço inoxidável para processos sanitários, químicos e linhas que exigem alta resistência à corrosão e facilidade de limpeza.',
    specs: [['Material', 'Aço inoxidável AISI 304/304L ou 316/316L (mesma liga do tubo)'], ['União', 'Rosca classe 150, solda de topo, clamp sanitário (tri-clamp) ou prensagem'], ['Acabamento', 'Polido sanitário ou decapado e passivado, conforme o processo'], ['Peças', 'Cotovelos, tês, reduções, uniões, niples, férulas e abraçadeiras clamp']],
    normas: ['ASME B16.9', 'ASME B16.11', 'DIN 32676'] },
  { id: 'mat-conexoes-forjadas', cat: 'Conexões', name: 'Conexões forjadas', apps: 'Vapor, óleo, gás e processos em alta pressão', art: 'fittings', tone: '#8d98a3', rel: 'conexoes-forjadas',
    desc: 'Conexões de aço forjado para alta pressão em linhas industriais de vapor, óleo, gás e processos.',
    specs: [['Material', 'Aço-carbono ASTM A105; ligas e inox ASTM A182'], ['Classes', '2000, 3000, 6000 e 9000 (ASME B16.11)'], ['Diâmetros', '1/8" a 4"'], ['União', 'Encaixe para solda (socket weld) ou rosca NPT'], ['Peças', 'Cotovelos, tês, luvas, uniões, niples, bujões e derivações weldolet, sockolet e thredolet']],
    normas: ['ASME B16.11', 'MSS SP-97', 'ASTM A105'] },
  { id: 'mat-conexoes-solda', cat: 'Conexões', name: 'Conexões tubulares para solda', apps: 'Linhas industriais soldadas em aço-carbono, inox e ligas', art: 'fittings', tone: '#9aa7b8', rel: 'conexoes-solda',
    desc: 'Conexões para solda de topo (butt weld): curvas, tês, reduções e tampões que formam linhas soldadas contínuas, estanques e sem pontos de rosca.',
    specs: [['Material', 'Aço-carbono ASTM A234 WPB; inox ASTM A403'], ['Diâmetros', '1/2" a 48" (ASME B16.9)'], ['Espessura', 'Mesmo schedule do tubo (SCH 10 a 160, STD, XS e XXS)'], ['Curvas', 'Raio longo (1,5 D) ou raio curto (1 D), de 45°, 90° e 180°'], ['Extremidades', 'Chanfradas para solda de topo (ASME B16.25)']],
    normas: ['ASME B16.9', 'ASME B16.25', 'ASTM A234', 'ASTM A403', 'MSS SP-43'] },
  { id: 'mat-flanges', cat: 'Conexões', name: 'Flanges', apps: 'Juntas flangeadas para alta pressão', art: 'flange', tone: '#8d98a3', rel: 'flanges',
    desc: 'Flanges para uniões desmontáveis entre tubos, válvulas e equipamentos em linhas industriais, de vapor e de alta pressão.',
    specs: [['Material', 'Aço-carbono ASTM A105, inox ASTM A182, baixa temperatura A350'], ['Diâmetros', '1/2" a 24" (ASME B16.5) e maiores (B16.47)'], ['Classes', '150, 300, 600, 900, 1500 e 2500 lb'], ['Face', 'Plana (FF), ressaltada (RF) ou anel (RTJ)'], ['Tipos', 'Pescoço, sobreposto, encaixe, roscado, cego e solto']],
    normas: ['ASME B16.5', 'ASME B16.47', 'EN 1092-1'] },
  { id: 'mat-ranhurado', cat: 'Conexões', name: 'Acoplamentos e junções', apps: 'Ranhurados, uniões e luvas', art: 'coupling', tone: '#e5534b', veja: 'mat-grooved',
    desc: 'Acoplamentos mecânicos para tubos ranhurados: montagem rápida, sem solda e sem rosca. São padrão em redes de sprinklers e hidrantes.',
    specs: [['Material', 'Ferro dúctil pintado ou galvanizado; junta de EPDM'], ['Diâmetros', '1" a 12"'], ['Pressão', 'Até 300 psi (2,07 MPa), conforme o modelo'], ['Tipos', 'Rígido, flexível, tê mecânico e adaptador flange-ranhura'], ['Aprovações', 'UL / FM para sistemas de incêndio']],
    normas: ['AWWA C606', 'UL 213', 'FM 1920'] },

  // Válvulas
  { id: 'mat-valvulas', cat: 'Válvulas', name: 'Válvulas: tipos e comparativo', apps: 'Bloqueio, regulagem e retenção em redes prediais e industriais', art: 'ballvalve', tone: '#2d7fd3', rel: 'valvulas',
    desc: 'Visão geral das válvulas que controlam, bloqueiam ou direcionam o fluxo, com o comparativo entre os tipos e os materiais de corpo mais usados.',
    specs: [['Funções', 'Bloqueio, regulagem, retenção e alívio de pressão'], ['Materiais do corpo', 'Bronze, latão, ferro fundido, ferro dúctil, aço-carbono e inox'], ['Extremidades', 'Rosca, flange, solda ou wafer (entre flanges)'], ['Acionamento', 'Manual (volante, alavanca ou redutor) ou por atuador elétrico ou pneumático']],
    normas: ['ASME B16.34', 'API 600', 'API 609'] },
  { id: 'mat-esfera', cat: 'Válvulas', name: 'Registros e válvulas de esfera', apps: 'Bloqueio em água, gás e ar comprimido', art: 'ballvalve', tone: '#d8b45a', veja: 'mat-valvulas',
    desc: 'Válvulas de abertura rápida (1/4 de volta) para bloqueio, com vedação estanque por esfera e sedes de PTFE.',
    specs: [['Corpo', 'Latão, bronze, aço-carbono ou inox'], ['Diâmetros', '1/4" a 4" (roscadas) e maiores (flangeadas)'], ['Passagem', 'Plena ou reduzida'], ['Sede', 'PTFE ou PTFE reforçado'], ['Acionamento', 'Alavanca, borboleta ou atuador pneumático ou elétrico']],
    normas: ['ISO 17292', 'ASME B16.34'] },
  { id: 'mat-registros', cat: 'Válvulas', name: 'Registros de latão e bronze', apps: 'Instalações hidráulicas prediais e gás', art: 'ballvalve', tone: '#d8b45a', rel: 'registros-latao',
    desc: 'Registros de gaveta, de pressão e de esfera, em latão ou bronze, para instalações hidráulicas prediais.',
    specs: [['Material', 'Latão forjado ou bronze'], ['Tipos', 'Gaveta, pressão, esfera e registros para gás'], ['Bitolas', 'As mais usadas nas instalações prediais vão de 1/2" a 2"'], ['União', 'Rosca BSP, com adaptadores para tubos de PVC e de cobre'], ['Acabamento', 'Bruto (base para embutir) ou com acabamento cromado']],
    normas: ['NBR 15704-1', 'NBR 15705'] },
  { id: 'mat-gaveta', cat: 'Válvulas', name: 'Válvulas de gaveta', apps: 'Bloqueio em água, vapor, óleo e gás', art: 'ballvalve', tone: '#6b7682', veja: 'mat-valvulas',
    desc: 'Válvulas de bloqueio em que uma cunha (gaveta) desce perpendicular ao fluxo. Totalmente abertas, deixam a passagem livre, com perda de carga muito baixa. Servem para isolar trechos da rede e não devem ser usadas para regular a vazão.',
    specs: [['Corpo', 'Bronze, ferro fundido, ferro dúctil, aço-carbono (A216 WCB, A105) ou inox'], ['Diâmetros', '1/2" a 24" e maiores'], ['Classes', 'PN 10 a PN 40 · Classe 150 a 2500 lb'], ['Tipos', 'Haste ascendente (OS&Y) ou não ascendente; cunha sólida, flexível ou bipartida'], ['Extremidades', 'Rosca, flange, solda de encaixe ou de topo'], ['Uso', 'Totalmente aberta ou totalmente fechada (não estrangular)']],
    normas: ['API 600', 'ASME B16.34', 'NBR 15705'] },
  { id: 'mat-globo', cat: 'Válvulas', name: 'Válvulas globo', apps: 'Regulagem em vapor, utilidades e processos', art: 'ballvalve', tone: '#8a6d3b', veja: 'mat-valvulas',
    desc: 'Válvulas em que um obturador (disco ou plugue) se move contra uma sede, permitindo regular a vazão com precisão. Têm ótima capacidade de estrangulamento, mas perda de carga maior que a gaveta. São muito usadas em vapor, bypass e controle manual.',
    specs: [['Corpo', 'Bronze, ferro fundido, aço-carbono (A216 WCB, A105), aço-liga ou inox'], ['Diâmetros', '1/2" a 12"'], ['Classes', 'PN 16 a PN 40 · Classe 150 a 2500 lb'], ['Padrões', 'Reta (T), angular e em Y (menor perda de carga)'], ['Obturador', 'Disco plano, cônico ou agulha (regulagem fina)'], ['Uso', 'Regulagem e bloqueio; instalar com o fluxo no sentido da seta']],
    normas: ['API 623', 'ASME B16.34'] },
  { id: 'mat-borboleta', cat: 'Válvulas', name: 'Válvulas borboleta', apps: 'Água, HVAC, saneamento e processos', art: 'ballvalve', tone: '#2d7fd3', veja: 'mat-valvulas',
    desc: 'Válvulas de 1/4 de volta com um disco que gira no centro da tubulação. São compactas, leves e econômicas em grandes diâmetros, para bloqueio e modulação de vazão em água, ar-condicionado, saneamento e processos industriais.',
    specs: [['Corpo', 'Ferro fundido, ferro dúctil, aço-carbono ou inox; disco em ferro dúctil, inox ou bronze-alumínio'], ['Diâmetros', '2" a 48" e maiores'], ['Montagem', 'Wafer, lug (com orelhas) ou flangeada'], ['Vedação', 'Sede resiliente (EPDM, NBR, PTFE) ou metálica (dupla e tripla excentricidade)'], ['Acionamento', 'Alavanca, redutor com volante, atuador pneumático ou elétrico'], ['Classes', 'PN 10 / PN 16 · Classe 150 a 600 lb (alta performance)']],
    normas: ['API 609', 'AWWA C504', 'MSS SP-67'] },
  { id: 'mat-retencao', cat: 'Válvulas', name: 'Válvulas de retenção', apps: 'Recalque e bombeamento', art: 'check', tone: '#6b7682', veja: 'mat-valvulas',
    desc: 'Permitem o fluxo em um só sentido. Protegem bombas contra o retorno do fluido e mantêm as linhas de recalque escorvadas.',
    specs: [['Tipos', 'Portinhola, disco (vertical), pé com crivo e dupla portinhola (wafer)'], ['Corpo', 'Bronze, ferro fundido, aço ou inox'], ['Diâmetros', '1/2" a 24"'], ['Instalação', 'Horizontal ou vertical, conforme o modelo'], ['Atenção', 'Modelos de fechamento rápido reduzem o golpe de aríete']],
    normas: ['API 594', 'ASME B16.34'] },
  { id: 'mat-redutora', cat: 'Válvulas', name: 'Válvulas redutoras de pressão', apps: 'Redes prediais de água, vapor e ar comprimido', art: 'regulator', tone: '#1fb6c9', veja: 'mat-valvulas',
    desc: 'Reduzem e mantêm constante a pressão a jusante, mesmo com variações na entrada e no consumo. Em edifícios altos, limitam a pressão nos pontos de uso; em vapor e ar comprimido, ajustam a pressão de trabalho dos equipamentos.',
    specs: [['Corpo', 'Bronze, latão, ferro dúctil, aço-carbono ou inox'], ['Diâmetros', '1/2" a 2" (roscadas) · DN 50 a DN 300 (flangeadas)'], ['Tipos', 'Ação direta (mola e diafragma ou pistão) ou pilotada'], ['Pressão de saída', 'Ajustável; em prédios, até 400 kPa (40 mca) nos pontos de utilização (NBR 5626)'], ['Instalação', 'Com filtro a montante, manômetros e registros de bloqueio; bypass em sistemas críticos'], ['Aplicações', 'Água fria e quente, vapor, ar comprimido e irrigação']],
    normas: ['NBR 5626', 'EN 1567'] },
  { id: 'mat-reguladores', cat: 'Válvulas', name: 'Reguladores de pressão', apps: 'Gás natural, GLP e água', art: 'regulator', tone: '#5d7fb5', veja: 'mat-valvulas',
    desc: 'Mantêm a pressão de saída constante, independentemente da variação na entrada. São usados em redes de gás (1º e 2º estágio) e como válvulas redutoras em redes de água.',
    specs: [['Aplicação', 'Gás natural, GLP, água e ar comprimido'], ['Tipos', 'Ação direta ou pilotado; 1º e 2º estágio (gás)'], ['Saída', 'Ajustável dentro da faixa da mola'], ['Segurança', 'Bloqueio por sobrepressão e alívio (gás)'], ['Instalação', 'Com filtro a montante e manômetros de entrada e saída']],
    normas: ['EN 88-1', 'NBR 15526', 'NBR 5626'] },
  { id: 'mat-purgadores', cat: 'Válvulas', name: 'Purgadores', apps: 'Remoção de condensado em vapor', art: 'trap', tone: '#8d98a3', rel: 'purgadores',
    desc: 'Válvulas automáticas que descarregam o condensado e o ar das linhas de vapor, retendo o vapor vivo.',
    specs: [['Tipos', 'Boia, balde invertido, termodinâmico e termostático'], ['Diâmetros', '1/2" a 2"'], ['Pressão', 'Baixa, média e alta pressão, conforme o modelo'], ['Corpo', 'Ferro fundido, aço-carbono ou inox'], ['Instalação', 'Com filtro Y, visor e válvulas de bloqueio']],
    normas: ['ISO 6552', 'ASME PTC 39'] },

  // Equipamentos
  { id: 'mat-bombas', cat: 'Equipamentos', name: 'Bombas', apps: 'Recalque, pressurização e incêndio', art: 'pump', tone: '#2d7fd3', rel: 'bombas',
    desc: 'Conjuntos motobomba para recalque, pressurização, irrigação, combate a incêndio e processos industriais.',
    specs: [['Tipos', 'Centrífuga, multiestágio, autoescorvante, submersa e deslocamento positivo'], ['Seleção', 'Vazão (m³/h) × altura manométrica total (mca)'], ['Materiais', 'Ferro fundido, bronze ou inox'], ['Acionamento', 'Motor elétrico, com ou sem inversor de frequência'], ['Atenção', 'NPSH disponível maior que o requerido']],
    normas: ['ISO 9906', 'ISO 2858', 'NBR 13714'] },
  { id: 'mat-caldeiras', cat: 'Equipamentos', name: 'Aquecedores e caldeiras', apps: 'Água quente e geração de vapor', art: 'boiler', tone: '#c3cbd3', rel: 'caldeiras',
    desc: 'Aquecedores a gás, elétricos e solares para água quente, e caldeiras para geração de vapor ou água quente em processos.',
    specs: [['Aquecedores', 'Passagem (L/min) ou acumulação (litros)'], ['Caldeiras', 'Produção de vapor (kg/h) e pressão de trabalho'], ['Combustível', 'Gás, óleo, lenha, biomassa ou eletricidade'], ['Tipos de caldeira', 'Flamotubular e aquatubular'], ['Segurança', 'Válvula de segurança, controle de nível e NR-13']],
    normas: ['NR-13', 'NBR 13103', 'NBR 15569'] },
  { id: 'mat-compressores', cat: 'Equipamentos', name: 'Compressores', apps: 'Redes de ar comprimido', art: 'compressor', tone: '#e5534b', rel: 'compressores',
    desc: 'Compressores de ar para oficinas, indústrias e automação, do modelo de pistão com reservatório ao parafuso rotativo de grande porte.',
    specs: [['Tipos', 'Pistão, parafuso, palhetas e scroll'], ['Vazão', 'Em pcm ou m³/min'], ['Pressão', 'Usual de 7 a 13 bar'], ['Tratamento', 'Secador, filtros e drenos automáticos'], ['Reservatório', 'Vaso de pressão sujeito à NR-13']],
    normas: ['ISO 1217', 'ISO 8573-1', 'NR-13'] },
  { id: 'mat-sprinklers', cat: 'Equipamentos', name: 'Sprinklers', apps: 'Sistemas de combate a incêndio', art: 'sprinkler', tone: '#d8b45a', rel: 'sprinklers',
    desc: 'Chuveiros automáticos que abrem individualmente quando a ampola de vidro se rompe com o calor do fogo.',
    specs: [['Tipos', 'Pendente, em pé (upright), lateral e ESFR'], ['Fator K', 'K 5,6 (80 métrico) é o mais comum; outros conforme o risco'], ['Ampolas', '57 °C laranja · 68 °C vermelha · 79 °C amarela · 93 °C verde'], ['Resposta', 'Padrão ou rápida'], ['Conexão', 'Rosca 1/2" ou 3/4" NPT']],
    normas: ['NBR 10897', 'NFPA 13', 'UL 199'] },

  // Acessórios
  { id: 'mat-medidores', cat: 'Acessórios', name: 'Medidores e manômetros', apps: 'Vazão, pressão e consumo', art: 'gauge', tone: '#d7dde3', rel: 'manometros',
    desc: 'Instrumentos para medir pressão, vazão e consumo em redes de água, gás, vapor, ar comprimido e combustíveis.',
    specs: [['Manômetros', 'Mostrador de 50, 63, 100 ou 150 mm; com ou sem glicerina'], ['Escalas', 'Do vácuo a alta pressão, em bar, kgf/cm², psi ou kPa'], ['Hidrômetros', 'Velocimétricos e volumétricos'], ['Vazão industrial', 'Eletromagnéticos, ultrassônicos e tipo turbina'], ['Conexão', 'Rosca 1/4" ou 1/2" BSP ou NPT']],
    normas: ['NBR 14105-1', 'EN 837'] },
  { id: 'mat-mangueiras', cat: 'Acessórios', name: 'Mangueiras', apps: 'Incêndio, combustível e irrigação', art: 'hose', tone: '#e5534b',
    desc: 'Mangueiras para hidrantes de incêndio, abastecimento de combustíveis, irrigação e uso industrial.',
    specs: [['Incêndio', 'Tipos 1 a 5, conforme a ocupação e a pressão'], ['Diâmetros (incêndio)', '38 mm (1 1/2") e 63 mm (2 1/2")'], ['Engates', 'Tipo storz'], ['Combustível', 'Borracha nitrílica com malha de aço e aterramento'], ['Manutenção', 'Inspeção periódica e ensaio hidrostático']],
    normas: ['NBR 11861', 'NBR 12779'] },
  { id: 'mat-vedantes', cat: 'Acessórios', name: 'Vedantes', apps: 'Fitas, pastas e juntas para roscas', art: 'tape', tone: '#f4f6f8', rel: 'vedantes',
    desc: 'Produtos para vedação de juntas roscadas e flangeadas em água, gás, ar comprimido e óleo.',
    specs: [['Tipos', 'Fita PTFE, pasta vedante, selante anaeróbico e fio de vedação'], ['Gás', 'Usar apenas produtos certificados para gás'], ['Temperatura', 'Conforme o fabricante; PTFE de -200 a 260 °C'], ['Roscas', 'Cônicas vedam na rosca; paralelas precisam de junta ou anel'], ['Juntas', 'Papelão hidráulico, PTFE, borracha e espirometálicas']],
    normas: ['EN 751', 'ASME B16.20', 'ASME B16.21'] },
  { id: 'mat-juntas', cat: 'Acessórios', name: 'Juntas de vedação', apps: 'Flanges e tampas em linhas industriais, vapor e química', art: 'tape', tone: '#5b6b80', rel: 'juntas-vedacao',
    desc: 'Juntas que vedam a união entre flanges e tampas, suportando a pressão, a temperatura e o ataque químico do fluido.',
    specs: [['Materiais', 'Papelão hidráulico (fibra comprimida), PTFE, borrachas, grafite, espirometálicas e anéis RTJ'], ['Faces de flange', 'Face plana (FF), face com ressalto (RF) e junta de anel (RTJ)'], ['Dimensões', 'Conforme a norma do flange (ASME B16.5 ou B16.47)'], ['Montagem', 'Torque e sequência de aperto conforme ASME PCC-1; nunca reutilizar a junta']],
    normas: ['ASME B16.20', 'ASME B16.21', 'ASME PCC-1'] },
  { id: 'mat-suportes', cat: 'Acessórios', name: 'Suportes e cavaletes', apps: 'Fixação de tubulações e cavaletes de entrada', art: 'clamp', tone: '#b9c3cc', rel: 'suportes',
    desc: 'Abraçadeiras, perfis e pendurais para fixar tubulações, e cavaletes padronizados para a entrada de água nos imóveis.',
    specs: [['Abraçadeiras', 'Tipo U, D, copo e com borracha antivibração'], ['Perfis', 'Perfilados e trilhos galvanizados com acessórios'], ['Pendurais', 'Tirantes roscados, com ou sem mola'], ['Cavaletes', 'De 1/2" e 3/4", conforme o padrão da concessionária'], ['Acabamento', 'Galvanizado eletrolítico ou a fogo, inox']],
    normas: ['MSS SP-58', 'NBR 5626'] },
  { id: 'mat-filtros', cat: 'Acessórios', name: 'Filtros', apps: 'Água, ar comprimido e combustível', art: 'filtery', tone: '#6b7682', rel: 'filtros',
    desc: 'Filtros para reter partículas e contaminantes, protegendo bombas, válvulas, instrumentos e equipamentos.',
    specs: [['Tipos', 'Y, cesto, autolimpante, coalescente e carvão ativado'], ['Diâmetros', '1/2" a 12"'], ['Elemento', 'Tela de 20 a 200 mesh; ar comprimido de 0,01 a 5 µm'], ['Corpo', 'Bronze, ferro fundido, aço ou inox'], ['Manutenção', 'Dreno ou tampa para limpeza; troca do elemento por perda de carga']],
    normas: ['ISO 8573-1', 'ISO 1217', 'NR-13'] },
  { id: 'mat-ferramentas', cat: 'Acessórios', name: 'Ferramentas e solda', apps: 'Roscar, soldar, cortar e termofusão', art: 'wrench', tone: '#e5534b', rel: 'ferramentas-hidraulicas',
    desc: 'Ferramentas e equipamentos para montagem de tubulações: roscar, cortar, curvar, prensar, termofundir e testar.',
    specs: [['Rosqueadeiras', 'Manuais e elétricas, de 1/2" a 4", cossinetes BSP ou NPT'], ['Termofusão', 'Soquete de 20 a 110 mm; topo para PEAD de grande diâmetro'], ['Prensas', 'Perfis para cobre, inox e multicamada'], ['Solda', 'Maçaricos, varetas e fluxos para brasagem'], ['Teste', 'Bombas de teste hidrostático com manômetro']],
    normas: ['NBR NM ISO 7-1', 'ASME B1.20.1'] },
  { id: 'mat-rosqueadeiras', cat: 'Acessórios', name: 'Rosqueadeiras', apps: 'Roscas em tubos de aço para conexões roscadas', art: 'wrench', tone: '#f2a03d', rel: 'rosqueadeiras',
    desc: 'Ferramentas e máquinas que abrem roscas cônicas em tubos de aço para a montagem com conexões roscadas.',
    specs: [['Tipos', 'Manual com catraca, elétrica portátil e máquina de bancada com morsa'], ['Capacidade', 'Manuais e portáteis: em geral até 2" · Máquinas de bancada: até 4" ou mais'], ['Rosca', 'Cônica BSP (NBR NM ISO 7-1) ou NPT (ASME B1.20.1), conforme os cossinetes'], ['Acessórios', 'Cossinetes, cortador, escareador, ranhuradeira acoplável e óleo de corte']],
    normas: ['NBR NM ISO 7-1', 'ASME B1.20.1'] },
];

// Ilustrações dos produtos (viewBox 0 0 200 120). var(--m) = cor do material.
const MATERIAL_ART = (() => {
  const O = '#0a2240';
  const line = (d, w, color = 'var(--m)') =>
    `<path d="${d}" fill="none" stroke="${O}" stroke-width="${w + 4}" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const box = (x, y, w, h, r = 4, fill = 'var(--m)') =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${O}" stroke-width="2"/>`;
  const shine = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#fff" opacity=".35"/>`;
  const pipe = (y, color, r) =>
    `<ellipse cx="28" cy="${y}" rx="${r / 2}" ry="${r}" fill="${color}" stroke="${O}" stroke-width="2"/>` +
    `<rect x="28" y="${y - r}" width="144" height="${2 * r}" fill="${color}" stroke="${O}" stroke-width="2"/>` +
    shine(32, y - r * .65, 136, r * .35) +
    `<ellipse cx="172" cy="${y}" rx="${r / 2}" ry="${r}" fill="${color}" stroke="${O}" stroke-width="2"/>` +
    `<ellipse cx="172" cy="${y}" rx="${r / 3.2}" ry="${r * .66}" fill="${O}" opacity=".7"/>`;
  const bolts = (cx, cy, r) => Array.from({ length: 8 }, (_, i) => {
    const a = (i * 45 + 22.5) * Math.PI / 180;
    return `<circle cx="${(cx + r * Math.cos(a)).toFixed(1)}" cy="${(cy + r * Math.sin(a)).toFixed(1)}" r="4.5" fill="${O}" opacity=".75"/>`;
  }).join('');
  return {
    pipe: (m, m2) => m2 ? pipe(34, 'var(--m)', 20) + pipe(86, m2, 20) : pipe(60, 'var(--m)', 28),
    fittings: () => line('M18 96H56Q82 96 82 70V30', 22) + box(10, 82, 12, 28, 3) + box(68, 22, 28, 12, 3) +
      line('M106 96H190', 22) + line('M148 96V40', 22) + box(134, 34, 28, 12, 3) + box(100, 82, 12, 28, 3) + box(182, 82, 12, 28, 3),
    flange: () => `<circle cx="100" cy="60" r="48" fill="var(--m)" stroke="${O}" stroke-width="2"/>` +
      `<circle cx="100" cy="60" r="26" fill="var(--m)" stroke="${O}" stroke-width="2"/>` +
      `<circle cx="100" cy="60" r="15" fill="${O}" opacity=".75"/>` + bolts(100, 60, 38),
    coupling: () => line('M14 60H186', 30) + box(80, 30, 40, 60, 12, '#b8322b') +
      box(92, 18, 16, 14, 2, '#8d98a3') + box(92, 88, 16, 14, 2, '#8d98a3') + shine(84, 36, 32, 6),
    ballvalve: () => line('M14 70H186', 16, '#9aa7b8') + box(36, 52, 26, 36, 3) + box(138, 52, 26, 36, 3) +
      box(60, 46, 80, 48, 20) + shine(68, 52, 64, 6) + box(95, 28, 10, 20, 2, '#9aa7b8') + box(96, 18, 84, 12, 6, '#e5534b'),
    check: () => box(24, 40, 14, 56, 3) + box(162, 40, 14, 56, 3) +
      `<ellipse cx="100" cy="68" rx="64" ry="30" fill="var(--m)" stroke="${O}" stroke-width="2"/>` +
      box(74, 26, 52, 16, 4) + `<path d="M70 70H124M112 60l12 10-12 10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,
    regulator: () => line('M12 82H60', 14, '#9aa7b8') + line('M140 82H188', 14, '#9aa7b8') + box(56, 66, 88, 32, 6) +
      `<path d="M62 66Q100 4 138 66Z" fill="var(--m)" stroke="${O}" stroke-width="2"/>` + box(94, 18, 12, 18, 2, '#9aa7b8') + shine(64, 72, 72, 5),
    trap: () => line('M12 64H186', 14, '#9aa7b8') + box(26, 44, 12, 40, 3) + box(162, 44, 12, 40, 3) +
      `<circle cx="100" cy="64" r="34" fill="var(--m)" stroke="${O}" stroke-width="2"/>` +
      `<circle cx="100" cy="64" r="16" fill="#6b7682" stroke="${O}" stroke-width="2"/>` + `<path d="M100 98v12" stroke="${O}" stroke-width="4"/>`,
    pump: () => box(30, 104, 160, 8, 2, O) + box(14, 56, 26, 22, 3, '#9aa7b8') +
      `<circle cx="66" cy="66" r="32" fill="var(--m)" stroke="${O}" stroke-width="2"/>` + box(54, 14, 24, 22, 3, '#9aa7b8') +
      box(98, 42, 84, 50, 10) + [110, 122, 134, 146, 158, 170].map(x => `<path d="M${x} 48v38" stroke="${O}" stroke-width="1.5" opacity=".45"/>`).join('') +
      `<circle cx="66" cy="66" r="10" fill="${O}" opacity=".6"/>`,
    boiler: () => box(24, 40, 150, 58, 29) + shine(40, 48, 118, 7) + box(140, 10, 16, 32, 2, '#6b7682') +
      `<circle cx="48" cy="69" r="15" fill="#6b7682" stroke="${O}" stroke-width="2"/>` + box(44, 98, 10, 14, 2, O) + box(144, 98, 10, 14, 2, O) +
      box(86, 54, 30, 22, 3, '#fff'),
    compressor: () => box(22, 62, 156, 40, 20) + shine(36, 68, 128, 6) + box(40, 30, 50, 30, 4, '#6b7682') +
      box(104, 26, 50, 34, 4, '#9aa7b8') + [112, 122, 132, 142].map(x => `<path d="M${x} 30v26" stroke="${O}" stroke-width="1.5" opacity=".5"/>`).join('') +
      `<circle cx="44" cy="106" r="8" fill="${O}"/><circle cx="156" cy="106" r="8" fill="${O}"/>`,
    sprinkler: () => box(86, 8, 28, 22, 3) + `<path d="M90 30L76 88M110 30L124 88" stroke="${O}" stroke-width="9" stroke-linecap="round"/>` +
      `<path d="M90 30L76 88M110 30L124 88" stroke="var(--m)" stroke-width="5" stroke-linecap="round"/>` +
      `<ellipse cx="100" cy="58" rx="7" ry="20" fill="#e5534b" stroke="${O}" stroke-width="2"/>` +
      box(56, 86, 88, 8, 3) + box(94, 78, 12, 10, 2),
    gauge: () => `<circle cx="100" cy="52" r="44" fill="var(--m)" stroke="${O}" stroke-width="2"/>` +
      `<circle cx="100" cy="52" r="36" fill="#fff" stroke="${O}" stroke-width="1.5"/>` +
      `<path d="M74 70A30 30 0 1 1 126 70" fill="none" stroke="${O}" stroke-width="3" stroke-dasharray="2 6"/>` +
      `<path d="M100 52L124 34" stroke="#e5534b" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="52" r="5" fill="${O}"/>` +
      box(93, 96, 14, 10, 2, '#d8b45a') + box(86, 104, 28, 12, 2, '#d8b45a'),
    hose: () => `<circle cx="82" cy="60" r="44" fill="none" stroke="${O}" stroke-width="16"/><circle cx="82" cy="60" r="44" fill="none" stroke="var(--m)" stroke-width="12"/>` +
      `<circle cx="82" cy="60" r="26" fill="none" stroke="${O}" stroke-width="16"/><circle cx="82" cy="60" r="26" fill="none" stroke="var(--m)" stroke-width="12"/>` +
      `<circle cx="82" cy="60" r="12" fill="#fff" stroke="${O}" stroke-width="2"/>` + line('M126 60H166', 10) + box(160, 50, 14, 20, 3, '#d8b45a') + box(174, 54, 16, 12, 3, '#9aa7b8'),
    tape: () => `<path d="M128 70L188 54V76Z" fill="var(--m)" stroke="${O}" stroke-width="2"/>` +
      `<circle cx="86" cy="62" r="44" fill="var(--m)" stroke="${O}" stroke-width="2"/>` +
      `<circle cx="86" cy="62" r="34" fill="none" stroke="${O}" stroke-width="1" opacity=".3"/>` +
      `<circle cx="86" cy="62" r="20" fill="#fff" stroke="${O}" stroke-width="2"/><text x="86" y="66" text-anchor="middle" font-size="10" font-weight="700" fill="${O}">PTFE</text>`,
    clamp: () => line('M12 54H188', 26, '#9aa7b8') + box(30, 96, 140, 12, 2) +
      `<path d="M74 98V56A26 26 0 0 1 126 56V98" fill="none" stroke="${O}" stroke-width="10"/><path d="M74 98V56A26 26 0 0 1 126 56V98" fill="none" stroke="var(--m)" stroke-width="6"/>` +
      box(66, 88, 16, 10, 2, '#6b7682') + box(118, 88, 16, 10, 2, '#6b7682'),
    filtery: () => line('M12 48H188', 22) + line('M96 48L138 98', 22) +
      `<rect x="126" y="92" width="30" height="14" rx="3" fill="#9aa7b8" stroke="${O}" stroke-width="2" transform="rotate(40 141 99)"/>` +
      box(20, 30, 12, 36, 3) + box(168, 30, 12, 36, 3) + shine(36, 42, 128, 5),
    wrench: () => `<path d="M38 104L126 38" stroke="${O}" stroke-width="22" stroke-linecap="round"/><path d="M38 104L126 38" stroke="var(--m)" stroke-width="18" stroke-linecap="round"/>` +
      `<path d="M112 22h56v18h-34v12h-22z" fill="#9aa7b8" stroke="${O}" stroke-width="2" stroke-linejoin="round"/>` +
      `<path d="M114 58h44v14h-44z" fill="#9aa7b8" stroke="${O}" stroke-width="2"/>` + box(120, 40, 12, 18, 2, '#6b7682'),
  };
})();

// Fabricantes de referência por item do catálogo (máx. 5). n = nome, u = site oficial, o = N (nacional) ou I (internacional).
// Sites conferidos em 17/10/2026. Lista indicativa, sem vínculo comercial.
// Tipo: 'N' = fabricante nacional, 'I' = internacional, 'M' = importador.
const MANUFACTURERS = {
  'mat-conexoes-pvc': [['Tigre', 'https://www.tigre.com.br', 'N'], ['Amanco Wavin', 'https://wavin.com', 'N'], ['Krona', 'https://www.krona.com.br', 'N']],
  'mat-conexoes-cpvc': [['Tigre (Aquatherm)', 'https://www.tigre.com.br', 'N'], ['Krona', 'https://www.krona.com.br', 'N'], ['Amanco Wavin', 'https://wavin.com', 'N']],
  'mat-registros': [['Deca', 'https://www.deca.com.br', 'N'], ['Docol', 'https://www.docol.com.br', 'N'], ['Fabrimar', 'https://www.fabrimar.com.br', 'N']],
  'mat-juntas': [['Teadit', 'https://www.teadit.com', 'N'], ['Flexitallic', 'https://www.flexitallic.com', 'I'], ['Garlock', 'https://www.garlock.com', 'I']],
  'mat-rosqueadeiras': [['Ridgid', 'https://www.ridgid.com', 'I'], ['Rothenberger', 'https://www.rothenberger.com', 'I'], ['REMS', 'https://www.rems.de', 'I']],
  'mat-pvc': [['Tigre', 'https://www.tigre.com.br', 'N'], ['Krona', 'https://www.krona.com.br', 'N'], ['Fortlev', 'https://www.fortlev.com.br', 'N'], ['Amanco Wavin', 'https://wavin.com', 'N']],
  'mat-cpvc': [['Tigre (Aquatherm)', 'https://www.tigre.com.br', 'N'], ['Krona', 'https://www.krona.com.br', 'N'], ['Amanco Wavin', 'https://wavin.com', 'N']],
  'mat-pex': [['Astra', 'https://www.astra-sa.com', 'N'], ['Amanco Wavin', 'https://wavin.com', 'N'], ['Uponor', 'https://www.uponor.com', 'I'], ['Rehau', 'https://www.rehau.com', 'I']],
  'mat-cobre': [['Termomecanica', 'https://www.termomecanica.com.br', 'N'], ['Paranapanema (Eluma)', 'https://www.paranapanema.com.br', 'N'], ['Mueller Industries', 'https://www.muellerindustries.com', 'I'], ['KME', 'https://www.kme.com', 'I'], ['Wieland', 'https://www.wieland.com', 'I']],
  'mat-aco': [['Tenaris', 'https://www.tenaris.com', 'I'], ['Vallourec', 'https://www.vallourec.com', 'I'], ['ArcelorMittal', 'https://brasil.arcelormittal.com', 'I']],
  'mat-pe': [['Tigre', 'https://www.tigre.com.br', 'N'], ['Kanaflex', 'https://www.kanaflex.com.br', 'N'], ['Polierg', 'https://www.polierg.com.br', 'N'], ['Amanco Wavin', 'https://wavin.com', 'N'], ['GF Piping Systems', 'https://www.gfps.com', 'I']],
  'mat-ferro': [['Saint-Gobain Canalização (PAM)', 'https://www.saint-gobain-canalizacao.com.br', 'I'], ['Electrosteel Castings', 'https://www.electrosteel.com', 'I']],
  'mat-inox': [['Aperam', 'https://www.aperam.com', 'I'], ['Outokumpu', 'https://www.outokumpu.com', 'I'], ['Alleima', 'https://www.alleima.com', 'I']],
  'mat-galv': [['Tupy', 'https://www.tupy.com.br', 'N'], ['IPC/GIPP', 'https://catalogo.ipcbrasil.ind.br/pt/home', 'M'], ['ASC Engineered Solutions (Anvil)', 'https://www.asc-es.com', 'I']],
  'mat-conexoes-cobre': [['Paranapanema (Eluma)', 'https://www.paranapanema.com.br', 'N'], ['Mueller Industries', 'https://www.muellerindustries.com', 'I'], ['NIBCO', 'https://www.nibco.com', 'I'], ['Viega', 'https://www.viega.com', 'I']],
  'mat-latao': [['Viega', 'https://www.viega.com', 'I'], ['Mueller Industries', 'https://www.muellerindustries.com', 'I'], ['Swagelok', 'https://www.swagelok.com', 'I']],
  'mat-flanges': [['Bonney Forge', 'https://www.bonneyforge.com', 'I'], ['Galperti', 'https://www.galperti.com', 'I']],
  'mat-ranhurado': [['Victaulic', 'https://www.victaulic.com', 'I'], ['Tyco (Johnson Controls)', 'https://www.tyco-fire.com', 'I'], ['Viking', 'https://www.vikinggroupinc.com', 'I'], ['ASC Engineered Solutions (Gruvlok)', 'https://www.asc-es.com', 'I']],
  // Importadores (todos 'M': a ficha mostra o título "Importadores"). Sem link = site ainda não informado.
  'mat-grooved': [['Comercial Rimar', 'https://rimar.com.br/', 'M'], ['Dinâmica', 'https://dinamicadistribuidor.com.br/', 'M'], ['Potenza', 'https://www.hidraulicapotenza.com.br/', 'M'], ['IPC/GIPP', 'https://catalogo.ipcbrasil.ind.br/pt/home', 'M']],
  'mat-esfera': [['IPC/GIPP', 'https://catalogo.ipcbrasil.ind.br/pt/home', 'M'], ['Mipel', 'https://www.mipel.com.br', 'N'], ['Docol', 'https://www.docol.com.br', 'N'], ['Deca', 'https://www.deca.com.br', 'N'], ['Swagelok', 'https://www.swagelok.com', 'I'], ['Genebre', 'https://www.genebre.es', 'I']],
  'mat-gaveta': [['Niagara', 'https://www.niagara.com.br', 'N'], ['Mipel', 'https://www.mipel.com.br', 'N'], ['KSB', 'https://www.ksb.com', 'I'], ['Velan', 'https://www.velan.com', 'I']],
  'mat-globo': [['Niagara', 'https://www.niagara.com.br', 'N'], ['Spirax Sarco', 'https://www.spiraxsarco.com', 'I'], ['KSB', 'https://www.ksb.com', 'I'], ['Velan', 'https://www.velan.com', 'I']],
  'mat-borboleta': [['Niagara', 'https://www.niagara.com.br', 'N'], ['Bray International', 'https://www.bray.com', 'I'], ['Emerson (Keystone)', 'https://www.emerson.com', 'I'], ['Genebre', 'https://www.genebre.es', 'I']],
  'mat-redutora': [['Niagara', 'https://www.niagara.com.br', 'N'], ['Watts', 'https://www.watts.com', 'I'], ['Bermad', 'https://www.bermad.com', 'I'], ['Caleffi', 'https://www.caleffi.com', 'I']],
  'mat-retencao': [['Mipel', 'https://www.mipel.com.br', 'N'], ['Niagara', 'https://www.niagara.com.br', 'N'], ['KSB', 'https://www.ksb.com', 'I'], ['Genebre', 'https://www.genebre.es', 'I']],
  'mat-reguladores': [['Aliança Metalúrgica', 'https://www.aliancametalurgica.com.br', 'N'], ['Gascat', 'https://www.gascat.com.br', 'N'], ['Pietro Fiorentini', 'https://www.fiorentini.com', 'I'], ['Emerson (Fisher)', 'https://www.emerson.com', 'I']],
  'mat-purgadores': [['Spirax Sarco', 'https://www.spiraxsarco.com', 'I'], ['Armstrong International', 'https://www.armstronginternational.com', 'I'], ['TLV', 'https://www.tlv.com', 'I'], ['Gestra', 'https://www.gestra.com', 'I']],
  'mat-bombas': [['Schneider Motobombas', 'https://www.schneidermotobombas.com.br', 'N'], ['Dancor', 'https://www.dancor.com.br', 'N'], ['Ebara (Thebe)', 'https://www.ebara.com.br', 'I'], ['KSB', 'https://www.ksb.com', 'I'], ['Grundfos', 'https://www.grundfos.com', 'I']],
  'mat-caldeiras': [['Komeco', 'https://www.komeco.com.br', 'N'], ['Rinnai', 'https://www.rinnai.com.br', 'I'], ['Alfa Laval (ATA)', 'https://www.alfalaval.com.br', 'I'], ['Bosch Industrial', 'https://www.bosch-industrial.com', 'I']],
  'mat-compressores': [['Schulz', 'https://www.schulz.com.br', 'N'], ['Chiaperini', 'https://www.chiaperini.com.br', 'N'], ['Atlas Copco', 'https://www.atlascopco.com', 'I'], ['Kaeser', 'https://www.kaeser.com', 'I'], ['Ingersoll Rand', 'https://www.ingersollrand.com', 'I']],
  'mat-sprinklers': [['Tyco (Johnson Controls)', 'https://www.tyco-fire.com', 'I'], ['Viking', 'https://www.vikinggroupinc.com', 'I'], ['Reliable', 'https://www.reliablesprinkler.com', 'I'], ['Victaulic', 'https://www.victaulic.com', 'I']],
  'mat-medidores': [['WIKA', 'https://www.wika.com', 'I'], ['Nuova Fima', 'https://www.nuovafima.com', 'I'], ['Itron', 'https://www.itron.com', 'I'], ['Endress+Hauser', 'https://www.endress.com', 'I'], ['Siemens', 'https://www.siemens.com', 'I']],
  'mat-mangueiras': [['Bucka', 'https://www.bucka.com.br', 'N'], ['Kidde', 'https://www.kiddelatam.com', 'I'], ['Parker', 'https://www.parker.com', 'I'], ['Gates', 'https://www.gates.com', 'I']],
  'mat-vedantes': [['Tigre', 'https://www.tigre.com.br', 'N'], ['Teadit', 'https://www.teadit.com', 'N'], ['Loctite (Henkel)', 'https://www.loctite.com.br', 'I'], ['Klinger', 'https://www.klinger-international.com', 'I']],
  'mat-suportes': [['Hilti', 'https://www.hilti.com.br', 'I'], ['Walraven', 'https://www.walraven.com', 'I'], ['ASC Engineered Solutions (Anvil)', 'https://www.asc-es.com', 'I']],
  'mat-filtros': [['Parker', 'https://www.parker.com', 'I'], ['Spirax Sarco', 'https://www.spiraxsarco.com', 'I'], ['Netafim', 'https://www.netafim.com', 'I'], ['Amiad', 'https://www.amiad.com', 'I']],
  'mat-ferramentas': [['Tramontina', 'https://www.tramontina.com.br', 'N'], ['Ridgid', 'https://www.ridgid.com', 'I'], ['Rothenberger', 'https://www.rothenberger.com', 'I'], ['REMS', 'https://www.rems.de', 'I']],
};

// Foto real de cada item do catálogo (Wikimedia Commons, licenças livres; manter os créditos).
// [produto, n] reaproveita a n-ésima foto (0 = primeira) da ficha do guia técnico.
const MATERIAL_PHOTOS = {
  'mat-conexoes-pvc': ['conexoes-pvc', 0], 'mat-conexoes-cpvc': ['conexoes-cpvc', 0], 'mat-conexoes-inox': ['conexoes-inox', 0],
  'mat-conexoes-forjadas': ['conexoes-forjadas', 0], 'mat-conexoes-solda': ['conexoes-solda', 0], 'mat-valvulas': ['valvulas', 2],
  'mat-registros': ['registros-latao', 0], 'mat-juntas': ['juntas-vedacao', 0], 'mat-rosqueadeiras': ['rosqueadeiras', 0],
  'mat-pvc': ['tubos-pvc', 0], 'mat-cpvc': ['tubos-cpvc', 2], 'mat-cobre': ['tubos-cobre', 1], 'mat-aco': ['tubos-aco', 0],
  'mat-inox': ['tubos-inox', 0], 'mat-galv': ['conexoes-ferro', 0], 'mat-conexoes-cobre': ['conexoes-cobre', 0], 'mat-flanges': ['flanges', 0], 'mat-ranhurado': ['conexoes-ranhuradas', 1],
  'mat-grooved': ['conexoes-ranhuradas', 0], 'mat-esfera': ['registros-latao', 2], 'mat-gaveta': ['valvulas', 0],
  'mat-globo': { src: 'img/materiais/mat-globo-1.webp', alt: 'Válvula globo de aço fundido com flanges e volante amarelo', legenda: 'Válvula globo flangeada', autor: 'Heather Smith', licenca: 'CC BY 3.0', licUrl: 'https://creativecommons.org/licenses/by/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Globe-valve.JPG' },
  'mat-borboleta': { src: 'img/materiais/mat-borboleta-1.webp', alt: 'Válvula borboleta de ferro dúctil com redutor de volante', legenda: 'Válvula borboleta com redutor', autor: 'Heather Smith', licenca: 'CC BY 3.0', licUrl: 'https://creativecommons.org/licenses/by/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Bidirectional_tight_butterfly_valve-The-Alloy-Valve-Stockist.jpg' },
  'mat-redutora': { src: 'img/materiais/mat-redutora-1.webp', alt: 'Ilustração em corte de uma válvula redutora de pressão, fechada e aberta', legenda: 'Esquema em corte (ilustração)', autor: 'Gerritse', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Reduceerventiel_pressure-reducer.jpg', inteira: true }, 'mat-purgadores': ['purgadores', 0], 'mat-bombas': ['bombas', 1], 'mat-caldeiras': ['caldeiras', 0],
  'mat-compressores': ['compressores', 1], 'mat-sprinklers': ['sprinklers', 0], 'mat-medidores': ['manometros', 1], 'mat-vedantes': ['vedantes', 2],
  'mat-suportes': ['suportes', 0], 'mat-filtros': ['filtros', 0], 'mat-ferramentas': ['ferramentas-hidraulicas', 0],
  'mat-pex': { src: 'img/materiais/mat-pex-1.webp', alt: 'Tubos de PEX azul e vermelho instalados com conexões de latão', legenda: 'Rede de PEX', autor: 'Tomwsulcer', licenca: 'CC0', licUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', fonte: 'https://commons.wikimedia.org/wiki/File:PEX_piping_in_basement_ceiling.jpg' },
  'mat-pe': { src: 'img/materiais/mat-pe-1.webp', alt: 'Bobinas de tubo de polietileno de alta densidade', legenda: 'Bobinas de PEAD', autor: 'GordonJ86', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Acu-Tech_HDPE_Pipe_Coils.jpg' },
  'mat-ferro': { src: 'img/materiais/mat-ferro-1.webp', alt: 'Montagem de tubo de ferro fundido dúctil em vala', legenda: 'Tubo de ferro dúctil', autor: 'Frankemann', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Ductile_cast_iron_pipes.JPG' },
  'mat-latao': { src: 'img/materiais/mat-latao-1.webp', alt: 'Conexão roscada de latão', legenda: 'Conexão de latão', autor: 'Emilian Robert Vicol', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Brass-5-Way-Fitting_83089-480x360_(4999932433).jpg' },
  'mat-retencao': { src: 'img/materiais/mat-retencao-1.webp', alt: 'Válvulas de retenção portinhola flangeadas', legenda: 'Válvulas de retenção', autor: 'Heather Smith', licenca: 'CC BY 3.0', licUrl: 'https://creativecommons.org/licenses/by/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Swing_Check_valves.JPG' },
  'mat-reguladores': { src: 'img/materiais/mat-reguladores-1.webp', alt: 'Regulador de pressão de gás com manômetros de entrada e saída', legenda: 'Regulador de pressão', autor: 'Ilja (de.wikipedia)', licenca: 'CC BY-SA 3.0', licUrl: 'http://creativecommons.org/licenses/by-sa/3.0/', fonte: 'https://commons.wikimedia.org/wiki/File:Druckminderer_gr.jpg' },
  'mat-mangueiras': { src: 'img/materiais/mat-mangueiras-1.webp', alt: 'Mangueira de incêndio enrolada com engate', legenda: 'Mangueira de incêndio', autor: 'CEphoto, Uwe Aranas', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Cologne_Germany_Hose-Coil-01.jpg' },
};

// Cada ficha técnica do antigo guia (products.js) agora aparece dentro de um item do catálogo.
const MATERIAL_OF_PRODUCT = Object.fromEntries(CATALOG.filter(m => m.rel).map(m => [m.rel, m.id]));
