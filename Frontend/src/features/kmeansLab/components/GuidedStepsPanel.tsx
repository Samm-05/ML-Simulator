import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  stepForward,
  resetPlayback,
  setInitializationMethod,
  togglePlayPause,
} from '../kmeansSlice';
import Card from '../../../components/ui/Card';
import {
  Sparkles,
  Target,
  RefreshCw,
  CheckCircle2,
  Play,
  ArrowRight,
  HelpCircle,
  BarChart2,
  Info,
} from 'lucide-react';

export const GuidedStepsPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const kmeans = useAppSelector((state) => state.kmeans);

  const steps = [
    {
      number: 1,
      title: '1. Centroid Initialization (KMeans++)',
      phase: 'Initialization Phase',
      description:
        'K-Means begins by placing K initial centroid points in 2D/3D space. KMeans++ places initial centroids far apart from each other based on squared distance probabilities.',
      actionText: 'Re-Initialize Centroids',
      action: () => dispatch(resetPlayback()),
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      number: 2,
      title: '2. Cluster Assignment (E-Step)',
      phase: 'Expectation Step',
      description:
        'Every data point measures Euclidean distance d(p, C_k) to all centroids and joins the cluster of its nearest centroid. Data points take on the centroid color.',
      actionText: 'Execute Assignment (E-Step)',
      action: () => dispatch(stepForward()),
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
    {
      number: 3,
      title: '3. Centroid Means Recalculation (M-Step)',
      phase: 'Maximization Step',
      description:
        'Centroids calculate the average center of mass (x_mean, y_mean) of all their assigned points and shift to that new coordinate position.',
      actionText: 'Update Centroid Means (M-Step)',
      action: () => dispatch(stepForward()),
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      number: 4,
      title: '4. Convergence & WCSS Minimization',
      phase: 'Stability & Termination',
      description:
        'The process repeats until centroid position changes drop below tolerance (ΔC < 0.001). The Within-Cluster Sum of Squares (WCSS / Inertia) reaches a local minimum.',
      actionText: kmeans.isConverged ? 'Restart Simulation' : 'Run to Convergence',
      action: () => dispatch(togglePlayPause()),
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
  ];

  return (
    <Card className="p-6 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-mountainside pb-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Step-by-Step Educational Guided Walkthrough</span>
          </div>
          <p className="text-xs text-slopes mt-0.5">
            Follow the 4 core phases of the K-Means Optimization Algorithm
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-mountainside text-arctic border border-apres/40">
            {kmeans.isConverged ? '✓ Converged State' : `Iteration ${kmeans.currentStep} of ${kmeans.maxIterations}`}
          </span>
        </div>
      </div>

      {/* 4 Interactive Guided Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {steps.map((step) => {
          const isActive =
            (step.number === 1 && kmeans.currentStep === 0) ||
            (step.number === 2 && kmeans.currentStep > 0 && !kmeans.isConverged && kmeans.currentStep % 2 === 1) ||
            (step.number === 3 && kmeans.currentStep > 0 && !kmeans.isConverged && kmeans.currentStep % 2 === 0) ||
            (step.number === 4 && kmeans.isConverged);

          return (
            <div
              key={step.number}
              className={`
                p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 select-none
                ${
                  isActive
                    ? 'bg-mountainside/80 border-indigo-500 ring-2 ring-indigo-500/30 shadow-medium'
                    : 'bg-mountainside/30 border-mountainside hover:bg-mountainside/50'
                }
              `}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${step.badgeColor}`}>
                    {step.phase}
                  </span>
                  {isActive && (
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>

                <h4 className="text-xs font-bold text-arctic tracking-tight">{step.title}</h4>
                <p className="text-[11px] text-slopes leading-relaxed">{step.description}</p>
              </div>

              <button
                type="button"
                onClick={step.action}
                className="w-full py-2 px-3 rounded-xl bg-midnight/80 hover:bg-mountainside border border-apres/30 text-xs font-bold text-arctic hover:text-cyan-400 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-soft"
              >
                <span>{step.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default GuidedStepsPanel;
