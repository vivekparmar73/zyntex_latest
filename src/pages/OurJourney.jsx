import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Img, Page, Reveal, SplitHeading } from '../components/Motion';
import { images } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { routes, workforce } from '../data/site';

const milestones = [
  { year: '2021', title: 'Company Foundation', text: 'Zyntex is established with the mission to revolutionize fashion production globally.' },
  {
    year: '2022',
    title: 'Founding Vision',
    text: 'By empowering people and preserving the environment, Zyntex aims to contribute to a circular economy that benefits everyone.',
  },
  { year: '2022', title: 'Early Development', text: 'The first products, the first brands, and the team that made them.' },
  { year: '2024', title: 'Manufacturing Expansion', text: 'Growth to 3+ garment manufacturing units.' },
  { year: '2025', title: 'New Product Capabilities', text: 'New categories and processes added to the range.' },
  { year: '2026', title: 'Team Growth', text: `A workforce of over ${workforce} employees.` },
  { year: 'Today', title: 'Current Operations', text: 'Product development and garment manufacturing for apparel brands.' },
  { year: 'Next', title: 'Future Ambitions', text: 'Building lasting relationships with international apparel brands.' },
];

function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol className="timeline" ref={ref}>
      <span className="timeline__track" aria-hidden="true">
        <motion.span className="timeline__fill" style={{ scaleY: fill }} />
      </span>
      {milestones.map((m, i) => (
        <li key={`${m.year}-${m.title}`} className={`timeline__item ${i % 2 ? 'is-right' : 'is-left'}`}>
          <span className="timeline__dot" aria-hidden="true" />
          <Reveal className="timeline__card" y={30} delay={0.05}>
            <span className={`timeline__year ${/\d/.test(m.year) ? '' : 'is-word'}`}>{m.year}</span>
            <h3 className="timeline__title">{m.title}</h3>
            <p>{m.text}</p>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}

export default function OurJourney() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo
        title="Our Journey"
        description="Since 2021, Zyntex has grown to 3+ garment manufacturing units and a workforce of over 200 employees. Explore the story so far."
        path={routes.journey}
      />
      <PageBanner title={t('nav.ourJourney')} />

      <section className="section section--mist" aria-labelledby="journey-intro">
        <div className="container split">
          <Reveal>
            <span className="eyebrow">{t('journey.since')}</span>
            <SplitHeading id="journey-intro" as="h2" className="title-lg" text={t('nav.ourJourney')} />
            <span className="journey__year" aria-hidden="true">
              2021
            </span>
          </Reveal>
          <Reveal delay={0.12} className="lead">
            <p>
              Zyntex was established with the mission to revolutionize fashion production globally since 2021. By empowering people and
              preserving the environment, we contribute to a circular economy that benefits everyone.
            </p>
            <p>
              With 3+ garment manufacturing units and a workforce of over {workforce} employees, Zyntex continues to lead with innovation and
              responsibility.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" aria-labelledby="story-title">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">Zyntex</span>
            <h2 id="story-title" className="title-lg title-green">
              {t('journey.storySoFar')}
            </h2>
          </Reveal>
          <Timeline />
        </div>
      </section>

      <section className="section--tight journey-page__collage" aria-label="Zyntex apparel collection">
        <div className="container">
          <Reveal className="journey__collage">
            <Img image={images.main1} sizes="(max-width: 1440px) 100vw, 1440px" />
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
