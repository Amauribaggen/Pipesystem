// ===== Glossário técnico: termos, páginas próprias (/glossario/...) e termos sublinhados nas fichas e guias =====
// Revisado pela Equipe Técnica PipeSystem. Os valores citados seguem as normas indicadas.
// GLOSSARIO: lista de termos (t, en, tema, def, exp, f, norma, links, ver, id, auto). Também lido pelo gerador de páginas (Node).
const GLOSSARIO = (() => {
  const SITE = '';   // links relativos ao próprio site
  const M = s => [SITE + '/materiais/' + s];
  const S = s => [SITE + '/sistemas/' + s];
  const L = {   // links do portal usados nos termos
    calc: ['Dimensionamento', SITE + '/dimensionamento'], esgCalc: ['Calculadora de esgoto (UHC)', SITE + '/dimensionamento'],
    golpe: ['Calculadora de golpe de aríete', SITE + '/dimensionamento'], bomba: ['Calculadora de bombas e NPSH', SITE + '/dimensionamento'],
    eq: ['Calculadora de comprimentos equivalentes', SITE + '/dimensionamento'], calha: ['Calculadora de calhas', SITE + '/dimensionamento'],
    gasCalc: ['Calculadora de gás', SITE + '/dimensionamento'], guias: ['Guias práticos', SITE + '/guias-praticos'], bim: ['BIM/CAD', SITE + '/bim-cad'],
    normas: ['Normas', SITE + '/normas'],
  };
  const TEMAS = ['Hidráulica', 'Água fria e quente', 'Esgoto e pluvial', 'Gás', 'Incêndio', 'Materiais e juntas', 'Bombas', 'Projeto e obra'];

  // t: termo · en: inglês · tema · def: definição curta (resposta direta) · exp: explicação · f: fórmula [expressão, legenda]
  // norma · links: [rótulo, url] · ver: termos relacionados (slugs)
  const TERMS = [
    // ----- Hidráulica -----
    { t: 'Perda de carga', en: 'head loss', tema: 'Hidráulica', def: 'Energia que a água perde pelo atrito com o tubo e ao passar por conexões e registros, medida em metros de coluna d\'água (mca) ou kPa.',
      exp: 'Divide-se em distribuída (ao longo do tubo reto) e localizada (em curvas, tês, registros). É o que faz a pressão no chuveiro ser menor que a pressão estática. Cresce muito com a velocidade: dobrar a vazão no mesmo tubo quase quadruplica a perda.',
      f: ['J = 10,65 · Q¹·⁸⁵ / (C¹·⁸⁵ · D⁴·⁸⁷)', 'Hazen-Williams: J em m/m, Q em m³/s, D em m, C conforme o material'], norma: 'NBR 5626', links: [L.eq, L.calc], ver: ['comprimento-equivalente', 'hazen-williams', 'pressao-dinamica'] },
    { t: 'Comprimento equivalente', en: 'equivalent length', tema: 'Hidráulica', def: 'Comprimento de tubo reto que causaria a mesma perda de carga que uma conexão ou registro.',
      exp: 'Permite somar curvas, tês e registros ao comprimento real e calcular a perda total com uma só fórmula. Os valores dependem do material e do diâmetro e vêm de tabelas.', norma: 'NBR 5626', links: [L.eq], ver: ['perda-de-carga'] },
    { t: 'Hazen-Williams', en: 'Hazen-Williams equation', tema: 'Hidráulica', def: 'Fórmula empírica muito usada para calcular a perda de carga de água em tubulações.',
      exp: 'Usa o coeficiente C, que representa a rugosidade do tubo: tubos plásticos lisos ficam em torno de 140 a 150; tubos metálicos antigos e incrustados têm C bem menor. Vale para água à temperatura ambiente; para outros fluidos usa-se Darcy-Weisbach.', f: ['J = 10,65 · Q¹·⁸⁵ / (C¹·⁸⁵ · D⁴·⁸⁷)', 'J: perda unitária (m/m)'], links: [L.calc], ver: ['perda-de-carga', 'darcy-weisbach'] },
    { t: 'Darcy-Weisbach', en: 'Darcy-Weisbach equation', tema: 'Hidráulica', def: 'Fórmula universal da perda de carga, válida para qualquer fluido e regime de escoamento.',
      exp: 'Usa o fator de atrito f, que depende do número de Reynolds e da rugosidade relativa do tubo (diagrama de Moody ou equação de Colebrook).', f: ['h = f · (L / D) · V² / 2g', 'h: perda (m) · L: comprimento · D: diâmetro · V: velocidade · g: 9,81 m/s²'], ver: ['numero-de-reynolds', 'hazen-williams'] },
    { t: 'Número de Reynolds', en: 'Reynolds number', tema: 'Hidráulica', def: 'Número que indica se o escoamento é laminar (ordenado) ou turbulento.',
      exp: 'Abaixo de cerca de 2.000 o escoamento é laminar; acima de cerca de 4.000, turbulento. Nas instalações prediais de água, o escoamento é quase sempre turbulento.', f: ['Re = V · D / ν', 'ν: viscosidade cinemática (água a 20 °C ≈ 1,0 × 10⁻⁶ m²/s)'], ver: ['darcy-weisbach'] },
    { t: 'Pressão estática', en: 'static pressure', tema: 'Hidráulica', def: 'Pressão num ponto com a água parada, igual ao desnível entre esse ponto e o nível da água no reservatório.',
      exp: 'Cada 10 m de desnível dão cerca de 100 kPa (1 kgf/cm²). A NBR 5626 limita a pressão estática nos pontos de utilização a 400 kPa (40 mca); acima disso, usa-se válvula redutora de pressão.', norma: 'NBR 5626', links: [M('redutora').concat()].map(u => ['Válvulas redutoras', u[0]]), ver: ['pressao-dinamica', 'mca', 'valvula-redutora'] },
    { t: 'Pressão dinâmica', en: 'residual (flowing) pressure', tema: 'Hidráulica', def: 'Pressão num ponto com a água escoando: a pressão estática menos as perdas de carga até ali.',
      exp: 'É ela que define se o chuveiro e a válvula de descarga funcionam bem. Cada aparelho tem uma pressão dinâmica mínima, informada pela norma e pelo fabricante.', norma: 'NBR 5626', links: [L.calc], ver: ['pressao-estatica', 'perda-de-carga'] },
    { t: 'Metro de coluna d\'água (mca)', slug: 'mca', en: 'meter of water column (mH₂O)', tema: 'Hidráulica', def: 'Unidade de pressão igual à exercida por uma coluna de água de 1 metro de altura.',
      exp: 'Prática porque a pressão predial vem da altura da caixa d\'água. Conversões: 1 mca ≈ 9,81 kPa ≈ 0,1 kgf/cm² ≈ 0,1 bar ≈ 1,42 psi.', ver: ['pressao-estatica'] },
    { t: 'Velocidade de escoamento', en: 'flow velocity', tema: 'Hidráulica', def: 'Velocidade média da água dentro do tubo, igual à vazão dividida pela área interna.',
      exp: 'Velocidade alta causa ruído, desgaste e golpe de aríete. Na instalação predial de água fria, a referência usual é não passar de 3 m/s.', f: ['V = Q / A', 'Q em m³/s · A: área interna em m²'], norma: 'NBR 5626', ver: ['vazao', 'golpe-de-ariete'] },
    { t: 'Vazão', en: 'flow rate', tema: 'Hidráulica', def: 'Volume de fluido que passa por uma seção em um intervalo de tempo, em L/s ou m³/h.',
      exp: 'Na água fria predial, a vazão de projeto considera que nem todos os aparelhos funcionam ao mesmo tempo (método dos pesos).', f: ['Q = 0,3 · √ΣP', 'Método dos pesos: Q em L/s · P: peso de cada aparelho'], norma: 'NBR 5626', links: [L.calc], ver: ['velocidade-de-escoamento', 'simultaneidade'] },
    { t: 'Simultaneidade', en: 'diversity / simultaneity', tema: 'Hidráulica', def: 'Consideração de que, numa instalação, só parte dos aparelhos é usada ao mesmo tempo.',
      exp: 'Evita superdimensionar tubos e equipamentos. Na água fria aparece no método dos pesos; no gás, no fator de simultaneidade aplicado à potência instalada; no esgoto, nas Unidades Hunter de Contribuição.', links: [L.calc], ver: ['vazao', 'uhc', 'fator-de-simultaneidade'] },
    { t: 'Golpe de aríete', en: 'water hammer', tema: 'Hidráulica', def: 'Sobrepressão súbita causada pela parada brusca da água, como no fechamento rápido de uma válvula ou no desligamento de uma bomba.',
      exp: 'Produz a "pancada" na tubulação e pode romper tubos, conexões e equipamentos. Reduz-se com fechamento lento, velocidades menores, válvulas de retenção adequadas, amortecedores e ventosas.', f: ['ΔH = a · ΔV / g', 'Joukowsky: a = celeridade (m/s) · ΔV: variação de velocidade · g = 9,81 m/s²'], links: [L.golpe], ver: ['celeridade', 'velocidade-de-escoamento', 'ventosa'] },
    { t: 'Celeridade', en: 'wave speed (celerity)', tema: 'Hidráulica', def: 'Velocidade com que a onda de pressão do golpe de aríete percorre a tubulação.',
      exp: 'Depende do fluido e da rigidez do tubo: em aço, passa de 1.000 m/s; em PVC e PEAD é bem menor, por isso o golpe nesses materiais é mais brando.', links: [L.golpe], ver: ['golpe-de-ariete'] },
    { t: 'Cavitação', en: 'cavitation', tema: 'Hidráulica', def: 'Formação e colapso de bolhas de vapor quando a pressão do líquido cai abaixo da pressão de vapor.',
      exp: 'Acontece na sucção de bombas mal dimensionadas e em válvulas muito estranguladas. O colapso das bolhas arranca material do rotor, faz ruído de "pedras" e derruba o rendimento.', links: [L.bomba], ver: ['npsh'] },

    // ----- Água fria e quente -----
    { t: 'Barrilete', en: 'distribution header', tema: 'Água fria e quente', def: 'Tubulação que sai do reservatório superior e distribui a água para as colunas do prédio.',
      exp: 'Pode ser concentrado (todos os registros juntos, facilita a manutenção) ou ramificado. Fica normalmente sob o reservatório, no ático ou na cobertura.', links: [S('agua')].map(u => ['Sistema de água quente e fria', u[0]]), ver: ['coluna-de-distribuicao', 'ramal'] },
    { t: 'Coluna de distribuição', en: 'riser', tema: 'Água fria e quente', def: 'Tubulação vertical que leva a água do barrilete aos ramais de cada andar.',
      exp: 'Recebe um registro no topo para manutenção. Também chamada de prumada.', ver: ['barrilete', 'ramal'] },
    { t: 'Ramal e sub-ramal', slug: 'ramal', en: 'branch / fixture branch', tema: 'Água fria e quente', def: 'Ramal é a tubulação que sai da coluna e alimenta um ambiente; sub-ramal liga o ramal a cada aparelho.',
      exp: 'O registro de gaveta do banheiro fica no início do ramal; o sub-ramal termina no ponto de espera onde será instalado o aparelho.', ver: ['coluna-de-distribuicao', 'ponto-de-espera'] },
    { t: 'Extravasor', en: 'overflow pipe', tema: 'Água fria e quente', def: 'Tubo do reservatório que escoa o excesso de água quando a boia falha, impedindo o transbordamento.',
      exp: 'Deve descarregar em local visível, para avisar que há defeito na boia, e ter proteção contra insetos.', links: [M('reservatorios')].map(u => ["Caixas d'água", u[0]]), ver: ['torneira-de-boia'] },
    { t: 'Torneira de boia', en: 'float valve', tema: 'Água fria e quente', def: 'Válvula que abre e fecha a entrada de água do reservatório conforme o nível, comandada por uma boia.',
      exp: 'Quando falha aberta, a água sai pelo extravasor. Instale um registro antes dela para a manutenção.', ver: ['extravasor'] },
    { t: 'Válvula redutora de pressão', slug: 'valvula-redutora', en: 'pressure-reducing valve (PRV)', tema: 'Água fria e quente', def: 'Válvula que mantém a pressão a jusante num valor ajustado, mesmo com pressão maior a montante.',
      exp: 'Usada em prédios altos para respeitar o limite de pressão estática e em ramais de aparelhos sensíveis. Deve ter filtro antes e registros para manutenção.', norma: 'NBR 5626', links: [M('redutora')].map(u => ['Válvulas redutoras', u[0]]), ver: ['pressao-estatica'] },
    { t: 'Ventosa', en: 'air valve', tema: 'Água fria e quente', def: 'Válvula que expulsa o ar acumulado nos pontos altos da tubulação e admite ar quando a linha esvazia.',
      exp: 'Evita bolsões de ar que reduzem a vazão e protege contra o vácuo e o golpe de aríete em adutoras e recalques.', links: [M('ventosas')].map(u => ['Ventosas', u[0]]), ver: ['golpe-de-ariete'] },
    { t: 'Retrossifonagem', en: 'back-siphonage / backflow', tema: 'Água fria e quente', def: 'Retorno de água possivelmente contaminada para a rede de água potável, causado por subpressão na rede.',
      exp: 'Exemplo: mangueira mergulhada num balde com produto químico quando a rede perde pressão. Evita-se com separação atmosférica, válvulas antirretorno e sem conexões cruzadas.', norma: 'NBR 5626', ver: ['separacao-atmosferica', 'conexao-cruzada'] },
    { t: 'Separação atmosférica', en: 'air gap', tema: 'Água fria e quente', def: 'Distância vertical livre entre a saída de água e o nível máximo do recipiente que ela abastece.',
      exp: 'É a proteção mais segura contra a retrossifonagem: como não há contato entre a saída e a água do recipiente, ela não tem como voltar.', norma: 'NBR 5626', ver: ['retrossifonagem'] },
    { t: 'Conexão cruzada', en: 'cross-connection', tema: 'Água fria e quente', def: 'Ligação física entre a rede de água potável e uma rede de água não potável (reúso, chuva, poço).',
      exp: 'É proibida, porque pode contaminar a água potável. As redes de água não potável devem ser identificadas e independentes.', norma: 'NBR 5626 · NBR 15575-6', ver: ['retrossifonagem'] },
    { t: 'Dilatação térmica', en: 'thermal expansion', tema: 'Água fria e quente', def: 'Aumento de comprimento do tubo com a temperatura, importante nas redes de água quente.',
      exp: 'Os plásticos dilatam bem mais que os metais. Em trechos longos de água quente usam-se liras ou braços de dilatação e suportes fixos e deslizantes nas posições certas.', f: ['ΔL = α · L · ΔT', 'α: coeficiente de dilatação do material · L: comprimento · ΔT: variação de temperatura'], links: [M('ppr')].map(u => ['PPR', u[0]]), ver: ['lira-de-dilatacao'] },
    { t: 'Lira de dilatação', en: 'expansion loop', tema: 'Água fria e quente', def: 'Desvio em forma de U na tubulação que absorve a dilatação térmica sem forçar conexões.',
      exp: 'As dimensões dependem do material, do diâmetro e da variação de temperatura e vêm do manual do fabricante.', ver: ['dilatacao-termica'] },
    { t: 'Recirculação de água quente', en: 'hot water recirculation', tema: 'Água fria e quente', def: 'Circuito com retorno e bomba que mantém a água quente circulando, para ela chegar logo ao ponto de uso.',
      exp: 'Economiza a água desperdiçada até "chegar a quente". Exige isolamento térmico da rede para não perder energia.', links: [M('isolamento')].map(u => ['Isolamento térmico', u[0]]), ver: ['dilatacao-termica'] },

    // ----- Esgoto e pluvial -----
    { t: 'Fecho hídrico', en: 'water seal', tema: 'Esgoto e pluvial', def: 'Camada de água que fica retida no sifão e impede que os gases do esgoto voltem para o ambiente.',
      exp: 'A NBR 8160 exige fecho hídrico de no mínimo 50 mm. Ele se perde por evaporação (ralo pouco usado), por aspiração (falta de ventilação) ou por sifonagem do próprio aparelho. É a principal causa de mau cheiro em banheiros.', norma: 'NBR 8160', links: [M('ralos')].map(u => ['Ralos e caixas sifonadas', u[0]]).concat([['Erros e patologias: mau cheiro', SITE + '/guias-praticos']]), ver: ['sifao', 'caixa-sifonada', 'ventilacao'] },
    { t: 'Sifão', en: 'trap', tema: 'Esgoto e pluvial', def: 'Peça em curva que retém a água do fecho hídrico na saída de pias, lavatórios, tanques e ralos.',
      exp: 'O vaso sanitário tem o sifão incorporado à louça. Sifões sanfonados acumulam resíduos; prefira os rígidos com copo para limpeza.', norma: 'NBR 8160', ver: ['fecho-hidrico'] },
    { t: 'Caixa sifonada', en: 'floor trap with multiple inlets', tema: 'Esgoto e pluvial', def: 'Caixa com fecho hídrico que recebe a água dos ralos e de aparelhos como lavatório e chuveiro e a envia ao ramal de esgoto.',
      exp: 'Diferente do ralo seco, que não tem fecho hídrico e deve ser ligado a uma caixa sifonada.', norma: 'NBR 8160', links: [M('ralos')].map(u => ['Ralos e caixas sifonadas', u[0]]), ver: ['fecho-hidrico', 'ramal-de-esgoto'] },
    { t: 'Ramal de esgoto', en: 'branch drain', tema: 'Esgoto e pluvial', def: 'Tubulação que recebe os efluentes dos ramais de descarga ou da caixa sifonada e os leva ao tubo de queda ou ao subcoletor.',
      exp: 'O ramal de descarga é o trecho que sai diretamente de cada aparelho.', norma: 'NBR 8160', links: [L.esgCalc], ver: ['tubo-de-queda', 'declividade'] },
    { t: 'Tubo de queda', en: 'soil/waste stack', tema: 'Esgoto e pluvial', def: 'Tubulação vertical que recebe o esgoto dos ramais dos andares e o leva até a base do prédio.',
      exp: 'É prolongado acima da cobertura como ventilação primária. Na base, a mudança para horizontal deve ser feita com curvas de raio longo.', norma: 'NBR 8160', links: [L.esgCalc], ver: ['ventilacao', 'zona-de-espuma', 'coletor-predial'] },
    { t: 'Ventilação', en: 'venting', tema: 'Esgoto e pluvial', def: 'Rede de tubos que deixa o ar entrar e sair do esgoto, protegendo os fechos hídricos e levando os gases para fora.',
      exp: 'A ventilação primária é o prolongamento do tubo de queda acima da cobertura; a secundária liga os ramais a uma coluna de ventilação. Sem ela, a descarga de um aparelho aspira o sifão de outro.', norma: 'NBR 8160', ver: ['fecho-hidrico', 'tubo-de-queda'] },
    { t: 'Coletor predial', en: 'building sewer', tema: 'Esgoto e pluvial', def: 'Trecho final do esgoto do imóvel, entre a última caixa de inspeção e a rede pública ou o sistema de tratamento.',
      exp: 'Os subcoletores recebem os tubos de queda e ramais e chegam ao coletor predial.', norma: 'NBR 8160', ver: ['caixa-de-inspecao', 'declividade'] },
    { t: 'Declividade', en: 'slope / fall', tema: 'Esgoto e pluvial', def: 'Inclinação da tubulação horizontal de esgoto, em porcentagem, que garante o escoamento por gravidade.',
      exp: 'A NBR 8160 pede declividade mínima de 2% para tubos até DN 75 e de 1% para DN 100 ou maior. Declividade insuficiente ou "barriga" no tubo é a principal causa de entupimento.', norma: 'NBR 8160', links: [L.esgCalc], ver: ['ramal-de-esgoto'] },
    { t: 'Unidade Hunter de Contribuição (UHC)', slug: 'uhc', en: 'drainage fixture unit (DFU)', tema: 'Esgoto e pluvial', def: 'Número que representa a contribuição de cada aparelho para o esgoto, usado para dimensionar ramais, tubos de queda e coletores.',
      exp: 'Um vaso sanitário vale 6 UHC; um lavatório, 1 UHC. Soma-se as UHC dos aparelhos e consulta-se a tabela de cada trecho.', norma: 'NBR 8160', links: [L.esgCalc], ver: ['simultaneidade', 'tubo-de-queda'] },
    { t: 'Caixa de gordura', en: 'grease trap', tema: 'Esgoto e pluvial', def: 'Caixa que retém a gordura da pia da cozinha antes de ela chegar à rede de esgoto.',
      exp: 'Evita entupimentos no coletor. Precisa de limpeza periódica e não deve receber esgoto de vasos sanitários.', norma: 'NBR 8160', ver: ['caixa-de-inspecao'] },
    { t: 'Caixa de inspeção', en: 'inspection chamber', tema: 'Esgoto e pluvial', def: 'Caixa enterrada que permite inspecionar e desentupir a rede, colocada nas mudanças de direção e a intervalos regulares.',
      exp: 'Deve ter tampa hermética e fácil acesso.', norma: 'NBR 8160', ver: ['coletor-predial'] },
    { t: 'Zona de pressão de espuma', slug: 'zona-de-espuma', en: 'suds pressure zone', tema: 'Esgoto e pluvial', def: 'Trecho na base do tubo de queda e nos primeiros metros do coletor onde a espuma de detergente se acumula sob pressão.',
      exp: 'Ramais ligados nessa região podem ter espuma saindo pelos ralos dos andares baixos. A NBR 8160 orienta a não ligar ramais na zona de espuma e a prever desvio ou ventilação.', norma: 'NBR 8160', ver: ['tubo-de-queda'] },
    { t: 'Calha e condutor', slug: 'calha', en: 'gutter and downpipe', tema: 'Esgoto e pluvial', def: 'Calha recolhe a água do telhado; condutores verticais e horizontais levam a água até o destino final.',
      exp: 'São dimensionados pela área de contribuição e pela intensidade de chuva do local, conforme a NBR 10844.', norma: 'NBR 10844', links: [L.calha], ver: ['intensidade-pluviometrica'] },
    { t: 'Intensidade pluviométrica', en: 'rainfall intensity', tema: 'Esgoto e pluvial', def: 'Quantidade de chuva por unidade de tempo, em mm/h, usada para dimensionar calhas e condutores.',
      exp: 'Depende da cidade e do período de retorno adotado (quantos anos, em média, entre chuvas daquela intensidade).', norma: 'NBR 10844', links: [L.calha], ver: ['calha'] },

    // ----- Gás -----
    { t: 'GN e GLP', slug: 'gn-glp', en: 'natural gas / LPG', tema: 'Gás', def: 'Gás natural (GN), canalizado e mais leve que o ar, e gás liquefeito de petróleo (GLP), em botijão ou cilindro e mais pesado que o ar.',
      exp: 'Por ser mais pesado, o GLP vazado acumula junto ao piso; por isso não se instala GLP em locais abaixo do nível do terreno. Os poderes caloríficos e as pressões de trabalho são diferentes, e as redes são dimensionadas para cada gás.', norma: 'NBR 15526', links: [S('gas')].map(u => ['Sistema de gás', u[0]]).concat([L.gasCalc]), ver: ['regulador-de-pressao', 'fator-de-simultaneidade'] },
    { t: 'Regulador de pressão', en: 'pressure regulator', tema: 'Gás', def: 'Equipamento que reduz e estabiliza a pressão do gás para o valor de uso dos aparelhos.',
      exp: 'Pode haver regulador de primeiro estágio (na central ou no medidor) e de segundo estágio (perto dos aparelhos).', norma: 'NBR 15526', links: [M('reguladores')].map(u => ['Reguladores de pressão', u[0]]), ver: ['gn-glp'] },
    { t: 'Fator de simultaneidade', en: 'diversity factor', tema: 'Gás', def: 'Porcentagem da potência total dos aparelhos a gás que se considera em uso ao mesmo tempo.',
      exp: 'Quanto maior a potência instalada, menor o fator. Aplicado à potência computada, dá a potência adotada para dimensionar a rede.', norma: 'NBR 15526', links: [L.gasCalc], ver: ['simultaneidade'] },

    // ----- Incêndio -----
    { t: 'Chuveiro automático (sprinkler)', slug: 'sprinkler', en: 'fire sprinkler', tema: 'Incêndio', def: 'Bico que se abre sozinho quando a temperatura atinge o valor do seu elemento sensível (ampola ou fusível) e lança água sobre o fogo.',
      exp: 'Só abrem os bicos próximos ao incêndio. A cor da ampola indica a temperatura de acionamento.', norma: 'NBR 10897', links: [M('sprinklers')].map(u => ['Sprinklers', u[0]]).concat([S('incendio')].map(u => ['Rede de incêndio', u[0]])), ver: ['reserva-tecnica'] },
    { t: 'Hidrante e mangotinho', slug: 'hidrante', en: 'hydrant / hose reel', tema: 'Incêndio', def: 'Pontos de tomada de água para combate a incêndio: o hidrante usa mangueira de lona; o mangotinho, mangueira semirrígida de uso mais fácil.',
      exp: 'O tipo, a vazão e a quantidade dependem da ocupação e da área, conforme a NBR 13714 e as instruções do Corpo de Bombeiros.', norma: 'NBR 13714', links: [M('hidrantes')].map(u => ['Hidrantes e abrigos', u[0]]), ver: ['reserva-tecnica'] },
    { t: 'Reserva técnica de incêndio', slug: 'reserva-tecnica', en: 'fire water reserve', tema: 'Incêndio', def: 'Volume de água do reservatório que só pode ser usado no combate a incêndio.',
      exp: 'Garante-se colocando a saída do consumo acima do volume reservado ou com reservatório próprio.', norma: 'NBR 13714', ver: ['hidrante'] },
    { t: 'Bomba jockey', en: 'jockey pump', tema: 'Incêndio', def: 'Bomba pequena que mantém a rede de incêndio pressurizada, compensando pequenas perdas.',
      exp: 'Evita que a bomba principal ligue por qualquer pequena queda de pressão.', ver: ['altura-manometrica'] },

    // ----- Materiais e juntas -----
    { t: 'DN (diâmetro nominal)', slug: 'dn', en: 'nominal diameter', tema: 'Materiais e juntas', def: 'Número que identifica o tamanho de tubos e conexões compatíveis entre si; não é necessariamente um diâmetro real.',
      exp: 'Em plásticos, o DN costuma ser próximo do diâmetro externo (PVC soldável DN 25 tem 25 mm de diâmetro externo). Em aço, o DN se aproxima do interno nos tamanhos pequenos. Sempre confira a tabela do fabricante.', ver: ['de', 'schedule'] },
    { t: 'DE (diâmetro externo)', slug: 'de', en: 'outside diameter (OD)', tema: 'Materiais e juntas', def: 'Medida real da parte de fora do tubo, usada para especificar tubos plásticos como PEAD, PPR e PEX.', ver: ['dn', 'sdr'] },
    { t: 'PN (pressão nominal)', slug: 'pn', en: 'nominal pressure', tema: 'Materiais e juntas', def: 'Pressão máxima de trabalho, em bar, que o tubo suporta continuamente a 20 °C.',
      exp: 'Em temperaturas maiores a pressão admissível cai: um tubo de PPR PN 20 aguenta bem menos de 20 bar com água a 70 °C. Use as tabelas de pressão × temperatura do fabricante.', links: [M('ppr')].map(u => ['PPR', u[0]]), ver: ['sdr'] },
    { t: 'SDR', en: 'standard dimension ratio', tema: 'Materiais e juntas', def: 'Relação entre o diâmetro externo e a espessura da parede do tubo plástico.',
      exp: 'Quanto menor o SDR, mais grossa a parede e maior a pressão admissível. Tubos com o mesmo SDR e material têm a mesma pressão nominal em qualquer diâmetro.', f: ['SDR = DE / e', 'e: espessura da parede'], links: [M('pe')].map(u => ['Polietileno', u[0]]), ver: ['pn', 'de'] },
    { t: 'Schedule (SCH)', slug: 'schedule', en: 'pipe schedule', tema: 'Materiais e juntas', def: 'Classe de espessura de parede de tubos de aço (SCH 10, 40, 80...), conforme a norma ASME B36.10.',
      exp: 'Para o mesmo diâmetro, quanto maior o schedule, mais grossa a parede. SCH 40 e SCH 80 são os mais comuns em instalações.', norma: 'ASME B36.10', links: [M('aco')].map(u => ['Aço-carbono e galvanizado', u[0]]), ver: ['dn'] },
    { t: 'Bolsa e ponta', en: 'socket and spigot', tema: 'Materiais e juntas', def: 'Sistema de encaixe em que a ponta de um tubo entra na bolsa (extremidade alargada) do tubo ou da conexão seguinte.',
      exp: 'A vedação pode ser feita com adesivo (junta soldável) ou com anel de borracha (junta elástica).', ver: ['junta-soldavel', 'junta-elastica'] },
    { t: 'Junta soldável', en: 'solvent-cement joint', tema: 'Materiais e juntas', def: 'União de tubos e conexões de PVC ou CPVC com adesivo que dissolve as superfícies e as funde.',
      exp: 'Exige lixa, solução limpadora, adesivo próprio para o material e tempo de cura antes do teste.', links: [['Guia: junta soldável', SITE + '/guias-praticos'], M('conexoes-pvc').map(u => ['Conexões de PVC', u])[0]], ver: ['bolsa-e-ponta'] },
    { t: 'Junta elástica', en: 'push-fit (rubber ring) joint', tema: 'Materiais e juntas', def: 'União por anel de borracha comprimido entre a ponta e a bolsa, que veda e absorve pequenas dilatações.',
      exp: 'Comum em esgoto e adutoras. Usa pasta lubrificante própria (nunca graxa) e uma pequena folga no fundo da bolsa.', links: [['Guia: junta elástica', SITE + '/guias-praticos']], ver: ['bolsa-e-ponta'] },
    { t: 'Termofusão', en: 'socket fusion', tema: 'Materiais e juntas', def: 'Solda de tubos e conexões de PPR ou PE em que as duas partes são aquecidas num termofusor e encaixadas, formando uma peça única.',
      exp: 'Tempo de aquecimento e profundidade de encaixe seguem a tabela do fabricante para cada diâmetro.', links: [['Guia: termofusão', SITE + '/guias-praticos'], M('ppr').map(u => ['PPR', u])[0]], ver: ['eletrofusao', 'solda-de-topo'] },
    { t: 'Eletrofusão', en: 'electrofusion', tema: 'Materiais e juntas', def: 'Solda de tubos de PE com conexões que têm resistência elétrica embutida; uma máquina aplica a corrente e funde as superfícies.',
      exp: 'Muito usada em redes de gás e água de PEAD, inclusive em reparos, porque não exige mover os tubos.', links: [M('pe')].map(u => ['Polietileno', u[0]]), ver: ['termofusao', 'solda-de-topo'] },
    { t: 'Solda de topo', en: 'butt fusion', tema: 'Materiais e juntas', def: 'Solda de tubos de PE em que as pontas são faceadas, aquecidas numa placa e pressionadas uma contra a outra.',
      exp: 'Usada em diâmetros maiores de PEAD. Exige máquina com controle de pressão e tempo.', ver: ['eletrofusao'] },
    { t: 'Conexão ranhurada', en: 'grooved coupling', tema: 'Materiais e juntas', def: 'União de tubos com ranhura na ponta, por um acoplamento de duas metades com anel de borracha, fechado com parafusos.',
      exp: 'Montagem rápida e sem solda, muito usada em redes de incêndio e utilidades. O acoplamento pode ser rígido ou flexível. Como a ranhura laminada não corta a parede, o sistema aceita tubos de parede fina: NBR 5580 classe leve ou NBR 5590 SCH 10.', links: [M('ranhurado')].map(u => ['Conexões ranhuradas', u[0]]), ver: ['schedule'] },
    { t: 'Rosca BSP e NPT', slug: 'rosca-bsp-npt', en: 'BSP / NPT threads', tema: 'Materiais e juntas', def: 'Os dois padrões de rosca para tubos: BSP (britânico, filete a 55°, usado no Brasil) e NPT (americano, filete a 60°).',
      exp: 'Não são intercambiáveis: parecem encaixar, mas vazam. No Brasil, as roscas de tubo seguem a NBR NM ISO 7-1 (padrão BSP). Equipamentos importados dos EUA costumam vir com NPT.', norma: 'NBR NM ISO 7-1', links: [M('vedantes')].map(u => ['Vedantes', u[0]]), ver: [] },
    { t: 'Corrosão galvânica', en: 'galvanic corrosion', tema: 'Materiais e juntas', def: 'Corrosão acelerada que ocorre quando dois metais diferentes ficam em contato na presença de água.',
      exp: 'O metal menos nobre (como o aço galvanizado) corrói ligado ao mais nobre (como o cobre). Evita-se com conexões de transição em bronze ou latão ou com luvas dielétricas.', links: [M('cobre')].map(u => ['Tubos de cobre', u[0]]), ver: [] },
    { t: 'Prensagem', en: 'press fitting', tema: 'Materiais e juntas', def: 'União de tubos metálicos ou multicamada por conexões com anel de vedação, deformadas com uma prensa elétrica ou manual.',
      exp: 'Não usa chama, é rápida e exige a ferramenta e os mordentes certos para cada sistema.', links: [M('conexoes-cobre')].map(u => ['Conexões de cobre', u[0]]), ver: [] },

    // ----- Bombas -----
    { t: 'Altura manométrica', en: 'total dynamic head (TDH)', tema: 'Bombas', def: 'Energia, em metros de coluna de líquido, que a bomba precisa fornecer: o desnível a vencer mais as perdas de carga na sucção e no recalque.',
      exp: 'Com a vazão, é o dado para escolher a bomba na curva do fabricante.', f: ['Hman = Hg + hf(sucção) + hf(recalque)', 'Hg: desnível geométrico'], links: [L.bomba], ver: ['npsh', 'perda-de-carga', 'curva-da-bomba'] },
    { t: 'NPSH', en: 'net positive suction head', tema: 'Bombas', def: 'Pressão disponível na sucção acima da pressão de vapor do líquido. O NPSH disponível da instalação deve superar o NPSH requerido pela bomba.',
      exp: 'Se o disponível for menor que o requerido, há cavitação. Melhora-se reduzindo a altura de sucção e as perdas na sucção, ou baixando a temperatura do líquido.', f: ['NPSHd = Patm/γ − Pv/γ − Hs − hf(sucção)', 'Hs: altura de sucção · Pv: pressão de vapor'], links: [L.bomba], ver: ['cavitacao', 'altura-manometrica'] },
    { t: 'Curva da bomba', en: 'pump curve', tema: 'Bombas', def: 'Gráfico do fabricante que relaciona a vazão da bomba com a altura manométrica, o rendimento, a potência e o NPSH requerido.',
      exp: 'O ponto de operação é o cruzamento da curva da bomba com a curva da instalação. Prefira bombas que operem perto do melhor rendimento.', ver: ['altura-manometrica'] },
    { t: 'Escorva', en: 'priming', tema: 'Bombas', def: 'Enchimento com líquido da carcaça e da tubulação de sucção antes de ligar a bomba.',
      exp: 'Bombas centrífugas comuns não bombeiam ar. Uma válvula de pé na sucção mantém a escorva quando a bomba está acima do reservatório.', ver: ['npsh'] },

    // ----- Projeto e obra -----
    { t: 'Ponto de espera', en: 'stub-out', tema: 'Projeto e obra', def: 'Extremidade da tubulação deixada na parede ou no piso, pronta para receber o aparelho no fim da obra.',
      exp: 'Deve ficar fechada com bujão ou tampão até a instalação do aparelho, para proteger da sujeira e permitir o teste de estanqueidade.', links: [['Guia: teste de estanqueidade', SITE + '/guias-praticos']], ver: ['estanqueidade'] },
    { t: 'Estanqueidade', en: 'tightness / leak test', tema: 'Projeto e obra', def: 'Capacidade da tubulação de não vazar. O teste de estanqueidade pressuriza a rede, antes do fechamento das paredes, para comprovar isso.',
      exp: 'A NBR 5626 pede ensaio da água fria e quente com pelo menos 1,5 vez a pressão de serviço. O esgoto e o gás têm ensaios próprios nas NBR 8160 e NBR 15526.', norma: 'NBR 5626 · NBR 8160 · NBR 15526', links: [['Guia: teste de estanqueidade', SITE + '/guias-praticos']], ver: ['ponto-de-espera'] },
    { t: 'Vida útil de projeto (VUP)', slug: 'vup', en: 'design service life', tema: 'Projeto e obra', def: 'Período para o qual um sistema da edificação é projetado para cumprir seu desempenho, com a manutenção prevista.',
      exp: 'Pela NBR 15575, o sistema hidrossanitário de edificações habitacionais deve ter VUP mínima de 20 anos.', norma: 'NBR 15575-1 · NBR 15575-6', links: [L.normas], ver: ['as-built'] },
    { t: 'As built', en: 'as built', tema: 'Projeto e obra', def: 'Projeto atualizado com o que foi realmente executado na obra, incluindo mudanças de traçado.',
      exp: 'Indispensável para manutenção e reformas: mostra onde os tubos passam de verdade.', ver: ['vup'] },
    { t: 'ART', en: 'technical responsibility record', tema: 'Projeto e obra', def: 'Anotação de Responsabilidade Técnica: registro no CREA que identifica o profissional responsável por um projeto ou serviço.',
      exp: 'Exigida em projetos e execução de instalações, e em muitos testes, como o da rede de gás. Para arquitetos, o equivalente é o RRT, no CAU.', ver: [] },
    { t: 'BIM', en: 'building information modeling', tema: 'Projeto e obra', def: 'Metodologia de projeto com modelos 3D que carregam informações dos elementos, como material, diâmetro, fabricante e custo.',
      exp: 'Permite compatibilizar instalações com estrutura e arquitetura antes da obra e extrair quantitativos do modelo.', links: [L.bim], ver: ['ifc', 'compatibilizacao'] },
    { t: 'IFC', en: 'industry foundation classes', tema: 'Projeto e obra', def: 'Formato aberto de arquivo BIM, lido por diferentes programas (Revit, QiBuilder, Archicad e outros).',
      exp: 'É o formato aceito em contratações públicas com BIM e o mais usado para trocar modelos entre disciplinas.', links: [L.bim], ver: ['bim'] },
    { t: 'Compatibilização', en: 'design coordination / clash detection', tema: 'Projeto e obra', def: 'Verificação conjunta dos projetos (arquitetura, estrutura, instalações) para eliminar interferências antes da obra.',
      exp: 'Exemplo: tubo de esgoto passando por uma viga. No BIM, a detecção de interferências é automática.', links: [L.bim], ver: ['bim'] },
    // ----- Roscas, conexões e vedação -----
    { t: 'Rosca BSP', en: 'British Standard Pipe', tema: 'Materiais e juntas', def: 'Padrão britânico de rosca para tubos, com filetes de 55°, o mais usado em tubos e conexões no Brasil.',
      exp: 'Tem duas versões: BSPT, cônica, que veda nos próprios filetes (ISO 7), e BSPP, paralela, que veda com junta ou anel (ISO 228). Não se conecta com segurança à rosca NPT, mesmo quando a medida parece igual.', norma: 'ISO 7 · ISO 228', links: [['Vedantes', '/materiais/vedantes']], ver: ['rosca-npt', 'fita-veda-rosca', 'rosca-macho-e-femea'] },
    { t: 'Rosca NPT', en: 'National Pipe Taper', tema: 'Materiais e juntas', def: 'Padrão americano de rosca cônica para tubos, com filetes de 60° e conicidade de 1:16.',
      exp: 'Veda no aperto dos filetes, com fita ou pasta. É comum em equipamentos e instrumentos importados, como sprinklers e manômetros. O ângulo e o passo diferem da BSP: misturar as duas pode dar folga e vazamento, e o certo é usar um adaptador.', norma: 'ASME B1.20.1', links: [['Vedantes', '/materiais/vedantes']], ver: ['rosca-bsp', 'fita-veda-rosca', 'rosca-macho-e-femea'] },
    { t: 'Rosca macho e fêmea', en: 'male and female thread', tema: 'Materiais e juntas', def: 'Macho tem a rosca por fora da peça; fêmea tem a rosca por dentro.',
      exp: 'Em catálogos aparecem como M e F, ou MNPT e FNPT no padrão americano. Uma luva, por exemplo, costuma ser F x F, e um niple, M x M.', ver: ['rosca-bsp', 'rosca-npt', 'niple'] },
    { t: 'Fita veda-rosca', en: 'PTFE thread seal tape', tema: 'Materiais e juntas', def: 'Fita de PTFE enrolada na rosca macho para vedar juntas roscadas.',
      exp: 'Enrole no sentido do aperto, para não desfiar ao rosquear. Em gás, use só produto próprio para gás. Roscas paralelas não vedam nos filetes e precisam de junta ou anel.', links: [['Vedantes', '/materiais/vedantes']], ver: ['rosca-bsp', 'ptfe'] },
    { t: 'Niple', en: 'pipe nipple', tema: 'Materiais e juntas', def: 'Pequeno trecho de tubo com rosca macho nas duas pontas, usado para unir duas peças com rosca fêmea.', ver: ['luva', 'rosca-macho-e-femea'] },
    { t: 'Luva', en: 'coupling', tema: 'Materiais e juntas', def: 'Conexão que une dois tubos em linha reta, do mesmo diâmetro ou, na luva de redução, de diâmetros diferentes.',
      exp: 'A luva de correr desliza sobre o tubo e permite consertar um trecho sem desmontar a rede.', ver: ['uniao', 'bucha-de-reducao'] },
    { t: 'União', en: 'union', tema: 'Materiais e juntas', def: 'Conexão de três partes que permite desmontar a tubulação sem girar os tubos.',
      exp: 'É colocada junto a bombas, filtros e válvulas, para facilitar a manutenção.', ver: ['luva', 'flange'] },
    { t: 'Bucha de redução', en: 'reducing bushing', tema: 'Materiais e juntas', def: 'Peça encaixada dentro de uma conexão para reduzir o diâmetro de saída.', ver: ['luva', 'te'] },
    { t: 'Joelho e curva', en: 'elbow and bend', tema: 'Materiais e juntas', def: 'Conexões que mudam a direção da rede: o joelho tem raio curto, e a curva, raio maior.',
      exp: 'A curva gera menos perda de carga e menos ruído que o joelho, mas ocupa mais espaço.', ver: ['comprimento-equivalente', 'te'] },
    { t: 'Tê', en: 'tee', tema: 'Materiais e juntas', slug: 'te', def: 'Conexão em forma de T que cria uma derivação na tubulação.',
      exp: 'No tê de redução, a saída lateral é menor que a passagem principal, como na ligação de um bico de sprinkler ao ramal.', ver: ['joelho-e-curva', 'bucha-de-reducao'] },
    { t: 'Cap', en: 'pipe cap', tema: 'Materiais e juntas', def: 'Peça que fecha a ponta de um tubo, encaixada ou rosqueada por fora dele.', ver: ['bujao'] },
    { t: 'Bujão', en: 'threaded plug', tema: 'Materiais e juntas', def: 'Peça com rosca macho que fecha uma saída com rosca fêmea, como um ponto de espera.',
      exp: 'É o que permite testar a rede sob pressão antes da instalação de louças, metais ou bicos de sprinkler.', ver: ['cap', 'ponto-de-espera', 'estanqueidade'] },
    { t: 'Flange', en: 'flange', tema: 'Materiais e juntas', def: 'Disco ou anel com furos para parafusos, que une tubos, válvulas e equipamentos com uma junta de vedação no meio.',
      exp: 'Permite desmontar a rede. A furação e a classe precisam coincidir entre as peças: PN (como PN 16) ou classe americana (como 150#).', links: [['Flanges', '/materiais/flanges']], ver: ['pn', 'classe-de-pressao'] },
    { t: 'Classe de pressão', en: 'pressure class', tema: 'Materiais e juntas', def: 'Designação americana da faixa de pressão de flanges e válvulas, como 150#, 300# ou 600#.',
      exp: 'O número não é a pressão real em psi: a pressão admissível depende do material e cai com o aumento da temperatura.', norma: 'ASME B16.5', ver: ['pn', 'flange'] },
    { t: 'PTFE', en: 'polytetrafluoroethylene', tema: 'Materiais e juntas', def: 'Plástico de baixíssimo atrito e grande resistência química, conhecido como Teflon, marca registrada.',
      exp: 'É usado em fitas de vedação, sedes de válvulas de esfera e juntas.', ver: ['fita-veda-rosca', 'epdm'] },
    { t: 'EPDM', en: 'ethylene propylene diene monomer', tema: 'Materiais e juntas', def: 'Borracha sintética usada em anéis e juntas para água fria e quente.',
      exp: 'Resiste bem à água e ao calor moderado, mas não é indicada para óleos e combustíveis, em que se usa borracha nitrílica (NBR).', ver: ['ptfe', 'junta-elastica'] },
    // ----- Materiais -----
    { t: 'PVC', en: 'polyvinyl chloride', tema: 'Materiais e juntas', def: 'Plástico rígido usado em redes de água fria (marrom, soldável) e de esgoto (branco).',
      exp: 'Não é indicado para água quente. Nesse caso, usam-se CPVC, PPR, PEX ou cobre.', links: [['Tubos de PVC', '/materiais/pvc']], ver: ['cpvc', 'junta-soldavel'] },
    { t: 'CPVC', en: 'chlorinated polyvinyl chloride', tema: 'Materiais e juntas', def: 'PVC clorado, resistente ao calor, para redes de água quente e fria, unido com adesivo próprio.', links: [['Tubos de CPVC', '/materiais/cpvc']], ver: ['pvc', 'ppr', 'pex'] },
    { t: 'PPR', en: 'polypropylene random copolymer', tema: 'Materiais e juntas', def: 'Polipropileno copolímero random, usado em água quente e fria, com juntas por termofusão.', links: [['Tubos de PPR', '/materiais/ppr']], ver: ['termofusao', 'cpvc', 'pex'] },
    { t: 'PEX', en: 'cross-linked polyethylene', tema: 'Materiais e juntas', def: 'Polietileno reticulado, flexível, em rolos, para água quente e fria, normalmente com coletores.',
      exp: 'A flexibilidade reduz o número de conexões embutidas. As juntas são feitas por crimpagem ou anel deslizante.', links: [['PEX', '/materiais/pex']], ver: ['ppr', 'cpvc', 'coletor'] },
    { t: 'PEAD', en: 'high-density polyethylene (HDPE)', tema: 'Materiais e juntas', def: 'Polietileno de alta densidade, usado em adutoras, redes enterradas, gás e drenagem.',
      exp: 'Une-se por solda de topo ou eletrofusão, formando uma rede contínua e resistente à corrosão.', links: [['Polietileno', '/materiais/pe']], ver: ['eletrofusao', 'solda-de-topo', 'sdr'] },
    { t: 'Aço galvanizado', en: 'galvanized steel', tema: 'Materiais e juntas', def: 'Aço com revestimento de zinco contra a corrosão, muito usado em incêndio e redes aparentes.', links: [['Aço-carbono', '/materiais/aco']], ver: ['corrosao-galvanica', 'schedule'] },
    { t: 'Ferro fundido dúctil', en: 'ductile iron', tema: 'Materiais e juntas', def: 'Ferro fundido com grafita em forma esférica, mais resistente a impactos que o ferro cinzento.',
      exp: 'É o material usual de adutoras e de conexões e válvulas de maior diâmetro.', links: [['Ferro fundido', '/materiais/ferro']], ver: ['junta-elastica'] },
    { t: 'Latão e bronze', en: 'brass and bronze', tema: 'Materiais e juntas', def: 'Ligas de cobre: o latão leva zinco, e o bronze, estanho. São usadas em registros, conexões e metais.', links: [['Latão e bronze', '/materiais/latao']], ver: ['corrosao-galvanica'] },
    { t: 'Aço inox 304 e 316', en: 'stainless steel 304 and 316', tema: 'Materiais e juntas', def: 'Ligas de aço resistentes à corrosão. O 316 contém molibdênio e resiste melhor a cloretos.',
      exp: 'O 316 é preferido em ambientes marinhos, piscinas e processos com produtos químicos.', links: [['Aço inox', '/materiais/inox']], ver: ['corrosao-galvanica'] },
    // ----- Válvulas e acessórios -----
    { t: 'Válvula de gaveta', en: 'gate valve', tema: 'Água fria e quente', def: 'Válvula de bloqueio em que uma cunha sobe e desce: deve ficar totalmente aberta ou totalmente fechada.',
      exp: 'Aberta, tem baixa perda de carga. Não serve para regular vazão, porque a cunha vibra e se desgasta.', links: [['Válvulas de gaveta', '/materiais/gaveta']], ver: ['valvula-globo', 'valvula-de-esfera'] },
    { t: 'Válvula globo', en: 'globe valve', tema: 'Água fria e quente', def: 'Válvula em que um obturador se aproxima de uma sede, adequada para regular a vazão.',
      exp: 'Regula bem, mas tem perda de carga maior que a de gaveta e a de esfera.', links: [['Válvulas globo', '/materiais/globo']], ver: ['valvula-de-gaveta', 'registro-de-pressao'] },
    { t: 'Válvula de esfera', en: 'ball valve', tema: 'Água fria e quente', def: 'Válvula de abertura rápida, com um quarto de volta, em que uma esfera furada libera ou bloqueia o fluxo.',
      exp: 'Pode ser monobloco, de peça única, ou tripartida, que permite a manutenção sem retirar as pontas da linha. Fechar rápido em rede longa pode causar golpe de aríete.', links: [['Esfera tripartida', '/materiais/esfera-tripartida']], ver: ['golpe-de-ariete', 'valvula-de-gaveta'] },
    { t: 'Válvula borboleta', en: 'butterfly valve', tema: 'Água fria e quente', def: 'Válvula compacta com um disco que gira um quarto de volta dentro do corpo, comum em grandes diâmetros.',
      exp: 'No modelo wafer, fica prensada entre os flanges. No lug, tem orelhas roscadas e permite desmontar um dos lados da linha.', links: [['Borboleta wafer', '/materiais/borboleta-wafer']], ver: ['flange', 'valvula-de-gaveta'] },
    { t: 'Válvula de retenção', en: 'check valve', tema: 'Água fria e quente', def: 'Válvula que deixa a água passar em um só sentido e impede o retorno.',
      exp: 'É obrigatória no recalque de bombas, para proteger o conjunto do refluxo. A seta do corpo indica o sentido do fluxo.', links: [['Válvulas de retenção', '/materiais/retencao']], ver: ['valvula-de-pe', 'golpe-de-ariete'] },
    { t: 'Válvula de pé', en: 'foot valve', tema: 'Bombas', def: 'Válvula de retenção com crivo, instalada na ponta da sucção para manter a bomba escorvada.', ver: ['escorva', 'valvula-de-retencao'] },
    { t: 'Válvula de segurança e de alívio', en: 'safety and relief valve', tema: 'Água fria e quente', def: 'Válvula que abre automaticamente quando a pressão passa do valor ajustado, protegendo a rede ou o equipamento.', links: [['Válvulas de segurança', '/materiais/seguranca']], ver: ['vaso-de-expansao'] },
    { t: 'Válvula solenoide', en: 'solenoid valve', tema: 'Água fria e quente', def: 'Válvula aberta e fechada por uma bobina elétrica, usada em automação.',
      exp: 'Pode ser normalmente fechada (abre ao receber energia) ou normalmente aberta. É comum em irrigação, máquinas de lavar e linhas de ar comprimido, gás e vapor.', links: [['Solenoides', '/materiais/solenoides']], ver: [] },
    { t: 'Registro de pressão', en: 'pressure tap / shower valve', tema: 'Água fria e quente', def: 'Registro de vedação gradual usado para regular a vazão de chuveiros.',
      exp: 'Apesar do nome, regula vazão, não pressão. Para reduzir a pressão da rede, usa-se a válvula redutora.', links: [['Registros', '/materiais/registros']], ver: ['valvula-redutora', 'valvula-globo'] },
    { t: 'Filtro Y', en: 'Y strainer', tema: 'Água fria e quente', def: 'Filtro em forma de Y, com tela metálica, que retém sujeira antes de válvulas e equipamentos.',
      exp: 'Tem bujão ou tampa para limpar a tela. É comum antes de válvulas redutoras e hidrômetros.', links: [['Filtros', '/materiais/filtros']], ver: ['valvula-redutora'] },
    { t: 'Purgador', en: 'steam trap / condensate drain', tema: 'Materiais e juntas', def: 'Dispositivo que elimina automaticamente o condensado de redes de vapor ou de ar comprimido, sem deixar escapar o fluido.', links: [['Purgadores', '/materiais/purgadores']], ver: [] },
    { t: 'Coeficiente de vazão (Cv e Kv)', en: 'flow coefficient', tema: 'Hidráulica', def: 'Número que indica quanto fluido passa por uma válvula para uma dada perda de pressão.',
      exp: 'Kv é a vazão em m³/h de água com perda de 1 bar. Cv é a vazão em galões por minuto com perda de 1 psi. Cv ≈ 1,156 × Kv.', ver: ['perda-de-carga', 'valvula-globo'] },
    // ----- Água, bombas e equipamentos -----
    { t: 'Hidrômetro', en: 'water meter', tema: 'Água fria e quente', def: 'Aparelho que mede o volume de água consumido.',
      exp: 'Fica no cavalete de entrada do imóvel e serve de base para a cobrança da concessionária. Os tipos mais comuns são o velocimétrico (unijato ou multijato) e o volumétrico.', links: [['Hidrômetros', '/materiais/hidrometros']], ver: ['cavalete'] },
    { t: 'Cavalete', en: 'water meter assembly', tema: 'Água fria e quente', def: 'Conjunto de tubos e registros onde é instalado o hidrômetro, na entrada do imóvel.',
      exp: 'O padrão é definido pela concessionária de cada cidade.', links: [['Detalhes típicos', '/guias-praticos#detalhe-cavalete']], ver: ['hidrometro'] },
    { t: 'Coletor', en: 'manifold', tema: 'Água fria e quente', def: 'Peça com várias saídas que alimenta cada ponto de consumo com um tubo próprio.', links: [['Coletores', '/materiais/coletores']], ver: ['pex'] },
    { t: 'Pressurizador', en: 'booster pump', tema: 'Água fria e quente', def: 'Bomba que aumenta a pressão da água nos pontos de consumo, quando a altura do reservatório não é suficiente.', links: [['Pressurizadores', '/materiais/pressurizadores']], ver: ['pressao-dinamica'] },
    { t: 'Vaso de expansão', en: 'expansion vessel', tema: 'Água fria e quente', def: 'Reservatório com membrana e ar que absorve a dilatação da água aquecida e amortece variações de pressão.', links: [['Vasos de expansão', '/materiais/vasos-expansao']], ver: ['dilatacao-termica'] },
    { t: 'Boiler', en: 'hot water storage tank', tema: 'Água fria e quente', def: 'Reservatório isolado termicamente que acumula água quente, em aquecimento central ou solar.', ver: ['recirculacao-de-agua-quente', 'vaso-de-expansao'] },
    { t: 'Legionela', en: 'Legionella', tema: 'Água fria e quente', def: 'Bactéria que se multiplica em água morna parada e causa doença respiratória quando inalada em gotículas.',
      exp: 'O risco cresce em boilers, trechos sem circulação e torres de resfriamento. A prevenção inclui manter a temperatura adequada, circular a água e fazer manutenção.', ver: ['recirculacao-de-agua-quente', 'torre-de-resfriamento'] },
    { t: 'Bomba centrífuga', en: 'centrifugal pump', tema: 'Bombas', def: 'Bomba em que um rotor gira e transfere energia à água, aumentando a pressão.', links: [['Bombas', '/materiais/bombas']], ver: ['altura-manometrica', 'curva-da-bomba', 'npsh'] },
    { t: 'Inversor de frequência', en: 'variable frequency drive (VFD)', tema: 'Bombas', def: 'Equipamento que varia a rotação do motor, ajustando a bomba à demanda e economizando energia.', ver: ['curva-da-bomba', 'pressurizador'] },
    // ----- Esgoto -----
    { t: 'Fossa séptica', en: 'septic tank', tema: 'Esgoto e pluvial', def: 'Tanque onde o esgoto decanta e sofre digestão, usado onde não há rede coletora.',
      exp: 'O efluente ainda precisa de tratamento complementar ou de infiltração no solo, conforme o projeto e o órgão ambiental.', norma: 'NBR 17076', links: [['Fossa', '/materiais/fossa']], ver: ['sumidouro'] },
    { t: 'Sumidouro', en: 'soakaway', tema: 'Esgoto e pluvial', def: 'Poço que infiltra no solo o efluente já tratado.',
      exp: 'A área de infiltração sai do teste de percolação, e o fundo deve guardar distância do lençol freático.', norma: 'NBR 17076', ver: ['fossa-septica'] },
    { t: 'Subcoletor', en: 'building sub-drain', tema: 'Esgoto e pluvial', def: 'Tubulação horizontal que recebe os tubos de queda e leva o esgoto ao coletor predial.', norma: 'NBR 8160', ver: ['tubo-de-queda', 'coletor-predial'] },
    // ----- Incêndio -----
    { t: 'Válvula de governo e alarme (VGA)', en: 'alarm check valve', tema: 'Incêndio', def: 'Válvula instalada na alimentação da rede de sprinklers que abre com o fluxo e dispara o alarme.', norma: 'NBR 10897', links: [['Detalhes típicos', '/guias-praticos#detalhe-vga-sprinklers']], ver: ['sprinkler', 'fator-k'] },
    { t: 'Fator K', en: 'K-factor', tema: 'Incêndio', def: 'Número que relaciona a vazão de um sprinkler à pressão: quanto maior o K, mais água sai na mesma pressão.',
      f: ['Q = K · √P', 'Q em L/min e P em bar, com K na unidade métrica'], norma: 'NBR 10897', ver: ['sprinkler', 'esfr'] },
    { t: 'ESFR', en: 'early suppression fast response', tema: 'Incêndio', def: 'Sprinkler de resposta rápida e grande vazão, feito para suprimir incêndios em armazéns altos.', ver: ['fator-k', 'sprinkler'] },
    { t: 'Registro de recalque', en: 'fire department connection', tema: 'Incêndio', def: 'Ponto no passeio ou na fachada por onde o Corpo de Bombeiros injeta água na rede de incêndio.', norma: 'NBR 13714', links: [['Detalhes típicos', '/guias-praticos#detalhe-hidrante-recalque']], ver: ['hidrante'] },
    { t: 'Conexão storz', en: 'Storz coupling', tema: 'Incêndio', def: 'Engate rápido simétrico, sem macho e fêmea, usado em mangueiras e hidrantes.', links: [['Mangueiras', '/materiais/mangueiras']], ver: ['hidrante'] },
    // ----- Climatização, projeto e orçamento -----
    { t: 'TR (tonelada de refrigeração)', en: 'ton of refrigeration', tema: 'Projeto e obra', def: 'Unidade de capacidade de refrigeração: 1 TR equivale a 12.000 BTU/h, ou cerca de 3,52 kW.', ver: ['chiller'] },
    { t: 'Chiller', en: 'chiller', tema: 'Projeto e obra', def: 'Equipamento que resfria água para climatização ou processos industriais.', links: [['Água gelada', '/sistemas/agua-gelada']], ver: ['tr', 'fan-coil', 'torre-de-resfriamento'] },
    { t: 'Fan-coil', en: 'fan coil unit', tema: 'Projeto e obra', def: 'Aparelho com ventilador e serpentina que usa água gelada para resfriar o ar do ambiente.', ver: ['chiller'] },
    { t: 'Torre de resfriamento', en: 'cooling tower', tema: 'Projeto e obra', def: 'Equipamento que retira calor da água de condensação por evaporação parcial, o que exige reposição contínua de água.', ver: ['chiller', 'legionela'] },
    { t: 'Shaft', en: 'service shaft', tema: 'Projeto e obra', def: 'Espaço vertical na edificação, reservado à passagem de tubulações e cabos, com acesso para manutenção.', links: [['Detalhes típicos', '/guias-praticos#detalhe-passagem-laje-parede']], ver: ['selo-corta-fogo'] },
    { t: 'Selo corta-fogo', en: 'firestop', tema: 'Projeto e obra', def: 'Vedação da passagem de tubos em lajes e paredes, que impede o avanço de fogo e fumaça entre ambientes.', links: [['Corta-fogo', '/materiais/corta-fogo']], ver: ['shaft'] },
    { t: 'SINAPI', en: 'national construction cost system', tema: 'Projeto e obra', def: 'Sistema de preços e custos da construção civil mantido pela Caixa e pelo IBGE, referência em obras públicas.', links: [['Dimensionamento', '/dimensionamento']], ver: ['bdi'] },
    { t: 'BDI', en: 'overhead and profit', tema: 'Projeto e obra', def: 'Benefícios e Despesas Indiretas: percentual somado ao custo direto para formar o preço de venda.',
      exp: 'Costuma incluir administração central, seguros, riscos, despesas financeiras, impostos e lucro.', f: ['Preço = Custo direto × (1 + BDI)', 'BDI em decimal: 25% = 0,25'], ver: ['sinapi'] },
    { t: 'Memorial descritivo', en: 'specifications document', tema: 'Projeto e obra', def: 'Documento que descreve as soluções, os materiais e os critérios adotados no projeto.', ver: ['as-built', 'art'] },
  ];
  // expressões sublinhadas automaticamente em fichas e guias
  const AUTO = {"perda-de-carga": ["perda de carga", "perdas de carga"], "comprimento-equivalente": ["comprimento equivalente", "comprimentos equivalentes"], "hazen-williams": ["Hazen-Williams"], "darcy-weisbach": ["Darcy-Weisbach"], "numero-de-reynolds": ["número de Reynolds"], "pressao-estatica": ["pressão estática"], "pressao-dinamica": ["pressão dinâmica"], "mca": ["mca"], "velocidade-de-escoamento": ["velocidade de escoamento"], "golpe-de-ariete": ["golpe de aríete", "golpes de aríete"], "celeridade": ["celeridade"], "cavitacao": ["cavitação"], "barrilete": ["barrilete"], "coluna-de-distribuicao": ["coluna de distribuição", "colunas de distribuição"], "extravasor": ["extravasor"], "torneira-de-boia": ["torneira de boia", "válvula de boia"], "valvula-redutora": ["válvula redutora de pressão", "válvulas redutoras de pressão", "válvula redutora", "válvulas redutoras"], "ventosa": ["ventosa", "ventosas"], "retrossifonagem": ["retrossifonagem"], "separacao-atmosferica": ["separação atmosférica"], "conexao-cruzada": ["conexão cruzada", "conexões cruzadas"], "dilatacao-termica": ["dilatação térmica"], "lira-de-dilatacao": ["lira de dilatação", "liras de dilatação"], "recirculacao-de-agua-quente": ["recirculação"], "fecho-hidrico": ["fecho hídrico", "fechos hídricos"], "sifao": ["sifão", "sifões"], "caixa-sifonada": ["caixa sifonada", "caixas sifonadas"], "ramal-de-esgoto": ["ramal de esgoto", "ramais de esgoto", "ramal de descarga", "ramais de descarga"], "tubo-de-queda": ["tubo de queda", "tubos de queda"], "ventilacao": ["coluna de ventilação", "ventilação primária", "ventilação secundária"], "coletor-predial": ["coletor predial", "subcoletor", "subcoletores"], "declividade": ["declividade"], "uhc": ["UHC", "Unidade Hunter", "Unidades Hunter"], "caixa-de-gordura": ["caixa de gordura", "caixas de gordura"], "caixa-de-inspecao": ["caixa de inspeção", "caixas de inspeção"], "zona-de-espuma": ["zona de pressão de espuma", "zona de espuma"], "intensidade-pluviometrica": ["intensidade pluviométrica"], "regulador-de-pressao": ["regulador de pressão", "reguladores de pressão"], "fator-de-simultaneidade": ["fator de simultaneidade"], "sprinkler": ["chuveiro automático", "chuveiros automáticos", "sprinkler", "sprinklers"], "hidrante": ["mangotinho", "mangotinhos"], "reserva-tecnica": ["reserva técnica"], "bomba-jockey": ["bomba jockey"], "dn": ["DN"], "pn": ["PN"], "sdr": ["SDR"], "schedule": ["schedule", "SCH"], "bolsa-e-ponta": ["bolsa e ponta", "ponta e bolsa", "ponta-bolsa"], "junta-soldavel": ["junta soldável", "juntas soldáveis"], "junta-elastica": ["junta elástica", "juntas elásticas"], "termofusao": ["termofusão"], "eletrofusao": ["eletrofusão"], "solda-de-topo": ["solda de topo"], "conexao-ranhurada": ["ranhurado", "ranhurada", "ranhurados", "ranhuradas"], "rosca-bsp-npt": ["BSP", "NPT"], "corrosao-galvanica": ["corrosão galvânica"], "prensagem": ["prensagem"], "altura-manometrica": ["altura manométrica"], "npsh": ["NPSH"], "curva-da-bomba": ["curva da bomba"], "escorva": ["escorva"], "ponto-de-espera": ["ponto de espera", "pontos de espera"], "estanqueidade": ["estanqueidade"], "vup": ["vida útil de projeto", "VUP"], "as-built": ["as built"], "art": ["ART"], "bim": ["BIM"], "ifc": ["IFC"], "compatibilizacao": ["compatibilização"]};
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const slugOf = x => x.slug || norm(x.t).replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  TERMS.forEach(x => { x.id = slugOf(x); x.links = x.links || []; x.ver = x.ver || []; x.auto = AUTO[x.id] || []; });
  TERMS.sort((a, b) => norm(a.t).localeCompare(norm(b.t)));
  TERMS.temas = TEMAS;
  return TERMS;
})();

