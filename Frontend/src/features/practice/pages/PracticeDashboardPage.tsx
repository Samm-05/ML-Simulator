import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  fetchPracticeCategories,
  fetchUserPracticeStats,
  fetchAttemptHistory,
  setSelectedDifficultyFilter,
  setSearchTerm,
  startQuiz,
} from '../practiceSlice';
import PageContainer from '../../../components/layout/PageContainer';
import Card from '../../../components/ui/Card';
import CategoryCard from '../components/CategoryCard';
import { DifficultyLevel, QuizCategory } from '../types';
import {
  Target,
  Trophy,
  Star,
  TrendingUp,
  Award,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  FlaskConical,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PracticeDashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    categories,
    userStats,
    attemptHistory,
    selectedDifficulty,
    searchTerm,
  } = useAppSelector((state) => state.practice);

  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    dispatch(fetchPracticeCategories());
    dispatch(fetchUserPracticeStats());
    dispatch(fetchAttemptHistory());
  }, [dispatch]);

  const handleStartCategoryQuiz = (categoryId: string, difficulty: DifficultyLevel) => {
    dispatch(startQuiz({ categoryId, difficulty }));
    navigate(`/practice/quiz/${categoryId}`);
  };

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch =
      cat.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      cat.topic.toLowerCase().includes(localSearch.toLowerCase()) ||
      cat.shortDescription.toLowerCase().includes(localSearch.toLowerCase());
    return matchesSearch;
  });

  const completedCategoryIds = attemptHistory
    .filter((a) => a.accuracyPercentage >= 70)
    .map((a) => a.categoryId);

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans select-none">
      {/* 1. HERO SECTION */}
      <div className="space-y-3 max-w-5xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            ML Knowledge Assessment Engine
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-arctic">
          Interactive Machine Learning Practice & Quizzes
        </h1>
        <p className="text-sm sm:text-base text-slopes font-sans leading-relaxed max-w-3xl">
          Test your mathematical derivations, conceptual intuition, and debugging skills across 10 real-world ML topics.
        </p>
      </div>

      {/* 2. PROGRESS SUMMARY STATS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <Card className="p-4 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Quizzes Done</span>
            <Trophy className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-arctic">{userStats.totalQuizzesCompleted}</p>
        </Card>

        <Card className="p-4 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Avg Accuracy</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400">{userStats.averageAccuracy}%</p>
        </Card>

        <Card className="p-4 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Practice Streak</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{userStats.currentStreak} Days</p>
        </Card>

        <Card className="p-4 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-1">
          <div className="flex items-center justify-between text-xs text-apres">
            <span>Total Practice XP</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-purple-400">{userStats.totalXP} XP</p>
        </Card>
      </div>

      {/* 3. SEARCH & FILTERS BAR */}
      <Card className="p-4 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-apres absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search quiz categories, topics, or concepts..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                dispatch(setSearchTerm(e.target.value));
              }}
              className="w-full bg-mountainside/50 border border-apres/30 text-arctic text-xs rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:border-cyan-400 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto text-xs font-mono">
            <span className="text-apres text-[11px] shrink-0">Filter Level:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => dispatch(setSelectedDifficultyFilter(e.target.value as DifficultyLevel))}
              className="w-full sm:w-auto p-2 bg-mountainside border border-apres/40 text-arctic text-xs rounded-xl focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="easy">Easy (Fundamentals)</option>
              <option value="medium">Medium (Applied)</option>
              <option value="hard">Hard (Advanced)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* 4. QUIZ CATEGORIES GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-mountainside pb-2">
          <h2 className="text-xl font-bold text-arctic tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>Quiz Categories & Topics</span>
          </h2>
          <span className="text-xs font-mono text-apres">
            {filteredCategories.length} Categories Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CategoryCard
                category={cat}
                isCompleted={completedCategoryIds.includes(cat.id)}
                onStartQuiz={handleStartCategoryQuiz}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 5. RECENT ATTEMPTS & HISTORY */}
      {attemptHistory.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-mountainside pb-2">
            <h2 className="text-xl font-bold text-arctic tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <span>Recent Quiz Attempts</span>
            </h2>
            <span className="text-xs font-mono text-apres">
              {attemptHistory.length} Attempts Recorded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
            {attemptHistory.slice(0, 4).map((attempt) => (
              <div
                key={attempt.id}
                className="p-4 rounded-xl bg-mountainside/30 border border-apres/20 flex items-center justify-between gap-3 hover:border-apres/40 transition-all"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-arctic">{attempt.categoryTitle}</h3>
                  <div className="flex items-center gap-2 text-[11px] text-apres">
                    <span>Accuracy: <strong className="text-emerald-400">{attempt.accuracyPercentage}%</strong></span>
                    <span>• {Math.floor(attempt.timeTakenSeconds / 60)}m {attempt.timeTakenSeconds % 60}s</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 font-bold block">
                    +{attempt.score} XP
                  </span>
                  <span className="text-[10px] text-apres block mt-1">
                    {new Date(attempt.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default PracticeDashboardPage;
