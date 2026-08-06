import React, { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setConfig, setPresetRegime } from '../overfittingSlice';
import Card from '../../../components/ui/Card';
import { BookOpen, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface GuidedStep {
  id: number;
  title: string;
  category: string;
  degree: number;
  lambda: number;
  explanation: string;
  actionHint: string;
}

const STEPS: GuidedStep[] = [
  {
    id: 1,
    title: 'Step 1: Underfitting (High Bias)',
    category: 'Low Capacity',
    degree: 1,
    lambda: 0.0,
    explanation: 'A straight line (degree d=1) cannot bend to capture the curved trend in the data points. Both training loss and validation loss remain high!',
    actionHint: 'Notice how the line misses points at both ends of the plot.',
  },
  {
    id: 2,
    title: 'Step 2: Increasing Polynomial Degree',
    category: 'Moderate Capacity',
    degree: 3,
    lambda: 0.0,
    explanation: 'Increasing degree to d=3 allows the curve to flex naturally, significantly dropping both training and validation loss.',
    actionHint: 'Observe how the prediction curve matches the true function shape.',
  },
  {
    id: 3,
    title: 'Step 3: Severe Overfitting (High Variance)',
    category: 'Excessive Capacity',
    degree: 10,
    lambda: 0.0,
    explanation: 'With degree d=10 and zero regularization, the polynomial line bends wildly to pass through every noise point. Training loss drops to 0, but Validation Loss explodes!',
    actionHint: 'Look at the wild spikes in the curve and the red spike in 3D surface elevation.',
  },
  {
    id: 4,
    title: 'Step 4: Adding L2 Regularization (Ridge)',
    category: 'Regularization',
    degree: 10,
    lambda: 0.02,
    explanation: 'Adding L2 Regularization penalty λ=0.02 constrains huge polynomial weights, smoothing out wild oscillations even with high degree d=10!',
    actionHint: 'Notice how the wild spikes flatten out into a smooth curve.',
  },
  {
    id: 5,
    title: 'Step 5: Finding the Optimal Balance (Sweet Spot)',
    category: 'Optimal Model',
    degree: 4,
    lambda: 0.01,
    explanation: 'Combining moderate degree d=4 with mild L2 regularization λ=0.01 yields minimum validation loss and maximum test generalization!',
    actionHint: 'Check the minimum point on the 3D surface and Bias-Variance curve.',
  },
];

export const GuidedStepsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeStepId, setActiveStepId] = useState(1);

  const currentStep = STEPS.find((s) => s.id === activeStepId) || STEPS[0];

  const applyStep = (step: GuidedStep) => {
    setActiveStepId(step.id);
    dispatch(setConfig({ degree: step.degree, lambda: step.lambda }));
  };

  return (
    <Card className="p-4 bg-midnight/90 border border-cyan-500/40 rounded-2xl shadow-hard space-y-3 font-sans">
      {/* Step Navigation Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2.5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-bold">
            Step {currentStep.id} of {STEPS.length}
          </span>
          <span className="text-apres font-semibold">• {currentStep.category}</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono">
          <button
            disabled={activeStepId <= 1}
            onClick={() => applyStep(STEPS[activeStepId - 2])}
            className="p-1.5 rounded-xl bg-mountainside text-slopes hover:text-arctic disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={activeStepId >= STEPS.length}
            onClick={() => applyStep(STEPS[activeStepId])}
            className="p-1.5 rounded-xl bg-arctic text-midnight hover:bg-slopes transition-all cursor-pointer disabled:cursor-not-allowed"
            title="Next Step"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-2">
        <h3 className="text-base font-bold text-arctic tracking-tight">
          {currentStep.title}
        </h3>

        <div className="p-3 bg-gradient-to-r from-cyan-950/40 via-midnight to-mountainside border border-cyan-500/30 rounded-xl text-xs space-y-1 text-cyan-200">
          <div className="flex items-center gap-1.5 font-mono font-bold text-cyan-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            💡 User Explainable Concept:
          </div>
          <p className="leading-relaxed">{currentStep.explanation}</p>
        </div>

        <div className="p-2.5 bg-mountainside/40 border border-apres/30 rounded-xl text-xs font-mono text-slopes">
          <strong className="text-arctic">Action Hint:</strong> {currentStep.actionHint}
        </div>
      </div>
    </Card>
  );
};

export default GuidedStepsPanel;
