import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setCurrentEpoch,
  setIsPlaying,
  setPlaybackSpeed,
  resetSimulation,
} from '../logisticRegressionSlice';
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
} from 'lucide-react';

export const TimelineControls: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trajectory, currentEpoch, isPlaying, playbackSpeed } = useAppSelector(
    (state) => state.logisticRegression
  );

  const maxEpoch = trajectory.length > 0 ? trajectory.length - 1 : 0;

  // Auto-play animation timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        dispatch((dispatch, getState) => {
          const state = getState().logisticRegression;
          const max = state.trajectory.length > 0 ? state.trajectory.length - 1 : 0;
          if (state.currentEpoch < max) {
            dispatch(setCurrentEpoch(state.currentEpoch + 1));
          } else {
            dispatch(setIsPlaying(false));
          }
        });
      }, 250 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, dispatch]);

  const handlePlayToggle = () => {
    if (!isPlaying) {
      // If we are at the end of the simulation, restart from epoch 0
      if (currentEpoch >= maxEpoch) {
        dispatch(setCurrentEpoch(0));
      }
      dispatch(setIsPlaying(true));
    } else {
      dispatch(setIsPlaying(false));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-midnight/90 backdrop-blur-md rounded-2xl border border-apres/30 font-mono text-xs text-arctic shadow-hard">
      {/* Playback Controls Group */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            dispatch(resetSimulation());
            dispatch(setCurrentEpoch(0));
          }}
          className="p-2 rounded-xl bg-mountainside text-slopes hover:text-arctic hover:bg-mountainside/80 transition-all cursor-pointer"
          title="Reset Simulation (Epoch 0)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          disabled={currentEpoch <= 0}
          onClick={() => dispatch(setCurrentEpoch(currentEpoch - 1))}
          className="p-2 rounded-xl bg-mountainside text-slopes hover:text-arctic hover:bg-mountainside/80 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Step Back 1 Epoch"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Main Play / Pause Action Button */}
        <button
          onClick={handlePlayToggle}
          className={`px-4 py-2 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-400 text-midnight shadow-amber-500/30 animate-pulse'
              : 'bg-emerald-500 hover:bg-emerald-400 text-midnight shadow-emerald-500/30'
          }`}
          title={isPlaying ? 'Pause Simulation' : 'Play Training Loop'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{currentEpoch >= maxEpoch ? 'Replay' : 'Play'}</span>
            </>
          )}
        </button>

        <button
          disabled={currentEpoch >= maxEpoch}
          onClick={() => dispatch(setCurrentEpoch(currentEpoch + 1))}
          className="p-2 rounded-xl bg-mountainside text-slopes hover:text-arctic hover:bg-mountainside/80 disabled:opacity-40 transition-all cursor-pointer disabled:cursor-not-allowed"
          title="Step Forward 1 Epoch"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Epoch Scrubbing Slider */}
      <div className="flex-1 w-full flex items-center gap-3 px-2">
        <span className="text-apres text-[11px] whitespace-nowrap">
          Epoch: <span className="text-cyan-400 font-bold">{currentEpoch}</span> / {maxEpoch}
        </span>
        <input
          type="range"
          min="0"
          max={maxEpoch}
          value={currentEpoch}
          onChange={(e) => dispatch(setCurrentEpoch(parseInt(e.target.value, 10)))}
          className="w-full h-2 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-apres">Speed:</span>
        {[0.5, 1, 2, 4].map((speed) => (
          <button
            key={speed}
            onClick={() => dispatch(setPlaybackSpeed(speed))}
            className={`px-2 py-1 text-[10px] rounded-lg font-bold transition-all cursor-pointer ${
              playbackSpeed === speed
                ? 'bg-cyan-500 text-midnight font-bold shadow-md shadow-cyan-500/20'
                : 'bg-mountainside/50 text-slopes hover:text-arctic'
            }`}
          >
            {speed}x
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimelineControls;
