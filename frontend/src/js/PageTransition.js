import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { prefersReducedMotion } from './motion';

/**
 * Fades each route in on arrival.
 *
 * The location key is used as the React key so the wrapper remounts on
 * navigation, which replays the CSS animation — no animation library needed.
 * Also resets scroll to the top on route change, which react-router does not
 * do on its own.
 */
const PageTransition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [location.pathname]);

  return (
    <div key={location.key} className="page-transition">
      {children}
    </div>
  );
};

export default PageTransition;
