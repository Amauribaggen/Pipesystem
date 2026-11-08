// Conteúdo aprofundado dos termos do glossário, usado só nas páginas /glossario/<id> (não vai para o navegador junto com o glossario.js).
// Campos, todos opcionais: pratica (texto), valores ([[item, valor]]), exemplo (texto), erros ([texto]).
export const GLOSSARIO_EXTRA = {
  cavitacao: {
    pratica: 'Para evitar a cavitação, a energia disponível na sucção (NPSH disponível, ou NPSHd) precisa superar a exigida pela bomba (NPSH requerido, ou NPSHr, informado na curva do fabricante), com folga. O risco cresce com água quente, porque a pressão de vapor sobe, e em altitude, porque a pressão atmosférica cai.',
    valores: [['Pressão de vapor da água a 20 °C', '≈ 0,24 mca'], ['Pressão de vapor da água a 60 °C', '≈ 2,0 mca'], ['Pressão de vapor da água a 80 °C', '≈ 4,9 mca'], ['Pressão atmosférica ao nível do mar', '≈ 10,3 mca'], ['Pressão atmosférica a 1.000 m de altitude', '≈ 9,2 mca']],
    exemplo: 'Bomba ao nível do mar, água a 20 °C, nível do líquido 3 m abaixo do eixo e 1,0 m de perda de carga na sucção: NPSHd = 10,3 − 0,24 − 3,0 − 1,0 ≈ 6,1 mca. Essa bomba serve se o NPSHr no ponto de operação for menor que esse valor, com margem de segurança (é comum adotar ao menos 0,5 m).',
    erros: ['Usar redução concêntrica na sucção horizontal, o que forma bolsa de ar; o indicado é a excêntrica, com o lado reto para cima.', 'Regular a vazão estrangulando a válvula da sucção; o ajuste deve ser feito no recalque.', 'Instalar curva logo na entrada da bomba, o que desequilibra o fluxo no rotor.', 'Calcular o NPSHd com água fria quando o sistema trabalha com água quente.'],
  },
  mca: {
    pratica: 'A pressão em mca depende apenas da altura da coluna de água, não do diâmetro do tubo nem do volume do reservatório. É por isso que basta a diferença de nível para estimar a pressão estática em um ponto de consumo. Com a água em movimento, a pressão disponível diminui conforme a perda de carga do trecho.',
    valores: [['1 mca', '≈ 9,81 kPa'], ['10 mca', '≈ 98 kPa ≈ 0,98 bar'], ['1 bar', '≈ 10,2 mca'], ['1 kgf/cm²', '= 10 mca'], ['1 psi', '≈ 0,70 mca'], ['Limites usuais em água fria (confira a edição vigente da NBR 5626)', 'estática até 40 mca; dinâmica mínima de 1 mca nos pontos']],
    exemplo: 'Um chuveiro 15 m abaixo do nível do reservatório tem pressão estática de 15 mca, cerca de 147 kPa. Se o trecho perde 4 mca com a água correndo, restam cerca de 11 mca no ponto.',
    erros: ['Considerar que um reservatório maior aumenta a pressão; o que aumenta é a altura.', 'Comparar a pressão estática com a mínima exigida pelo aparelho, sem descontar a perda de carga.', 'Trocar bar por mca sem converter em especificações de válvulas e bombas.'],
  },
  'numero-de-reynolds': {
    pratica: 'O número de Reynolds indica qual método usar no cálculo da perda de carga. Nas instalações prediais e industriais de água, o escoamento é quase sempre turbulento. O regime laminar costuma aparecer com fluidos viscosos, como óleos, ou com velocidades muito baixas. Como a viscosidade da água cai com o aquecimento, o Reynolds sobe em circuitos de água quente.',
    valores: [['Re abaixo de cerca de 2.000', 'escoamento laminar'], ['Re entre 2.000 e 4.000', 'zona de transição, instável'], ['Re acima de 4.000', 'escoamento turbulento'], ['Viscosidade cinemática da água a 20 °C', '≈ 1,0 × 10⁻⁶ m²/s'], ['Viscosidade cinemática da água a 60 °C', '≈ 0,47 × 10⁻⁶ m²/s']],
    exemplo: 'Água a 20 °C a 1,5 m/s em tubo com diâmetro interno de 50 mm: Re = V × D / ν = 1,5 × 0,05 / 0,000001 = 75.000, escoamento turbulento.',
    erros: ['Usar o diâmetro nominal em vez do diâmetro interno real do tubo.', 'Aplicar valores de viscosidade da água a óleos, glicol ou polpas.', 'Usar f = 64 / Re fora do regime laminar.'],
  },
  retrossifonagem: {
    pratica: 'Acontece quando falta água na rede ou há uma demanda brusca, a pressão cai abaixo da atmosférica e o ponto de consumo passa a sugar o que estiver em contato com a saída. A proteção mais segura é manter um espaço de ar entre a saída de água e o nível máximo do recipiente (separação atmosférica). Onde isso não é possível, entram dispositivos como quebradores de vácuo e válvulas antirrefluxo, escolhidos pelo risco de contaminação.',
    valores: [['Situações típicas de risco', 'mangueira imersa em tanque ou piscina, ducha higiênica dentro da bacia, bacia com válvula de descarga sem quebra-vácuo, equipamentos de laboratório ou hospital'], ['Diferença para o refluxo por contrapressão', 'na retrossifonagem, a causa é subpressão na rede; na contrapressão, a pressão a jusante supera a da rede']],
    erros: ['Deixar a saída de água da torneira ou do tanque abaixo do nível de transbordamento.', 'Confiar em uma válvula de retenção simples em pontos de alto risco sanitário.', 'Ligar água de poço ou de reúso a uma rede potável, o que cria conexão cruzada.', 'Deixar a mangueira com a ponta submersa em baldes ou tanques.'],
  },
  'bomba-jockey': {
    pratica: 'Sem a jockey, qualquer microvazamento derrubaria a pressão da rede e acionaria a bomba principal à toa. Ela é pequena, de baixa vazão e alta pressão, e parte antes da principal. O escalonamento das pressões garante essa ordem de partida. Partidas muito frequentes costumam indicar vazamento na rede, e o caminho é localizá-lo, não trocar a bomba.',
    valores: [['Parada da jockey (referência do anexo da NFPA 20)', 'pressão de fechamento da bomba principal + pressão estática mínima de sucção'], ['Partida da jockey', 'cerca de 0,7 bar (10 psi) abaixo da parada'], ['Partida da bomba principal', 'cerca de 0,35 bar (5 psi) abaixo da partida da jockey'], ['Vazão', 'suficiente para repor os vazamentos admissíveis da rede, sem atender a um hidrante ou sprinkler aberto']],
    erros: ['Ajustar os pressostatos com diferença pequena, fazendo a principal partir junto com a jockey.', 'Superdimensionar a jockey a ponto de ela mascarar a abertura de um sprinkler.', 'Ignorar um número alto de partidas por dia.', 'Não testar periodicamente a sequência de partida.'],
  },
  'valvula-redutora': {
    pratica: 'É usada onde a pressão ultrapassa o limite dos pontos de consumo, como nos andares inferiores de edifícios altos, com as prumadas divididas em zonas de pressão. Costuma ser instalada em conjunto: registros antes e depois, filtro a montante e manômetros nos dois lados. Em prédios, é comum haver duas válvulas em paralelo, para permitir manutenção sem cortar a água.',
    valores: [['Coluna em prédio de 20 pavimentos de 3 m', '≈ 60 mca de pressão estática na base, acima do limite usual de 40 mca'], ['Relação entre pressões de entrada e saída', 'acima de cerca de 3:1, verificar risco de cavitação com o fabricante e estudar redução em dois estágios']],
    erros: ['Instalar sem filtro a montante; a sujeira impede o fechamento correto.', 'Regular sem manômetro ou sem consumo no ramal.', 'Dimensionar pelo diâmetro da tubulação em vez da faixa de vazão da válvula.', 'Não prever acesso para limpeza e manutenção.'],
  },
  'darcy-weisbach': {
    pratica: 'O fator de atrito f depende do regime e da rugosidade do tubo. No regime laminar, f = 64 / Re. No turbulento, usa-se a equação de Colebrook-White, o diagrama de Moody ou aproximações como Swamee-Jain. Em comparação com a fórmula de Hazen-Williams, restrita à água em temperatura ambiente, a Darcy-Weisbach também serve para água quente e para outros fluidos.',
    valores: [['Rugosidade típica do PVC e de outros plásticos', '≈ 0,0015 a 0,007 mm'], ['Rugosidade típica do aço comercial novo', '≈ 0,045 mm'], ['Rugosidade típica do ferro fundido sem revestimento', '≈ 0,26 mm'], ['Fator f em tubos de água usuais', 'em geral entre 0,015 e 0,04']],
    exemplo: '100 m de tubo com diâmetro interno de 50 mm, velocidade de 1,5 m/s e f = 0,02: hf = 0,02 × (100 / 0,05) × (1,5² / (2 × 9,81)) ≈ 4,6 mca.',
    erros: ['Adotar a rugosidade de tubo novo em tubulações metálicas antigas e incrustadas.', 'Esquecer as perdas localizadas de conexões e registros.', 'Usar diâmetro nominal em vez do interno.', 'Misturar unidades, como diâmetro em milímetros e comprimento em metros.'],
  },
  schedule: {
    pratica: 'O número Schedule define a espessura da parede, e não uma pressão. No mesmo diâmetro nominal, o diâmetro externo é fixo: quanto maior o Schedule, mais grossa a parede e menor o diâmetro interno. A espessura de um SCH 40 varia com o diâmetro, portanto a pressão admissível também muda, e depende ainda do material e da temperatura. Tubos de aço inoxidável seguem a ASME B36.19, com sufixo S (10S, 40S, 80S).',
    valores: [['DN 25 (1"), diâmetro externo 33,4 mm', 'SCH 40: 3,38 mm · SCH 80: 4,55 mm'], ['DN 50 (2"), diâmetro externo 60,3 mm', 'SCH 40: 3,91 mm · SCH 80: 5,54 mm'], ['DN 100 (4"), diâmetro externo 114,3 mm', 'SCH 40: 6,02 mm · SCH 80: 8,56 mm']],
    erros: ['Tratar SCH 40 como se fosse uma classe de pressão única para todos os diâmetros.', 'Especificar o Schedule sem indicar o material e a norma do tubo (por exemplo, ASTM A53 ou A106).', 'Calcular a perda de carga com o diâmetro nominal, ignorando a redução interna em SCH 80.', 'Soldar conexões com Schedule diferente do tubo sem ajustar a transição.'],
  },
  'comprimento-equivalente': {
    pratica: 'O método transforma cada conexão em metros de tubo reto, e a soma entra no cálculo da perda de carga como comprimento virtual. Os valores variam com material, diâmetro e tipo de peça, por isso devem vir da tabela da norma ou do fabricante. Em trechos curtos e com muitas conexões, como barriletes e casas de bombas, as peças podem pesar mais do que o próprio tubo.',
    valores: [['Joelho 90° PVC soldável DN 25', 'da ordem de 1,5 m'], ['Tê com saída lateral PVC soldável DN 25', 'da ordem de 3,1 m'], ['Tê de passagem direta PVC soldável DN 25', 'da ordem de 0,9 m'], ['Registro de gaveta aberto DN 25', 'da ordem de 0,3 m']],
    exemplo: 'Trecho de 20 m em PVC DN 25 com 4 joelhos de 90°, 1 tê de saída lateral e 2 registros de gaveta: 20 + (4 × 1,5) + 3,1 + (2 × 0,3) = 29,7 m. A perda de carga é calculada com 29,7 m, e não com 20 m.',
    erros: ['Usar a tabela de um material em outro (PVC em aço, por exemplo).', 'Considerar um registro de globo como se fosse de gaveta, que tem perda muito menor.', 'Contar apenas o tubo em trechos com muitas conexões.'],
  },
  declividade: {
    pratica: 'A inclinação deve ser constante, para que a água transporte os sólidos sem deixá-los no caminho. Pouca declividade favorece o entupimento. Declividade exagerada também é ruim, porque a água pode escoar mais rápido e deixar os sólidos para trás. A verificação é feita na montagem, com nível ou régua, antes de cobrir o tubo.',
    valores: [['Tubos de diâmetro nominal até 75 mm (NBR 8160)', 'mínima de 2%'], ['Tubos de diâmetro nominal de 100 mm ou mais (NBR 8160)', 'mínima de 1%'], ['Declividade máxima usual', 'em torno de 5%']],
    exemplo: 'Um ramal DN 100 de 12 m com 1% precisa de 12 cm de desnível entre as pontas. Um ramal DN 50 de 3 m com 2% precisa de 6 cm.',
    erros: ['Deixar barriga (trecho mais baixo no meio do caminho), que acumula resíduos.', 'Assentar sem conferir o caimento com nível.', 'Montar o tubo com contrafluxo para fugir de uma viga.', 'Prever pé-direito ou forro sem espaço para o caimento.'],
  },
};
