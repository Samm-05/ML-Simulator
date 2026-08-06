import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Card from '../../../components/ui/Card';
import { TrendingUp } from 'lucide-react';

export interface XPDataPoint {
  day: string;
  xp: number;
}

export interface XPLineChartProps {
  data?: XPDataPoint[];
}

const DEFAULT_XP_DATA: XPDataPoint[] = [
  { day: 'Day 1', xp: 100 },
  { day: 'Day 5', xp: 250 },
  { day: 'Day 10', xp: 450 },
  { day: 'Day 15', xp: 780 },
  { day: 'Day 20', xp: 1100 },
  { day: 'Day 25', xp: 1550 },
  { day: 'Day 30', xp: 2150 },
];

export const XPLineChart: React.FC<XPLineChartProps> = ({ data = DEFAULT_XP_DATA }) => {
  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-4">
      <div className="flex items-center justify-between border-b border-mountainside pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-arctic tracking-tight">
            XP Growth (Last 30 Days)
          </h2>
        </div>
        <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950/40 px-2.5 py-1 rounded-full border border-purple-500/30">
          +1,050 XP This Month
        </span>
      </div>

      <div className="w-full h-52 font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2c3242" />
            <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#6b21a8',
                borderRadius: '0.75rem',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="xp"
              stroke="#c084fc"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#xpGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default XPLineChart;
