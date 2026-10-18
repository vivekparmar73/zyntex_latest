import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Seo from '../components/Seo';
import Logo from '../components/Logo';
import LanguageSelector from '../components/LanguageSelector';
import ITBackground from '../components/ITBackground';
import ContactForm from '../components/ContactForm';
import { Page, Reveal, SplitHeading, TiltCard } from '../components/Motion';
import { ArrowRight, LinkedInIcon, MailIcon, PhoneIcon } from '../components/Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { contact, legalEntity, routes } from '../data/site';

const MARQUEE = ['Ideas into reality', 'Integrated Systems', 'IT services', 'Technology solutions', 'Zyntex'];

// The brief does not yet include detailed Integrated Systems content, so this page presents
// the division identity (IT services and technology solutions) and routes enquiries to the team.
export default function IntegratedSystems() {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const cards = [
    { Icon: MailIcon, label: t('contact.email'), value: contact.email, href: `mailto:${contact.email}?subject=Integrated%20Systems%20enquiry` },
    { Icon: PhoneIcon, label: t('contact.phone'), value: contact.phoneDisplay, href: contact.phoneHref },
    { Icon: LinkedInIcon, label: t('contact.linkedin'), value: 'linkedin.com/company/zyntex', href: contact.linkedin, ext: true },
  ];

  return (
    <div className="it">
      <Seo
        title="Integrated Systems"
        description="Zyntex Integrated Systems — the IT services and technology solutions division of Zyntex. Ideas into reality."
        path={routes.it}
      />
      <ITBackground />
      <div className="it-vignette" aria-hidden="true" />

      <header className="it-header">
        <div className="container it-header__inner">
          <Link to={routes.divisions} aria-label="Zyntex — choose a division">
            <Logo tone="light" />
          </Link>
          <nav className="it-header__nav" aria-label="Main">
            <Link to={routes.divisions}>{t('nav.divisions')}</Link>
            <Link to={routes.apparel}>{t('division.apparel')}</Link>
            <a href="#it-contact">{t('nav.contact')}</a>
          </nav>
          <LanguageSelector />
        </div>
      </header>

      <Page className="it-main">
        <section className="it-hero" ref={heroRef}>
          <motion.div className="container it-hero__content" style={{ y: heroY, opacity: heroOpacity }}>
            <motion.span
              className="it-badge"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span className="it-badge__dot" /> {t('division.it')}
            </motion.span>
            <SplitHeading as="h1" className="title-xl it-hero__title" text={t('division.itTag')} immediate delay={0.25} />
            <motion.p className="it-hero__lead" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.8 }}>
              Zyntex Integrated Systems is the technology division of Zyntex, delivering IT services and technology solutions.
            </motion.p>
            <motion.div className="it-hero__actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.8 }}>
              <a href="#it-contact" className="btn btn--it">
                {t('common.contactUs')} <ArrowRight />
              </a>
              <Link to={routes.divisions} className="btn btn--it-ghost">
                {t('common.backToDivisions')}
              </Link>
            </motion.div>
          </motion.div>
          <motion.span className="it-scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} aria-hidden="true">
            <span />
          </motion.span>
        </section>

        <div className="it-marquee" aria-hidden="true">
          <div className="it-marquee__track">
            {[0, 1].map((k) => (
              <span key={k}>
                {MARQUEE.map((m) => (
                  <span key={m} className="it-marquee__item">
                    {m}
                    <i>✦</i>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        <section className="section it-about" aria-labelledby="it-about-title">
          <div className="container">
            <Reveal>
              <TiltCard className="glass it-about__card" max={4}>
                <div className="split">
                  <div>
                    <span className="eyebrow eyebrow--it">{t('division.it')}</span>
                    <SplitHeading id="it-about-title" as="h2" className="title-lg it-title" text={t('division.itTag')} />
                  </div>
                  <div className="it-about__text">
                    <p>
                      Zyntex is built around two divisions. Alongside Zyntex Apparel — fashion design, product development and garment
                      manufacturing — Integrated Systems is the division dedicated to IT services and technology solutions.
                    </p>
                    <p>Tell us what you are planning and our team will get back to you.</p>
                    <a href="#it-contact" className="link-arrow link-arrow--it">
                      <span>{t('common.contactUs')}</span> <ArrowRight />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </section>

        <section id="it-contact" className="section it-contact" aria-labelledby="it-contact-title">
          <div className="container">
            <Reveal className="section-head">
              <span className="eyebrow eyebrow--it">{t('contact.getInTouch')}</span>
              <h2 id="it-contact-title" className="title-lg it-title">
                {t('contact.sendMessage')}
              </h2>
            </Reveal>
            <div className="it-contact__layout">
              <div className="it-contact__cards">
                {cards.map(({ Icon, label, value, href, ext }, i) => (
                  <Reveal key={label} delay={i * 0.1}>
                    <TiltCard className="it-card glass" max={8}>
                      <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        <span className="it-card__icon">
                          <Icon />
                        </span>
                        <span>
                          <span className="it-card__label">{label}</span>
                          <span className="it-card__value">{value}</span>
                        </span>
                      </a>
                    </TiltCard>
                  </Reveal>
                ))}
              </div>
              <Reveal delay={0.15} className="glass it-form">
                <ContactForm defaultSubject="s_it" tone="dark" />
              </Reveal>
            </div>
          </div>
        </section>
      </Page>

      <footer className="it-footer container">
        <span>
          © {new Date().getFullYear()} Zyntex · {legalEntity}
        </span>
        <Link to={routes.divisions}>← {t('common.backToDivisions')}</Link>
      </footer>
    </div>
  );
}
