import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import { DEFAULT_LANGUAGE, LANGUAGES } from './languages.js';

const STORAGE_KEY = 'lang';
const SUPPORTED = LANGUAGES.map((l) => l.code);

/** Saved choice, else English (owner decision: always English first, no browser detection). */
function initialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED.includes(saved)) return saved;
  } catch {
    /* storage unavailable */
  }
  return DEFAULT_LANGUAGE;
}

/** Loads non-English locale files on demand, so each visitor downloads one language only. */
const lazyBackend = {
  type: /** @type {const} */ ('backend'),
  init() {},
  /** @param {string} lng @param {string} _ns @param {(err: unknown, data: unknown) => void} cb */
  read(lng, _ns, cb) {
    import(`./locales/${lng}.json`).then(
      (m) => cb(null, m.default),
      (err) => cb(err, null),
    );
  },
};

i18n
  .use(lazyBackend)
  .use(initReactI18next)
  .init({
    lng: initialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED,
    load: 'currentOnly',
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    interpolation: { escapeValue: false }, // React already escapes
  });

/** @param {string} lng */
function syncDocument(lng) {
  document.documentElement.lang = lng;
}
syncDocument(i18n.language);

i18n.on('languageChanged', (lng) => {
  syncDocument(lng);
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* storage unavailable */
  }
});

export default i18n;
