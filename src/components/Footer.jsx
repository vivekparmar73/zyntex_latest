import { Link } from 'react-router-dom';
import Logo from './Logo';
import MapEmbed from './MapEmbed';
import { ArrowRight, LinkedInIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, legalEntity, routes } from '../data/site';

const quickLinks = [
  ['common.contactUs', routes.contact],
  ['nav.sitemap', routes.sitemap],
  ['nav.privacy', routes.privacy],
];

const exploreLinks = [
  ['nav.aboutUs', routes.about],
  ['nav.leadership', routes.leadership],
  ['nav.ourJourney', routes.journey],
  ['nav.design', routes.design],
  ['nav.products', routes.products],
  ['nav.manufacturing', routes.manufacturing],
  ['nav.opex', routes.opex],
];

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="footer__grid">
        {/* Left: brand + quick links */}
        <div className="footer__col footer__brand">
          <Link to={routes.home} aria-label="Zyntex home">
            <Logo tone="light" />
          </Link>
          <p>
            {t('footer.brandOf')} <strong>{legalEntity}</strong>.
          </p>
          <nav className="footer__block" aria-label={t('footer.quickLinks')}>
            <h2 className="footer__heading">{t('footer.quickLinks')}</h2>
            <ul className="footer__links">
              {quickLinks.map(([key, to]) => (
                <li key={key}>
                  <Link to={to}>{t(key)}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Centre: social + get in touch */}
        <div className="footer__col">
          <h2 className="footer__heading">{t('footer.social')}</h2>
          <a className="footer__social-link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="footer__social-icon">
              <LinkedInIcon size={16} />
            </span>
            LinkedIn
          </a>
          <div className="footer__block">
            <h2 className="footer__heading">{t('footer.getInTouch')}</h2>
            <Link to={routes.contact} className="footer__cta">
              {t('footer.connect')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <nav className="footer__col" aria-label={t('footer.explore')}>
          <h2 className="footer__heading">{t('footer.explore')}</h2>
          <ul className="footer__links">
            {exploreLinks.map(([key, to]) => (
              <li key={key}>
                <Link to={to}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: map */}
        <div className="footer__col footer__map">
          <h2 className="footer__heading">{t('footer.visit')}</h2>
          <MapEmbed height={209} />
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        ZYNTEX
      </p>
      <div className="footer__bottom">
        <p>
          © {year} Zyntex · {legalEntity}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
