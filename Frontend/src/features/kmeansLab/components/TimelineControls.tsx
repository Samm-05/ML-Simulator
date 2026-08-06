import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  togglePlayPause,
  stepForward,
  stepBackward,
  resetPlayback,
  setAnimationSpeed,
} from '../kmeansSlice';
import Card from '../../../components/ui/Card';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

export const TimelineControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const kmeans = useAppSelector((state) => state.kmeans);

  // Auto-play interval effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (kmeans.isPlaying && !kmeans.isConverged) {
      const intervalMs = Math.max(100, 1000 / kmeans.animationSpeed);
      timer = setInterval(() => {
        dispatch(stepForward());
      }, intervalMs);
    }
    return () => clearInterval(timer);
  }, [kmeans.isPlaying, kmeans.isConverged, kmeans.animationSpeed, dispatch]);

  const currentSnapshot =
    kmeans.iterationsHistory[kmeans.iterationsHistory.length - 1] || kmeans.iterationsHistory[0];

  return (
    <Card className="p-4 space-y-3 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard">
      {/* Educational Dynamic Explanation Banner */}
      <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start space-x-3 text-xs">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-indigo-300">
            Step {kmeans.currentStep}: Optimization Narrative
          </p>
          <p className="text-slopes leading-relaxed">
            {currentSnapshot?.explanation || 'Click Play or Step Forward to run K-Means iteration.'}
          </p>
        </div>
      </div>

      {/* Playback Controls Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Left Side: Step Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => dispatch(resetPlayback())}
            title="Reset Playback [R]"
            className="p-2.5 rounded-xl border border-mountainside bg-mountainside/40 text-slopes hover:text-arctic hover:bg-mountainside transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(stepBackward())}
            disabled={kmeans.currentStep <= 0}
            title="Step Back [Left Arrow]"
            className="p-2.5 rounded-xl border border-mountainside bg-mountainside/40 text-slopes hover:text-arctic hover:bg-mountainside transition-all disabled:opacity-40 cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => dispatch(togglePlayPause())}
            disabled={kmeans.isConverged}
            title="Play/Pause [Space]"
            className={`
              flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-xs shadow-soft transition-all cursor-pointer
              ${
                kmeans.isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-midnight'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }
            `}
          >
            {kmeans.isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => dispatch(stepForward())}
            disabled={kmeans.isConverged}
            title="Step Forward [Right Arrow]"
            className="p-2.5 rounded-xl border border-mountainside bg-mountainside/40 text-slopes hover:text-arctic hover:bg-mountainside transition-all disabled:opacity-40 cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right Side: Speed Selector */}
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-apres font-mono">Speed:</span>
          {[0.5, 1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => dispatch(setAnimationSpeed(spd))}
              className={`
                px-2 py-1 rounded-lg text-xs font-mono font-bold border transition-all cursor-pointer
                ${
                  kmeans.animationSpeed === spd
                    ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                    : 'border-mountainside bg-mountainside/40 text-apres hover:text-arctic'
                }
              `}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default TimelineControls;
