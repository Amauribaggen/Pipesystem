# "Como funciona" animado das válvulas, nas páginas das fichas (/materiais/...).
# Uso, na pasta do projeto:  python -I scripts/animacoes_valvulas.py
# Grava site/como-funciona.json ({id da ficha: {t: título, svg}}), lido por scripts/pages.mjs.
import json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from animacoes import Anim, t, AZUL, VERM, VERDE, CINZA, TXT, AGUA

METAL, METAL_E, CORPO = '#9aa5b1', '#5b6b80', '#dfe5ec'
CY = 172   # eixo do tubo


def tubo(a, x0=10, x1=310, cy=CY, r=14):
    a.add(f'<rect x="{x0}" y="{cy - r}" width="{x1 - x0}" height="{2 * r}" fill="#eef6fc"/>',
          f'<path d="M{x0} {cy - r} H{x1} M{x0} {cy + r} H{x1}" stroke="{METAL_E}" stroke-width="3"/>')


def fluxo(path, n=4, dur=2.4, r=3.2, cor=AZUL):
    return ''.join(f'<circle r="{r}" fill="{cor}" opacity=".8"><animateMotion path="{path}" dur="{dur}s" begin="-{k * dur / n:.2f}s" repeatCount="indefinite"/></circle>' for k in range(n))


def parado(xs, cy=CY):   # água parada antes da obstrução
    return ''.join(f'<circle cx="{x}" cy="{cy}" r="3.2" fill="{AZUL}" opacity=".45"/>' for x in xs)


def move(begin, vals, dur=2):
    return f'<animateTransform attributeName="transform" type="translate" values="{vals}" dur="{dur}s" begin="{begin}" fill="freeze"/>'


def gira(begin, de, para, cx, cy, dur=2):
    return f'<animateTransform attributeName="transform" type="rotate" values="{de} {cx} {cy};{para} {cx} {cy}" dur="{dur}s" begin="{begin}" fill="freeze"/>'


# ---------- gaveta ----------
def gaveta():
    a = Anim(3, 15, dy=26)
    a.legenda([['Aberta', 'A cunha sobe para dentro do castelo e', 'deixa a passagem livre: quase sem perda.'],
               ['Fechada', 'Várias voltas no volante descem a cunha,', 'que encosta nas sedes e bloqueia o fluxo.'],
               ['Meio aberta, não', 'É válvula de bloqueio: regulando, a cunha', 'vibra, faz barulho e desgasta as sedes.']], [VERDE, AZUL, VERM])
    tubo(a)
    a.add(f'<rect x="112" y="140" width="96" height="64" rx="12" fill="{CORPO}" stroke="{METAL_E}" stroke-width="2"/>',
          f'<rect x="140" y="96" width="40" height="46" fill="{CORPO}" stroke="{METAL_E}" stroke-width="2"/>',
          f'<rect x="114" y="{CY - 14}" width="92" height="28" fill="#eef6fc"/>',
          f'<path d="M160 70 V100" stroke="{METAL_E}" stroke-width="4"/><ellipse cx="160" cy="70" rx="30" ry="7" fill="none" stroke="{VERM}" stroke-width="4"/>',
          t(198, 66, 'volante', 10, CINZA), t(186, 112, 'castelo', 10, CINZA))
    cunha = f'<rect x="152" y="100" width="16" height="40" rx="2" fill="{METAL}" stroke="{METAL_E}"/>'
    a.add(a.g({0}, cunha + fluxo('M10 172 H310')))
    a.add(a.g({1}, f'<g>{cunha}{move(a.fase(1), "0 0;0 58")}</g>' + parado([120, 132, 144]) + t(160, 232, 'passagem bloqueada', 11, AZUL, '700', 'middle')))
    a.add(a.g({2}, f'<g transform="translate(0 32)">{cunha}</g>' + fluxo('M10 176 H150 Q160 192 170 176 H310', 4, 1.6)
                   + ''.join(f'<path d="M{x} 192 q4 -6 8 0" fill="none" stroke="{VERM}" stroke-width="2"><animate attributeName="opacity" values="0;1;0" dur=".6s" begin="{d}s" repeatCount="indefinite"/></path>' for x, d in [(170, 0), (180, .2), (190, .4)])
                   + t(160, 232, 'turbulência e desgaste', 11, VERM, '700', 'middle')))
    return a.svg('Desenho animado da válvula de gaveta em corte: aberta, a cunha fica no castelo e a água passa livre; fechada, a cunha desce e bloqueia; meio aberta, a cunha vibra e se desgasta.')


