import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../css/Header.css';

const Header = ({ onOpenPalette }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.site-nav') && !event.target.closest('.menu-toggle')) {
        closeMenu();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const navLinkClass = ({ isActive }) => `page-link${isActive ? ' active' : ''}`;

  return (
    <header className="site-header" role="banner">
      <div className="headwrapper">
        <div className="title-container">
          <Link className="site-title" to="/">Gaurav Rajput</Link>
        </div>
        <div className='nav-container'>
          <button className="palette-btn" onClick={onOpenPalette}>
            Search <span className="palette-btn-kbd">⌘K</span>
          </button>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span className="hamburger"></span>
          </button>
          <nav className={`site-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul className="navbar-menu">
              <li className="navbar-item"><NavLink end to="/" className={navLinkClass} onClick={closeMenu}>Home</NavLink></li>
              <li className="navbar-item"><NavLink to="/profile" className={navLinkClass} onClick={closeMenu}>Profile</NavLink></li>
              <li className="navbar-item"><NavLink to="/projects" className={navLinkClass} onClick={closeMenu}>Projects</NavLink></li>
              <li className="navbar-item"><NavLink to="/blogs" className={navLinkClass} onClick={closeMenu}>Blog</NavLink></li>
              <li className="navbar-item"><NavLink to="/resume" className={navLinkClass} onClick={closeMenu}>Résumé</NavLink></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