// Expressões que viram termo sublinhado nas fichas e nos guias. Siglas em maiúsculas só casam em maiúsculas.
function glossarize(root, opts = {}) {
  if (!root || typeof document === 'undefined') return;
  if (!glossarize.re) {
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');   // hífen sem escape: com a flag u, \- é inválido
    const all = [];
    glossarize.cs = {}; glossarize.ci = {};
    GLOSSARIO.forEach(x => x.auto.forEach(p => {
      const sigla = p === p.toUpperCase() && /[A-Z]/.test(p);
      if (sigla) glossarize.cs[p] = x; else glossarize.ci[p.toLowerCase()] = x;
      all.push(p);
    }));
    glossarize.re = new RegExp(`(?<![\\p{L}\\d])(?:${all.sort((a, b) => b.length - a.length).map(esc).join('|')})(?![\\p{L}\\d])`, 'giu');
  }
  const SKIP = 'a, h1, h2, h3, h4, h5, h6, button, summary, label, code, script, style, input, textarea, select, .gl, .formula, .crumbs, [data-nogloss]';
  const seen = new Set(opts.skip ? [opts.skip] : []);
  const max = opts.max || 10;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.nodeValue.trim().length > 2 && !n.parentElement.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT,
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  let count = 0;
  for (const node of nodes) {
    if (count >= max) break;
    const text = node.nodeValue, re = glossarize.re;
    re.lastIndex = 0;
    let m, last = 0, frag = null;
    while ((m = re.exec(text)) && count < max) {
      const x = glossarize.cs[m[0]] || glossarize.ci[m[0].toLowerCase()];
      if (!x || seen.has(x.id)) continue;
      seen.add(x.id); count++;
      frag = frag || document.createDocumentFragment();
      frag.append(text.slice(last, m.index));
      const a = document.createElement('a');
      a.className = 'gl'; a.href = '/glossario/' + x.id; a.dataset.def = x.def; a.textContent = m[0];
      a.setAttribute('aria-label', `${m[0]} — ver no glossário: ${x.def}`);
      frag.append(a);
      last = m.index + m[0].length;
    }
    if (frag) { frag.append(text.slice(last)); node.replaceWith(frag); }
  }
}

