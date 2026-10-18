import { useEffect, useRef, useState } from 'react';
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

/** A draggable, auto-rotating 3D cylinder of product images. */
export default function ProductRing3D({ items }) {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const rotation = useMotionValue(0);
  const transform = useTransform(rotation, (r) => `translateZ(calc(var(--radius) * -1)) rotateY(${r}deg)`);
  const drag = useRef({ active: false, x: 0, start: 0, velocity: 0 });
  const [dragging, setDragging] = useState(false);
  const step = 360 / items.length;

  useAnimationFrame((_, delta) => {
    const d = drag.current;
    if (d.active || reduce) return;
    d.velocity *= 0.95;
    rotation.set(rotation.get() + d.velocity + delta * 0.006);
  });

  useEffect(() => {
    const onUp = () => {
      drag.current.active = false;
      setDragging(false);
    };
    window.addEventListener('pointerup', onUp);
    return () => window.removeEventListener('pointerup', onUp);
  }, []);

  const onDown = (e) => {
    drag.current = { active: true, x: e.clientX, start: rotation.get(), velocity: 0, last: e.clientX };
    setDragging(true);
  };
  const onMove = (e) => {
    const d = drag.current;
    if (!d.active) return;
    rotation.set(d.start + (e.clientX - d.x) * 0.25);
    d.velocity = (e.clientX - d.last) * 0.25;
    d.last = e.clientX;
  };

  return (
    <div className={`ring3d ${dragging ? 'is-dragging' : ''}`} style={{ '--count': items.length }}>
      <div className="ring3d__stage" onPointerDown={onDown} onPointerMove={onMove} style={{ touchAction: 'pan-y' }}>
        <motion.div className="ring3d__ring" style={{ transform }}>
          {items.map((item, i) => (
            <figure key={i} className="ring3d__card" style={{ transform: `rotateY(${i * step}deg) translateZ(var(--radius))` }}>
              <img src={item.src} alt={item.label} loading="lazy" draggable="false" />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
      <p className="ring3d__hint" aria-hidden="true">
        ← {t('products.drag')} →
      </p>
    </div>
  );
}