# ---------- globo ----------
def globo():
    a = Anim(2, 12, dy=16)
    a.legenda([['Aberta, regulando', 'A água faz um "S" e passa pela sede: o', 'obturador sobe ou desce e ajusta a vazão.'],
               ['Fechada', 'O obturador assenta na sede. Regula bem,', 'mas perde mais carga que a gaveta.']], [VERDE, AZUL])
    tubo(a)
    a.add(f'<ellipse cx="160" cy="174" rx="54" ry="40" fill="{CORPO}" stroke="{METAL_E}" stroke-width="2"/>',
          f'<rect x="146" y="104" width="28" height="34" fill="{CORPO}" stroke="{METAL_E}" stroke-width="2"/>',
          f'<path d="M106 {CY - 14} H120 M106 {CY + 14} H120 M200 {CY - 14} H214 M200 {CY + 14} H214" stroke="#eef6fc" stroke-width="4"/>',
          f'<path d="M108 188 H146 V160 M174 160 V156 H212" fill="none" stroke="{METAL_E}" stroke-width="3"/>', t(160, 226, 'sede', 10, CINZA, '400', 'middle'),
          f'<path d="M160 78 V140" stroke="{METAL_E}" stroke-width="4"/><ellipse cx="160" cy="78" rx="26" ry="6" fill="none" stroke="{VERM}" stroke-width="4"/>')
    obt = f'<rect x="144" y="140" width="32" height="10" rx="3" fill="{METAL}" stroke="{METAL_E}"/>'
    a.add(a.g({0}, obt + fluxo('M10 178 H128 Q140 200 156 192 Q164 168 168 156 Q176 146 200 164 H310', 5, 2.8)))
    a.add(a.g({1}, f'<g>{obt}{move(a.fase(1), "0 0;0 10", 1.5)}</g>' + parado([96, 110, 124], 178) + t(160, 244, 'obturador na sede', 11, AZUL, '700', 'middle')))
    return a.svg('Desenho animado da válvula globo em corte: a água faz um S e passa pela sede, e o obturador sobe ou desce para regular a vazão; fechada, o obturador assenta na sede.')


# ---------- retenção ----------
def retencao():
    a = Anim(2, 12)
    a.legenda([['Fluxo no sentido certo', 'A água empurra a portinhola, que abre', 'e deixa passar.'],
               ['Fluxo ao contrário', 'Quando a bomba para, a água tenta voltar:', 'a portinhola fecha e impede o retorno.']], [VERDE, AZUL])
    tubo(a)
    a.add(f'<rect x="120" y="148" width="80" height="48" rx="8" fill="none" stroke="{METAL_E}" stroke-width="2"/>', '<circle cx="160" cy="160" r="4" fill="' + METAL_E + '"/>',
          '<path d="M150 186 H170" stroke="' + METAL_E + '" stroke-width="3"/>', t(160, 214, 'portinhola', 10, CINZA, '400', 'middle'))
    port = f'<path d="M160 160 V186" stroke="{METAL}" stroke-width="7" stroke-linecap="round"/>'
    a.add(a.g({0}, f'<g>{port}{gira(a.fase(0), 0, -70, 160, 160, 1.2)}</g>' + fluxo('M10 176 H310', 5, 2.4) + '<path d="M40 136 H90 M82 130 L90 136 L82 142" fill="none" stroke="' + VERDE + '" stroke-width="2.5"/>'))
    a.add(a.g({1}, f'<g transform="rotate(-70 160 160)">{port}{gira(a.fase(1), -70, 0, 160, 160, 1)}</g>' + parado([178, 192, 206, 220]) + '<path d="M280 136 H230 M238 130 L230 136 L238 142" fill="none" stroke="' + VERM + '" stroke-width="2.5"/>'
                   + t(160, 240, 'retorno bloqueado', 11, AZUL, '700', 'middle')))
    return a.svg('Desenho animado da válvula de retenção de portinhola: com o fluxo no sentido certo a portinhola abre; quando a água tenta voltar, a portinhola fecha e bloqueia o retorno.')


