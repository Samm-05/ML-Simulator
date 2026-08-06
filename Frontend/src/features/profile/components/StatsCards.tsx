import React from 'react';
import Card from '../../../components/ui/Card';
import { Clock, HelpCircle, Code, Play } from 'lucide-react';

export interface StatsCardsProps {
  practiceTimeMinutes?: number;
  averageQuizScore?: number;
  problemsSolved?: number;
  totalProblems?: number;
  experimentsRun?: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  practiceTimeMinutes = 870, // 14h 30m
  averageQuizScore = 94,
  problemsSolved = 18,
  totalProblems = 25,
  experimentsRun = 42,
}) => {
  const hours = Math.floor(practiceTimeMinutes / 60);
  const mins = practiceTimeMinutes % 60;

  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-4">
      <div className="border-b border-mountainside pb-3">
        <h2 className="text-lg font-bold text-arctic tracking-tight">
          Performance & Stats Summary
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono">
        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Learning Time</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <p className="text-base font-bold text-arctic">{hours}h {mins}m</p>
        </div>

        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Avg Quiz Score</span>
            <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-base font-bold text-emerald-400">{averageQuizScore}%</p>
        </div>

        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Code Solved</span>
            <Code className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-base font-bold text-arctic">{problemsSolved} / {totalProblems}</p>
        </div>

        <div className="p-3.5 bg-mountainside/30 border border-apres/20 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Lab Runs</span>
            <Play className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <p className="text-base font-bold text-purple-400">{experimentsRun} Runs</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCards;
