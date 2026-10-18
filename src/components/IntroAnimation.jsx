import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const LETTERS = 'ZYNTEX'.split('');

/** ~2 second logo reveal shown once per session, then it lifts away to reveal the page beneath. */
export default function IntroAnimation({ onDone }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1650);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="intro"
          role="presentation"
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.55, ease }}
        >
          <div className="intro__stage">
            <motion.svg
              className="intro__mark"
              viewBox="0 0 48 48"
              initial={{ scale: 0.6, rotateY: -90, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease }}
            >
              <defs>
                <linearGradient id="intro-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#4fb383" />
                  <stop offset="1" stopColor="#0f5c3a" />
                </linearGradient>
              </defs>
              <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#intro-g)" />
              <motion.path
                d="M14 14h20L15 34h20"
                fill="none"
                stroke="#fff"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease }}
              />
            </motion.svg>
            <div className="intro__word" aria-label="Zyntex">
              {LETTERS.map((l, i) => (
                <motion.span
                  key={i}
                  initial={{ y: '100%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.45 + i * 0.06, ease }}
                >
                  {l}
                </motion.span>
              ))}
            </div>
            <motion.span
              className="intro__line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.6, ease }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
