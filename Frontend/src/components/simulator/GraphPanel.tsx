import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SimulationStep } from '../../algorithms/types';

interface GraphPanelProps {
  steps: SimulationStep[];
  currentIndex: number;
  primaryKey: string;
  secondaryKey: string;
  primaryLabel: string;
  secondaryLabel: string;
}

const GraphPanel: React.FC<GraphPanelProps> = ({
  steps,
  currentIndex,
  primaryKey,
  secondaryKey,
  primaryLabel,
  secondaryLabel,
}) => {
  const history = steps.slice(0, currentIndex + 1).map((step, idx) => ({
    step: idx + 1,
    [primaryKey]: step.metrics[primaryKey] ?? 0,
    [secondaryKey]: step.metrics[secondaryKey] ?? 0,
  }));

  return (
    <section className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-5">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-3">Graph Output</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
            <XAxis dataKey="step" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={primaryKey} name={primaryLabel} stroke="#6366f1" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey={secondaryKey} name={secondaryLabel} stroke="#14b8a6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default GraphPanel;
