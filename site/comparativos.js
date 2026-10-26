// ===== Comparativos entre sistemas e materiais (bloco inicial de Guias práticos e páginas /comparativos/...) =====
// Neutros: falam de materiais e sistemas, não de marcas. Cada dado traz a referência (norma, estudo, ficha de fabricante
// ou SINAPI). Quando fichas de fabricantes divergem, mostra-se a faixa. Custos: insumo SINAPI do estado escolhido.
// Fontes conferidas em 23/10/2026. Revisado pela Equipe Técnica PipeSystem.
const CMP_FONTES = {
  nbr5626: ['ABNT NBR 5626:2020 — Sistemas prediais de água fria e água quente: projeto, execução, operação e manutenção', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr5648: ['ABNT NBR 5648 — Tubos e conexões de PVC-U com junta soldável para sistemas prediais de água fria (pressão de serviço 750 kPa a 20 °C)', 'https://mediahub.wavin.com/m/1fdc60976edd69fd/original/FT-Soldavel-Agua-Fria.pdf', 'norma'],
  nbr15884: ['ABNT NBR 15884-1 — Tubulações plásticas para água quente e fria: CPVC (pressões de projeto de 900 kPa até 70 °C e 2 400 kPa a 20 °C)', 'https://www.target.com.br/produtos/normas-tecnicas/42045/nbr15884-1-sistemas-de-tubulacoes-plasticas-para-instalacoes-prediais-de-agua-quente-e-fria-policloreto-de-vinila-clorado-cpvc-parte-1-tubos-requisitos', 'norma'],
  nbr15813: ['ABNT NBR 15813 — Tubulações plásticas para água quente e fria: polipropileno copolímero random (PP-R)', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr15939: ['ABNT NBR 15939-1 — Tubulações plásticas para água quente e fria: polietileno reticulado (PE-X), edição 05/2025', 'https://www.normas.com.br/visualizar/abnt-nbr-nm/30800/abnt-nbr15939-1-sistemas-de-tubulacoes-plasticas-para-instalacoes-prediais-de-agua-quente-e-fria-polietileno-reticulado-pe-x-parte-1-requisitos-e-metodos-de-ensaio', 'norma'],
  iso21003: ['ISO 21003 — Sistemas de tubos multicamada para água quente e fria; classe 2: 70 °C por 49 anos, 80 °C por 1 ano, 95 °C por 100 h (certificação Kiwa K536)', 'https://www.kiwa.com/nl/en/service/certification/k536-k-multilayer-piping-systems', 'norma'],
  nbr13206: ['ABNT NBR 13206 — Tubo de cobre leve, médio e pesado, sem costura, para condução de fluidos', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr15575: ['ABNT NBR 15575-6 — Edificações habitacionais: desempenho dos sistemas hidrossanitários (VUP mínima de 20 anos; critérios acústicos não obrigatórios)', 'https://poli-integra.poli.usp.br/wp-content/uploads/2022/11/2018_Luiz-Gustavo-Montalvao-Garbossa.pdf', 'norma'],
  nbr8160: ['ABNT NBR 8160 — Sistemas prediais de esgoto sanitário: projeto e execução', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr5688: ['ABNT NBR 5688 — Tubos e conexões de PVC-U para esgoto e águas pluviais prediais (séries normal e reforçada)', 'https://www.abntcatalogo.com.br/', 'norma'],
  en877: ['EN 877 — Tubos e conexões de ferro fundido para drenagem de edificações (norma europeia de referência do ferro fundido SMU)', 'https://www.en-standard.eu/', 'norma'],
  iso16422: ['ISO 16422 — Tubos e juntas de PVC orientado (PVC-O) para condução de água sob pressão', 'https://www.iso.org/', 'norma'],
  iso2531: ['ISO 2531 / ABNT NBR 7675 — Tubos e conexões de ferro dúctil para água', 'https://www.iso.org/', 'norma'],
  iso4427: ['ISO 4427 / ABNT NBR 15561 — Tubos de polietileno (PEAD) para abastecimento de água', 'https://www.iso.org/', 'norma'],
  nbr10897: ['ABNT NBR 10897 — Sistemas de proteção contra incêndio por chuveiros automáticos', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr13714: ['ABNT NBR 13714 — Sistemas de hidrantes e de mangotinhos para combate a incêndio', 'https://www.abntcatalogo.com.br/', 'norma'],
  ul1821: ['UL — Q&A sobre tubos plásticos de sprinkler (UL 1821): uso em ocupações de risco leve da NFPA 13 e residenciais (NFPA 13R/13D)', 'https://ul.com/news/qa-installation-plastic-fire-sprinkler-pipe-exposed-locations', 'norma'],
  nyc: ['Corpo de Bombeiros de Nova York (FDNY) — condições para CPVC em sprinklers de risco leve: sem trechos aparentes, com barreira resistente ao fogo', 'https://www.nyc.gov/assets/buildings/pdf/170-07-e.pdf', 'norma'],
  nbr15526: ['ABNT NBR 15526 — Redes de distribuição interna para gases combustíveis em instalações residenciais e comerciais', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr16821: ['ABNT NBR 16821 — Sistemas multicamada PE-AL-PE para gases combustíveis (citada pelo CBMGO, Orientação Técnica 03/2020: até 60 °C, protegido de UV)', 'https://www.bombeiros.go.gov.br/wp-content/uploads/2014/11/Orientacao_Tecnica_03_2020_-_Tubos_Multicamada.pdf', 'norma'],
  nbr17247: ['ABNT NBR 17247-1 — Tubulação de aço revestido com polietileno para gases combustíveis (até 1,5 bar)', 'https://www.target.com.br/produtos/materias-tecnicas/2026/07/01/6632/a-conformidade-das-tubulacoes-de-aco-revestido-com-polietileno-para-gases-combustiveis', 'norma'],
  nbr12188: ['ABNT NBR 12188 — Sistemas centralizados de suprimento de gases medicinais (tubulação de cobre)', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr15569: ['ABNT NBR 15569 — Sistema de aquecimento solar de água em circuito direto: projeto e instalação', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr13103: ['ABNT NBR 13103 — Instalação de aparelhos a gás para uso residencial: requisitos', 'https://www.abntcatalogo.com.br/', 'norma'],
  nbr14799: ['ABNT NBR 14799 — Reservatório poliolefínico para água potável', 'https://www.abntcatalogo.com.br/', 'norma'],
  loi: ['SpecialChem — Índice de oxigênio limite (LOI): materiais com LOI abaixo de 21% queimam ao ar; acima de ~26% são considerados autoextinguíveis', 'https://www.specialchem.com/plastics/guide/fire-resistance-loi', 'estudo'],
  loiCpvc: ['Spears — Propriedades físicas de tubos de PVC e CPVC (LOI ASTM D2863: PVC 43, CPVC 60)', 'https://www.spearsmfg.com/IP-4/03%20Physical%20Properties%20of%20PVC%20&%20CPVC%20Pipe.pdf', 'fab'],
  isaacson: ['Isaacson, K. P. et al. (2021) — Contaminação da água potável pela degradação térmica de tubos plásticos em incêndios, Environ. Sci.: Water Res. Technol.', 'https://pubs.rsc.org/en/content/articlehtml/2021/ew/d0ew00836b', 'estudo'],
  cullom: ['Cullom, A. C. et al. (2020) — Revisão: materiais de instalações prediais (cobre, ferro, PVC, PEX) e o crescimento de Legionella, Pathogens', 'https://www.mdpi.com/2076-0817/9/11/957', 'estudo'],
  galv1: ['Acuren — Corrosão de tubulações galvanizadas em sistemas prediais de água (água mole e quente consome o zinco)', 'https://www.acuren.com/wp-content/uploads/2023/08/Corrosion-of-Galvanized-Piping-in-Domestic-Water-Systems.pdf', 'estudo'],
  galv2: ['Materiales de Construcción (CSIC) — Causas e efeitos da corrosão em instalação predial de aço galvanizado', 'https://materconstrucc.revistas.csic.es/index.php/materconstrucc/article/view/336', 'estudo'],
  abrh: ['ABRHidro — Comparação de campo entre ferro fundido dúctil e PVC-O em adutora (Garanhuns/PE)', 'https://files.abrhidro.org.br/Eventos/Trabalhos/152/fc3763903d05beec0721436e7e6a3ed2_99c1e1d52a7d7650a08a5f4b9d4018d0.pdf', 'estudo'],
  ufpe: ['Magalhães, C. H. M. (UFPE) — Transientes hidráulicos em adutora: ferro fundido × PVC-O (simulação)', 'https://repositorio.ufpe.br/bitstream/123456789/33041/1/DISSERTA%c3%87%c3%83O%20Cl%c3%a1udio%20Henrique%20Milfont%20de%20Magalh%c3%a3es.pdf', 'estudo'],
  celer: ['Tabela de celeridade por material (DN 500): ferro dúctil ≈ 1.095 m/s, PVC-U PN16 ≈ 424 m/s, PEAD PN16 ≈ 320 m/s, PVC-O ≈ 318 m/s — dado de fabricante de PVC-O', 'https://www.iagua.es/noticias/molecor/redes-mas-eficientes-pvc-orientado-innovacion-minimizar-fugas-y-optimizar-recursos', 'fab'],
  ftPvc: ['Ficha técnica de tubo PVC soldável água fria: 750 kPa a 20 °C, fator de redução até 45 °C (0,6)', 'https://blog.wavin.com/hubfs/FTC000066%20-%20FT%20Sold%C3%A1vel%20Agua%20Fria%20PL-1.pdf', 'fab'],
  ftPpr: ['Fichas técnicas de PPR: PN 20 para água quente até 70 °C; PN 25 indicado até 70 °C por um fabricante e até 95 °C (aquecimento) por outro', 'https://topfusion.com.br/wp-content/uploads/2025/10/Ficha-Tecnica-Linha-TOPHIDRO.pdf', 'fab'],
  ftPpr2: ['Ficha técnica de PP-R (segundo fabricante, para comparação das faixas)', 'https://mediahub.wavin.com/asset/80b9cca8-3aa7-4451-b466-fd348f17deac/FT-PPR.pdf', 'fab'],
  ftMulti: ['Ficha técnica de tubo PE-X/Al/PE-X: 60 °C por 49 anos, 80 °C por 1 ano, 95 °C por 100 h (água quente sanitária)', 'https://dam.giacomini.com/es.giacomini.com/product_documentations/datasheets/R999I.pdf', 'fab'],
  ftCpvc: ['Literatura de CPVC para sprinklers: 175 psi a 150 °F (≈ 12 bar a 65 °C), listagem UL', 'https://vikinggroupinc.com/sites/default/files/databook/related/cpvc%20pipe%20and%20fittings/cpvc.pdf', 'fab'],
  acust: ['Ficha técnica de esgoto em PVC acústico (valores de ruído autodeclarados segundo VDI 4100 / DIN 4109)', 'https://mediahub.wavin.com/m/36bfd4f2b82d83de/original/FT-Esgoto-Silentium.pdf', 'fab'],
  asmeB313: ['ASME B31.3 — Process Piping: projeto, materiais, fabricação, soldagem, inspeção e ensaios de tubulações industriais (limites de uso de juntas roscadas)', 'https://www.asme.org/codes-standards/find-codes-standards/b31-3-process-piping', 'norma'],
  asmeB169: ['ASME B16.9 — Conexões de aço para solda de topo (butt weld)', 'https://www.asme.org/codes-standards/find-codes-standards/b16-9-factory-made-wrought-buttwelding-fittings', 'norma'],
  asmeB165: ['ASME B16.5 — Flanges e conexões flangeadas NPS 1/2 a 24: classes de pressão e tabelas pressão × temperatura', 'https://www.asme.org/codes-standards/find-codes-standards/b16-5-pipe-flanges-flanged-fittings-nps-1-2-nps-24-metric-inch-standard', 'norma'],
  asmeB1611: ['ASME B16.11 — Conexões forjadas de encaixe para solda (socket weld) e roscadas', 'https://www.asme.org/codes-standards/find-codes-standards/b16-11-forged-fittings-socket-welding-threaded', 'norma'],
  asmePcc1: ['ASME PCC-1 — Montagem de juntas flangeadas aparafusadas: alinhamento, lubrificação, sequência e controle do aperto', 'https://www.asme.org/codes-standards', 'norma'],
  asmeB1201: ['ASME B1.20.1 — Roscas de tubo de uso geral (NPT); no Brasil também se usa a rosca BSP (ABNT NBR NM ISO 7-1)', 'https://www.asme.org/codes-standards', 'norma'],
  dirac: ['Portal Dirac — "Borboleta não é tudo igual por fora": tipos de válvula borboleta e critérios de escolha (LinkedIn, out/2026)', 'https://www.linkedin.com/posts/portal-dirac-836833257_borboleta-n%C3%A3o-%C3%A9-tudo-igual-por-fora-muitas-share-7519781581704753153-2Kk3/', 'artigo'],
  api609: ['API 609 — Butterfly Valves: double-flanged, lug- and wafer-type (categoria A: concêntrica; categoria B: excêntricas de alta performance)', 'https://www.api.org/products-and-services/standards', 'norma'],
  mssSp67: ['MSS SP-67 — Butterfly Valves (válvulas borboleta de uso geral)', 'https://msshq.org/', 'norma'],
  awwaC504: ['AWWA C504 — Rubber-Seated Butterfly Valves (assento de borracha para água e saneamento)', 'https://store.awwa.org/', 'norma'],
  iso5752: ['ISO 5752 — Válvulas metálicas para tubulações flangeadas: dimensões face a face e centro a face', 'https://www.iso.org/', 'norma'],
  api598: ['API 598 — Inspeção e ensaio de válvulas (ensaios de corpo e de vedação)', 'https://www.api.org/products-and-services/standards', 'norma'],
  api607: ['API 607 / ISO 10497 — Ensaio de fogo para válvulas de 1/4 de volta (fire safe)', 'https://www.api.org/products-and-services/standards', 'norma'],
  bs6364: ['BS 6364 — Válvulas para serviço criogênico (projeto e ensaio a baixa temperatura)', 'https://knowledge.bsigroup.com/', 'norma'],
  hiRoto: ['Hydraulic Institute — ANSI/HI 1.1–1.2: bombas rotodinâmicas (centrífugas), nomenclatura, definições e aplicação', 'https://www.pumps.org/', 'norma'],
  hiRot: ['Hydraulic Institute — ANSI/HI 3.1–3.5: bombas rotativas de deslocamento positivo (engrenagens, lóbulos, parafusos)', 'https://www.pumps.org/', 'norma'],
  hiAodd: ['Hydraulic Institute — ANSI/HI 10.1–10.5: bombas de diafragma acionadas a ar (AODD)', 'https://www.pumps.org/', 'norma'],
  hiNpsh: ['Hydraulic Institute — ANSI/HI 9.6.1: margem de NPSH para bombas rotodinâmicas (cavitação)', 'https://www.pumps.org/', 'norma'],
  iso2858: ['ISO 2858 / ISO 5199 — Bombas centrífugas de sucção axial: dimensões e especificações técnicas', 'https://www.iso.org/', 'norma'],
  api610: ['API 610 / ISO 13709 — Bombas centrífugas para petróleo, petroquímica e gás natural', 'https://www.api.org/products-and-services/standards', 'norma'],
  api676: ['API 676 — Bombas rotativas de deslocamento positivo', 'https://www.api.org/products-and-services/standards', 'norma'],
  api675: ['API 675 — Bombas dosadoras de deslocamento positivo (controle de vazão)', 'https://www.api.org/products-and-services/standards', 'norma'],
  sinapi: ['Caixa Econômica Federal — SINAPI 09/2026, preços de insumos sem desoneração, Santa Catarina (base usada pelo Dimensionamento Inteligente do portal)', 'https://www.caixa.gov.br/site/Paginas/downloads.aspx#categoria_888', 'preco'],
};
const CMP_KIND = { norma: 'norma', estudo: 'estudo', fab: 'ficha de fabricante', preco: 'preço', artigo: 'artigo técnico' };

const CMPS = [
  { id: 'agua-quente', tema: 'Água quente predial', titulo: 'Água quente: CPVC, PPR, PEX, multicamada ou cobre?',
    resumo: 'Para casa e prédio, os plásticos (CPVC, PPR, PEX, multicamada) atendem à água quente com custo menor; o cobre continua a escolha para temperaturas mais altas, casas de máquinas, trechos aparentes e onde se exige material incombustível.',
    opcoes: [['CPVC', 'cpvc'], ['PPR', 'ppr'], ['PEX', 'pex'], ['Multicamada (PEX-AL-PEX)', 'multicamada'], ['Cobre', 'cobre']],
    linhas: [
      ['Temperatura de trabalho', ['Até 70 °C na pressão de projeto da norma; fichas citam até 80–90 °C {nbr15884}', 'PN 20: até 70 °C; PN 25: 70 a 95 °C conforme a ficha {ftPpr}{ftPpr2}', 'Conforme a classe de aplicação da NBR 15939 (água quente sanitária: 60–70 °C) {nbr15939}', 'Classe 2: 70 °C contínuo, 80 °C por 1 ano, 95 °C em falha {iso21003}{ftMulti}', 'Acima de 100 °C; o limite costuma ser a junta (solda ou brasagem)']],
      ['Pressão', ['900 kPa até 70 °C; 2 400 kPa a 20 °C (projeto) {nbr15884}', 'Cai com a temperatura: confira a tabela pressão × temperatura da ficha {ftPpr2}', 'Depende da classe e da temperatura {nbr15939}', 'Típico 10 bar a 20 °C e cerca de 6 bar a 95 °C, conforme ficha {ftMulti}', 'Alta; classes E, A e I conforme a espessura {nbr13206}']],
      ['Vida útil', ['Projetada para a VUP da NBR 15575 (≥ 20 anos) quando usada na classe certa {nbr15575}', 'Idem; ensaios de regressão a longo prazo das normas de PP-R {nbr15813}', 'Idem {nbr15939}', 'Projeto de 50 anos na classe de aplicação {iso21003}', 'Longa, mas sensível a água agressiva e a velocidades altas (corrosão por erosão)']],
      ['Incêndio', ['LOI ≈ 60: não sustenta chama ao ar {loiCpvc}', 'Poliolefina: queima ao ar (LOI < 21%) {loi}', 'Poliolefina: queima ao ar {loi}', 'Camadas de PE-X: queimam; alumínio no meio', 'Incombustível']],
      ['Química / qualidade da água', ['Não usar com solventes, óleos e alguns selantes de rosca', 'Boa resistência química; sem corrosão', 'Boa; sensível a UV (não deixar exposto ao sol)', 'Boa; alumínio protegido entre camadas', 'Água ácida ou muito mole corrói; efeito sobre biofilme é misto {cullom}']],
      ['Junta', ['Soldável (adesivo próprio)', 'Termofusão', 'Conexões de anel, crimpagem ou engate', 'Prensagem ou rosca com anel', 'Solda capilar (estanho) ou brasagem; prensagem']],
      ['Ferramenta e mão de obra', ['Simples; exige tempo de cura', 'Termofusor; instalador treinado', 'Ferramenta do sistema; rápido, poucas conexões (tubo flexível)', 'Prensa e mordentes do sistema', 'Maçarico e soldador experiente (ou prensa)']],
      ['Normas', ['NBR 15884', 'NBR 15813', 'NBR 15939', 'ISO 21003', 'NBR 13206']],
      ['Custo de referência (tubo, por metro)', [{ ins: '21124', d: 'CPVC 22 mm' }, { ins: '36278', d: 'PPR PN 20 DN 25' }, null, null, { ins: '12743', d: 'cobre classe E 22 mm' }]],
    ],
    pros: [[['Material autoextinguível', 'Leve e de solda simples', 'Mesma ferramenta do PVC'], ['Adesivo errado ou sem cura causa vazamento', 'Sensível a solventes e a alguns produtos de obra']],
      [['Junta homogênea, sem adesivo', 'Bom custo na água quente', 'Sem corrosão'], ['Exige termofusor e treino', 'Dilatação alta: precisa de liras', 'Queima em incêndio']],
      [['Flexível: menos conexões e emendas', 'Montagem rápida, sistema "pex-a-pex"', 'Tolera congelamento'], ['Conexões e ferramenta próprias de cada sistema', 'Não pode ficar exposto ao sol', 'Queima em incêndio']],
      [['Mantém a forma ao dobrar', 'Dilatação menor que a dos plásticos puros', 'Boa para trechos aparentes e radiadores'], ['Conexões caras; prensa específica', 'Sem preço de referência no SINAPI do portal']],
      [['Incombustível; suporta altas temperaturas', 'Material consagrado em hospitais e gases medicinais', 'Reciclável'], ['Custo alto de material e mão de obra', 'Corrosão com água agressiva', 'Furto em obra']]],
    erros: ['Usar PVC marrom (água fria) no trecho de água quente', 'Não prever dilatação térmica em trechos longos de PPR e CPVC', 'Ligar cobre direto ao aço galvanizado (corrosão galvânica)', 'Trocar o adesivo de CPVC pelo de PVC'],
    apps: { casa: 'CPVC, PPR ou PEX: o custo e a mão de obra local decidem. PEX reduz emendas dentro das paredes.', predio: 'CPVC ou PPR nas prumadas e ramais; PEX/multicamada em sistemas com distribuidor (manifold) por apartamento.', hospital: 'Cobre nas áreas técnicas e de maior temperatura; plásticos aceitos nos ramais conforme projeto. Controle de temperatura contra Legionella vale para qualquer material {cullom}.', industria: 'Cobre ou aço inox para temperaturas e pressões maiores; plásticos só dentro da classe de aplicação.' },
    fontes: ['nbr5626', 'nbr15884', 'nbr15813', 'nbr15939', 'iso21003', 'nbr13206', 'nbr15575', 'loi', 'loiCpvc', 'cullom', 'ftPpr', 'ftPpr2', 'ftMulti', 'sinapi'] },

  { id: 'agua-fria', tema: 'Água fria predial', titulo: 'Água fria: PVC soldável, PPR ou PEX?',
    resumo: 'O PVC soldável é o padrão de custo para água fria; PPR e PEX entram quando a obra quer um só sistema para água fria e quente, ou menos emendas.',
    opcoes: [['PVC soldável', 'pvc'], ['PPR', 'ppr'], ['PEX', 'pex']],
    linhas: [
      ['Temperatura', ['Até 20 °C na pressão nominal; com redução até 45 °C {ftPvc}', 'Fria e quente (classe conforme PN) {ftPpr}', 'Fria e quente {nbr15939}']],
      ['Pressão', ['750 kPa a 20 °C {nbr5648}', 'PN 12,5 para fria; PN 20/25 para quente {ftPpr}', 'Conforme classe {nbr15939}']],
      ['Vida útil', ['Atende à VUP da NBR 15575 {nbr15575}', 'Idem', 'Idem']],
      ['Incêndio', ['LOI ≈ 43: autoextinguível, libera gases ácidos {loiCpvc}', 'Queima ao ar {loi}', 'Queima ao ar {loi}']],
      ['Junta', ['Soldável ou roscável', 'Termofusão', 'Anel, crimpagem ou engate']],
      ['Mão de obra', ['A mais difundida no país', 'Termofusor e treino', 'Ferramenta do sistema']],
      ['Normas', ['NBR 5648 · NBR 5626', 'NBR 15813', 'NBR 15939']],
      ['Custo de referência (tubo, por metro)', [{ ins: '9868', d: 'PVC soldável 25 mm' }, { ins: '36278', d: 'PPR PN 20 DN 25 (o PN 12,5 é mais barato, sem preço no portal)' }, null]],
    ],
    pros: [[['Menor custo', 'Peças em qualquer loja', 'Mão de obra disponível'], ['Não serve para água quente', 'Junta soldável não admite correção']],
      [['Um só sistema para fria e quente', 'Junta homogênea'], ['Custo maior na água fria', 'Exige termofusor']],
      [['Menos emendas, rápido', 'Bom para retrofit (passa em conduítes)'], ['Sistema proprietário de conexões', 'Sem preço no SINAPI do portal']]],
    erros: ['Pressurizar a rede antes do tempo de cura do adesivo', 'Esquecer o teste de estanqueidade antes de fechar as paredes', 'Deixar pontos de espera sem bujão'],
    apps: { casa: 'PVC soldável na água fria; outro material só na quente.', predio: 'PVC nas colunas e ramais; atenção à pressão estática (válvula redutora acima de 40 mca) {nbr5626}.', hospital: 'Conforme projeto; muitos especificam um só material para fria e quente para simplificar a manutenção.', industria: 'PVC em água de utilidades sem calor; metais ou PP em linhas de processo.' },
    fontes: ['nbr5626', 'nbr5648', 'ftPvc', 'nbr15813', 'ftPpr', 'nbr15939', 'nbr15575', 'loi', 'loiCpvc', 'sinapi'] },

  { id: 'esgoto', tema: 'Esgoto predial', titulo: 'Esgoto: PVC série normal, PVC reforçado/acústico ou ferro fundido?',
    resumo: 'PVC série normal para casas e ramais; série reforçada ou PVC acústico em prumadas de prédios; ferro fundido onde ruído e comportamento em incêndio pesam mais (hotéis, hospitais, prédios altos).',
    opcoes: [['PVC série normal', 'pvc-esgoto'], ['PVC série reforçada / acústico', 'pvc-esgoto'], ['Ferro fundido (SMU)', 'smu']],
    linhas: [
      ['Uso típico', ['Ramais e casas', 'Prumadas, áreas sob tráfego, prédios', 'Prumadas de prédios altos, hotéis, hospitais']],
      ['Ruído', ['O mais ruidoso dos três', 'Linhas acústicas com valores autodeclarados baixos {acust}', 'Baixo pela massa do tubo']],
      ['Incêndio', ['Autoextinguível; exige selagem corta-fogo nas passagens de laje {loiCpvc}', 'Idem', 'Incombustível']],
      ['Resistência química', ['Boa para esgoto doméstico', 'Boa', 'Revestimento interno protege contra corrosão']],
      ['Junta', ['Soldável ou elástica', 'Elástica', 'Abraçadeira de inox com anel (sem bolsa)']],
      ['Mão de obra', ['Simples', 'Simples', 'Fácil de montar, peças pesadas']],
      ['Normas', ['NBR 5688 · NBR 8160', 'NBR 5688 · NBR 8160', 'EN 877 · NBR 8160']],
      ['Custo de referência (tubo DN 100, por metro)', [{ ins: '9836', d: 'série normal' }, { ins: '9841', d: 'série R' }, null]],
    ],
    pros: [[['Menor custo', 'Leve'], ['Ruído de queda d’água audível', 'Não usar onde o projeto pede série reforçada']],
      [['Parede mais grossa', 'Linhas acústicas reduzem o ruído'], ['Custo maior que a série normal']],
      [['Silencioso', 'Incombustível', 'Junta desmontável para manutenção'], ['Peso e custo', 'Sem preço no SINAPI do portal']]],
    erros: ['Declividade insuficiente (entupimentos)', 'Ligar ramais na zona de pressão de espuma', 'Falta de ventilação (perda do fecho hídrico)', 'Passar tubo plástico por laje sem selagem corta-fogo'],
    apps: { casa: 'PVC série normal.', predio: 'PVC série reforçada ou acústico nas prumadas; ferro fundido em prédios de alto padrão.', hospital: 'Ferro fundido nas prumadas, pelo ruído e pelo incêndio; conforme projeto.', industria: 'Conforme o efluente: plásticos para químicos, ferro fundido para alta temperatura.' },
    fontes: ['nbr8160', 'nbr5688', 'en877', 'nbr15575', 'acust', 'loiCpvc', 'sinapi'] },

  { id: 'adutoras', tema: 'Saneamento e adutoras', titulo: 'Adutoras e redes de água: PEAD, PVC-O ou ferro dúctil?',
    resumo: 'Ferro dúctil quando há cargas externas altas, travessias e pressões elevadas; PVC-O e PEAD reduzem peso, custo e golpe de aríete. O PVC-O é alternativa ao ferro dúctil, não substituto automático.',
    opcoes: [['PEAD', 'pe'], ['PVC-O (orientado)', 'pvc-agua'], ['Ferro dúctil', 'ferro']],
    linhas: [
      ['Celeridade (golpe de aríete)', ['≈ 320 m/s (PN 16, DN 500) {celer}', '≈ 318 m/s {celer}', '≈ 1.095 m/s: sobrepressão maior {celer}{ufpe}']],
      ['Pressão', ['PN conforme SDR {iso4427}', 'PN 12,5 a 25 típicos {iso16422}', 'Alta; classes K7/K9 {iso2531}']],
      ['Vida útil', ['Longa; depende de solda bem feita', 'Fabricantes declaram mais de 100 anos — alegação comercial {celer}', 'Longa; depende do revestimento e do solo {abrh}']],
      ['Resistência química e solo', ['Não corrói', 'Não corrói', 'Revestimento interno e externo contra corrosão']],
      ['Junta', ['Solda de topo ou eletrofusão (linha contínua)', 'Ponta e bolsa com anel', 'Ponta e bolsa com anel; travada em curvas']],
      ['Mão de obra', ['Máquina de solda e soldador certificado', 'Leve: montagem manual rápida', 'Pesado: exige equipamento']],
      ['Normas', ['ISO 4427 · NBR 15561', 'ISO 16422', 'ISO 2531 · NBR 7675']],
      ['Custo de referência', [null, null, null]],
    ],
    pros: [[['Flexível, aceita recalques do solo', 'Linha soldada sem vazamento nas juntas', 'Golpe de aríete menor'], ['Solda exige controle', 'Dilatação alta']],
      [['Leve e barato no transporte', 'Golpe de aríete menor', 'Baixa rugosidade'], ['Mais recente no Brasil (desde 2014) {abrh}', 'Sensível a danos na instalação']],
      [['Muito resistente a cargas e impactos', 'Histórico longo no país (desde 1910) {abrh}'], ['Peso e custo', 'Golpe de aríete maior', 'Revestimento precisa estar íntegro']]],
    erros: ['Não prever ventosas nos pontos altos', 'Não analisar transientes (golpe de aríete) no recalque', 'Assentar sem berço adequado'],
    apps: { casa: '— (redes públicas)', predio: 'Ramal predial: PEAD ou PVC conforme a concessionária.', hospital: '—', industria: 'Linhas de água bruta e recalque: decisão por análise de transientes, solo e custo de ciclo de vida.' },
    fontes: ['iso4427', 'iso16422', 'iso2531', 'abrh', 'ufpe', 'celer'] },

  { id: 'incendio', tema: 'Rede de incêndio', titulo: 'Incêndio: aço ranhurado, aço roscado/soldado ou CPVC?',
    resumo: 'Aço é a regra em redes de hidrantes e sprinklers; o ranhurado acelera a montagem. O CPVC listado é aceito em sprinklers de risco leve e residencial, dentro das condições da listagem.',
    opcoes: [['Aço com conexão ranhurada', 'ranhurado'], ['Aço roscado ou soldado', 'aco'], ['CPVC para sprinkler', 'cpvc']],
    linhas: [
      ['Onde é aceito', ['Hidrantes e sprinklers {nbr10897}{nbr13714}', 'Hidrantes e sprinklers', 'Só sprinklers de risco leve e residencial, com produto listado {ul1821}']],
      ['Pressão / temperatura', ['Conforme schedule e acoplamento', 'Conforme schedule', '175 psi a 150 °F (≈ 12 bar a 65 °C) segundo literatura de fabricante {ftCpvc}']],
      ['Incêndio', ['Incombustível', 'Incombustível', 'Exige proteção (forro/barreira) e não pode ficar aparente em muitos casos {nyc}']],
      ['Junta', ['Ranhura + acoplamento com anel', 'Rosca ou solda', 'Soldável com adesivo específico']],
      ['Mão de obra', ['Rápida, sem solda no local', 'Soldador/rosqueadeira; trabalho a quente', 'Leve e rápida; atenção a produtos incompatíveis']],
      ['Normas', ['NBR 10897 · NBR 13714', 'NBR 10897 · NBR 13714', 'NFPA 13/13R/13D · UL 1821']],
      ['Custo de referência (tubo 2", por metro)', [{ ins: '21013', d: 'galvanizado classe leve, base do ranhurado' }, { ins: '21148', d: 'aço carbono SCH 40' }, null]],
    ],
    pros: [[['Montagem rápida e limpa', 'Acoplamento flexível absorve dilatação'], ['Acoplamentos com custo próprio']],
      [['Solução tradicional, aceita em todos os riscos'], ['Trabalho a quente na obra', 'Mais mão de obra']],
      [['Leve, rápido, não corrói'], ['Restrito a riscos leves e à listagem', 'Incompatível com alguns óleos e selantes']]],
    erros: ['Usar CPVC fora da listagem (risco, área ou exposição)', 'Misturar acoplamentos e tubos de fabricantes sem compatibilidade declarada', 'Deixar a reserva técnica de incêndio ser consumida pelo uso diário'],
    apps: { casa: 'Raramente exigido; em residências com sprinkler, CPVC listado.', predio: 'Aço ranhurado nas prumadas; CPVC listado em apartamentos (risco leve), se aceito pelo Corpo de Bombeiros local.', hospital: 'Aço, pelo risco e pela exigência de incombustibilidade.', industria: 'Aço (ranhurado ou soldado) conforme o risco.' },
    fontes: ['nbr10897', 'nbr13714', 'ul1821', 'nyc', 'ftCpvc', 'sinapi'] },

  { id: 'gas', tema: 'Gás combustível', titulo: 'Gás: cobre, aço, multicamada (PE-AL-PE) ou polietileno?',
    resumo: 'Cobre e aço são os materiais tradicionais da NBR 15526; o multicamada para gás tem norma própria e aceitação que varia por estado; o polietileno é para trechos enterrados.',
    opcoes: [['Cobre', 'cobre'], ['Aço (galvanizado ou revestido)', 'aco'], ['Multicamada PE-AL-PE', 'multicamada'], ['Polietileno (PE)', 'pe']],
    linhas: [
      ['Onde usar', ['Aparente e embutido {nbr15526}', 'Aparente, embutido; aço revestido de PE até 1,5 bar {nbr17247}', 'Embutido ou protegido de UV, após o regulador, conforme Corpo de Bombeiros {nbr16821}', 'Enterrado']],
      ['Temperatura', ['Alta', 'Alta', 'Até 60 °C {nbr16821}', 'Ambiente (enterrado)']],
      ['Incêndio', ['Incombustível', 'Incombustível', 'Camadas plásticas queimam', 'Queima; por isso só enterrado']],
      ['Junta', ['Solda/brasagem ou prensagem', 'Rosca ou solda', 'Prensagem do sistema', 'Eletrofusão ou termofusão']],
      ['Mão de obra', ['Soldador experiente', 'Rosqueadeira; vedante certificado para gás', 'Prensa do sistema', 'Máquina de solda de PE']],
      ['Normas', ['NBR 15526', 'NBR 15526 · NBR 17247-1', 'NBR 16821', 'NBR 15526']],
      ['Custo de referência (tubo, por metro)', [{ ins: '39748', d: 'cobre classe A 22 mm (gás)' }, { ins: '40626', d: 'aço galvanizado classe média 1"' }, null, null]],
    ],
    pros: [[['Consagrado, incombustível'], ['Custo e furto']], [['Resistente, menor custo de material'], ['Corrosão se exposto sem proteção', 'Rosca exige vedante para gás']], [['Rápido, poucas emendas'], ['Aceitação varia por estado', 'Proteção contra UV']], [['Ideal enterrado, não corrói'], ['Não pode ficar aparente']]],
    erros: ['Vedante de rosca não certificado para gás', 'Procurar vazamento com chama', 'Liberar a rede sem teste de estanqueidade e laudo'],
    apps: { casa: 'Cobre ou multicamada (onde aceito) dentro de casa; PE no trecho enterrado.', predio: 'Prumadas em cobre ou aço; ramais conforme projeto e concessionária.', hospital: 'Cobre; gases medicinais têm norma própria (NBR 12188) {nbr12188}.', industria: 'Aço, conforme pressão e projeto.' },
    fontes: ['nbr15526', 'nbr16821', 'nbr17247', 'nbr12188', 'sinapi'] },

  { id: 'valvulas', tema: 'Válvulas', titulo: 'Válvula de bloqueio: gaveta, esfera, borboleta ou globo?',
    resumo: 'Esfera para abrir e fechar rápido em diâmetros pequenos; gaveta onde se quer passagem plena e manobra lenta; borboleta em diâmetros grandes; globo quando é preciso regular a vazão.',
    opcoes: [['Gaveta', 'gaveta'], ['Esfera', 'esfera'], ['Borboleta', 'borboleta'], ['Globo', 'globo']],
    linhas: [
      ['Função', ['Bloqueio (aberta ou fechada)', 'Bloqueio rápido (1/4 de volta)', 'Bloqueio e regulagem grosseira', 'Regulagem de vazão']],
      ['Perda de carga aberta', ['Muito baixa', 'Muito baixa (passagem plena)', 'Baixa a média (disco no fluxo)', 'Alta']],
      ['Golpe de aríete', ['Fechamento lento: menor risco', 'Fechamento rápido: maior risco em linhas longas', 'Rápida com alavanca; usar redutor', 'Lento']],
      ['Diâmetros usuais', ['Pequenos a médios', 'Pequenos a médios', 'Médios a grandes', 'Pequenos a médios']],
      ['Manutenção', ['Desgaste da cunha; não usar para regular', 'Simples; vedação de PTFE', 'Troca de anel/sede', 'Sede e obturador']],
      ['Custo de referência (3/4")', [{ ins: '6016', d: 'gaveta bruta em latão' }, { ins: '6032', d: 'esfera de PVC (material diferente)' }, null, null]],
    ],
    pros: [[['Passagem plena, fechamento lento'], ['Não serve para regular']], [['Rápida, estanque, compacta'], ['Pode provocar golpe se fechada de uma vez']], [['Leve e compacta em DN grande'], ['Disco no fluxo']], [['Regula bem'], ['Perda de carga alta']]],
    erros: ['Usar gaveta parcialmente aberta para regular vazão', 'Fechar esfera de uma vez em linhas longas (golpe de aríete)'],
    apps: { casa: 'Esfera ou gaveta nos ramais; registro de pressão nos chuveiros.', predio: 'Gaveta ou esfera no barrilete; borboleta em DN grandes.', hospital: 'Esfera de fechamento rápido em setores; conforme projeto.', industria: 'Conforme a função: bloqueio, regulagem e diâmetro.' },
    fontes: ['nbr5626', 'sinapi'] },

  { id: 'valvulas-borboleta', tema: 'Válvulas', titulo: 'Válvula borboleta: qual dos 8 tipos? Corpo (wafer, lug, flangeada) e desenho da vedação',
    resumo: 'Corpo: wafer para uso geral, lug quando é preciso desmontar um lado da linha, flangeada em diâmetros grandes e pressões maiores. Desenho: assento resiliente (concêntrica) para água, ar-condicionado e serviços gerais; dupla excêntrica ou de alto desempenho quando sobem pressão, temperatura ou o número de manobras; tripla excêntrica, com vedação metálica, em vapor, alta temperatura e serviços severos; criogênica para gases liquefeitos {dirac}{api609}.',
    intro: 'Por fora, muitas válvulas borboleta parecem iguais, mas o desenho do disco e da vedação muda tudo. Os 8 tipos respondem a duas escolhas independentes, por isso a comparação vem em duas tabelas: o corpo, que define a montagem na linha (wafer, lug ou flangeada), e o desenho do disco e da vedação (resiliente, dupla excêntrica, tripla excêntrica, de alto desempenho ou criogênica). Toda válvula tem um corpo e um desenho: uma tripla excêntrica, por exemplo, pode ter corpo lug ou flangeado {dirac}{api609}{iso5752}.',
    tipos: 'borboleta',
    opcoes: [['Wafer', 'borboleta-wafer'], ['Lug', 'borboleta-lug'], ['Flangeada', 'borboleta-flangeada'],
      ['Assento resiliente (concêntrica)', 'borboleta-assento-resiliente'], ['Dupla excêntrica', 'borboleta-dupla-excentrica'], ['Tripla excêntrica', 'borboleta-tripla-excentrica'], ['De alto desempenho', 'borboleta-alto-desempenho'], ['Criogênica', 'borboleta-criogenica']],
    // duas tabelas: cols = posições em opcoes
    tabelas: [
      { titulo: 'Corpo: como a válvula é montada na linha', cols: [0, 1, 2], linhas: [
        ['Montagem', ['Entre dois flanges, com parafusos passantes que unem os flanges da linha', 'Entre flanges, com os parafusos de cada lado rosqueados nas orelhas (lugs) do corpo', 'Duplo flange integrado, aparafusado à linha como um carretel']],
        ['Fim de linha e desmontagem de um lado', ['Não: ao soltar um flange, a válvula fica solta', 'Sim, conforme o projeto e a classe (em geral com pressão reduzida) {dirac}', 'Sim']],
        ['Peso e espaço', ['O menor: corpo curto e leve {dirac}', 'Intermediário', 'O maior {dirac}']],
        ['Diâmetros e pressões usuais', ['Pequenos a grandes; PN 10/16 e classe 150', 'Pequenos a médios; PN 10/16 e classes 150 a 300', 'Médios a muito grandes; pressões e esforços maiores {dirac}']],
        ['Custo relativo', ['Menor', 'Intermediário', 'Maior']],
        ['Face a face e normas', ['API 609 · MSS SP-67 · ISO 5752 {api609}{mssSp67}{iso5752}', 'API 609 · MSS SP-67 · ISO 5752 {api609}{mssSp67}{iso5752}', 'ISO 5752 · AWWA C504 · API 609 {iso5752}{awwaC504}{api609}']],
      ] },
      { titulo: 'Desenho: como o disco veda', cols: [3, 4, 5, 6, 7], linhas: [
        ['Desenho', ['Eixo no centro do disco; o disco desliza sobre o assento de elastômero em todo o curso', 'Eixo deslocado do centro e do plano de vedação: o disco se afasta do assento logo no início da abertura {dirac}', 'Dupla excentricidade mais um assento cônico: o contato só acontece no fim do fechamento, sem atrito {dirac}', 'Nome comercial das borboletas de alta performance: em geral dupla excêntrica de corpo de aço {api609}', 'Haste alongada (castelo estendido) que afasta o atuador e a gaxeta do frio {dirac}{bs6364}']],
        ['Vedação', ['Elastômero (EPDM, NBR, FKM) ou PTFE {dirac}', 'Assento macio (PTFE reforçado) ou metálico', 'Metal contra metal ou laminada (metal e grafite) {dirac}', 'PTFE, PTFE reforçado ou metálica', 'Materiais e assentos qualificados para baixa temperatura {bs6364}']],
        ['Pressão e temperatura', ['Limitadas pelo elastômero e pela classe do corpo (PN 10/16 é o comum); confira a ficha', 'Classes 150 a 600; temperatura limitada pelo material do assento {api609}', 'Classes altas e temperaturas elevadas, conforme a ficha {dirac}{api609}', 'Classes 150 a 600, conforme o assento {api609}', 'Temperaturas muito baixas (gases liquefeitos) {bs6364}']],
        ['Torque e desgaste', ['Baixo torque; o assento se desgasta com o atrito e com sólidos', 'Torque e desgaste menores que os da concêntrica em manobras frequentes {dirac}', 'Sem atrito no curso; o torque de vedação é alto e define o atuador', 'Como a dupla excêntrica; boa para modulação', 'Conforme o desenho (em geral de alta performance)']],
        ['Estanqueidade', ['Estanque enquanto o elastômero está em bom estado', 'Alta, conforme o ensaio do fabricante {api598}', 'Alta; existe versão bidirecional e com ensaio de fogo {api598}{api607}', 'Alta, conforme o ensaio do fabricante; versões fire safe {api598}{api607}', 'Ensaio a frio conforme a norma de válvulas criogênicas {bs6364}']],
        ['Acionamento típico', ['Alavanca ou redutor com volante', 'Redutor ou atuador', 'Redutor ou atuador dimensionado pelo torque de vedação', 'Atuador pneumático ou elétrico, com posicionador', 'Redutor ou atuador, acima do castelo estendido']],
        ['Corpos usuais', ['Wafer, lug e flangeada', 'Wafer, lug e flangeada', 'Lug, flangeada ou solda', 'Wafer e lug, mais comuns', 'Flangeada ou solda']],
        ['Normas', ['AWWA C504 · MSS SP-67 · ISO 5752 {awwaC504}{mssSp67}{iso5752}', 'API 609 (categoria B) · API 598 {api609}{api598}', 'API 609 · API 598 · API 607 {api609}{api598}{api607}', 'API 609 · API 598 {api609}{api598}', 'BS 6364 {bs6364}']],
      ] },
    ],
    linhas: [],
    pros: [[['Menor custo, peso e espaço', 'Montagem simples entre flanges'], ['Não serve para fim de linha', 'Para desmontar, é preciso soltar os dois lados']],
      [['Permite desmontar um lado da linha', 'Pode ficar em fim de linha, conforme a classe'], ['Mais pesada e cara que a wafer', 'Pressão admitida em fim de linha costuma ser menor']],
      [['A mais robusta: suporta os esforços da linha', 'Para diâmetros grandes e pressões maiores'], ['A mais pesada, cara e volumosa']],
      [['Menor custo e peso', 'Baixo torque: alavanca ou atuador pequeno', 'Ideal para água e HVAC'], ['Limite de temperatura e de compatibilidade química do elastômero {dirac}', 'Desgaste do assento com sólidos e abrasivos']],
      [['Menos atrito: maior vida do assento', 'Boa para modulação e manobras frequentes'], ['Custo maior que a concêntrica', 'Assento macio limita a temperatura']],
      [['Vedação metálica para vapor e alta temperatura', 'Sem atrito no curso: longa vida', 'Versões testadas ao fogo'], ['Custo alto', 'Torque de vedação alto; atuador maior']],
      [['Classes de pressão maiores', 'Pronta para automação'], ['"Alto desempenho" é nome comercial: confira desenho, assento e classe na ficha', 'Custo maior que a concêntrica']],
      [['Opera com gases liquefeitos sem congelar o acionamento'], ['Custo alto', 'Exige montagem com a haste na posição indicada pelo fabricante']]],
    criterios: ['Pressão e temperatura de operação (e de projeto)', 'Tipo de fluido: compatibilidade química, sólidos e abrasivos', 'Torque de operação e dimensionamento do atuador', 'Classe de estanqueidade exigida e sentido do fluxo (uni ou bidirecional)', 'Frequência de operação e se a válvula vai bloquear ou modular'],
    fecho: 'Escolher só pela aparência ou pelo preço é um dos erros mais comuns: válvulas borboleta de mesmo diâmetro e corpo podem ter desempenhos muito diferentes {dirac}.',
    erros: ['Usar assento de EPDM em linha com óleo ou hidrocarboneto (o NBR ou o FKM é que servem)', 'Instalar wafer em fim de linha esperando desmontar o lado de jusante com pressão (para isso existe o lug, se a classe permitir)', 'Abrir o disco contra a junta ou o tubo vizinho: confira se o disco gira livre antes de apertar os flanges', 'Dimensionar o atuador de uma tripla excêntrica sem o torque de vedação do fabricante', 'Instalar tripla excêntrica unidirecional no sentido contrário ao indicado no corpo'],
    apps: { casa: '—', predio: 'Concêntrica de assento resiliente (wafer ou lug) em água gelada, recalque e incêndio, com redutor de volante nos DN maiores.', hospital: 'Concêntrica nas utilidades de água e HVAC; dupla ou tripla excêntrica no vapor da central térmica.', industria: 'Resiliente em água e utilidades; dupla excêntrica em processos e modulação; tripla excêntrica em vapor, óleo térmico e hidrocarbonetos; criogênica em GNL, oxigênio e nitrogênio líquidos.' },
    fontes: ['dirac', 'api609', 'mssSp67', 'awwaC504', 'iso5752', 'api598', 'api607', 'bs6364'] },

  { id: 'bombas-fluidos', tema: 'Bombas', titulo: 'Qual bomba para cada fluido? Centrífuga, engrenagens, diafragma ou peristáltica',
    tipos: 'bombas',
    resumo: 'Centrífuga para água e líquidos limpos; de engrenagens para óleos e fluidos viscosos; de diafragma para químicos corrosivos e fluidos que não podem vazar; peristáltica para polpas, lamas com sólidos abrasivos e dosagem {hiRoto}{hiRot}{hiAodd}.',
    intro: 'O fluido decide a bomba. Viscosidade, sólidos, abrasividade, corrosividade e a necessidade de dosar com precisão pesam mais que a vazão. A regra rápida é a do resumo abaixo; ela simplifica: em mineração e saneamento, grandes vazões de polpa costumam usar centrífugas próprias para polpa (rotor aberto e revestimento resistente à abrasão), e a peristáltica fica com vazões menores, polpas muito abrasivas e dosagem.',
    opcoes: [['Centrífuga', 'bombas'], ['De engrenagens', 'bombas'], ['De diafragma (pneumática)', 'bombas'], ['Peristáltica', 'bombas']],
    linhas: [
      ['Fluido indicado', ['Água e líquidos limpos, de baixa viscosidade', 'Óleos, lubrificantes, combustíveis, resinas e outros viscosos sem abrasivos', 'Químicos corrosivos, tintas, solventes, lodos e líquidos com sólidos moderados', 'Polpas, lamas e líquidos com sólidos abrasivos; fluidos sensíveis ao cisalhamento']],
      ['Princípio', ['Rotodinâmica: o rotor acelera o líquido e a voluta converte velocidade em pressão {hiRoto}', 'Deslocamento positivo rotativo: volumes fixos entre os dentes e a carcaça {hiRot}', 'Deslocamento positivo alternativo: duas membranas movidas a ar comprimido, com válvulas de esfera {hiAodd}', 'Deslocamento positivo: rolos ou sapatas comprimem uma mangueira; o fluido só toca a mangueira']],
      ['Viscosidade', ['Baixa; com fluido viscoso a vazão, a altura e o rendimento caem {hiRoto}', 'Média a muito alta; a viscosidade até melhora a vedação interna {hiRot}', 'Baixa a alta', 'Baixa a alta']],
      ['Sólidos e abrasivos', ['Pouca tolerância (exceto centrífugas de polpa, de rotor aberto)', 'Não tolera abrasivos: desgastam engrenagens e folgas', 'Tolera sólidos até a passagem das esferas', 'Tolera bem; o abrasivo só desgasta a mangueira']],
      ['Vazão e pressão', ['Vazão alta e contínua, que varia com a pressão do sistema (curva da bomba)', 'Vazão proporcional à rotação, quase independente da pressão; exige válvula de alívio', 'Vazão pulsante, ajustada pelo ar; não passa da pressão do ar de acionamento', 'Vazão proporcional à rotação, boa para dosagem; pulsante']],
      ['Escorvamento e operação a seco', ['Em geral não é autoescorvante; precisa de NPSH disponível acima do requerido {hiNpsh}', 'Autoescorvante; não deve rodar a seco por muito tempo', 'Autoescorvante; pode rodar a seco e contra o registro fechado', 'Autoescorvante; pode rodar a seco e inverter o sentido']],
      ['Manutenção', ['Selo mecânico e rolamentos', 'Desgaste de engrenagens, buchas e folgas; vedação do eixo', 'Membranas, esferas e sedes', 'Troca da mangueira; sem selos nem válvulas']],
      ['Normas', ['ISO 2858 · ISO 5199 · API 610 · ANSI/HI 1.1–1.2 {iso2858}{api610}{hiRoto}', 'API 676 · ANSI/HI 3.1–3.5 {api676}{hiRot}', 'ANSI/HI 10.1–10.5 {hiAodd}', 'Ficha do fabricante; para dosagem, API 675 {api675}']],
    ],
    pros: [[['Simples, barata e de grande vazão', 'Fluxo contínuo, sem pulsação', 'Muitos fabricantes e peças no mercado'], ['Perde desempenho com fluido viscoso', 'Cavita se o NPSH disponível for baixo', 'Não deve rodar a seco']],
      [['Bom rendimento com viscosos', 'Vazão estável e previsível', 'Compacta'], ['Não aceita abrasivos nem sólidos', 'Precisa de válvula de alívio: com a descarga fechada, a pressão sobe sem limite']],
      [['Sem selo nem motor elétrico: boa para áreas classificadas', 'Trabalha a seco e com sólidos moderados', 'Materiais para quase todo químico'], ['Consome ar comprimido', 'Fluxo pulsante (pode pedir amortecedor)', 'Membranas exigem troca periódica']],
      [['Fluido isolado na mangueira: sem contaminação e sem vazamento por selo', 'Lida com abrasivos e sólidos', 'Dosagem precisa e reversível'], ['Vazão e pressão limitadas pelo tamanho da mangueira', 'Mangueira é item de troca frequente', 'Fluxo pulsante']]],
    criterios: ['Viscosidade do fluido na temperatura de operação', 'Teor, tamanho e dureza dos sólidos (abrasividade)', 'Compatibilidade química dos materiais (carcaça, membrana, mangueira, selo)', 'Vazão e altura manométrica no ponto de operação (curva da bomba × curva do sistema)', 'NPSH disponível na sucção e risco de rodar a seco', 'Precisão de dosagem, energia disponível (elétrica ou ar comprimido) e manutenção'],
    fecho: 'A melhor bomba é a que atende o fluido e o ponto de operação com folga, não a mais barata nem a mais potente.',
    erros: ['Usar centrífuga em óleo muito viscoso sem corrigir a curva para a viscosidade', 'Instalar bomba de engrenagens sem válvula de alívio na descarga', 'Deixar a centrífuga cavitar por NPSH disponível insuficiente (sucção longa, quente ou estrangulada)', 'Bomba de diafragma sem filtro, regulador e lubrificação adequada do ar', 'Escolher membrana ou mangueira sem conferir a compatibilidade química com o fluido'],
    apps: { casa: 'Centrífuga: pressurizador, piscina, poço e recalque para a caixa d’água.', predio: 'Centrífuga no recalque, na pressurização e no incêndio; dosagem de cloro com bomba dosadora de diafragma.', hospital: 'Centrífugas nas utilidades; dosadoras de diafragma ou peristálticas no tratamento de água e na dosagem de produtos.', industria: 'Engrenagens para óleos e resinas; diafragma para químicos e transferência de tambores; peristáltica para polpas, lodos e dosagem; centrífuga de polpa para grandes vazões de mineração.' },
    fontes: ['hiRoto', 'hiRot', 'hiAodd', 'hiNpsh', 'iso2858', 'api610', 'api676', 'api675'] },

  { id: 'aquecimento', tema: 'Aquecimento de água', titulo: 'Aquecimento de água: solar, gás, bomba de calor ou elétrico?',
    resumo: 'Solar reduz o custo de operação e precisa de apoio; gás entrega vazão alta; bomba de calor gasta menos energia que a resistência elétrica; o elétrico tem o menor custo de instalação e o maior de operação.',
    opcoes: [['Solar', 'solar'], ['Gás', 'caldeiras'], ['Bomba de calor', 'solar'], ['Elétrico', 'caldeiras']],
    linhas: [
      ['Custo de instalação', ['Médio a alto', 'Médio', 'Alto', 'Baixo']],
      ['Custo de operação', ['O menor (apoio em dias nublados)', 'Médio (tarifa do gás)', 'Baixo (usa várias vezes menos energia que a resistência)', 'O maior']],
      ['Vazão de água quente', ['Conforme o reservatório', 'Alta e contínua (passagem)', 'Conforme o reservatório', 'Limitada']],
      ['Exigências', ['Área de telhado e orientação {nbr15569}', 'Ventilação e chaminé {nbr13103}', 'Local ventilado para a unidade externa', 'Circuito elétrico dimensionado']],
      ['Normas', ['NBR 15569', 'NBR 13103 · NBR 15526', '—', 'NBR 5410 (elétrica)']],
    ],
    pros: [[['Energia gratuita'], ['Precisa de apoio e espaço']], [['Vazão alta'], ['Exige ventilação e rede de gás']], [['Eficiente'], ['Investimento alto']], [['Barato para instalar'], ['Operação cara', 'Pico na rede elétrica']]],
    erros: ['Instalar aquecedor a gás em banheiro sem ventilação', 'Rede de água quente em PVC marrom'],
    apps: { casa: 'Solar com apoio elétrico ou gás.', predio: 'Central a gás ou solar coletivo com recirculação.', hospital: 'Central com redundância e controle de temperatura.', industria: 'Caldeira ou bomba de calor conforme a carga.' },
    fontes: ['nbr15569', 'nbr13103'] },

  { id: 'reservatorios', tema: 'Reservatórios', titulo: "Caixa d'água: polietileno, fibra de vidro ou concreto?",
    resumo: 'Polietileno até alguns milhares de litros pela leveza e preço; fibra de vidro para volumes maiores; concreto quando o reservatório faz parte da estrutura do prédio.',
    opcoes: [['Polietileno', 'reservatorios'], ['Fibra de vidro', 'reservatorios'], ['Concreto', 'reservatorios']],
    linhas: [
      ['Volumes usuais', ['Até ~15 mil L', 'Até dezenas de milhares de litros', 'Qualquer volume (moldado no local)']],
      ['Instalação', ['Leve; base plana e contínua', 'Base e içamento', 'Obra civil, impermeabilização']],
      ['Manutenção', ['Limpeza semestral', 'Limpeza semestral', 'Limpeza e impermeabilização periódica']],
      ['Normas', ['NBR 14799 · NBR 5626', 'NBR 5626', 'NBR 5626']],
      ['Custo de referência (por litro)', [{ ins: '37105', div: 5000, d: 'caixa de 5.000 L' }, { ins: '43982', div: 20000, d: 'reservatório de 20.000 L com tampa' }, null]],
    ],
    pros: [[['Leve, barata, fácil de instalar'], ['Deforma com base ruim']], [['Grandes volumes, leve'], ['Exige içamento']], [['Integra a estrutura; grandes volumes'], ['Impermeabilização e fissuras']]],
    erros: ['Base com ripas ou apoios isolados', 'Extravasor escondido', 'Caixa sem tampa'],
    apps: { casa: 'Polietileno.', predio: 'Fibra ou concreto (inferior e superior).', hospital: 'Concreto ou fibra, com volume de reserva definido no projeto.', industria: 'Conforme volume: fibra, concreto ou aço.' },
    fontes: ['nbr14799', 'nbr5626', 'sinapi'] },

  { id: 'pressurizacao', tema: 'Pressão da água', titulo: 'Pressão: caixa elevada, pressurizador ou hidropneumático?',
    resumo: 'A caixa elevada (gravidade) é a mais simples e confiável; o pressurizador corrige pressão baixa em pontos específicos; o hidropneumático pressuriza toda a rede quando não há altura.',
    opcoes: [['Caixa elevada (gravidade)', 'reservatorios'], ['Pressurizador', 'pressurizadores'], ['Hidropneumático / conjunto pressurizado', 'bombas']],
    linhas: [
      ['Energia', ['Só o recalque até a caixa', 'Liga a cada uso', 'Liga conforme a pressão']],
      ['Falta de energia', ['Continua abastecendo', 'Perde a pressão extra', 'Para (sem reserva elevada)']],
      ['Ruído', ['Nenhum na distribuição', 'Do equipamento', 'Do equipamento']],
      ['Limite', ['Pressão depende da altura; acima de 40 mca usar redutora {nbr5626}', 'Pontos isolados', 'Projeto com tanque e controle']],
    ],
    pros: [[['Simples, sem energia na distribuição'], ['Pouca pressão nos últimos andares']], [['Resolve chuveiro fraco'], ['Ruído e manutenção']], [['Pressão constante sem caixa elevada'], ['Depende de energia', 'Manutenção do tanque']]],
    erros: ['Instalar pressurizador sem verificar a vazão disponível', 'Ignorar a pressão estática máxima nos andares baixos'],
    apps: { casa: 'Caixa elevada; pressurizador se o chuveiro ficar fraco.', predio: 'Caixa superior; conjunto pressurizado nos últimos andares, se preciso.', hospital: 'Redundância de bombas e reserva elevada.', industria: 'Conjunto pressurizado com inversor de frequência.' },
    fontes: ['nbr5626'] },

  { id: 'metais-industria', tema: 'Indústria', titulo: 'Tubulação industrial: aço carbono, galvanizado ou inox?',
    resumo: 'Aço carbono para vapor, óleo e ar comprimido; galvanizado para utilidades e incêndio; inox para alimentos, farmacêutica e fluidos corrosivos.',
    opcoes: [['Aço carbono', 'aco'], ['Aço galvanizado', 'galv'], ['Aço inox', 'inox']],
    linhas: [
      ['Corrosão', ['Precisa de pintura ou revestimento', 'Zinco protege até ser consumido; água mole e quente acelera {galv1}{galv2}', 'Resiste à maioria dos meios; atenção a cloretos']],
      ['Uso típico', ['Vapor, condensado, óleo, ar', 'Incêndio, ar, água de utilidades', 'Processos sanitários, química']],
      ['Junta', ['Solda, flange, rosca', 'Rosca ou ranhura (não soldar sem retocar a proteção)', 'Solda orbital, tri-clamp, flange']],
      ['Custo de referência (tubo 1", por metro)', [{ ins: '42574', d: 'SCH 40 sem costura' }, { ins: '40626', d: 'classe média com costura' }, null]],
    ],
    pros: [[['Resistente e barato para alta pressão e temperatura'], ['Corrói sem proteção']], [['Proteção de fábrica'], ['Corrosão em água quente e mole', 'Não usar em água potável quente']], [['Higiênico e durável'], ['Custo alto', 'Solda especializada']]],
    erros: ['Galvanizado em água quente', 'Ligar galvanizado direto ao cobre'],
    apps: { casa: '—', predio: 'Galvanizado em incêndio.', hospital: 'Inox em cozinhas e áreas técnicas especiais.', industria: 'Conforme o fluido, a temperatura e a higiene exigida.' },
    fontes: ['galv1', 'galv2', 'sinapi'] },

  { id: 'soldar-flangear-rosquear', tema: 'Indústria', titulo: 'Soldar, flangear ou rosquear? A escolha da conexão na tubulação industrial',
    resumo: 'Não existe conexão universalmente melhor. A solda dá integridade e estanqueidade em condições severas; o flange dá acesso para desmontar válvulas, bombas e filtros; a rosca simplifica a montagem em pequenos diâmetros e utilidades, dentro dos limites do código {asmeB313}.',
    intro: 'No projeto de tubulações industriais, o tipo de conexão é uma decisão técnica: define a integridade mecânica, a estanqueidade, a confiabilidade operacional e a facilidade de manutenção do sistema. Pressão, temperatura, fluido, diâmetro nominal, corrosividade, vibração e necessidade de desmontagem devem orientar a escolha.',
    opcoes: [['Soldada', 'conexoes-solda'], ['Flangeada', 'flanges'], ['Roscada', 'conexoes-forjadas']],
    linhas: [
      ['Ponto forte', ['Integridade mecânica e estanqueidade', 'Acesso e manutenção', 'Simplicidade de montagem, sem solda']],
      ['Pressão e temperatura', ['Condições severas, desde que projeto, materiais, procedimento de soldagem e inspeção estejam especificados {asmeB313}', 'Limitadas pela classe do flange (tabela pressão × temperatura) e pela junta de vedação {asmeB165}', 'Serviços moderados; o código do sistema limita pressão, temperatura e fluido {asmeB313}']],
      ['Diâmetros usuais', ['Todos: solda de topo nos maiores {asmeB169}, solda de encaixe nos pequenos {asmeB1611}', 'Médios e grandes; ligação de equipamentos', 'Pequenos diâmetros {asmeB1611}']],
      ['Desmontagem', ['Não: só cortando o tubo', 'Sim, periódica, sem cortar', 'Possível, mas a rosca se desgasta a cada remontagem']],
      ['Pontos de vazamento', ['Poucos: reduz o número de juntas desmontáveis', 'Cada flange é um ponto potencial (junta, alinhamento, aperto)', 'Cada rosca é um ponto potencial']],
      ['Vibração e corrosão', ['Boa resistência, se bem executada e inspecionada', 'Pode exigir reaperto; parafusos sensíveis à corrosão', 'Ponto fraco: tende a afrouxar e a trincar; a rosca reduz a espessura da parede']],
      ['Exige atenção a', ['Procedimento e soldador qualificados, inspeção visual e ensaios não destrutivos', 'Seleção da junta, compatibilidade dos materiais, alinhamento, sequência de aperto e torque dos parafusos {asmePcc1}', 'Vedante compatível com o fluido, engajamento correto da rosca e risco de corrosão']],
      ['Normas', ['ASME B31.3, B16.9, B16.11 {asmeB313}{asmeB169}{asmeB1611}', 'ASME B16.5, PCC-1 {asmeB165}{asmePcc1}', 'ASME B1.20.1 (NPT), B16.11 {asmeB1201}{asmeB1611}']],
    ],
    pros: [[['Alta resistência mecânica', 'Menos juntas desmontáveis, menos pontos de vazamento', 'Adequada a pressões e temperaturas severas'], ['Não desmonta sem corte', 'Exige soldador qualificado, procedimento e inspeção']],
      [['Instala e remove válvulas, bombas, filtros e outros equipamentos', 'Facilita a manutenção periódica'], ['Montagem inadequada compromete a vedação e provoca vazamentos', 'Mais peso, espaço e custo de peças']],
      [['Montagem prática e rápida', 'Dispensa soldagem (sem trabalho a quente)'], ['Não serve para todas as condições operacionais', 'Sensível a vibração e a corrosão']]],
    criterios: ['Condições de projeto e operação (pressão, temperatura, vibração)', 'Material da tubulação e compatibilidade química com o fluido', 'Requisitos de estanqueidade e integridade mecânica', 'Inspeção, manutenção e vida útil esperada', 'Normas técnicas aplicáveis e consequências de uma falha'],
    fecho: 'Na engenharia de tubulações, não existe conexão universalmente melhor: existe a solução mais adequada aos requisitos do projeto e às condições de operação. A decisão não deve se basear só no custo inicial ou na facilidade de instalação.',
    erros: ['Escolher a conexão só pelo custo inicial ou pela facilidade de instalação', 'Apertar flanges sem sequência cruzada e sem controle de torque', 'Reaproveitar a junta de vedação de um flange já desmontado', 'Usar rosca em linhas com vibração ou fluido perigoso sem verificar o código', 'Soldar sem procedimento qualificado e sem inspeção'],
    apps: { casa: 'Rosca nos metais e pequenos diâmetros; flange só em bombas e equipamentos.', predio: 'Flange em bombas, válvulas e medidores da casa de máquinas; rosca em utilidades de pequeno diâmetro; solda ou ranhura nas linhas de aço maiores.', hospital: 'Gases medicinais em cobre com brasagem {nbr12188}; flange nos equipamentos que exigem manutenção.', industria: 'Solda como regra nas linhas de processo; flange nos equipamentos e pontos de manutenção; rosca em pequenos diâmetros de utilidades, quando o código permitir {asmeB313}.' },
    fontes: ['asmeB313', 'asmeB169', 'asmeB1611', 'asmeB165', 'asmePcc1', 'asmeB1201', 'nbr12188'] },
];

// Insumo SINAPI do custo de referência: { ins, div } → preço por metro, unidade ou litro no estado escolhido
function cmpCusto(c, uf) {
  if (!c || typeof SINAPI_PRECOS === 'undefined') return null;
  const row = SINAPI_PRECOS.ins[c.ins], i = SINAPI_PRECOS.ufs.indexOf(uf);
  const v = row && i >= 0 ? row[2 + i] : null;
  return typeof v === 'number' ? v / (c.div || 1) : null;
}

// HTML de um comparativo. o.base: prefixo dos links do portal ('' no site; '' também nas páginas próprias)
// o.uf: estado do custo · o.erros: link de Erros e patologias · as referências são numeradas dentro de cada comparativo
function comparativoHTML(c, o = {}) {
  const uf = o.uf || 'SC', h = o.page ? 'h2' : 'h4';
  const ids = []; const num = id => { let k = ids.indexOf(id); if (k < 0) { ids.push(id); k = ids.length - 1; } return k + 1; };
  c.fontes.forEach(num);
  const esc = s => String(s).replace(/"/g, '&quot;');
  const refs = txt => String(txt).replace(/\{(\w+)\}/g, (_, id) => CMP_FONTES[id] ? `<a class="cp-src" href="#cp-${c.id}-ref-${id}" title="${esc(CMP_FONTES[id][0])}">[${num(id)}]</a>` : '');
  const custo = (x, label) => {
    if (!x) return '<span class="cp-na">sem referência SINAPI no portal</span>';
    const v = cmpCusto(x, uf);
    return v == null ? `<span class="cp-na">${x.d}: sem preço SINAPI em ${uf}</span>`
      : `<span class="cp-cost" data-ins="${x.ins}" data-div="${x.div || 1}">${cmpR$(v)}</span><br><small>${x.d}</small> ${refs('{sinapi}')}`;
  };
  // uma tabela com todas as opções, ou várias (c.tabelas: { titulo, cols: posições em c.opcoes, linhas })
  const tabelas = c.tabelas || [{ cols: c.opcoes.map((_, i) => i), linhas: c.linhas }];
  const temCusto = tabelas.some(t => t.linhas.some(([k]) => /^Custo de referência/.test(k)));
  const apps = { casa: 'Casa', predio: 'Prédio alto', hospital: 'Hospital', industria: 'Indústria' };
  // uma ficha por material; quando várias opções levam à mesma ficha, o botão usa o nome da ficha
  const repet = m => c.opcoes.filter(o => o[1] === m).length > 1;
  const nomeFicha = (m, n) => repet(m) && typeof CATALOG !== 'undefined' ? (CATALOG.find(x => x.id === 'mat-' + m) || {}).name || n : n;
  const fichas = [...new Map(c.opcoes.map(([n, m]) => [m, nomeFicha(m, n)])).entries()];
  return `${c.intro ? `
      <p class="cp-intro">${refs(c.intro)}</p>` : ''}
      <p class="cp-oneline"><b>Quando usar cada um:</b> ${refs(c.resumo)}</p>${c.tipos ? TIPOS_HTML[c.tipos](h) : ''}
      <${h} class="cp-h">Lado a lado</${h}>${tabelas.map(t => `${t.titulo ? `
      <p class="cp-tabtit">${t.titulo}</p>` : ''}
      <div class="cp-tablewrap"><table class="cp-table">
        <thead><tr><th scope="col">Critério</th>${t.cols.map(i => c.opcoes[i]).map(([n, m]) => `<th scope="col">${n}<a href="/materiais/${m}" data-sheet="mat-${m}">ver ficha</a></th>`).join('')}</tr></thead>
        <tbody>${t.linhas.map(([k, vals]) => `<tr><th scope="row">${k}${/^Custo de referência/.test(k) ? ` <span class="cp-uf">${uf}</span>` : ''}</th>${vals.map(v => `<td>${/^Custo de referência/.test(k) ? custo(v) : refs(v)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`).join('')}
      ${temCusto ? `<p class="cp-note">Custo: só o material, SINAPI ${typeof SINAPI_PRECOS !== 'undefined' ? SINAPI_PRECOS.ref : ''}, ${uf}, sem desoneração. Não inclui conexões, mão de obra, BDI e frete.</p>` : ''}
      <${h} class="cp-h">Prós e contras</${h}>
      <div class="cp-opts">${c.opcoes.map(([n], i) => `<div class="cp-opt"><b>${n}</b><ul class="cp-pro">${c.pros[i][0].map(x => `<li>${refs(x)}</li>`).join('')}</ul><ul class="cp-con">${c.pros[i][1].map(x => `<li>${refs(x)}</li>`).join('')}</ul></div>`).join('')}</div>
      <${h} class="cp-h">Escolha por aplicação</${h}>
      <div class="cp-apps">${Object.entries(c.apps).map(([k, v]) => `<div class="cp-app"><b>${apps[k]}</b>${refs(v)}</div>`).join('')}</div>${c.criterios ? `
      <${h} class="cp-h">Como definir a melhor alternativa?</${h}>
      <ul class="cp-crit">${c.criterios.map(x => `<li>${refs(x)}</li>`).join('')}</ul>` : ''}${c.fecho ? `
      <p class="cp-fecho">${refs(c.fecho)}</p>` : ''}
      <${h} class="cp-h">Erros comuns</${h}>
      <ul class="cp-errs">${c.erros.map(e => `<li>${e}</li>`).join('')}</ul>
      <p class="cp-note"><a href="${o.erros || '/guias-praticos'}">Veja causas e soluções em Erros e patologias →</a></p>
      <${h} class="cp-h">Fontes deste comparativo</${h}>
      <ol class="cp-refs">${ids.map((id, k) => `<li value="${k + 1}" id="cp-${c.id}-ref-${id}"><a href="${CMP_FONTES[id][1]}" target="_blank" rel="noopener noreferrer">${CMP_FONTES[id][0]}</a> <span class="cp-kind cp-kind--${CMP_FONTES[id][2]}">${CMP_KIND[CMP_FONTES[id][2]]}</span></li>`).join('')}</ol>
      <div class="cp-actions">
        ${fichas.map(([m, n]) => `<a class="btn btn--ghost btn--sm" href="/materiais/${m}" data-sheet="mat-${m}">Ficha: ${n}</a>`).join('')}
        <a class="btn btn--sm" href="${o.cotacao || '#contato'}" data-subject="Cotação de materiais" data-question="Cotação (comparativo: ${esc(c.titulo)}): informe material, diâmetros, quantidades e local de entrega ">Solicitar cotação</a>
      </div>`;
}
const cmpR$ = v => 'R$ ' + v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Os 8 tipos de válvula borboleta mais citados, com ilustração esquemática própria (vista de frente).
// [id, nome, o que define (corpo, desenho ou serviço), descrição, acionamento do desenho]
const BORB_TIPOS = [
  ['wafer', 'Wafer', 'Corpo', 'Fica prensada entre dois flanges da linha, presa pelos próprios parafusos dos flanges. Compacta, leve e de menor custo: uso geral.', 'alavanca'],
  ['lug', 'Lug', 'Corpo', 'Orelhas roscadas em volta do corpo recebem os parafusos de cada flange separadamente. Conforme o projeto e a classe, permite desmontar um lado da linha ou usar a válvula em fim de linha.', 'alavanca'],
  ['flangeada', 'Flangeada', 'Corpo', 'Flanges integrados ao corpo (duplo flange). Mais robusta, para diâmetros grandes, pressões maiores e esforços da tubulação.', 'alavanca'],
  ['dupla', 'Dupla excêntrica', 'Desenho', 'Eixo deslocado do centro do disco e do plano de vedação: o disco sai do assento logo no início da abertura. Menos atrito e desgaste; pressões e temperaturas maiores que a concêntrica.', 'redutor'],
  ['tripla', 'Tripla excêntrica', 'Desenho', 'Soma um assento cônico às duas excentricidades: a vedação é metálica e só há contato no fim do fechamento. Vapor, alta temperatura e serviços severos.', 'redutor'],
  ['alto', 'De alto desempenho', 'Desenho', 'Nome comercial das borboletas de alta performance, em geral dupla excêntrica com assento de PTFE ou metálico, para classes de pressão maiores e automação. É comum vir com atuador pneumático.', 'pneumatico'],
  ['resiliente', 'Com assento resiliente', 'Desenho', 'Concêntrica, com revestimento de elastômero (EPDM, NBR) que veda contra o disco. Baixo torque e baixo custo: água, ar-condicionado e saneamento, dentro do limite de temperatura e química do elastômero.', 'alavanca'],
  ['criogenica', 'Criogênica', 'Serviço', 'Castelo estendido que afasta a gaxeta e o acionamento do frio, com materiais qualificados para baixa temperatura: GNL, oxigênio e nitrogênio líquidos.', 'redutor'],
];
// Endereço da ficha de cada tipo no catálogo (/materiais/borboleta-<slug>)
const BORB_SLUG = { wafer: 'wafer', lug: 'lug', flangeada: 'flangeada', dupla: 'dupla-excentrica', tripla: 'tripla-excentrica', alto: 'alto-desempenho', resiliente: 'assento-resiliente', criogenica: 'criogenica' };
function borbSVG(k) {
  return `<svg viewBox="0 0 160 166" role="img" aria-label="Ilustração esquemática: válvula borboleta ${k}">${borbInner(k)}</svg>`;
}
// Desenho de frente (160 × 166); também usado como ilustração das fichas de cada tipo no catálogo (MATERIAL_ART.borb)
function borbInner(k) {
  const acion = (BORB_TIPOS.find(t => t[0] === k) || [])[4];
  const cry = k === 'criogenica', R = cry ? 36 : 42, cy = cry ? 116 : 104, top = cry ? 44 : 54;
  const pol = (r, a) => [80 + r * Math.cos(a), cy + r * Math.sin(a)].map(n => n.toFixed(1));
  let s = '';
  if (k === 'flangeada' || k === 'tripla') {
    s += `<circle class="bv-bd" cx="80" cy="${cy}" r="${R + 13}"/>`;
    for (let i = 0; i < 8; i++) { const [x, y] = pol(R + 6, Math.PI / 8 + i * Math.PI / 4); s += `<circle class="bv-hole" cx="${x}" cy="${y}" r="2.6"/>`; }
  }
  if (k === 'lug') for (let i = 0; i < 8; i++) {
    const [x, y] = pol(R + 3, Math.PI / 8 + i * Math.PI / 4), [hx, hy] = pol(R + 5, Math.PI / 8 + i * Math.PI / 4);
    s += `<circle class="bv-bd" cx="${x}" cy="${y}" r="8"/><circle class="bv-hole" cx="${hx}" cy="${hy}" r="2.6"/>`;
  }
  s += `<rect class="bv-bd" x="72" y="${top}" width="16" height="${cy - R - top + 4}"/>`;
  s += `<circle class="bv-bd" cx="80" cy="${cy}" r="${R}"/><circle class="bv-bore" cx="80" cy="${cy}" r="${R - 10}"/>`;
  if (k === 'resiliente' || k === 'wafer' || k === 'lug' || k === 'flangeada') s += `<circle class="bv-liner${k === 'resiliente' ? ' bv-liner--on' : ''}" cx="80" cy="${cy}" r="${R - 12}"/>`;
  if (k === 'tripla') s += `<circle class="bv-seat" cx="80" cy="${cy}" r="${R - 12}"/>`;
  const off = k === 'dupla' || k === 'tripla' || k === 'alto' ? 5 : 0;
  s += `<ellipse class="bv-disc" cx="${80 + off}" cy="${cy}" rx="11" ry="${R - 15}"/><line class="bv-stem" x1="80" y1="${cy - R + 12}" x2="80" y2="${cy + R - 12}"/>`;
  if (off) s += `<circle class="bv-mark" cx="80" cy="${cy}" r="2.4"/>`;
  s += `<rect class="bv-bd" x="66" y="${top - 6}" width="28" height="7" rx="2"/>`;
  if (acion === 'alavanca') s += `<rect class="bv-act" x="72" y="${top - 16}" width="16" height="11" rx="2"/><rect class="bv-lever" x="76" y="${top - 21}" width="70" height="8" rx="4"/>`;
  if (acion === 'redutor') s += `<rect class="bv-act" x="56" y="${top - 30}" width="48" height="24" rx="4"/><line class="bv-stem" x1="104" y1="${top - 18}" x2="112" y2="${top - 18}"/><circle class="bv-wheel" cx="128" cy="${top - 18}" r="16"/><path class="bv-spoke" d="M112 ${top - 18}h32M128 ${top - 34}v32"/>`;
  if (acion === 'pneumatico') s += `<rect class="bv-act" x="34" y="${top - 34}" width="92" height="28" rx="8"/><path class="bv-spoke" d="M46 ${top - 34}v28M114 ${top - 34}v28"/><rect class="bv-act" x="70" y="${top - 44}" width="20" height="10" rx="2"/>`;
  return s;
}
function borbTiposHTML(h = 'h4') {
  return `
      <${h} class="cp-h">Os 8 tipos mais citados</${h}>
      <p class="bvt__lead">Corpo (wafer, lug, flangeada) e desenho do disco (concêntrico ou excêntrico) são escolhas independentes: uma tripla excêntrica, por exemplo, pode ter corpo lug ou flangeado.</p>
      <ol class="bvt">${BORB_TIPOS.map(([id, nome, def, txt, ac], i) => `
        <li class="bvt__item"><figure>${borbSVG(id)}<figcaption><span class="bvt__n">${i + 1}</span><b>${nome}</b><span class="bvt__def">${def}</span></figcaption></figure><p>${txt}</p><a class="bvt__ficha" href="/materiais/borboleta-${BORB_SLUG[id]}" data-sheet="mat-borboleta-${BORB_SLUG[id]}">Ficha técnica →</a></li>`).join('')}
      </ol>
      <p class="bvt__note">Ilustrações esquemáticas PipeSystem, fora de escala; o acionamento (alavanca, redutor ou atuador) varia em todos os tipos.</p>`;
}
// Os 4 tipos de bomba do comparativo "qual bomba para cada fluido", com desenho esquemático próprio (vista lateral)
// [id, nome, fluido típico, descrição]
const BOMBA_TIPOS = [
  ['centrifuga', 'Centrífuga', 'Água e líquidos limpos', 'O rotor gira e acelera o líquido, que ganha pressão na voluta. Vazão alta e contínua, construção simples e barata: recalque, pressurização, incêndio, irrigação e circulação.'],
  ['engrenagens', 'De engrenagens', 'Óleos e fluidos viscosos', 'Duas engrenagens levam volumes fixos de fluido entre os dentes e a carcaça (deslocamento positivo). A vazão acompanha a rotação e o rendimento melhora com a viscosidade.'],
  ['diafragma', 'De diafragma', 'Químicos corrosivos', 'Duas membranas movidas a ar comprimido alternam sucção e recalque, com válvulas de esfera. O fluido só toca a carcaça e as membranas (PP, PVDF, PTFE, inox); trabalha a seco.'],
  ['peristaltica', 'Peristáltica', 'Polpas e lamas com sólidos', 'Rolos ou sapatas comprimem uma mangueira e empurram o fluido. Sem válvulas nem selos: só a mangueira se desgasta. Boa para abrasivos, sólidos e dosagem.'],
];
function bombaInner(k) {
  // engrenagem de dentes trapezoidais (10 dentes); fase desloca meio dente para a outra engrenar
  const gear = (cx, cy, r, fase = 0) => {
    const n = 10, s = 2 * Math.PI / n, pt = (a, rr) => (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    let d = '';
    for (let i = 0; i < n; i++) { const a = i * s + fase; d += `${i ? 'L' : 'M'}${pt(a, r)}L${pt(a + s * .15, r + 6)}L${pt(a + s * .45, r + 6)}L${pt(a + s * .6, r)}`; }
    return `<path class="pm-gear" d="${d}Z"/><circle class="bv-act" cx="${cx}" cy="${cy}" r="5"/>`;
  };
  const motor = (x, y, w, h) => `<rect class="bv-bd" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>` +
    Array.from({ length: 5 }, (_, i) => `<line class="pm-fin" x1="${x + 10 + i * (w - 20) / 4}" y1="${y + 6}" x2="${x + 10 + i * (w - 20) / 4}" y2="${y + h - 6}"/>`).join('') +
    `<rect class="bv-act" x="${x + w - 2}" y="${y + 6}" width="8" height="${h - 12}" rx="3"/>`;
  const base = '<rect class="bv-act" x="10" y="132" width="180" height="9" rx="2"/>';
  if (k === 'centrifuga') return base +
    '<rect class="bv-bd" x="8" y="74" width="12" height="26" rx="2"/><rect class="bv-bd" x="18" y="79" width="12" height="16"/>' +
    '<circle class="bv-bd" cx="58" cy="87" r="33"/><circle class="bv-bore" cx="58" cy="87" r="13"/>' +
    '<path class="pm-vane" d="M58 87q10-10 22-6M58 87q-2 14 8 22M58 87q-14-2-20 8"/>' +
    '<rect class="bv-bd" x="47" y="40" width="22" height="18"/><rect class="bv-bd" x="41" y="33" width="34" height="8" rx="2"/>' +
    '<rect class="bv-act" x="90" y="78" width="16" height="18"/>' + motor(104, 64, 74, 46) +
    '<rect class="bv-bd" x="42" y="118" width="32" height="14"/><rect class="bv-bd" x="118" y="110" width="44" height="22"/>';
  if (k === 'engrenagens') return base +
    '<rect class="bv-bd" x="34" y="44" width="96" height="84" rx="18"/><rect class="bv-bore" x="44" y="56" width="76" height="60" rx="26"/>' +
    gear(67, 86, 18) + gear(99, 86, 18, Math.PI / 10) +
    '<rect class="bv-bd" x="72" y="22" width="22" height="24"/><rect class="bv-bd" x="66" y="16" width="34" height="8" rx="2"/>' +
    '<rect class="bv-act" x="130" y="82" width="56" height="9" rx="2"/><rect class="bv-bd" x="72" y="126" width="22" height="6"/>' +
    '<path class="pm-arrow" d="M48 70q-6 18 10 36M118 106q8-18-8-38"/>';
  if (k === 'diafragma') {
    const cam = cx => `<circle class="bv-bd" cx="${cx}" cy="86" r="28"/><path class="pm-diaf" d="M${cx + (cx < 100 ? 10 : -10)} 62q${cx < 100 ? 8 : -8} 24 0 48"/>` +
      Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<circle class="bv-hole" cx="${(cx + 23 * Math.cos(a)).toFixed(1)}" cy="${(86 + 23 * Math.sin(a)).toFixed(1)}" r="2"/>`; }).join('');
    return base + cam(64) + cam(136) +
      '<rect class="bv-act" x="88" y="66" width="24" height="40" rx="4"/><rect class="bv-act" x="94" y="58" width="12" height="9"/>' +
      '<path class="pm-pipe" d="M64 58V36H136V58M100 36V22"/><rect class="bv-bd" x="90" y="14" width="20" height="9" rx="2"/>' +
      '<path class="pm-pipe" d="M64 114V124H136V114"/><rect class="bv-bd" x="92" y="120" width="16" height="12" rx="2"/>';
  }
  return base +   // peristáltica
    '<circle class="bv-bd" cx="72" cy="84" r="46"/><circle class="bv-bore" cx="72" cy="84" r="37"/>' +
    '<path class="pm-hose" d="M34 134V88a38 38 0 1 1 76 0V134"/>' +
    '<g transform="rotate(-30 72 84)"><rect class="bv-act" x="40" y="80" width="64" height="8" rx="4"/><circle class="pm-roll" cx="42" cy="84" r="9"/><circle class="pm-roll" cx="102" cy="84" r="9"/></g>' +
    '<circle class="bv-act" cx="72" cy="84" r="6"/>' + motor(122, 64, 62, 42) + '<rect class="bv-bd" x="132" y="106" width="40" height="26"/>';
}
const bombaSVG = k => `<svg viewBox="0 0 200 150" role="img" aria-label="Desenho esquemático: bomba ${k}">${bombaInner(k)}</svg>`;
function bombaTiposHTML(h = 'h4') {
  return `
      <${h} class="cp-h">Os 4 tipos, em desenho</${h}>
      <ol class="bvt bvt--bombas">${BOMBA_TIPOS.map(([id, nome, fluido, txt], i) => `
        <li class="bvt__item"><figure>${bombaSVG(id)}<figcaption><span class="bvt__n">${i + 1}</span><b>${nome}</b><span class="bvt__def">${fluido}</span></figcaption></figure><p>${txt}</p></li>`).join('')}
      </ol>
      <p class="bvt__note">Desenhos esquemáticos PipeSystem, fora de escala.</p>`;
}
const TIPOS_HTML = { borboleta: borbTiposHTML, bombas: bombaTiposHTML };

// Bloco dos tipos na ficha do material (válvulas borboleta e bombas)
function cmpTiposHTML(matId, h = 'h4') {
  const H = t => `<${h}${h === 'h4' ? '' : ' class="page__h"'}>${t}</${h}>`, semH = s => s.replace(/\n\s*<h4 class="cp-h">[^<]*<\/h4>/, '');
  if (matId === 'mat-borboleta') return H('Tipos de válvula borboleta') + semH(borbTiposHTML('h4')) + `<p class="relprod"><a href="/comparativos/valvulas-borboleta">Comparativo completo dos tipos, com normas e fontes</a></p>`;
  if (matId === 'mat-bombas') return H('Qual bomba para cada fluido') + semH(bombaTiposHTML('h4')) + `<p class="relprod"><a href="/comparativos/bombas-fluidos">Comparativo completo, com normas e fontes</a></p>`;
  return '';
}
// Comparativos em que um material aparece (ficha do material)
function cmpLinksHTML(matId, h = 'h4') {
  const slug = matId.replace(/^mat-/, '');
  const cs = CMPS.filter(c => c.opcoes.some(([, m]) => m === slug));
  if (!cs.length) return '';
  return `<${h}${h === 'h4' ? '' : ' class="page__h"'}>Compare com outras opções</${h}>
    <p class="relprod">${cs.map(c => `<a href="/comparativos/${c.id}">${c.titulo}</a>`).join('')}</p>`;
}

// Bloco "Comparativos" no início de Guias práticos (página inicial). Os preços (sinapi-precos.js) chegam sob demanda,
// com as ferramentas de dimensionamento (script.js): o bloco é montado já e refeito quando eles chegam.
typeof document !== 'undefined' && document.addEventListener('DOMContentLoaded', () => {
  const box = document.getElementById('cpList');
  if (!box) return;
  // Lista única em cartões lado a lado; o comparativo escolhido abre logo abaixo dos cartões
  const idx = document.getElementById('cpIndex');
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  idx.innerHTML = CMPS.map(c => `<a href="#cmp-${c.id}" data-q="${norm([c.tema, c.titulo, c.resumo.replace(/\{\w+\}/g, ''), ...c.opcoes.map(o => o[0])].join(' ')).replace(/"/g, '')}"><span>${c.tema}</span><b>${c.titulo}</b><small>${c.opcoes.length} opções lado a lado</small></a>`).join('');
  const cards = [...idx.querySelectorAll('a')];
  const marca = id => cards.forEach(a => a.classList.toggle('is-on', a.getAttribute('href') === '#' + id));
  const abre = id => { box.querySelectorAll('.cp-cmp').forEach(d => { if (d.id === id) corpo(d); d.open = d.id === id; }); marca(id); };
  // busca: todas as palavras digitadas precisam aparecer no cartão
  const busca = document.getElementById('cpBusca'), nBusca = document.getElementById('cpBuscaN'), vazio = document.getElementById('cpVazio');
  busca.addEventListener('input', () => {
    const ws = norm(busca.value).split(/\s+/).filter(Boolean);
    let n = 0;
    cards.forEach(a => { const ok = ws.every(w => a.dataset.q.includes(w)); a.hidden = !ok; n += ok; });
    nBusca.textContent = ws.length ? `${n} de ${cards.length}` : '';
    vazio.hidden = n > 0;
  });
  busca.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const first = cards.find(a => !a.hidden); if (first) { e.preventDefault(); first.click(); }
  });
  // Só o título de cada comparativo entra na página; o conteúdo (tabelas, fontes...) é montado ao abrir,
  // o que tira cerca de 2.000 elementos da carga inicial.
  box.innerHTML = CMPS.map(c => `
    <details class="cp-cmp" id="cmp-${c.id}">
      <summary><span class="cp-tag">${c.tema}</span><h3>${c.titulo}</h3><span class="gpguide__chev" aria-hidden="true">▾</span></summary>
      <div class="cp-body"></div>
    </details>`).join('');
  const byId = Object.fromEntries(CMPS.map(c => [c.id, c]));
  const corpo = (d, refaz = false) => {
    const b = d.querySelector('.cp-body'); if (b.childElementCount && !refaz) return;
    // custos de referência no estado já escolhido na lista de materiais (padrão SC)
    let uf = 'SC';
    try { const s = localStorage.getItem('lmUf'); if (s && SINAPI_PRECOS.ufs.includes(s)) uf = s; } catch {}
    const c = byId[d.id.slice(4)];
    b.innerHTML = `${comparativoHTML(c, { uf, erros: '#gp-pats' })}
        <p class="cp-note"><a href="/comparativos/${c.id}">Página própria deste comparativo →</a></p>`;
    if (typeof glossarize === 'function') b.querySelectorAll('.cp-oneline, .cp-opts, .cp-apps, .cp-errs').forEach(el => glossarize(el, { max: 4 }));
  };
  box.addEventListener('toggle', e => { if (e.target.open) corpo(e.target); }, true);
  // os preços SINAPI chegam com as ferramentas de dimensionamento: refaz os comparativos já montados
  document.addEventListener('ferramentas-prontas', () => box.querySelectorAll('.cp-cmp').forEach(d => { if (d.querySelector('.cp-body').childElementCount) corpo(d, true); }));
  // cartões e submenu: abre o comparativo (e fecha o anterior) antes de o roteador rolar até ele
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#cmp-"]'); if (!a) return;
    const id = a.getAttribute('href').slice(1); if (document.getElementById(id)) abre(id);
  }, true);
  // fechar pelo título do comparativo aberto: volta aos cartões
  box.addEventListener('click', e => {
    const s = e.target.closest('.cp-cmp > summary'); if (!s) return;
    e.preventDefault(); s.parentElement.open = false; marca('');
    idx.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  if (location.hash.startsWith('#cmp-') && document.getElementById(location.hash.slice(1))) abre(location.hash.slice(1));
});
