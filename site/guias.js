// ===== Guias práticos: passo a passo, vídeos dos fabricantes, erros e patologias e checklist de entrega =====
// Vídeos de canais oficiais, conferidos em 23/10/2026 (oEmbed do YouTube). Conteúdo revisado pela Equipe Técnica PipeSystem.
const GP_TEMAS = ['Água fria e quente', 'Esgoto', 'Gás', 'Reservatórios', 'Metais sanitários', 'Testes e entrega', 'Identificação', 'Indústria'];

const VIDEOS = {
  pvc: { id: 'p_fwj2fG9_Y', t: 'Como instalar PVC soldável', canal: 'Tigre', dur: '2:10', tema: 'Água fria e quente', d: 'Corte, lixamento, limpeza e solda de tubos e conexões de PVC marrom.' },
  pvcAmanco: { id: 'UGn-qr7lF4M', t: 'Água fria soldável e roscável', canal: 'Amanco Wavin', dur: '4:21', tema: 'Água fria e quente', d: 'Execução de juntas soldáveis e roscáveis, com os cuidados de cada uma.' },
  cpvc: { id: 'Wj8G3noWT8U', t: 'Como instalar tubo CPVC', canal: 'Tigre', dur: '1:56', tema: 'Água fria e quente', d: 'Preparação e solda do CPVC para água quente.' },
  cpvcAmanco: { id: '46vvkLh2kMQ', t: 'Como instalar o Super CPVC FlowGuard', canal: 'Amanco Wavin', dur: '1:21', tema: 'Água fria e quente', d: 'Solda em uma etapa do CPVC FlowGuard.' },
  ppr: { id: 'bh_zk-3C3io', t: 'PPR: termofusão', canal: 'Amanco Wavin', dur: '4:17', tema: 'Água fria e quente', d: 'Uso do termofusor, tempos de aquecimento e encaixe das conexões de PPR.' },
  pex: { id: '9JESMcBrw5g', t: 'Instalação do ClicPEX', canal: 'Tigre', dur: '2:04', tema: 'Água fria e quente', d: 'Corte e montagem das conexões de engate do sistema PEX.' },
  flextemp: { id: 'L7hoZOf8Dbo', t: 'Como instalar o Flextemp', canal: 'Amanco Wavin', dur: '4:10', tema: 'Água fria e quente', d: 'Passo a passo do sistema PEX com conexões de anel.' },
  pexCorte: { id: 'jBnp3LHf8PU', t: 'PEX: comprimento mínimo entre conexões (inglês)', canal: 'Uponor', dur: '2:53', tema: 'Água fria e quente', d: 'Distância mínima de tubo entre duas conexões, conforme o diâmetro, e alternativas como tês múltiplos e curvas com guia.' },
  viega: { id: 'FyG5_0ccx2Q', t: 'ProPress: guia de instalação (inglês)', canal: 'Viega', dur: '1:47', tema: 'Água fria e quente', d: 'Conexões de cobre por prensagem: corte, rebarba, marcação e prensagem.' },
  banheiro: { id: 'FM9qw5bqXoc', t: 'Instalação hidráulica de banheiro', canal: 'Tigre', dur: '5:07', tema: 'Água fria e quente', d: 'Distribuição de água e esgoto de um banheiro completo.' },
  esgoto: { id: '3Hy-1vnJtsc', t: 'Tigre Ensina: instalação de esgoto na prática', canal: 'Tigre', dur: '26:45', tema: 'Esgoto', d: 'Aula completa: declividade, juntas, ventilação e caixas.' },
  esgotoAmanco: { id: 'rDFxamXoK_Q', t: 'Esgoto: juntas soldável e elástica', canal: 'Amanco Wavin', dur: '3:32', tema: 'Esgoto', d: 'Montagem de tubos e conexões de esgoto série normal.' },
  sifonada: { id: 'Lg7Vp1DGERc', t: 'Como instalar a caixa sifonada', canal: 'Tigre', dur: '4:58', tema: 'Esgoto', d: 'Nível, ligações de entrada e saída e acabamento no piso.' },
  gordura: { id: 'xvO1P7Bh85I', t: 'Como instalar caixa de gordura', canal: 'Tigre', dur: '4:00', tema: 'Esgoto', d: 'Posição, assentamento e ligações da caixa de gordura.' },
  retencao: { id: 'Njyh566E9R0', t: 'Como instalar válvula de retenção de esgoto', canal: 'Tigre', dur: '4:01', tema: 'Esgoto', d: 'Evita o retorno do esgoto da rede pública para dentro do imóvel.' },
  caixaTigre: { id: 'KsXqvzshNw8', t: "Como instalar caixa d'água", canal: 'Tigre', dur: '5:47', tema: 'Reservatórios', d: 'Base, adaptadores com flange, boia, extravasor e limpeza.' },
  caixaFortlev: { id: 'RgwYTjICBoQ', t: "Caixa d'água: passo a passo completo", canal: 'Fortlev', dur: '9:35', tema: 'Reservatórios', d: 'Instalação completa da caixa de polietileno, da base à tampa.' },
  descargaTigre: { id: 'tmXuT3WX8gg', t: 'Instalação de caixa de descarga', canal: 'Tigre', dur: '8:25', tema: 'Metais sanitários', d: 'Fixação, ligação de água e regulagem da caixa de descarga.' },
  valvula: { id: '2cic7yCKSF0', t: 'Válvulas de descarga: instalação', canal: 'Docol', dur: '5:53', tema: 'Metais sanitários', d: 'Instalação da válvula de descarga e do acabamento.' },
  valvulaMan: { id: 't1FRcCVviXk', t: 'Válvulas de descarga: manutenção', canal: 'Docol', dur: '6:03', tema: 'Metais sanitários', d: 'Regulagem de vazão, troca de reparo e vazamentos.' },
  gas: { id: 'CkE6T1heuTk', t: 'Como é feita a instalação de gás natural em casa', canal: 'Comgás', dur: '3:56', tema: 'Gás', d: 'Etapas da ligação de gás natural canalizado, do ramal ao aparelho.' },
  vazamento: { id: 'rLwTcuL70eE', t: 'O que fazer em infiltração ou vazamento', canal: 'Tigre', dur: '7:08', tema: 'Testes e entrega', d: 'Como localizar e corrigir vazamentos e infiltrações.' },
  hidrostatico: { id: 'eiPWmEYkXDU', t: 'Teste hidrostático em ferro dúctil (inglês)', canal: 'McWane Ductile', dur: '3:31', tema: 'Testes e entrega', d: 'Enchimento, retirada do ar, pressurização e leitura em adutoras.' },
};

