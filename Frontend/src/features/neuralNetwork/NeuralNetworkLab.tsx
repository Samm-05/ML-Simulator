import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setViewMode,
  setIsPlaying,
  setCurrentEpoch,
  resetSimulation,
  updateConfig,
} from './neuralNetworkSlice';
import { ViewMode } from './types';
import LeftPanel from './components/LeftPanel';
import Center3DScene from './components/Center3DScene';
import RightPanel from './components/RightPanel';
import BottomPanel from './components/BottomPanel';
import ComparisonView from './components/ComparisonView';
import GradientFlowInspector from './components/GradientFlowInspector';
import QuizPanel from './components/QuizPanel';
import PageContainer from '../../components/layout/PageContainer';
import RecentExperimentsPanel from '../../components/experiments/RecentExperimentsPanel';
import { experimentService, SavedExperiment } from '../../services/experimentService';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import {
  Brain,
  ArrowLeft,
  Sliders,
  Eye,
  Activity,
  HelpCircle,
  Save,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NeuralNetworkLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { viewMode, isPlaying, currentEpoch, trajectory, config, layerSizes } = useAppSelector(
    (state) => state.neuralNetwork
  );
  const [saving, setSaving] = useState(false);

  const maxEpoch = trajectory.length > 0 ? trajectory.length - 1 : 0;
  const currentSnapshot = trajectory[currentEpoch] || trajectory[0] || {};

  const handleSaveExperiment = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving Neural Network experiment...');
    try {
      await experimentService.saveExperiment({
        algorithm: 'neural-network',
        title: `Neural Network (α=${config.learningRate}, Layers=${layerSizes.join('-')})`,
        parameters: { ...config, layerSizes },
        metrics: {
          loss: currentSnapshot.loss || 0,
          accuracy: currentSnapshot.accuracy || 0,
          gradientNorm: currentSnapshot.gradientNorm || 0,
          currentEpoch,
        },
      });
      toast.success('Neural Network experiment saved to MongoDB! +50 XP', { id: toastId });
    } catch (err) {
      toast.error('Failed to save experiment', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleLoadExperiment = (exp: SavedExperiment) => {
    if (exp.parameters) {
      dispatch(updateConfig(exp.parameters));
    }
  };

  // Global Keyboard Shortcuts (Space: Play/Pause, Left/Right: Step, R: Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch(setIsPlaying(!isPlaying));
      } else if (e.code === 'ArrowRight') {
        dispatch(setCurrentEpoch(Math.min(currentEpoch + 1, maxEpoch)));
      } else if (e.code === 'ArrowLeft') {
        dispatch(setCurrentEpoch(Math.max(currentEpoch - 1, 0)));
      } else if (e.code === 'KeyR') {
        dispatch(resetSimulation());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentEpoch, maxEpoch, dispatch]);

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-4 px-4 space-y-4 font-sans select-none">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-midnight/90 backdrop-blur-md rounded-3xl border border-apres/30 shadow-2xl">
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
              <Brain className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg font-bold text-arctic tracking-tight">
                Neural Network Playground
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                Flagship Feature
              </span>
            </div>
            <p className="text-xs text-apres font-mono">
              Deep Multi-Layer Perceptron (MLP) Forward & Backpropagation Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            onClick={handleSaveExperiment}
            isLoading={saving}
            className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
            icon={<Save className="w-4 h-4" />}
          >
            Save Experiment
          </Button>

          {/* View Mode Navigation Bar */}
          <div className="flex items-center p-1 bg-mountainside/40 rounded-2xl border border-apres/30 overflow-x-auto scrollbar-hide">
            {(
              [
                ['playground', 'Playground', Sliders],
                ['comparison', 'Model Compare', Eye],
                ['gradient_flow', 'Gradient Flow', Activity],
                ['quiz', 'Quiz', HelpCircle],
              ] as [ViewMode, string, React.ElementType][]
            ).map(([mode, label, Icon]) => (
              <button
                key={mode}
                onClick={() => dispatch(setViewMode(mode))}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                  viewMode === mode
                    ? 'bg-arctic text-midnight font-bold shadow-md'
                    : 'text-slopes hover:text-arctic'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="w-full space-y-4">
        {viewMode === 'playground' && (
          <div className="space-y-4">
            {/* 3-Panel Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[580px]">
              {/* Left Panel */}
              <div className="lg:col-span-3 h-full">
                <LeftPanel />
              </div>

              {/* Center Panel (3D Canvas) */}
              <div className="lg:col-span-6 h-full">
                <Center3DScene />
              </div>

              {/* Right Panel */}
              <div className="lg:col-span-3 h-full">
                <RightPanel />
              </div>
            </div>

            {/* Bottom Controls & Analytics */}
            <BottomPanel />

            {/* Algorithm Specific Experiments History */}
            <RecentExperimentsPanel algorithm="neural-network" onLoadExperiment={handleLoadExperiment} />
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="w-full py-2">
            <ComparisonView />
          </div>
        )}

        {viewMode === 'gradient_flow' && (
          <div className="w-full py-2">
            <GradientFlowInspector />
          </div>
        )}

        {viewMode === 'quiz' && (
          <div className="w-full py-4">
            <QuizPanel />
          </div>
        )}
      </main>
    </PageContainer>
  );
};

export default NeuralNetworkLab;
