import React, { useState } from 'react';
import {
  Brain,
  TrendingDown,
  Binary,
  GitBranch,
  Layers,
  Shrink,
  Network,
  ShieldAlert,
  Award,
  LineChart,
  PlayCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import { DifficultyLevel, QuizCategory } from '../types';

export interface CategoryCardProps {
  category: QuizCategory;
  isCompleted?: boolean;
  onStartQuiz: (categoryId: string, difficulty: DifficultyLevel) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isCompleted = false,
  onStartQuiz,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('all');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'line-chart': return <LineChart className="w-5 h-5 text-blue-400" />;
      case 'trending-down': return <TrendingDown className="w-5 h-5 text-emerald-400" />;
      case 'binary': return <Binary className="w-5 h-5 text-purple-400" />;
      case 'git-branch': return <GitBranch className="w-5 h-5 text-amber-400" />;
      case 'layers': return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'shrink': return <Shrink className="w-5 h-5 text-teal-400" />;
      case 'network': return <Network className="w-5 h-5 text-indigo-400" />;
      case 'shield-alert': return <ShieldAlert className="w-5 h-5 text-rose-400" />;
      case 'award': return <Award className="w-5 h-5 text-yellow-400" />;
      default: return <Brain className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <Card className="p-5 bg-midnight/90 border border-mountainside hover:border-apres/50 rounded-2xl shadow-hard space-y-4 flex flex-col justify-between transition-all duration-200 group">
      <div className="space-y-3">
        {/* Category Header & Icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="p-2.5 rounded-xl bg-mountainside border border-apres/30 group-hover:border-cyan-400/50 transition-colors">
            {getCategoryIcon(category.iconName)}
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="px-2 py-0.5 rounded-full bg-mountainside text-cyan-300 border border-apres/30">
              {category.questionCount} Questions
            </span>
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold">
                ✓ Solved
              </span>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-arctic tracking-tight group-hover:text-cyan-300 transition-colors">
            {category.title}
          </h3>
          <p className="text-xs text-slopes font-sans line-clamp-2 leading-relaxed">
            {category.shortDescription}
          </p>
        </div>
      </div>

      {/* Difficulty Selector & Start Button */}
      <div className="space-y-3 pt-3 border-t border-mountainside/80">
        <div className="flex items-center justify-between text-xs font-mono text-apres">
          <span>Target Difficulty:</span>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel)}
            className="p-1.5 bg-mountainside border border-apres/40 text-arctic text-xs rounded-lg focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (Fundamentals)</option>
            <option value="medium">Medium (Applied)</option>
            <option value="hard">Hard (Advanced Math)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => onStartQuiz(category.id, selectedDifficulty)}
          className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-blue-500/20"
        >
          <PlayCircle className="w-4 h-4" />
          <span>Start Category Quiz</span>
        </button>
      </div>
    </Card>
  );
};

export default CategoryCard;
