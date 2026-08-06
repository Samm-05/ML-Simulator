import React from 'react';
import { motion } from 'framer-motion';
import { Medal, Award, TrendingUp, Zap, BookOpen, Layers, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  role?: string;
  xp: number;
  points: number;
  level: number;
  streak: number;
  completedModules: number;
  completedLabs: number;
  completedQuizzes: number;
  badges: string[];
  progressPercent: number;
  lastActive?: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  loading?: boolean;
}

const getInitials = (name: string): string => {
  if (!name) return 'L';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
  }
  return parts[0].substring(0, 2).toUpperCase();
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, currentUserId, loading }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center space-x-1 bg-yellow-500/20 text-yellow-500 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
            <Medal className="w-4 h-4 text-yellow-500" />
            <span>#1</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center space-x-1 bg-slate-400/20 text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-400/30">
            <Medal className="w-4 h-4 text-slate-300" />
            <span>#2</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center space-x-1 bg-amber-600/20 text-amber-500 px-2.5 py-1 rounded-full text-xs font-bold border border-amber-600/30">
            <Medal className="w-4 h-4 text-amber-500" />
            <span>#3</span>
          </div>
        );
      default:
        return <span className="text-secondary-400 font-semibold text-sm pl-2">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) {
      return 'bg-primary-500/10 border-l-4 border-primary-500 dark:bg-primary-900/30';
    }
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent border-l-4 border-yellow-500 dark:bg-yellow-900/10';
      case 2:
        return 'bg-gradient-to-r from-slate-400/10 via-transparent to-transparent border-l-4 border-slate-400 dark:bg-slate-900/10';
      case 3:
        return 'bg-gradient-to-r from-amber-600/10 via-transparent to-transparent border-l-4 border-amber-600 dark:bg-amber-900/10';
      default:
        return '';
    }
  };

  // Skeleton Loader State
  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 rounded-xl bg-secondary-100 dark:bg-secondary-800/50">
              <div className="w-8 h-8 rounded-full bg-secondary-300 dark:bg-secondary-700" />
              <div className="w-10 h-10 rounded-full bg-secondary-300 dark:bg-secondary-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary-300 dark:bg-secondary-700 rounded w-1/4" />
                <div className="h-3 bg-secondary-200 dark:bg-secondary-800 rounded w-1/3" />
              </div>
              <div className="w-16 h-6 bg-secondary-300 dark:bg-secondary-700 rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Empty State
  if (!entries || !Array.isArray(entries) || entries.length === 0) {
    return (
      <Card className="p-12 text-center">
        <TrendingUp className="w-16 h-16 text-secondary-400 mx-auto mb-4 animate-bounce" />
        <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-2">
          No learners yet
        </h3>
        <p className="text-secondary-500 dark:text-secondary-400 max-w-md mx-auto">
          Be the first registered learner to complete machine learning modules and claim the #1 rank on the leaderboard!
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden shadow-xl border border-secondary-200 dark:border-secondary-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-secondary-100/70 dark:bg-secondary-800/70 text-secondary-600 dark:text-secondary-400 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Learner</th>
              <th className="px-4 py-4 text-center">Level & XP</th>
              <th className="px-4 py-4 text-center">Points</th>
              <th className="px-4 py-4 text-center">Streak</th>
              <th className="px-4 py-4 text-center">Modules / Labs / Quizzes</th>
              <th className="px-6 py-4 text-center">Badges</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
            {entries.map((entry, index) => {
              const displayName = entry?.name || `Learner #${index + 1}`;
              const initials = getInitials(displayName);
              const rankVal = entry?.rank || index + 1;
              const keyVal = entry?.userId || `entry-${index}`;
              const xpVal = typeof entry?.xp === 'number' ? entry.xp : (entry?.points || 0);
              const pointsVal = typeof entry?.points === 'number' ? entry.points : 0;
              const levelVal = entry?.level || 1;
              const streakVal = typeof entry?.streak === 'number' ? entry.streak : 1;
              const modulesVal = typeof entry?.completedModules === 'number' ? entry.completedModules : 0;
              const labsVal = typeof entry?.completedLabs === 'number' ? entry.completedLabs : 0;
              const quizzesVal = typeof entry?.completedQuizzes === 'number' ? entry.completedQuizzes : 0;
              const badgesList = Array.isArray(entry?.badges) ? entry.badges : [];

              const isCurrentUser = Boolean(
                currentUserId &&
                entry?.userId &&
                String(entry.userId) === String(currentUserId)
              );

              return (
                <motion.tr
                  key={keyVal}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`
                    hover:bg-secondary-100/50 dark:hover:bg-secondary-800/40 transition-colors
                    ${getRankBackground(rankVal, isCurrentUser)}
                  `}
                >
                  {/* Rank Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRankIcon(rankVal)}
                  </td>

                  {/* Learner Info Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {entry?.avatar ? (
                        <img
                          src={entry.avatar}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/30"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white shadow-md text-sm">
                          {initials}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-secondary-900 dark:text-white text-base">
                            {displayName}
                          </span>
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 text-xs font-bold bg-primary-500 text-white rounded-md shadow-sm">
                              You
                            </span>
                          )}
                        </div>
                        {entry?.role && entry.role !== 'student' && (
                          <span className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                            {entry.role}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Level & XP Column */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent-500/10 text-accent-400 border border-accent-500/20 mb-1">
                        Lvl {levelVal}
                      </span>
                      <span className="text-sm font-bold text-secondary-900 dark:text-white">
                        {xpVal.toLocaleString()} XP
                      </span>
                    </div>
                  </td>

                  {/* Points Column */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-1 font-bold text-secondary-900 dark:text-white">
                      <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span>{pointsVal.toLocaleString()}</span>
                    </div>
                  </td>

                  {/* Streak Column */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center space-x-1.5 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-bold border border-orange-500/20">
                      <span className="text-sm">🔥</span>
                      <span>{streakVal} {streakVal === 1 ? 'day' : 'days'}</span>
                    </div>
                  </td>

                  {/* Educational Statistics Column */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center space-x-4 text-xs">
                      <span className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-300" title="Completed Modules">
                        <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                        <span className="font-semibold">{modulesVal}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-300" title="Completed Playground Labs">
                        <Layers className="w-3.5 h-3.5 text-accent-500" />
                        <span className="font-semibold">{labsVal}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-300" title="Completed Quizzes">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                        <span className="font-semibold">{quizzesVal}</span>
                      </span>
                    </div>
                  </td>

                  {/* Badges Column */}
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    {badgesList.length > 0 ? (
                      <div className="flex items-center justify-center space-x-1.5">
                        {badgesList.slice(0, 2).map((badge, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 border border-secondary-200 dark:border-secondary-700"
                          >
                            <Award className="w-3 h-3 text-accent-500" />
                            <span>{badge}</span>
                          </span>
                        ))}
                        {badgesList.length > 2 && (
                          <span className="text-xs font-semibold text-secondary-500 dark:text-secondary-400">
                            +{badgesList.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-secondary-400 dark:text-secondary-500 italic">
                        No badges yet
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LeaderboardTable;