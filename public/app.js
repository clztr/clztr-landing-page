const app = document.getElementById('app');
const partials = [
  'boot',
  'coin-trade',
  'hostwizard',
  'createEvent',
  'event-creation',
  'mediaAssets',
  'publish',
  'mobile-access',
  'footer',
];

const initCoinTrade = () => {
  const root = document.getElementById('coin-trade');
  if (!root || window.__coinTradeInit) return;
  window.__coinTradeInit = true;

  const bg = document.getElementById('parallax-bg');
  const card = document.getElementById('card-1');

  if (bg) {
    window.addEventListener('mousemove', (e) => {
      const x = (window.innerWidth / 2 - e.pageX) / 45;
      const y = (window.innerHeight / 2 - e.pageY) / 45;
      bg.style.transform = `translateX(${x}px) translateY(${y}px) scale(1.05)`;
    });
  }

  if (card) {
    const handleTilt = (e) => {
      const rect = card.getBoundingClientRect();
      const cardX = rect.left + rect.width / 2;
      const cardY = rect.top + rect.height / 2;
      const mouseX = e.clientX - cardX;
      const mouseY = e.clientY - cardY;
      const rotateX = (mouseY / 20).toFixed(2);
      const rotateY = -(mouseX / 20).toFixed(2);
      card.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    card.addEventListener('mousemove', handleTilt);
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg)';
    });
  }

  const parseNumber = (value) => {
    const numeric = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(numeric);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const tickingEls = root.querySelectorAll('.animate-ticking');
  if (tickingEls.length) {
    tickingEls.forEach((el) => {
      const parsed = parseNumber(el.textContent || '');
      if (parsed !== null) {
        el.dataset.tickingValue = parsed.toString();
      }
    });

    setInterval(() => {
      tickingEls.forEach((el) => {
        const parsed = parseNumber(el.textContent || '');
        const base = Number.isFinite(parsed)
          ? parsed
          : parseFloat(el.dataset.tickingValue || '');
        if (!Number.isFinite(base)) return;
        const next = base + (Math.random() - 0.3) * 10;
        el.textContent = next.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
        el.dataset.tickingValue = next.toString();
      });
    }, 100);
  }
};

const initPublishPricing = () => {
  const root = document.getElementById('publish-publish');
  if (!root || window.__publishInit) return;
  window.__publishInit = true;

  const priceInput = root.querySelector('[data-price-input]');
  const depositValue = root.querySelector('[data-deposit-value]');
  const depositCurrency = root.querySelector('[data-deposit-currency]');
  const currencyButtons = Array.from(root.querySelectorAll('[data-currency]'));
  const feePills = Array.from(root.querySelectorAll('[data-fee-pill]'));
  const feeValue = root.querySelector('[data-fee-value]');
  const feeRate = root.querySelector('[data-fee-rate]');
  const feeCurrency = root.querySelector('[data-fee-currency]');

  if (!priceInput || !depositValue || !depositCurrency || !currencyButtons.length) {
    return;
  }

  const format = (value) => (Number.isFinite(value) ? value.toFixed(2) : '0.00');

  let activeCurrency = 'USDC';
  const formatRate = (rate) => {
    const pct = rate * 100;
    return Number.isInteger(pct) ? `${pct}%` : `${pct}%`;
  };

  const updatePricing = () => {
    const price = parseFloat(priceInput.value);
    const deposit = Number.isFinite(price) ? price * 2 : 0;
    const rate = activeCurrency === 'CLZTR' ? 0.025 : 0.05;
    const fee = Number.isFinite(price) ? price * rate : 0;
    depositValue.textContent = format(deposit);
    if (feeValue) feeValue.textContent = format(fee);
    if (feeRate) feeRate.textContent = formatRate(rate);
    if (feeCurrency) feeCurrency.textContent = activeCurrency;
  };

  const setCurrency = (currency) => {
    activeCurrency = currency;
    depositCurrency.textContent = currency;
    currencyButtons.forEach((btn) => {
      const isActive = btn.dataset.currency === currency;
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.classList.toggle('bg-gray-800', isActive);
      btn.classList.toggle('text-white', isActive);
      btn.classList.toggle('border-gray-600', isActive);
      btn.classList.toggle('shadow-sm', isActive);
      btn.classList.toggle('text-gray-500', !isActive);
      btn.classList.toggle('border-transparent', !isActive);
      btn.classList.toggle('hover:text-white', !isActive);
      btn.classList.toggle('hover:bg-gray-900', !isActive);
    });
    feePills.forEach((pill) => {
      const isActive = pill.dataset.feePill === currency;
      pill.classList.toggle('ring-1', isActive);
      pill.classList.toggle('ring-white/20', isActive);
      pill.classList.toggle('opacity-100', isActive);
      pill.classList.toggle('opacity-50', !isActive);
    });
    updatePricing();
  };

  priceInput.addEventListener('input', updatePricing);
  currencyButtons.forEach((btn) => {
    btn.addEventListener('click', () => setCurrency(btn.dataset.currency));
  });

  const defaultCurrency =
    currencyButtons.find((btn) => btn.getAttribute('aria-pressed') === 'true')
      ?.dataset.currency || currencyButtons[0].dataset.currency;

  setCurrency(defaultCurrency);
  updatePricing();
};

const I18N_STORAGE_KEY = 'clztr:lang';
const SUPPORTED_LANGS = ['en', 'es', 'pt', 'ar', 'fr', 'zh', 'ja', 'ko'];
const RTL_LANGS = new Set(['ar']);
const GEO_TIMEOUT_MS = 1500;
const LANGUAGE_LABELS = {
  en: 'English',
  es: 'Spanish',
  pt: 'Portuguese',
  ar: 'Arabic',
  fr: 'French',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
};
const LANGUAGE_SHORT_LABELS = {
  en: 'EN',
  es: 'ES',
  pt: 'PT',
  ar: 'AR',
  fr: 'FR',
  zh: 'ZH',
  ja: 'JA',
  ko: 'KO',
};
const GEO_PROVIDERS = [
  {
    url: 'https://ipapi.co/json/',
    getCountryCode: (data) => data?.country_code || data?.country,
  },
  {
    url: 'https://ipwho.is/?fields=country_code',
    getCountryCode: (data) => data?.country_code,
  },
];
const COUNTRY_LANGS = {
  zh: ['CN', 'HK', 'MO', 'TW'],
  ja: ['JP'],
  ko: ['KR', 'KP'],
  fr: ['FR', 'BE', 'CH', 'LU', 'MC'],
  es: [
    'ES',
    'MX',
    'AR',
    'CO',
    'CL',
    'PE',
    'VE',
    'EC',
    'GT',
    'CU',
    'BO',
    'DO',
    'HN',
    'PY',
    'SV',
    'NI',
    'CR',
    'PA',
    'UY',
    'PR',
  ],
  pt: ['PT', 'BR', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'],
  ar: [
    'AE',
    'SA',
    'EG',
    'IQ',
    'JO',
    'KW',
    'LB',
    'LY',
    'MA',
    'OM',
    'QA',
    'SD',
    'SY',
    'TN',
    'YE',
    'DZ',
    'BH',
    'PS',
    'MR',
    'SO',
    'DJ',
    'KM',
  ],
};
const i18nState = {
  en: null,
  cache: {},
  current: 'en',
  originals: new WeakMap(),
  attrOriginals: new WeakMap(),
};
let languageModalState = null;

const normalizeText = (value) => (value ? value.replace(/\s+/g, ' ').trim() : '');

const getOriginalText = (node) => {
  if (!i18nState.originals.has(node)) {
    i18nState.originals.set(node, node.nodeValue);
  }
  return i18nState.originals.get(node);
};

const getOriginalAttr = (el, attr) => {
  let store = i18nState.attrOriginals.get(el);
  if (!store) {
    store = {};
    i18nState.attrOriginals.set(el, store);
  }
  if (!(attr in store)) {
    store[attr] = el.getAttribute(attr);
  }
  return store[attr];
};

const persistLanguage = (lang) => {
  try {
    localStorage.setItem(I18N_STORAGE_KEY, lang);
  } catch (err) {
    // ignore storage errors
  }
};

const getStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(I18N_STORAGE_KEY);
    if (SUPPORTED_LANGS.includes(stored)) return stored;
  } catch (err) {
    // ignore storage errors
  }
  return null;
};

const fetchJsonWithTimeout = async (url, timeoutMs) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Geo request failed: ${res.status}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timeoutId);
  }
};

const mapCountryToLang = (code) => {
  if (!code) return null;
  const upper = String(code).toUpperCase();
  for (const [lang, countries] of Object.entries(COUNTRY_LANGS)) {
    if (countries.includes(upper)) return lang;
  }
  return null;
};

