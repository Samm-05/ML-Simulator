import React from 'react';
import { SimulationStep } from '../../algorithms/types';

interface ExplanationPanelProps {
  step?: SimulationStep;
  totalSteps: number;
}

const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ step, totalSteps }) => {
  return (
    <section className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-5">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-2">Explanation Panel</h3>
      {step ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-primary-600 font-semibold">{step.phase}</p>
            <h4 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">{step.title}</h4>
          </div>
          <p className="text-secondary-600 dark:text-secondary-300">{step.explanation}</p>
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Step {step.stepIndex + 1} of {totalSteps}
          </p>
        </div>
      ) : (
        <p className="text-secondary-500 dark:text-secondary-400">Run the simulation to see guided explanations.</p>
      )}
    </section>
  );
};

export default ExplanationPanel;
