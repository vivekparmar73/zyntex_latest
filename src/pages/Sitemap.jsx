import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Page, Reveal } from '../components/Motion';
import { ArrowRight } from '../components/Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../data/site';

export default function Sitemap() {
  const { t } = useLanguage();
  const groups = [
    { title: 'Zyntex', links: [['nav.home', routes.home], ['common.contactUs', routes.contact]] },
    {
      title: t('nav.whoWeAre'),
      links: [
        ['nav.aboutUs', routes.about],
        ['nav.leadership', routes.leadership],
        ['nav.ourJourney', routes.journey],
      ],
    },
    {
      title: t('nav.whatWeDo'),
      links: [
        ['nav.design', routes.design],
        ['nav.ourProducts', routes.products],
        ['nav.manufacturing', routes.manufacturing],
        ['nav.opex', routes.opex],
      ],
    },
    { title: t('footer.quickLinks'), links: [['nav.sitemap', routes.sitemap], ['nav.privacy', routes.privacy]] },
  ];

  return (
    <Page>
      <Seo title="Sitemap" description="All pages on the Zyntex website." path={routes.sitemap} />
      <PageBanner title={t('nav.sitemap')} />
      <section className="section">
        <div className="container sitemap">
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.08} className="sitemap__group">
              <h2 className="sitemap__title">{g.title}</h2>
              <ul>
                {g.links.map(([key, to]) => (
                  <li key={to}>
                    <Link to={to}>
                      <span>{t(key)}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>
    </Page>
  );
}
