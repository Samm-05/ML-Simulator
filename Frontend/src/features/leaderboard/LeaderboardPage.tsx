import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Filter,
  AlertCircle,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchGlobalLeaderboard,
  fetchWeeklyLeaderboard,
  fetchAlgorithmLeaderboard,
} from './leaderboardSlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import LeaderboardTable from './LeaderboardTable';

const LeaderboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { global, weekly, byAlgorithm, userRank, loading, error } = useAppSelector((state) => state.leaderboard);
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'algorithms'>('global');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('linear-regression');

  useEffect(() => {
    dispatch(fetchGlobalLeaderboard());
    dispatch(fetchWeeklyLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'algorithms') {
      dispatch(fetchAlgorithmLeaderboard(selectedAlgorithm));
    }
  }, [activeTab, selectedAlgorithm, dispatch]);

  const algorithms = [
    { value: 'linear-regression', label: 'Linear Regression' },
    { value: 'kmeans', label: 'K-Means' },
    { value: 'decision-tree', label: 'Decision Tree' },
    { value: 'neural-network', label: 'Neural Network' },
  ];

  const currentUserId = user?.id || (user as any)?._id;
  const currentGlobalList = Array.isArray(global) ? global : [];
  const currentWeeklyList = Array.isArray(weekly) ? weekly : [];
  const currentAlgoList = selectedAlgorithm && Array.isArray(byAlgorithm[selectedAlgorithm]) ? byAlgorithm[selectedAlgorithm] : [];

  const activeEntries =
    activeTab === 'global'
      ? currentGlobalList
      : activeTab === 'weekly'
      ? currentWeeklyList
      : currentAlgoList;

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Leaderboard
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Compete with registered learners and track real-time machine learning progress
        </p>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center space-x-3 text-red-500"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                  Global Rank
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                  #{userRank?.global || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-xl">
                <Trophy className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                  Weekly Rank
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                  #{userRank?.weekly || 0}
                </p>
              </div>
              <div className="p-3 bg-accent-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-accent-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                  Active Learners
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                  {currentGlobalList.length}
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl">
                <Users className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Card className="p-6 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'global'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <Trophy className="w-5 h-5 inline-block mr-2" />
            Global Rankings
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'weekly'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            This Week
          </button>
          <button
            onClick={() => setActiveTab('algorithms')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'algorithms'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <Award className="w-5 h-5 inline-block mr-2" />
            By Algorithm
          </button>
        </div>
      </Card>

      {/* Algorithm Filter (for algorithms tab) */}
      {activeTab === 'algorithms' && (
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-secondary-400" />
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="flex-1 px-4 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {algorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Leaderboard Table Component */}
      <LeaderboardTable
        entries={activeEntries}
        currentUserId={currentUserId}
        loading={loading}
      />
    </PageContainer>
  );
};

export default LeaderboardPage;
