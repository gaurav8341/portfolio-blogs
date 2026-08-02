import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonLayout from './CommonLayout';
import axios from 'axios';
import '../css/Home.css';
import { fetchUrls, describeGithubEvent, timeAgo } from './utils';
import ProjectModal from './ProjectModal';
import SkillChips from './SkillChips';
import useScrollReveal from './useScrollReveal';

const FALLBACK_ACTIVITY = [
  { id: 'f1', text: 'pushed to', repo: 'gaurav8341/portfolio-blogs', time: '2d ago' },
  { id: 'f2', text: 'opened an issue on', repo: 'gaurav8341/LearnWithMe', time: '5d ago' },
  { id: 'f3', text: 'starred', repo: 'facebook/react', time: '1w ago' },
];

const USES_DATA = [
  { category: 'Editor', items: ['VS Code', 'Vim keybindings', 'GitHub Copilot'] },
  { category: 'Terminal', items: ['iTerm2', 'zsh + oh-my-zsh', 'tmux'] },
  { category: 'Machine', items: ['MacBook Pro 14", M-series', '32GB RAM', 'Two 27" monitors'] },
  { category: 'Deploy', items: ['Vercel', 'GitHub Actions', 'Cloudflare'] },
];

const SectionKicker = ({ children }) => (
  <h6 className="section-kicker">
    <span className="section-kicker-dash" />
    {children}
  </h6>
);

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activity, setActivity] = useState([]);
  const navigate = useNavigate();

  const [thinkRef, thinkRevealed] = useScrollReveal();
  const [activityRef, activityRevealed] = useScrollReveal();
  const [shippedRef, shippedRevealed] = useScrollReveal();
  const [intoRef, intoRevealed] = useScrollReveal();
  const [skillsRef, skillsRevealed] = useScrollReveal();
  const [usesRef, usesRevealed] = useScrollReveal();
  const [contactRef, contactRevealed] = useScrollReveal();

  useEffect(() => {
    const fetchProjectsAndBlogs = async () => {
      try {
        const urls = await fetchUrls();
        const [projectsResponse, blogsResponse, skillsResponse] = await Promise.all([
          axios.get(urls.featuredProjectsPath),
          axios.get(urls.featuredBlogsPath),
          axios.get(urls.skillsJsonPath)
        ]);
        setProjects(projectsResponse.data);
        setBlogs(blogsResponse.data);
        setSkills(skillsResponse.data);
      } catch (error) {
        console.error("Error loading projects, blogs, or skills:", error);
      }
    };

    fetchProjectsAndBlogs();
  }, []);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get('https://api.github.com/users/gaurav8341/events/public');
        const items = res.data.slice(0, 4).map((ev) => ({
          id: ev.id,
          text: describeGithubEvent(ev.type),
          repo: (ev.repo && ev.repo.name) || '',
          time: timeAgo(ev.created_at),
        }));
        setActivity(items.length ? items : FALLBACK_ACTIVITY);
      } catch (error) {
        setActivity(FALLBACK_ACTIVITY);
      }
    };

    fetchActivity();
  }, []);

  const openProject = (project) => {
    setSelectedProject(project);
  };

  const closeProject = () => {
    setSelectedProject(null);
  };

  const featuredProjects = projects.slice(0, 3);
  const featuredBlogs = blogs.slice(0, 2);

  return (
    <CommonLayout>
      <div className="home">
        <section className="hero">
          <div className="hero-eyebrow">Open to freelance work</div>
          <h1 className="hero-title">Hey, I'm Gaurav — a software developer who's happiest when a messy problem turns into a clean little tool.</h1>
          <p className="hero-bio">Most days I'm building web apps, poking at side projects, or writing up whatever I just learned the hard way. This whole site is one of those projects.</p>
        </section>

        <section ref={thinkRef} className={`reveal ${thinkRevealed ? 'revealed' : ''} section-block`}>
          <SectionKicker>How I think</SectionKicker>
          <p className="prose-line">I started out tinkering with scripts that automated my own annoyances, and that habit never really went away. If something is repetitive or fiddly, my instinct is to build a small tool for it.</p>
          <p className="prose-line prose-line-last">I pick absurdly small project scopes on purpose — a one-sentence definition of "done," written before any code. It's the only thing that's reliably gotten side projects across the finish line.</p>
        </section>

        <section ref={activityRef} className={`reveal ${activityRevealed ? 'revealed' : ''} section-block`}>
          <SectionKicker>Lately</SectionKicker>
          <div className="activity-list">
            {(activity.length ? activity : FALLBACK_ACTIVITY).map((ev) => (
              <div key={ev.id} className="activity-row">
                <span className="activity-text">{ev.text} <strong className="activity-repo">{ev.repo}</strong></span>
                <span className="activity-time">{ev.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section ref={shippedRef} className={`reveal ${shippedRevealed ? 'revealed' : ''} section-block`}>
          <SectionKicker>What I've shipped</SectionKicker>
          <div className="stacked-list">
            {featuredProjects.map((project, index) => (
              <div key={index} className="shipped-item" onClick={() => openProject(project)}>
                <div className="shipped-item-top">
                  <span className="shipped-item-title">{project.title}</span>
                  {project.category && <span className="shipped-item-category">{project.category}</span>}
                </div>
                <p className="shipped-item-description">{project.description}</p>
              </div>
            ))}
          </div>
          <Link to="/projects" className="inline-link">View all projects →</Link>
        </section>

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={closeProject} />
        )}

        <section ref={intoRef} className={`reveal ${intoRevealed ? 'revealed' : ''} section-block`}>
          <SectionKicker>What I'm into</SectionKicker>
          <div className="stacked-list into-list">
            {featuredBlogs.map((blog, index) => (
              <div key={index} className="into-item">
                <div className="into-item-title">{blog.title}</div>
                <p className="into-item-excerpt">{blog.excerpt || blog.preview}</p>
                <button className="read-more" onClick={() => navigate(`/blogs/${blog.id}`)}>Read more →</button>
              </div>
            ))}
          </div>
          <Link to="/blogs" className="inline-link">View all posts →</Link>
        </section>

        <section ref={skillsRef} className={`reveal ${skillsRevealed ? 'revealed' : ''} section-block`}>
          <SectionKicker>Skills &amp; tools</SectionKicker>
          <SkillChips skills={skills} />
        </section>

        <section ref={usesRef} className={`reveal ${usesRevealed ? 'revealed' : ''} section-block`}>
          <SectionKicker>Tools I use</SectionKicker>
          <div className="uses-grid">
            {USES_DATA.map((group) => (
              <div key={group.category}>
                <div className="uses-group-label">{group.category}</div>
                <ul className="uses-group-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section ref={contactRef} className={`reveal ${contactRevealed ? 'revealed' : ''} section-block contact-block`}>
          <SectionKicker>Get in touch</SectionKicker>
          <p className="contact-line">Building something interesting, or just want to talk shop? My inbox is open.</p>
          <div className="social-media">
            <a href="https://github.com/gaurav8341" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.763-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.117 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.62-5.475 5.92.43.37.823 1.1.823 2.22v3.293c0 .32.22.694.825.577C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://linkedin.com/in/gaurav8341" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.58c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.15 1.45-2.15 2.95v5.71h-3.56V9h3.42v1.56h.05c.48-.91 1.65-1.86 3.4-1.86 3.63 0 4.3 2.39 4.3 5.5v6.25z"/></svg>
            </a>
            <a href="mailto:rajput.gaurav8341@gmail.com" className="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path d="M12 12.713l11.985-8.713H.015L12 12.713zM12 14.287L.015 5.574V18.426L12 14.287zM12 14.287L23.985 18.426V5.574L12 14.287z"/></svg>
            </a>
          </div>
        </section>
      </div>
    </CommonLayout>
  );
};

export default Home;
