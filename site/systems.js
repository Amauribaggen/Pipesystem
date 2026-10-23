// Sistemas hidráulicos e de condução: fichas técnicas e esquemas ilustrativos.
// Nos esquemas: .p = tubulação principal (cor do sistema), .p2 = linha secundária (quente/retorno),
// .pe = esgoto, .b = equipamento, text.s / text.e = texto alinhado à esquerda / direita.
const SYSTEMS = [
  { id: 'sis-agua', name: 'Água quente e fria', color: '#1fb6c9',
    desc: 'O sistema predial leva água fria do reservatório superior aos pontos de uso por gravidade, pelo barrilete, colunas, ramais e sub-ramais, ou por pressurização. A água quente vem de aquecedores de passagem, de acumulação, solares ou bombas de calor; em sistemas maiores, um circuito de recirculação mantém a temperatura nos pontos distantes.',
    componentes: ['Reservatórios inferior e superior', 'Barrilete, colunas e ramais de distribuição', 'Registros de gaveta e de pressão', 'Aquecedor e rede de água quente com isolamento térmico', 'Válvulas redutoras de pressão em edifícios altos'],
    cuidados: ['Pressão estática de até 400 kPa (40 mca) nos pontos de utilização', 'Velocidades moderadas, para evitar ruído e golpe de aríete', 'Materiais próprios para água quente: CPVC, PPR, PEX ou cobre', 'Ensaio de estanqueidade antes de fechar paredes e forros'],
    normas: ['NBR 5626', 'NBR 15569'],
    produtos: ['tubos-pvc', 'tubos-cpvc', 'tubos-cobre', 'conexoes-cpvc', 'registros-latao', 'mat-ppr', 'mat-multicamada', 'mat-reservatorios', 'mat-pressurizadores', 'mat-isolamento'],
    svg: `<rect class="b" x="16" y="12" width="74" height="30" rx="4"/><text x="53" y="31">Reservatório</text>
      <path class="p" d="M90 27H210V150"/><path class="p" d="M210 75H288M210 130H288"/>
      <circle class="b" cx="296" cy="75" r="7"/><rect class="b" x="288" y="122" width="16" height="26" rx="3"/>
      <rect class="b" x="96" y="92" width="64" height="26" rx="4"/><text x="128" y="109">Aquecedor</text>
      <path class="p2" d="M160 105H180V142H288"/>
      <text x="150" y="20">Barrilete</text><text class="s" x="218" y="104">Coluna</text><text x="250" y="68">Ramal</text>
      <text class="e" x="316" y="164">Ponto de uso</text>` },

  { id: 'sis-solar', name: 'Aquecimento solar de água', color: '#e8a317',
    desc: 'Coletores solares instalados na cobertura aquecem a água, que segue para um reservatório térmico isolado (boiler) por termossifão, com circulação natural, ou por bomba comandada por um controlador diferencial de temperatura. Um aquecimento de apoio, elétrico ou a gás, garante água quente nos dias nublados.',
    componentes: ['Coletores solares planos ou de tubos a vácuo', 'Reservatório térmico (boiler) de baixa ou alta pressão', 'Caixa d’água fria de alimentação', 'Bomba e controlador diferencial (circulação forçada)', 'Aquecimento de apoio elétrico ou a gás', 'Tubulação de cobre, CPVC ou PPR com isolamento térmico'],
    cuidados: ['Coletores voltados para o norte, com inclinação próxima à latitude do local mais 10°', 'Respiro e válvula de alívio de pressão e temperatura no reservatório', 'Materiais que suportem 80 °C ou mais nas linhas de água quente', 'Isolamento térmico contínuo nas tubulações quentes', 'Proteção contra superaquecimento e, em regiões frias, contra congelamento'],
    normas: ['NBR 15569', 'NBR 15747-1', 'NBR 5626'],
    produtos: ['tubos-cobre', 'tubos-cpvc', 'conexoes-cpvc', 'caldeiras', 'bombas', 'valvulas', 'mat-solar', 'mat-ppr', 'mat-isolamento', 'mat-reservatorios'],
    svg: `<circle cx="140" cy="14" r="8" fill="#f5b700"/>
      <path class="b" d="M10 70L90 30L170 70"/><rect class="b" x="20" y="70" width="150" height="70"/>
      <rect class="b" x="40" y="34" width="44" height="14" rx="2" transform="rotate(-27 62 41)"/><text x="62" y="18">Coletores</text>
      <rect class="b" x="196" y="30" width="70" height="26" rx="13"/><text x="240" y="72">Reservatório térmico</text>
      <rect class="b" x="276" y="4" width="34" height="20" rx="3"/><text x="293" y="18">Fria</text>
      <path class="p thin" style="stroke:#3b8fd9" d="M293 24V43H266M196 50H180V96H40V54"/>
      <path class="p2" d="M84 30H150V43H196M266 36H308V120"/>
      <text x="300" y="134">Consumo</text><text x="240" y="86">Apoio elétrico ou a gás</text>` },

  { id: 'sis-gas', name: 'Gás natural e GLP', color: '#f2a03d',
    desc: 'A rede interna leva o gás natural, fornecido pela distribuidora, ou o GLP, de uma central de cilindros ou tanques, até fogões, aquecedores e equipamentos. O gás natural é mais leve que o ar e se dispersa para cima. O GLP é mais pesado e se acumula em pontos baixos, por isso exige ventilação e cuidados com ralos e subsolos.',
    componentes: ['Abrigo de medidores ou central de GLP', 'Reguladores de pressão de 1º e 2º estágio', 'Rede em cobre, aço ou multicamada; PE na parte enterrada', 'Registro de bloqueio em cada ponto de consumo', 'Ventilação permanente nos ambientes com aparelhos'],
    cuidados: ['Ensaio de estanqueidade antes de liberar o gás', 'Não passar a tubulação por espaços confinados sem ventilação', 'Vedantes e registros certificados para gás', 'Projeto e execução por profissional habilitado, com ART'],
    normas: ['NBR 15526', 'NBR 13523'],
    produtos: ['tubos-cobre', 'tubos-aco', 'conexoes-ferro', 'vedantes', 'valvulas', 'manometros'],
    svg: `<rect class="b" x="14" y="100" width="56" height="50" rx="4"/><text x="42" y="129">Medidor</text>
      <path class="p" d="M70 125H87M105 125H160V40H252M160 95H232"/>
      <circle class="b" cx="96" cy="125" r="9"/><text x="96" y="152">Regulador</text>
      <rect class="b" x="196" y="34" width="10" height="12" rx="2"/><text x="201" y="28">Registro</text>
      <rect class="b" x="252" y="26" width="60" height="28" rx="4"/><text x="282" y="44">Aquecedor</text>
      <rect class="b" x="232" y="82" width="44" height="26" rx="4"/><text x="254" y="99">Fogão</text>
      <text x="230" y="140">Ventilação permanente</text>` },

  { id: 'sis-gases-medicinais', name: 'Gases medicinais e hospitalares', color: '#e85d9a',
    desc: 'Redes centralizadas levam oxigênio, ar comprimido medicinal, óxido nitroso e vácuo clínico das centrais de suprimento até os postos de utilização em leitos, centros cirúrgicos e UTIs. São instalações críticas para a vida dos pacientes: tubulação de cobre limpa e desengraxada, válvulas de seção, alarmes de pressão e identificação por cores.',
    componentes: ['Centrais de suprimento: tanque criogênico, baterias de cilindros, compressores e bombas de vácuo', 'Tubulação de cobre sem costura, limpa para oxigênio, unida por brasagem', 'Válvulas de seção por setor, em caixas com visor', 'Painéis de alarme de pressão', 'Postos de utilização em réguas e painéis de cabeceira', 'Identificação por cores: oxigênio verde, ar medicinal amarelo, vácuo cinza e óxido nitroso azul'],
    cuidados: ['Brasagem com passagem de nitrogênio e nenhum óleo ou graxa em contato com o oxigênio', 'Suprimento primário, secundário e reserva, com comutação automática', 'Testes de estanqueidade, de pureza e de troca de gases (identificação cruzada) antes da liberação', 'Projeto e execução por empresa especializada, com responsável técnico', 'Centrais protegidas, ventiladas e com acesso controlado'],
    normas: ['NBR 12188', 'ISO 7396-1'],
    produtos: ['tubos-cobre', 'mat-conexoes-cobre', 'valvulas', 'mat-reguladores', 'manometros'],
    svg: `<rect class="b" x="14" y="60" width="10" height="50" rx="4"/><rect class="b" x="28" y="60" width="10" height="50" rx="4"/><rect class="b" x="42" y="60" width="10" height="50" rx="4"/>
      <text x="40" y="126">Central de gases</text>
      <path class="p" d="M52 80H120M156 80H300M200 80V118M250 80V118M300 80V118"/>
      <rect class="b" x="120" y="66" width="36" height="28" rx="3"/><text x="138" y="108">Válvulas</text>
      <circle class="b" cx="138" cy="56" r="5"/><text x="138" y="44">Alarme</text>
      <rect class="b" x="186" y="118" width="28" height="18" rx="3"/><rect class="b" x="236" y="118" width="28" height="18" rx="3"/><rect class="b" x="286" y="118" width="28" height="18" rx="3"/>
      <text x="200" y="152">UTI</text><text x="250" y="152">Cirurgia</text><text x="300" y="152">Leitos</text>
      <text x="228" y="62">O₂ · ar medicinal · vácuo</text>` },

  { id: 'sis-incendio', name: 'Rede de incêndio', color: '#e5534b',
    desc: 'Os sistemas hidráulicos de combate a incêndio combinam hidrantes e mangotinhos com chuveiros automáticos (sprinklers). Eles são alimentados por uma reserva técnica de incêndio e por bombas dedicadas. O que cada edificação precisa ter é definido pelas Instruções Técnicas do Corpo de Bombeiros de cada estado.',
    componentes: ['Reserva técnica de incêndio', 'Bomba principal, bomba jockey e, quando exigida, bomba a combustão', 'Rede em aço com conexões ranhuradas ou roscadas', 'Hidrantes, mangueiras e esguichos', 'Sprinklers, válvula de governo e alarme', 'Registro de recalque no passeio'],
    cuidados: ['Projeto aprovado pelo Corpo de Bombeiros', 'Pressão e vazão mínimas no hidrante mais desfavorável', 'Inspeções e testes periódicos de bombas e válvulas', 'Tubulação aparente identificada em vermelho'],
    normas: ['NBR 13714', 'NBR 10897', 'NFPA 13', 'NFPA 20'],
    produtos: ['tubos-aco', 'conexoes-ranhuradas', 'sprinklers', 'bombas', 'valvulas', 'mat-hidrantes', 'mat-reservatorios'],
    svg: `<rect class="b" x="14" y="14" width="76" height="40" rx="4"/><text x="52" y="38">Reservatório</text>
      <path class="p" d="M60 54V106M74 120H120V30H300M170 30V46M220 30V46M270 30V46M120 120H232"/>
      <circle class="b" cx="60" cy="120" r="14"/><text x="60" y="152">Bomba</text>
      <path class="b" d="M164 48h12l-6 8zM214 48h12l-6 8zM264 48h12l-6 8z"/><text x="220" y="72">Sprinklers</text>
      <rect class="b" x="232" y="104" width="52" height="34" rx="4"/><text x="258" y="125">Hidrante</text>` },

  { id: 'sis-vapor', name: 'Vapor e caldeiras', color: '#9aa7b8',
    desc: 'O vapor transporta grande quantidade de energia, na forma de calor latente, da caldeira até os consumidores: trocadores de calor, autoclaves, marmitas e prensas. Depois de ceder calor, ele vira condensado, que deve ser drenado pelos purgadores e devolvido à caldeira. Linhas bem drenadas e isoladas evitam golpe de aríete e perdas de energia.',
    componentes: ['Caldeira e tratamento da água de alimentação', 'Linhas de vapor em aço-carbono sem costura', 'Purgadores, filtros Y e visores', 'Válvulas redutoras de pressão e de segurança', 'Rede de retorno de condensado', 'Isolamento térmico'],
    cuidados: ['Inclinação das linhas no sentido do fluxo, com pontos de drenagem', 'Dimensionamento por velocidade e perda de pressão', 'Absorver a dilatação com liras ou juntas de expansão', 'Caldeiras e vasos sob a NR-13: inspeção e operador qualificado'],
    normas: ['NR-13', 'ASME B31.1', 'ASME B31.3'],
    produtos: ['caldeiras', 'tubos-aco', 'conexoes-forjadas', 'flanges', 'purgadores', 'juntas-vedacao', 'mat-isolamento'],
    svg: `<rect class="b" x="14" y="70" width="70" height="50" rx="14"/><text x="49" y="99">Caldeira</text>
      <path class="p" d="M84 80H150V40H258V70"/><path class="p" d="M190 40V60"/>
      <rect class="b" x="184" y="60" width="12" height="12" rx="2"/><text class="s" x="200" y="70">Purgador</text>
      <rect class="b" x="230" y="70" width="56" height="34" rx="4"/><text x="258" y="91">Trocador</text>
      <path class="p2" d="M258 104V140H49V120M190 72V140"/>
      <text x="200" y="32">Linha de vapor</text><text x="150" y="156">Retorno de condensado</text>` },

  { id: 'sis-ar', name: 'Ar comprimido', color: '#6c8cff',
    desc: 'O ar comprimido alimenta ferramentas pneumáticas, cilindros, automação e sopro. É uma das utilidades mais caras da indústria: vazamentos e quedas de pressão significam energia elétrica desperdiçada. O sistema reúne geração, tratamento (secagem e filtragem) e uma rede de distribuição bem dimensionada.',
    componentes: ['Compressor e reservatório de ar', 'Secador por refrigeração ou adsorção', 'Filtros de partículas e coalescentes', 'Rede em anel com inclinação e drenos', 'Derivações pela parte superior da rede', 'Unidades de tratamento (filtro, regulador e lubrificador) nos pontos de uso'],
    cuidados: ['Pequena queda de pressão entre o compressor e o ponto de uso', 'Programa periódico de detecção e correção de vazamentos', 'Qualidade do ar definida pela ISO 8573-1, conforme a aplicação', 'Reservatórios são vasos de pressão sujeitos à NR-13'],
    normas: ['ISO 8573-1', 'ISO 1217', 'NR-13'],
    produtos: ['compressores', 'filtros', 'tubos-aco', 'conexoes-ferro', 'manometros', 'valvulas'],
    svg: `<rect class="b" x="10" y="96" width="64" height="40" rx="4"/><text x="42" y="120">Compressor</text>
      <rect class="b" x="88" y="60" width="30" height="76" rx="15"/><text x="103" y="152">Reservatório</text>
      <rect class="b" x="134" y="96" width="44" height="40" rx="4"/><text x="156" y="120">Secador</text>
      <rect class="b" x="190" y="104" width="18" height="28" rx="3"/><text x="199" y="148">Filtro</text>
      <path class="p" d="M74 116H88M118 116H134M178 116H190M208 116H230V30H300V90H230M300 90V118"/>
      <circle class="b" cx="300" cy="126" r="7"/><text x="265" y="64">Rede em anel</text><text class="e" x="316" y="150">Ponto de uso</text>` },

  { id: 'sis-oleohidraulica', name: 'Hidráulica de potência (óleo hidráulico)', color: '#d9822b',
    desc: 'Os sistemas oleodinâmicos transmitem força e movimento por meio de óleo sob pressão. A bomba, acionada por um motor, gera a vazão; válvulas direcionais, de pressão e de vazão controlam o fluxo; e cilindros ou motores hidráulicos realizam o trabalho. Estão em prensas, injetoras, máquinas agrícolas e de construção, guindastes, elevadores e comportas.',
    componentes: ['Reservatório com filtro de retorno, respiro e indicador de nível', 'Bomba de engrenagens, de palhetas ou de pistões', 'Válvula de alívio (limitadora de pressão)', 'Válvulas direcionais, de vazão e de retenção', 'Cilindros e motores hidráulicos', 'Mangueiras de alta pressão, tubos de aço sem costura e conexões de anilha', 'Manômetros, acumuladores e trocador de calor'],
    cuidados: ['Óleo limpo: filtragem para manter o nível de contaminação exigido (ISO 4406)', 'Pressões de 200 a 350 bar ou mais: usar só componentes certificados para a pressão de trabalho', 'Nunca procurar vazamentos com a mão: um jato de óleo fino pode perfurar a pele', 'Despressurizar o circuito e descarregar os acumuladores antes da manutenção', 'Controlar a temperatura do óleo'],
    normas: ['ISO 4413', 'ISO 1219-1', 'ISO 4406'],
    produtos: ['bombas', 'valvulas', 'mat-mangueiras', 'filtros', 'manometros', 'tubos-aco'],
    svg: `<rect class="b" x="14" y="118" width="70" height="36" rx="4"/><text x="49" y="140">Reservatório</text>
      <circle class="b" cx="110" cy="100" r="12"/><text x="110" y="128">Bomba</text>
      <path class="p" d="M60 118V100H98M122 100H170V60M200 48H236"/>
      <path class="p thin" d="M150 100V128"/><rect class="b" x="144" y="128" width="12" height="10" rx="2"/><text class="s" x="162" y="136">Alívio</text>
      <path class="pe" d="M146 60V76H30V118M150 138V150H84"/><text class="s" x="34" y="70">Retorno</text>
      <rect class="b" x="140" y="36" width="60" height="24" rx="2"/><path class="b" d="M170 36V60"/><text x="170" y="28">Direcional</text>
      <rect class="b" x="236" y="38" width="60" height="22" rx="3"/><rect class="b" x="296" y="45" width="20" height="8" rx="2"/><text x="266" y="30">Cilindro</text>` },

  { id: 'sis-gases-industriais', name: 'Gases industriais e vácuo', color: '#9b6bd6',
    desc: 'Redes que distribuem nitrogênio, oxigênio, argônio, CO₂, hidrogênio, acetileno e misturas para soldagem, corte, inertização, laboratórios e processos, a partir de tanques criogênicos ou de centrais de cilindros. As redes de vácuo atendem laboratórios, embalagens e processos industriais.',
    componentes: ['Tanques criogênicos com vaporizadores ou centrais de cilindros (manifolds)', 'Reguladores de pressão de primeiro e de segundo estágio', 'Tubulação de cobre, inox ou aço, conforme o gás', 'Válvulas de bloqueio, de retenção e corta-chamas (gases combustíveis)', 'Pontos de consumo com regulador e manômetro', 'Bombas de vácuo, reservatório e filtros (redes de vácuo)'],
    cuidados: ['Material compatível com o gás: oxigênio exige tubulação limpa e sem óleo; acetileno não pode ter contato com cobre nem com ligas de alto teor de cobre', 'Ventilação e detecção de vazamentos: gases inertes causam asfixia e os combustíveis podem explodir', 'Cilindros presos, protegidos e longe de fontes de calor', 'Linhas identificadas por cor e pelo nome do gás', 'Teste de estanqueidade e purga antes de colocar em uso'],
    normas: ['NBR 12176', 'ISO 9539'],
    produtos: ['tubos-cobre', 'tubos-inox', 'mat-reguladores', 'valvulas', 'manometros', 'filtros'],
    svg: `<rect class="b" x="16" y="24" width="34" height="80" rx="12"/><text x="33" y="118">Tanque</text><text x="33" y="130">criogênico</text>
      <path class="b" d="M64 40V90M72 40V90M80 40V90M64 40H80M64 90H80"/><text x="80" y="16">Vaporizador</text>
      <path class="p" d="M50 60H64M80 60H121M135 60H300M180 60V100M240 60V100M296 60V100"/>
      <circle class="b" cx="128" cy="60" r="7"/><text x="128" y="44">Regulador</text>
      <rect class="b" x="174" y="100" width="12" height="12" rx="2"/><rect class="b" x="234" y="100" width="12" height="12" rx="2"/><rect class="b" x="290" y="100" width="12" height="12" rx="2"/>
      <text class="e" x="172" y="128">Solda</text><text class="e" x="232" y="128">Laboratório</text><text class="e" x="288" y="128">Processo</text>
      <path class="p2" d="M240 112V146M296 112V146H118"/><circle class="b" cx="108" cy="146" r="10"/><text x="108" y="166">Bomba de vácuo</text><text x="200" y="160">Vácuo</text>` },

  { id: 'sis-irrigacao', name: 'Irrigação', color: '#3fb27f',
    desc: 'A irrigação leva água às culturas com eficiência, por aspersão, pivô central ou irrigação localizada (gotejamento e microaspersão). O projeto equilibra vazão, pressão e uniformidade de aplicação. O sistema também pode distribuir fertilizantes junto com a água (fertirrigação).',
    componentes: ['Captação e conjunto motobomba', 'Filtros de tela, disco ou areia', 'Adutora e linhas principais em PVC ou PEAD', 'Linhas laterais com gotejadores ou aspersores', 'Válvulas, ventosas e automação', 'Injetor de fertilizantes'],
    cuidados: ['Variação de pressão limitada nas linhas laterais, para manter a uniformidade', 'Filtragem adequada, principalmente no gotejamento', 'Ventosas e proteção contra golpe de aríete na adutora', 'Outorga de uso da água junto ao órgão competente'],
    normas: ['ISO 9261', 'NBR 15561'],
    produtos: ['tubos-pvc', 'conexoes-pvc', 'filtros', 'bombas', 'valvulas'],
    svg: `<rect class="b" x="12" y="104" width="50" height="40" rx="4"/><text x="37" y="128">Captação</text>
      <circle class="b" cx="84" cy="118" r="12"/><text x="84" y="146">Bomba</text>
      <rect class="b" x="108" y="106" width="16" height="26" rx="3"/><text x="116" y="98">Filtro</text>
      <path class="p" d="M62 118H72M96 118H108M124 118H150V40H306"/>
      <path class="p thin" d="M190 40V140M240 40V140M290 40V140"/>
      <g class="drip"><circle cx="190" cy="70" r="3"/><circle cx="190" cy="100" r="3"/><circle cx="190" cy="130" r="3"/><circle cx="240" cy="70" r="3"/><circle cx="240" cy="100" r="3"/><circle cx="240" cy="130" r="3"/><circle cx="290" cy="70" r="3"/><circle cx="290" cy="100" r="3"/><circle cx="290" cy="130" r="3"/></g>
      <text x="228" y="32">Linha principal</text><text x="240" y="160">Linhas laterais com gotejadores</text>` },

  { id: 'sis-saneamento', name: 'Saneamento e drenagem', color: '#2d7fd3',
    desc: 'O saneamento abrange o abastecimento público de água: captação, tratamento (ETA), adução, reservação e distribuição. Abrange também o esgotamento sanitário, com redes coletoras, interceptores, elevatórias e tratamento (ETE), e a drenagem das águas pluviais urbanas.',
    componentes: ['Adutoras em ferro fundido dúctil, PEAD, PVC DEFoFo ou aço', 'Estações elevatórias de água e de esgoto', 'Válvulas de gaveta, borboleta, retenção e ventosas', 'Reservatórios de distribuição', 'Poços de visita e redes coletoras', 'Macro e micromedição'],
    cuidados: ['Proteção contra transientes hidráulicos (golpe de aríete)', 'Controle de perdas e estanqueidade das redes', 'Declividade e profundidade mínimas nas redes de esgoto', 'Materiais aprovados para contato com água potável'],
    normas: ['NBR 12218', 'NBR 12215', 'NBR 9649'],
    produtos: ['tubos-pvc', 'conexoes-pvc', 'valvulas', 'bombas', 'flanges', 'juntas-vedacao', 'mat-ventosas'],
    svg: `<path class="p2" d="M8 124q10-6 20 0t20 0t20 0"/><text x="38" y="112">Rio</text>
      <path class="p" d="M30 120V58H60M116 58H130V48H148M206 48H240V100H306"/>
      <rect class="b" x="60" y="40" width="56" height="36" rx="4"/><text x="88" y="62">ETA</text>
      <rect class="b" x="148" y="30" width="58" height="36" rx="4"/><text x="177" y="52">Reservação</text>
      <path class="b" d="M252 100v-12l8-8l8 8v12zM282 100v-12l8-8l8 8v12z"/>
      <path class="pe" d="M275 104V140H60"/>
      <rect class="b" x="14" y="128" width="46" height="26" rx="4"/><text x="37" y="145">ETE</text>
      <text x="270" y="72">Distribuição</text><text x="168" y="156">Rede de esgoto</text>` },

  { id: 'sis-refrigeracao', name: 'Refrigeração', color: '#7fd6e6',
    desc: 'Os circuitos frigoríficos por compressão de vapor fazem o fluido refrigerante circular num ciclo fechado: compressor, condensador, dispositivo de expansão e evaporador. Em sistemas centrais de ar-condicionado, chillers produzem água gelada que é distribuída aos fan-coils. Tubulações limpas, secas e estanques são essenciais para a vida útil do compressor.',
    componentes: ['Compressor, condensador, evaporador e dispositivo de expansão', 'Linhas de líquido e de sucção em cobre', 'Isolamento elastomérico na linha de sucção', 'Em água gelada: bombas, tubulação de aço ou PPR e válvulas de balanceamento'],
    cuidados: ['Brasagem com passagem de nitrogênio, para evitar oxidação interna', 'Teste de pressão com nitrogênio e vácuo antes da carga de refrigerante', 'Garantir o retorno de óleo (inclinação e sifões)', 'Isolamento contínuo para evitar condensação'],
    normas: ['NBR 16401', 'NBR 16069', 'ASHRAE 15'],
    produtos: ['tubos-cobre', 'conexoes-cobre', 'bombas', 'valvulas', 'filtros', 'mat-isolamento'],
    svg: `<circle class="b" cx="60" cy="120" r="16"/><text x="60" y="154">Compressor</text>
      <rect class="b" x="40" y="20" width="80" height="30" rx="4"/><text x="80" y="39">Condensador</text>
      <path class="b" d="M240 25l10 10l-10 10l-10-10z"/><text x="240" y="62">Expansão</text>
      <rect class="b" x="220" y="100" width="80" height="30" rx="4"/><text x="260" y="119">Evaporador</text>
      <path class="p2" d="M60 104V50M120 35H230"/><path class="p" d="M250 35H280V100M220 120H76"/>
      <text x="176" y="28">Linha de líquido</text><text x="150" y="112">Sucção (isolada)</text>` },

  { id: 'sis-combustiveis', name: 'Petróleo e combustíveis', color: '#b46a2a',
    desc: 'Estes sistemas movimentam e armazenam diesel, gasolina, óleos combustíveis e lubrificantes em indústrias, postos e bases de distribuição. São ambientes com risco de incêndio e de contaminação do solo, por isso exigem materiais compatíveis com hidrocarbonetos, contenção de vazamentos e controle de eletricidade estática.',
    componentes: ['Tanques aéreos ou subterrâneos de parede dupla', 'Bombas de transferência', 'Tubulação em aço-carbono ou não metálica aprovada', 'Filtros, medidores e válvulas de bloqueio', 'Bacia de contenção e detecção de vazamentos'],
    cuidados: ['Aterramento e equipotencialização contra eletricidade estática', 'Equipamentos adequados às áreas classificadas', 'Licenciamento ambiental e monitoramento do solo', 'Juntas e vedações compatíveis com hidrocarbonetos'],
    normas: ['NBR 17505', 'NBR 13786', 'ASME B31.3'],
    produtos: ['tubos-aco', 'conexoes-forjadas', 'flanges', 'juntas-vedacao', 'bombas', 'filtros'],
    svg: `<path class="b dash" d="M6 30V96H112V30"/><text x="59" y="112">Bacia de contenção</text>
      <rect class="b" x="14" y="40" width="90" height="44" rx="22"/><text x="59" y="66">Tanque</text>
      <circle class="b" cx="150" cy="62" r="12"/><text x="150" y="90">Bomba</text>
      <rect class="b" x="180" y="50" width="16" height="24" rx="3"/><text x="188" y="90">Filtro</text>
      <rect class="b" x="214" y="48" width="30" height="28" rx="4"/><text x="229" y="90">Medidor</text>
      <path class="p" d="M104 62H138M162 62H180M196 62H214M244 62H290V110"/>
      <rect class="b" x="272" y="110" width="36" height="36" rx="4"/><text x="290" y="162">Consumo</text>` },

  { id: 'sis-industrial', name: 'Água industrial e recalque', color: '#5c6b7d',
    desc: 'Estes sistemas elevam e distribuem água para processos, torres de resfriamento, caldeiras e utilidades. O recalque bombeia a água de um nível mais baixo, como um reservatório inferior ou um poço, até um reservatório elevado ou uma rede pressurizada.',
    componentes: ['Conjuntos motobomba titular e reserva', 'Sucção afogada ou com válvula de pé', 'Recalque com válvula de retenção e registro', 'Tratamento: filtros e abrandadores', 'Manômetros e medidores de vazão', 'Reservatório elevado'],
    cuidados: ['NPSH disponível suficiente; sucção curta e sem bolsas de ar', 'Velocidade econômica na linha de recalque', 'Proteção contra golpe de aríete na parada da bomba', 'Alternância periódica entre as bombas titular e reserva'],
    normas: ['NBR 12214', 'NBR 5626', 'ISO 9906'],
    produtos: ['bombas', 'valvulas', 'manometros', 'filtros', 'tubos-aco', 'flanges', 'mat-ventosas', 'mat-reservatorios'],
    svg: `<rect class="b" x="14" y="110" width="70" height="40" rx="4"/><text x="49" y="134">Inferior</text>
      <circle class="b" cx="120" cy="130" r="14"/><text x="120" y="162">Bomba</text>
      <path class="p" d="M84 130H106M134 130H170V40H230"/>
      <rect class="b" x="164" y="96" width="12" height="12" rx="2"/><text class="s" x="182" y="106">Retenção</text>
      <rect class="b" x="230" y="20" width="76" height="40" rx="4"/><text x="268" y="44">Superior</text>
      <text x="86" y="122">Sucção</text><text class="s" x="178" y="76">Recalque</text>` },

  { id: 'sis-processos-sanitarios', name: 'Processos sanitários (alimentos, bebidas e farmacêutica)', color: '#5fb0c8',
    desc: 'Nas indústrias de alimentos, bebidas, laticínios, cosméticos e farmacêutica, as tubulações conduzem produtos que não podem ser contaminados. Usam aço inoxidável com acabamento polido, uniões sanitárias de desmontagem rápida, válvulas sanitárias e limpeza automática no local (CIP), sem desmontar a linha.',
    componentes: ['Tubos e conexões inox 304L ou 316L com acabamento polido', 'Uniões sanitárias tipo clamp (tri-clamp), DIN 11851 (rosca) ou SMS', 'Válvulas borboleta, de assento e de diafragma sanitárias', 'Bombas centrífugas e de lóbulos sanitárias', 'Sistema CIP: tanques de solução alcalina, ácida e água, bomba e retorno', 'Instrumentos sanitários, sem pontos mortos'],
    cuidados: ['Linhas drenáveis: inclinadas, sem pontos baixos nem trechos mortos', 'Superfície interna lisa (rugosidade baixa) e soldas orbitais sem frestas', 'Juntas e vedações em materiais aprovados para contato com alimentos e fármacos', 'Validação da limpeza (CIP) e da sanitização (SIP)', 'Rastreabilidade dos materiais por certificados'],
    normas: ['ASME BPE', 'DIN 11850', 'DIN 11851', 'DIN 32676'],
    produtos: ['tubos-inox', 'conexoes-inox', 'valvulas', 'bombas', 'juntas-vedacao', 'filtros'],
    svg: `<rect class="b" x="20" y="30" width="40" height="70" rx="10"/><text x="40" y="22">Tanque</text>
      <circle class="b" cx="120" cy="110" r="11"/><text x="120" y="136">Bomba</text>
      <path class="p" d="M40 100V110H109M131 110H180V60H230"/>
      <path class="b" d="M174 80l6 8l6-8zM174 96l6-8l6 8z"/><text class="s" x="190" y="92">Válvula</text>
      <rect class="b" x="230" y="40" width="70" height="40" rx="4"/><text x="265" y="64">Envase</text>
      <rect class="b" x="150" y="130" width="50" height="26" rx="4"/><text x="175" y="147">CIP</text>
      <path class="p2" d="M150 143H30V100M265 80V143H200"/><text class="s" x="270" y="118">Retorno CIP</text>` },

  { id: 'sis-adutoras', name: 'Adutoras / linhas de transporte', color: '#0e7c9e',
    desc: 'Adutoras são as tubulações que levam a água bruta da captação até a estação de tratamento e a água tratada até os reservatórios, por gravidade ou por recalque. As linhas de transporte (dutos) conduzem água, petróleo, derivados e gás natural por longas distâncias. São redes de grande diâmetro e pressão elevada, enterradas ou aparentes, que exigem atenção ao golpe de aríete, ao ar na linha e à corrosão.',
    componentes: ['Tubos de ferro fundido dúctil, aço, PEAD ou PRFV', 'Estações elevatórias e boosters de pressão', 'Válvulas de bloqueio (borboleta e gaveta), de retenção e de controle', 'Ventosas nos pontos altos e descargas nos pontos baixos', 'Blocos de ancoragem em curvas, tês, reduções e extremidades', 'Macromedidores de vazão e transmissores de pressão'],
    cuidados: ['Proteção contra golpe de aríete: tanques de alívio, válvulas antecipadoras e partida e parada suaves das bombas', 'Ventosas bem dimensionadas para expulsar e admitir ar', 'Proteção contra corrosão nos tubos metálicos: revestimentos e proteção catódica', 'Teste hidrostático por trechos antes de entrar em operação', 'Faixa de servidão e sinalização dos dutos enterrados'],
    normas: ['NBR 12215', 'NBR 12211', 'NBR 7675', 'ASME B31.4', 'ASME B31.8'],
    produtos: ['mat-ferro', 'tubos-aco', 'mat-pe', 'valvulas', 'flanges', 'bombas', 'juntas-vedacao', 'mat-ventosas'],
    svg: `<path class="b dash" d="M8 154H60C96 154 112 112 146 110S196 132 222 116S270 76 312 74"/>
      <path class="p2" d="M8 146q8-5 16 0t16 0"/><text x="28" y="166">Captação</text>
      <circle class="b" cx="66" cy="138" r="11"/><text x="66" y="118">Elevatória</text>
      <path class="p" d="M40 140H55M77 138C104 134 116 102 146 100S194 122 222 106S268 70 284 68"/>
      <path class="b" d="M98 126l9 5l-9 5zM116 126l-9 5l9 5z" transform="rotate(-24 107 131)"/>
      <circle class="b" cx="146" cy="88" r="5"/><path class="b" d="M146 93V100"/><text x="146" y="78">Ventosa</text>
      <path class="pe" d="M194 118V140"/><text x="194" y="152">Descarga</text>
      <rect class="b" x="236" y="88" width="14" height="10" rx="2"/><text class="s" x="252" y="112">Ancoragem</text>
      <rect class="b" x="284" y="40" width="28" height="32" rx="3"/><text x="290" y="32">Reservatório</text>
      <text x="110" y="62">Adutora (perfil do terreno)</text>` },

  { id: 'sis-ramais', name: 'Ramais prediais', color: '#14a3a3',
    desc: 'O ramal predial liga a rede pública ao imóvel. Na entrada de água ficam o ramal, o cavalete com o hidrômetro e o alimentador predial, que vai até o reservatório. Na saída, o ramal de esgoto leva os efluentes do imóvel até a rede coletora pública.',
    componentes: ['Colar de tomada e ramal em PEAD ou PVC', 'Cavalete com registro, hidrômetro e válvula de retenção', 'Caixa de proteção do hidrômetro', 'Alimentador predial e torneira de boia', 'Ligação de esgoto com caixa de inspeção'],
    cuidados: ['Seguir o padrão de ligação da concessionária local', 'Cavalete acessível para leitura e manutenção', 'Proteção contra refluxo para a rede pública', 'Medição individualizada em condomínios'],
    normas: ['NBR 5626', 'NBR 8160', 'Padrão da concessionária'],
    produtos: ['suportes', 'registros-latao', 'tubos-pvc', 'conexoes-pvc', 'valvulas', 'mat-reservatorios', 'mat-pressurizadores'],
    svg: `<path class="p" d="M10 150H120"/><text x="60" y="166">Rede pública</text>
      <path class="p" d="M90 150V110H150V80H190V110H230V33H256"/>
      <rect class="b dash" x="140" y="56" width="60" height="68" rx="4"/>
      <circle class="b" cx="170" cy="80" r="9"/><text x="170" y="50">Hidrômetro</text><text x="170" y="138">Cavalete</text>
      <rect class="b" x="256" y="18" width="60" height="30" rx="4"/><text x="286" y="37">Reservatório</text>
      <text x="118" y="102">Ramal</text><text class="s" x="238" y="90">Alimentador</text>` },

  { id: 'sis-sanitarias', name: 'Instalações sanitárias', color: '#c48aff',
    desc: 'O sistema predial de esgoto sanitário coleta os efluentes de bacias, pias, ralos e chuveiros e os conduz por gravidade até a rede pública ou o sistema de tratamento local. A ventilação protege os fechos hídricos (sifões), impedindo que gases do esgoto voltem aos ambientes.',
    componentes: ['Ramais de descarga e de esgoto', 'Tubos de queda', 'Caixas sifonadas, ralos e caixas de gordura', 'Ventilação primária e secundária', 'Caixas de inspeção e subcoletores'],
    cuidados: ['Declividade mínima: 2% para diâmetros até 75 mm e 1% a partir de 100 mm', 'Ventilação adequada para não romper o fecho hídrico', 'Separação entre esgoto sanitário e águas pluviais', 'Acesso para inspeção e desobstrução'],
    normas: ['NBR 8160', 'NBR 10844', 'NBR 17076'],
    produtos: ['tubos-pvc', 'conexoes-pvc', 'vedantes', 'suportes', 'mat-ralos', 'mat-smu'],
    svg: `<path class="p thin" d="M200 14V2"/><text class="s" x="208" y="12">Ventilação</text>
      <path class="pe" d="M200 14V140H270M294 140H310M120 56L200 64M120 106L200 114"/>
      <rect class="b" x="96" y="46" width="24" height="18" rx="6"/><rect class="b" x="96" y="96" width="24" height="18" rx="6"/>
      <text x="108" y="80">Bacia</text><text x="160" y="50">Ramal de esgoto</text>
      <rect class="b" x="270" y="130" width="24" height="20" rx="3"/><text class="e" x="316" y="164">Caixa de inspeção</text>
      <text class="s" x="208" y="88">Tubo de queda</text>` },

  { id: 'sis-pluviais', name: 'Águas pluviais e aproveitamento de chuva', color: '#4aa3df',
    desc: 'Calhas e condutores verticais e horizontais levam a água da chuva das coberturas até a rede pública de drenagem ou até um reservatório. No aproveitamento, a água passa por um filtro e pelo descarte da primeira chuva e é guardada em cisterna, para usos não potáveis como descargas, rega e lavagem de pisos.',
    componentes: ['Calhas e rufos', 'Condutores verticais e horizontais, em geral de PVC', 'Ralos e grelhas com proteção contra folhas', 'Filtro e dispositivo de descarte da primeira chuva', 'Cisterna, bomba e reservatório superior exclusivo para a água de reúso', 'Extravasor e caixas de inspeção'],
    cuidados: ['Calhas e condutores dimensionados pela intensidade de chuva do local', 'Águas pluviais nunca ligadas à rede de esgoto', 'Rede de água de chuva separada e identificada, sem ligação com a rede potável', 'Torneiras de uso restrito, com aviso de água não potável', 'Limpeza periódica de calhas, filtros e cisterna'],
    normas: ['NBR 10844', 'NBR 15527', 'NBR 5626'],
    produtos: ['tubos-pvc', 'conexoes-pvc', 'filtros', 'bombas', 'suportes', 'mat-ralos', 'mat-reservatorios'],
    svg: `<g class="drip"><circle cx="40" cy="10" r="2"/><circle cx="70" cy="6" r="2"/><circle cx="100" cy="12" r="2"/><circle cx="125" cy="8" r="2"/></g>
      <path class="b" d="M20 60L80 24L140 60Z"/><rect class="b" x="30" y="60" width="100" height="68"/>
      <path class="b dash" d="M8 128H312"/>
      <path class="p" d="M140 60H152V128H176M202 128H222"/><text x="152" y="52">Calha</text><text class="s" x="158" y="96">Condutor</text>
      <rect class="b" x="176" y="118" width="26" height="20" rx="3"/><text x="189" y="112">Filtro</text>
      <path class="pe" d="M189 138V156"/><text x="160" y="166">Descarte</text>
      <rect class="b" x="222" y="120" width="56" height="36" rx="3"/><text x="250" y="142">Cisterna</text>
      <circle class="b" cx="294" cy="110" r="8"/>
      <path class="p2" d="M278 130H294V118M294 102V40H260"/>
      <rect class="b" x="226" y="26" width="34" height="24" rx="3"/><text x="243" y="18">Reúso</text>` },
];

