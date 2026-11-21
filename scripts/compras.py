# Radar de Compras Públicas (/compras-publicas): o que o governo federal compra dos materiais do catálogo.
# Fonte: notas fiscais eletrônicas (NF-e) do Portal da Transparência (dados abertos, um arquivo .zip por mês):
#   https://portaldatransparencia.gov.br/download-de-dados/notas-fiscais/AAAAMM
# Uso (na pasta do projeto):
#   python -I scripts/compras.py <pasta com os AAAAMM_NFe.zip>
# Lê os NCMs de cada ficha em site/importacoes-dados.json e grava site/compras-dados.json, já agregado por ficha.
import csv, io, json, os, re, sys, zipfile, glob
from collections import defaultdict
from statistics import median

pasta = sys.argv[1]
IMP = json.load(open('site/importacoes-dados.json', encoding='utf-8'))
MAT = {k: v['ncm'] for k, v in IMP['materiais'].items()}
NCM = {n for v in MAT.values() for n in v}

def venda(c):  # só vendas efetivas (sem devolução, remessa ou simples faturamento de entrega futura)
    return bool(re.match(r'^[567]1\d\d$', c) or re.match(r'^[567]40[1-5]$', c))

def num(s):
    try: return float(s.replace('.', '').replace(',', '.'))
    except ValueError: return 0.0

itens, vistos = [], set()
for zp in sorted(glob.glob(os.path.join(pasta, '*_NFe.zip'))):
    z = zipfile.ZipFile(zp)
    nome = next(x for x in z.namelist() if x.endswith('_NotaFiscalItem.csv'))
    with z.open(nome) as f:
        r = csv.reader(io.TextIOWrapper(f, encoding='latin-1', newline=''), delimiter=';', quotechar='"'); next(r)
        for x in r:
            if len(x) < 31 or x[24] not in NCM or not venda(x[26]): continue
            if (x[0], x[22]) in vistos: continue
            vistos.add((x[0], x[22]))
            d, m, y = x[5][:10].split('/')
            doc = re.sub(r'\D', '', x[6])
            # Emitente pessoa física (CPF): o nome não é publicado
            forn = (x[7].strip() if len(doc) == 14 else 'Pessoa física (nome não divulgado)', x[9], x[10].title() if len(doc) == 14 else '')
            sup = x[12] if x[12] and not x[12].startswith('Sem inf') else ''
            org = x[14] if x[14] and not x[14].startswith('Sem inf') else ''
            comp = (x[16].strip(), sup, x[17])
            itens.append({'ch': x[0], 'd': f'{y}-{m}-{d}', 'f': forn, 'c': comp, 'org': org, 'ncm': x[24], 'desc': x[23].strip()[:90],
                          'q': num(x[27]), 'un': x[28].strip().upper()[:6], 'vu': num(x[29]), 'v': num(x[30])})
    print(os.path.basename(zp), len(itens), flush=True)

meses = sorted({i['d'][:7] for i in itens})
por_ncm = defaultdict(list)
for i in itens: por_ncm[i['ncm']].append(i)

def agrega(ncms):
    L = [i for n in ncms for i in por_ncm.get(n, [])]
    if not L: return None
    tot = sum(i['v'] for i in L)
    notas = {i['ch'] for i in L}
    serie = defaultdict(lambda: [0.0, set()])
    for i in L: s = serie[i['d'][:7]]; s[0] += i['v']; s[1].add(i['ch'])
    def top(chave, n=12):
        acc = defaultdict(lambda: [0.0, set()])
        for i in L: a = acc[chave(i)]; a[0] += i['v']; a[1].add(i['ch'])
        return [list(k) + [round(v[0], 2), len(v[1])] for k, v in sorted(acc.items(), key=lambda kv: -kv[1][0])[:n]]
    precos = defaultdict(list)
    for i in L:
        if i['vu'] > 0 and i['un']: precos[i['un']].append(i['vu'])
    pr = []
    for un, vs in sorted(precos.items(), key=lambda kv: -len(kv[1]))[:3]:
        vs.sort(); k = len(vs)
        pr.append([un, k, round(vs[k // 4], 2), round(median(vs), 2), round(vs[(3 * k) // 4], 2)])
    ult = sorted(L, key=lambda i: (i['d'], i['v']), reverse=True)[:15]
    return {
        'v': round(tot, 2), 'n': len(notas), 'it': len(L),
        'nc': len({i['c'] for i in L}), 'nf': len({i['f'] for i in L}),
        's': [[m, round(serie[m][0], 2), len(serie[m][1])] for m in meses],
        'comp': top(lambda i: i['c']), 'sup': top(lambda i: (i['c'][1],), 8),
        'forn': top(lambda i: i['f']), 'ufc': top(lambda i: (i['c'][2],), 27), 'uff': top(lambda i: (i['f'][1],), 27),
        'pr': pr,
        'ult': [[i['d'], i['desc'], i['q'], i['un'], i['vu'], i['v'], i['f'][0], i['c'][0], i['c'][2]] for i in ult],
    }

grupos, mats = {}, {}
for mid, ncms in MAT.items():
    k = ','.join(sorted(ncms))
    if k not in grupos: grupos[k] = agrega(sorted(ncms))
    if grupos[k]: mats[mid] = k
geral = agrega(sorted(NCM))
saida = {'fonte': 'Portal da Transparência (CGU): notas fiscais eletrônicas destinadas a órgãos do governo federal',
         'meses': meses, 'geral': geral, 'grupos': {k: v for k, v in grupos.items() if v}, 'materiais': mats,
         'ncmPorMat': {m: MAT[m] for m in mats}}
json.dump(saida, open('site/compras-dados.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('Gravado site/compras-dados.json:', len(itens), 'itens,', len(mats), 'fichas,', os.path.getsize('site/compras-dados.json') // 1024, 'KB')
