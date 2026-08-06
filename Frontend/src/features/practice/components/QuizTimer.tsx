import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export interface QuizTimerProps {
  initialSeconds?: number;
  onTimeUp?: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  initialSeconds = 600, // 10 minutes default
}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isWarning = secondsLeft < 60;

  return (
    <div
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold transition-all ${
        isWarning
          ? 'bg-rose-950/60 border-rose-500/60 text-rose-400 animate-pulse'
          : 'bg-mountainside/80 border-apres/30 text-cyan-400'
      }`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default QuizTimer;
