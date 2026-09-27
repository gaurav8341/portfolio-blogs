import React from 'react';
import { staggerStyle } from './motion';
import '../css/Skeleton.css';

/**
 * Shimmering placeholder shown while remote content loads, so lists fade in
 * from a placeholder instead of popping in from nothing.
 */
export const SkeletonLine = ({ width = '100%', height = 13, radius = 6, style }) => (
  <span
    className="skeleton"
    style={{ width, height, borderRadius: radius, ...style }}
    aria-hidden="true"
  />
);

export const SkeletonCard = ({ lines = 2 }) => (
  <div className="skeleton-card" aria-hidden="true">
    <SkeletonLine width="38%" height={10} />
    <SkeletonLine width="62%" height={16} style={{ marginTop: 12 }} />
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLine
        key={index}
        width={index === lines - 1 ? '74%' : '100%'}
        style={{ marginTop: 10 }}
      />
    ))}
  </div>
);

/** A list of placeholder cards, revealed with the same stagger as real content. */
export const SkeletonList = ({ count = 3, lines = 2, className = '' }) => (
  <div className={`skeleton-list stagger revealed ${className}`} role="status" aria-label="Loading">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} style={staggerStyle(index)}>
        <SkeletonCard lines={lines} />
      </div>
    ))}
  </div>
);

export const SkeletonChips = ({ count = 8 }) => (
  <div className="skeleton-chips stagger revealed" role="status" aria-label="Loading">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonLine
        key={index}
        width={70 + ((index * 23) % 60)}
        height={42}
        radius={8}
        style={staggerStyle(index)}
      />
    ))}
  </div>
);

export default SkeletonLine;
