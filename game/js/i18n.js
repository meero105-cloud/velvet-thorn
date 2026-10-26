// Velvet Thorn — language layer.
// UI strings live in js/lang/<code>.js as I18N.<code>.ui. Story content in data.js is the Korean original;
// a language file can overlay translations on it with I18N.<code>.content (same shape as the data objects).
const I18N = {};
const LANGS = ['ko', 'en'];
let LANG = 'ko';
let BASE = null; // pristine Korean content, restored before each overlay

function detectLang() {
  try { const s = localStorage.getItem('vt_lang'); if (I18N[s]) return s; } catch (e) {}
  return /^ko/i.test(navigator.language || '') ? 'ko' : 'en';
}

// t('key', ...args): a string, or a function of args. Falls back to Korean, then to the key itself.
function t(key, ...args) {
  let v = I18N[LANG].ui[key];
  if (v === undefined) v = I18N.ko.ui[key];
  if (v === undefined) return key;
  return typeof v === 'function' ? v(...args) : v;
}

function mergeInto(dst, src) {
  for (const k in src) {
    const s = src[k];
    if (s && typeof s === 'object' && dst[k] && typeof dst[k] === 'object') mergeInto(dst[k], s);
    else dst[k] = s;
  }
}
const contentRoots = () => ({ ASSETS, SUITS, ENEMIES, CHAPTERS, BLESSINGS, EVENTS });

function setLang(code) {
  if (!I18N[code]) code = 'ko';
  const roots = contentRoots();
  if (!BASE) BASE = JSON.parse(JSON.stringify(roots));
  mergeInto(roots, BASE);
  if (I18N[code].content) mergeInto(roots, I18N[code].content);
  LANG = code;
  document.documentElement.lang = code;
  try { localStorage.setItem('vt_lang', code); } catch (e) {}
}
