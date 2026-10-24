import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from './Icons';
import { useLanguage } from '../i18n/LanguageContext';
import { routes } from '../data/site';
import { rackGarments } from '../data/rack';

// Physics tuning (seconds, radians, pixels)
const GRAVITY = 38; // pendulum stiffness → ~1 Hz swing
const SWING_DAMP = 1.9;
const SLIDE_K = 26; // spring pulling each hanger back to its slot
const SLIDE_DAMP = 7.5;
const MAX_ANGLE = 0.65;
const PAN_FRICTION = 3.2; // momentum decay of the sliding rack (per second)

function useLayout(stageRef) {
  const [layout, setLayout] = useState(null);
  useEffect(() => {
    const el = stageRef.current;
    const measure = () => {
      const width = el.clientWidth;
      const items = rackGarments;
      const n = items.length;
      const margin = Math.max(14, Math.min(56, width * 0.03));
      const total = items.reduce((sum, g) => sum + g.w, 0);
      // Desktop: scale so every garment fits across the screen with an even gap between them.
      // Phones/tablets: a fixed, readable scale — the rack becomes wider than the screen and slides.
      let gap = Math.max(12, Math.min(34, width * 0.016));
      let scale = (width - margin * 2 - gap * (n - 1)) / total;
      if (width < 1080) {
        scale = width < 640 ? 0.58 : 0.7;
        gap = width < 640 ? 14 : 20;
      }
      scale = Math.min(scale, 1.15);
      // each garment hangs from its own hook point; neighbours sit an even gap apart
      const xs = [];
      let left = margin;
      items.forEach((g) => {
        xs.push(left + g.hookX * scale);
        left += g.w * scale + gap;
      });
      const used = left - gap + margin;
      // centre the rack when it is narrower than the screen
      const shift = used < width ? (width - used) / 2 : 0;
      const contentWidth = Math.max(width, used);
      const h = Math.max(...items.map((g) => g.h)) * scale;
      const avgW = (total / n) * scale;
      setLayout({ width, items, xs: xs.map((x) => x + shift), spacing: avgW + gap, margin, scale, w: avgW, h, contentWidth, maxPan: contentWidth - width });
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
  const trackRef = useRef(null);
  // horizontal position of the rack (phones/tablets): x, velocity, and the active drag
  const pan = useRef({ x: 0, v: 0, prevV: 0, drag: null, peeked: false });
  const [pannable, setPannable] = useState(false);
  const [edges, setEdges] = useState({ start: false, end: true });
  const layout = useLayout(stageRef);
  const [active, setActive] = useState(null);
  const activeRef = useRef(null);

  const RAIL_Y = 26;

  // reset simulation state when the layout changes
  useEffect(() => {
    if (!layout) return;
    sim.current = layout.items.map((_, i) => {
      // each garment gets its own weight and rhythm so they never move in lock-step
      const f = (i * 0.618034) % 1;
      return { th: 0, om: 0, off: 0, v: 0, phase: i * 1.7, k: 0.6 + 0.55 * f, grav: GRAVITY * (0.8 + 0.4 * ((f * 7) % 1)) };
    });
    pan.current.x = Math.min(pan.current.x, layout.maxPan);
    setPannable(layout.maxPan > 0);
  }, [layout]);

  const restX = (i) => layout.xs[i];

  // x in rack-content coordinates (stage x + pan)
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
      const minGapOf = (i) => ((layout.items[i].w + layout.items[i + 1].w) / 2) * layout.scale * 0.55;
      const tSec = now / 1000;
      const pn = pan.current;

      // ---- rack pan (only when the rack is wider than the screen) ----
      let panAcc = 0;
      if (layout.maxPan > 0) {
        const before = pn.x;
        if (pn.drag) {
          pn.x = pn.drag.startPan - (pn.drag.x - pn.drag.startX);
          // rubber-band past the ends
          if (pn.x < 0) pn.x *= 0.35;
          if (pn.x > layout.maxPan) pn.x = layout.maxPan + (pn.x - layout.maxPan) * 0.35;
          pn.v = (pn.x - before) / Math.max(dt, 0.001);
        } else {
          pn.x += pn.v * dt;
          pn.v *= Math.exp(-PAN_FRICTION * dt);
          // spring back inside the ends
          if (pn.x < 0) pn.v += -pn.x * 60 * dt - pn.v * 8 * dt;
          if (pn.x > layout.maxPan) pn.v += (layout.maxPan - pn.x) * 60 * dt - pn.v * 8 * dt;
          if (Math.abs(pn.v) < 2 && pn.x >= 0 && pn.x <= layout.maxPan) pn.v = 0;
        }
        panAcc = (pn.v - pn.prevV) / Math.max(dt, 0.001);
        pn.prevV = pn.v;
        if (trackRef.current) trackRef.current.style.transform = `translate3d(${(-pn.x).toFixed(2)}px,0,0)`;
      }

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
        // the rack moving under the hanger makes the garment lag behind and swing
        if (panAcc) g.om += Math.max(-36, Math.min(36, panAcc / 200)) * dt * 9 * g.k;
        // pendulum + a soft idle breeze
        const breeze = reduce ? 0 : 0.35 * Math.sin(tSec * 0.7 + g.phase);
        g.om += (-g.grav * Math.sin(g.th) - SWING_DAMP * g.om + breeze) * dt;
        g.th = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, g.th + g.om * dt));
      });

      // neighbours bump into each other along the rail
      for (let i = 0; i < s.length - 1; i++) {
        const a = s[i];
        const b = s[i + 1];
        const gap = restX(i + 1) + b.off - (restX(i) + a.off);
        if (gap < minGapOf(i)) {
          const push = (minGapOf(i) - gap) / 2;
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
    const edgeTimer = setInterval(() => {
      const x = pan.current.x;
      setEdges((e) => {
        const next = { start: x > 8, end: x < layout.maxPan - 8 };
        return e.start === next.start && e.end === next.end ? e : next;
      });
    }, 150);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      clearInterval(edgeTimer);
    };
  }, [layout, reduce]);

  // first time the rack scrolls into view on a phone, give it a gentle slide to show it moves
  useEffect(() => {
    if (!layout || layout.maxPan <= 0 || reduce) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !pan.current.peeked) {
          pan.current.peeked = true;
          setTimeout(() => {
            if (!pan.current.drag) pan.current.v = Math.min(900, layout.maxPan * 2.2);
          }, 500);
        }
      },
      { threshold: 0.6 },
    );
    io.observe(stageRef.current);
    return () => io.disconnect();
  }, [layout, reduce]);

  // ---- pointer interaction ----
  // returns content coordinates (accounting for how far the rack has been slid)
  const local = (e) => {
    const r = stageRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left + pan.current.x, y: e.clientY - r.top, sx: e.clientX - r.left };
  };

  const onPointerMove = (e) => {
    const { x, y, sx } = local(e);
    const p = pointer.current;
    const pn = pan.current;
    const now = performance.now();

    if (pn.drag && pn.drag.id === e.pointerId) {
      const dx = sx - pn.drag.startX;
      const dy = e.clientY - pn.drag.startY;
      if (!pn.drag.moved && Math.hypot(dx, dy) > 6) {
        if (Math.abs(dx) < Math.abs(dy)) {
          pn.drag = null; // vertical: let the page scroll
          return;
        }
        pn.drag.moved = true;
      }
      pn.drag.x = sx;
      Object.assign(p, { x, y, t: now, inside: true });
      return;
    }

    if (p.grab >= 0) {
      p.grabX = x;
    } else if (p.inside && now - p.t < 120 && !(layout?.maxPan > 0 && e.pointerType !== 'mouse')) {
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
    const { x, y, sx } = local(e);
    const i = hitTest(x, y);
    Object.assign(pointer.current, { x, y, t: performance.now(), inside: true });
    const canPan = layout && layout.maxPan > 0;

    if (e.pointerType === 'mouse' && i >= 0) {
      // mouse on a garment: grab and slide that hanger along the rail
      highlight(i);
      pointer.current.grab = i;
      pointer.current.grabX = x;
      e.currentTarget.setPointerCapture(e.pointerId);
      return;
    }
    if (canPan) {
      // touch anywhere (or mouse on the bare rail): drag the whole rack sideways
      pan.current.drag = { id: e.pointerId, startX: sx, startY: e.clientY, startPan: pan.current.x, x: sx, moved: false, hit: i };
      pan.current.v = 0;
      return;
    }
    if (i >= 0) {
      highlight(i);
      sim.current[i].om += (x < restX(i) + sim.current[i].off ? 1 : -1) * 1.4;
    }
  };

  const release = (e) => {
    pointer.current.grab = -1;
    const d = pan.current.drag;
    if (d && (!e || d.id === e.pointerId)) {
      // a tap (no real movement) pushes the garment under the finger
      if (!d.moved && d.hit >= 0 && sim.current[d.hit]) {
        highlight(d.hit);
        sim.current[d.hit].om += (pointer.current.x < restX(d.hit) + sim.current[d.hit].off ? 1 : -1) * 1.6;
      }
      pan.current.drag = null;
    }
  };

  const nudge = (i) => {
    if (!sim.current[i]) return;
    // keyboard focus on an off-screen garment slides the rack to it
    if (layout?.maxPan > 0) {
      const target = Math.max(0, Math.min(layout.maxPan, restX(i) - layout.width / 2));
      pan.current.v = (target - pan.current.x) * PAN_FRICTION;
    }
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
        className={`rack__stage ${pannable ? 'is-pannable' : ''} ${edges.start ? 'show-start' : ''} ${edges.end ? 'show-end' : ''}`}
        style={layout ? { height: RAIL_Y + layout.h + 24 } : undefined}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={() => {
          pointer.current.inside = false;
        }}
      >
        <div ref={trackRef} className="rack__track" style={layout ? { width: layout.contentWidth } : undefined}>
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
                <span className="rack__hint">{t(pannable ? 'rack.hintPan' : 'rack.hint')}</span>
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
