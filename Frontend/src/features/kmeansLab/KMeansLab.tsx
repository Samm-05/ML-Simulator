import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  togglePlayPause,
  stepForward,
  stepBackward,
  resetPlayback,
} from './kmeansSlice';
import { LeftPanel } from './components/LeftPanel';
import { Center3DScene } from './components/Center3DScene';
import { RightPanel } from './components/RightPanel';
import { TimelineControls } from './components/TimelineControls';
import { GuidedStepsPanel } from './components/GuidedStepsPanel';
import { LiveGraphsPanel } from './components/LiveGraphsPanel';
import { MathFormulaPanel } from './components/MathFormulaPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { Network } from 'lucide-react';

const KMeansLab: React.FC = () => {
  const dispatch = useAppDispatch();

  // Global Keyboard Shortcuts (Space: Play/Pause, Arrows: Step, R: Reset)
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
            <div className="p-2 rounded-xl bg-mountainside border border-apres/40 text-indigo-400">
              <Network className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-arctic tracking-tight">
              K-Means Clustering Laboratory
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Interactive Unsupervised Learning
            </span>
          </div>
          <p className="text-xs md:text-sm text-slopes">
            Learn how K-Means groups unlabeled data into meaningful clusters by minimizing centroid distances through iterative optimization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-apres font-mono hidden lg:block text-right">
            <div>Shortcuts: [Space] Play/Pause</div>
            <div>[Left/Right] Step | [R] Reset</div>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Panel | Center 3D/2D Canvas Viewport | Right Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Panel */}
        <div className="xl:col-span-3">
          <LeftPanel />
        </div>

        {/* Center Interactive Canvas Viewport */}
        <div className="xl:col-span-6 space-y-4">
          <Center3DScene />
        </div>

        {/* Right Panel */}
        <div className="xl:col-span-3">
          <RightPanel />
        </div>
      </div>

      {/* Interactive Step-by-Step Guided Walkthrough */}
      <GuidedStepsPanel />

      {/* Bottom Timeline Controls */}
      <TimelineControls />

      {/* Synchronized Real-Time Graphs */}
      <LiveGraphsPanel />

      {/* Mathematical Foundations Panel */}
      <MathFormulaPanel />

      {/* Concept Narrative Explanation */}
      <ExplanationPanel />
    </div>
  );
};

export default KMeansLab;
