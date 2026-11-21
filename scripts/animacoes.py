# Desenhos animados (SVG + SMIL) dos "Erros e patologias" de Guias práticos.
# Uso, na pasta do projeto:  python -I scripts/animacoes.py
# Grava o bloco PATS_FIG dentro de site/guias.js (entre os marcadores "// <PATS_FIG>" e "// </PATS_FIG>").
# As animações são SMIL, de propósito: continuam rodando com "reduzir movimento" (pedido do cliente).
import json, re

AZUL, VERM, VERDE, CINZA, TXT, AGUA, ESGOTO = '#1f6fb2', '#c0392b', '#12745f', '#8a97a8', '#3d4a58', '#7fbde9', '#8b6b3e'


class Anim:
    """Desenho com N fases de mesma duração; cada elemento pode aparecer só em algumas fases."""
    def __init__(self, n, dur, w=320, h=250, dy=0):
        # dy: desloca o desenho para baixo, abrindo espaço para a legenda do topo
        self.n, self.dur, self.w, self.h, self.dy, self.partes, self.ini = n, dur, w, h + dy, dy, [], 0

    def kt(self):
        return ';'.join(f'{i / self.n:.4f}' for i in range(self.n)) + ';1'

    def g(self, fases, corpo):
        v = ['1' if i in fases else '0' for i in range(self.n)]
        return (f'<g opacity="{v[0]}"><animate attributeName="opacity" values="{";".join(v + [v[-1]])}" keyTimes="{self.kt()}" '
                f'dur="{self.dur}s" repeatCount="indefinite" calcMode="discrete"/>{corpo}</g>')

    def add(self, *s):
        self.partes.extend(s)

    def fase(self, i, extra=0):   # instantes de início da fase i (+ extra s), repetidos a cada ciclo
        return ';'.join(f'{i * self.dur / self.n + extra + k * self.dur:g}s' for k in range(40))

    def legenda(self, textos, cores=None):
        for i, linhas in enumerate(textos):
            cor = (cores or [AZUL] * self.n)[i]
            corpo = t(4, 18, linhas[0], 15, cor, '700') + ''.join(t(4, 38 + 18 * k, l, 13) for k, l in enumerate(linhas[1:]))
            self.add(self.g({i}, corpo))
        self.ini = len(self.partes)

    def svg(self, aria):
        corpo = ''.join(self.partes[:self.ini]) + (f'<g transform="translate(0 {self.dy})">' + ''.join(self.partes[self.ini:]) + '</g>' if self.dy else ''.join(self.partes[self.ini:]))
        return f'<svg viewBox="0 0 {self.w} {self.h}" role="img" font-family="inherit" aria-label="{aria}">' + corpo + '</svg>'


def t(x, y, s, size=13, cor=TXT, peso='400', anchor='start'):
    return f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{peso}" fill="{cor}" text-anchor="{anchor}">{s}</text>'


# ---------- 1. Mau cheiro no banheiro: fecho hídrico ----------
def mau_cheiro():
    a = Anim(3, 15)
    a.legenda([['Com fecho hídrico', 'A água parada na caixa sifonada', 'bloqueia os gases do esgoto.'],
               ['Ralo seco ou sifão aspirado', 'A água baixa, abre passagem e o gás', 'do esgoto sobe para o banheiro.'],
               ['Solução', 'Água no ralo pouco usado e coluna de', 'ventilação ligada ao ramal.']], [VERDE, VERM, VERDE])
    a.add('<path d="M10 112 H300" stroke="#b9c4d1" stroke-width="6"/>', t(16, 104, 'piso', 11, CINZA),
          '<rect x="128" y="106" width="44" height="6" fill="#5b6b80"/>', t(150, 100, 'ralo', 11, CINZA, '600', 'middle'),
          # caixa sifonada: corpo, parede interna (o fecho fica embaixo dela) e saída para o esgoto
          '<path d="M118 115 V200 H200 V150 M200 170 H300 M200 150 H300" fill="none" stroke="#5b6b80" stroke-width="3"/>',
          t(258, 192, 'para o esgoto', 11, CINZA, '400', 'middle'))
    agua_cheia = '<rect x="120" y="150" width="78" height="48" fill="' + AGUA + '"/>'
    agua_baixa = '<rect x="120" y="180" width="78" height="18" fill="' + AGUA + '"/>'
    parede = '<path d="M158 115 V172" stroke="#5b6b80" stroke-width="3"/>'
    a.add(a.g({0, 2}, agua_cheia), a.g({1}, agua_baixa), parede)
    # gases do esgoto: bolhas que vêm pela saída
    bolhas_param = ''.join(f'<circle r="3.5" fill="#9aa64a" opacity=".8"><animateMotion path="M300 160 H210 V152" dur="2.4s" begin="-{k * .8:.1f}s" repeatCount="indefinite"/></circle>' for k in range(3))
    bolhas_sobe = ''.join(f'<circle r="3.5" fill="#9aa64a" opacity=".8"><animateMotion path="M300 160 H210 V176 H140 V90" dur="3s" begin="-{k:.1f}s" repeatCount="indefinite"/></circle>' for k in range(3))
    cheiro = ''.join(f'<path d="M{x} 96 q6 -10 0 -20 q-6 -10 0 -20" fill="none" stroke="#9aa64a" stroke-width="2.5" stroke-linecap="round"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="{d}s" repeatCount="indefinite"/></path>' for x, d in [(138, 0), (150, .6), (162, 1.2)])
    a.add(a.g({0, 2}, bolhas_param + t(176, 142, 'gás barrado', 11, VERDE, '700')), a.g({1}, bolhas_sobe + cheiro + t(176, 90, 'cheiro de esgoto', 11, VERM, '700')))
    # ventilação (fase 3)
    a.add(a.g({2}, '<path d="M280 150 V60" stroke="' + VERDE + '" stroke-width="5"/><path d="M272 70 L280 58 L288 70" fill="none" stroke="' + VERDE + '" stroke-width="2.5"/>' + t(272, 100, 'ventilação', 11, VERDE, '700', 'end')))
    a.add(a.g({0, 1}, t(4, 236, 'Fecho hídrico: no mínimo 5 cm de água (NBR 8160)', 11, CINZA)))
    return a.svg('Desenho animado: na caixa sifonada, a água parada forma o fecho hídrico e barra os gases do esgoto. Quando o ralo seca ou o sifão é aspirado, a água baixa e o gás sobe para o banheiro. A solução é repor a água e ter coluna de ventilação.')


