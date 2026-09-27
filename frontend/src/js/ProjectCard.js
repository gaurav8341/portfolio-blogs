import React from 'react';
import { projectTagline } from './projectShape';
import '../css/ProjectCard.css';

const ProjectCard = ({ project, onClick, style }) => {
  const skills = project.skills || [];

  return (
    <div
      className="project-card"
      onClick={onClick}
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {project.category && <div className="project-card-category">{project.category}</div>}
      <div className="project-card-title">{project.title}</div>
      <p className="project-card-tagline">{projectTagline(project)}</p>

      {skills.length > 0 && (
        <div className="project-card-skills">
          {skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="project-card-skill">
              {typeof skill === 'string' ? skill : skill.name}
            </span>
          ))}
        </div>
      )}

      <span className="project-card-cue" aria-hidden="true">View details →</span>
    </div>
  );
};

export default ProjectCard;
