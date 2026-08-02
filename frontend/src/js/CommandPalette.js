import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchUrls } from './utils';
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
  const navigate = useNavigate();

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

  if (!isOpen) return null;

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

  return (
    <div className="palette-backdrop" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          className="palette-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to a page, project or post…"
        />
        <div className="palette-items">
          {filteredItems.map((item) => (
            <div key={item.id} className="palette-item" onClick={() => go(item)}>
              <span>{item.label}</span>
              <span className="palette-item-hint">{item.hint}</span>
            </div>
          ))}
          {filteredItems.length === 0 && <div className="palette-empty">No results</div>}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