# ---------- esfera ----------
def esfera():
    a = Anim(2, 12, dy=24)
    a.legenda([['Aberta', 'O furo da esfera fica alinhado com o tubo', 'e a alavanca, paralela a ele.'],
               ['Fechada com 1/4 de volta', 'A esfera gira 90° e veda. Rápida e', 'estanque, mas não serve para regular.']], [VERDE, AZUL])
    tubo(a)
    a.add(f'<rect x="118" y="138" width="84" height="68" rx="10" fill="{CORPO}" stroke="{METAL_E}" stroke-width="2"/>', f'<path d="M160 112 V140" stroke="{METAL_E}" stroke-width="5"/>')
    bola = f'<circle cx="160" cy="{CY}" r="28" fill="#c8ced6" stroke="{METAL_E}" stroke-width="2"/><rect x="132" y="{CY - 12}" width="56" height="24" fill="#eef6fc"/>'
    alav = f'<path d="M160 112 H200" stroke="{VERM}" stroke-width="6" stroke-linecap="round"/>'
    a.add(a.g({0}, bola + alav + fluxo('M10 172 H310', 5, 2.2)))
    a.add(a.g({1}, f'<g>{bola}{gira(a.fase(1), 0, 90, 160, CY, 1.2)}</g><g>{alav}{gira(a.fase(1), 0, -90, 160, 112, 1.2)}</g>' + parado([110, 122]) + t(214, 232, '1/4 de volta', 11, AZUL, '700', 'middle')))
    a.add(t(26, 108, 'alavanca', 10, CINZA))
    return a.svg('Desenho animado da válvula de esfera: aberta, o furo da esfera fica alinhado com o tubo; com um quarto de volta da alavanca a esfera gira 90 graus e veda.')


# ---------- borboleta ----------
def borboleta():
    a = Anim(2, 12)
    a.legenda([['Aberta', 'O disco fica de lado para o fluxo:', 'a água passa por cima e por baixo dele.'],
               ['Fechada', 'O disco gira 90° no eixo e encosta no anel', 'de vedação. Leve e compacta para tubos grandes.']], [VERDE, AZUL])
    tubo(a, r=22)
    a.add(f'<path d="M150 140 V204 M170 140 V204" stroke="{METAL_E}" stroke-width="3"/>', f'<path d="M160 112 V150" stroke="{METAL_E}" stroke-width="4"/>',
          f'<rect x="142" y="102" width="36" height="12" fill="{VERM}"/>', t(186, 112, 'redutor', 10, CINZA), t(160, 222, 'anel de vedação', 10, CINZA, '400', 'middle'))
    disco = f'<path d="M160 {CY - 20} V{CY + 20}" stroke="{METAL}" stroke-width="7" stroke-linecap="round"/>'
    a.add(a.g({0}, f'<g transform="rotate(90 160 {CY})">{disco}</g>' + fluxo('M10 162 H310', 4, 2.2) + fluxo('M10 184 H310', 4, 2.4)))
    a.add(a.g({1}, f'<g transform="rotate(90 160 {CY})">{disco}{gira(a.fase(1), 90, 0, 160, CY, 1.4)}</g>' + parado([110, 124, 138]) + t(160, 244, 'disco atravessado: fechada', 11, AZUL, '700', 'middle')))
    return a.svg('Desenho animado da válvula borboleta: aberta, o disco fica de lado e a água passa por cima e por baixo; fechada, o disco gira 90 graus e encosta no anel de vedação.')


# ---------- redutora de pressão ----------
def manometro(cx, cy, ang, rot=''):
    return (f'<circle cx="{cx}" cy="{cy}" r="16" fill="#fff" stroke="{METAL_E}" stroke-width="2"/>'
            f'<path d="M{cx} {cy} V{cy - 12}" stroke="{VERM}" stroke-width="2.5" transform="rotate({ang} {cx} {cy})">{rot}</path>')


