import { Fragment, useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];
const easeSoft = [0.16, 1, 0.3, 1];

/**
 * Fades, lifts and gently scales children into view once. Marks itself `.is-inview` so CSS
 * details inside it (e.g. the eyebrow line) can animate in step.
 */
export function Reveal({ children, delay = 0, y = 44, as = 'div', className, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.05, delay, ease: easeSoft }}
      onViewportEnter={(entry) => entry?.target?.classList.add('is-inview')}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Headline that rises word-by-word with a slight 3D rotation. */
export function SplitHeading({ text, as = 'h2', className, delay = 0, immediate = false, id }) {
  const Tag = motion[as];
  const words = String(text).split(' ');
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: delay } },
  };
  const word = {
    hidden: { y: '110%', rotateX: -70, opacity: 0 },
    show: { y: '0%', rotateX: 0, opacity: 1, transition: { duration: 0.9, ease } },
  };
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } };
  return (
    <Tag id={id} className={`split-heading ${className || ''}`} variants={container} initial="hidden" {...trigger} aria-label={text}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="split-heading__mask" aria-hidden="true">
            <motion.span className="split-heading__word" variants={word}>
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/** Responsive <img> with a small and large source. */
export function Img({ image, sizes = '100vw', eager = false, className, alt }) {
  return (
    <img
      className={className}
      src={image.src}
      srcSet={`${image.sm} 900w, ${image.src} 2200w`}
      sizes={sizes}
      alt={alt ?? image.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
    />
  );
}

/** Image that reveals with a clip wipe and drifts on scroll. */
export function ParallaxImage({ image, sizes, className = '', ratio, strength = 60, eager, alt, radius = 18 }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-strength, strength]);
  return (
    <motion.div
      ref={ref}
      className={`frame parallax ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      initial={{ clipPath: `inset(12% 8% 12% 8% round ${radius}px)`, opacity: 0.4 }}
      whileInView={{ clipPath: `inset(0% 0% 0% 0% round ${radius}px)`, opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.3, ease }}
    >
      <motion.div className="parallax__inner" style={{ y }}>
        <Img image={image} sizes={sizes} eager={eager} alt={alt} />
      </motion.div>
    </motion.div>
  );
}

/** 3D tilt that follows the pointer, with a soft glare. */
export function TiltCard({ children, className = '', max = 9, as = 'div', ...rest }) {
  const Tag = motion[as];
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const glare = useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.35), transparent 55%)`);

  const onMove = (e) => {
    if (reduce || e.pointerType === 'touch') return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <Tag
      className={`tilt ${className}`}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 1100 }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      {children}
      <motion.span className="tilt__glare" style={{ background: glare }} aria-hidden="true" />
    </Tag>
  );
}

/** Counts up to `value` when scrolled into view. */
export function CountUp({ value, suffix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(0, value, { duration: 2, ease, onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/** Wrapper for each routed page: a soft fade-up on enter. */
export function Page({ children, className }) {
  return (
    <motion.main
      id="main"
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      // filter is cleared afterwards: a lingering filter would change how fixed elements position
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      transition={{ duration: 0.9, delay: 0.25, ease: easeSoft }}
    >
      {children}
    </motion.main>
  );
}
