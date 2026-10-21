import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import ContactForm from '../components/ContactForm';
import { Page, Reveal } from '../components/Motion';
import { MailIcon, PhoneIcon, PinIcon } from '../components/Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, routes } from '../data/site';

export default function Contact() {
  const { t } = useLanguage();
  const rows = [
    { Icon: PinIcon, label: t('contact.address'), value: contact.address },
    { Icon: PhoneIcon, label: t('contact.tel'), value: contact.phoneOffice, href: contact.phoneHref },
    { Icon: MailIcon, label: t('contact.mail'), value: contact.email, href: `mailto:${contact.email}` },
  ];

  return (
    <Page>
      <Seo
        title="Contact Us"
        description="Contact Zyntex — Plot No. 17, Sidhivinayak Ind. Estate, Kholvad, Kamrej, Surat, Gujarat. Tel +91 78630 24047, info@zyntex.in."
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
              {rows.map(({ Icon, label, value, href }) => (
                <li key={label}>
                  <span className="contact__icon">
                    <Icon />
                  </span>
                  <span>
                    <span className="contact__label">{label}</span>
                    {href ? (
                      <a className="contact__value" href={href}>
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
      </section>
    </Page>
  );
}
