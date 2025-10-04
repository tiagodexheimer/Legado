
import React from 'react';
import { Skills, SkillName } from '../types';

const SKILL_DISPLAY_NAMES: Record<SkillName, string> = {
  woodcutting: 'Silvicultura',
  foraging: 'Coleta',
  mining: 'Mineração',
  hunting: 'Caça',
  cooking: 'Cozinhar',
};

const PlayerSkills = ({ skills }: { skills: Skills }) => (
  <div className="panel">
    <h2>Habilidades</h2>
    {Object.entries(skills).map(([skillName, skill]) => {
      const progress = (skill.xp / skill.xpToNextLevel) * 100;
      return (
        <div key={skillName} style={{ marginBottom: '10px' }}>
          <div>{SKILL_DISPLAY_NAMES[skillName as SkillName] || skillName}: Nível {skill.level}</div>
          <div style={{ border: '1px solid #444', borderRadius: '4px', padding: '2px', backgroundColor: '#1a1a1a' }}>
            <div style={{ 
              width: `${progress}%`, 
              height: '10px', 
              backgroundColor: '#4a90e2', 
              borderRadius: '2px',
              transition: 'width 0.5s ease-in-out'
            }}></div>
          </div>
          <small style={{ color: '#aaa' }}>{skill.xp} / {skill.xpToNextLevel} XP</small>
        </div>
      );
    })}
  </div>
);

export default PlayerSkills;
