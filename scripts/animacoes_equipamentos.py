# "Como funciona" animado dos equipamentos (bombas, pressurizador, aquecedores, vaso de expansão, hidrômetro).
# Usado por scripts/animacoes_valvulas.py, que grava tudo em site/como-funciona.json.
from animacoes import Anim, t, AZUL, VERM, VERDE, CINZA, TXT, AGUA

METAL, METAL_E, CORPO, QUENTE = '#9aa5b1', '#5b6b80', '#dfe5ec', '#d9534f'


def pontos(path, n=4, dur=2.4, r=3.2, cor=AZUL, extra=''):
    return ''.join(f'<circle r="{r}" fill="{cor}" opacity=".85">{extra}<animateMotion path="{path}" dur="{dur}s" begin="-{k * dur / n:.2f}s" repeatCount="indefinite"/></circle>' for k in range(n))


def roda(cx, cy, dur):
    return f'<animateTransform attributeName="transform" type="rotate" from="0 {cx} {cy}" to="360 {cx} {cy}" dur="{dur}s" repeatCount="indefinite"/>'


def chuveiro(x, y, forte):
    s = f'<path d="M{x - 18} {y} H{x + 18} L{x + 12} {y + 8} H{x - 12} Z" fill="{METAL_E}"/>'
    if forte:
        s += ''.join(f'<path d="M{x + dx} {y + 10} L{x + dx * 2} {y + 40}" stroke="{AGUA}" stroke-width="2.4" stroke-dasharray="5 5"><animate attributeName="stroke-dashoffset" values="10;0" dur=".35s" repeatCount="indefinite"/></path>' for dx in (-8, -3, 2, 7))
    return s


# ---------- bomba centrífuga ----------
def bomba():
    a = Anim(2, 12, dy=8)
    a.legenda([['Funcionando', 'A água entra pelo centro do rotor, é lançada', 'para fora e a voluta transforma em pressão.'],
               ['Sem escorva', 'Com ar dentro, o rotor gira em falso e não', 'puxa água: encha a bomba e a sucção antes.']], [VERDE, VERM])
    a.add(f'<path d="M10 172 H112" stroke="{METAL_E}" stroke-width="22"/><path d="M10 172 H112" stroke="#eef6fc" stroke-width="16"/>', t(14, 202, 'sucção', 10, CINZA),
          f'<path d="M188 136 V100 H310" fill="none" stroke="{METAL_E}" stroke-width="22"/><path d="M188 136 V100 H310" fill="none" stroke="#eef6fc" stroke-width="16"/>', t(306, 128, 'recalque', 10, CINZA, '400', 'end'),
          f'<circle cx="150" cy="172" r="52" fill="{CORPO}" stroke="{METAL_E}" stroke-width="3"/>', t(150, 240, 'voluta', 10, CINZA, '400', 'middle'))
    pas = ''.join(f'<path d="M150 172 q{18 * (1 if k % 2 else 1)} -6 30 -28" fill="none" stroke="{METAL_E}" stroke-width="4" transform="rotate({k * 60} 150 172)"/>' for k in range(6))
    a.add(a.g({0}, f'<circle cx="150" cy="172" r="40" fill="#cfe3f3"/><g>{pas}{roda(150, 172, .9)}</g>' + pontos('M10 172 H140 Q178 150 188 128 V100 H310', 6, 2.2)
                   + f'<circle cx="250" cy="72" r="13" fill="#fff" stroke="{METAL_E}" stroke-width="2"/><path d="M250 72 L258 64" stroke="{VERDE}" stroke-width="2.5"/>' + t(232, 76, 'pressão', 10, VERDE, '700', 'end')))
    a.add(a.g({1}, f'<circle cx="150" cy="172" r="40" fill="#f4f7fa"/><g>{pas}{roda(150, 172, .9)}</g>'
                   + ''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="#fff" stroke="#9aa5b1"/>' for x, y in [(130, 150), (172, 160), (160, 196), (128, 190)])
                   + ''.join(f'<circle cx="{x}" cy="172" r="3.2" fill="{AZUL}" opacity=".45"/>' for x in (30, 50, 70)) + t(256, 200, 'ar dentro', 11, VERM, '700', 'middle') + t(256, 214, 'da bomba', 11, VERM, '700', 'middle')))
    return a.svg('Desenho animado da bomba centrífuga: a água entra pelo centro do rotor, é lançada para fora e sai com pressão pelo recalque; sem escorva, com ar dentro, o rotor gira em falso e não puxa água.')


