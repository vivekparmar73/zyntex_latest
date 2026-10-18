import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Seo from '../components/Seo';
import { CountUp, Img, Page, ParallaxImage, Reveal, SplitHeading, TiltCard } from '../components/Motion';
import { ArrowRight, DesignIcon, ManufacturingIcon, ProductsIcon } from '../components/Icons';
import { images } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { productCategories, routes, stats, workforce } from '../data/site';

const strengths = [
  {
    key: 'nav.design',
    Icon: DesignIcon,
    image: images.design1,
    focus: '88% 50%',
    to: routes.design,
    text: 'Get customized design solutions from a network of talented designers worldwide. We combine design and technology to provide proven results as a reliable clothing and fashion vendor in the country.',
  },
  {
    key: 'nav.manufacturing',
    Icon: ManufacturingIcon,
    image: images.making1,
    to: routes.manufacturing,
    text: 'Our strategically established clothing manufacturing units are equipped with some of the best sustainable technologies. Learn more about our manufacturing hubs.',
  },
  {
    key: 'nav.products',
    Icon: ProductsIcon,
    image: images.main1,
    to: routes.products,
    text: 'Explore a range of products for men, women and kids. We provide a range of high-quality apparel across various fashion categories as a clothing supplier.',
  },
];

function Hero() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section className="hero" ref={ref}>
      <motion.div className="container hero__head" style={{ y: textY }}>
        <motion.span className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {t('division.apparel')}
        </motion.span>
        <SplitHeading as="h1" className="title-xl hero__title" text={t('division.apparelTag')} immediate delay={0.15} />
      </motion.div>

      <motion.div
        className="hero__media container"
        initial={{ opacity: 0, y: 80, rotateX: 14 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="hero__frame">
          <motion.div className="hero__img" style={{ scale, y }}>
            <Img image={images.home} sizes="(max-width: 1320px) 100vw, 1320px" eager />
          </motion.div>
        </div>
        <span className="hero__scroll" aria-hidden="true">
          <span />
          {t('home.scroll')}
        </span>
      </motion.div>
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
        path={routes.apparel}
      />
      <Hero />

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
            {strengths.map(({ key, Icon, image, to, text, focus }, i) => (
              <Reveal key={key} delay={i * 0.12} className="strengths__cell">
                <TiltCard className="feature" max={7}>
                  <Link to={to} className="feature__link">
                    <div className="feature__media" style={focus ? { '--focus': focus } : undefined}>
                      <Img image={image} sizes="(max-width: 900px) 100vw, 33vw" alt="" />
                    </div>
                    <div className="feature__body">
                      <span className="feature__icon">
                        <Icon />
                      </span>
                      <h3 className="feature__title">{t(key)}</h3>
                      <p>{text}</p>
                      <span className="link-arrow">
                        <span>{t('common.learnMore')}</span> <ArrowRight />
                      </span>
                    </div>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section id="our-journey" className="section section--mist journey" aria-labelledby="journey-title">
        <div className="container">
          <div className="split">
            <Reveal>
              <span className="eyebrow">Since 2021</span>
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
                With 3+ garment manufacturing units and a workforce of over {workforce.home} employees, Zyntex continues to lead with innovation
                and responsibility.
              </p>
            </Reveal>
          </div>
          <ParallaxImage image={images.main1} className="journey__image" ratio="32 / 10" sizes="(max-width: 1320px) 100vw, 1320px" strength={30} />
        </div>
      </section>

      {/* Statistics */}
      <section className="section--tight stats" aria-label="Zyntex in numbers">
        <div className="container stats__grid">
          {stats.map((s, i) => (
            <Reveal key={s.labelKey} delay={i * 0.15} className="stat">
              <span className="stat__value">
                <CountUp value={s.value} suffix={s.suffix} />
              </span>
              <span className="stat__label">{t(s.labelKey)}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PURE - 1 */}
      <section className="pure" aria-label="Fabric">
        <ParallaxImage image={images.pure1} className="pure__image" sizes="100vw" strength={80} radius={0} />
        <div className="container pure__cta">
          <Reveal>
            <h2 className="title-md">{t('division.apparelTag')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to={routes.contact} className="btn btn--primary">
              {t('common.contactUs')} <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
