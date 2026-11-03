// ===== Idioma: Português / English (tradução automática do Google) =====
(() => {
  const btns = document.querySelectorAll('.lang__btn');
  const COOKIE = 'googtrans';
  const readLang = () => {
    const m = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    return m && decodeURIComponent(m[1]).endsWith('/en') ? 'en' : 'pt';
  };
  // O Google lê o cookie "googtrans" no domínio atual e no domínio principal
  const domains = () => {
    const h = location.hostname, parts = h.split('.');
    const list = [''];
    if (parts.length > 1 && !/^\d+(\.\d+){3}$/.test(h)) for (let i = 0; i < parts.length - 1; i++) list.push('.' + parts.slice(i).join('.'));
    return list;
  };
  const writeCookie = value => domains().forEach(d => {
    document.cookie = `${COOKIE}=${value};path=/${d ? ';domain=' + d : ''}${value ? '' : ';expires=Thu, 01 Jan 1970 00:00:00 GMT'}`;
  });
  const mark = lang => {
    btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
  };
  let loader;
  const loadTranslator = () => loader || (loader = new Promise(resolve => {
    window.googleTranslateElementInit = () => {
      new google.translate.TranslateElement({ pageLanguage: 'pt', includedLanguages: 'en,pt', autoDisplay: false }, 'google_translate_element');
      resolve(true);
    };
    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  }));
  const waitCombo = () => new Promise(resolve => {
    const t0 = Date.now();
    (function poll() {
      const c = document.querySelector('.goog-te-combo');
      if (c && c.options.length > 1) return resolve(c);
      if (Date.now() - t0 > 6000) return resolve(null);
      setTimeout(poll, 150);
    })();
  });
  async function toEnglish() {
    writeCookie('/pt/en');
    mark('en');
    const ok = await loadTranslator();
    if (!ok) { mark('pt'); writeCookie(''); (typeof toast === 'function' ? toast : alert)('Translation is unavailable right now. Please try again later.'); return; }
    const combo = await waitCombo();
    if (combo) { combo.value = 'en'; combo.dispatchEvent(new Event('change')); }
    else location.reload();
  }
  function toPortuguese() {
    writeCookie('');
    mark('pt');
    location.reload(); // volta ao texto original
  }
  btns.forEach(b => b.addEventListener('click', () => {
    if (b.dataset.lang === readLang() && b.getAttribute('aria-pressed') === 'true') return;
    b.dataset.lang === 'en' ? toEnglish() : toPortuguese();
  }));
  // Visitante que já escolheu inglês: traduz ao abrir
  const lang = readLang();
  mark(lang);
  if (lang === 'en') loadTranslator();
})();