# ---------- 2. Entupimento frequente: caimento e "barriga" ----------
def entupimento():
    a = Anim(2, 12)
    a.legenda([['Caimento contínuo', 'Com declividade constante, a água', 'arrasta os resíduos até o coletor.'],
               ['Tubo com "barriga"', 'No ponto baixo a água para, a velocidade', 'cai e os resíduos se acumulam.']], [VERDE, VERM])
    reto, barriga = 'M24 92 L296 150', 'M24 92 Q150 210 296 150'
    for fases, d in (({0}, reto), ({1}, barriga)):
        a.add(a.g(fases, f'<path d="{d}" fill="none" stroke="#c9d3df" stroke-width="22" stroke-linecap="round"/><path d="{d}" fill="none" stroke="{AGUA}" stroke-width="8" stroke-linecap="round" opacity=".8"/>'))
    solidos = ''.join(f'<circle r="5" fill="{ESGOTO}"><animateMotion path="{reto}" dur="3s" begin="-{k * .75:.2f}s" repeatCount="indefinite"/></circle>' for k in range(4))
    a.add(a.g({0}, solidos + t(160, 200, '2% em ramais até 75 mm · 1% a partir de 100 mm', 11, VERDE, '700', 'middle')))
    # na barriga: os resíduos descem até o ponto baixo e ficam; a pilha cresce durante a fase
    pilha = ''
    for k, (x, y) in enumerate([(150, 150), (140, 149), (160, 149), (130, 146), (170, 146), (145, 142), (156, 142)]):
        pilha += (f'<circle cx="{x}" cy="{y}" r="5.5" fill="{ESGOTO}" opacity="0"><animate attributeName="opacity" values="0;1" dur=".4s" begin="{a.fase(1, k * .7)}" fill="freeze"/></circle>')
    chegando = ''.join(f'<circle r="5" fill="{ESGOTO}"><animateMotion path="M24 92 Q90 150 140 148" dur="2s" begin="-{k * .7:.1f}s" repeatCount="indefinite"/></circle>' for k in range(3))
    a.add(a.g({1}, pilha + chegando + t(150, 200, 'resíduos parados no ponto baixo', 11, VERM, '700', 'middle')))
    a.add(t(4, 236, 'Também ajuda: curvas longas e caixa de gordura na cozinha.', 11, CINZA))
    return a.svg('Desenho animado: num tubo de esgoto com caimento contínuo os resíduos correm até o fim; num tubo com barriga, eles param e se acumulam no ponto baixo, causando entupimento.')


