import { useEffect, useRef } from 'react';

/**
 * A rotating 3D point-sphere with network arcs, rendered on a 2D canvas.
 * Used as the visual identity of the Integrated Systems division.
 */
export default function TechGlobe({ className = '', density = 900 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fibonacci sphere
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < density; i++) {
      const y = 1 - (i / (density - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const th = golden * i;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    // Arcs only between points that are reasonably close, so they hug the surface
    const arcs = [];
    while (arcs.length < 18) {
      const a = pts[(Math.random() * density) | 0];
      const b = pts[(Math.random() * density) | 0];
      const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
      if (dot > 0.35 && dot < 0.9) arcs.push([a, b, Math.random()]);
    }

    let w = 0;
    let h = 0;
    let dpr = 1;
    let rotY = 0;
    let rotX = -0.35;
    let targetTilt = { x: 0, y: 0 };
    let tilt = { x: 0, y: 0 };
    let raf = 0;
    let visible = true;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = ([x, y, z], R, cx, cy) => {
      const ry = rotY + tilt.y;
      const rx = rotX + tilt.x;
      let X = x * Math.cos(ry) - z * Math.sin(ry);
      let Z = x * Math.sin(ry) + z * Math.cos(ry);
      const Y = y * Math.cos(rx) - Z * Math.sin(rx);
      Z = y * Math.sin(rx) + Z * Math.cos(rx);
      const persp = 2.6 / (2.6 + Z);
      return [cx + X * R * persp, cy + Y * R * persp, Z];
    };

    const slerp = (a, b, s) => {
      const p = [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, a[2] + (b[2] - a[2]) * s];
      const len = Math.hypot(...p) || 1;
      const lift = 1 + Math.sin(Math.PI * s) * 0.22;
      return p.map((v) => (v / len) * lift);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * 0.38;
      const cx = w / 2;
      const cy = h / 2;

      // halo
      const g = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      g.addColorStop(0, 'rgba(63,224,197,0.16)');
      g.addColorStop(1, 'rgba(63,224,197,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of pts) {
        const [x, y, z] = project(p, R, cx, cy);
        const a = (1 - z) / 2;
        ctx.fillStyle = `rgba(${Math.round(90 + 60 * a)}, ${Math.round(200 + 30 * a)}, ${Math.round(210 + 30 * a)}, ${0.12 + a * 0.75})`;
        ctx.beginPath();
        ctx.arc(x, y, 0.6 + a * 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.lineWidth = 1.2;
      for (const [a, b, phase] of arcs) {
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= 1.0001; s += 0.04) {
          const [x, y, z] = project(slerp(a, b, s), R, cx, cy);
          if (z > 0.35) {
            started = false;
            continue;
          }
          if (!started) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          started = true;
        }
        ctx.strokeStyle = 'rgba(90,167,255,0.35)';
        ctx.stroke();
        // travelling pulse
        const s = (t * 0.25 + phase) % 1;
        const [px, py, pz] = project(slerp(a, b, s), R, cx, cy);
        if (pz < 0.35) {
          ctx.fillStyle = 'rgba(63,224,197,0.95)';
          ctx.beginPath();
          ctx.arc(px, py, 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // orbit ring
      ctx.strokeStyle = 'rgba(63,224,197,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, R * 1.32, R * 0.36, -0.35 + tilt.y * 0.3, 0, Math.PI * 2);
      ctx.stroke();
    };

    const loop = () => {
      if (visible) {
        t += 0.016;
        rotY += 0.0028;
        tilt.x += (targetTilt.x - tilt.x) * 0.05;
        tilt.y += (targetTilt.y - tilt.y) * 0.05;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      targetTilt = { x: ((e.clientY - r.top) / r.height - 0.5) * 0.5, y: ((e.clientX - r.left) / r.width - 0.5) * 0.8 };
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });

    if (reduce) draw();
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [density]);

  return <canvas ref={ref} className={`tech-globe ${className}`} aria-hidden="true" />;
}
