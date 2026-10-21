// Dimensionamento Inteligente: fator de conexões por metro de tubo de água fria (PVC soldável ou PPR).
// Quantidade de joelhos (j), tês (t) e luvas (l) a cada 10 m de tubo. Calibre com dados de projetos executivos.
// As conexões de ponto não entram aqui e são contadas à parte: joelho com bucha e bujão de cada saída,
// registros de cada ambiente e tê de derivação de cada andar nas colunas.
const FATORES_CONEXOES = {
  // ramais e distribuição horizontal, por diâmetro externo (mm); referência: 25 mm = 2,5 joelhos, 0,8 tê e 0,5 luva
  ramal: {
    20: { j: 3.0, t: 1.0, l: 0.5 },
    25: { j: 2.5, t: 0.8, l: 0.5 },
    32: { j: 2.2, t: 0.7, l: 0.6 },
    40: { j: 1.8, t: 0.6, l: 0.7 },
    50: { j: 1.5, t: 0.5, l: 0.8 },
    60: { j: 1.3, t: 0.5, l: 0.9 },
    63: { j: 1.3, t: 0.5, l: 0.9 },
    75: { j: 1.1, t: 0.4, l: 1.0 },
    85: { j: 1.0, t: 0.4, l: 1.1 },
    90: { j: 1.0, t: 0.4, l: 1.1 },
    110: { j: 0.9, t: 0.3, l: 1.2 },
  },
  coluna: { j: 0.3, t: 0, l: 1.7 },      // trechos verticais: quase sem desvios, uma luva por barra de 6 m
  barrilete: { j: 1.5, t: 0.8, l: 1.7 }, // barrilete e trechos junto aos reservatórios
  luvaPPR: 2,                             // PPR vem em barras de 3 m: o dobro de emendas
};
