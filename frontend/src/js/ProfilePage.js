import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import CommonLayout from './CommonLayout';
import axios from 'axios';
import '../css/ProfilePage.css';
import { fetchUrls } from './utils';
import SkillChips from './SkillChips';

const ProfilePage = ({ contentUrl }) => {
  const [content, setContent] = useState("");
  const [skills, setSkills] = useState([]);
  const printRef = useRef();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(contentUrl);
        setContent(response.data);
      } catch (error) {
        console.error("Error loading content:", error);
      }
    };

    fetchContent();
  }, [contentUrl]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const urls = await fetchUrls();
        const response = await axios.get(urls.skillsJsonPath);
        setSkills(response.data);
      } catch (error) {
        console.error("Error loading skills:", error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <CommonLayout>
      <div className="profile-page">
        <div ref={printRef} className="profile-info" dangerouslySetInnerHTML={{ __html: content }} />
        <div className="profile-actions">
          <Link to="/resume" className="btn btn-primary">View interactive résumé</Link>
          <a href={`${process.env.PUBLIC_URL}/resume.pdf`} className="btn btn-secondary" download>Download PDF</a>
        </div>
        <h6 className="section-kicker">Skills &amp; tools</h6>
        <SkillChips skills={skills} />
      </div>
    </CommonLayout>
  );
};

export default ProfilePage;
