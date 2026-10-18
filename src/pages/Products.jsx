import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Seo from '../components/Seo';
import PageBanner from '../components/PageBanner';
import ProductRing3D from '../components/ProductRing3D';
import { Img, Page, Reveal, SplitHeading, TiltCard } from '../components/Motion';
import { ArrowRight } from '../components/Icons';
import { images, productTiles } from '../assets/images';
import { useLanguage } from '../i18n/LanguageContext';
import { productCategories, productItems, routes } from '../data/site';

const products = productItems.map((p, i) => ({ ...p, src: productTiles[i] }));
const categoryName = Object.fromEntries(productCategories.map((c) => [c.id, c.name]));

export default function Products() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const usedCategories = useMemo(() => productCategories.filter((c) => products.some((p) => p.category === c.id)), []);
  const visible = filter === 'all' ? products : products.filter((p) => p.category === filter);

  return (
    <Page>
      <Seo
        title="Products"
        description="Zyntex designs and manufactures high-quality apparel for all ages, sizes and genders — knits, wovens, denim, outerwear, activewear, loungewear, childrenwear and more."
        path={routes.products}
      />
      <PageBanner title={t('nav.products')} />

      <section className="section" aria-labelledby="products-title">
        <div className="container split">
          <SplitHeading id="products-title" as="h2" className="title-lg title-green" text="We design and manufacture high-quality apparel across categories" />
          <Reveal delay={0.1} className="lead">
            <p>
              With our experience in the manufacturing industry, we have created top-notch apparel for brands across the globe. At Zyntex we
              refine our crafts consistently. With a diverse portfolio, our categories are wide spread. We create clothing for all ages, sizes, and
              genders with passion and integrity. All clothes manufactured at Zyntex are made through sustainable solutions. We use a co-creation
              process to design apparel and our fabrics are sourced from some of the best locations to meet international standards and quality.
            </p>
            <Link to={routes.contact} className="btn btn--primary">
              {t('products.talk')} <ArrowRight />
            </Link>
          </Reveal>
        </div>

        <div className="container">
          <Reveal className="products-sheet">
            <h3 className="eyebrow">{t('products.categories')}</h3>
            <Img image={images.products1} sizes="(max-width: 1320px) 100vw, 1320px" />
          </Reveal>
        </div>
      </section>

      <section className="section ring-section" aria-labelledby="gallery-title">
        <div className="container">
          <Reveal className="section-head section-head--center">
            <span className="eyebrow">Zyntex Apparel</span>
            <h2 id="gallery-title" className="title-lg">
              {t('products.gallery')}
            </h2>
          </Reveal>
        </div>
        <ProductRing3D items={products} />
      </section>

      <section className="section--tight" aria-label="Browse by category">
        <div className="container">
          <div className="filters" role="tablist" aria-label={t('products.categories')}>
            {[{ id: 'all', name: t('products.all') }, ...usedCategories].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={filter === c.id}
                className={filter === c.id ? 'is-active' : ''}
                onClick={() => setFilter(c.id)}
              >
                {filter === c.id && <motion.span layoutId="filter-pill" className="filters__pill" />}
                <span>{c.name}</span>
              </button>
            ))}
          </div>

          <motion.ul layout className="product-grid">
            <AnimatePresence mode="popLayout">
              {visible.map((p) => (
                <motion.li
                  layout
                  key={p.src}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard className="product-card" max={10}>
                    <img src={p.src} alt={p.label} loading="lazy" decoding="async" />
                    <div className="product-card__meta">
                      <span>{categoryName[p.category]}</span>
                      <strong>{p.label}</strong>
                    </div>
                  </TiltCard>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>

          <Reveal className="cta-band">
            <h2 className="title-md">{t('products.talk')}</h2>
            <Link to={routes.contact} className="btn btn--primary">
              {t('nav.contact')} <ArrowRight />
            </Link>
          </Reveal>
        </div>
      </section>
    </Page>
  );
}
