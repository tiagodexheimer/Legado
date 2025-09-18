
import React, { useState, useEffect, useRef } from 'react';

interface KnappingMinigameProps {
  sequence: string[];
  onComplete: (success: boolean) => void;
  timeLimit: number;
}

const KnappingMinigame: React.FC<KnappingMinigameProps> = ({ sequence, onComplete, timeLimit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!); // Time's up
          onComplete(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Keyboard listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === sequence[currentIndex]) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Wrong key pressed
        clearInterval(timerRef.current!); // End game
        onComplete(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sequence, currentIndex, onComplete, timeLimit]);

  useEffect(() => {
    if (currentIndex === sequence.length) {
      clearInterval(timerRef.current!); // Sequence completed
      onComplete(true);
    }
  }, [currentIndex, sequence.length, onComplete]);

  return (
    <div style={{
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      backgroundColor: '#333', border: '2px solid #555', padding: '20px', borderRadius: '8px',
      zIndex: 200, textAlign: 'center', color: 'white',
    }}>
      <h2>Lascagem de Pedra!</h2>
      <p>Pressione as setas na ordem:</p>
      <div style={{ fontSize: '2em', marginBottom: '10px' }}>
        {sequence.map((key, index) => (
          <span key={index} style={{ color: index === currentIndex ? 'yellow' : 'gray', margin: '0 5px' }}>
            {key === 'ArrowUp' && '⬆️'}
            {key === 'ArrowDown' && '⬇️'}
            {key === 'ArrowLeft' && '⬅️'}
            {key === 'ArrowRight' && '➡️'}
          </span>
        ))}
      </div>
      <p>Tempo restante: {timeLeft}s</p>
    </div>
  );
};

export default KnappingMinigame;
