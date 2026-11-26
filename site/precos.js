// ===== Comparativo de Preços: preços coletados à mão em lojas on-line (coletas em 01/11/2026, 08/11/2026 e 26/11/2026) =====
// sinapi = insumo do SINAPI equivalente (site/sinapi-precos.js); fator = quantas unidades do insumo formam o item (ex.: 6 m de tubo).
// preco = o menor valor mostrado na página da loja na coleta, sem frete; obs = condição desse valor.
const LOJAS_PRECOS = { leroy: 'Leroy Merlin', telha: 'Telhanorte', amazon: 'Amazon', magalu: 'Magazine Luiza', mecanico: 'Loja do Mecânico', fadef: 'Distribuidora Fadef' };
const PRECOS_LOJA_URL = { leroy: 'https://www.leroymerlin.com.br', telha: 'https://www.telhanorte.com.br', amazon: 'https://www.amazon.com.br', magalu: 'https://www.magazineluiza.com.br', mecanico: 'https://www.lojadomecanico.com.br', fadef: 'https://distribuidorafadef.com.br' };
// Imagem de cada produto: [arquivo, autor, página de origem, licença (vazio = divulgação do fabricante)]
const PRECOS_FOTOS = { "tubo-pvc-25": [ "img/materiais/mat-pvc-1.webp", "Tigre", "https://www.tigre.com.br", "" ], "tubo-pvc-32-3m": [ "img/materiais/mat-pvc-1.webp", "Tigre", "https://www.tigre.com.br", "" ], "tubo-pvc-50-3m": [ "img/materiais/mat-pvc-1.webp", "Tigre", "https://www.tigre.com.br", "" ], "joelho-25": [ "img/materiais/preco-joelho-soldavel-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/produto/joelho-90o-soldavel", "" ], "te-25": [ "img/materiais/preco-te-soldavel-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/produto/te-soldavel", "" ], "luva-25": [ "img/materiais/preco-luva-soldavel-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/produto/luva-soldavel", "" ], "tubo-esgoto-100": [ "img/materiais/preco-tubo-esgoto-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/produto/tubo-serie-normal-6m", "" ], "tubo-esgoto-50-3m": [ "img/materiais/preco-tubo-esgoto-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/produto/tubo-serie-normal-6m", "" ], "joelho-esgoto-100": [ "img/materiais/preco-joelho-esgoto-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/produtos/obras-e-reformas/esgoto/tubos-e-conexoes-para-esgoto", "" ], "caixa-sifonada-150": [ "img/materiais/preco-caixa-sifonada-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/en/product/node-84", "" ], "ralo-sifonado-100": [ "img/materiais/preco-ralo-cilindrico-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/produtos/obras-e-reformas/esgoto/tubos-e-conexoes-para-esgoto/caixas-sifonadas-e-ralos", "" ], "adesivo-175": [ "img/materiais/preco-adesivo-pvc-tigre-fab.webp", "Tigre", "https://www.tigre.com.br/en/product/node-884", "" ], "chuveiro-5500": [ "img/materiais/preco-chuveiro-loren-bello-fab.webp", "Lorenzetti", "https://www.lorenzetti.com.br/produto/loren-bello", "" ], "torneira-jardim": [ "img/materiais/preco-torneira-jardim-docol-fab.webp", "Docol", "https://www.docol.com.br/br/90009037006-torneira-para-jardim-com-canopla-1130-nova-pertutti/p", "" ], "caixa-1000": [ "img/materiais/mat-reservatorios-1.webp", "Fortlev", "https://www.fortlev.com.br", "" ], "tubo-ppr-25": [ "img/materiais/mat-ppr-1-fab.webp", "Tigre", "https://www.tigre.com.br", "" ], "engate-inox-30": [ "img/materiais/mat-flexiveis-1-fab.webp", "Tigre", "https://www.tigre.com.br", "" ], "torneira-boia-34": [ "img/materiais/mat-boia-tigre-fab.webp", "Tigre", "https://www.tigre.com.br", "" ], "joelho-bucha-latao-25-12": [ "img/materiais/mat-pvc-bucha-joelho-fab.webp", "Tigre", "https://www.tigre.com.br/produto/joelho-90o-soldavel-com-bucha-de-latao", "" ], "registro-gaveta-34": [ "img/produtos/registros-latao-1.webp", "Veronidae", "https://commons.wikimedia.org/wiki/File:Stopcock_2013_002.JPG", "CC BY-SA 3.0" ], "fita-veda-18-25": [ "img/produtos/vedantes-3.webp", "Tomwsulcer", "https://commons.wikimedia.org/wiki/File:Teflon_tape_used_for_sealing_plumbing_connections.jpg", "CC0" ], "tubo-cpvc-22": [ "img/produtos/tubos-cpvc-3.webp", "Next365", "https://commons.wikimedia.org/wiki/File:Erector1357661.jpg", "CC BY-SA 4.0" ], "storz-chave-dupla": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "storz-reducao": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "storz-uniao-112": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "storz-uniao-212": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "esguicho-solido-112-16": ["img/materiais/mat-hidrantes-esguicho-bucka-fab.webp", "Bucka", "https://www.bucka.com.br/esguichos/esguichos-manuais/esguicho-regulavel-para-mangueira-bucka-200/", ""], "esguicho-solido-112-19": ["img/materiais/mat-hidrantes-esguicho-bucka-fab.webp", "Bucka", "https://www.bucka.com.br/esguichos/esguichos-manuais/esguicho-regulavel-para-mangueira-bucka-200/", ""], "esguicho-regulavel-112": ["img/materiais/mat-hidrantes-esguicho-bucka-fab.webp", "Bucka", "https://www.bucka.com.br/esguichos/esguichos-manuais/esguicho-regulavel-para-mangueira-bucka-200/", ""], "esguicho-regulavel-212": ["img/materiais/mat-hidrantes-esguicho-bucka-fab.webp", "Bucka", "https://www.bucka.com.br/esguichos/esguichos-manuais/esguicho-regulavel-para-mangueira-bucka-200/", ""], "storz-adaptador-212": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "storz-adaptador-112": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "anel-expansao-112": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "anel-expansao-212": ["img/materiais/mat-hidrantes-storz-metalcasty-fab.webp", "Metalcasty", "https://www.metalcasty.com.br/produto/adaptador-storz-para-mangueira-de-incendio/", ""], "valvula-hidrante-45": ["img/materiais/mat-valvula-hidrante-bucka-fab.webp", "Bucka", "https://www.bucka.com.br/hidrantes/valvula-para-hidrantes/valvula-para-hidrante-industrial-pn20-300-psi/", ""], "sprinkler-pendente-68": ["img/produtos/sprinklers-reliable-pendente.webp", "Reliable", "https://www.reliablesprinkler.com/products/sprinklers/", ""], "canopla-sprinkler": ["img/materiais/mat-acessorios-sprinkler-viking-fab.webp", "Viking", "https://www.vikinggroupinc.com/products/fire-sprinklers/accessories/escutcheons", ""], "gaveta-bruto-1": ["img/produtos/registros-latao-1.webp", "Veronidae", "https://commons.wikimedia.org/wiki/File:Stopcock_2013_002.JPG", "CC BY-SA 3.0"], "gaveta-bruto-2": ["img/produtos/registros-latao-1.webp", "Veronidae", "https://commons.wikimedia.org/wiki/File:Stopcock_2013_002.JPG", "CC BY-SA 3.0"], "gaveta-bruto-212": ["img/produtos/registros-latao-1.webp", "Veronidae", "https://commons.wikimedia.org/wiki/File:Stopcock_2013_002.JPG", "CC BY-SA 3.0"], "gaveta-bruto-4": ["img/produtos/registros-latao-1.webp", "Veronidae", "https://commons.wikimedia.org/wiki/File:Stopcock_2013_002.JPG", "CC BY-SA 3.0"], "galv-cotovelo-212": ["img/materiais/mat-galv-1.webp", "Tupy", "https://www.tupy.com.br/conexoes/tupy-npt/", ""], "galv-te-212": ["img/materiais/mat-galv-1.webp", "Tupy", "https://www.tupy.com.br/conexoes/tupy-npt/", ""], "galv-luva-212": ["img/materiais/mat-galv-1.webp", "Tupy", "https://www.tupy.com.br/conexoes/tupy-npt/", ""], "galv-uniao-212": ["img/materiais/mat-galv-1.webp", "Tupy", "https://www.tupy.com.br/conexoes/tupy-npt/", ""], "galv-tampao-212": ["img/materiais/mat-galv-1.webp", "Tupy", "https://www.tupy.com.br/conexoes/tupy-npt/", ""] };
const PRECOS = {
  coleta: '01/11/2026, 08/11/2026 e 26/11/2026 (incêndio, com o selo Novo)',
  itens: [
    { id: 'tubo-pvc-25', nome: 'Tubo de PVC soldável 25 mm, barra de 6 m', cat: 'Tubos', sinapi: { cod: 9868, fator: 6 },
      chaves: ['cano', 'água fria', 'marrom', '3/4'],
      ofertas: [
        ['leroy', 'Cano Soldável Marrom 6 m 25 mm Tigre', 26.90, '', '/cano-soldavel-marrom-6m-25mm-3-4-tigre_88018343'],
        ['telha', 'Tubo Soldável de PVC 25 mm com 6 m Tigre', 38.90, '', '/tubo-soldavel-6-00m-25mm-tigre-23701/p'],
        ['magalu', 'Tubo Soldável PVC 25 mm Marrom 6 m Plastubos', 53.90, '', '/tubo-soldavel-pvc-25mm-marrom-6m-resistente-a-750-kpa-plastubos/p/ffd87ka306/cj/cohl/'],
        ['magalu', 'Tubo Soldável em PVC Marrom 25 mm 6 m Tigre', 79.90, '', '/tubo-soldavel-em-pvc-marrom-25mm-6m-tigre/p/fk9ja70dka/cj/tuch/'],
      ] },
    { id: 'joelho-25', nome: 'Joelho 90° de PVC soldável 25 mm', cat: 'Conexões', sinapi: { cod: 3529, fator: 1 },
      chaves: ['cotovelo', 'conexão', 'água fria', 'marrom'],
      ofertas: [
        ['telha', 'Joelho 90° Soldável em PVC 25 mm Krona', 0.84, 'no Pix', '/joelho-90-soldavel-pvc-25mm-2393646/p'],
        ['leroy', 'Joelho PVC Soldável 90° 25 mm Amanco', 0.90, '', '/joelho-pvc-soldavel-90-25mm-amanco_1572910679'],
        ['telha', 'Joelho 90° Soldável 25 mm Tigre', 1.09, '', '/joelho-90-soldavel-25mm-tigre-22888/p'],
        ['leroy', 'Joelho 90° PVC Marrom Solda 25 mm Tigre', 1.39, 'à vista', '/joelho-90o-pvc-marrom-soldavel-3-4-25mm-tigre_85307075'],
      ] },
    { id: 'registro-gaveta-34', nome: 'Registro de gaveta bruto 3/4"', cat: 'Válvulas', sinapi: { cod: 6016, fator: 1 },
      chaves: ['base', 'latão', 'válvula de gaveta', 'dn 20'],
      ofertas: [
        ['telha', 'Base Registro de Gaveta 3/4" Deca', 54.90, '', '/base-para-registro-de-gaveta-34-4509-202-deca-336971/p'],
        ['amazon', 'Registro de gaveta 3/4" DN 20 Deca, bruto, 1510.HD.034', 60.31, '', '/dp/B076PNGXZ9'],
        ['telha', 'Registro de Gaveta Base 3/4" Docol', 67.12, 'no Pix', '/registro-de-gaveta-base-34-docol-81914/p'],
        ['telha', 'Registro de Gaveta ABNT 3/4" Docol', 99.90, '', '/registro-de-gaveta-bruto-34-docol-144266/p'],
        ['telha', 'Registro de Gaveta Uso Semi Industrial 3/4" Deca', 109.90, '', '/registro-de-gaveta-uso-semi-industrial-34-dn20-bruto-deca-18821/p'],
      ] },
    { id: 'caixa-1000', nome: 'Caixa d\'água de polietileno 1.000 litros', cat: 'Reservatórios', sinapi: { cod: 34636, fator: 1 },
      chaves: ['caixa dagua', 'caixa de agua', '1000 litros', '1000l', 'reservatório', 'tanque', 'fortlev', 'acqualimp', 'tampa'],
      ofertas: [
        ['leroy', 'Caixa d\'Água 1.000 L em Polietileno Azul Sultanques', 429.90, '', '/caixa-dagua-1-000l-em-polietileno-azul-sultanques_92385244'],
        ['mecanico', 'Caixa d\'Água Polietileno 1000 Litros Fortlev', 468.90, 'no Pix ou boleto', '/produto/603929/31/1021/caixa-dagua-polietileno-1000-litros-fortlev'],
        ['leroy', 'Caixa d\'Água 1.000 L Polietileno Fortlev', 469.90, '', '/caixa-dagua-1-000l-em-polietileno-fortlev_89866630'],
        ['telha', 'Caixa d\'Água 1000 Litros +Green em Polietileno Acqualimp', 479.90, '', '/caixa-de-aguagreen-1000-litros-acqualimp-2365006/p'],
        ['magalu', 'Caixa d\'água Fortlev plástico 1000 litros', 639.90, '', '/caixa-d-agua-fortlev-plastico-1000-litros/p/gbcgg85g2j/cj/cxda/'],
        ['amazon', 'Caixa Água Tanque Polietileno Tecnipar 1000 Litros', 702.90, '', '/dp/B0HJRX5P8J'],
      ] },
    { id: 'adesivo-175', nome: 'Adesivo plástico para PVC, frasco de 175 g', cat: 'Acessórios', sinapi: { cod: 20080, fator: 1 },
      chaves: ['cola', 'cola de cano', 'solda'],
      ofertas: [
        ['leroy', 'Adesivo para PVC Frasco 175 g Krona', 16.91, 'no Pix', '/adesivo-p--p-v-c--frasco-175g--krona-_1571987621'],
        ['telha', 'Adesivo para PVC Incolor Tigre 175 g', 22.90, '', '/adesivo-de-pvc-incolor-frasco-175g-tigre-290343/p'],
        ['telha', 'Adesivo Plástico para PVC 175 g com Pincel Krona', 27.90, '', '/adesivo-plastico-175g-com-pincel-krona-2366347/p'],
        ['amazon', 'Adesivo PVC Incolor Frasco 175 g Tigre', 43.22, '', '/dp/B0G6FBQ1XT'],
      ] },
    { id: 'fita-veda-18-25', nome: 'Fita veda-rosca 18 mm x 25 m', cat: 'Acessórios', sinapi: { cod: 3143, fator: 1 },
      chaves: ['ptfe', 'teflon', 'vedação', 'rosca'],
      ofertas: [
        ['amazon', 'Fita Veda-Rosca 18 mm x 25 m Vonder', 6.35, '', '/dp/B07JW7XYWG'],
        ['leroy', 'Fita Veda Rosca 18 mm x 25 m Tigre', 6.90, '', '/fita-veda-rosca-18mmx25m-tigre_85302861'],
        ['amazon', 'Fita Veda Rosca Carretel 18 mm x 25 m Vedah Pró', 7.17, '', '/dp/B0FJC3HT2F'],
        ['leroy', 'Fita Veda Rosca 18 mm x 25 m Equation', 9.79, '', '/fita-veda-rosca-18mm-x-25m-equation_91875042'],
        ['telha', 'Fita Veda Rosca Tigre 18 mm x 25 m', 11.90, '', '/fita-veda-rosca-18mmx25m-tigre-24481/p'],
        ['amazon', 'Fita Veda Rosca 18 mm x 25 m Amanco', 20.27, '', '/dp/B07X4BGNXB'],
      ] },
    { id: 'tubo-esgoto-100', nome: 'Tubo de PVC para esgoto 100 mm, barra de 6 m', cat: 'Tubos', sinapi: { cod: 9836, fator: 6 },
      chaves: ['cano', 'série normal', 'esgoto primário', 'dn 100', '4 polegadas'],
      ofertas: [
        ['leroy', 'Cano PVC para Esgoto 100 mm 6 m Tigre', 124.90, '', '/cano-pvc-para-esgoto-100mm-ou-4-6m-tigre_85227786'],
        ['telha', 'Tubo de Esgoto Primário Tigre 100 mm x 6 m', 146.90, '', '/tubo-de-esgoto-primario-6m-100mm-tigre-23620/p'],
        ['magalu', 'Tubo para Esgoto PVC 6 m DN 100 mm Plastilit', 196.90, '', '/tubo-para-esgoto-pvc-6m-dn-100mm-plastilit-7898067902268/p/deg70daa78/cj/aceh/'],
        ['magalu', 'Tubo para Esgoto Série Normal PVC 100 mm 6 m Tigre', 278.89, '', '/tubo-para-esgoto-serie-normal-pvc-100mm-6m-branco-tigre/p/ke0f9hc1hc/cj/tues/'],
      ] },
    { id: 'caixa-sifonada-150', nome: 'Caixa sifonada de PVC 150 x 150 x 50 mm', cat: 'Conexões', sinapi: { cod: 11712, fator: 1 },
      chaves: ['ralo', 'esgoto', 'grelha', 'sifão'],
      ofertas: [
        ['leroy', 'Caixa Sifonada Herc Grelha Redonda 150 x 150 x 50 mm', 45.95, '', '/caixa-sifonada-herc-grelha-redonda-150x150x50mm_1567515324'],
        ['amazon', 'Caixa Sifonada Quadrada 150 x 150 x 50 mm Krona', 49.42, '', '/dp/B07F2XVD6Z'],
        ['amazon', 'Caixa Sifonada Tigre Quadrada Branco 150 x 150 x 50 mm', 55.95, '', '/dp/B076PV6813'],
        ['telha', 'Caixa Sifonada para Grelha Quadrada 150 x 150 x 50 Branco Tigre', 80.18, 'no Pix', '/caixa-sifonada-para-grelha-quadrada-150x150x50-101-brancotigre-358240/p'],
        ['leroy', 'Caixa Sifonada 150 x 150 x 50 Quadrada Branca Único', 86.03, '', '/caixa-sifonada-150x150x50-quadrada-branca-unico_1567515323'],
      ] },
    { id: 'tubo-cpvc-22', nome: 'Tubo de CPVC 22 mm, barra de 3 m', cat: 'Tubos', sinapi: { cod: 21124, fator: 3 },
      chaves: ['aquatherm', 'água quente', 'cano'],
      ofertas: [
        ['telha', 'Tubo CPVC Aquatherm 22 mm 3 m Tigre', 59.90, '', '/tubo-cpvc-aquatherm-22mm-7002-tigre-271896/p'],
        ['magalu', 'Tubo Aquatherm para Aquecimento CPVC 22 mm 3 m Tigre', 133.50, '', '/tubo-e-conexao-aquatherm-para-aquecimento-cpvc-22mm-3m-tigre/p/fb325251g8/cj/aceh/'],
        ['magalu', 'Tubo em CPVC Aquatherm 22 mm 3 m Tigre', 148.90, '', '/tubo-em-cpvc-aquatherm-22mm-3m-tigre/p/bhf84ed13b/cj/aceh/'],
      ] },
    { id: 'tubo-ppr-25', nome: 'Tubo de PPR PN 20, 25 mm, barra de 3 m', cat: 'Tubos', sinapi: { cod: 36278, fator: 3 },
      chaves: ['polipropileno', 'termofusão', 'água quente', 'cano'],
      ofertas: [
        ['telha', 'Tubo PPR PN 20, 25 mm x 3 m Tigre', 62.92, 'no Pix', '/tubo-ppr-pn-20-25mm-3m-tigre-2293005/p'],
        ['amazon', 'Tubo PPR PN 20, 25 mm x 3 m Amanco', 91.10, '', '/dp/B0DY77B4HW'],
      ] },
    { id: 'torneira-boia-34', nome: 'Torneira de boia 3/4" para caixa d\'água', cat: 'Válvulas', sinapi: { cod: 11830, fator: 1 },
      chaves: ['boia', 'bóia', 'caixa dagua', 'reservatório', 'nível'],
      ofertas: [
        ['leroy', 'Torneira Boia para Caixa d\'Água 1/2" e 3/4" Cipla', 13.90, '', '/torneira-boia-para-caixa-dagua-1-2-e-3-4-cipla_1571893720'],
        ['telha', 'Torneira Boia 3/4" Haste Alumínio Astra', 20.90, '', '/torneira-boia-34-caixa-dagua-haste-aluminio-astra-1024587/p'],
        ['amazon', 'Torneira de Boia Neo 3/4" e 1/2"', 22.50, '', '/dp/B0CBN76MQJ'],
        ['amazon', 'Torneira de Boia 3/4" com Haste de Metal Tigre', 28.84, '', '/dp/B076PMJ3DV'],
        ['amazon', 'Torneira de Boia 1/2" e 3/4" Censi', 72.96, '', '/dp/B0C5MWLD96'],
      ] },
    // Coleta de 08/11/2026
    { id: 'tubo-pvc-32-3m', nome: 'Tubo de PVC soldável 32 mm, barra de 3 m', cat: 'Tubos', sinapi: { cod: 9869, fator: 3 },
      chaves: ['cano', 'água fria', 'marrom', '1 polegada'],
      ofertas: [
        ['telha', 'Tubo PVC Soldável 3 Metros 32 mm Krona', 42.21, 'no Pix', '/tubo-pvc-soldavel-3-metros-32mm-krona-2386682/p'],
        ['telha', 'Tubo Soldável Tigre 32 mm 3 m para Água Fria', 46.90, '', '/tubo-soldavel-3-00m-32mm-tigre-170216/p'],
      ] },
    { id: 'tubo-pvc-50-3m', nome: 'Tubo de PVC soldável 50 mm, barra de 3 m', cat: 'Tubos', sinapi: { cod: 9875, fator: 3 },
      chaves: ['cano', 'água fria', 'marrom', '1 1/2'],
      ofertas: [
        ['telha', 'Tubo PVC Soldável 50 mm com 3 Metros Krona', 64.90, '', '/tubo-pvc-soldavel-3-metros-50mm-krona-2386704/p'],
        ['telha', 'Tubo Soldável de PVC para Água Fria 50 mm 3 m Tigre', 69.90, '', '/tubo-soldavel-nbr-3-00m-50mm-tigre-170232/p'],
      ] },
    { id: 'tubo-esgoto-50-3m', nome: 'Tubo de PVC para esgoto 50 mm, barra de 3 m', cat: 'Tubos', sinapi: { cod: 9838, fator: 3 },
      chaves: ['cano', 'esgoto primário', 'branco', 'série normal'],
      ofertas: [
        ['telha', 'Tubo de Esgoto Primário Tigre 50 mm x 3 m em PVC', 38.90, '', '/tubo-de-esgoto-primario-3m-50mm-tigre-170259/p'],
        ['telha', 'Tubo de Esgoto PVC 50 mm 3 Metros Krona', 44.90, '', '/tubo-esgoto-3-metros-50mm-krona-2386780/p'],
      ] },
    { id: 'joelho-esgoto-100', nome: 'Joelho 90° de PVC para esgoto 100 mm', cat: 'Conexões', sinapi: { cod: 3520, fator: 1 },
      chaves: ['cotovelo', 'conexão', 'esgoto', 'série normal'],
      ofertas: [
        ['telha', 'Joelho 90° para Esgoto Primário DN 100 mm Krona', 7.56, 'no Pix', '/joelho-90-esgoto-prim-dn-100-krona-2385384/p'],
        ['telha', 'Joelho 90° para Esgoto Série Normal 100 mm Tigre', 9.90, '', '/joelho-90-de-esgoto-100mm-tigre-22594/p'],
      ] },
    { id: 'te-25', nome: 'Tê 90° de PVC soldável 25 mm', cat: 'Conexões', sinapi: { cod: 7139, fator: 1 },
      chaves: ['te', 'tee', 'conexão', 'água fria', 'marrom'],
      ofertas: [
        ['telha', 'Tê Soldável PVC 25 mm Krona', 1.18, 'no Pix', '/te-soldavel-pvc-25mm-2393581/p'],
        ['amazon', 'Tê Soldável LLL 25 mm Amanco', 1.58, '', '/dp/B07ZWCJ51R'],
        ['telha', 'Tê Soldável 90° 25 mm Tigre', 1.99, '', '/te-de-90o-soldavel-25mm-tigre-23213/p'],
      ] },
    { id: 'luva-25', nome: 'Luva de PVC soldável 25 mm', cat: 'Conexões', sinapi: { cod: 3904, fator: 1 },
      chaves: ['união', 'emenda', 'conexão', 'água fria', 'marrom'],
      ofertas: [
        ['telha', 'Luva Soldável 25 mm em PVC Marrom Krona', 0.98, 'no Pix', '/luva-soldavel-25mm-pvc-marrom-af-krona-2393816/p'],
        ['telha', 'Luva Soldável Tigre 25 mm', 1.27, 'no Pix', '/luva-soldavel-25mm-tigre-22136/p'],
      ] },
    { id: 'joelho-bucha-latao-25-12', nome: 'Joelho 90° de PVC soldável com bucha de latão 25 mm x 1/2"', cat: 'Conexões', sinapi: { cod: 20147, fator: 1 },
      chaves: ['cotovelo', 'conexão', 'azul', 'ponto terminal', 'bucha de latão', 'água fria', 'porcelanato'],
      ofertas: [
        ['telha', 'Joelho de Redução 90° Soldável com Bucha de Latão 25 mm x 1/2" Tigre', 7.92, 'no Pix', '/joelho-de-reducao-90-soldavel-com-bucha-lt25mmx12-tigre-24821/p'],
        ['amazon', 'Joelho Bucha Latão 90° Liso e Rosca 25 mm x 1/2" Amanco', 12.88, '', '/dp/B07R2NNMX1'],
        ['amazon', 'Joelho para Porcelanato com Bucha de Latão 25 mm x 1/2" Durín', 16.59, '', '/dp/B0C74R1JC2'],
      ] },
    { id: 'ralo-sifonado-100', nome: 'Ralo sifonado de PVC 100 x 40 mm, redondo', cat: 'Conexões', sinapi: { cod: 11741, fator: 1 },
      chaves: ['ralo', 'sifão', 'grelha', 'box', 'esgoto'],
      ofertas: [
        ['amazon', 'Ralo Sifonado Redondo 100 x 37 x 40 mm PVC Plastipan', 21.40, '', '/dp/B0H9P9YBL5'],
        ['amazon', 'Ralo Sifonado Redondo 100 x 38 x 40 Vortice Amanco', 25.40, '', '/dp/B0G4SYQV9X'],
      ] },
    { id: 'engate-inox-30', nome: 'Engate flexível de inox 1/2" x 30 cm', cat: 'Acessórios', sinapi: { cod: 11683, fator: 1 },
      chaves: ['rabicho', 'flexível', 'mangueira', 'ligação'],
      ofertas: [
        ['amazon', 'Mangueira Engate Flexível Aço Inox 30 cm 1/2" Kokay', 16.13, '', '/dp/B0CY6YRG3D'],
        ['amazon', 'Engate Flexível 30 cm 1/2" Inox F/F com Niple', 26.00, '', '/dp/B0GTBVKD4Q'],
        ['amazon', 'Mangueira Engate Flexível Aço Inox 1/2" Fosco 30 cm Esteves', 28.61, '', '/dp/B0HJH8NPW4'],
      ] },
    { id: 'chuveiro-5500', nome: 'Chuveiro elétrico 5.500 W', cat: 'Metais e louças', sinapi: { cod: 1368, fator: 1 },
      chaves: ['ducha', 'elétrico', 'banho', 'Lorenzetti', 'Zagonel'],
      ofertas: [
        ['telha', 'Chuveiro Bella Ducha 4 Temperaturas 5500 W 127 V Lorenzetti', 95.90, '', '/chuveiro-eletrico-multitemperatura-bella-ducha-4t-branco-5500w-127v-lorenzetti-1121685/p'],
        ['telha', 'Chuveiro Lorenbello 3 Temperaturas 5500 W 220 V Lorenzetti', 99.90, '', '/chuveiro-eletrico-bello-banho-ultra-com-cano-5500w-220v-branco-lorenzetti-1417690/p'],
        ['telha', 'Ducha Moment 4 Temperaturas 5500 W 127 V Zagonel', 114.90, '', '/ducha-moment-4-temperaturas-5500w-127v-branco-cxpr-zagonel-2581213/p'],
      ] },
    { id: 'torneira-jardim', nome: 'Torneira de jardim ou tanque, de parede', cat: 'Metais e louças', sinapi: { cod: 7603, fator: 1 },
      chaves: ['torneira', 'jardim', 'tanque', 'metal', 'lavagem'],
      ofertas: [
        ['telha', 'Torneira de Jardim Parede 1153 C23 Cromada Esteves', 55.92, 'no Pix', '/torneira-de-jardim-1153-c23-vtj023-cromada-esteves-939463/p'],
        ['telha', 'Torneira Esfera para Jardim 1/2" com Alavanca Wog 132', 63.92, 'no Pix', '/torneira-esfera-para-jardim-com-alavanca-132-wog-801208/p'],
        ['telha', 'Torneira de Parede para Jardim Pertutti Cromada Docol', 111.06, 'no Pix', '/torneira-docol-de-parede-para-jardim-pertutti-cromada-1621530/p'],
      ] },
    // Coleta de 26/11/2026 na Distribuidora Fadef: incêndio (hidrantes, sprinklers, registros e galvanizados)
    { id: 'storz-chave-dupla', novo: true, nome: 'Chave Storz dupla 2.1/2" x 1.1/2" em latão', cat: 'Incêndio', sinapi: { cod: 20971, fator: 1 },
      chaves: ['chave de mangueira', 'engate rápido', 'hidrante', 'mangueira de incêndio', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Chave Storz Dupla Predial 2.1/2 x 1.1/2 em Latão', 11.00, '', '/produtos/chave-storz-dupla-predial-2-1-2-x-1-1-2-em-latao/'],
      ] },
    { id: 'storz-reducao', novo: true, nome: 'Redução Storz fixa 2.1/2" x 1.1/2" em latão', cat: 'Incêndio', sinapi: { cod: 20972, fator: 1 },
      chaves: ['engate rápido', 'hidrante', 'mangueira de incêndio', 'adaptador', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Redução Storz Fixa Engate Rápido 2.1/2" para 1.1/2" Latão Escovado', 139.00, '', '/produtos/reducao-storz-fixa-engate-rapido-2-1-2-para-1-1-2-latao-escovado/'],
      ] },
    { id: 'storz-uniao-112', novo: true, nome: 'União Storz 1.1/2" para mangueira de incêndio, par', cat: 'Incêndio', sinapi: { cod: 20973, fator: 2 },
      chaves: ['engate rápido', 'empatação', 'mangueira de incêndio', '40 mm', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Par de União Storz para Mangueira de Incêndio 40A 1.1/2" Latão', 199.00, 'par (2 peças)', '/produtos/par-de-uniao-storz-para-mangueira-de-incendio-40a-latao/'],
      ] },
    { id: 'storz-uniao-212', novo: true, nome: 'União Storz 2.1/2" para mangueira de incêndio, par', cat: 'Incêndio', sinapi: { cod: 20974, fator: 2 },
      chaves: ['engate rápido', 'empatação', 'mangueira de incêndio', '65 mm', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Par de União Storz para Mangueira de Incêndio 65B Latão', 248.00, 'par (2 peças)', '/produtos/uniao-storz-para-mangueira-de-incendio-65b-latao/'],
      ] },
    { id: 'esguicho-solido-112-16', novo: true, nome: 'Esguicho de jato sólido 1.1/2" com requinte de 16 mm, latão', cat: 'Incêndio', sinapi: { cod: 20965, fator: 1 },
      chaves: ['agulheta', 'jato pleno', 'hidrante', 'mangueira de incêndio', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Esguicho Agulheta Jato Sólido 1.1/2" Requinte 16 mm em Latão', 89.00, '', '/produtos/esguicho-agulheta-jato-solido-1-1-2-requinte-16mm-em-latao/'],
      ] },
    { id: 'esguicho-solido-112-19', novo: true, nome: 'Esguicho de jato sólido 1.1/2" com requinte de 19 mm, latão', cat: 'Incêndio', sinapi: { cod: 20966, fator: 1 },
      chaves: ['agulheta', 'jato pleno', 'hidrante', 'mangueira de incêndio', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Esguicho Agulheta Jato Sólido 1.1/2" Requinte 19 mm em Latão', 89.00, '', '/produtos/esguicho-agulheta-jato-solido-1-1-2-requinte-19mm-em-latao/'],
      ] },
    { id: 'esguicho-regulavel-112', novo: true, nome: 'Esguicho regulável Storz 1.1/2" em latão', cat: 'Incêndio', sinapi: { cod: 37554, fator: 1 },
      chaves: ['neblina', 'jato regulável', 'elkhart', 'hidrante', 'mangueira de incêndio', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Esguicho Manual Regulável Recartilhado Storz Industrial em Latão Escovado', 159.00, 'opção 1.1/2"', '/produtos/esguicho-manual-regulavel-recartilhado-1-1-2-e-2-1-2-industrial-em-latao-escovado/'],
      ] },
    { id: 'esguicho-regulavel-212', novo: true, nome: 'Esguicho regulável Storz 2.1/2" em latão', cat: 'Incêndio', sinapi: { cod: 37555, fator: 1 },
      chaves: ['neblina', 'jato regulável', 'elkhart', 'hidrante', 'mangueira de incêndio', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Esguicho Regulável Recartilhado PN16 2.1/2" Storz em Latão', 179.00, '', '/produtos/esguicho-regulavel-recartilhado-pn16-2-1-2-storz-em-latao/'],
      ] },
    { id: 'storz-adaptador-212', novo: true, nome: 'Adaptador Storz 2.1/2" x rosca interna 5 fios 2.1/2", latão', cat: 'Incêndio', sinapi: { cod: 10899, fator: 1 },
      chaves: ['engate rápido', 'hidrante', 'válvula de hidrante', '5 fios', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Adaptador Storz 2.1/2" ER x 2.1/2" Rosca Interna 5FPP em Latão', 108.00, '', '/produtos/adaptador-storz-2-1-2-er-x-2-1-2-rosca-interna-5fpp-em-latao/'],
      ] },
    { id: 'storz-adaptador-112', novo: true, nome: 'Adaptador Storz 1.1/2" x rosca interna 5 fios 2.1/2", latão', cat: 'Incêndio', sinapi: { cod: 10900, fator: 1 },
      chaves: ['engate rápido', 'hidrante', 'válvula de hidrante', '5 fios', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Adaptador Storz 1.1/2" ER x 2.1/2" Rosca Interna 5 FPP Latão Escovado', 69.00, '', '/produtos/adaptador-storz-1-1-2-er-x-2-1-2-rosca-interna-5-fpp-latao-escovado/'],
      ] },
    { id: 'anel-expansao-112', novo: true, nome: 'Anel de expansão de cobre para empatação de mangueira 1.1/2"', cat: 'Incêndio', sinapi: { cod: 20975, fator: 1 },
      chaves: ['empatação', 'mangueira de incêndio', 'união storz', '40 mm', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Anel de Expansão em Cobre Recozido para Empatação Tipo 40-A', 20.00, '', '/produtos/anel-de-expansao-em-cobre-recozido-para-empatacao-tipo-40-a-38-1mm-x-28mm/'],
      ] },
    { id: 'anel-expansao-212', novo: true, nome: 'Anel de expansão de cobre para empatação de mangueira 2.1/2"', cat: 'Incêndio', sinapi: { cod: 20976, fator: 1 },
      chaves: ['empatação', 'mangueira de incêndio', 'união storz', '65 mm', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Anel de Expansão em Cobre Recozido Tipo 65-B', 34.00, '', '/produtos/anel-de-expansao-em-cobre-recozido-tipo-65-b-63-5mm-x-38mm/'],
      ] },
    { id: 'valvula-hidrante-45', novo: true, nome: 'Válvula globo angular 45° 2.1/2" para hidrante', cat: 'Incêndio', sinapi: { cod: 10904, fator: 1 },
      chaves: ['registro de hidrante', 'válvula angular', 'registro globo', 'hidrante', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Válvula Globo 2.1/2 - 45º PN 16 para Hidrante 210 Libras', 228.00, '', '/produtos/valvula-globo-2-1-2-45-pn-16-para-hidrante-210-libras/'],
      ] },
    { id: 'sprinkler-pendente-68', novo: true, nome: 'Sprinkler pendente 68 °C, 1/2", cromado', cat: 'Incêndio', sinapi: { cod: 21044, fator: 1 },
      chaves: ['chuveiro automático', 'bico de sprinkler', 'ampola vermelha', 'k80', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Sprinkler Pendente 68°C Resposta Padrão K-80 1/2" NPT Cromado UL', 42.00, 'resposta padrão; o insumo SINAPI é de resposta rápida', '/produtos/sprinkler-pendente-68c-resposta-padrao-k-80-k-5-6-1-2-npt-cromado-certificado-ul/'],
      ] },
    { id: 'canopla-sprinkler', novo: true, nome: 'Canopla cromada para sprinkler 1/2"', cat: 'Incêndio', sinapi: { cod: 40607, fator: 1 },
      chaves: ['espelho', 'acabamento', 'chuveiro automático', 'forro', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Canopla Cromada para Sprinkler 1/2', 4.00, '', '/produtos/canopla-cromada-para-sprinkler-1-2/'],
      ] },
    { id: 'gaveta-bruto-1', novo: true, nome: 'Registro de gaveta bruto 1"', cat: 'Incêndio', sinapi: { cod: 6019, fator: 1 },
      chaves: ['válvula de gaveta', 'registro bruto', 'dn 25', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Válvula Gaveta 1" PN16 Registro Bruto', 51.00, '', '/produtos/valvula-gaveta-1-pn16-registro-bruto-segurimax/'],
      ] },
    { id: 'gaveta-bruto-2', novo: true, nome: 'Registro de gaveta bruto 2"', cat: 'Incêndio', sinapi: { cod: 6028, fator: 1 },
      chaves: ['válvula de gaveta', 'registro bruto', 'dn 50', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Válvula Gaveta 2" PN16 Registro Bruto', 165.00, '', '/produtos/valvula-gaveta-2-pn16-registro-bruto-segurimax/'],
      ] },
    { id: 'gaveta-bruto-212', novo: true, nome: 'Registro de gaveta bruto 2.1/2"', cat: 'Incêndio', sinapi: { cod: 6011, fator: 1 },
      chaves: ['válvula de gaveta', 'registro bruto', 'dn 65', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Válvula Gaveta 2.1/2" Registro Bruto', 299.00, '', '/produtos/valvula-gaveta-2-1-2-registro-bruto-segurimax/'],
      ] },
    { id: 'gaveta-bruto-4', novo: true, nome: 'Registro de gaveta bruto 4"', cat: 'Incêndio', sinapi: { cod: 6027, fator: 1 },
      chaves: ['válvula de gaveta', 'registro bruto', 'dn 100', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Válvula Gaveta 4" PN16 Registro Bruto', 798.00, '', '/produtos/valvula-gaveta-4-pn16-registro-bruto-segurimax/'],
      ] },
    { id: 'galv-cotovelo-212', novo: true, nome: 'Cotovelo 90° galvanizado 2.1/2", rosca BSP', cat: 'Incêndio', sinapi: { cod: 3470, fator: 1 },
      chaves: ['joelho', 'ferro maleável', 'conexão galvanizada', 'hidrante', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Cotovelo - Joelho 90 Galvanizado Rosca 11 BSP Mech', 62.00, 'opção 2.1/2"', '/produtos/cotovelo-joelho-90-galvanizado-rosca-11-bsp-mech/'],
      ] },
    { id: 'galv-te-212', novo: true, nome: 'Tê galvanizado 2.1/2", rosca BSP', cat: 'Incêndio', sinapi: { cod: 6299, fator: 1 },
      chaves: ['ferro maleável', 'conexão galvanizada', 'derivação', 'hidrante', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Tee Galvanizado 90º com Rosca BSP 11 Fios Fêmea', 94.00, 'opção 2.1/2"', '/produtos/tee-galvanizado-90-com-rosca-bsp-11-fios-femea-1n5ty/'],
      ] },
    { id: 'galv-luva-212', novo: true, nome: 'Luva galvanizada 2.1/2", rosca BSP', cat: 'Incêndio', sinapi: { cod: 3913, fator: 1 },
      chaves: ['ferro maleável', 'conexão galvanizada', 'emenda', 'hidrante', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Luva Galvanizada com Rosca BSP', 44.00, 'opção 2.1/2"', '/produtos/luva-galvanizada-com-rosca-bsp-z80ht/'],
      ] },
    { id: 'galv-uniao-212', novo: true, nome: 'União galvanizada 2.1/2" com assento plano, rosca BSP', cat: 'Incêndio', sinapi: { cod: 9889, fator: 1 },
      chaves: ['ferro maleável', 'conexão galvanizada', 'desmontagem', 'hidrante', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'União Galvanizada com Assento Plano Galvanizado', 121.00, 'opção 2.1/2"', '/produtos/uniao-galvanizada-com-assento-plano-galvanizado1/'],
      ] },
    { id: 'galv-tampao-212', novo: true, nome: 'Tampão (cap) galvanizado 2.1/2", rosca BSP', cat: 'Incêndio', sinapi: { cod: 1169, fator: 1 },
      chaves: ['cap', 'bujão', 'ferro maleável', 'conexão galvanizada', 'incêndio', 'fadef'],
      ofertas: [
        ['fadef', 'Tampão Galvanizado', 41.00, 'opção 2.1/2"', '/produtos/tampao-galvanizado/'],
      ] },
  ],
};

