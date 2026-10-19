import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Img } from './Motion';

const INTERVAL = 4000;
const ease = [0.22, 1, 0.36, 1];

function useIsNarrow(query = '(max-width: 760px)') {
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setNarrow(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return narrow;
}

/**
 * The four design cards. Desktop: 2×2 grid with the highlight moving card to card.
 * Mobile: one card at a time with a crossfade. Rotates every 4 s; pauses on hover/focus.
 */
export default function DesignCarousel({ items }) {
  const narrow = useIsNarrow();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reduce) return undefined;
    const timer = setTimeout(() => setActive((a) => (a + 1) % items.length), INTERVAL);
    return () => clearTimeout(timer);
  }, [active, paused, reduce, items.length]);

  const pauseProps = {
    onPointerEnter: (e) => e.pointerType === 'mouse' && setPaused(true),
    onPointerLeave: () => setPaused(false),
    onFocus: () => setPaused(true),
    onBlur: () => setPaused(false),
  };

  const progress = (i) =>
    i === active && !reduce ? (
      <motion.span
        key={`p-${active}`}
        className="design-carousel__progress"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: paused ? 0 : 1 }}
        transition={{ duration: paused ? 0.3 : INTERVAL / 1000, ease: 'linear' }}
      />
    ) : null;

  if (narrow) {
    const item = items[active];
    return (
      <div className="design-carousel design-carousel--single" {...pauseProps}>
        <div className="design-carousel__stage">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={active}
              className="design-carousel__card is-active"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.6, ease }}
            >
              <Img image={item} sizes="100vw" />
              {progress(active)}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="design-carousel__dots" role="tablist" aria-label="Design highlights">
          {items.map((it, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={it.alt}
              className={i === active ? 'is-active' : ''}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="design-carousel" {...pauseProps}>
      {items.map((item, i) => (
        <motion.button
          key={i}
          type="button"
          className={`design-carousel__card ${i === active ? 'is-active' : ''}`}
          aria-label={item.alt}
          aria-pressed={i === active}
          onClick={() => setActive(i)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease }}
        >
          <Img image={item} sizes="(max-width: 1440px) 50vw, 720px" />
          {progress(i)}
        </motion.button>
      ))}
    </div>
  );
}