// ---------- guias passo a passo ----------
const GUIAS = [
  { id: 'estanq-agua', tema: 'Testes e entrega', tema2: ['Água fria e quente'], titulo: 'Teste de estanqueidade da água fria e quente', resumo: 'Antes de fechar paredes e forros: rede cheia, pressurizada e sem queda de pressão.',
    tempo: 'Meio dia', nivel: 'Instalador', norma: 'NBR 5626',
    separar: ['Bomba de teste com manômetro (escala compatível com a pressão de ensaio)', 'Bujões e tampões em todos os pontos de espera', 'Registro para isolar o trecho', 'Planilha ou formulário para o registro do teste'],
    passos: ['<b>Teste antes do fechamento.</b> Faça com a tubulação ainda aparente, antes do reboco, do forro e do revestimento.',
      '<b>Feche todos os pontos.</b> Coloque bujões ou tampões em cada ponto de espera (torneiras, chuveiros, registros). Nas juntas soldadas, respeite o tempo de cura do adesivo antes de pressurizar.',
      '<b>Encha devagar e tire o ar.</b> Encha pelo ponto mais baixo e abra o ponto mais alto até sair só água. Ar preso mascara a leitura do manômetro.',
      '<b>Pressurize.</b> Leve a rede a pelo menos 1,5 vez a pressão de serviço do trecho, como pede a NBR 5626, sem passar da pressão admissível dos tubos e conexões.',
      '<b>Observe.</b> Mantenha a pressão pelo tempo definido no projeto, percorrendo juntas e conexões à procura de gotejamento ou umidade.',
      '<b>Avalie.</b> Não pode haver vazamento nem queda de pressão. Se houver, alivie a pressão, corrija a junta e repita o teste.',
      '<b>Registre.</b> Anote data, trecho, pressão, duração e responsável, e guarde com fotos. O registro faz parte da entrega da obra.'],
    atencao: ['Nunca teste com ar comprimido em tubos plásticos de água: se romper, a peça vira projétil.', 'Água quente: teste também com a rede quente, quando o projeto pedir.', 'Mantenha os bujões até a instalação dos metais, para proteger os pontos de sujeira.'],
    videos: ['vazamento'], mats: [['Registros', 'registros'], ['Conexões de PVC', 'conexoes-pvc']] },
  { id: 'estanq-esgoto', tema: 'Testes e entrega', tema2: ['Esgoto'], titulo: 'Teste de estanqueidade do esgoto', resumo: 'Tubulação cheia de água ou com ar, com os pontos tampados, antes do fechamento.',
    tempo: '2 a 3 horas', nivel: 'Instalador', norma: 'NBR 8160',
    separar: ['Tampões de teste (ou bujões infláveis) para os ralos, ramais e tubos de queda', 'Mangueira e balde ou bomba', 'Formulário de registro'],
    passos: ['<b>Escolha o método.</b> A NBR 8160 prevê ensaio com água ou com ar e, depois de pronto, ensaio de fumaça para conferir os fechos hídricos.',
      '<b>Tampe as extremidades.</b> Feche as saídas do trecho e os pontos de entrada (ralos, vasos, pias) com tampões de teste.',
      '<b>Encha o trecho.</b> No ensaio com água, encha até a altura de coluna indicada pela norma para o trecho e marque o nível.',
      '<b>Observe.</b> Aguarde o tempo de ensaio e confira se o nível baixou e se há umidade nas juntas.',
      '<b>Corrija e repita.</b> Junta com vazamento é refeita, nunca "remendada" com massa.',
      '<b>Teste de funcionamento.</b> Com a obra pronta, descarregue os aparelhos e confira o escoamento e a ausência de retorno e de cheiro.'],
    atencao: ['Confira a declividade antes do teste: tubo sem caimento passa no teste de vazamento e entope no uso.', 'Junta elástica mal encaixada vaza só com a tubulação cheia: por isso o teste com água é o mais revelador.'],
    videos: ['esgoto', 'esgotoAmanco'], mats: [['Tubos de PVC', 'pvc'], ['Ralos', 'ralos']] },
  { id: 'estanq-gas', tema: 'Gás', tema2: ['Testes e entrega'], titulo: 'Teste de estanqueidade da rede de gás', resumo: 'Obrigatório antes de liberar o gás. Feito com ar ou gás inerte, por profissional habilitado.',
    tempo: '1 a 2 horas', nivel: 'Profissional habilitado', norma: 'NBR 15526',
    separar: ['Manômetro adequado à pressão de ensaio (ou registrador)', 'Ar comprimido ou nitrogênio', 'Tampões nos pontos de consumo', 'Espuma detectora de vazamento'],
    passos: ['<b>Isole a rede.</b> Feche os pontos de consumo com tampões e desconecte medidores e reguladores que não suportem a pressão de ensaio.',
      '<b>Pressurize com ar ou nitrogênio.</b> Use a pressão de ensaio definida no projeto, conforme a NBR 15526 e a concessionária. Nunca use o próprio gás combustível nem oxigênio.',
      '<b>Estabilize.</b> Aguarde a temperatura e a pressão se acomodarem antes de começar a contar o tempo.',
      '<b>Observe e procure vazamentos.</b> Leia o manômetro no início e no fim do período e passe espuma em todas as juntas.',
      '<b>Aprove só sem queda.</b> Qualquer queda de pressão reprova o trecho. Corrija e repita.',
      '<b>Documente e libere.</b> O laudo do teste, com a assinatura do responsável técnico, é exigido pela concessionária para ligar o gás.'],
    atencao: ['Nunca procure vazamento com chama.', 'Vedantes de rosca para gás devem ser próprios para gás (fita ou pasta certificadas).', 'O serviço exige profissional habilitado e, em muitos casos, ART.'],
    videos: ['gas'], mats: [['Reguladores de pressão', 'reguladores'], ['Tubos de cobre', 'cobre']] },
  { id: 'solda-pvc', tema: 'Água fria e quente', titulo: 'Junta soldável de PVC e CPVC', resumo: 'A junta que mais vaza por pressa: lixa, limpeza, adesivo e tempo de cura.',
    tempo: '5 min por junta', nivel: 'Básico', norma: 'NBR 5626',
    separar: ['Arco de serra ou cortador de tubos', 'Lixa d\'água nº 100', 'Solução preparadora (limpadora)', 'Adesivo próprio (PVC ou CPVC, nunca trocar)', 'Pincel ou aplicador'],
    passos: ['<b>Corte no esquadro</b> e tire as rebarbas por dentro e por fora.',
      '<b>Confira o encaixe a seco.</b> O tubo deve entrar com leve interferência. Marque a profundidade da bolsa no tubo.',
      '<b>Lixe</b> a ponta do tubo e o interior da bolsa só para tirar o brilho.',
      '<b>Limpe</b> as duas superfícies com a solução preparadora e deixe secar.',
      '<b>Aplique o adesivo</b> em camada fina e uniforme na bolsa e mais generosa na ponta do tubo.',
      '<b>Encaixe de uma vez</b> até a marca, sem girar, e segure alguns segundos. Remova o excesso.',
      '<b>Respeite a cura</b> do adesivo antes de pressurizar ou testar (veja o rótulo).'],
    atencao: ['Adesivo de PVC não serve para CPVC, e vice-versa.', 'Não "solde" peças molhadas nem com adesivo vencido ou engrossado.', 'Junta soldável não admite correção: se ficou ruim, corte e refaça.'],
    videos: ['pvc', 'pvcAmanco', 'cpvc', 'cpvcAmanco'], mats: [['Tubos de PVC', 'pvc'], ['Conexões de PVC', 'conexoes-pvc'], ['Tubos de CPVC', 'cpvc']] },
  { id: 'termofusao', tema: 'Água fria e quente', titulo: 'Termofusão de PPR', resumo: 'Aquecer, encaixar e não mexer: junta homogênea, sem adesivo.',
    tempo: '1 a 2 min por junta', nivel: 'Instalador treinado', norma: 'NBR 15813',
    separar: ['Termofusor com bocais do diâmetro certo', 'Tesoura corta-tubos de PPR', 'Álcool e pano limpo', 'Caneta para marcação'],
    passos: ['<b>Prepare o termofusor.</b> Limpe os bocais com álcool e espere atingir a temperatura de trabalho indicada pelo fabricante.',
      '<b>Corte no esquadro</b> com a tesoura própria e marque no tubo a profundidade de encaixe.',
      '<b>Aqueça ao mesmo tempo</b> o tubo e a conexão, sem girar, pelo tempo da tabela do fabricante para aquele diâmetro.',
      '<b>Encaixe em seguida</b> até a marca, alinhado e sem girar.',
      '<b>Segure e não mexa</b> durante o tempo de acomodação. Só pressurize depois do resfriamento.'],
    atencao: ['Aquecer de menos deixa a junta fraca; de mais, estrangula a passagem.', 'Nunca rosqueie diretamente no PPR: use conexões com inserto metálico.', 'Preveja dilatação nos trechos longos de água quente (liras ou braços de dilatação).'],
    videos: ['ppr'], mats: [['PPR', 'ppr']] },
  { id: 'junta-elastica', tema: 'Esgoto', titulo: 'Junta elástica (anel de borracha) no esgoto', resumo: 'Chanfro, lubrificante e folga para a dilatação.',
    tempo: '2 min por junta', nivel: 'Básico', norma: 'NBR 8160',
    separar: ['Lima ou grosa para o chanfro', 'Pasta lubrificante própria (nunca graxa ou óleo)', 'Caneta para marcação'],
    passos: ['<b>Corte no esquadro e chanfre</b> a ponta do tubo, para não deslocar o anel.',
      '<b>Confira o anel</b>: limpo, inteiro e bem assentado na canaleta da bolsa.',
      '<b>Marque a profundidade</b> da bolsa no tubo.',
      '<b>Lubrifique</b> a ponta do tubo e o anel com a pasta própria.',
      '<b>Encaixe até o fundo e recue</b> cerca de 1 cm, deixando a folga para a dilatação (siga o valor do fabricante).'],
    atencao: ['Graxa e óleo atacam a borracha do anel.', 'Fixe os tubos com abraçadeiras para a junta não abrir com o tempo.', 'Mantenha a declividade mínima do projeto em todos os ramais.'],
    videos: ['esgotoAmanco', 'esgoto'], mats: [['Tubos de PVC', 'pvc'], ['Ferro fundido SMU', 'smu']] },
  { id: 'roscas', tema: 'Água fria e quente', titulo: 'Vedação de roscas', resumo: 'Fita no sentido certo, aperto sem exagero e vedante adequado ao fluido.',
    tempo: '2 min por junta', nivel: 'Básico', norma: 'NBR NM ISO 7-1',
    separar: ['Fita veda-rosca (PTFE) ou vedante líquido adequado', 'Chave de grifo ou fixa do tamanho certo'],
    passos: ['<b>Limpe a rosca</b> e confira se não está amassada ou com rebarba.',
      '<b>Enrole a fita no sentido da rosca</b> (horário, olhando a ponta), começando do segundo fio e esticando levemente.',
      '<b>Use as voltas necessárias</b> para preencher os fios, sem exagero: fita demais racha conexões plásticas.',
      '<b>Rosqueie à mão</b> e complete com a ferramenta, sem forçar além do necessário.',
      '<b>Não volte a rosca</b> para "acertar a posição": isso desfaz a vedação.'],
    atencao: ['Em conexões plásticas, prefira adaptadores com rosca metálica nos pontos de metais sanitários.', 'Em gás, use somente vedante certificado para gás.', 'Não use estopa com massa em instalações novas.'],
    videos: ['pvcAmanco'], mats: [['Vedantes', 'vedantes'], ['Conexões galvanizadas', 'galv']] },
  { id: 'caixa', tema: 'Reservatórios', titulo: "Instalação da caixa d'água", resumo: 'Base plana, extravasor livre, tampa fechada e limpeza a cada 6 meses.',
    tempo: '3 a 4 horas', nivel: 'Instalador', norma: 'NBR 5626',
    separar: ['Base plana e nivelada que apoie todo o fundo', 'Adaptadores com flange e anel', 'Torneira de boia', 'Registros de saída e de limpeza'],
    passos: ['<b>Prepare a base:</b> plana, nivelada e apoiando todo o fundo. Ripas ou apoios isolados deformam a caixa cheia.',
      '<b>Fure com serra-copo</b> nos pontos indicados pelo fabricante, nunca nas áreas de reforço.',
      '<b>Instale os adaptadores com flange</b> e aperte à mão, sem vedante na rosca do flange.',
      '<b>Ligue a entrada</b> com a torneira de boia e um registro antes dela.',
      '<b>Ligue o extravasor</b> para um local visível e a limpeza para o esgoto pluvial ou área externa.',
      '<b>Feche a tampa</b> com as travas e faça a primeira limpeza antes do uso.'],
    atencao: ['O extravasor deve ser visível: é ele que avisa que a boia falhou.', 'Caixa sem tampa contamina a água e cria foco de mosquito.', 'Limpe e desinfete a cada 6 meses e registre a data na tampa.'],
    videos: ['caixaFortlev', 'caixaTigre'], mats: [["Caixas d'água", 'reservatorios']] },
  { id: 'descarga', tema: 'Metais sanitários', titulo: 'Válvula e caixa de descarga', resumo: 'Bitola certa, vazão regulada e sem vazamento contínuo.',
    tempo: '1 a 2 horas', nivel: 'Básico', norma: 'NBR 15491',
    separar: ['Válvula ou caixa compatível com a bacia', 'Tubo de ligação e bolsa', 'Chaves e fita veda-rosca'],
    passos: ['<b>Confira a pressão disponível:</b> válvula de descarga precisa de ramal exclusivo e de altura de reservatório suficiente, conforme o fabricante.',
      '<b>Embuta a válvula</b> no nível indicado, protegendo o miolo com a capa de obra.',
      '<b>Instale o acabamento</b> só no fim da obra.',
      '<b>Regule a vazão</b> para a bacia limpar com o volume previsto.',
      '<b>Confira vazamentos</b>: água escorrendo na louça sem acionar indica reparo mal assentado.'],
    atencao: ['Sujeira da obra é a principal causa de válvula que não fecha: lave a rede antes de instalar o reparo.', 'Bacias de 6 litros exigem válvula ou caixa compatível.'],
    videos: ['valvula', 'valvulaMan', 'descargaTigre'], mats: [['Registros', 'registros']] },
  // fig: desenho (SVG) · quadros: tabelas comuns ({ titulo, cols, linhas, nota }) · calc: calculadora do guia ('api570')
  // tabelas: amostras de cor (as cores na tela são aproximadas; o padrão Munsell está na norma) · refs: fontes do guia
  { id: 'cores-tubulacoes', tema: 'Identificação', tema2: ['Gás'], titulo: 'Identificação de tubulações por cores (NBR 6493)', resumo: 'Qual cor usar em cada fluido, como pintar ou aplicar faixas, setas de sentido e rótulos.',
    tempo: 'Consulta', nivel: 'Projetista e instalador', norma: 'NBR 6493',
    tabelas: [
      { titulo: 'Cores básicas da ABNT NBR 6493 (tubulações industriais)', linhas: [
        ['#2e6b3f', 'Verde-emblema', 'Água, exceto a de combate a incêndio'],
        ['#c62828', 'Vermelho-segurança', 'Água e outras substâncias de combate a incêndio (hidrantes e sprinklers)'],
        ['#1e5aa8', 'Azul-segurança', 'Ar comprimido'],
        ['#ffffff', 'Branco', 'Vapor'],
        ['#f2c200', 'Amarelo-segurança', 'Gases não liquefeitos'],
        ['#b8bec4', 'Cor-de-alumínio', 'Gases liquefeitos, inflamáveis e combustíveis de baixa viscosidade (diesel, gasolina, querosene, óleo lubrificante, solventes)'],
        ['#1b1f24', 'Preto', 'Inflamáveis e combustíveis de alta viscosidade (óleo combustível, asfalto, alcatrão, piche)'],
        ['#f07f1c', 'Alaranjado-segurança', 'Produtos químicos não gasosos'],
        ['#6b3f23', 'Marrom-canalização', 'Materiais fragmentados (minérios) e petróleo bruto'],
        ['#c7ccd1', 'Cinza-claro', 'Vácuo'],
        ['#5b6168', 'Cinza-escuro', 'Eletrodutos'],
      ] },
      { titulo: 'Para comparar: ASME A13.1 (Estados Unidos), cor de fundo e letra', linhas: [
        ['#2e7d32', 'Verde, letra branca', 'Água'],
        ['#c62828', 'Vermelho, letra branca', 'Combate a incêndio'],
        ['#1e5aa8', 'Azul, letra branca', 'Ar comprimido'],
        ['#f2c200', 'Amarelo, letra preta', 'Inflamáveis e oxidantes'],
        ['#6b3f23', 'Marrom, letra branca', 'Combustíveis'],
        ['#f07f1c', 'Laranja, letra preta', 'Tóxicos e corrosivos'],
      ] },
    ],
    separar: ['Projeto ou lista dos fluidos de cada linha, com pressão e temperatura', 'Tinta de fundo compatível com o tubo (para galvanizado, fundo de aderência próprio)', 'Tinta de acabamento nas cores da norma', 'Fita adesiva para faixas, gabarito de setas e etiquetas ou estêncil para os rótulos', 'Material de limpeza: desengraxante e lixa'],
    passos: ['<b>Identifique o fluido e a norma.</b> Tubulações industriais seguem a NBR 6493; gás combustível em prédios, a NBR 15526; gases industriais e medicinais têm normas próprias (NBR 13193 e NBR 12188), com cores diferentes — no gás medicinal, por exemplo, o oxigênio é verde.',
      '<b>Prepare a superfície.</b> Limpe e desengraxe; lixe a ferrugem solta e aplique fundo anticorrosivo no aço preto. Em tubo galvanizado, use fundo de aderência próprio para zinco, ou a tinta descasca.',
      '<b>Pinte o tubo inteiro ou aplique faixas.</b> A cor pode cobrir toda a extensão da tubulação ou ficar em faixas de identificação de 40 cm de largura, quando o tubo tem outra cor ou acabamento (isolamento térmico, inox, tubo plástico colorido de fábrica).',
      '<b>Distribua as faixas onde se lê.</b> Junto a válvulas, derivações, mudanças de direção, passagens por paredes e pisos e em trechos retos longos, para que a identificação apareça de qualquer ponto de acesso.',
      '<b>Indique o sentido do fluxo.</b> Pinte ou cole setas junto às faixas, apontando para onde o fluido corre; em linhas que mudam de sentido, use seta dupla.',
      '<b>Escreva o nome do fluido.</b> Rótulos com o nome (ex.: "ÁGUA GELADA", "AR COMPRIMIDO 7 bar", "VAPOR") em letra que contraste com a cor de fundo; em fluidos perigosos, inclua o pictograma de risco.',
      '<b>Gás em prédios.</b> A tubulação de gás aparente é pintada de amarelo (Munsell 5Y 8/12); na fachada, pode seguir a cor do prédio, com a palavra "GÁS" a cada 2 m ou em cada trecho aparente.',
      '<b>Registre e mantenha.</b> Inclua a legenda de cores no projeto e na sala de máquinas, e refaça a pintura e as faixas quando desbotarem ou depois de reformas.'],
    atencao: ['A cor não substitui o rótulo: em plantas com muitas linhas da mesma cor, só o nome do fluido evita a manobra errada.', 'Não pinte sobre válvulas de alívio, placas de identificação, visores, roscas de união e elementos de sprinkler.', 'Tubos plásticos coloridos de fábrica (ex.: PPR azul para ar comprimido, vermelho para incêndio, cinza para vácuo) já atendem à norma: aplique só setas e rótulos.', 'A NR-26 manda usar as cores das normas técnicas e no menor número possível, para não confundir.'],
    refs: [['ABNT NBR 6493 — Emprego de cores para identificação de tubulações industriais (3ª edição, 2019)', 'https://www.abntcatalogo.com.br/'], ['Resumo da NBR 6493: cores, fluidos e faixas de 40 cm', 'https://segurancadotrabalhoacz.com.br/nbr-6493/'], ['NR-26 — Sinalização e identificação de segurança (Portaria MTP 2.770/2022)', 'https://engenharia360.com/o-que-significam-as-cores-das-tubulacoes-nos-processos-industriais/'], ['CBMGO — Orientação Técnica 03/2020: gás aparente em amarelo 5Y 8/12 e palavra "GÁS" a cada 2 m (NBR 15526, item 7.9)', 'https://www.bombeiros.go.gov.br/wp-content/uploads/2014/11/Orientacao_Tecnica_03_2020_-_Tubos_Multicamada.pdf'], ['ASME A13.1 — Esquema de cores para identificação de tubulações (resumo)', 'https://jjkellercompliancenetwork.com/institute/pipe-marking-elements-format-color-schemes-and-location']],
    videos: [], mats: [['Tubos de aço-carbono e galvanizado', 'aco'], ['Tubos e conexões de PPR', 'ppr'], ['Isolamento térmico de tubulações', 'isolamento']] },
  { id: 'inspecao-api570', tema: 'Indústria', titulo: 'Inspeção de tubulações em serviço (API 570)', resumo: 'Como planejar e fazer a inspeção periódica de tubulações industriais em operação: classes, pontos de medição de espessura, taxa de corrosão, vida remanescente e próxima inspeção.',
    tempo: 'Planejamento e campo', nivel: 'Inspetor e engenheiro', norma: 'API 570 · API 574 · NR-13',
    chaves: ['API 570', 'inspeção de tubulação', 'integridade mecânica', 'medição de espessura', 'ultrassom', 'taxa de corrosão', 'vida remanescente', 'espessura mínima', 'CML', 'corrosão sob isolamento', 'CUI', 'ponto morto', 'NR-13', 'API 574', 'API 579', 'API RP 571', 'ASME B31.3', 'tubulação industrial'],
    fig: `<figure class="gpfig"><svg viewBox="0 0 640 230" role="img" aria-label="Desenho: inspetor mede a espessura da parede da tubulação com ultrassom nos pontos de monitoramento (CML): sob o isolamento, no trecho afinado pela corrosão, no ponto morto e na curva">
<defs><pattern id="gpIsol" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="10" height="10" fill="#e9edf2"/><path d="M0 0V10" stroke="#b8c2cc" stroke-width="4"/></pattern></defs>
<rect x="20" y="110" width="520" height="44" fill="#9aa6b2" stroke="#4a5563" stroke-width="1.5"/>
<path d="M28 118H540V146H28Z" fill="#bcdcf5"/>
<path d="M240 146Q290 158 340 146Z" fill="#bcdcf5"/><path d="M240 146Q290 158 340 146" fill="none" stroke="#c0392b" stroke-width="2"/>
<rect x="400" y="50" width="44" height="60" fill="#9aa6b2" stroke="#4a5563" stroke-width="1.5"/><rect x="408" y="50" width="28" height="68" fill="#cfe3f3"/>
<rect x="394" y="38" width="56" height="14" rx="3" fill="#6b7682" stroke="#4a5563"/>
<path d="M540 110H560A24 24 0 0 1 584 134V220H540Z" fill="#9aa6b2" stroke="#4a5563" stroke-width="1.5"/><path d="M540 118H556A20 20 0 0 1 576 138V220H548V146H540Z" fill="#bcdcf5"/>
<path d="M24 132H550Q562 132 562 144V224" fill="none" stroke="#2f80ed" stroke-width="3" stroke-linecap="round" stroke-dasharray="14 12" opacity=".75"><animate attributeName="stroke-dashoffset" values="52;0" dur="1.2s" repeatCount="indefinite"/></path>
<path d="M24 124H550M24 140H550" fill="none" stroke="#fff" stroke-width="1.5" stroke-dasharray="6 18" opacity=".8"><animate attributeName="stroke-dashoffset" values="48;0" dur="1.6s" repeatCount="indefinite"/></path>
<circle r="3.5" fill="#fff" opacity=".85"><animateMotion dur="3.6s" begin="0s" repeatCount="indefinite" path="M24 138H550Q562 138 562 150V224"/></circle><circle r="2.5" fill="#fff" opacity=".85"><animateMotion dur="3.6s" begin="0.9s" repeatCount="indefinite" path="M24 126H550Q562 126 562 150V224"/></circle><circle r="3.5" fill="#fff" opacity=".85"><animateMotion dur="3.6s" begin="1.8s" repeatCount="indefinite" path="M24 138H550Q562 138 562 150V224"/></circle><circle r="2.5" fill="#fff" opacity=".85"><animateMotion dur="3.6s" begin="2.7s" repeatCount="indefinite" path="M24 126H550Q562 126 562 150V224"/></circle>
<path d="M200 96h46m-8-5 8 5-8 5" fill="none" stroke="#2f80ed" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><text x="223" y="90" text-anchor="middle" font-family="system-ui,Segoe UI,Arial" font-size="10" font-weight="700" fill="#2f80ed">fluxo</text>
<text x="486" y="80" font-family="system-ui,Segoe UI,Arial" font-size="10" fill="#5b6b80">(fluido parado)</text>
<rect x="40" y="100" width="150" height="64" rx="6" fill="url(#gpIsol)" stroke="#7d8894"/>
<rect x="88" y="100" width="44" height="64" fill="#9aa6b2" stroke="#7d8894"/><rect x="88" y="110" width="44" height="44" fill="#9aa6b2"/>
<circle cx="98" cy="128" r="3" fill="#c0392b"/><circle cx="110" cy="138" r="4" fill="#c0392b"/><circle cx="121" cy="124" r="2.5" fill="#c0392b"/>
<g font-family="system-ui,Segoe UI,Arial" font-size="11" font-weight="700" fill="#fff">
<circle cx="110" cy="182" r="11" fill="#0b7285"/><text x="110" y="186" text-anchor="middle">1</text>
<circle cx="290" cy="182" r="11" fill="#0b7285"/><text x="290" y="186" text-anchor="middle">2</text>
<circle cx="470" cy="62" r="11" fill="#0b7285"/><text x="470" y="66" text-anchor="middle">3</text>
<circle cx="612" cy="132" r="11" fill="#0b7285"/><text x="612" y="136" text-anchor="middle">4</text></g>
<g font-family="system-ui,Segoe UI,Arial" font-size="11" fill="#5b6b80">
<text x="110" y="208" text-anchor="middle">sob o isolamento (CUI)</text><text x="290" y="208" text-anchor="middle">parede afinada</text>
<text x="486" y="66">ponto morto</text><text x="596" y="160">curva</text></g>
<g><animateTransform attributeName="transform" type="translate" values="110 0;110 0;290 0;290 0;422 -72;422 -72;556 0;556 0;110 0" keyTimes="0;0.2;0.25;0.45;0.5;0.7;0.75;0.95;1" dur="10s" repeatCount="indefinite"/>
<rect x="-9" y="84" width="18" height="22" rx="3" fill="#2f3640"/><rect x="-6" y="104" width="12" height="6" fill="#e8a317"/>
<path d="M0 84C0 60 -40 50 -60 40" fill="none" stroke="#2f3640" stroke-width="2"/></g>
<g font-family="system-ui,Segoe UI,Arial" font-size="13" font-weight="700">
<rect x="20" y="8" width="176" height="46" rx="8" fill="#0b1a2c"/>
<text x="32" y="26" fill="#9fb4cc" font-size="10" font-weight="600">MEDIDOR ULTRASSÔNICO</text>
<text x="32" y="45" fill="#7ee7f2" opacity="0">t = 6,9 mm · CML 1<animate attributeName="opacity" values="1;1;0;0;0" keyTimes="0;0.22;0.23;0.99;1" dur="10s" repeatCount="indefinite"/></text>
<text x="32" y="45" fill="#ffb4a8" opacity="0">t = 5,8 mm · CML 2<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.25;0.26;0.47;0.48;1" dur="10s" repeatCount="indefinite"/></text>
<text x="32" y="45" fill="#7ee7f2" opacity="0">t = 6,4 mm · CML 3<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;0.5;0.51;0.72;0.73;1" dur="10s" repeatCount="indefinite"/></text>
<text x="32" y="45" fill="#7ee7f2" opacity="0">t = 7,0 mm · CML 4<animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.75;0.76;0.97;1" dur="10s" repeatCount="indefinite"/></text></g>
</svg><figcaption>Os pontos de monitoramento (CML, na sigla em inglês) ficam onde a corrosão costuma ser maior: sob o isolamento, nos trechos já afinados, nos pontos mortos (trechos sem fluxo) e nas curvas. Desenho esquemático PipeSystem.</figcaption></figure>`,
    quadros: [
      { titulo: 'Classes de tubulação e intervalos máximos de inspeção (API 570)', cols: ['Classe', 'O que entra', 'Medição de espessura', 'Visual externa'], linhas: [
        ['1 · Alto risco', 'Vazamento pode causar emergência imediata: fluidos que vaporizam ao vazar, hidrocarbonetos acima da autoignição, H₂S, HCl anidro, HF, linhas sobre ou junto à água', '5 anos', '5 anos'],
        ['2 · Risco moderado', 'A maior parte da tubulação de processo: hidrocarbonetos abaixo da autoignição, hidrogênio, gás combustível, ácidos e soda cáustica, vapor de alta pressão', '10 anos', '5 anos'],
        ['3 · Baixo risco', 'Inflamáveis ou tóxicos em condições de baixo risco: óleos pesados e lubrificantes bem abaixo do ponto de fulgor, linhas afastadas de pessoas', '10 anos', '10 anos'],
        ['4 · Utilidades', 'Não inflamáveis e não tóxicos: água de resfriamento, de incêndio e potável, água de caldeira, vapor de baixa pressão, condensado, ar e nitrogênio de utilidades', 'A critério do usuário', 'A critério do usuário'],
      ], nota: 'A medição de espessura também não pode passar da metade da vida remanescente calculada: vale o menor dos dois prazos. Confira os valores na edição vigente da API 570.' },
    ],
    calc: 'api570',
    separar: ['Projeto, isométricos e histórico da linha (espessura original, materiais, fluido, pressão e temperatura)', 'Lista dos pontos de medição (CML) marcados em campo e no isométrico', 'Medidor de espessura por ultrassom calibrado, bloco-padrão e acoplante', 'Escova ou lixa para limpar o ponto e marcador', 'Permissão de trabalho, EPIs e acesso seguro (andaime, plataforma)', 'Planilha ou sistema para registrar as medições'],
    passos: ['<b>Classifique cada circuito.</b> Separe a tubulação em circuitos de mesmo fluido, material e condição de operação, e dê a cada um a classe 1, 2, 3 ou 4, pela consequência de um vazamento. A classe define os intervalos máximos de inspeção.',
      '<b>Escolha os pontos de medição (CML).</b> Concentre os pontos onde a corrosão é maior: curvas, tês e reduções, pontos mortos (trechos sem fluxo), pontos de injeção e de mistura, trechos sob isolamento e a passagem do solo para o ar. Numere e marque cada ponto no isométrico e na tubulação.',
      '<b>Identifique os mecanismos de dano.</b> Para cada circuito, liste o que pode atacar a linha: corrosão interna geral ou localizada, erosão, corrosão sob isolamento (CUI), ataque na interface solo-ar, fadiga por vibração. A API RP 571 descreve esses mecanismos.',
      '<b>Faça a inspeção visual externa.</b> Percorra a linha procurando vazamentos, pintura e isolamento danificados, suportes soltos ou corroídos, vibração, desalinhamento e flanges com sinal de vazamento.',
      '<b>Meça a espessura nos CML.</b> Use ultrassom no mesmo ponto marcado de cada vez, para comparar com as medições anteriores. Registre a data, o ponto e a menor leitura.',
      '<b>Calcule a taxa de corrosão.</b> A de longo prazo compara a espessura original com a atual; a de curto prazo compara a medição anterior com a atual. Use a maior das duas.',
      '<b>Calcule a vida remanescente.</b> Vida = (espessura atual − espessura mínima) ÷ taxa de corrosão. A espessura mínima vem do cálculo de pressão do código de projeto (ASME B31.3) ou do mínimo estrutural, o que for maior. O ponto com menor vida define a vida do circuito.',
      '<b>Defina a próxima inspeção.</b> O prazo é o menor entre a metade da vida remanescente e o intervalo máximo da classe. Use a calculadora deste guia.',
      '<b>Avalie, decida e registre.</b> Abaixo da espessura mínima, a linha precisa de avaliação de aptidão ao serviço (API 579), reparo ou troca, sempre com procedimento aprovado. Guarde as medições, os cálculos e as decisões na documentação da instalação, como pede a NR-13.'],
    atencao: ['A corrosão sob isolamento é a falha escondida mais comum: retire o isolamento nos pontos de maior risco em vez de medir só por fora.', 'Pontos mortos e pontos de injeção corroem muito mais rápido que o resto da linha: monitore com mais pontos e mais frequência.', 'Nunca use só a taxa de longo prazo: uma aceleração recente da corrosão aparece apenas na taxa de curto prazo.', 'Reparos e alterações exigem autorização do inspetor responsável, procedimento de soldagem qualificado e, quando aplicável, teste de pressão.', 'No Brasil, as tubulações ligadas a caldeiras e vasos de pressão seguem a NR-13: o plano e os prazos são definidos por profissional habilitado.'],
    refs: [['API 570 — Piping Inspection Code: inspeção, reparo, alteração e reclassificação de tubulações em serviço (edição 2024)', 'https://hydrocarbonprocessing.com/news/2024/02/api-strengthens-piping-inspection-standards-with-new-updates/'], ['API 570: código de inspeção de tubulação (artigo técnico)', 'https://www.normas.com.br/visualizar/artigo-tecnico/4915/api-570-codigo-de-inspecao-de-tubulacao'], ['Intervalos de inspeção das API 510, 570 e 653', 'https://reliamag.com/guides/api-510-570-653-inspection-intervals/'], ['Classes de tubulação da API 570 (1 a 4)', 'https://open-exam-prep.com/study-guides/api-570/inspection-intervals-extent-of-inspection/piping-classifications'], ['Taxa de corrosão, vida remanescente e espessura mínima (API 570)', 'https://open-exam-prep.com/study-guides/api-570/calculations-remaining-life/remaining-life-retirement'], ['NR-13 — Caldeiras, vasos de pressão, tubulações e tanques metálicos', 'https://www.gov.br/trabalho-e-emprego/pt-br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados/comissao-tripartite-partitaria-permanente/normas-regulamentadora/normas-regulamentadoras-vigentes/norma-regulamentadora-no-13-nr-13']],
    videos: [], mats: [['Tubos de aço', 'aco'], ['Conexões para solda', 'conexoes-solda'], ['Flanges', 'flanges'], ['Isolamento térmico', 'isolamento']] },
];

