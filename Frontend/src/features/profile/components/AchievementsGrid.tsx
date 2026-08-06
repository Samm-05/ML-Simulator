import React from 'react';
import { Award, Lock, Sparkles, Flame, Trophy, CheckCircle, Brain, Target } from 'lucide-react';
import Card from '../../../components/ui/Card';

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  unlockCriteria: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export interface AchievementsGridProps {
  badges?: BadgeItem[];
}

const DEFAULT_BADGES: BadgeItem[] = [
  {
    id: 'b1',
    name: 'First Model Trained',
    description: 'Trained your first 3D regression line or neural network.',
    unlockCriteria: 'Run any 3D playground simulation once.',
    icon: 'sparkles',
    earned: true,
    earnedAt: '2 days ago',
  },
  {
    id: 'b2',
    name: '7-Day Streak',
    description: 'Logged in and studied for 7 consecutive days.',
    unlockCriteria: 'Maintain a 7-day learning streak.',
    icon: 'flame',
    earned: true,
    earnedAt: 'Yesterday',
  },
  {
    id: 'b3',
    name: 'Gradient Descent Master',
    description: 'Minimized loss below 0.05 on a non-convex saddle point surface.',
    unlockCriteria: 'Achieve loss < 0.05 in GD Laboratory.',
    icon: 'trophy',
    earned: true,
    earnedAt: '3 days ago',
  },
  {
    id: 'b4',
    name: 'Perfect Quiz Score',
    description: 'Scored 100% on a module examination quiz.',
    unlockCriteria: 'Get 5/5 on any ML Coach quiz.',
    icon: 'award',
    earned: false,
  },
  {
    id: 'b5',
    name: 'Top 10 Leaderboard',
    description: 'Reached the Top 10 global user leaderboard ranking.',
    unlockCriteria: 'Accumulate > 1,500 XP points.',
    icon: 'target',
    earned: false,
  },
  {
    id: 'b6',
    name: 'Clustering Pioneer',
    description: 'Completed Module 6: Clustering & Unsupervised Learning.',
    unlockCriteria: 'Finish Module 6 in ML Coach.',
    icon: 'brain',
    earned: false,
  },
];

export const AchievementsGrid: React.FC<AchievementsGridProps> = ({ badges = DEFAULT_BADGES }) => {
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'trophy': return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'target': return <Target className="w-5 h-5 text-rose-400" />;
      case 'brain': return <Brain className="w-5 h-5 text-purple-400" />;
      default: return <Award className="w-5 h-5 text-cyan-400" />;
    }
  };

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-5">
      <div className="flex items-center justify-between border-b border-mountainside pb-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-arctic tracking-tight">
            Achievements & Badges
          </h2>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-500/30">
          {earnedCount} / {badges.length} Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl border relative group transition-all duration-200 ${
              badge.earned
                ? 'bg-mountainside/40 border-apres/40 hover:border-cyan-400/60 shadow-soft'
                : 'bg-midnight/60 border-mountainside/60 opacity-65 hover:opacity-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-xl border shrink-0 ${
                  badge.earned
                    ? 'bg-cyan-950/50 border-cyan-500/40'
                    : 'bg-mountainside/50 border-apres/20 text-apres'
                }`}
              >
                {badge.earned ? getBadgeIcon(badge.icon) : <Lock className="w-5 h-5 text-apres" />}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-xs font-bold text-arctic tracking-tight">{badge.name}</h3>
                  {badge.earned && <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                </div>
                <p className="text-[11px] text-slopes line-clamp-2 leading-relaxed">{badge.description}</p>
                {badge.earned && badge.earnedAt && (
                  <span className="text-[10px] font-mono text-emerald-400 block pt-0.5">Earned {badge.earnedAt}</span>
                )}
              </div>
            </div>

            {/* Hover Tooltip explaining unlock criteria */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-midnight border border-cyan-500/40 rounded-xl text-[11px] font-mono text-cyan-200 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-2xl z-30">
              <span className="font-bold text-cyan-300 block mb-0.5">Unlock Requirement:</span>
              <span>{badge.unlockCriteria}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AchievementsGrid;
