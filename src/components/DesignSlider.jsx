import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Img } from './Motion';

const INTERVAL = 4500;
const ease = [0.22, 1, 0.36, 1];

const Arrow = ({ dir }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dir === 'prev' ? <path d="m15 6-6 6 6 6" /> : <path d="m9 6 6 6-6 6" />}
  </svg>
);

/**
 * Full-width design slider (Pearl Global style). Each slide image already carries the white
 * pointed title panel, so it is always shown whole at its own proportions on every screen.
 * Auto-advances every 4.5 s, pauses on hover, respects reduced motion.
 */
export default function DesignSlider({ slides }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef(null);
  const count = slides.length;

  const go = (step) => setIndex((i) => (i + step + count) % count);

  useEffect(() => {
    if (paused || reduce) return undefined;
    const timer = setTimeout(() => go(1), INTERVAL);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, paused, reduce]);

  const slide = slides[index];

  return (
    <section
      className="design-slider"
      aria-roledescription="carousel"
      aria-label="Design highlights"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <div className="design-slider__viewport">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="design-slider__slide"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}: ${slide.title}`}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease }}
          >
            <Img image={slide.image} sizes="100vw" alt={slide.title} eager={index === 0} />
          </motion.div>
        </AnimatePresence>

        <button type="button" className="design-slider__arrow is-prev" aria-label="Previous slide" onClick={() => go(-1)}>
          <Arrow dir="prev" />
        </button>
        <button type="button" className="design-slider__arrow is-next" aria-label="Next slide" onClick={() => go(1)}>
          <Arrow dir="next" />
        </button>
      </div>

      <div className="design-slider__dots" role="tablist" aria-label="Choose slide">
        {slides.map((s, i) => (
          <button
            key={s.title}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={s.title}
            className={i === index ? 'is-active' : ''}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
