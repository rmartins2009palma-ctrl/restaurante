(() => {
  'use strict';

  const I18N = window.I18N || {};
  const LANGS = ['ca', 'es', 'en', 'de'];
  const LOCALE = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB', de: 'de-DE' };
  const has = (obj, key) => Object.prototype.hasOwnProperty.call(obj || {}, key);

  /* Horario: martes (2) a sábado (6), de 19:00 a 24:00, hora de Mallorca */
  const OPEN_DAYS = [2, 3, 4, 5, 6];
  const OPEN_HOUR = 19;
  const TIME_ZONE = 'Europe/Madrid';

  let lang = 'es';

  /* ---------- Idioma -------------------------------------------------- */
  const textNodes = [...document.querySelectorAll('[data-i18n]')];
  const attrNodes = [...document.querySelectorAll('[data-i18n-attr]')];

  // Guardamos el español original del HTML para poder volver a él
  textNodes.forEach((el) => { el.dataset.i18nEs = el.textContent; });
  attrNodes.forEach((el) => {
    el.dataset.i18nAttrEs = el.dataset.i18nAttr.split(',').map((pair) => {
      const [attr] = pair.split(':');
      return `${attr}=${el.getAttribute(attr) || ''}`;
    }).join('\u0001');
  });

  const t = (key) => (I18N[lang] && I18N[lang][key]) || (I18N.es && I18N.es[key]) || '';

  function applyLang(next) {
    lang = LANGS.includes(next) ? next : 'es';
    document.documentElement.lang = lang;

    // Un texto vacío en el diccionario oculta el elemento
    // (p. ej. la traducción del titular cuando la página ya está en mallorquín)
    textNodes.forEach((el) => {
      const key = el.dataset.i18n;
      el.textContent = lang !== 'es' && has(I18N[lang], key) ? I18N[lang][key] : el.dataset.i18nEs;
    });

    attrNodes.forEach((el) => {
      const originals = Object.fromEntries(el.dataset.i18nAttrEs.split('\u0001').map((s) => {
        const i = s.indexOf('=');
        return [s.slice(0, i), s.slice(i + 1)];
      }));
      el.dataset.i18nAttr.split(',').forEach((pair) => {
        const [attr, key] = pair.split(':');
        const value = lang === 'es' ? originals[attr] : (I18N[lang] && I18N[lang][key]);
        el.setAttribute(attr, value || originals[attr]);
      });
    });

    // Precios con el formato de cada idioma
    const money = new Intl.NumberFormat(LOCALE[lang], { style: 'currency', currency: 'EUR' });
    document.querySelectorAll('[data-price]').forEach((el) => {
      el.textContent = money.format(Number(el.dataset.price));
    });

    document.querySelectorAll('.lang button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });

    // El idioma queda en la URL para poder compartir el enlace
    const url = new URL(window.location.href);
    if (lang === 'es') url.searchParams.delete('lang'); else url.searchParams.set('lang', lang);
    window.history.replaceState(null, '', url);

    try { localStorage.setItem('lang', lang); } catch (e) { /* almacenamiento no disponible */ }

    updateToggleLabel();
    renderStatus();
  }

  function initialLang() {
    const fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.includes(fromUrl)) return fromUrl;
    try {
      const saved = localStorage.getItem('lang');
      if (LANGS.includes(saved)) return saved;
    } catch (e) { /* sin almacenamiento */ }
    // Idioma del navegador: mallorquín/catalán, español, inglés o alemán.
    // Para cualquier otro idioma extranjero, inglés.
    const prefs = navigator.languages || [];
    for (const l of prefs) {
      const base = l.slice(0, 2).toLowerCase();
      if (LANGS.includes(base)) return base;
    }
    return prefs.length ? 'en' : 'es';
  }

  document.querySelectorAll('.lang button').forEach((b) => {
    b.addEventListener('click', () => applyLang(b.dataset.lang));
  });

  /* ---------- Abierto / cerrado -------------------------------------- */
  function madridNow() {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TIME_ZONE, weekday: 'short', hour: 'numeric', hourCycle: 'h23'
    }).formatToParts(new Date());
    const get = (type) => parts.find((p) => p.type === type).value;
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
    return { day, hour: Number(get('hour')) };
  }

  function dayName(day) {
    // 7 de enero de 2024 fue domingo
    return new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(2024, 0, 7 + day)));
  }

  function renderStatus() {
    const status = document.querySelector('.status');
    const text = document.querySelector('[data-status]');
    if (!status || !text) return;

    const { day, hour } = madridNow();
    const openToday = OPEN_DAYS.includes(day);
    let message;
    let isOpen = false;

    if (openToday && hour >= OPEN_HOUR) {
      message = t('statusOpen');
      isOpen = true;
    } else if (openToday) {
      message = t('statusLater');
    } else {
      let offset = 1;
      while (!OPEN_DAYS.includes((day + offset) % 7)) offset += 1;
      const next = (day + offset) % 7;
      message = offset === 1 ? t('statusTomorrow') : t('statusNext').replace('{day}', dayName(next));
    }

    text.textContent = message;
    status.dataset.open = String(isOpen);

    document.querySelectorAll('.hours tr').forEach((row) => {
      const isToday = Number(row.dataset.day) === day;
      row.classList.toggle('is-today', isToday);
      const th = row.querySelector('th');
      if (isToday) th.setAttribute('data-today-label', t('todayLabel'));
      else th.removeAttribute('data-today-label');
    });
  }

  /* ---------- Menú móvil --------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');

  function updateToggleLabel() {
    if (!toggle) return;
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-label', t(open ? 'menuClose' : 'menuOpen'));
  }

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    updateToggleLabel();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Mapa: solo se carga si se pide ---------------------- */
  const mapButton = document.querySelector('.map-load');
  if (mapButton) {
    mapButton.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = mapButton.dataset.mapSrc;
      iframe.title = t('mapTitle');
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapButton.replaceWith(iframe);
    });
  }

  /* ---------- Fotos: fundido al cargar y cortina al hacer scroll --- */
  const root = document.documentElement;
  root.dataset.ready = '1';   // avisa al script de la cabecera de que todo ha cargado

  document.querySelectorAll('.foto img, .arc img, .taula-redona img').forEach((img) => {
    const done = () => img.classList.add('is-loaded');
    if (img.complete && img.naturalWidth) done();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });

  if (root.classList.contains('js-reveal')) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  }

  /* ---------- Año del pie ----------------------------------------- */
  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  applyLang(initialLang());
  setInterval(renderStatus, 60 * 1000);
})();
