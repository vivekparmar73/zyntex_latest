import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import monogram from '../assets/images/brand/zyntex-monogram-green.webp';
import wordmark from '../assets/images/brand/zyntex-wordmark-green.webp';

const ease = [0.22, 1, 0.36, 1];

/** ~2 second logo reveal shown once per session on entry, then it lifts away to reveal the homepage. */
export default function IntroAnimation({ onDone }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 1700);
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
            <motion.img
              className="intro__mark"
              src={monogram}
              alt=""
              initial={{ clipPath: 'inset(0% 100% 100% 0%)', scale: 0.86, opacity: 0 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease }}
            />
            <motion.img
              className="intro__word"
              src={wordmark}
              alt="Zyntex"
              initial={{ y: 18, opacity: 0, filter: 'blur(6px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
            />
            <motion.span
              className="intro__line"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.7, ease }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
