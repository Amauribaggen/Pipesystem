// ===== Guias práticos: detalhes típicos para baixar (SVG e DXF) =====
// Cada detalhe é desenhado em milímetros, com o eixo y para cima (como no CAD), a partir de primitivas simples:
//   l: linha · r: retângulo · c: círculo · a: arco · t: texto · d: cota · n: chamada (seta com texto)
// O mesmo desenho gera o SVG da tela, o SVG para baixar e o DXF (R12, abre no AutoCAD, BricsCAD, LibreCAD e QCAD).
// Camadas: CONTORNO, TUBO, COTA, TEXTO, HACHURA, EIXO. Medidas de referência: confira com o projeto, a concessionária e o Corpo de Bombeiros.
const DETALHES = (() => {
  // ---------- construtor de desenho ----------
  const D = () => {
    const g = [];
    const api = {
      g,
      l: (x1, y1, x2, y2, c = 'CONTORNO') => (g.push(['l', x1, y1, x2, y2, c]), api),
      r: (x, y, w, h, c = 'CONTORNO') => (g.push(['l', x, y, x + w, y, c], ['l', x + w, y, x + w, y + h, c], ['l', x + w, y + h, x, y + h, c], ['l', x, y + h, x, y, c]), api),
      c: (x, y, r, c = 'TUBO') => (g.push(['c', x, y, r, c]), api),
      a: (x, y, r, a1, a2, c = 'CONTORNO') => (g.push(['a', x, y, r, a1, a2, c]), api),
      t: (x, y, txt, h = 30, al = 'l', c = 'TEXTO') => (g.push(['t', x, y, h, txt, al, c]), api),
      // tubo em elevação: duas linhas paralelas com o diâmetro externo
      tubo: (x1, y1, x2, y2, de) => {
        const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), nx = -dy / L * de / 2, ny = dx / L * de / 2;
        g.push(['l', x1 + nx, y1 + ny, x2 + nx, y2 + ny, 'TUBO'], ['l', x1 - nx, y1 - ny, x2 - nx, y2 - ny, 'TUBO']);
        return api;
      },
      // hachura de laje ou solo: traços a 45° dentro do retângulo
      hach: (x, y, w, h, p = 40) => {
        for (let s = p; s < w + h; s += p) {
          const xa = x + Math.max(0, s - h), ya = y + Math.min(s, h), xb = x + Math.min(s, w), yb = y + Math.max(0, s - w);
          g.push(['l', xa, ya, xb, yb, 'HACHURA']);
        }
        return api;
      },
      // cota horizontal (o = deslocamento da linha de cota) ou vertical (v = true)
      d: (x1, y1, x2, y2, o, txt, v = false, h = 26) => {
        if (!v) {
          const y = y1 + o;
          g.push(['l', x1, y1, x1, y + Math.sign(o) * 15, 'COTA'], ['l', x2, y2, x2, y + Math.sign(o) * 15, 'COTA'], ['l', x1, y, x2, y, 'COTA'],
            ['l', x1 - 10, y - 10, x1 + 10, y + 10, 'COTA'], ['l', x2 - 10, y - 10, x2 + 10, y + 10, 'COTA'], ['t', (x1 + x2) / 2, y + 10, h, txt, 'c', 'COTA']);
        } else {
          const x = x1 + o;
          g.push(['l', x1, y1, x + Math.sign(o) * 15, y1, 'COTA'], ['l', x2, y2, x + Math.sign(o) * 15, y2, 'COTA'], ['l', x, y1, x, y2, 'COTA'],
            ['l', x - 10, y1 - 10, x + 10, y1 + 10, 'COTA'], ['l', x - 10, y2 - 10, x + 10, y2 + 10, 'COTA'], ['t', x + (o > 0 ? 14 : -14), (y1 + y2) / 2, h, txt, o > 0 ? 'l' : 'r', 'COTA']);
        }
        return api;
      },
      // chamada: ponto no objeto, cotovelo e texto
      n: (x, y, tx, ty, txt, h = 28) => {
        const dir = tx >= x ? 1 : -1;
        g.push(['c', x, y, 6, 'COTA'], ['l', x, y, tx, ty, 'COTA'], ['l', tx, ty, tx + dir * 30, ty, 'COTA'], ['t', tx + dir * 40, ty - h * 0.35, h, txt, dir > 0 ? 'l' : 'r', 'TEXTO']);
        return api;
      },
    };
    return api;
  };

  // ---------- 1. Suportes de tubulação ----------
  const suportes = (() => {
    const s = D();
    // A) pendural com abraçadeira tipo pêra
    s.r(0, 1200, 900, 120).hach(0, 1200, 900, 120).t(450, 1350, 'LAJE', 26, 'c');
    s.r(430, 1140, 40, 60).l(450, 1140, 450, 700).n(450, 960, 620, 1060, 'Vergalhão roscado 3/8" (galvanizado)');
    s.n(450, 1170, 620, 1170, 'Chumbador tipo parabolt 3/8"');
    s.l(450, 700, 395, 600).l(450, 700, 505, 600).a(450, 585, 62, 180, 360).l(388, 585, 395, 600).l(512, 585, 505, 600);
    s.c(450, 585, 50).c(450, 585, 38).n(500, 610, 640, 700, 'Abraçadeira tipo pêra com porca e contraporca');
    s.n(450, 547, 620, 470, 'Tubo');
    s.l(330, 585, 570, 585, 'EIXO').d(450, 700, 450, 1200, -300, 'conforme projeto', true);
    s.t(450, 300, 'A) PENDURAL COM ABRAÇADEIRA TIPO PÊRA', 34, 'c');
    // B) trapézio com perfilado
    const X = 1300;
    s.r(X, 1200, 1300, 120).hach(X, 1200, 1300, 120).t(X + 650, 1350, 'LAJE', 26, 'c');
    for (const xx of [X + 150, X + 1150]) s.r(xx - 20, 1140, 40, 60).l(xx, 1140, xx, 640);
    s.r(X + 100, 600, 1100, 40).n(X + 1150, 620, X + 1330, 560, 'Perfilado 38 x 38 mm perfurado');
    for (const [xx, r] of [[X + 350, 55], [X + 650, 42], [X + 930, 30]]) {
      s.c(xx, 640 + r, r).l(xx - r - 8, 640, xx - r - 8, 640 + r).a(xx, 640 + r, r + 8, 0, 180).l(xx + r + 8, 640, xx + r + 8, 640 + r);
    }
    s.n(X + 650, 690, X + 760, 900, 'Abraçadeira tipo U com chapa e parafuso');
    s.n(X + 1150, 900, X + 1330, 980, 'Vergalhão roscado 3/8" nas duas pontas');
    s.d(X + 150, 600, X + 1150, 600, -110, 'máx. conforme carga do perfilado');
    s.t(X + 650, 300, 'B) TRAPÉZIO COM PERFILADO (VÁRIOS TUBOS)', 34, 'c');
    // tabela de espaçamentos (aço e cobre com água: MSS SP-58 / ASME B31.9)
    const T = 3450;
    s.t(T, 1300, 'ESPAÇAMENTO MÁXIMO ENTRE SUPORTES (TUBO HORIZONTAL COM ÁGUA)', 30);
    s.r(T, 700, 1500, 540, 'COTA');
    const linhas = [['DN', 'Aço', 'Cobre'], ['1/2" a 1"', '2,1 m', '1,5 a 1,8 m'], ['1 1/2"', '2,7 m', '2,4 m'], ['2"', '3,0 m', '2,4 m'], ['3"', '3,7 m', '3,0 m'], ['4"', '4,3 m', '3,7 m']];
    linhas.forEach((ln, i) => { const y = 1190 - i * 85; ln.forEach((c, j) => s.t(T + 40 + j * 480, y, c, 28)); if (i) s.l(T, y + 60, T + 1500, y + 60, 'COTA'); });
    s.t(T, 600, 'Plásticos (PVC, CPVC, PPR, PEX): siga o manual do fabricante. O espaçamento', 24);
    s.t(T, 560, 'é bem menor que o do aço e cai com a temperatura (água quente).', 24);
    s.t(T, 500, 'Prumadas: um suporte por pavimento, no mínimo, e ancoragem na base.', 24);
    s.t(T, 440, 'Metais diferentes: isole a abraçadeira do tubo (borracha) contra corrosão galvânica.', 24);
    return s.g;
  })();

  // ---------- 2. Cavalete do hidrômetro ----------
  const cavalete = (() => {
    const s = D();
    s.l(-200, 0, 1700, 0).hach(-200, -150, 1900, 150);
    s.t(1500, 30, 'PISO / PASSEIO', 24, 'r');
    // abrigo
    s.r(0, 0, 1300, 900).r(40, 40, 1220, 820).t(650, 930, 'ABRIGO DO CAVALETE (MEDIDAS DA CONCESSIONÁRIA)', 26, 'c');
    const y = 450, de = 32;
    // ramal predial: sobe do solo à esquerda
    s.tubo(220, -150, 220, y, de).tubo(220, y, 1080, y, de).tubo(1080, y, 1080, -150, de);
    s.n(220, -80, -60, -260, 'Ramal predial (rede pública)').n(1080, -80, 1360, -260, 'Alimentação do imóvel');
    // registro antes do hidrômetro
    s.r(320, y - 45, 90, 90).l(365, y + 45, 365, y + 120).l(330, y + 120, 400, y + 120);
    s.n(365, y + 100, 300, 760, 'Registro de esfera (corte da concessionária)');
    // hidrômetro
    s.c(650, y, 105, 'CONTORNO').c(650, y, 80, 'CONTORNO').r(545, y - 40, 20, 80).r(735, y - 40, 20, 80);
    s.n(650, y + 105, 760, 760, 'Hidrômetro (fornecido pela concessionária)');
    s.t(650, y - 10, 'H', 40, 'c');
    // tubete e registro após
    s.r(820, y - 30, 70, 60).n(855, y - 30, 900, 230, 'Tubete / conexão de saída');
    s.r(940, y - 45, 90, 90).l(985, y - 45, 985, y - 120).l(950, y - 120, 1020, y - 120);
    s.n(985, y - 110, 1260, 150, 'Registro de esfera do usuário');
    s.l(120, y, 1180, y, 'EIXO');
    s.d(1300, 0, 1300, y, 120, 'altura do eixo: padrão local', true);
    s.d(0, 900, 1300, 900, 120, 'largura: padrão da concessionária');
    s.t(-200, -380, 'O padrão (diâmetro, alturas, abrigo, lacre e posição no muro) é definido pela concessionária de cada cidade.', 24);
    s.t(-200, -420, 'Hidrômetro em posição horizontal, com a seta no sentido do fluxo, protegido de sol e choque. NBR 5626.', 24);
    return s.g;
  })();

  // ---------- 3. Barrilete e saídas do reservatório superior ----------
  const barrilete = (() => {
    const s = D();
    // laje e reservatório de duas células
    s.l(-300, 0, 2900, 0).hach(-300, -120, 3200, 120);
    s.r(0, 300, 2400, 1300).l(1200, 300, 1200, 1600).t(600, 1650, 'CÉLULA 1', 28, 'c').t(1800, 1650, 'CÉLULA 2', 28, 'c');
    s.l(0, 1450, 2400, 1450, 'EIXO').n(80, 1450, -150, 1560, 'N.A. máximo');
    for (const x0 of [0, 1200]) for (let k = 0; k < 6; k++) s.l(x0 + 40, 300 + 40 + k * 3, x0 + 1160, 300 + 40 + k * 3, 'HACHURA');
    // alimentação com torneira de boia
    s.tubo(-250, 1520, 300, 1520, 30).l(300, 1520, 360, 1430).c(390, 1410, 30, 'CONTORNO').n(390, 1410, 520, 1560, 'Torneira de boia');
    s.n(-200, 1520, -260, 1720, 'Alimentação (recalque)');
    // extravasor
    s.tubo(2400, 1480, 2800, 1480, 40).n(2700, 1480, 2700, 1700, 'Extravasor (aviso), maior que a entrada');
    // saídas pelo fundo com registro, barrilete e colunas
    const yb = 150;
    const yRti = 740;   // topo da reserva técnica de incêndio
    s.l(0, yRti, 2400, yRti, 'EIXO').t(900, 500, 'RESERVA TÉCNICA DE INCÊNDIO (RTI)', 26, 'c').t(1500, 500, 'RTI', 26, 'c');
    s.d(0, 300, 0, yRti, -150, 'RTI: volume conforme a IT', true);
    for (const xs of [600, 1800]) { s.tubo(xs, yRti + 20, xs, yb, 50).r(xs - 40, 210, 80, 60).n(xs + 40, 240, xs + 160, 260, 'Registro de gaveta'); }
    s.n(600, yRti + 10, 760, 950, 'Saída de consumo acima do nível da RTI');
    // saída de incêndio pelo fundo, em tubulação própria
    const yi = 70;
    for (const xs of [200, 2250]) s.tubo(xs, 300, xs, yi, 50).r(xs - 40, 190, 80, 55);
    s.tubo(200, yi, 2250, yi, 50).n(2290, 217, 2680, 217, 'Registro da saída de incêndio');
    s.tubo(200, yi, 200, -700, 60).r(160, -230, 80, 55).r(160, -450, 80, 60).l(160, -450, 240, -390).t(200, -760, 'INC', 28, 'c');
    s.n(160, -202, -60, -202, 'Registro').n(160, -420, -60, -420, 'Válvula de retenção').n(170, -620, -60, -620, 'Coluna de incêndio (tubulação própria)');
    s.tubo(400, yb, 2000, yb, 50).n(1200, yb, 1250, 360, 'Barrilete (liga as duas células)');
    // limpeza
    s.tubo(1200, yi, 1200, -100, 40);
    s.r(1160, -60, 80, 50).n(1240, -35, 1420, -230, 'Limpeza com registro, ao ralo ou à calha');
    // colunas
    const cols = [[500, 'AF1'], [900, 'AF2'], [1600, 'AF3'], [1950, 'AF4']];
    for (const [x, nm] of cols) {
      s.tubo(x, yb, x, -700, 40).r(x - 35, -230, 70, 55).t(x, -760, nm, 28, 'c');
      // ventilação da coluna logo após o registro (respiro acima do N.A.)
    }
    s.n(900, -200, 1000, -520, 'Registro de gaveta por coluna');
    s.tubo(2600, -280, 2600, 1750, 25).tubo(1950, -280, 2600, -280, 25).n(2600, 1650, 2700, 1880, 'Ventilação da coluna (respiro), acima do N.A. máximo');
    s.d(0, 0, 0, 300, -150, 'apoio', true);
    s.t(-300, -950, 'Reservatório com 2 células para limpeza sem cortar o abastecimento. Saídas de consumo acima da RTI: o uso diário não gasta a reserva de incêndio.', 24);
    s.t(-300, -990, 'Registro em cada saída, em cada coluna e na limpeza. Coluna de válvula de descarga com ventilação (respiro). NBR 5626.', 24);
    s.t(-300, -1030, 'Hidrantes (NBR 13714) e sprinklers (NBR 10897): volume da RTI pela Instrução Técnica do Corpo de Bombeiros do estado. Com reserva em tanque separado ou no reservatório inferior, com bomba, a RTI e a saída de incêndio não ficam aqui.', 24);
    return s.g;
  })();

  // ---------- 4. Caixa de inspeção de esgoto ----------
  const caixa = (() => {
    const s = D();
    // corte
    s.l(-400, 1000, 1200, 1000).hach(-400, 1000, 300, 60).hach(900, 1000, 300, 60).t(1200, 1080, 'TERRENO', 24, 'r');
    s.r(-100, -100, 800, 100).hach(-100, -100, 800, 100).n(-80, -50, -360, -180, 'Base de concreto (5 a 10 cm)');
    s.r(-100, 0, 100, 960).r(600, 0, 100, 960).n(-50, 500, -360, 520, 'Parede de alvenaria revestida ou concreto');
    s.r(-120, 960, 840, 60).n(300, 1020, 420, 1160, 'Tampa removível de concreto, bem vedada');
    // tubos de entrada e saída DN 100
    s.tubo(-400, 220, 0, 200, 110).tubo(600, 160, 1200, 130, 110);
    s.n(-300, 270, -380, 640, 'Entrada DN 100').n(1100, 135, 1150, 400, 'Saída DN 100 (decl. ≥ 1%)');
    // fundo com meia-cana
    s.a(300, 160, 55, 180, 360).l(0, 160, 245, 160).l(355, 160, 600, 160).l(0, 160, 0, 160);
    s.n(300, 105, 420, -230, 'Fundo em meia-cana, com declividade para a saída');
    s.d(0, 0, 600, 0, -260, '60 cm (mínimo interno)');
    s.d(700, 0, 700, 960, 180, 'até 1,00 m de profundidade', true);
    s.t(300, -420, 'CORTE', 34, 'c');
    // planta
    const X = 1700;
    s.r(X, 0, 800, 800).r(X + 100, 100, 600, 600);
    s.l(X - 300, 420, X + 100, 400, 'TUBO').l(X - 300, 380, X + 100, 360, 'TUBO');
    s.l(X + 700, 400, X + 1100, 420, 'TUBO').l(X + 700, 360, X + 1100, 380, 'TUBO');
    s.l(X + 100, 380, X + 700, 380, 'EIXO');
    s.d(X + 100, 100, X + 700, 100, -240, '60 cm');
    s.d(X + 800, 100, X + 800, 700, 420, '60 cm', true);
    s.t(X + 400, -420, 'PLANTA', 34, 'c');
    s.t(-400, -560, 'Caixa de inspeção: base quadrada de 60 cm de lado interno (ou cilíndrica com 60 cm de diâmetro) e no máximo 1,00 m de profundidade.', 24);
    s.t(-400, -600, 'Use em mudanças de direção, junções e a cada 25 m de trecho reto, no máximo. NBR 8160.', 24);
    return s.g;
  })();

  // ---------- 5. Abrigo de hidrante ----------
  const abrigo = (() => {
    const s = D();
    s.l(-300, 0, 1400, 0).hach(-300, -120, 1700, 120).t(1400, 30, 'PISO ACABADO', 24, 'r');
    const y0 = 900, W = 600, H = 900;
    s.r(0, y0, W, H).r(30, y0 + 30, W - 60, H - 60).t(W / 2, y0 + H - 110, 'INCÊNDIO', 40, 'c');
    s.r(60, y0 + 200, W - 120, H - 360, 'COTA').n(W - 60, y0 + 500, W + 200, y0 + 950, 'Porta com visor (vidro ou acrílico) e trinco');
    // mangueira aduchada
    s.r(80, y0 + 220, 200, 360, 'TUBO').r(110, y0 + 250, 140, 300, 'TUBO').n(180, y0 + 300, -120, y0 + 1000, 'Mangueira aduchada com uniões storz');
    // esguicho e chave
    s.l(330, y0 + 560, 500, y0 + 560, 'CONTORNO').l(330, y0 + 580, 500, y0 + 580, 'CONTORNO').n(450, y0 + 570, -120, y0 + 1100, 'Esguicho regulável');
    s.l(340, y0 + 620, 480, y0 + 660, 'CONTORNO').n(410, y0 + 640, W + 200, y0 + 1060, 'Chave de mangueira (storz)');
    // válvula angular 45°
    const vx = 420, vy = 1300;
    s.c(vx, vy, 45, 'CONTORNO').l(vx, vy + 45, vx, vy + 110).l(vx - 50, vy + 110, vx + 50, vy + 110).l(vx + 30, vy - 30, vx + 90, vy - 90);
    s.n(vx + 45, vy, W + 200, vy - 60, 'Válvula angular 45° de 2 1/2" (registro de hidrante)');
    // coluna de incêndio
    s.tubo(W + 120, -120, W + 120, 2400, 70).l(vx + 35, vy - 15, W + 85, vy - 15, 'TUBO').l(vx + 35, vy + 15, W + 85, vy + 15, 'TUBO');
    s.n(W + 120, 2200, W + 300, 2300, 'Coluna de incêndio (vermelha)');
    s.d(0, 0, 0, vy, -200, '1,00 m a 1,50 m', true);
    s.d(0, y0, W, y0, -100, 'conforme a IT');
    s.t(-300, -330, 'Válvula do hidrante entre 1,00 m e 1,50 m do piso (NBR 13714), sem obstáculos à frente. Mangueira, esguicho e chave no abrigo.', 24);
    s.t(-300, -370, 'Comprimento da mangueira, diâmetro e medidas do abrigo: Instrução Técnica do Corpo de Bombeiros do estado.', 24);
    return s.g;
  })();


  // ---------- Lote em revisão: símbolos comuns ----------
  const reg = (s, x, y) => s.r(x - 35, y - 30, 70, 60);                                   // registro
  const ret = (s, x, y) => s.r(x - 35, y - 30, 70, 60).l(x - 35, y - 30, x + 35, y + 30); // retenção
  const man = (s, x, y, h = 90) => s.l(x, y, x, y + h).c(x, y + h + 30, 30, 'CONTORNO');  // manômetro

  // ---------- 6. Casa de bombas de recalque (esquema em planta) ----------
  const bombas = (() => {
    const s = D();
    s.r(-100, -50, 2700, 1650).tubo(200, 200, 200, 1300, 70).tubo(2350, 200, 2350, 1500, 60);
    s.tubo(-400, 750, 200, 750, 70).tubo(2350, 1500, 2350, 1950, 60);
    for (const y of [350, 1000]) {
      s.tubo(200, y, 950, y, 60).tubo(1150, y, 2350, y, 50);
      reg(s, 480, y); s.r(680, y - 45, 70, 90); s.c(1050, y, 100, 'CONTORNO'); s.r(980, y + 100, 140, 230);
      s.r(1330, y - 45, 70, 90); man(s, 1560, y + 25); ret(s, 1800, y); reg(s, 2050, y);
    }
    s.n(-250, 750, -300, 1100, 'Sucção (do reservatório inferior)');
    s.n(480, 1030, 300, 1800, 'Registro na sucção');
    s.n(715, 1045, 500, 1950, 'Junta flexível');
    s.n(1050, 1100, 900, 2100, 'Bomba');
    s.n(1050, 1250, 1200, 1800, 'Motor');
    s.n(1365, 1045, 1420, 1950, 'Junta flexível');
    s.n(1560, 1145, 1650, 2100, 'Manômetro');
    s.n(1800, 1030, 1900, 1800, 'Válvula de retenção');
    s.n(2050, 1030, 2500, 1650, 'Registro no recalque');
    s.n(2350, 1850, 2500, 2000, 'Recalque ao reservatório superior');
    s.n(1050, 250, 1300, -220, 'Bomba reserva, com as mesmas peças');
    s.n(0, -50, -250, -220, 'Base e drenagem do piso: conforme projeto');
    s.t(-400, -420, 'Esquema em planta, sem escala. Duas bombas iguais: uma em operação e uma reserva. Diâmetros, vazão e altura manométrica: conforme projeto. NBR 5626.', 24);
    return s.g;
  })();

  // ---------- 7. Banheiro: esgoto em planta e corte ----------
  const banheiro = (() => {
    const s = D(), Y = 1500;
    s.r(0, Y, 2400, 1800).r(40, Y + 40, 2320, 1720);
    s.r(250, Y + 1350, 300, 400); s.c(400, Y + 1150, 40, 'TUBO');
    s.r(890, Y + 1490, 420, 260); s.c(1100, Y + 1490, 25, 'TUBO');
    s.c(1300, Y + 1150, 110, 'CONTORNO').c(1300, Y + 1150, 75, 'CONTORNO');
    s.r(1650, Y + 1050, 500, 650, 'COTA'); s.c(1900, Y + 1200, 45, 'TUBO');
    s.tubo(400, Y + 1150, 2050, Y + 300, 100).tubo(1100, Y + 1490, 1300, Y + 1150, 40).tubo(1900, Y + 1200, 1300, Y + 1150, 40).tubo(1300, Y + 1040, 1300, Y + 686, 50);
    s.c(2050, Y + 300, 70);
    s.n(400, Y + 1150, -200, Y + 1900, 'Saída da bacia');
    s.n(800, Y + 944, -200, Y + 700, 'Ramal DN 100 (declividade mínima de 1%)');
    s.n(1100, Y + 1490, 800, Y + 1950, 'Saída do lavatório');
    s.n(1300, Y + 1260, 1500, Y + 1950, 'Caixa sifonada');
    s.n(1900, Y + 1200, 2550, Y + 1650, 'Ralo do box');
    s.n(1600, Y + 1175, 2550, Y + 1300, 'Ramal DN 40 (declividade mínima de 2%)');
    s.n(1300, Y + 860, 2550, Y + 900, 'Saída da caixa sifonada DN 50');
    s.n(2050, Y + 300, 2550, Y + 300, 'Tubo de queda');
    s.t(1200, Y - 90, 'PLANTA', 34, 'c');
    s.r(0, 900, 2400, 120).hach(0, 900, 2400, 120).t(1200, 1050, 'LAJE', 26, 'c');
    s.tubo(300, 900, 300, 720, 100).tubo(300, 720, 2050, 560, 100).tubo(1200, 900, 1200, 780, 50).tubo(2050, 1100, 2050, 200, 100);
    s.r(1090, 780, 220, 120);
    s.n(300, 800, -200, 800, 'Descida da bacia');
    s.n(800, 675, 700, 300, 'Ramal com declividade para o tubo de queda');
    s.n(1200, 780, 1500, 1200, 'Caixa sifonada');
    s.n(2050, 300, 2550, 300, 'Tubo de queda');
    s.t(1200, 100, 'CORTE', 34, 'c');
    s.t(-200, -80, 'Ramal de DN 75 ou menor: declividade mínima de 2%. DN 100 ou maior: 1%. Traçado, ventilação e diâmetros: conforme projeto. NBR 8160.', 24);
    return s.g;
  })();

  // ---------- 8. Tubo de queda e ventilação ----------
  const ventilacao = (() => {
    const s = D();
    for (const y of [0, 1000, 2000, 3000]) s.r(0, y - 120, 1800, 120).hach(0, y - 120, 1800, 120);
    s.tubo(500, -500, 500, 3500, 100).tubo(1500, -300, 1500, 2820, 75).tubo(500, -300, 1500, -300, 75).tubo(500, 2820, 1500, 2820, 75);
    s.tubo(500, -500, 1700, -650, 100);
    for (const y of [300, 1300, 2300]) { s.tubo(1250, y + 180, 500, y, 100); s.tubo(1100, y + 144, 1500, y + 450, 50); }
    s.l(430, 3560, 570, 3560).l(430, 3560, 500, 3640).l(570, 3560, 500, 3640);
    s.n(500, 3500, 900, 3700, 'Terminal de ventilação aberto, protegido');
    s.d(500, 3000, 500, 3500, -220, 'conforme NBR 8160', true);
    s.t(1750, 3030, 'COBERTURA', 26, 'r');
    s.n(500, 1700, 2000, 3300, 'Tubo de queda');
    s.n(1500, 1900, 2000, 2400, 'Coluna de ventilação');
    s.n(1000, 2820, 2000, 2900, 'Ligação da coluna ao tubo de queda, acima do último ramal');
    s.n(900, 1396, 2000, 1000, 'Ramal de esgoto do pavimento');
    s.n(1300, 1520, 2000, 1500, 'Ramal de ventilação');
    s.n(1000, -300, 2000, 200, 'Pé da coluna de ventilação');
    s.n(1200, -590, 2000, -300, 'Saída ao subcoletor, com curvas de raio longo');
    s.t(0, -900, 'Esquema em elevação, sem escala. Diâmetros, distâncias e alturas do terminal: conforme projeto e NBR 8160.', 24);
    return s.g;
  })();

  // ---------- 9. Pontos de água do banheiro ----------
  const pontos = (() => {
    const s = D();
    s.l(-100, 0, 3100, 0).hach(-100, -120, 3200, 120).r(0, 0, 3000, 2700);
    s.r(300, 0, 400, 450); s.r(1150, 650, 500, 180); s.r(2150, 0, 700, 40, 'COTA');
    s.tubo(100, 2450, 2800, 2450, 32);
    const pts = [['A', 500, 350], ['B', 800, 500], ['C', 1400, 900], ['D', 2000, 1800], ['E', 2300, 1150], ['F', 2500, 2250]];
    for (const [nm, x, y] of pts) { s.l(x, 2450, x, y + 40, 'TUBO').c(x, y, 40, 'CONTORNO').t(x, y - 12, nm, 30, 'c'); }
    s.t(500, 100, 'Bacia', 26, 'c').t(1400, 560, 'Lavatório', 26, 'c').t(2500, 80, 'Box', 26, 'c');
    const T = 3400, itens = [['Ponto', 'Peça', 'Altura'], ['A', 'Alimentação da bacia', 'manual da louça'], ['B', 'Ducha higiênica', 'manual do metal'], ['C', 'Lavatório', 'manual da louça'], ['D', 'Registro de gaveta do ambiente', 'projeto'], ['E', 'Registro de pressão do chuveiro', 'manual do metal'], ['F', 'Chuveiro', 'manual do metal']];
    s.r(T, 1500, 1750, 720, 'COTA');
    itens.forEach((ln, i) => { const y = 2150 - i * 100; s.t(T + 30, y, ln[0], 26).t(T + 200, y, ln[1], 26).t(T + 1250, y, ln[2], 26); if (i) s.l(T, y + 70, T + 1750, y + 70, 'COTA'); });
    s.t(-100, -330, 'Elevação da parede hidráulica, sem escala. As alturas variam com a louça, o metal e a altura do usuário: confirme antes de embutir. NBR 5626.', 24);
    return s.g;
  })();

  // ---------- 10. Caixa de gordura ----------
  const gordura = (() => {
    const s = D();
    s.l(-500, 1000, 1500, 1000).t(1500, 1040, 'TERRENO', 24, 'r');
    s.r(-100, -100, 1200, 100).hach(-100, -100, 1200, 100).r(-100, 0, 100, 960).r(1000, 0, 100, 960).r(-120, 960, 1240, 60);
    s.tubo(-500, 720, 200, 700, 80).tubo(200, 740, 200, 380, 80);
    s.tubo(800, 690, 1500, 660, 80).tubo(800, 740, 800, 380, 80);
    s.l(0, 700, 1000, 700, 'EIXO');
    for (let k = 0; k < 4; k++) s.l(20, 720 + k * 16, 980, 720 + k * 16, 'HACHURA');
    s.n(-350, 715, -420, 1180, 'Entrada do esgoto da cozinha');
    s.n(200, 450, -420, 400, 'Tê com a descida mergulhada');
    s.n(500, 745, 300, 1200, 'Gordura acumulada na superfície');
    s.n(1000, 700, 1350, 1200, 'Nível de saída');
    s.n(800, 450, 1350, 300, 'Tê de saída: retira a água de baixo da gordura');
    s.n(1300, 670, 1400, 900, 'Saída para a rede');
    s.n(600, 1020, 750, 1330, 'Tampa removível, bem vedada');
    s.n(-50, 300, -420, 150, 'Parede revestida e impermeável');
    s.n(-50, -50, -420, -150, 'Base de concreto');
    s.d(0, 0, 1000, 0, -240, 'dimensões conforme contribuição (NBR 8160)');
    s.t(500, -440, 'CORTE', 34, 'c');
    s.t(-500, -600, 'Receber só as pias de cozinha. Limpeza periódica. Tipo, volume e dimensões: conforme projeto e NBR 8160.', 24);
    return s.g;
  })();

  // ---------- 11. Estação redutora de pressão ----------
  const redutora = (() => {
    const s = D();
    s.tubo(-200, 600, 500, 600, 60).tubo(500, 300, 500, 900, 60).tubo(2500, 300, 2500, 900, 60).tubo(2500, 600, 3200, 600, 60);
    for (const y of [300, 900]) {
      s.tubo(500, y, 2500, y, 50); reg(s, 780, y); s.r(1000, y - 35, 110, 70).l(1040, y - 35, 1090, y - 110).l(1090, y - 110, 1120, y - 80, 'CONTORNO');
      s.r(1400, y - 60, 180, 120).l(1490, y + 60, 1490, y + 150).l(1440, y + 150, 1540, y + 150); reg(s, 2200, y);
    }
    man(s, 100, 630); man(s, 2900, 630);
    s.n(-100, 600, -200, 1100, 'Entrada: pressão alta');
    s.n(100, 750, 100, 1300, 'Manômetro de montante');
    s.n(780, 930, 650, 1500, 'Registro');
    s.n(1050, 935, 1100, 1300, 'Filtro Y');
    s.n(1490, 1050, 1600, 1500, 'Válvula redutora de pressão');
    s.n(2200, 930, 2300, 1300, 'Registro');
    s.n(2900, 750, 2900, 1200, 'Manômetro de jusante');
    s.n(3100, 600, 3200, 300, 'Saída: pressão regulada');
    s.n(1490, 240, 1600, -100, 'By-pass: segunda válvula, em reserva');
    s.t(-200, -300, 'Esquema sem escala. Permite trocar ou regular uma válvula sem parar o abastecimento. Pressões e diâmetros: conforme projeto. NBR 5626.', 24);
    return s.g;
  })();

  // ---------- 12. Passagem em laje e parede ----------
  const passagem = (() => {
    const s = D();
    s.r(0, 700, 1400, 220).hach(0, 700, 1400, 220);
    s.tubo(700, 100, 700, 1500, 110).r(620, 670, 160, 300, 'CONTORNO');
    for (const x of [630, 770]) for (let y = 720; y < 920; y += 30) s.l(x - 10, y, x + 10, y + 20, 'HACHURA');
    s.n(700, 1300, 1000, 1500, 'Tubo');
    s.n(780, 960, 1000, 1250, 'Camisa (luva de passagem)');
    s.n(630, 800, 200, 1250, 'Folga preenchida com selo corta-fogo');
    s.n(200, 800, 100, 400, 'Laje entre pavimentos');
    s.t(700, -60, 'A) PASSAGEM EM LAJE', 32, 'c');
    const X = 2100;
    s.r(X + 600, 0, 220, 1500).hach(X + 600, 0, 220, 1500);
    s.tubo(X, 750, X + 1500, 750, 110).r(X + 570, 670, 280, 160, 'CONTORNO');
    for (const y of [680, 820]) for (let x = X + 620; x < X + 820; x += 30) s.l(x, y - 10, x + 20, y + 10, 'HACHURA');
    s.n(X + 1200, 750, X + 1300, 1100, 'Tubo');
    s.n(X + 850, 830, X + 1000, 1350, 'Camisa (luva de passagem)');
    s.n(X + 660, 820, X + 150, 1300, 'Folga preenchida com selo corta-fogo');
    s.n(X + 710, 200, X + 1100, 250, 'Parede de compartimentação');
    s.t(X + 700, -60, 'B) PASSAGEM EM PAREDE', 32, 'c');
    s.t(0, -240, 'Selo com resistência ao fogo igual à do elemento atravessado e produto ensaiado para aquele tipo de tubo. Dimensões: conforme projeto e fabricante do selo.', 24);
    s.t(0, -280, 'Tubo plástico em shaft ou laje de compartimentação: use colar ou selo intumescente. NBR 15575 e Instrução Técnica do Corpo de Bombeiros.', 24);
    return s.g;
  })();

  // ---------- 13. Entrada de gás ----------
  const gas = (() => {
    const s = D();
    s.l(-400, 0, 2000, 0).hach(-400, -150, 2400, 150);
    s.r(0, 0, 1400, 1200).r(40, 40, 1320, 1120);
    for (const y of [120, 1050]) s.r(600, y, 200, 40, 'COTA');
    s.tubo(200, -150, 200, 500, 32).tubo(200, 500, 1200, 500, 32).tubo(1200, 500, 1200, 1500, 32);
    reg(s, 330, 500); s.r(470, 440, 130, 120); s.r(740, 380, 260, 260);
    s.t(870, 490, 'M', 44, 'c'); reg(s, 1100, 500);
    s.n(200, -80, -100, -300, 'Rede da distribuidora');
    s.n(330, 530, -100, 900, 'Registro de corte');
    s.n(535, 560, 200, 1400, 'Regulador de pressão');
    s.n(870, 640, 700, 1500, 'Medidor');
    s.n(1100, 530, 1500, 900, 'Registro após o medidor');
    s.n(1200, 1400, 1500, 1500, 'Rede interna do imóvel');
    s.n(700, 1070, 1500, 1200, 'Ventilação superior');
    s.n(700, 140, 1500, 200, 'Ventilação inferior');
    s.t(-400, -450, 'Abrigo ventilado, com porta identificada. Modelo, medidas e posição: padrão da distribuidora e NBR 15526.', 24);
    return s.g;
  })();

  // ---------- 14. Válvula de governo e alarme de sprinklers ----------
  const vga = (() => {
    const s = D();
    s.l(-300, 0, 2200, 0).hach(-300, -120, 2500, 120);
    s.tubo(800, 0, 800, 2800, 110);
    reg(s, 800, 450); s.l(800, 480, 800, 480); s.r(680, 1000, 240, 400);
    man(s, 860, 760); s.l(800, 760, 860, 760); man(s, 860, 1650); s.l(800, 1650, 860, 1650);
    s.tubo(920, 1200, 1400, 1200, 20).tubo(1400, 1200, 1400, 1500, 20).r(1320, 1500, 160, 320).tubo(1400, 1820, 1400, 2200, 20).tubo(1400, 2200, 1800, 2200, 20).r(1800, 2100, 200, 200);
    s.c(1400, 2020, 45, 'CONTORNO');
    s.tubo(680, 900, 200, 900, 40).tubo(200, 900, 200, 0, 40); reg(s, 430, 900);
    s.n(800, 2600, 1100, 2800, 'Rede de sprinklers');
    s.n(800, 450, 1200, 350, 'Registro de bloqueio com indicação de posição (supervisionado)');
    s.n(800, 1200, 1250, 900, 'Válvula de governo e alarme');
    s.n(890, 880, 1250, 650, 'Manômetro abaixo da válvula');
    s.n(890, 1770, 1100, 2400, 'Manômetro acima da válvula');
    s.n(1480, 1660, 1750, 1650, 'Câmara de retardo');
    s.n(1445, 2020, 1750, 1900, 'Pressostato de alarme');
    s.n(1900, 2300, 2000, 2550, 'Gongo hidráulico');
    s.n(430, 930, -200, 1400, 'Dreno e ensaio, com registro');
    s.n(800, 100, 1200, 120, 'Alimentação');
    s.t(-300, -320, 'Esquema sem escala. Conjunto do fabricante da válvula, instalado e ensaiado conforme o manual, a NBR 10897 e o projeto.', 24);
    return s.g;
  })();

  // ---------- 15. Hidrante de recalque no passeio ----------
  const recalque = (() => {
    const s = D();
    s.l(-500, 0, 1900, 0).hach(-500, 0, 400, 60).hach(1000, 0, 900, 60).t(1900, 90, 'PASSEIO', 24, 'r');
    s.r(0, -800, 100, 800).r(800, -800, 100, 800).r(-20, -20, 940, 50);
    s.tubo(1900, -600, 450, -600, 90).tubo(450, -600, 450, -220, 90);
    s.r(390, -560, 120, 110); s.r(370, -220, 160, 60); s.l(390, -160, 510, -160);
    for (let x = 120; x < 790; x += 70) s.l(x, -800, x + 35, -740, 'HACHURA');
    ret(s, 1250, -600);
    s.n(450, 30, 250, 330, 'Tampa metálica com a inscrição INCÊNDIO');
    s.n(510, -190, 1150, -180, 'Adaptador storz com tampão');
    s.n(390, -505, -300, -400, 'Válvula do hidrante de recalque');
    s.n(1250, -570, 1450, -280, 'Válvula de retenção');
    s.n(1750, -600, 1750, -900, 'Da rede de incêndio');
    s.n(450, -780, -300, -950, 'Fundo drenante (brita)');
    s.t(-500, -1200, 'Acesso livre para a viatura, com a saída voltada para cima. Posição, profundidade, diâmetros e inscrição: Instrução Técnica do Corpo de Bombeiros e NBR 13714.', 24);
    return s.g;
  })();

  return [
    { id: 'suportes', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'suporte', 'abraçadeira', 'pêra', 'pendural', 'tirante', 'vergalhão roscado', 'perfilado', 'trapézio', 'fixação de tubulação', 'espaçamento de suportes'], titulo: 'Suportes de tubulação', desc: 'Pendural com abraçadeira tipo pêra, trapézio com perfilado e espaçamento máximo entre suportes para aço e cobre.', normas: 'NBR 5626 · NBR 8160 · MSS SP-58', g: suportes, mat: 'suportes' },
    { id: 'cavalete', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'cavalete', 'hidrômetro', 'ramal predial', 'padrão de entrada', 'abrigo do hidrômetro', 'kit cavalete'], titulo: 'Cavalete do hidrômetro', desc: 'Elevação do cavalete com ramal predial, registros, hidrômetro e abrigo. As medidas finais são do padrão da concessionária.', normas: 'NBR 5626 · padrão da concessionária', g: cavalete, mat: 'cavaletes' },
    { id: 'barrilete', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'barrilete', 'reservatório superior', 'caixa d\'água', 'extravasor', 'ladrão', 'torneira de boia', 'coluna de água fria', 'ventilação da coluna', 'respiro', 'limpeza do reservatório', 'reserva técnica de incêndio', 'reserva de incêndio', 'RTI', 'coluna de incêndio'], titulo: 'Barrilete e saídas do reservatório', desc: 'Reservatório de duas células com reserva técnica de incêndio, saídas de consumo acima dela, saída própria de incêndio, alimentação com boia, extravasor, limpeza, barrilete, registros e colunas com ventilação.', normas: 'NBR 5626 · NBR 13714 · IT do Corpo de Bombeiros', g: barrilete, mat: 'reservatorios' },
    { id: 'caixa-inspecao', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'caixa de inspeção', 'caixa de passagem', 'esgoto', 'meia-cana', 'tampa de caixa'], titulo: 'Caixa de inspeção de esgoto', desc: 'Corte e planta da caixa de 60 cm com fundo em meia-cana, tampa vedada e profundidade máxima de 1,00 m.', normas: 'NBR 8160', g: caixa, mat: 'caixas-inspecao' },
    { id: 'abrigo-hidrante', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'abrigo de hidrante', 'hidrante', 'caixa de incêndio', 'mangueira de incêndio', 'esguicho', 'válvula angular', 'chave storz', 'incêndio'], titulo: 'Abrigo de hidrante', desc: 'Abrigo com mangueira, esguicho, chave e válvula angular de 45°, com a altura da válvula em relação ao piso.', normas: 'NBR 13714 · IT do Corpo de Bombeiros', g: abrigo, mat: 'hidrantes' },
    { id: 'casa-bombas', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'casa de bombas', 'recalque', 'motobomba', 'junta flexível', 'válvula de retenção', 'sucção'], titulo: 'Casa de bombas de recalque', desc: 'Duas bombas com reserva, registros, juntas flexíveis, manômetros, retenção e barrilete de recalque.', normas: 'NBR 5626', g: bombas, mat: 'bombas' },
    { id: 'banheiro-esgoto', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'banheiro', 'esgoto', 'caixa sifonada', 'ramal de esgoto', 'declividade', 'ralo'], titulo: 'Banheiro: esgoto em planta e corte', desc: 'Bacia, lavatório, ralo, caixa sifonada, ramais com declividade e ligação ao tubo de queda.', normas: 'NBR 8160', g: banheiro, mat: 'pvc-esgoto' },
    { id: 'tubo-queda', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'tubo de queda', 'ventilação', 'coluna de ventilação', 'respiro', 'terminal de ventilação', 'subcoletor'], titulo: 'Tubo de queda e ventilação', desc: 'Tubo de queda, coluna de ventilação, ramais por pavimento, terminal na cobertura e pé da coluna.', normas: 'NBR 8160', g: ventilacao, mat: 'pvc-esgoto' },
    { id: 'pontos-banheiro', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'pontos de água', 'altura dos pontos', 'parede hidráulica', 'registro de pressão', 'chuveiro', 'banheiro'], titulo: 'Pontos de água do banheiro', desc: 'Elevação da parede hidráulica com os pontos da bacia, ducha, lavatório, registros e chuveiro.', normas: 'NBR 5626', g: pontos, mat: 'metais' },
    { id: 'caixa-gordura', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'caixa de gordura', 'gordura', 'cozinha', 'esgoto'], titulo: 'Caixa de gordura', desc: 'Corte com entrada e saída em tê mergulhado, camada de gordura, tampa vedada e base.', normas: 'NBR 8160', g: gordura, mat: 'caixas-inspecao' },
    { id: 'estacao-redutora', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'válvula redutora', 'redutora de pressão', 'estação redutora', 'VRP', 'by-pass', 'filtro Y'], titulo: 'Estação redutora de pressão', desc: 'Duas válvulas redutoras em paralelo, filtro Y, registros e manômetros antes e depois.', normas: 'NBR 5626', g: redutora, mat: 'redutora' },
    { id: 'passagem-laje-parede', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'passagem de tubulação', 'camisa', 'luva de passagem', 'selo corta-fogo', 'corta-fogo', 'shaft', 'compartimentação'], titulo: 'Passagem em laje e parede', desc: 'Camisa, folga e selo corta-fogo na travessia de laje e de parede de compartimentação.', normas: 'NBR 15575 · IT do Corpo de Bombeiros', g: passagem, mat: 'corta-fogo' },
    { id: 'entrada-gas', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'entrada de gás', 'gás', 'abrigo de gás', 'medidor de gás', 'regulador de pressão', 'GLP', 'gás natural'], titulo: 'Entrada de gás', desc: 'Abrigo ventilado com registro de corte, regulador, medidor e saída para a rede interna.', normas: 'NBR 15526 · padrão da distribuidora', g: gas, mat: 'reguladores' },
    { id: 'vga-sprinklers', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'válvula de governo', 'VGA', 'sprinkler', 'sprinklers', 'gongo hidráulico', 'pressostato', 'câmara de retardo', 'incêndio'], titulo: 'Válvula de governo e alarme de sprinklers', desc: 'Registro de bloqueio, válvula, manômetros, câmara de retardo, pressostato, gongo e dreno de ensaio.', normas: 'NBR 10897', g: vga, mat: 'acessorios-sprinkler' },
    { id: 'hidrante-recalque', chaves: ['detalhe típico', 'detalhes típicos', 'detalhe construtivo', 'desenho', 'DXF', 'CAD', 'AutoCAD', 'baixar', 'download', 'hidrante de recalque', 'recalque de incêndio', 'registro de passeio', 'storz', 'incêndio', 'hidrante'], titulo: 'Hidrante de recalque no passeio', desc: 'Caixa no passeio, tampa identificada, válvula, adaptador storz, retenção e fundo drenante.', normas: 'NBR 13714 · IT do Corpo de Bombeiros', g: recalque, mat: 'hidrantes' },
  ];
})();

