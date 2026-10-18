import { Link } from 'react-router-dom';
import Logo from './Logo';
import MapEmbed from './MapEmbed';
import { LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, legalEntity, mapLinks, routes } from '../data/site';

const links = [
  ['nav.aboutUs', routes.about],
  ['nav.leadership', routes.leadership],
  ['nav.ourJourney', routes.journey],
  ['nav.design', routes.design],
  ['nav.products', routes.products],
  ['nav.manufacturing', routes.manufacturing],
  ['nav.opex', routes.opex],
  ['nav.contact', routes.contact],
];

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to={routes.divisions} aria-label="Zyntex — choose a division">
            <Logo tone="light" />
          </Link>
          <p>
            {t('footer.brandOf')} <strong>{legalEntity}</strong>.
          </p>
          <a className="footer__social" href={contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Zyntex on LinkedIn">
            <LinkedInIcon size={18} />
          </a>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2 className="footer__heading">{t('footer.explore')}</h2>
          <ul className="footer__links">
            {links.map(([key, to]) => (
              <li key={key}>
                <Link to={to}>{t(key)}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="footer__heading">{t('footer.reach')}</h2>
          <ul className="footer__contact">
            <li>
              <MailIcon size={18} />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
            <li>
              <PhoneIcon size={18} />
              <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            </li>
            <li>
              <LinkedInIcon size={18} />
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                linkedin.com/company/zyntex
              </a>
            </li>
            <li>
              <PinIcon size={18} />
              <a href={mapLinks.open} target="_blank" rel="noopener noreferrer">
                {contact.lat}° N, {contact.lng}° E
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col footer__map">
          <h2 className="footer__heading">{t('footer.visit')}</h2>
          <MapEmbed height={190} />
        </div>
      </div>

      <p className="footer__wordmark" aria-hidden="true">
        ZYNTEX
      </p>
      <div className="container footer__bottom">
        <p>
          © {year} Zyntex · {legalEntity}. {t('footer.rights')}
        </p>
        <Link to={routes.divisions}>{t('nav.divisions')}</Link>
      </div>
    </footer>
  );
}
