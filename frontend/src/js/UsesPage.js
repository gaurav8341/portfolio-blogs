import React from 'react';
import CommonLayout from './CommonLayout';
import '../css/UsesPage.css';

const USES_DATA = [
  { category: 'Editor', items: ['VS Code', 'Vim keybindings', 'GitHub Copilot'] },
  { category: 'Terminal', items: ['iTerm2', 'zsh + oh-my-zsh', 'tmux'] },
  { category: 'Machine', items: ['MacBook Pro 14", M-series', '32GB RAM', 'Two 27" monitors'] },
  { category: 'Deploy', items: ['Vercel', 'GitHub Actions', 'Cloudflare'] },
];

const UsesPage = () => (
  <CommonLayout>
    <div className="uses-page">
      <h1 className="uses-heading">Uses</h1>
      <p className="uses-subtitle">The hardware and software I actually reach for, day to day.</p>
      {USES_DATA.map((group) => (
        <div key={group.category} className="uses-group">
          <h6 className="section-kicker">{group.category}</h6>
          <ul className="uses-list">
            {group.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </CommonLayout>
);

export default UsesPage;
