import React, { useState } from 'react';
import CommonLayout from './CommonLayout';
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
    <CommonLayout>
      <div className="resume-page">
        <h1 className="resume-heading">Résumé</h1>
        <p className="resume-subtitle">Filter by type, filter by skill, click an entry for details.</p>

        <div className="resume-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`resume-filter-btn${filter === f.key ? ' active' : ''}`}
              onClick={() => setResumeFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="resume-skill-filters">
          {allSkills.map((skill) => (
            <button
              key={skill}
              className={`resume-skill-chip${skillFilter === skill ? ' active' : ''}`}
              onClick={() => toggleSkillFilter(skill)}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="resume-timeline">
          {entries.map((entry) => {
            const expanded = expandedId === entry.id;
            return (
              <div key={entry.id} className="resume-entry">
                <div className="resume-entry-dot" />
                <div className="resume-entry-header" onClick={() => toggleEntry(entry.id)}>
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
                {expanded && (
                  <ul className="resume-entry-details">
                    {entry.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                )}
                <button className="resume-toggle-link" onClick={() => toggleEntry(entry.id)}>
                  {expanded ? 'Show less' : 'Show more'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </CommonLayout>
  );
};

export default ResumePage;
