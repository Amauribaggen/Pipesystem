// Dimensionamento Inteligente: de qual insumo SINAPI sai o preço de cada material da lista.
// Cada regra: [expressão regular sobre o nome do material, especificação]. Vale a primeira que casar.
// Especificação:
//   '9868'                          um insumo
//   { c: ['3529', '7139'] }         média de insumos      { s: [...] } soma de insumos
//   { c: '20083', f: 0.2 }          insumo × fator (ex.: frasco de 1 L → 200 mL)
//   { by: {...}, g: 1 }             insumo conforme o trecho capturado (diâmetro, volume...)
//   { v: 52.12, fonte, url }        preço fixo pesquisado na internet (igual em todos os estados)
//   { zero: 'motivo' }              sem custo de material (fornecido pela concessionária, linha informativa...)
//   { fb: { v, fonte, url } }       junto de c/by: preço usado quando o insumo não tem preço em nenhum estado
// Material sem regra aparece como "sem referência — cotar".
// Os preços por estado ficam em sinapi-precos.js, gerado por scripts/sinapi.mjs a partir do arquivo da Caixa.
const SINAPI_REGRAS = (() => {
  const INCH = s => s.trim().replace(/\s+/g, ' ');
  const pvcTubo = { 20: '9867', 25: '9868', 32: '9869', 40: '9874', 50: '9875', 60: '9873', 75: '9871', 85: '9872', 110: '9870' };
  const pvcJoelho = { 20: '3542', 25: '3529', 32: '3536', 40: '3535', 50: '3540', 60: '3539', 75: '3511', 85: '3513', 110: '3530' };
  const pvcTe = { 20: '7138', 25: '7139', 32: '7140', 40: '7141', 50: '7130', 60: '7143', 75: '7144', 85: '7145', 110: '7146' };
  const pvcLuva = { 20: '3861', 25: '3904', 32: '3903', 40: '3862', 50: '3863', 60: '3864', 75: '3865', 85: '3866', 110: '3867' };
  const gaveta = { '1/2': '6020', '3/4': '6016', '1': '6019', '1 1/4': '6017', '1 1/2': '6010', '2': '6028', '2 1/2': '6011', '3': '6012', '4': '6027' };
  const galv = { '1/2': '7691', '3/4': '7700', '1': '40626', '1 1/4': '7698', '1 1/2': '7697', '2': '7696', '2 1/2': '7701', '3': '7694', '4': '7693' };
  const galvCx = { // média de cotovelo 90°, tê e união
    '1/2': ['3455', '6294', '9883'], '3/4': ['3456', '6295', '9885'], '1': ['3472', '6323', '9886'], '1 1/4': ['3457', '6296', '9888'],
    '1 1/2': ['3458', '6297', '9884'], '2': ['3471', '6298', '9887'], '2 1/2': ['3470', '6299', '9889'], '3': ['3459', '6322', '9890'], '4': ['3469', '6300', '9891'] };
  const retencao = { // válvula de retenção vertical de bronze; sem preço estadual na edição 09/2026 → média nacional de 05/2026
    '1/2': '21092', '3/4': '10413', '1': '10418', '1 1/4': '10419', '1 1/2': '10416', '2': '10417', '2 1/2': '12657', '3': '10414', '4': '10415' };
  const retencaoNac = { '1 1/4': 182.54, '2': 306.42, '2 1/2': 491.01, '1': 121.68, '1 1/2': 210.30 };
  const esgoto = { 40: '9835', 50: '9838', 75: '9837', 100: '9836', 150: '20065', 200: '41930' };
  const pluvial = { 75: '9839', 100: '9841', 150: '9840' };
  const caixaPE = { '500': '34637', '1.000': '34636', '1.500': '34639', '2.000': '34640', '3.000': '43977', '5.000': '37105', '10.000': '37106' };
  const orc = 'https://orcamentor.com/insumo/';
  const map = (tab, conv = INCH) => ({ by: Object.fromEntries(Object.entries(tab).map(([k, v]) => [conv(k), Array.isArray(v) ? { c: v } : v])), key: conv });
  const ret = { ...map(retencao), fbBy: Object.fromEntries(Object.entries(retencaoNac).map(([k, v]) => [k, { v, fonte: 'SINAPI 05/2026, média nacional (sem preço estadual em 09/2026)', url: orc + retencao[k] + '/' }])) };
  const web = (v, fonte, url) => ({ v, fonte, url });
  return [
    // Reservação e recalque
    [/^Reservatório (inferior|superior)|^Cisterna de água de chuva/, { c: '43982', f: 1 / 20, nota: 'reservatório em fibra de vidro 20.000 L ÷ 20 m³' }],
    [/^Caixa d'água de polietileno ([\d.]+) L/, { ...map(caixaPE, k => k), g: 1 }],
    [/^Tubo de aço galvanizado ([\d /]+)"/, { ...map(galv), g: 1 }],
    [/^Conexões galvanizadas ([\d /]+)"/, { ...map(galvCx), g: 1, nota: 'média de cotovelo, tê e união' }],
    [/^Válvula de retenção (?:vertical )?([\d /]+)"/, { ...ret, g: 1 }],
    [/^Registro de gaveta \d+ mm \(([\d /]+)"\)/, { ...map(gaveta), g: 1 }],
    [/^Registro de gaveta (3\/4" com acabamento|água quente)/, '6005'],
    [/^Registro de gaveta ([\d /]+)"/, { ...map(gaveta), g: 1 }],
    [/^Conjunto motobomba de recalque/, { c: '735', nota: 'bomba centrífuga 1,48 HP, 4 estágios' }],
    [/^Conjunto motobomba (para água não potável|da cisterna)/, '731'],
    [/^Chave-boia/, '7588'],
    [/^Torneira de boia \(alimentação/, '11763'],
    [/^Torneira de boia 3\/4"/, '11830'],
    [/^Hidrômetro geral/, { c: '12772', nota: 'hidrômetro 1 1/2"' }],
    [/^Padrão de entrada de água/, { s: ['12774', '3729'], nota: 'hidrômetro 3/4" + kit cavalete' }],
    [/^Adaptador soldável com flange/, { c: '44256', nota: 'adaptador com flanges 28 mm (aproximação)' }],
    // Água fria em PPR (PN 20 até 25 mm, PN 12 a partir de 32 mm)
    [/^Tubo PPR (\d+) mm/, { by: { 20: '36274', 25: '36278', 32: '38971', 40: '38972', 50: '38973', 63: '38974', 75: '38975', 90: '38976', 110: '38977' }, g: 1 }],
    [/^Joelho 90° PPR (\d+) mm/, { by: { 20: '36359', 25: '36360', 32: '38434', 40: '38435', 50: '38436', 63: '38437', 75: '38438', 90: '38439', 110: '38440' }, g: 1 }],
    [/^Tê PPR (\d+) mm/, { by: { 20: '36362', 25: '36298', 32: '38456', 40: '38457', 50: '38458', 63: '38459', 75: '38460', 90: '38461', 110: '38462' }, g: 1 }],
    [/^Luva PPR (\d+) mm/, { by: { 20: '36320', 25: '36324', 32: '38441', 40: '38442', 50: '38443', 63: '38444', 75: '38445', 90: '38446', 110: '38447' }, g: 1 }],
    [/^Conector PPR com inserto metálico/, '38996'],
    [/^Conexões PPR 25 e 32/, { c: ['36360', '36298', '38434', '38456'] }],
    [/^Conexões PPR 25 mm/, { c: ['36360', '36298'] }],
    // Incêndio em aço ranhurado (Grooved): tubo de aço carbono schedule 40 ranhurado; peças de ferro fundido
    [/^Tubo de aço galvanizado leve ranhurado ([\d /]+)"/, { by: { '1': '21010', '1 1/4': '21011', '1 1/2': '21012', '2': '21013', '2 1/2': '21014', '3': '21015', '4': '21016' }, g: 1, nota: 'tubo galvanizado classe leve NBR 5580' }],
    [/^Tê ranhurado ([\d /]+)"/, { by: { '2': '40419', '2 1/2': '40420', '3': '40421' }, g: 1 }],
    [/^Curva 90° ranhurada ([\d /]+)"/, { by: { '2': '40413', '2 1/2': '40415', '3': '40417' }, g: 1 }],
    [/^Acoplamento rígido ranhurado ([\d /]+)"/, { by: { '2': '40410', '2 1/2': '40411', '3': '40412' }, g: 1 }],
    // Água fria
    [/^Tubo PVC soldável (\d+) mm/, { ...map(pvcTubo, k => String(k)), g: 1 }],
    [/^Joelho 90° soldável com bucha de latão/, '20147'],
    [/^Joelho 90° soldável (\d+) mm/, { ...map(pvcJoelho, k => String(k)), g: 1 }],
    [/^Tê soldável (\d+) mm/, { ...map(pvcTe, k => String(k)), g: 1 }],
    [/^Luva soldável (\d+) mm/, { ...map(pvcLuva, k => String(k)), g: 1 }],
    [/^Registro de pressão/, '6024'],
    [/^Hidrômetro individual/, '12774'],
    [/^Kit cavalete/, '3729'],
    [/^Conexões soldáveis (25 e 32|32 e 25)/, { c: ['3529', '7139', '3536', '7140'] }],
    [/^Conexões soldáveis 25 mm/, { c: ['3529', '7139'] }],
    [/^Conexões soldáveis 50 e 60/, { c: ['3540', '7130', '3539', '7143'] }],
    [/^Registro de esfera 3\/4"/, '6032'],
    [/^Registro de esfera 1"/, '11746'],
    [/^Registro de esfera 50 mm/, '11677'],
    // Água quente
    [/^Tubo CPVC 28/, '21125'], [/^Tubo CPVC 22/, '21124'],
    [/^Tubo de cobre classe E 22/, '12743'], [/^Tubo de cobre classe E 15/, '12713'],
    [/^Conexão CPVC: terminal/, '38006'], [/^Conexão CPVC: joelhos/, { c: ['37956', '38010'] }],
    [/^Conexão de cobre: terminal/, '39862'], [/^Conexão de cobre: joelhos/, { c: ['12714', '12733'] }],
    // Gás
    [/^Tubo de cobre classe A 15/, '39747'], [/^Tubo de cobre classe A 22/, '39748'],
    [/^Conexões de cobre 15 mm/, { c: ['12714', '12733'] }],
    [/^Conector terminal de cobre/, '39862'],
    [/^(Registro de esfera para gás 1\/2"|Válvula de bloqueio da prumada 1")/, { by: { 'Registro de esfera para gás 1/2"': '11748', 'Válvula de bloqueio da prumada 1"': '11746' }, g: 1, key: k => k }],
    [/^Flexível metálico para gás/, web(63, 'média de ORSE 05/2026 (R$ 51,00) e Buscapé (R$ 75,00)', 'https://orcamentor.com/orse/composicoes/ORSE-10883/')],
    [/^Regulador de pressão (de 2º estágio|para botijão)/, { c: '11756', nota: 'regulador de gás 2 kg/h' }],
    [/^Abrigo de medidores de gás/, web(427.5, 'Mercado Livre: abrigo para medidor de gás 50 × 50 × 30', 'https://lista.mercadolivre.com.br/abrigo-de-gas-com-portao')],
    [/^Abrigo de entrada e regulador geral/, { zero: 'fornecido pela concessionária' }],
    [/^Central de GLP/, { zero: 'dimensionada e fornecida pela distribuidora de GLP' }],
    // Esgoto e pluviais
    [/^Tubo PVC para águas pluviais (\d+) mm/, { ...map(pluvial, k => String(k)), g: 1 }],
    [/^Tubo PVC esgoto (?:série normal )?(\d+) mm/, { ...map(esgoto, k => String(k)), g: 1 }],
    [/^Caixa sifonada/, '11712'], [/^Ralo seco/, '11711'], [/^Ralo sifonado/, '11741'],
    [/^Joelho 90° esgoto 100/, '3520'], [/^Joelho 45° esgoto 100/, '3528'], [/^Joelho 45° esgoto 75/, '3519'],
    [/^Joelho 90° esgoto 50/, '3526'], [/^Joelho 90° esgoto 40/, '3517'],
    [/^Junção simples 100 x 50/, '3659'], [/^Junção 100 x 100/, '3670'], [/^Junção 75 x 50/, '3669'],
    [/^Luva de correr 100/, '3893'], [/^Luva de correr 75/, '3895'],
    [/^Anel de vedação/, '6138'],
    [/^Coletor predial/, { zero: 'linha informativa; o tubo já está orçado' }],
    [/^Caixa de gordura \(coletiva/, web(588.24, 'SINAPI 05/2026, composição 98108 (caixa dupla 126 L em blocos, com instalação), média nacional', 'https://orcamentor.com/composicao/98108/')],
    [/^Caixa de gordura/, '35277'],
    [/^Caixa de (inspeção|areia) 60 x 60/, { c: '41629', fb: web(488.26, 'SINAPI 05/2026, média nacional', orc + '41629/') }],
    [/^Ralo hemisférico/, web(52.12, 'média de Casa do Ralo (R$ 44,90) e Zoom (R$ 59,33)', 'https://www.mercadolivre.com.br/loja/casa-do-ralo')],
    [/^Calha/, '1118'],
    // Incêndio e sprinklers
    [/^Válvula angular 2 1\/2"/, '10904'], [/^Abrigo para mangueira/, '10521'], [/^Mangueira de incêndio/, '21029'],
    [/^Esguicho regulável/, '37554'], [/^Chave de mangueira storz/, '20971'],
    [/^Registro de recalque/, web(1127.27, 'SINAPI 05/2026, composição 106677 (registro de recalque 2 1/2" com instalação), média nacional', 'https://orcamentor.com/composicao/106677/')],
    [/^Bomba de reforço de incêndio/, web(9019.29, 'MF Rural (Florianópolis/SC): média de 2 anúncios de motobomba de incêndio 7,5 cv', 'https://www.mfrural.com.br/busca/bomba-fni')],
    [/^Bicos? de (sprinkler|reserva)/, { c: '21044', nota: 'sprinkler pendente 68 °C' }],
    [/^Tubo de aço carbono 1" /, '42574'], [/^Tubo de aço carbono 1 1\/4"/, '42575'], [/^Tubo de aço carbono 2"/, '21148'], [/^Tubo de aço carbono 4"/, '21151'],
    [/^Conexões 1" e 1 1\/4"/, { c: ['3472', '3457', '6323', '6296'], nota: 'conexões galvanizadas (aproximação)' }],
    [/^Manômetro/, '12899'],
    // Garagem
    [/^Ralo com grelha 150 x 150/, { c: '11712', mais: web(50.17, 'grelha de ferro fundido 15 × 15 (Casas Bahia via Zoom)', 'https://www.zoom.com.br/tubos-conexoes?page=32'), nota: 'caixa sifonada + grelha de ferro fundido' }],
    [/^Torneira (de lavagem|de jardim|para máquina|de uso restrito)/, '7603'],
    [/^Caixa separadora de água e óleo/, web(750, 'MadeiraMadeira: caixa separadora 800 L/h', 'https://www.madeiramadeira.com.br/caixa-separadora-de-agua-e-oleo-800-l-h-completa-649725192.html?seller=298')],
    [/^Poço de drenagem com 2 bombas/, { c: '10592', f: 2, nota: '2 bombas submersíveis 0,99 HP' }],
    // Louças e metais
    [/^Bacia sanitária com caixa acoplada/, '10422'], [/^Assento sanitário/, '377'],
    [/^Lavatório com torneira/, { s: ['20269', '13415'] }], [/^Lavatório ou cuba/, '20269'],
    [/^Bacia e lavatório acessíveis/, { s: ['10422', '20269', '13415', '36207'], nota: 'bacia, lavatório, torneira e barra de apoio' }],
    [/^Misturador de lavatório/, '44045'], [/^Torneira de lavatório/, '13415'],
    [/^Chuveiro \/ ducha \(água quente\)/, '38189'], [/^Chuveiro elétrico/, '1368'], [/^Chuveiro \/ ducha de piscina/, '38189'],
    [/^Ducha higiênica/, '1370'], [/^Cuba de cozinha/, '1744'],
    [/^Misturador de cozinha/, '11771'], [/^Torneira de cozinha/, '11772'],
    [/^Cuba e torneira/, { s: ['1744', '11772'] }],
    [/^Tanque com torneira/, { s: ['10423', '7603'] }],
    [/^Sifão/, '44945'], [/^Válvula de escoamento/, '6158'], [/^Engate flexível/, '11683'],
    // Consumíveis
    [/^Adesivo para PVC/, '20080'],
    [/^Solução limpadora/, { c: '20083', f: 0.2, nota: 'frasco de 1 L proporcional a 200 mL' }],
    [/^Fita veda-rosca/, '3143'],
    [/^Abraçadeira tipo D/, '39130'],
    [/^Vareta de solda/, web(31.32, 'Zoom (Amazon): lote de 20 varetas prata 15% ÷ 20', 'https://www.zoom.com.br/equipamentos-de-solda?page=17')],
    [/^Churrasqueira a carvão/, { zero: 'fora da hidráulica' }],
  ];
})();