// ===== Painel (aba Preços de Guias práticos) =====
(() => {
  if (typeof document === 'undefined') return;   // carregado também no gerador das páginas (Node)
  const grid = document.getElementById('precoGrid');
  if (!grid) return;
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const brl = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pct = (v, min) => {
    const p = (v / min - 1) * 100;
    return '+' + p.toLocaleString('pt-BR', { maximumFractionDigits: p < 10 ? 1 : 0, minimumFractionDigits: p < 10 ? 1 : 0 }) + '%';
  };
  const st = { q: '', uf: 'SP' };

  // Preço SINAPI do item no estado escolhido (coluna do estado no insumo, igual ao bom.js)
  const sinapi = it => {
    if (typeof SINAPI_PRECOS === 'undefined') return null;
    const ins = SINAPI_PRECOS.ins[it.sinapi.cod], i = SINAPI_PRECOS.ufs.indexOf(st.uf);
    if (!ins || i < 0 || !ins[2 + i]) return null;
    const uni = ins[2 + i], f = it.sinapi.fator;
    return { sinapi: true, preco: Math.round(uni * f * 100) / 100,
      produto: `Referência SINAPI: insumo ${it.sinapi.cod}`,
      obs: `${SINAPI_PRECOS.ref}, ${st.uf}${f > 1 ? `, ${f} ${ins[1].toLowerCase()} a ${brl(uni)}` : ''}`,
      url: SINAPI_PRECOS.fonte, loja: 'SINAPI (Caixa)' };
  };
  const linhas = it => [
    ...it.ofertas.map(([l, produto, preco, obs, path]) => ({ loja: LOJAS_PRECOS[l], produto, preco, obs, url: PRECOS_LOJA_URL[l] + path })),
    sinapi(it),
  ].filter(Boolean).sort((a, b) => a.preco - b.preco);

  const fotoPreco = it => {
    const [src, autor, url, lic] = PRECOS_FOTOS[it.id];
    return `<a class="preco__foto" href="${url}" target="_blank" rel="noopener noreferrer" title="Foto: ${autor}${lic ? ' (' + lic + ')' : ', divulgação do fabricante'}"><img src="${src}" alt="${it.nome}" width="72" height="72" loading="lazy"><small class="notranslate" translate="no">${autor}${lic ? ' · ' + lic : ''}</small></a>`;
  };
  const painel = it => {
    const ls = linhas(it), min = ls[0].preco;
    return `<article class="preco" id="preco-${it.id}">
      <header class="preco__head">${fotoPreco(it)}<div><span class="preco__cat">${it.cat}</span><h3${it.novo ? ' data-novo' : ''}>${it.nome}</h3></div></header>
      <ol class="preco__lista">${ls.map((x, i) => `
        <li class="preco__linha${i === 0 ? ' preco__linha--menor' : ''}${x.sinapi ? ' preco__linha--sinapi' : ''}">
          <a class="preco__prod" href="${x.url}" target="_blank" rel="noopener noreferrer"><span class="preco__nome">${x.produto}</span>
            <small>${x.loja}${x.obs ? ' · ' + x.obs : ''} ↗</small></a>
          <strong class="preco__valor">${brl(x.preco)}</strong>
          <span class="preco__pct">${x.preco === min ? 'Menor preço' : pct(x.preco, min)}</span>
        </li>`).join('')}
      </ol>
    </article>`;
  };

  function render() {
    const list = PRECOS.itens.filter(it => !st.q || matchText([it.nome, it.cat, ...it.chaves, ...it.ofertas.map(o => o[1] + ' ' + LOJAS_PRECOS[o[0]])].join(' '), queryTerms(st.q)));
    document.getElementById('precoCount').textContent = `${list.length} de ${PRECOS.itens.length} itens · coleta em ${PRECOS.coleta}`;
    grid.innerHTML = list.length ? list.map(painel).join('') : '<p class="bim__empty">Nenhum item com essa busca.</p>';
  }

  document.getElementById('precoBusca').addEventListener('input', e => { st.q = norm(e.target.value.trim()); render(); });
  const sel = document.getElementById('precoUf');
  sel.addEventListener('change', () => { st.uf = sel.value; render(); });
  render();
  // Base SINAPI: script.js carrega em Guias práticos e avisa; o painel é refeito com a linha de referência
  document.addEventListener('ferramentas-prontas', () => {
    if (typeof SINAPI_PRECOS === 'undefined') return;
    sel.innerHTML = SINAPI_PRECOS.ufs.map(u => `<option value="${u}"${u === st.uf ? ' selected' : ''}>${u}</option>`).join('');
    document.getElementById('precoRef').textContent = `SINAPI ${SINAPI_PRECOS.ref}, preço mediano na capital do estado, sem desoneração`;
    render();
  });
})();