// ---------- erros comuns e patologias ----------
const PATS = [
  { tema: 'Esgoto', sev: 'media', t: 'Mau cheiro no banheiro', sint: 'Cheiro de esgoto que vem do ralo ou do vaso.', causa: 'Fecho hídrico perdido (ralo seco, sifão rompido ou aspirado por falta de ventilação), ou anel de vedação do vaso mal assentado.', sol: 'Garantir caixa sifonada ou ralo sifonado com fecho hídrico, coluna de ventilação ligada ao ramal e anel de vedação novo no vaso. Em ralos pouco usados, colocar água periodicamente.', guia: 'junta-elastica' },
  { tema: 'Esgoto', sev: 'alta', t: 'Retorno de espuma nos andares baixos', sint: 'Espuma subindo pelos ralos dos primeiros pavimentos.', causa: 'Detergente acumula na base do tubo de queda e pressuriza os ramais, quando não há desvio nem ventilação adequada na zona de espuma.', sol: 'Não ligar ramais dos pavimentos inferiores na zona de pressão de espuma; prever desvio e ventilação conforme a NBR 8160.', guia: 'estanq-esgoto' },
  { tema: 'Esgoto', sev: 'media', t: 'Entupimento frequente', sint: 'Pia ou ralo que volta a entupir pouco tempo depois da limpeza.', causa: 'Declividade insuficiente ou "barriga" no ramal, falta de caixa de gordura na cozinha, ou curvas de 90° seguidas.', sol: 'Respeitar a declividade mínima do projeto, usar curvas longas ou dois joelhos de 45°, e instalar caixa de gordura na cozinha.', guia: 'junta-elastica' },
  { tema: 'Água fria e quente', sev: 'alta', t: 'Vazamento em junta soldada', sint: 'Gotejamento ou mancha de umidade na parede, perto de uma conexão.', causa: 'Junta sem lixa ou limpeza, adesivo errado ou vencido, tubo girado no encaixe, ou pressurização antes da cura.', sol: 'Fazer o teste de estanqueidade antes de fechar a parede; se vazar, cortar e refazer a junta (não há "remendo" confiável).', guia: 'solda-pvc' },
  { tema: 'Água fria e quente', sev: 'alta', t: 'Tubo de PVC marrom deformado ou rompido na água quente', sint: 'Tubo amolecido, ovalizado ou com trinca perto do aquecedor ou do chuveiro.', causa: 'PVC de água fria usado em trecho de água quente (inclusive na saída do aquecedor solar ou a gás).', sol: 'Usar CPVC, PPR, PEX ou cobre em toda a rede de água quente, respeitando a temperatura e a pressão de cada material.', guia: 'termofusao' },
  { tema: 'Água fria e quente', sev: 'media', t: 'Barulho e "pancada" ao fechar a torneira', sint: 'Batida seca na tubulação quando um registro ou válvula fecha rápido.', causa: 'Golpe de aríete: pressão alta, velocidade alta da água ou fechamento rápido; tubos mal fixados aumentam o ruído.', sol: 'Reduzir a pressão (válvula redutora), dimensionar para velocidade até 3 m/s, fixar os tubos e, se preciso, instalar amortecedor de golpe.', calc: true },
  { tema: 'Água fria e quente', sev: 'media', t: 'Corrosão na ligação de cobre com aço galvanizado', sint: 'Ferrugem e vazamento na transição entre metais diferentes.', causa: 'Corrosão galvânica: cobre e aço zincado em contato direto, com a água como eletrólito.', sol: 'Usar conexão de transição em bronze ou latão, ou luva isolante (dielétrica) entre os metais.', guia: 'roscas' },
  { tema: 'Água fria e quente', sev: 'media', t: 'Tubo de água fria "suando"', sint: 'Gotas na superfície do tubo e manchas no forro, sem vazamento.', causa: 'Condensação: o tubo frio passa por ambiente quente e úmido (forro, casa de máquinas).', sol: 'Isolar a tubulação com isolamento de célula fechada e barreira de vapor, com as emendas vedadas.' },
  { tema: 'Água fria e quente', sev: 'baixa', t: 'Pouca pressão no chuveiro', sint: 'Chuveiro fraco, especialmente no último andar.', causa: 'Altura insuficiente entre o fundo da caixa e o chuveiro, diâmetro pequeno ou muitas conexões no caminho.', sol: 'Conferir a pressão mínima de projeto, aumentar o diâmetro do barrilete e da coluna ou instalar pressurizador.', calc: true },
  { tema: 'Água fria e quente', sev: 'media', t: 'PPR ou CPVC "serpenteando" na água quente', sint: 'Tubo curvado entre os suportes e conexões forçadas.', causa: 'Dilatação térmica sem liras ou braços de dilatação, e suportes fixos mal posicionados.', sol: 'Prever compensação de dilatação nos trechos longos e alternar pontos fixos e deslizantes conforme o fabricante.', guia: 'termofusao' },
  { tema: 'Reservatórios', sev: 'alta', t: "Água contaminada na caixa d'água", sint: 'Cheiro, cor ou sujeira na água, ou larvas.', causa: 'Caixa sem tampa ou com tampa solta, falta de limpeza, extravasor sem proteção.', sol: 'Tampa travada, tela no extravasor e limpeza com desinfecção a cada 6 meses.', guia: 'caixa' },
  { tema: 'Reservatórios', sev: 'media', t: "Caixa d'água deformada ou trincada", sint: 'Fundo abaulado, parede trincada ou vazando pelo fundo.', causa: 'Base que não apoia todo o fundo (ripas, apoios isolados) ou furos feitos em áreas de reforço.', sol: 'Base plana e contínua e furação só nos pontos indicados pelo fabricante.', guia: 'caixa' },
  { tema: 'Gás', sev: 'alta', t: 'Cheiro de gás perto do aparelho', sint: 'Cheiro de gás no fogão, no aquecedor ou no abrigo do medidor.', causa: 'Junta roscada com vedante inadequado, mangueira vencida ou abraçadeira solta.', sol: 'Fechar o registro, ventilar, não acionar interruptores e chamar a concessionária ou um profissional habilitado. Usar só vedantes e mangueiras certificados para gás.', guia: 'estanq-gas' },
  { tema: 'Metais sanitários', sev: 'baixa', t: 'Descarga que não para de correr', sint: 'Água escorrendo na bacia o tempo todo.', causa: 'Sujeira da obra no reparo, vedação gasta ou regulagem errada.', sol: 'Lavar a rede antes de instalar os reparos e fazer a manutenção do reparo conforme o fabricante.', guia: 'descarga' },
  { tema: 'Testes e entrega', sev: 'alta', t: 'Vazamento descoberto depois do revestimento', sint: 'Mancha aparecendo no andar de baixo ou na parede já revestida.', causa: 'Instalação fechada sem teste de estanqueidade, ou ponto de espera sem bujão durante a obra.', sol: 'Testar cada trecho antes do fechamento, com bujões em todos os pontos de espera, e registrar o teste.', guia: 'estanq-agua' },
];

