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
    <section className="rounded-2xl border border-mountainside bg-secondary-900/90 backdrop-blur-xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-arctic tracking-tight">Convergence Analytics</h3>
        <span className="text-[10px] font-mono text-apres uppercase tracking-widest">
          Loss & Metric History
        </span>
      </div>
      <div className="h-64 p-2 rounded-xl bg-midnight border border-mountainside/60">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262E36" />
            <XAxis dataKey="step" stroke="#6C6D74" fontSize={11} fontFamily="JetBrains Mono" />
            <YAxis stroke="#6C6D74" fontSize={11} fontFamily="JetBrains Mono" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141A21',
                borderColor: '#262E36',
                borderRadius: '0.75rem',
                color: '#D3D1CE',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#B3B7BA' }} />
            <Line type="monotone" dataKey={primaryKey} name={primaryLabel} stroke="#B3B7BA" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey={secondaryKey} name={secondaryLabel} stroke="#D3D1CE" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default GraphPanel;
