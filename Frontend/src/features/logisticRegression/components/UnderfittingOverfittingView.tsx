import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setDatasetType, updateConfig } from '../logisticRegressionSlice';
import Center3DScene from './Center3DScene';
import TimelineControls from './TimelineControls';
import { Layers, Activity, Target, ShieldCheck } from 'lucide-react';

export const UnderfittingOverfittingView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasetType, config, trajectory, currentEpoch } = useAppSelector(
    (state) => state.logisticRegression
  );

  const metrics = trajectory[currentEpoch] || { loss: 0, accuracy: 0 };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Top Banner Header */}
      <div className="p-4 bg-midnight/90 rounded-2xl border border-apres/30 space-y-2 shadow-hard">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-arctic tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Underfitting vs Good Fit vs Overfitting Explorer
          </h3>
          <span className="text-xs font-mono text-cyan-400">Interactive Model Capacity Lab</span>
        </div>
        <p className="text-xs text-slopes">
          Experiment with dataset complexity, polynomial feature expansion, and regularization (L1/L2) to see how capacity affects classification boundaries.
        </p>
      </div>

      {/* Preset Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Preset 1: Underfitting */}
        <button
          onClick={() => {
            dispatch(setDatasetType('circular'));
            dispatch(updateConfig({ featureType: 'linear', regularization: 'none' }));
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 cursor-pointer ${
            datasetType === 'circular' && config.featureType === 'linear'
              ? 'bg-amber-950/50 border-amber-500 text-amber-300 shadow-lg shadow-amber-500/10'
              : 'bg-midnight/90 border-apres/30 text-slopes hover:text-arctic'
          }`}
        >
          <div className="font-bold text-amber-400 flex items-center gap-1.5">
            1. Underfitting Case (High Bias)
          </div>
          <p className="text-[11px] text-apres leading-relaxed">
            Linear model attempting to separate concentric circular data. Boundary cannot curve!
          </p>
        </button>

        {/* Preset 2: Good Fit */}
        <button
          onClick={() => {
            dispatch(setDatasetType('circular'));
            dispatch(updateConfig({ featureType: 'polynomial', regularization: 'l2', regLambda: 0.01 }));
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 cursor-pointer ${
            datasetType === 'circular' && config.featureType === 'polynomial' && config.regularization === 'l2'
              ? 'bg-emerald-950/50 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10'
              : 'bg-midnight/90 border-apres/30 text-slopes hover:text-arctic'
          }`}
        >
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            2. Good Fit (Balanced)
          </div>
          <p className="text-[11px] text-apres leading-relaxed">
            Polynomial terms + mild L2 Regularization create a smooth circular decision boundary.
          </p>
        </button>

        {/* Preset 3: Overfitting Noise */}
        <button
          onClick={() => {
            dispatch(setDatasetType('highly_overlapping'));
            dispatch(updateConfig({ featureType: 'polynomial', regularization: 'none' }));
          }}
          className={`p-3.5 rounded-2xl border text-left transition-all space-y-1 cursor-pointer ${
            datasetType === 'highly_overlapping' && config.featureType === 'polynomial' && config.regularization === 'none'
              ? 'bg-red-950/50 border-red-500 text-red-300 shadow-lg shadow-red-500/10'
              : 'bg-midnight/90 border-apres/30 text-slopes hover:text-arctic'
          }`}
        >
          <div className="font-bold text-red-400 flex items-center gap-1.5">
            3. Overfitting Case (High Variance)
          </div>
          <p className="text-[11px] text-apres leading-relaxed">
            High degree polynomial on noisy overlapping data without regularization. Boundary warps around noise!
          </p>
        </button>
      </div>

      {/* Live Model Metrics Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3 bg-midnight/90 border border-apres/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-apres flex items-center gap-1">
            <Activity className="w-3 h-3 text-amber-400" /> Log Loss
          </span>
          <p className="text-lg font-bold text-amber-400">{metrics.loss.toFixed(4)}</p>
        </div>

        <div className="p-3 bg-midnight/90 border border-apres/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-apres flex items-center gap-1">
            <Target className="w-3 h-3 text-emerald-400" /> Accuracy
          </span>
          <p className="text-lg font-bold text-emerald-400">{(metrics.accuracy * 100).toFixed(1)}%</p>
        </div>

        <div className="p-3 bg-midnight/90 border border-apres/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-apres">Feature Mapping</span>
          <p className="text-lg font-bold text-cyan-400 capitalize">{config.featureType}</p>
        </div>

        <div className="p-3 bg-midnight/90 border border-apres/30 rounded-xl space-y-0.5">
          <span className="text-[10px] text-apres flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-400" /> Regularization
          </span>
          <p className="text-lg font-bold text-purple-400 uppercase">{config.regularization}</p>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="flex-1 min-h-[460px] relative">
        <Center3DScene />
      </div>

      {/* Playback Animation Timeline Controls */}
      <TimelineControls />
    </div>
  );
};

export default UnderfittingOverfittingView;
