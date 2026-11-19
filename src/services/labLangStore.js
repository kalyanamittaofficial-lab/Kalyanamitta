const LANG_KEY = 'km_lab_lang_v1';

export function getLabLang() {
  try {
    const val = localStorage.getItem(LANG_KEY);
    return val === 'en' ? 'en' : 'si';
  } catch {
    return 'si';
  }
}

export function setLabLang(lang) {
  const next = lang === 'en' ? 'en' : 'si';
  localStorage.setItem(LANG_KEY, next);
  window.dispatchEvent(new CustomEvent('labLangUpdated', { detail: next }));
  return next;
}

export function t(lang, si, en) {
  return lang === 'en' ? en : si;
}
