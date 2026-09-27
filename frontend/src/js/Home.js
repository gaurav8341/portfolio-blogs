import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Home.css';
import { fetchUrls, describeGithubEvent, timeAgo } from './utils';
import ProjectModal from './ProjectModal';
import SkillChips from './SkillChips';
import Reveal from './Reveal';
import useProfile from './useProfile';
import { staggerStyle } from './motion';
import { SkeletonList, SkeletonChips } from './Skeleton';

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
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activity, setActivity] = useState([]);
  const [activityFailed, setActivityFailed] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const uses = (profile && profile.uses) || [];

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
      } finally {
        setLoading(false);
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
        setActivity(items);
      } catch (error) {
        // The GitHub API is called unauthenticated (60 requests/hour per IP),
        // so rate limiting is routine. Say nothing rather than show invented
        // activity, which is what the old hardcoded fallback did.
        setActivityFailed(true);
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
      <div className="home">
        {/* Hero copy animates on mount, each line a beat behind the last. */}
        <section className="hero">
          <div className="hero-eyebrow anim anim-pop-in" style={{ '--delay': '80ms' }}>
            Backend engineer — order systems
          </div>
          <h1 className="hero-title anim anim-fade-up" style={{ '--delay': '180ms' }}>
            Hey, I'm Gaurav — I build the systems that carry a food order from the app you tapped to the kitchen that cooks it.
          </h1>
          <p className="hero-bio anim anim-fade-up" style={{ '--delay': '300ms' }}>
            I work on the order pipeline at UrbanPiper: the aggregator integrations that take orders in, the services that relay them to a merchant's point-of-sale, and the on-call work of finding out why one of them didn't.
          </p>
        </section>

        <Reveal as="section" className="section-block">
          <SectionKicker>How I think</SectionKicker>
          <p className="prose-line">Most of what I do is integration work: two systems that each make perfect sense on their own, and a contract between them that doesn't quite hold. The interesting part is almost never the happy path.</p>
          <p className="prose-line prose-line-last">Because I spend so much time reading logs across service boundaries, I've come to care a lot about systems that make their own failures legible — a trace id that survives every hop, an error that says which side broke the contract. It's the difference between a ten-minute fix and a lost afternoon.</p>
        </Reveal>

        <Reveal as="section" className="section-block">
          <SectionKicker>Lately</SectionKicker>
          {activity.length > 0 ? (
            <Reveal className="activity-list" variant="fade" stagger>
              {activity.map((ev, index) => (
                <div key={ev.id} className="activity-row" style={staggerStyle(index)}>
                  <span className="activity-text">{ev.text} <strong className="activity-repo">{ev.repo}</strong></span>
                  <span className="activity-time">{ev.time}</span>
                </div>
              ))}
            </Reveal>
          ) : (
            <p className="prose-line prose-line-last">
              {activityFailed
                ? 'GitHub activity is unavailable right now.'
                : 'Loading recent activity…'}
            </p>
          )}
        </Reveal>

        <Reveal as="section" className="section-block">
          <SectionKicker>What I've shipped</SectionKicker>
          {loading ? (
            <SkeletonList count={3} />
          ) : (
            <Reveal className="stacked-list" variant="fade" stagger>
              {featuredProjects.map((project, index) => (
                <div
                  key={index}
                  className="shipped-item hover-lift"
                  style={staggerStyle(index)}
                  onClick={() => openProject(project)}
                >
                  <div className="shipped-item-top">
                    <span className="shipped-item-title">{project.title}</span>
                    {project.category && <span className="shipped-item-category">{project.category}</span>}
                  </div>
                  <p className="shipped-item-description">{project.description}</p>
                </div>
              ))}
            </Reveal>
          )}
          <Link to="/projects" className="inline-link arrow-link">
            View all projects <span className="arrow">→</span>
          </Link>
        </Reveal>

        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={closeProject} />
        )}

        <Reveal as="section" className="section-block">
          <SectionKicker>What I'm into</SectionKicker>
          {loading ? (
            <SkeletonList count={2} lines={1} />
          ) : (
            <Reveal className="stacked-list into-list" variant="fade" stagger>
              {featuredBlogs.map((blog, index) => (
                <div key={index} className="into-item hover-lift" style={staggerStyle(index)}>
                  <div className="into-item-title">{blog.title}</div>
                  <p className="into-item-excerpt">{blog.excerpt || blog.preview}</p>
                  <button className="read-more arrow-link" onClick={() => navigate(`/blogs/${blog.id}`)}>
                    Read more <span className="arrow">→</span>
                  </button>
                </div>
              ))}
            </Reveal>
          )}
          <Link to="/blogs" className="inline-link arrow-link">
            View all posts <span className="arrow">→</span>
          </Link>
        </Reveal>

        <Reveal as="section" className="section-block">
          <SectionKicker>Skills &amp; tools</SectionKicker>
          {loading ? <SkeletonChips count={9} /> : <SkillChips skills={skills} />}
        </Reveal>

        {uses.length > 0 && (
          <Reveal as="section" className="section-block">
            <SectionKicker>Tools I use</SectionKicker>
            <Reveal className="uses-grid" variant="fade" stagger>
              {uses.map((group, index) => (
                <div key={group.category} style={staggerStyle(index)}>
                  <div className="uses-group-label">{group.category}</div>
                  <ul className="uses-group-list">
                    {(group.items || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Reveal>
          </Reveal>
        )}

        <Reveal as="section" className="section-block contact-block">
          <SectionKicker>Get in touch</SectionKicker>
          <p className="contact-line">Building something interesting, or just want to talk shop? My inbox is open.</p>
          <Reveal className="social-media" variant="fade" stagger>
            <a href="https://github.com/gaurav8341" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.165c-3.338.725-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.835 2.807 1.305 3.492.998.108-.775.42-1.305.763-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.24 2.873.117 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.803 5.62-5.475 5.92.43.37.823 1.1.823 2.22v3.293c0 .32.22.694.825.577C20.565 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
            <a href="https://linkedin.com/in/gaurav8341" className="social-link" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.58c-1.14 0-2.06-.92-2.06-2.06s.92-2.06 2.06-2.06 2.06.92 2.06 2.06-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.06-1.86-3.06-1.86 0-2.15 1.45-2.15 2.95v5.71h-3.56V9h3.42v1.56h.05c.48-.91 1.65-1.86 3.4-1.86 3.63 0 4.3 2.39 4.3 5.5v6.25z"/></svg>
            </a>
            <a href="mailto:rajput.gaurav8341@gmail.com" className="social-link" aria-label="Email">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><path d="M12 12.713l11.985-8.713H.015L12 12.713zM12 14.287L.015 5.574V18.426L12 14.287zM12 14.287L23.985 18.426V5.574L12 14.287z"/></svg>
            </a>
          </Reveal>
        </Reveal>
      </div>
  );
};

export default Home;
