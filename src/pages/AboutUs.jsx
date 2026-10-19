import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Page, ParallaxImage, Reveal, SplitHeading, TiltCard } from '../components/Motion';
import { ArrowRight, DesignIcon, ProductsIcon, opexIcons } from '../components/Icons';
import { images } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { routes, workforce } from '../data/site';

const OpexIcon = opexIcons[4];

const pillars = [
  { title: 'about.strongDesign', desc: 'about.inHouse', to: routes.design, Icon: DesignIcon },
  { title: 'about.multiProduct', desc: 'about.oneStop', to: routes.products, Icon: ProductsIcon },
  { title: 'nav.opex', desc: 'about.opexDesc', to: routes.opex, Icon: OpexIcon },
];

export default function AboutUs() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo
        title="About Us"
        description="Founded in 2021, Zyntex is a clothing manufacturing company based in India offering end-to-end supply chain solutions to brands worldwide."
        path={routes.about}
      />
      <PageBanner title={t('nav.aboutUs')} />

      <section className="section" aria-labelledby="about-title">
        <div className="container split">
          <SplitHeading id="about-title" as="h2" className="title-lg title-green" text="Threading the world of fashion" />
          <Reveal delay={0.1} className="lead">
            <p>
              Founded by Mr. Raaj Bhalala in 2021, Zyntex is a multinational clothing manufacturing company based in India, offering end-to-end
              supply chain solutions to brands worldwide. We develop apparel for all ages, genders, and style preferences using sustainable
              practices.
            </p>
            <p>
              Zyntex was established with the mission to revolutionize fashion production globally. By empowering people and preserving the
              environment, we contribute to a circular economy that benefits everyone.
            </p>
            <p>
              With 3+ garment manufacturing units and a workforce of over {workforce} employees, Zyntex continues to pursue innovation and
              responsible growth.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--mist" aria-labelledby="vision-title">
        <div className="container split split--even">
          <div>
            <SplitHeading id="vision-title" as="h2" className="title-lg" text={t('about.vision')} />
            <Reveal delay={0.1}>
              <p className="statement">
                To be the global leader in delivering sustainable, end-to-end supply chain solutions for the fashion industry.
              </p>
            </Reveal>
          </div>
          <ParallaxImage image={images.our1} ratio="16 / 9" sizes="(max-width: 900px) 100vw, 50vw" strength={30} />
        </div>
      </section>

      <section className="section" aria-labelledby="mission-title">
        <div className="container split split--even split--reverse">
          <div>
            <SplitHeading id="mission-title" as="h2" className="title-lg" text={t('about.mission')} />
            <Reveal delay={0.1}>
              <p className="statement">
                To continuously exceed customer and shareholder expectations by strategically driving sustainability, technological advancement,
                and innovative solutions delivered with the best talent in the industry.
              </p>
            </Reveal>
          </div>
          <ParallaxImage image={images.mission} ratio="3 / 2" sizes="(max-width: 900px) 100vw, 50vw" strength={30} />
        </div>
      </section>

      <section className="section section--dark about-pillars" aria-labelledby="pillars-of-success">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">Zyntex</span>
            <h2 id="pillars-of-success" className="title-lg">
              {t('about.pillars')}
            </h2>
          </Reveal>
          <div className="success-grid">
            {pillars.map(({ title, desc, to, Icon }, i) => (
              <Reveal key={title} delay={i * 0.12}>
                <TiltCard className="success-card" max={8}>
                  <Link to={to} className="success-card__link">
                    <span className="success-card__num">0{i + 1}</span>
                    <span className="success-card__icon">
                      <Icon />
                    </span>
                    <h3>{t(title)}</h3>
                    <p>{t(desc)}</p>
                    <span className="link-arrow">
                      <span>{t('common.readMore')}</span> <ArrowRight />
                    </span>
                  </Link>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  );
}