// Aba "Glossário" de Guias práticos (página inicial) e termos sublinhados nas páginas
(() => {
  if (typeof document === 'undefined') return;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const byId = Object.fromEntries(GLOSSARIO.map(x => [x.id, x]));
  const letterOf = x => norm(x.t)[0].toUpperCase();

  // páginas próprias (materiais, sistemas, glossário): sublinha os termos no conteúdo
  if (document.body.classList.contains('pg')) {
    const main = document.querySelector('.pg-main .sheet');
    glossarize(main, { skip: document.body.dataset.glossSkip });
    return;
  }

  // ficha aberta na página inicial (materiais e sistemas)
  const sheet = document.getElementById('sheetBody');
  if (sheet) new MutationObserver(() => { if (!sheet.querySelector('.gl')) glossarize(sheet); }).observe(sheet, { childList: true });

  const list = document.getElementById('glList');
  if (!list) return;
  const st = { q: '', letra: null, tema: null };
  const card = x => `
    <details class="glterm" id="gl-${x.id}">
      <summary>
        <span class="glterm__t"><h3>${x.t}</h3><span class="glterm__en" lang="en">${x.en}</span></span>
        <p class="glterm__def">${x.def}</p>
        <span class="glterm__tema">${x.tema}</span>
      </summary>
      <div class="glterm__more">
        ${x.exp ? `<p>${x.exp}</p>` : ''}
        ${x.f ? `<div class="formula">${x.f[0]}<small>${x.f[1]}</small></div>` : ''}
        ${x.norma ? `<div class="glrel"><span>Norma</span>${normTags(x.norma.split(' · '))}</div>` : ''}
        ${x.links.length ? `<div class="glrel"><span>No portal</span>${x.links.map(([n, u]) => `<a href="${u}"${/^\/materiais\//.test(u) ? ` data-sheet="mat-${u.split('/')[2]}"` : /^\/sistemas\//.test(u) ? ` data-sheet="sis-${u.split('/')[2]}"` : ''}>${n}</a>`).join('')}</div>` : ''}
        ${x.ver.filter(v => byId[v]).length ? `<div class="glrel"><span>Veja também</span>${x.ver.filter(v => byId[v]).map(v => `<a class="glrel__see" href="#gl-${v}" data-gl="${v}">${byId[v].t}</a>`).join('')}</div>` : ''}
        <a class="glterm__page" href="/glossario/${x.id}">Página do termo →</a>
      </div>
    </details>`;
  function render() {
    const xs = GLOSSARIO.filter(x => (!st.letra || letterOf(x) === st.letra) && (!st.tema || x.tema === st.tema) &&
      (!st.q || matchText([x.t, x.en, x.def, x.exp || '', x.norma || ''].join(' '), queryTerms(st.q))));
    document.getElementById('glCount').textContent = `${xs.length} de ${GLOSSARIO.length} termos`;
    const groups = {};
    xs.forEach(x => (groups[letterOf(x)] = groups[letterOf(x)] || []).push(x));
    list.innerHTML = xs.length
      ? Object.entries(groups).map(([l, g]) => `<h3 class="glletter">${l}</h3><div class="glterms">${g.map(card).join('')}</div>`).join('')
      : '<p class="gpempty">Nenhum termo encontrado. <a href="#contato" data-subject="Consulta técnica" data-question="Sugestão de termo para o glossário: ">Sugira o termo que você procurava</a>.</p>';
  }
  const az = document.getElementById('glAz'), temas = document.getElementById('glTemas'), q = document.getElementById('glSearch');
  const letras = new Set(GLOSSARIO.map(letterOf));
  az.innerHTML = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(l => `<button type="button" data-l="${l}" aria-pressed="false"${letras.has(l) ? '' : ' disabled'}>${l}</button>`).join('');
  temas.innerHTML = GLOSSARIO.temas.map(t => `<button type="button" class="bim__chip" data-t="${t}" aria-pressed="false">${t}</button>`).join('');
  const press = (box, attr, v) => box.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset[attr] === v));
  az.addEventListener('click', e => { const b = e.target.closest('button'); if (!b || b.disabled) return; st.letra = st.letra === b.dataset.l ? null : b.dataset.l; press(az, 'l', st.letra); render(); });
  temas.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; st.tema = st.tema === b.dataset.t ? null : b.dataset.t; press(temas, 't', st.tema); render(); });
  q.addEventListener('input', () => { st.q = norm(q.value.trim()); render(); });
  // a lista (75 termos, ~1.400 elementos) só é montada quando o visitante chega perto de Guias práticos
  const perto = document.getElementById('guias');
  if (perto && 'IntersectionObserver' in window && !location.hash.startsWith('#gl-')) {
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); if (!list.childElementCount) render(); } }, { rootMargin: '1000px 0px' });
    io.observe(perto);
  } else render();
  // "Veja também" e links do submenu para um termo: limpa os filtros e abre o termo antes do roteador rolar até ele
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#gl-"]'); if (!a) return;
    const id = a.getAttribute('href').slice(4);
    if (!byId[id]) return;
    Object.assign(st, { q: '', letra: null, tema: null }); q.value = ''; press(az, 'l', null); press(temas, 't', null);
    render();
    document.getElementById('gl-' + id).open = true;
  }, true);
})();
