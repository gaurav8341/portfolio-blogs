import React, { useState } from 'react';
import Reveal from './Reveal';
import useProfile from './useProfile';
import { staggerStyle } from './motion';
import { SkeletonList } from './Skeleton';
import '../css/ResumePage.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'work', label: 'Work' },
  { key: 'education', label: 'Education' },
];

const ResumePage = () => {
  const { profile, loading } = useProfile();
  const [filter, setFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const resume = (profile && profile.resume) || [];

  // Entries are remote data, so every optional field is guarded.
  const allSkills = [...new Set(resume.flatMap((entry) => entry.skills || []))];
  const availableTypes = new Set(resume.map((entry) => entry.type));

  let entries = filter === 'all' ? resume : resume.filter((entry) => entry.type === filter);
  if (skillFilter) entries = entries.filter((entry) => (entry.skills || []).includes(skillFilter));

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

        {loading ? (
          <SkeletonList count={3} lines={2} />
        ) : (
          <>
            {/* Only offer a type filter that actually matches something. */}
            <Reveal className="resume-filters" variant="fade" stagger>
              {FILTERS.filter((f) => f.key === 'all' || availableTypes.has(f.key)).map((f, index) => (
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
                const details = entry.details || [];

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
                        {entry.period && <span className="resume-entry-period">{entry.period}</span>}
                      </div>
                      {entry.org && <div className="resume-entry-org">{entry.org}</div>}
                      {entry.summary && <p className="resume-entry-summary">{entry.summary}</p>}
                    </div>
                    {(entry.skills || []).length > 0 && (
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
                    )}
                    {/* Stays mounted and collapses to zero height so the
                        open/close can actually animate. */}
                    {details.length > 0 && (
                      <>
                        <div
                          id={`resume-details-${entry.id}`}
                          className={`resume-details-wrap${expanded ? ' open' : ''}`}
                        >
                          <div className="resume-details-inner">
                            <ul className="resume-entry-details">
                              {details.map((detail, detailIndex) => (
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
                      </>
                    )}
                  </div>
                );
              })}
            </Reveal>

            {entries.length === 0 && (
              <p className="resume-empty anim anim-fade-in">
                {resume.length === 0
                  ? 'Résumé is being updated — check back shortly.'
                  : 'Nothing matches that combination.'}
              </p>
            )}
          </>
        )}
      </div>
  );
};

export default ResumePage;
