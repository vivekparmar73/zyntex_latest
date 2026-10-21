import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Page, ParallaxImage, Reveal, SplitHeading } from '../components/Motion';
import DesignSlider from '../components/DesignSlider';
import { ArrowRight } from '../components/Icons';
import { images } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../data/site';

const slides = [
  { image: images.design1, title: 'Design and Product Development' },
  { image: images.design2, title: 'Trend Forecasting' },
  { image: images.design3, title: 'Global Market Intelligence' },
  { image: images.design4, title: 'Best In-Class Talent' },
];
const tools = ['3D CAD rendering', '3D Optitex', 'CLO', 'Browzwear'];

export default function Design() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo
        title="Designer Clothing Manufacturers"
        description="Zyntex brings together a global network of apparel designers, market intelligence and 3D design tools such as CLO, Browzwear and Optitex to turn concepts into finished garments."
        path={routes.design}
      />
      <PageBanner title={t('nav.design')} />

      <DesignSlider slides={slides} />

      <section className="section design-intro" aria-labelledby="design-title">
        <div className="container split split--even">
          <div>
            <Reveal>
              <span className="eyebrow">{t('nav.design')}</span>
            </Reveal>
            <SplitHeading id="design-title" as="h2" className="title-lg title-green" text="Designer Clothing Manufacturers" />
            <Reveal delay={0.1}>
              <h3 className="title-md design-intro__sub">Bringing a team of versatile creators together</h3>
            </Reveal>
            <Reveal delay={0.15} className="lead">
              <p>
                What makes our design process stand out is our global network of skilled apparel designers, strategically positioned to cater to
                both local and international fashion demands. Our integrated market intelligence gathers insights from major and regional fashion
                hubs, allowing us to co-create the next big trends.
              </p>
              <p>
                We harness advanced technology to bring these insights to life. By combining cutting-edge tools like 3D CAD rendering, 3D Optitex,
                CLO, and Browzwear with creative expertise, we transform concepts into high-quality finished products, ensuring innovation at every
                step of the journey.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <ul className="chips" aria-label="Design tools">
                {tools.map((tool) => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.25}>
              <Link to={routes.products} className="btn btn--ghost">
                {t('nav.ourProducts')} <ArrowRight />
              </Link>
            </Reveal>
          </div>
          <ParallaxImage image={images.making1} ratio="3 / 4" className="design-intro__img" sizes="(max-width: 900px) 100vw, 50vw" strength={40} />
        </div>
      </section>
    </Page>
  );
}
