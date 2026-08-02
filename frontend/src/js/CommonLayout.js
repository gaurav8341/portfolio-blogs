import React, { useEffect, useState } from 'react';

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/react"

import Header from './Header';
import Footer from './Footer';
import CommandPalette from './CommandPalette';
import '../css/base.css';

const CommonLayout = ({ children }) => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className='base-container'>
        <Analytics/>
        <SpeedInsights/>
        <Header onOpenPalette={() => setPaletteOpen(true)} />
        <div className='base-layout'>
            <main>{children}</main>
        </div>
        <Footer />
        <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
};

export default CommonLayout;
