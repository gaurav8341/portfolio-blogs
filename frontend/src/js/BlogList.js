import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/BlogList.css';
import { fetchUrls } from './utils';
import Reveal from './Reveal';
import { staggerStyle } from './motion';
import { SkeletonList } from './Skeleton';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const urls = await fetchUrls();
        const response = await axios.get(urls.blogsJsonPath);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error loading blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];
  const filteredBlogs = activeTag ? blogs.filter((blog) => (blog.tags || []).includes(activeTag)) : blogs;

  const toggleTag = (tag) => {
    setActiveTag((current) => (current === tag ? null : tag));
  };

  return (
      <div className="blog-list-page">
        <h1 className="blog-list-heading anim anim-fade-up">Learn With Me</h1>
        <p className="blog-list-subtitle anim anim-fade-up" style={{ '--delay': '100ms' }}>
          Notes on whatever I've been taking apart lately.
        </p>

        {allTags.length > 0 && (
          <Reveal className="tag-filters" variant="fade" stagger>
            {allTags.map((tag, index) => (
              <button
                key={tag}
                className={`tag-filter press${activeTag === tag ? ' active' : ''}`}
                style={staggerStyle(index)}
                onClick={() => toggleTag(tag)}
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </Reveal>
        )}

        {loading ? (
          <SkeletonList count={4} lines={1} />
        ) : (
          /* Keyed on the active tag so changing the filter replays the stagger
             rather than swapping the list contents instantly. */
          <Reveal
            as="ul"
            key={activeTag || 'all'}
            className="blog-items"
            variant="fade"
            stagger
          >
            {filteredBlogs.map((blog, index) => (
              <li key={blog.path} className="blog-item" style={staggerStyle(index)}>
                <Link className="blog-item-link" to={`/blogs/${blog.id}`}>
                  <h2 className="blog-item-title">{blog.title}</h2>
                  <p className="blog-item-preview">{blog.preview}</p>
                  <div className="blog-item-meta">
                    <span>{blog.date}</span>
                    {blog.tags && blog.tags.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{blog.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </Reveal>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <p className="blog-empty anim anim-fade-in">Nothing tagged "{activeTag}" yet.</p>
        )}
      </div>
  );
};

export default BlogList;
