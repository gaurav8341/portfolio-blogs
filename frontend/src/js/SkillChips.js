import React from 'react';
import { renderStars } from './utils';
import '../css/SkillChips.css';

const SkillChips = ({ skills }) => (
  <div className="skill-chips">
    {skills.map((skill, index) => (
      <div key={index} className="skill-chip">
        <div className="skill-chip-row">
          <span className="skill-chip-name">{skill.name}</span>
          {skill.type && <span className="skill-chip-type">{skill.type}</span>}
        </div>
        <div className="skill-chip-stars">{renderStars(skill.experience)}</div>
      </div>
    ))}
  </div>
);

export default SkillChips;