# ---------- pressurizador ----------
def pressurizador():
    a = Anim(2, 12)
    a.legenda([['Torneira fechada', 'Sem fluxo, o sensor deixa a bomba', 'desligada.'],
               ['Torneira aberta', 'O sensor de fluxo liga a bomba, que aumenta', 'a pressão no chuveiro. Fechou, desliga.']], [AZUL, VERDE])
    cano = 'M60 128 V188 H120 M176 188 H250 V206'
    a.add(f'<rect x="20" y="92" width="80" height="38" rx="4" fill="#e8f2fb" stroke="{AZUL}" stroke-width="2"/><rect x="22" y="102" width="76" height="26" fill="{AGUA}"/>', t(60, 86, "caixa d'água", 10, TXT, '600', 'middle'),
          f'<path d="{cano}" fill="none" stroke="{METAL_E}" stroke-width="8"/>', f'<rect x="120" y="166" width="56" height="44" rx="8" fill="{CORPO}" stroke="{METAL_E}" stroke-width="2"/>',
          t(148, 228, 'pressurizador', 10, CINZA, '400', 'middle'), f'<circle cx="148" cy="188" r="12" fill="#fff" stroke="{METAL_E}"/>')
    helice = f'<path d="M136 188 H160 M148 176 V200" stroke="{METAL_E}" stroke-width="3"/>'
    a.add(a.g({0}, helice + chuveiro(250, 210, False) + t(148, 156, 'desligado', 11, AZUL, '700', 'middle')))
    a.add(a.g({1}, f'<g>{helice}{roda(148, 188, .5)}</g>' + chuveiro(250, 210, True) + pontos('M60 128 V188 H250 V206', 6, 2.4)
                   + t(148, 156, 'ligado', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado do pressurizador: com a torneira fechada a bomba fica desligada; ao abrir o chuveiro, o sensor de fluxo liga a bomba, que aumenta a pressão, e desliga quando o chuveiro fecha.')


# ---------- aquecedor a gás de passagem ----------
def aquecedor_gas():
    a = Anim(2, 12, h=266)
    a.legenda([['Sem consumo', 'Sem água passando, o queimador fica', 'apagado: não há gasto de gás.'],
               ['Chuveiro aberto', 'O fluxo acende o queimador e a água', 'esquenta ao passar pela serpentina.']], [AZUL, VERDE])
    serp = 'M110 220 H200 V204 H120 V188 H200 V172 H120 V156 H200 V140 H120 V124'
    a.add(f'<rect x="100" y="96" width="112" height="150" rx="8" fill="#f4f7fa" stroke="{METAL_E}" stroke-width="2"/>', t(156, 90, 'aquecedor', 10, CINZA, '400', 'middle'),
          f'<path d="M20 220 H110" stroke="{AZUL}" stroke-width="6"/>', t(20, 212, 'água fria', 10, AZUL, '700'),
          f'<path d="M120 124 V110 H260 V196" fill="none" stroke="{QUENTE}" stroke-width="6"/>', t(300, 100, 'água quente', 10, QUENTE, '700', 'end'),
          f'<path d="{serp}" fill="none" stroke="{METAL}" stroke-width="5"/>', f'<path d="M112 236 H200" stroke="{METAL_E}" stroke-width="4"/>')
    a.add(a.g({0}, chuveiro(260, 200, False) + t(156, 260, 'queimador apagado', 11, AZUL, '700', 'middle')))
    chama = ''.join(f'<path d="M{x} 236 q-5 -10 0 -18 q5 8 0 18" fill="#f0a020"><animate attributeName="opacity" values=".55;1;.55" dur=".5s" begin="{d}s" repeatCount="indefinite"/></path>' for x, d in [(125, 0), (145, .15), (165, .3), (185, .1)])
    cor = '<animate attributeName="fill" values="#1f6fb2;#d9534f" dur="3s" repeatCount="indefinite"/>'
    a.add(a.g({1}, chama + chuveiro(260, 200, True) + pontos('M20 220 H200 V204 H120 V188 H200 V172 H120 V156 H200 V140 H120 V110 H260 V196', 6, 3, 3, AZUL, cor)
                   + t(156, 260, 'queimador aceso', 11, VERDE, '700', 'middle')))
    return a.svg('Desenho animado do aquecedor a gás de passagem: sem consumo o queimador fica apagado; ao abrir o chuveiro, o fluxo acende o queimador e a água esquenta ao passar pela serpentina.')


# ---------- aquecedor solar (termossifão) ----------
def solar():
    a = Anim(2, 12, h=262)
    a.legenda([['Dia de sol', 'A água aquecida no coletor fica mais leve e', 'sobe ao reservatório; a fria desce ao coletor.'],
               ['À noite ou nublado', 'A circulação para. O reservatório guarda o', 'calor e a resistência de apoio completa.']], [VERDE, AZUL])
    a.add('<path d="M20 240 L180 140" stroke="#c9b28a" stroke-width="5"/>', t(24, 256, 'telhado', 10, CINZA),
          '<path d="M40 214 L150 146 L170 160 L60 228 Z" fill="#2b4a6b" stroke="#5b6b80"/>' + ''.join(f'<path d="M{50 + 22 * k} {222 - 13.6 * k} L{70 + 22 * k} {236 - 13.6 * k}" stroke="#6f8fb0" stroke-width="1.5"/>' for k in range(5)),
          t(70, 250, 'coletor', 10, CINZA),
          f'<rect x="200" y="96" width="100" height="56" rx="26" fill="#f4f7fa" stroke="{METAL_E}" stroke-width="2"/>', t(250, 90, 'reservatório', 10, CINZA, '400', 'middle'),
          f'<path d="M160 152 Q190 120 210 112" fill="none" stroke="{QUENTE}" stroke-width="5"/>', f'<path d="M290 150 V236 H64" fill="none" stroke="{AZUL}" stroke-width="5"/>')
    sol = '<circle cx="40" cy="104" r="14" fill="#f5c400"/>' + ''.join(f'<path d="M40 104 l{24 * c:.1f} {24 * s:.1f}" stroke="#f5c400" stroke-width="2" transform="translate({10 * c:.1f} {10 * s:.1f})"/>' for c, s in [(1, 0), (.7, .7), (0, 1), (-.7, .7), (.7, -.7)])
    a.add(a.g({0}, sol + '<rect x="202" y="98" width="96" height="26" rx="12" fill="#f6c6c4"/>' + pontos('M160 152 Q190 120 210 112', 3, 2, 3, QUENTE) + pontos('M290 150 V236 H64', 4, 4, 3, AZUL)))
    a.add(a.g({1}, '<path d="M48 96 a14 14 0 1 0 10 24 a11 11 0 1 1 -10 -24 Z" fill="#9aa5b1"/><rect x="202" y="98" width="96" height="26" rx="12" fill="#f6c6c4"/>'
                   + f'<path d="M222 138 h56" stroke="{QUENTE}" stroke-width="3"><animate attributeName="opacity" values=".3;1;.3" dur="1.5s" repeatCount="indefinite"/></path>' + t(250, 170, 'resistência de apoio', 10, QUENTE, '700', 'middle')))
    return a.svg('Desenho animado do aquecedor solar por termossifão: com sol, a água aquecida no coletor sobe ao reservatório e a fria desce ao coletor; à noite a circulação para e a resistência elétrica de apoio completa o aquecimento.')


# ---------- vaso de expansão ----------
def vaso_expansao():
    a = Anim(2, 12, h=262)
    a.legenda([['Água fria', 'O vaso tem ar de um lado da membrana', 'e pouca água do outro.'],
               ['Água aquecida', 'A água dilata e entra no vaso; o ar se', 'comprime e a pressão quase não sobe.']], [AZUL, VERM])
    a.add(f'<rect x="30" y="140" width="200" height="90" fill="none" stroke="{METAL_E}" stroke-width="6"/>', f'<rect x="40" y="200" width="60" height="40" fill="#f6e3df" stroke="{QUENTE}" stroke-width="2"/>', t(70, 256, 'aquecedor', 10, CINZA, '400', 'middle'),
          f'<path d="M230 184 H262" stroke="{METAL_E}" stroke-width="6"/>', f'<rect x="262" y="104" width="44" height="120" rx="20" fill="#f4f7fa" stroke="{METAL_E}" stroke-width="2"/>', t(284, 98, 'vaso', 10, CINZA, '400', 'middle'),
          t(284, 130, 'ar', 12, TXT, '700', 'middle'))
    agua = lambda y: f'<rect x="264" y="{y}" width="40" height="{222 - y}" rx="16" fill="{AGUA}"/><path d="M264 {y} H304" stroke="{VERM}" stroke-width="3"/>'
    a.add(a.g({0}, agua(196) + pontos('M30 140 H230 V230 H30 Z', 6, 6, 3, AZUL) + t(130, 190, 'circuito fechado', 11, AZUL, '700', 'middle')))
    a.add(a.g({1}, f'<rect x="264" y="160" width="40" height="62" rx="16" fill="{AGUA}"><animate attributeName="y" values="196;160" dur="3s" begin="{a.fase(1)}" fill="freeze"/><animate attributeName="height" values="26;62" dur="3s" begin="{a.fase(1)}" fill="freeze"/></rect>'
                   + f'<path d="M264 160 H304" stroke="{VERM}" stroke-width="3"><animateTransform attributeName="transform" type="translate" values="0 36;0 0" dur="3s" begin="{a.fase(1)}" fill="freeze"/></path>'
                   + pontos('M30 140 H230 V230 H30 Z', 6, 6, 3, QUENTE) + t(130, 190, 'água dilatando', 11, VERM, '700', 'middle')))
    return a.svg('Desenho animado do vaso de expansão: com a água fria, o vaso tem ar de um lado da membrana e pouca água do outro; quando a água aquece e dilata, ela entra no vaso, o ar se comprime e a pressão do circuito quase não sobe.')


# ---------- hidrômetro ----------
def hidrometro():
    a = Anim(2, 12, h=258)
    a.legenda([['Consumo', 'A água gira a turbina e o relógio soma', 'os metros cúbicos que passaram.'],
               ['Tudo fechado e girando?', 'Se o relógio anda com todas as torneiras', 'fechadas, há vazamento na casa.']], [AZUL, VERM])
    a.add('<rect x="10" y="158" width="300" height="28" fill="#eef6fc"/><path d="M10 158 H110 M10 186 H110 M210 158 H310 M210 186 H310" stroke="' + METAL_E + '" stroke-width="3"/>',
          f'<circle cx="160" cy="172" r="52" fill="{CORPO}" stroke="{METAL_E}" stroke-width="3"/>', f'<rect x="124" y="104" width="72" height="22" rx="4" fill="#1d2b3a"/>', t(160, 98, 'm³', 10, CINZA, '400', 'middle'))
    turb = ''.join(f'<path d="M160 172 L160 140" stroke="{METAL_E}" stroke-width="5" transform="rotate({k * 60} 160 172)"/>' for k in range(6))
    digitos = lambda dur: ''.join(f'<text x="186" y="120" font-size="15" font-weight="700" fill="#7ee7f2" text-anchor="middle" opacity="0">{d}<animate attributeName="opacity" values="{";".join("1" if i == d else "0" for i in range(10))};0" keyTimes="{";".join(f"{i / 10:.1f}" for i in range(10))};1" dur="{dur}s" repeatCount="indefinite" calcMode="discrete"/></text>' for d in range(10))
    fixos = t(148, 120, '0012', 15, '#7ee7f2', '700', 'middle')
    a.add(fixos)
    a.add(a.g({0}, f'<g>{turb}{roda(160, 172, .6)}</g>' + digitos(5) + pontos('M10 172 H310', 6, 2.2)))
    a.add(a.g({1}, f'<g>{turb}{roda(160, 172, 4)}</g>' + digitos(40) + pontos('M10 172 H310', 2, 8, 2.4) + t(160, 250, 'vazamento escondido', 11, VERM, '700', 'middle')))
    return a.svg('Desenho animado do hidrômetro: a água gira a turbina e o relógio soma o volume; se o relógio anda com todas as torneiras fechadas, há vazamento na casa.')


TODOS = {
    'mat-bombas': ('Como funciona a bomba centrífuga', bomba()),
    'mat-pressurizadores': ('Como funciona o pressurizador', pressurizador()),
    'mat-caldeiras': ('Como funciona o aquecedor a gás de passagem', aquecedor_gas()),
    'mat-solar': ('Como funciona o aquecedor solar por termossifão', solar()),
    'mat-vasos-expansao': ('Como funciona o vaso de expansão', vaso_expansao()),
    'mat-hidrometros': ('Como funciona o hidrômetro', hidrometro()),
}
# Publicadas no site. 21/11/2026: o usuário quis ver primeiro só a bomba no ar; as outras aguardam aprovação.
PUBLICAR = ['mat-bombas']
FIGS = {k: v for k, v in TODOS.items() if k in PUBLICAR}
