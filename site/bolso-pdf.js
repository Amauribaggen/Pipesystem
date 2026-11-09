// PipeSystem Pro: monta um PDF no próprio aparelho, sem internet e sem biblioteca externa.
// Blocos: { h: 'título' }, { p: 'parágrafo' }, { img: Uint8Array(JPEG), w, h, legenda }.
const BolsoPDF = (() => {
  const A4 = [595, 842], M = 40, LARG = A4[0] - 2 * M;
  // Caracteres fora do Latin-1 viram equivalentes simples, porque a fonte padrão do PDF usa WinAnsi
  const limpa = s => String(s).replace(/[≈]/g, '~').replace(/[≤]/g, '<=').replace(/[≥]/g, '>=').replace(/[–—]/g, '-').replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff]/g, '?');
  const esc = s => limpa(s).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  const quebra = (t, corpo) => {
    const max = Math.floor(LARG / (corpo * 0.5)), saida = [];
    String(t).split('\n').forEach(par => {
      let linha = '';
      par.split(' ').forEach(p => {
        while (p.length > max) { if (linha) { saida.push(linha); linha = ''; } saida.push(p.slice(0, max)); p = p.slice(max); }
        if ((linha + ' ' + p).trim().length > max) { saida.push(linha); linha = p; } else linha = (linha + ' ' + p).trim();
      });
      saida.push(linha);
    });
    return saida;
  };
  const bytes = s => { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b; };

  function gerar(blocos, rodape) {
    const paginas = [[]], fotos = [];
    let y = A4[1] - M;
    const pag = () => paginas[paginas.length - 1];
    const nova = () => { paginas.push([]); y = A4[1] - M; };
    const texto = (s, corpo, fonte) => {
      quebra(s, corpo).forEach(l => {
        if (y - corpo < M + 24) nova();
        y -= corpo * 1.35;
        pag().push(`BT /${fonte} ${corpo} Tf ${M} ${y.toFixed(1)} Td (${esc(l)}) Tj ET`);
      });
    };
    blocos.forEach(b => {
      if (b.h) { y -= 8; if (y < M + 80) nova(); texto(b.h, 14, 'F2'); y -= 4; }
      else if (b.p !== undefined) { texto(b.p, 10.5, 'F1'); y -= 3; }
      else if (b.img) {
        let w = Math.min(LARG, 360), h = w * b.h_ / b.w;
        if (h > 400) { h = 400; w = h * b.w / b.h_; }
        if (y - h < M + 40) nova();
        y -= h;
        fotos.push(b);
        pag().push(`q ${w.toFixed(1)} 0 0 ${h.toFixed(1)} ${M} ${y.toFixed(1)} cm /Im${fotos.length} Do Q`);
        y -= 4;
        if (b.legenda) texto(b.legenda, 9, 'F1');
        y -= 8;
      }
    });

    // Objetos: 1 catálogo, 2 páginas, 3 e 4 fontes, depois fotos, conteúdos e páginas
    const objs = [], add = c => { objs.push(c); return objs.length; };
    add(null); add(null);
    const F1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
    const F2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    const ims = fotos.map(f => add({ dic: `<< /Type /XObject /Subtype /Image /Width ${f.w} /Height ${f.h_} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${f.img.length} >>`, dados: f.img }));
    const xo = ims.length ? `/XObject << ${ims.map((n, i) => `/Im${i + 1} ${n} 0 R`).join(' ')} >>` : '';
    const kids = paginas.map((p, i) => {
      const fim = `BT /F1 8 Tf ${M} 24 Td (${esc(`${rodape}  -  pagina ${i + 1} de ${paginas.length}`)}) Tj ET`;
      const cont = bytes(limpa(p.concat(fim).join('\n')));
      const c = add({ dic: `<< /Length ${cont.length} >>`, dados: cont });
      return add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${A4[0]} ${A4[1]}] /Contents ${c} 0 R /Resources << /Font << /F1 ${F1} 0 R /F2 ${F2} 0 R >> ${xo} >> >>`);
    });
    objs[0] = '<< /Type /Catalog /Pages 2 0 R >>';
    objs[1] = `<< /Type /Pages /Count ${kids.length} /Kids [${kids.map(k => k + ' 0 R').join(' ')}] >>`;

    // Monta o arquivo, guardando a posição de cada objeto para a tabela final
    const partes = [], pos = [];
    let total = 0;
    const put = x => { const b = typeof x === 'string' ? bytes(x) : x; partes.push(b); total += b.length; };
    put('%PDF-1.4\n');
    objs.forEach((o, i) => {
      pos.push(total);
      put(`${i + 1} 0 obj\n`);
      if (typeof o === 'string') put(o + '\n');
      else { put(o.dic + '\nstream\n'); put(o.dados); put('\nendstream\n'); }
      put('endobj\n');
    });
    const xref = total;
    put(`xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + pos.map(p => String(p).padStart(10, '0') + ' 00000 n \n').join(''));
    put(`trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    const saida = new Uint8Array(total);
    let n = 0;
    partes.forEach(b => { saida.set(b, n); n += b.length; });
    return saida;
  }
  return { gerar };
})();
if (typeof module !== 'undefined') module.exports = BolsoPDF;
