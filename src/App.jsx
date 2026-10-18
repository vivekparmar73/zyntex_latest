import { Suspense, lazy } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import { ScrollManager, useRouteScroll } from './components/SmoothScroll';
import { Curtain, CursorFollower, ScrollProgress } from './components/Effects';
import { useLanguage } from './i18n/LanguageContext';
import { routes } from './data/site';

import DivisionSelect from './pages/DivisionSelect';
import ApparelHome from './pages/ApparelHome';
import Design from './pages/Design';
import Manufacturing from './pages/Manufacturing';
import Products from './pages/Products';
import OperationalExcellence from './pages/OperationalExcellence';
import AboutUs from './pages/AboutUs';
import Leadership from './pages/Leadership';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// three.js is only needed on the Integrated Systems page, so it loads separately.
const IntegratedSystems = lazy(() => import('./pages/IntegratedSystems'));

function SkipLink() {
  const { t } = useLanguage();
  return (
    <a className="skip-link" href="#main">
      {t('nav.skip')}
    </a>
  );
}

function ApparelLayout() {
  return (
    <>
      <Header home={routes.apparel} />
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
  return (
    <>
      <SkipLink />
      <ScrollProgress />
      <CursorFollower />
      <ScrollManager />
      <AnimatePresence mode="wait" initial={false}>
        <RouteFrame key={location.pathname}>
          <Suspense fallback={<div className="route-loading" />}>
            <Routes location={location}>
              <Route path="/" element={<DivisionSelect />} />
              <Route path="/integrated-systems" element={<IntegratedSystems />} />
              <Route element={<ApparelLayout />}>
                <Route path="/apparel" element={<ApparelHome />} />
                <Route path="/apparel-designer" element={<Design />} />
                <Route path="/clothing-and-apparel-manufacturers" element={<Manufacturing />} />
                <Route path="/products" element={<Products />} />
                <Route path="/operational-excellence" element={<OperationalExcellence />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/leadership" element={<Leadership />} />
                <Route path="/contact-us" element={<Contact />} />
                <Route path="/contact" element={<Navigate to={routes.contact} replace />} />
                <Route path="/our-journey" element={<Navigate to={routes.journey} replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </RouteFrame>
      </AnimatePresence>
    </>
  );
}
