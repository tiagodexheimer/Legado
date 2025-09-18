import React from 'react';
import { PlayerStatsData } from '../types';

const StatBar = ({ label, value, max, color }: { label: string, value: number, max: number, color: string }) => {
  const progress = (value / max) * 100;
  return (
    <div style={{ marginBottom: '10px' }}>
      <div>{label}: {value.toFixed(0)} / {max}</div>
      <div style={{ border: '1px solid #444', borderRadius: '4px', padding: '2px', backgroundColor: '#1a1a1a' }}>
        <div style={{
          width: `${progress}%`,
          height: '12px',
          backgroundColor: color,
          borderRadius: '2px',
          transition: 'width 0.5s ease-in-out'
        }}></div>
      </div>
    </div>
  );
};

const TemperatureBar = ({ value }: { value: number }) => {
    const minTemp = 20;
    const maxTemp = 50;
    const optimalTemp = 37;
    const normalizedValue = Math.max(minTemp, Math.min(maxTemp, value));
    const progress = ((normalizedValue - minTemp) / (maxTemp - minTemp)) * 100;

    let color = '#4caf50'; // Green for optimal
    if (value < 30 || value > 42) color = '#f44336'; // Red for dangerous
    else if (value < 35 || value > 39) color = '#ff9800'; // Orange for warning

    return (
        <div style={{ marginBottom: '10px' }}>
            <div>Temp. Corporal: {value.toFixed(1)}°C</div>
            <div style={{ border: '1px solid #444', borderRadius: '4px', padding: '2px', backgroundColor: '#1a1a1a', position: 'relative' }}>
                <div style={{ width: '100%', height: '12px', display: 'flex' }}>
                    <div style={{ width: '33.3%', backgroundColor: '#ff9800' }}></div>
                    <div style={{ width: '33.4%', backgroundColor: '#4caf50' }}></div>
                    <div style={{ width: '33.3%', backgroundColor: '#ff9800' }}></div>
                </div>
                <div style={{
                    position: 'absolute',
                    top: '1px',
                    left: `${progress}%`,
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '14px',
                    backgroundColor: 'white',
                    border: '1px solid black',
                    borderRadius: '2px',
                }}></div>
            </div>
        </div>
    );
};

const PlayerStats = ({ stats }: { stats: PlayerStatsData }) => (
  <div className="panel">
    <h2>Status</h2>
    <StatBar label="Saúde" value={stats.health} max={100} color="#f44336" />
    <StatBar label="Fome" value={stats.hunger} max={100} color="#ff9800" />
    <StatBar label="Sede" value={stats.thirst} max={100} color="#2196f3" />
    <TemperatureBar value={stats.temperature} />
  </div>
);

export default PlayerStats;