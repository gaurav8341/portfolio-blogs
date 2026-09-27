import React, { useState } from 'react';
import Reveal from './Reveal';
import { staggerStyle } from './motion';
import '../css/ResumePage.css';

const RESUME_DATA = [
  { id: 'r1', type: 'work', role: 'Software Developer', org: 'Freelance', period: '2024 — Present', summary: 'Building web apps and tools for small clients, end to end.', details: ['Shipped 6+ client projects solo, from scoping to deploy.', 'Introduced CI/CD pipelines that cut release time from a day to under an hour.', "Wrote the client-facing docs myself — turns out that's half the job."], skills: ['React', 'Node.js', 'SQL'] },
  { id: 'r2', type: 'work', role: 'Backend Engineer', org: 'A previous company', period: '2022 — 2024', summary: 'Owned the API layer for a mid-size internal tool.', details: ['Redesigned a legacy REST API, cutting average response time by 40%.', 'Mentored two junior engineers on testing practices.', 'On-call rotation for 18 months without a major incident.'], skills: ['Node.js', 'SQL', 'Git'] },
  { id: 'r3', type: 'education', role: 'B.Tech, Computer Science', org: 'University', period: '2018 — 2022', summary: 'Focused on systems and web development electives.', details: ['Capstone project: a distributed task scheduler, presented at the department showcase.', 'Ran the campus coding club for two years.'], skills: ['Python', 'JavaScript'] },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Work' },
  { key: 'education', label: 'Education' },
];

const ResumePage = () => {
  const [filter, setFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const allSkills = [...new Set(RESUME_DATA.flatMap((entry) => entry.skills))];

  let entries = filter === 'all' ? RESUME_DATA : RESUME_DATA.filter((entry) => entry.type === filter);
  if (skillFilter) entries = entries.filter((entry) => entry.skills.includes(skillFilter));

  const toggleSkillFilter = (skill) => {
    setSkillFilter((current) => (current === skill ? null : skill));
  };

  const setResumeFilter = (key) => {
    setFilter(key);
    setSkillFilter(null);
  };

  const toggleEntry = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  return (
      <div className="resume-page">
        <h1 className="resume-heading anim anim-fade-up">Résumé</h1>
        <p className="resume-subtitle anim anim-fade-up" style={{ '--delay': '100ms' }}>
          Filter by type, filter by skill, click an entry for details.
        </p>

        <Reveal className="resume-filters" variant="fade" stagger>
          {FILTERS.map((f, index) => (
            <button
              key={f.key}
              className={`resume-filter-btn press${filter === f.key ? ' active' : ''}`}
              style={staggerStyle(index)}
              onClick={() => setResumeFilter(f.key)}
              aria-pressed={filter === f.key}
            >
              {f.label}
            </button>
          ))}
        </Reveal>

        <Reveal className="resume-skill-filters" variant="fade" stagger>
          {allSkills.map((skill, index) => (
            <button
              key={skill}
              className={`resume-skill-chip press${skillFilter === skill ? ' active' : ''}`}
              style={staggerStyle(index)}
              onClick={() => toggleSkillFilter(skill)}
              aria-pressed={skillFilter === skill}
            >
              {skill}
            </button>
          ))}
        </Reveal>

        {/* Keyed on the active filters so changing them replays the timeline
            stagger instead of swapping entries in place. */}
        <Reveal
          key={`${filter}-${skillFilter || 'any'}`}
          className="resume-timeline"
          variant="fade"
          stagger
        >
          {entries.map((entry, index) => {
            const expanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="resume-entry" style={staggerStyle(index)}>
                <div className="resume-entry-dot" />
                <div
                  className="resume-entry-header"
                  role="button"
                  tabIndex={0}
                  aria-expanded={expanded}
                  aria-controls={`resume-details-${entry.id}`}
                  onClick={() => toggleEntry(entry.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleEntry(entry.id);
                    }
                  }}
                >
                  <div className="resume-entry-top">
                    <span className="resume-entry-role">{entry.role}</span>
                    <span className="resume-entry-period">{entry.period}</span>
                  </div>
                  <div className="resume-entry-org">{entry.org}</div>
                  <p className="resume-entry-summary">{entry.summary}</p>
                </div>
                <div className="resume-entry-skills">
                  {entry.skills.map((skill) => (
                    <span
                      key={skill}
                      className="resume-skill-chip small"
                      onClick={() => toggleSkillFilter(skill)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {/* Stays mounted and collapses to zero height so the open/close
                    can actually animate. */}
                <div
                  id={`resume-details-${entry.id}`}
                  className={`resume-details-wrap${expanded ? ' open' : ''}`}
                >
                  <div className="resume-details-inner">
                    <ul className="resume-entry-details">
                      {entry.details.map((detail, detailIndex) => (
                        <li key={detailIndex} style={staggerStyle(detailIndex)}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button
                  className="resume-toggle-link"
                  onClick={() => toggleEntry(entry.id)}
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <span className="resume-toggle-caret">▸</span>
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              </div>
            );
          })}
        </Reveal>

        {entries.length === 0 && (
          <p className="resume-empty anim anim-fade-in">Nothing matches that combination.</p>
        )}
      </div>
  );
};

export default ResumePage;
