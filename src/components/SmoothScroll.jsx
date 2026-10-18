import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);

const HEADER_OFFSET = -96;

export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const instance = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      autoRaf: true,
      anchors: { offset: HEADER_OFFSET },
    });
    setLenis(instance);
    return () => instance.destroy();
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

function scrollToHash(lenis, hash, immediate) {
  const el = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (!el) return;
  if (lenis) {
    // Lenis caches the scroll limit; re-measure so a freshly rendered page isn't clamped
    lenis.resize();
    lenis.scrollTo(el, { offset: HEADER_OFFSET, immediate, force: true });
  } else {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + HEADER_OFFSET });
  }
}

/** Called once when a route's page mounts (behind the transition curtain). */
export function useRouteScroll() {
  const { hash } = useLocation();
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
    if (!hash) return undefined;
    const first = setTimeout(() => scrollToHash(lenis, hash, true), 60);
    // settle again once late images/fonts have changed the layout
    const settle = setTimeout(() => scrollToHash(lenis, hash, false), 700);
    return () => {
      clearTimeout(first);
      clearTimeout(settle);
    };
    // only on mount: each route frame is keyed by pathname
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** Smooth-scrolls to #hash targets when the hash changes on the same page. */
export function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const lenis = useLenis();
  const lastPath = useRef(pathname);

  useEffect(() => {
    const samePage = lastPath.current === pathname;
    lastPath.current = pathname;
    if (samePage && hash) scrollToHash(lenis, hash, false);
  }, [pathname, hash, key, lenis]);

  return null;
}
