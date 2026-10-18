import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import { Page, Reveal, SplitHeading, TiltCard } from '../components/Motion';
import { teamPhoto } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { routes, team } from '../data/site';

export default function Leadership() {
  const { t } = useLanguage();
  return (
    <Page>
      <Seo
        title="Leadership"
        description="Meet the leaders behind Zyntex who guide our journey across apparel manufacturing and technology."
        path={routes.leadership}
      />
      <PageBanner title={t('nav.leadership')} />

      <section className="section" aria-labelledby="leaders-title">
        <div className="container split">
          <SplitHeading id="leaders-title" as="h2" className="title-lg title-green" text="Meet the leaders behind Zyntex" />
          <Reveal delay={0.1} className="lead">
            <p>
              At Zyntex, our vision is driven by the people who bring innovation, expertise, and purpose to everything we do. Our leadership team
              guides our journey across apparel manufacturing and technology, setting strategic goals, strengthening our capabilities, and fostering
              a culture of continuous improvement. Through their collective experience, forward-thinking approach, and commitment to excellence,
              they empower our teams to deliver quality, build lasting partnerships, and shape the future of Zyntex.
            </p>
          </Reveal>
        </div>

        <div className="container">
          <ul className="team-grid">
            {team.map((person, i) => (
              <Reveal as="li" key={person.slug} delay={(i % 4) * 0.08}>
                <TiltCard className="person" max={8}>
                  <div className="person__photo">
                    <img src={teamPhoto(person.slug)} alt={`Portrait of ${person.name}`} loading="lazy" decoding="async" width="720" height="900" />
                  </div>
                  <div className="person__meta">
                    <h3>{person.name}</h3>
                    <p className={person.role ? '' : 'person__role--tbc'}>{person.role || t('leadership.roleTbc')}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </Page>
  );
}
