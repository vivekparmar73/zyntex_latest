import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import ContactForm from '../components/ContactForm';
import MapEmbed from '../components/MapEmbed';
import { Page, Reveal } from '../components/Motion';
import { LinkedInIcon, MailIcon, PhoneIcon, PinIcon, ProductsIcon } from '../components/Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, legalEntity, mapLinks, routes } from '../data/site';

export default function Contact() {
  const { t } = useLanguage();
  const rows = [
    { Icon: ProductsIcon, label: t('contact.company'), value: `Zyntex, a brand of ${legalEntity}` },
    { Icon: MailIcon, label: t('contact.email'), value: contact.email, href: `mailto:${contact.email}` },
    { Icon: PhoneIcon, label: t('contact.phone'), value: contact.phoneDisplay, href: contact.phoneHref },
    { Icon: LinkedInIcon, label: t('contact.linkedin'), value: 'linkedin.com/company/zyntex', href: contact.linkedin, external: true },
    { Icon: PinIcon, label: t('contact.location'), value: contact.location, href: mapLinks.open, external: true },
  ];

  return (
    <Page>
      <Seo
        title="Contact Us"
        description="Contact Zyntex — a brand of Indoprimo Apparel Private Limited, Palsana, Surat, Gujarat — at info@zyntex.in or +91 78 630 24047."
        path={routes.contact}
      />
      <PageBanner title={t('contact.title')} solid />

      <section className="section contact" aria-labelledby="contact-title">
        <div className="container contact__grid">
          <Reveal className="contact__info">
            <h2 id="contact-title" className="title-lg title-green">
              {t('contact.title')}
            </h2>
            <h3 className="contact__office">{t('contact.corporateOffice')}</h3>
            <ul className="contact__list">
              {rows.map(({ Icon, label, value, href, external }) => (
                <li key={label}>
                  <span className="contact__icon">
                    <Icon />
                  </span>
                  <span>
                    <span className="contact__label">{label}</span>
                    {href ? (
                      <a className="contact__value" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {value}
                      </a>
                    ) : (
                      <span className="contact__value">{value}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12} className="contact__form">
            <ContactForm />
          </Reveal>
        </div>

        <div className="container">
          <Reveal className="contact__map">
            <MapEmbed />
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
