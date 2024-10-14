// src/components/SkillBubble.js

import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const SkillBubble = ({ skill }) => {
  return (
    <div className="skill-bubble">
      <CircularProgressbar
        value={skill.nivel}
        text={skill.nombre}
        styles={buildStyles({
          textSize: '16px',
          pathColor: '#3e98c7',
          textColor: '#333',
          trailColor: '#d6d6d6',
        })}
      />
    </div>
  );
};

export default SkillBubble;
