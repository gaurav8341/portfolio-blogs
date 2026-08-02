import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/BlogList.css';
import CommonLayout from './CommonLayout';
import { fetchUrls } from './utils';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [activeTag, setActiveTag] = useState(null);

  useEffect(() => {
    const loadBlogs = async () => {
      const urls = await fetchUrls();
      const response = await axios.get(urls.blogsJsonPath);
      setBlogs(response.data);
    };

    loadBlogs();
  }, []);

  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];
  const filteredBlogs = activeTag ? blogs.filter((blog) => (blog.tags || []).includes(activeTag)) : blogs;

  const toggleTag = (tag) => {
    setActiveTag((current) => (current === tag ? null : tag));
  };

  return (
    <CommonLayout>
      <div className="blog-list-page">
        <h1 className="blog-list-heading">Learn With Me</h1>

        {allTags.length > 0 && (
          <div className="tag-filters">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-filter${activeTag === tag ? ' active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        <ul className="blog-items">
          {filteredBlogs.map((blog) => (
            <li key={blog.path} className="blog-item">
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
        </ul>
      </div>
    </CommonLayout>
  );
};

export default BlogList;
