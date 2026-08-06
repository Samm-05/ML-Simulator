import React from 'react';
import Card from '../../../components/ui/Card';
import { Activity, BookOpen, Brain, CheckCircle2, Flame, Award, Clock } from 'lucide-react';

export interface ActivityItem {
  id: string;
  type: 'lesson' | 'playground' | 'quiz' | 'achievement' | 'streak';
  title: string;
  detail: string;
  timestamp: string;
}

export interface ActivityFeedProps {
  activities?: ActivityItem[];
}

const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1',
    type: 'lesson',
    title: 'Completed Lesson 3: Cost Function Derivations',
    detail: 'Module 2: Linear Regression',
    timestamp: '2 hours ago',
  },
  {
    id: 'a2',
    type: 'playground',
    title: 'Trained Model in Neural Network Playground',
    detail: 'Final BCE Loss: 0.023 across 50 epochs',
    timestamp: '5 hours ago',
  },
  {
    id: 'a3',
    type: 'quiz',
    title: 'Scored 94% on Gradient Descent Quiz',
    detail: 'Answered 5/5 questions correctly',
    timestamp: 'Yesterday',
  },
  {
    id: 'a4',
    type: 'streak',
    title: 'Achieved 7-Day Learning Streak!',
    detail: 'Maintained consecutive daily activity',
    timestamp: 'Yesterday',
  },
  {
    id: 'a5',
    type: 'lesson',
    title: 'Finished Module 6: Clustering & Unsupervised Learning',
    detail: 'Mastered K-Means, Silhouette Score & DBSCAN',
    timestamp: '3 days ago',
  },
  {
    id: 'a6',
    type: 'achievement',
    title: 'Unlocked Badge: "Gradient Descent Master"',
    detail: 'Achieved loss < 0.05 on saddle point surface',
    timestamp: '4 days ago',
  },
];

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities = DEFAULT_ACTIVITIES }) => {
  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'lesson': return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'playground': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'quiz': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'streak': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'achievement': return <Award className="w-4 h-4 text-yellow-400" />;
      default: return <Activity className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-4">
      <div className="flex items-center justify-between border-b border-mountainside pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-arctic tracking-tight">
            Recent Activity Feed
          </h2>
        </div>
        <span className="text-xs font-mono text-apres">Last 7 Days</span>
      </div>

      <div className="space-y-3">
        {activities.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-mountainside/30 border border-apres/20 flex items-start gap-3 hover:border-apres/40 transition-all"
          >
            <div className="p-2 rounded-lg bg-midnight border border-apres/30 shrink-0 mt-0.5">
              {getActivityIcon(item.type)}
            </div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-arctic tracking-tight">{item.title}</h3>
                <span className="text-[10px] font-mono text-apres shrink-0">{item.timestamp}</span>
              </div>
              <p className="text-[11px] text-slopes font-mono">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ActivityFeed;
