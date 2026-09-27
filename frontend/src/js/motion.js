/**
 * Shared motion helpers.
 *
 * Durations here mirror the tokens in css/animations.css — when an exit
 * animation has to finish before React unmounts the element, JS needs to know
 * how long the CSS takes. Keep the two in sync.
 */

export const DURATION = {
  instant: 120,
  fast: 180,
  base: 280,
  slow: 480,
  reveal: 640,
};

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Stagger index as an inline style, for lists whose length isn't known up
 * front: <li style={staggerStyle(i)}>. Caps the delay so a long list doesn't
 * leave the last items waiting seconds to appear.
 */
export const staggerStyle = (index, { max = 12 } = {}) => ({
  '--i': Math.min(index, max),
});
