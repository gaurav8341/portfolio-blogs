import React from 'react';
import { renderStars } from './utils';
import Reveal from './Reveal';
import { staggerStyle } from './motion';
import '../css/SkillChips.css';

const SkillChips = ({ skills }) => (
  <Reveal className="skill-chips" variant="fade" stagger>
    {skills.map((skill, index) => (
      <div key={index} className="skill-chip" style={staggerStyle(index)} title={skill.description}>
        <div className="skill-chip-row">
          <span className="skill-chip-name">{skill.name}</span>
          {skill.type && <span className="skill-chip-type">{skill.type}</span>}
        </div>
        <div className="skill-chip-stars">{renderStars(skill.experience)}</div>
      </div>
    ))}
  </Reveal>
);

export default SkillChips;
