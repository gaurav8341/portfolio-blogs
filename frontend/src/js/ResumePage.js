import React, { useState } from 'react';
import Reveal from './Reveal';
import useProfile from './useProfile';
import { staggerStyle } from './motion';
import { SkeletonList } from './Skeleton';
import '../css/ResumePage.css';

const ResumeEntry = ({ entry, index, expanded, onToggle, onSkillClick }) => {
  const details = entry.details || [];

  return (
    <div className="resume-entry" style={staggerStyle(index)}>
      <div className="resume-entry-dot" />
      <div
        className="resume-entry-header"
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-controls={`resume-details-${entry.id}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
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
              onClick={() => onSkillClick(skill)}
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Stays mounted and collapses to zero height so open/close can animate. */}
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
            onClick={onToggle}
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
};

const ResumePage = () => {
  const { profile, loading } = useProfile();
  const [skillFilter, setSkillFilter] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  /* profile.json keeps work and education as separate lists. The `resume`
     fallback reads the older single-array shape, so an old feed and new code
     (or the reverse) never leaves the page blank mid-deploy. */
  const legacy = (profile && profile.resume) || [];
  const work = (profile && profile.work) || legacy.filter((e) => e.type === 'work');
  const education = (profile && profile.education) || legacy.filter((e) => e.type === 'education');

  const allSkills = [
    ...new Set([...work, ...education].flatMap((entry) => entry.skills || [])),
  ];

  const applyFilter = (entries) =>
    skillFilter ? entries.filter((e) => (e.skills || []).includes(skillFilter)) : entries;

  const shownWork = applyFilter(work);
  const shownEducation = applyFilter(education);

  const toggleSkillFilter = (skill) => {
    setSkillFilter((current) => (current === skill ? null : skill));
  };

  const toggleEntry = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const renderSection = (title, entries) => (
    <section className="resume-section">
      <h2 className="resume-section-title">
        <span className="resume-section-dash" />
        {title}
      </h2>
      {/* Keyed on the filter so changing it replays the stagger. */}
      <Reveal
        key={`${title}-${skillFilter || 'any'}`}
        className="resume-timeline"
        variant="fade"
        stagger
      >
        {entries.map((entry, index) => (
          <ResumeEntry
            key={entry.id}
            entry={entry}
            index={index}
            expanded={expandedId === entry.id}
            onToggle={() => toggleEntry(entry.id)}
            onSkillClick={toggleSkillFilter}
          />
        ))}
      </Reveal>
    </section>
  );

  return (
      <div className="resume-page">
        <h1 className="resume-heading anim anim-fade-up">Résumé</h1>
        <p className="resume-subtitle anim anim-fade-up" style={{ '--delay': '100ms' }}>
          Filter by skill, click an entry for details.
        </p>

        {loading ? (
          <SkeletonList count={3} lines={2} />
        ) : (
          <>
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

            {shownWork.length > 0 && renderSection('Work', shownWork)}
            {shownEducation.length > 0 && renderSection('Education', shownEducation)}

            {shownWork.length === 0 && shownEducation.length === 0 && (
              <p className="resume-empty anim anim-fade-in">
                {work.length + education.length === 0
                  ? 'Résumé is being updated — check back shortly.'
                  : `Nothing tagged "${skillFilter}".`}
              </p>
            )}
          </>
        )}
      </div>
  );
};

export default ResumePage;
