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
  { id: 'cheiro-esgoto', tema: 'Esgoto', tema2: ['Metais sanitários'], titulo: 'Cheiro de esgoto em casa: como achar a origem e resolver', resumo: 'Quase sempre é um fecho hídrico seco, um sifão sem curva ou uma saída de máquina sem vedação.',
    tempo: '30 minutos a 2 horas', nivel: 'Básico', norma: 'NBR 8160',
    separar: ['Lanterna', 'Balde com água', 'Anel de vedação para vaso sanitário, se for o caso', 'Vedação de borracha ou adaptador para a saída da máquina', 'Sifão novo, se o atual for reto ou estiver trincado'],
    passos: ['<b>Descubra de onde vem o cheiro.</b> Cheire de perto cada ralo, pia, tanque e vaso sanitário do ambiente. O cheiro é mais forte junto da peça com problema.',
      '<b>Ralos pouco usados:</b> a água que fica dentro do ralo sifonado (o fecho hídrico) é o que segura o cheiro, e ela evapora. Em ralos de áreas pouco usadas, jogue água periodicamente, por exemplo uma vez por semana.',
      '<b>Pias e lavatórios:</b> confira se o sifão faz a curva que guarda água. Sifão reto, esticado demais ou sem água deixa o cheiro voltar. A NBR 8160 pede fecho hídrico de no mínimo 50 mm.',
      '<b>Máquina de lavar roupa ou louça:</b> não basta encaixar a mangueira de descarga no cano da parede. A mangueira costuma ser mais fina e sobra uma folga em volta, por onde o cheiro sai. Vede essa folga com uma vedação de borracha ou um adaptador próprio para a saída da máquina.',
      '<b>Vaso sanitário:</b> cheiro na base do vaso indica anel de vedação gasto ou mal assentado. Trocar o anel resolve.',
      '<b>Se o cheiro continuar:</b> confira as tampas das caixas de inspeção e de gordura e, nos prédios e casas maiores, a ventilação do esgoto, que mantém a água dos sifões no lugar quando outro aparelho descarrega.'],
    atencao: ['Desinfetante e aromatizante só disfarçam: o cheiro volta enquanto a causa continuar.', 'Ralo comum (sem sifão) ligado direto ao esgoto sempre deixa passar cheiro: troque por ralo sifonado ou caixa sifonada.', 'Cheiro que aparece só quando outro aparelho descarrega (o ralo "borbulha") costuma ser falta de ventilação: nesse caso, chame um encanador ou o projetista.'],
    videos: [], mats: [['Sifões', 'sifoes'], ['Ralos', 'ralos']] },
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
    separar: ['Projeto ou lista dos fluidos de cada linha, com pressão e temperatura', 'Tinta de fundo compatível com o tubo (para galvanizado, fundo de aderência próprio; veja a ficha Tintas para tubulações aparentes)', 'Tinta de acabamento nas cores da norma', 'Fita adesiva para faixas, gabarito de setas e etiquetas ou estêncil para os rótulos', 'Material de limpeza: desengraxante e lixa'],
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
    videos: [], mats: [['Tintas para tubulações aparentes', 'tintas-tubulacoes'], ['Tubos de aço-carbono e galvanizado', 'aco'], ['Tubos e conexões de PPR', 'ppr'], ['Isolamento térmico de tubulações', 'isolamento']] },
  { id: 'fossa-fortlev', tema: 'Esgoto', tema2: ['Testes e entrega'], titulo: 'Fossa séptica e biodigestor Fortlev: escolha e instalação completa', resumo: 'Informe pessoas, tipo de imóvel, destino do esgoto e local: o guia indica modelo, acessórios e materiais, e mostra a instalação passo a passo.',
    tempo: 'Alguns dias de obra', nivel: 'Instalador e responsável técnico', norma: 'NBR 17076 · NBR 8160',
    chaves: ['fossa séptica', 'fossa', 'fossa Fortlev', 'fossa séptica Fortlev', 'instalar fossa', 'instalação de fossa', 'tamanho de fossa', 'fossa para quantas pessoas', 'biodigestor', 'biodigestor Fortlev', 'Biodigestor MAX', 'tanque séptico', 'sumidouro', 'vala de infiltração', 'Vala Fortlev', 'leito de secagem', 'caixa de gordura', 'esgoto sem rede', 'tratamento de esgoto', 'esgoto rural', 'filtro anaeróbio', 'clorador', 'pastilha de cloro', 'lodo', 'laje de fechamento', '700 L/dia', '1.500 L/dia', 'NBR 17076', 'NBR 7229', 'NBR 13969', 'Fortlev'],
    fig: `<figure class="gpfig gpfig--golpe"><svg viewBox="0 0 420 300" role="img" font-family="inherit" aria-label="Esquema em corte: o esgoto da casa passa pela caixa de gordura quando vem da cozinha, chega à fossa enterrada, sai tratado para a vala de infiltração ou o sumidouro; o lodo vai para o leito de secagem e o gás sai por um tubo acima do telhado."><rect x="0" y="118" width="420" height="182" fill="#efe4d3"/><path d="M0 118H420" stroke="#7b6a52" stroke-width="2"/><path d="M14 118V70L48 44L82 70V118Z" fill="#fff" stroke="#3d4a58" stroke-width="2"/><text x="48" y="96" font-size="13" text-anchor="middle" fill="#1b2a3a">Casa</text><path d="M48 118V132H100" fill="none" stroke="#6b7682" stroke-width="5"/><rect x="88" y="112" width="30" height="30" fill="#d6dde4" stroke="#3d4a58"/><text x="103" y="158" font-size="13" text-anchor="middle" fill="#1b2a3a">Caixa de</text><text x="103" y="174" font-size="13" text-anchor="middle" fill="#1b2a3a">gordura</text><path d="M118 132H160" stroke="#6b7682" stroke-width="5"/><path d="M160 118H224V236Q224 262 192 262Q160 262 160 236Z" fill="#bcdcf5" stroke="#1b2a3a" stroke-width="2"/><rect x="176" y="110" width="32" height="8" rx="2" fill="#2d7fd3"/><rect x="164" y="154" width="56" height="28" fill="#8fb4d6" opacity=".7"/><text x="192" y="173" font-size="12" text-anchor="middle" fill="#0a2240">Filtro</text><text x="192" y="206" font-size="13" text-anchor="middle" fill="#0a2240">Fossa ou</text><text x="192" y="222" font-size="12" text-anchor="middle" fill="#0a2240">biodigestor</text><rect x="134" y="262" width="116" height="10" fill="#9aa6b2" stroke="#4a5563"/><text x="124" y="280" font-size="13" text-anchor="middle" fill="#3d4a58">Base de concreto</text><path d="M198 110V30H150" fill="none" stroke="#7a8794" stroke-width="3"/><text x="146" y="27" font-size="13" text-anchor="end" fill="#1b2a3a">Saída do gás</text><text x="146" y="42" font-size="12" text-anchor="end" fill="#3d4a58">acima do telhado</text><path d="M224 140H292" stroke="#6b7682" stroke-width="5"/><path d="M292 160Q292 132 340 132Q388 132 388 160V172H292Z" fill="#dfeaf3" stroke="#1b2a3a" stroke-width="2"/><rect x="284" y="172" width="112" height="14" fill="#a6a39b"/><text x="340" y="112" font-size="13" text-anchor="middle" fill="#1b2a3a">Vala de infiltração</text><text x="340" y="200" font-size="12" text-anchor="middle" fill="#3d4a58">ou sumidouro (com brita)</text><path d="M224 246H270" stroke="#6b7682" stroke-width="4"/><rect x="270" y="222" width="70" height="44" fill="#d9cfbd" stroke="#1b2a3a" stroke-width="2"/><circle cx="278" cy="246" r="5" fill="#c0392b"/><text x="352" y="240" font-size="13" fill="#1b2a3a">Leito de</text><text x="352" y="256" font-size="13" fill="#1b2a3a">secagem</text><text x="305" y="284" font-size="12" text-anchor="middle" fill="#3d4a58">lodo, com registro dentro</text></svg><figcaption>Esquema simplificado PipeSystem, sem escala, com base nos manuais da Fortlev. A cozinha passa pela caixa de gordura; o tubo de lodo segue reto até o registro, sem curvas.</figcaption></figure>`,
    calc: 'fossa',
    quadros: [
      { titulo: 'Quantas pessoas cada modelo atende (manuais Fortlev)', cols: ['Tipo de ocupação', 'Esgoto (L/pessoa/dia)', '700 L/dia', '1.500 L/dia'], linhas: [
        ['Residência de alto consumo', '160', '4', '9'],
        ['Residência de médio consumo', '130', '5', '11'],
        ['Residência de baixo consumo', '100', '7', '15'],
        ['Hotel (sem lavanderia e cozinha)', '100', '7', '15'],
        ['Alojamento provisório', '80', '8', '18'],
        ['Fábrica em geral', '70', '10', '21'],
        ['Escritório', '50', '14', '30'],
        ['Edifício público ou comercial', '50', '14', '30'],
      ], nota: 'Vale para a Fossa Séptica e para o Biodigestor MAX. Acima de 1.500 L/dia, a Fortlev orienta instalar equipamentos em paralelo.' },
      { titulo: 'Medidas de instalação (manuais Fortlev)', cols: ['Modelo', 'Altura (m)', 'Corpo (m)', 'Cava sem laje', 'Cava com laje', 'Base: Ø mínimo', 'Leito: volume'], linhas: [
        ['Fossa Séptica 700 L/dia', '1,74', '0,89', '1,84 m', '2,04 m', '0,44 m', '140 L'],
        ['Fossa Séptica 1.500 L/dia', '1,96', '1,23', '2,06 m', '2,26 m', '0,54 m', '300 L'],
        ['Biodigestor MAX 700 L/dia', '1,47', '0,95', '1,57 m', '1,77 m', '1,55 m', '140 L'],
        ['Biodigestor MAX 1.500 L/dia', '1,78', '1,30', '1,88 m', '2,08 m', '1,55 m', '300 L'],
      ], nota: 'A base de concreto tem pelo menos 0,10 m de espessura, já incluída na profundidade da cava. Deixe pelo menos 0,30 m livres em volta do equipamento. Volume do leito de secagem medido entre o registro e o fundo. Confira sempre o manual da revisão do seu produto.' },
    ],
    separar: ['Responsável técnico da obra e a orientação do órgão ambiental sobre o destino do esgoto tratado', 'Levantamento de redes de água, luz e gás no local da escavação', 'Sondagem do lençol freático e teste de percolação, se o esgoto for para o solo', 'Equipamento, leito de secagem e, se houver cozinha, caixa de gordura', 'Tubos e conexões de esgoto DN 100, tubo soldável de 60 mm para o lodo e tubo para o gás', 'Concreto e malha de aço para a base; cimento e terra peneirada, areia ou pó de brita para o aterro; brita', 'Serra-copo de 64 mm para o leito Fortlev, nível, soquete manual e água para o teste'],
    passos: ['<b>Defina o destino do esgoto tratado.</b> As opções citadas pela Fortlev são vala de infiltração, canteiro de infiltração, galeria de águas pluviais, corpo d\'água, sumidouro, reuso ou rede coletora. Quem decide é o órgão ambiental municipal; se não houver, procure o estadual ou a prefeitura.',
      '<b>Escolha o local.</b> O responsável técnico avalia o solo, o lençol freático e a permeabilidade. Recomenda-se ficar a 3 m da casa. O manual, citando a NBR 7229, pede 1,5 m de construções, ramal de água, divisas, sumidouros e valas; 3 m de árvores e da rede pública de água; 15 m de poços e corpos d\'água. O manual da Vala Fortlev pede 3 m do equipamento até a vala.',
      '<b>Escave.</b> Verifique antes as redes enterradas. Faça o talude com a inclinação definida pelo responsável técnico e use a profundidade da tabela. Em garagem ou passagem constante, escave 20 cm a mais para a laje de fechamento.',
      '<b>Faça a base.</b> Concreto com malha de aço, superfície lisa e nivelada, com pelo menos 0,10 m de espessura e o diâmetro da tabela.',
      '<b>Posicione o equipamento.</b> Desça pelas alças até o centro da base. Nunca role, arraste ou segure pelas tubulações.',
      '<b>Ligue o leito de secagem.</b> Construa a 30 cm do equipamento. O tubo de lodo não pode ter curva, joelho ou redução, e o registro fica dentro do leito. No leito Fortlev, fure com serra-copo de 64 mm na marca do modelo, faça cava de 0,8 m de profundidade (1 m com laje) e 1,11 m de diâmetro, com 5 cm de terra aparente ou brita no fundo.',
      '<b>Instale o tubo de gás.</b> Leve a saída de gás com tubo, e não com mangueira, até acima do telhado ou para longe da circulação de pessoas. Use ralos sifonados e sifões e vede bem o vaso sanitário para evitar cheiro.',
      '<b>Aterre em etapas.</b> Use mistura seca de 1 parte de cimento para 10 de terra peneirada, areia ou pó de brita. Encha até o início do corpo cilíndrico. Coloque água até a metade do equipamento e aterre até essa altura, compactando à mão em camadas de 25 cm, sem impactos.',
      '<b>Teste a estanqueidade.</b> Encha com água até a saída e aguarde 24 horas. Verifique se o nível variou ou se há vazamento. Só então ligue o esgoto e conclua o aterro até cobrir o tubo de entrada, sem enterrar a tampa.',
      '<b>Faça o destino final.</b> Vala Fortlev: no mínimo 2 módulos por equipamento, fundo a pelo menos 1,5 m do nível máximo do lençol, 10 cm de brita no fundo e nas laterais, no máximo 30 m por linha, sem tráfego de veículos e com tubo de exaustão telado. Sumidouro: a Fortlev não lista esse produto; ele é executado na obra e dimensionado pelo teste de percolação, conforme a NBR 17076.',
      '<b>Coloque em operação.</b> Para iniciar, basta o esgoto: não jogue produto químico ou biológico. No biodigestor, coloque 1 pastilha de cloro de 200 g no clorador a cada 15 dias.',
      '<b>Retire o lodo a cada 6 meses.</b> Abra o registro no leito, feche quando o lodo parar de sair e voltar a sair líquido claro. No biodigestor, lave o interior com jato de água a cada 3 extrações, sem tirar o material filtrante. Seco, o lodo vai para aterro sanitário ou, neutralizado com cal, pode ter uso agrícola nas condições da legislação indicada no manual.'],
    atencao: ['O equipamento precisa ficar totalmente enterrado, só com a tampa aparente.', 'Em área com lençol freático, procure o departamento técnico da Fortlev antes de comprar e instalar.', 'Vala de infiltração não pode ficar em lençol raso nem sob tráfego de veículos.', 'Nunca ligue equipamentos em série: use caixa de passagem e divida o esgoto igualmente, em paralelo.', 'Laje de fechamento: o projeto é do responsável técnico, com tampa de inspeção e sem acúmulo de chuva sobre a tampa.', 'Não jogue absorventes, embalagens ou restos de comida. Evite desinfetante, detergente e desodorizador nos vasos sanitários.', 'Nunca retire o elemento filtrante.', 'Frio intenso e uso intermitente podem reduzir a eficiência do tratamento.', 'Esgoto tratado não é água potável: nunca beba.', 'Poço ou fossa aberta oferece risco de gases e queda: não entre sem procedimento de segurança.'],
    refs: [['Manual técnico da Fossa Séptica Fortlev (ago/2024)', 'https://www.fortlev.com.br/wp-content/uploads/2024/08/manual_tecnico_fortlev_fossa-septica.pdf.pdf'], ['Manual do Biodigestor MAX 700 L/dia (set/2026)', 'https://www.fortlev.com.br/wp-content/uploads/2026/10/Manual-Biodigestor-Fortlev-700L_Rev_Set26.pdf'], ['Manual do Biodigestor MAX 1.500 L/dia (set/2026)', 'https://www.fortlev.com.br/wp-content/uploads/2026/10/Manual-Biodigestor-Fortlev-1.500L_Rev_Set26.pdf'], ['Manual da Vala de Infiltração Fortlev (jan/2024)', 'https://www.fortlev.com.br/wp-content/uploads/2024/06/9000003325_Manual_Vala_Infiltracao_148x210mm_digital.pdf'], ['Leito de Secagem Fortlev', 'https://www.fortlev.com.br/produtos/meio-ambiente/leito-de-secagem-fortlev/']],
    videos: [], mats: [['Tanques sépticos, filtros e biodigestores', 'fossa'], ['Tubos e conexões de PVC para esgoto', 'pvc-esgoto'], ['Caixas de inspeção e gordura', 'caixas-inspecao']] },
  { id: 'golpe-ariete', tema: 'Água fria e quente', tema2: ['Indústria'], titulo: 'Golpe de aríete: como funciona na prática', resumo: 'Desenho animado da onda de pressão, o que faz a pancada na tubulação, um exemplo com números e como evitar.',
    tempo: 'Consulta', nivel: 'Instalador e projetista', norma: 'NBR 5626 · NBR 12215',
    chaves: ['golpe de aríete', 'golpe de ariete', 'water hammer', 'martelo hidráulico', 'pancada na tubulação', 'barulho no cano', 'batida no cano', 'sobrepressão', 'subpressão', 'transiente hidráulico', 'onda de pressão', 'celeridade', 'Joukowsky', 'Michaud', 'período crítico', '2L/a', 'fechamento rápido', 'fechamento lento', 'amortecedor de golpe', 'válvula antecipadora', 'separação de coluna', 'parada de bomba', 'demonstrativo animado', 'animação golpe de aríete', 'NBR 12215'],
    fig: `<figure class="gpfig gpfig--golpe"><svg viewBox="0 0 420 508" role="img" font-family="inherit" aria-label="Desenho animado do golpe de aríete: água corre de um reservatório até uma válvula; a válvula fecha de repente; uma onda de alta pressão sobe até o reservatório, volta, vira onda de baixa pressão, e o ciclo se repete perdendo força enquanto o manômetro e o gráfico mostram a pressão na válvula."><g opacity="1"><animate attributeName="opacity" values="1;0;1" keyTimes="0.0000;0.1429;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><text x="4" y="22" font-size="19" font-weight="700" fill="#1f6fb2">Água correndo</text><text x="4" y="46" font-size="16" fill="#3d4a58">A válvula está aberta. A água anda com</text><text x="4" y="66" font-size="16" fill="#3d4a58">velocidade e pressão normais.</text></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.1429;0.3095;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><text x="4" y="22" font-size="19" font-weight="700" fill="#c0392b">1. A válvula fecha de repente</text><text x="4" y="46" font-size="16" fill="#3d4a58">A água junto à válvula para e é comprimida. A</text><text x="4" y="66" font-size="16" fill="#3d4a58">onda de alta pressão sobe, e o tubo incha.</text></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.3095;0.4762;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><text x="4" y="22" font-size="19" font-weight="700" fill="#c0392b">2. A onda bate no reservatório e volta</text><text x="4" y="46" font-size="16" fill="#3d4a58">A pressão volta ao normal, e a água começa a</text><text x="4" y="66" font-size="16" fill="#3d4a58">voltar para o reservatório.</text></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.4762;0.6429;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><text x="4" y="22" font-size="19" font-weight="700" fill="#7a4fb5">3. Falta água junto à válvula</text><text x="4" y="46" font-size="16" fill="#3d4a58">A água que volta deixa uma onda de baixa</text><text x="4" y="66" font-size="16" fill="#3d4a58">pressão, e o tubo se contrai. Há risco de</text><text x="4" y="86" font-size="16" fill="#3d4a58">vácuo.</text></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.6429;0.8095;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><text x="4" y="22" font-size="19" font-weight="700" fill="#7a4fb5">4. A água torna a descer</text><text x="4" y="46" font-size="16" fill="#3d4a58">O reservatório empurra a água de novo até a</text><text x="4" y="66" font-size="16" fill="#3d4a58">válvula, que segue fechada. O ciclo recomeça.</text></g><g opacity="0"><animate attributeName="opacity" values="0;1;0" keyTimes="0.0000;0.8095;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><text x="4" y="22" font-size="19" font-weight="700" fill="#3d4a58">O ciclo se repete e perde força</text><text x="4" y="46" font-size="16" fill="#3d4a58">A cada ida e volta, o atrito gasta a energia,</text><text x="4" y="66" font-size="16" fill="#3d4a58">até a água parar.</text></g><rect x="4" y="128" width="52" height="84" fill="#d6ebfa" stroke="#4a5563" stroke-width="2"/><path d="M4 138H56" stroke="#2f80ed" stroke-width="2"/><text x="4" y="230" font-size="13" fill="#3d4a58">Reservatório</text><rect x="56" y="146" width="300" height="40" fill="#bcdcf5"/><rect x="56" y="140" width="300" height="6" fill="#6b7682"/><rect x="56" y="186" width="300" height="6" fill="#6b7682"/><rect y="134" height="64" fill="#6b7682" x="356" width="0"><animate attributeName="x" values="356;356;70;356;356" keyTimes="0.0000;0.1429;0.3095;0.4762;1.0000" dur="21s" repeatCount="indefinite"/><animate attributeName="width" values="0;0;286;0;0" keyTimes="0.0000;0.1429;0.3095;0.4762;1.0000" dur="21s" repeatCount="indefinite"/></rect><rect y="140" height="52" fill="#f08a7b" x="356" width="0"><animate attributeName="x" values="356;356;70;356;356" keyTimes="0.0000;0.1429;0.3095;0.4762;1.0000" dur="21s" repeatCount="indefinite"/><animate attributeName="width" values="0;0;286;0;0" keyTimes="0.0000;0.1429;0.3095;0.4762;1.0000" dur="21s" repeatCount="indefinite"/></rect><rect y="146" height="40" fill="#6b7682" x="356" width="0"><animate attributeName="x" values="356;356;70;356;356" keyTimes="0.0000;0.4762;0.6429;0.8095;1.0000" dur="21s" repeatCount="indefinite"/><animate attributeName="width" values="0;0;286;0;0" keyTimes="0.0000;0.4762;0.6429;0.8095;1.0000" dur="21s" repeatCount="indefinite"/></rect><rect y="153" height="26" fill="#d9c9f2" x="356" width="0"><animate attributeName="x" values="356;356;70;356;356" keyTimes="0.0000;0.4762;0.6429;0.8095;1.0000" dur="21s" repeatCount="indefinite"/><animate attributeName="width" values="0;0;286;0;0" keyTimes="0.0000;0.4762;0.6429;0.8095;1.0000" dur="21s" repeatCount="indefinite"/></rect><rect y="132" width="5" height="68" rx="2" fill="#1b2a3a" x="356" opacity="0"><animate attributeName="x" values="356;356;70;356;70;356;356" keyTimes="0.0000;0.1429;0.3095;0.4762;0.6429;0.8095;1.0000" dur="21s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0.0000;0.1424;0.1429;0.8095;0.8100;1.0000" dur="21s" repeatCount="indefinite"/></rect><g opacity="1"><animate attributeName="opacity" values="1;0;1;0;0" keyTimes="0.0000;0.2967;0.6557;0.8571;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M84 158.0L96 166.0L84 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.3223;0.6300;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M100 158.0L88 166.0L100 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="1"><animate attributeName="opacity" values="1;0;1;0;0" keyTimes="0.0000;0.2623;0.6901;0.8571;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M143 158.0L155 166.0L143 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.3567;0.5957;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M159 158.0L147 166.0L159 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="1"><animate attributeName="opacity" values="1;0;1;0;0" keyTimes="0.0000;0.2279;0.7244;0.8571;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M202 158.0L214 166.0L202 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.3911;0.5613;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M218 158.0L206 166.0L218 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="1"><animate attributeName="opacity" values="1;0;1;0;0" keyTimes="0.0000;0.1936;0.7588;0.8571;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M261 158.0L273 166.0L261 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.4255;0.5269;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M277 158.0L265 166.0L277 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="1"><animate attributeName="opacity" values="1;0;1;0;0" keyTimes="0.0000;0.1592;0.7932;0.8571;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M320 158.0L332 166.0L320 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><g opacity="0"><animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.4599;0.4925;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/><path d="M336 158.0L324 166.0L336 174.0" fill="none" stroke="#14507f" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><animateTransform attributeName="transform" type="translate" values="-5 0;5 0;-5 0" dur=".9s" repeatCount="indefinite"/></path></g><rect x="356" y="130" width="26" height="72" rx="4" fill="#4a5563"/><rect x="367" y="102" width="4" height="28" fill="#4a5563"/><rect x="352" y="96" width="34" height="7" rx="3" fill="#c0392b"/><rect x="362" y="112" width="14" height="40" rx="2" fill="#d6dde4" stroke="#1b2a3a"><animate attributeName="y" values="112;112;146;146;112" keyTimes="0.0000;0.1405;0.1476;0.9810;1.0000" dur="21s" repeatCount="indefinite"/></rect><text x="369" y="230" font-size="13" text-anchor="middle" fill="#3d4a58">Válvula</text><rect x="382" y="146" width="38" height="40" fill="#bcdcf5"/><rect x="382" y="140" width="38" height="6" fill="#6b7682"/><rect x="382" y="186" width="38" height="6" fill="#6b7682"/><g font-size="13" fill="#3d4a58"><rect x="4" y="250" width="14" height="11" fill="#f08a7b"/><text x="22" y="260">alta pressão</text><rect x="134" y="250" width="14" height="11" fill="#bcdcf5" stroke="#8aa"/><text x="152" y="260">normal</text><rect x="222" y="250" width="14" height="11" fill="#d9c9f2"/><text x="240" y="260">baixa pressão</text></g><text x="4" y="290" font-size="16" font-weight="700" fill="#1b2a3a">Pressão na válvula ao longo do tempo</text><path d="M56 306V442H414" fill="none" stroke="#4a5563" stroke-width="1.5"/><path d="M56 374H414" stroke="#8a97a5" stroke-dasharray="5 5"/><text x="48" y="379" font-size="13" text-anchor="end" fill="#3d4a58">normal</text><text x="48" y="325" font-size="13" text-anchor="end" fill="#c0392b">alta</text><text x="48" y="433" font-size="13" text-anchor="end" fill="#7a4fb5">baixa</text><clipPath id="golpeClip"><rect x="56" y="304" height="140" width="0"><animate attributeName="width" values="0;358" keyTimes="0.0000;1.0000" dur="21s" repeatCount="indefinite"/></rect></clipPath><path d="M56.0 374.0L107.1 374.0L107.1 320.0L226.5 320.0L226.5 428.0L345.8 428.0L345.8 335.1L355.6 335.1L355.6 402.0L365.3 402.0L365.3 353.8L375.0 353.8L375.0 388.5L384.8 388.5L384.8 363.6L394.5 363.6L394.5 381.5L404.3 381.5L404.3 368.6L414.0 368.6L414.0 374.0" fill="none" stroke="#c0392b" stroke-width="3" stroke-linejoin="round" clip-path="url(#golpeClip)"/><rect y="306" width="2" height="136" fill="#1b2a3a" x="56"><animate attributeName="x" values="56;414" keyTimes="0.0000;1.0000" dur="21s" repeatCount="indefinite"/></rect><text x="414" y="462" font-size="13" text-anchor="end" fill="#3d4a58">tempo →</text><path d="M107.1 442v6M226.5 442v6" stroke="#4a5563" stroke-width="1.5"/><text x="107.1" y="462" font-size="13" text-anchor="middle" fill="#3d4a58">fecha</text><text x="226.5" y="462" font-size="13" text-anchor="middle" fill="#3d4a58">+ 2L/a</text><text x="210" y="494" font-size="16" font-weight="700" text-anchor="middle" fill="#1f6fb2" opacity="1">Pressão na válvula: normal<animate attributeName="opacity" values="1;0;1" keyTimes="0.0000;0.1429;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/></text><text x="210" y="494" font-size="16" font-weight="700" text-anchor="middle" fill="#c0392b" opacity="0">Pressão na válvula: muito alta<animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.1429;0.4762;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/></text><text x="210" y="494" font-size="16" font-weight="700" text-anchor="middle" fill="#7a4fb5" opacity="0">Pressão na válvula: muito baixa<animate attributeName="opacity" values="0;1;0;0" keyTimes="0.0000;0.4762;0.8095;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/></text><text x="210" y="494" font-size="16" font-weight="700" text-anchor="middle" fill="#3d4a58" opacity="0">Pressão na válvula: oscila até estabilizar<animate attributeName="opacity" values="0;1;0" keyTimes="0.0000;0.8095;1.0000" dur="21s" repeatCount="indefinite" calcMode="discrete"/></text></svg><figcaption>Desenho esquemático PipeSystem, sem escala e bem mais lento que a realidade: em um tubo de aço, a onda percorre mais de 1.000 metros por segundo, e cada ida e volta em 100 m dura cerca de 0,15 segundo. Mostra o fechamento instantâneo, sem contar o atrito até o último quadro.</figcaption></figure>`,
    quadros: [
      { titulo: 'Exemplo: água a 2 m/s parando em uma linha de 100 m', cols: ['Tubo', 'Celeridade (a)', 'Período crítico (2L/a)', 'Fechamento rápido', 'Fechamento em 5 s'], linhas: [
        ['Aço-carbono (DI 102 mm, parede 6,0 mm)', '1.365 m/s', '0,15 s', '278 mca', '8,2 mca'],
        ['PVC (DI 100 mm, parede 5,0 mm)', '375 m/s', '0,53 s', '76 mca', '8,2 mca'],
        ['PEAD (DI 90 mm, parede 8,2 mm)', '289 m/s', '0,69 s', '59 mca', '8,2 mca'],
      ], nota: 'Fechamento rápido é o que termina antes do período crítico: ΔH = a · V / g (Joukowsky). Acima dele: ΔH = 2 · L · V / (g · T) (Michaud). Cálculo com a mesma base da calculadora do site, que despreza o atrito, para mostrar a ordem de grandeza. 10 mca equivalem a cerca de 1 kgf/cm². Dimensões ilustrativas: use as do seu tubo.' },
    ],
    separar: ['Vazão e velocidade da água na linha', 'Comprimento do trecho até o reservatório ou a bomba', 'Material, diâmetro interno e parede do tubo', 'Tempo de fechamento das válvulas e pressão de classe da tubulação'],
    passos: ['<b>Reconheça o sintoma.</b> Pancada seca ao fechar torneira ou válvula, tubo que vibra, junta que vaza depois de manobras, ou conexão que rompe quando a bomba desliga.',
      '<b>Entenda a causa.</b> A água em movimento tem massa e velocidade. Parada de repente, essa energia vira pressão e corre pela linha como uma onda, batendo e voltando.',
      '<b>Calcule o tamanho do golpe.</b> Use a <a href="/dimensionamento#calculadoras">calculadora de golpe de aríete</a> para achar a celeridade, o período crítico e a pressão máxima, e compare com a classe do tubo.',
      '<b>Feche mais devagar.</b> O fechamento mais longo que o período crítico reduz muito o golpe. Em linhas longas, prefira volante, redutor ou atuador lento a uma alavanca de 1/4 de volta.',
      '<b>Reduza a velocidade da água.</b> O golpe cresce junto com a velocidade. Na instalação predial, a referência usual é não passar de 3 m/s. Se preciso, aumente o diâmetro.',
      '<b>Reduza a pressão e fixe os tubos.</b> Em pressão alta, use válvula redutora. Tubo bem fixado não bate na parede: isso corta o barulho, mas não elimina a sobrepressão.',
      '<b>Instale proteção onde o cálculo pedir.</b> Amortecedor de golpe perto das válvulas de fechamento rápido. Em recalques e adutoras: válvula de retenção adequada, ventosas nos pontos altos, válvula antecipadora, volante de inércia ou reservatório hidropneumático.',
      '<b>Em adutoras e recalques, faça a análise de transientes.</b> Um cálculo simples não basta: confirme a proteção por modelo de transientes, como orienta a NBR 12215, considerando a parada brusca da bomba por falta de energia.'],
    atencao: ['A fase de baixa pressão também é perigosa: pode chegar ao vácuo, separar a coluna de água e amassar tubos de parede fina, e o reencontro da coluna gera novo golpe.', 'Tubo mais flexível (PVC, PEAD) tem golpe menor, mas não está livre dele: confira a classe de pressão.', 'A onda não depende do tamanho da válvula: uma válvula pequena de fechamento rápido também produz o golpe, desde que pare a água do trecho.', 'Os valores deste guia são de apoio. Instalações críticas pedem projeto de engenheiro habilitado.'],
    refs: [['Limitações da equação de Joukowsky em sistemas reais (Blucher Proceedings)', 'https://www.proceedings.blucher.com.br/article-details/joukoskys-equation-limitations-in-its-application-for-real-systems-39884'], ['Análise do golpe de aríete em adutora com ramificação (Revista DAE, Sabesp)', 'https://doi.org/10.36659/dae.2020.058'], ['Soluções para transitórios hidráulicos: fechamento rápido e lento (Ministério da Agricultura da Espanha, em espanhol)', 'https://mapa.gob.es/images/ca/presentacionseiasasolucionestransitorios13mar2019_tcm34-505109.pdf']],
    videos: [], mats: [['Ventosas e válvulas de alívio', 'ventosas'], ['Válvulas de retenção', 'retencao'], ['Válvulas redutoras de pressão', 'redutora']] },
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
  { tema: 'Água fria e quente', sev: 'media', t: 'Barulho e "pancada" ao fechar a torneira', sint: 'Batida seca na tubulação quando um registro ou válvula fecha rápido.', causa: 'Golpe de aríete: pressão alta, velocidade alta da água ou fechamento rápido; tubos mal fixados aumentam o ruído.', sol: 'Reduzir a pressão (válvula redutora), dimensionar para velocidade até 3 m/s, fixar os tubos e, se preciso, instalar amortecedor de golpe. Veja o guia animado <a href="/guias-praticos#golpe-ariete">Golpe de aríete: como funciona na prática</a>.', calc: true },
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
const CHECK_ENTREGA = [
  ['Testes', ['Teste de estanqueidade da água fria registrado (pressão, duração, responsável)', 'Teste de estanqueidade da água quente registrado', 'Teste do esgoto registrado (água, ar ou fumaça)', 'Teste da rede de gás com laudo e responsável técnico', 'Teste de funcionamento de todos os aparelhos (vazão, escoamento, sem retorno)']],
  ['Instalação', ['Bujões retirados e metais instalados em todos os pontos', 'Fechos hídricos funcionando (sem cheiro)', 'Registros de cada ambiente acessíveis e identificados', "Caixa d'água limpa, tampada e com extravasor visível", 'Tubulações aparentes fixadas e identificadas por cor ou etiqueta']],
  ['Documentos', ['Projeto "como construído" (as built) atualizado', 'Manual de uso, operação e manutenção (NBR 14037)', 'Notas fiscais e garantias dos materiais e equipamentos', 'Plano de manutenção preventiva (NBR 5674)', 'ART ou RRT do projeto e da execução']],
];
// Checklists da obra, do recebimento à entrega: [id, nome, texto de abertura, grupos]
const CHECKS = [
  ['recebimento', 'Recebimento de materiais', 'Na chegada de cada entrega, antes de assinar o canhoto: confira o que veio, o estado das peças e onde guardar.', [
    ['Documento e identificação', ['Nota fiscal confere com o pedido: fabricante, linha, bitola, classe ou PN e quantidade', 'Marcação do fabricante no tubo legível: norma, bitola, classe e lote', 'Conexões da mesma linha e do mesmo fabricante do tubo (sistemas soldáveis, roscáveis e de termofusão)', 'Ficha técnica ou certificado do fabricante para válvulas, bombas e equipamentos']],
    ['Inspeção visual', ['Tubos sem trincas, amassados, ovalização ou deformação nas pontas', 'Bolsas e roscas sem rebarbas nem quebras', 'Anéis de borracha presentes, limpos e sem ressecamento', 'Válvulas e registros abrem e fecham sem travar', 'Adesivos, solventes e pastas dentro da validade']],
    ['Armazenamento', ['Tubos plásticos apoiados em toda a extensão e protegidos do sol', 'Altura das pilhas dentro do limite indicado pelo fabricante', 'Conexões em caixas, longe de solventes e combustíveis', 'Adesivos e solventes em local ventilado e fechado', 'Tubos metálicos sobre calços, longe da umidade e do contato com o solo']],
  ]],
  ['agua', 'Execução: água fria e quente', 'Para conferir cada pavimento antes de fechar paredes e forros.', [
    ['Antes de começar', ['Projeto aprovado e compatibilizado com estrutura, elétrica e climatização', 'Furos e passagens previstos no projeto, sem cortar armaduras', 'Traçado, bitolas e registros marcados conforme o projeto']],
    ['Montagem', ['Tubo cortado no esquadro, sem rebarba e com chanfro na ponta (soldável)', 'Ponta e bolsa lixadas e limpas antes do adesivo (PVC e CPVC)', 'Tempo de aquecimento e encaixe do fabricante respeitados (PPR)', 'Rosca feita com ferramenta própria para o material, vedada com fita veda-rosca', 'Abraçadeiras no espaçamento indicado pelo fabricante', 'Liras ou juntas de dilatação na água quente', 'Isolamento térmico na água quente', 'Distância das tubulações de gás e dos eletrodutos respeitada', 'Pontos de espera fechados com bujão']],
    ['Antes de fechar', ['Ensaio de estanqueidade feito e registrado (relatório de ensaio)', 'Fotos com trena do traçado nas paredes, para o as built', 'Registros acessíveis e identificados']],
  ]],
  ['esgoto', 'Execução: esgoto e águas pluviais', 'Para conferir ramais, tubos de queda e coletores antes de fechar shafts, forros e valas.', [
    ['Montagem', ['Declividade conforme o projeto: no mínimo 2% em ramais de até 75 mm e 1% a partir de 100 mm (NBR 8160)', 'Junta elástica com anel e pasta lubrificante, sem adesivo, onde a linha pede', 'Caixas sifonadas e ralos com fecho hídrico', 'Ventilação ligada como no projeto, sem ralos sem ventilação', 'Tubos de queda no prumo e fixados em cada pavimento', 'Pontos de espera fechados com tampão de teste']],
    ['Separação e acesso', ['Esgoto e águas pluviais em redes separadas', 'Peças de inspeção e caixas acessíveis', 'Caixa de gordura na saída das pias de cozinha']],
    ['Antes de fechar', ['Ensaio com água, ar ou fumaça feito e registrado', 'Escoamento conferido em todos os aparelhos', 'Fotos do traçado para o as built']],
  ]],
  ['gas', 'Execução: gás', 'Rede interna de gás natural ou GLP (NBR 15526): conferência antes de liberar o abastecimento.', [
    ['Materiais e equipe', ['Instalador habilitado e responsável técnico com ART', 'Tubos, conexões e reguladores próprios para gás', 'Flexíveis de aparelho dentro da norma e da validade']],
    ['Montagem', ['Abrigo de medidores e reguladores ventilado e de fácil acesso', 'Registro de corte em cada aparelho e na entrada da unidade', 'Distância de eletrodutos, tomadas e pontos de ignição respeitada', 'Tubulação aparente identificada (amarelo ou a palavra GÁS, conforme a norma)', 'Ambientes com aparelhos a gás com ventilação permanente']],
    ['Liberação', ['Ensaio de estanqueidade com laudo e responsável técnico', 'Purga da rede antes do primeiro uso', 'Aparelhos testados com chama estável']],
  ]],
  ['incendio', 'Execução: incêndio', 'Hidrantes, mangotinhos e sprinklers conforme o projeto aprovado no Corpo de Bombeiros.', [
    ['Montagem', ['Hidrantes e mangotinhos nas posições do projeto aprovado', 'Abrigos sinalizados, desobstruídos e com o kit completo (mangueiras, esguicho, chave storz)', 'Mangueiras e válvulas com certificação exigida', 'Prumadas e barriletes fixados, com acoplamentos ranhurados ou roscas conforme o projeto', 'Sprinklers no espaçamento do projeto, com defletor livre e sem pintura nos bicos', 'Hidrante de recalque acessível e sinalizado']],
    ['Ensaios', ['Ensaio hidrostático da rede feito e registrado', 'Bomba de incêndio com partida automática testada', 'Válvula de governo e alarme dos sprinklers testados', 'Reserva técnica de incêndio com o volume do projeto']],
    ['Documentos', ['Projeto como construído (as built) da rede de incêndio', 'Vistoria do Corpo de Bombeiros (AVCB ou CLCB)', 'Plano de inspeção e manutenção (NBR 12779 para mangueiras)']],
  ]],
  ['entrega', 'Entrega da obra', 'Para fechar a obra com tudo testado e documentado, como pedem a NBR 15575-6 (desempenho) e a NBR 14037 (manual de uso e manutenção).', CHECK_ENTREGA],
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
  // Seletor do guia de fossa e biodigestor Fortlev: dados dos manuais do fabricante
  const CALCFOSSA = `
        <div class="gpcalc" data-calc="fossa">
          <h4>Monte o seu sistema: modelo, acessórios e materiais</h4>
          <div class="gpcalc__grid">
            <label>Pessoas no imóvel<input type="number" min="1" step="1" data-k="n" value="5"></label>
            <label>Tipo e consumo de água<select data-k="c"><option value="160">Residência de alto consumo</option><option value="130" selected>Residência de médio consumo</option><option value="100">Residência de baixo consumo</option><option value="100">Hotel (sem lavanderia e cozinha)</option><option value="80">Alojamento provisório</option><option value="70">Fábrica em geral</option><option value="50">Escritório</option><option value="50">Edifício público ou comercial</option></select></label>
            <label>Destino do esgoto tratado<select data-k="d"><option value="vala">Vala de infiltração no solo</option><option value="sum">Sumidouro</option><option value="outro">Rio, galeria, reuso ou rede coletora</option></select></label>
            <label>Equipamento<select data-k="e"><option value="auto">Sugerir para mim</option><option value="fossa">Fossa Séptica (fossa e filtro)</option><option value="bio">Biodigestor MAX (com filtro e clorador)</option></select></label>
            <label>Onde será instalado<select data-k="l"><option value="livre">Jardim ou área sem carga</option><option value="laje">Garagem ou passagem constante</option></select></label>
            <label>Lençol freático<select data-k="f"><option value="fundo">Profundo (confirmado)</option><option value="raso">Raso ou com água na cava</option><option value="nao">Ainda não sei</option></select></label>
            <label>Retirada do lodo<select data-k="s"><option value="leito">Leito de Secagem Fortlev</option><option value="alv">Leito de alvenaria</option><option value="cam">Caminhão limpa-fossa</option></select></label>
            <label>Tem pia de cozinha?<select data-k="g"><option value="s">Sim</option><option value="n">Não</option></select></label>
            <label>Distância da casa ao equipamento (m)<input type="number" min="0" step="0.5" data-k="x" value="3"></label>
            <label>Taxa de aplicação do solo (L/m²·dia)<input type="number" min="0" step="1" data-k="t" placeholder="do teste de percolação"></label>
          </div>
          <output class="gpcalc__res" aria-live="polite"></output>
          <p class="gpquadro__nota">Pré-seleção de apoio com os limites e medidas dos manuais Fortlev. Volumes aproximados, sem contar o talude. A sugestão entre fossa e biodigestor é orientação do PipeSystem, não do fabricante. A decisão final é do responsável técnico e do órgão ambiental.</p>
        </div>`;
  const FOSSA_MOD = { fossa: { nome: 'Fossa Séptica', url: { 700: 'fossa-septica-700-l-de-esgoto-por-dia', 1500: 'fossa-septica-1-500-l-de-esgoto-por-dia' }, 700: { h: 1.74, d: 0.89, c: 1.84, b: 0.44, v: 140 }, 1500: { h: 1.96, d: 1.23, c: 2.06, b: 0.54, v: 300 } },
    bio: { nome: 'Biodigestor MAX', url: { 700: 'biodigestor-700l-esgoto-por-dia', 1500: 'biodigestor-1500l-esgoto-dia' }, 700: { h: 1.47, d: 0.95, c: 1.57, b: 1.55, v: 140 }, 1500: { h: 1.78, d: 1.30, c: 1.88, b: 1.55, v: 300 } } };
  const calcFossa = box => {
    const k = c => box.querySelector(`[data-k="${c}"]`).value, out = box.querySelector('.gpcalc__res');
    const n = (x, d = 1) => x.toLocaleString('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: d });
    const N = Math.floor(+k('n')), C = +k('c');
    if (!(N > 0)) { out.innerHTML = '<b class="gpcalc__alerta">Informe o número de pessoas.</b>'; return; }
    const Q = N * C, tipo = k('e') === 'auto' ? (k('d') === 'outro' ? 'bio' : 'fossa') : k('e'), M = FOSSA_MOD[tipo];
    // Em paralelo o esgoto se divide em partes iguais: todos os equipamentos precisam ser do mesmo modelo
    const de700 = Q <= 700 ? 1 : 0, de1500 = de700 ? 0 : Math.ceil(Q / 1500);
    const un = de1500 + de700, lista = [...Array(de1500).fill(1500), ...Array(de700).fill(700)], cap = de1500 * 1500 + de700 * 700, laje = k('l') === 'laje' ? 0.2 : 0;
    const nomeMod = m => `<a href="https://www.fortlev.com.br/produtos/meio-ambiente/${M.url[m]}/" target="_blank" rel="noopener noreferrer">${M.nome} ${m === 1500 ? '1.500' : '700'} L/dia</a>`;
    const modelos = [de1500 ? `${de1500} × ${nomeMod(1500)}` : '', de700 ? `${de700} × ${nomeMod(700)}` : ''].filter(Boolean).join(' + ');
    const area = d => Math.PI * d * d / 4;
    let cava = 0, base = 0, aterro = 0; lista.forEach(m => { const s = M[m], h = s.c + laje, D = s.d + 0.6; cava += area(D) * h; base += area(s.b) * 0.1; aterro += area(D) * h - area(s.d) * s.h - area(s.b) * 0.1; });
    const cim = Math.ceil(aterro / 11 / 0.036), tubos = Math.ceil((Math.max(+k('x') || 0, 0) + 3 * un + (un > 1 ? 2 * un : 0)) / 3);
    const mat = [`<b>${modelos}</b> (acompanha registro de esfera soldável de 60 mm)`];
    if (un > 1) mat.push('1 caixa de passagem para dividir o esgoto igualmente, com um tubo DN 100 para cada equipamento (nunca em série)');
    if (k('g') === 's') mat.push('Caixa de gordura na saída da cozinha, antes do equipamento');
    mat.push(`Cerca de ${tubos} tubos de esgoto DN 100 de 3 m, mais joelhos e junções do traçado`, 'Caixa com grelha antes do equipamento (recomendada, para reter descartes acidentais)', 'Tubo para o gás até acima do telhado, sem mangueira');
    if (k('s') === 'leito') mat.push(`${un} Leito de Secagem Fortlev (podem ser separados), 1 tubo soldável de 60 mm reto e cerca de ${n(un * area(0.81) * 0.05 * 1000, 0)} L de brita ou terra no fundo`);
    if (k('s') === 'alv') mat.push(`Leito de alvenaria sem revestimento, com fundo de terra ou brita e tampa de inspeção: ${lista.map(m => M[m].v + ' L').join(' e ')} entre o registro e o fundo; tubo soldável de 60 mm reto`);
    if (k('s') === 'cam') mat.push('Sem leito: o caminhão limpa-fossa succiona o lodo pelo tubo guia DN 100; mantenha acesso para ele');
    mat.push(`Base: cerca de ${n(base, 2)} m³ de concreto com malha de aço`, `Aterro: cerca de ${n(aterro)} m³ de mistura seca (1 de cimento para 10 de terra peneirada, areia ou pó de brita), com ${cim} sacos de 50 kg de cimento`);
    if (laje) mat.push('Laje de fechamento com tampa de inspeção, projetada pelo responsável técnico');
    if (tipo === 'bio') mat.push('Pastilhas de cloro de 200 g: 1 a cada 15 dias, cerca de 24 por ano em cada equipamento');
    const avisos = [], Ta = +k('t'), Ai = Ta > 0 ? Q / Ta : 0;
    if (k('d') === 'vala') {
      const minimo = 2 * un, mods = Ai ? Math.max(minimo, Math.ceil(Ai / (0.88 * 1.77))) : minimo;
      mat.push(`Vala de Infiltração Fortlev: ${Ai ? `cerca de ${mods} módulos para ${n(Ai)} m² de área de fundo` : `no mínimo ${minimo} módulos; a quantidade final sai do teste de percolação`}, brita e tubo de exaustão com tela`);
      if (k('l') === 'laje') avisos.push('A vala não pode ficar sob tráfego de veículos: coloque-a fora da garagem.');
      if (k('f') === 'raso') avisos.push('Com lençol raso, o manual proíbe a vala de infiltração: o fundo precisa ficar a pelo menos 1,5 m do nível máximo do lençol.');
    }
    if (k('d') === 'sum') {
      if (Ai) { const D = 1.5, h = (Ai - area(D)) / (Math.PI * D); mat.push(`Sumidouro executado na obra (a Fortlev não lista esse produto): ${n(Ai)} m² de área de infiltração; com Ø 1,50 m, cerca de ${n(Math.max(h, 0.5), 2)} m de altura útil, contando fundo e parede. Anéis perfurados ou alvenaria, brita e tampa, conforme o projeto`); if (h > 3) avisos.push('Sumidouro muito profundo: avalie dividir em mais de uma unidade e confira a distância até o lençol.'); }
      else mat.push('Sumidouro executado na obra (a Fortlev não lista esse produto): informe a taxa de aplicação do teste de percolação para estimar a área');
      if (k('f') === 'raso') avisos.push('Com lençol raso, o sumidouro é desaconselhado: confira a solução com o responsável técnico e o órgão ambiental.');
    }
    if (k('d') === 'outro') avisos.push('Lançar em rio, galeria, reuso ou rede depende de autorização e dos padrões do órgão ambiental. Confirme antes de comprar.');
    if (k('f') === 'raso') avisos.push('Com lençol freático, a Fortlev pede contato com o departamento técnico antes da instalação.');
    if (k('f') === 'nao') avisos.push('Descubra a profundidade do lençol antes de comprar: ela pode mudar o destino do esgoto e a instalação.');
    if (+k('x') < 3) avisos.push('A Fortlev recomenda instalar a pelo menos 3 m da residência.');
    if (un > 1) avisos.push('Mais de um equipamento: a Fortlev orienta ligação em paralelo, com o esgoto dividido em partes iguais. Tire dúvidas com o fabricante.');
    const m0 = M[lista[0]];
    out.innerHTML = `<div class="gpfossa__top"><span>Esgoto estimado<b>${n(Q, 0)} L/dia</b></span><span>Capacidade indicada<b>${n(cap, 0)} L/dia</b></span><span>Folga<b>${n((1 - Q / cap) * 100, 0)}%</b></span><span>Cava${un > 1 ? ' do maior' : ''}<b>${n(m0.c + laje, 2)} m × Ø ${n(m0.d + 0.6, 2)} m</b></span></div>
      <h5>O que comprar e separar</h5><ul>${mat.map(x => `<li>${x}</li>`).join('')}</ul>${avisos.length ? `<h5>Atenção neste caso</h5><ul class="gpfossa__alertas">${avisos.map(x => `<li>${x}</li>`).join('')}</ul>` : ''}`;
  };
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
      <div class="gpguide__body">${g.fig || ''}${g.calc === 'fossa' ? CALCFOSSA : ''}${(g.quadros || []).map(q => `
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
  $('gpGuias').querySelectorAll('[data-calc="fossa"]').forEach(box => { calcFossa(box); box.addEventListener('input', () => calcFossa(box)); });
  $('gpVideos').innerHTML = Object.values(VIDEOS).map(videoCard).join('');
  $('gpPats').innerHTML = PATS.map(patHTML).join('');
  // checklists: um seletor no alto e a lista escolhida (as marcações de cada uma ficam guardadas ao trocar)
  let ckAtual = CHECKS[0][0];
  const ckMarcas = {};
  const desenhaCheck = () => {
    const [id, nome, lead, grupos] = CHECKS.find(c => c[0] === ckAtual), marc = ckMarcas[id] || [];
    let k = 0;
    $('gpCheck').innerHTML = `<p class="gpcheck__lead"><b>${nome}.</b> ${lead}</p>` + grupos.map(([t, itens]) => `<div><h3>${t}</h3>${itens.map(i => `<label><input type="checkbox" data-k="${k}"${marc[k++] ? ' checked' : ''}> <span>${i}</span></label>`).join('')}</div>`).join('') +
      `<div class="gpcheck__foot"><span id="gpCheckCount"></span><button type="button" class="btn btn--sm" id="gpPrint">Imprimir checklist</button></div>`;
    countCheck();
  };
  const countCheck = () => { const all = $('gpCheck').querySelectorAll('input'), ok = [...all].filter(i => i.checked).length; $('gpCheckCount').textContent = `${ok} de ${all.length} itens conferidos`; };
  $('gpCheckSel').innerHTML = CHECKS.map(([id, nome]) => `<button type="button" class="gpcheck__chip" data-ck="${id}" aria-pressed="${id === ckAtual}">${nome}</button>`).join('');
  $('gpCheckSel').addEventListener('click', e => {
    const b = e.target.closest('[data-ck]'); if (!b) return;
    ckAtual = b.dataset.ck;
    $('gpCheckSel').querySelectorAll('[data-ck]').forEach(x => x.setAttribute('aria-pressed', x === b));
    desenhaCheck();
  });
  $('gpCheck').addEventListener('change', e => { (ckMarcas[ckAtual] ||= [])[+e.target.dataset.k] = e.target.checked; countCheck(); });
  desenhaCheck();
  $('gpCheck').addEventListener('click', e => {
    if (!e.target.closest('#gpPrint')) return;
    document.body.classList.add('gp-printing');
    addEventListener('afterprint', () => document.body.classList.remove('gp-printing'), { once: true });
    print();
  });

  // Relatório de ensaio de estanqueidade: o responsável preenche e imprime (nada é enviado)
  const ENSAIO_NORMA = { 'Água fria': 'NBR 5626', 'Água quente': 'NBR 5626', 'Esgoto sanitário': 'NBR 8160', 'Águas pluviais': 'NBR 10844', 'Gás': 'NBR 15526', 'Hidrantes e mangotinhos': 'NBR 13714', 'Sprinklers': 'NBR 10897', 'Outro': '' };
  const ensLinha = () => `<tr><td><input type="text" aria-label="Trecho ou pavimento"></td><td><input type="text" aria-label="Pressão de ensaio"></td><td><input type="text" aria-label="Duração"></td><td><input type="text" aria-label="Leitura inicial"></td><td><input type="text" aria-label="Leitura final"></td><td><select aria-label="Resultado"><option></option><option>Aprovado</option><option>Reprovado</option></select></td></tr>`;
  if ($('gpEnsaio')) {
    $('ensSistema').innerHTML = Object.keys(ENSAIO_NORMA).map(k => `<option>${k}</option>`).join('');
    const normaEns = () => { $('ensNorma').value = ENSAIO_NORMA[$('ensSistema').value]; };
    $('ensSistema').addEventListener('change', normaEns); normaEns();
    $('ensData').value = new Date().toISOString().slice(0, 10);
    $('ensRows').innerHTML = ensLinha() + ensLinha() + ensLinha();
    $('ensMais').addEventListener('click', () => $('ensRows').insertAdjacentHTML('beforeend', ensLinha()));
    $('ensPrint').addEventListener('click', () => {
      // só o relatório vai para a impressão (regras de print-ens em styles.css)
      document.body.classList.add('gp-printing-ens');
      addEventListener('afterprint', () => document.body.classList.remove('gp-printing-ens'), { once: true });
      print();
    });
  }

  // abas e filtro de tema
  const TABS = [['guias', 'Passo a passo', GUIAS.length], ['videos', 'Vídeos', Object.keys(VIDEOS).length], ['pats', 'Erros e patologias', PATS.length], ['check', 'Checklists e ensaios', CHECKS.length], ...(typeof DETALHES !== 'undefined' ? [['detalhes', 'Detalhes típicos', DETALHES.length]] : []), ['precos', 'Preços', PRECOS.itens.length], ['glossario', 'Glossário', GLOSSARIO.length]];
  $('gpTabs').innerHTML = TABS.map(([k, n, c]) => `<button type="button" role="tab" class="gptab" data-tab="${k}"${k === 'detalhes' || k === 'precos' ? ' data-novo' : ''} aria-selected="${k === st.tab}">${n}${c ? ` <small>${c}</small>` : ''}</button>`).join('');
  $('gpTemas').innerHTML = GP_TEMAS.map(t => `<button type="button" class="gptema" data-tema="${t}" aria-pressed="false">${t}</button>`).join('');
  const show = () => {
    TABS.forEach(([k]) => { $('gp-' + k).hidden = k !== st.tab; });
    $('gpTabs').querySelectorAll('.gptab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === st.tab));
    $('gpTemas').hidden = ['check', 'glossario', 'precos', 'detalhes'].includes(st.tab);
    const box = $('gp-' + st.tab);
    let n = 0;
    box.querySelectorAll('[data-tema]').forEach(el => { const on = !st.tema || el.dataset.tema.split('|').includes(st.tema); el.hidden = !on; n += on; });
    box.querySelector('.gpempty')?.remove();
    if (!n && !['check', 'glossario', 'precos', 'detalhes'].includes(st.tab)) box.insertAdjacentHTML('beforeend', '<p class="gpempty">Ainda não há conteúdo deste tema nesta aba.</p>');
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
  window.addEventListener('hashchange', () => { const id = location.hash.slice(1); reveal(id); if (/^detalhe-/.test(id)) document.getElementById(id)?.scrollIntoView(); });

  // vídeo só carrega no clique (youtube-nocookie, sem cookies até o play)
  $('gpVideos').addEventListener('click', e => {
    const b = e.target.closest('[data-yt]'); if (!b) return;
    b.outerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${b.dataset.yt}?autoplay=1&rel=0" title="Vídeo" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
  });
})();
