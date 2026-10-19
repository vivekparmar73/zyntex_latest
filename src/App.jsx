import { useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import IntroAnimation from './components/IntroAnimation';
import { ScrollManager, useRouteScroll } from './components/SmoothScroll';
import { Curtain, CursorFollower, ScrollProgress } from './components/Effects';
import useContentProtection from './hooks/useContentProtection';
import { useLanguage } from './i18n/LanguageContext';
import { routes } from './data/site';

import ApparelHome from './pages/ApparelHome';
import OurJourney from './pages/OurJourney';
import Design from './pages/Design';
import Manufacturing from './pages/Manufacturing';
import Products from './pages/Products';
import OperationalExcellence from './pages/OperationalExcellence';
import AboutUs from './pages/AboutUs';
import Leadership from './pages/Leadership';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import PrivacyPolicy from './pages/PrivacyPolicy';
import NotFound from './pages/NotFound';

const INTRO_KEY = 'zyntex-intro-seen';

function shouldPlayIntro(pathname) {
  if (pathname !== routes.home) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== '1';
  } catch {
    return true;
  }
}

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a className="skip-link" href="#main">
      {t('nav.skip')}
    </a>
  );
}

function SiteLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

/** One per pathname: owns the page-transition curtain and the scroll reset. */
function RouteFrame({ children }) {
  useRouteScroll();
  return (
    <motion.div className="route-frame" exit={{ opacity: 1, transition: { duration: 0.65 } }}>
      {children}
      <Curtain />
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  const [intro, setIntro] = useState(() => shouldPlayIntro(location.pathname));
  useContentProtection();

  const finishIntro = () => {
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* storage unavailable */
    }
    setIntro(false);
  };

  return (
    <>
      <SkipLink />
      {intro && <IntroAnimation onDone={finishIntro} />}
      <ScrollProgress />
      <CursorFollower />
      <ScrollManager />
      <AnimatePresence mode="wait" initial={false}>
        <RouteFrame key={location.pathname}>
          <Routes location={location}>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<ApparelHome />} />
              <Route path="/our-journey" element={<OurJourney />} />
              <Route path="/apparel-designer" element={<Design />} />
              <Route path="/clothing-and-apparel-manufacturers" element={<Manufacturing />} />
              <Route path="/products" element={<Products />} />
              <Route path="/operational-excellence" element={<OperationalExcellence />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/leadership" element={<Leadership />} />
              <Route path="/contact-us" element={<Contact />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              {/* Old URLs */}
              <Route path="/apparel" element={<Navigate to={routes.home} replace />} />
              <Route path="/integrated-systems" element={<Navigate to={routes.home} replace />} />
              <Route path="/contact" element={<Navigate to={routes.contact} replace />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </RouteFrame>
      </AnimatePresence>
    </>
  );
}
