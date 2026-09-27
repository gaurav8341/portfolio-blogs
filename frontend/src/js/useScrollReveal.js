import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from './motion';

/**
 * Reveals an element the first time it scrolls into view.
 *
 * Returns [ref, revealed]. Attach the ref, and add `.revealed` to the class
 * list when `revealed` is true — or just use <Reveal>, which wraps both.
 *
 * Bails out to revealed=true immediately when the visitor prefers reduced
 * motion, or when IntersectionObserver is missing, so content is never
 * stuck invisible.
 */
const useScrollReveal = ({
  threshold = 0.15,
  rootMargin = '0px 0px -8% 0px',
  once = true,
} = {}) => {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // Already on screen at mount (above the fold) — reveal without waiting.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, revealed];
};

export default useScrollReveal;
