import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import monogram from '../assets/images/brand/zyntex-monogram-white.webp';

const ease = [0.76, 0, 0.24, 1];

/**
 * Two-layer curtain rendered inside each route frame: it wipes up over the old page on exit
 * and lifts off the new page on enter.
 */
export function Curtain() {
  return (
    <>
      <motion.div
        className="curtain curtain--out"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.55, ease } }}
      />
      <motion.div
        className="curtain curtain--out curtain--deep"
        aria-hidden="true"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1, transition: { duration: 0.55, delay: 0.08, ease } }}
      >
        <motion.img className="curtain__mark" src={monogram} alt="" initial={{ opacity: 0 }} exit={{ opacity: 1, transition: { delay: 0.3, duration: 0.25 } }} />
      </motion.div>

      <motion.div
        className="curtain curtain--in curtain--deep"
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.7, delay: 0.05, ease } }}
      >
        <motion.img className="curtain__mark" src={monogram} alt="" initial={{ opacity: 1 }} animate={{ opacity: 0, transition: { duration: 0.2 } }} />
      </motion.div>
      <motion.div
        className="curtain curtain--in"
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0, transition: { duration: 0.7, delay: 0.14, ease } }}
      />
    </>
  );
}

/** Thin progress bar along the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** Soft ring that trails the mouse and grows over interactive elements (mouse only). */
export function CursorFollower() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches && !reduce);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return undefined;
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setHovering(!!e.target.closest?.('a, button, select, input, textarea, label, [role="tab"], .ring3d__stage'));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        className={`cursor-ring ${hovering ? 'is-hover' : ''} ${visible ? 'is-visible' : ''}`}
        style={{ x: rx, y: ry }}
        aria-hidden="true"
      />
      <motion.div className={`cursor-dot ${visible ? 'is-visible' : ''}`} style={{ x, y }} aria-hidden="true" />
    </>
  );
}