// ---------- saída: SVG e DXF ----------
const DET_COR = { CONTORNO: '#1d2733', TUBO: '#1f7fbf', COTA: '#8a96a3', TEXTO: '#1d2733', HACHURA: '#aab4bf', EIXO: '#c0504d' };
function detBox(g) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  const p = (x, y) => { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); };
  for (const e of g) {
    if (e[0] === 'l') { p(e[1], e[2]); p(e[3], e[4]); }
    else if (e[0] === 'c' || e[0] === 'a') { p(e[1] - e[3], e[2] - e[3]); p(e[1] + e[3], e[2] + e[3]); }
    else if (e[0] === 't') { const w = e[4].length * e[3] * 0.55, x = e[5] === 'c' ? e[1] - w / 2 : e[5] === 'r' ? e[1] - w : e[1]; p(x, e[2]); p(x + w, e[2] + e[3]); }
  }
  return [x0 - 60, y0 - 60, x1 + 60, y1 + 60];
}
// tela = true: cores pelas classes CSS (tema claro e escuro); false: cores fixas, fundo branco (arquivo para baixar)
function detSVG(det, tela = true) {
  const [x0, y0, x1, y1] = detBox(det.g), W = x1 - x0, H = y1 - y0;
  const Y = y => (y1 - y + y0);   // inverte o eixo y (CAD → SVG)
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const st = c => tela ? `class="dt-${c.toLowerCase()}"` : `stroke="${DET_COR[c]}" fill="none" stroke-width="${c === 'TUBO' ? 4 : c === 'CONTORNO' ? 3 : 1.6}"${c === 'EIXO' ? ' stroke-dasharray="30 10 6 10"' : ''}`;
  const out = det.g.map(e => {
    if (e[0] === 'l') return `<line x1="${e[1]}" y1="${Y(e[2])}" x2="${e[3]}" y2="${Y(e[4])}" ${st(e[5])}/>`;
    if (e[0] === 'c') return `<circle cx="${e[1]}" cy="${Y(e[2])}" r="${e[3]}" ${st(e[4])}/>`;
    if (e[0] === 'a') {
      const [, cx, cy, r, a1, a2, c] = e, rad = a => a * Math.PI / 180;
      const xa = cx + r * Math.cos(rad(a1)), ya = cy + r * Math.sin(rad(a1)), xb = cx + r * Math.cos(rad(a2)), yb = cy + r * Math.sin(rad(a2));
      return `<path d="M${xa} ${Y(ya)} A${r} ${r} 0 ${(a2 - a1 + 360) % 360 > 180 ? 1 : 0} 0 ${xb} ${Y(yb)}" ${st(c)}/>`;
    }
    if (e[0] === 't') {
      const [, x, y, h, txt, al, c] = e;
      return `<text x="${x}" y="${Y(y)}" font-size="${h}" text-anchor="${al === 'c' ? 'middle' : al === 'r' ? 'end' : 'start'}" ${tela ? `class="dt-txt dt-${c.toLowerCase()}t"` : `fill="${DET_COR[c]}" font-family="Arial, sans-serif"`}>${esc(txt)}</text>`;
    }
    return '';
  }).join('');
  const vb = `${x0} ${y0} ${W} ${H}`;
  return tela ? `<svg viewBox="${vb}" role="img" aria-label="Detalhe típico: ${esc(det.titulo)}" class="dt-svg">${out}</svg>`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${Math.round(W / 4)}mm" height="${Math.round(H / 4)}mm">` +
      `<title>${esc(det.titulo)} — detalhe típico PipeSystem (escala 1:4 do desenho em mm)</title><rect x="${x0}" y="${y0}" width="${W}" height="${H}" fill="#fff"/>${out}` +
      `<text x="${x1 - 40}" y="${y1 - 25}" font-size="22" text-anchor="end" fill="#8a96a3" font-family="Arial, sans-serif">pipesystem.com.br · detalhe típico, sem escala de projeto · ${esc(det.normas)}</text></svg>`;
}
function detDXF(det) {
  // DXF R12 em texto; acentos como \U+00XX (lidos pelo AutoCAD e compatíveis)
  const u = s => String(s).replace(/[^\x20-\x7e]/g, c => '\\U+' + c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0'));
  const cor = { CONTORNO: 7, TUBO: 5, COTA: 8, TEXTO: 7, HACHURA: 9, EIXO: 1 };
  const L = ['0', 'SECTION', '2', 'TABLES', '0', 'TABLE', '2', 'LAYER', '70', String(Object.keys(cor).length)];
  for (const [n, c] of Object.entries(cor)) L.push('0', 'LAYER', '2', n, '70', '0', '62', String(c), '6', n === 'EIXO' ? 'CENTER' : 'CONTINUOUS');
  L.push('0', 'ENDTAB', '0', 'ENDSEC', '0', 'SECTION', '2', 'ENTITIES');
  const f = v => (Math.round(v * 1000) / 1000).toString();
  for (const e of det.g) {
    if (e[0] === 'l') L.push('0', 'LINE', '8', e[5], '10', f(e[1]), '20', f(e[2]), '30', '0', '11', f(e[3]), '21', f(e[4]), '31', '0');
    else if (e[0] === 'c') L.push('0', 'CIRCLE', '8', e[4], '10', f(e[1]), '20', f(e[2]), '30', '0', '40', f(e[3]));
    else if (e[0] === 'a') L.push('0', 'ARC', '8', e[6], '10', f(e[1]), '20', f(e[2]), '30', '0', '40', f(e[3]), '50', f(e[4]), '51', f(e[5]));
    else if (e[0] === 't') {
      const al = e[5] === 'c' ? 1 : e[5] === 'r' ? 2 : 0;
      L.push('0', 'TEXT', '8', e[6], '10', f(e[1]), '20', f(e[2]), '30', '0', '40', f(e[3]), '1', u(e[4]));
      if (al) L.push('72', String(al), '11', f(e[1]), '21', f(e[2]), '31', '0');
    }
  }
  L.push('0', 'ENDSEC', '0', 'EOF');
  return L.join('\r\n') + '\r\n';
}

const DET_REVISAO = 'Em revisão pela equipe Pipesystem';
DETALHES.filter(d => d.revisao).forEach(d => { const [x0, y0] = detBox(d.g); d.g.push(['t', x0 + 60, y0 - 20, 36, DET_REVISAO.toUpperCase(), 'l', 'EIXO']); });

(() => {
  const box = document.getElementById('gpDetalhes');
  if (!box) return;
  box.innerHTML = DETALHES.map(d => `
    <article class="gpdet" id="detalhe-${d.id}">
      <div class="gpdet__fig">${detSVG(d)}</div>
      <div class="gpdet__info">
        <h3>${d.titulo}</h3>
        ${d.revisao ? `<p class="gpdet__rev">${DET_REVISAO}</p>` : ''}
        <p>${d.desc}</p>
        <p class="gpdet__norma">${d.normas} · <a href="/materiais/${d.mat}" data-sheet="mat-${d.mat}">ficha do material</a></p>
        <div class="gpdet__acoes">
          <button type="button" class="btn btn--sm" data-det="${d.id}" data-fmt="dxf">Baixar DXF (CAD)</button>
          <button type="button" class="btn btn--ghost btn--sm" data-det="${d.id}" data-fmt="svg">Baixar SVG</button>
          <button type="button" class="btn btn--ghost btn--sm" data-det="${d.id}" data-fmt="print">Imprimir</button>
        </div>
      </div>
    </article>`).join('');
  const salvar = (txt, nome, tipo) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([txt], { type: tipo }));
    a.download = nome; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  };
  box.addEventListener('click', e => {
    const b = e.target.closest('[data-det]'); if (!b) return;
    const d = DETALHES.find(x => x.id === b.dataset.det), nome = 'pipesystem-detalhe-' + d.id;
    if (b.dataset.fmt === 'dxf') salvar(detDXF(d), nome + '.dxf', 'application/dxf');
    else if (b.dataset.fmt === 'svg') salvar(detSVG(d, false), nome + '.svg', 'image/svg+xml');
    else {
      const w = window.open('', '_blank'); if (!w) return;
      w.document.write(`<!doctype html><meta charset="utf-8"><title>${d.titulo} — PipeSystem</title><style>body{margin:12mm;font:12px Arial,sans-serif}svg{width:100%;height:auto}h1{font-size:16px}</style><h1>${d.titulo}</h1><p>${d.desc} ${d.normas}.</p>${detSVG(d, false).replace(/^<\?xml[^>]*>\s*/, '')}<script>onload=()=>print()<\/script>`);
      w.document.close();
    }
  });
})();
