import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import { Page } from '../components/Motion';
import { ArrowRight } from '../components/Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../data/site';

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <Page className="not-found">
      <Seo title="Page not found" />
      <div className="container">
        <span className="not-found__code">404</span>
        <h1 className="title-lg">This page could not be found</h1>
        <Link to={routes.apparel} className="btn btn--primary">
          {t('division.apparel')} <ArrowRight />
        </Link>
      </div>
    </Page>
  );
}