def redutora():
    a = Anim(2, 12, dy=8)
    a.legenda([['Sem consumo', 'A pressão de saída empurra o diafragma', 'contra a mola e o obturador fecha.'],
               ['Torneira aberta', 'A saída cai um pouco, a mola abre a', 'passagem e mantém a pressão regulada.']], [AZUL, VERDE])
    tubo(a)
    a.add(f'<rect x="118" y="146" width="84" height="54" rx="10" fill="{CORPO}" stroke="{METAL_E}" stroke-width="2"/>',
          f'<rect x="126" y="104" width="68" height="16" rx="4" fill="#cfd6de" stroke="{METAL_E}"/>', t(160, 98, 'diafragma e mola', 10, CINZA, '400', 'middle'),
          f'<path d="M148 120 l8 4 l-16 4 l16 4 l-16 4 l8 4" fill="none" stroke="{METAL_E}" stroke-width="2"/>', f'<path d="M160 120 V150" stroke="{METAL_E}" stroke-width="3"/>',
          f'<path d="M66 158 V140 M254 158 V140" stroke="{METAL_E}" stroke-width="3"/>', t(66, 106, '6 bar', 11, VERM, '700', 'middle'), t(254, 106, '3 bar', 11, VERDE, '700', 'middle'),
          t(66, 222, 'entrada', 10, CINZA, '400', 'middle'), t(254, 222, 'saída regulada', 10, CINZA, '400', 'middle'))
    obt = f'<rect x="146" y="160" width="28" height="10" rx="3" fill="{METAL}" stroke="{METAL_E}"/>'
    a.add(a.g({0}, f'<g transform="translate(0 8)">{obt}</g>' + manometro(66, 124, 60) + manometro(254, 124, -10) + parado([96, 108, 212, 226])))
    a.add(a.g({1}, f'<g>{obt}{move(a.fase(1), "0 8;0 -2", 1.2)}</g>' + manometro(66, 124, 60)
                   + manometro(254, 124, -10, '<animateTransform attributeName="transform" type="rotate" values="-14 254 124;-6 254 124;-14 254 124" dur="1.6s" repeatCount="indefinite"/>')
                   + fluxo('M10 176 H310', 5, 2.4) + '<path d="M300 190 V214" stroke="' + AGUA + '" stroke-width="3" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" values="8;0" dur=".4s" repeatCount="indefinite"/></path>'))
    return a.svg('Desenho animado da válvula redutora de pressão: na entrada há 6 bar; sem consumo, a pressão de saída empurra o diafragma e a válvula fecha; com uma torneira aberta, a mola abre a passagem e a saída se mantém perto de 3 bar.')


# ---------- ventosa ----------
def ventosa():
    a = Anim(2, 12)
    a.legenda([['Ar no ponto alto', 'O ar se junta no alto da rede, a boia', 'desce e o orifício solta o ar.'],
               ['Sem ar', 'A água enche a câmara, a boia sobe e', 'fecha o orifício: a rede fica estanque.']], [AZUL, VERDE])
    rede = 'M10 228 L150 186 H170 L310 228'
    a.add(f'<path d="{rede}" fill="none" stroke="#cfe3f3" stroke-width="26" stroke-linejoin="round"/>', f'<path d="{rede}" fill="none" stroke="{METAL_E}" stroke-width="2" stroke-dasharray="1 0" opacity=".4"/>',
          f'<rect x="140" y="96" width="40" height="80" rx="6" fill="#f4f7fa" stroke="{METAL_E}" stroke-width="2"/>', f'<path d="M154 96 V88 H166 V96" fill="none" stroke="{METAL_E}" stroke-width="2"/>',
          t(190, 104, 'orifício', 10, CINZA), t(190, 160, 'câmara', 10, CINZA))
    bolhas = ''.join(f'<circle r="5" fill="#fff" stroke="#9aa5b1"><animateMotion path="M20 222 L150 184 H160 V100" dur="3s" begin="-{k * .75:.2f}s" repeatCount="indefinite"/></circle>' for k in range(4))
    saida = ''.join(f'<path d="M{x} 84 q4 -8 0 -16" fill="none" stroke="#9aa5b1" stroke-width="2.5" stroke-linecap="round"><animate attributeName="opacity" values="0;1;0" dur="1.2s" begin="{d}s" repeatCount="indefinite"/></path>' for x, d in [(156, 0), (164, .4)])
    a.add(a.g({0}, f'<rect x="142" y="150" width="36" height="24" fill="{AGUA}"/><circle cx="160" cy="146" r="11" fill="#f0b429"/>' + bolhas + saida + t(222, 92, 'ar saindo', 11, AZUL, '700')))
    a.add(a.g({1}, f'<rect x="142" y="106" width="36" height="68" fill="{AGUA}"/><circle cx="160" cy="108" r="11" fill="#f0b429"/>' + fluxo('M10 214 L150 172 H170 L310 214', 5, 2.6) + t(222, 92, 'orifício fechado', 11, VERDE, '700')))
    return a.svg('Desenho animado da ventosa: o ar sobe pela rede até o ponto alto, a boia da ventosa desce e o orifício solta o ar; quando só há água, a boia sobe e fecha o orifício.')


