import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  Play,
  BookOpen,
  BarChart3,
  Layers,
  ChevronRight,
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
  const { stats, recentActivity, loading } = useAppSelector((state) => state.dashboard);
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
      description: 'Continue your practice',
      icon: TrendingUp,
      color: 'from-primary-500 to-primary-600',
      path: '/simulator/linear-regression',
    },
    {
      title: 'K-Means Clustering',
      description: 'New challenge available',
      icon: Layers,
      color: 'from-accent-500 to-accent-600',
      path: '/simulator/kmeans',
    },
    {
      title: 'Decision Tree',
      description: 'Master the splits',
      icon: BookOpen,
      color: 'from-warning to-warning/80',
      path: '/simulator/decision-tree',
    },
  ];

  return (
    <PageContainer>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          You've made great progress. Here's your learning overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      {stats && <DashboardStats stats={stats} />}

      {/* Main Content Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8"
      >
        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(action.path)}
                  className={`p-4 rounded-xl bg-gradient-to-br ${action.color} text-white text-left`}
                >
                  <action.icon className="w-8 h-8 mb-2 opacity-90" />
                  <h3 className="font-medium mb-1">{action.title}</h3>
                  <p className="text-xs opacity-80">{action.description}</p>
                </motion.button>
              ))}
            </div>

            {/* Performance Chart Placeholder */}
            <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Weekly Performance
                </h3>
                <button className="text-primary-600 text-sm hover:text-primary-700 flex items-center">
                  View Details <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="h-32 flex items-end space-x-2">
                {[65, 75, 82, 78, 88, 92, 85].map((value, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: value }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-primary-600 rounded-t-lg"
                      style={{ height: `${value}%` }}
                    />
                    <span className="text-xs text-secondary-500 mt-2">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={itemVariants}>
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <ActivityFeed activities={recentActivity} />
            
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              onClick={() => navigate('/practice')}
            >
              View All Activity
            </Button>
          </Card>
        </motion.div>

        {/* Continue Learning */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
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

        {/* Recommended Challenges */}
        <motion.div variants={itemVariants}>
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
              Explore All Challenges
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default Dashboard;