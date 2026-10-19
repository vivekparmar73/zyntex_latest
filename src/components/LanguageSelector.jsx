import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';
import { languages } from '../i18n/translations';
import { Chevron, GlobeIcon } from './Icons';

export default function LanguageSelector({ inline = false }) {
  const { lang, option: current, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
            key={l.id}
            type="button"
            className={l.id === lang ? 'is-active' : ''}
            aria-pressed={l.id === lang}
            onClick={() => setLang(l.id)}
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
              <li key={l.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l.id === lang}
                  className={l.id === lang ? 'is-active' : ''}
                  onClick={() => {
                    setLang(l.id);
                    setOpen(false);
                  }}
                >
                  <span className="lang__name">
                    {l.label}
                    {l.native !== l.label && (
                      <small lang={l.lang}>{l.native}</small>
                    )}
                  </span>
                  <span className="lang__code">{l.short}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
