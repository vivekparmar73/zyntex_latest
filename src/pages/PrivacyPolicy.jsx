import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Page, Reveal } from '../components/Motion';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, legalEntity, routes } from '../data/site';

// Describes what this website actually does with visitor data. Have it reviewed by
// Zyntex's legal adviser before launch, and update it if analytics or other tools are added.
export default function PrivacyPolicy() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo title="Privacy Policy" description="How the Zyntex website handles the information you share with us." path={routes.privacy} />
      <PageBanner title={t('nav.privacy')} />
      <section className="section">
        <Reveal className="container legal">
          <p className="legal__meta">Zyntex is a brand of {legalEntity}.</p>

          <h2>Information we collect</h2>
          <p>
            When you send us a message through the contact form, we receive the details you enter: your name, company, email address, phone
            number (if provided), the type of inquiry and your message. We use this information only to respond to your inquiry and to continue
            any business conversation that follows.
          </p>

          <h2>How your message is delivered</h2>
          <p>
            Contact-form submissions are delivered to our inbox at {contact.email} through EmailJS, an email-delivery service, which may also
            send you an automatic confirmation that we received your message. EmailJS processes the message only to deliver these emails.
          </p>

          <h2>Cookies and local storage</h2>
          <p>
            This website does not use advertising or analytics cookies. Your browser stores your chosen language, and whether you have already
            seen the opening animation during the current visit, so the site can remember these preferences. This information stays on your
            device.
          </p>

          <h2>Maps</h2>
          <p>
            Our location map is provided by OpenStreetMap. When the map loads, your browser connects to OpenStreetMap's servers, which may
            receive standard technical information such as your IP address.
          </p>

          <h2>Sharing and retention</h2>
          <p>
            We do not sell or rent your personal information. We keep inquiry correspondence only for as long as it is needed to respond to you
            and for our legitimate business records.
          </p>

          <h2>Your choices</h2>
          <p>
            You can ask us to access, correct or delete the information you have sent us by writing to{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </p>

          <h2>Contact</h2>
          <p>
            {legalEntity}, {contact.location}. Email: <a href={`mailto:${contact.email}`}>{contact.email}</a> · Phone:{' '}
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
          </p>
        </Reveal>
      </section>
    </Page>
  );
}
