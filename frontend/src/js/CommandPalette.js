import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchUrls } from './utils';
import { DURATION, prefersReducedMotion } from './motion';
import '../css/CommandPalette.css';

const PAGES = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Blog', path: '/blogs' },
  { label: 'Résumé', path: '/resume' },
];

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  /* Kept mounted for the length of the exit animation after isOpen flips
     to false, otherwise the palette would disappear with no transition. */
  const [mounted, setMounted] = useState(isOpen);
  const [closing, setClosing] = useState(false);

  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setClosing(false);
      return;
    }

    if (!mounted) return;

    if (prefersReducedMotion()) {
      setMounted(false);
      return;
    }

    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, DURATION.base);

    return () => window.clearTimeout(timer);
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isOpen || loaded) return;

    const loadItems = async () => {
      try {
        const urls = await fetchUrls();
        const [projectsRes, blogsRes] = await Promise.all([
          axios.get(urls.featuredProjectsPath),
          axios.get(urls.blogsJsonPath),
        ]);
        setProjects(projectsRes.data);
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error('Error loading command palette items:', error);
      } finally {
        setLoaded(true);
      }
    };

    loadItems();
  }, [isOpen, loaded]);

  // Reset the highlight whenever the palette reopens or the query changes.
  useEffect(() => {
    setActiveIndex(0);
  }, [query, isOpen]);

  if (!mounted) return null;

  const items = [
    ...PAGES.map((p) => ({ id: `page-${p.path}`, label: p.label, hint: 'Page', go: () => navigate(p.path) })),
    ...projects.map((p) => ({ id: `proj-${p.title}`, label: p.title, hint: 'Project', go: () => navigate('/projects') })),
    ...blogs.map((b) => ({ id: `post-${b.id}`, label: b.title, hint: 'Post', go: () => navigate(`/blogs/${b.id}`) })),
  ];

  const q = query.trim().toLowerCase();
  const filteredItems = q ? items.filter((i) => i.label.toLowerCase().includes(q)) : items;

  const go = (item) => {
    item.go();
    onClose();
    setQuery('');
  };

  const moveActive = (delta) => {
    if (filteredItems.length === 0) return;
    setActiveIndex((current) => {
      const next = (current + delta + filteredItems.length) % filteredItems.length;
      const node = listRef.current && listRef.current.children[next];
      if (node && node.scrollIntoView) node.scrollIntoView({ block: 'nearest' });
      return next;
    });
  };

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActive(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActive(-1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filteredItems[activeIndex];
      if (item) go(item);
    }
  };

  return (
    <div
      className={`palette-backdrop${closing ? ' closing' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="palette-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onInputKeyDown}
          placeholder="Jump to a page, project or post…"
          aria-label="Search pages, projects and posts"
        />
        <div className="palette-items" ref={listRef}>
          {filteredItems.map((item, index) => (
            /* No per-item stagger here on purpose: results re-render on every
               keystroke, and re-animating rows as you type reads as flicker. */
            <div
              key={item.id}
              className={`palette-item${index === activeIndex ? ' active' : ''}`}
              onClick={() => go(item)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <span>{item.label}</span>
              <span className="palette-item-hint">{item.hint}</span>
            </div>
          ))}
          {filteredItems.length === 0 && <div className="palette-empty">No results</div>}
        </div>
        <div className="palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
