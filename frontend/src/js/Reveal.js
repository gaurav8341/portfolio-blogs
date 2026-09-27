import React from 'react';
import useScrollReveal from './useScrollReveal';

/**
 * Scroll-reveal wrapper. Replaces the pattern of calling useScrollReveal once
 * per section and hand-assembling class names.
 *
 *   <Reveal as="section" className="section-block">…</Reveal>
 *   <Reveal variant="scale" stagger>…</Reveal>   // children animate in sequence
 *
 * variant: up | down | left | right | scale | fade
 * stagger: animate direct children one after another instead of the wrapper
 * delay:   hold the reveal back, e.g. "120ms"
 */
const Reveal = ({
  as: Tag = 'div',
  variant = 'up',
  stagger = false,
  delay,
  className = '',
  style,
  children,
  ...rest
}) => {
  const [ref, revealed] = useScrollReveal();

  const classes = [
    'reveal',
    `reveal-${variant}`,
    stagger && 'stagger',
    revealed && 'revealed',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      ref={ref}
      className={classes}
      style={delay ? { '--reveal-delay': delay, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
