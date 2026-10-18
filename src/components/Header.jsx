import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';
import { Chevron, MenuIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { useLenis } from './SmoothScroll';
import { routes } from '../data/site';

export const navGroups = [
  {
    id: 'who',
    labelKey: 'nav.whoWeAre',
    items: [
      { labelKey: 'nav.aboutUs', to: routes.about },
      { labelKey: 'nav.leadership', to: routes.leadership },
      { labelKey: 'nav.ourJourney', to: routes.journey },
    ],
  },
  {
    id: 'what',
    labelKey: 'nav.whatWeDo',
    items: [
      { labelKey: 'nav.design', to: routes.design },
      { labelKey: 'nav.ourProducts', to: routes.products },
      { labelKey: 'nav.manufacturing', to: routes.manufacturing },
      { labelKey: 'nav.opex', to: routes.opex },
    ],
  },
];

function Dropdown({ group, open, onOpen, onClose }) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const active = group.items.some((i) => i.to.split('#')[0] === pathname && !i.to.includes('#'));
  return (
    <li
      className="nav__item"
      onPointerEnter={(e) => e.pointerType === 'mouse' && onOpen()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && onClose()}
    >
      <button
        type="button"
        className={`nav__link ${active ? 'is-active' : ''}`}
        aria-expanded={open}
        aria-controls={`menu-${group.id}`}
        onClick={() => (open ? onClose() : onOpen())}
      >
        {t(group.labelKey)} <Chevron />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={`menu-${group.id}`}
            className="nav__dropdown"
            initial={{ opacity: 0, y: 12, rotateX: -12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {group.items.map((item, i) => (
              <motion.li key={item.to} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
                <NavLink to={item.to} onClick={onClose} end>
                  {t(item.labelKey)}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Header({ home = routes.apparel, tone = 'light' }) {
  const { t } = useLanguage();
  const lenis = useLenis();
  const location = useLocation();
  const [openId, setOpenId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState('who');
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 320 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (mobileOpen) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen, lenis]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenId(null);
        setMobileOpen(false);
      }
    };
    const onDown = (e) => navRef.current && !navRef.current.contains(e.target) && setOpenId(null);
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, []);

  const cls = ['header', `header--${tone}`, scrolled && 'is-scrolled', hidden && !mobileOpen && 'is-hidden', mobileOpen && 'is-menu-open']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={cls}>
      <div className="header__inner container">
        <Link to={home} className="header__logo" aria-label="Zyntex home">
          <Logo tone={tone === 'dark' ? 'light' : 'dark'} />
        </Link>

        <nav className="nav" aria-label="Main" ref={navRef}>
          <ul className="nav__list">
            {navGroups.map((g) => (
              <Dropdown
                key={g.id}
                group={g}
                open={openId === g.id}
                onOpen={() => setOpenId(g.id)}
                onClose={() => setOpenId((cur) => (cur === g.id ? null : cur))}
              />
            ))}
            <li className="nav__item">
              <NavLink to={routes.contact} className="nav__link">
                {t('nav.contact')}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="header__tools">
          <LanguageSelector />
          <button
            type="button"
            className="header__burger"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t('nav.close') : t('nav.menu')}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
          >
            <nav className="mobile-menu__inner container" aria-label="Mobile">
              {navGroups.map((g, gi) => (
                <motion.div
                  key={g.id}
                  className="mobile-menu__group"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + gi * 0.08 }}
                >
                  <button
                    type="button"
                    className="mobile-menu__heading"
                    aria-expanded={mobileGroup === g.id}
                    onClick={() => setMobileGroup((cur) => (cur === g.id ? null : g.id))}
                  >
                    {t(g.labelKey)} <Chevron size={18} />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileGroup === g.id && (
                      <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                        {g.items.map((item) => (
                          <li key={item.to}>
                            <Link to={item.to}>{t(item.labelKey)}</Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
                <Link to={routes.contact} className="mobile-menu__heading">
                  {t('nav.contact')}
                </Link>
                <Link to={routes.divisions} className="mobile-menu__sub">
                  ← {t('nav.divisions')}
                </Link>
              </motion.div>
              <motion.div className="mobile-menu__lang" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                <p className="eyebrow">{t('nav.language')}</p>
                <LanguageSelector inline />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