// Fotos de instalações reais (Wikimedia Commons, licenças livres; manter os créditos).
const SYSTEM_PHOTOS = {
  'sis-pluviais': [
    { src: 'img/sistemas/sis-pluviais-1.webp', alt: 'Condutores verticais de águas pluviais', legenda: 'Condutores', autor: 'Stilfehler', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Downspouts.jpg' },
    { src: 'img/sistemas/sis-pluviais-2.webp', alt: 'Fachada com condutor de água de chuva descendo da calha', legenda: 'Calha e condutor', autor: 'Ivangiesen', licenca: 'CC0', licUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', fonte: 'https://commons.wikimedia.org/wiki/File:External_Gutter.jpg' },
    { src: 'img/sistemas/sis-pluviais-3.webp', alt: 'Reservatórios de aproveitamento de água de chuva', legenda: 'Reservatórios de chuva', autor: 'Meg Stewart', licenca: 'CC BY-SA 2.0', licUrl: 'https://creativecommons.org/licenses/by-sa/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Rooftop_rainwater_harvesting.jpg' },
  ],
  'sis-oleohidraulica': [
    { src: 'img/sistemas/sis-oleohidraulica-1.webp', alt: 'Unidade hidráulica com cilindros de direção', legenda: 'Unidade hidráulica', autor: 'Spielvogel', licenca: 'CC0', licUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', fonte: 'https://commons.wikimedia.org/wiki/File:Hydraulic_power_unit._Hydraulisches_Lenkaggregat._Spielvogel.jpg' },
    { src: 'img/sistemas/sis-oleohidraulica-2.webp', alt: 'Conexões prensadas para mangueiras hidráulicas', legenda: 'Conexões de mangueira', autor: 'Jstapko', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Hydraulic_hose_fittings.JPG' },
    { src: 'img/sistemas/sis-oleohidraulica-3.webp', alt: 'Cilindro hidráulico de uma prensa dobradeira', legenda: 'Cilindro de prensa', autor: 'Márton Kiss-Albert', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Hydraulic_press_brake%27s_cylinder.jpg' },
  ],
  'sis-gases-medicinais': [
    { src: 'img/sistemas/sis-gases-medicinais-1.webp', alt: 'Tanque de oxigênio líquido medicinal em hospital', legenda: 'Central de oxigênio', autor: 'Tim Sheerman-Chase', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Liquid_Medical_Oxygen_Storage_Tank.jpg' },
    { src: 'img/sistemas/sis-gases-medicinais-2.webp', alt: 'Tanque e vaporizadores de oxigênio de hospital', legenda: 'Vaporizadores', autor: 'Jidanni', licenca: 'CC0', licUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', fonte: 'https://commons.wikimedia.org/wiki/File:Frozen_hospital_oxygen_pipes_01.jpg' },
    { src: 'img/sistemas/sis-gases-medicinais-3.webp', alt: 'Caminhão abastecendo o tanque de oxigênio líquido de um hospital', legenda: 'Abastecimento', autor: 'Walter Baxter', licenca: 'CC BY-SA 2.0', licUrl: 'https://creativecommons.org/licenses/by-sa/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:A_liquid_oxygen_delivery_at_the_Borders_General_Hospital_-_geograph.org.uk_-_868864.jpg' },
  ],
  'sis-solar': [
    { src: 'img/sistemas/sis-solar-1.webp', alt: 'Aquecedor solar de tubos a vácuo com reservatório na cobertura', legenda: 'Aquecedor compacto', autor: 'రవిచంద్ర', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Solar_water_heater_installed_on_rooftop.jpg' },
    { src: 'img/sistemas/sis-solar-2.webp', alt: 'Bateria de coletores de tubos a vácuo em cobertura', legenda: 'Coletores a vácuo', autor: 'Greensolarvacuum', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Solar_vacuum_tube_collectors_Thessaloniki.jpg' },
    { src: 'img/sistemas/sis-solar-3.webp', alt: 'Ligações hidráulicas de um coletor solar no telhado', legenda: 'Ligações do coletor', autor: 'Barelyhere', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Thermal_Solar_Panel_fittings.JPG' },
  ],
  'sis-processos-sanitarios': [
    { src: 'img/sistemas/sis-processos-sanitarios-1.webp', alt: 'Tubulações de aço inoxidável em indústria de bebidas', legenda: 'Tubulação inox', autor: 'Matteo Bagnoli', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Pipelines3.jpg' },
    { src: 'img/sistemas/sis-processos-sanitarios-2.webp', alt: 'Tanques de fermentação em inox numa cervejaria', legenda: 'Tanques de processo', autor: 'Stephen Craven', licenca: 'CC BY-SA 2.0', licUrl: 'https://creativecommons.org/licenses/by-sa/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Leeds_Brewery-_new_fermentation_tanks_(geograph_5621751).jpg' },
    { src: 'img/sistemas/sis-processos-sanitarios-3.webp', alt: 'Linha de envase com tubulação inox numa cervejaria', legenda: 'Linha de envase', autor: 'Jan Polák', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Humpolec,_pivovar_Bernard_(53).jpg' },
  ],
  'sis-gases-industriais': [
    { src: 'img/sistemas/sis-gases-industriais-1.webp', alt: 'Tanque de nitrogênio líquido com vaporizador', legenda: 'Tanque criogênico', autor: 'Toby Hudson', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Liquid_Nitrogen_Tank.JPG' },
    { src: 'img/sistemas/sis-gases-industriais-2.webp', alt: 'Cilindros de gases para soldagem', legenda: 'Cilindros', autor: 'Cjp24', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Gas_cylinders_used_in_arc_welding.jpg' },
    { src: 'img/sistemas/sis-gases-industriais-3.webp', alt: 'Bomba de vácuo de laboratório', legenda: 'Bomba de vácuo', autor: 'Cirosantilli2', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:KNF_Laboport_series_laboratory_vacuum_pump.jpg' },
  ],
  'sis-adutoras': [
    { src: 'img/materiais/mat-ferro-1.webp', alt: 'Montagem de tubo de ferro fundido dúctil em vala', legenda: 'Assentamento de adutora', autor: 'Frankemann', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Ductile_cast_iron_pipes.JPG' },
    { src: 'img/produtos/valvulas-3.webp', alt: 'Válvulas gaveta instaladas em rede de água', legenda: 'Válvulas de bloqueio', autor: 'Cmineraolesana', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Cmo_subministrament.png' },
    { src: 'img/sistemas/sis-combustiveis-2.webp', alt: 'Feixe de dutos de transporte atravessando o campo', legenda: 'Linhas de transporte', autor: 'Kevin Trahar', licenca: 'CC BY-SA 2.0', licUrl: 'https://creativecommons.org/licenses/by-sa/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:BP_oil_pipes_-_geograph.org.uk_-_461650.jpg' },
  ],
  'sis-agua': [
    { src: 'img/sistemas/sis-agua-1.webp', alt: 'Tubulação de cobre de água quente instalada na parede', legenda: 'Rede de cobre', autor: 'Tony Webster', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Water_Pipes_-_Water_Heater.jpg' },
    { src: 'img/sistemas/sis-agua-2.webp', alt: 'Aquecedor de água de acumulação com as ligações de entrada e saída', legenda: 'Aquecedor de acumulação', autor: 'Infrogmation of New Orleans', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Rheem_home_gas_water_heater_tank_-_top_of_tank.jpg' },
    { src: 'img/sistemas/sis-agua-3.webp', alt: 'Ligações de água fria e quente na base de um aquecedor', legenda: 'Ligações do aquecedor', autor: 'Almanta', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Heater_water_pipes_in_ground.jpg' },
  ],
  'sis-gas': [
    { src: 'img/sistemas/sis-gas-1.webp', alt: 'Medidor de gás com regulador e tubulação na parede externa', legenda: 'Medidor com regulador', autor: 'RadRafe', licenca: 'Public domain', licUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing#Public_domain', fonte: 'https://commons.wikimedia.org/wiki/File:Gas_meter.JPG' },
    { src: 'img/sistemas/sis-gas-2.webp', alt: 'Conjunto de medidores de gás de um edifício residencial', legenda: 'Bateria de medidores', autor: 'Downtowngal', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Individual_gas_meters.jpg' },
    { src: 'img/sistemas/sis-gas-3.webp', alt: 'Regulador de pressão e medidor de gás instalados na fachada', legenda: 'Entrada de gás', autor: 'HomeSpot HQ', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Gas_Meter_(8845661187).jpg' },
  ],
  'sis-incendio': [
    { src: 'img/sistemas/sis-incendio-1.webp', alt: 'Casa de bombas de incêndio com tubulação vermelha', legenda: 'Casa de bombas', autor: 'Kgbo', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Fire_Pump_Room,_Brisbane,_2021.jpg' },
    { src: 'img/sistemas/sis-incendio-2.webp', alt: 'Conjunto de válvulas de governo e alarme de sprinklers', legenda: 'Válvulas de governo', autor: 'Kgbo', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Automatic_Fire_Sprinkler_Systems,_Brisbane,_2021.jpg' },
    { src: 'img/sistemas/sis-incendio-3.webp', alt: 'Sprinkler instalado em tubulação vermelha de incêndio', legenda: 'Sprinkler na rede', autor: 'Joe5088', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Old_Fire_Sprinkler.jpg' },
  ],
  'sis-vapor': [
    { src: 'img/sistemas/sis-vapor-1.webp', alt: 'Caldeiras industriais com tubulações de vapor e gás', legenda: 'Casa de caldeiras', autor: 'Governo da Região de Tula', licenca: 'CC BY 4.0', licUrl: 'https://creativecommons.org/licenses/by/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Boiler_room_in_Tula_Oblast.jpg' },
    { src: 'img/sistemas/sis-vapor-2.webp', alt: 'Foto histórica de sala de caldeiras com tubulações de vapor', legenda: 'Usina a vapor', autor: 'Seattle Municipal Archives from Seattle, WA', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Steam_plant_boiler_room,_1920_(25119396080).jpg' },
    { src: 'img/sistemas/sis-vapor-3.webp', alt: 'Frente de caldeira com portas da fornalha e tubulações', legenda: 'Fornalha da caldeira', autor: 'Kolforn', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:-2009-09-12_Boiler_room,_Lydia_Eva_Steam_Drifter,_South_Quay,_Great_Yarmouth.JPG' },
  ],
  'sis-ar': [
    { src: 'img/sistemas/sis-ar-1.webp', alt: 'Compressor de ar instalado em sala de máquinas', legenda: 'Sala de compressores', autor: 'Павел', licenca: 'CC0', licUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', fonte: 'https://commons.wikimedia.org/wiki/File:EP2K-073_power_room_-_air_compressor.jpg' },
    { src: 'img/sistemas/sis-ar-2.webp', alt: 'Compressores de ar de parafuso instalados lado a lado', legenda: 'Compressores de parafuso', autor: 'Elanggroup', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Elang_Compressors_Display.jpg' },
    { src: 'img/sistemas/sis-ar-3.webp', alt: 'Unidade compressora de ar de alta pressão com filtros', legenda: 'Unidade compressora', autor: 'Peter Southwood', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Small_stationary_Bauer_HP_compressor_installation_DSC09403.JPG' },
  ],
  'sis-irrigacao': [
    { src: 'img/sistemas/sis-irrigacao-1.webp', alt: 'Torre de pivô central de irrigação em campo preparado', legenda: 'Pivô central', autor: 'Killarnee', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Center-pivot_irrigation_system_-_2.jpg' },
    { src: 'img/sistemas/sis-irrigacao-2.webp', alt: 'Emissor de baixa pressão irrigando plantas junto ao solo', legenda: 'Emissor de baixa pressão', autor: 'Nelsonirrigation', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Center_Pivot_LEPA_Irrigation_Bubbler.jpg' },
    { src: 'img/sistemas/sis-irrigacao-3.webp', alt: 'Pivô central irrigando uma lavoura', legenda: 'Pivô em operação', autor: 'Ingeniero hidr.', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Grain_field_pivot_irrigation_2181.jpg' },
  ],
  'sis-saneamento': [
    { src: 'img/sistemas/sis-saneamento-1.webp', alt: 'Tubo corrugado de esgoto sendo assentado em vala', legenda: 'Assentamento de coletor', autor: 'Tomascastelazo', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Hdpe_pipe_installation.jpg' },
    { src: 'img/sistemas/sis-saneamento-2.webp', alt: 'Tubos de grande diâmetro de drenagem pluvial em obra', legenda: 'Galeria de drenagem', autor: 'Tomas Castelazo', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:114_inch_pipe_installation.jpg' },
    { src: 'img/sistemas/sis-saneamento-3.webp', alt: 'Caixa coletora de águas pluviais em instalação', legenda: 'Boca de lobo', autor: 'Anonimski', licenca: 'CC0', licUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', fonte: 'https://commons.wikimedia.org/wiki/File:Storm_drain_pipe_(crop).JPG' },
  ],
  'sis-refrigeracao': [
    { src: 'img/sistemas/sis-refrigeracao-1.webp', alt: 'Tubulações de grande diâmetro em central de energia e água gelada', legenda: 'Central de água gelada', autor: 'Steve Jurvetson from Los Altos, USA', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Big_Pipes_at_Stanford%27s_New_Central_Energy_Facility_(37851013542).jpg' },
    { src: 'img/sistemas/sis-refrigeracao-2.webp', alt: 'Técnicos montando tubulação de refrigeração', legenda: 'Montagem da tubulação', autor: 'PEO ACWA', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:Pueblo_Chemical_Agent-Destruction_Pilot_Plant_Utility_Building_(5981860376).jpg' },
    { src: 'img/sistemas/sis-refrigeracao-3.webp', alt: 'Unidades condensadoras com linhas frigoríficas', legenda: 'Condensadoras', autor: 'Achim Hering', licenca: 'CC BY 3.0', licUrl: 'https://creativecommons.org/licenses/by/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Air_conditioner_armaflex_insulation.jpg' },
  ],
  'sis-combustiveis': [
    { src: 'img/sistemas/sis-combustiveis-1.webp', alt: 'Tanques de armazenamento de combustível com tubulações', legenda: 'Parque de tanques', autor: 'Carl Young', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Refinery_Tanks_1.jpg' },
    { src: 'img/sistemas/sis-combustiveis-2.webp', alt: 'Feixe de oleodutos atravessando o campo', legenda: 'Faixa de dutos', autor: 'Kevin Trahar', licenca: 'CC BY-SA 2.0', licUrl: 'https://creativecommons.org/licenses/by-sa/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:BP_oil_pipes_-_geograph.org.uk_-_461650.jpg' },
    { src: 'img/sistemas/sis-combustiveis-3.webp', alt: 'Tanques de combustível com escada de acesso e tubulação', legenda: 'Tanques e escadas', autor: 'Carl Young', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Refinery_Tanks_4.jpg' },
  ],
  'sis-industrial': [
    { src: 'img/sistemas/sis-industrial-1.webp', alt: 'Interior de estação de bombeamento com grandes tubulações', legenda: 'Estação de bombeamento', autor: 'Runner1928', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Chicago_Water_Tower_pumping_station_(water_works)_interior.jpg' },
    { src: 'img/sistemas/sis-industrial-2.webp', alt: 'Tubulações flangeadas de um sistema de bombeamento de drenagem', legenda: 'Linha de recalque', autor: 'MTA New York City Transit', licenca: 'CC BY 2.0', licUrl: 'https://creativecommons.org/licenses/by/2.0', fonte: 'https://commons.wikimedia.org/wiki/File:05._Pipe_Car_of_Pump_Train_(8149552600).jpg' },
    { src: 'img/sistemas/sis-industrial-3.webp', alt: 'Barrilete com bombas e válvulas em estufa agrícola', legenda: 'Barrilete de bombas', autor: 'sgood2001', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Georgia,_Abkhasia,_Gulripshi_-_%D0%A2%D0%B5%D0%BF%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B9_%D0%BA%D0%BE%D0%BC%D0%BF%D0%BB%D0%B5%D0%BA%D1%81_%D0%B2_%D0%94%D1%80%D0%B0%D0%BD%D0%B4%D0%B0%D1%85_WMID5885099.jpg' },
  ],
  'sis-ramais': [
    { src: 'img/sistemas/sis-ramais-1.webp', alt: 'Hidrômetros individuais instalados em parede', legenda: 'Hidrômetros individuais', autor: 'Nizil Shah', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Water_meters_in_india.jpg' },
    { src: 'img/sistemas/sis-ramais-2.webp', alt: 'Hidrômetro com registros dentro da caixa de proteção', legenda: 'Caixa do hidrômetro', autor: 'TeWeBs', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:Madeira_Water_Meter_3D.JPG' },
    { src: 'img/sistemas/sis-ramais-3.webp', alt: 'Escavação para instalação de caixa de hidrômetro na calçada', legenda: 'Ligação na calçada', autor: 'Thomas Booker (CoderThomasB)', licenca: 'CC0', licUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en', fonte: 'https://commons.wikimedia.org/wiki/File:Uncovered_meter_box_in_Avonhead,_Christchurch_2022-10-27.jpg' },
  ],
  'sis-sanitarias': [
    { src: 'img/sistemas/sis-sanitarias-1.webp', alt: 'Tubulação de esgoto de ferro fundido com ventilação', legenda: 'Tubo de queda', autor: 'Achim Hering', licenca: 'CC BY 3.0', licUrl: 'https://creativecommons.org/licenses/by/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Cast_fe_and_cu_dwv_piping.jpg' },
    { src: 'img/sistemas/sis-sanitarias-2.webp', alt: 'Sifão e ligação de esgoto sob um lavatório', legenda: 'Sifão do lavatório', autor: 'HODmsl SVUR', licenca: 'CC BY-SA 4.0', licUrl: 'https://creativecommons.org/licenses/by-sa/4.0', fonte: 'https://commons.wikimedia.org/wiki/File:HK_public_toilet_bathing_hand_sink_drain_pipes_December_2019_SS2_03.jpg' },
    { src: 'img/sistemas/sis-sanitarias-3.webp', alt: 'Tubos de esgoto de ferro fundido com juntas de chumbo', legenda: 'Tubos de ferro fundido', autor: 'UuMUfQ', licenca: 'CC BY-SA 3.0', licUrl: 'https://creativecommons.org/licenses/by-sa/3.0', fonte: 'https://commons.wikimedia.org/wiki/File:Gusseisen_Abwasserrohre_Bleidichtung_Rohrverstopfung.png' },
  ],
};
