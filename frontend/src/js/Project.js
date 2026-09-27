import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Project.css';
import { fetchUrls } from './utils';
import ProjectModal from './ProjectModal';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';
import { staggerStyle } from './motion';
import { SkeletonList } from './Skeleton';

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const urls = await fetchUrls();
        const response = await axios.get(urls.featuredProjectsPath);
        setProjects(response.data);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
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
      <div className="project-container">
        <h1 className="project-heading anim anim-fade-up">Projects</h1>
        <p className="project-subtitle anim anim-fade-up" style={{ '--delay': '100ms' }}>
          Things I've built, shipped, or broken in interesting ways.
        </p>

        {loading ? (
          <SkeletonList count={4} className="skeleton-grid" />
        ) : (
          <Reveal className="project-list" variant="fade" stagger>
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                project={project}
                style={staggerStyle(index)}
                onClick={() => openProject(project)}
              />
            ))}
          </Reveal>
        )}

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={closeProject} />
        )}
      </div>
  );
};

export default Project;
