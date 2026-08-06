import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import Card from '../../../components/ui/Card';
import { Target } from 'lucide-react';

export interface SkillItem {
  subject: string;
  score: number; // 0 to 100
  fullMark: number;
}

export interface SkillRadarChartProps {
  data?: SkillItem[];
}

const DEFAULT_SKILL_DATA: SkillItem[] = [
  { subject: 'Regression', score: 88, fullMark: 100 },
  { subject: 'Classification', score: 75, fullMark: 100 },
  { subject: 'Optimization', score: 92, fullMark: 100 },
  { subject: 'Neural Networks', score: 80, fullMark: 100 },
  { subject: 'Model Evaluation', score: 85, fullMark: 100 },
];

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({ data = DEFAULT_SKILL_DATA }) => {
  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-4">
      <div className="flex items-center justify-between border-b border-mountainside pb-3">
        <div className="flex items-center gap-2 text-sm font-bold text-arctic">
          <Target className="w-4 h-4 text-cyan-400" />
          <span>ML Skill Proficiency Radar</span>
        </div>
        <span className="text-xs font-mono text-apres">5 Core Domains</span>
      </div>

      <div className="w-full h-64 font-mono text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#2c3242" />
            <PolarAngleAxis dataKey="subject" stroke="#a0aec0" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
            <Radar
              name="Skill Score"
              dataKey="score"
              stroke="#38bdf8"
              fill="#0284c7"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-mountainside text-[11px] font-mono text-apres">
        {data.map((item) => (
          <div key={item.subject} className="flex items-center justify-between p-1.5 rounded-lg bg-mountainside/30">
            <span>{item.subject}</span>
            <span className="font-bold text-cyan-300">{item.score}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SkillRadarChart;
