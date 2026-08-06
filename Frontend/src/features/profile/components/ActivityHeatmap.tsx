import React from 'react';
import Card from '../../../components/ui/Card';
import { Calendar } from 'lucide-react';

export interface ActivityHeatmapProps {
  activityData?: number[]; // array of 84 daily activity counts (12 weeks x 7 days)
}

// Generate realistic synthetic contribution data if none passed
const GENERATE_HEATMAP_DATA = (): number[] => {
  const data: number[] = [];
  for (let i = 0; i < 84; i++) {
    const r = Math.random();
    if (r > 0.65) data.push(Math.floor(Math.random() * 5) + 1);
    else if (r > 0.4) data.push(1);
    else data.push(0);
  }
  return data;
};

export const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({
  activityData = GENERATE_HEATMAP_DATA(),
}) => {
  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-mountainside/50 border-apres/10';
    if (count === 1) return 'bg-emerald-950/60 border-emerald-800/40';
    if (count === 2) return 'bg-emerald-800/70 border-emerald-600/50';
    if (count === 3) return 'bg-emerald-600/80 border-emerald-500/60';
    return 'bg-emerald-400 border-emerald-300';
  };

  const totalContributions = activityData.reduce((a, b) => a + b, 0);

  const daysOfWeek = ['Mon', 'Wed', 'Fri'];

  return (
    <Card className="p-6 bg-midnight/90 border border-mountainside rounded-2xl shadow-hard space-y-4">
      <div className="flex items-center justify-between border-b border-mountainside pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-arctic tracking-tight">
            Learning Activity Heatmap
          </h2>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/30">
          {totalContributions} Contributions in 12 Weeks
        </span>
      </div>

      {/* Heatmap Grid Layout (7 rows x 12 columns) */}
      <div className="overflow-x-auto scrollbar-hide py-1">
        <div className="flex items-start gap-2 min-w-[500px]">
          {/* Day Labels */}
          <div className="grid grid-rows-7 gap-1.5 text-[10px] font-mono text-apres pr-2 py-0.5">
            <span>Mon</span>
            <span className="opacity-0">Tue</span>
            <span>Wed</span>
            <span className="opacity-0">Thu</span>
            <span>Fri</span>
            <span className="opacity-0">Sat</span>
            <span className="opacity-0">Sun</span>
          </div>

          {/* 12 Weeks Columns */}
          <div className="grid grid-cols-12 gap-1.5 flex-1">
            {Array.from({ length: 12 }).map((_, weekIdx) => (
              <div key={weekIdx} className="grid grid-rows-7 gap-1.5">
                {Array.from({ length: 7 }).map((_, dayIdx) => {
                  const dataIdx = weekIdx * 7 + dayIdx;
                  const count = activityData[dataIdx] || 0;
                  return (
                    <div
                      key={dayIdx}
                      className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 hover:scale-125 hover:z-10 cursor-pointer ${getCellColor(
                        count
                      )}`}
                      title={`Day ${dataIdx + 1}: ${count} activity events`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between text-[11px] font-mono text-apres pt-2 border-t border-mountainside">
        <span>Less active</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-mountainside/50 border border-apres/10" />
          <div className="w-3 h-3 rounded-sm bg-emerald-950/60 border border-emerald-800/40" />
          <div className="w-3 h-3 rounded-sm bg-emerald-800/70 border border-emerald-600/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600/80 border border-emerald-500/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300" />
        </div>
        <span>More active</span>
      </div>
    </Card>
  );
};

export default ActivityHeatmap;
