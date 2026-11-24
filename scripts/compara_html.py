# Prova de que uma mudança de visual não alterou a estrutura do site.
# Compara o HTML de TODAS as páginas geradas (dist/) com uma cópia de referência
# tirada antes da mudança. A única diferença aceita é a linha que liga a folha de
# estilo do tema (tema-claro.css / home.css). Qualquer outra diferença (texto, link,
# título, URL, seção) é listada e o script termina com erro.
#
# Uso:
#   1. antes de mudar:  copie as páginas de dist/ para estudos/referencia-html/
#   2. depois do build: python -I scripts/compara_html.py
import difflib, pathlib, re, sys

raiz = pathlib.Path(__file__).resolve().parents[1]
ref, novo = raiz / 'estudos' / 'referencia-html', raiz / 'dist'
TEMA = re.compile(r'<link rel="stylesheet" href="/?(tema-claro|home)\.css[^"]*">[^\n]*')

def limpa(p):
    return [l for l in (TEMA.sub('', x).rstrip() for x in p.read_text(encoding='utf-8').splitlines()) if l.strip()]

paginas_ref = {p.relative_to(ref).as_posix() for p in ref.rglob('*.html')}
paginas_novo = {p.relative_to(novo).as_posix() for p in novo.rglob('*.html') if not p.relative_to(novo).as_posix().startswith('redesign/')}
problemas = []
for p in sorted(paginas_ref - paginas_novo): problemas.append(f'SUMIU: {p}')
for p in sorted(paginas_novo - paginas_ref): problemas.append(f'NOVA: {p}')
com_tema = 0
for p in sorted(paginas_ref & paginas_novo):
    a, b = limpa(ref / p), limpa(novo / p)
    if TEMA.search((novo / p).read_text(encoding='utf-8')): com_tema += 1
    if a != b:
        dif = [l for l in difflib.unified_diff(a, b, lineterm='', n=0) if l[:1] in '+-' and l[:3] not in ('+++', '---')]
        problemas.append(f'MUDOU: {p}\n    ' + '\n    '.join(x[:160] for x in dif[:6]))
if (ref / 'sitemap.xml').exists() and (ref / 'sitemap.xml').read_text(encoding='utf-8') != (novo / 'sitemap.xml').read_text(encoding='utf-8'):
    problemas.append('MUDOU: sitemap.xml')

print(f'{len(paginas_ref & paginas_novo)} páginas comparadas; {com_tema} com o tema claro ligado.')
if problemas:
    print(f'{len(problemas)} diferença(s) além da linha do tema:')
    print('\n'.join(problemas[:40]))
    sys.exit(1)
print('OK: nenhuma diferença de estrutura, texto, link, título ou URL. Só a linha do tema mudou.')
