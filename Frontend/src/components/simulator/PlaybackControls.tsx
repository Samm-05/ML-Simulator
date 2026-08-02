import React from 'react';
import { motion } from 'framer-motion';
import { Pause, Play, RotateCcw, Shuffle, SkipForward } from 'lucide-react';
import { buttonVariant } from '../../animations/framerVariants';

interface PlaybackControlsProps {
  isPlaying: boolean;
  canStep: boolean;
  speed: number;
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onRandomize: () => void;
  onSpeedChange: (speed: number) => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  canStep,
  speed,
  onPlayPause,
  onReset,
  onStepForward,
  onRandomize,
  onSpeedChange,
}) => {
  return (
    <section className="rounded-2xl border border-mountainside bg-secondary-900/90 backdrop-blur-xl p-4 shadow-soft">
      <h3 className="text-sm font-bold text-arctic uppercase tracking-wider mb-3">Playback Controls</h3>
      <div className="grid grid-cols-5 gap-2">
        <motion.button
          variants={buttonVariant}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={onPlayPause}
          className="rounded-xl bg-arctic text-midnight hover:bg-slopes p-2.5 flex items-center justify-center transition-colors shadow-soft"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </motion.button>
        <motion.button
          variants={buttonVariant}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={onStepForward}
          disabled={!canStep}
          className="rounded-xl bg-mountainside text-slopes hover:text-arctic border border-apres/40 p-2.5 flex items-center justify-center disabled:opacity-40 transition-colors"
        >
          <SkipForward className="w-4 h-4" />
        </motion.button>
        <motion.button
          variants={buttonVariant}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={onReset}
          className="rounded-xl bg-mountainside text-slopes hover:text-arctic border border-apres/40 p-2.5 flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </motion.button>
        <motion.button
          variants={buttonVariant}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={onRandomize}
          className="rounded-xl bg-mountainside text-slopes hover:text-arctic border border-apres/40 p-2.5 flex items-center justify-center transition-colors"
        >
          <Shuffle className="w-4 h-4" />
        </motion.button>
        <select
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="rounded-xl border border-mountainside bg-mountainside/50 text-arctic font-mono px-2 text-xs focus:outline-none"
        >
          <option value={0.5} className="bg-secondary-900">0.5x</option>
          <option value={1} className="bg-secondary-900">1x</option>
          <option value={1.5} className="bg-secondary-900">1.5x</option>
          <option value={2} className="bg-secondary-900">2x</option>
        </select>
      </div>
    </section>
  );
};

export default PlaybackControls;
