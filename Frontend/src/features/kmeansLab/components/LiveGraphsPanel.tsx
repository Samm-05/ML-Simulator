import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { CLUSTER_COLORS } from '../kmeansSlice';
import { TrendingDown, Activity, BarChart2 } from 'lucide-react';

export const LiveGraphsPanel: React.FC = () => {
  const kmeans = useAppSelector((state) => state.kmeans);

  // WCSS & Movement History Data
  const wcssData = kmeans.iterationsHistory.map((h) => ({
    iteration: `Iter ${h.iteration}`,
    wcss: Number(h.wcss.toFixed(2)),
    movement: Number(h.movementDist.toFixed(3)),
  }));

  // Cluster Size Data
  const clusterCounts: { [key: number]: number } = {};
  for (let i = 0; i < kmeans.k; i++) clusterCounts[i] = 0;
  kmeans.dataPoints.forEach((p) => {
    if (p.cluster >= 0) clusterCounts[p.cluster] = (clusterCounts[p.cluster] || 0) + 1;
  });

  const barData = Object.keys(clusterCounts).map((key) => {
    const cId = Number(key);
    return {
      name: `Cluster ${cId + 1}`,
      count: clusterCounts[cId] || 0,
      fill: CLUSTER_COLORS[cId % CLUSTER_COLORS.length],
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: WCSS (Inertia) Curve */}
      <Card className="p-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard space-y-3">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
          <TrendingDown className="w-4 h-4" />
          <span>WCSS Minimization (Elbow Curve)</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wcssData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
              <XAxis dataKey="iteration" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#818cf8', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="wcss" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Chart 2: Centroid Movement Distance */}
      <Card className="p-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard space-y-3">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Centroid Movement Distance</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={wcssData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
              <XAxis dataKey="iteration" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#22d3ee', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="movement" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Chart 3: Cluster Size Distribution */}
      <Card className="p-4 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard space-y-3">
        <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <BarChart2 className="w-4 h-4" />
          <span>Cluster Size Distribution</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2638" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#34d399', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default LiveGraphsPanel;
