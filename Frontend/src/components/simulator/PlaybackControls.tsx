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
    <section className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-4">
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-3">Playback Controls</h3>
      <div className="grid grid-cols-5 gap-2">
        <motion.button
          variants={buttonVariant}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
          type="button"
          onClick={onPlayPause}
          className="rounded-lg bg-primary-600 hover:bg-primary-700 text-white p-2 flex items-center justify-center"
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
          className="rounded-lg bg-secondary-200 dark:bg-secondary-700 p-2 flex items-center justify-center disabled:opacity-50"
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
          className="rounded-lg bg-secondary-200 dark:bg-secondary-700 p-2 flex items-center justify-center"
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
          className="rounded-lg bg-secondary-200 dark:bg-secondary-700 p-2 flex items-center justify-center"
        >
          <Shuffle className="w-4 h-4" />
        </motion.button>
        <select
          value={speed}
          onChange={(event) => onSpeedChange(Number(event.target.value))}
          className="rounded-lg border border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-900 px-2 text-sm"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>
    </section>
  );
};

export default PlaybackControls;
