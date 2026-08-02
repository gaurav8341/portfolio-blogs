import React from 'react';
import '../css/ProjectCard.css';

const ProjectCard = ({ project, onClick }) => (
  <div className="project-card" onClick={onClick}>
    {project.category && <div className="project-card-category">{project.category}</div>}
    <div className="project-card-title">{project.title}</div>
    <p className="project-card-description">{project.description}</p>
  </div>
);

export default ProjectCard;
