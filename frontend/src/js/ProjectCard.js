import React from 'react';
import '../css/ProjectCard.css';

const ProjectCard = ({ project, onClick, style }) => (
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
    <p className="project-card-description">{project.description}</p>
    <span className="project-card-cue" aria-hidden="true">View details →</span>
  </div>
);

export default ProjectCard;
