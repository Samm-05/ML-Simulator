import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { togglePlayPause, stepForward, stepBackward, resetPlayback, setParams } from './linearRegressionSlice';
import { LeftPanel } from './components/LeftPanel';
import { Center3DScene } from './components/Center3DScene';
import { ComparisonView } from './components/ComparisonView';
import { RightPanel } from './components/RightPanel';
import { TimelineControls } from './components/TimelineControls';
import { LiveGraphsPanel } from './components/LiveGraphsPanel';
import { MathFormulaPanel } from './components/MathFormulaPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ScrollStorytelling } from './components/ScrollStorytelling';
import RecentExperimentsPanel from '../../components/experiments/RecentExperimentsPanel';
import { experimentService, SavedExperiment } from '../../services/experimentService';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { Brain, Save } from 'lucide-react';

const LinearRegressionLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const lrState = useAppSelector((state) => state.linearRegression);
  const comparisonMode = lrState?.comparisonMode ?? false;
  const params = lrState?.params;
  const steps = lrState?.steps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;
  const [saving, setSaving] = useState(false);

  const currentStep = steps[currentStepIndex] || steps[0] || {
    w: 0,
    b: 0,
    mseLoss: 0,
    gradW: 0,
    gradB: 0,
  };

  // Save Experiment Handler
  const handleSaveExperiment = async () => {
    if (!params) return;
    setSaving(true);
    const toastId = toast.loading('Saving Linear Regression experiment...');
    try {
      await experimentService.saveExperiment({
        algorithm: 'linear-regression',
        title: `Linear Regression (α=${params.learningRate}, Epochs=${params.epochs})`,
        parameters: {
          learningRate: params.learningRate,
          epochs: params.epochs,
          datasetSize: params.datasetSize,
          noise: params.noise,
          regularization: params.regularization,
          wInitial: params.wInitial,
          bInitial: params.bInitial,
        },
        metrics: {
          loss: currentStep.mseLoss,
          finalWeight: currentStep.w,
          finalBias: currentStep.b,
          totalSteps: steps.length,
          accuracy: Math.max(0.6, 1 - currentStep.mseLoss),
        },
      });
      toast.success('Linear Regression experiment saved to MongoDB! +50 XP', { id: toastId });
    } catch (err: any) {
      toast.error('Failed to save experiment', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Restore Experiment Handler
  const handleLoadExperiment = (exp: SavedExperiment) => {
    if (exp.parameters) {
      dispatch(setParams(exp.parameters));
    }
  };

  // Keyboard Shortcuts (Space: Play/Pause, Left/Right: Step, R: Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch(togglePlayPause());
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        dispatch(stepForward());
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        dispatch(stepBackward());
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        dispatch(resetPlayback());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mountainside pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-mountainside border border-apres/40 text-amber-400">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-arctic tracking-tight">
              Linear Regression Laboratory
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              3D Interactive Lab
            </span>
          </div>
          <p className="text-xs md:text-sm text-slopes">
            Experience how linear models fit data points in real time. Rotate slope $w$, shift bias $b$, and watch residual error lines shrink down to the line of best fit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleSaveExperiment}
            isLoading={saving}
            className="bg-amber-500 hover:bg-amber-400 text-midnight font-bold text-xs"
            icon={<Save className="w-4 h-4" />}
          >
            Save Experiment
          </Button>

          <div className="text-xs text-apres font-mono hidden lg:block text-right">
            <div>Shortcuts: [Space] Play/Pause</div>
            <div>[Left/Right] Step | [R] Reset</div>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Panel | Center | Right Panel & Recent Experiments */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Panel */}
        <div className="xl:col-span-3">
          <LeftPanel />
        </div>

        {/* Center Interactive 3D Canvas / Dual Comparison View */}
        <div className="xl:col-span-6 space-y-4">
          {comparisonMode ? <ComparisonView /> : <Center3DScene />}
        </div>

        {/* Right Panel & Algorithm Experiments History */}
        <div className="xl:col-span-3 space-y-6">
          <RightPanel />
          <RecentExperimentsPanel algorithm="linear-regression" onLoadExperiment={handleLoadExperiment} />
        </div>
      </div>

      {/* Bottom Timeline Controls */}
      <TimelineControls />

      {/* Synchronized Graphs Panel */}
      <LiveGraphsPanel />

      {/* KaTeX Mathematical Panel */}
      <MathFormulaPanel />

      {/* Educational Narrative Explanation Panel */}
      <ExplanationPanel />

      {/* Scroll Storytelling Deep Dive */}
      <ScrollStorytelling />
    </div>
  );
};

export default LinearRegressionLab;
