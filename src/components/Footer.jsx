import { Link } from 'react-router-dom';
import Logo from './Logo';
import MapEmbed from './MapEmbed';
import { LinkedInIcon, MailIcon, PhoneIcon } from './Icons';
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
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to={routes.home} aria-label="Zyntex home">
            <Logo tone="light" />
          </Link>
          <p>
            {t('footer.brandOf')} <strong>{legalEntity}</strong>.
          </p>
          <a className="footer__social" href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Zyntex on LinkedIn">
            <LinkedInIcon size={18} />
          </a>
          <ul className="footer__contact">
            <li>
              <MailIcon size={16} />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <PhoneIcon size={16} />
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            </li>
          </ul>
        </div>

        <nav className="footer__col" aria-label={t('footer.quickLinks')}>
          <h2 className="footer__heading">{t('footer.quickLinks')}</h2>
          <ul className="footer__links">
            {quickLinks.map(([key, to]) => (
              <li key={key}>
                <Link to={to}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">{t('footer.social')}</h2>
          <a className="footer__social-link" href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            <span className="footer__social-icon">
              <LinkedInIcon size={16} />
            </span>
            LinkedIn
          </a>
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

        <div className="footer__col footer__map">
          <h2 className="footer__heading">{t('footer.visit')}</h2>
          <MapEmbed height={190} />
          <p className="footer__place">{contact.location}</p>
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        ZYNTEX
      </p>
      <div className="container footer__bottom">
        <p>
          © {year} Zyntex · {legalEntity}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
