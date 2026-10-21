# PipeSystem — O Portal da Hidráulica

Site estático (HTML, CSS e JavaScript, sem dependências) do portal PipeSystem.

## Estrutura

- `site/` — o site: `index.html`, estilos, scripts e dados (produtos, sistemas, catálogo, normas e ferramentas) e imagens em `site/img/`.
- `scripts/build.mjs` — copia `site/` para `dist/`, a pasta publicada, e gera as páginas das fichas.
- `scripts/pages.mjs` — gera uma página própria para cada ficha (`/sistemas/<id>` e `/materiais/<id>`) a partir dos dados do site, e o `sitemap.xml` com todas as URLs e imagens. Basta editar os dados em `site/*.js`: as páginas são refeitas a cada publicação.
- `scripts/preview.mjs` — servidor local para conferir `dist/`.
- `vercel.json` — configuração do deploy na Vercel.

## Comandos

```bash
npm run build     # gera dist/
npm run preview   # abre dist/ em http://localhost:3000
```

## Preços SINAPI (Dimensionamento Inteligente)

O orçamento por estado usa o relatório de insumos do SINAPI (Caixa), sem desoneração.

- `site/sinapi-regras.js` — qual insumo SINAPI dá o preço de cada material da lista (editável).
- `site/sinapi-precos.js` — preços dos 27 estados, gerado; não edite à mão.

Para atualizar todo mês: baixe o pacote `SINAPI-AAAA-MM-formato-xlsx.zip` em [caixa.gov.br › Downloads › SINAPI Relatórios Mensais](https://www.caixa.gov.br/site/Paginas/downloads.aspx#categoria_888) e rode:

```bash
node scripts/sinapi.mjs caminho/SINAPI-AAAA-MM-formato-xlsx.zip
```

## Deploy

A Vercel executa `npm run build` e publica `dist/` a cada push na branch `main`.

## Créditos das imagens

As fotos de produtos, sistemas e materiais vêm do Wikimedia Commons, com licenças livres (CC0, domínio público, CC BY e CC BY-SA). Os créditos de cada foto aparecem no site, junto às imagens, e precisam ser mantidos.
