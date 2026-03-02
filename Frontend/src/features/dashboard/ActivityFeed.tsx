import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  Brain,
  Trophy,
  Target,
  Award,
  Star,
  TrendingUp,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'practice' | 'simulation' | 'challenge' | 'badge';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  icon?: string;
  color?: string;
  bgColor?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'practice':
        return Brain;
      case 'simulation':
        return TrendingUp;
      case 'challenge':
        return Target;
      case 'badge':
        return Award;
      default:
        return Star;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'practice':
        return 'text-primary-500 bg-primary-500/10';
      case 'simulation':
        return 'text-accent-500 bg-accent-500/10';
      case 'challenge':
        return 'text-warning bg-warning/10';
      case 'badge':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-secondary-500 bg-secondary-500/10';
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-12 h-12 text-secondary-300 mx-auto mb-3" />
        <p className="text-secondary-500 dark:text-secondary-400">
          No recent activity
        </p>
        <p className="text-sm text-secondary-400 mt-1">
          Start practicing to see your activity here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);
        const colorClasses = getActivityColor(activity.type);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors cursor-pointer"
          >
            <div className={`p-2 rounded-lg ${colorClasses}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                {activity.description}
              </p>
              <p className="text-xs text-secondary-400 mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
            {activity.score && (
              <span className="text-xs font-medium text-accent-500">
                +{activity.score} pts
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;