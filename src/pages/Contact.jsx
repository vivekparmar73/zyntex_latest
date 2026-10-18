import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import ContactForm from '../components/ContactForm';
import MapEmbed from '../components/MapEmbed';
import { Page, Reveal, TiltCard } from '../components/Motion';
import { ArrowUpRight, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from '../components/Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, mapLinks, routes } from '../data/site';

export default function Contact() {
  const { t } = useLanguage();
  const cards = [
    { Icon: MailIcon, label: t('contact.email'), value: contact.email, href: `mailto:${contact.email}` },
    { Icon: PhoneIcon, label: t('contact.phone'), value: contact.phoneDisplay, href: contact.phoneHref },
    { Icon: LinkedInIcon, label: t('contact.linkedin'), value: 'linkedin.com/company/zyntex', href: contact.linkedin, external: true },
    { Icon: PinIcon, label: t('contact.location'), value: `${contact.lat}° N, ${contact.lng}° E`, href: mapLinks.open, external: true },
  ];

  return (
    <Page>
      <Seo
        title="Contact Us"
        description="Contact Zyntex at info@zyntex.in or +91 78 630 24047 for apparel design, sampling, bulk manufacturing and partnership enquiries."
        path={routes.contact}
      />
      <PageBanner title={t('nav.contact')} />

      <section className="section--tight" aria-label={t('contact.getInTouch')}>
        <div className="container contact-cards">
          {cards.map(({ Icon, label, value, href, external }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <TiltCard className="contact-card" max={8}>
                <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="contact-card__icon">
                    <Icon />
                  </span>
                  <span className="contact-card__label">{label}</span>
                  <span className="contact-card__value">{value}</span>
                  <span className="contact-card__go" aria-hidden="true">
                    <ArrowUpRight size={18} />
                  </span>
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section contact-main" aria-labelledby="form-title">
        <div className="container contact-main__grid">
          <Reveal className="contact-main__form">
            <span className="eyebrow">{t('contact.getInTouch')}</span>
            <h2 id="form-title" className="title-lg title-green">
              {t('contact.sendMessage')}
            </h2>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.15} className="contact-main__map">
            <MapEmbed />
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