# ---------- torneira de boia ----------
def boia():
    a = Anim(2, 12)
    a.legenda([['Enchendo', 'A água entra e a boia sobe junto com', 'o nível, levantando o braço.'],
               ['Cheio', 'No nível ajustado, o braço fecha a entrada.', 'Quando se gasta água, a boia desce e reabre.']], [AZUL, VERDE])
    a.add(f'<path d="M40 96 V230 H280 V96" fill="#f4f7fa" stroke="{METAL_E}" stroke-width="3"/>', f'<path d="M10 104 H70 V118" fill="none" stroke="{METAL_E}" stroke-width="6"/>',
          f'<rect x="62" y="112" width="18" height="14" fill="{METAL}"/>', t(14, 96, 'entrada', 10, CINZA))
    f0 = a.fase(0)
    a.add(a.g({0}, f'<rect x="42" y="138" width="236" height="90" fill="{AGUA}"><animate attributeName="y" values="214;138" dur="5.5s" begin="{f0}" fill="freeze"/><animate attributeName="height" values="14;90" dur="5.5s" begin="{f0}" fill="freeze"/></rect>'
                   + f'<path d="M71 126 V214" stroke="{AGUA}" stroke-width="4" stroke-dasharray="6 5"><animate attributeName="stroke-dashoffset" values="11;0" dur=".4s" repeatCount="indefinite"/></path>'
                   + f'<g><animateTransform attributeName="transform" type="rotate" values="35 72 120;0 72 120" dur="5.5s" begin="{f0}" fill="freeze"/><path d="M72 120 L180 140" stroke="{METAL_E}" stroke-width="3"/><circle cx="192" cy="142" r="13" fill="#f0b429"/></g>'))
    a.add(a.g({1}, f'<rect x="42" y="138" width="236" height="90" fill="{AGUA}"/><path d="M72 120 L180 140" stroke="{METAL_E}" stroke-width="3"/><circle cx="192" cy="142" r="13" fill="#f0b429"/>'
                   + t(160, 196, 'entrada fechada pelo braço', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado da torneira de boia: a água entra no reservatório e a boia sobe junto com o nível; no nível ajustado, o braço fecha a entrada, e reabre quando o nível baixa.')


FIGS = {
    'mat-gaveta': ('Como funciona a válvula de gaveta', gaveta()),
    'mat-globo': ('Como funciona a válvula globo', globo()),
    'mat-retencao': ('Como funciona a válvula de retenção', retencao()),
    'mat-esfera-monobloco': ('Como funciona a válvula de esfera', esfera()),
    'mat-borboleta': ('Como funciona a válvula borboleta', borboleta()),
    'mat-redutora': ('Como funciona a válvula redutora de pressão', redutora()),
    'mat-ventosas': ('Como funciona a ventosa', ventosa()),
    'mat-boia': ('Como funciona a torneira de boia', boia()),
}

if __name__ == '__main__':
    saida = {k: {'t': tit, 'svg': svg} for k, (tit, svg) in FIGS.items()}
    json.dump(saida, open('site/como-funciona.json', 'w', encoding='utf-8'), ensure_ascii=False)
    print('site/como-funciona.json:', len(saida), 'animações,', os.path.getsize('site/como-funciona.json') // 1024, 'KB')
