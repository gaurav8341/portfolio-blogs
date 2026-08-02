import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Project.css';
import CommonLayout from './CommonLayout';
import { fetchUrls } from './utils';
import ProjectModal from './ProjectModal';
import ProjectCard from './ProjectCard';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      const urls = await fetchUrls();
      const response = await axios.get(urls.featuredProjectsPath);
      setProjects(response.data);
    };

    loadProjects();
  }, []);

  const openProject = (project) => {
    setSelectedProject(project);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  return (
    <CommonLayout>
      <div className="project-container">
        <h1 className="project-heading">Projects</h1>
        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} onClick={() => openProject(project)} />
          ))}
        </div>

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={closeProject} />
        )}
      </div>
    </CommonLayout>
  );
};

export default Project;