// ---------- checklist de entrega ----------
const CHECK = [
  ['Testes', ['Teste de estanqueidade da água fria registrado (pressão, duração, responsável)', 'Teste de estanqueidade da água quente registrado', 'Teste do esgoto registrado (água, ar ou fumaça)', 'Teste da rede de gás com laudo e responsável técnico', 'Teste de funcionamento de todos os aparelhos (vazão, escoamento, sem retorno)']],
  ['Instalação', ['Bujões retirados e metais instalados em todos os pontos', 'Fechos hídricos funcionando (sem cheiro)', 'Registros de cada ambiente acessíveis e identificados', "Caixa d'água limpa, tampada e com extravasor visível", 'Tubulações aparentes fixadas e identificadas por cor ou etiqueta']],
  ['Documentos', ['Projeto "como construído" (as built) atualizado', 'Manual de uso, operação e manutenção (NBR 14037)', 'Notas fiscais e garantias dos materiais e equipamentos', 'Plano de manutenção preventiva (NBR 5674)', 'ART ou RRT do projeto e da execução']],
];

(() => {
  const $ = id => document.getElementById(id);
  if (!$('gpGuias')) return;
  const st = { tab: 'guias', tema: null };
  const mat = ([n, s]) => `<a href="/materiais/${s}" data-sheet="mat-${s}">${n}</a>`;
  const videoCard = v => `
    <article class="gpvideo" data-tema="${v.tema}">
      <button type="button" class="gpvideo__thumb" data-yt="${v.id}" aria-label="Assistir: ${v.t}"><img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360"><span class="gpvideo__dur">${v.dur}</span></button>
      <div class="gpvideo__info"><h3>${v.t}</h3><p>${v.d}</p><span class="gpvideo__src">Canal oficial: <b class="notranslate" translate="no">${v.canal}</b></span></div>
    </article>`;
  // Calculadora do guia API 570: taxas de corrosão, vida remanescente e próxima inspeção
  const CALC570 = `
        <div class="gpcalc" data-calc="api570">
          <h4>Calculadora: taxa de corrosão, vida remanescente e próxima inspeção</h4>
          <div class="gpcalc__grid">
            <label>Espessura original (mm)<input type="number" step="0.01" min="0" data-k="t0" value="7.11"></label>
            <label>Espessura na medição anterior (mm)<input type="number" step="0.01" min="0" data-k="tp" value="6.60"></label>
            <label>Espessura atual (mm)<input type="number" step="0.01" min="0" data-k="ta" value="6.20"></label>
            <label>Espessura mínima exigida (mm)<input type="number" step="0.01" min="0" data-k="tm" value="3.40"></label>
            <label>Anos desde a instalação<input type="number" step="0.1" min="0" data-k="alt" value="12"></label>
            <label>Anos desde a medição anterior<input type="number" step="0.1" min="0" data-k="ast" value="4"></label>
            <label>Classe da tubulação<select data-k="cl"><option value="5">Classe 1 (máx. 5 anos)</option><option value="10" selected>Classe 2 (máx. 10 anos)</option><option value="10">Classe 3 (máx. 10 anos)</option></select></label>
          </div>
          <output class="gpcalc__out" aria-live="polite"></output>
          <p class="gpquadro__nota">Ferramenta de apoio: a decisão final é do inspetor ou do profissional habilitado, com os dados e a edição vigente da norma.</p>
        </div>`;
  const calc570 = box => {
    const v = k => parseFloat(box.querySelector(`[data-k="${k}"]`).value.replace(',', '.'));
    const [t0, tp, ta, tm, alt, ast, cl] = ['t0', 'tp', 'ta', 'tm', 'alt', 'ast', 'cl'].map(v);
    const out = box.querySelector('.gpcalc__out'), n = (x, d = 3) => x.toLocaleString('pt-BR', { maximumFractionDigits: d });
    if ([t0, tp, ta, tm, alt, ast, cl].some(x => !isFinite(x)) || alt <= 0 || ast <= 0) { out.innerHTML = 'Preencha todos os campos com números maiores que zero.'; return; }
    if (ta <= tm) { out.innerHTML = '<b class="gpcalc__alerta">A espessura atual já está na espessura mínima ou abaixo dela.</b> A linha precisa de avaliação de aptidão ao serviço (API 579), reparo ou troca antes de continuar operando.'; return; }
    const lt = Math.max(0, (t0 - ta) / alt), st = Math.max(0, (tp - ta) / ast), cr = Math.max(lt, st);
    const vida = cr > 0 ? (ta - tm) / cr : Infinity, prox = Math.min(vida / 2, cl);
    out.innerHTML = `<span>Taxa de longo prazo: <b>${n(lt)} mm/ano</b></span><span>Taxa de curto prazo: <b>${n(st)} mm/ano</b></span><span>Taxa adotada (a maior): <b>${n(cr)} mm/ano</b></span>` +
      `<span>Vida remanescente: <b>${isFinite(vida) ? n(vida, 1) + ' anos' : 'sem corrosão medida'}</b></span>` +
      `<span class="gpcalc__prox">Próxima medição de espessura: <b>em até ${n(prox, 1)} anos</b> (${prox === cl ? 'intervalo máximo da classe' : 'metade da vida remanescente'})</span>`;
  };
  const guiaHTML = g => `
    <details class="gpguide" id="${g.id}" data-tema="${[g.tema, ...(g.tema2 || [])].join('|')}">
      <summary>
        <h3>${g.titulo}</h3><span class="gpguide__chev" aria-hidden="true">▾</span>
        <p>${g.resumo}</p>
        <span class="gpguide__meta"><span class="gppill gppill--tema">${g.tema}</span><span class="gppill">⏱ ${g.tempo}</span><span class="gppill">${g.nivel}</span><span class="gppill">${g.norma}</span></span>
      </summary>
      <div class="gpguide__body">${g.fig || ''}${(g.quadros || []).map(q => `
        <div class="gpquadro"><h4>${q.titulo}</h4><div class="gpquadro__wrap"><table><thead><tr>${q.cols.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${q.linhas.map(l => `<tr>${l.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${q.nota ? `<p class="gpquadro__nota">${q.nota}</p>` : ''}</div>`).join('')}${g.calc === 'api570' ? CALC570 : ''}${(g.tabelas || []).map(t => `
        <div class="gpcores"><h4>${t.titulo}</h4><ul>${t.linhas.map(([hex, cor, uso]) => `<li><span class="gpcor" style="--c:${hex}" aria-hidden="true"></span><b>${cor}</b><span>${uso}</span></li>`).join('')}</ul></div>`).join('')}${g.tabelas ? `
        <p class="gpcores__nota">Cores na tela aproximadas; o padrão de cada cor (código Munsell) está na norma.</p>` : ''}
        <ol class="gpsteps">${g.passos.map(p => `<li>${p}</li>`).join('')}</ol>
        <div class="gpguide__side">
          <div class="gpbox"><h4>Separe antes</h4><ul>${g.separar.map(x => `<li>${x}</li>`).join('')}</ul></div>
          <div class="gpbox gpbox--warn"><h4>Atenção</h4><ul>${g.atencao.map(x => `<li>${x}</li>`).join('')}</ul></div>
          ${g.videos.length ? `<div class="gpbox"><h4>Vídeo do fabricante</h4><ul>${g.videos.map(k => `<li><a href="https://www.youtube.com/watch?v=${VIDEOS[k].id}" target="_blank" rel="noopener noreferrer">${VIDEOS[k].t}</a> · <span class="notranslate" translate="no">${VIDEOS[k].canal}</span></li>`).join('')}</ul></div>` : ''}
          ${g.refs ? `<div class="gpbox"><h4>Referências</h4><ul>${g.refs.map(([t, u]) => `<li><a href="${u}" target="_blank" rel="noopener noreferrer">${t}</a></li>`).join('')}</ul></div>` : ''}
          <div class="gpbox"><h4>Materiais</h4><ul>${g.mats.map(m => `<li>${mat(m)}</li>`).join('')}</ul></div>
        </div>
        <p class="gpguide__foot">Revisado pela Equipe Técnica PipeSystem · Fabricante, quer apresentar este guia? <a href="#anuncie">Anuncie aqui</a></p>
      </div>
    </details>`;
  const patHTML = p => `
    <article class="gppat" data-tema="${p.tema}">
      <span class="gppill gppat__sev gpsev--${p.sev}">Gravidade ${{ alta: 'alta', media: 'média', baixa: 'baixa' }[p.sev]}</span>
      <h3>${p.t}</h3>
      <dl><dt>Sintoma</dt><dd>${p.sint}</dd><dt>Causa provável</dt><dd>${p.causa}</dd><dt>Como evitar ou corrigir</dt><dd>${p.sol}</dd></dl>
      ${p.guia ? `<a href="#${p.guia}">Ver o passo a passo →</a>` : ''}${p.calc ? `<a href="#ferramentas">Calcular no Dimensionamento →</a>` : ''}
    </article>`;

  $('gpGuias').innerHTML = GUIAS.map(guiaHTML).join('');
  $('gpGuias').querySelectorAll('[data-calc="api570"]').forEach(box => { calc570(box); box.addEventListener('input', () => calc570(box)); });
  $('gpVideos').innerHTML = Object.values(VIDEOS).map(videoCard).join('');
  $('gpPats').innerHTML = PATS.map(patHTML).join('');
  $('gpCheck').innerHTML = CHECK.map(([t, itens]) => `<div><h3>${t}</h3>${itens.map(i => `<label><input type="checkbox"> <span>${i}</span></label>`).join('')}</div>`).join('') +
    `<div class="gpcheck__foot"><span id="gpCheckCount"></span><button type="button" class="btn btn--sm" id="gpPrint">Imprimir checklist</button></div>`;
  const countCheck = () => { const all = $('gpCheck').querySelectorAll('input'), ok = [...all].filter(i => i.checked).length; $('gpCheckCount').textContent = `${ok} de ${all.length} itens conferidos`; };
  $('gpCheck').addEventListener('change', countCheck); countCheck();
  $('gpPrint').addEventListener('click', () => {
    document.body.classList.add('gp-printing');
    addEventListener('afterprint', () => document.body.classList.remove('gp-printing'), { once: true });
    print();
  });

  // abas e filtro de tema
  const TABS = [['guias', 'Passo a passo', GUIAS.length], ['videos', 'Vídeos', Object.keys(VIDEOS).length], ['pats', 'Erros e patologias', PATS.length], ['check', 'Checklist de entrega', ''], ['glossario', 'Glossário', GLOSSARIO.length]];
  $('gpTabs').innerHTML = TABS.map(([k, n, c]) => `<button type="button" role="tab" class="gptab" data-tab="${k}" aria-selected="${k === st.tab}">${n}${c ? ` <small>${c}</small>` : ''}</button>`).join('');
  $('gpTemas').innerHTML = GP_TEMAS.map(t => `<button type="button" class="gptema" data-tema="${t}" aria-pressed="false">${t}</button>`).join('');
  const show = () => {
    TABS.forEach(([k]) => { $('gp-' + k).hidden = k !== st.tab; });
    $('gpTabs').querySelectorAll('.gptab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === st.tab));
    $('gpTemas').hidden = st.tab === 'check' || st.tab === 'glossario';
    const box = $('gp-' + st.tab);
    let n = 0;
    box.querySelectorAll('[data-tema]').forEach(el => { const on = !st.tema || el.dataset.tema.split('|').includes(st.tema); el.hidden = !on; n += on; });
    box.querySelector('.gpempty')?.remove();
    if (!n && st.tab !== 'check' && st.tab !== 'glossario') box.insertAdjacentHTML('beforeend', '<p class="gpempty">Ainda não há conteúdo deste tema nesta aba.</p>');
  };
  const setTema = t => { st.tema = t; $('gpTemas').querySelectorAll('.gptema').forEach(x => x.setAttribute('aria-pressed', x.dataset.tema === st.tema)); };
  $('gpTabs').addEventListener('click', e => { const b = e.target.closest('.gptab'); if (b) { st.tab = b.dataset.tab; show(); } });
  $('gpTemas').addEventListener('click', e => { const b = e.target.closest('.gptema'); if (b) { setTema(st.tema === b.dataset.tema ? null : b.dataset.tema); show(); } });
  show();
  // termos do glossário sublinhados nos passos e nas patologias
  document.querySelectorAll('.gpguide__body, .gppat dl').forEach(el => glossarize(el, { max: 6 }));

  // Links para um guia ou uma aba (submenu, "Ver o passo a passo"): mostra a aba certa e abre o guia
  // antes de o roteador das seções (script.js) rolar até ele — por isso na fase de captura
  const reveal = id => {
    const el = document.getElementById(id);
    if (!el || !el.closest('#guias')) return;
    const panel = el.matches('[role=tabpanel]') ? el : el.closest('[role=tabpanel]');
    if (!panel) return;
    st.tab = panel.id.slice(3); setTema(null); show();
    if (el.matches('details')) el.open = true;
  };
  document.addEventListener('click', e => { const a = e.target.closest('a[href^="#"]'); if (a) reveal(a.getAttribute('href').slice(1)); }, true);
  if (location.hash) reveal(location.hash.slice(1));

  // vídeo só carrega no clique (youtube-nocookie, sem cookies até o play)
  $('gpVideos').addEventListener('click', e => {
    const b = e.target.closest('[data-yt]'); if (!b) return;
    b.outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0" title="Vídeo" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  });
})();
