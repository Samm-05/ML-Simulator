import React from 'react';
import { SimulationStep } from '../../algorithms/types';

interface ExplanationPanelProps {
  step?: SimulationStep;
  totalSteps: number;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ step, totalSteps }) => {
  return (
    <section className="rounded-2xl border border-mountainside bg-secondary-900/90 backdrop-blur-xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold text-arctic tracking-tight">Step Explanation</h3>
        {step && (
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-mountainside text-arctic border border-apres/40">
            Step {step.stepIndex + 1} of {totalSteps}
          </span>
        )}
      </div>
      {step ? (
        <div className="space-y-3">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-slopes font-semibold">{step.phase}</p>
            <h4 className="text-xl font-bold text-arctic mt-0.5">{step.title}</h4>
          </div>
          <p className="text-sm text-slopes leading-relaxed">{step.explanation}</p>
        </div>
      ) : (
        <p className="text-sm text-apres">Launch or step through the simulation to view computational phase notes.</p>
      )}
    </section>
  );
};

export default ExplanationPanel;
