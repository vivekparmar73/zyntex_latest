import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import Header from '../components/Header';
import Seo from '../components/Seo';
import IntroAnimation from '../components/IntroAnimation';
import TechGlobe from '../components/TechGlobe';
import { Img } from '../components/Motion';
import { ArrowRight } from '../components/Icons';
import { images } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, legalEntity, routes } from '../data/site';

const INTRO_KEY = 'zyntex-intro-seen';
const ease = [0.22, 1, 0.36, 1];
const spring = { stiffness: 120, damping: 20, mass: 0.6 };

function introSeen() {
  try {
    return sessionStorage.getItem(INTRO_KEY) === '1';
  } catch {
    return false;
  }
}

// Start fetching the Integrated Systems page (three.js) before the click lands.
const preloadIT = () => import('./IntegratedSystems');

function DivisionPanel({ index, variant, to, label, tag, desc, cta, state, onHover, ready, onIntent, children }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const rotateY = useTransform(sx, [-0.5, 0.5], reduce ? [0, 0] : [-6, 6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], reduce ? [0, 0] : [5, -5]);
  const mediaX = useTransform(sx, [-0.5, 0.5], reduce ? [0, 0] : [24, -24]);
  const mediaY = useTransform(sy, [-0.5, 0.5], reduce ? [0, 0] : [18, -18]);
  const glare = useTransform([sx, sy], ([x, y]) => `radial-gradient(600px circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.16), transparent 45%)`);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
    onHover(null);
  };

  return (
    <motion.div
      className={`division division--${variant} is-${state}`}
      initial={{ opacity: 0, y: 70, rotateX: 10 }}
      animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 1.2, delay: 0.1 + index * 0.14, ease }}
    >
      <motion.div
        className="division__card"
        style={{ rotateX, rotateY, transformPerspective: 1600 }}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') onHover(index);
          onIntent?.();
        }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <Link to={to} className="division__link" aria-label={`${label} — ${tag}`} onFocus={onIntent}>
          <motion.div className="division__media" style={{ x: mediaX, y: mediaY }}>
            {children}
          </motion.div>
          <div className="division__shade" />
          <motion.div className="division__glare" style={{ background: glare }} aria-hidden="true" />
          <div className="division__content">
            <span className="division__label">
              <span className="division__index">0{index + 1}</span>
              {label}
            </span>
            <h2 className="division__tag">{tag}</h2>
            <p className="division__desc">{desc}</p>
            <span className="division__cta">
              <span>{cta}</span>
              <span className="division__cta-icon">
                <ArrowRight />
              </span>
            </span>
          </div>
          <span className="division__border" aria-hidden="true" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function DivisionSelect() {
  const { t } = useLanguage();
  const [ready, setReady] = useState(introSeen);
  const [hovered, setHovered] = useState(null);

  const finishIntro = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  };

  const stateOf = (i) => (hovered === null ? 'idle' : hovered === i ? 'active' : 'dimmed');

  return (
    <div className="divisions">
      <Seo
        title="Choose a Division"
        description="Zyntex has two divisions: Zyntex Apparel — fashion design, product development and garment manufacturing — and Integrated Systems for IT services and technology solutions."
        path="/"
      />
      {!ready && <IntroAnimation onDone={finishIntro} />}
      <Header home={routes.divisions} />

      <main id="main" className="divisions__main">
        <motion.h1
          className="divisions__title"
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={ready ? { opacity: 1, letterSpacing: '0.32em' } : {}}
          transition={{ duration: 1.2, ease }}
        >
          {t('division.choose')}
        </motion.h1>

        <div className="divisions__panels">
          <DivisionPanel
            index={0}
            variant="apparel"
            to={routes.apparel}
            label={t('division.apparel')}
            tag={t('division.apparelTag')}
            desc="Fashion design, product development and garment manufacturing."
            cta={t('division.explore')}
            state={stateOf(0)}
            onHover={setHovered}
            ready={ready}
          >
            <Img image={images.mission} sizes="(max-width: 900px) 100vw, 55vw" eager alt="" />
          </DivisionPanel>

          <DivisionPanel
            index={1}
            variant="it"
            to={routes.it}
            label={t('division.it')}
            tag={t('division.itTag')}
            desc="IT services and technology solutions."
            cta={t('division.explore')}
            state={stateOf(1)}
            onHover={setHovered}
            ready={ready}
            onIntent={preloadIT}
          >
            <div className="division__grid" aria-hidden="true" />
            <TechGlobe />
          </DivisionPanel>
        </div>
      </main>

      <footer className="divisions__foot container">
        <span>
          © {new Date().getFullYear()} Zyntex · {legalEntity}
        </span>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </footer>
    </div>
  );
}
