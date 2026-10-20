// Ampliar fotos das galerias (.pfotos--zoom) e das fotos únicas do catálogo (.matfig--zoom):
// clique na foto abre a imagem grande, com legenda e créditos.
// Setas (ou ← →) passam entre as fotos da mesma galeria; Esc, × ou clique fora fecham.
// Funciona na página inicial (dentro da ficha) e nas páginas próprias das fichas.
(() => {
  let box, img, cap, count, fotos = [], i = 0;

  function build() {
    box = document.createElement('dialog');
    box.className = 'lbox';
    box.setAttribute('aria-label', 'Foto ampliada');
    box.innerHTML = `
      <button type="button" class="lbox__close" aria-label="Fechar">×</button>
      <button type="button" class="lbox__nav lbox__nav--prev" aria-label="Foto anterior">‹</button>
      <figure class="lbox__fig"><img alt=""><figcaption><b></b><span class="lbox__credit"></span><span class="lbox__count"></span></figcaption></figure>
      <button type="button" class="lbox__nav lbox__nav--next" aria-label="Próxima foto">›</button>`;
    document.body.appendChild(box);
    img = box.querySelector('img');
    cap = box.querySelector('figcaption b');
    count = box.querySelector('.lbox__count');
    box.querySelector('.lbox__close').addEventListener('click', () => box.close());
    box.querySelector('.lbox__nav--prev').addEventListener('click', () => show(i - 1));
    box.querySelector('.lbox__nav--next').addEventListener('click', () => show(i + 1));
    box.addEventListener('click', e => { if (e.target === box) box.close(); });   // clique fora da foto
    box.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  function show(n) {
    i = (n + fotos.length) % fotos.length;
    const f = fotos[i];
    img.src = f.src; img.alt = f.alt;
    cap.textContent = f.legenda;
    count.textContent = fotos.length > 1 ? `${i + 1} / ${fotos.length}` : '';
    box.querySelectorAll('.lbox__nav').forEach(b => { b.hidden = fotos.length < 2; });
  }

  function open(item) {
    if (item.classList.contains('matfig--zoom')) {   // foto única: a figura é o próprio item
      const im = item.querySelector('img');
      fotos = [{ src: im.currentSrc || im.src, alt: im.alt, legenda: item.dataset.legenda || '' }];
      if (!box) build();
      const fc = item.querySelector('figcaption');
      box.querySelector('.lbox__credit').innerHTML = fc ? fc.innerHTML.replace(/^[^<]*·\s*/, '') : '';
      show(0); box.showModal(); return;
    }
    const gallery = item.closest('.pfotos');
    const items = [...gallery.querySelectorAll('.pfotos__item')];
    fotos = items.map(el => {
      const im = el.querySelector('img');
      return { src: im.currentSrc || im.src, alt: im.alt, legenda: el.querySelector('span')?.textContent || '' };
    });
    if (!box) build();
    box.querySelector('.lbox__credit').innerHTML = gallery.querySelector('figcaption')?.innerHTML || '';
    show(items.indexOf(item));
    box.showModal();
  }

  document.addEventListener('click', e => {
    const item = e.target.closest('.pfotos--zoom .pfotos__item, .matfig--zoom');
    if (!item || e.target.closest('a')) return;   // links dos créditos continuam funcionando
    e.preventDefault();
    open(item);
  });
  // teclado: Enter ou espaço na foto também amplia
  document.addEventListener('keydown', e => {
    const item = e.target.closest && e.target.closest('.pfotos--zoom .pfotos__item, .matfig--zoom');
    if (!item || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    open(item);
  });
})();
