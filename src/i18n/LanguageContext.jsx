import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { languages, translations } from './translations';

const STORAGE_KEY = 'zyntex-lang';
const LanguageContext = createContext(null);

const byId = Object.fromEntries(languages.map((l) => [l.id, l]));
const dictOf = (option) => translations[option.dict || option.lang] || translations.en;

function initialOption() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && byId[saved]) return saved;
  } catch {
    /* storage unavailable */
  }
  const browser = (navigator.language || 'en').slice(0, 2);
  return byId[browser] ? browser : 'en';
}

export function LanguageProvider({ children }) {
  const [id, setLang] = useState(initialOption);
  const option = byId[id] || byId.en;

  useEffect(() => {
    document.documentElement.lang = option.lang;
    document.documentElement.dir = option.dir || 'ltr';
    try {
      localStorage.setItem(STORAGE_KEY, option.id);
    } catch {
      /* storage unavailable */
    }
  }, [option]);

  const t = useCallback((key) => dictOf(option)[key] ?? translations.en[key] ?? key, [option]);
  const value = useMemo(() => ({ lang: option.id, option, setLang, t }), [option, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
