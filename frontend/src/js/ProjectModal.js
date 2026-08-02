import React from 'react';
import '../css/ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  return (
    <div className="project-modal" onClick={onClose}>
      <div className="project-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-button" onClick={onClose}>&times;</span>
        <div className="modal-header">
          <h2 className="title">{project.title}</h2>
          {project.srcurl && (
            <a href={project.srcurl} target="_blank" rel="noopener noreferrer" className="github-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.763-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.117 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.62-5.475 5.92.43.37.823 1.1.823 2.22v3.293c0 .32.22.694.825.577C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>
          )}
        </div>
        <p className="modal-description">{project.description}</p>
        <div className="project-skills">
          {(project.skills || []).map((skill, index) => (
            <span key={index} className="chip">{typeof skill === 'string' ? skill : skill.name}</span>
          ))}
        </div>
        <div className="live-url">
            {project.produrl && (
            <a href={project.produrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">Visit live site</a>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
