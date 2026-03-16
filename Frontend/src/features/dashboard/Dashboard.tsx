import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  Target,
  Play,
  BookOpen,
  Layers,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDashboardStats, fetchRecentActivity } from './dashboardSlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DashboardStats from './DashboardStats';
import ActivityFeed from './ActivityFeed';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { stats, recentActivity } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  const quickActions = [
    {
      title: 'Linear Regression',
      description: 'Continue your latest run',
      icon: TrendingUp,
      tone: 'bg-primary-500/10 text-primary-600',
      path: '/simulator/linear-regression',
    },
    {
      title: 'K-Means Clustering',
      description: 'New challenge ready',
      icon: Layers,
      tone: 'bg-accent-500/10 text-accent-600',
      path: '/simulator/kmeans',
    },
    {
      title: 'Decision Tree',
      description: 'Polish your splits',
      icon: BookOpen,
      tone: 'bg-warning/15 text-warning',
      path: '/simulator/decision-tree',
    },
  ];

  return (
    <PageContainer className="relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute top-40 -left-12 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-secondary-500 dark:text-secondary-400">
              Dashboard Overview
            </p>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mt-2">
              Welcome back, {user?.firstName || 'Learner'}
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-2 max-w-2xl">
              Keep momentum with focused practice sessions and smart challenges tailored to your progress.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-secondary-200/70 dark:border-secondary-700/60 bg-white/80 dark:bg-secondary-900/40 px-4 py-3 shadow-soft">
              <div className="h-10 w-10 rounded-xl bg-primary-500/10 text-primary-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Weekly focus</p>
                <p className="text-sm font-semibold text-secondary-900 dark:text-white">
                  3 skills to master
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowUpRight className="h-4 w-4" />}
              onClick={() => navigate('/practice')}
            >
              Start session
            </Button>
          </div>
        </div>
      </motion.div>

      {stats && <DashboardStats stats={stats} />}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 xl:grid-cols-12 gap-6 mt-8"
      >
        <motion.div variants={itemVariants} className="xl:col-span-8 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Quick Actions
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Jump back into what matters most today.
                </p>
              </div>
              <button className="text-primary-600 text-sm hover:text-primary-700 flex items-center">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  className="group p-4 rounded-2xl border border-secondary-200/70 dark:border-secondary-700/60 bg-white/70 dark:bg-secondary-900/40 text-left transition-all hover:shadow-medium"
                >
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${action.tone}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-white mt-3 mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {action.description}
                  </p>
                  <span className="text-xs font-medium text-primary-600 mt-3 inline-flex items-center">
                    Open module <ChevronRight className="w-3 h-3 ml-1" />
                  </span>
                </motion.button>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Weekly Performance
                </h3>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Consistency beats intensity. Keep it steady.
                </p>
              </div>
              <button className="text-primary-600 text-sm hover:text-primary-700 flex items-center">
                View details <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 items-end">
              {[65, 75, 82, 78, 88, 92, 85].map((value, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: value }}
                    transition={{ delay: index * 0.08 }}
                    className="w-full rounded-full bg-gradient-to-t from-primary-600 to-primary-400"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-secondary-500">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Recent Activity
              </h2>
              <span className="text-xs text-secondary-500">Last 7 days</span>
            </div>
            <ActivityFeed activities={recentActivity} />

            <Button variant="outline" fullWidth className="mt-4" onClick={() => navigate('/practice')}>
              View all activity
            </Button>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-7">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Continue Learning
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      Linear Regression
                    </h3>
                    <p className="text-sm text-secondary-500">85% complete</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Play className="w-4 h-4" />}
                  onClick={() => navigate('/simulator/linear-regression')}
                >
                  Continue
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent-100 dark:bg-accent-900/20 rounded-xl">
                    <Layers className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      K-Means Clustering
                    </h3>
                    <p className="text-sm text-secondary-500">62% complete</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Play className="w-4 h-4" />}
                  onClick={() => navigate('/simulator/kmeans')}
                >
                  Continue
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning/10 rounded-xl">
                    <BookOpen className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-medium text-secondary-900 dark:text-white">
                      Decision Tree
                    </h3>
                    <p className="text-sm text-secondary-500">45% complete</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Play className="w-4 h-4" />}
                  onClick={() => navigate('/simulator/decision-tree')}
                >
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="xl:col-span-5">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Recommended Challenges
            </h2>
            <div className="space-y-3">
              <div className="p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-secondary-900 dark:text-white">
                    Parameter Tuning
                  </span>
                  <span className="text-xs px-2 py-1 bg-accent-100 dark:bg-accent-900/20 text-accent-600 rounded-full">
                    +50 pts
                  </span>
                </div>
                <p className="text-xs text-secondary-500">Find optimal learning rate</p>
              </div>

              <div className="p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-secondary-900 dark:text-white">
                    Cluster Analysis
                  </span>
                  <span className="text-xs px-2 py-1 bg-accent-100 dark:bg-accent-900/20 text-accent-600 rounded-full">
                    +75 pts
                  </span>
                </div>
                <p className="text-xs text-secondary-500">Find optimal K value</p>
              </div>

              <div className="p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-secondary-900 dark:text-white">
                    Tree Pruning
                  </span>
                  <span className="text-xs px-2 py-1 bg-accent-100 dark:bg-accent-900/20 text-accent-600 rounded-full">
                    +100 pts
                  </span>
                </div>
                <p className="text-xs text-secondary-500">Prevent overfitting</p>
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              onClick={() => navigate('/practice')}
            >
              Explore all challenges
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default Dashboard;
