import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { languages } from '../i18n/translations';
import { Chevron, GlobeIcon } from './Icons';

export default function LanguageSelector({ inline = false }) {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = languages.find((l) => l.code === lang) || languages[0];

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (inline) {
    return (
      <div className="lang-inline" role="group" aria-label={t('nav.language')}>
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            lang={l.code}
            className={l.code === lang ? 'is-active' : ''}
            aria-pressed={l.code === lang}
            onClick={() => setLang(l.code)}
          >
            {l.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="lang" ref={ref}>
      <button
        type="button"
        className="lang__btn"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t('nav.language')}: ${current.label}`}
        onClick={() => setOpen((o) => !o)}
      >
        <GlobeIcon />
        <span>{current.short}</span>
        <Chevron size={12} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            className="lang__menu"
            role="listbox"
            aria-label={t('nav.language')}
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            data-lenis-prevent
          >
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  type="button"
                  role="option"
                  lang={l.code}
                  aria-selected={l.code === lang}
                  className={l.code === lang ? 'is-active' : ''}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                >
                  <span>{l.label}</span>
                  <small>{l.short}</small>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
