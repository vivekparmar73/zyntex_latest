import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import Seo from '../components/Seo';
import { CountUp, Img, Page, ParallaxImage, Reveal, SplitHeading, TiltCard } from '../components/Motion';
import { ArrowRight, DesignIcon, ManufacturingIcon, OpexIcon, ProductsIcon } from '../components/Icons';
import { images } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { productCategories, routes, stats, workforce } from '../data/site';

const ease = [0.22, 1, 0.36, 1];

const strengths = [
  {
    key: 'nav.design',
    Icon: DesignIcon,
    to: routes.design,
    text: 'Get customized design solutions from a network of talented designers worldwide. We combine design and technology to provide proven results as a reliable clothing and fashion vendor in the country.',
  },
  {
    key: 'nav.manufacturing',
    Icon: ManufacturingIcon,
    to: routes.manufacturing,
    text: 'Our strategically established clothing manufacturing units are equipped with some of the best sustainable technologies. Learn more about our manufacturing hubs.',
  },
  {
    key: 'nav.products',
    Icon: ProductsIcon,
    to: routes.products,
    text: 'Explore a range of products for men, women and kids. We provide a range of high-quality apparel across various fashion categories as a clothing supplier.',
  },
  {
    key: 'nav.opex',
    Icon: OpexIcon,
    to: routes.opex,
    text: 'Delivering promises on time through systematic processes — structured planning, quality checkpoints and coordinated production at every stage.',
  },
];

/** Full-screen hero carried over from the former Zyntex Apparel division card. */
function Hero() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.04, 1.18]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 20 });
  const sy = useSpring(py, { stiffness: 80, damping: 20 });
  const mediaX = useTransform(sx, [-0.5, 0.5], reduce ? [0, 0] : [18, -18]);
  const mediaY = useTransform(sy, [-0.5, 0.5], reduce ? [0, 0] : [12, -12]);

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    px.set(e.clientX / window.innerWidth - 0.5);
    py.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <section className="home-hero" ref={ref} onPointerMove={onMove}>
      <motion.div className="home-hero__media" style={{ scale, x: mediaX, y: mediaY }}>
        <Img image={images.mission} sizes="100vw" eager alt="" />
      </motion.div>
      <div className="home-hero__shade" aria-hidden="true" />
      <motion.div className="container home-hero__content" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.span
          className="home-hero__label"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          {t('division.apparel')}
        </motion.span>
        <SplitHeading as="h1" className="home-hero__title" text={t('division.apparelTag')} immediate delay={0.3} />
        <motion.div
          className="home-hero__actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease }}
        >
          <Link to={routes.products} className="btn btn--white">
            {t('nav.ourProducts')} <ArrowRight />
          </Link>
          <Link to={routes.contact} className="btn btn--outline-light">
            {t('common.contactUs')}
          </Link>
        </motion.div>
      </motion.div>
      <span className="home-hero__scroll" aria-hidden="true">
        <span />
        {t('home.scroll')}
      </span>
    </section>
  );
}

export default function ApparelHome() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo
        title="Apparel Manufacturing"
        description="Zyntex Apparel — fashion design, product development and garment manufacturing for men, women and kids across knits, wovens, denim, activewear and more."
        path={routes.home}
      />
      <Hero />

      {/* hOME IMAG — shown whole (no cropping) at every width */}
      <section className="showcase" aria-label="Redefining tomorrow's fashion">
        <div className="container">
          <Reveal className="showcase__frame">
            <Img image={images.home} sizes="(max-width: 1440px) 100vw, 1440px" />
          </Reveal>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((k) => (
            <span key={k}>
              {productCategories.map((c) => (
                <span key={c.id} className="marquee__item">
                  {c.name}
                  <i>✦</i>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Key strengths */}
      <section className="section strengths" aria-labelledby="strengths-title">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Zyntex</span>
            <h2 id="strengths-title" className="title-lg title-green">
              {t('home.keyStrengths')}
            </h2>
          </Reveal>
          <div className="strengths__grid">
            {strengths.map(({ key, Icon, to, text }, i) => (
              <Reveal key={key} delay={i * 0.1} className="strengths__cell">
                <TiltCard className="feature" max={6}>
                  <Link to={to} className="feature__link">
                    <span className="feature__icon">
                      <Icon />
                    </span>
                    <h3 className="feature__title">{t(key)}</h3>
                    <p>{text}</p>
                    <span className="link-arrow">
                      <span>{t('common.learnMore')}</span> <ArrowRight />
                    </span>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="section section--mist journey" aria-labelledby="journey-title">
        <div className="container">
          <div className="split">
            <Reveal>
              <span className="eyebrow">{t('journey.since')}</span>
              <SplitHeading id="journey-title" as="h2" className="title-lg" text={t('nav.ourJourney')} />
              <span className="journey__year" aria-hidden="true">
                2021
              </span>
            </Reveal>
            <Reveal delay={0.15} className="lead">
              <p>
                Zyntex was established with the mission to revolutionize fashion production globally since 2021. By empowering people and
                preserving the environment, we contribute to a circular economy that benefits everyone.
              </p>
              <p>
                With 3+ garment manufacturing units and a workforce of over {workforce} employees, Zyntex continues to lead with innovation and
                responsibility.
              </p>
              <Link to={routes.about} className="link-arrow">
                <span>{t('common.readMore')}</span> <ArrowRight />
              </Link>
            </Reveal>
          </div>
        </div>
        <ParallaxImage image={images.main1} className="journey__image" sizes="100vw" strength={24} radius={0} />
      </section>

      {/* Zyntex in numbers */}
      <section className="section stats" aria-labelledby="stats-title">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span id="stats-title" className="eyebrow">
              {t('stats.inNumbers')}
            </span>
          </Reveal>
          <div className="stats__grid">
            {stats.map((s, i) => (
              <Reveal key={s.labelKey} delay={i * 0.15} className="stat">
                <span className="stat__value">
                  <CountUp value={s.value} suffix={s.suffix} />
                </span>
                <span className="stat__label">{t(s.labelKey)}</span>
                <p className="stat__text">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PURE - 1 */}
      <section className="pure" aria-label="Fabric">
        <ParallaxImage image={images.pure1} className="pure__image" sizes="100vw" strength={70} radius={0} />
      </section>
    </Page>
  );
}
