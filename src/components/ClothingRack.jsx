import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../data/site';
import { MEDIUM_SET, NARROW_SET, rackGarments } from '../data/rack';

// Physics tuning (seconds, radians, pixels)
const GRAVITY = 38; // pendulum stiffness → ~1 Hz swing
const SWING_DAMP = 1.9;
const SLIDE_K = 26; // spring pulling each hanger back to its slot
const SLIDE_DAMP = 7.5;
const MAX_ANGLE = 0.65;

function useLayout(stageRef) {
  const [layout, setLayout] = useState(null);
  useEffect(() => {
    const el = stageRef.current;
    const measure = () => {
      const width = el.clientWidth;
      const set = width < 640 ? NARROW_SET : width < 1080 ? MEDIUM_SET : null;
      const items = set ? rackGarments.filter((g) => set.includes(g.file)) : rackGarments;
      // keep the end garments clear of the rail brackets / screen edge
      const margin = Math.max(14, Math.min(56, width * 0.03));
      const spacing = (width - margin * 2) / items.length;
      // one shared scale keeps the garments' true relative sizes (photos are ~176px wide natively)
      const scale = Math.max(0.45, Math.min(1.1, (spacing * (width < 640 ? 1.12 : 1.02)) / 176));
      const h = Math.max(...items.map((g) => g.h)) * scale;
      setLayout({ width, items, spacing, margin, scale, w: 176 * scale, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [stageRef]);
  return layout;
}

export default function ClothingRack() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const nodes = useRef([]);
  const sim = useRef([]);
  const pointer = useRef({ x: 0, y: 0, t: 0, inside: false, grab: -1, grabX: 0 });
  const layout = useLayout(stageRef);
  const [active, setActive] = useState(null);
  const activeRef = useRef(null);

  const RAIL_Y = 26;

  // reset simulation state when the layout changes
  useEffect(() => {
    if (!layout) return;
    sim.current = layout.items.map((_, i) => ({ th: 0, om: 0, off: 0, v: 0, phase: i * 1.7 }));
  }, [layout]);

  const restX = (i) => layout.margin + layout.spacing * (i + 0.5);

  const hitTest = (x, y) => {
    if (!layout) return -1;
    const top = RAIL_Y;
    if (y < top || y > top + layout.h * 0.92) return -1;
    let best = -1;
    let bestD = Infinity;
    layout.items.forEach((_, i) => {
      const cx = restX(i) + (sim.current[i]?.off || 0);
      const d = Math.abs(x - cx);
      if (d < layout.w * 0.42 && d < bestD) {
        best = i;
        bestD = d;
      }
    });
    return best;
  };

  const highlight = (i) => {
    if (i < 0 || activeRef.current === i) return;
    activeRef.current = i;
    setActive(i);
  };

  // ---- animation loop ----
  useEffect(() => {
    if (!layout) return undefined;
    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    });
    io.observe(stageRef.current);

    function step(now) {
      if (!visible) return;
      const dt = Math.min(0.033, (now - last) / 1000);
      last = now;
      const s = sim.current;
      const p = pointer.current;
      const minGap = layout.spacing * 0.52;
      const tSec = now / 1000;

      s.forEach((g, i) => {
        if (p.grab === i) {
          // follow the finger along the rail
          const target = Math.max(-layout.spacing * 1.6, Math.min(layout.spacing * 1.6, p.grabX - restX(i)));
          const nv = (target - g.off) / Math.max(dt, 0.001);
          const acc = (nv - g.v) / Math.max(dt, 0.001);
          g.v = nv;
          g.off = target;
          g.om += (-acc / 900) * dt;
        } else {
          const acc = -SLIDE_K * g.off - SLIDE_DAMP * g.v;
          g.v += acc * dt;
          g.off += g.v * dt;
          g.om += (-acc / 900) * dt; // inertia: sliding makes the garment swing back
        }
        // pendulum + a soft idle breeze
        const breeze = reduce ? 0 : 0.35 * Math.sin(tSec * 0.7 + g.phase);
        g.om += (-GRAVITY * Math.sin(g.th) - SWING_DAMP * g.om + breeze) * dt;
        g.th = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, g.th + g.om * dt));
      });

      // neighbours bump into each other along the rail
      for (let i = 0; i < s.length - 1; i++) {
        const a = s[i];
        const b = s[i + 1];
        const gap = restX(i + 1) + b.off - (restX(i) + a.off);
        if (gap < minGap) {
          const push = (minGap - gap) / 2;
          if (p.grab !== i) a.off -= push;
          if (p.grab !== i + 1) b.off += push;
          const rel = a.v - b.v;
          if (rel > 0) {
            a.v -= rel * 0.5;
            b.v += rel * 0.5;
            a.om -= rel * 0.0025;
            b.om += rel * 0.0025;
          }
        }
      }

      s.forEach((g, i) => {
        const el = nodes.current[i];
        if (el) el.style.transform = `translate3d(${g.off.toFixed(2)}px,0,0) rotate(${g.th.toFixed(4)}rad)`;
      });
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [layout, reduce]);

  // ---- pointer interaction ----
  const local = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerMove = (e) => {
    const { x, y } = local(e);
    const p = pointer.current;
    const now = performance.now();
    if (p.grab >= 0) {
      p.grabX = x;
    } else if (p.inside && now - p.t < 120) {
      // px per ms; fingers move less than a mouse sweep, so touch gets a little extra push
      const vx = ((x - p.x) / Math.max(1, now - p.t)) * (e.pointerType === 'touch' ? 1.7 : 1);
      const i = hitTest(x, y);
      if (i >= 0) {
        const g = sim.current[i];
        g.om += vx * 1.15;
        g.v += vx * 260;
        // a lighter nudge for the neighbours you brush past
        [i - 1, i + 1].forEach((j) => {
          if (sim.current[j] && Math.abs(x - (restX(j) + sim.current[j].off)) < layout.w * 0.6) sim.current[j].om += vx * 0.35;
        });
        highlight(i);
      }
    }
    if (e.pointerType === 'mouse') highlight(hitTest(x, y));
    Object.assign(p, { x, y, t: now, inside: true });
  };

  const onPointerDown = (e) => {
    const { x, y } = local(e);
    const i = hitTest(x, y);
    Object.assign(pointer.current, { x, y, t: performance.now(), inside: true });
    if (i < 0) return;
    highlight(i);
    if (e.pointerType === 'mouse') {
      // mouse: grab and slide the hanger along the rail
      pointer.current.grab = i;
      pointer.current.grabX = x;
      e.currentTarget.setPointerCapture(e.pointerId);
    } else {
      // touch: a tap gives the garment a little push
      sim.current[i].om += (x < restX(i) + sim.current[i].off ? 1 : -1) * 1.4;
    }
  };

  const release = () => {
    pointer.current.grab = -1;
  };

  const nudge = (i) => {
    if (!sim.current[i]) return;
    sim.current[i].om += 1.8;
    highlight(i);
  };

  const current = layout && active != null ? layout.items[active] : null;

  return (
    <section className="rack" aria-labelledby="rack-title">
      <div className="container rack__head">
        <p className="rack__eyebrow" id="rack-title">
          <span>{t('rack.eyebrow')}</span>
          <span className="rack__divider" aria-hidden="true" />
          <span className="rack__sub">{t('rack.sub')}</span>
        </p>
      </div>

      <div
        ref={stageRef}
        className="rack__stage"
        style={layout ? { height: RAIL_Y + layout.h + 24 } : undefined}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={() => {
          pointer.current.inside = false;
        }}
      >
        <div className="rack__rail" style={{ top: RAIL_Y - 5 }} aria-hidden="true" />
        {layout &&
          layout.items.map((g, i) => (
            <button
              key={g.file}
              type="button"
              className={`rack__item ${active === i ? 'is-active' : ''}`}
              aria-label={`${g.name} — ${g.category}`}
              ref={(el) => (nodes.current[i] = el)}
              onFocus={() => nudge(i)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), nudge(i))}
              style={{
                left: restX(i) - g.hookX * layout.scale,
                top: RAIL_Y - 3 - g.hookY * layout.scale,
                width: g.w * layout.scale,
                height: g.h * layout.scale,
                transformOrigin: `${g.hookX * layout.scale}px ${g.hookY * layout.scale}px`,
                zIndex: active === i ? 3 : 1,
              }}
            >
              <img className="garment__img" src={g.src} alt="" draggable="false" decoding="async" />
            </button>
          ))}
      </div>

      <div className="container rack__foot">
        <div className="rack__name" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current ? current.file : 'none'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {current ? (
                <>
                  <strong>{current.name}</strong>
                  <span>{current.category}</span>
                </>
              ) : (
                <span className="rack__hint">{t('rack.hint')}</span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <Link to={routes.products} className="btn btn--ghost rack__cta">
          {t('nav.ourProducts')} <ArrowRight />
        </Link>
      </div>
    </section>
  );
}