const resolveGeoLanguage = async () => {
  for (const provider of GEO_PROVIDERS) {
    try {
      const data = await fetchJsonWithTimeout(provider.url, GEO_TIMEOUT_MS);
      const countryCode = provider.getCountryCode(data);
      const lang = mapCountryToLang(countryCode);
      if (lang) return lang;
      if (countryCode) return null;
    } catch (err) {
      // ignore provider errors and try next
    }
  }
  return null;
};

const resolveLanguage = async () => {
  const stored = getStoredLanguage();
  if (stored) return { lang: stored, fromStorage: true };

  const geoLang = await resolveGeoLanguage();
  if (SUPPORTED_LANGS.includes(geoLang)) {
    return { lang: geoLang, fromStorage: false };
  }

  return { lang: 'en', fromStorage: false };
};

const loadLocale = async (lang) => {
  if (i18nState.cache[lang]) return i18nState.cache[lang];
  const res = await fetch(`locales/${lang}.json`);
  if (!res.ok) {
    throw new Error(`Missing locale: ${lang}.json`);
  }
  const data = await res.json();
  i18nState.cache[lang] = data;
  return data;
};

const buildTranslationMap = (langMap) => {
  const map = new Map();
  Object.entries(i18nState.en || {}).forEach(([key, enText]) => {
    const normalized = normalizeText(enText);
    if (!normalized) return;
    const translated = langMap?.[key];
    map.set(normalized, translated && translated.trim() ? translated : enText);
  });
  return map;
};

const applyLanguage = (lang) => {
  if (!app || !i18nState.en) return;
  const langMap = i18nState.cache[lang] || {};
  const translationMap = buildTranslationMap(langMap);
  const iconSelector =
    '.material-symbols-outlined, .material-symbols-rounded, .material-symbols-sharp, .material-icons, .material-icons-outlined, .material-icons-round, .material-icons-sharp';

  const walker = document.createTreeWalker(
    app,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest('[data-i18n-ignore]')) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest(iconSelector)) {
          return NodeFilter.FILTER_REJECT;
        }
        const original = getOriginalText(node);
        return normalizeText(original)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    },
    false
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const original = getOriginalText(node);
    const normalized = normalizeText(original);
    const replacement = translationMap.get(normalized);
    if (!replacement) continue;
    const currentNormalized = normalizeText(node.nodeValue);
    const replacementNormalized = normalizeText(replacement);
    if (currentNormalized === replacementNormalized) continue;
    const leading = original.match(/^\s*/)?.[0] ?? '';
    const trailing = original.match(/\s*$/)?.[0] ?? '';
    node.nodeValue = `${leading}${replacement}${trailing}`;
  }

  const attrTargets = app.querySelectorAll('[aria-label], [alt], [title], [placeholder]');
  attrTargets.forEach((el) => {
    if (el.closest('[data-i18n-ignore]') || el.closest(iconSelector)) {
      return;
    }
    ['aria-label', 'alt', 'title', 'placeholder'].forEach((attr) => {
      const original = getOriginalAttr(el, attr);
      const normalized = normalizeText(original);
      if (!normalized) return;
      const replacement = translationMap.get(normalized);
      if (!replacement) return;
      const current = el.getAttribute(attr);
      if (normalizeText(current) === normalizeText(replacement)) return;
      el.setAttribute(attr, replacement);
    });
  });

  document.documentElement.lang = lang;
  document.documentElement.dir = RTL_LANGS.has(lang) ? 'rtl' : 'ltr';
  i18nState.current = lang;
  updateLanguageButtons(lang);
  updateLanguageLabel(lang);
};

const updateLanguageButtons = (lang) => {
  const buttons = document.querySelectorAll('[data-lang]');
  buttons.forEach((btn) => {
    const isActive = btn.dataset.lang === lang;
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    btn.classList.toggle('bg-gray-900', isActive);
    btn.classList.toggle('text-white', isActive);
    btn.classList.toggle('border-primary/60', isActive);
  });
};

const updateLanguageLabel = (lang) => {
  const labelEl = document.querySelector('[data-language-label]');
  const shortEl = document.querySelector('[data-language-label-short]');
  if (!labelEl) return;
  const label = LANGUAGE_LABELS[lang] || LANGUAGE_LABELS.en;
  const shortLabel = LANGUAGE_SHORT_LABELS[lang] || LANGUAGE_SHORT_LABELS.en;
  labelEl.textContent = label;
  if (shortEl) shortEl.textContent = shortLabel;
};

