import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SplitHeading } from './Motion';
import { routes } from '../data/site';

/** Large green title banner used at the top of inner pages. `solid` gives the plain centred variant. */
export default function PageBanner({ title, crumb, solid = false }) {
  if (solid) {
    return (
      <>
        <section className="banner banner--solid">
          <div className="container">
            <SplitHeading as="h1" className="banner__title" text={title} immediate delay={0.1} />
          </div>
        </section>
        <nav className="container crumbs" aria-label="Breadcrumb">
          <Link to={routes.home}>Home</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{crumb || title}</span>
        </nav>
      </>
    );
  }
  return (
    <section className="banner">
      <svg className="banner__threads" viewBox="0 0 1200 300" preserveAspectRatio="none" aria-hidden="true">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.path
            key={i}
            d={`M-50 ${60 + i * 30} C 300 ${-40 + i * 45}, 700 ${320 - i * 30}, 1250 ${90 + i * 22}`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
      </svg>
      <div className="container banner__inner">
        <motion.nav
          className="banner__crumbs"
          aria-label="Breadcrumb"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link to={routes.home}>Zyntex Apparel</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{crumb || title}</span>
        </motion.nav>
        <SplitHeading as="h1" className="banner__title" text={title} immediate delay={0.1} />
      </div>
    </section>
  );
}
