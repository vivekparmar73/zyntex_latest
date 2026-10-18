import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Page, Reveal, SplitHeading, TiltCard } from '../components/Motion';
import { opexIcons } from '../components/Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../data/site';

const pillars = [
  'We use market understanding, product research and design development to identify opportunities and translate emerging fashion trends into commercially relevant apparel.',
  "We work to understand each client's requirements and develop tailored manufacturing solutions, from fabric selection and sampling to garment construction, finishing and packaging.",
  'Our manufacturing capabilities support a range of apparel categories, including T-shirts, hoodies, denim, activewear, cargo pants and shirts, supported by coordinated production processes.',
  'Our people bring together practical garment-making skills, technical knowledge and attention to detail to support efficient production and consistent product execution.',
  'We emphasize production planning, progress monitoring and quality checkpoints to identify potential issues early, maintain process discipline and support continuous improvement.',
  'Through coordinated planning, production tracking and shipment preparation, we aim to fulfil order requirements and meet agreed delivery schedules.',
];

export default function OperationalExcellence() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo
        title="Operational Excellence"
        description="Six pillars of operational excellence at Zyntex: factual insights, customized solutions, reliable infrastructure, a skilled team, performance management and timely deliveries."
        path={routes.opex}
      />
      <PageBanner title={t('nav.opex')} />

      <section className="section" aria-labelledby="opex-title">
        <div className="container split">
          <SplitHeading id="opex-title" as="h2" className="title-lg title-green" text={t('nav.opex')} />
          <Reveal delay={0.1} className="lead">
            <p>
              Operational excellence is the foundation of consistent manufacturing, aligning people, processes and technology to support quality,
              reliable deliveries and long-term business goals.
            </p>
            <p>
              At Zyntex, we bring together manufacturing expertise, skilled teams, structured planning and continuous improvement to transform
              apparel concepts into finished products. Our approach focuses on efficiency, precision, collaboration and dependable execution at
              every stage of production.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--mist opex" aria-labelledby="pillars-title">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">{t('nav.opex')}</span>
            <h2 id="pillars-title" className="title-lg">
              {t('opex.pillarsTitle')}
            </h2>
          </Reveal>
          <ol className="opex__grid">
            {pillars.map((text, i) => {
              const Icon = opexIcons[i];
              return (
                <Reveal as="li" key={i} delay={(i % 3) * 0.1}>
                  <TiltCard className="pillar" max={6}>
                    <span className="pillar__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="pillar__icon">
                      <span className="pillar__orbit" aria-hidden="true" />
                      <Icon />
                    </span>
                    <h3 className="pillar__title">{t(`opex.p${i + 1}`)}</h3>
                    <p>{text}</p>
                  </TiltCard>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </section>
    </Page>
  );
}
