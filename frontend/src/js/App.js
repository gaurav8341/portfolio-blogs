import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Project from './Project';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import ResumePage from './ResumePage';
import '../css/App.css';
import { fetchUrls } from './utils';
import axios from 'axios';
// import { Analytics } from "@vercel/analytics/react"
// import { SpeedInsights } from "@vercel/speed-insights/react"

function App() {
  const [blogPaths, setBlogPaths] = useState({});
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const urls = await fetchUrls();
        const response = await axios.get(urls.blogsJsonPath)
        if (!response.status === 200) {
          throw new Error('Failed to fetch blogs');
        }
        const blogs = response.data;
        setBlogs(blogs);
        const paths = blogs.reduce((acc, blog) => {
          acc[blog.id] = blog.path;
          return acc;
        }, {});
        setBlogPaths(paths);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail blogPaths={blogPaths} blogs={blogs} />} />
        <Route path="/projects" element={<Project />} />
        <Route path="/resume" element={<ResumePage />} />
      </Routes>
    </Router>
  );
}

export default App;