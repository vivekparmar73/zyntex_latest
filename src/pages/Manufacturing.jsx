import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Page, ParallaxImage, Reveal, SplitHeading } from '../components/Motion';
import { ArrowRight } from '../components/Icons';
import { images } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../data/site';

export default function Manufacturing() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo
        title="Clothing & Apparel Manufacturers"
        description="Zyntex manufacturing units deliver scalable, high-quality apparel production for men, women and kids — from fabric sourcing and stitching to finishing, quality checks and packaging."
        path={routes.manufacturing}
      />
      <PageBanner title={t('nav.manufacturing')} />

      {/* Section 1 */}
      <section className="section" aria-labelledby="mf-1">
        <div className="container">
          <div className="split">
            <SplitHeading id="mf-1" as="h2" className="title-lg title-green" text="Bringing a team of versatile creators together" />
            <Reveal delay={0.1} className="lead">
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
          </div>
          <ParallaxImage image={images.making11} ratio="1309 / 800" className="mf-wide" sizes="(max-width: 1320px) 100vw, 1320px" strength={40} />
        </div>
      </section>

      {/* Section 2 */}
      <section className="section section--mist" aria-labelledby="mf-2">
        <div className="container split">
          <SplitHeading id="mf-2" as="h2" className="title-lg" text="Working with an empowered team" />
          <Reveal delay={0.1} className="lead">
            <p>
              While technology is important for crafting world-class apparel, it is skilled people who make manufacturing processes work
              effectively. Our workforce plays an important role in production planning, quality, and delivery execution.
            </p>
            <p>
              Our manufacturing teams bring together garment-making skills, technical knowledge, quality-focused personnel, and production
              expertise. At Zyntex, we value teamwork, training, process discipline, and continuous improvement to help our people adapt to
              changing requirements in the textile industry.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Section 3 */}
      <section className="section" aria-label="Our manufacturing units">
        <div className="container split split--even">
          <Reveal className="lead">
            <p>
              Zyntex’s manufacturing units are built to deliver large-scale, high-quality apparel production while maintaining a strong focus on
              innovation, efficiency, and sustainability. As an apparel manufacturer, we aim to integrate technology with industry expertise to
              create fashion-forward products that meet the evolving demands of global markets.
            </p>
            <p>
              Our commitment to excellence focuses on precision, durability, and style. Depending on the project, manufacturing processes may
              include fabric sourcing, garment stitching, finishing, quality checks, and packaging.
            </p>
            <p>
              At Zyntex, we manufacture a diverse selection of apparel for men, women, and kids, covering fashion categories such as everyday
              casual wear, denim, activewear, sportswear, and more. Our approach focuses on consistent quality, responsible practices, and
              dependable manufacturing partnerships.
            </p>
          </Reveal>
          <ParallaxImage image={images.making111} ratio="3 / 2" sizes="(max-width: 900px) 100vw, 50vw" strength={35} />
        </div>
      </section>

      {/* Section 4 */}
      <section className="section section--dark" aria-labelledby="mf-4">
        <div className="container">
          <div className="split">
            <SplitHeading id="mf-4" as="h2" className="title-lg" text="High-tech apparel manufacturing through tech and talent" />
            <Reveal delay={0.1} className="lead">
              <p>
                At Zyntex, we combine advanced technology with skilled craftsmanship to deliver scalable, high-quality apparel manufacturing that
                evolves with the demands of the global fashion industry. Our integrated manufacturing capabilities, operational excellence, and
                agile production processes enable us to support brands with consistent quality, efficient lead times, and reliable bulk production.
              </p>
              <p>
                Driven by innovation, talent, strategic planning, and seamless collaboration, we continuously refine our processes to meet changing
                market trends and customer expectations. From denim and sportswear to contemporary apparel, Zyntex is committed to building a more
                efficient, responsible, and future-ready approach to fashion manufacturing.
              </p>
              <Link to={routes.opex} className="btn btn--light">
                {t('nav.opex')} <ArrowRight />
              </Link>
            </Reveal>
          </div>
          <div className="mf-gallery">
            <ParallaxImage image={images.making1111} ratio="16 / 10" sizes="(max-width: 900px) 100vw, 60vw" strength={30} />
            <ParallaxImage image={images.making1} ratio="3 / 4" sizes="(max-width: 900px) 100vw, 40vw" strength={50} />
          </div>
        </div>
      </section>
    </Page>
  );
}