# ---------- 3. Tubo de água fria "suando" ----------
def suando():
    a = Anim(2, 12)
    a.legenda([['Tubo frio sem isolamento', 'A superfície fica abaixo do ponto de', 'orvalho: o vapor do ar condensa e pinga.'],
               ['Com isolamento térmico', 'A face externa fica mais quente e não', 'há condensação. Vede bem as emendas.']], [VERM, VERDE])
    a.add('<rect x="0" y="66" width="320" height="10" fill="#d4dde8"/>', t(316, 62, 'laje', 11, CINZA, '400', 'end'),
          '<rect x="0" y="196" width="320" height="8" fill="#e8edf3"/>', t(316, 218, 'forro', 11, CINZA, '400', 'end'),
          t(8, 96, 'ar quente e úmido', 11, '#b5651d', '600'))
    a.add(a.g({0}, '<rect x="20" y="118" width="280" height="18" rx="9" fill="#5aa6dc"/>' + t(160, 112, 'água fria a 15 °C', 11, AZUL, '700', 'middle')))
    gotas = ''
    for k, x in enumerate([60, 110, 160, 210, 260]):
        d = k * .55
        gotas += (f'<circle cx="{x}" cy="139" r="0" fill="{AGUA}"><animate attributeName="r" values="0;3.5;3.5;0" keyTimes="0;.5;.55;1" dur="2.6s" begin="{d}s" repeatCount="indefinite"/>'
                  f'<animate attributeName="cy" values="139;139;194;194" keyTimes="0;.55;.95;1" dur="2.6s" begin="{d}s" repeatCount="indefinite"/></circle>')
    mancha = '<ellipse cx="160" cy="200" rx="0" ry="4" fill="#9c8a6a" opacity=".55"><animate attributeName="rx" values="10;110" dur="6s" begin="' + a.fase(0) + '" fill="freeze"/></ellipse>'
    a.add(a.g({0}, gotas + mancha + t(160, 236, 'mancha e mofo no forro', 11, VERM, '700', 'middle')))
    a.add(a.g({1}, '<rect x="20" y="110" width="280" height="34" rx="17" fill="#cfd6de" stroke="#9aa5b1"/><rect x="20" y="118" width="280" height="18" rx="9" fill="#5aa6dc"/>'
                   + ''.join(f'<path d="M{x} 110 l6 34" stroke="#9aa5b1" stroke-width="1"/>' for x in range(30, 300, 14))
                   + t(160, 104, 'isolamento térmico', 11, VERDE, '700', 'middle') + t(160, 236, 'forro seco', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado: um tubo de água fria sem isolamento passa por ar quente e úmido; gotas se formam por baixo dele e pingam no forro, que mancha. Com isolamento térmico não há condensação.')


# ---------- 4. Pouca pressão no chuveiro ----------
def pouca_pressao():
    a = Anim(2, 12, dy=24)
    a.legenda([['Caixa baixa e tubo fino', 'O desnível é pequeno e a perda de carga', 'no tubo consome quase toda a pressão.'],
               ['Tubo mais grosso (ou caixa mais alta)', 'A perda cai e sobra pressão no chuveiro.', 'Mínimo de referência: 1 mca no ponto.']], [VERM, VERDE])
    cano = 'M70 112 V150 H210 V182'
    a.add('<rect x="20" y="70" width="80" height="44" rx="4" fill="#e8f2fb" stroke="' + AZUL + '" stroke-width="2"/><rect x="22" y="82" width="76" height="30" fill="' + AGUA + '"/>',
          t(60, 64, "caixa d'água", 11, TXT, '600', 'middle'), '<path d="M190 182 H230 L224 190 H196 Z" fill="#5b6b80"/>')
    a.add(a.g({0}, f'<path d="{cano}" fill="none" stroke="#e8955a" stroke-width="6" stroke-linejoin="round"/>' + t(140, 142, 'tubo fino', 11, VERM, '700', 'middle')
          + ''.join(f'<circle r="2.2" fill="#fff"><animateMotion path="{cano}" dur="1.3s" begin="-{k * .33:.2f}s" repeatCount="indefinite"/></circle>' for k in range(4))
          + ''.join(f'<circle cx="{x}" cy="194" r="2" fill="{AGUA}"><animate attributeName="cy" values="192;206" dur=".9s" begin="{d}s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur=".9s" begin="{d}s" repeatCount="indefinite"/></circle>' for x, d in [(205, 0), (212, .45)])))
    a.add(a.g({1}, f'<path d="{cano}" fill="none" stroke="#3aa59a" stroke-width="11" stroke-linejoin="round"/>' + t(140, 140, 'tubo mais grosso', 11, VERDE, '700', 'middle')
          + ''.join(f'<circle r="3" fill="#fff"><animateMotion path="{cano}" dur="2.2s" begin="-{k * .55:.2f}s" repeatCount="indefinite"/></circle>' for k in range(4))
          + ''.join(f'<path d="M{x} 192 L{x + dx} 226" stroke="{AGUA}" stroke-width="2.2" stroke-dasharray="5 5"><animate attributeName="stroke-dashoffset" values="10;0" dur=".35s" repeatCount="indefinite"/></path>' for x, dx in [(200, -10), (206, -3), (212, 3), (218, 10)])))
    # medidor de pressão no chuveiro
    a.add('<rect x="262" y="90" width="26" height="120" rx="3" fill="#eef2f6" stroke="#c9d3df"/>', '<path d="M256 186 H294" stroke="' + VERM + '" stroke-width="2" stroke-dasharray="4 3"/>',
          t(275, 84, 'pressão', 11, TXT, '600', 'middle'), t(255, 190, 'mín.', 10, VERM, '700', 'end'))
    a.add(a.g({0}, f'<rect x="265" y="196" width="20" height="12" fill="{VERM}"/>' + t(275, 228, '0,6 mca', 11, VERM, '700', 'middle')))
    a.add(a.g({1}, f'<rect x="265" y="112" width="20" height="96" fill="{VERDE}"/>' + t(275, 228, '2,6 mca', 11, VERDE, '700', 'middle')))
    a.add(t(4, 246, 'Conta completa no guia de dimensionamento pela NBR 5626.', 11, CINZA))
    return a.svg('Desenho animado: com a caixa pouco acima do chuveiro e tubo fino, a perda de carga consome a pressão e o chuveiro só pinga (0,6 mca). Com tubo mais grosso a perda cai e o chuveiro sai forte (2,6 mca).')


# ---------- 5. Descarga que não para de correr ----------
def descarga():
    a = Anim(3, 15, h=262, dy=34)
    a.legenda([['Funcionando', 'A água sobe, a boia sobe junto e fecha', 'a entrada abaixo do tubo ladrão.'],
               ['Boia desregulada', 'O nível passa do ladrão: a água escoa', 'para o vaso sem parar e a entrada não fecha.'],
               ['Solução', 'Regule a boia para fechar uns 2 cm abaixo', 'do ladrão; se ainda escorre, troque o reparo.']], [VERDE, VERM, VERDE])
    # caixa acoplada em corte
    a.add('<rect x="70" y="64" width="180" height="150" rx="6" fill="#f4f7fa" stroke="#5b6b80" stroke-width="3"/>',
          '<path d="M100 56 V80" stroke="#5b6b80" stroke-width="6"/>', t(100, 52, 'entrada', 11, CINZA, '600', 'middle'),
          '<rect x="196" y="96" width="12" height="118" fill="#dfe5ec" stroke="#5b6b80" stroke-width="2"/>', t(216, 92, 'ladrão', 11, CINZA, '600'),
          '<path d="M202 214 V238" stroke="#5b6b80" stroke-width="5"/>', t(214, 236, 'para o vaso', 11, CINZA))
    fase = a.fase
    # fase 1: enche até 120 e fecha
    a.add(a.g({0}, f'<rect x="73" y="120" width="174" height="91" fill="{AGUA}"><animate attributeName="y" values="200;120" dur="3.5s" begin="{fase(0)}" fill="freeze"/><animate attributeName="height" values="11;91" dur="3.5s" begin="{fase(0)}" fill="freeze"/></rect>'
                   + f'<path d="M100 80 V200" stroke="{AGUA}" stroke-width="4" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" values="11;0" dur=".4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" keyTimes="0;.9;1" dur="3.5s" begin="{fase(0)}" fill="freeze"/></path>'
                   + f'<g><animateTransform attributeName="transform" type="translate" values="0 80;0 0" dur="3.5s" begin="{fase(0)}" fill="freeze"/><path d="M106 84 L150 112" stroke="#5b6b80" stroke-width="3"/><ellipse cx="160" cy="114" rx="16" ry="9" fill="#f0b429"/></g>'
                   + t(140, 150, 'entrada fechada', 11, VERDE, '700', 'middle')))
    # fase 2: nível acima do ladrão, água descendo pelo ladrão sem parar
    a.add(a.g({1}, f'<rect x="73" y="94" width="174" height="117" fill="{AGUA}"/>'
                   + f'<path d="M100 80 V200" stroke="{AGUA}" stroke-width="4" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" values="11;0" dur=".4s" repeatCount="indefinite"/></path>'
                   + '<path d="M106 84 L150 90" stroke="#5b6b80" stroke-width="3"/><ellipse cx="160" cy="90" rx="16" ry="9" fill="#f0b429"/>'
                   + f'<path d="M202 98 V236" stroke="#2f7fc1" stroke-width="5" stroke-dasharray="7 6"><animate attributeName="stroke-dashoffset" values="13;0" dur=".35s" repeatCount="indefinite"/></path>'
                   + t(132, 250, 'água vai embora pelo ladrão', 11, VERM, '700', 'middle')))
    # fase 3: regulada, nível 2 cm abaixo do ladrão
    a.add(a.g({2}, f'<rect x="73" y="112" width="174" height="99" fill="{AGUA}"/>' + '<path d="M106 84 L150 108" stroke="#5b6b80" stroke-width="3"/><ellipse cx="160" cy="110" rx="16" ry="9" fill="#f0b429"/>'
                   + '<path d="M212 96 V112" stroke="' + VERDE + '" stroke-width="1.5"/>' + t(216, 110, '2 cm', 10, VERDE, '700') + t(140, 160, 'nível certo, entrada fechada', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado da caixa de descarga em corte: funcionando, a água sobe, a boia sobe e fecha a entrada abaixo do tubo ladrão. Com a boia desregulada, o nível passa do ladrão e a água escoa para o vaso sem parar. A solução é regular a boia ou trocar o reparo.')


def gotas_caindo(pontos, y0, y1, cor=AGUA, dur=1.6):
    return ''.join(f'<circle cx="{x}" cy="{y0}" r="3" fill="{cor}"><animate attributeName="cy" values="{y0};{y1}" dur="{dur}s" begin="{d}s" repeatCount="indefinite"/>'
                   f'<animate attributeName="opacity" values="1;1;0" keyTimes="0;.8;1" dur="{dur}s" begin="{d}s" repeatCount="indefinite"/></circle>' for x, d in pontos)


# ---------- 6. Retorno de espuma nos andares baixos ----------
def espuma():
    a = Anim(2, 12)
    a.legenda([['Espuma na base do tubo de queda', 'O detergente vira espuma na curva de baixo,', 'pressiona os ramais e volta pelos ralos.'],
               ['Desvio e ventilação', 'Ramais de baixo ligados fora da zona de', 'espuma e ventilação na base (NBR 8160).']], [VERM, VERDE])
    for y, nome in ((112, '3º andar'), (152, '2º andar'), (192, 'térreo')):
        a.add(f'<path d="M20 {y + 6} H140" stroke="#d4dde8" stroke-width="3"/>', t(20, y - 2, nome, 10, CINZA),
              f'<rect x="52" y="{y + 2}" width="16" height="4" fill="#5b6b80"/>')
    a.add('<path d="M150 90 V218 Q150 232 166 232 H304" fill="none" stroke="#c9d3df" stroke-width="12" stroke-linecap="round"/>',
          t(158, 100, 'tubo de queda', 10, CINZA), t(300, 248, 'coletor', 10, CINZA, '400', 'end'))
    for y in (118, 158):
        a.add(f'<path d="M60 {y} H144" stroke="#c9d3df" stroke-width="6"/>')
    cai = ''.join(f'<circle r="4" fill="#fff" stroke="#9aa5b1"><animateMotion path="M150 92 V214" dur="1.6s" begin="-{k * .4:.1f}s" repeatCount="indefinite"/></circle>' for k in range(4))
    a.add(cai)
    pilha = ''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="#fff" stroke="#9aa5b1"/>' for x, y in [(150, 224), (162, 226), (176, 228), (140, 216), (152, 210), (190, 228), (204, 228)])
    volta = ''.join(f'<circle r="4" fill="#fff" stroke="#9aa5b1"><animateMotion path="M144 198 H60 V176" dur="2s" begin="-{k * .5:.1f}s" repeatCount="indefinite"/></circle>' for k in range(4))
    a.add(a.g({0}, f'<path d="M60 198 H144" stroke="#c9d3df" stroke-width="6"/>' + pilha + volta + t(76, 172, 'espuma no ralo', 11, VERM, '700')))
    a.add(a.g({1}, '<path d="M60 198 V214 H250 V226" fill="none" stroke="#c9d3df" stroke-width="6"/>' + ''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="#fff" stroke="#9aa5b1"/>' for x, y in [(150, 224), (162, 226), (140, 216)])
              + '<path d="M196 226 V150" stroke="' + VERDE + '" stroke-width="5"/><path d="M190 158 L196 146 L202 158" fill="none" stroke="' + VERDE + '" stroke-width="2"/>'
              + t(204, 160, 'ventilação', 10, VERDE, '700') + t(150, 248, 'desvio do térreo', 10, VERDE, '700', 'end')))
    return a.svg('Desenho animado: a espuma de detergente desce pelo tubo de queda, se acumula na curva da base e volta pelos ralos do térreo. Com o ramal do térreo desviado para o coletor e ventilação na base, a espuma não volta.')


# ---------- 7. Vazamento em junta soldada ----------
def junta_soldada():
    a = Anim(2, 14)
    a.legenda([['Junta mal feita', 'Sem lixa e limpeza, adesivo vencido ou tubo', 'girado depois do encaixe: a junta pinga.'],
               ['Junta bem feita', 'Siga a sequência e espere a cura antes', 'do teste de estanqueidade.']], [VERM, VERDE])
    a.add('<rect x="150" y="116" width="100" height="44" rx="4" fill="#d4dde8" stroke="#8a97a8"/>', t(200, 178, 'conexão', 10, CINZA, '400', 'middle'),
          '<rect x="250" y="122" width="60" height="32" fill="#f2f2ee" stroke="#8a97a8"/>')
    tubo = '<rect x="20" y="122" width="170" height="32" fill="#f2f2ee" stroke="#8a97a8"/>'
    a.add(a.g({0}, tubo + gotas_caindo([(150, 0), (150, .8)], 162, 214) + t(150, 232, 'gotejamento na junta', 11, VERM, '700', 'middle')))
    passos = ['1. lixe a ponta e a bolsa', '2. limpe com solução limpadora', '3. adesivo nas duas partes', '4. encaixe sem girar', '5. espere a cura']
    corpo = (f'<g>{tubo}<animateTransform attributeName="transform" type="translate" values="-60 0;-60 0;0 0" keyTimes="0;.55;.7" dur="7s" begin="{a.fase(1)}" fill="freeze"/></g>')
    for k, p in enumerate(passos):
        corpo += (f'<g opacity="0"><animate attributeName="opacity" values="0;1" dur=".3s" begin="{a.fase(1, .3 + k * 1.1)}" fill="freeze"/>'
                  + t(20, 186 + 14 * k, p, 12, VERDE, '700') + '</g>')
    a.add(a.g({1}, corpo))
    return a.svg('Desenho animado: uma junta soldada de PVC mal feita goteja. A junta bem feita segue a sequência: lixar, limpar, aplicar adesivo nas duas partes, encaixar sem girar e esperar a cura.')


# ---------- 8. PVC marrom na água quente ----------
def pvc_quente():
    a = Anim(2, 12)
    a.legenda([['PVC de água fria na água quente', 'O PVC marrom amolece com o calor, deforma', 'e pode romper na saída do aquecedor.'],
               ['Material para água quente', 'CPVC, PPR, PEX ou cobre, dentro da', 'temperatura e da pressão de cada um.']], [VERM, VERDE])
    a.add('<rect x="14" y="100" width="70" height="110" rx="8" fill="#f6e3df" stroke="' + VERM + '" stroke-width="2"/>', t(49, 94, 'aquecedor', 11, VERM, '700', 'middle'), t(46, 160, '70 °C', 13, VERM, '700', 'middle'))
    reto, torto = 'M84 140 C 150 140 230 140 300 140', 'M84 140 C 140 190 220 100 300 150'
    a.add(a.g({0}, f'<path d="{reto}" fill="none" stroke="#9c5a2e" stroke-width="14"><animate attributeName="d" values="{reto};{torto}" dur="5s" begin="{a.fase(0)}" fill="freeze"/></path>'
                   + t(190, 120, 'PVC marrom (água fria)', 11, '#9c5a2e', '700', 'middle') + gotas_caindo([(196, 2), (200, 2.8)], 152, 214) + t(190, 232, 'deformação e vazamento', 11, VERM, '700', 'middle')))
    a.add(a.g({1}, f'<path d="{reto}" fill="none" stroke="#e3c97a" stroke-width="14"/>' + t(190, 120, 'CPVC, PPR, PEX ou cobre', 11, VERDE, '700', 'middle')
                   + ''.join(f'<circle r="3" fill="{VERM}" opacity=".7"><animateMotion path="{reto}" dur="2s" begin="-{k * .5}s" repeatCount="indefinite"/></circle>' for k in range(4))
                   + t(190, 232, 'tubo firme na água quente', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado: um tubo de PVC marrom, próprio para água fria, ligado à saída de um aquecedor a 70 °C amolece, entorta e vaza. Com CPVC, PPR, PEX ou cobre, o tubo fica firme.')


# ---------- 9. Barulho e pancada ao fechar a torneira ----------
def pancada():
    a = Anim(2, 12)
    a.legenda([['Fechamento rápido, pressão alta', 'A água para de repente, a pressão dá um', 'pico e o tubo mal fixado bate na parede.'],
               ['Pressão e velocidade controladas', 'Válvula redutora, velocidade até 3 m/s,', 'tubos bem fixados e, se preciso, amortecedor.']], [VERM, VERDE])
    a.add('<rect x="0" y="176" width="320" height="8" fill="#e8edf3"/>', t(316, 198, 'parede', 10, CINZA, '400', 'end'))
    cano = '<path d="M14 140 H270" stroke="#9aa5b1" stroke-width="12"/><path d="M270 132 V152 M262 132 H278" stroke="#5b6b80" stroke-width="5"/>'
    a.add(a.g({0}, f'<g>{cano}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;0 -5;0 5;0 -4;0 3;0 0" keyTimes="0;.45;.5;.56;.62;.7;1" dur="3s" repeatCount="indefinite"/></g>'
                   + '<rect x="40" y="132" width="40" height="16" fill="' + VERM + '" opacity=".55"><animate attributeName="x" values="260;14" dur="3s" repeatCount="indefinite"/></rect>'
                   + t(160, 116, 'PÁ!', 18, VERM, '700', 'middle') + t(160, 220, 'golpe de aríete', 11, VERM, '700', 'middle')))
    a.add(a.g({1}, cano + '<path d="M60 132 L80 148 M60 148 L80 132" stroke="' + VERDE + '" stroke-width="3"/>' + t(70, 124, 'redutora', 10, VERDE, '700', 'middle')
                   + ''.join(f'<path d="M{x} 146 V176" stroke="#5b6b80" stroke-width="3"/>' for x in (120, 180, 240))
                   + '<rect x="214" y="104" width="12" height="30" rx="5" fill="#cfd6de" stroke="#5b6b80"/>' + t(220, 98, 'amortecedor', 10, VERDE, '700', 'middle')
                   + t(150, 168, 'fixações', 10, VERDE, '700', 'middle') + t(160, 220, 'fechamento silencioso', 11, VERDE, '700', 'middle')))
    a.add(t(4, 246, 'Animação completa no guia "Golpe de aríete".', 11, CINZA))
    return a.svg('Desenho animado: ao fechar a torneira de repente, uma onda de pressão volta pelo tubo e o tubo mal fixado bate na parede. Com válvula redutora, fixações e amortecedor, o fechamento fica silencioso.')


# ---------- 10. Corrosão galvânica cobre x aço galvanizado ----------
def galvanica():
    a = Anim(2, 12)
    a.legenda([['Cobre direto no aço galvanizado', 'Com a água como eletrólito, forma-se uma', 'pilha: o zinco e o aço se dissolvem.'],
               ['Transição isolante', 'Conexão de bronze ou latão, ou luva', 'dielétrica entre os dois metais.']], [VERM, VERDE])
    a.add('<rect x="20" y="124" width="140" height="32" fill="#9aa3ab"/>', t(90, 116, 'aço galvanizado', 11, TXT, '700', 'middle'),
          t(240, 116, 'cobre', 11, '#b5651d', '700', 'middle'))
    a.add(a.g({0}, '<rect x="160" y="124" width="140" height="32" fill="#c87533"/>'
                   + ''.join(f'<text font-size="11" font-weight="700" fill="#fff"><animateMotion path="M60 144 H240" dur="2.4s" begin="-{k * .6}s" repeatCount="indefinite"/>e−</text>' for k in range(4))
                   + ''.join(f'<circle cx="{x}" cy="{y}" r="0" fill="#8a4b1c"><animate attributeName="r" values="0;{r}" dur="4s" begin="{a.fase(0, d)}" fill="freeze"/></circle>' for x, y, r, d in [(150, 128, 5, 0), (140, 154, 6, 1), (154, 150, 4, 2), (130, 126, 4, 2.5)])
                   + t(150, 190, 'ferrugem junto à emenda', 11, VERM, '700', 'middle')))
    a.add(a.g({1}, '<rect x="160" y="124" width="22" height="32" fill="#e0b84c"/><rect x="182" y="124" width="118" height="32" fill="#c87533"/>'
                   + t(171, 190, 'bronze, latão ou luva dielétrica', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado: cobre emendado direto no aço galvanizado forma uma pilha com a água; os elétrons passam do aço para o cobre e o aço enferruja junto à emenda. Com uma transição de bronze, latão ou luva dielétrica, a corrosão não acontece.')


# ---------- 11. PPR ou CPVC serpenteando ----------
def serpenteando():
    a = Anim(2, 12)
    a.legenda([['Trecho longo preso nas duas pontas', 'Na água quente o tubo dilata e, sem', 'espaço para crescer, entorta.'],
               ['Lira de dilatação', 'A lira absorve o movimento: pontos fixos', 'e deslizantes conforme o fabricante.']], [VERM, VERDE])
    fixos = '<rect x="16" y="128" width="12" height="44" fill="#3d4a58"/><rect x="292" y="128" width="12" height="44" fill="#3d4a58"/>' + t(22, 190, 'fixo', 10, CINZA, '400', 'middle') + t(298, 190, 'fixo', 10, CINZA, '400', 'middle')
    a.add(fixos)
    reto, cobra = 'M28 150 C 100 150 220 150 292 150', 'M28 150 C 100 110 220 190 292 150'
    a.add(a.g({0}, f'<path d="{reto}" fill="none" stroke="#3a9d5d" stroke-width="10"><animate attributeName="d" values="{reto};{cobra};{cobra};{reto}" keyTimes="0;.4;.8;1" dur="6s" repeatCount="indefinite"/></path>'
                   + t(160, 226, 'água quente: o tubo entorta', 11, VERM, '700', 'middle')))
    lira = 'M28 150 H130 V200 H190 V150 H292'
    a.add(a.g({1}, f'<path d="{lira}" fill="none" stroke="#3a9d5d" stroke-width="10" stroke-linejoin="round"><animate attributeName="d" values="{lira};M28 150 H126 V204 H194 V150 H292;{lira}" dur="6s" repeatCount="indefinite"/></path>'
                   + t(160, 226, 'a lira absorve a dilatação', 11, VERDE, '700', 'middle') + ''.join(f'<path d="M{x} 160 V172" stroke="#5b6b80" stroke-width="3"/>' for x in (70, 250)) + t(70, 186, 'deslizante', 9, CINZA, '400', 'middle')))
    return a.svg('Desenho animado: um tubo de PPR preso nas duas pontas dilata na água quente e entorta como uma cobra. Com uma lira de dilatação no meio, o movimento é absorvido e o tubo fica reto.')


# ---------- 12. Água contaminada na caixa d'água ----------
def contaminada():
    a = Anim(2, 12)
    a.legenda([['Tampa solta e extravasor aberto', 'Folhas, insetos e poeira entram e a', 'água fica contaminada.'],
               ['Caixa protegida', 'Tampa travada, tela no extravasor e', 'limpeza com desinfecção a cada 6 meses.']], [VERM, VERDE])
    a.add('<path d="M60 120 L76 218 H244 L260 120 Z" fill="#e8f2fb" stroke="#1f6fb2" stroke-width="2"/>', '<path d="M250 150 H300" stroke="#8a97a8" stroke-width="6"/>', t(318, 142, 'extravasor', 10, CINZA, '400', 'end'))
    a.add(a.g({0}, f'<path d="M66 140 L74 214 H246 L254 140 Z" fill="{AGUA}"><animate attributeName="fill" values="{AGUA};#9a9a6a" dur="5s" begin="{a.fase(0)}" fill="freeze"/></path>'
                   + '<path d="M60 112 L170 96" stroke="#1f6fb2" stroke-width="5"/>'
                   + ''.join(f'<ellipse cx="0" cy="0" rx="6" ry="3" fill="#6a9a3a"><animateMotion path="M{x} 84 Q{x + 20} 110 {x} 150" dur="3s" begin="{d}s" repeatCount="indefinite"/></ellipse>' for x, d in [(200, 0), (230, 1.5)])
                   + '<circle r="3" fill="#3d4a58"><animateMotion path="M310 150 H262 V170" dur="2.5s" repeatCount="indefinite"/></circle>' + t(160, 236, 'água turva e contaminada', 11, VERM, '700', 'middle')))
    a.add(a.g({1}, f'<path d="M66 140 L74 214 H246 L254 140 Z" fill="{AGUA}"/><path d="M56 118 H264" stroke="#1f6fb2" stroke-width="6"/><rect x="150" y="108" width="20" height="10" fill="{VERDE}"/>'
                   + ''.join(f'<path d="M{x} 144 V156" stroke="{VERDE}" stroke-width="1.2"/>' for x in range(290, 302, 3)) + t(160, 104, 'tampa travada', 10, VERDE, '700', 'middle')
                   + t(296, 172, 'tela', 10, VERDE, '700', 'end') + t(160, 236, 'água limpa: limpeza a cada 6 meses', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado: com a tampa da caixa d’água solta e o extravasor sem tela, folhas e insetos entram e a água fica turva. Com tampa travada, tela no extravasor e limpeza a cada 6 meses, a água fica limpa.')


# ---------- 13. Caixa d'água deformada ou trincada ----------
def deformada():
    a = Anim(2, 12, h=256)
    a.legenda([['Base que não apoia todo o fundo', 'Cheia, a caixa pesa centenas de quilos: o', 'fundo cede entre as ripas e pode trincar.'],
               ['Base plana e contínua', 'O fundo inteiro apoiado distribui o peso.', 'Fure só nos pontos indicados.']], [VERM, VERDE])
    reto, curvo = 'M70 200 H250', 'M70 200 Q160 236 250 200'
    a.add(a.g({0}, f'<path d="M60 110 L70 200 H250 L260 110" fill="#e8f2fb" stroke="#1f6fb2" stroke-width="2"><animate attributeName="d" values="M60 110 L70 200 Q160 200 250 200 L260 110;M60 110 L70 200 Q160 236 250 200 L260 110" dur="5s" begin="{a.fase(0)}" fill="freeze"/></path>'
                   + f'<rect x="64" y="200" width="14" height="30" fill="#8a6b4a"/><rect x="242" y="200" width="14" height="30" fill="#8a6b4a"/>'
                   + f'<path d="M150 214 l6 8 l-4 6" fill="none" stroke="{VERM}" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;1" dur=".5s" begin="{a.fase(0, 4.5)}" fill="freeze"/></path>'
                   + t(160, 246, 'fundo cedendo entre as ripas', 11, VERM, '700', 'middle')))
    a.add(a.g({1}, f'<path d="M60 110 L70 200 H250 L260 110" fill="#e8f2fb" stroke="#1f6fb2" stroke-width="2"/><rect x="50" y="200" width="220" height="14" fill="#9aa5b1"/>'
                   + t(160, 246, 'base plana em todo o fundo', 11, VERDE, '700', 'middle')))
    agua = f'<rect x="72" y="198" width="176" height="0" fill="{AGUA}" opacity=".85"><animate attributeName="y" values="198;122" dur="4s" begin="{a.fase(0)};{a.fase(1)}" fill="freeze"/><animate attributeName="height" values="0;76" dur="4s" begin="{a.fase(0)};{a.fase(1)}" fill="freeze"/></rect>'
    a.add(agua)
    return a.svg('Desenho animado: uma caixa d’água apoiada só em duas ripas enche, o fundo cede no meio e trinca. Sobre uma base plana e contínua, o fundo inteiro fica apoiado e não deforma.')


# ---------- 14. Cheiro de gás perto do aparelho ----------
def cheiro_gas():
    a = Anim(2, 14, h=286)
    a.legenda([['Vazamento na ligação', 'Vedante errado, mangueira vencida ou', 'abraçadeira solta deixam o gás escapar.'],
               ['O que fazer', 'Siga estes passos e use só vedantes e', 'mangueiras certificados para gás.']], [VERM, VERDE])
    a.add('<rect x="200" y="120" width="100" height="80" rx="6" fill="#eef2f6" stroke="#5b6b80" stroke-width="2"/>', t(250, 166, 'fogão', 11, TXT, '600', 'middle'),
          '<path d="M30 150 H120 Q150 150 150 170 Q150 190 200 186" fill="none" stroke="#f0b429" stroke-width="7"/>', '<rect x="40" y="140" width="16" height="20" fill="#5b6b80"/>', t(48, 132, 'registro', 10, CINZA, '400', 'middle'))
    nuvem = ''.join(f'<path d="M{x} 180 q6 -10 0 -20 q-6 -10 0 -20" fill="none" stroke="#e0a800" stroke-width="2.5" stroke-linecap="round"><animate attributeName="opacity" values="0;1;0" dur="1.8s" begin="{d}s" repeatCount="indefinite"/></path>' for x, d in [(184, 0), (194, .6), (176, 1.2)])
    a.add(a.g({0}, nuvem + t(150, 232, 'cheiro de gás', 11, VERM, '700', 'middle')))
    passos = ['1. feche o registro', '2. abra portas e janelas', '3. não acione interruptores', '4. chame um profissional']
    corpo = '<path d="M38 150 H58" stroke="' + VERDE + '" stroke-width="4"/>'
    for k, p in enumerate(passos):
        corpo += (f'<g opacity="0"><animate attributeName="opacity" values="0;1" dur=".3s" begin="{a.fase(1, .3 + k * 1.2)}" fill="freeze"/>' + t(20, 214 + 15 * k, p, 12, VERDE, '700') + '</g>')
    a.add(a.g({1}, corpo))
    a.add(t(4, 280, 'Nunca procure vazamento com chama: use espuma.', 11, VERM, '700'))
    return a.svg('Desenho animado: gás escapa na ligação da mangueira do fogão. O que fazer: fechar o registro, abrir portas e janelas, não acionar interruptores e chamar um profissional. Nunca procurar vazamento com chama.')


# ---------- 15. Vazamento descoberto depois do revestimento ----------
def depois_revestimento():
    a = Anim(2, 14, h=256)
    a.legenda([['Parede fechada sem teste', 'O revestimento cobre a tubulação e o', 'vazamento só aparece como mancha.'],
               ['Teste antes de fechar', 'Bujões nos pontos, rede pressurizada e', 'pressão estável: aí sim, revista.']], [VERM, VERDE])
    a.add('<path d="M40 100 V230 M40 140 H220 V110" fill="none" stroke="#9aa5b1" stroke-width="7"/>', '<circle cx="220" cy="106" r="5" fill="#5b6b80"/>')
    azul = ''.join(f'<rect x="{30 + 46 * (k % 6)}" y="{98 + 34 * (k // 6)}" width="44" height="32" fill="#cfe3f3" stroke="#fff" opacity="0"><animate attributeName="opacity" values="0;1" dur=".3s" begin="{a.fase(0, k * .18)}" fill="freeze"/></rect>' for k in range(24))
    mancha = f'<ellipse cx="120" cy="150" rx="0" ry="0" fill="#9c8a6a" opacity=".5"><animate attributeName="rx" values="0;60" dur="3s" begin="{a.fase(0, 4.5)}" fill="freeze"/><animate attributeName="ry" values="0;40" dur="3s" begin="{a.fase(0, 4.5)}" fill="freeze"/></ellipse>'
    a.add(a.g({0}, azul + mancha + t(160, 248, 'quebrar o revestimento para consertar', 11, VERM, '700', 'middle')))
    agulha = '<path d="M270 160 L270 136" stroke="' + VERDE + '" stroke-width="3"><animateTransform attributeName="transform" type="rotate" values="-60 270 160;30 270 160;30 270 160" keyTimes="0;.3;1" dur="6s" begin="' + a.fase(1) + '" fill="freeze"/></path>'
    a.add(a.g({1}, '<circle cx="220" cy="106" r="7" fill="' + VERDE + '"/>' + t(220, 96, 'bujão', 10, VERDE, '700', 'middle')
                   + '<circle cx="270" cy="160" r="30" fill="#fff" stroke="#5b6b80" stroke-width="2"/>' + agulha + t(270, 206, 'pressão estável', 10, VERDE, '700', 'middle')
                   + t(160, 248, 'teste aprovado: agora pode revestir', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado: o revestimento é colocado sobre a tubulação sem teste e o vazamento aparece depois como mancha. O certo é pôr bujões nos pontos, pressurizar e confirmar que a pressão fica estável antes de revestir.')


FIGS = {
    'Mau cheiro no banheiro': mau_cheiro(),
    'Retorno de espuma nos andares baixos': espuma(),
    'Entupimento frequente': entupimento(),
    'Vazamento em junta soldada': junta_soldada(),
    'Tubo de PVC marrom deformado ou rompido na água quente': pvc_quente(),
    'Barulho e "pancada" ao fechar a torneira': pancada(),
    'Corrosão na ligação de cobre com aço galvanizado': galvanica(),
    'Tubo de água fria "suando"': suando(),
    'Pouca pressão no chuveiro': pouca_pressao(),
    'PPR ou CPVC "serpenteando" na água quente': serpenteando(),
    "Água contaminada na caixa d'água": contaminada(),
    "Caixa d'água deformada ou trincada": deformada(),
    'Cheiro de gás perto do aparelho': cheiro_gas(),
    'Descarga que não para de correr': descarga(),
    'Vazamento descoberto depois do revestimento': depois_revestimento(),
}

if __name__ == '__main__':
    p = 'site/guias.js'
    s = open(p, encoding='utf-8').read()
    nomes = [x or y for x, y in re.findall(r"t: (?:'([^']+)'|\"([^\"]+)\")", s[s.index('const PATS'):s.index('];', s.index('const PATS'))])]
    for k in FIGS:
        assert k in nomes, f'"{k}" não está em PATS'
    bloco = ('// <PATS_FIG> Desenhos animados dos Erros e patologias, gerados por scripts/animacoes.py (não edite à mão)\n'
             'const PATS_FIG = ' + json.dumps(FIGS, ensure_ascii=False) + ';\n// </PATS_FIG>\n')
    if '// <PATS_FIG>' in s:
        s = re.sub(r'// <PATS_FIG>.*?// </PATS_FIG>\n', lambda m: bloco, s, flags=re.S)
    else:
        i = s.index('];', s.index('const PATS')) + 3
        s = s[:i] + bloco + s[i:]
    open(p, 'w', encoding='utf-8', newline='').write(s)
    print('PATS_FIG gravado:', len(FIGS), 'desenhos,', sum(len(v) for v in FIGS.values()) // 1024, 'KB')
