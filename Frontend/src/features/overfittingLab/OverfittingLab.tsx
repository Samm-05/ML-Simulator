import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setConfig } from './overfittingSlice';
import PageContainer from '../../components/layout/PageContainer';
import Overfitting3DScene from './components/Overfitting3DScene';
import PredictionCurveCanvas from './components/PredictionCurveCanvas';
import TrainingValidationChart from './components/TrainingValidationChart';
import BiasVarianceChart from './components/BiasVarianceChart';
import ControlPanel from './components/ControlPanel';
import MathExplanationPanel from './components/MathExplanationPanel';
import GuidedStepsPanel from './components/GuidedStepsPanel';
import RecentExperimentsPanel from '../../components/experiments/RecentExperimentsPanel';
import { experimentService, SavedExperiment } from '../../services/experimentService';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { Brain, ArrowLeft, Save } from 'lucide-react';
import gsap from 'gsap';

export const OverfittingLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { result, config } = useAppSelector((state) => state.overfitting);
  const headerRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveExperiment = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving Overfitting Lab experiment...');
    try {
      await experimentService.saveExperiment({
        algorithm: 'overfitting',
        title: `Overfitting Lab (Degree=${config.degree}, λ=${config.lambdaReg})`,
        parameters: config,
        metrics: result,
      });
      toast.success('Overfitting Lab experiment saved to MongoDB! +50 XP', { id: toastId });
    } catch (err) {
      toast.error('Failed to save experiment', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleLoadExperiment = (exp: SavedExperiment) => {
    if (exp.parameters) {
      dispatch(setConfig(exp.parameters));
    }
  };

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.lab-reveal',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-4 px-4 space-y-4 font-sans select-none">
      {/* Header */}
      <header
        ref={headerRef}
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 bg-midnight/90 backdrop-blur-md rounded-3xl border border-apres/30 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-2xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-all cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg font-bold text-arctic tracking-tight">
                Overfitting vs Underfitting Laboratory
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40">
                Bias-Variance Studio
              </span>
            </div>
            <p className="text-xs text-apres font-mono">
              Visualizing Polynomial Complexity, Regularization, and Model Generalization
            </p>
          </div>
        </div>

        {/* Current Metrics Header Bar & Save Action */}
        <div className="lab-reveal flex items-center gap-3 font-mono text-xs">
          <Button
            variant="primary"
            onClick={handleSaveExperiment}
            isLoading={saving}
            className="bg-amber-500 hover:bg-amber-400 text-midnight font-bold text-xs"
            icon={<Save className="w-4 h-4" />}
          >
            Save Experiment
          </Button>

          <div className="px-3 py-1.5 rounded-2xl bg-mountainside/50 border border-apres/30 flex items-center gap-2">
            <span className="text-apres">Train Loss:</span>
            <span className="text-emerald-400 font-bold">{result.trainLoss.toFixed(4)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-mountainside/50 border border-apres/30 flex items-center gap-2">
            <span className="text-apres">Val Loss:</span>
            <span className="text-amber-400 font-bold">{result.valLoss.toFixed(4)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-mountainside/50 border border-apres/30 flex items-center gap-2">
            <span className="text-apres">Regime:</span>
            <span className={`font-bold uppercase ${
              result.regime === 'good_fit'
                ? 'text-emerald-400'
                : result.regime === 'underfitting'
                ? 'text-blue-400'
                : 'text-rose-400'
            }`}>
              {result.regime.replace('_', ' ')}
            </span>
          </div>
        </div>
      </header>

      {/* Guided Walkthrough Step-by-Step Panel */}
      <GuidedStepsPanel />

      {/* Main Body Layout */}
      <main className="w-full space-y-4">
        {/* Top 3D Viewport & Prediction Curve Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[480px]">
          {/* Left Column: 3D Surface */}
          <div className="lg:col-span-6 h-full min-h-[420px]">
            <Overfitting3DScene />
          </div>

          {/* Right Column: 2D Prediction Curve Plot */}
          <div className="lg:col-span-6 h-full">
            <PredictionCurveCanvas />
          </div>
        </div>

        {/* Middle Row: Control Panel & Math Formulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <ControlPanel />
          </div>
          <div className="lg:col-span-6">
            <MathExplanationPanel />
          </div>
        </div>

        {/* Bottom Row: Loss Trajectory & Bias-Variance Tradeoff Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <TrainingValidationChart />
          </div>
          <div className="lg:col-span-6">
            <BiasVarianceChart />
          </div>
        </div>

        {/* Algorithm Specific Experiments History */}
        <RecentExperimentsPanel algorithm="overfitting" onLoadExperiment={handleLoadExperiment} />
      </main>
    </PageContainer>
  );
};

export default OverfittingLab;