const setLanguage = async (lang) => {
  const target = SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  await loadLocale('en');
  await loadLocale(target);
  applyLanguage(target);
  persistLanguage(target);
};

const initI18n = async () => {
  if (window.__i18nInit) return;
  window.__i18nInit = true;
  i18nState.en = await loadLocale('en');

  document.querySelectorAll('[data-lang]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      await setLanguage(btn.dataset.lang);
      if (languageModalState?.modal?.contains(btn)) {
        closeLanguageModal();
      }
    });
  });

  const resolved = await resolveLanguage();
  await loadLocale(resolved.lang);
  applyLanguage(resolved.lang);
  if (!resolved.fromStorage) {
    persistLanguage(resolved.lang);
  }
};

const openLanguageModal = () => {
  if (!languageModalState) return;
  const { modal, openButton } = languageModalState;
  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  if (scrollBarWidth > 0) {
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }
  modal.classList.remove('hidden');
  document.body.classList.add('overflow-hidden');
  openButton?.setAttribute('aria-expanded', 'true');
};

const closeLanguageModal = () => {
  if (!languageModalState) return;
  const { modal, openButton } = languageModalState;
  modal.classList.add('hidden');
  document.body.classList.remove('overflow-hidden');
  document.body.style.paddingRight = '';
  openButton?.setAttribute('aria-expanded', 'false');
};

const initLanguageModal = () => {
  if (window.__langModalInit) return;
  window.__langModalInit = true;
  const modal = document.getElementById('language-modal');
  const openButton = document.getElementById('language-open');
  if (!modal || !openButton) return;
  const overlay = modal.querySelector('[data-modal-overlay]');
  const closeButtons = modal.querySelectorAll('[data-modal-close]');
  languageModalState = { modal, openButton };

  openButton.addEventListener('click', openLanguageModal);
  overlay?.addEventListener('click', closeLanguageModal);
  closeButtons.forEach((btn) => btn.addEventListener('click', closeLanguageModal));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!modal.classList.contains('hidden')) {
      closeLanguageModal();
    }
  });
};

const initNav = () => {
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav || window.__navInit) return;
  window.__navInit = true;

  const closeNav = () => {
    mobileNav.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = !mobileNav.classList.contains('hidden');
    if (isOpen) {
      closeNav();
      return;
    }
    mobileNav.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });
};

const initFooterYear = () => {
  const yearEl = document.querySelector('[data-year]');
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
};

const initWhenVisible = (selector, init) => {
  const el = document.querySelector(selector);
  if (!el) return;
  if (!('IntersectionObserver' in window)) {
    init();
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        init();
        obs.unobserve(entry.target);
      });
    },
    { rootMargin: '200px' }
  );
  observer.observe(el);
};

const renderApp = async () => {
  try {
    const hasPrerender = app && app.children.length > 0;
    if (hasPrerender) {
      initLanguageModal();
      await initI18n();
      initNav();
      initWhenVisible('#coin-trade', initCoinTrade);
      initWhenVisible('#publish-publish', initPublishPricing);
      initFooterYear();
      return;
    }

    await Promise.all(
      partials.map(async (name) => {
        const res = await fetch(`components/${name}.hbs`);
        if (!res.ok) {
          throw new Error(`Missing partial: ${name}.hbs`);
        }
        const source = await res.text();
        Handlebars.registerPartial(name, source);
      })
    );

    const templateSource = document.getElementById('app-template').innerHTML;
    const template = Handlebars.compile(templateSource);
    app.innerHTML = template({});
    initLanguageModal();
    await initI18n();
    initNav();
    initWhenVisible('#coin-trade', initCoinTrade);
    initWhenVisible('#publish-publish', initPublishPricing);
    initFooterYear();
  } catch (err) {
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center p-6">
        <div class="max-w-xl text-center">
          <h1 class="text-2xl font-display italic text-white mb-2">Render Error</h1>
          <p class="text-sm text-red-400 font-mono mb-4">${err.message}</p>
          <p class="text-xs text-gray-500 font-mono">
            If you opened this file via <span class="text-gray-300">file://</span>,
            start a local server so fetch() can load partials.
          </p>
        </div>
      </div>
    `;
  }
};

renderApp();
