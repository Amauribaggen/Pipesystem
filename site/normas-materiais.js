// Dimensionamento Inteligente: norma de referência de cada material da lista.
// [expressão regular sobre o nome do material, norma]. Vale a primeira que casar.
// Quando não há norma do produto, indica a norma do sistema, marcada com "(sistema)".
const NORMAS_MATERIAIS = [
  // Água fria e quente
  [/PPR/, 'ABNT NBR 15813-1'],
  [/CPVC/, 'ABNT NBR 15884-1'],
  [/PEX/, 'ABNT NBR 15939-1'],
  [/^Tubo PVC soldável|^(Joelho 90°|Tê|Luva) soldável|bucha de latão|^Conexões soldáveis/, 'ABNT NBR 5648'],
  [/^Tubo de cobre/, 'ABNT NBR 13206'],
  [/^Conex(ões|ão) de cobre|^Conector terminal de cobre/, 'ABNT NBR 11720'],
  [/^Registro de gaveta/, 'ABNT NBR 15705'],
  [/^Registro de pressão/, 'ABNT NBR 15704-1'],
  [/^Caixa d'água de polietileno/, 'ABNT NBR 14799'],
  [/^Reservatório|^Hidrômetro|^Kit cavalete|^Padrão de entrada|^Torneira de boia|^Chave-boia|^Conjunto motobomba|^Adaptador soldável com flange/, 'ABNT NBR 5626 (sistema)'],
  // Esgoto e águas pluviais
  [/^Tubo PVC (esgoto|para águas pluviais)|esgoto \d|^Junção|^Luva de correr|^Anel de vedação/, 'ABNT NBR 5688'],
  [/^Caixa sifonada|^Ralo (seco|sifonado|linear)|^Caixa de gordura|^Caixa de inspeção|^Coletor predial/, 'ABNT NBR 8160 (sistema)'],
  [/^Ralo hemisférico|^Calha|^Bocal de calha|^Caixa de areia/, 'ABNT NBR 10844 (sistema)'],
  // Aço
  [/^Tubo de aço galvanizado/, 'ABNT NBR 5580'],
  [/^Tubo de aço carbono/, 'ASTM A106'],
  [/^Conexões galvanizadas|^Bujão de ferro galvanizado/, 'ABNT NBR 6943'],
  [/ranhurad|^Acoplamento rígido/, 'AWWA C606'],
  // Gás
  [/^Flexível metálico para gás/, 'ABNT NBR 14177'],
  [/^Regulador de pressão para botijão/, 'ABNT NBR 8473'],
  [/^Central de GLP|^Botijão P13/, 'ABNT NBR 13523'],
  [/^Aquecedor de passagem|^Duto de exaustão/, 'ABNT NBR 13103 (sistema)'],
  [/gás|^Regulador de pressão|^Válvula de bloqueio da prumada|^Abrigo de (medidores|entrada)/, 'ABNT NBR 15526 (sistema)'],
  // Incêndio
  [/^Mangueira de incêndio/, 'ABNT NBR 11861'],
  [/sprinkler|^Bicos? de reserva|^Válvula de (controle seccional|governo)|^Chave detectora|^Conjunto de teste e dreno|^Tê de redução com saída/, 'ABNT NBR 10897 (sistema)'],
  [/^Manômetro/, 'ABNT NBR 14105-1'],
  [/^Válvula angular|^Abrigo para mangueira|^Esguicho|^Chave de mangueira|^Registro de recalque|^Bomba de reforço|^Válvula de retenção 2 1\/2"/, 'ABNT NBR 13714 (sistema)'],
  // Louças, áreas especiais e drenagem
  [/^Bacia|^Lavatório|^Tanque/, 'ABNT NBR 15097-1'],
  [/^Cisterna de água de chuva|não potável|^Filtro autolimpante|^Dispositivo de descarte|^Freio d'água|^Clorador de pastilhas/, 'ABNT NBR 15527 (sistema)'],
  [/piscina|^Skimmer|^Dispositivo de (retorno|aspiração)|^Ralo de fundo|^Clorador \/ dosador/, 'ABNT NBR 10339 (sistema)'],
  [/^Válvula de retenção|^Registro de esfera/, 'ABNT NBR 5626 (sistema)'],
  [/^Torneira|^Misturador|^Chuveiro|^Ducha|^Cuba|^Sifão|^Válvula de escoamento|^Engate|^Isolamento térmico/, 'ABNT NBR 5626 (sistema)'],
  [/^Ralo com grelha|^Caixa separadora|^Poço de drenagem/, 'ABNT NBR 8160 (sistema)'],
  [/^Suporte de tubulação/, 'ABNT NBR 10897 (sistema)'],
];
function normaDoMaterial(nome) {
  for (const [re, n] of NORMAS_MATERIAIS) if (re.test(nome)) return n;
  return '';
}
