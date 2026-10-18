import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CYAN = new THREE.Color('#3fe0c5');
const BLUE = new THREE.Color('#5aa7ff');

/** Soft round sprite so points render as glowing dots instead of squares. */
function dotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Full-page WebGL scene for the Integrated Systems division: a wireframe globe with
 * orbit rings, a drifting node network, star dust and a moving perspective grid.
 * Responds to the pointer and to page scroll.
 */
export default function ITBackground() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 760;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch {
      return undefined; // WebGL unavailable — the CSS gradient background remains
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050b12, 0.04);
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    camera.position.set(0, 0, 15);

    const sprite = dotTexture();
    const disposables = [sprite];
    const track = (o) => (disposables.push(o), o);

    // ---- Globe ----
    const globe = new THREE.Group();
    scene.add(globe);
    const R = 3.4;
    globe.add(
      new THREE.LineSegments(
        track(new THREE.WireframeGeometry(track(new THREE.IcosahedronGeometry(R, 3)))),
        track(new THREE.LineBasicMaterial({ color: CYAN, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false })),
      ),
    );

    const N = mobile ? 900 : 1700;
    const gp = new Float32Array(N * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      gp.set([Math.cos(golden * i) * r * R * 1.01, y * R * 1.01, Math.sin(golden * i) * r * R * 1.01], i * 3);
    }
    const globePtsGeo = track(new THREE.BufferGeometry());
    globePtsGeo.setAttribute('position', new THREE.BufferAttribute(gp, 3));
    globe.add(
      new THREE.Points(
        globePtsGeo,
        track(new THREE.PointsMaterial({ size: 0.09, map: sprite, color: CYAN, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })),
      ),
    );

    // Inner glow
    const glow = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: sprite, color: CYAN, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false })));
    glow.scale.set(R * 4.2, R * 4.2, 1);
    globe.add(glow);

    // Orbit rings with satellites
    const rings = [];
    [
      [R * 1.45, 1.15, 0.2, 0.0045],
      [R * 1.75, -0.6, 0.9, -0.003],
      [R * 2.05, 0.35, -0.5, 0.0022],
    ].forEach(([radius, tiltX, tiltZ, speed], i) => {
      const pivot = new THREE.Group();
      pivot.rotation.set(tiltX, 0, tiltZ);
      const ring = new THREE.Mesh(
        track(new THREE.TorusGeometry(radius, 0.008, 6, 180)),
        track(new THREE.MeshBasicMaterial({ color: i % 2 ? BLUE : CYAN, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false })),
      );
      const sat = new THREE.Sprite(track(new THREE.SpriteMaterial({ map: sprite, color: i % 2 ? BLUE : CYAN, blending: THREE.AdditiveBlending, depthWrite: false })));
      sat.scale.set(0.45, 0.45, 1);
      pivot.add(ring, sat);
      globe.add(pivot);
      rings.push({ pivot, sat, radius, speed, angle: i * 2 });
    });

    // ---- Node network (plexus) ----
    const M = mobile ? 70 : 140;
    const nodes = Array.from({ length: M }, () => ({
      base: new THREE.Vector3((Math.random() - 0.5) * 36, (Math.random() - 0.5) * 22, -Math.random() * 18 - 2),
      phase: Math.random() * Math.PI * 2,
      amp: 0.4 + Math.random() * 0.8,
    }));
    const nodePos = new Float32Array(M * 3);
    const nodeGeo = track(new THREE.BufferGeometry());
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
    scene.add(
      new THREE.Points(
        nodeGeo,
        track(new THREE.PointsMaterial({ size: 0.22, map: sprite, color: BLUE, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })),
      ),
    );
    const MAX_SEG = M * 6;
    const segPos = new Float32Array(MAX_SEG * 6);
    const segCol = new Float32Array(MAX_SEG * 6);
    const segGeo = track(new THREE.BufferGeometry());
    segGeo.setAttribute('position', new THREE.BufferAttribute(segPos, 3));
    segGeo.setAttribute('color', new THREE.BufferAttribute(segCol, 3));
    scene.add(
      new THREE.LineSegments(
        segGeo,
        track(new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })),
      ),
    );

    // ---- Star dust ----
    const S = mobile ? 1200 : 2600;
    const dust = new Float32Array(S * 3);
    for (let i = 0; i < S; i++) dust.set([(Math.random() - 0.5) * 90, (Math.random() - 0.5) * 60, -Math.random() * 70 + 10], i * 3);
    const dustGeo = track(new THREE.BufferGeometry());
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dust, 3));
    const dustPts = new THREE.Points(
      dustGeo,
      track(new THREE.PointsMaterial({ size: 0.12, map: sprite, color: 0x9fdcff, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false })),
    );
    scene.add(dustPts);

    // ---- Grid floor ----
    const grid = new THREE.GridHelper(160, 80, CYAN, CYAN);
    grid.material.transparent = true;
    grid.material.opacity = 0.09;
    grid.material.depthWrite = false;
    grid.position.y = -7.5;
    disposables.push(grid.geometry, grid.material);
    scene.add(grid);

    // ---- Interaction ----
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const layout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const narrow = w < 900;
      globe.position.set(narrow ? 0 : 5.2, narrow ? 1.8 : 0.3, narrow ? -4 : 0);
    };
    layout();
    window.addEventListener('resize', layout);

    const v = new THREE.Vector3();
    const updateNetwork = (t) => {
      nodes.forEach((n, i) => {
        v.copy(n.base);
        v.x += Math.sin(t * 0.3 + n.phase) * n.amp;
        v.y += Math.cos(t * 0.25 + n.phase) * n.amp;
        nodePos.set([v.x, v.y, v.z], i * 3);
      });
      nodeGeo.attributes.position.needsUpdate = true;
      let s = 0;
      const maxD = 5.2;
      for (let i = 0; i < M && s < MAX_SEG; i++) {
        for (let j = i + 1; j < M && s < MAX_SEG; j++) {
          const dx = nodePos[i * 3] - nodePos[j * 3];
          const dy = nodePos[i * 3 + 1] - nodePos[j * 3 + 1];
          const dz = nodePos[i * 3 + 2] - nodePos[j * 3 + 2];
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d > maxD) continue;
          const a = (1 - d / maxD) * 0.55;
          segPos.set([nodePos[i * 3], nodePos[i * 3 + 1], nodePos[i * 3 + 2], nodePos[j * 3], nodePos[j * 3 + 1], nodePos[j * 3 + 2]], s * 6);
          segCol.set([BLUE.r * a, BLUE.g * a, BLUE.b * a, CYAN.r * a, CYAN.g * a, CYAN.b * a], s * 6);
          s++;
        }
      }
      segGeo.setDrawRange(0, s * 2);
      segGeo.attributes.position.needsUpdate = true;
      segGeo.attributes.color.needsUpdate = true;
    };

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      const t = clock.getElapsedTime();
      const scrollMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const sp = window.scrollY / scrollMax;

      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      globe.rotation.y = t * 0.12 + sp * 2.5;
      globe.rotation.x = 0.25 + pointer.y * 0.15;
      rings.forEach((r) => {
        r.angle += r.speed * 2;
        r.pivot.rotation.y += r.speed;
        r.sat.position.set(Math.cos(r.angle) * r.radius, Math.sin(r.angle) * r.radius, 0);
      });
      glow.material.opacity = 0.18 + Math.sin(t * 1.4) * 0.05;

      dustPts.rotation.y = t * 0.01;
      grid.position.z = (t * 1.6) % 2;
      updateNetwork(t);

      camera.position.x = pointer.x * 1.6;
      camera.position.y = -pointer.y * 1 - sp * 5;
      camera.position.z = 15 - sp * 4;
      camera.lookAt(0, -sp * 4, 0);

      renderer.render(scene, camera);
      if (!reduce) raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduce) raf = requestAnimationFrame(frame);
    };
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', layout);
      document.removeEventListener('visibilitychange', onVisibility);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className="it-bg" aria-hidden="true" />;
}
